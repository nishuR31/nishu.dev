import fs from "fs";
import path from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nishu-dev-api.onrender.com";
const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nishudevportfolio.vercel.app";

async function generateSitemap() {
  try {
    console.log("Fetching portfolio data to generate sitemap...");
    const res = await fetch(`${API_URL}/api/portfolio`);
    const data = await res.json();
    const portfolioData = data?.data || data;

    const staticRoutes = [
      { href: "", priority: 1.0, changefreq: "monthly" },
      { href: "/projects", priority: 0.9, changefreq: "monthly" },
      { href: "/experience", priority: 0.8, changefreq: "monthly" },
      { href: "/certificates", priority: 0.7, changefreq: "monthly" },
      { href: "/contact", priority: 0.7, changefreq: "monthly" },
      { href: "/hire", priority: 0.7, changefreq: "monthly" },
    ];

    const projectRoutes = (portfolioData?.projects || [])
      .map((p) => {
        const slug = p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : null);
        return slug ? { href: `/projects/${slug}`, priority: 0.7, changefreq: "monthly" } : null;
      })
      .filter(Boolean);

    const allRoutes = [...staticRoutes, ...projectRoutes];

    const urls = allRoutes.map((route) => {
      const url = `${FRONTEND_URL}${route.href}`;
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const sitemapPath = path.join(__dirname, "..", "public", "sitemap.xml");

    // Ensure public directory exists
    if (!fs.existsSync(path.dirname(sitemapPath))) {
      fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });
    }

    fs.writeFileSync(sitemapPath, sitemapContent);

    console.log("✅ Sitemap generated successfully at public/sitemap.xml");
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
  }
}

generateSitemap();
