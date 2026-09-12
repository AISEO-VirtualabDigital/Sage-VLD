# Sage — API Keys & Service Setup Guide

Complete checklist for every external service Sage integrates with. Set these up in order — each one unlocks a different capability.

---

## 1. Google Cloud Console (for GSC + GA4 data)

Sage uses Google APIs to pull Search Console performance data + GA4 analytics with per-URL attribution.

### Step 1: Create a Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click the project dropdown → **New Project**
3. Name it `sage-seo` → **Create**

### Step 2: Enable these APIs

| API | Console Link | What it does |
|---|---|---|
| **Google Search Console API** | https://console.cloud.google.com/apis/library/searchconsole.googleapis.com | Pull clicks, impressions, CTR, position per URL + query |
| **Google Analytics Data API** | https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com | Pull GA4 traffic + engagement metrics per page |
| **Google+ Domains API** (or People API) | https://console.cloud.google.com/apis/library/people.googleapis.com | Read user profile (name, email, avatar) during OAuth |

**To enable:** Click each link above → click **Enable**. Takes 30 seconds each.

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services → Credentials**
2. **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `Sage SEO`
5. **Authorized JavaScript origins:**
   - `http://localhost:3000` (dev)
   - `https://sage.virtualab.digital` (prod)
6. **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://sage.virtualab.digital/api/auth/callback/google`
7. **Create** → copy the **Client ID** + **Client Secret**

### Step 4: Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**
2. User type: **External** → **Create**
3. App name: `Sage by VirtuaLab Digital`
4. Support email: your email
5. Authorized domains: `virtualab.digital`
6. **Scopes to add:**
   - `https://www.googleapis.com/auth/webmasters.readonly` (Search Console)
   - `https://www.googleapis.com/auth/analytics.readonly` (GA4)
   - `openid`, `email`, `profile` (basic user info)
7. **Test users:** Add your email (keeps it in testing mode until you verify + publish)

### Step 5: Set environment variables
```bash
# Local .env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Production (Cloudflare)
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name=sage-seo
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=sage-seo
```

---

## 2. Bing Webmaster Tools API (for Bing rank tracking)

Bing's API is simpler than Google's — just an API key, no OAuth.

### Step 1: Get your API key
1. Go to https://www.bing.com/webmasters/home/api
2. Sign in with your Microsoft account
3. Copy your **API Key** (looks like a GUID: `abc123def-4567-...`)

### Step 2: Add your site to Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters/home
2. **Add a site** → enter your domain
3. Verify ownership (meta tag, DNS, or XML file)

### Step 3: Set environment variable
```bash
# Sage uses this for Bing rank tracking via DataForSEO's Bing endpoint
# The Bing Webmaster API key is optional — DataForSEO handles the actual SERP pulls.
# But if you want direct Bing Webmaster API access (for site verification + crawl stats):
BING_WEBMASTER_API_KEY=your-bing-api-key
```

**Note:** Sage's primary Bing data comes through DataForSEO's Bing SERP endpoint. The Bing Webmaster API key is only needed if you want to programmatically add/verify sites in Bing Webmaster Tools.

---

## 3. DataForSEO (for rank tracking + keyword data)

This is the data backbone — Sage uses DataForSEO for all Google + Bing SERP pulls, keyword volume, and competitor analysis.

### Step 1: Create a DataForSEO account
1. Go to https://dataforseo.com/
2. Sign up (free $1 credit on signup for testing)
3. Go to **Dashboard → API credentials**
4. Copy your **Login** (email) + **Password**

### Step 2: Set environment variables
```bash
# Local .env
DATAFORSEO_LOGIN=your@email.com
DATAFORSEO_PASSWORD=your-dataforseo-password

# Production (Cloudflare)
npx wrangler pages secret put DATAFORSEO_LOGIN --project-name=sage-seo
npx wrangler pages secret put DATAFORSEO_PASSWORD --project-name=sage-seo
```

### Step 3: Add credits
- DataForSEO works on prepaid credits. $100 buys ~25,000 SERP lookups.
- Sage passes this cost through to users at wholesale (no markup).
- For BYOK users, they bring their own DataForSEO key — you pay nothing.

---

## 4. OpenAI OR Anthropic (for AI content generation)

Pick ONE. Sage supports both — BYOK users can choose either.

### Option A: OpenAI (recommended, cheaper)
1. Go to https://platform.openai.com/api-keys
2. **Create new secret key** → copy it (starts with `sk-...`)
3. Add billing: https://platform.openai.com/account/billing (preload $20 for testing)
4. Set env var:
```bash
OPENAI_API_KEY=sk-...
# Production:
npx wrangler pages secret put OPENAI_API_KEY --project-name=sage-seo
```

### Option B: Anthropic (Claude — better for long-form content)
1. Go to https://console.anthropic.com/
2. **API Keys → Create Key** → copy it (starts with `sk-ant-...`)
3. Add billing: https://console.anthropic.com/settings/billing
4. Set env var:
```bash
ANTHROPIC_API_KEY=sk-ant-...
# Production:
npx wrangler pages secret put ANTHROPIC_API_KEY --project-name=sage-seo
```

**Cost reference:**
- GPT-4o: $2.50/1M input tokens, $10/1M output tokens
- Claude 3.5 Sonnet: $3/1M input, $15/1M output
- Average blog post (~2,500 words): ~$0.02–0.04 per generation

---

## 5. Stripe (for billing — subscription + credits)

### Step 1: Create a Stripe account
1. Go to https://dashboard.stripe.com/register
2. Complete account setup (use test mode first)

### Step 2: Get your API keys
1. Go to **Developers → API Keys**
2. Copy **Publishable key** (`pk_test_...`) + **Secret key** (`sk_test_...`)

### Step 3: Create products + prices
Go to **Products → Add product**:

| Product | Pricing | Description |
|---|---|---|
| **Sage Pro (Monthly)** | $49.00/month | Pro plan, monthly billing |
| **Sage Pro (Annual)** | $468.00/year ($39/mo equiv) | Pro plan, annual — 20% off |
| **Sage Agency (Monthly)** | $149.00/month | Agency plan, monthly |
| **Sage Agency (Annual)** | $1,428.00/year ($119/mo equiv) | Agency plan, annual — 20% off |

For each product, click **Pricing** → copy the **Price ID** (`price_...`).

### Step 4: Set environment variables
```bash
# Local .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # get this in step 5
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Production
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name=sage-seo
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name=sage-seo

# Price IDs (set as vars in wrangler.toml, not secrets)
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_AGENCY_MONTHLY=price_...
STRIPE_PRICE_AGENCY_ANNUAL=price_...
```

### Step 5: Configure webhook
1. Go to **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://sage.virtualab.digital/api/stripe/webhook`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
4. **Add endpoint** → copy the **Signing secret** (`whsec_...`)
5. Set it as `STRIPE_WEBHOOK_SECRET`

### Step 6: Test locally (optional)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local dev
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 6. NextAuth Secret (for session encryption)

Generate a random 32+ character string:

```bash
openssl rand -base64 32
# → set as NEXTAUTH_SECRET in .env + Cloudflare secret
```

---

## 7. Sage Encryption Key (for encrypting user BYOK keys at rest)

Generate a 32-byte hex key:

```bash
openssl rand -hex 32
# → set as SAGE_ENCRYPTION_KEY in .env + Cloudflare secret
```

---

## Quick Reference: All Environment Variables

```bash
# Database (local only — production uses D1 binding)
DATABASE_URL="file:./db/custom.db"

# Auth
NEXTAUTH_SECRET=                          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000        # https://sage.virtualab.digital in prod
SAGE_ENCRYPTION_KEY=                      # openssl rand -hex 32

# Google Cloud (GSC + GA4)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Bing Webmaster (optional)
BING_WEBMASTER_API_KEY=your-bing-api-key

# DataForSEO
DATAFORSEO_LOGIN=your@email.com
DATAFORSEO_PASSWORD=your-dataforseo-password

# LLM (pick one or both)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_AGENCY_MONTHLY=price_...
STRIPE_PRICE_AGENCY_ANNUAL=price_...

# App
APP_URL=http://localhost:3000
```

---

## Setup Order (Recommended)

1. ✅ **Google Cloud** — enable 3 APIs + create OAuth credentials
2. ✅ **DataForSEO** — sign up + get API login/password
3. ✅ **OpenAI** — create API key + add $20 billing
4. ✅ **Stripe** — create account + products + webhook
5. ✅ **NextAuth + Encryption** — generate random secrets
6. ✅ **Bing Webmaster** — get API key (optional)
7. ✅ **Deploy** — `bun run deploy:cf`

---

## Cost Summary (for initial trial)

| Service | Cost for trial |
|---|---|
| Google Cloud | $0 (free tier covers it) |
| DataForSEO | $1 free credit (~25K SERP lookups) |
| OpenAI | $20 preload (≈500 blog generations) |
| Stripe | $0 (test mode) |
| Cloudflare | $0 (free tier) |
| **Total trial cost** | **~$21** |
