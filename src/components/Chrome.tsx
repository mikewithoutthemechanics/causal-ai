import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { pageProgress } from "../lib/scroll";

/* ─────────────────────────  film grain + vignette  ───────────────────────── */

export function Atmosphere() {
  return (
    <>
      <div className="grain-layer" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}

/* ─────────────────────────  custom cursor  ───────────────────────── */

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) setEnabled(true);
  }, []);

  // Runs only once the cursor DOM actually exists.
  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return;

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(!!target?.closest("a, button, [data-cursor]"));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute -top-5 -left-5 h-10 w-10"
        style={{ mixBlendMode: "difference" }}
      >
        <div
          className="h-full w-full rounded-full border transition-[transform,background-color,border-color] duration-300 ease-out"
          style={{
            borderColor: active ? "rgba(255,107,44,0.95)" : "rgba(237,230,216,0.4)",
            backgroundColor: active ? "rgba(255,107,44,0.16)" : "transparent",
            transform: active ? "scale(1.6)" : "scale(1)",
          }}
        />
      </div>
      <div
        ref={dotRef}
        className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 rounded-full bg-ember"
      />
    </div>
  );
}

/* ─────────────────────────  spell-meter progress rail  ───────────────────────── */

const RAIL_MARKS = [
  { id: "#illusion", label: "I" },
  { id: "#ladder", label: "II" },
  { id: "#spells", label: "III" },
  { id: "#proof", label: "IV" },
  { id: "#pricing", label: "V" },
];

export function ProgressRail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [activeMark, setActiveMark] = useState<string | null>(null);

  useEffect(() => {
    const setHeight = gsap.quickTo(fillRef.current, "scaleY", {
      duration: 0.35,
      ease: "power2.out",
    });

    const onScroll = () => {
      const p = pageProgress();
      setHeight(p);
      if (readoutRef.current) {
        readoutRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }
    };

    onScroll();
    ScrollTrigger.addEventListener("scrollStart", onScroll);
    ScrollTrigger.addEventListener("scrollEnd", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const triggers = RAIL_MARKS.map((mark) => {
      const el = document.querySelector(mark.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) =>
          setActiveMark((prev) =>
            self.isActive ? mark.id : prev === mark.id ? null : prev,
          ),
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ScrollTrigger.removeEventListener("scrollStart", onScroll);
      ScrollTrigger.removeEventListener("scrollEnd", onScroll);
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-0 right-0 z-[9990] hidden h-full w-14 flex-col items-center justify-center gap-4 lg:flex">
      <span className="eyebrow text-[9px] text-bone-dim/70 [writing-mode:vertical-rl]">
        DESCENT
      </span>
      <div className="relative h-[46vh] w-px bg-bone/12">
        <div
          ref={fillRef}
          className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-rune via-ember to-chalk"
          style={{ transform: "scaleY(0)" }}
        />
        {RAIL_MARKS.map((mark, i) => (
          <span
            key={mark.id}
            className="absolute -left-[3px] h-[7px] w-[7px] rotate-45 border transition-all duration-500"
            style={{
              top: `${(i / (RAIL_MARKS.length - 1)) * 100}%`,
              borderColor: activeMark === mark.id ? "#ff6b2c" : "rgba(237,230,216,0.3)",
              backgroundColor: activeMark === mark.id ? "#ff6b2c" : "#08070a",
              boxShadow: activeMark === mark.id ? "0 0 12px rgba(255,107,44,0.8)" : "none",
            }}
          />
        ))}
      </div>
      <span
        ref={readoutRef}
        className="font-mono text-[10px] tracking-widest text-ember tabular-nums"
      >
        000
      </span>
    </div>
  );
}

/* ─────────────────────────  section heading  ───────────────────────── */

export function SectionLabel({
  index,
  children,
  tone = "bone",
}: {
  index: string;
  children: React.ReactNode;
  tone?: "bone" | "ember" | "chalk";
}) {
  const color =
    tone === "ember" ? "text-ember" : tone === "chalk" ? "text-chalk" : "text-bone-dim";
  return (
    <div className="flex items-center gap-3" data-reveal="fade">
      <span className={`font-mono text-[11px] tracking-[0.3em] ${color}`}>{index}</span>
      <span className="h-px w-8 bg-current opacity-30" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
