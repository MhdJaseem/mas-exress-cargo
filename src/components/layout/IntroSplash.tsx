import { useEffect, useState } from 'react';
import { ContainerShip, Jet } from './IntroVehicles';

const KEY = 'mas-intro-seen';
const TOTAL_MS = 9400; // keep in sync with the .intro fade-out in main.css (8.8s delay + 0.6s)

// Carrier names painted on the jet and the ship (plain text in the site font, not their logos; '' hides one).
// Using another company's name implies a relationship — keep only with the carrier's permission.
const AIRLINE = 'Emirates';
const SHIPPING_LINE = 'EVERGREEN';

const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Logo intro, once per browser session. M stands up → a wide-body jet flies in with A swinging on one
 * rope, lowers it to the ground, reels the rope in and climbs away; "IR CARGO" writes out after the A →
 * a container ship sails in with S on deck and sails off behind the letters; "EA CARGO" follows the S →
 * wings sweep out and the tagline fades in → overlay fades away.
 * Each letter is the real logo-text.png clipped to one letter; plane and ship are inline SVG. All motion
 * is CSS (main.css, "logo intro"). Skipped under prefers-reduced-motion; click, Skip or Escape ends it.
 */
export function IntroSplash() {
  const [show, setShow] = useState(() => !seen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: the intro may replay, which is harmless */
    }
    const html = document.documentElement;
    html.classList.add('intro-lock');
    const end = () => setShow(false);
    const timer = window.setTimeout(end, TOTAL_MS);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && end();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      html.classList.remove('intro-lock');
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="intro" onClick={() => setShow(false)}>
      <div className="intro-logo" role="img" aria-label="MAS Express Cargo L.L.C">
        <img className="iw iw-l" src="/img/brand/logo-wing-left.png" alt="" />
        <div className="intro-text">
          <span className="water" />

          {/* container ship with S on deck: same path as .il-s until it docks, then sails off behind the letters */}
          <div className="carrier carrier-sea">
            <ContainerShip name={SHIPPING_LINE} />
          </div>

          <img className="il il-m" src="/img/brand/logo-text.png" alt="" />
          <img className="il il-a" src="/img/brand/logo-text.png" alt="" />
          <img className="il il-s" src="/img/brand/logo-text.png" alt="" />
          <img className="il il-tag" src="/img/brand/logo-text.png" alt="" />

          {/* the landed letter starts the word: A + "IR CARGO", S + "EA CARGO" */}
          <span className="word word-air" aria-hidden="true">
            IR CARGO
          </span>
          <span className="word word-sea" aria-hidden="true">
            EA CARGO
          </span>

          {/* wide-body jet; A hangs from one rope (the .sling swings and lowers it), then .il-a takes over */}
          <div className="carrier carrier-air">
            <div className="sling">
              <span className="rope" />
              <img className="sling-a" src="/img/brand/logo-text.png" alt="" />
            </div>
            <Jet name={AIRLINE} />
          </div>
        </div>
        <img className="iw iw-r" src="/img/brand/logo-wing-right.png" alt="" />
      </div>
      <button type="button" className="intro-skip" onClick={() => setShow(false)}>
        Skip intro
      </button>
    </div>
  );
}
