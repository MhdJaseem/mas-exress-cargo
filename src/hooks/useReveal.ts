import { useEffect } from 'react';

/**
 * Reveal-on-scroll for every `.reveal` element inside <main id="main">.
 *
 * - 'inner' (service / company pages): adds `.in` when 12% visible. Styles in inner.css (`.inner .reveal`).
 * - 'home': adds `.in` when 15% visible, then removes `.reveal`/`.in` once the transition ends so hover
 *   transforms work normally afterwards. Service cards (`.svc`) also get `.drawn` (line-art drawing).
 *
 * Each element gets `--i` = its index among `.reveal` siblings, used for the stagger delay.
 * Call once per page component; it re-runs when the page remounts.
 */
export function useReveal(mode: 'home' | 'inner') {
  useEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    const els = Array.from(main.querySelectorAll<HTMLElement>('.reveal'));
    els.forEach((el) => {
      const sibs = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains('reveal'));
      el.style.setProperty('--i', String(sibs.indexOf(el)));
    });

    const html = document.documentElement;
    if (mode === 'home') {
      // line-art draw prep for the service cards
      main.querySelectorAll<SVGElement>('.svc .art').forEach((a) => {
        a.querySelectorAll<SVGElement>('path,rect,circle,line,polygon,ellipse').forEach((n, k) => {
          n.setAttribute('pathLength', '1');
          n.style.setProperty('--k', String(k));
        });
      });
      html.classList.add('anim');
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || (mode === 'inner' && reduce)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    const timers: number[] = [];
    const reveal = (el: HTMLElement) => {
      el.classList.add('in');
      if (mode === 'inner') return;
      if (el.classList.contains('svc')) el.classList.add('drawn');
      const fin = () => {
        el.classList.remove('reveal', 'in');
        el.style.removeProperty('--i');
      };
      const t = window.setTimeout(fin, 2400);
      timers.push(t);
      const onEnd = (e: TransitionEvent) => {
        if (e.target === el && e.propertyName === 'transform') {
          window.clearTimeout(t);
          el.removeEventListener('transitionend', onEnd);
          fin();
        }
      };
      el.addEventListener('transitionend', onEnd);
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            reveal(e.target as HTMLElement);
          }
        }),
      mode === 'home' ? { threshold: 0.15, rootMargin: '0px 0px -6% 0px' } : { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      if (mode === 'home') html.classList.remove('anim');
    };
  }, [mode]);
}
