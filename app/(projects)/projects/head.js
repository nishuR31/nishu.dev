import { getPortfolioData } from "@/lib/portfolio";

export default async function Head() {
  const result = await getPortfolioData();
  const portfolioData = result.ok ? result.data : {};

  const developer = portfolioData?.developer ?? {};
  const projects = portfolioData?.projects ?? [];
  const title = `Projects — ${developer?.name}`;
  const description = `Selected projects and demos by ${developer?.name}. Explore backend and full-stack work.`;

  const projectsJsonLd =
    projects?.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      description: p.description,
      url: p.demo || p.github,
      image: p.image,
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
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href="https://nishudevportfolio.vercel.app/projects" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
