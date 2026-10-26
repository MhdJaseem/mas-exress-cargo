import type { CSSProperties } from 'react';
import type { TrackingResult } from '../../lib/api';
import { Icon } from '../ui/Icon';

const STEPS = [
  'Booked & Dispatch',
  'Arrived at Centre',
  'At Destination',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];
const show = (v: unknown) => (v != null && v !== '' ? String(v) : '—');
const num = (i: number) => String(i + 1).padStart(2, '0');

/** Tracking result panel; hidden (CSS) until a search has been made. */
export function TrackingSection({ result }: { result: TrackingResult | null }) {
  const r = result;
  const summary: [string, unknown][] = [
    ['Tracking No.', r?.no],
    ['Last Status Date', r?.lastStatusDate],
    ['Shipper', r?.shipper],
    ['Consignee', r?.consignee],
    ['Booking Date', r?.bookingDate],
    ['Last Status', r?.lastStatus],
  ];
  const details: [string, unknown][] = [
    ['Origin:', r?.origin],
    ['Destination:', r?.destination],
    ['Service Type:', r?.serviceType],
    ['No. of Pieces:', r?.pieces],
    ['Weight:', r?.weight],
  ];
  const stage = r?.stage ?? -1;
  // red progress line: 0 before the first step, 1 at "Delivered"
  const fill = Math.max(0, stage) / (STEPS.length - 1);

  return (
    <section id="tracking" className={`stack${r ? ' show' : ''}`} aria-live="polite">
      <div className="wrap">
        <div className="tbox">
          <div className="tb-head">
            <div>
              <span className="eyebrow">Shipment Tracking</span>
              <h2 className="big">
                Track Your <em>Shipment</em>
              </h2>
            </div>
            <div className="tb-badges">
              <span className="tb-no">
                <small>Tracking No.</small>
                <b>{show(r?.no)}</b>
              </span>
              <span className={`tb-status${stage >= 0 ? ' live' : ''}`}>
                <i aria-hidden="true" />
                {stage >= 0 ? STEPS[stage] : show(r?.lastStatus)}
              </span>
            </div>
          </div>

          <ol
            className="steps"
            id="steps"
            aria-label="Shipment Tracking History"
            style={{ '--fill': fill } as CSSProperties}
          >
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={i < stage ? 'done' : i === stage ? 'done cur' : undefined}
                aria-current={i === stage ? 'step' : undefined}
              >
                <span className="dot">{i <= stage ? <Icon name="check" /> : num(i)}</span>
                <span className="lbl">{s}</span>
              </li>
            ))}
          </ol>

          <div className="tgrid">
            <div>
              <h3>
                <span className="ic">
                  <Icon name="radar" />
                </span>
                Shipment Summary
              </h3>
              <dl>
                {summary.map(([k, v]) => (
                  <Pair key={k} k={k} v={v} />
                ))}
              </dl>
            </div>
            <div>
              <h3>
                <span className="ic">
                  <Icon name="truck" />
                </span>
                Shipment Details
              </h3>
              <dl>
                {details.map(([k, v]) => (
                  <Pair key={k} k={k} v={v} />
                ))}
              </dl>
            </div>
          </div>

          <div className="hist-card">
            <h3>
              <span className="ic">
                <Icon name="clock" />
              </span>
              Shipment Tracking History
            </h3>
            <div className="hist-scroll">
              <table className="hist">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody id="hist">
                  {r?.history.length ? (
                    r.history.map((h, i) => (
                      <tr key={i}>
                        <td>{h.date}</td>
                        <td>{h.activity}</td>
                        <td>{h.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="empty">
                        <Icon name="clock" />
                        No tracking events loaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {import.meta.env.DEV && (
            <p className="note">
              Developer note (dev server only): connect the form to your tracking API in the{' '}
              <code>trackShipment()</code> function in <code>src/lib/api.ts</code> — it renders the summary, details,
              step progress and history table.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

const Pair = ({ k, v }: { k: string; v: unknown }) => (
  <>
    <dt>{k.replace(/:$/, '')}</dt>
    <dd>{show(v)}</dd>
  </>
);
