import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { submitMessage } from '../../lib/api';
import { Icon } from './Icon';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEPS = ['Your name', 'Your email', 'Your message'];

/** Confetti burst behind the thank-you message. Pieces get a random direction, distance, spin and colour. */
function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2 + Math.random() * 0.4;
      const d = 90 + Math.random() * 120;
      return {
        '--x': `${Math.cos(a) * d}px`,
        '--y': `${Math.sin(a) * d - 40}px`,
        '--r': `${Math.round(Math.random() * 720 - 360)}deg`,
        '--t': `${(0.9 + Math.random() * 0.6).toFixed(2)}s`,
        '--c': ['var(--brand)', 'var(--brand-deep)', 'var(--ink)', 'var(--muted)'][i % 4],
      } as CSSProperties;
    }),
  );
  return (
    <span className="mf-confetti" aria-hidden="true">
      {pieces.map((s, i) => (
        <i key={i} style={s} />
      ))}
    </span>
  );
}

/**
 * Send a Message form (home Contact card), asked in three steps: name → email → subject + message,
 * then a thank-you screen. Only one per page — ids are fixed.
 */
export function MessageForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Move focus to the new step's first field (not on first render, so the page doesn't jump here).
  useEffect(() => {
    if (!moved.current) return;
    if (done) doneRef.current?.focus();
    else [firstRef, emailRef, subjectRef][step].current?.focus({ preventScroll: true });
  }, [step, done]);

  function go(n: number) {
    moved.current = true;
    setMsg('');
    setStep(n);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 0) {
      if (!first.trim()) return setMsg('Please enter your first name.');
      return go(1);
    }
    if (step === 1) {
      if (!EMAIL_RE.test(email.trim())) return setMsg('Please enter a valid email address.');
      return go(2);
    }
    if (!subject.trim() || !message.trim()) return setMsg('Please fill in the subject and your message.');
    setSending(true);
    setMsg('');
    try {
      await submitMessage({
        first: first.trim(),
        last: last.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      moved.current = true;
      setDone(true);
    } catch (err) {
      console.warn('Send a Message failed:', err);
      setMsg('Sorry, your message could not be sent. Please try again or email us directly.');
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setSubject('');
    setMessage('');
    setDone(false);
    go(2);
  }

  if (done) {
    return (
      <div className="mf-done" ref={doneRef} tabIndex={-1} role="status">
        <span className="mf-burst">
          <Confetti />
          <span className="mf-tick">
            <Icon name="check" />
          </span>
        </span>
        <h3>Thank you, {first.trim()}!</h3>
        <p>
          Your message has been sent. We&rsquo;ll get back to you at <b>{email.trim()}</b> soon.
        </p>
        <button className="btn light" type="button" onClick={reset}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="pf mf" id="messageForm" noValidate onSubmit={submit}>
      <div className="mf-progress" aria-label={`Step ${step + 1} of 3: ${STEPS[step]}`}>
        {STEPS.map((s, i) => (
          <span key={s} className={i <= step ? 'on' : undefined} />
        ))}
        <small>
          Step {step + 1} of 3 · {STEPS[step]}
        </small>
      </div>

      {step === 0 && (
        <div className="mf-step" key="0">
          <div className="fld">
            <label htmlFor="mfirst">First Name</label>
            <input
              id="mfirst"
              ref={firstRef}
              autoComplete="given-name"
              placeholder="First name"
              required
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
          </div>
          <div className="fld">
            <label htmlFor="mlast">Last Name</label>
            <input
              id="mlast"
              autoComplete="family-name"
              placeholder="Last name"
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mf-step" key="1">
          <div className="fld full">
            <label htmlFor="memail">Email Address</label>
            <input
              id="memail"
              ref={emailRef}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mf-step grow" key="2">
          <div className="fld full">
            <label htmlFor="msubject">Subject</label>
            <input
              id="msubject"
              ref={subjectRef}
              placeholder="Subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="fld full">
            <label htmlFor="mtext">Your Message</label>
            <textarea
              id="mtext"
              rows={3}
              placeholder="How can we help?"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="mf-actions">
        {step > 0 && (
          <button className="btn light mf-back" type="button" onClick={() => go(step - 1)} disabled={sending}>
            Back
          </button>
        )}
        <button className="btn" type="submit" disabled={sending}>
          {step < 2 ? 'Continue' : sending ? 'Sending…' : 'Send Message'} <Icon name="arrow" />
        </button>
      </div>
      <p className="msg" id="mmsg" role="status">
        {msg}
      </p>
    </form>
  );
}
