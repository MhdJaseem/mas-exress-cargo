import { Icon } from '../ui/Icon';
import { CountUp } from '../ui/CountUp';
import { SectionHead } from '../ui/Heading';
import { CardCarousel } from './CardCarousel';
import type { Block, Card } from '../../data/services';

export function FeatureCard({ card }: { card: Card }) {
  return (
    <div className="fc reveal">
      <span className="fi">
        <Icon name={card.icon} />
      </span>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      {card.list && (
        <ul className="ticks">
          {card.list.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Renders one content block of a service page (see the Block type in data/services.ts). */
export function ServiceBlock({ block: b }: { block: Block }) {
  switch (b.kind) {
    case 'paras':
      return (
        <section className="blk">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} />
          {b.paras.map((p) => (
            <p key={p.slice(0, 40)} className="para reveal">
              {p}
            </p>
          ))}
        </section>
      );
    case 'cards':
      return (
        <section className="blk">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} />
          {/* short benefit cards spin on a cylinder; cards with bullet lists stay in the grid */}
          {b.cards.some((c) => c.list) ? (
            <div className={`fgrid3 c${b.cols}`}>
              {b.cards.map((c) => (
                <FeatureCard key={c.title} card={c} />
              ))}
            </div>
          ) : (
            <CardCarousel cards={b.cards} label={b.heading.join('')} />
          )}
        </section>
      );
    case 'steps':
      return (
        <section className="blk">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} />
          <ol className="psteps">
            {b.steps.map(([title, text], i) => {
              const n = String(i + 1).padStart(2, '0');
              return (
                <li key={title} className="reveal">
                  <span className="node" aria-hidden="true">
                    {n}
                  </span>
                  <div className="ptxt">
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <span className="ghost" aria-hidden="true">
                    {n}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      );
    case 'stats':
      return (
        <section className="blk">
          <div className="stats4">
            {b.stats.map((s, i) => (
              <div key={s.label} className={`stat ${i % 2 ? 'b' : 'a'} reveal`}>
                <b>
                  <CountUp value={s.value} duration={1500} />
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      );
    case 'table':
      return (
        <section className="blk">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} />
          <div className="tbl reveal">
            <table>
              <thead>
                <tr>
                  {b.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case 'faq':
      return (
        <section className="blk">
          <SectionHead eyebrow={b.eyebrow} heading={b.heading} lead={b.lead} />
          <div className="faq">
            {b.items.map(([q, a], i) => (
              <details key={q} className="reveal" open={i === 0}>
                <summary>
                  {q}
                  <span className="pl">
                    <Icon name="plus" />
                  </span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      );
  }
}
