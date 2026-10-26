import { PickupForm } from '../ui/PickupForm';
import { MessageForm } from '../ui/MessageForm';

/** Request Pickup form + Contact Us card with Send a Message form (ids #pickup and #contact are nav targets). */
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
      </div>
    </section>
  );
}
