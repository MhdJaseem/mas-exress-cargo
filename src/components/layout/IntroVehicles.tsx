/* Vehicles for the logo intro (IntroSplash). Inline SVG in brand colours; fills/strokes live in main.css
   ("logo intro" → vehicles). Geometry is tied to the intro layout:
   - Jet: viewBox 480×112, the rope hangs from (240, 80) under the wing root — keep that point clear.
   - Ship: viewBox 400×130, deck at y = 50 (level with the letters' baseline); the S stands on x 36–160. */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const JET_BODY =
  'M14 62C14 52 24 44 44 40C60 34 80 31 104 30L380 30C400 30 420 36 448 46L456 52C452 58 440 60 420 62L340 76C330 78 320 79 300 79L70 79C40 79 14 72 14 62Z';
const JET_DOORS = [70, 186, 300];

export function Jet({ name }: { name: string }) {
  const lower = range(32)
    .map((i) => 78 + i * 9)
    .filter((x) => JET_DOORS.every((d) => Math.abs(x - d) > 7));
  const upper = [...range(9).map((i) => 98 + i * 8), ...range(8).map((i) => 300 + i * 8)];
  return (
    <svg className="plane" viewBox="0 0 480 112" aria-hidden="true">
      <defs>
        <linearGradient id="ig-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="st-w" />
          <stop offset=".55" className="st-w" />
          <stop offset="1" className="st-w" stopOpacity=".7" />
        </linearGradient>
        <linearGradient id="ig-tail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="st-red" />
          <stop offset="1" className="st-deep" />
        </linearGradient>
        <linearGradient id="ig-eng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="st-w" />
          <stop offset="1" className="st-w" stopOpacity=".55" />
        </linearGradient>
      </defs>

      {/* far-side stabiliser, then the fuselage (ink underlay + white gradient = soft belly shading) */}
      <path className="pl-far" d="M404 50L452 40L458 43L412 56Z" />
      <path className="pl-under" d={JET_BODY} />
      <path fill="url(#ig-body)" d={JET_BODY} />

      {/* cheatline sweeping up to a gradient tail fin; near-side stabiliser */}
      <path className="pl-red" d="M60 64H352L344 69H64Z" />
      <path className="pl-red" d="M352 64C380 60 410 52 440 44L446 48C416 58 386 66 344 69Z" />
      <path fill="url(#ig-tail)" d="M370 31L426 2H452L444 44C430 40 412 36 396 34Z" />
      <path className="pl-stab" d="M398 54L460 44L468 48L412 63Z" />

      {/* two decks of windows, doors, cockpit; carrier name on the upper deck */}
      <g className="pl-wins">
        {upper.map((x) => (
          <rect key={`u${x}`} x={x} y="40" width="4" height="5" rx="1.5" />
        ))}
        {lower.map((x) => (
          <rect key={`l${x}`} x={x} y="52" width="4.5" height="6" rx="1.8" />
        ))}
      </g>
      <g className="pl-doors">
        {JET_DOORS.map((x) => (
          <rect key={x} x={x - 3} y="48" width="7" height="13" rx="2" />
        ))}
      </g>
      <path className="pl-cock" d="M26 49C30 45 38 42 48 41L50 47C42 47 34 49 27 52Z" />
      {name && (
        <text className="pl-name" x="236" y="46" textAnchor="middle">
          {name}
        </text>
      )}

      {/* swept wing with two engines (pylon, nacelle, intake, exhaust); x 224–252 stays clear for the rope */}
      <path className="pl-wing" d="M188 70L300 70L396 100L372 104Z" />
      <path className="pl-edge" d="M188 70L372 104" />
      <path className="pl-pylon" d="M168 76H198L192 86H172Z" />
      <path
        className="pl-nac"
        fill="url(#ig-eng)"
        d="M142 90C142 84 150 81 162 81H204C210 81 214 85 214 90C214 95 210 99 204 99H162C150 99 142 96 142 90Z"
      />
      <ellipse className="pl-intake" cx="146" cy="90" rx="5" ry="8.5" />
      <path className="pl-exh" d="M214 85L224 88V92L214 95Z" />
      <path className="pl-pylon" d="M272 86H296L292 95H276Z" />
      <path
        className="pl-nac"
        fill="url(#ig-eng)"
        d="M252 100C252 95 259 92 269 92H306C312 92 316 96 316 100C316 104 312 108 306 108H269C259 108 252 105 252 100Z"
      />
      <ellipse className="pl-intake" cx="256" cy="100" rx="4.5" ry="7.5" />
      <path className="pl-exh" d="M316 96L325 99V102L316 105Z" />
    </svg>
  );
}

/* containers: 8 bays × 3–4 tiers aft of the open bow deck, colours cycled from the brand palette */
const BOX_COLS = ['bx-a', 'bx-b', 'bx-c', 'bx-d', 'bx-e'];
const BOXES = range(8).flatMap((c) =>
  range([4, 4, 3, 4, 4, 3, 4, 3][c]).map((t) => ({
    x: 168 + c * 20,
    y: 47 - (t + 1) * 11,
    k: BOX_COLS[(c * 3 + t * 2 + (c >> 1)) % BOX_COLS.length],
  })),
);
const HULL = 'M4 36C16 40 26 46 32 50H396L392 70C388 92 380 108 370 120H58C42 108 30 90 22 72C16 58 10 46 4 36Z';

export function ContainerShip({ name }: { name: string }) {
  return (
    <svg className="ship" viewBox="0 0 400 130" aria-hidden="true">
      <defs>
        <linearGradient id="ig-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="st-red" />
          <stop offset="1" className="st-deep" />
        </linearGradient>
        <linearGradient id="ig-sup" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className="st-w" />
          <stop offset="1" className="st-w" stopOpacity=".72" />
        </linearGradient>
        <pattern id="ig-corr" width="3" height="11" patternUnits="userSpaceOnUse">
          <path className="sh-corr" d="M1.5 0V11" />
        </pattern>
      </defs>

      {/* hull: raked, flared bow; anti-fouling band; white sheer stripe; carrier name */}
      <path fill="url(#ig-hull)" d={HULL} />
      <path className="sh-boot" d="M48 106H380C377 111 374 116 370 120H58C54 116 51 111 48 106Z" />
      <path className="sh-stripe" d="M26 58H394L393 63H29Z" />
      {name && (
        <text className="sh-name" x="212" y="92" textAnchor="middle">
          {name}
        </text>
      )}

      {/* bulwark, bow railing and mast */}
      <path className="sh-deck" d="M30 47H396V51H32Z" />
      <path
        className="sh-rail"
        d={`M36 43H160${range(11)
          .map((i) => `M${38 + i * 12} 43V47`)
          .join('')}`}
      />
      <path className="sh-mast" d="M20 40V16M15 22H25" />
      <circle className="sh-lamp" cx="20" cy="15" r="2" />

      {/* containers with corrugated sides */}
      <g className="sh-boxes">
        {BOXES.map((b) => (
          <g key={`${b.x}-${b.y}`}>
            <rect className={b.k} x={b.x} y={b.y} width="19" height="10.5" />
            <rect fill="url(#ig-corr)" x={b.x} y={b.y} width="19" height="10.5" />
          </g>
        ))}
      </g>

      {/* superstructure: accommodation block, bridge with wings, radar mast, funnel, lifeboat */}
      <path className="sh-under" d="M334 50V18H388V50Z" />
      <path fill="url(#ig-sup)" d="M334 50V18H388V50Z" />
      <g className="sh-win">
        {[24, 31, 38].flatMap((y) =>
          range(8).map((i) => <rect key={`${y}-${i}`} x={338 + i * 6} y={y} width="3.5" height="3" rx=".6" />),
        )}
        <path d="M330 13.5H388V16.5H330Z" />
      </g>
      <path className="sh-white" d="M326 12H392V18H326ZM338 5H380V12H338Z" />
      <path className="sh-mast" d="M352 5V-9M346 -5H358" />
      <path className="sh-white" d="M370 5V-13H386V5Z" />
      <path className="sh-red" d="M370 -13H386V-7H370Z" />
      <path className="sh-cap" d="M369 -16H387V-13H369Z" />
      <path
        className="sh-boat"
        d="M336 45C336 42 340 41 346 41H354C358 41 360 43 360 45C360 47 358 48 354 48H342C338 48 336 47 336 45Z"
      />
    </svg>
  );
}
