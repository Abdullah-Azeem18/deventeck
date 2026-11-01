// The "thank you" email sent to everyone who uses the contact form.
// Edit the wording here. Keep it free of anything the visitor typed except their first name
// and the service they picked, so nobody can use the form to send their own text to others.
//
// Images load from the live site (public/email/), so they appear once the site is deployed.
// Email apps ignore most modern CSS, so this is built with tables and inline styles on purpose.

import { contact, serviceOptions } from "@/lib/data";

const SITE_URL = "https://www.deventeck.site";
const SITE_LABEL = "deventeck.site";
const SUPPORT_EMAIL = contact.email;
const IMG = `${SITE_URL}/email`;

// Colours (from the website theme, solid hex because email apps mishandle transparency)
const C = {
  page: "#080C1F",
  card: "#10173A",
  header: "#0C1230",
  box: "#161F4A",
  line: "#2B3151",
  text: "#EEF1FA",
  muted: "#A3ABCB",
  accent: "#8A97FF",
  accentInk: "#080C1F",
  gold: "#E6C27D",
};
const FONT = "Arial, Helvetica, sans-serif";

// "Ali Khan" -> "Ali". Letters only, so a name can't carry links or other text.
function firstName(name: string) {
  const first = (name.trim().split(/\s+/)[0] || "").replace(/[^\p{L}'-]/gu, "").slice(0, 30);
  return first || "there";
}

// Only mention the service if it's one of ours (not free text) and not "Not sure yet".
function serviceName(service: string) {
  if (!serviceOptions.includes(service) || service === "Not sure yet") return "";
  // "Cybersecurity" -> "cybersecurity", but keep acronyms like "UI/UX design" as they are.
  return service.replace(/^([A-Z])(?![A-Z/])/, (c) => c.toLowerCase());
}

const socialLabels: Record<keyof typeof contact.socials, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
  x: "X",
};

export function autoReply(lead: { name: string; service: string }) {
  const name = firstName(lead.name);
  const service = serviceName(lead.service);
  const subject = "Thanks for contacting Deventeck";

  // Only real social links (not "#") get an icon.
  const socials = (Object.keys(contact.socials) as (keyof typeof contact.socials)[]).filter(
    (k) => contact.socials[k] && contact.socials[k] !== "#"
  );

  const text = `Hi ${name},

Thank you for reaching out to Deventeck. We've received your message${service ? ` about ${service}` : ""}, and a member of our team will get back to you shortly.

If there's anything you'd like to add in the meantime, such as links, files or timelines, just reply to this email.

Visit our website: ${SITE_URL}

Best regards,
The Deventeck team
${SUPPORT_EMAIL} | ${SITE_LABEL}
${socials.map((k) => `${socialLabels[k]}: ${contact.socials[k]}`).join("\n")}

You're receiving this because you used the contact form on ${SITE_LABEL}. If that wasn't you, you can ignore this email.`;

  const serviceHtml = service
    ? ` about <strong style="color:${C.accent};font-weight:700;">${service}</strong>`
    : "";

  const socialHtml = socials.length
    ? `<tr><td align="center" style="padding:20px 0 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        ${socials
          .map(
            (k) => `<td style="padding:0 5px;">
              <a href="${contact.socials[k]}" target="_blank" style="display:block;width:42px;height:42px;border:1px solid ${C.line};border-radius:12px;text-decoration:none;">
                <img src="${IMG}/icon-${k}.png" width="20" height="20" alt="${socialLabels[k]}" style="display:block;margin:11px auto 0;border:0;color:${C.muted};font:12px ${FONT};">
              </a></td>`
          )
          .join("")}
        </tr></table></td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${subject}</title>
<style>
  @media (max-width:620px){
    .card{border-radius:0 !important;}
    .pad{padding-left:24px !important;padding-right:24px !important;}
    .hello{font-size:28px !important;}
    .foot-sep{display:none !important;}
    .foot-cell{display:block !important;padding:6px 0 !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};" bgcolor="${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page};">We've received your message and will get back to you shortly.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}"
        style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:24px;overflow:hidden;">

        <!-- Header with logo -->
        <tr>
          <td class="pad" bgcolor="${C.header}" style="background:${C.header};padding:24px 36px;border-bottom:1px solid ${C.line};">
            <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
              <img src="${IMG}/logo.png" width="208" height="42" alt="Deventeck"
                style="display:block;border:0;width:208px;height:auto;color:${C.text};font:700 24px ${FONT};">
            </a>
          </td>
        </tr>

        <!-- Illustration -->
        <tr>
          <td align="center" style="padding:28px 24px 4px;">
            <img src="${IMG}/envelope.png" width="240" height="150" alt=""
              style="display:block;border:0;width:240px;max-width:100%;height:auto;">
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td align="center" class="pad" style="padding:8px 36px 0;">
            <h1 class="hello" style="margin:0;font:700 34px/1.2 ${FONT};color:${C.text};letter-spacing:-0.5px;">
              Hi <span style="color:${C.accent};">${name},</span>
            </h1>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:14px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="56" height="4" bgcolor="${C.gold}" style="width:56px;height:4px;background:${C.gold};border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>
            </tr></table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td align="center" class="pad" style="padding:22px 48px 0;font:400 17px/1.65 ${FONT};color:${C.text};">
            Thank you for reaching out to Deventeck. We've received your message${serviceHtml},
            and a member of our team will get back to you shortly.
          </td>
        </tr>

        <!-- Info box -->
        <tr>
          <td class="pad" style="padding:26px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.box}"
              style="background:${C.box};border:1px solid ${C.line};border-radius:16px;">
              <tr>
                <td width="64" align="center" valign="middle" style="padding:18px 0 18px 18px;">
                  <img src="${IMG}/icon-info.png" width="28" height="28" alt="" style="display:block;border:0;">
                </td>
                <td valign="middle" style="padding:18px 22px 18px 16px;font:400 15px/1.55 ${FONT};color:${C.text};">
                  If there's anything you'd like to add in the meantime, such as links, files or timelines,
                  just reply to this email.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Button -->
        <tr>
          <td align="center" style="padding:28px 24px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td align="center" bgcolor="${C.accent}" style="background:${C.accent};border-radius:999px;">
                <a href="${SITE_URL}" target="_blank"
                  style="display:inline-block;padding:15px 38px;font:700 17px ${FONT};color:${C.accentInk};text-decoration:none;border-radius:999px;">
                  Visit our website &rarr;
                </a>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Sign-off -->
        <tr>
          <td class="pad" style="padding:30px 36px 0;font:400 16px/1.6 ${FONT};color:${C.text};">
            Best regards,<br><strong style="font-weight:700;">The Deventeck team</strong>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td class="pad" style="padding:26px 36px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-top:1px solid ${C.line};font-size:0;line-height:0;" height="1">&nbsp;</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" class="pad" style="padding:20px 36px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td class="foot-cell" style="padding:0 18px 0 0;">
                <a href="mailto:${SUPPORT_EMAIL}" style="text-decoration:none;color:${C.text};font:400 15px ${FONT};">
                  <img src="${IMG}/icon-mail.png" width="20" height="20" alt="" style="vertical-align:middle;border:0;margin-right:8px;">${SUPPORT_EMAIL}
                </a>
              </td>
              <td class="foot-sep" style="border-left:1px solid ${C.line};font-size:0;" width="1">&nbsp;</td>
              <td class="foot-cell" style="padding:0 0 0 18px;">
                <a href="${SITE_URL}" target="_blank" style="text-decoration:none;color:${C.text};font:400 15px ${FONT};">
                  <img src="${IMG}/icon-link.png" width="20" height="20" alt="" style="vertical-align:middle;border:0;margin-right:8px;">${SITE_LABEL}
                </a>
              </td>
            </tr></table>
          </td>
        </tr>
        ${socialHtml}
        <tr>
          <td align="center" class="pad" style="padding:22px 36px 30px;font:400 12px/1.6 ${FONT};color:${C.muted};">
            You're receiving this because you used the contact form on our website.
            If that wasn't you, you can ignore this email.
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