"use client";

// Picks the role in the application form and scrolls to it.
export default function ApplyButton({ role }: { role: string }) {
  return (
    <a
      className="btn btn-primary btn-sm"
      href="#apply"
      onClick={() => window.dispatchEvent(new CustomEvent("dvt-apply", { detail: role }))}
    >
      Apply for this role
    </a>
  );
}