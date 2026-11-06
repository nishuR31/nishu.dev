import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image"
interface ExperienceItem {
  period?: string;
  position?: string;
  company?: string;
  description?: string;
  visible?: boolean;
}

interface ExperienceSectionProps {
  experiences?: ExperienceItem[];
}

export default function ExperienceSection({
  experiences = [],
}: ExperienceSectionProps) {
  const visibleExperiences = experiences
    .filter((e) => e.visible !== false)
    .slice(0, 3);

  return (
    <section className="experience-section site-width" id="experience">
      <div>
        <p className="eyebrow section-index">04 / THE JOURNEY SO FAR</p>
        <h2>
          Always a work
          <br />
          in progress<span className="orange-text">.</span>
        </h2>
        <Link href="/experience" className="text-link">
          More about my experience <ArrowUpRight size={16} />
        </Link>
        <div
          className="experience-photo hidden md:block"
          tabIndex={0}
          role="figure"
          aria-label="Working with code"
        >
          <span className="portrait-note">FOCUSED ON SYSTEMS ↘</span>
          <Image
            src="/laptopSitting.avif"
            alt="Nishan working on backend systems"
            fill
            className="experience-photo-image"
            sizes="(max-width: 700px) 90vw, 440px"
          />
          <Image
            src="/laptopSitting.svg"
            alt="ASCII Laptop Art"
            fill
            unoptimized
            className="experience-photo-ascii"
            sizes="(max-width: 700px) 90vw, 440px"
          />
          <span className="photo-caption">
            SYSTEMS &amp; ARCHITECTURE <span>ALWAYS BUILDING</span>
          </span>
        </div>
      </div>
      <div className="experience-list">
        {visibleExperiences.map((e, i) => (
          <article key={i}>
            <div className="experience-period">
              <span className="status-dot" />
              {e.period}
            </div>
            <h3>{e.position}</h3>
            <span>{e.company}</span>
            <p>{e.description}</p>
          </article>
        ))}
        <Link href="/certificates" className="learning-link">
          Learning never stops. Explore my certificates <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
