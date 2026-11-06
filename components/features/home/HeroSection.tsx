import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import ArchitectureDemo from "./ArchitectureDemo";

interface HeroSectionProps {
  developer?: {
    name?: string;
    location?: string;
  };
  github?: string;
  linkedin?: string;
}

export default function HeroSection({
  developer = {},
  github = "https://github.com/nishuR31",
  linkedin = "https://linkedin.com/in/",
}: HeroSectionProps) {
  return (
    <section className="hero-section site-width justify-around flex">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="status-dot" /> INDEPENDENT MIND. ENGINEERING FOCUS.
        </div>
        <p className="hero-intro">
          Hey, I’m {developer.name || "Nishan Rajak"} <span className="wave">✳</span>
        </p>
        <h1>
          The logic behind
          <br />
          the <span className="hero-serif">experience.</span>
          <span className="hero-period" aria-hidden="true">
            *
          </span>
        </h1>
        <p className="hero-description">
          I build the parts you don’t see — the APIs, authentication, and data systems that make
          everything else work. Thoughtful architecture. Real-world applications.
        </p>
        <div className="hero-buttons">
          <a className="button button-dark" href="#work">
            View selected work <ArrowDown size={17} />
          </a>
          <Link className="text-link" href="/contact">
            Let’s build something <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="hero-socials">
          <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin size={18} />
          </a>
          <span />
          <p>
            <MapPin size={13} /> {developer.location || "West Bengal, India"}
          </p>
        </div>
      </div>
      <ArchitectureDemo />
    </section>
  );
}
