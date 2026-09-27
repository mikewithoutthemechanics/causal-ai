/* ─────────────────────────────────────────────────────────────────────────
   All copy + structured content for The Wizard.
   ───────────────────────────────────────────────────────────────────────── */

export const NAV_LINKS = [
  { label: "The Illusion", href: "#illusion" },
  { label: "The Ladder", href: "#ladder" },
  { label: "Spells", href: "#spells" },
  { label: "Proof", href: "#proof" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const TICKER_WORDS = [
  "do-calculus",
  "backdoor adjustment",
  "counterfactuals",
  "uplift modelling",
  "instrumental variables",
  "confounder discovery",
  "double machine learning",
  "structural equations",
  "mediation paths",
  "propensity scores",
  "d-separation",
  "average treatment effects",
];

export const CLIENT_MARKS = [
  "NORTHWIND",
  "KESSLER·CO",
  "OBSIDIAN LABS",
  "MERIDIAN HEALTH",
  "FATHOM",
  "BLUEGRAIN",
  "HELIOSTAT",
  "VANTA FREIGHT",
];

/* ── The Illusion: three rewiring causal graphs ─────────────────────────── */

export type NodeKind =
  | "exposure"
  | "outcome"
  | "confounder"
  | "mediator"
  | "hidden";

export interface GraphNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  kind: NodeKind;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: "causal" | "spurious" | "backdoor" | "blocked";
  label?: string;
}

export interface GraphState {
  id: string;
  kicker: string;
  title: string;
  body: string;
  verdict: string;
  verdictTone: "bad" | "warn" | "good";
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const GRAPH_STATES: GraphState[] = [
  {
    id: "spurious",
    kicker: "Exhibit A · 1998, still taught",
    title: "Ice cream sells. People drown. Your model panics.",
    body: "Every correlation engine on earth will tell you these two lines move together — and it is 100% correct and 100% useless. There is a third variable standing in the fog, pulling both strings. Act on the correlation and you ban ice cream at the beach. The drownings continue.",
    verdict: "Correlation found. Cause: none.",
    verdictTone: "bad",
    nodes: [
      { id: "ice", label: "Ice cream sales", sub: "exposure", x: 16, y: 68, kind: "exposure" },
      { id: "drown", label: "Drownings", sub: "outcome", x: 84, y: 68, kind: "outcome" },
      { id: "summer", label: "Summer heat", sub: "confounder", x: 50, y: 18, kind: "confounder" },
    ],
    edges: [
      { from: "summer", to: "ice", kind: "causal" },
      { from: "summer", to: "drown", kind: "causal" },
      { from: "ice", to: "drown", kind: "spurious", label: "r = 0.87" },
    ],
  },
  {
    id: "mediator",
    kicker: "Exhibit B · your Q3 churn deck",
    title: "The top predictor in your dashboard is a symptom.",
    body: "‘Users who open the weekly digest don't churn’ — so the growth team ships more digests. Opens go up. Churn doesn't move an inch. The digest was never the cause; it was downstream of the thing that actually keeps people: a working first session. You optimised the thermometer.",
    verdict: "Lever pulled. Number: unmoved.",
    verdictTone: "warn",
    nodes: [
      { id: "onboard", label: "Successful onboarding", sub: "true cause", x: 14, y: 20, kind: "confounder" },
      { id: "digest", label: "Opens weekly digest", sub: "top feature", x: 50, y: 68, kind: "mediator" },
      { id: "churn", label: "Churn risk", sub: "outcome", x: 86, y: 20, kind: "outcome" },
    ],
    edges: [
      { from: "onboard", to: "digest", kind: "causal" },
      { from: "onboard", to: "churn", kind: "causal", label: "the real arrow" },
      { from: "digest", to: "churn", kind: "spurious", label: "importance 0.41" },
    ],
  },
  {
    id: "causal",
    kicker: "Exhibit C · what The Wizard returns",
    title: "Same data. Now with the arrows pointing the right way.",
    body: "The Wizard learns the causal structure first, closes the backdoor paths, then estimates what happens if you intervene — not what happened to people who happened to be different. One ranked list of levers, each with an effect size and a confidence interval you can defend in a board meeting.",
    verdict: "do(price) → LTV +18.4% [14.1, 22.9]",
    verdictTone: "good",
    nodes: [
      { id: "lever", label: "Price experiment", sub: "do( )", x: 14, y: 50, kind: "exposure" },
      { id: "season", label: "Seasonality", sub: "closed", x: 50, y: 12, kind: "hidden" },
      { id: "mix", label: "Channel mix", sub: "mediator", x: 50, y: 88, kind: "mediator" },
      { id: "ltv", label: "Customer LTV", sub: "outcome", x: 86, y: 50, kind: "outcome" },
    ],
    edges: [
      { from: "lever", to: "mix", kind: "causal" },
      { from: "mix", to: "ltv", kind: "causal" },
      { from: "lever", to: "ltv", kind: "causal", label: "+18.4%" },
      { from: "season", to: "lever", kind: "blocked", label: "adjusted" },
      { from: "season", to: "ltv", kind: "blocked" },
    ],
  },
];

/* ── ScrollyWorld: the Causal Ladder ────────────────────────────────────── */

export interface Rung {
  id: string;
  index: string;
  name: string;
  rung: string;
  formula: string;
  question: string;
  body: string;
  capability: string;
  accent: string;
}

export const RUNGS: Rung[] = [
  {
    id: "seeing",
    index: "01",
    name: "Association",
    rung: "Rung I · Seeing",
    formula: "P( y | x )",
    question: "“What does it look like?”",
    body: "Every dashboard, every classifier, every ‘AI-powered insight’ you have ever bought lives here. It is the rung where machines are brilliant and useless: they can tell you that the pattern exists, and nothing about whether touching it does anything.",
    capability: "Pattern recognition · forecasting · segmentation",
    accent: "#9d9484",
  },
  {
    id: "doing",
    index: "02",
    name: "Intervention",
    rung: "Rung II · Doing",
    formula: "P( y | do(x) )",
    question: "“What if I change it?”",
    body: "The moment you ask what happens when you act, correlation collapses. The Wizard builds the causal graph from your observational data, closes the backdoors, and estimates the effect of an intervention you have never run — no A/B test, no holdout, no waiting six weeks for significance.",
    capability: "Effect estimation · lever ranking · experiment triage",
    accent: "#ff6b2c",
  },
  {
    id: "imagining",
    index: "03",
    name: "Counterfactuals",
    rung: "Rung III · Imagining",
    formula: "P( yₓ | x′, y′ )",
    question: "“What if we had done it differently?”",
    body: "The top rung, and the one no other tool climbs. Replay last quarter under a decision you didn't make. Attribute a churned account to the specific week it was lost. Answer the question your CFO actually asks — and answer it with a number, not a narrative.",
    capability: "Counterfactual replay · true attribution · scenario war-gaming",
    accent: "#6fe3d0",
  },
];

/* ── The Five Spells ────────────────────────────────────────────────────── */

export interface Spell {
  id: string;
  numeral: string;
  name: string;
  incantation: string;
  body: string;
  bullets: string[];
  stat: string;
  statLabel: string;
  accent: string;
}

export const SPELLS: Spell[] = [
  {
    id: "hunt",
    numeral: "I",
    name: "Confounder Hunt",
    incantation: "reveal what hides between",
    body: "Point it at a warehouse table and it maps the causal structure underneath — surfacing the hidden variables quietly manufacturing your ‘insights’.",
    bullets: [
      "Automatic DAG discovery from observational data",
      "Backdoor & frontdoor path enumeration",
      "Colliders flagged before you condition on them",
    ],
    stat: "312",
    statLabel: "confounders surfaced in the last 30 days",
    accent: "#ff6b2c",
  },
  {
    id: "oracle",
    numeral: "II",
    name: "Uplift Oracle",
    incantation: "who is actually persuadable",
    body: "Stop spending on people who were going to convert anyway. The Oracle separates the persuadables from the sure-things and the do-not-disturbs.",
    bullets: [
      "Individual-level treatment effects (CATE)",
      "Persuadable / lost-cause / sleeping-dog segmentation",
      "Direct handoff to your campaign tooling",
    ],
    stat: "4.2×",
    statLabel: "median lift on incremental spend",
    accent: "#c9a227",
  },
  {
    id: "replay",
    numeral: "III",
    name: "Counterfactual Replay",
    incantation: "run the quarter that never happened",
    body: "Rewind any window, apply the decision you didn't make, and watch the alternate timeline diverge — with uncertainty bands, not vibes.",
    bullets: [
      "Scenario diffing against the factual timeline",
      "Sensitivity analysis on every assumption",
      "Exportable, board-ready causal briefs",
    ],
    stat: "18k",
    statLabel: "counterfactual worlds simulated weekly",
    accent: "#6fe3d0",
  },
  {
    id: "levers",
    numeral: "IV",
    name: "Lever Ranking",
    incantation: "one list, ordered by truth",
    body: "Every controllable variable in your business, ranked by verified causal impact on the metric you care about, with the effort to move it attached.",
    bullets: [
      "Effect size + 95% CI per lever",
      "ROI-per-unit-of-effort ordering",
      "Refreshed nightly against fresh data",
    ],
    stat: "61%",
    statLabel: "of roadmap items deprioritised on evidence",
    accent: "#d6413b",
  },
  {
    id: "autopsy",
    numeral: "V",
    name: "Anomaly Autopsy",
    incantation: "why did the number move",
    body: "When a KPI jumps or craters, the Autopsy walks the graph and names the upstream cause — before the Monday meeting where everyone has a theory.",
    bullets: [
      "Root-cause decomposition in under 90 seconds",
      "Rules out coincidental co-movement",
      "Slack & Teams alerts with the causal chain attached",
    ],
    stat: "90s",
    statLabel: "median time from alert to named cause",
    accent: "#ffa05c",
  },
];

/* ── Proof ──────────────────────────────────────────────────────────────── */

export const STATS = [
  { value: 4.2, suffix: "×", decimals: 1, label: "Median lift on incremental spend", note: "n = 148 deployments" },
  { value: 61, suffix: "%", decimals: 0, label: "Of roadmap items killed on evidence", note: "before a line of code" },
  { value: 18.4, prefix: "$", suffix: "M", decimals: 1, label: "Verified waste removed in 2025", note: "audited by client finance teams" },
  { value: 9, suffix: " days", decimals: 0, label: "From warehouse connect to first lever", note: "median onboarding" },
];

export interface CaseStudy {
  id: string;
  company: string;
  sector: string;
  image: string;
  headline: string;
  before: string;
  after: string;
  metric: string;
  metricLabel: string;
  quote: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "northwind",
    company: "Northwind Retail",
    sector: "Retail · 2.1M customers",
    image: "/img/lab.jpg",
    headline: "They were about to spend €6M on free shipping. The graph said no.",
    before: "Correlation model ranked free shipping as the #1 LTV driver. Budget approved.",
    after: "The Wizard showed shipping sat downstream of basket intent. The real lever was delivery-window choice.",
    metric: "€6.0M",
    metricLabel: "redirected, not spent",
    quote:
      "It killed a project three VPs loved, in nine days, with a confidence interval. That is the whole pitch.",
  },
  {
    id: "meridian",
    company: "Meridian Health",
    sector: "Care delivery · 340 sites",
    image: "/img/alchemy.jpg",
    headline: "Readmission dropped 22% — and for once they knew why.",
    before: "Six concurrent interventions. Nobody could attribute anything. Funders were asking.",
    after: "Counterfactual replay isolated the discharge-call protocol as 78% of the effect.",
    metric: "22%",
    metricLabel: "readmission reduction, attributed",
    quote:
      "We had the outcome for a year and no idea what caused it. The Wizard handed us the mechanism.",
  },
  {
    id: "fathom",
    company: "Fathom",
    sector: "B2B SaaS · Series C",
    image: "/img/storm.jpg",
    headline: "Churn model rebuilt around a symptom. Retention moved 31%.",
    before: "Top predictor was ‘opened the weekly digest’. Three quarters of digest experiments, zero lift.",
    after: "The true cause was time-to-first-value in week one. Onboarding got rebuilt around it.",
    metric: "31%",
    metricLabel: "logo retention lift in two quarters",
    quote:
      "Our whole growth org was optimising a thermometer. Embarrassing, and then extremely profitable.",
  },
];

/* ── Testimonials ───────────────────────────────────────────────────────── */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  tilt: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I have bought four ‘AI insight’ platforms. This is the first one that ever told me not to do something.",
    name: "Dana Okonkwo",
    role: "Chief Data Officer, Bluegrain",
    initials: "DO",
    tilt: -2.4,
  },
  {
    id: "t2",
    quote:
      "The counterfactual replay ended a two-year argument between marketing and finance in one afternoon.",
    name: "Marcus Vail",
    role: "VP Growth, Heliostat",
    initials: "MV",
    tilt: 1.8,
  },
  {
    id: "t3",
    quote:
      "Our analysts stopped building decks defending decisions and started building them from evidence.",
    name: "Ines Kovač",
    role: "Head of Decision Science, Vanta Freight",
    initials: "IK",
    tilt: -1.2,
  },
  {
    id: "t4",
    quote:
      "It found a collider we had been conditioning on for eighteen months. Eighteen. Months.",
    name: "Theo Brandt",
    role: "Principal ML Engineer, Obsidian Labs",
    initials: "TB",
    tilt: 2.6,
  },
];

/* ── Pricing ────────────────────────────────────────────────────────────── */

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: string[];
  cta: string;
  featured?: boolean;
  note?: string;
}

export const PLANS: Plan[] = [
  {
    id: "apprentice",
    name: "Apprentice",
    tagline: "For the analyst who is done being ignored in meetings.",
    monthly: 890,
    annual: 712,
    features: [
      "1 connected warehouse",
      "Confounder Hunt + Lever Ranking",
      "Up to 5 target metrics",
      "Weekly causal brief (PDF)",
      "Email support, 1 business day",
    ],
    cta: "Start the apprenticeship",
  },
  {
    id: "wizard",
    name: "The Wizard",
    tagline: "For teams making expensive decisions every week.",
    monthly: 2940,
    annual: 2352,
    features: [
      "Unlimited warehouses & metrics",
      "All five spells, including Counterfactual Replay",
      "Uplift Oracle with CATE export",
      "Anomaly Autopsy → Slack / Teams",
      "Python + SQL API, nightly refresh",
      "Named causal engineer, 4h response",
    ],
    cta: "Book a Causal Reading",
    featured: true,
    note: "Chosen by 71% of teams",
  },
  {
    id: "grimoire",
    name: "Grimoire",
    tagline: "For regulated estates that need the maths on the record.",
    monthly: 0,
    annual: 0,
    features: [
      "Everything in The Wizard",
      "VPC or on-premise deployment",
      "SOC 2 Type II · HIPAA · model cards",
      "Full assumption & sensitivity audit trail",
      "Board-ready attestation packs",
      "Quarterly on-site calibration workshop",
    ],
    cta: "Request the Grimoire terms",
    note: "Custom · from $9k/mo",
  },
];

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const FAQS = [
  {
    q: "Is this just another ML platform with a nicer slide deck?",
    a: "No. Predictive ML answers ‘what will happen’. The Wizard answers ‘what happens if I do this’ and ‘what would have happened if I had done that instead’. Those are mathematically different questions — the second and third cannot be answered from correlation alone, no matter how much data or how deep the network. We use structural causal models, do-calculus and doubly-robust estimators, not gradient boosting with a marketing wrapper.",
  },
  {
    q: "Do we need to run experiments for it to work?",
    a: "No — that is the point. The Wizard estimates causal effects from the observational data you already generate. Where an experiment exists, it will use it to validate and tighten the estimate. Most clients run their first lever ranking in week two without changing a single line of instrumentation.",
  },
  {
    q: "How long does onboarding take?",
    a: "Median nine days from warehouse connection to first ranked lever list. Day one is a read-only connector to Snowflake, BigQuery, Databricks or Postgres. Days two to four are structure discovery and assumption review with your analysts. The rest is calibration against a metric you already trust.",
  },
  {
    q: "What if the causal graph is wrong?",
    a: "Then you should not act on it, and we built for that. Every estimate ships with its identifying assumptions made explicit, a sensitivity analysis showing how the answer moves if an assumption bends, and a refutation test suite. If the effect is fragile, the UI says so in plain language rather than hiding it behind a confidence bar.",
  },
  {
    q: "Will our data scientists hate it?",
    a: "They tend to like it. Everything is exposed through a Python and SQL API, the DAGs are editable, and the estimators are inspectable. It removes the tedious part of causal work — graph search, adjustment set computation, refutation — and leaves the part they actually trained for.",
  },
  {
    q: "How is this different from DoWhy, CausalML or EconML?",
    a: "Those are excellent libraries, and we use ideas from all of them. They are also toolkits: an engineer has to specify the graph, choose the estimator, wire the refutation, and build the reporting. The Wizard is the productised layer on top — automated structure discovery, governed assumptions, ranked business levers, and an audit trail your finance team will accept.",
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const OBJECTIONS = [
  "No credit card. No 14-day timer.",
  "45 minutes. Your data. One named lever.",
  "If we find nothing causal, we tell you — and you pay nothing.",
];

export const TEAM_SIZES = [
  "Just me",
  "2–10",
  "11–50",
  "51–200",
  "200+",
];
