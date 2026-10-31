#!/bin/sh
# Builds the static site and publishes it to the gh-pages branch (GitHub Pages).
# Usage: sh scripts/deploy-pages.sh
set -e
REPO=slsv-2027
node scripts/previews.mjs
rm -rf out
NEXT_PUBLIC_BASE_PATH="/$REPO" npx next build
touch out/.nojekyll # let Pages serve the _next/ folder
cd out
git init -q -b gh-pages
git add -A
git commit -q -m "Publish site"
git push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
