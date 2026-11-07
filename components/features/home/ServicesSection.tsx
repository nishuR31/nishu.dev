import { ArrowUpRight, Layers3 } from "lucide-react";

interface ServiceItem {
  title?: string;
  description?: string;
  pricing?: string | null;
  visible?: boolean;
}

export default function ServicesSection({ services = [] }: { services?: ServiceItem[] }) {
  const visibleServices = services.filter((service) => service.visible !== false);
  if (visibleServices.length === 0) return null;

  return (
    <section className="services-section site-width" id="services">
      <div className="section-heading">
        <div>
          <p className="eyebrow section-index">06 / HOW I CAN HELP</p>
          <h2>
            Useful work,
            <br />
            clearly delivered<span className="orange-text">.</span>
          </h2>
        </div>
        <span className="section-mark" aria-hidden="true">
          SERVICES ↘
        </span>
      </div>
      <div className="services-grid">
        {visibleServices.map((service, index) => (
          <article className="service-card" key={`${service.title}-${index}`}>
            <div className="service-card__top">
              <span className="service-card__index">0{index + 1}</span>
              <Layers3 size={18} aria-hidden="true" />
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {service.pricing && <span className="service-card__pricing">{service.pricing}</span>}
            <ArrowUpRight className="service-card__arrow" size={18} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
