import { TestimonialsSplit } from '../ui/TestimonialsSplit';

/** Home testimonials card (a stacking section); the content is shared with the About page. */
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="stack">
      <div className="wrap">
        <TestimonialsSplit />
      </div>
    </section>
  );
}
