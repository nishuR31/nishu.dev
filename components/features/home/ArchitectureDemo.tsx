"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Braces,
  Check,
  Database,
  LockKeyhole,
  ShieldCheck,
  Terminal,
} from "lucide-react";

const examples = [
  {
    label: "API",
    icon: Braces,
    file: "routes/projects.ts",
    request: "GET /api/projects",
    title: "Validated Input. Predictable Output.",
    code: [
      'router.get("/projects",',
      "  validate(querySchema),",
      "  async (request, reply) => {",
      "    const projects = await service.list();",
      "    return reply.send({ data: projects });",
      "  }",
      ");",
    ],
    result: "{ success: true, count: 12, cached: true }",
    statusBadge: "200 OK",
    note: "Strict schemas. Deterministic output.",
    chipSymbol: "{...}",
    chipTitle: "ENGINEERED",
    chipSub: "WITH INTENTION",
    endpointLeft: "Client",
    endpointRight: "REST API",
    accentColor: "#f97316",
  },
  {
    label: "Auth",
    icon: LockKeyhole,
    file: "middleware/auth.ts",
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
    result: "{ session: 'active', verified: true, role: 'admin' }",
    statusBadge: "201 CREATED",
    note: "Verify identity. Grant least privilege.",
    chipSymbol: "***",
    chipTitle: "SECURE BY",
    chipSub: "DESIGN",
    endpointLeft: "Session",
    endpointRight: "Auth Gate",
    accentColor: "#eab308",
  },
  {
    label: "DB",
    icon: Database,
    file: "services/projects.ts",
    request: "QUERY projects.findMany()",
    title: "Sub-millisecond reads with caching.",
    code: [
      "const cache = await redis.get('projects');",
      "if (cache) return JSON.parse(cache);",
      "const projects = await db.project.findMany({",
      "  where: { published: true },",
      "  select: { id: true, title: true, slug: true },",
      "});",
      "await redis.set('projects', JSON.stringify(projects), 'EX', 3600);",
    ],
    result: "{ cached: true, latency: '1.4ms', source: 'Redis' }",
    statusBadge: "200 CACHED",
    note: "Explicit queries. Fast invalidation.",
    chipSymbol: ". . .",
    chipTitle: "STRUCTURED &",
    chipSub: "RELIABLE",
    endpointLeft: "App Core",
    endpointRight: "Redis + DB",
    accentColor: "#10b981",
  },
  {
    label: "DevSecOps",
    icon: ShieldCheck,
    file: ".github/workflows/deploy.yml",
    request: "PUSH refs/heads/main",
    title: "Zero-trust audit, test & automated deploy.",
    code: [
      "name: Production CI/CD",
      "on: push: { branches: [main] }",
      "jobs:",
      "  security-audit:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "      - run: trivy fs --security-checks vuln .",
      "      - run: bun test && bun run build",
      "      - run: deploy-edge --env=production",
    ],
    result: "{ build: 'success', vulnCheck: 'passed (0 CVE)', time: '38s' }",
    statusBadge: "✓ DEPLOYED",
    note: "Automated scan. Zero-downtime rollout.",
    chipSymbol: "✓",
    chipTitle: "DEPLOYED ON",
    chipSub: "PRODUCTION",
    endpointLeft: "Git Push",
    endpointRight: "Edge / K8s",
    accentColor: "#3b82f6",
  },
];

export default function ArchitectureDemo() {
  const [active, setActive] = useState(0);
  const example = examples[active];

  return (
    <div className="architecture-demo">
      <div className="demo-topline">
        <div className="window-dots" role="tablist" aria-label="Window control tabs">
          {examples.map((ex, i) => (
            <button
              type="button"
              key={ex.label}
              onClick={() => setActive(i)}
              className={`window-dot dot-${i} ${active === i ? "active" : ""}`}
              aria-label={`Switch to ${ex.label}`}
              title={`Switch to ${ex.label}`}
            >
              <span className="dot-inner" />
            </button>
          ))}
        </div>
        <div className="demo-topline-title">
          <Terminal size={12} />
          <span>UNDER THE HOOD</span>
        </div>
        <div className="cross">
          <span>X</span>
        </div>
      </div>

      <div className="demo-tabs" role="tablist" aria-label="Architecture concepts">
        {examples.map(({ label, icon: Icon }, i) => (
          <button
            type="button"
            key={label}
            role="tab"
            aria-selected={active === i}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
            className={`demo-tab-btn ${active === i ? "selected" : ""}`}
          >
            <Icon size={14} className="tab-icon" />
            <span className="tab-text">{label}</span>
          </button>
        ))}
      </div>

      <div className="demo-stage" aria-hidden="true">
        <div className="demo-grid" />
        <div className="demo-orbit animate-pulse" />
        <div className="demo-orbit orbit-inner animate-pulse" />
        <div className="demo-connector" />
        <span className="demo-endpoint endpoint-left">{example.endpointLeft}</span>
        <div
          className="demo-chip"
          style={{
            borderColor: "#b0b0b033",
            boxShadow: `0 8px 24px -4px #b0b0b033, 6px 7px 0 #7e432c`,
          }}
        >
          <span>{example.chipSymbol}</span>
          <small>
            {example.chipTitle}
            <br />
            {example.chipSub}
          </small>
        </div>
        <span className="demo-endpoint endpoint-right">
          {example.endpointRight}
          <ArrowUpRight size={13} />
        </span>
        <span className="demo-stage-caption">{example.title}</span>
      </div>

      <div className="demo-code" aria-live="polite">
        <div className="code-filename">
          <span className="file-badge">
            <span
              className="file-indicator"
              // style={{ background: example.accentColor }}
            />
            {example.file}
          </span>
          <span className="code-lang">
            <span
              className="request-badge"
              // style={{
              //   color: example.accentColor,
              //   borderColor: `${example.accentColor}55`,
              //   background: `${example.accentColor}18`,
              // }}
            >
              {example.request}
            </span>
            TypeScript
          </span>
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
          <span className="response-text">
            <Check size={12} className="response-check" />
            <code>{example.result}</code>
          </span>
          <span
            className="status-badge"
            // style={{
            //   color: example.accentColor,
            //   borderColor: `${example.accentColor}55`,
            //   background: `${example.accentColor}18`,
            // }}
          >
            {example.statusBadge}
          </span>
        </div>
      </div>

      <div className="demo-caption">
        <span>INTERACTIVE ARCHITECTURE BENCH</span>
        <span className="caption-hint">Click any of the 4 tabs above ↗</span>
      </div>
    </div>
  );
}
