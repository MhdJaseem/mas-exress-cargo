import { useEffect } from 'react';
import { setScroller } from '../lib/scroll';
import { setActiveSection } from '../lib/activeSection';

/**
 * Home page scroll engine (ported from the original home.js).
 *
 * - "Stack mode" (≥900px, no reduced motion): the `.stack` sections inside <main> become sticky
 *   full-screen cards that slide over each other; `--p` (0..1) drives a subtle scale / dim of the
 *   card being covered. Toggles `html.stackmode`.
 * - Inertial smooth wheel / keyboard scrolling on mouse devices.
 * - Registers a scroller so links (HashLink, router hash navigation) land exactly on a section.
 * - Reports the section on screen to the header (lib/activeSection).
 *
 * Everything is undone on unmount, so other routes get normal native scrolling.
 */
export function useHomeScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const main = document.getElementById('main');
    if (!main) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smoothOK = !reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const mqStack = window.matchMedia('(min-width:900px)');
    const children = () => Array.from(main.children) as HTMLElement[];

    let stackOn = false;
    let stack: HTMLElement[] = [];
    let tops: { el: HTMLElement; top: number; h: number }[] = [];
    let lastY = window.scrollY;

    const cleanups: Array<() => void> = [];
    const listen = <K extends keyof WindowEventMap>(
      type: K,
      fn: (e: WindowEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      window.addEventListener(type, fn, opts);
      cleanups.push(() => window.removeEventListener(type, fn, opts));
    };

    /* ---------- layout: sticky offsets + flow positions ---------- */
    function flow() {
      tops = [];
      let y = main!.getBoundingClientRect().top + window.scrollY;
      children().forEach((c) => {
        const h = c.offsetHeight;
        tops.push({ el: c, top: y, h });
        y += h;
      });
    }
    function layout() {
      const vh = window.innerHeight;
      stackOn = mqStack.matches && !reduce && CSS.supports('position', 'sticky');
      html.classList.toggle('stackmode', stackOn);
      stack = children().filter((c) => c.classList.contains('stack'));
      stack.forEach((el) => {
        if (stackOn) {
          el.style.top = Math.min(8, vh - el.offsetHeight - 8) + 'px';
        } else {
          el.style.top = '';
          el.style.transform = '';
          el.style.filter = '';
          el.style.removeProperty('--p');
        }
      });
      flow();
      update();
    }

    /* ---------- scroll-linked update ---------- */
    function update() {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const vis = stack.filter((el) => el.offsetHeight > 0);
      if (stackOn) {
        vis.forEach((el, i) => {
          let p = 0;
          if (i < vis.length - 1)
            p = Math.max(0, Math.min(1, (vh - vis[i + 1].getBoundingClientRect().top) / (vh - 8)));
          el.style.transform = p > 0 ? `scale(${(1 - 0.05 * p).toFixed(4)})` : '';
          el.style.filter = p > 0 ? `brightness(${(1 - 0.34 * p).toFixed(3)})` : '';
          el.style.setProperty('--p', p.toFixed(3));
        });
      }
      // which section is on screen?
      const mid = sy + vh * 0.45;
      let cur = 'home';
      tops.forEach((t) => {
        if (t.el.classList.contains('stack') && t.h > 0 && t.top <= mid) cur = t.el.id;
      });
      setActiveSection(cur);
    }
    let queued = false;
    const onScrollFrame = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };

    /* ---------- smooth, inertial wheel scrolling ---------- */
    let cur = window.scrollY;
    let tgt = cur;
    let raf = 0;
    const maxY = () => html.scrollHeight - window.innerHeight;
    const tick = () => {
      cur += (tgt - cur) * 0.1;
      if (Math.abs(tgt - cur) < 0.5) {
        cur = tgt;
        raf = 0;
      } else raf = requestAnimationFrame(tick);
      lastY = cur;
      window.scrollTo(0, cur);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const goTo = (y: number) => {
      y = Math.max(0, Math.min(y, maxY()));
      if (smoothOK) {
        tgt = y;
        kick();
      } else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    };

    if (smoothOK) {
      html.style.scrollBehavior = 'auto';
      listen(
        'wheel',
        (e) => {
          if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
          // let scrollable inner elements (menus, tables…) scroll themselves
          let n = e.target as HTMLElement | null;
          while (n && n !== document.body && n.nodeType === 1) {
            const cs = getComputedStyle(n);
            if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && n.scrollHeight > n.clientHeight + 1) return;
            n = n.parentElement;
          }
          e.preventDefault();
          let d = e.deltaY;
          if (e.deltaMode === 1) d *= 32;
          else if (e.deltaMode === 2) d *= window.innerHeight;
          tgt = Math.max(0, Math.min(maxY(), tgt + d));
          kick();
        },
        { passive: false },
      );
      listen('keydown', (e) => {
        const tg = e.target as HTMLElement | null;
        if (
          (tg && /INPUT|TEXTAREA|SELECT|BUTTON/.test(tg.tagName)) ||
          tg?.isContentEditable ||
          e.ctrlKey ||
          e.metaKey ||
          e.altKey
        )
          return;
        const k = e.key;
        let d: number | null = null;
        if (k === 'PageDown' || (k === ' ' && !e.shiftKey)) d = window.innerHeight * 0.9;
        else if (k === 'PageUp' || (k === ' ' && e.shiftKey)) d = -window.innerHeight * 0.9;
        else if (k === 'ArrowDown') d = 70;
        else if (k === 'ArrowUp') d = -70;
        else if (k === 'Home') {
          e.preventDefault();
          goTo(0);
          return;
        } else if (k === 'End') {
          e.preventDefault();
          goTo(maxY());
          return;
        }
        if (d === null) return;
        e.preventDefault();
        goTo(tgt + d);
      });
    }
    listen(
      'scroll',
      () => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 2) {
          cur = tgt = y;
          lastY = y;
        }
        onScrollFrame();
      },
      { passive: true },
    );

    /* ---------- section navigation (used by HashLink + router hash) ---------- */
    const stackOf = (el: HTMLElement) => {
      let n: HTMLElement | null = el;
      while (n && n.parentElement !== main) n = n.parentElement;
      return n;
    };
    const goToEl = (el: HTMLElement) => {
      layout();
      const s = stackOf(el);
      const rec = tops.find((t) => t.el === s);
      const y =
        stackOn && rec
          ? rec.top
          : (rec ? rec.top : el.getBoundingClientRect().top + window.scrollY) - (el.id === 'home' ? 0 : 72);
      goTo(y);
    };
    setScroller({ toElement: goToEl, toTop: () => goTo(0) });

    /* ---------- boot ---------- */
    let rt = 0;
    const relayout = () => {
      cancelAnimationFrame(rt);
      rt = requestAnimationFrame(layout);
    };
    listen('resize', relayout);
    listen('load', relayout);
    let alive = true;
    document.fonts?.ready.then(() => alive && relayout());
    const ro = new ResizeObserver(relayout);
    ro.observe(main);
    children().forEach((c) => ro.observe(c));
    mqStack.addEventListener('change', relayout);
    layout();

    return () => {
      alive = false;
      cleanups.forEach((f) => f());
      mqStack.removeEventListener('change', relayout);
      ro.disconnect();
      cancelAnimationFrame(rt);
      cancelAnimationFrame(raf);
      setScroller(null);
      setActiveSection('');
      html.classList.remove('stackmode');
      html.style.scrollBehavior = '';
      stack.forEach((el) => {
        el.style.top = '';
        el.style.transform = '';
        el.style.filter = '';
        el.style.removeProperty('--p');
      });
    };
  }, []);
}
