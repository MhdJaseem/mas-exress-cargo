import { useEffect, useId, useRef } from 'react';

// Rising growth curve (viewBox 200×60): gentle start, steeper climb at the end.
const CURVE = 'M2 50C30 48 40 40 62 42S96 34 116 30S150 26 166 18S188 8 198 4';
const AREA = `${CURVE}L198 60L2 60Z`;
const DRAW_MS = 1600;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Growth curve behind the stat numbers (home About + About page). When it scrolls into view the curve
 * draws left → right with a glowing dot riding its tip and the area filling in behind; afterwards a light
 * keeps sweeping along the curve and the dot pulses. Colour comes from `.stat svg` (currentColor).
 * Under prefers-reduced-motion it shows the finished chart, no motion.
 */
export function GrowthChart() {
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);
  const clip = useRef<SVGRectElement>(null);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const el = svg.current;
    const path = line.current;
    if (!el || !path || !dot.current || !clip.current) return;
    const len = path.getTotalLength();
    const end = path.getPointAtLength(len);
    let raf = 0;

    const frame = (p: number) => {
      const pt = path.getPointAtLength(p * len);
      path.style.strokeDashoffset = String(1 - p);
      dot.current!.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      clip.current!.setAttribute('width', String(pt.x));
    };
    const finish = () => {
      frame(1);
      el.classList.add('done');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      finish();
      dot.current.setAttribute('transform', `translate(${end.x} ${end.y})`);
      return;
    }

    frame(0);
    const play = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / DRAW_MS);
        frame(ease(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else finish();
      };
      el.classList.add('drawing');
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svg} className="gchart" viewBox="0 0 200 60" aria-hidden="true">
      <defs>
        <linearGradient id={`gf${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".38" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`gc${uid}`}>
          <rect ref={clip} x="0" y="0" width="0" height="60" />
        </clipPath>
      </defs>
      <path className="gc-grid" d="M0 15H200M0 30H200M0 45H200" />
      <path className="gc-area" d={AREA} fill={`url(#gf${uid})`} clipPath={`url(#gc${uid})`} />
      <path ref={line} className="gc-line" d={CURVE} pathLength={1} />
      <path className="gc-shine" d={CURVE} pathLength={1} />
      <g ref={dot} className="gc-dot">
        <circle className="gc-ring" r="4" />
        <circle className="gc-core" r="3.2" />
      </g>
    </svg>
  );
}
