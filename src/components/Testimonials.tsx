import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { TESTIMONIALS } from "../lib/data";
import { SectionLabel } from "./Chrome";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-postcard]", rootRef.current).forEach(
        (card, i) => {
          const tilt = parseFloat(card.dataset.tiltValue ?? "0");
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 70, rotate: tilt * 2.4, scale: 0.93 },
            {
              autoAlpha: 1,
              y: 0,
              rotate: tilt,
              scale: 1,
              duration: 1.15,
              ease: "spell",
              delay: (i % 2) * 0.09,
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
            },
          );
        },
      );

      // The big pull-quote draws itself in.
      const quote = rootRef.current?.querySelector<HTMLElement>("[data-pullquote]");
      if (quote) {
        gsap.fromTo(
          quote.querySelectorAll("[data-quote-word]"),
          { autoAlpha: 0.14, yPercent: 22, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "spell",
            stagger: 0.045,
            scrollTrigger: { trigger: quote, start: "top 78%", once: true },
          },
        );
      }
    },
    { scope: rootRef },
  );

  const pullQuote =
    "We stopped asking ‘what does the data say’ and started asking ‘what happens if we act’. That is the whole change, and it is worth every cent.";

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-y border-bone/8 bg-ink-2 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_80%_10%,rgba(111,227,208,0.07),transparent_60%)]" />
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] opacity-[0.07] rune-ring"
        aria-hidden="true"
      >
        <img src="/img/sigil.png" alt="" className="h-full w-full object-contain" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <SectionLabel index="V" tone="chalk">
          Field reports
        </SectionLabel>

        <blockquote
          data-pullquote
          className="mt-8 max-w-[30ch] font-display text-[clamp(1.9rem,4.6vw,3.6rem)] leading-[1.06] font-semibold text-bone lg:max-w-[24ch]"
        >
          {pullQuote.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} data-quote-word className="inline-block will-change-transform">
              {word}
              {" "}
            </span>
          ))}
        </blockquote>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              data-postcard
              data-tilt="5"
              data-cursor
              data-tilt-value={t.tilt}
              className="card-arcane relative flex h-full flex-col justify-between rounded-sm p-6 will-change-transform"
            >
              <span
                className="pointer-events-none absolute -top-3 left-5 font-display text-[64px] leading-none opacity-25"
                style={{ color: "#ff6b2c" }}
                aria-hidden="true"
              >
                “
              </span>
              <blockquote className="relative pt-4">
                <p className="text-[14.6px] leading-relaxed text-bone/90">{t.quote}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-bone/10 pt-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rune/40 bg-rune/10 font-mono text-[11px] tracking-[0.06em] text-rune">
                  {t.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium text-bone">
                    {t.name}
                  </span>
                  <span className="block truncate font-mono text-[9.5px] tracking-[0.14em] text-bone-dim/65 uppercase">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
