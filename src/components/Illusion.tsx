import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { GRAPH_STATES, type GraphEdge, type GraphNode } from "../lib/data";
import { SectionLabel } from "./Chrome";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────  geometry  ───────────────────────── */

const VB_W = 480;
const VB_H = 330;

const nodeSize = (node: GraphNode) => ({
  w: Math.max(104, node.label.length * 7.4 + 34),
  h: node.sub ? 44 : 32,
});

const nodeCenter = (node: GraphNode) => ({
  x: (node.x / 100) * VB_W,
  y: (node.y / 100) * VB_H,
});

/** Exact point where a ray from a rect's centre hits its boundary. */
function rectEdge(
  cx: number,
  cy: number,
  w: number,
  h: number,
  tx: number,
  ty: number,
  pad = 6,
) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const sx = dx !== 0 ? (w / 2 + pad) / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? (h / 2 + pad) / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
}

interface BuiltEdge extends GraphEdge {
  id: string;
  d: string;
  head: { x: number; y: number; angle: number };
  mid: { x: number; y: number };
  stroke: string;
  dash: string;
  flow: boolean;
}

const EDGE_STYLE: Record<
  GraphEdge["kind"],
  { stroke: string; dash: string; flow: boolean }
> = {
  causal: { stroke: "#6fe3d0", dash: "0", flow: false },
  spurious: { stroke: "#ff6b2c", dash: "7 6", flow: true },
  backdoor: { stroke: "#c9a227", dash: "3 5", flow: false },
  blocked: { stroke: "#d6413b", dash: "5 6", flow: false },
};

function buildEdges(state: (typeof GRAPH_STATES)[number]): BuiltEdge[] {
  const byId = new Map(state.nodes.map((n) => [n.id, n]));

  return state.edges.map((edge, i) => {
    const a = byId.get(edge.from)!;
    const b = byId.get(edge.to)!;
    const ca = nodeCenter(a);
    const cb = nodeCenter(b);
    const sa = nodeSize(a);
    const sb = nodeSize(b);

    const start = rectEdge(ca.x, ca.y, sa.w, sa.h, cb.x, cb.y);
    const end = rectEdge(cb.x, cb.y, sb.w, sb.h, ca.x, ca.y, 12);

    // Gentle perpendicular bow so parallel edges don't overlap.
    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy) || 1;
    const bow = (i % 2 === 0 ? 1 : -1) * Math.min(26, len * 0.11);
    const cx = mx + (-dy / len) * bow;
    const cy = my + (dx / len) * bow;

    // Tangent at the end of a quadratic curve points from control → end.
    const angle = (Math.atan2(end.y - cy, end.x - cx) * 180) / Math.PI;

    return {
      ...edge,
      id: `${edge.from}-${edge.to}-${i}`,
      d: `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      head: { x: end.x, y: end.y, angle },
      mid: { x: (start.x + 2 * cx + end.x) / 4, y: (start.y + 2 * cy + end.y) / 4 },
      ...EDGE_STYLE[edge.kind],
    };
  });
}

const NODE_FILL: Record<GraphNode["kind"], { bg: string; border: string; text: string }> = {
  exposure: { bg: "rgba(255,107,44,0.14)", border: "#ff6b2c", text: "#ffa05c" },
  outcome: { bg: "rgba(111,227,208,0.12)", border: "#6fe3d0", text: "#6fe3d0" },
  confounder: { bg: "rgba(201,162,39,0.14)", border: "#c9a227", text: "#e0c25f" },
  mediator: { bg: "rgba(237,230,216,0.07)", border: "#9d9484", text: "#cfc7b6" },
  hidden: { bg: "rgba(214,65,59,0.12)", border: "#d6413b", text: "#e8776f" },
};

/* ─────────────────────────  graph panel  ───────────────────────── */

function CausalGraph({
  stateIndex,
  animate = true,
}: {
  stateIndex: number;
  animate?: boolean;
}) {
  const state = GRAPH_STATES[stateIndex];
  const edges = useMemo(() => buildEdges(state), [state]);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!svgRef.current || !animate) return;
      const paths = svgRef.current.querySelectorAll<SVGPathElement>("[data-edge]");
      const heads = svgRef.current.querySelectorAll("[data-head]");
      const nodes = svgRef.current.querySelectorAll("[data-node]");
      const labels = svgRef.current.querySelectorAll("[data-edge-label]");

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length + 40, strokeDashoffset: length });
      });
      gsap.set([heads, nodes, labels], { autoAlpha: 0 });
      gsap.set(nodes, { scale: 0.72, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({ defaults: { ease: "spell" } });
      tl.to(nodes, { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.07 }, 0)
        .to(
          paths,
          { strokeDashoffset: 0, duration: 1.05, stagger: 0.13, ease: "rune" },
          0.22,
        )
        .to(heads, { autoAlpha: 1, duration: 0.35, stagger: 0.13 }, 0.95)
        .to(labels, { autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 1.15);
    },
    { scope: svgRef, dependencies: [stateIndex, animate] },
  );

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Causal graph: ${state.title}`}
      >
        <defs>
          <pattern id="dag-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M24 0 H0 V24"
              fill="none"
              stroke="rgba(237,230,216,0.055)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="dag-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgba(255,107,44,0.10)" />
            <stop offset="100%" stopColor="rgba(255,107,44,0)" />
          </radialGradient>
        </defs>

        <rect width={VB_W} height={VB_H} fill="url(#dag-grid)" />
        <rect width={VB_W} height={VB_H} fill="url(#dag-glow)" />

        {/* edges */}
        {edges.map((edge) => (
          <g key={edge.id}>
            <path
              data-edge
              d={edge.d}
              fill="none"
              stroke={edge.stroke}
              strokeWidth={edge.kind === "causal" ? 2.1 : 1.8}
              strokeDasharray={edge.dash === "0" ? undefined : edge.dash}
              strokeLinecap="round"
              className={edge.flow ? "edge-flow" : undefined}
              opacity={0.92}
            />
            <g
              data-head
              transform={`translate(${edge.head.x} ${edge.head.y}) rotate(${edge.head.angle})`}
            >
              <path
                d="M 0 0 L -11 -5.2 L -11 5.2 Z"
                fill={edge.stroke}
                opacity={0.95}
              />
            </g>
            {edge.kind === "blocked" && (
              <g data-head transform={`translate(${edge.mid.x} ${edge.mid.y})`}>
                <circle r="9" fill="#0d0b12" stroke="#d6413b" strokeWidth="1.4" />
                <path
                  d="M -4 -4 L 4 4 M 4 -4 L -4 4"
                  stroke="#d6413b"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            )}
            {edge.label && (
              <g data-edge-label transform={`translate(${edge.mid.x} ${edge.mid.y - 11})`}>
                <rect
                  x={-(edge.label.length * 3.4 + 9)}
                  y={-9}
                  width={edge.label.length * 6.8 + 18}
                  height={18}
                  rx={9}
                  fill="#0d0b12"
                  stroke={edge.stroke}
                  strokeOpacity={0.4}
                  strokeWidth={1}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={edge.stroke}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.02em",
                  }}
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* nodes */}
        {state.nodes.map((node) => {
          const c = nodeCenter(node);
          const s = nodeSize(node);
          const style = NODE_FILL[node.kind];
          return (
            <g key={node.id} data-node transform={`translate(${c.x} ${c.y})`}>
              <rect
                x={-s.w / 2}
                y={-s.h / 2}
                width={s.w}
                height={s.h}
                rx={4}
                fill="#0d0b12"
                stroke={style.border}
                strokeOpacity={0.55}
                strokeWidth={1.3}
              />
              <rect
                x={-s.w / 2}
                y={-s.h / 2}
                width={s.w}
                height={s.h}
                rx={4}
                fill={style.bg}
              />
              <text
                y={node.sub ? -3 : 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#ede6d8"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: 14.5,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {node.label}
              </text>
              {node.sub && (
                <text
                  y={13}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={style.text}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 9.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {node.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* verdict stamp */}
      <div
        key={state.id}
        className="mt-5 flex flex-wrap items-center gap-3 border-t border-bone/10 pt-4"
      >
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase"
          style={{
            borderColor:
              state.verdictTone === "bad"
                ? "rgba(214,65,59,0.5)"
                : state.verdictTone === "warn"
                  ? "rgba(201,162,39,0.5)"
                  : "rgba(111,227,208,0.5)",
            color:
              state.verdictTone === "bad"
                ? "#e8776f"
                : state.verdictTone === "warn"
                  ? "#e0c25f"
                  : "#6fe3d0",
            backgroundColor:
              state.verdictTone === "bad"
                ? "rgba(214,65,59,0.09)"
                : state.verdictTone === "warn"
                  ? "rgba(201,162,39,0.09)"
                  : "rgba(111,227,208,0.09)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                state.verdictTone === "bad"
                  ? "#d6413b"
                  : state.verdictTone === "warn"
                    ? "#c9a227"
                    : "#6fe3d0",
            }}
          />
          {state.verdict}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────  section  ───────────────────────── */

export default function Illusion() {
  const rootRef = useRef<HTMLElement>(null);
  const chaptersRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]", chaptersRef.current);
      chapters.forEach((chapter, i) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      // The sticky panel breathes as chapters change.
      gsap.to(panelRef.current, {
        scale: 1.012,
        duration: 1.2,
        ease: "spell",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      id="illusion"
      ref={rootRef}
      className="relative border-t border-bone/8 bg-ink-2"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_15%_20%,rgba(255,107,44,0.07),transparent_65%)]" />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 sm:pt-32">
        <SectionLabel index="I">The illusion of insight</SectionLabel>
        <h2
          data-reveal="lines"
          className="display-xl mt-6 max-w-[19ch] text-[clamp(2.2rem,5.6vw,4.6rem)] text-bone"
        >
          Your dashboard is a{" "}
          <span className="italic-wonk text-ember">séance</span>, not a science.
        </h2>
        <p
          data-reveal="up"
          data-reveal-delay="0.1"
          className="mt-6 max-w-[62ch] text-[16.5px] leading-relaxed text-bone-dim"
        >
          Three exhibits. Same discipline, different ending. Scroll and watch the arrows
          get redrawn — because in causal inference, the arrows are the entire answer.
        </p>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-16">
        {/* sticky graph — desktop scrollytelling */}
        <div className="hidden lg:sticky lg:top-0 lg:z-20 lg:block lg:h-[100svh] lg:py-10">
          <div ref={panelRef} className="flex h-full items-center">
            <div className="card-arcane corner-tick w-full rounded-sm p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.22em] text-bone-dim uppercase">
                  {GRAPH_STATES[active].kicker}
                </span>
                <div className="flex items-center gap-1.5">
                  {GRAPH_STATES.map((s, i) => (
                    <span
                      key={s.id}
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: i === active ? 26 : 8,
                        backgroundColor:
                          i === active ? "#ff6b2c" : "rgba(237,230,216,0.22)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <CausalGraph stateIndex={active} />
            </div>
          </div>
        </div>

        {/* scrolling chapters */}
        <div ref={chaptersRef} className="lg:pb-[20vh]">
          {GRAPH_STATES.map((state, i) => (
            <article
              key={state.id}
              data-chapter
              className="flex min-h-[86svh] flex-col justify-center border-b border-bone/8 py-14 last:border-b-0 lg:min-h-[100svh]"
            >
              {/* inline graph — mobile */}
              <div className="mb-9 lg:hidden" data-reveal="scale">
                <div className="card-arcane corner-tick rounded-sm p-4">
                  <span className="mb-4 block font-mono text-[9.5px] tracking-[0.2em] text-bone-dim uppercase">
                    {state.kicker}
                  </span>
                  <CausalGraph stateIndex={i} animate={false} />
                </div>
              </div>

              <span
                className="numeral mb-5 text-[64px] transition-colors duration-500"
                style={{ color: i === active ? "#ff6b2c" : "rgba(237,230,216,0.16)" }}
              >
                0{i + 1}
              </span>
              <h3 className="max-w-[22ch] font-display text-[clamp(1.6rem,3.1vw,2.5rem)] leading-[1.06] font-semibold text-bone">
                {state.title}
              </h3>
              <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed text-bone-dim">
                {state.body}
              </p>
              <div className="mt-7 flex items-center gap-3">
                <span
                  className="h-px w-10 transition-all duration-700"
                  style={{
                    backgroundColor: i === active ? "#ff6b2c" : "rgba(237,230,216,0.2)",
                  }}
                />
                <span className="font-mono text-[10px] tracking-[0.2em] text-bone-dim/70 uppercase">
                  graph {String(i + 1).padStart(2, "0")} / 03
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
