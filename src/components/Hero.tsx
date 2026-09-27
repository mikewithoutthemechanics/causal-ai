import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { CLIENT_MARKS } from "../lib/data";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const STATUS_PHRASES = [
  "why churn spiked in EMEA",
  "what actually drove Q2 LTV",
  "whether the rebrand paid for itself",
  "which lever to pull on Monday",
  "what would have happened if we hadn't",
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const sigilRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorLineRef = useRef<HTMLSpanElement>(null);

  /* ── intro timeline ─────────────────────────────────────────────── */
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reduced motion: skip SplitText entirely and show the composed frame.
      if (reduced) {
        gsap.set(veilRef.current, { autoAlpha: 1, scale: 1.12 });
        gsap.set(fogRef.current, { autoAlpha: 0.5 });
        gsap.set(sigilRef.current, { autoAlpha: 0.55, scale: 1 });
        gsap.set(orbRef.current, { autoAlpha: 1 });
        gsap.set(ghostRef.current, { autoAlpha: 1 });
        gsap.set(cardRef.current, { autoAlpha: 1 });
        gsap.set(
          "[data-hero-eyebrow], [data-hero-sub], [data-hero-cta], [data-hero-foot]",
          { autoAlpha: 1, y: 0, scale: 1 },
        );
        if (statusRef.current) statusRef.current.textContent = STATUS_PHRASES[0];
        return undefined;
      }

      const split = new SplitText(h1Ref.current, {
        type: "lines",
        mask: "lines",
        linesClass: "hero-line",
        autoSplit: true,
        position: "relative",
      });

      const tl = gsap.timeline({ defaults: { ease: "spell" }, delay: 0.15 });

      tl.fromTo(
        veilRef.current,
        { scale: 1.35, autoAlpha: 0 },
        { scale: 1.12, autoAlpha: 1, duration: 2.4 },
        0,
      )
        .fromTo(
          fogRef.current,
          { autoAlpha: 0, xPercent: 8 },
          { autoAlpha: 0.5, xPercent: 0, duration: 2.6 },
          0.1,
        )
        .fromTo(
          sigilRef.current,
          { autoAlpha: 0, scale: 0.7, rotate: -40 },
          { autoAlpha: 0.55, scale: 1, rotate: 0, duration: 2.2 },
          0.2,
        )
        .fromTo(
          orbRef.current,
          { autoAlpha: 0, y: 70, scale: 0.8 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.9 },
          0.45,
        )
        .fromTo(
          ghostRef.current,
          { autoAlpha: 0, yPercent: 30 },
          { autoAlpha: 1, yPercent: 0, duration: 1.6 },
          0.3,
        )
        .fromTo(
          "[data-hero-eyebrow]",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.5,
        )
        .fromTo(
          split.lines,
          { yPercent: 112 },
          { yPercent: 0, duration: 1.35, stagger: 0.11 },
          0.6,
        )
        .fromTo(
          "[data-hero-sub]",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 1.1 },
          1.05,
        )
        .fromTo(
          "[data-hero-cta]",
          { autoAlpha: 0, y: 26, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.09 },
          1.2,
        )
        .fromTo(
          cardRef.current,
          { autoAlpha: 0, y: 46, rotateX: -18, scale: 0.94 },
          { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 1.3 },
          1.35,
        )
        .fromTo(
          "[data-hero-foot]",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06 },
          1.55,
        );

      if (!reduced) {
        // Endless sigil rotation + orb breathing.
        gsap.to(sigilRef.current, {
          rotate: 360,
          duration: 150,
          ease: "none",
          repeat: -1,
        });
        gsap.to(orbRef.current, {
          y: -22,
          duration: 4.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(fogRef.current, {
          xPercent: 5,
          yPercent: -3,
          duration: 22,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(cursorLineRef.current, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          repeatDelay: 0.15,
        });

        // Rotating scramble status line.
        let index = 0;
        const cycle = () => {
          index = (index + 1) % STATUS_PHRASES.length;
          gsap.to(statusRef.current, {
            duration: 0.95,
            ease: "none",
            scrambleText: {
              text: STATUS_PHRASES[index],
              chars: "ΑΒΓΔΕΖΗΘ∆∑∴⌁§01",
              speed: 0.4,
              revealDelay: 0.2,
            },
          });
        };
        const timer = window.setInterval(cycle, 3800);
        gsap.delayedCall(0.1, () => {
          if (statusRef.current) statusRef.current.textContent = STATUS_PHRASES[0];
        });

        /* ── scroll-out: content lifts, planes separate ─────────────── */
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
        });

        scrollTl
          .to(contentRef.current, { yPercent: -14, autoAlpha: 0, ease: "none" }, 0)
          .to(veilRef.current, { yPercent: 22, scale: 1.28, ease: "none" }, 0)
          .to(fogRef.current, { yPercent: -34, autoAlpha: 0, ease: "none" }, 0)
          .to(sigilRef.current, { yPercent: 46, scale: 1.5, autoAlpha: 0, ease: "none" }, 0)
          .to(orbRef.current, { yPercent: -60, scale: 0.7, autoAlpha: 0, ease: "none" }, 0)
          .to(ghostRef.current, { yPercent: 12, letterSpacing: "0.14em", autoAlpha: 0, ease: "none" }, 0)
          .to(cardRef.current, { yPercent: -30, autoAlpha: 0, ease: "none" }, 0);

        return () => {
          window.clearInterval(timer);
          split.revert();
        };
      }

      return undefined;
    },
    { scope: rootRef },
  );

  /* ── pointer parallax on the hero planes ────────────────────────── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers: Array<[HTMLElement | null, number]> = [
      [veilRef.current, 8],
      [fogRef.current, 22],
      [sigilRef.current, 34],
      [orbRef.current, 52],
      [cardRef.current, 16],
    ];
    const quick = layers
      .filter(([el]) => el)
      .map(([el, s]) => ({
        s,
        x: gsap.quickTo(el as HTMLElement, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(el as HTMLElement, "y", { duration: 1.2, ease: "power3.out" }),
      }));

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      quick.forEach(({ s, x, y }) => {
        x(-nx * s);
        y(-ny * s * 0.6);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* ── parallax planes ── */}
      <div ref={veilRef} className="absolute inset-[-8%] opacity-0 will-change-transform">
        <img
          src="/img/veil.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.55) contrast(1.15) brightness(0.5)" }}
        />
      </div>

      <div
        ref={fogRef}
        className="absolute inset-[-15%] opacity-0 mix-blend-screen will-change-transform"
      >
        <img
          src="/img/fog.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ filter: "grayscale(1) brightness(0.42) contrast(1.4)" }}
        />
      </div>

      <div
        ref={sigilRef}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[128vmin] w-[128vmin] -translate-x-1/2 -translate-y-1/2 opacity-0 will-change-transform"
      >
        <img src="/img/sigil.png" alt="" aria-hidden="true" className="h-full w-full object-contain" style={{ opacity: 0.42 }} />
      </div>

      <div
        ref={ghostRef}
        className="pointer-events-none absolute inset-x-0 bottom-[6vh] flex justify-center opacity-0 select-none"
      >
        <span className="outline-type display-xl text-[26vw] leading-none whitespace-nowrap">
          WHY
        </span>
      </div>

      <div
        ref={orbRef}
        className="pointer-events-none absolute top-[12%] right-[-6%] hidden h-[38vw] max-h-[460px] w-[38vw] max-w-[460px] opacity-0 will-change-transform xl:block"
      >
        <img src="/img/orb.png" alt="" aria-hidden="true" className="h-full w-full object-contain" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

      {/* ── content ── */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-5 pt-28 pb-16 sm:px-8"
      >
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-7">
            <div
              data-hero-eyebrow
              className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 opacity-0"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-ember/35 bg-ember/8 px-3 py-1.5">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="font-mono text-[10px] tracking-[0.24em] text-ember-soft uppercase">
                  Grimoire v3.1 · live
                </span>
              </span>
              <span className="eyebrow">Causal inference for operating decisions</span>
            </div>

            <h1
              ref={h1Ref}
              className="display-xl text-[clamp(2.9rem,8.4vw,7.4rem)] text-bone"
            >
              Your model knows
              <br />
              <span className="text-bone-dim">what happened.</span>
              <br />
              The Wizard knows{" "}
              <span className="italic-wonk text-ember">why.</span>
            </h1>

            <p
              data-hero-sub
              className="mt-8 max-w-[54ch] text-[clamp(1rem,1.35vw,1.19rem)] leading-relaxed text-bone-dim opacity-0"
            >
              Correlation is a coin flip in a lab coat. The Wizard reads the causal
              structure buried inside the data you already collect — then hands you a
              ranked list of levers that{" "}
              <span className="text-bone">provably move the number</span>, each with an
              interval you can defend in a board meeting.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#reading"
                data-hero-cta
                data-magnetic="0.2"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("#reading");
                }}
                className="btn-ember px-7 py-4 text-[15px] opacity-0"
              >
                Book a Causal Reading
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#ladder"
                data-hero-cta
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("#ladder");
                }}
                className="btn-ghost px-6 py-4 text-[14px] opacity-0"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                  Descend the ladder
                </span>
                <span className="text-ember">↓</span>
              </a>
            </div>

            <div
              data-hero-foot
              className="mt-11 flex items-center gap-3 font-mono text-[10.5px] tracking-[0.18em] text-bone-dim/80 uppercase opacity-0"
            >
              <span className="text-chalk">NOW READING:</span>
              <span ref={statusRef} className="text-bone normal-case tracking-normal">
                {STATUS_PHRASES[0]}
              </span>
              <span ref={cursorLineRef} className="inline-block h-3 w-[7px] bg-ember align-middle" />
            </div>
          </div>

          {/* ── live causal readout card ── */}
          <div className="lg:col-span-5 xl:col-span-4 xl:col-start-9">
            <div
              ref={cardRef}
              className="card-arcane corner-tick relative overflow-hidden rounded-sm p-6 opacity-0 sm:p-7"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(255,107,44,0.13),transparent_60%)]" />

              <div className="relative flex items-center justify-between border-b border-bone/10 pb-3">
                <span className="font-mono text-[10px] tracking-[0.24em] text-bone-dim uppercase">
                  causal readout
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-chalk">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-chalk" />
                  est. live
                </span>
              </div>

              <pre className="relative mt-4 overflow-x-auto font-mono text-[12.5px] leading-[1.85] text-bone-dim">
                <code>
                  <span className="text-rune">do</span>
                  <span className="text-bone">(</span>
                  <span className="text-chalk">price</span>
                  <span className="text-bone"> −8%</span>
                  <span className="text-bone">)</span>
                  {"\n"}
                  {"  "}→ <span className="text-bone">LTV</span>{" "}
                  <span className="text-ember">+18.4%</span>{" "}
                  <span className="text-bone-dim/70">[14.1, 22.9]</span>
                  {"\n"}
                  {"  "}→ <span className="text-bone">churn</span>{" "}
                  <span className="text-chalk">−0.03</span>{" "}
                  <span className="text-bone-dim/70">n.s.</span>
                  {"\n"}
                  {"\n"}
                  <span className="text-bone-dim/55">backdoors closed</span>{" "}
                  <span className="text-bone">3 / 3</span>
                  {"\n"}
                  <span className="text-bone-dim/55">refutation</span>{" "}
                  <span className="text-chalk">passed ×4</span>
                  {"\n"}
                  <span className="text-bone-dim/55">confidence</span>{" "}
                  <span className="text-ember">0.94</span>
                  <span className="ml-1 inline-block h-3.5 w-[7px] translate-y-[2px] animate-pulse bg-ember" />
                </code>
              </pre>

              <div className="relative mt-5 flex items-center justify-between border-t border-bone/10 pt-3">
                <span className="font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                  northwind · 2.1M rows
                </span>
                <span className="font-mono text-[9.5px] tracking-[0.2em] text-rune uppercase">
                  0.9s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── trust strip ── */}
        <div
          data-hero-foot
          className="mt-14 border-t border-bone/10 pt-6 opacity-0 lg:mt-16"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[34ch] font-mono text-[10px] leading-relaxed tracking-[0.16em] text-bone-dim/70 uppercase">
              Trusted by teams who already got burned by a dashboard
            </p>
            <div className="marquee relative flex-1 overflow-hidden sm:max-w-[560px] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
              <div className="marquee-track gap-9">
                {[...CLIENT_MARKS, ...CLIENT_MARKS].map((mark, i) => (
                  <span
                    key={`${mark}-${i}`}
                    className="font-display text-[15px] font-semibold tracking-[0.12em] whitespace-nowrap text-bone/32 transition-colors duration-300 hover:text-ember"
                  >
                    {mark}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── scroll cue ── */}
      <button
        type="button"
        data-hero-foot
        onClick={() => scrollToId("#illusion")}
        className="group absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
        aria-label="Scroll to the illusion"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-bone-dim uppercase transition-colors group-hover:text-ember">
          scroll
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scrollcue_2.1s_ease-in-out_infinite] bg-ember" />
        </span>
      </button>

    </section>
  );
}
