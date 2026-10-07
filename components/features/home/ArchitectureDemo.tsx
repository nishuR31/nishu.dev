"use client";
import { useState } from "react";
import { ArrowUpRight, Braces, Check, Database, LockKeyhole, Terminal } from "lucide-react";
const examples = [
  {
    label: "API design",
    icon: Braces,
    file: "routes / projects.ts",
    request: "GET /api/projects",
    title: "A little structure. A lot of possibility.",
    code: [
      'router.get("/projects",',
      "  validate(querySchema),",
      "  async (request, reply) => {",
      "    const projects = await service.list();",
      "    return reply.send({ data: projects });",
      "  }",
      ");",
    ],
    result: "200 OK",
    note: "Validated input. Predictable output.",
    chipSymbol: "n.",
    chipTitle: "ENGINEERED",
    chipSub: "WITH INTENTION",
  },
  {
    label: "Authentication",
    icon: LockKeyhole,
    file: "middleware / auth.ts",
    request: "POST /api/session",
    title: "Trust is part of the architecture.",
    code: [
      "const session = await authenticate({",
      "  token: request.cookies.session,",
      '  permissions: ["projects:read"],',
      "});",
      "",
      "request.user = session.user;",
      "return next();",
    ],
    result: "SESSION VERIFIED",
    note: "Check identity. Then grant access.",
    chipSymbol: "***",
    chipTitle: "SECURE BY",
    chipSub: "DESIGN",
  },
  {
    label: "Data layer",
    icon: Database,
    file: "services / projects.ts",
    request: "QUERY projects.findMany()",
    title: "The right data. In the right place.",
    code: [
      "const projects = await db.project.findMany({",
      "  where: { published: true },",
      "  select: {",
      "    id: true,",
      "    title: true,",
      "  },",
      "});",
    ],
    result: "QUERY COMPLETE",
    note: "Explicit queries. Intentional boundaries.",
    chipSymbol: "{}",
    chipTitle: "STRUCTURED &",
    chipSub: "RELIABLE",
  },
];
export default function ArchitectureDemo() {
  const [active, setActive] = useState(0);
  const example = examples[active];
  return (
    <div className="architecture-demo">
      <div className="demo-topline">
        <span>
          <i />
          <i />
          <i />
        </span>
        <p>UNDER THE HOOD</p>
        <Terminal size={14} />
      </div>
      <div className="demo-tabs" role="group" aria-label="Explore architecture concepts">
        {examples.map(({ label, icon: Icon }, i) => (
          <button
            type="button"
            key={label}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
      <div className="demo-stage" aria-hidden="true">
        <div className="demo-grid" />
        <div className="demo-orbit" />
        <div className="demo-orbit orbit-inner" />
        <div className="demo-connector" />
        <span className="demo-endpoint">client</span>
        <div className="demo-chip">
          <span>{example.chipSymbol}</span>
          <small>
            {example.chipTitle}
            <br />
            {example.chipSub}
          </small>
        </div>
        <span className="demo-endpoint endpoint-right">
          {["API", "AUTH", "DATA"][active]}
          <ArrowUpRight size={13} />
        </span>
        <span className="demo-stage-caption">{example.title}</span>
      </div>
      <div className="demo-code" aria-live="polite">
        <div className="code-filename">
          <span>{example.file}</span>
          <span>TypeScript</span>
        </div>
        <pre>
          <code>
            {example.code.map((line, i) => (
              <span className="code-line" key={`${active}-${i}`}>
                <span className="line-number" aria-hidden="true">
                  {i + 1}
                </span>
                {line}
              </span>
            ))}
          </code>
        </pre>
        <div className="demo-response">
          <span>
            <Check size={12} />
            {example.result}
          </span>
          <span>{example.note}</span>
        </div>
      </div>
      <div className="demo-caption">
        <span>INTERACTIVE ARCHITECTURE STUDY</span>
        <span>Try a tab above ↗</span>
      </div>
    </div>
  );
}
