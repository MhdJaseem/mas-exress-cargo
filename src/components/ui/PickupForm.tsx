import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { submitPickup } from '../../lib/api';
import { Icon } from './Icon';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { branches, branchGeo } from '../../data/company';

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
const BRANCH_WA = new Map(branches.map((b) => [b.name, b.whatsapp ?? '']));

type LatLng = [number, number];
const HAS_GEO = typeof navigator !== 'undefined' && 'geolocation' in navigator;

/** Straight-line (haversine) distance in km. */
function kmBetween([lat1, lng1]: LatLng, [lat2, lng2]: LatLng) {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}
const fmtKm = (km: number) => (km < 10 ? km.toFixed(1) : Math.round(km).toLocaleString('en')) + ' km';

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
  const [a, setA] = useState('');
  const [m, setM] = useState<string>(defaultMode);
  const [d, setD] = useState('');
  const [t, setT] = useState('');
  const [msg, setMsg] = useState('');
  const [pos, setPos] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);

  // Distance to each branch once the visitor shares their location; the list is then sorted nearest first.
  const dist = useMemo(() => {
    const m = new Map<string, number>();
    if (pos) for (const name of BRANCHES) if (branchGeo[name]) m.set(name, kmBetween(pos, branchGeo[name]));
    return m;
  }, [pos]);
  const options = useMemo(
    () => (pos ? [...BRANCHES].sort((x, y) => (dist.get(x) ?? Infinity) - (dist.get(y) ?? Infinity)) : BRANCHES),
    [pos, dist],
  );
  const fmtOption = (v: string) => (dist.has(v) ? `${fmtBranch(v)} · ${fmtKm(dist.get(v)!)}` : fmtBranch(v));

  function located(p: GeolocationPosition, pickNearest: boolean) {
    const here: LatLng = [p.coords.latitude, p.coords.longitude];
    setPos(here);
    setLocating(false);
    if (!pickNearest) return;
    let best = '';
    for (const name of BRANCHES)
      if (branchGeo[name] && (!best || kmBetween(here, branchGeo[name]) < kmBetween(here, branchGeo[best])))
        best = name;
    setBr((cur) => cur || best);
  }

  function locate() {
    setLocating(true);
    setMsg('');
    navigator.geolocation.getCurrentPosition(
      (p) => located(p, true),
      () => {
        setLocating(false);
        setMsg('Could not get your location. Please choose your branch from the list.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  // If location was already allowed on an earlier visit, sort by distance straight away (no prompt).
  useEffect(() => {
    if (!HAS_GEO || !navigator.permissions) return;
    let live = true;
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((s) => {
        if (live && s.state === 'granted')
          navigator.geolocation.getCurrentPosition(
            (p) => live && located(p, false),
            () => {},
            {
              maximumAge: 300000,
            },
          );
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = { b: fmtBranch(br), wa: BRANCH_WA.get(br) ?? '', cc, n: n.trim(), a: a.trim(), m, d, t };
    if (!br || !f.n || !f.a || !f.m || !f.d || !f.t) {
      setMsg('Please fill in all fields so we can confirm your pickup.');
      return;
    }
    setMsg(submitPickup(f));
  }

  return (
    <form className="pf" id="pickupForm" noValidate onSubmit={submit}>
      <div className="fld full">
        <div className="lbl-row">
          <label htmlFor="pbranch">Branch</label>
          {HAS_GEO && (
            <button type="button" className="near" onClick={locate} disabled={locating}>
              <Icon name="pin" />
              {locating ? 'Locating…' : pos ? 'Nearest first' : 'Use my location'}
            </button>
          )}
        </div>
        <Select
          id="pbranch"
          value={br}
          options={options}
          onChange={setBr}
          format={fmtOption}
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
        <label htmlFor="paddr">Pickup Address</label>
        <input
          id="paddr"
          type="text"
          autoComplete="street-address"
          placeholder="Building, street, area, city"
          required
          value={a}
          onChange={(e) => setA(e.target.value)}
        />
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
