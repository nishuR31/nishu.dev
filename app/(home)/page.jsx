import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  Terminal,
  Database,
  Layers,
  ShieldCheck,
  Braces,
} from "lucide-react";
import { getPortfolioData } from "@/lib/portfolio";
import ProjectCollection from "@/components/features/projects/ProjectCollection";
import ArchitectureDemo from "@/components/features/home/ArchitectureDemo";
import ContactActions from "@/components/features/home/ContactActions";

export default async function Home() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : {};
  const developer = data.developer || {};
  const projects = data.projects || [];
  const github = data.social?.github?.startsWith("http")
    ? data.social.github
    : `https://github.com/${data.social?.github || "nishuR31"}`;
  const linkedin = data.social?.linkedin?.startsWith("http")
    ? data.social.linkedin
    : `https://linkedin.com/in/${data.social?.linkedin || ""}`;

  // 'nishan-rajak-98b2ab3b8'}`

  const toolkitSkills = [
    { sym: "JS", name: "JavaScript" },
    { sym: "TS", name: "TypeScript" },
    { sym: "⬡", name: "Node.js" },
    { sym: "B", name: "bun.js" },
    { sym: "ex", name: "Express.js" },
    { sym: "F", name: "Fastify" },
  ];

  return (
    <div className="portfolio-home">
      <section className="hero-section site-width">
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
              <MapPin size={13} /> West Bengal, India
            </p>
          </div>
        </div>
        <ArchitectureDemo />
      </section>
      <div className="stack-strip">
        <Link href="/techstack" className="marquee-container">
          <div className="marquee-content">
            {[...toolkitSkills, ...toolkitSkills, ...toolkitSkills, ...toolkitSkills].map(
              (tech, i) => (
                <span className="stack-item" key={i}>
                  <span className="stack-symbol">{tech.sym}</span>
                  {tech.name}
                </span>
              ),
            )}
          </div>
        </Link>
      </div>
      {data.showProjects !== false && (
        <section className="work-section site-width" id="work">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-index">01 / SELECTED WORK</p>
              <h2>
                Built with purpose<span className="orange-text">.</span>
              </h2>
            </div>
            <Link className="text-link" href="/projects">
              All projects <ArrowUpRight size={17} />
            </Link>
          </div>
          <p className="section-description">
            Real problems, considered solutions. A selection of tools and products I’ve designed and
            developed.
          </p>
          <ProjectCollection projects={projects} compact />
        </section>
      )}
      {data.showAbout !== false && (
        <section className="about-section site-width" id="about">
          <div
            className="about-photo"
            tabIndex={0}
            role="figure"
            aria-label="Portrait of Nishan Rajak"
          >
            <span className="portrait-note">THE PERSON BEHIND THE CODE ↘</span>
            <Image
              src="/iitSitting.avif"
              alt="Portrait of Nishan Rajak"
              fill
              className="portrait-image"
              sizes="(max-width: 700px) 90vw, 360px"
            />
            <Image
              src="/nishur31.svg"
              alt="ASCII Portrait of Nishan Rajak"
              fill
              unoptimized
              className="portrait-ascii"
              sizes="(max-width: 700px) 90vw, 360px"
            />
            <span className="photo-caption">
              NISHAN RAJAK <span>DEVELOPER & CONSTANT LEARNER</span>
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
      )}
      {data.showSkills !== false && (
        <section className="capabilities-section site-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-index">03 / HOW I BUILD</p>
              <h2>Good systems start here.</h2>
            </div>
            <Link className="text-link" href="/techstack">
              View full tech stack <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="capability-grid">
            {[
              {
                icon: Terminal,
                title: "Backend & APIs",
                copy: "Clear boundaries, modular services, and APIs that are a pleasure to work with.",
                tags: "Node.js / Express / Fastify / TypeScript",
              },
              {
                icon: Database,
                title: "Data & architecture",
                copy: "Thoughtful schemas, purposeful caching, and the right place for every piece of data.",
                tags: "MongoDB / MySQL / Prisma / Redis",
              },
              {
                icon: ShieldCheck,
                title: "Auth & reliability",
                copy: "Protected routes, validated inputs, and error handling built in from the start.",
                tags: "JWT / Cookies / Middleware / REST",
              },
            ].map(({ icon: Icon, title, copy, tags }, i) => (
              <article key={title}>
                <div className="capability-top">
                  <Icon size={24} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="small-mono">{tags}</span>
              </article>
            ))}
          </div>
        </section>
      )}
      {data.showExperience !== false && (
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
          </div>
          <div className="experience-list">
            {(data.experiences || [])
              .filter((e) => e.visible !== false)
              .slice(0, 3)
              .map((e, i) => (
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
      )}
      <section className="contact-section site-width" id="contact">
        <div className="contact-star" aria-hidden="true">
          ✳
        </div>
        <p className="eyebrow">YOUR NEXT IDEA STARTS HERE</p>
        <h2>
          Have a good problem?
          <br />
          Let’s <span>solve it.</span>
        </h2>
        <p>
          A project, an opportunity, or just a good conversation.
          <br />
          My inbox is open.
        </p>
        <ContactActions email={developer.email || "nishan.developer.dev@gmail.com"} />
      </section>
    </div>
  );
}
