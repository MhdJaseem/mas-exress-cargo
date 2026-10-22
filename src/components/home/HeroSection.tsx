import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../ui/Icon';
import { HashLink } from '../ui/HashLink';

const SLIDES = [
  { img: '/img/hero/hero-air.jpg', label: 'Air Freight' },
  { img: '/img/hero/hero-sea.jpg', label: 'Sea Freight' },
  { img: '/img/hero/hero-road.jpg', label: 'GCC Road Transport' },
];
const DUR = 6500;

/** Full-screen hero: cross-fading photo slides, headline, and the Track / Call / Pickup cards. */
export function HeroSection({ onTrack }: { onTrack: (trackingNo: string) => void }) {
  const [cur, setCur] = useState(0);
  // bumps on every slide change so the indicator's progress bar animation restarts
  const [cycle, setCycle] = useState(0);
  const timer = useRef(0);
  const trkRef = useRef<HTMLInputElement>(null);

  const go = (i: number) => {
    setCur((i + SLIDES.length) % SLIDES.length);
    setCycle((c) => c + 1);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--dur', `${DUR}ms`);
  }, []);

  // auto-advance; paused while the tab is hidden
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (!document.hidden) timer.current = window.setTimeout(() => go(cur + 1), DUR);
    const onVis = () => {
      window.clearTimeout(timer.current);
      if (!document.hidden) go(cur);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [cur, cycle]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = trkRef.current?.value.trim() ?? '';
    if (!v) {
      trkRef.current?.focus();
      return;
    }
    onTrack(v);
  }

  return (
    <div className="hero stack" id="home">
      <div className="hero-slides" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.img} className={`slide${i === cur ? ' on' : ''}`} data-i={i}>
            <div className="ph" style={{ backgroundImage: `url('${s.img}')` }} />
          </div>
        ))}
      </div>
      <div className="hero-top" aria-hidden="true" />
      <div className="hero-copy">
        <h1>
          <span className="kicker">Transportation across</span>
          <span className="big">
            the <em>GCC</em> and worldwide
          </span>
        </h1>
        <p>
          MAS Express Cargo specializes in secure, reliable, and timely transportation across the GCC and worldwide.
        </p>
      </div>

      <div className="slidenav" role="tablist" aria-label="Our services">
        {SLIDES.map((s, i) => (
          <button
            key={s.img}
            type="button"
            role="tab"
            className={i === cur ? 'on' : i < cur ? 'done' : undefined}
            data-i={i}
            aria-selected={i === cur}
            aria-label={s.label}
            onClick={() => go(i)}
          >
            <i key={i === cur ? cycle : undefined} />
          </button>
        ))}
      </div>
      <div className="bento">
        <form className="card" id="hero-track" aria-label="Track Your Shipment" noValidate onSubmit={submit}>
          <h3>Track Your Shipment</h3>
          <div className="track">
            <label className="sr" htmlFor="trk">
              Tracking No.
            </label>
            <input
              ref={trkRef}
              id="trk"
              name="trk"
              type="text"
              inputMode="text"
              placeholder="Enter Tracking No."
              autoComplete="off"
              required
            />
            <button className="btn" type="submit">
              Track <Icon name="arrow" />
            </button>
          </div>
          <p className="small">
            Access your shipment's real-time status, location, and documents through our integrated MAS Express Cargo
            Tracking System.
          </p>
        </form>

        <div className="card callcard">
          <span className="lab">Toll Free</span>
          <div>
            <h3 style={{ marginBottom: 6 }}>Call Us</h3>
            <a className="num" href="tel:+9718004786">
              +971 800 4786
            </a>
          </div>
        </div>

        <HashLink hash="pickup" className="card brand pickcard">
          <div className="row">
            <span className="lab">Pickup</span>
            <span className="go">
              <Icon name="arrow" style={{ width: 20, height: 20 }} />
            </span>
          </div>
          <strong>
            Request
            <br />
            Pickup
          </strong>
        </HashLink>
      </div>
    </div>
  );
}
