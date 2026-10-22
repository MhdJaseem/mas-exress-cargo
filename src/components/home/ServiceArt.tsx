/* Line-art drawings on the home service cards (drawn on reveal, see useReveal).
   Generated from the original index.html — keep the geometry identical. */

const svgProps = {
  className: 'art',
  viewBox: '0 0 200 110',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
  'aria-hidden': true,
};

export const AirArt = () => (
  <svg {...svgProps}>
    <path d="M100 8c6 0 8 12 8 26v28l64 24v8l-64-14v16l16 8v4l-24-6-24 6v-4l16-8V80L28 94v-8l64-24V34C92 20 94 8 100 8Z" />
  </svg>
);

export const SeaArt = () => (
  <svg {...svgProps}>
    <path d="M8 72h184l-20 22H28z" />
    <rect x="18" y="56" width="18" height="16" />
    <rect x="38" y="56" width="18" height="16" />
    <rect x="58" y="56" width="18" height="16" />
    <rect x="78" y="56" width="18" height="16" />
    <rect x="98" y="56" width="18" height="16" />
    <rect x="118" y="56" width="18" height="16" />
    <rect x="38" y="40" width="18" height="16" />
    <rect x="58" y="40" width="18" height="16" />
    <rect x="78" y="40" width="18" height="16" />
    <rect x="98" y="40" width="18" height="16" />
    <rect x="146" y="34" width="30" height="38" />
    <path d="M152 44h18M152 52h18M152 60h18" />
    <path d="M0 102q10-6 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" />
  </svg>
);

export const RoadArt = () => (
  <svg {...svgProps}>
    <rect x="8" y="26" width="122" height="56" rx="3" />
    <path d="M22 32V76" />
    <path d="M34 32V76" />
    <path d="M46 32V76" />
    <path d="M58 32V76" />
    <path d="M70 32V76" />
    <path d="M82 32V76" />
    <path d="M94 32V76" />
    <path d="M106 32V76" />
    <path d="M118 32V76" />
    <path d="M134 40h30l20 20v22h-50z" />
    <path d="M142 46h18l12 14h-30z" />
    <circle cx="34" cy="90" r="9" />
    <circle cx="62" cy="90" r="9" />
    <circle cx="156" cy="90" r="9" />
    <path d="M0 102h200" />
  </svg>
);

export const WarehouseArt = () => (
  <svg {...svgProps}>
    <path d="M14 54 100 16l86 38v44H14z" />
    <rect x="30" y="62" width="40" height="36" />
    <path d="M30 70h40" />
    <path d="M30 78h40" />
    <path d="M30 86h40" />
    <path d="M30 94h40" />
    <rect x="80" y="62" width="40" height="36" />
    <path d="M80 70h40" />
    <path d="M80 78h40" />
    <path d="M80 86h40" />
    <path d="M80 94h40" />
    <rect x="130" y="62" width="40" height="36" />
    <path d="M130 70h40" />
    <path d="M130 78h40" />
    <path d="M130 86h40" />
    <path d="M130 94h40" />
  </svg>
);
