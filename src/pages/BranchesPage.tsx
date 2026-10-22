import { useState } from 'react';
import { PageHero } from '../components/ui/PageHero';
import { Icon, type IconName } from '../components/ui/Icon';
import { branches, type BranchRow } from '../data/company';
import { pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';

/** Filter key = first part of the region ("Dubai, UAE" → "Dubai"); short code shown on each card. */
const area = (region: string) => region.split(',')[0];
const CODES: Record<string, string> = { Dubai: 'DXB', Sharjah: 'SHJ', 'Abu Dhabi': 'AUH', India: 'IND' };

const rowIcon = (r: BranchRow): IconName => (r.href?.startsWith('mailto:') ? 'mail' : 'phone');

export default function BranchesPage() {
  useDocumentMeta(
    pageTitle('Our Branches'),
    'MAS Express Cargo branches in Sharjah, Dubai, Abu Dhabi and India, with contact numbers and opening hours.',
  );
  useReveal('inner');

  const head = branches.find((b) => b.main)!;
  const rest = branches.filter((b) => !b.main);
  const areas = Array.from(new Set(rest.map((b) => area(b.region))));
  const [filter, setFilter] = useState('All');
  const shown = rest.filter((b) => filter === 'All' || area(b.region) === filter).length;

  const headLinks = head.rows.filter((r) => r.href);
  const headHours = head.rows.find((r) => !r.href);

  return (
    <>
      <PageHero
        image="/img/pages/warehousing.webp"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Branches' }]}
        title={['', 'Branches']}
      />
      <div className="pbody solo">
        <div className="main-col">
          {/* Head office: details + actions on the left, weekly hours on a red panel */}
          <section className="blk">
            <article className="hq reveal">
              <div className="hq-main">
                <span className="hq-tag">
                  <Icon name="warehouse" />
                  {head.region}
                </span>
                <h2>{head.name}</h2>
                {head.address && (
                  <p className="hq-addr">
                    <Icon name="pin" />
                    {head.address}
                  </p>
                )}
                <div className="hq-actions">
                  {headLinks.map((r) => (
                    <a key={r.label} href={r.href} className="hq-act">
                      <span className="ic">
                        <Icon name={rowIcon(r)} />
                      </span>
                      <span>
                        <small>{r.label}</small>
                        {r.text}
                      </span>
                    </a>
                  ))}
                </div>
                {head.address && (
                  <a
                    className="hq-dir"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(head.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions <Icon name="arrow" />
                  </a>
                )}
              </div>
              {headHours && (
                <div className="hq-hours">
                  <span className="hq-hlabel">
                    <Icon name="clock" />
                    {headHours.label}
                  </span>
                  <ul>
                    {headHours.text.split('|').map((part) => {
                      const s = part.trim();
                      const i = s.indexOf(' ');
                      return (
                        <li key={s}>
                          <b>{s.slice(0, i)}</b>
                          <span>{s.slice(i + 1)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>

            {/* Branch finder: region chips filter the grid (cards stay mounted so scroll-reveal keeps working) */}
            <div className="bf-bar reveal">
              <div className="bf-chips" role="group" aria-label="Filter branches by region">
                {['All', ...areas].map((a) => {
                  const count = a === 'All' ? rest.length : rest.filter((b) => area(b.region) === a).length;
                  return (
                    <button
                      key={a}
                      type="button"
                      className="bf-chip"
                      aria-pressed={filter === a}
                      onClick={() => setFilter(a)}
                    >
                      {a}
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="bf-count" role="status">
                {shown} {shown === 1 ? 'branch' : 'branches'}
              </p>
            </div>
            <div className="bgrid">
              {rest.map((b) => {
                const a = area(b.region);
                const call = b.rows.find((r) => r.href);
                const hours = b.rows.find((r) => !r.href);
                return (
                  <article key={b.name} className="bcard reveal" hidden={filter !== 'All' && a !== filter}>
                    <div className="bc-top">
                      <span className="bc-code">{CODES[a] ?? a.slice(0, 3).toUpperCase()}</span>
                      <span className="bc-pin">
                        <Icon name="pin" />
                      </span>
                    </div>
                    <h3>{b.name}</h3>
                    <p className="bc-addr">{b.address ?? b.region}</p>
                    <div className="bc-foot">
                      {call && (
                        <a className="bc-call" href={call.href} aria-label={`${call.label} ${b.name}: ${call.text}`}>
                          <Icon name="phone" />
                          {call.text}
                          <Icon name="arrow" />
                        </a>
                      )}
                      {hours && (
                        <span className="bc-hours">
                          <Icon name="clock" />
                          {hours.text}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
