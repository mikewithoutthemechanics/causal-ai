import { TICKER_WORDS } from "../lib/data";

const Row = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="marquee relative overflow-hidden">
    <div className={`marquee-track items-center gap-8 ${reverse ? "reverse" : ""}`}>
      {[...TICKER_WORDS, ...TICKER_WORDS].map((word, i) => (
        <span key={`${word}-${i}`} className="flex shrink-0 items-center gap-8">
          <span className="font-display text-[clamp(1.1rem,2.2vw,1.7rem)] font-semibold tracking-[-0.01em] whitespace-nowrap text-ink/85 transition-colors duration-300 hover:text-ember">
            {word}
          </span>
          <span aria-hidden="true" className="text-[13px] text-ember">
            ✦
          </span>
        </span>
      ))}
    </div>
  </div>
);

export default function Ticker() {
  return (
    <div className="relative z-10 -my-2 overflow-hidden py-4">
      <div
        className="relative w-[106%] -ml-[3%] overflow-hidden border-y border-ink/15 bg-bone py-4"
        style={{ transform: "rotate(-1.4deg)" }}
      >
        <div className="pointer-events-none absolute inset-0 scanlines opacity-[0.18] mix-blend-multiply" />
        <Row />
        <div className="mt-2.5 border-t border-ink/10 pt-2.5">
          <Row reverse />
        </div>
      </div>
    </div>
  );
}
