
import { getPortfolioData } from "@/lib/portfolio";

export default async function Head() {
  const portfolioData = await getPortfolioData();

  const developer = portfolioData?.developer ?? {};
  const title = `${developer?.name ?? ""} — ${developer?.role ?? ""}`;
  const description = `${developer?.tagline ?? ""} — ${developer?.bio ?? ""}`;
  const keywords = portfolioData?.keywords ?? "portfolio,backend,developer";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: process.env.NEXT_PUBLIC_FRONTEND_URL,
    author: {
      "@type": "Person",
      name: developer?.name,
    },
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={process.env.NEXT_PUBLIC_FRONTEND_URL} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
