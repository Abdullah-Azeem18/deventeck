"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

// Section links scroll on the homepage; Careers is its own page.
const links = [
  { id: "services", label: "Services", href: "/#services" },
  { id: "process", label: "Process", href: "/#process" },
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "careers", label: "Careers", href: "/careers" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

const icon = {
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

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [dark, setDark] = useState(true);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLLIElement>(null);

  // The header always stays on screen; once the page scrolls, the pill gets a little more solid.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section currently in the middle of the screen.
  useEffect(() => {
    if (pathname === "/careers") {
      setActive("careers");
      return;
    }
    const sections = links
      .filter((l) => l.href.startsWith("/#"))
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    // Above the first section (the hero), nothing is highlighted.
    const onTop = () => {
      if (window.scrollY < sections[0].offsetTop - window.innerHeight * 0.5) setActive(null);
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [pathname]);

  // Slide the highlight pill under the active link.
  useLayoutEffect(() => {
    const place = () => {
      const list = listRef.current;
      const pill = indicatorRef.current;
      if (!list || !pill) return;
      const link = active ? list.querySelector<HTMLElement>(`a[data-id="${active}"]`) : null;
      if (!link) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.width = `${link.offsetWidth}px`;
      // Measure from the list item: the link itself sits at 0 inside its own <li>.
      pill.style.transform = `translateX(${(link.parentElement as HTMLElement).offsetLeft}px)`;
    };
    place();
    // Re-measure whenever the links change size (window resize, or the web font finishing loading).
    const ro = new ResizeObserver(place);
    if (listRef.current) ro.observe(listRef.current);
    listRef.current?.querySelectorAll("a").forEach((a) => ro.observe(a));
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [active]);

  // Theme icon follows the current theme.
  useEffect(() => {
    setDark(getComputedStyle(document.documentElement).colorScheme.includes("dark"));
  }, []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setDark(!dark);
    try {
      localStorage.setItem("dvt-theme", next);
    } catch {}
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="nav-pill">
        <Logo />

        <nav className="nav-main" aria-label="Main">
          <ul className="nav-links" ref={listRef}>
            <li className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.href} data-id={l.id} className={active === l.id ? "on" : undefined} aria-current={active === l.id ? (l.id === "careers" ? "page" : "true") : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" type="button" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={toggleTheme}>
            {dark ? (
              <svg {...icon}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg {...icon}>
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
          <a className="btn btn-primary btn-sm nav-cta" href="/#contact">
            Start a project
            <svg {...icon} width={16} height={16} strokeWidth={2.2}>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg {...icon}>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg {...icon}>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`mobile-menu${open ? " open" : ""}`} id="mobileMenu" onClick={() => setOpen(false)}>
        <ul>
          {links.map((l) => (
            <li key={l.id}>
              <a href={l.href} className={active === l.id ? "on" : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn-primary" href="/#contact">
          Start a project
        </a>
      </div>
    </header>
  );
}