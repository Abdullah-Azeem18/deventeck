"use client";

import { useState, type FormEvent } from "react";
import { budgetOptions, contact, serviceOptions } from "@/lib/data";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const message = (data.message || "").trim();

    if (!name || !email || !message) {
      setStatus("Add your name, email and a short project description to send.");
      return;
    }
    if (!emailPattern.test(email)) {
      setStatus("Enter a valid email address, like name@company.com.");
      return;
    }

    setSending(true);
    setStatus("Sending your message…");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, name, email, message }),
      });
      if (res.ok) {
        form.reset();
        setStatus("Message sent. We'll reply within one business day.");
        return;
      }
      if (res.status === 501) {
        // Email service not configured yet: fall back to the visitor's email app.
        const body = `Name: ${name}\nEmail: ${email}\nService: ${data.service}\nBudget: ${data.budget}\n\n${message}`;
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
          `New project: ${data.service}`
        )}&body=${encodeURIComponent(body)}`;
        setStatus("Opening your email app with your message ready to send.");
        return;
      }
      setStatus(`Your message didn't send. Try again, or email us at ${contact.email}.`);
    } catch {
      setStatus(`Your message didn't send. Check your connection, or email us at ${contact.email}.`);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section" id="contact">
      <div className="wrap contact">
        <div className="contact-copy">
          <h2>Let&apos;s build what&apos;s next.</h2>
          <p>Tell us about your idea. We reply within one business day with next steps and a clear estimate.</p>
          <ul className="contact-list">
            <li>
              <a href={`mailto:${contact.email}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phoneHref}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                </svg>
                {contact.phoneDisplay}
              </a>
            </li>
          </ul>
          <div className="socials">
            <a className="icon-btn" href={contact.socials.linkedin} aria-label="Deventeck on LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
              </svg>
            </a>
            <a className="icon-btn" href={contact.socials.github} aria-label="Deventeck on GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 1.2 4.9 1.5 4.9 1.5a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3.4 8.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21" />
              </svg>
            </a>
            <a className="icon-btn" href={contact.socials.instagram} aria-label="Deventeck on Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <path d="M17.5 6.5v.01" />
              </svg>
            </a>
            <a className="icon-btn" href={contact.socials.x} aria-label="Deventeck on X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4l16 16M20 4 4 20" />
              </svg>
            </a>
          </div>
        </div>
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="row">
            <div className="field">
              <label htmlFor="f-name">Your name</label>
              <input id="f-name" name="name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="f-email">Email</label>
              <input id="f-email" name="email" type="email" autoComplete="email" required />
            </div>
          </div>
          <div className="row">
            <div className="field">
              <label htmlFor="f-service">Service</label>
              <select id="f-service" name="service" defaultValue={serviceOptions[0]}>
                {serviceOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-budget">Budget</label>
              <select id="f-budget" name="budget" defaultValue={budgetOptions[0]}>
                {budgetOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-msg">Tell us about your project</label>
            <textarea id="f-msg" name="message" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
          <p className="form-status" role="status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}
