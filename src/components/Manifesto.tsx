import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

const LEDGER: Array<{ ask: string; before: string; after: string }> = [
  {
    ask: "Which customers will churn?",
    before: "Here are 4,212 risk scores, ranked.",
    after: "Here are the 610 you can still save — and the one thing that saves them.",
  },
  {
    ask: "Did the campaign work?",
    before: "Revenue rose 12% during the flight.",
    after: "3.1 points were the campaign. 8.9 were seasonality you'd have got anyway.",
  },
  {
    ask: "What should we build next?",
    before: "Feature X correlates strongly with retention.",
    after: "Feature X is a symptom. Onboarding speed is the cause. Fix it: +31%.",
  },
  {
    ask: "Why did the metric move?",
    before: "It moved. Here is a chart of it moving.",
    after: "Channel-mix shift, 68% of the delta, named, dated, and sized.",
  },
  {
    ask: "What if we'd priced differently?",
    before: "That is not a question I can parse.",
    after: "LTV would have been 11.2% higher. Interval [7.8, 14.9]. Assumptions listed.",
  },
  {
    ask: "Should we trust this?",
    before: "AUC 0.91. Ship it.",
    after: "Three identifying assumptions. Two held under refutation. One flagged.",
  },
];

export default function Manifesto() {
  const bandRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Word-by-word emergence over the storm.
      if (statementRef.current) {
        const split = new SplitText(statementRef.current, {
          type: "words",
          autoSplit: true,
          position: "relative",
        });

        gsap.fromTo(
          split.words,
          { autoAlpha: 0.06, yPercent: 40, filter: "blur(7px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "spell",
            stagger: 0.038,
            scrollTrigger: { trigger: bandRef.current, start: "top 68%", once: true },
          },
        );

        // The storm itself pushes back as you scroll.
        const storm = bandRef.current?.querySelector<HTMLElement>("[data-storm]");
        if (storm) {
          gsap.to(storm, {
            yPercent: 16,
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: bandRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        gsap.to("[data-band-veil]", {
          autoAlpha: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: bandRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
          },
        });
      }

      // Ledger rows wipe in from the left.
      gsap.utils.toArray<HTMLElement>("[data-ledger-row]", rootRef.current).forEach(
        (row, i) => {
          gsap.fromTo(
            row,
            { autoAlpha: 0, x: -34 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.95,
              ease: "spell",
              delay: (i % 3) * 0.05,
              scrollTrigger: { trigger: row, start: "top 92%", once: true },
            },
          );
          gsap.fromTo(
            row.querySelector("[data-ledger-fill]"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.3,
              ease: "rune",
              scrollTrigger: { trigger: row, start: "top 92%", once: true },
            },
          );
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative bg-ink">
      {/* ── full-bleed parallax statement ── */}
      <div
        ref={bandRef}
        className="relative flex min-h-[86svh] items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-[-18%] will-change-transform" data-storm>
          <img
            src="/img/storm.jpg"
            alt="Storm front over dark water"
            className="h-full w-full object-cover"
            style={{ filter: "grayscale(0.55) brightness(0.42) contrast(1.35)" }}
          />
        </div>
        <div
          data-band-veil
          className="absolute inset-0 bg-ink/70"
          style={{ opacity: 0.25 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

        <div className="relative z-10 mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8">
          <span className="eyebrow mb-7 inline-block text-bone-dim/80">
            the difference, in one sentence
          </span>
          <p
            ref={statementRef}
            className="display-xl text-[clamp(1.9rem,5.2vw,4.1rem)] text-bone"
          >
            A forecast tells you the weather. A cause tells you whether to{" "}
            <span className="italic-wonk text-ember">bring the umbrella</span>.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[10px] tracking-[0.2em] text-bone-dim/70 uppercase">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-blood" />
              prediction
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-rune" />
              intervention
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rotate-45 bg-chalk" />
              counterfactual
            </span>
          </div>
        </div>
      </div>

      {/* ── the ledger ── */}
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2
            data-reveal="lines"
            className="display-xl max-w-[18ch] text-[clamp(1.9rem,4.6vw,3.6rem)] text-bone"
          >
            The ledger: same question, two{" "}
            <span className="italic-wonk text-chalk">different worlds</span>.
          </h2>
          <div className="flex gap-6 font-mono text-[9.5px] tracking-[0.18em] uppercase">
            <span className="flex items-center gap-2 text-bone-dim/60">
              <span className="h-px w-6 bg-blood/70" />
              predictive stack
            </span>
            <span className="flex items-center gap-2 text-ember">
              <span className="h-px w-6 bg-ember" />
              the wizard
            </span>
          </div>
        </div>

        <div className="mt-12">
          {/* column heads */}
          <div className="hidden grid-cols-12 gap-6 border-b border-bone/12 pb-4 lg:grid">
            <span className="col-span-3 eyebrow">the question</span>
            <span className="col-span-4 eyebrow text-blood/70">what you get today</span>
            <span className="col-span-5 eyebrow text-ember">what the wizard returns</span>
          </div>

          {LEDGER.map((row) => (
            <div
              key={row.ask}
              data-ledger-row
              className="group relative grid grid-cols-1 gap-4 border-b border-bone/10 py-7 transition-colors duration-500 hover:bg-surface/35 lg:grid-cols-12 lg:gap-6"
            >
              <span
                data-ledger-fill
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-ember/70 to-transparent"
              />
              <div className="lg:col-span-3">
                <span className="font-mono text-[9px] tracking-[0.2em] text-bone-dim/50 uppercase lg:hidden">
                  the question
                </span>
                <h3 className="mt-1 font-display text-[19px] leading-[1.2] font-semibold text-bone lg:mt-0">
                  {row.ask}
                </h3>
              </div>
              <div className="lg:col-span-4">
                <span className="font-mono text-[9px] tracking-[0.2em] text-blood/60 uppercase lg:hidden">
                  today
                </span>
                <p className="mt-1 text-[14.2px] leading-relaxed text-bone-dim/65 line-through decoration-blood/40 lg:mt-0">
                  {row.before}
                </p>
              </div>
              <div className="lg:col-span-5">
                <span className="font-mono text-[9px] tracking-[0.2em] text-ember uppercase lg:hidden">
                  with the wizard
                </span>
                <p className="mt-1 text-[14.6px] leading-relaxed text-bone transition-colors duration-500 lg:mt-0">
                  {row.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
