import { Icon } from '../ui/Icon';
import { PickupForm } from '../ui/PickupForm';
import { MessageForm } from '../ui/MessageForm';
import { Socials } from '../layout/Footer';
import { CONTACT } from '../../lib/site';

/** Request Pickup form + Contact Us card with Send a Message form, then a contact-details strip (ids #pickup and #contact are nav targets). */
export function PickupContactSection() {
  return (
    <section id="pickup" className="stack">
      <div className="wrap pc">
        <div className="pickup reveal">
          <h2>Request Pickup</h2>
          <PickupForm />
        </div>

        <div className="contact reveal" id="contact">
          <h2>Contact Us</h2>
          <MessageForm />
        </div>

        <div className="cstrip reveal" aria-label="Contact details">
          <div className="crow">
            <span className="ic">
              <Icon name="phone" />
            </span>
            <span>
              <small>Contact</small>
              <a className="v" href={CONTACT.phone.href}>
                {CONTACT.phone.label}
              </a>
            </span>
          </div>
          <div className="crow">
            <span className="ic">
              <Icon name="mail" />
            </span>
            <span>
              <small>Email</small>
              <a className="v" href={`mailto:${CONTACT.emails[0]}`}>
                {CONTACT.emails[0]}
              </a>
              <br />
              <a className="v" href={`mailto:${CONTACT.emails[1]}`}>
                {CONTACT.emails[1]}
              </a>
            </span>
          </div>
          <div className="crow">
            <span className="ic">
              <Icon name="pin" />
            </span>
            <span>
              <small>Location</small>
              <span className="v">{CONTACT.addressContactCard}</span>
            </span>
          </div>
          <Socials />
        </div>
      </div>
    </section>
  );
}
