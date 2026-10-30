import { NextResponse, after } from "next/server";
import nodemailer from "nodemailer";
import { autoReply } from "@/lib/emails/autoReply";

export const runtime = "nodejs";
// Gives the background email enough time to finish after the visitor has their answer.
export const maxDuration = 60;

// How long the visitor waits for the email before we answer anyway.
const EMAIL_WAIT_MS = 20_000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

type Lead = { name: string; email: string; service: string; budget: string; message: string };

// SMTP connection to your own mailbox, or null if it isn't set up.
function mailer() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL from the start; 587 = upgrades to TLS (STARTTLS)
    requireTLS: port !== 465, // on 587, refuse to send the password unless the connection is encrypted
    auth: { user, pass },
    // Don't leave the visitor waiting if the mail server is slow or the login is wrong.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return { transporter, user };
}

// Emails the enquiry to the team inbox. Returns null if SMTP isn't set up.
async function sendEmail(lead: Lead): Promise<boolean | null> {
  const mail = mailer();
  const to = process.env.CONTACT_TO_EMAIL || mail?.user;
  if (!mail || !to) return null;
  const { transporter, user } = mail;

  const started = Date.now();
  try {
    await transporter.sendMail({
      from: `Deventeck website <${user}>`,
      to,
      replyTo: { name: lead.name, address: lead.email },
      subject: `New project enquiry: ${lead.service || "General"} (from ${lead.name})`,
      text: `Name: ${lead.name}\nEmail: ${lead.email}\nService: ${lead.service}\nBudget: ${lead.budget}\n\n${lead.message}`,
    });
    console.log(`Contact email sent in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    return true;
  } catch (err) {
    console.error(`SMTP error after ${((Date.now() - started) / 1000).toFixed(1)}s`, err);
    return false;
  }
}

// Sends the visitor a "thank you for contacting us" email. Runs in the background and never
// affects what the visitor sees.
async function sendAutoReply(lead: Lead) {
  const mail = mailer();
  if (!mail) return;
  const { subject, text, html } = autoReply(lead);
  try {
    await mail.transporter.sendMail({
      from: `Deventeck <${mail.user}>`,
      to: lead.email, // address only: the name field is free text and shouldn't appear in their inbox
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Auto-reply error", err);
  }
}

// Simple limit per visitor: at most 5 messages every 10 minutes from one IP address.
// Stops someone from using the form to flood an inbox with thank-you emails.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60_000;
const recent = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear(); // keep memory bounded
  return hits.length > RATE_LIMIT;
}

// Supabase connection details, or null if it isn't set up.
function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  // New Supabase keys (sb_secret_...) go in the apikey header only; older service_role keys also need Authorization.
  const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" };
  if (!key.startsWith("sb_")) headers.Authorization = `Bearer ${key}`;
  return { endpoint: `${url.replace(/\/$/, "")}/rest/v1/contact_messages`, headers };
}

// Saves the enquiry in the Supabase table contact_messages. Returns null if Supabase isn't set up.
async function saveLead(id: string, lead: Lead, emailSent: boolean): Promise<boolean | null> {
  const db = supabase();
  if (!db) return null;
  try {
    const res = await fetch(db.endpoint, {
      method: "POST",
      headers: db.headers,
      body: JSON.stringify({ id, ...lead, email_sent: emailSent }),
    });
    if (!res.ok) console.error("Supabase error", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("Supabase request failed", err);
    return false;
  }
}

// Marks a saved enquiry as emailed.
async function markEmailed(id: string) {
  const db = supabase();
  if (!db) return;
  try {
    const res = await fetch(`${db.endpoint}?id=eq.${id}`, {
      method: "PATCH",
      headers: db.headers,
      body: JSON.stringify({ email_sent: true }),
    });
    if (!res.ok) console.error("Supabase update error", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("Supabase update failed", err);
  }
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Hidden field that people never see. Bots fill it in, so quietly accept and drop the message.
  if (clean(body.company_website, 200)) return NextResponse.json({ ok: true });

  const lead: Lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    service: clean(body.service, 120),
    budget: clean(body.budget, 60),
    message: clean(body.message, 5000),
  };

  if (!lead.name || !lead.email || !lead.message || !emailPattern.test(lead.email)) {
    return NextResponse.json({ error: "Name, a valid email and a message are required." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const saved = await saveLead(id, lead, false);

  // Saved safely. Wait for the email so the visitor sees the real result, but never longer than
  // EMAIL_WAIT_MS: if the mail server is that slow, the email keeps going in the background.
  if (saved) {
    const emailJob = sendEmail(lead).then(async (ok) => {
      if (ok) await markEmailed(id);
      return ok;
    });
    const result = await Promise.race([
      emailJob,
      new Promise<"pending">((resolve) => setTimeout(() => resolve("pending"), EMAIL_WAIT_MS)),
    ]);
    if (result === "pending") after(() => emailJob);
    after(() => sendAutoReply(lead));
    // "sent" = emailed; "saved" = stored safely, email still going or failed (we see it in Supabase).
    return NextResponse.json({ ok: true, delivery: result === true ? "sent" : "saved" });
  }

  // Not saved (Supabase off or failing): the email is the only copy, so wait for it.
  const emailed = await sendEmail(lead);
  if (emailed) {
    after(() => sendAutoReply(lead));
    return NextResponse.json({ ok: true, delivery: "sent" });
  }

  // Neither service is set up yet: the form falls back to the visitor's email app.
  if (emailed === null && saved === null) {
    return NextResponse.json({ error: "Contact service is not configured." }, { status: 501 });
  }
  return NextResponse.json({ error: "Message could not be delivered." }, { status: 502 });
}