import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { CASE_STUDIES, STATS } from "../lib/data";
import { SectionLabel } from "./Chrome";
import { scrollToId } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

function StatBlock({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  const prefix = "prefix" in stat ? (stat.prefix as string) : "";
  return (
    <div
      data-reveal="up"
      data-reveal-delay={String(index * 0.08)}
      className="group relative border-t border-bone/12 pt-6 transition-colors duration-500 hover:border-ember/60"
    >
      <span className="absolute -top-px left-0 h-px w-0 bg-ember transition-all duration-700 group-hover:w-full" />
      <div className="flex items-baseline gap-1">
        <span
          data-count={stat.value}
          data-count-decimals={stat.decimals}
          data-count-prefix={prefix}
          data-count-suffix={stat.suffix}
          className="numeral text-[clamp(3rem,7vw,5.6rem)] text-bone tabular-nums"
        >
          {prefix}0{stat.suffix}
        </span>
      </div>
      <p className="mt-3 max-w-[24ch] text-[14.5px] leading-snug text-bone">{stat.label}</p>
      <p className="mt-2 font-mono text-[9.5px] tracking-[0.16em] text-bone-dim/55 uppercase">
        {stat.note}
      </p>
    </div>
  );
}

export default function Proof() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Case-study images get a slow Ken Burns breathe while on screen.
      gsap.utils.toArray<HTMLElement>("[data-case-img]", rootRef.current).forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.02 },
          {
            scale: 1.16,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("[data-parallax-host]") ?? img,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          },
        );
      });

      // Metric badges pop.
      gsap.utils.toArray<HTMLElement>("[data-case-badge]", rootRef.current).forEach((badge) => {
        gsap.fromTo(
          badge,
          { autoAlpha: 0, scale: 0.8, rotate: -6 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 0,
            duration: 1,
            ease: "spell",
            scrollTrigger: { trigger: badge, start: "top 88%", once: true },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="proof" ref={rootRef} className="relative bg-ink">
      {/* ── stats band ── */}
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 sm:pt-32">
        <SectionLabel index="IV" tone="ember">
          Proof, not promises
        </SectionLabel>
        <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2
            data-reveal="lines"
            className="display-xl max-w-[16ch] text-[clamp(2.2rem,5.6vw,4.6rem)] text-bone"
          >
            Numbers that survived an{" "}
            <span className="italic-wonk text-ember">audit</span>.
          </h2>
          <p data-reveal="up" className="max-w-[44ch] text-[15.5px] leading-relaxed text-bone-dim">
            Every figure below was reconciled against a client's own finance or analytics
            reporting after deployment. We publish the ones that held up.
          </p>
        </div>

        <div
          data-reveal-group
          data-reveal-stagger="0.09"
          className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <StatBlock key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>

      {/* ── case studies ── */}
      <div className="mx-auto mt-24 max-w-[1400px] px-5 sm:px-8">
        {CASE_STUDIES.map((study, i) => {
          const flipped = i % 2 === 1;
          return (
            <article
              key={study.id}
              className="grid items-center gap-8 border-t border-bone/10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14"
            >
              <div
                data-parallax-host
                className={`relative overflow-hidden rounded-sm lg:col-span-6 ${flipped ? "lg:order-2 lg:col-start-7" : ""}`}
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-surface sm:aspect-[4/3]">
                  <img
                    data-case-img
                    data-parallax="0.16"
                    src={study.image}
                    alt={`${study.company} case study`}
                    className="absolute inset-[-14%] h-[128%] w-full object-cover will-change-transform"
                    style={{ filter: "grayscale(0.45) contrast(1.15) brightness(0.72)" }}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

                  <div
                    data-case-badge
                    className="absolute bottom-4 left-4 rounded-sm border border-ember/40 bg-ink/88 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="numeral text-[34px] leading-none text-ember">
                      {study.metric}
                    </div>
                    <div className="mt-1 font-mono text-[9px] tracking-[0.18em] text-bone-dim/75 uppercase">
                      {study.metricLabel}
                    </div>
                  </div>

                  <span className="absolute top-4 right-4 font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                    {String(i + 1).padStart(2, "0")} / 0{CASE_STUDIES.length}
                  </span>
                </div>
              </div>

              <div className={`lg:col-span-6 ${flipped ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className="flex flex-wrap items-center gap-3" data-reveal="fade">
                  <span className="font-display text-[15px] font-semibold tracking-[0.06em] text-bone">
                    {study.company}
                  </span>
                  <span className="h-px w-6 bg-bone/25" />
                  <span className="font-mono text-[9.5px] tracking-[0.18em] text-bone-dim/70 uppercase">
                    {study.sector}
                  </span>
                </div>

                <h3
                  data-reveal="up"
                  className="mt-5 max-w-[24ch] font-display text-[clamp(1.5rem,2.9vw,2.3rem)] leading-[1.08] font-semibold text-bone"
                >
                  {study.headline}
                </h3>

                <div className="mt-7 space-y-4" data-reveal="up" data-reveal-delay="0.06">
                  <div className="flex gap-4">
                    <span className="mt-[7px] font-mono text-[9.5px] tracking-[0.18em] text-blood/80 uppercase">
                      before
                    </span>
                    <p className="text-[14.6px] leading-relaxed text-bone-dim">
                      {study.before}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="mt-[7px] font-mono text-[9.5px] tracking-[0.18em] text-chalk uppercase">
                      after
                    </span>
                    <p className="text-[14.6px] leading-relaxed text-bone">{study.after}</p>
                  </div>
                </div>

                <blockquote
                  data-reveal="up"
                  data-reveal-delay="0.1"
                  className="mt-8 border-l-2 border-ember/50 pl-5"
                >
                  <p className="font-display text-[17.5px] leading-[1.45] italic-wonk text-bone/90">
                    “{study.quote}”
                  </p>
                </blockquote>
              </div>
            </article>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-bone/10 py-12">
          <p data-reveal="fade" className="max-w-[42ch] text-[15px] leading-relaxed text-bone-dim">
            Want your own number on this page? It starts with a 45-minute reading of your
            data.
          </p>
          <button
            type="button"
            data-reveal="up"
            data-magnetic="0.16"
            onClick={() => scrollToId("#reading")}
            className="btn-ember px-7 py-4 text-[15px]"
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
          </button>
        </div>
      </div>
    </section>
  );
}
