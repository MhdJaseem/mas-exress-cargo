import { useState, type FormEvent } from 'react';
import { submitMessage } from '../../lib/api';
import { Icon } from './Icon';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Send a Message form (home Contact card). Only one per page — ids are fixed. */
export function MessageForm() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState('');

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = {
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };
    if (!f.first || !f.email || !f.subject || !f.message) {
      setMsg('Please fill in your name, email, subject and message.');
      return;
    }
    if (!EMAIL_RE.test(f.email)) {
      setMsg('Please enter a valid email address.');
      return;
    }
    setMsg(submitMessage(f));
  }

  return (
    <form className="pf mf" id="messageForm" noValidate onSubmit={submit}>
      <div className="fld">
        <label htmlFor="mfirst">First Name</label>
        <input
          id="mfirst"
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
      <div className="fld">
        <label htmlFor="memail">Email Address</label>
        <input
          id="memail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="fld">
        <label htmlFor="msubject">Subject</label>
        <input
          id="msubject"
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
      <button className="btn" type="submit">
        Send Message <Icon name="arrow" />
      </button>
      <p className="msg" id="mmsg" role="status">
        {msg}
      </p>
    </form>
  );
}
