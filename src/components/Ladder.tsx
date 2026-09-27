import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/motion";
import { createWorld, type World, type WorldPlane } from "../lib/scrollyworld";
import { RUNGS } from "../lib/data";

const TRAVEL = 1150;
const ROMAN = ["I", "II", "III"];

export default function Ladder() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  const veilRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const sigilRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const numeralRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const glyphRefs = useRef<Array<HTMLDivElement | null>>([]);

  const cardsRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const rungRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const formulaRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);

  /* ── build the world ────────────────────────────────────────────── */
  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const camera = cameraRef.current;
    if (!root || !viewport || !camera) return;

    const required = [veilRef, fogRef, sigilRef, gridRef, orbRef];
    if (required.some((ref) => !ref.current)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Deep planes must be over-scaled: CSS perspective shrinks anything far
    // from the focal plane, so we pre-inflate to keep the frame covered.
    const planes: WorldPlane[] = [
      { el: veilRef.current!, z: 2200, scale: 2.8, drift: -90, pointer: 6 },
      { el: fogRef.current!, z: 1620, scale: 2.3, drift: 150, fade: [0, 0.96], pointer: 12 },
      { el: sigilRef.current!, z: 1180, spin: 130, drift: -60, fade: [0.02, 0.98], pointer: 34 },
      { el: gridRef.current!, z: 780, drift: -300, fade: [0.04, 0.92], pointer: 22 },
      { el: orbRef.current!, z: 540, drift: -200, fade: [0.08, 0.94], pointer: 64 },
    ];

    numeralRefs.current.forEach((el, i) => {
      if (!el) return;
      planes.push({
        el,
        z: 520 - i * 100,
        drift: -120,
        fade: [i * 0.33 - 0.02, i * 0.33 + 0.34],
        pointer: 46 - i * 8,
      });
    });

    glyphRefs.current.forEach((el, i) => {
      if (!el) return;
      planes.push({
        el,
        z: 940 - i * 120,
        drift: -240 + i * 55,
        spin: i % 2 === 0 ? 34 : -34,
        fade: [0.03 + i * 0.11, 0.5 + i * 0.11],
        pointer: 30,
      });
    });

    const world: World = createWorld({
      root,
      viewport,
      camera,
      planes,
      travel: reduced ? 0 : TRAVEL,
      steps: RUNGS.map((rung, i) => ({ id: rung.id, at: 0.04 + i * 0.33 })),
      pointer: !reduced,
      onStep: (_id, index) => setActive(Math.max(0, index)),
      onProgress: (p) => {
        if (depthRef.current) {
          depthRef.current.textContent = String(Math.round(p * TRAVEL)).padStart(4, "0");
        }
        if (gaugeRef.current) gaugeRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      },
    });

    return () => world.kill();
  }, []);

  /* ── card cross-fade + formula scramble ─────────────────────────── */
  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll<HTMLElement>("[data-rung-card]");
    cards?.forEach((card, i) => {
      const isActive = i === active;
      gsap.to(card, {
        autoAlpha: isActive ? 1 : 0,
        y: isActive ? 0 : i < active ? -52 : 52,
        scale: isActive ? 1 : 0.96,
        rotateX: isActive ? 0 : i < active ? 9 : -9,
        duration: 0.9,
        ease: "spell",
        delay: isActive ? 0.05 : 0,
        overwrite: "auto",
      });
    });

    const formula = formulaRef.current;
    if (formula) {
      const target = RUNGS[active].formula;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        formula.textContent = target;
      } else {
        gsap.to(formula, {
          duration: 0.65,
          ease: "none",
          overwrite: true,
          scrambleText: {
            text: target,
            chars: "P()|doₓ∑∆∴§01",
            speed: 0.5,
            revealDelay: 0.14,
          },
        });
      }
    }
    if (rungRef.current) rungRef.current.textContent = `RUNG ${ROMAN[active]} / III`;
  }, [active]);

  const rung = RUNGS[active];

  return (
    <section id="ladder" className="relative bg-ink">
      {/* intro copy */}
      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 pb-14 sm:px-8 sm:pt-32">
        <div className="flex items-center gap-3" data-reveal="fade">
          <span className="font-mono text-[11px] tracking-[0.3em] text-chalk">II</span>
          <span className="h-px w-8 bg-chalk/40" />
          <span className="eyebrow">ScrollyWorld · the descent</span>
        </div>
        <h2
          data-reveal="lines"
          className="display-xl mt-6 max-w-[17ch] text-[clamp(2.3rem,6.2vw,5.2rem)] text-bone"
        >
          Climb the ladder your competitors are{" "}
          <span className="italic-wonk text-chalk">stuck beneath</span>.
        </h2>
        <p
          data-reveal="up"
          data-reveal-delay="0.08"
          className="mt-6 max-w-[58ch] text-[16.5px] leading-relaxed text-bone-dim"
        >
          Pearl's hierarchy of causation has three rungs. Almost everything sold as “AI”
          never leaves the first. Keep scrolling — the camera descends through the fog, and
          each rung answers a question the one below it cannot even express.
        </p>
      </div>

      {/* ── the world ── */}
      <div ref={rootRef} className="relative" style={{ height: "400vh" }}>
        <div ref={viewportRef} className="sw-viewport">
          <div ref={cameraRef} className="sw-camera">
            <div ref={veilRef} className="sw-plane">
              <img
                src="/img/veil.jpg"
                alt=""
                aria-hidden="true"
                style={{ filter: "saturate(0.4) brightness(0.44) contrast(1.2)" }}
              />
            </div>

            <div ref={fogRef} className="sw-plane">
              <img
                src="/img/fog.jpg"
                alt=""
                aria-hidden="true"
                style={{ filter: "grayscale(1) brightness(0.4) contrast(1.55)", opacity: 0.72 }}
              />
            </div>

            <div ref={sigilRef} className="sw-plane grid place-items-center">
              <img
                src="/img/sigil.png"
                alt=""
                aria-hidden="true"
                style={{ height: "76%", width: "76%", objectFit: "contain", opacity: 0.5 }}
              />
            </div>

            <div ref={gridRef} className="sw-plane">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(111,227,208,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(111,227,208,0.18) 1px, transparent 1px)",
                  backgroundSize: "72px 72px",
                  maskImage:
                    "radial-gradient(ellipse 60% 50% at 50% 50%, black 8%, transparent 72%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 60% 50% at 50% 50%, black 8%, transparent 72%)",
                  opacity: 0.6,
                }}
              />
            </div>

            <div ref={orbRef} className="sw-plane grid place-items-center">
              <img
                src="/img/orb.png"
                alt=""
                aria-hidden="true"
                style={{ height: "44%", width: "auto", objectFit: "contain" }}
              />
            </div>

            {ROMAN.map((numeral, i) => (
              <div
                key={numeral}
                ref={(el) => {
                  numeralRefs.current[i] = el;
                }}
                className="sw-plane grid place-items-center"
              >
                <span
                  className="font-display leading-none font-light select-none"
                  style={{
                    fontSize: "44vmin",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(237,230,216,0.28)",
                  }}
                >
                  {numeral}
                </span>
              </div>
            ))}

            {["P(y|x)", "do( )", "yₓ", "∴", "→"].map((glyph, i) => (
              <div
                key={glyph}
                ref={(el) => {
                  glyphRefs.current[i] = el;
                }}
                className="sw-plane grid place-items-center"
              >
                <span
                  className="font-mono select-none"
                  style={{
                    fontSize: "4.2vmin",
                    color: "rgba(111,227,208,0.42)",
                    transform: `translate(${(i % 2 === 0 ? -1 : 1) * (22 + i * 8)}vw, ${((i % 3) - 1) * 22}vh)`,
                  }}
                >
                  {glyph}
                </span>
              </div>
            ))}
          </div>

          {/* ── 2D overlay: HUD + rung cards ── */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/75" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 px-5 pt-6 sm:px-8">
              <div className="font-mono text-[9.5px] leading-[1.9] tracking-[0.2em] text-bone-dim/75 uppercase">
                <div className="text-chalk">scrollyworld · active</div>
                <div>
                  cam z <span ref={depthRef} className="text-ember">0000</span>px
                </div>
                <div ref={rungRef}>RUNG I / III</div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {RUNGS.map((r, i) => (
                  <span
                    key={r.id}
                    className="h-[3px] rounded-full transition-all duration-500"
                    style={{
                      width: i === active ? 38 : 14,
                      backgroundColor: i === active ? r.accent : "rgba(237,230,216,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute top-1/2 left-6 hidden h-[34vh] w-px -translate-y-1/2 bg-bone/12 lg:block lg:left-10">
              <div
                ref={gaugeRef}
                className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-bone-dim via-ember to-chalk"
                style={{ transform: "scaleY(0)" }}
              />
            </div>

            {/* rung cards — stacked in the same slot, cross-faded */}
            <div
              ref={cardsRef}
              className="absolute inset-0"
              style={{ perspective: "1000px" }}
            >
              {RUNGS.map((r, i) => (
                <div
                  key={r.id}
                  className="absolute inset-0 flex items-end justify-center p-4 pb-6 sm:items-center sm:justify-end sm:p-8 lg:p-14"
                >
                  <article
                    data-rung-card
                    className="card-arcane corner-tick pointer-events-auto w-full max-w-[540px] rounded-sm p-5 opacity-0 sm:p-7"
                    style={{ transformStyle: "preserve-3d" }}
                    aria-hidden={i !== active}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="font-mono text-[10px] tracking-[0.26em] uppercase"
                        style={{ color: r.accent }}
                      >
                        {r.rung}
                      </span>
                      <span className="numeral text-[32px]" style={{ color: r.accent }}>
                        {r.index}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-[clamp(1.55rem,3vw,2.35rem)] leading-[1.05] font-semibold text-bone">
                      {r.name}
                    </h3>
                    <p
                      className="mt-1.5 font-display text-[18px] italic-wonk"
                      style={{ color: r.accent }}
                    >
                      {r.question}
                    </p>

                    <p className="mt-3.5 text-[13.6px] leading-relaxed text-bone-dim sm:text-[14.8px]">
                      {r.body}
                    </p>

                    <div className="mt-5 border-t border-bone/10 pt-3.5">
                      <span className="font-mono text-[9.5px] leading-relaxed tracking-[0.16em] text-bone-dim/60 uppercase">
                        {r.capability}
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 hidden items-center justify-between gap-6 px-14 pb-6 lg:flex">
              <span className="font-mono text-[10px] tracking-[0.22em] text-bone-dim/55 uppercase">
                query class
              </span>
              <span
                ref={formulaRef}
                className="font-mono text-[15px] tracking-[0.06em]"
                style={{ color: rung.accent }}
              >
                {rung.formula}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* outro */}
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
        <p
          data-reveal="lines"
          className="display-xl max-w-[24ch] text-[clamp(1.6rem,3.6vw,3rem)] text-bone"
        >
          Data is profoundly, fundamentally,{" "}
          <span className="italic-wonk text-ember">dumb</span>. It cannot tell you what
          would happen if you did something different.
        </p>
        <p
          data-reveal="up"
          data-reveal-delay="0.12"
          className="mt-7 font-mono text-[11px] tracking-[0.2em] text-bone-dim/70 uppercase"
        >
          — the reason your last three “insight” projects changed nothing
        </p>
      </div>
    </section>
  );
}
