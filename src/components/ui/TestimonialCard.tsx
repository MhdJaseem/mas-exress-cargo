import type { Testimonial } from '../../data/company';

export function TestimonialCard({ t, className = 'tm' }: { t: Testimonial; className?: string }) {
  return (
    <figure className={className}>
      <span className="q">“</span>
      <blockquote>{t.quote}</blockquote>
      <figcaption className="who">
        <span className="av">{t.initials}</span>
        <span>
          <b>{t.name}</b>
          <small>{t.where}</small>
        </span>
      </figcaption>
    </figure>
  );
}
