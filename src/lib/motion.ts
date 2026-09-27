/**
 * motion.ts — shared GSAP plumbing for The Wizard.
 *
 * One place registers every plugin, one place owns the global, attribute-driven
 * animation system (`data-reveal`, `data-parallax`, `data-count`, `data-magnetic`,
 * `data-tilt`) so individual sections stay declarative.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import CustomEase from "gsap/CustomEase";
import Observer from "gsap/Observer";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, Observer);

CustomEase.create("spell", "0.16, 1, 0.3, 1");
CustomEase.create("rune", "0.65, 0, 0.35, 1");

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase, Observer };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─────────────────────────  reveals  ───────────────────────── */

type RevealKind =
  | "up"
  | "fade"
  | "mask"
  | "chars"
  | "lines"
  | "scale"
  | "left"
  | "right"
  | "flip";

function fromVars(kind: RevealKind): gsap.TweenVars {
  switch (kind) {
    case "fade":
      return { autoAlpha: 0 };
    case "mask":
      return { autoAlpha: 0, yPercent: 110, clipPath: "inset(0 0 100% 0)" };
    case "chars":
      return { autoAlpha: 0, yPercent: 105, rotate: 4 };
    case "lines":
      return { yPercent: 105, autoAlpha: 0 };
    case "scale":
      return { autoAlpha: 0, scale: 0.9, transformOrigin: "50% 60%" };
    case "left":
      return { autoAlpha: 0, x: -56 };
    case "right":
      return { autoAlpha: 0, x: 56 };
    case "flip":
      return { autoAlpha: 0, rotateX: -52, y: 40, transformOrigin: "50% 100%" };
    case "up":
    default:
      return { autoAlpha: 0, y: 44 };
  }
}

function animateReveal(el: HTMLElement, kind: RevealKind, delay = 0, duration = 1) {
  if (kind === "chars" || kind === "lines") {
    const split = new SplitText(el, {
      type: kind === "chars" ? "chars" : "lines",
      linesClass: "split-line",
      mask: kind === "lines" ? "lines" : undefined,
      autoSplit: true,
      position: "relative",
    });
    const targets = kind === "chars" ? split.chars : split.lines;
    gsap.fromTo(
      targets,
      fromVars(kind),
      {
        autoAlpha: 1,
        yPercent: 0,
        x: 0,
        rotate: 0,
        duration: kind === "chars" ? 0.9 : 1.05,
        ease: "spell",
        delay,
        stagger: kind === "chars" ? 0.018 : 0.09,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      },
    );
    return;
  }

  gsap.fromTo(
    el,
    fromVars(kind),
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      yPercent: 0,
      clipPath: kind === "mask" ? "inset(0 0 0% 0)" : undefined,
      duration,
      ease: "spell",
      delay,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    },
  );
}

/** Attribute-driven entrance animations. */
export function initReveals(scope: ParentNode = document) {
  const handled = new WeakSet<Element>();

  // Grouped reveals: a [data-reveal-group] staggers the [data-reveal] nodes
  // whose nearest group ancestor is that group (so nesting stays sane).
  scope.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const items = Array.from(
      group.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).filter((el) => el.closest("[data-reveal-group]") === group);

    const stagger = parseFloat(group.dataset.revealStagger ?? "0.09");
    items.forEach((el, i) => {
      handled.add(el);
      animateReveal(el, (el.dataset.reveal ?? "up") as RevealKind, i * stagger);
    });
  });

  // Standalone reveals.
  scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    if (handled.has(el)) return;
    const kind = (el.dataset.reveal ?? "up") as RevealKind;
    const delay = parseFloat(el.dataset.revealDelay ?? "0");
    animateReveal(el, kind, delay);
  });
}

/* ─────────────────────────  parallax  ───────────────────────── */

/** `[data-parallax="0.25"]` → element drifts ±25% of its own height while on screen. */
export function initParallax(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const strength = parseFloat(el.dataset.parallax ?? "0.2");
    if (Number.isNaN(strength) || strength === 0) return;
    const axis = el.dataset.parallaxAxis === "x" ? "xPercent" : "yPercent";
    const distance = strength * 100;
    gsap.fromTo(
      el,
      { [axis]: distance * 0.5 },
      {
        [axis]: -distance * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("[data-parallax-host]") ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

/* ─────────────────────────  counters  ───────────────────────── */

export function initCounters(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count ?? "0");
    const decimals = parseInt(el.dataset.countDecimals ?? "0", 10);
    const prefix = el.dataset.countPrefix ?? "";
    const suffix = el.dataset.countSuffix ?? "";
    const proxy = { v: 0 };

    el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          v: target,
          duration: 2.1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${proxy.v.toFixed(decimals)}${suffix}`;
          },
        });
      },
    });
  });
}

/* ─────────────────────────  magnetic + tilt  ───────────────────────── */

export function initMagnetic(scope: ParentNode = document) {
  if (prefersReducedMotion()) return;
  scope.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic ?? "0.32");
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const ny = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      xTo(nx * rect.width * strength);
      yTo(ny * rect.height * strength * 0.7);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  });
}

export function initTilt(scope: ParentNode = document) {
  if (prefersReducedMotion()) return;
  scope.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    const max = parseFloat(el.dataset.tilt ?? "7");
    const rx = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3.out" });

    el.style.transformStyle = "preserve-3d";

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      ry(nx * max * 2);
      rx(-ny * max * 2);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  });
}

/* ─────────────────────────  scramble text  ───────────────────────── */

export function scramble(el: HTMLElement, text: string, opts?: { delay?: number; speed?: number }) {
  gsap.to(el, {
    delay: opts?.delay ?? 0,
    duration: opts?.speed ?? 1.1,
    scrambleText: {
      text,
      chars: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ§∆∑∴⌁01",
      speed: 0.42,
      revealDelay: 0.25,
    },
    ease: "none",
  });
}

/* ─────────────────────────  one-shot setup  ───────────────────────── */

export function initGlobalMotion(scope: ParentNode = document) {
  initReveals(scope);
  initParallax(scope);
  initCounters(scope);
  initMagnetic(scope);
  initTilt(scope);
}
