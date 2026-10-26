import type { CSSProperties } from 'react';

/** Symbols defined in components/layout/IconSprite.tsx. Add new ones there first. */
export type IconName =
  | 'arrow'
  | 'check'
  | 'calendar'
  | 'door'
  | 'plus'
  | 'chev'
  | 'menu'
  | 'plane'
  | 'ship'
  | 'truck'
  | 'warehouse'
  | 'customs'
  | 'bolt'
  | 'tag'
  | 'radar'
  | 'users'
  | 'globe'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'clock'
  | 'wa'
  | 'fb'
  | 'xx'
  | 'ig'
  | 'in';

export function Icon({ name, style }: { name: IconName; style?: CSSProperties }) {
  return (
    <svg className="i" style={style} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}
