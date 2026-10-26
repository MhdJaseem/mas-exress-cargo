import { Icon, type IconName } from '../ui/Icon';

const ITEMS: { icon: IconName; text: string }[] = [
  { icon: 'bolt', text: 'Fast and reliable services' },
  { icon: 'tag', text: 'Competitive pricing' },
  { icon: 'radar', text: 'Real-time shipment tracking' },
  { icon: 'users', text: 'Experienced logistics team' },
  { icon: 'globe', text: 'Strong regional & international network' },
];
const num = (i: number) => String(i + 1).padStart(2, '0');

/** Why Choose Us: heading (with the MAS logo) over a row of five numbered feature cards; a faint logo watermark fills the panel. */
export function WhySection() {
  return (
    <section id="why" className="stack">
      <div className="why-wrap reveal">
        <div className="wrap why-grid">
          <div className="why-head">
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="big">
              Deliver Smarter with <span className="hlogo" role="img" aria-label="MAS Express." />
            </h2>
          </div>
          <ul className="why">
            {ITEMS.map((it, i) => (
              <li key={it.text}>
                <span className="ic">
                  <Icon name={it.icon} />
                </span>
                <span className="n" aria-hidden="true">
                  {num(i)}
                </span>
                <h3>{it.text}</h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
