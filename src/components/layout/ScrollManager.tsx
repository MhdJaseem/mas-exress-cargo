import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { scrollToId } from '../../lib/scroll';

/**
 * Scroll behaviour for client-side navigation:
 * - new page (link click)      → top of the page
 * - URL with a hash (/#pickup) → that section, once the page has mounted
 * - back / forward             → the position the page had when you left it
 */
export function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  const positions = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  // remember the scroll position of the current history entry
  useLayoutEffect(() => {
    const key = location.key;
    const save = () => positions.current.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [location.key]);

  useLayoutEffect(() => {
    if (location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const id = decodeURIComponent(location.hash.slice(1));
      // wait one frame so page effects (e.g. the home scroll engine) have set up
      const raf = requestAnimationFrame(() => scrollToId(id));
      return () => cancelAnimationFrame(raf);
    }
    const y = navType === 'POP' ? (positions.current.get(location.key) ?? 0) : 0;
    window.scrollTo({ top: y, behavior: 'instant' });
  }, [location.key, location.hash, navType]);

  return null;
}
