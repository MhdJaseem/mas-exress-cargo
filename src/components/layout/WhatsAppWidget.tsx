import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon';
import { WHATSAPP } from '../../lib/site';

/** Floating WhatsApp button (bottom-right) with a popover listing both numbers.
    The container id is "wa-widget" — "wa" is taken by the WhatsApp icon symbol in the sprite. */
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className={`wa${open ? ' open' : ''}`} id="wa-widget" ref={ref}>
      <div className="pop" role="dialog" aria-label="WhatsApp chat">
        <h4>Hello!</h4>
        <p>Click the widget below to chat on WhatsApp</p>
        {WHATSAPP.map((w) => (
          <a key={w.href} href={w.href} target="_blank" rel="noopener">
            <span className="ic">
              <Icon name="wa" />
            </span>
            <span>
              <small>{w.label}</small>
              <b>{w.number}</b>
            </span>
          </a>
        ))}
        <div className="avail">We are available to chat at any time</div>
      </div>
      <button
        id="waBtn"
        type="button"
        aria-label="How can I help you? Chat on WhatsApp"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="wa" />
      </button>
    </div>
  );
}
