import { config } from "@/config";

export default async function Head() {
  let portfolioData = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      portfolioData = data?.data || data;
    }
  } catch (error) {
    console.error("Failed to fetch portfolio data for head", error);
  }

  const developer = portfolioData?.developer || config.developer;
  const title = `${developer?.name} — ${developer?.role}`;
  const description = `${developer?.tagline} — ${developer?.bio}`;
  const keywords = portfolioData?.keywords || config.keywords || "portfolio,backend,developer";

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
