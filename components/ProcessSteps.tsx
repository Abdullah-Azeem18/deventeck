"use client";

import { useEffect, useRef } from "react";

type Step = { title: string; text: string };

// The steps fill in as you scroll: scrolling down plays them 1 to 5, scrolling back up
// empties them 5 to 1. Tied to scroll position, so they always finish when the list is in view.
export default function ProcessSteps({ steps }: { steps: Step[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(list.children) as HTMLElement[];
    list.classList.add("process-live");

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      // Steps side by side share a row; on small screens rows hold fewer steps (or one).
      const rows = new Map<number, HTMLElement[]>();
      for (const li of items) {
        const top = Math.round(li.getBoundingClientRect().top);
        const row = [...rows.keys()].find((t) => Math.abs(t - top) < 8) ?? top;
        rows.set(row, [...(rows.get(row) || []), li]);
      }

      for (const [top, row] of rows) {
        // 0 when the row is near the bottom of the screen, 1 once it has risen to about 40% from the top.
        // Longer rows get more scroll distance so each step has room to play.
        const start = vh * 0.88;
        const span = Math.min(vh * 0.5, vh * 0.11 * row.length);
        const rowProgress = Math.min(1, Math.max(0, (start - top) / span));
        row.forEach((li, j) => {
          const p = Math.min(1, Math.max(0, rowProgress * row.length - j));
          li.style.setProperty("--fill", p.toFixed(3));
          li.classList.toggle("on", p > 0.02);
        });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      list.classList.remove("process-live");
      items.forEach((li) => {
        li.classList.remove("on");
        li.style.removeProperty("--fill");
      });
    };
  }, []);

  return (
    <ol className="process" ref={listRef}>
      {steps.map((s) => (
        <li key={s.title}>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}