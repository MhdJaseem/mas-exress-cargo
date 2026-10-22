/* Night-harbour backdrop for the logo intro: starry sky with a brand-red horizon glow, drifting clouds,
   a faint Dubai skyline (Burj Khalifa included) with twinkling windows, and a moving sea with the glow's
   reflection. The horizon (--hz in main.css) sits on the ship's waterline. Purely decorative. */

// tiny deterministic PRNG so the skyline is the same on every visit
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const W = 1200;
const H = 140;

function buildSkyline() {
  const r = rng(7);
  let d = `M0 ${H}`;
  const lights: { x: number; y: number; k: number }[] = [];
  let x = 0;
  while (x < W) {
    const w = 16 + Math.round(r() * 30);
    // taller towers toward the middle, lower at the edges
    const mid = 1 - Math.abs(x + w / 2 - W / 2) / (W / 2);
    const h = Math.round(18 + r() * 34 + mid * 26);
    const top = H - h;
    d += `H${x}V${top}`;
    if (r() > 0.7) d += `H${x + w / 2 - 2}V${top - 8}H${x + w / 2 + 2}V${top}`; // antenna
    d += `H${x + w}`;
    if (h > 34 && r() > 0.35)
      lights.push({ x: x + 4 + Math.round(r() * (w - 10)), y: top + 8 + Math.round(r() * (h - 20)), k: lights.length });
    x += w + (r() > 0.8 ? 6 : 0);
    d += `V${H}`;
  }
  d += 'Z';
  return { d, lights };
}

const SKYLINE = buildSkyline();
// Burj Khalifa: stepped, tapering tower with a needle spire, right of centre
const BURJ = 'M842 140V70H848V44H853V22H857V6H859V-30H861V6H863V22H867V44H872V70H878V140Z';

// Sea ripples in a 1200×300 box: rows bunch up toward the horizon (perspective), dashes get longer and
// thicker nearer the viewer; every dash is repeated at x + 1200 so a -1200 translate loops seamlessly.
function buildWaves() {
  const r = rng(11);
  const layers = [
    { o: 0.05, w: 0.8, d: '' },
    { o: 0.08, w: 1.1, d: '' },
    { o: 0.12, w: 1.4, d: '' },
  ];
  for (let k = 0; k < 24; k++) {
    const y = +(3 + 1.15 * Math.pow(k, 1.75)).toFixed(1);
    const depth = k / 23;
    const layer = layers[Math.min(2, Math.floor(depth * 3))];
    for (let n = 3 + Math.floor(r() * 4), i = 0; i < n; i++) {
      const x = Math.round(r() * W);
      const len = Math.round(14 + depth * 60 + r() * 30);
      for (const off of [0, W]) layer.d += `M${x + off} ${y}h${len}`;
    }
  }
  return layers;
}

const WAVES = buildWaves();

export function IntroBackdrop() {
  return (
    <div className="intro-bg" aria-hidden="true">
      <span className="ib-stars" />
      <span className="ib-stars ib-stars2" />
      <span className="ib-glow" />
      <span className="ib-cloud c1" />
      <span className="ib-cloud c2" />
      <span className="ib-cloud c3" />
      <svg className="ib-city" viewBox={`0 -40 ${W} ${H + 40}`} preserveAspectRatio="xMidYMax slice">
        <path className="ib-city-far" d={SKYLINE.d} transform="translate(-40 14) scale(1.07 .9)" />
        <path className="ib-city-near" d={SKYLINE.d} />
        <path className="ib-city-near" d={BURJ} />
        {SKYLINE.lights.map((l) => (
          <rect
            key={l.k}
            className="ib-light"
            x={l.x}
            y={l.y}
            width="2.4"
            height="2.4"
            style={{ animationDelay: `${(l.k * 0.37) % 3}s` }}
          />
        ))}
        <rect className="ib-light" x="859" y="-30" width="2" height="2" style={{ animationDelay: '.5s' }} />
      </svg>
      <span className="ib-sea" />
      <svg className="ib-waves" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <g className="ib-waves-g">
          {WAVES.map((l) => (
            <path key={l.o} d={l.d} strokeWidth={l.w} strokeOpacity={l.o} />
          ))}
        </g>
      </svg>
      <span className="ib-reflect" />
    </div>
  );
}
