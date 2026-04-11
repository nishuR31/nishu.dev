Lighthouse Audit & SEO Checklist

Run locally

```bash
# generate report (requires Node/npm)
npm run lighthouse
# open report
start ./lighthouse-report.html  # Windows
open ./lighthouse-report.html   # macOS
```

Quick fixes to apply if Lighthouse flags issues:

- Ensure `meta viewport` is present (added to layout head).
- Preload critical images (`<link rel="preload" as="image" href="/homepage.png">`).
- Use `next/image` for responsive images (already used in project cards and header).
- Add `loading="lazy"` to non-critical images (project cards already include it).
- Reduce unused JS/CSS: audit large deps and remove unused imports.
- Add `font-display: swap` for custom fonts (check `globals.css` family).
- Use `rel=preconnect` for critical external origins (e.g., `https://api.github.com`).
- Serve images in modern formats (webp/avif) — convert large images in `/public/projects`.
- Minimize main-thread work: avoid heavy JS on first paint.
- Ensure large third-party scripts are deferred or loaded after interaction.
- Add structured data (JSON-LD) for pages and projects (added).

SEO checklist:

- Unique title and meta description per page (home and projects added).
- Canonical links set for main pages.
- Sitemap available at `/sitemap.xml` and submitted to Search Console.
- `robots.txt` present and allows Google (already added).
- Images have descriptive `alt` attributes (project cards and logo included).
- Use descriptive link text and clear URL structures.
- Monitor Search Console for indexing issues and coverage/errors.

Notes

- For fastest re-indexing, submit sitemap in Search Console and request indexing for critical pages.
- Lighthouse is a local tool; use it to iterate on performance and follow remediation suggestions.
