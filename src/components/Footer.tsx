import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { scrollToId } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "The craft",
    links: [
      { label: "The illusion", href: "#illusion" },
      { label: "The causal ladder", href: "#ladder" },
      { label: "Five spells", href: "#spells" },
      { label: "Field results", href: "#proof" },
    ],
  },
  {
    title: "Terms",
    links: [
      { label: "Pricing", href: "#pricing" },
      { label: "Book a reading", href: "#reading" },
      { label: "Objections answered", href: "#faq" },
      { label: "Security & SOC 2", href: "mailto:trust@thewizard.ai?subject=SOC%202%20report%20request" },
    ],
  },
  {
    title: "Correspondence",
    links: [
      { label: "hello@thewizard.ai", href: "mailto:hello@thewizard.ai" },
      { label: "research@thewizard.ai", href: "mailto:research@thewizard.ai?subject=Causal%20research" },
      { label: "Press kit", href: "mailto:press@thewizard.ai?subject=Press%20kit" },
      { label: "Careers (3 open)", href: "mailto:jobs@thewizard.ai?subject=Application" },
    ],
  },
];

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        wordRef.current,
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.1,
          },
        },
      );
    },
    { scope: rootRef },
  );

  const go = (href: string) => {
    if (href.startsWith("#")) scrollToId(href, -10);
  };

  return (
    <footer ref={rootRef} className="relative overflow-hidden border-t border-bone/10 bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_120%,rgba(255,107,44,0.12),transparent_65%)]" />

      {/* giant travelling wordmark */}
      <div className="relative overflow-hidden pt-16 pb-2 select-none">
        <div ref={wordRef} className="whitespace-nowrap will-change-transform">
          <span
            className="font-display text-[19vw] leading-[0.8] font-semibold tracking-[-0.05em]"
            style={{ color: "transparent", WebkitTextStroke: "1px rgba(237,230,216,0.16)" }}
          >
            THE WIZARD · CAUSAL AI · THE WIZARD · CAUSAL AI ·
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 border-t border-bone/10 py-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
                <circle
                  cx="32"
                  cy="32"
                  r="21"
                  fill="none"
                  stroke="#C9A227"
                  strokeWidth="1.3"
                  strokeDasharray="4 3"
                  className="rune-ring origin-center"
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
              <div>
                <div className="font-display text-[19px] font-semibold text-bone">
                  The Wizard
                </div>
                <div className="font-mono text-[9px] tracking-[0.3em] text-bone-dim uppercase">
                  causal ai · est. 2026
                </div>
              </div>
            </div>
            <p className="mt-6 max-w-[38ch] text-[14px] leading-relaxed text-bone-dim">
              We build software for the third rung. If a tool cannot tell you what would
              have happened had you acted differently, it is a mirror, not an instrument.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <span className="pulse-dot h-2 w-2 rounded-full bg-chalk" />
              <span className="font-mono text-[10px] tracking-[0.18em] text-bone-dim/70 uppercase">
                all systems causal
              </span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} className="lg:col-span-2">
              <h3 className="font-mono text-[9.5px] tracking-[0.24em] text-ember uppercase">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("#")) {
                          e.preventDefault();
                          go(link.href);
                        }
                      }}
                      className="link-underline text-[13.8px] text-bone-dim transition-colors duration-300 hover:text-bone"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[9.5px] tracking-[0.24em] text-ember uppercase">
              Take the step
            </h3>
            <p className="mt-5 text-[13.8px] leading-relaxed text-bone-dim">
              Forty-five minutes with your own data. One named lever, or nothing owed.
            </p>
            <button
              type="button"
              onClick={() => scrollToId("#reading")}
              className="btn-ember mt-6 w-full justify-center px-5 py-3.5 text-[13.5px]"
              data-magnetic="0.14"
            >
              Book a reading
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-bone/10 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-bone-dim/50 uppercase">
            © 2026 The Wizard Causal Systems · A work of fiction built as a design study
          </p>
          <p className="max-w-[62ch] font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-bone-dim/50 uppercase sm:text-right">
            Animated with GSAP ScrollTrigger · ScrollSmoother · SplitText · ScrambleText ·
            a hand-rolled ScrollyWorld depth engine
          </p>
          <button
            type="button"
            onClick={() => scrollToId("#top")}
            className="group flex shrink-0 items-center gap-2 self-start font-mono text-[9.5px] tracking-[0.2em] text-bone-dim uppercase transition-colors duration-300 hover:text-ember sm:self-auto"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-bone/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-ember/70">
              ↑
            </span>
            ascend
          </button>
        </div>
      </div>
    </footer>
  );
}
