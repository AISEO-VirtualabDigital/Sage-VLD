# Sage — Cloudflare Pages + D1 Deployment Guide

This guide walks you through deploying Sage to Cloudflare Pages with a D1 database. The entire app — marketing site, 28-tool MCP server, and dashboard UI — runs on Cloudflare's edge network.

---

## Prerequisites

1. **Cloudflare account** — free tier works for testing
2. **Node.js 18+** and **Bun** installed locally
3. **Wrangler CLI** — install with `npm install -g wrangler`
4. **Stripe account** (for billing — Lane 2)
5. **DataForSEO account** (for live rank tracking — Lane 3, optional for demo)

---

## Step 1: Authenticate Wrangler

```bash
npx wrangler login
```

This opens a browser window. Authorize Wrangler to manage your Cloudflare account.

---

## Step 2: Create the D1 Database

```bash
npx wrangler d1 create sage-db
```

This outputs a `database_id`. Copy it — you'll paste it into `wrangler.toml` in Step 4.

---

## Step 3: Create the KV Namespace (for sessions/cache)

```bash
npx wrangler kv namespace create SAGE_KV
```

Copy the `id` from the output.

---

## Step 4: Update `wrangler.toml`

Open `wrangler.toml` and replace the placeholders:

```toml
[[d1_databases]]
binding = "DB"
database_name = "sage-db"
database_id = "abc123..."  # ← Paste from Step 2

[[kv_namespaces]]
binding = "SAGE_KV"
id = "xyz789..."  # ← Paste from Step 3
```

---

## Step 5: Apply the D1 Migration

The SQL migration is pre-generated from the Prisma schema at `prisma/migrations/d1_init.sql`. Apply it to your D1 database:

```bash
bun run db:migrate:d1
# or manually:
npx wrangler d1 execute sage-db --file=./prisma/migrations/d1_init.sql --remote
```

To regenerate the migration after schema changes:

```bash
bun run db:diff:d1
```

---

## Step 6: Set Secrets

Cloudflare secrets are encrypted environment variables. Set each one:

```bash
# Required for auth
npx wrangler pages secret put NEXTAUTH_SECRET --project-name=sage-seo
# (paste output of: openssl rand -base64 32)

# Required for billing (Lane 2)
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name=sage-seo
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name=sage-seo

# Required for live data (Lane 3 — optional for demo)
npx wrangler pages secret put DATAFORSEO_LOGIN --project-name=sage-seo
npx wrangler pages secret put DATAFORSEO_PASSWORD --project-name=sage-seo
npx wrangler pages secret put OPENAI_API_KEY --project-name=sage-seo

# Required for GSC/GA4 (Lane 3 — optional)
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=sage-seo
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=sage-seo

# Required for encrypting user BYOK keys at rest
npx wrangler pages secret put SAGE_ENCRYPTION_KEY --project-name=sage-seo
# (paste output of: openssl rand -hex 32)
```

---

## Step 7: Deploy

```bash
bun run deploy:cf
```

This script:
1. Verifies `wrangler.toml` is configured
2. Installs `@cloudflare/next-on-pages`
3. Builds the app for Cloudflare's edge runtime
4. Deploys to Cloudflare Pages

Your app will be live at `https://sage-seo.pages.dev` (or your custom domain).

---

## Step 8: Set Up Custom Domain

1. Go to the Cloudflare Pages dashboard
2. Select your `sage-seo` project
3. Go to **Custom domains** → **Set up a custom domain**
4. Enter `sage.virtualab.digital` (or your domain)
5. Cloudflare will guide you through DNS configuration

---

## Step 9: Verify the Deployment

```bash
# Check the homepage loads
curl https://sage.virtualab.digital/

# Check the MCP server is live
curl https://sage.virtualab.digital/api/mcp/tools

# Test a read tool (no auth needed)
curl https://sage.virtualab.digital/api/mcp/sage.sites.list

# Test a write tool (needs API key)
curl -X POST https://sage.virtualab.digital/api/mcp/sage.audits.run \
  -H "Authorization: Bearer sage_live_..." \
  -H "Content-Type: application/json" \
  -d '{"siteId":"..."}'
```

---

## How D1 + Prisma Works on Cloudflare

The app uses Prisma ORM with SQLite locally and D1 in production. Here's the key difference:

### Local Dev (SQLite)
- `DATABASE_URL="file:./db/custom.db"` in `.env`
- `bun run db:push` syncs the schema
- `bun run db:seed` loads demo data

### Production (D1)
- No `DATABASE_URL` — the D1 database is bound as `env.DB` in `wrangler.toml`
- Prisma's D1 adapter uses the binding directly
- Migrations applied via `npx wrangler d1 execute` (not `prisma migrate`)
- The schema file (`prisma/schema.prisma`) is the source of truth for both

### Prisma D1 Adapter

For production, you'll need to switch from the standard Prisma client to the D1 adapter. This is a small change in `src/lib/db.ts`:

```typescript
// Production (D1)
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  adapter: new PrismaD1(env.DB),
})

// Local dev (SQLite) — current setup
const prisma = new PrismaClient({ log: ['query'] })
```

The current code works for local dev and the build step. The D1 adapter swap happens at deploy time via environment detection.

---

## Troubleshooting

### "Module not found: @cloudflare/next-on-pages"
Install it: `bun add -d @cloudflare/next-on-pages`

### Build fails with edge runtime errors
Some Node.js APIs aren't available in Cloudflare Workers. Common fixes:
- Replace `crypto.randomUUID()` with `crypto.getRandomValues()` (already done)
- Avoid `fs`, `path`, `child_process` in route handlers
- Use `Buffer` via the `nodejs_compat` flag (already enabled in `wrangler.toml`)

### D1 query errors
Check that the migration was applied:
```bash
npx wrangler d1 execute sage-db --command="SELECT name FROM sqlite_master WHERE type='table'" --remote
```

### Stripe webhooks not working
1. Set the webhook URL in Stripe dashboard: `https://sage.virtualab.digital/api/stripe/webhook`
2. Set `STRIPE_WEBHOOK_SECRET` via `wrangler pages secret put`
3. Test with `stripe listen --forward-to localhost:3000/api/stripe/webhook` locally

---

## Cost Estimate

Cloudflare Pages + D1 pricing (as of 2025):

| Resource | Free Tier | Paid |
|---|---|---|
| Pages requests | 100K/day | $0.30/million |
| Pages builds | 500/month | $0.50/100 min |
| D1 reads | 5M/day | $0.001/million |
| D1 writes | 100K/day | $1.00/million |
| D1 storage | 5 GB | $0.75/GB-month |
| KV reads | 100K/day | $0.50/million |
| KV writes | 1K/day | $5.00/million |

For a typical Sage customer with 5 sites and 1,000 keywords tracked daily:
- ~30,000 keyword-day checks × $0.004 wholesale = **$120/mo DataForSEO cost** (passed through to user)
- Cloudflare infrastructure: **under $5/mo** (well within free tier)

This is why Sage can charge $49/mo + $30 credits = $79 all-in, vs Ahrefs at $129/mo for the same data.

---

## Next Steps After Deployment

1. **Lane 2: Auth & Stripe Billing** — Set up user accounts, Stripe checkout, and the BYOK + credits pricing model
2. **Lane 3: Live Integrations** — Replace demo simulations with real DataForSEO/LLM/GSC API calls
3. **Monitoring** — Set up Cloudflare Analytics + error tracking (Sentry recommended)
4. **CI/CD** — GitHub Actions to auto-deploy on push to `main`
