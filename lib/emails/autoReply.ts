// The "thank you" email sent to everyone who uses the contact form.
// Edit the wording here. Keep it free of anything the visitor typed except their first name
// and the service they picked, so nobody can use the form to send their own text to others.

import { serviceOptions } from "@/lib/data";

const SITE_URL = "https://deventeck.com";
const SUPPORT_EMAIL = "support@deventeck.com";

// "Ali Khan" -> "Ali". Letters only, so a name can't carry links or other text.
function firstName(name: string) {
  const first = (name.trim().split(/\s+/)[0] || "").replace(/[^\p{L}'-]/gu, "").slice(0, 30);
  return first || "there";
}

// Only mention the service if it's one of ours (not free text) and not "Not sure yet".
function serviceLine(service: string) {
  const known = serviceOptions.includes(service) && service !== "Not sure yet";
  // "Cybersecurity" -> "cybersecurity", but keep acronyms like "UI/UX design" as they are.
  const inSentence = service.replace(/^([A-Z])(?![A-Z/])/, (c) => c.toLowerCase());
  return known ? ` about ${inSentence}` : "";
}

export function autoReply(lead: { name: string; service: string }) {
  const name = firstName(lead.name);
  const about = serviceLine(lead.service);

  const subject = "Thanks for contacting Deventeck";

  const text = `Hi ${name},

Thank you for reaching out to Deventeck. We've received your message${about}, and a member of our team will get back to you shortly.

If there's anything you'd like to add in the meantime, such as links, files or timelines, just reply to this email.

Best regards,
The Deventeck team
${SUPPORT_EMAIL} | ${SITE_URL.replace("https://", "")}

You're receiving this because you used the contact form on ${SITE_URL.replace("https://", "")}. If that wasn't you, you can ignore this email.`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F3F4FA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4FA;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E1E4F0;">
        <tr>
          <td style="background:#0D1330;padding:24px 32px;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px;">Deventeck</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:#0D1330;font-size:16px;line-height:1.6;">
            <p style="margin:0 0 16px;font-size:20px;font-weight:700;">Hi ${name},</p>
            <p style="margin:0 0 16px;">Thank you for reaching out to Deventeck. We've received your message${about}, and a member of our team will get back to you shortly.</p>
            <p style="margin:0 0 24px;">If there's anything you'd like to add in the meantime, such as links, files or timelines, just reply to this email.</p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:999px;background:#3B4BDB;">
                  <a href="${SITE_URL}" style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;">Visit our website</a>
                </td>
              </tr>
            </table>
            <p style="margin:32px 0 0;">Best regards,<br><strong>The Deventeck team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #E1E4F0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:#5A6180;">
            <a href="mailto:${SUPPORT_EMAIL}" style="color:#3B4BDB;text-decoration:none;">${SUPPORT_EMAIL}</a> &nbsp;|&nbsp;
            <a href="${SITE_URL}" style="color:#3B4BDB;text-decoration:none;">${SITE_URL.replace("https://", "")}</a><br>
            You're receiving this because you used the contact form on our website. If that wasn't you, you can ignore this email.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}