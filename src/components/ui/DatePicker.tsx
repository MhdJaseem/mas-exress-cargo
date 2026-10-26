import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from './Icon';

const pad = (n: number) => String(n).padStart(2, '0');
/** Local-time yyyy-mm-dd (toISOString would shift to UTC). */
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const startOfToday = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
};

const WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const fmtLong = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
const fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  id: string;
  /** yyyy-mm-dd or '' */
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

/**
 * Styled replacement for <input type="date"> (whose calendar can't be styled). Past days are disabled.
 * Keyboard in the calendar: arrows move a day/week, PageUp/PageDown a month, Home/End the week,
 * Enter/Space pick, Esc closes.
 */
export function DatePicker({ id, value, onChange, placeholder = 'Select date' }: Props) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(startOfToday);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const today = startOfToday();

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

  // roving focus: the focused day follows the keyboard
  useEffect(() => {
    if (open) grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus({ preventScroll: true });
  }, [open, focus]);

  function show() {
    const v = value ? parse(value) : today;
    setFocus(v < today ? today : v);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    btn.current?.focus();
  }

  function pick(d: Date) {
    onChange(isoDate(d));
    close();
  }

  const move = (d: Date) => setFocus(d < today ? today : d);

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (k === 'ArrowLeft') move(addDays(focus, -1));
    else if (k === 'ArrowRight') move(addDays(focus, 1));
    else if (k === 'ArrowUp') move(addDays(focus, -7));
    else if (k === 'ArrowDown') move(addDays(focus, 7));
    else if (k === 'PageUp') move(addMonths(focus, -1));
    else if (k === 'PageDown') move(addMonths(focus, 1));
    else if (k === 'Home') move(addDays(focus, -focus.getDay()));
    else if (k === 'End') move(addDays(focus, 6 - focus.getDay()));
    else return;
    e.preventDefault();
  }

  const y = focus.getFullYear();
  const m = focus.getMonth();
  const lead = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const atFirstMonth = y === today.getFullYear() && m === today.getMonth();
  const sel = value ? parse(value).getTime() : -1;

  return (
    <div
      className={`sel dp${open ? ' open' : ''}`}
      ref={root}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={btn}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={value ? undefined : 'ph'}
        onClick={() => (open ? setOpen(false) : show())}
      >
        <span>{value ? fmtLong.format(parse(value)) : placeholder}</span>
        <Icon name="calendar" />
      </button>
      {open && (
        <div className="sel-list dp-panel" role="dialog" aria-modal="false" aria-label="Choose pickup date">
          <div className="dp-head">
            <button
              type="button"
              className="dp-nav prev"
              aria-label="Previous month"
              disabled={atFirstMonth}
              onClick={() => move(addMonths(focus, -1))}
            >
              <Icon name="chev" />
            </button>
            <b aria-live="polite">{fmtMonth.format(focus)}</b>
            <button
              type="button"
              className="dp-nav next"
              aria-label="Next month"
              onClick={() => move(addMonths(focus, 1))}
            >
              <Icon name="chev" />
            </button>
          </div>
          <div className="dp-grid" ref={grid} onKeyDown={onKey}>
            {WEEK.map((w) => (
              <abbr key={w} className="dp-wd" title={w}>
                {w}
              </abbr>
            ))}
            {Array.from({ length: lead }, (_, i) => (
              <span key={'b' + i} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = new Date(y, m, i + 1);
              const t = d.getTime();
              const past = d < today;
              const isFocus = t === focus.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  className={['dp-day', t === sel && 'on', t === today.getTime() && 'today', isFocus && 'act']
                    .filter(Boolean)
                    .join(' ')}
                  disabled={past}
                  tabIndex={isFocus ? 0 : -1}
                  aria-pressed={t === sel}
                  aria-current={t === today.getTime() ? 'date' : undefined}
                  aria-label={fmtDay.format(d)}
                  onClick={() => pick(d)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
