import type { TrackingResult } from '../../lib/api';

const STEPS = [
  'Booked & Dispatch',
  'Arrived at Centre',
  'At Destination',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];
const show = (v: unknown) => (v != null && v !== '' ? String(v) : '—');

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

  return (
    <section id="tracking" className={`stack${r ? ' show' : ''}`} aria-live="polite">
      <div className="wrap">
        <div className="tbox">
          <h2>Track Your Shipment</h2>
          <div className="tgrid">
            <div>
              <h3>Shipment Summary</h3>
              <dl>
                {summary.map(([k, v]) => (
                  <Pair key={k} k={k} v={v} />
                ))}
              </dl>
            </div>
            <div>
              <h3>Shipment Details</h3>
              <dl>
                {details.map(([k, v]) => (
                  <Pair key={k} k={k} v={v} />
                ))}
              </dl>
            </div>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 500 }}>Shipment Tracking History</h3>
          <ol className="steps" id="steps">
            {STEPS.map((s, i) => (
              <li key={s} className={i <= stage ? 'done' : undefined}>
                {s}
              </li>
            ))}
          </ol>
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
                  <td colSpan={3}>No tracking events loaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="note">
            Developer note: connect the form to your tracking API in the <code>trackShipment()</code> function in{' '}
            <code>src/lib/api.ts</code> — it renders the summary, details, step progress and history table.
          </p>
        </div>
      </div>
    </section>
  );
}

const Pair = ({ k, v }: { k: string; v: unknown }) => (
  <>
    <dt>{k}</dt>
    <dd>{show(v)}</dd>
  </>
);
