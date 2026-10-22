import { useEffect, useRef, type CSSProperties } from 'react';
import { Icon } from '../ui/Icon';
import type { Card } from '../../data/services';

const MIN_FACES = 10; // short card lists are repeated so the cylinder looks full
const DRIFT = 9; // deg / s
const RESUME_MS = 3000; // idle time after an interaction before drifting again
const FRICTION = 0.92; // momentum decay per frame after a drag

const norm = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

/**
 * Feature cards on a slowly drifting 3D cylinder (service pages).
 * Drag / swipe with momentum, snaps to a card, pauses on hover or focus, click a card to bring it to the front,
 * arrow buttons + ←/→ keys. No autoplay under prefers-reduced-motion; the loop stops while off screen.
 */
export function CardCarousel({ cards, label }: { cards: Card[]; label: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ go: (d: number) => void }>({ go: () => {} });

  const reps = Math.ceil(MIN_FACES / cards.length);
  const faces = Array.from({ length: cards.length * reps }, (_, k) => cards[k % cards.length]);
  const n = faces.length;
  const step = 360 / n;

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    const els = Array.from(ring.children) as HTMLElement[];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let angle = 0;
    let vel = 0;
    let target: number | null = 0;
    let radius = 0;
    let hover = false;
    let kbFocus = false; // keyboard focus only — a mouse click also focuses the stage, which must not pin it
    let spd = 0; // current drift speed, eased toward DRIFT or 0
    let dragging = false;
    let visible = false;
    let lastInput = -Infinity;
    let front = -1;
    let raf = 0;
    let prev = 0;

    const layout = () => {
      const w = els[0].offsetWidth;
      const gap = w * 0.12;
      radius = (w + gap) / 2 / Math.tan(Math.PI / n);
      els.forEach((el, i) => (el.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`));
    };

    const render = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateX(-5deg) rotateY(${-angle}deg)`;
      let best = 0;
      let bestD = 360;
      els.forEach((el, i) => {
        const rel = norm(i * step - angle);
        const d = (1 + Math.cos((rel * Math.PI) / 180)) / 2; // 1 front … 0 back
        el.style.opacity = String(0.15 + 0.85 * d ** 1.6);
        if (Math.abs(rel) < bestD) {
          bestD = Math.abs(rel);
          best = i;
        }
      });
      if (best !== front) {
        els[front]?.classList.remove('front');
        els[best].classList.add('front');
        front = best;
      }
    };

    const tick = (t: number) => {
      const dt = Math.min((t - prev) / 1000, 0.05);
      prev = t;
      const drifting =
        !reduce &&
        !dragging &&
        !hover &&
        !kbFocus &&
        Math.abs(vel) <= 0.05 &&
        target === null &&
        performance.now() - lastInput > RESUME_MS;
      spd += ((drifting ? DRIFT : 0) - spd) * Math.min(1, dt * 3);
      if (!drifting && (dragging || target !== null || Math.abs(vel) > 0.05)) spd = 0;
      if (!dragging) {
        if (Math.abs(vel) > 0.05) {
          angle += vel;
          vel *= FRICTION;
          if (Math.abs(vel) <= 0.05) target = Math.round(angle / step) * step;
        } else if (target !== null) {
          const diff = target - angle;
          angle += reduce ? diff : diff * Math.min(1, dt * 7);
          if (Math.abs(diff) < 0.02) {
            angle = target;
            target = null;
          }
        } else {
          angle += spd * dt; // eases to a stop on hover, eases back up on leave
        }
      }
      render();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!raf && visible) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const touch = () => {
      lastInput = performance.now();
      start();
    };
    const snapTo = (a: number) => {
      vel = 0;
      target = a;
      touch();
    };
    api.current.go = (d) => snapTo((target ?? Math.round(angle / step) * step) + d * step);

    // drag
    let downX = 0;
    let lastX = 0;
    let moved = false;
    let downFace = -1;
    const degPerPx = () => step / (els[0].offsetWidth * 1.12);
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
      dragging = true;
      moved = false;
      downX = lastX = e.clientX;
      downFace = Number((e.target as HTMLElement).closest<HTMLElement>('[data-i]')?.dataset.i ?? -1);
      vel = 0;
      target = null;
      stage.setPointerCapture(e.pointerId);
      touch();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      if (Math.abs(e.clientX - downX) > 5) moved = true;
      const d = -dx * degPerPx();
      angle += d;
      vel = d * 0.6;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (!moved && downFace >= 0) snapTo(angle + norm(downFace * step - angle));
      else if (reduce || Math.abs(vel) <= 0.05) snapTo(Math.round(angle / step) * step);
      touch();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') api.current.go(-1);
      else if (e.key === 'ArrowRight') api.current.go(1);
      else return;
      e.preventDefault();
    };
    const onEnter = () => (hover = true);
    const onLeave = () => {
      hover = false;
      lastInput = -Infinity; // resume straight away, no idle wait
      start();
    };
    const onFocusIn = () => {
      kbFocus = stage.matches(':focus-visible') || !!stage.querySelector(':focus-visible');
    };
    const onFocusOut = () => {
      kbFocus = false;
    };

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start();
    });
    const onResize = () => {
      layout();
      render();
    };

    layout();
    render();
    io.observe(stage);
    window.addEventListener('resize', onResize);
    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('keydown', onKey);
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('focusin', onFocusIn);
    stage.addEventListener('focusout', onFocusOut);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('keydown', onKey);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('focusin', onFocusIn);
      stage.removeEventListener('focusout', onFocusOut);
    };
  }, [n, step]);

  return (
    <div
      className="cyl reveal"
      ref={stageRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${label} — use the arrow keys or drag to rotate`}
    >
      <div className="cyl-ring" ref={ringRef}>
        {faces.map((c, i) => (
          <div key={i} className="cyl-card" data-i={i} aria-hidden={i >= cards.length || undefined}>
            <span className="fi">
              <Icon name={c.icon} />
            </span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="cyl-nav">
        <button type="button" aria-label="Previous" onClick={() => api.current.go(-1)}>
          <Icon name="chev" style={{ transform: 'rotate(90deg)' } as CSSProperties} />
        </button>
        <button type="button" aria-label="Next" onClick={() => api.current.go(1)}>
          <Icon name="chev" style={{ transform: 'rotate(-90deg)' } as CSSProperties} />
        </button>
      </div>
    </div>
  );
}
