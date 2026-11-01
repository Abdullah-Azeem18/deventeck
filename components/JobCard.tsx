"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import type { Job, JobIcon } from "@/lib/data";

const svg = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons: Record<JobIcon, ReactNode> = {
  // paper plane: sending proposals
  bidding: (
    <svg {...svg}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  ),
  // rising chart: growing sales
  sales: (
    <svg {...svg}>
      <path d="M3 3v18h18M7 15l4-4 3 3 6-6M15 8h5v5" />
    </svg>
  ),
  code: (
    <svg {...svg}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  ),
  design: (
    <svg {...svg}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  ),
  shield: (
    <svg {...svg}>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  ai: (
    <svg {...svg}>
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </svg>
  ),
  briefcase: (
    <svg {...svg}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" />
    </svg>
  ),
};

const small = { ...svg, width: 16, height: 16, strokeWidth: 2 };

// "Posted today", "Posted 3 days ago", "Posted 2 weeks ago"
function postedLabel(date: string) {
  const days = Math.floor((Date.now() - new Date(`${date}T00:00:00`).getTime()) / 86_400_000);
  if (Number.isNaN(days) || days < 0) return { text: "", isNew: false };
  const text =
    days === 0 ? "Posted today" : days === 1 ? "Posted yesterday" : days < 14 ? `Posted ${days} days ago` : days < 60 ? `Posted ${Math.floor(days / 7)} weeks ago` : `Posted ${Math.floor(days / 30)} months ago`;
  return { text, isNew: days <= 14 };
}

export default function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [posted, setPosted] = useState({ text: "", isNew: false });
  const panelId = useId();

  // Dates are worked out in the browser, so "Posted 3 days ago" is always current.
  useEffect(() => {
    if (job.posted) setPosted(postedLabel(job.posted));
  }, [job.posted]);

  // Opening /careers#this-role expands and highlights this card.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === `#${job.slug}`) {
        setOpen(true);
        setHighlight(true);
        setTimeout(() => setHighlight(false), 2400);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [job.slug]);

  async function share() {
    const link = `${window.location.origin}/careers#${job.slug}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: `${job.title} at Deventeck`, url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet closed or clipboard blocked: nothing to do */
    }
  }

  function apply() {
    window.dispatchEvent(new CustomEvent("dvt-apply", { detail: job.title }));
  }

  return (
    <li className={`job${open ? " open" : ""}${highlight ? " highlight" : ""}`} id={job.slug}>
      <div className="job-top">
        <span className="job-icon">{icons[job.icon || "briefcase"]}</span>
        <div className="job-main">
          <div className="job-kicker">
            <span>{job.department}</span>
            {posted.isNew && <span className="job-new">New</span>}
          </div>
          <h3>{job.title}</h3>
          <ul className="job-meta" aria-label="Role details">
            <li>
              <svg {...small}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {job.type}
            </li>
            <li>
              <svg {...small}>
                <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              {job.location}
            </li>
            {posted.text && (
              <li>
                <svg {...small}>
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
                {posted.text}
              </li>
            )}
          </ul>
        </div>
      </div>

      <p className="job-summary">{job.summary}</p>

      <div className="job-actions">
        <a className="btn btn-primary btn-sm" href="#apply" onClick={apply}>
          Apply now
          <svg {...small}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <button className="job-toggle" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
          {open ? "Hide details" : "View details"}
          <svg {...small} className="chev">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button className="job-share" type="button" onClick={share} aria-label={`Copy link to the ${job.title} role`}>
          <svg {...small}>
            {copied ? (
              <path d="M20 6 9 17l-5-5" />
            ) : (
              <>
                <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
                <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
              </>
            )}
          </svg>
          <span>{copied ? "Link copied" : "Copy link"}</span>
        </button>
      </div>

      {/* Details expand smoothly (grid row from 0fr to 1fr). */}
      <div className="job-panel" id={panelId} role="region" aria-label={`${job.title} details`} aria-hidden={!open}>
        <div className="job-panel-inner">
          <div className="job-cols">
            <div>
              <h4>What you&apos;ll do</h4>
              <ul>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>What we&apos;re looking for</h4>
              <ul>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}