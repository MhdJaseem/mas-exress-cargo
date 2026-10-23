/* Night-harbour backdrop for the logo intro: starry sky with a brand-red horizon glow, drifting clouds,
   a Dubai skyline (Burj Khalifa, Burj Al Arab, Emirates Towers, Cayan Tower, Dubai Frame, Museum of the
   Future over marina towers) with twinkling windows, and a moving sea with the glow's
   reflection. The horizon (--hz in main.css) sits on the ship's waterline. Purely decorative. */

// tiny deterministic PRNG so the skyline is the same on every visit
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const W = 1200;
const H = 320; // skyline box 1200×320, ground at y = 320

// Background towers (marina / downtown), two depths; taller clusters downtown and at the marina.
function buildTowers(seed: number, base: number, spread: number) {
  const r = rng(seed);
  let d = `M0 ${H}`;
  const lights: { x: number; y: number }[] = [];
  let x = 0;
  while (x < W) {
    const w = 14 + Math.round(r() * 22);
    const c = x + w / 2;
    const boost = Math.max(0, 1 - Math.abs(c - 640) / 220) * 0.8 + Math.max(0, 1 - Math.abs(c - 1080) / 140);
    const top = H - Math.round(base + r() * spread + boost * spread);
    d += `H${x}V${top}`;
    if (r() > 0.75) d += `H${c - 1.5}V${top - 10}H${c + 1.5}V${top}`; // antenna
    d += `H${x + w}V${H}`;
    if (r() > 0.4) lights.push({ x: x + 3 + Math.round(r() * (w - 8)), y: top + 6 + Math.round(r() * (H - top - 20)) });
    x += w + (r() > 0.85 ? 5 : 0);
  }
  return { d: d + 'Z', lights };
}

const FAR = buildTowers(7, 40, 55);
const MID = buildTowers(19, 22, 38);

// Landmarks (silhouettes, ground at y = 320)
const BK = 790; // Burj Khalifa centre: staggered setbacks, different on each side, needle spire
const BURJ_KHALIFA =
  `M${BK - 36} ${H}V250H${BK - 30}V205H${BK - 24}V160H${BK - 18}V120H${BK - 13}V88H${BK - 9}V62H${BK - 6}V42` +
  `H${BK - 3.5}V26H${BK - 1.4}V0H${BK + 1.4}V30H${BK + 3}V48H${BK + 5}V70H${BK + 8}V100H${BK + 12}V138` +
  `H${BK + 17}V178H${BK + 23}V222H${BK + 29}V262H${BK + 36}V${H}Z`;
const BURJ_KHALIFA_CORE = `M${BK - 1.6} 40H${BK + 1.6}V${H}H${BK - 1.6}Z`;
// Burj Al Arab (drawn shifted −80, at the left edge)
const BURJ_AL_ARAB =
  'M200 120C252 150 276 220 280 320H200Z' + // sail
  'M198 320V96L201 84L204 96V320Z' + // mast
  'M200 104C188 160 184 240 186 320H191C190 240 194 164 203 112Z'; // exoskeleton
const BURJ_AL_ARAB_PAD = 'M177 190a9 2.6 0 1 0 18 0a9 2.6 0 1 0-18 0Z';
const EMIRATES_TOWERS = 'M930 320V160L956 128V320ZM966 320V182L988 156V320Z';
const CAYAN = 'M1052 320C1046 260 1060 200 1052 140L1074 136C1082 196 1068 256 1076 320Z';
const CAYAN_TWIST =
  'M1054 300C1062 280 1070 268 1072 250M1052 240C1060 220 1070 206 1074 190M1052 180C1060 166 1068 152 1072 140';
const DUBAI_FRAME = 'M370 320V200H424V320ZM380 320V212H414V320Z'; // evenodd → open frame (drawn shifted −140, left of the logo)
const MUSEUM_FUTURE =
  'M14 266a40 22 0 1 0 80 0a40 22 0 1 0-80 0ZM34 263a22 8 0 1 0 44 0a22 8 0 1 0-44 0Z' + // elongated torus (evenodd)
  'M8 320C22 290 86 290 100 320Z'; // green mound
const LANDMARK_LIGHTS = [
  ...Array.from({ length: 18 }, (_, i) => ({ x: BK - 1, y: 44 + i * 15 })),
  ...[150, 190, 230, 270].map((y) => ({ x: 941, y })),
  ...[200, 240, 280].map((y) => ({ x: 975, y })),
  ...[170, 210, 250, 290].map((y) => ({ x: 1062, y })),
  ...[160, 200, 240].map((y) => ({ x: 134, y })),
];

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
      <svg className="ib-city" viewBox={`0 -10 ${W} ${H + 10}`} preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="ib-burj" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="st-w" stopOpacity=".2" />
            <stop offset="1" className="st-w" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <path className="ib-far" d={FAR.d} />
        <path className="ib-mid" d={MID.d} />
        {/* Dubai landmarks */}
        <path className="ib-lm" d={MUSEUM_FUTURE} fillRule="evenodd" />
        <g transform="translate(-80 0)">
          <path className="ib-lm" d={BURJ_AL_ARAB} />
          <path className="ib-lm" d={BURJ_AL_ARAB_PAD} />
        </g>
        <path className="ib-lm" d={DUBAI_FRAME} fillRule="evenodd" transform="translate(-140 0)" />
        <path className="ib-lm" d={EMIRATES_TOWERS} />
        <path className="ib-lm" d={CAYAN} />
        <path className="ib-edge" d={CAYAN_TWIST} />
        <path fill="url(#ib-burj)" d={BURJ_KHALIFA} />
        <path className="ib-core" d={BURJ_KHALIFA_CORE} />
        {[...MID.lights, ...LANDMARK_LIGHTS].map((l, k) => (
          <rect
            key={k}
            className="ib-light"
            x={l.x}
            y={l.y}
            width="2.4"
            height="2.4"
            style={{ animationDelay: `${(k * 0.37) % 3}s` }}
          />
        ))}
        <circle className="ib-beacon" cx={BK} cy="0" r="2.2" />
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
