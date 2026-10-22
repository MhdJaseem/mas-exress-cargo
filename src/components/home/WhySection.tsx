import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon, type IconName } from '../ui/Icon';

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: 'bolt', text: 'Fast and reliable services' },
  { icon: 'tag', text: 'Competitive pricing' },
  { icon: 'radar', text: 'Real-time shipment tracking' },
  { icon: 'users', text: 'Experienced logistics team' },
  { icon: 'globe', text: 'Strong regional & international network' },
];
const PIN_Y = ['10%', '29%', '48%', '67%', '86%'];
const num = (i: number) => String(i + 1).padStart(2, '0');

/** Why Choose Us: numbered list; hovering an item (or its pin) highlights the matching pin on the photo. */
export function WhySection() {
  const [hot, setHot] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = photo.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hover = (i: number) => ({ onMouseEnter: () => setHot(i), onMouseLeave: () => setHot(null) });

  return (
    <section id="why" className="stack">
      <div className="why-wrap reveal">
        <div className="wrap why-grid">
          <div>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="big">
              Deliver Smarter with <em>MAS Express.</em>
            </h2>
            <ul className="why">
              {ITEMS.map((it, i) => (
                <li key={it.text} className={hot === i ? 'hot' : undefined} {...hover(i)}>
                  <span className="n">{num(i)}</span>
                  <span className="ic">
                    <Icon name={it.icon} />
                  </span>
                  <h3>{it.text}</h3>
                </li>
              ))}
            </ul>
          </div>
          <div
            ref={photo}
            className={`whyphoto${inView ? ' in' : ''}`}
            role="img"
            aria-label="Aerial view of a cargo plane over a container ship at the port"
          >
            <div className="wp-img" style={{ backgroundImage: "url('/img/sections/why-cargo.jpg')" }} />
            <span className="vt" aria-hidden="true">
              Why Choose Us
            </span>
            {PIN_Y.map((y, i) => (
              <span
                key={y}
                className={`pin${hot === i ? ' on' : ''}`}
                style={{ '--y': y } as CSSProperties}
                data-n={i + 1}
                {...hover(i)}
              >
                <i>{num(i)}</i>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
