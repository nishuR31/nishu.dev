import { getPortfolioData } from "@/lib/portfolio";
import {
  Layers,
  Terminal,
  Database,
  ShieldCheck,
  Braces,
  Code,
  Cpu,
  Globe,
  Server,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Stack | Nishan Rajak",
  description: "Tools, languages, and technologies I work with.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function TechStackPage() {
  const result = await getPortfolioData();
  const data = result.ok ? result.data : {};
  const skillCategories = data.skills || [];

  // Helper to map category titles or icon keys to a Lucide icon
  const getCategoryIcon = (key: string) => {
    switch (key?.toLowerCase()) {
      case "frontend":
        return <Globe size={20} />;
      case "backend":
        return <Server size={20} />;
      case "databases & tools":
      case "database":
        return <Database size={20} />;
      case "core concepts":
        return <Cpu size={20} />;
      case "other tools":
        return <Wrench size={20} />;
      default:
        return <Layers size={20} />;
    }
  };

  // Generic helper for tech icons (text symbol fallback)
  const getTechIcon = (name: string) => {
    const map: Record<string, string> = {
      TypeScript: "TS",
      "Node.js": "⬡",
      "Express.js": "ex",
      MongoDB: "◈",
      PostgreSQL: "▥",
      Redis: "▱",
      JavaScript: "JS",
      React: "⚛",
      "bun.js": "B",
      Fastify: "F",
      "MVC Architecture": "MVC",
      "JWT Authentication": "JWT",
      Prisma: "▲",
      Postman: "P",
      "VS Code Stable": "VS",
      Antigravity: "AG",
      Termux: "T",
      "Data Communication": "DC",
      TailwindCSS: "tw",
      HTML: "5",
      CSS: "3",
    };
    return map[name] || name.substring(0, 2).toUpperCase();
  };

  return (
    <section className="site-width" style={{ paddingBlock: "90px 115px", minHeight: "75vh" }}>
      <div style={{ textAlign: "center", marginBottom: "70px" }}>
        <p className="eyebrow section-index" style={{ justifyContent: "center" }}>
          THE TOOLS I USE
        </p>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 76px)",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            fontWeight: 500,
          }}
        >
          My <span className="orange-text">Tech Stack.</span>
        </h1>
        <p className="section-description" style={{ margin: "20px auto 0", maxWidth: "600px" }}>
          A complete overview of the technologies, frameworks, and concepts I use to build scalable
          applications.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
        {skillCategories.map((category: any) => (
          <div key={category.id} className="tech-category">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "25px",
                color: "var(--ink)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  color: "var(--orange)",
                }}
              >
                {getCategoryIcon(category.title)}
              </div>
              <div>
                <h2 style={{ fontSize: "24px", letterSpacing: "-0.5px", fontWeight: 500 }}>
                  {category.title}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--subtle)" }}>{category.description}</p>
              </div>
            </div>

            <div className="tech-grid">
              {(category.skills || []).map((skill: any) => (
                <div key={skill.id} className="tech-card">
                  <div className="tech-icon-wrapper">
                    <span className="tech-icon-text">{getTechIcon(skill.name)}</span>
                  </div>
                  <h3 className="tech-name">{skill.name}</h3>
                  <span className="tech-level">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 20px;
        }
        .tech-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px 15px;
          background-color: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--line);
          transition: border-color 0.25s, transform 0.25s, background-color 0.25s;
          cursor: default;
        }
        .tech-card:hover {
          border-color: var(--strong-line);
          transform: translateY(-4px);
          background-color: var(--raised);
        }
        .tech-icon-wrapper {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          background: color-mix(in srgb, var(--orange) 10%, transparent);
          border-radius: 12px;
          margin-bottom: 16px;
          color: var(--orange);
          border: 1px solid color-mix(in srgb, var(--orange) 20%, transparent);
          transition: transform 0.3s;
        }
        .tech-card:hover .tech-icon-wrapper {
          transform: scale(1.1);
        }
        .tech-icon-text {
          font-family: monospace;
          font-size: 20px;
          font-weight: 700;
        }
        .tech-name {
          font-size: 15px;
          font-weight: 500;
          color: var(--ink);
          margin: 0 0 8px 0;
        }
        .tech-level {
          font-size: 11px;
          font-family: monospace;
          color: var(--quiet);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .tech-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
          }
          .tech-card {
            padding: 20px 10px;
          }
        }
      `,
        }}
      />
    </section>
  );
}
