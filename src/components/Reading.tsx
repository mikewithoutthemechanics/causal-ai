import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/motion";
import { OBJECTIONS, TEAM_SIZES } from "../lib/data";
import { SectionLabel } from "./Chrome";

gsap.registerPlugin(ScrollTrigger);

type Errors = Partial<Record<"email" | "name" | "company" | "metric", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const NEXT_STEPS = [
  {
    step: "01",
    title: "You send a read-only connector",
    body: "Snowflake, BigQuery, Databricks or Postgres. No CSV uploads, no data leaving your perimeter.",
  },
  {
    step: "02",
    title: "We pick the metric that hurts",
    body: "One number you already report. LTV, churn, readmissions, CAC payback — whatever keeps you awake.",
  },
  {
    step: "03",
    title: "You leave with a named lever",
    body: "An effect size, a confidence interval, and the assumptions it rests on. If nothing causal survives, we say so and you pay nothing.",
  },
];

export default function Reading() {
  const rootRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState({
    name: "",
    email: "",
    company: "",
    size: TEAM_SIZES[2],
    metric: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "casting" | "done">("idle");

  useGSAP(
    () => {
      gsap.to(orbRef.current, {
        y: -18,
        rotate: 6,
        duration: 5.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.fromTo(
        "[data-step]",
        { autoAlpha: 0, x: -28 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.95,
          ease: "spell",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-steps]", start: "top 80%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "We need something to call you.";
    if (!values.email.trim()) next.email = "Where do we send the reading?";
    else if (!EMAIL_RE.test(values.email.trim())) next.email = "That email won't reach you.";
    if (!values.company.trim()) next.company = "Which organisation?";
    if (!values.metric.trim()) next.metric = "Name the metric you want explained.";
    return next;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      const field = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      if (field) {
        gsap.fromTo(
          field.closest("[data-field]"),
          { x: -9 },
          { x: 0, duration: 0.55, ease: "elastic.out(1, 0.28)" },
        );
        field.focus();
      }
      return;
    }

    setStatus("casting");
    window.setTimeout(() => {
      setStatus("done");
      gsap.fromTo(
        successRef.current,
        { autoAlpha: 0, y: 34, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "spell" },
      );
      gsap.fromTo(
        successRef.current?.querySelectorAll("[data-success-line]") ?? [],
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "spell", stagger: 0.09, delay: 0.25 },
      );
    }, 1150);
  };

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const fieldClass = (invalid?: string) =>
    `w-full rounded-sm border bg-ink/70 px-4 py-3.5 text-[14.5px] text-bone placeholder:text-bone-dim/40 outline-none transition-colors duration-300 ${
      invalid
        ? "border-blood/70 focus:border-blood"
        : "border-bone/14 focus:border-ember/70 hover:border-bone/28"
    }`;

  useEffect(() => {
    if (status === "done" && successRef.current) {
      successRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [status]);

  return (
    <section
      id="reading"
      ref={rootRef}
      className="relative overflow-hidden border-t border-bone/8 bg-ink py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(255,107,44,0.11),transparent_62%)]" />
      <div
        ref={orbRef}
        className="pointer-events-none absolute -right-24 bottom-0 hidden h-[420px] w-[420px] opacity-45 will-change-transform xl:block"
        aria-hidden="true"
      >
        <img src="/img/orb.png" alt="" className="h-full w-full object-contain" />
      </div>

      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* left: pitch + steps */}
        <div className="lg:col-span-5">
          <SectionLabel index="VIII" tone="ember">
            The causal reading
          </SectionLabel>
          <h2
            data-reveal="lines"
            className="display-xl mt-6 text-[clamp(2.3rem,5.6vw,4.4rem)] text-bone"
          >
            Forty-five minutes. Your data. One{" "}
            <span className="italic-wonk text-ember">named lever</span>.
          </h2>
          <p data-reveal="up" className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-bone-dim">
            Not a demo. We connect to a sample of your warehouse before the call, run the
            graph discovery live, and hand you a causal finding you can act on — whether or
            not you ever buy anything.
          </p>

          <ul className="mt-8 space-y-3" data-reveal-group data-reveal-stagger="0.08">
            {OBJECTIONS.map((line) => (
              <li key={line} data-reveal="left" className="flex items-start gap-3">
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rotate-45 bg-chalk" />
                <span className="text-[14.4px] leading-relaxed text-bone/85">{line}</span>
              </li>
            ))}
          </ul>

          <div data-steps className="mt-12 space-y-6 border-t border-bone/10 pt-9">
            <span className="eyebrow">What happens next</span>
            {NEXT_STEPS.map((item) => (
              <div key={item.step} data-step className="flex gap-5">
                <span className="numeral w-10 shrink-0 text-[26px] text-ember/75">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-[17px] font-semibold text-bone">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 max-w-[42ch] text-[13.8px] leading-relaxed text-bone-dim">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right: form */}
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="card-arcane corner-tick relative rounded-sm p-6 sm:p-9">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_70%_at_0%_0%,rgba(201,162,39,0.09),transparent_58%)]" />

            {status === "done" ? (
              <div ref={successRef} className="relative py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-chalk/50 bg-chalk/10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 12.5l5 5L20 6.5"
                        stroke="#6fe3d0"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.24em] text-chalk uppercase">
                      reading cast
                    </p>
                    <h3 className="font-display text-[24px] font-semibold text-bone">
                      The circle is drawn, {values.name.split(" ")[0]}.
                    </h3>
                  </div>
                </div>

                <p data-success-line className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-bone-dim">
                  A causal engineer — not an SDR — will reply within one business day with
                  three slots and a two-question prep sheet.
                </p>

                <dl
                  data-success-line
                  className="mt-7 space-y-3 border-y border-bone/10 py-5 font-mono text-[12px]"
                >
                  <div className="flex justify-between gap-4">
                    <dt className="tracking-[0.16em] text-bone-dim/60 uppercase">metric</dt>
                    <dd className="text-right text-bone">{values.metric}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="tracking-[0.16em] text-bone-dim/60 uppercase">org</dt>
                    <dd className="text-right text-bone">
                      {values.company} · {values.size}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="tracking-[0.16em] text-bone-dim/60 uppercase">sent to</dt>
                    <dd className="text-right text-chalk">{values.email}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  data-success-line
                  onClick={() => {
                    setStatus("idle");
                    setValues({ name: "", email: "", company: "", size: TEAM_SIZES[2], metric: "" });
                  }}
                  className="btn-ghost mt-7 px-6 py-3 text-[13px]"
                >
                  <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase">
                    Cast another reading
                  </span>
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
                <div className="flex items-center justify-between gap-4 border-b border-bone/10 pb-4">
                  <span className="font-mono text-[10px] tracking-[0.24em] text-bone-dim uppercase">
                    request a reading
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-chalk uppercase">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-chalk" />
                    4 slots left this month
                  </span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label data-field className="block sm:col-span-1">
                    <span className="mb-2 block font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                      Your name
                    </span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={set("name")}
                      placeholder="Ada Lovelace"
                      className={fieldClass(errors.name)}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <span className="mt-1.5 block font-mono text-[10px] text-blood">
                        {errors.name}
                      </span>
                    )}
                  </label>

                  <label data-field className="block sm:col-span-1">
                    <span className="mb-2 block font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                      Work email
                    </span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={set("email")}
                      placeholder="ada@company.com"
                      className={fieldClass(errors.email)}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <span className="mt-1.5 block font-mono text-[10px] text-blood">
                        {errors.email}
                      </span>
                    )}
                  </label>

                  <label data-field className="block sm:col-span-2">
                    <span className="mb-2 block font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                      Organisation
                    </span>
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={values.company}
                      onChange={set("company")}
                      placeholder="Northwind Retail"
                      className={fieldClass(errors.company)}
                      aria-invalid={!!errors.company}
                    />
                    {errors.company && (
                      <span className="mt-1.5 block font-mono text-[10px] text-blood">
                        {errors.company}
                      </span>
                    )}
                  </label>

                  <label data-field className="block sm:col-span-1">
                    <span className="mb-2 block font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                      Data team size
                    </span>
                    <select
                      name="size"
                      value={values.size}
                      onChange={set("size")}
                      className={`${fieldClass()} appearance-none`}
                    >
                      {TEAM_SIZES.map((size) => (
                        <option key={size} value={size} className="bg-ink text-bone">
                          {size}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label data-field className="block sm:col-span-1">
                    <span className="mb-2 block font-mono text-[9.5px] tracking-[0.2em] text-bone-dim/70 uppercase">
                      The metric that hurts
                    </span>
                    <input
                      name="metric"
                      type="text"
                      value={values.metric}
                      onChange={set("metric")}
                      placeholder="Net revenue retention"
                      className={fieldClass(errors.metric)}
                      aria-invalid={!!errors.metric}
                    />
                    {errors.metric && (
                      <span className="mt-1.5 block font-mono text-[10px] text-blood">
                        {errors.metric}
                      </span>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={status === "casting"}
                  data-magnetic="0.14"
                  className="btn-ember mt-8 w-full justify-center px-7 py-4.5 text-[15px] disabled:cursor-wait disabled:opacity-75"
                >
                  {status === "casting" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      Casting the graph…
                    </>
                  ) : (
                    <>
                      Book my Causal Reading
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="mt-4 text-center font-mono text-[9.5px] leading-relaxed tracking-[0.14em] text-bone-dim/55 uppercase">
                  No sequences. No “quick sync”. One engineer, one call, one finding.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
