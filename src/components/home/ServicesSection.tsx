import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Icon, type IconName } from '../ui/Icon';
import { services } from '../../data/services';
import { AirArt, RoadArt, SeaArt, WarehouseArt } from './ServiceArt';

/* Home-page teaser cards — this wording is the home page's own (truncated with "..."), not the service pages'. */
const CARDS: { slug: string; title: string; icon: IconName; img: string; alt: string; art: ReactNode; text: string }[] =
  [
    {
      slug: 'air-freight',
      title: 'Air Freight',
      icon: 'plane',
      img: '/img/services/card-air.jpg',
      alt: 'Cargo aircraft landing at sunset',
      art: <AirArt />,
      text: 'Express air cargo solutions for urgent shipments. IATA certified with priority handling and real-time flight tracking...',
    },
    {
      slug: 'sea-freight',
      title: 'Sea Freight',
      icon: 'ship',
      img: '/img/services/card-sea.jpg',
      alt: 'Container ship sailing at sunset',
      art: <SeaArt />,
      text: 'FCL & LCL container shipping from Jebel Ali port. Full container management with customs clearance included...',
    },
    {
      slug: 'gcc-road-transport',
      title: 'GCC Road Transport',
      icon: 'truck',
      img: '/img/services/card-road.jpg',
      alt: 'Container truck driving at sunset',
      art: <RoadArt />,
      text: 'MAS Express Cargo specializes in cross-border road freight across the Gulf Cooperation Council (GCC) countries...',
    },
    {
      slug: 'warehousing',
      title: 'Warehousing',
      icon: 'warehouse',
      img: '/img/services/card-warehouse.jpg',
      alt: 'Warehouse aisle with racked pallets',
      art: <WarehouseArt />,
      text: 'MAS Express Cargo provides comprehensive warehousing and storage solutions from our strategically located facilities in Sharjah...',
    },
  ];

export function ServicesSection() {
  return (
    <section id="services" className="stack">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="eyebrow">Our Core Services</span>
            <h2 className="big">
              Comprehensive Logistics <em>Solutions for Business!</em>
            </h2>
          </div>
          <p className="lead">
            From express air freight to cost-effective sea shipping and GCC road transport. We provide end-to-end
            logistics tailored to your needs.
          </p>
        </div>

        <div className="cards4">
          {CARDS.map((c) => (
            <article key={c.slug} className="svc reveal">
              <div className="pic ph">
                <img src={c.img} alt={c.alt} loading="lazy" />
                {c.art}
                <span className="go" aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              </div>
              <span className="badge">
                <Icon name={c.icon} />
              </span>
              <div className="tx">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <Link className="more" to={`/${c.slug}`}>
                  Explore More <Icon name="arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="chips reveal">
          <span>All services:</span>
          {services.map((s) => (
            <Link key={s.slug} className="chip" to={`/${s.slug}`}>
              <Icon name={s.icon} />
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
