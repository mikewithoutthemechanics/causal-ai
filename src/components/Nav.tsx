import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { NAV_LINKS } from "../lib/data";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("#top");
      }}
      className={`group flex items-center gap-3 ${className}`}
      aria-label="The Wizard — back to top"
    >
      <span className="relative grid h-9 w-9 place-items-center">
        <svg viewBox="0 0 64 64" className="h-9 w-9">
          <circle
            cx="32"
            cy="32"
            r="21"
            fill="none"
            stroke="#C9A227"
            strokeWidth="1.4"
            className="origin-center transition-transform duration-[1200ms] group-hover:rotate-180"
            strokeDasharray="4 3"
          />
          <circle cx="32" cy="20" r="4" fill="#FF6B2C" />
          <circle cx="20.5" cy="41" r="3.6" fill="#6FE3D0" />
          <circle cx="43.5" cy="41" r="3.6" fill="#6FE3D0" />
          <path
            d="M32 24 L22 38 M32 24 L42 38"
            stroke="#EDE6D8"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[17px] font-semibold tracking-[-0.02em] text-bone">
          The Wizard
        </span>
        <span className="block font-mono text-[8.5px] tracking-[0.34em] text-bone-dim uppercase">
          Causal AI
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      barRef.current,
      { yPercent: -120, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "spell", delay: 0.35 },
    );
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    if (open) {
      gsap.set(panelRef.current, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.fromTo(
        panelRef.current.querySelectorAll("[data-menu-item]"),
        { yPercent: 120, autoAlpha: 0, rotate: 3 },
        {
          yPercent: 0,
          autoAlpha: 1,
          rotate: 0,
          duration: 0.8,
          ease: "spell",
          stagger: 0.055,
        },
      );
    } else {
      gsap.to(panelRef.current, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => gsap.set(panelRef.current, { pointerEvents: "none" }),
      });
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToId(href, -10), open ? 220 : 0);
  };

  return (
    <>
      <header
        ref={barRef}
        className="fixed inset-x-0 top-0 z-[9995] transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(8,7,10,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? "rgba(237,230,216,0.1)" : "transparent"}`,
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <Wordmark />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                className="link-underline relative px-3.5 py-2 font-mono text-[11px] tracking-[0.16em] text-bone-dim uppercase transition-colors duration-300 hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#reading"
              onClick={(e) => {
                e.preventDefault();
                go("#reading");
              }}
              className="btn-ember hidden px-5 py-2.5 text-[13px] sm:inline-flex"
              data-magnetic="0.18"
            >
              Book a Causal Reading
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-bone/18 text-bone transition-colors duration-300 hover:border-ember/70 hover:text-ember lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className="absolute left-0 block h-px w-full bg-current transition-all duration-400"
                  style={{
                    top: open ? "6px" : "0px",
                    transform: open ? "rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="absolute top-[6px] left-0 block h-px w-full bg-current transition-all duration-300"
                  style={{ opacity: open ? 0 : 1 }}
                />
                <span
                  className="absolute left-0 block h-px w-full bg-current transition-all duration-400"
                  style={{
                    top: open ? "6px" : "12px",
                    transform: open ? "rotate(-45deg)" : "none",
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        ref={panelRef}
        className="fixed inset-0 z-[9994] flex flex-col justify-center bg-ink/97 px-7 opacity-0 backdrop-blur-xl lg:hidden"
        style={{ pointerEvents: "none" }}
      >
        <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />
        <nav className="relative flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              data-menu-item
              onClick={(e) => {
                e.preventDefault();
                go(link.href);
              }}
              className="group flex items-baseline gap-4 overflow-hidden border-b border-bone/8 py-4"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-ember">
                0{i + 1}
              </span>
              <span className="font-display text-[38px] leading-none font-semibold text-bone transition-colors duration-300 group-hover:text-ember">
                {link.label}
              </span>
            </a>
          ))}
          <a
            href="#reading"
            data-menu-item
            onClick={(e) => {
              e.preventDefault();
              go("#reading");
            }}
            className="btn-ember mt-9 justify-center px-6 py-4 text-[15px]"
          >
            Book a Causal Reading
          </a>
          <p data-menu-item className="mt-6 text-center font-mono text-[10px] tracking-[0.22em] text-bone-dim uppercase">
            45 minutes · your data · one named lever
          </p>
        </nav>
      </div>
    </>
  );
}
