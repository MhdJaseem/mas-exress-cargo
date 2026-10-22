import { useEffect, useState, type CSSProperties } from 'react';

/* "From Dubai to the world" route map for the About page (.jr-map, styles in inner.css).

   An azimuthal projection centred on Dubai: each pin sits at its true compass bearing from Dubai, and its
   distance from the centre grows with the square root of the real distance (so the nearby Middle East and
   South Asia pins aren't squashed into the middle). Names sit in a column on each side of the map at the height
   where the pin's direction meets the map edge (nudged apart where they would collide, e.g. Europe), joined to
   the pin by a leader line.

   DESTINATIONS is the client's list of the countries/regions MAS ships to. Regions use one representative
   city as the pin (noted below). Add or move a destination here and its route, pin and label follow. */

const DUBAI = { lat: 25.2048, lon: 55.2708 };

export const DESTINATIONS: { name: string; lat: number; lon: number }[] = [
  { name: 'UK', lat: 51.5074, lon: -0.1278 }, // London
  { name: 'USA', lat: 40.7128, lon: -74.006 }, // New York
  { name: 'Canada', lat: 43.6532, lon: -79.3832 }, // Toronto
  { name: 'Africa', lat: -1.2921, lon: 36.8219 }, // Nairobi
  { name: 'France', lat: 48.8566, lon: 2.3522 }, // Paris
  { name: 'Germany', lat: 50.1109, lon: 8.6821 }, // Frankfurt
  { name: 'Netherlands', lat: 52.3676, lon: 4.9041 }, // Amsterdam
  { name: 'Sweden', lat: 59.3293, lon: 18.0686 }, // Stockholm
  { name: 'Norway', lat: 59.9139, lon: 10.7522 }, // Oslo
  { name: 'Rest of Europe', lat: 48.2082, lon: 16.3738 }, // Vienna
  { name: 'Australia', lat: -33.8688, lon: 151.2093 }, // Sydney
  { name: 'New Zealand', lat: -36.8485, lon: 174.7633 }, // Auckland
  { name: 'India', lat: 28.6139, lon: 77.209 }, // Delhi
  { name: 'Pakistan', lat: 24.8607, lon: 67.0011 }, // Karachi
  { name: 'Bangladesh', lat: 23.8103, lon: 90.4125 }, // Dhaka
  { name: 'Sri Lanka', lat: 6.9271, lon: 79.8612 }, // Colombo
  { name: 'Middle East', lat: 24.7136, lon: 46.6753 }, // Riyadh
  { name: 'Nepal', lat: 27.7172, lon: 85.324 }, // Kathmandu
  { name: 'China', lat: 31.2304, lon: 121.4737 }, // Shanghai
  { name: 'Far East', lat: 35.6762, lon: 139.6503 }, // Tokyo
];

const W = 600;
const H = 520;
const CX = W / 2;
const CY = H / 2;
const R = 172; // map radius
const COL = R + 16; // label columns sit this far left/right of the centre
const ROW = 19; // minimum vertical distance between labels in a column
const MAX_KM = 15000; // distance at the edge of the map
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const polar = (r: number, bearingDeg: number) => [
  CX + r * Math.sin(rad(bearingDeg)),
  CY - r * Math.cos(rad(bearingDeg)),
];

/** Great-circle distance (km) and initial bearing (degrees from north, 0–360) from Dubai. */
function fromDubai(lat: number, lon: number) {
  const [p1, p2, dl] = [rad(DUBAI.lat), rad(lat), rad(lon - DUBAI.lon)];
  const a = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  const km = 2 * 6371 * Math.asin(Math.sqrt(a));
  const b = deg(
    Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)),
  );
  return { km, bearing: (b + 360) % 360 };
}

/** Label heights for one column: start at each label's ideal height, then push neighbours apart (at least ROW)
    by merging touching labels into evenly spaced groups centred on their ideal heights; keep inside the box. */
function stack(ideal: number[]) {
  const order = ideal.map((y, i) => ({ y, i })).sort((p, q) => p.y - q.y);
  let groups = order.map((o) => ({ items: [o], mean: o.y }));
  const top = (g: (typeof groups)[number]) =>
    Math.min(Math.max(g.mean - ((g.items.length - 1) * ROW) / 2, 22), H - 12 - (g.items.length - 1) * ROW);
  for (let merged = true; merged;) {
    merged = false;
    for (let k = 0; k < groups.length - 1; k++) {
      if (top(groups[k]) + groups[k].items.length * ROW > top(groups[k + 1])) {
        const items = [...groups[k].items, ...groups[k + 1].items];
        groups = [
          ...groups.slice(0, k),
          { items, mean: items.reduce((s, o) => s + o.y, 0) / items.length },
          ...groups.slice(k + 2),
        ];
        merged = true;
        break;
      }
    }
  }
  const res: number[] = [];
  groups.forEach((g) => g.items.forEach((o, j) => (res[o.i] = top(g) + j * ROW)));
  return res;
}

const base = DESTINATIONS.map((d) => ({ ...d, ...fromDubai(d.lat, d.lon), right: false, ly: 0 }));
for (const right of [true, false]) {
  const side = base.filter((b) => b.bearing < 180 === right);
  // ideal height = where the pin's direction meets the edge of the map
  const ys = stack(side.map((b) => CY - (R + 8) * Math.cos(rad(b.bearing))));
  side.forEach((b, j) => Object.assign(b, { right, ly: ys[j] }));
}

const points = base.map((p) => {
  const [x, y] = polar(R * Math.sqrt(p.km / MAX_KM), p.bearing);
  // gently curved route: control point pushed sideways from the midpoint
  const len = Math.hypot(x - CX, y - CY);
  const k = 0.14 * len;
  const [mx, my] = [(CX + x) / 2, (CY + y) / 2];
  const [nx, ny] = [-(y - CY) / len, (x - CX) / len];
  const route = `M${CX} ${CY} Q${(mx + nx * k).toFixed(1)} ${(my + ny * k).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  // leader: pin -> edge of the map in the pin's direction -> across to the label in its column
  const [ex, ey] = polar(R + 3, p.bearing);
  const lx = p.right ? CX + COL : CX - COL;
  const tx = p.right ? lx + 6 : lx - 6;
  const leader = `M${x.toFixed(1)} ${y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${lx.toFixed(1)} ${p.ly.toFixed(1)}`;
  return { ...p, x, y, route, leader, lx: tx, ty: p.ly + 4.5, anchor: p.right ? ('start' as const) : ('end' as const) };
});

const RINGS = [1000, 4000, 9000, MAX_KM].map((km) => R * Math.sqrt(km / MAX_KM));
const CYCLE_MS = 1800;

export function JourneyMap() {
  // one destination is highlighted at a time: cycles on its own, hover takes over
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (hover !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % points.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [hover]);

  const on = hover ?? active;

  return (
    <>
      <svg
        className="jr-map-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Route map: MAS Express Cargo ships from Dubai to ${DESTINATIONS.map((d) => d.name).join(', ')}`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <radialGradient id="jm-glow">
            <stop offset="0" stopColor="#E31E24" stopOpacity=".45" />
            <stop offset="1" stopColor="#E31E24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="jm-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E31E24" stopOpacity="0" />
            <stop offset="1" stopColor="#E31E24" stopOpacity=".3" />
          </linearGradient>
        </defs>

        {/* grid: distance rings, spokes every 30° */}
        <g className="jm-grid">
          {RINGS.map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} />
          ))}
          {Array.from({ length: 12 }, (_, i) => {
            const [x2, y2] = polar(R, i * 30);
            return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} />;
          })}
        </g>

        {/* radar sweep */}
        <g className="jm-sweep">
          <path
            d={`M${CX} ${CY} L${CX + R} ${CY} A${R} ${R} 0 0 0 ${CX + R * Math.cos(rad(-50))} ${CY + R * Math.sin(rad(-50))} Z`}
            fill="url(#jm-sweep)"
          />
        </g>

        <circle cx={CX} cy={CY} r={95} fill="url(#jm-glow)" />

        {/* routes, moving parcels, pins, leaders and labels */}
        {points.map((p, i) => (
          <g
            key={p.name}
            className={`jm-route${i === on ? ' on' : ''}`}
            style={{ '--k': i } as CSSProperties}
            onMouseEnter={() => setHover(i)}
          >
            <path className="jm-arc" d={p.route} />
            <path className="jm-dash route" d={p.route} />
            <path className="jm-leader" d={p.leader} />
            <circle className="jm-mover" r="2.8">
              <animateMotion dur="3.6s" begin={`${(i * 0.29).toFixed(2)}s`} repeatCount="indefinite" path={p.route} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;.1;.85;1"
                dur="3.6s"
                begin={`${(i * 0.29).toFixed(2)}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle className="jm-dot" cx={p.x} cy={p.y} r="3.6" />
            <text className="jm-label" x={p.lx} y={p.ty} textAnchor={p.anchor}>
              {p.name}
            </text>
          </g>
        ))}

        {/* Dubai hub */}
        <g className="jm-hub">
          <circle className="pulse" cx={CX} cy={CY} r="15" />
          <circle className="pulse p2" cx={CX} cy={CY} r="15" />
          <circle cx={CX} cy={CY} r="8" />
          <rect x={CX - 32} y={CY + 14} width="64" height="22" rx="11" />
          <text x={CX} y={CY + 29} textAnchor="middle">
            Dubai
          </text>
        </g>
      </svg>

      {/* phones: the ring labels would be too small, so the names are listed under the map instead */}
      <ul className="jm-list" aria-hidden="true">
        {points.map((p, i) => (
          <li key={p.name} className={i === on ? 'on' : undefined}>
            {p.name}
          </li>
        ))}
      </ul>
    </>
  );
}
