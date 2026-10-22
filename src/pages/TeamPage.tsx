import { PageHero } from '../components/ui/PageHero';
import { HeadingText, SectionHead } from '../components/ui/Heading';
import { TeamShowcase } from '../components/team/TeamShowcase';
import { ceo, TEAM_LEAD } from '../data/company';
import { pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';

export default function TeamPage() {
  useDocumentMeta(pageTitle('Our Team'), TEAM_LEAD);
  useReveal('inner');

  return (
    <>
      <PageHero
        image="/img/sections/about-poster.jpg"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Team' }]}
        title={['', 'Team']}
      />
      <div className="pbody solo">
        <div className="main-col">
          <section className="blk">
            <div className="ceo">
              <div className="ceo-img reveal">
                <img
                  src={ceo.photo}
                  width={500}
                  height={600}
                  alt={`${ceo.fullName}, CEO of MAS Express Cargo`}
                  loading="lazy"
                />
              </div>
              <div className="reveal">
                <h2 className="big">
                  <HeadingText h={ceo.name} />
                </h2>
                <p className="role">{ceo.role}</p>
                {ceo.message.map((p) => (
                  <p key={p.slice(0, 30)} className="para">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="blk">
            <SectionHead eyebrow="Meet Our Team" heading={['Our ', 'Team']} lead={TEAM_LEAD} />
            <div className="reveal">
              <TeamShowcase />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
