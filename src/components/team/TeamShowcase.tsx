import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon, type IconName } from '../ui/Icon';
import { initials, teamGroups, type Member } from '../../data/company';

export interface Person extends Member {
  group: string;
  icon: IconName;
}

/** Every member of every group, in page order. */
export const people: Person[] = teamGroups.flatMap((g) =>
  g.members.map((m) => ({ ...m, group: g.title, icon: g.icon })),
);

const AUTOPLAY_MS = 6000;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Monogram or photo in a circle; `tone` cycles the brand colours so neighbours differ. */
function Avatar({ p, i, className }: { p: Person; i: number; className: string }) {
  return (
    <span className={`${className} tone${i % 3}`} aria-hidden="true">
      {p.photo ? <img src={p.photo} alt="" loading="lazy" /> : initials(p.name)}
    </span>
  );
}

/**
 * Our Team showcase (.tshow): the active member's name as huge faint type, a large portrait with orbit rings,
 * a detail card with prev/next, and a rail of avatars that slides to centre the active one.
 * Team chips above it jump to the first member of each group and mark the active member's group.
 * Auto-advances every 6s (paused on hover/focus, hidden tab and reduced motion); arrow keys and swipe work.
 */
export function TeamShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(true);
  const railRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);
  const [railX, setRailX] = useState(0);
  const p = people[active];
  const n = people.length;

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  // autoplay; reduced motion turns it off
  useEffect(() => {
    if (reducedMotion()) setAuto(false);
  }, []);
  useEffect(() => {
    if (!auto || paused) return;
    const t = window.setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [auto, paused, active, go]);
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // phones: the team chips are one sideways-scrolling row — keep the active one in view (without moving the page)
  useEffect(() => {
    const row = groupsRef.current;
    const chip = row?.querySelector<HTMLElement>('.chip.on');
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
  }, [p.group]);

  // centre the active avatar in the rail; keep keyboard focus on it when the rail has focus
  useEffect(() => {
    const rail = railRef.current;
    const btn = rail?.children[active] as HTMLElement | undefined;
    if (btn && rail?.contains(document.activeElement)) btn.focus({ preventScroll: true });
    const update = () => {
      const wrap = rail?.parentElement;
      if (!wrap || !btn) return;
      setRailX(wrap.clientWidth / 2 - (btn.offsetLeft + btn.offsetWidth / 2));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [active]);

  // swipe on the stage
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const user = (i: number) => {
    go(i);
    setAuto(false);
  };

  return (
    <section
      className="tshow"
      aria-roledescription="carousel"
      aria-label="Team members"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') user(active + 1);
        else if (e.key === 'ArrowLeft') user(active - 1);
        else return;
        e.preventDefault();
      }}
    >
      <div ref={groupsRef} className="tshow-groups" role="group" aria-label="Jump to a team">
        {teamGroups.map((g) => (
          <button
            key={g.title}
            type="button"
            className={`chip${g.title === p.group ? ' on' : ''}`}
            aria-pressed={g.title === p.group}
            onClick={() => user(people.findIndex((m) => m.group === g.title))}
          >
            <Icon name={g.icon} />
            {g.title}
          </button>
        ))}
      </div>

      <div className="tshow-name" aria-hidden="true">
        <span key={active}>{p.name}</span>
      </div>

      <div
        className="tshow-stage"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - s.y)) user(active + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="tshow-portrait" key={active}>
          <span className="orbit o1" />
          <span className="orbit o2" />
          <Avatar p={p} i={active} className="tshow-big" />
          <span className="tshow-badge">
            <Icon name={p.icon} />
          </span>
        </div>

        <article className="tshow-card" aria-live={auto && !paused ? 'off' : 'polite'}>
          <div className="tshow-card-in" key={active}>
            <div className="tshow-who">
              <Avatar p={p} i={active} className="tshow-sm" />
              <div>
                <h3>{p.name}</h3>
                <small className="role">{p.role}</small>
              </div>
            </div>
            <span className="tshow-group">{p.group}</span>
            <p>{p.text}</p>
          </div>
          <div className="tshow-foot">
            <span className="tshow-count">
              <b>{String(active + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}
            </span>
            <div className="tshow-nav">
              <button type="button" aria-label="Previous team member" onClick={() => user(active - 1)}>
                <Icon name="arrow" style={{ transform: 'rotate(-135deg)' }} />
              </button>
              <button type="button" aria-label="Next team member" onClick={() => user(active + 1)}>
                <Icon name="arrow" style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
          </div>
          {auto && !paused && <span className="tshow-timer" key={`timer-${active}`} />}
        </article>
      </div>

      <div className="tshow-rail-wrap">
        <div
          ref={railRef}
          className="tshow-rail"
          style={{ '--rx': `${railX}px` } as CSSProperties}
          role="tablist"
          aria-label="Choose a team member"
        >
          {people.map((m, i) => (
            <button
              key={m.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${m.name}, ${m.role}`}
              tabIndex={i === active ? 0 : -1}
              className={i === active ? 'on' : undefined}
              style={{ '--d': Math.min(Math.abs(i - active), 4) } as CSSProperties}
              onClick={() => user(i)}
            >
              <Avatar p={m} i={i} className="tshow-av" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
