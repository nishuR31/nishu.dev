import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

interface AboutProps {
  developer?: {
    name?: string;
    shortName?: string;
    location?: string;
  };
  github?: string;
}

export default function About({
  developer = {},
  github = "https://github.com/nishuR31",
}: AboutProps) {
  return (
    <section className="about-section site-width" id="about">
      <div
        className="about-photo"
        style={{
          filter: "grayscale(1) contrast(1.06) brightness(0.92)",
        }}
        tabIndex={0}
        role="figure"
        aria-label={`Portrait of ${developer.name || "Nishan Rajak"}`}
      >
        <span className="portrait-note">THE PERSON BEHIND THE CODE ↘</span>
        <Image
          src="/iitSitting.avif"
          alt={`Portrait of ${developer.name || "Nishan Rajak"}`}
          fill
          className="portrait-image"
          sizes="(max-width: 700px) 90vw, 360px"
        />

        <Image
          src="/nishur31.svg"
          alt={`ASCII Portrait of ${developer.name || "Nishan Rajak"}`}
          fill
          unoptimized
          className="portrait-ascii"
          sizes="(max-width: 700px) 90vw, 360px"
        />
        <span className="photo-caption">
          {developer.name?.toUpperCase() || "NISHAN RAJAK"}{" "}
          <span>DEVELOPER &amp; CONSTANT LEARNER</span>
        </span>
      </div>
      <div className="about-copy">
        <p className="eyebrow section-index">02 / A LITTLE ABOUT ME</p>
        <h2>
          Serious about code.
          <br />
          <span className="hero-serif">Curious about everything</span>
          <span className="orange-text">.</span>
        </h2>
        <p>
          I’m {developer.shortName || "Nishu"}, a software engineering student fascinated by
          what happens behind the screen. The logic, the data, the small decisions that make a
          system work beautifully.
        </p>
        <p>
          I focus on backend development — designing APIs, untangling authentication, and
          bringing structure to complex applications. I learn by building, and every project is
          a chance to do it a little better.
        </p>
        <div className="about-bottom">
          <span>
            <MapPin size={15} />
            {developer.location || "West Bengal, India"}
          </span>
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-link">
            Find me on GitHub <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
