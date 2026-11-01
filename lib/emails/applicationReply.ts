// The "thank you" email sent to everyone who applies on the careers page.
// Same rule as the contact email: only the first name and a role title from our own list.

import { C, SITE_URL, brandedEmail, firstName, textFooter } from "./layout";

export function applicationReply(applicant: { name: string; role: string }) {
  const name = firstName(applicant.name);
  const role = applicant.role; // already checked against the list of open roles
  const subject = "We've received your application";
  const info = "If you'd like to add anything, such as a portfolio link or an updated CV, just reply to this email.";
  const roleText = role === "General application" ? "your application" : `your application for ${role}`;

  const text = `Hi ${name},

Thank you for your interest in joining Deventeck. We've received ${roleText}. Our team reviews every application, and if your profile is a good fit we'll get in touch about next steps.

${info}

Visit our website: ${SITE_URL}

${textFooter}`;

  const html = brandedEmail({
    subject,
    preheader: "Thanks for applying to Deventeck. We'll review your application.",
    name,
    messageHtml: `Thank you for your interest in joining Deventeck. We've received ${
      role === "General application"
        ? "your application"
        : `your application for <strong style="color:${C.accent};font-weight:700;">${role}</strong>`
    }. Our team reviews every application, and if your profile is a good fit we'll get in touch about next steps.`,
    infoText: info,
  });

  return { subject, text, html };
}