import { useState, type FormEvent } from 'react';
import { submitPickup } from '../../lib/api';
import { Icon } from './Icon';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { branches } from '../../data/company';

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

/** Branches from the Our Branches page except the head office (`main`), shown as e.g. "Deira, Dubai" / "Delhi Office, India". */
const BRANCHES = branches.filter((b) => !b.main).map((b) => b.name);
const REGION = new Map(branches.map((b) => [b.name, b.region.replace(/, UAE$/, '')]));
const fmtBranch = (v: string) => `${v}, ${REGION.get(v)}`;

/** Pickup time slots every 30 minutes, stored as hh:mm (24h) and shown as e.g. "9:30 AM". */
const TIME_SLOTS = Array.from(
  { length: 48 },
  (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
);
const fmtTime = (v: string) => {
  const [h, mm] = v.split(':').map(Number);
  return `${h % 12 || 12}:${String(mm).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/** Request Pickup form (home page and service-page sidebar). Only one per page — ids are fixed. */
export function PickupForm({ defaultMode = '' }: { defaultMode?: ShipmentMode | '' }) {
  const [br, setBr] = useState('');
  const [cc, setCc] = useState(COUNTRY_CODES[0]);
  const [n, setN] = useState('');
  const [m, setM] = useState<string>(defaultMode);
  const [d, setD] = useState('');
  const [t, setT] = useState('');
  const [msg, setMsg] = useState('');

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = { b: fmtBranch(br), cc, n: n.trim(), m, d, t };
    if (!br || !f.n || !f.m || !f.d || !f.t) {
      setMsg('Please fill in all fields so we can confirm your pickup.');
      return;
    }
    setMsg(submitPickup(f));
  }

  return (
    <form className="pf" id="pickupForm" noValidate onSubmit={submit}>
      <div className="fld full">
        <label htmlFor="pbranch">Branch</label>
        <Select
          id="pbranch"
          value={br}
          options={BRANCHES}
          onChange={setBr}
          format={fmtBranch}
          placeholder="Select branch"
        />
      </div>
      <div className="fld full">
        <label htmlFor="pnum">Phone number</label>
        <div className="phone">
          <Select id="pcc" aria-label="Country code" value={cc} options={COUNTRY_CODES} onChange={setCc} />
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
        <Select id="pmode" value={m} options={SHIPMENT_MODES} onChange={setM} placeholder="Select mode" />
      </div>
      <div className="fld">
        <label htmlFor="pdate">Pickup Date</label>
        <DatePicker id="pdate" value={d} onChange={setD} />
      </div>
      <div className="fld">
        <label htmlFor="ptime">Pickup Time</label>
        <Select
          id="ptime"
          value={t}
          options={TIME_SLOTS}
          onChange={setT}
          format={fmtTime}
          startAt="09:00"
          placeholder="Select time"
        />
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
