#!/usr/bin/env bash
# Simple script to ping search engines with sitemap URL
SITEMAP_URL="https://nishu.portfolio.vercel.app/sitemap.xml"

echo "Pinging Google..."
curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}"
echo "\nPinging Bing..."
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}"

echo "Done. If you have Search Console access, also submit the sitemap there for fastest indexing."
