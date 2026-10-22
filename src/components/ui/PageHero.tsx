import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router';
import { HeadingText, type Heading } from './Heading';

export interface Crumb {
  label: string;
  /** Internal route ("/") or a home section ("/#services"); omit for the current page. */
  to?: string;
}

/** Photo header of service and company pages (.phero): breadcrumb, H1, optional lead and buttons. */
export function PageHero({
  image,
  imagePosition,
  crumbs,
  title,
  lead,
  children,
}: {
  image: string;
  /** CSS background-position for the photo, when the default centre crop cuts off the subject. */
  imagePosition?: string;
  crumbs: Crumb[];
  title: Heading;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="phero" style={{ paddingTop: 118, borderRadius: 'var(--r-lg)' }}>
      <div className="bg" style={{ backgroundImage: `url('${image}')`, backgroundPosition: imagePosition }} />
      <nav className="crumb" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <Fragment key={c.label}>
            {i > 0 && <span className="sep">/</span>}
            {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
          </Fragment>
        ))}
      </nav>
      <h1>
        <HeadingText h={title} />
      </h1>
      {lead && <p>{lead}</p>}
      {children}
    </section>
  );
}
