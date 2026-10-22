import { TestimonialCard } from './TestimonialCard';
import { testimonials, TESTIMONIALS_LEAD } from '../../data/company';

/** Testimonials block shared by the home page and About: copy on the left, infinite vertical marquee on the right
    (a stacked list below 900px). The list is rendered twice — the duplicate group is what makes the loop seamless. */
export function TestimonialsSplit() {
  const group = (hidden: boolean) => (
    <div className="tgroup" aria-hidden={hidden || undefined}>
      {testimonials.map((t, i) => (
        <TestimonialCard key={t.name} t={t} className={i === 0 ? 'tm hl' : 'tm'} />
      ))}
    </div>
  );

  return (
    <div className="tsplit">
      <div className="tleft reveal">
        <span className="eyebrow">Testimonials</span>
        <h2 className="big">
          What Our Loyal Clients <em>Say About Us</em>
        </h2>
        <p className="lead">{TESTIMONIALS_LEAD}</p>
      </div>
      <div className="tmarq" aria-label="Client testimonials">
        <div className="ttrack">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
