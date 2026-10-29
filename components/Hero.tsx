"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { services, type ServiceKey } from "@/lib/data";

// Three.js runs only in the browser.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="scene-box" aria-hidden="true" />,
});

const defaultNote = "Drag to rotate. Pick a service to see it in orbit.";

export default function Hero() {
  const [active, setActive] = useState<ServiceKey | null>(null);
  const current = services.find((s) => s.key === active);

  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="intro">
          <h1>Intelligent, secure and playable software.</h1>
          <p className="hero-lede">
            Deventeck is a studio for artificial intelligence, cybersecurity, game development, custom software and
            UI/UX design. One team takes your idea from first sketch to launch.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#contact">
              Start a project
            </a>
            <a className="btn btn-ghost" href="#services">
              Explore services
            </a>
          </div>
        </div>
        <div className="visual">
          <HeroScene active={active} />
          <ul className="legend" aria-label="Highlight a service in the 3D model">
            {services.map((s) => (
              <li key={s.key}>
                <button
                  type="button"
                  aria-pressed={active === s.key}
                  onClick={() => setActive((a) => (a === s.key ? null : s.key))}
                >
                  <span className="dot" />
                  {s.short}
                </button>
              </li>
            ))}
          </ul>
          <p className="legend-note" aria-live="polite">
            {current ? current.orbitNote : defaultNote}
          </p>
        </div>
      </div>
    </section>
  );
}
