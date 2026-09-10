import { getPortfolioData } from "@/lib/portfolio";
import ProjectCollection from "@/components/features/projects/ProjectCollection";
export const metadata = {
  title: "Projects",
  description:
    "Explore Nishan Rajak’s backend systems, full-stack applications, and developer tools.",
};
export default async function ProjectsPage() {
  const result = await getPortfolioData();
  return (
    <section className="site-width collection-page">
      <p className="eyebrow section-index">THE PROJECT ARCHIVE</p>
      <h1>
        Ideas, made real<span className="orange-text">.</span>
      </h1>
      <p className="section-description">
        Experiments, useful tools, and real-world solutions. A collection of what I’m building.
      </p>
      <ProjectCollection projects={result.ok ? result.data.projects || [] : []} />
    </section>
  );
}
