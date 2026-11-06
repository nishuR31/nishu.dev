import Link from "next/link";
import { ArrowUpRight, Terminal, Database, ShieldCheck, ScrollText } from "lucide-react";

const capabilities = [
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
    tags: "MongoDB / PostgreSQL / Prisma / Redis",
  },
  {
    icon: ShieldCheck,
    title: "Auth & reliability",
    copy: "Protected routes, validated inputs, and error handling built in from the start.",
    tags: "JWT / Cookies / Middleware / REST",
  },
  {
    icon: ScrollText,
    title: "Audit trail & logging",
    copy: "Immutable action logs, structured event tracing, and complete state history built for auditability.",
    tags: "Pino / Winston / Morgan / Audit Logs",
  },
];

export default function CapabilitiesSection() {
  return (
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
        {capabilities.map(({ icon: Icon, title, copy, tags }, i) => (
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
  );
}
