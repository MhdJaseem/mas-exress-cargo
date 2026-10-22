import { useSyncExternalStore } from 'react';

/* Which home-page section is on screen. Written by the home scroll engine,
   read by the header to highlight the matching nav item. '' = none / not on home. */

let current = '';
const listeners = new Set<() => void>();

export function setActiveSection(id: string) {
  if (id === current) return;
  current = id;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useActiveSection = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => '',
  );
