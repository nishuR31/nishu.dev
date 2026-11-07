import { Quote } from "lucide-react";

interface TestimonialItem {
  authorName?: string;
  authorRole?: string;
  authorCompany?: string | null;
  content?: string;
  visible?: boolean;
}

export default function TestimonialsSection({
  testimonials = [],
}: {
  testimonials?: TestimonialItem[];
}) {
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.visible !== false);
  if (visibleTestimonials.length === 0) return null;

  return (
    <section className="testimonials-section site-width" id="testimonials">
      <div className="section-heading">
        <div>
          <p className="eyebrow section-index">07 / WORDS FROM COLLABORATORS</p>
          <h2>
            Good work travels
            <br />
            through people<span className="orange-text">.</span>
          </h2>
        </div>
        <span className="section-mark" aria-hidden="true">
          TESTIMONIALS ↘
        </span>
      </div>
      <div className="testimonials-grid">
        {visibleTestimonials.map((testimonial, index) => (
          <figure className="testimonial-card" key={`${testimonial.authorName}-${index}`}>
            <Quote className="testimonial-card__quote" size={26} aria-hidden="true" />
            <blockquote>{testimonial.content}</blockquote>
            <figcaption>
              <strong>{testimonial.authorName}</strong>
              <span>
                {[testimonial.authorRole, testimonial.authorCompany].filter(Boolean).join(" · ")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
