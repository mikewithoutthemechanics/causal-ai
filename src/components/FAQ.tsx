import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import { FAQS } from "../lib/data";
import { SectionLabel } from "./Chrome";

function Item({
  question,
  answer,
  index,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const body = bodyRef.current;
    const inner = innerRef.current;
    if (!body || !inner) return;

    // First pass: just set the resting height, no animation.
    if (!mounted.current) {
      mounted.current = true;
      gsap.set(body, { height: open ? "auto" : 0 });
      gsap.set(inner, { autoAlpha: open ? 1 : 0 });
      return;
    }

    gsap.to(body, {
      height: open ? "auto" : 0,
      duration: 0.62,
      ease: "spell",
      overwrite: true,
    });
    gsap.to(inner, {
      autoAlpha: open ? 1 : 0,
      y: open ? 0 : -12,
      duration: 0.5,
      ease: "spell",
      delay: open ? 0.1 : 0,
      overwrite: true,
    });
  }, [open]);

  return (
    <div
      className={`border-b border-bone/10 transition-colors duration-500 ${
        open ? "bg-surface/45" : "hover:bg-surface/25"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-5 px-1 py-6 text-left sm:gap-7 sm:px-4"
      >
        <span
          className={`mt-1 font-mono text-[10px] tracking-[0.2em] transition-colors duration-500 ${
            open ? "text-ember" : "text-bone-dim/50"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex-1 font-display text-[clamp(1.05rem,2vw,1.42rem)] leading-[1.25] font-semibold transition-colors duration-500 ${
            open ? "text-ember" : "text-bone group-hover:text-bone"
          }`}
        >
          {question}
        </span>
        <span className="relative mt-1.5 h-4 w-4 shrink-0">
          <span
            className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 transition-colors duration-500"
            style={{ backgroundColor: open ? "#ff6b2c" : "#9d9484" }}
          />
          <span
            className="absolute top-0 left-1/2 h-full w-px transition-transform duration-500"
            style={{
              backgroundColor: open ? "#ff6b2c" : "#9d9484",
              transform: `translateX(-50%) scaleY(${open ? 0 : 1})`,
            }}
          />
        </span>
      </button>

      <div ref={bodyRef} className="overflow-hidden" style={{ height: open ? "auto" : 0 }}>
        <div ref={innerRef} className="px-1 pb-7 sm:px-4">
          <p className="max-w-[76ch] text-[14.8px] leading-relaxed text-bone-dim sm:pl-[52px]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-bone/8 bg-ink-2 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="VII">Objections, answered</SectionLabel>
            <h2
              data-reveal="lines"
              className="display-xl mt-6 max-w-[13ch] text-[clamp(2rem,4.6vw,3.6rem)] text-bone"
            >
              The questions your CFO will{" "}
              <span className="italic-wonk text-ember">actually</span> ask.
            </h2>
            <p
              data-reveal="up"
              className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-bone-dim"
            >
              Still unresolved? Bring it to the reading — we answer with your schema on
              screen, not with a slide.
            </p>
            <div
              data-reveal="up"
              data-reveal-delay="0.08"
              className="mt-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-bone-dim/60 uppercase"
            >
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-chalk" />
              median reply time · 3h 12m
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-bone/10">
            {FAQS.map((faq, i) => (
              <Item
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                index={i}
                open={open === i}
                onToggle={() => setOpen((prev) => (prev === i ? null : i))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
