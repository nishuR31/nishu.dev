import Link from "next/link";

const toolkitSkills = [
  { sym: "JS", name: "JavaScript" },
  { sym: "TS", name: "TypeScript" },
  { sym: "⬡", name: "Node.js" },
  { sym: "B", name: "bun.js" },
  { sym: "ex", name: "Express.js" },
  { sym: "F", name: "Fastify" },
];

export default function StackStrip() {
  const repeated = [...toolkitSkills, ...toolkitSkills, ...toolkitSkills, ...toolkitSkills];

  return (
    <div className="stack-strip">
      <Link href="/techstack" className="marquee-container">
        <div className="marquee-content">
          {repeated.map((tech, i) => (
            <span className="stack-item" key={i}>
              <span className="stack-symbol">{tech.sym}</span>
              {tech.name}
            </span>
          ))}
        </div>
      </Link>
    </div>
  );
}
