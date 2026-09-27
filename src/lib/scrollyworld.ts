/**
 * ScrollyWorld — a tiny scroll-driven "world" engine.
 *
 * A World is a tall scroll spacer (`root`) containing a sticky 100svh stage
 * (`viewport`). Inside the stage sits a `camera` that dollies forward along +Z
 * as the user scrolls. Every `plane` is parked at some depth behind the camera,
 * so real CSS perspective does the parallax maths for us — near planes rush
 * past, far planes barely creep.
 *
 * Layered on top of the dolly:
 *   • per-plane drift, spin and opacity windows
 *   • pointer parallax (the perspective-origin leans toward the cursor and each
 *     plane slides by an amount weighted by its depth)
 *   • declarative "steps" that fire as the camera passes a progress threshold
 *
 * A single `render()` owns every transform, so scrub input and pointer input
 * can never fight each other.
 *
 * Built on GSAP + ScrollTrigger.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface WorldPlane {
  /** The element to place in 3D space. */
  el: HTMLElement;
  /** Depth in px behind the camera's focal plane. Bigger = further away. */
  z: number;
  /** Base scale multiplier. */
  scale?: number;
  /** Base offsets in px. */
  x?: number;
  y?: number;
  /** Base rotation in degrees. */
  rotate?: number;
  /**
   * Extra vertical travel (px) applied across the whole scroll, on top of the
   * natural perspective drift. Negative floats upward.
   */
  drift?: number;
  /** Extra rotation applied across the whole scroll, in degrees. */
  spin?: number;
  /** Progress window [in, out] where the plane is fully visible. */
  fade?: [number, number];
  /** Pointer-parallax strength in px. */
  pointer?: number;
}

export interface WorldStep {
  id: string;
  /** Normalised progress (0–1) at which this step becomes active. */
  at: number;
}

export interface WorldOptions {
  root: HTMLElement;
  viewport: HTMLElement;
  camera: HTMLElement;
  planes: WorldPlane[];
  steps?: WorldStep[];
  /** Total camera dolly distance in px. */
  travel?: number;
  /** Scroll length of the root spacer, e.g. "420vh". */
  length?: string;
  onProgress?: (progress: number) => void;
  onStep?: (stepId: string | null, index: number) => void;
  onCamera?: (progress: number, camera: HTMLElement) => void;
  pointer?: boolean;
}

export interface World {
  progress: () => number;
  trigger: ScrollTrigger;
  kill: () => void;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Smooth opacity window: fades in before `a`, out after `b`. */
function windowOpacity(p: number, fade?: [number, number]): number {
  if (!fade) return 1;
  const [a, b] = fade;
  const ramp = Math.max(0.0001, (b - a) * 0.4);
  const entering = clamp01((p - (a - ramp)) / ramp);
  const leaving = clamp01((b + ramp - p) / ramp);
  return Math.min(entering, leaving);
}

export function createWorld(options: WorldOptions): World {
  const {
    root,
    viewport,
    camera,
    planes,
    steps = [],
    travel = 1400,
    length,
    onProgress,
    onStep,
    onCamera,
    pointer = true,
  } = options;

  if (length) root.style.height = length;

  const sortedSteps = [...steps].sort((a, b) => a.at - b.at);

  // ── Shared render state ────────────────────────────────────────────────
  const state = {
    progress: 0,
    stepIndex: -1,
    // Smoothed pointer position, -0.5 … 0.5 on both axes.
    px: 0,
    py: 0,
  };

  const baseTransforms = planes.map((plane) => ({
    x: plane.x ?? 0,
    y: plane.y ?? 0,
    rotate: plane.rotate ?? 0,
    scale: plane.scale ?? 1,
    z: -plane.z,
  }));

  planes.forEach((plane, i) => {
    gsap.set(plane.el, {
      x: baseTransforms[i].x,
      y: baseTransforms[i].y,
      z: baseTransforms[i].z,
      scale: baseTransforms[i].scale,
      rotate: baseTransforms[i].rotate,
      transformOrigin: "50% 50%",
    });
  });

  function render() {
    const p = state.progress;

    gsap.set(camera, { z: p * travel });
    onCamera?.(p, camera);

    planes.forEach((plane, i) => {
      const base = baseTransforms[i];
      const depthFactor = 1 - Math.min(0.88, plane.z / 2800);
      const pointerX = (plane.pointer ?? 0) * -state.px * depthFactor;
      const pointerY = (plane.pointer ?? 0) * -state.py * depthFactor * 0.6;

      gsap.set(plane.el, {
        x: base.x + pointerX,
        y: base.y + (plane.drift ?? 0) * p + pointerY,
        rotate: base.rotate + (plane.spin ?? 0) * p,
        opacity: windowOpacity(p, plane.fade),
      });
    });

    viewport.style.perspectiveOrigin = `${50 + state.px * 8}% ${50 + state.py * 6}%`;

    onProgress?.(p);

    let index = -1;
    for (let i = 0; i < sortedSteps.length; i++) {
      if (p >= sortedSteps[i].at) index = i;
    }
    if (index !== state.stepIndex) {
      state.stepIndex = index;
      onStep?.(index >= 0 ? sortedSteps[index].id : null, index);
    }
  }

  const trigger = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    onUpdate: (self) => {
      state.progress = self.progress;
      render();
    },
    onRefresh: (self) => {
      state.progress = self.progress;
      render();
    },
  });

  // ── Pointer parallax ───────────────────────────────────────────────────
  const pointerProxy = { px: 0, py: 0 };
  let pointerTween: gsap.core.Tween | null = null;

  const onPointerMove = (event: PointerEvent) => {
    const rect = viewport.getBoundingClientRect();
    if (rect.height === 0 || rect.width === 0) return;
    const targetX = (event.clientX - rect.left) / rect.width - 0.5;
    const targetY = (event.clientY - rect.top) / rect.height - 0.5;

    pointerTween?.kill();
    pointerTween = gsap.to(pointerProxy, {
      px: targetX,
      py: targetY,
      duration: 1.1,
      ease: "power3.out",
      onUpdate: () => {
        state.px = pointerProxy.px;
        state.py = pointerProxy.py;
        render();
      },
    });
  };

  if (pointer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  render();

  return {
    progress: () => state.progress,
    trigger,
    kill: () => {
      window.removeEventListener("pointermove", onPointerMove);
      pointerTween?.kill();
      trigger.kill();
      viewport.style.perspectiveOrigin = "";
      gsap.set([camera, ...planes.map((plane) => plane.el)], {
        clearProps: "all",
      });
    },
  };
}

/**
 * Scroll-linked progress for a single sticky stage without the full 3D camera —
 * for pinned chapters that only need a 0→1 scrub value.
 */
export function createStageScrub(
  root: HTMLElement,
  onUpdate: (progress: number) => void,
  end = "bottom bottom",
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: root,
    start: "top top",
    end,
    scrub: 0.5,
    onUpdate: (self) => onUpdate(self.progress),
    onRefresh: (self) => onUpdate(self.progress),
  });
}
