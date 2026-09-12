#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# Sage — Cloudflare Pages Deployment Script
# ═══════════════════════════════════════════════════════════════════════════
# Prerequisites:
#   1. Cloudflare account + wrangler CLI authenticated (npx wrangler login)
#   2. D1 database created: npx wrangler d1 create sage-db
#   3. Update wrangler.toml with the database_id from step 2
#   4. KV namespace created: npx wrangler kv namespace create SAGE_KV
#   5. Update wrangler.toml with the KV namespace id
#   6. Set all secrets (see .env.example for the list):
#        npx wrangler pages secret put NEXTAUTH_SECRET --project-name=sage-seo
#        npx wrangler pages secret put STRIPE_SECRET_KEY --project-name=sage-seo
#        ... etc
#   7. D1 migration applied: ./scripts/migrate-d1.sh
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

PROJECT_NAME="${1:-sage-seo}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Sage — Cloudflare Pages Deployment                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Project: $PROJECT_NAME"
echo ""

# Step 1: Check prerequisites
echo "📋 Step 1: Checking prerequisites..."

if ! command -v npx &> /dev/null; then
  echo "❌ npx not found. Install Node.js 18+ first."
  exit 1
fi

if [ ! -f wrangler.toml ]; then
  echo "❌ wrangler.toml not found. Are you in the project root?"
  exit 1
fi

if grep -q "YOUR_D1_DATABASE_ID_HERE" wrangler.toml; then
  echo "❌ wrangler.toml still has placeholder D1 database_id."
  echo "   Run: npx wrangler d1 create sage-db"
  echo "   Then update wrangler.toml with the returned database_id."
  exit 1
fi

if grep -q "YOUR_KV_NAMESPACE_ID_HERE" wrangler.toml; then
  echo "❌ wrangler.toml still has placeholder KV namespace id."
  echo "   Run: npx wrangler kv namespace create SAGE_KV"
  echo "   Then update wrangler.toml with the returned id."
  exit 1
fi

echo "   ✓ wrangler.toml configured"
echo ""

# Step 2: Install next-on-pages
echo "📦 Step 2: Installing @cloudflare/next-on-pages..."
bun add -d @cloudflare/next-on-pages 2>/dev/null || npm install -D @cloudflare/next-on-pages
echo "   ✓ Installed"
echo ""

# Step 3: Build for Cloudflare
echo "🔨 Step 3: Building for Cloudflare Pages..."
npx @cloudflare/next-on-pages
echo "   ✓ Build complete"
echo ""

# Step 4: Deploy
echo "🚀 Step 4: Deploying to Cloudflare Pages..."
npx wrangler pages deploy .vercel/output/static --project-name="$PROJECT_NAME"
echo ""

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Set up a custom domain in Cloudflare Pages dashboard"
echo "     (sage.virtualab.digital → your-pages-project.pages.dev)"
echo "  2. Update DNS records as instructed by Cloudflare"
echo "  3. Verify the site loads at https://sage.virtualab.digital"
echo "  4. Test the MCP server: curl https://sage.virtualab.digital/api/mcp/tools"
