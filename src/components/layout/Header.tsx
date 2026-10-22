import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Icon } from '../ui/Icon';
import { HashLink } from '../ui/HashLink';
import { services } from '../../data/services';
import { solutionPath, solutions } from '../../data/solutions';
import { useActiveSection } from '../../lib/activeSection';

export const COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/our-team', label: 'Our Team' },
  { to: '/our-branches', label: 'Our Branches' },
  { to: '/careers', label: 'Careers' },
] as const;

type DropdownId = 'services' | 'company' | 'solutions';

/** Desktop nav (dropdowns float and open on hover); at 960px and below they are accordions in the mobile menu. */
const DESKTOP_NAV = '(min-width: 961px)';
const isDesktopNav = () => window.matchMedia(DESKTOP_NAV).matches;

/**
 * Site header: winged logo, main nav with dropdowns, Track Shipment / Request Pickup actions, mobile menu.
 * Transparent over the hero; `.solid` once scrolled (home: past 55% of the viewport, other pages: 200px);
 * `.hide` while scrolling down, shown again when scrolling up.
 */
export function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const section = useActiveSection();
  const ref = useRef<HTMLElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDD, setOpenDD] = useState<DropdownId | null>(null);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const anyOpen = menuOpen || openDD !== null;

  const closeAll = () => {
    setMenuOpen(false);
    setOpenDD(null);
  };

  // close menus on navigation
  useEffect(() => {
    closeAll();
    setHidden(false);
  }, [pathname]);

  // click outside / Escape closes menus
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // solid / hide on scroll
  useEffect(() => {
    let last = window.scrollY;
    const upd = () => {
      const y = window.scrollY;
      const dy = y - last;
      last = y;
      setSolid((isHome ? y > window.innerHeight * 0.55 : y > 200) || anyOpen);
      const active = document.activeElement;
      const focusInside = isHome && !!active && active !== document.body && !!ref.current?.contains(active);
      if (y < 80 || anyOpen || focusInside) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
    return () => window.removeEventListener('scroll', upd);
  }, [isHome, anyOpen]);

  const isService = services.some((s) => pathname.replace(/\/$/, '') === `/${s.slug}`);
  const isSolution = solutions.some((s) => pathname.replace(/\/$/, '') === solutionPath(s));
  const isCompany = COMPANY_LINKS.some((c) => pathname.replace(/\/$/, '') === c.to);
  const active = {
    home: isHome && section === 'home',
    services: (isHome && section === 'services') || isService,
    company: (isHome && section === 'about') || isCompany,
    solutions: isSolution,
    contact: isHome && section === 'pickup',
  };

  /* Only one dropdown is ever open, and only through openDD (the CSS shows li.open alone). On desktop,
     hovering or focusing a dropdown opens it and closes any other; leaving it closes it. A click toggles
     it (touch, mobile menu), except a desktop mouse click, which keeps the hover-opened menu open. */
  const dd = (id: DropdownId, label: string, isActive: boolean, children: ReactNode) => {
    const open = openDD === id;
    return (
      <li
        className={['dd-li', open && 'open', isActive && 'active'].filter(Boolean).join(' ')}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse' && isDesktopNav()) setOpenDD(id);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse' && isDesktopNav()) setOpenDD((cur) => (cur === id ? null : cur));
        }}
        onFocus={(e) => {
          // keyboard focus only — a tap or click also focuses the button, and its click handles that
          if (isDesktopNav() && e.target.matches(':focus-visible')) setOpenDD(id);
        }}
        onBlur={(e) => {
          // desktop only: collapsing a mobile accordion on blur would shift the next tap's target
          if (isDesktopNav() && !e.currentTarget.contains(e.relatedTarget as Node | null))
            setOpenDD((cur) => (cur === id ? null : cur));
        }}
      >
        <button
          className="nl"
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={(e) => {
            const mouseOnDesktop = e.detail > 0 && isDesktopNav() && window.matchMedia('(hover: hover)').matches;
            setOpenDD(mouseOnDesktop || !open ? id : null);
          }}
        >
          {label} <Icon name="chev" />
        </button>
        <div className="dd">{children}</div>
      </li>
    );
  };

  return (
    <header ref={ref} className={['top', solid && 'solid', hidden && 'hide'].filter(Boolean).join(' ')}>
      <HashLink hash="top" className="pill logo" aria-label="MAS Express Cargo L.L.C — home">
        <span className="mlogo" aria-hidden="true">
          <img className="lw" src="/img/brand/logo-wing-left.png" alt="" />
          <img className="lt" src="/img/brand/logo-text.png" alt="" />
          <img className="rw" src="/img/brand/logo-wing-right.png" alt="" />
        </span>
      </HashLink>

      <nav
        className={`pill main${menuOpen ? ' show' : ''}`}
        id="mainnav"
        aria-label="Main"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) closeAll();
        }}
      >
        <ul>
          <li>
            <HashLink hash="top" className={`nl${active.home ? ' active' : ''}`}>
              Home
            </HashLink>
          </li>
          {dd(
            'services',
            'Services',
            active.services,
            <>
              {services.map((s) => (
                <Link key={s.slug} to={`/${s.slug}`}>
                  <Icon name={s.icon} />
                  {s.name}
                </Link>
              ))}
            </>,
          )}
          {dd(
            'company',
            'Company',
            active.company,
            <>
              {COMPANY_LINKS.map((c) => (
                <Link key={c.to} to={c.to}>
                  {c.label}
                </Link>
              ))}
            </>,
          )}
          {dd(
            'solutions',
            'Solutions',
            active.solutions,
            <>
              {solutions.map((s) => (
                <Link key={s.slug} to={solutionPath(s)}>
                  {s.name}
                </Link>
              ))}
            </>,
          )}
          <li>
            <HashLink hash="contact" className={`nl${active.contact ? ' active' : ''}`}>
              Contact
            </HashLink>
          </li>
        </ul>
        <div className="mnav-cta">
          <HashLink hash="hero-track" className="btn brand">
            Track Shipment
          </HashLink>
          <HashLink hash="pickup" className="btn">
            Request Pickup
          </HashLink>
        </div>
      </nav>

      <div className="actions">
        <HashLink hash="hero-track" className="btn">
          Track Shipment
        </HashLink>
        <HashLink hash="pickup" className="btn brand btn-sq" aria-label="Request Pickup" title="Request Pickup">
          <Icon name="plus" />
        </HashLink>
      </div>
      <button
        className="pill burger"
        id="burger"
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="mainnav"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <Icon name="menu" style={{ width: 26, height: 26 }} />
      </button>
    </header>
  );
}
