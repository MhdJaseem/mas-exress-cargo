import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { scrollToId } from '../../lib/scroll';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  /** Target element id without '#', e.g. "pickup". "top" = top of the home page. */
  hash: string;
  children: ReactNode;
};

/**
 * Link to a section by id.
 * - If the section exists on the current page, scrolls to it (smoothly; uses the home scroll engine on "/").
 * - Otherwise navigates to the home page at that section ("/#pickup"), where the router's scroll manager takes over.
 * The real href is "/#id", so middle-click / open-in-new-tab still work.
 */
export function HashLink({ hash, children, onClick, ...rest }: Props) {
  const navigate = useNavigate();
  const href = hash === 'top' ? '/' : `/#${hash}`;

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (hash === 'top') {
      if (window.location.pathname === '/') scrollToId('top');
      else navigate('/');
      return;
    }
    if (!scrollToId(hash)) navigate(href);
  }

  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
