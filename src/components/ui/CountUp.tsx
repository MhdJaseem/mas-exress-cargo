import { useEffect, useRef, useState } from 'react';

/**
 * Animated number for stats. `value` is the final text, e.g. "850", "99.8", "12+", "95%", "24/7".
 * The leading number counts up (ease-out) the first time it scrolls into view; any suffix is kept.
 * Text that does not start with a number ("24/7") is shown as-is. Respects reduced motion.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    const el = ref.current;
    if (!m || !el || /^\d+\/\d+/.test(value)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const end = parseFloat(m[1]);
    const suffix = m[2];
    const dec = (m[1].split('.')[1] ?? '').length;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        let t0 = 0;
        const step = (t: number) => {
          if (!t0) t0 = t;
          const p = Math.min((t - t0) / duration, 1);
          setText((end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        setText((0).toFixed(dec) + suffix);
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      setText(value);
    };
  }, [value, duration]);

  return <span ref={ref}>{text}</span>;
}
