import fs from "fs";
import path from "path";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND || "https://nishu-dev-api.onrender.com";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://nishudevportfolio.vercel.app";

async function generateSitemap() {
  try {
    console.log("Fetching portfolio data to generate sitemap...");
    const res = await fetch(`${API_URL}/portfolio`);
    const data = await res.json();
    const portfolioData = data?.data || data;

    const navItems = portfolioData?.NAV_ITEMS || [
      { href: "/projects" },
      { href: "/certificates" },
      { href: "/contact" }
    ];

    const staticRoutes = ["", ...navItems.map((item) => item.href).filter((href) => !href.includes("#"))];

    const urls = staticRoutes.map((route) => {
      const url = `${FRONTEND_URL}${route}`;
      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === "" ? "yearly" : "monthly"}</changefreq>
    <priority>${route === "" ? 1.0 : 0.8}</priority>
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
