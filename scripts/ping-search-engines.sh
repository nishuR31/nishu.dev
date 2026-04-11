#!/usr/bin/env bash
# Lightweight script to (1) explain Google's deprecation of sitemap ping
# and (2) ping Bing with your sitemap. Google requires Search Console/API.

SITEMAP_URL="https://nishudevportfolio.vercel.app/sitemap.xml"

echo "Note: Google no longer supports the direct sitemap 'ping' endpoint."
echo "See: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping"
echo
echo "Recommended actions for Google indexing:"
echo " - Submit your sitemap in Google Search Console: https://search.google.com/search-console/sitemaps"
echo " - Use URL Inspection -> Request Indexing for priority pages (Search Console)"
echo " - For automated workflows, use the Search Console API (requires OAuth credentials)."
echo
echo "Pinging Bing with sitemap..."
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}"
echo
echo "Done. For Google, submit the sitemap in Search Console to request reindexing."
