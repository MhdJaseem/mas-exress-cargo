import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from './Icon';

/** True when a popup of height `need` px won't fit below `el` but there is more room above it. */
export function opensUp(el: HTMLElement | null, need: number) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const below = window.innerHeight - r.bottom;
  return below < need && r.top > below;
}

interface Props {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  /** Shown (muted) while value is ''. */
  placeholder?: string;
  /** Display text for an option value (default: the value itself). */
  format?: (v: string) => string;
  /** Option to highlight when the list opens with nothing selected yet. */
  startAt?: string;
  'aria-label'?: string;
}

/**
 * Styled replacement for a native <select> (whose open list can't be styled).
 * ARIA "select-only combobox": a button that opens a listbox. Keyboard: ↑/↓/Home/End move,
 * Enter/Space pick, Esc closes, typing a letter jumps to the next option starting with it.
 */
export function Select({
  id,
  value,
  options,
  onChange,
  placeholder,
  format = (v) => v,
  startAt,
  'aria-label': ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  // close on outside click / focus leaving the control
  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    document.addEventListener('focusin', away);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('focusin', away);
    };
  }, [open]);

  // keep the highlighted option in view
  useEffect(() => {
    // (scroll only the list — scrollIntoView would also scroll the page)
    const ul = list.current;
    const li = ul?.children[active] as HTMLElement | undefined;
    if (!open || !ul || !li) return;
    if (li.offsetTop < ul.scrollTop) ul.scrollTop = li.offsetTop - 6;
    else if (li.offsetTop + li.offsetHeight > ul.scrollTop + ul.clientHeight)
      ul.scrollTop = li.offsetTop + li.offsetHeight - ul.clientHeight + 6;
  }, [open, active]);

  function show() {
    setActive(Math.max(0, options.indexOf(value || startAt || '')));
    setUp(opensUp(root.current, Math.min(280, options.length * 40 + 20)));
    setOpen(true);
  }

  function pick(i: number) {
    onChange(options[i]);
    setOpen(false);
    btn.current?.focus();
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === 'ArrowDown') setActive((a) => Math.min(last, a + 1));
    else if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(last);
    else if (e.key === 'Enter' || e.key === ' ') pick(active);
    else if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'Tab') return setOpen(false);
    else if (e.key.length === 1) {
      const k = e.key.toLowerCase();
      const strip = (s: string) => s.replace(/^[^a-z]+/i, '').toLowerCase(); // skip leading flag emoji
      const next = options.findIndex((o, i) => i > active && strip(format(o)).startsWith(k));
      const i = next >= 0 ? next : options.findIndex((o) => strip(format(o)).startsWith(k));
      if (i >= 0) setActive(i);
    } else return;
    e.preventDefault();
  }

  return (
    <div className={`sel${open ? ' open' : ''}${up ? ' up' : ''}`} ref={root}>
      <button
        ref={btn}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        aria-label={ariaLabel}
        className={value ? undefined : 'ph'}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
      >
        <span>{value ? format(value) : placeholder}</span>
        <Icon name="chev" />
      </button>
      <ul className="sel-list" id={`${id}-list`} role="listbox" ref={list} hidden={!open}>
        {options.map((o, i) => (
          <li
            key={o}
            id={`${id}-o${i}`}
            role="option"
            aria-selected={o === value}
            className={i === active ? 'act' : undefined}
            onPointerMove={() => setActive(i)}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => pick(i)}
          >
            <span>{format(o)}</span>
            {o === value && <Icon name="check" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
