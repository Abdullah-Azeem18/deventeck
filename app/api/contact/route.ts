import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const service = clean(body.service, 120);
  const budget = clean(body.budget, 60);
  const message = clean(body.message, 5000);

  if (!name || !email || !message || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Name, a valid email and a message are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 501 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Deventeck <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `New project enquiry: ${service || "General"}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Email could not be sent." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
