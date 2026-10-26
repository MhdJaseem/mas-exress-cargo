import { Link } from 'react-router';
import { Icon } from '../ui/Icon';
import { SectionHead } from '../ui/Heading';
import { DELIVERY_HEADING, DELIVERY_LEAD, DELIVERY_OPTIONS, type DeliveryTitle } from '../../data/services';

/** Door to Door / Door to Port / Port to Port / Airport to Airport — each service page passes the ones it offers.
    Each card shows its route (pickup point → hand-over point) with a parcel travelling along it. */
export function DeliveryOptions({ only }: { only: DeliveryTitle[] }) {
  const opts = only.map((t) => DELIVERY_OPTIONS.find((o) => o.title === t)!);
  if (!opts.length) return null;
  return (
    <section className="blk dopts">
      <SectionHead eyebrow="Delivery Options" heading={DELIVERY_HEADING} lead={DELIVERY_LEAD} />
      <div className={`dopt-grid n${opts.length}`}>
        {opts.map((o, i) => (
          <article key={o.title} className="dopt reveal">
            <div className="dopt-route" aria-label={`${o.from.label} to ${o.to.label}`}>
              <span className="end">
                <span className="ic">
                  <Icon name={o.from.icon} />
                </span>
                <small>{o.from.label}</small>
              </span>
              <span className="line" aria-hidden="true">
                <i style={{ animationDelay: `${i * 0.5}s` }} />
              </span>
              <span className="end">
                <span className="ic to">
                  <Icon name={o.to.icon} />
                </span>
                <small>{o.to.label}</small>
              </span>
            </div>
            <h3>{o.title}</h3>
            <p>{o.text}</p>
            <p className="best">
              <b>Best for:</b> {o.bestFor}
            </p>
            {/* the whole card links to the option's own page (stretched link, see .dopt-more::after) */}
            <Link className="more dopt-more" to={`/${o.slug}`}>
              Learn more <Icon name="arrow" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
