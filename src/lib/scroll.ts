/* Scrolling helpers shared by links, the router scroll manager and the home page.

   The home page installs its own scroller (stacking cards + inertial wheel scrolling, see
   hooks/useHomeScroll.ts) while it is mounted. Every other page uses native smooth scrolling,
   which respects the `scroll-padding-top` set on <html> in main.css. */

export interface Scroller {
  toElement(el: HTMLElement): void;
  toTop(): void;
}

let active: Scroller | null = null;

/** Called by the home page scroll engine on mount (scroller) and unmount (null). */
export function setScroller(s: Scroller | null) {
  active = s;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToElement(el: HTMLElement) {
  if (active) return active.toElement(el);
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

export function scrollToTop(smooth = true) {
  if (smooth && active) return active.toTop();
  window.scrollTo({ top: 0, behavior: smooth && !reducedMotion() ? 'smooth' : 'instant' });
}

/** Scrolls to the element with this id. Returns false when it is not on the current page. */
export function scrollToId(id: string): boolean {
  if (!id || id === 'top') {
    scrollToTop();
    return true;
  }
  const el = document.getElementById(id);
  if (!el) return false;
  scrollToElement(el);
  // The tracking form: put the cursor in the tracking number field once the scroll settles.
  if (id === 'hero-track') {
    window.setTimeout(() => document.getElementById('trk')?.focus({ preventScroll: true }), 700);
  }
  return true;
}
