import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { SPELLS } from "../lib/data";
import { scrollToId } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function Spells() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          pin: true,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.4}`,
          scrub: 0.9,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            if (countRef.current) {
              const index = Math.min(
                SPELLS.length,
                Math.max(1, Math.ceil(self.progress * SPELLS.length)),
              );
              countRef.current.textContent = `${String(index).padStart(2, "0")} / ${String(SPELLS.length).padStart(2, "0")}`;
            }
          },
        },
      });

      // Backdrop drifts at half the track speed for depth.
      gsap.to(bgRef.current, {
        xPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Cards settle upright as they arrive.
      gsap.utils.toArray<HTMLElement>("[data-spell-card]", track).forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotateY: i % 2 === 0 ? 7 : -7, y: i % 2 === 0 ? 26 : -26 },
          {
            rotateY: 0,
            y: 0,
            duration: 1,
            ease: "spell",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 88%",
              end: "left 42%",
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          card.querySelectorAll("[data-spell-inner]"),
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.8,
            ease: "spell",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 82%",
              once: true,
            },
          },
        );
      });
    },
    { scope: stageRef },
  );

  return (
    <section id="spells" className="relative bg-ink-2">
      {/* header */}
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 pb-12 sm:px-8 sm:pt-32">
        <div className="flex items-center gap-3" data-reveal="fade">
          <span className="font-mono text-[11px] tracking-[0.3em] text-rune">III</span>
          <span className="h-px w-8 bg-rune/40" />
          <span className="eyebrow">The grimoire · five spells</span>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2
            data-reveal="lines"
            className="display-xl max-w-[15ch] text-[clamp(2.2rem,5.8vw,4.8rem)] text-bone"
          >
            Five spells. No{" "}
            <span className="italic-wonk text-rune">dashboards</span>.
          </h2>
          <p data-reveal="up" className="max-w-[46ch] text-[15.5px] leading-relaxed text-bone-dim">
            Each one answers a question a predictive model structurally cannot. Scroll
            sideways through the grimoire — every spell ships with an effect size, an
            interval, and a plain-English verdict.
          </p>
        </div>
      </div>

      {/* pinned horizontal stage */}
      <div
        ref={stageRef}
        className="relative h-[100svh] overflow-hidden border-y border-bone/8"
      >
        <div ref={bgRef} className="pointer-events-none absolute inset-[-10%] will-change-transform">
          <img
            src="/img/alchemy.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ filter: "grayscale(0.7) brightness(0.24) contrast(1.35)", opacity: 0.55 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-2 via-ink-2/70 to-ink-2" />
        </div>

        <div className="pointer-events-none absolute inset-0 scanlines opacity-25" />

        <div className="relative flex h-full items-center">
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 pl-5 will-change-transform sm:gap-7 sm:pl-8"
            style={{ perspective: "1400px" }}
          >
            {/* intro panel */}
            <div className="flex w-[78vw] max-w-[420px] shrink-0 flex-col justify-center pr-2 sm:w-[46vw]">
              <span className="numeral text-[92px] text-ember/85">V</span>
              <p className="mt-4 font-display text-[26px] leading-[1.15] font-semibold text-bone">
                Everything here runs on causal inference, not pattern matching.
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-bone-dim">
                Connect a warehouse. The Wizard discovers the graph, closes the backdoors,
                and returns levers — ranked by verified impact on the metric you actually
                report to the board.
              </p>
              <div className="mt-7 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-bone-dim/60 uppercase">
                <span className="inline-block h-px w-8 bg-ember" />
                drag / scroll →
              </div>
            </div>

            {SPELLS.map((spell) => (
              <article
                key={spell.id}
                data-spell-card
                className="card-arcane corner-tick group relative flex w-[84vw] max-w-[480px] shrink-0 flex-col justify-between overflow-hidden rounded-sm p-6 sm:w-[52vw] sm:p-8"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(120% 80% at 100% 0%, ${spell.accent}22, transparent 62%)`,
                  }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4" data-spell-inner>
                    <span
                      className="numeral text-[54px] leading-none"
                      style={{ color: spell.accent }}
                    >
                      {spell.numeral}
                    </span>
                    <span className="mt-2 max-w-[16ch] text-right font-mono text-[9.5px] leading-relaxed tracking-[0.16em] text-bone-dim/55 uppercase">
                      spell {spell.numeral} of V
                    </span>
                  </div>

                  <h3
                    className="mt-5 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.05] font-semibold text-bone"
                    data-spell-inner
                  >
                    {spell.name}
                  </h3>
                  <p
                    className="mt-1.5 font-display text-[17px] italic-wonk"
                    style={{ color: spell.accent }}
                    data-spell-inner
                  >
                    “{spell.incantation}”
                  </p>
                  <p className="mt-4 text-[14.4px] leading-relaxed text-bone-dim" data-spell-inner>
                    {spell.body}
                  </p>

                  <ul className="mt-5 space-y-2.5" data-spell-inner>
                    {spell.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45"
                          style={{ backgroundColor: spell.accent }}
                        />
                        <span className="text-[13.4px] leading-relaxed text-bone-dim/90">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="relative mt-7 flex items-end justify-between gap-4 border-t border-bone/10 pt-5"
                  data-spell-inner
                >
                  <div>
                    <div
                      className="numeral text-[40px] leading-none"
                      style={{ color: spell.accent }}
                    >
                      {spell.stat}
                    </div>
                    <div className="mt-1.5 max-w-[22ch] font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-bone-dim/60 uppercase">
                      {spell.statLabel}
                    </div>
                  </div>
                  <span
                    className="mb-1 h-9 w-9 shrink-0 rounded-full border transition-transform duration-500 group-hover:rotate-45"
                    style={{ borderColor: `${spell.accent}66` }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="h-full w-full p-2" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke={spell.accent}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </article>
            ))}

            {/* outro panel */}
            <div className="flex w-[80vw] max-w-[440px] shrink-0 flex-col justify-center pl-2 pr-5 sm:w-[44vw] sm:pr-8">
              <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.12] font-semibold text-bone">
                All five run nightly against your warehouse. Nothing to instrument.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToId("#reading")}
                  className="btn-ember px-6 py-3.5 text-[14px]"
                  data-magnetic="0.18"
                >
                  Book a Causal Reading
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId("#proof")}
                  className="btn-ghost px-6 py-3.5 text-[13px]"
                >
                  <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase">
                    See the proof
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* stage HUD */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-4 px-5 pb-5 sm:px-8">
          <span
            ref={countRef}
            className="font-mono text-[10px] tracking-[0.2em] text-bone-dim/70 tabular-nums"
          >
            01 / 05
          </span>
          <div className="relative h-px flex-1 bg-bone/12">
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-rune via-ember to-chalk"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-bone-dim/70 uppercase">
            grimoire
          </span>
        </div>
      </div>
    </section>
  );
}
