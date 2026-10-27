import { Link } from 'react-router';
import { Icon } from '../components/ui/Icon';
import { HashLink } from '../components/ui/HashLink';
import { PageHero } from '../components/ui/PageHero';
import { SectionHead } from '../components/ui/Heading';
import { PickupForm } from '../components/ui/PickupForm';
import { solutionPath, solutions, type Solution } from '../data/solutions';
import { serviceBySlug } from '../data/services';
import { enquireHref, pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';

/** Template for /solution/e-commerce-fulfillment, /cold-chain-logistics, /heavy-lift-project-cargo, /retail-distribution. */
export default function SolutionPage({ solution: s }: { solution: Solution }) {
  // The live pages have no tagline; the first sentence of the copy serves as the meta description.
  useDocumentMeta(pageTitle(s.name), s.paras[0].slice(0, s.paras[0].indexOf('. ') + 1));
  useReveal('inner');
  const enquire = enquireHref(s.name);
  const related = s.related.map(serviceBySlug).filter((r) => r !== undefined);

  return (
    <>
      <PageHero
        image={s.image}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Solutions' }, { label: s.name }]}
        title={s.heroTitle}
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
          <section className="blk">
            <SectionHead eyebrow="Solutions" heading={s.heroTitle} />
            {s.paras.map((p) => (
              <p key={p.slice(0, 40)} className="para reveal">
                {p}
              </p>
            ))}
          </section>

          <section className="blk">
            <SectionHead eyebrow="Services" heading={['Related ', 'Services']} />
            <div className="fgrid3 c3">
              {related.map((r) => (
                <Link key={r.slug} className="fc reveal" to={`/${r.slug}`}>
                  <span className="fi">
                    <Icon name={r.icon} />
                  </span>
                  <h3>{r.name}</h3>
                  <p>{r.lead}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="side">
          <a className="btn brand enq" href={enquire} target="_blank" rel="noopener">
            Enquire now <Icon name="arrow" />
          </a>
          <div className="allsv">
            <h4>All Solutions</h4>
            {solutions.map((o) => (
              <Link key={o.slug} className={o.slug === s.slug ? 'cur' : undefined} to={solutionPath(o)}>
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
