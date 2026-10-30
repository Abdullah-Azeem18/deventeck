"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { budgetOptions, contact, serviceOptions } from "@/lib/data";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 2000;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const socialIcons: Record<keyof typeof contact.socials, { label: string; svg: ReactNode }> = {
  linkedin: {
    label: "LinkedIn",
    svg: (
      <svg {...icon} width={18} height={18}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    svg: (
      <svg {...icon} width={18} height={18}>
        <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 1.2 4.9 1.5 4.9 1.5a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3.4 8.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    svg: (
      <svg {...icon} width={18} height={18}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5v.01" />
      </svg>
    ),
  },
  x: {
    label: "X",
    svg: (
      <svg {...icon} width={16} height={16}>
        <path d="M4 4l16 16M20 4 4 20" />
      </svg>
    ),
  },
};

// Only real links are shown: entries still set to "#" are skipped.
const socials = (Object.keys(contact.socials) as (keyof typeof contact.socials)[])
  .filter((k) => contact.socials[k] && contact.socials[k] !== "#")
  .map((k) => ({ key: k, href: contact.socials[k], ...socialIcons[k] }));
const hasPhone = !contact.phoneDisplay.startsWith("[");

const nextSteps = [
  { title: "We read your brief", text: "A real person reviews every message." },
  { title: "A short call", text: "We ask questions and suggest an approach." },
  { title: "Clear proposal", text: "Scope, timeline and cost, in writing." },
];

function validate(name: string, email: string, message: string): Errors {
  const e: Errors = {};
  if (!name) e.name = "Please tell us your name.";
  if (!email) e.email = "We need your email to reply.";
  else if (!emailPattern.test(email)) e.email = "That email doesn't look right, e.g. name@company.com.";
  if (!message) e.message = "A few lines about your project helps us reply properly.";
  return e;
}

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "sent" | "saved">(null);
  const [length, setLength] = useState(0);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const message = (data.message || "").trim();

    const found = validate(name, email, message);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("");
      const first = (["name", "email", "message"] as const).find((k) => found[k]);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, name, email, message }),
      });
      if (res.ok) {
        const result = await res.json().catch(() => ({}));
        form.reset();
        setLength(0);
        setSent(result.delivery === "saved" ? "saved" : "sent");
        return;
      }
      if (res.status === 501) {
        // Email service not configured yet: fall back to the visitor's email app.
        const body = `Name: ${name}\nEmail: ${email}\nService: ${data.service || ""}\nBudget: ${data.budget || ""}\n\n${message}`;
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
          `New project: ${data.service || "General"}`
        )}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app with your message ready to send.");
        return;
      }
      if (res.status === 429) {
        setStatus(`You've sent several messages in a short time. Please wait a few minutes, or email us at ${contact.email}.`);
        return;
      }
      setStatus(`Your message didn't send. Try again, or email us at ${contact.email}.`);
    } catch {
      setStatus(`Your message didn't send. Check your connection, or email us at ${contact.email}.`);
    } finally {
      setSending(false);
    }
  }

  // Clear a field's error as soon as the visitor starts fixing it.
  const clear = (key: keyof Errors) => () => errors[key] && setErrors((e) => ({ ...e, [key]: undefined }));

  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-panel">
          <div className="contact-info">
            <p className="eyebrow">Contact</p>
            <h2>Let&apos;s build what&apos;s next.</h2>
            <p className="contact-lede">
              Tell us about your idea. We&apos;ll get back to you shortly with next steps and a clear estimate.
            </p>

            <div className="contact-methods">
              <div className="method">
                <span className="method-icon">
                  <svg {...icon}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <div className="method-body">
                  <span className="method-label">Email</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <button type="button" className="method-action" onClick={copyEmail} aria-label="Copy email address">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {hasPhone && (
                <div className="method">
                  <span className="method-icon">
                    <svg {...icon}>
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                    </svg>
                  </span>
                  <div className="method-body">
                    <span className="method-label">Phone</span>
                    <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
                  </div>
                  <a className="method-action" href={contact.phoneHref}>
                    Call
                  </a>
                </div>
              )}
            </div>

            <ol className="next-steps" aria-label="What happens after you write to us">
              {nextSteps.map((s, i) => (
                <li key={s.title}>
                  <span className="next-num">{i + 1}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <span>{s.text}</span>
                  </div>
                </li>
              ))}
            </ol>

            {socials.length > 0 && (
              <ul className="socials" aria-label="Deventeck on social media">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a className="icon-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Deventeck on ${s.label}`}>
                      {s.svg}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div className="form-success" role="status">
                <span className="success-mark" aria-hidden="true">
                  <svg {...icon} width={30} height={30} strokeWidth={2.4}>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <h3>{sent === "sent" ? "Message sent." : "Message received."}</h3>
                <p>
                  Thanks for reaching out. We&apos;ll get back to you shortly. A confirmation is on its way to your inbox,
                  so check your spam folder if you don&apos;t see it.
                </p>
                <button className="btn btn-ghost" type="button" onClick={() => setSent(null)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <fieldset className="choice">
                  <legend>What do you need?</legend>
                  <div className="pills">
                    {serviceOptions.map((o) => (
                      <label key={o} className="pill">
                        <input type="radio" name="service" value={o} />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="choice">
                  <legend>
                    Budget <span className="optional">(optional)</span>
                  </legend>
                  <div className="pills">
                    {budgetOptions.map((o) => (
                      <label key={o} className="pill">
                        <input type="radio" name="budget" value={o} />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="row">
                  <div className={`field${errors.name ? " has-error" : ""}`}>
                    <label htmlFor="f-name">Your name</label>
                    <input
                      id="f-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Ali Khan"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "e-name" : undefined}
                      onInput={clear("name")}
                    />
                    {errors.name && <span className="field-error" id="e-name">{errors.name}</span>}
                  </div>
                  <div className={`field${errors.email ? " has-error" : ""}`}>
                    <label htmlFor="f-email">Email</label>
                    <input
                      id="f-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "e-email" : undefined}
                      onInput={clear("email")}
                    />
                    {errors.email && <span className="field-error" id="e-email">{errors.email}</span>}
                  </div>
                </div>

                <div className={`field${errors.message ? " has-error" : ""}`}>
                  <label htmlFor="f-msg">Tell us about your project</label>
                  <textarea
                    id="f-msg"
                    name="message"
                    maxLength={MESSAGE_MAX}
                    placeholder="What are you building, who is it for, and when do you need it?"
                    aria-invalid={!!errors.message}
                    aria-describedby={`c-msg${errors.message ? " e-msg" : ""}`}
                    onInput={(e) => {
                      setLength(e.currentTarget.value.length);
                      clear("message")();
                    }}
                  />
                  <div className="field-foot">
                    {errors.message ? (
                      <span className="field-error" id="e-msg">{errors.message}</span>
                    ) : (
                      <span />
                    )}
                    <span className="counter" id="c-msg">
                      {length}/{MESSAGE_MAX}
                    </span>
                  </div>
                </div>

                <div className="hp" aria-hidden="true">
                  <label htmlFor="f-company-website">Leave this field empty</label>
                  <input id="f-company-website" name="company_website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary btn-send" type="submit" disabled={sending}>
                    {sending && <span className="spinner" aria-hidden="true" />}
                    {sending ? "Sending…" : "Send message"}
                    {!sending && (
                      <svg {...icon} width={18} height={18}>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    )}
                  </button>
                  <p className="form-note">We only use your details to reply to you.</p>
                </div>
                <p className="form-status" role="status">
                  {status}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}