import { useState, type FormEvent } from 'react';
import { submitPickup } from '../../lib/api';
import { Icon } from './Icon';

export const SHIPMENT_MODES = ['Air Freight', 'Sea Freight', 'Land Transport'] as const;
export type ShipmentMode = (typeof SHIPMENT_MODES)[number];

const COUNTRY_CODES = [
  '🇦🇪 UAE (+971)',
  '🇮🇳 India (+91)',
  '🇶🇦 Qatar (+974)',
  '🇸🇦 Saudi Arabia (+966)',
  '🇴🇲 Oman (+968)',
  '🇧🇭 Bahrain (+973)',
  '🇰🇼 Kuwait (+965)',
  '🇺🇸 USA (+1)',
  '🇬🇧 UK (+44)',
  '🇦🇺 Australia (+61)',
  '🇩🇪 Germany (+49)',
  '🇫🇷 France (+33)',
  '🇮🇹 Italy (+39)',
  '🇯🇵 Japan (+81)',
  '🇨🇳 China (+86)',
  '🇷🇺 Russia (+7)',
  '🇵🇰 Pakistan (+92)',
  '🇧🇩 Bangladesh (+880)',
  '🇱🇰 Sri Lanka (+94)',
  '🇲🇾 Malaysia (+60)',
  '🇸🇬 Singapore (+65)',
];

const today = () => new Date().toISOString().slice(0, 10);

/** Request Pickup form (home page and service-page sidebar). Only one per page — ids are fixed. */
export function PickupForm({ defaultMode = '' }: { defaultMode?: ShipmentMode | '' }) {
  const [cc, setCc] = useState(COUNTRY_CODES[0]);
  const [n, setN] = useState('');
  const [m, setM] = useState<string>(defaultMode);
  const [d, setD] = useState('');
  const [t, setT] = useState('');
  const [msg, setMsg] = useState('');

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = { cc, n: n.trim(), m, d, t };
    if (!f.n || !f.m || !f.d || !f.t) {
      setMsg('Please fill in all fields so we can confirm your pickup.');
      return;
    }
    setMsg(submitPickup(f));
  }

  return (
    <form className="pf" id="pickupForm" noValidate onSubmit={submit}>
      <div className="fld full">
        <label htmlFor="pnum">Phone number</label>
        <div className="phone">
          <select id="pcc" aria-label="Country code" value={cc} onChange={(e) => setCc(e.target.value)}>
            {COUNTRY_CODES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            id="pnum"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="Phone number"
            required
            value={n}
            onChange={(e) => setN(e.target.value)}
          />
        </div>
      </div>
      <div className="fld full">
        <label htmlFor="pmode">Shipment Mode</label>
        <select id="pmode" required value={m} onChange={(e) => setM(e.target.value)}>
          <option value="">Select mode</option>
          {SHIPMENT_MODES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="fld">
        <label htmlFor="pdate">Pickup Date</label>
        <input id="pdate" type="date" required min={today()} value={d} onChange={(e) => setD(e.target.value)} />
      </div>
      <div className="fld">
        <label htmlFor="ptime">Pickup Time</label>
        <input id="ptime" type="time" required value={t} onChange={(e) => setT(e.target.value)} />
      </div>
      <button className="btn" type="submit">
        Submit <Icon name="arrow" />
      </button>
      <p className="msg" id="pmsg" role="status">
        {msg}
      </p>
    </form>
  );
}
