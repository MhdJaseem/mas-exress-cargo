import { useRef, useState, type FormEvent } from 'react';
import { PageHero } from '../components/ui/PageHero';
import { Icon } from '../components/ui/Icon';
import { submitApplication } from '../lib/api';
import { pageTitle } from '../lib/site';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CareersPage() {
  useDocumentMeta(pageTitle('Careers'), 'Apply to join MAS Express Cargo. Send your details and CV.');
  useReveal('inner');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [exp, setExp] = useState('');
  const [msg, setMsg] = useState('');
  const cvRef = useRef<HTMLInputElement>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      exp: exp.trim(),
      cv: cvRef.current?.files?.[0]?.name ?? '',
    };
    if (!f.name || !EMAIL_RE.test(f.email)) {
      setMsg('Please enter your full name and a valid email address.');
      return;
    }
    setMsg(submitApplication(f));
  }

  return (
    <>
      <PageHero
        image="/img/hero/hero-road.jpg"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
        title={['', 'Careers']}
      />
      <div className="pbody solo">
        <div className="main-col">
          <section className="blk">
            <div className="pickup apply reveal" id="apply">
              <h2>Ready to Apply?</h2>
              <form className="pf" id="applyForm" noValidate onSubmit={submit}>
                <div className="fld">
                  <label htmlFor="aname">Full Name</label>
                  <input
                    id="aname"
                    type="text"
                    autoComplete="name"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="aemail">Email Address</label>
                  <input
                    id="aemail"
                    type="email"
                    autoComplete="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="aphone">Phone Number</label>
                  <input
                    id="aphone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="acv">Upload CV (PDF/DOC)</label>
                  <input
                    ref={cvRef}
                    id="acv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </div>
                <div className="fld full">
                  <label htmlFor="aexp">Experience</label>
                  <textarea
                    id="aexp"
                    rows={6}
                    maxLength={2000}
                    placeholder="Briefly describe your logistics experience..."
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                  />
                </div>
                <button className="btn" type="submit">
                  Submit Application <Icon name="arrow" />
                </button>
                <p className="msg" id="amsg" role="status">
                  {msg}
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
