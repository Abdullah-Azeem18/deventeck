"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Starts tilted (direction -1 = left, 1 = right), slightly lower and smaller,
// and straightens smoothly as it scrolls up to the middle of the screen.
export default function TiltOnScroll({
  direction,
  className,
  children,
}: {
  direction: 1 | -1;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let near = false;
    let current = -1; // smoothed progress; -1 means "not set yet"

    // 0 = tile just entering at the bottom, 1 = tile's middle reaches the middle of the screen
    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = vh / 2 + r.height / 2;
      const p = (vh - r.top) / travel;
      return Math.min(1, Math.max(0, p));
    };

    const apply = (p: number) => {
      const small = window.innerWidth < 640;
      const maxDeg = small ? 5 : 11;
      const eased = 1 - (1 - p) * (1 - p);
      const rest = 1 - eased;
      el.style.transform = `translateY(${rest * (small ? 40 : 90)}px) rotate(${direction * maxDeg * rest}deg) scale(${1 - rest * 0.08})`;
      el.style.opacity = String(0.55 + eased * 0.45);
    };

    const tick = () => {
      const t = target();
      current = current < 0 ? t : current + (t - current) * 0.14;
      apply(current);
      if (Math.abs(t - current) > 0.001 || near) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Only animate while the tile is on or near the screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        start();
      },
      { rootMargin: "20% 0px 20% 0px" }
    );
    io.observe(el);
    window.addEventListener("resize", start);
    apply(target());

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", start);
      el.style.transform = "";
      el.style.opacity = "";
    };
  }, [direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}