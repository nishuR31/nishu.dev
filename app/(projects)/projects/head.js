import { config } from "@/config";

export default function Head() {
  const title = `Projects — ${config.developer.name}`;
  const description = `Selected projects and demos by ${config.developer.name}. Explore backend and full-stack work.`;

  const projectsJsonLd = config.projects.map((p) => ({
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    url: p.demo,
    image: p.image,
  }));

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
      <link
        rel="canonical"
        href="https://nishudevportfolio.vercel.app/projects"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
