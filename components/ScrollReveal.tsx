"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Fades and slides in every element marked with data-reveal inside it, every time it scrolls
// into view, scrolling down or up. When an element leaves the screen it resets, so it animates
// again next time. Items are hidden only after this script runs, so content is never lost if
// JavaScript fails.
export default function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            // Items that appear together come in one after another.
            el.style.transitionDelay = `${order++ * 90}ms`;
            el.classList.add("revealed");
          } else {
            // Left the screen: reset, and remember which side it went out of,
            // so it slides in from that side when it comes back.
            el.style.transitionDelay = "0ms";
            el.classList.remove("revealed");
            el.dataset.from = e.boundingClientRect.top < 0 ? "top" : "bottom";
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}