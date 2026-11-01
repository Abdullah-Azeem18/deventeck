import nodemailer from "nodemailer";

// SMTP connection to your own mailbox (see SMTP_* in .env.local), or null if it isn't set up.
export function mailer() {
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
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000, // a little longer than the contact form: emails here carry a CV
  });
  return { transporter, user, to: process.env.CONTACT_TO_EMAIL || user };
}