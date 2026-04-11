#!/usr/bin/env bash
# Quick analytics: runs Lighthouse and (optional) PageSpeed Insights API
# Usage: PAGESPEED_KEY=your_key bash scripts/quick-analytics.sh https://example.com

set -euo pipefail

URL=${1:-https://nishudevportfolio.vercel.app}
OUT_DIR=./analytics-report
mkdir -p "$OUT_DIR"

echo "Running Lighthouse for: $URL"
npx lighthouse "$URL" --output html --output-path "$OUT_DIR/lighthouse-report.html" --chrome-flags="--headless" --quiet || echo "Lighthouse run finished with non-zero exit"
echo "Saved: $OUT_DIR/lighthouse-report.html"

if [ -n "${PAGESPEED_KEY-}" ]; then
  echo "Calling PageSpeed Insights API (mobile)..."
  curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&strategy=mobile&key=${PAGESPEED_KEY}" -o "$OUT_DIR/pagespeed-mobile.json"
  echo "Saved: $OUT_DIR/pagespeed-mobile.json"
  echo "Calling PageSpeed Insights API (desktop)..."
  curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&strategy=desktop&key=${PAGESPEED_KEY}" -o "$OUT_DIR/pagespeed-desktop.json"
  echo "Saved: $OUT_DIR/pagespeed-desktop.json"
else
  echo "PAGESPEED_KEY not set — skipping PageSpeed Insights API calls. To enable, set PAGESPEED_KEY env var."
fi

ENCODED_PATH=$(echo "$URL" | sed -E 's~https?://~~; s~[:/?#]~-~g')
echo
echo "Quick links:"
echo " - Lighthouse report: $OUT_DIR/lighthouse-report.html"
echo " - web.dev analysis (open in browser): https://pagespeed.web.dev/analysis/${ENCODED_PATH}?form_factor=mobile"
echo " - PageSpeed API JSON (if key provided): $OUT_DIR/pagespeed-mobile.json"
echo
echo "To notify search engines (Bing) run: bash scripts/ping-search-engines.sh"
