import { Link } from 'react-router';
import { Icon } from '../components/ui/Icon';
import { HashLink } from '../components/ui/HashLink';
import { PageHero } from '../components/ui/PageHero';
import { PickupForm } from '../components/ui/PickupForm';
import { ServiceBlock } from '../components/service/ServiceBlocks';
import { DeliveryOptions } from '../components/service/DeliveryOptions';
import { services, type Service } from '../data/services';
import { enquireHref, pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';

/** Template for /air-freight, /sea-freight, /gcc-road-transport, /warehousing, /customs-clearance. */
export default function ServicePage({ service: s }: { service: Service }) {
  useDocumentMeta(pageTitle(s.name), s.lead);
  useReveal('inner');
  const enquire = enquireHref(s.name);

  return (
    <>
      <PageHero
        image={s.heroImage}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/#services' }, { label: s.name }]}
        title={s.heroTitle}
        lead={s.lead}
      >
        <div className="btn-row">
          <a className="btn brand" href={enquire} target="_blank" rel="noopener">
            Enquire now <Icon name="arrow" />
          </a>
          <HashLink hash="pickup" className="btn light">
            Request Pickup
          </HashLink>
        </div>
      </PageHero>

      <div className="pbody">
        <div className="main-col">
          {s.blocks.slice(0, 1).map((b, i) => (
            <ServiceBlock key={i} block={b} />
          ))}
          {/* right after the intro: the delivery options this service offers */}
          <DeliveryOptions only={s.delivery} />
          {s.blocks.slice(1).map((b, i) => (
            <ServiceBlock key={i + 1} block={b} />
          ))}
        </div>

        <aside className="side">
          <a className="btn brand enq" href={enquire} target="_blank" rel="noopener">
            Enquire now <Icon name="arrow" />
          </a>
          <div className="allsv">
            <h4>All Services</h4>
            {services.map((o) => (
              <Link key={o.slug} className={o.slug === s.slug ? 'cur' : undefined} to={`/${o.slug}`}>
                <Icon name={o.icon} />
                {o.name}
              </Link>
            ))}
          </div>
          <div className="trkp">
            <h4>Track Your Shipment</h4>
            <p>
              Access your shipment's real-time status, location, and documents through our integrated MAS Express Cargo
              Tracking System.
            </p>
            <HashLink hash="hero-track" className="btn">
              Track Shipment <Icon name="arrow" />
            </HashLink>
          </div>
          <div className="pickup" id="pickup">
            <h2>Request Pickup</h2>
            <PickupForm defaultMode={s.mode} />
          </div>
        </aside>
      </div>
    </>
  );
}
