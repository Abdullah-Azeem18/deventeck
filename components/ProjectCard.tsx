import type { ReactNode } from "react";
import type { Project, ProjectKind } from "@/lib/data";

const common = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<ProjectKind, ReactNode> = {
  web: (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
      <path d="m10 13-2 2 2 2M14 13l2 2-2 2" />
    </svg>
  ),
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
    </svg>
  ),
};

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <li className="project">
      {p.logo && (
        <div className="project-media">
          <img src={p.logo} alt={`${p.name} logo`} loading="lazy" />
        </div>
      )}
      <div className="project-head">
        <span className="project-icon" aria-hidden="true">
          {icons[p.kind]}
        </span>
        <span className="project-cat">{p.category}</span>
        {p.status ? (
          <span className="project-status">
            <span className="status-dot" aria-hidden="true" />
            {p.status}
          </span>
        ) : (
          p.year && <span className="project-year">{p.year}</span>
        )}
      </div>
      <h2 className="project-name">{p.name}</h2>
      <p className="project-summary">{p.summary}</p>
      <ul className="project-points">
        {p.highlights.map((h, j) => (
          <li key={j}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {h}
          </li>
        ))}
      </ul>
      <div className="project-stack">
        <p className="project-stack-label">Tech stack</p>
        <ul className="tags" aria-label={`Tech stack for ${p.name}`}>
          {p.stack.map((t, j) => (
            <li key={j}>{t}</li>
          ))}
        </ul>
      </div>
      {p.link && (
        <a className="project-link" href={p.link} target="_blank" rel="noopener noreferrer">
          View project
        </a>
      )}
    </li>
  );
}