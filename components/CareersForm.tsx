"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { contact } from "@/lib/data";

const MAX_MB = 4;
const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email" | "cv", string>>;

function checkFile(f: File | null): string | undefined {
  if (!f) return "Please attach your CV.";
  if (!/\.(pdf|docx?)$/i.test(f.name)) return "Please upload a PDF or Word file.";
  if (f.size > MAX_MB * 1024 * 1024) return `Your CV must be ${MAX_MB} MB or smaller.`;
}

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function CareersForm({ roles }: { roles: string[] }) {
  const [role, setRole] = useState(roles[0]);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // "Apply" buttons on the job cards pick the role here.
  useEffect(() => {
    const onPick = (e: Event) => {
      const r = (e as CustomEvent<string>).detail;
      if (roles.includes(r)) setRole(r);
    };
    window.addEventListener("dvt-apply", onPick);
    return () => window.removeEventListener("dvt-apply", onPick);
  }, [roles]);

  function pick(f: File | null) {
    setFile(f);
    setErrors((e) => ({ ...e, cv: f ? checkFile(f) : undefined }));
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pick(f);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();

    const found: Errors = {};
    if (!name) found.name = "Please tell us your name.";
    if (!email) found.email = "We need your email to reply.";
    else if (!emailPattern.test(email)) found.email = "That email doesn't look right, e.g. name@example.com.";
    const cvError = checkFile(file);
    if (cvError) found.cv = cvError;
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("");
      const first = (["name", "email", "cv"] as const).find((k) => found[k]);
      form.querySelector<HTMLElement>(first === "cv" ? "#a-cv" : `[name="${first}"]`)?.focus();
      return;
    }

    data.set("role", role);
    data.set("cv", file as File);
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/careers", { method: "POST", body: data });
      if (res.ok) {
        form.reset();
        setFile(null);
        setSent(true);
        return;
      }
      const msg = (await res.json().catch(() => ({}))).error;
      if (res.status === 501) {
        setStatus(`Applications aren't open online yet. Please email your CV to ${contact.email}.`);
      } else {
        setStatus(msg || `Your application didn't go through. Try again, or email your CV to ${contact.email}.`);
      }
    } catch {
      setStatus(`Your application didn't go through. Check your connection, or email your CV to ${contact.email}.`);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <span className="success-mark" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h3>Application received.</h3>
        <p>
          Thanks for applying to Deventeck. We review every application and will get in touch if your profile is a good
          fit. A confirmation is on its way to your inbox.
        </p>
        <button className="btn btn-ghost" type="button" onClick={() => setSent(false)}>
          Submit another application
        </button>
      </div>
    );
  }

  const clear = (k: keyof Errors) => () => errors[k] && setErrors((e) => ({ ...e, [k]: undefined }));

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <fieldset className="choice">
        <legend>Position</legend>
        <div className="pills">
          {roles.map((r) => (
            <label key={r} className="pill">
              <input type="radio" name="role-pick" value={r} checked={role === r} onChange={() => setRole(r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="row">
        <div className={`field${errors.name ? " has-error" : ""}`}>
          <label htmlFor="a-name">Full name</label>
          <input id="a-name" name="name" autoComplete="name" placeholder="Ali Khan" aria-invalid={!!errors.name} aria-describedby={errors.name ? "ae-name" : undefined} onInput={clear("name")} />
          {errors.name && <span className="field-error" id="ae-name">{errors.name}</span>}
        </div>
        <div className={`field${errors.email ? " has-error" : ""}`}>
          <label htmlFor="a-email">Email</label>
          <input id="a-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "ae-email" : undefined} onInput={clear("email")} />
          {errors.email && <span className="field-error" id="ae-email">{errors.email}</span>}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="a-phone">
            Phone <span className="optional">(optional)</span>
          </label>
          <input id="a-phone" name="phone" type="tel" autoComplete="tel" placeholder="+92 300 0000000" />
        </div>
        <div className="field">
          <label htmlFor="a-link">
            LinkedIn or portfolio <span className="optional">(optional)</span>
          </label>
          <input id="a-link" name="link" type="url" inputMode="url" placeholder="linkedin.com/in/your-name" />
        </div>
      </div>

      <div className={`field${errors.cv ? " has-error" : ""}`}>
        <span className="field-label" id="a-cv-label">CV / Resume</span>
        <label
          id="a-cv"
          tabIndex={0}
          className={`dropzone${dragging ? " dragging" : ""}${file ? " has-file" : ""}`}
          aria-labelledby="a-cv-label"
          aria-describedby={errors.cv ? "ae-cv" : "a-cv-hint"}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInput.current?.click();
            }
          }}
        >
          <input ref={fileInput} type="file" accept={ACCEPT} className="dropzone-input" tabIndex={-1} onChange={(e) => pick(e.target.files?.[0] || null)} />
          <span className="dropzone-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {file ? <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 14l2 2 4-4" /> : <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />}
            </svg>
          </span>
          {file ? (
            <span className="dropzone-text">
              <strong>{file.name}</strong>
              <span>{kb(file.size)} · click to change</span>
            </span>
          ) : (
            <span className="dropzone-text">
              <strong>Drop your CV here, or click to browse</strong>
              <span id="a-cv-hint">PDF or Word, up to {MAX_MB} MB</span>
            </span>
          )}
        </label>
        {errors.cv && <span className="field-error" id="ae-cv">{errors.cv}</span>}
      </div>

      <div className="field">
        <label htmlFor="a-note">
          Anything you&apos;d like us to know? <span className="optional">(optional)</span>
        </label>
        <textarea id="a-note" name="note" maxLength={3000} placeholder="What kind of work excites you, and when could you start?" />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="a-company-website">Leave this field empty</label>
        <input id="a-company-website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions">
        <button className="btn btn-primary btn-send" type="submit" disabled={sending}>
          {sending && <span className="spinner" aria-hidden="true" />}
          {sending ? "Sending…" : "Submit application"}
        </button>
        <p className="form-note">We only use your details for hiring at Deventeck.</p>
      </div>
      <p className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}