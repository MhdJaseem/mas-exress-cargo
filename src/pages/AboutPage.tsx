import type { CSSProperties } from 'react';
import { PageHero } from '../components/ui/PageHero';
import { SectionHead } from '../components/ui/Heading';
import { Icon, type IconName } from '../components/ui/Icon';
import { CountUp } from '../components/ui/CountUp';
import { GrowthChart } from '../components/ui/GrowthChart';
import { TestimonialsSplit } from '../components/ui/TestimonialsSplit';
import { JourneyMap } from '../components/about/JourneyMap';
import { clients } from '../data/company';
import { pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';

const JOURNEY =
  'MAS Express Cargo began with a simple mission: to provide faster, more reliable, and transparent cargo solutions for businesses in the UAE. Recognizing the unique challenges of GCC trade, we built a company grounded in local knowledge and global standards. Today, we are a trusted partner for companies requiring seamless logistics across the Arabian Peninsula and beyond.';

const PILLARS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'radar',
    title: 'Technology-Driven',
    text: 'Centralized tracking and operational systems ensuring consistent and reliable shipment updates.',
  },
  {
    icon: 'globe',
    title: 'GCC Network Experts',
    text: 'Unmatched expertise in GCC customs, regulations, and cross-border logistics.',
  },
];

const VMV: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'radar',
    title: 'Vision',
    text: 'Our vision is to become a leading logistics partner recognized for quality, reliability, and customer satisfaction. Through continuous innovation, dedicated service, and strong partnerships, we aim to support businesses with seamless cargo and logistics solutions across global markets.',
  },
  {
    icon: 'bolt',
    title: 'Mission',
    text: 'Our mission is to provide reliable, efficient, and customer-focused logistics solutions across the UAE, GCC, and international markets. We are committed to delivering excellence in every shipment we handle while ensuring transparency, timely delivery, and the safety of every consignment entrusted to us.',
  },
  {
    icon: 'users',
    title: 'Values',
    text: 'At MAS Express Cargo, our values guide everything we do. We believe in building long-term relationships with our clients through trust, professionalism, and consistent service quality.',
  },
];

export default function AboutPage() {
  useDocumentMeta(
    pageTitle('About Us'),
    'MAS Express Cargo began with a simple mission: to provide faster, more reliable, and transparent cargo solutions for businesses in the UAE.',
  );
  useReveal('inner');

  return (
    <>
      <PageHero
        image="/img/pages/about-team-warehouse.webp"
        imagePosition="50% 12%"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        title={['About ', 'Us']}
      />
      <div className="pbody solo">
        <div className="main-col">
          {/* Journey: "from Dubai" route map + floating stats, copy and the two pillars */}
          <section className="blk journey">
            <div className="jr-media reveal">
              <div className="jr-map">
                <JourneyMap />
              </div>
              <div className="stat a jr-stat s1">
                <b>
                  <CountUp value="850" duration={1700} />
                  <sup>+</sup>
                </b>
                <span>Daily Shipment</span>
                <GrowthChart />
              </div>
              <div className="stat b jr-stat s2">
                <b>
                  <CountUp value="99.8" duration={1700} />
                  <sup>%</sup>
                </b>
                <span>On-Time Delivery</span>
                <GrowthChart />
              </div>
            </div>
            <div className="jr-copy">
              <SectionHead eyebrow="About Us" heading={['From Dubai to the World: ', 'Our Logistics Journey!']} />
              <p className="para reveal">{JOURNEY}</p>
              <div className="feat">
                {PILLARS.map((c) => (
                  <div key={c.title} className="reveal">
                    <span className="ic">
                      <Icon name={c.icon} />
                    </span>
                    <span>
                      <h3>{c.title}</h3>
                      <p>{c.text}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Vision / Mission / Values on a dark panel */}
          <section className="blk vmv" aria-label="Vision, mission and values">
            {VMV.map((c, i) => (
              <article key={c.title} className="vmv-item reveal" style={{ '--n': `"0${i + 1}"` } as CSSProperties}>
                <span className="fi">
                  <Icon name={c.icon} />
                </span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </section>

          <section className="blk tpanel">
            <TestimonialsSplit />
          </section>

          <section className="blk">
            <SectionHead heading={['Our ', 'Clients']} />
            <div className="logos">
              {clients.map((c) => (
                <span key={c.file} className="reveal">
                  <img src={`/img/clients/${c.file}.webp`} width={406} height={100} alt={c.name} loading="lazy" />
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
