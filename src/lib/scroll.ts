/** Smoothly scroll to an element by selector, with an optional pixel offset. */
export function scrollToId(selector: string, offset = 0) {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}

/** Current normalised page progress, 0 → 1. */
export function pageProgress(): number {
  const max = (document.documentElement.scrollHeight || 1) - window.innerHeight;
  const scroll = window.scrollY || document.documentElement.scrollTop || 0;
  return max > 0 ? Math.min(1, Math.max(0, scroll / max)) : 0;
}
