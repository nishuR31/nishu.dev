import Link from "next/link";
import { Quote, Star, MessageSquarePlus } from "lucide-react";

interface TestimonialItem {
  id?: string;
  authorName?: string;
  authorRole?: string;
  authorCompany?: string | null;
  content?: string;
  rating?: number;
  relationship?: string;
  visible?: boolean;
}

export default function TestimonialsSection({
  testimonials = [],
}: {
  testimonials?: TestimonialItem[];
}) {
  const visibleTestimonials = testimonials.filter((testimonial) => testimonial.visible !== false);

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
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}
        >
          <span className="section-mark" aria-hidden="true">
            TESTIMONIALS ↘
          </span>
          <Link
            href="/testimonials/submit"
            className="button button-orange"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <MessageSquarePlus size={15} />
            Share Experience
          </Link>
        </div>
      </div>

      {visibleTestimonials.length > 0 ? (
        <div className="testimonials-grid">
          {visibleTestimonials.map((testimonial, index) => (
            <figure className="testimonial-card" key={`${testimonial.authorName}-${index}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <Quote className="testimonial-card__quote" size={24} aria-hidden="true" />
                {testimonial.rating && (
                  <div style={{ display: "flex", gap: "2px", color: "var(--orange, #f59e0b)" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        style={{
                          fill: i < (testimonial.rating ?? 5) ? "currentColor" : "none",
                          opacity: i < (testimonial.rating ?? 5) ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <blockquote>{testimonial.content}</blockquote>
              <figcaption>
                <strong>{testimonial.authorName}</strong>
                <span>
                  {[testimonial.authorRole, testimonial.authorCompany, testimonial.relationship]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div
          className="project-tile"
          style={{
            padding: "40px",
            textAlign: "center",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <Quote size={32} style={{ opacity: 0.5, color: "var(--orange)" }} />
          <h3 style={{ fontSize: "18px", margin: 0 }}>Be the first to share your experience</h3>
          <p
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              fontSize: "14px",
              color: "var(--subtle)",
            }}
          >
            Worked together on a project, architecture, or consultation? Your feedback helps others
            understand our collaboration.
          </p>
          <Link
            href="/testimonials/submit"
            className="button button-orange"
            style={{ textDecoration: "none", marginTop: "10px" }}
          >
            Submit a Testimonial
          </Link>
        </div>
      )}
    </section>
  );
}
