import type { ReactNode } from "react";
import { services, type ServiceKey } from "@/lib/data";
import ScrollReveal from "./ScrollReveal";

const common = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<ServiceKey, ReactNode> = {
  ai: (
    <svg {...common}>
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  cyber: (
    <svg {...common}>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  games: (
    <svg {...common}>
      <path d="M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7.2 2.4L14 14h-4l-.8 1.4A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4Z" />
      <path d="M7 11v3M5.5 12.5h3" />
      <circle cx="16.5" cy="11.5" r=".6" fill="currentColor" />
      <circle cx="18" cy="13.5" r=".6" fill="currentColor" />
    </svg>
  ),
  dev: (
    <svg {...common}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  ),
  ux: (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  ),
};

export default function Services() {
  return (
    <section className="section" id="services">
      <ScrollReveal className="wrap">
        <div className="section-head" data-reveal>
          <h2>Five disciplines, one team.</h2>
          <p>
            Most products need more than one skill. We bring AI, security, games, engineering and design under one roof,
            so nothing gets lost between vendors.
          </p>
        </div>
        <ul className="services">
          {services.map((s) => (
            <li className="service" key={s.key} data-reveal>
              <div className="service-icon" aria-hidden="true">
                {icons[s.key]}
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <ul className="tags">
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}