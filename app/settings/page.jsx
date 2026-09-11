import { ArrowUpRight, Lock, Database, LayoutDashboard } from "lucide-react";

export const metadata = {
  title: "Settings",
  description: "Admin panel and workspace settings.",
};

export default function SettingsPage() {
  const api = (process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com").replace(
    /\/$/,
    ""
  );

  return (
    <section className="site-width collection-page">
      <p className="eyebrow section-index">WORKSPACE CONFIGURATION</p>
      <h1>
        System <span className="hero-serif">Settings.</span>
      </h1>
      <p className="section-description">
        Manage portfolio visibility, content, and external integrations through the dedicated admin workspace.
      </p>
      
      <div className="project-grid" style={{ marginTop: "40px" }}>
        <article className="project-tile" style={{ padding: "30px" }}>
          <div className="project-meta" style={{ marginBottom: "20px" }}>
            <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Lock size={16} /> RESTRICTED ACCESS
            </span>
          </div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            Admin Dashboard
          </h3>
          <p style={{ fontSize: "14px", color: "var(--subtle)", lineHeight: 1.6, marginBottom: "25px" }}>
            The content on this portfolio is managed via a dedicated API client. Navigate to your secure workspace to modify your CVs, projects, and visibility toggles.
          </p>
          <a
            href={`${api}/client`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-dark"
            style={{ width: "fit-content" }}
          >
            <LayoutDashboard size={16} /> Open Workspace <ArrowUpRight size={16} />
          </a>
        </article>

        <article className="project-tile" style={{ padding: "30px" }}>
          <div className="project-meta" style={{ marginBottom: "20px" }}>
            <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Database size={16} /> DATA LAYER
            </span>
          </div>
          <h3 style={{ fontSize: "24px", marginBottom: "15px" }}>
            API Status
          </h3>
          <p style={{ fontSize: "14px", color: "var(--subtle)", lineHeight: 1.6, marginBottom: "25px" }}>
            Your portfolio pulls data from the `nishu.dev.api`. Content edits take effect immediately thanks to the dynamic routing layer.
          </p>
          <div className="tech-tags">
            <span>Next.js</span>
            <span>REST API</span>
          </div>
        </article>
      </div>
    </section>
  );
}
