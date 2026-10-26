import { useEffect, useRef } from 'react';
import { TestimonialCard } from './TestimonialCard';
import { testimonials, TESTIMONIALS_LEAD } from '../../data/company';

const SPEED = 26; // auto-scroll, px per second
const ACTIVE = '(min-width:900px) and (prefers-reduced-motion:no-preference)';

/** Testimonials block shared by the home page and About: copy on the left, endless vertical marquee on the right
    (a stacked list below 900px). The list is rendered twice — the duplicate group is what makes the loop seamless.
    The marquee drifts upward on its own; it pauses on hover/focus and can be dragged or swiped (with momentum)
    in either direction. The wheel is left to the page so the loop never traps scrolling. */
export function TestimonialsSplit() {
  const marq = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = marq.current;
    const el = track.current;
    if (!box || !el) return;
    const mq = window.matchMedia(ACTIVE);
    let offset = 0;
    let fling = 0; // px/s left over from a drag, decays
    let hover = false;
    let drag: { id: number; y: number; t: number; v: number } | null = null;
    let visible = true;
    let last = performance.now();
    let raf = 0;

    const loopH = () => (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!mq.matches) {
        el.style.transform = '';
        return;
      }
      if (!visible) return;
      if (!drag) {
        const paused = hover || box.contains(document.activeElement);
        offset += ((paused ? 0 : SPEED) + fling) * dt;
        fling *= Math.pow(0.04, dt); // ease the fling out over ~1s
        if (Math.abs(fling) < 4) fling = 0;
      }
      const h = loopH();
      if (h > 0) offset = ((offset % h) + h) % h;
      el.style.transform = `translate3d(0,${-offset}px,0)`;
    };
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => {
      if (!mq.matches || (e.pointerType === 'mouse' && e.button !== 0)) return;
      e.preventDefault(); // no text selection / image drag while dragging the list
      drag = { id: e.pointerId, y: e.clientY, t: e.timeStamp, v: 0 };
      fling = 0;
      box.setPointerCapture(e.pointerId);
      box.classList.add('dragging');
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dy = e.clientY - drag.y;
      const dt = Math.max(1, e.timeStamp - drag.t) / 1000;
      offset -= dy;
      drag.v = 0.7 * drag.v + 0.3 * (-dy / dt);
      drag.y = e.clientY;
      drag.t = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      // a pause before letting go means no fling
      fling = e.timeStamp - drag.t < 80 ? Math.max(-2500, Math.min(2500, drag.v)) : 0;
      drag = null;
      box.classList.remove('dragging');
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = true;
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = false;
    };
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    box.addEventListener('pointerenter', enter);
    box.addEventListener('pointerleave', leave);

    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      box.removeEventListener('pointerdown', down);
      box.removeEventListener('pointermove', move);
      box.removeEventListener('pointerup', up);
      box.removeEventListener('pointercancel', up);
      box.removeEventListener('pointerenter', enter);
      box.removeEventListener('pointerleave', leave);
      el.style.transform = '';
    };
  }, []);

  const group = (hidden: boolean) => (
    <div className="tgroup" aria-hidden={hidden || undefined}>
      {testimonials.map((t, i) => (
        <TestimonialCard key={t.name} t={t} className={i === 0 ? 'tm hl' : 'tm'} />
      ))}
    </div>
  );

  return (
    <div className="tsplit">
      <div className="tleft reveal">
        <span className="eyebrow">Testimonials</span>
        <h2 className="big">
          What Our Loyal Clients <em>Say About Us</em>
        </h2>
        <p className="lead">{TESTIMONIALS_LEAD}</p>
      </div>
      <div className="tmarq" ref={marq} aria-label="Client testimonials">
        <div className="ttrack" ref={track}>
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
