# Sage Setup — Windows PowerShell Commands

# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Download sage-vld-source.zip from the chat download panel
#         Save it to C:\Users\jrain\Downloads\
# ═══════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Extract + initialize git + push to GitHub
# Run these commands in PowerShell:
# ═══════════════════════════════════════════════════════════════════════════

# Go to your home directory
cd ~

# Create the project folder
mkdir sage-vld
cd sage-vld

# Extract the zip (adjust path if you saved it elsewhere)
Expand-Archive -Path "$env:USERPROFILE\Downloads\sage-vld-source.zip" -DestinationPath . -Force

# Initialize git
git init
git branch -M main

# Add all files
git add -A

# First commit
git commit -m "feat: Sage by VirtuaLab Digital — AI-Visibility-first SEO platform

- Marketing site (hero, features, pricing, comparison, FAQ, testimonials)
- 28-tool MCP server (JSON-RPC 2.0 + REST, auth + write-guards)
- Dashboard UI (10 views: overview, rankings, citations, content, audits, changes, brandbrain, analytics, billing, apikeys)
- Prisma schema (16 models: User, Site, Keyword, Ranking, ContentDraft, AuditRun, Citation, BrandBrain, Change, Competitor, Subscription, CreditLedger, Invoice, etc.)
- Content pipeline (De-AI humanizer + E-E-A-T/SEO/Gap scorers)
- Auth (NextAuth JWT + credentials provider)
- Billing (Stripe checkout/portal/webhook + credit ledger + BYOK pricing)
- Integrations (DataForSEO, OpenAI/Anthropic, Google GSC/GA4 — all with demo fallback)
- Cloudflare Pages + D1 deployment ready"

# Add your GitHub remote
git remote add origin https://github.com/AISEO-VirtualabDigital/Sage-VLD.git

# Push to GitHub
git push -u origin main

# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Install dependencies + set up database
# ═══════════════════════════════════════════════════════════════════════════

# Install Bun if you don't have it: https://bun.sh/
# Or use npm: npm install

bun install

# Copy env template
cp .env.example .env

# Edit .env — add your API keys (see SETUP_API_KEYS.md)
notepad .env

# Set up database
bun run db:push
bun run db:seed

# Start dev server
bun run dev

# → Open http://localhost:3000
# → Dashboard: http://localhost:3000/?view=app
# → Demo API key: sage_live_demo_key_0000000000000000
