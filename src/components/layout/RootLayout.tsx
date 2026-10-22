import { Outlet, useLocation } from 'react-router';
import { IconSprite } from './IconSprite';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppWidget } from './WhatsAppWidget';
import { ScrollManager } from './ScrollManager';

/**
 * Shared page shell for every route: icon sprite, skip link, the framed white "shell"
 * with header / page / footer, and the WhatsApp widget.
 * <main> is keyed by path so each route mounts fresh (reveal animations, forms, page scripts).
 * Pages other than home get the `inner` class (service / company page styles in inner.css).
 */
export default function RootLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <IconSprite />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="frame">
        <div className="shell">
          <Header />
          <main id="main" className={isHome ? undefined : 'inner'} key={pathname}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <WhatsAppWidget />
      <ScrollManager />
    </>
  );
}
