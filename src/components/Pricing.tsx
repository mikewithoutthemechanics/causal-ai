import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import { PLANS } from "../lib/data";
import { SectionLabel } from "./Chrome";
import { scrollToId } from "../lib/scroll";

function Price({
  value,
  featured,
}: {
  value: number;
  featured?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const proxy = { v: current.current };
    gsap.to(proxy, {
      v: value,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(proxy.v).toLocaleString("en-US");
      },
      onComplete: () => {
        current.current = value;
      },
    });
    gsap.fromTo(
      el,
      { yPercent: -18, autoAlpha: 0.3 },
      { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "spell" },
    );
  }, [value]);

  if (value === 0) {
    return (
      <span
        className={`numeral text-[clamp(2.4rem,4.4vw,3.4rem)] ${featured ? "text-ember" : "text-bone"}`}
      >
        Custom
      </span>
    );
  }

  return (
    <span className="flex items-baseline gap-1.5">
      <span
        className={`numeral text-[clamp(2.4rem,4.4vw,3.4rem)] ${featured ? "text-ember" : "text-bone"}`}
      >
        $<span ref={ref}>0</span>
      </span>
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-bone-dim/65 uppercase">
        / month
      </span>
    </span>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.to(knobRef.current, {
      x: annual ? 30 : 0,
      duration: 0.45,
      ease: "spell",
    });
  }, [annual]);

  return (
    <section id="pricing" ref={rootRef} className="relative bg-ink py-24 sm:py-32">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionLabel index="VI">Terms of the craft</SectionLabel>
            <h2
              data-reveal="lines"
              className="display-xl mt-6 max-w-[17ch] text-[clamp(2.1rem,5.4vw,4.4rem)] text-bone"
            >
              Priced like a decision, not a{" "}
              <span className="italic-wonk text-ember">seat</span>.
            </h2>
            <p
              data-reveal="up"
              data-reveal-delay="0.08"
              className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-bone-dim"
            >
              Unlimited users on every tier. Causal insight that only three people can see
              is not insight, it's trivia.
            </p>
          </div>

          {/* billing toggle */}
          <div data-reveal="fade" className="shrink-0">
            <div className="flex items-center gap-4">
              <span
                className={`font-mono text-[10.5px] tracking-[0.18em] uppercase transition-colors duration-300 ${annual ? "text-bone-dim/60" : "text-bone"}`}
              >
                Monthly
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                aria-label="Toggle annual billing"
                onClick={() => setAnnual((v) => !v)}
                className="relative h-[34px] w-[64px] rounded-full border border-bone/20 bg-surface transition-colors duration-300 hover:border-ember/60"
              >
                <span
                  ref={knobRef}
                  className="absolute top-[3px] left-[3px] h-[26px] w-[26px] rounded-full bg-ember shadow-[0_0_18px_rgba(255,107,44,0.55)]"
                />
              </button>
              <span
                className={`font-mono text-[10.5px] tracking-[0.18em] uppercase transition-colors duration-300 ${annual ? "text-ember" : "text-bone-dim/60"}`}
              >
                Annual −20%
              </span>
            </div>
          </div>
        </div>

        <div
          data-reveal-group
          data-reveal-stagger="0.11"
          className="mt-14 grid items-start gap-6 lg:grid-cols-3"
        >
          {PLANS.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            return (
              <div
                key={plan.id}
                data-reveal="up"
                className={`card-arcane corner-tick relative flex h-full flex-col rounded-sm p-7 sm:p-8 ${
                  plan.featured
                    ? "border-ember/45 lg:-mt-5 lg:mb-5 shadow-[0_40px_90px_-50px_rgba(255,107,44,0.6)]"
                    : ""
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full border border-ember/50 bg-ink px-3 py-1 font-mono text-[9px] tracking-[0.22em] text-ember uppercase">
                    most chosen
                  </span>
                )}

                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className={`font-display text-[26px] font-semibold ${plan.featured ? "text-ember" : "text-bone"}`}
                  >
                    {plan.name}
                  </h3>
                  {plan.note && (
                    <span className="font-mono text-[9px] tracking-[0.14em] text-bone-dim/55 uppercase">
                      {plan.note}
                    </span>
                  )}
                </div>

                <p className="mt-2.5 min-h-[42px] max-w-[34ch] text-[13.8px] leading-relaxed text-bone-dim">
                  {plan.tagline}
                </p>

                <div className="mt-6 border-y border-bone/10 py-5">
                  <Price value={price} featured={plan.featured} />
                  {price > 0 && (
                    <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.14em] text-bone-dim/55 uppercase">
                      {annual ? "billed annually · cancel anytime" : "billed monthly"}
                    </p>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="mt-[3px] shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 12.5l5 5L20 6.5"
                          stroke={plan.featured ? "#ff6b2c" : "#6fe3d0"}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[13.8px] leading-relaxed text-bone-dim">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  data-magnetic="0.14"
                  onClick={() => scrollToId("#reading")}
                  className={`mt-8 w-full justify-center px-6 py-3.5 text-[14px] ${
                    plan.featured ? "btn-ember" : "btn-ghost"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p
          data-reveal="fade"
          className="mt-10 text-center font-mono text-[10px] tracking-[0.18em] text-bone-dim/55 uppercase"
        >
          All tiers include the refutation suite · SOC 2 Type II · no per-seat licensing
        </p>
      </div>
    </section>
  );
}
