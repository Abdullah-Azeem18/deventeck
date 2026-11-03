import { NextResponse, after } from "next/server";
import { applicationRoles } from "@/lib/data";
import { applicationReply } from "@/lib/emails/applicationReply";
import { mailer } from "@/lib/server/mail";
import { supabase } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const maxDuration = 60;

// Vercel accepts requests up to about 4.5 MB, so CVs are capped at 4 MB.
const MAX_CV_BYTES = 4 * 1024 * 1024;
const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// At most 3 applications every 10 minutes from one IP address.
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > 3;
}

// Checks the file really is what it says (PDF starts with %PDF, Word files with their own signatures).
function looksValid(bytes: Uint8Array, ext: string) {
  const sig = (arr: number[]) => arr.every((b, i) => bytes[i] === b);
  if (ext === "pdf") return sig([0x25, 0x50, 0x44, 0x46]);
  if (ext === "docx") return sig([0x50, 0x4b, 0x03, 0x04]);
  if (ext === "doc") return sig([0xd0, 0xcf, 0x11, 0xe0]);
  return false;
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many applications. Please try again in a few minutes." }, { status: 429 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Hidden field that people never see. Bots fill it in, so quietly accept and drop it.
  if (clean(form.get("company_website"), 200)) return NextResponse.json({ ok: true });

  const app = {
    name: clean(form.get("name"), 120),
    email: clean(form.get("email"), 200),
    phone: clean(form.get("phone"), 40),
    link: clean(form.get("link"), 300),
    role: clean(form.get("role"), 120),
    note: clean(form.get("note"), 3000),
  };
  if (!app.name || !emailPattern.test(app.email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }
  if (!applicationRoles().includes(app.role)) app.role = "General application";
  if (app.link && !/^https?:\/\//i.test(app.link)) app.link = `https://${app.link}`;

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ error: "Please attach your CV." }, { status: 400 });
  }
  const ext = CV_TYPES[cv.type] || cv.name.split(".").pop()?.toLowerCase() || "";
  if (!["pdf", "doc", "docx"].includes(ext)) {
    return NextResponse.json({ error: "Your CV must be a PDF or Word file." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: "Your CV must be 4 MB or smaller." }, { status: 400 });
  }
  const bytes = new Uint8Array(await cv.arrayBuffer());
  if (!looksValid(bytes, ext)) {
    return NextResponse.json({ error: "That file doesn't look like a valid PDF or Word document." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  // Safe file name: "Ali Khan" -> "ali-khan-cv.pdf"
  const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "applicant";
  // A short unique code keeps every file name different, even when two people share a name,
  // so email apps that cache previews by file name always show the right CV.
  const fileName = `${slug}-cv-${id.slice(0, 6)}.${ext}`;
  const path = `${id}/${fileName}`;

  // 1. Store the CV and the application in Supabase.
  let saved = false;
  const db = supabase();
  if (db) {
    try {
      const up = await fetch(`${db.base}/storage/v1/object/resumes/${path}`, {
        method: "POST",
        headers: { ...db.auth, "Content-Type": cv.type || "application/octet-stream", "x-upsert": "false" },
        body: bytes,
      });
      if (!up.ok) console.error("CV upload error", up.status, await up.text().catch(() => ""));
      const row = await fetch(`${db.base}/rest/v1/job_applications`, {
        method: "POST",
        headers: { ...db.auth, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ id, ...app, cv_path: up.ok ? path : null, cv_name: fileName }),
      });
      if (!row.ok) console.error("Application save error", row.status, await row.text().catch(() => ""));
      saved = up.ok && row.ok;
    } catch (err) {
      console.error("Supabase request failed", err);
    }
  }

  // 2. Email the team with the CV attached, and thank the applicant.
  const mail = mailer();
  if (!mail && !saved) {
    return NextResponse.json({ error: "Applications are not set up yet. Please email your CV instead." }, { status: 501 });
  }

  let emailed = false;
  if (mail) {
    try {
      await mail.transporter.sendMail({
        from: `Deventeck careers <${mail.user}>`,
        to: mail.to,
        replyTo: { name: app.name, address: app.email },
        subject: `New application: ${app.role} (${app.name})`,
        text: `Role: ${app.role}\nName: ${app.name}\nEmail: ${app.email}\nPhone: ${app.phone || "-"}\nLink: ${app.link || "-"}\n\n${app.note || "(no note)"}\n\nCV attached${saved ? ", also saved in Supabase (job_applications)." : "."}`,
        attachments: [{ filename: fileName, content: Buffer.from(bytes), contentType: cv.type || undefined }],
      });
      emailed = true;
    } catch (err) {
      console.error("Application email error", err);
    }
  }

  if (!saved && !emailed) {
    return NextResponse.json({ error: "Your application didn't go through. Please try again." }, { status: 502 });
  }

  if (mail) {
    after(async () => {
      const { subject, text, html } = applicationReply({ name: app.name, role: app.role });
      try {
        await mail.transporter.sendMail({ from: `Deventeck <${mail.user}>`, to: app.email, subject, text, html });
      } catch (err) {
        console.error("Application thank-you error", err);
      }
    });
  }
  return NextResponse.json({ ok: true });
}