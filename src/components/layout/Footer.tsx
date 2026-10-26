import { Link } from 'react-router';
import { Icon } from '../ui/Icon';
import { services } from '../../data/services';
import { CONTACT, SOCIALS } from '../../lib/site';
import { solutionPath, solutions } from '../../data/solutions';

export function Socials() {
  return (
    <div className="socials">
      {SOCIALS.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.label} (opens in a new tab)`}
        >
          <Icon name={s.icon} />
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Link className="flogo" to="/" aria-label="MAS Express Cargo L.L.C — home">
              <img src="/img/brand/logo-full.png" alt="MAS Express Cargo L.L.C — From your doorstep to their smile" />
            </Link>
            <Socials />
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/our-team">Our Team</Link>
              </li>
              <li>
                <Link to="/our-branches">Our Branches</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Solutions</h4>
            <ul>
              {solutions.map((s) => (
                <li key={s.slug}>
                  <Link to={solutionPath(s)}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul className="fcontact">
              <li>
                <span className="fic">
                  <Icon name="phone" />
                </span>
                <a href={CONTACT.phone.href}>{CONTACT.phone.label}</a>
              </li>
              <li>
                <span className="fic">
                  <Icon name="mail" />
                </span>
                <a href={`mailto:${CONTACT.emails[0]}`}>{CONTACT.emails[0]}</a>
              </li>
              <li style={{ color: '#d6d8db', fontSize: 14, lineHeight: 1.5 }}>
                <span className="fic">
                  <Icon name="pin" />
                </span>
                <span>
                  <b style={{ fontWeight: 500, color: '#fff' }}>Our Address</b>
                  <br />
                  MAS Express Cargo.
                  <br />
                  Warehouse number - 08 , Industrial area - 17, Near - Diana Trade , Sharjah UAE.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <p className="copy">© MAS Express Cargo 2026 . All rights reserved</p>
      </div>
    </footer>
  );
}
