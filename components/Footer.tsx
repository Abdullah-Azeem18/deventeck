import type { ReactNode } from "react";
import Logo from "./Logo";
import { contact, services, techGroups } from "@/lib/data";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const socialIcons: Record<keyof typeof contact.socials, { label: string; icon: ReactNode }> = {
  linkedin: {
    label: "LinkedIn",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    icon: (
      <svg {...iconProps}>
        <path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.4 12.4 0 0 0-6.5 0C6 1.2 4.9 1.5 4.9 1.5a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3.4 8.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V21" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5v.01" />
      </svg>
    ),
  },
  x: {
    label: "X",
    icon: (
      <svg {...iconProps} width={16} height={16}>
        <path d="M4 4l16 16M20 4 4 20" />
      </svg>
    ),
  },
};

// Only real links are shown: entries still set to "#" are skipped.
const socials = (Object.keys(contact.socials) as (keyof typeof contact.socials)[])
  .filter((k) => contact.socials[k] && contact.socials[k] !== "#")
  .map((k) => ({ key: k, href: contact.socials[k], ...socialIcons[k] }));

// The phone is shown only once a real number replaces the [placeholder].
const hasPhone = !contact.phoneDisplay.startsWith("[");

const company = [
  { label: "About us", href: "/#about" },
  { label: "How we work", href: "/#process" },
  { label: "Our work", href: "/#work" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <p className="footer-pitch">Have an idea? Let&apos;s build it together.</p>
          <a className="footer-email" href={`mailto:${contact.email}`}>
            {contact.email}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              AI, cybersecurity, games, software and design under one roof, from the first sketch to launch and
              beyond.
            </p>
            {(socials.length > 0 || hasPhone) && (
              <div className="footer-reach">
                {hasPhone && (
                  <a className="footer-phone" href={contact.phoneHref}>
                    {contact.phoneDisplay}
                  </a>
                )}
                {socials.length > 0 && (
                  <ul className="socials" aria-label="Deventeck on social media">
                    {socials.map((s) => (
                      <li key={s.key}>
                        <a className="icon-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Deventeck on ${s.label}`}>
                          {s.icon}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <nav className="footer-col" aria-label="Services">
            <h2>Services</h2>
            <ul>
              {services.map((s) => (
                <li key={s.key}>
                  <a href="/#services">{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Work by technology">
            <h2>Work</h2>
            <ul>
              {techGroups.map((g) => (
                <li key={g.key}>
                  <a href={`/work/${g.slug}`}>{g.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Company">
            <h2>Company</h2>
            <ul>
              {company.map((c) => (
                <li key={c.href}>
                  <a href={c.href}>{c.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} Deventeck. All rights reserved.</p>
          <a className="footer-top-link" href="#">
            Back to top
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </a>
        </div>
      </div>

      <p className="footer-wordmark" aria-hidden="true">
        Deventeck
      </p>
    </footer>
  );
}