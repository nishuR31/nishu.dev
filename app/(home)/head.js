import { config } from "@/config";

export default function Head() {
  const title = `${config.developer.name} — ${config.developer.role}`;
  const description = config.developer.tagline + " — " + config.developer.bio;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: "https://nishu.portfolio.vercel.app/",
    author: {
      "@type": "Person",
      name: config.developer.name,
    },
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={config.keywords || "portfolio,backend,developer"}
      />
      <link rel="canonical" href="https://nishu.portfolio.vercel.app/" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
