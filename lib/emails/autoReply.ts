// The "thank you" email sent to everyone who uses the contact form.
// Edit the wording here; the design lives in layout.ts. Keep it free of anything the visitor typed
// except their first name and the service they picked, so nobody can use the form to send their
// own text to others.

import { serviceOptions } from "@/lib/data";
import { C, SITE_URL, brandedEmail, firstName, textFooter } from "./layout";

// Only mention the service if it's one of ours (not free text) and not "Not sure yet".
function serviceName(service: string) {
  if (!serviceOptions.includes(service) || service === "Not sure yet") return "";
  // "Cybersecurity" -> "cybersecurity", but keep acronyms like "UI/UX design" as they are.
  return service.replace(/^([A-Z])(?![A-Z/])/, (c) => c.toLowerCase());
}

export function autoReply(lead: { name: string; service: string }) {
  const name = firstName(lead.name);
  const service = serviceName(lead.service);
  const subject = "Thanks for contacting Deventeck";
  const info = "If there's anything you'd like to add in the meantime, such as links, files or timelines, just reply to this email.";

  const text = `Hi ${name},

Thank you for reaching out to Deventeck. We've received your message${service ? ` about ${service}` : ""}, and a member of our team will get back to you shortly.

${info}

Visit our website: ${SITE_URL}

${textFooter}`;

  const html = brandedEmail({
    subject,
    preheader: "We've received your message and will get back to you shortly.",
    name,
    messageHtml: `Thank you for reaching out to Deventeck. We've received your message${
      service ? ` about <strong style="color:${C.accent};font-weight:700;">${service}</strong>` : ""
    }, and a member of our team will get back to you shortly.`,
    infoText: info,
  });

  return { subject, text, html };
}