import { getPortfolioData, PORTFOLIO_REVALIDATE_SECONDS } from "@/lib/portfolio";
import { getProjectImageUrl, withUsableImages } from "@/lib/project-images-server";
import ProjectCollection from "@/components/features/projects/ProjectCollection";
import type { Metadata } from "next";

export const revalidate = PORTFOLIO_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Projects | Nishan Rajak",
  description:
    "Explore Nishan Rajak’s backend systems, full-stack applications, and developer tools.",
  alternates: {
    canonical: "/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ProjectsPage() {
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : {};
  const developer = portfolioData?.developer ?? {};
  // Drop image paths whose local files no longer exist before they reach the client.
  const projects = (portfolioData?.projects ?? []).map((p: any) => withUsableImages(p));
  const title = `Projects — ${developer?.name || "Nishan Rajak"}`;
  const description = `Selected projects and demos by ${developer?.name || "Nishan Rajak"}. Explore backend and full-stack work.`;

  const projectsJsonLd =
    projects?.map((p: any) => ({
      "@type": "CreativeWork",
      name: p.title,
      description: p.description,
      url: p.demo || p.github,
      image: getProjectImageUrl(p),
    })) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: title,
        description,
        url: "https://nishudevportfolio.vercel.app/projects",
      },
      ...projectsJsonLd,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="site-width collection-page">
        <p className="eyebrow section-index">THE PROJECT ARCHIVE</p>
        <h1>
          Ideas, made real<span className="orange-text">.</span>
        </h1>
        <p className="section-description">
          Experiments, useful tools, and real-world solutions. A collection of what I’m building.
        </p>
        <ProjectCollection projects={projects} />
      </section>
    </>
  );
}
