# Sage SEO SaaS — Missing Tools Audit

**Audited:** 6 SEO repositories (AIOSEO, SerpApi awesome-seo-tools, SEO Machine, Rank Math PRO, Yoast, Open SEO)
**Purpose:** Identify every manual + automated SEO tool/feature offered by competitors so Sage can close feature gaps.
**Sage baseline:** 59 existing tools (28 AI/Agent + 31 Manual)
**Date:** Audit run against live READMEs, docs, pricing pages, WP.org readmes, and product websites.

---

## 0. Executive Summary

Sage currently covers **core on-page SEO, basic AI content generation, schema, redirects, sitemaps, and GSC/decay analytics** very well. However, after auditing all 6 repositories, the following **major feature gaps** are clear:

| Gap Category | Severity | Tools Missing (approx.) |
|---|---|---|
| **Keyword Research** (volume, difficulty, CPC, intent, clustering, trends) | 🔴 Critical | 12+ |
| **Backlinks** (profile, monitoring, outreach, disavow, anchor analysis) | 🔴 Critical | 10+ |
| **Competitor Analysis** (domain overview, content gaps, SERP competitors) | 🔴 Critical | 9+ |
| **Local SEO** (GBP audit, reviews, geo-grid, multi-location, citations) | 🟠 High | 10+ |
| **WooCommerce / eCommerce SEO** (product schema, GTIN, catalog sitemap) | 🟠 High | 8+ |
| **SERP Feature Tracking** (which features appear per keyword) | 🟠 High | 6+ |
| **Social / Open Graph** (previews, OG images, watermarks) | 🟠 High | 7+ |
| **Video / News / Image advanced SEO** | 🟠 High | 8+ |
| **Schema types** (Course, Event, JobPosting, Recipe, HowTo, etc.) | 🟠 High | 15+ |
| **Rank Tracking depth** (multi-device, multi-location, SoV, alerts) | 🟠 High | 8+ |
| **Reports / Email / White-label** | 🟠 High | 8+ |
| **CRO / Landing Page** | 🟡 Medium | 8+ |
| **Multilingual / Multi-region** | 🟡 Medium | 5+ |
| **Team / Role Manager / Client mgmt** | 🟡 Medium | 6+ |
| **Marketing skills** (email seq, pricing, ads, referral) | 🟡 Medium | 10+ |
| **AI Visibility / GEO depth** (sentiment, transcripts, country) | 🟡 Medium | 6+ |
| **Setup Wizard / Migration / CSV importers** | 🟡 Medium | 6+ |
| **Page Builder / CMS integrations** (Elementor, Divi, ACF, headless) | 🟡 Medium | 8+ |
| **Crawl / Index control** (crawl budget, index status per URL, .htaccess sync) | 🟡 Medium | 7+ |
| **Analytics depth** (GA4, AdSense, Clarity, per-post, position history) | 🟡 Medium | 8+ |
| **Content tools** (length comparison, TF-IDF, AI scrub, planner) | 🟡 Medium | 8+ |

**Estimated total missing tools: ~150+** (many overlap and some are bundled). Prioritized recommendations in §8.

---

## 1. AIOSEO — `awesomemotive/all-in-one-seo-pack`

**Source:** WP.org `readme.txt` (v5.0.1) + changelog. Repo README is build-only.

### 1.1 Complete Feature List (exhaustive)

**AI / GEO**
1. AI Content Generator — SEO titles, meta descriptions, FAQs, full articles
2. AI Assistant block — write/rewrite inside the editor
3. Bulk AI actions — titles, descriptions, alt text across many posts
4. AI Image Generator — on-brand images on demand
5. AI Schema Generator — structured data via smart analysis + custom prompts
6. AI Optimize post (one-click) — improves title, meta, headline, keyword checks, spelling
7. Actionable AI-powered TruSEO fixes — rewrite sentences/paragraphs for readability + SEO
8. AI Agents & MCP server + WordPress Abilities API (Claude, Cursor, Gemini)
9. Generative Engine Optimization (GEO) — `llms.txt` generator
10. AI Search Rank Tracking — ChatGPT, Google AI Overviews, Perplexity (AI Insights report)

**On-Page / Content**
11. TruSEO On-Page Analysis — real-time content + readability, unlimited focus keywords
12. TruSEO Highlighter — flags issues in Block & Classic Editor
13. Spell checker — in editor
14. Headline Analyzer — CTR + SEO scoring
15. SEO Setup Wizard — <5 min configuration
16. Site Audit & SEO Checklist — prioritized actionable fixes
17. Search Appearance settings (global)
18. Social Appearance settings (per-post)
19. RSS Content Control
20. SEO Analysis with competitor screenshot
21. SEO Revisions — full history + 1-click rollback + impact over time
22. Content Decay Tracking — declining pages detection
23. Canonical URLs — automatic + per-post
24. Table of Contents block (multi-block + accordion layouts)
25. Smart Breadcrumbs — JSON-LD
26. Author SEO (E-E-A-T) — author profiles, bio boxes, author schema
27. Unlimited Keywords (TruSEO)
28. AI Link Assistant — automatic internal link suggestions

**Schema**
29. Smart Schema Markup — FAQ, product, recipe, WooCommerce product, Organization, Person
30. Schema Templates (referenced in changelog)

**Sitemaps & Robots**
31. Smart XML Sitemap — Video sitemap, News sitemap, RSS sitemap, HTML sitemap
32. Sitemap controls — links per sitemap, post type/taxonomy toggles, include/exclude, add non-WP pages, priority & frequency
33. Robots.txt Editor + Robots Meta (noindex, nofollow, no archive, max snippet, max image-preview, max video-preview)
34. IndexNow — Bing & Yandex fast indexing

**Redirects & 404**
35. Redirection Manager — 301 rules, full-site redirects, 404 logging & auto-fix
36. Overlapping-redirect ordering

**Local & Image**
37. Local SEO module — business hours, multiple locations, contact details, Google Maps, Knowledge Panel
38. Automatic Image SEO — AI alt text, image titles, clean SEO filenames

**Integrations**
39. Google Search Console — keywords, clicks, rankings, index status
40. WooCommerce SEO — product pages + categories
41. Social Media & Open Graph — Facebook, Twitter, Pinterest previews + OG data + Knowledge Panel
42. Webmaster Tools verification — GSC, Bing, Yandex, Baidu, GA, Pinterest
43. Google AMP SEO
44. Semrush — keyword data pull
45. SEOBoost Writing Assistant — content briefs + competitor recommendations
46. Microsoft Clarity — heatmaps + session recordings
47. Page Builder SEO — Elementor, Bricks, Oxygen, Divi, Avada, WP Bakery, SeedProd, SiteOrigin
48. Gutenberg & Classic Editor support
49. ACF & Custom Fields — pull into analysis, smart tags, schema
50. WPML & Multilingual SEO — multilingual XML sitemap

**Migration / Import**
51. Importer — Yoast SEO, Yoast Premium, Rank Math, SEOPress
52. Redirect importer — Redirection, Simple 301, Safe Redirect Manager, 301 Redirects
53. Settings export/import + backup + CSV bulk-import pages to sitemap

**Performance**
54. Lazy-loaded menu pages/libraries, performance-optimized code

### 1.2 Features Sage is MISSING (vs. AIOSEO)

| Missing Feature | Suggested Sage Tool | Category |
|---|---|---|
| AI Image Generator | `ai.image.generate` | Content / AI |
| Bulk AI actions across posts (titles, meta, alt) | `bulk.ai.optimize` | Workflow / Content |
| One-click AI Optimize post (all-in-one fix) | `ai.post.optimize` | Content / AI |
| AI rewrite of sentences/paragraphs for SEO fixes | `ai.sentence.rewrite` | Content / AI |
| TruSEO editor highlighter (in-editor issue flags) | `editor.highlighter` | On-page / UX |
| Spell checker in editor | `editor.spellcheck` | Content / UX |
| SEO Analysis with competitor screenshot | `competitor.screenshot` | Competitor |
| SEO Revisions impact-over-time | (have changes.list — add `changes.impact`) | Analytics |
| News sitemap | `sitemap.news.generate` | Technical / News SEO |
| Video sitemap | `sitemap.video.generate` | Technical / Video SEO |
| RSS sitemap | `sitemap.rss.generate` | Technical |
| HTML sitemap | `sitemap.html.generate` | Technical |
| Sitemap granular controls (priority, frequency, include/exclude) | `sitemap.settings` | Technical |
| Robots meta per-page (noindex, nofollow, noarchive, max-snippet, max-image-preview, max-video-preview) | `robots.meta.set` | Technical / Crawl |
| Full-site redirect (domain move) | `redirect.fullsite` | Technical / Redirects |
| Overlapping-redirect ordering | `redirect.conflicts` | Technical / Redirects |
| Local multi-location + hours + Knowledge Panel | (have local.seo — extend with `local.locations`, `local.hours`, `local.knowledgepanel`) | Local |
| Microsoft Clarity heatmaps/sessions | `analytics.clarity` | Analytics |
| Google AMP SEO | `amp.seo` | Technical / Mobile |
| Baidu verification, Yandex, Pinterest verification | `webmaster.verify` (multi-engine) | Technical |
| Semrush keyword data pull | `keywords.semrush` | Keyword research |
| SEOBoost content briefs (have content.brief — competitor variant) | `content.brief.competitor` | Content |
| SEO Setup Wizard | `wizard.setup` | Workflow / Onboarding |
| Migration importer (Yoast/Rank Math/SEOPress) | `import.seo_plugin` | Workflow / Migration |
| Redirect importer (Redirection, Simple 301, Safe Redirect, 301 Redirects) | `import.redirects` | Workflow / Migration |
| ACF / custom fields into analysis + smart tags + schema | `acf.integrate` | Integrations |
| Page builder integrations (Elementor, Divi, Bricks, Oxygen, WPBakery, Avada, SeedProd, SiteOrigin) | `pagebuilder.*` | Integrations |
| Schema Templates (reusable) | `schema.templates` | Schema |
| WPML/multilingual XML sitemap | `sitemap.multilingual` | Multilingual |

---

## 2. SerpApi `awesome-seo-tools` — curated market tool list

**Source:** Repo README (337 lines). This is a curated list of ~80 market tools — features below are the **capabilities** those tools offer.

### 2.1 Complete Feature Inventory (by category)

**All-in-one platforms (Ahrefs, SEMrush, Seodity, Ubersuggest, Mangools, SERanking, Moz Pro, Serpstat, SEO PowerSuite, WebCEO, SpyFu, Zutrix, BrightEdge, CognitiveSEO, Keyword Insights, Clicks.so, SEO Utils, Spexia, DiagnoSEO, Telescope, DAXRM, SEO Toolbox, Bishopi.io, Fast SEO Fix, SearchAtlas MCP)**
- Keyword research + backlink analysis + rank tracking + technical SEO + local SEO + PPC + competitor research + reporting + lead generation + content optimization + AI brand visibility monitoring + SERP feature tracking + multi-location/device rank tracking + agency CRM

**Keyword Research**
- Google Keyword Planner (ideas + traffic estimates)
- Keyword Tool (Google Autocomplete mining)
- KeySearch LSI Keyword generator
- WordStream (keyword discovery + prioritization)
- Ahrefs Keywords Generator
- Semrush Keyword Magic Tool (millions of suggestions)
- Seoformulas (untapped keywords + SEO formulas)
- Serp Miner (long-tail via autocomplete, bulk search volume)
- kwrds.ai (keywords + questions people ask)
- AnswerThePublic (search questions + autocomplete visualization)
- Keywordideas.xyz (suggestions based on URL/keyword)

**Backlink Analysis**
- Majestic (who links to you)
- Monitor Backlinks (good/bad backlinks for you + competition)
- Respona (all-in-one link building)
- BacklinkGPT (AI link building, prospect finding, personalized outreach)
- YouLinker (directory submission)
- BacklinkScan (backlink checker)

**Content Optimization**
- Clearscope, SurferSEO, NeuronWriter, ContentSwift, MarketMuse, Frase, GrowthBar, LSIGraph, Yoast, SearchSocket, BlogBud AI, GrackerAI, TailorTask, SearchAttention (AI search optimization), Koala AI (entity schema), AltTextLab (alt text AI), SERPrecon (semantic search, AI SOV tracking), Hypertxt, TuxSEO

**Rank Tracking**
- SerpBear (open source), SERPWatcher, AccuRanker, Nightwatch, DAXRM (multi-location + multi-device), That's Rank!

**GEO / AI Visibility**
- GEO/AEO Tracker (open source, brand mentions across AI, visibility scoring, citation analysis, competitor battlecards)
- LLM Optimizer (composite AI Visibility Scores, per-dimension analysis: YouTube, Reddit, search, LLM testing, MCP-native)

**Technical SEO**
- Google Search Console, Bing Webmaster Tools, Yandex Webmaster
- Screaming Frog SEO Spider (crawler + audits)
- SiteAnalyzer, Screpy, Sitebulb
- Moz On-Page Grader
- BROWSEO (search-engine view)
- linkok.com, Wizardstool (broken link checkers)
- PressProxy (blog subdomain on root domain via Cloudflare Workers)
- SEOnaut (open source technical audit)
- Siteliner (duplicate content + broken links)
- Black SEO Analyzer (CLI, AI-answer ready)
- Python SEO Analyzer (crawl, word count)
- IncRev JavaScript Crawler (JS rendering)
- SSR Checker (server-side rendering comparison)
- PreRender24 (edge prerendering for SPAs)
- LibreCrawl (open source SEO crawler + JS rendering)
- SEO Score API (28 checks, 0-100 score, prioritized fixes)
- EdgeComet (JS rendering engine for bots)
- geo-lint (GEO linter, 92 rules, citation density, answer-ready formatting)

**Local SEO**
- BrightLocal (monitor, audit, improve)
- Whitespark
- LocalFalcon (local rank tracker)
- Grid My Business (local visibility)
- Moz Local (reputation management)

**SEO Analytics**
- Google Search Console
- SEO Gets (privacy-focused GSC alternative)

**SEO Browser Extensions**
- SEO Minion (on-page analysis, broken link check, SERP preview)
- SEOquake, Woorank, Keyword Surfer, MozBar
- Ahrefs SEO Toolbar (on-page report, broken link checker, redirect tracer, country changer)
- Redirect Path (HTTP header + redirect checker)
- META SEO inspector
- Similarweb (traffic rank)
- MST SERP Counter
- TextOptimizer (intent tables)
- SEO Search Simulator (emulate Google from any location)
- BuzzSumo (content research, link analysis, social)
- Google Lighthouse (PageSpeed, accessibility, SEO)
- Checkbot (50+ SEO/speed/security checks)
- SEO Sidebar (real-time on-page data, export)

**Validator / Checker**
- Broken Link Checker
- Robots.txt Checker
- Lighthouse Rich Result Checker
- XML Sitemap Checker

**Social / Open Graph**
- ShotOG (OG image generation API, ~50ms)
- ogimg.xyz (OG image API, 10 templates, branding, URL auto-fetch)

**Miscellaneous**
- GTmetrix (site speed)
- Pingdom (load time)
- DebugBear (page speed + CrUX data)

### 2.2 Features Sage is MISSING (vs. market tools in awesome-seo-tools)

| Missing Feature | Suggested Sage Tool | Category |
|---|---|---|
| Keyword volume / search volume lookup | `keywords.volume` | Keyword research |
| Keyword difficulty score | `keywords.difficulty` | Keyword research |
| Keyword CPC / paid metrics | `keywords.cpc` | Keyword research |
| Keyword ideas from Google Autocomplete | `keywords.autocomplete` | Keyword research |
| Long-tail keyword discovery | `keywords.longtail` | Keyword research |
| Question mining ("People Also Ask") | `keywords.questions` / `paa.mine` | Keyword research / Content |
| LSI / semantically related keyword generator | `keywords.lsi` | Keyword research / Content |
| Keyword trends (Google Trends) | `keywords.trends` | Keyword research |
| Keyword clustering by intent (TF-IDF/K-means) | `keywords.cluster` | Keyword research |
| Keyword intent classification | `keywords.intent` | Keyword research |
| Keyword gap analysis (vs competitor) | `keywords.gap` | Competitor / Keyword research |
| Backlink profile / referring domains overview | `backlinks.profile` | Backlink |
| Backlink monitoring (new/lost) | `backlinks.monitor` | Backlink |
| Backlink quality / authority scoring | `backlinks.authority` | Backlink |
| Competitor backlink analysis | `backlinks.competitor` | Backlink / Competitor |
| Link prospecting (outreach targets) | `backlinks.prospect` | Backlink / Outreach |
| Link building outreach (personalized emails) | `backlinks.outreach` | Backlink / Outreach |
| Disavow file generation | `backlinks.disavow` | Backlink |
| Broken link building | `backlinks.broken_build` | Backlink |
| Anchor text analysis | `backlinks.anchor` | Backlink |
| Site-wide broken link checker (crawler) | `crawler.brokenlinks` | Technical |
| Duplicate content detection (Siteliner-style) | `content.duplicate` | Technical / Content |
| JavaScript rendering check / SSR check | `technical.jsrender` | Technical |
| Pre-rendering for SPAs | `technical.prerender` | Technical |
| Rich Results / schema validator | `schema.validate` (Rich Results Test) | Schema / Validator |
| XML sitemap validator | `sitemap.validate` | Validator |
| Redirect tracer / HTTP header checker | `redirect.trace` | Validator / Technical |
| OG image generation API | `og.image.generate` | Social / Open Graph |
| On-page SEO report (extension-style) | `onpage.report` | On-page |
| Page speed / Core Web Vitals (CrUX data) | (have pagespeed.check — extend with `pagespeed.crux`) | Performance |
| Country changer for SERP view | `serp.geo` | SERP / Rank tracking |
| Content research + link analysis + social (BuzzSumo-style) | `content.research` | Content / Competitor |
| Local rank grid (Maps rank at each point) | `local.geogrid` | Local |
| Local citation building/monitoring (BrightLocal/Whitespark) | `local.citations` | Local |
| Review monitoring/management (Moz Local) | `local.reviews` | Local |
| GEO linter (geo-lint, 92 rules) | `geo.lint` | GEO / AI Visibility |
| Composite AI Visibility Score (per-dimension) | `aivisibility.score` | GEO / AI Visibility |
| Privacy-focused analytics (SEO Gets) | `analytics.privacy` | Analytics |
| 28-check SEO score with prioritized fixes (SEO Score API) | `audit.scorecard` | Technical / Audit |

---

## 3. SEO Machine — `TheCraigHewitt/seomachine`

**Source:** README (1039 lines) — Claude Code workspace for long-form SEO content.

### 3.1 Complete Feature List

**Custom Commands (20)**
1. `/research [topic]` — keyword + competitive research, content brief, internal linking strategy
2. `/write [topic]` — 2000-3000+ word article, H1/H2/H3 structure, internal/external links, meta elements, SEO checklist
3. `/rewrite [topic]` — update existing content, change summary, before/after comparison
4. `/analyze-existing [URL/file]` — content health score (0-100), quick wins, strategic improvements, rewrite priority
5. `/optimize [file]` — comprehensive SEO audit, publishing readiness score, optimization report
6. `/publish-draft [file]` — publish to WordPress via REST API with Yoast metadata
7. `/article [topic]` — simplified article creation
8. `/priorities` — content prioritization matrix from analytics
9. `/scrub [file]` — remove AI watermarks (em-dashes, filler, robotic patterns)
10. `/research-serp [keyword]` — SERP analysis
11. `/research-gaps` — competitor content gap analysis
12. `/research-trending` — trending topic opportunities
13. `/research-performance` — performance-based content priorities
14. `/research-topics` — topic cluster research
15. `/landing-write [topic]` — conversion-optimized landing page
16. `/landing-audit [file]` — CRO audit
17. `/landing-research [topic]` — competitor research for landing pages
18. `/landing-competitor [URL]` — deep competitor landing page analysis
19. `/landing-publish [file]` — publish landing page to WordPress

**Specialized Agents (10)**
20. Content Analyzer (5 modules: search intent, keyword density/clustering, content length comparison, readability, SEO quality rating 0-100; keyword stuffing risk, passive voice ratio, distribution heatmap)
21. SEO Optimizer (keyword density, structure, links, meta, readability, featured snippet opportunities)
22. Meta Creator (5 titles + 5 descriptions, SERP preview, conversion copy)
23. Internal Linker (3-5 specific suggestions, exact placement, anchor text, user journey mapping)
24. Keyword Mapper (density, distribution, placement checklist, LSI coverage, cannibalization risk)
25. Editor (humanity score 0-100, voice, specificity, robotic patterns, storytelling)
26. Performance (GA4 + GSC + DataForSEO; quick wins position 11-20, declining content, low CTR, trending)
27. Headline Generator (10+ variations, conversion scoring, A/B testing strategies)
28. CRO Analyst (above-the-fold, CTA quality, trust signals, friction points)
29. Landing Page Optimizer (CRO score 0-100, A/B testing recs, priority action list)

**Marketing Skills (26)**
30. Copywriting: `/copywriting`, `/copy-editing`
31. CRO: `/page-cro`, `/form-cro`, `/signup-flow-cro`, `/onboarding-cro`, `/popup-cro`, `/paywall-upgrade-cro`
32. Strategy: `/content-strategy`, `/pricing-strategy`, `/launch-strategy`, `/marketing-ideas`
33. Channels: `/email-sequence`, `/social-content`, `/paid-ads`
34. SEO: `/seo-audit`, `/schema-markup`, `/programmatic-seo`, `/competitor-alternatives`
35. Analytics: `/analytics-tracking`, `/ab-test-setup`
36. Other: `/referral-program`, `/free-tool-strategy`, `/marketing-psychology`

**Python Analysis Modules (23)**
37. `search_intent_analyzer.py` — informational/navigational/transactional/commercial classification + SERP features
38. `keyword_analyzer.py` — density, stuffing risk, TF-IDF + K-means clustering, distribution heatmap, LSI
39. `seo_quality_rater.py` — 0-100 score, category breakdowns (content/keywords/meta/structure/links/readability)
40. `content_length_comparator.py` — top 10-20 SERP competitor word counts, median, 75th percentile, gap to target
41. `readability_scorer.py` — Flesch Reading Ease, Flesch-Kincaid Grade, passive voice ratio, complex words, transition words
42. `above_fold_analyzer.py`, `cta_analyzer.py`, `trust_signal_analyzer.py`, `landing_page_scorer.py`, `landing_performance.py`, `cro_checker.py`
43. `opportunity_scorer.py` — 8-factor opportunity scoring
44. `content_scorer.py` — 5-dimension (humanity, specificity, structure, SEO, readability)
45. `engagement_analyzer.py`, `competitor_gap_analyzer.py`, `article_planner.py`, `section_writer.py`, `social_research_aggregator.py`, `wordpress_publisher.py`

**Research Scripts (10)**
46. `research_quick_wins.py` (position 11-20)
47. `research_competitor_gaps.py`
48. `research_performance_matrix.py`
49. `research_priorities_comprehensive.py`
50. `research_serp_analysis.py`
51. `research_topic_clusters.py`
52. `research_trending.py`
53. `seo_baseline_analysis.py`, `seo_bofu_rankings.py`, `seo_competitor_analysis.py`

**Data Sources**
54. Google Analytics 4 (traffic, engagement, conversions, trends, sources)
55. Google Search Console (rankings, impressions, clicks, CTR, queries)
56. DataForSEO (competitive rankings, SERP features, keyword metrics, competitor gap)

**Context Files**
57. brand-voice, writing-examples, style-guide, seo-guidelines, target-keywords, internal-links-map, competitor-analysis, features, cro-best-practices

### 3.2 Features Sage is MISSING (vs. SEO Machine)

| Missing Feature | Suggested Sage Tool | Category |
|---|---|---|
| Content rewrite/update workflow (have generate, not rewrite) | `content.rewrite` | Content |
| AI watermark scrubbing (em-dashes, filler, robotic patterns) | `content.scrub` (vs. existing content.humanize — distinct: pattern-stripping) | Content / AI |
| Content health score (0-100) | `content.health` | Content / Audit |
| Search intent classification (info/nav/transactional/commercial) | `keywords.intent` / `content.intent` | Keyword / Content |
| Keyword clustering (TF-IDF + K-means) | `keywords.cluster` | Keyword research |
| LSI keyword generation | `keywords.lsi` | Keyword / Content |
| Keyword stuffing risk detection | `content.stuffing` | Content |
| Distribution heatmap by section | `content.distribution` | Content |
| Content length comparison vs top 10-20 SERP competitors (median, 75th percentile, gap) | `content.length.compare` | Content / Competitor |
| Passive voice ratio + sentence complexity | (extend readability.analyze) | Content |
| Transition word usage analysis | (extend readability.analyze) | Content |
| SEO quality rating 0-100 with category breakdowns | (extend content.score) | Content / Audit |
| Headline generator (10+ variations + A/B testing) | (extend headline.analyze → `headline.generate`) | Content |
| CRO Analyst (above-the-fold, CTA, trust, friction) | `cro.analyze` | CRO / Landing |
| Landing page optimizer (CRO score 0-100) | `landing.optimize` | CRO / Landing |
| Above-fold analyzer | `cro.abovefold` | CRO |
| CTA analyzer (quality, distribution, goal alignment) | `cro.cta` | CRO |
| Trust signal analyzer (testimonials, social proof, risk reversals) | `cro.trust` | CRO |
| A/B test setup | `cro.abtest` | CRO / Analytics |
| Opportunity scorer (8-factor) | `content.opportunity` | Content / Analytics |
| Engagement analyzer | `content.engagement` | Content / Analytics |
| Content gap analyzer (competitor) | `content.gap` | Competitor / Content |
| Article planner (data-driven) | `content.planner` | Content / Workflow |
| Section writer (section-level guidance) | `content.section` | Content |
| Quick wins detection (position 11-20) | `analytics.quickwins` | Analytics |
| Trending topic research | `research.trending` | Content / Keyword |
| Topic cluster research | `research.topics` | Content / Keyword |
| Programmatic SEO | `seo.programmatic` | Technical / Content |
| Marketing skills: copywriting, copy-editing | `copy.write`, `copy.edit` | Marketing |
| Marketing: page-cro, form-cro, signup-flow-cro, onboarding-cro, popup-cro, paywall-upgrade-cro | `cro.page`, `cro.form`, `cro.signup`, `cro.onboarding`, `cro.popup`, `cro.paywall` | CRO / Marketing |
| Marketing: content-strategy, pricing-strategy, launch-strategy, marketing-ideas | `strategy.content`, `strategy.pricing`, `strategy.launch`, `strategy.ideas` | Marketing / Strategy |
| Marketing: email-sequence, social-content, paid-ads | `gen.email`, `gen.social`, `gen.ads` | Marketing / Channels |
| Marketing: referral-program, free-tool-strategy, marketing-psychology | `gen.referral`, `strategy.freetool`, `strategy.psychology` | Marketing |
| Competitor alternatives generator | `competitor.alternatives` | Competitor / Content |
| WordPress REST API publishing | `cms.wordpress.publish` | Integrations |
| 5-dimension content quality scoring (humanity, specificity, structure, SEO, readability) | `content.quality.5d` | Content |

---

## 4. Rank Math — `wordpress-premium/rank-math-seo-pro` + free

**Source:** PRO repo README + WP.org free readme.txt + rankmath.com free-vs-pro page.

### 4.1 Complete Feature List (Free + PRO)

**AI / GEO**
1. AI Visibility — score, ChatGPT mentions, sentiment, competitor comparison, transcripts, country-level
2. AI Link Genius — AI internal link suggestions, auto-link keyword variations, link audits + health monitor, bulk link update
3. Content AI — 40+ AI tools for SEO, AI image alt text, RankBot SEO help, role manager control
4. AI Search Traffic Tracker

**Setup / Migration**
5. Setup Wizard (intuitive, auto-configures)
6. Custom Setup Wizard Mode (PRO)
7. 1-Click Import from Yoast, AIO SEO, SEOPress, All In One Schema, Redirection plugin
8. Complete Import/Export Options (PRO)

**On-Page / Content**
9. 30+ SEO tests with 1-click
10. Detailed content analysis with actionable recommendations
11. LSI keyword suggestions
12. Unlimited focus keywords (5 default, filter for unlimited)
13. Module-based system (enable only what you need)
14. Advanced Post Filtering (PRO)
15. Advanced Bulk Edit Options (PRO)
16. Advanced Quick Edit Options (PRO)
17. Import/Export Focus Keywords (PRO)
18. Import SEO Data via CSV (PRO)
19. Bulk Import SEO Meta via CSV (PRO)
20. SEO Performance Email Reports
21. White Labelled Email Reports
22. Advanced Content SEO Overview
23. Check Ranking Keywords for Each Post
24. Single Post Performance Badges
25. Track SEO Performance of Individual Posts
26. SEO workouts (orphaned + cornerstone) [via Premium-style updates]

**Schema (massive)**
27. 16+ Schema types free / 20+ PRO / 840+ supported
28. 6 Extra Schema Types (PRO)
29. Advanced Schema Builder
30. Schema Templates for automation
31. Conditional Schema Markup
32. Multiple Location Schema (shortcode)
33. Custom Schema Builder (JSON+LD/HTML)
34. Validate Schema With Google
35. Add Unlimited Multiple Schemas
36. Automate Schema Implementation
37. Dataset Schema, Fact Check Schema, Podcast Schema, Carousel Schema, Mentions & About Schema
38. Automatic Q&A Schema for bbPress
39. Advanced HowTo Schema
40. Speakable Schema
41. Import Schema From Any Website

**Sitemaps & Robots**
42. XML Sitemap with custom post type support
43. Google News SEO Sitemap
44. Google Video SEO Sitemap
45. Noindex Paginated/Archive/Search pages
46. Noindex Password Protected Pages
47. Sync Redirections to .htaccess
48. Export 404 Log

**Redirects / 404**
49. Smart Redirection Manager (create at scale)
50. Advanced Redirections Module (PRO)
51. Built-in 404 monitor
52. Import Redirections Data via CSV (PRO)

**Linking**
53. Internal link suggestions (free)
54. AI Link Genius bulk link update (PRO)
55. Auto-Link Keyword Variations
56. Automatic Link Audits & Monitor Link Health
57. Mark Cloaked Links as External Links
58. Open External Links in New Tabs
59. Nofollow External Links
60. Detect Orphan Pages (PRO)

**Image SEO**
61. Automatic ALT Text + Title tags for images
62. Automated Image SEO (PRO)
63. Advanced Filtering for Images (PRO)
64. Watermark Images (PRO)
65. Watermarked Social Media Images
66. Find & Replace Image alt/title/caption Text (PRO)
67. Automate Image Captions (PRO)
68. Auto Flush Facebook Thumbnails
69. Image SEO PRO

**Video SEO**
70. Auto Detect Videos + Generate Schema
71. Auto Fetch YouTube/Vimeo thumbnail + duration
72. Automatic Video Data Fill for Video Schema
73. Google Video SEO Sitemap (PRO)
74. Podcast Module (PRO)

**WooCommerce / eCommerce**
75. WooCommerce SEO (auto schema + meta)
76. WooCommerce SEO PRO:
    - Automatic Schema for products
    - Advanced Open Graph for products
    - Automatic NoIndex hidden products
    - Remove product/category base
    - Custom Brands
    - GTIN/MPN (even variations)
77. Complete EDD (Easy Digital Downloads) SEO
78. bbPress & BuddyPress SEO (Q&A Schema)

**Local SEO**
79. Local SEO tools
80. Local SEO PRO with Multi Locations
81. Advanced Local SEO Blocks
82. Multiple Location Schema via shortcode

**Analytics / Rank Tracking**
83. Advanced Google Analytics 4 Integration
84. Google Search Console integration
85. Keyword Rank Tracker (500-50,000 keywords)
86. Track Google Index Status
87. Position History for Keywords & Posts
88. Track Top 5 Winning Keywords
89. Track Top 5 Losing Keywords
90. Track Top 5 Winning Posts
91. Track Top 5 Losing Posts
92. Track PageSpeed per Post & Page
93. Google AdSense Earning History
94. Import GSC & GA Data from defined Country
95. Google Trends Integration
96. Google Data Fetch Frequency (daily)
97. Days to Preserve Google Data (90-∞)
98. Email Report Frequency (7/15/30 days)
99. Client Management
100. Client Sites Support Per Account

**Integrations / Compatibility**
101. Elementor SEO + dedicated Breadcrumbs Widget + Accordion-to-FAQ Schema widget
102. Divi SEO + Accordion-to-FAQ Schema widget
103. Oxygen, WPBakery, Avada, Beaver Builder, Page Builder Framework
104. WPML, Weglot, TranslatePress, Polylang
105. Theme support (Astra, Kadence, Flothemes, OceanWP, Themify, Schema Theme)
106. WordPress Multisite support
107. Google AMP SEO
108. Instant Indexing (Bing & Yandex; Google via plugin)
109. Google Analytics, AdSense, Search Console integration

**Roles / Team**
110. Role Manager (control team access)

**Online Tools (free)**
111. Meta Tag Analyzer
112. SEO Analyzer
113. Robots.txt Tester
114. MCP Tools

### 4.2 Features Sage is MISSING (vs. Rank Math)

| Missing Feature | Suggested Sage Tool | Category |
|---|---|---|
| 30+ SEO tests with 1-click | `seo.tests.run` | On-page / Audit |
| Custom Setup Wizard Mode | `wizard.custom` | Workflow |
| Advanced post filtering | `posts.filter` | Workflow |
| Advanced bulk edit (index/noindex/redirect) | `bulk.posts.edit` | Workflow |
| Advanced quick edit SEO details | `quickedit.seo` | Workflow |
| Import/export focus keywords | `keywords.import` | Workflow / Migration |
| CSV SEO meta import (have bulk.meta.import — confirm CSV) | (extend existing) | Migration |
| CSV redirects import | `redirects.import.csv` | Migration / Redirects |
| SEO Performance Email Reports | `reports.email` | Reporting |
| White-labelled email reports | `reports.whitelabel` | Reporting / White-label |
| Advanced Content SEO Overview | `overview.content` | Analytics / Dashboard |
| Ranking keywords per post | `posts.ranking_keywords` | Analytics |
| Single Post Performance Badges | `posts.badges` | Analytics / UX |
| Per-post SEO performance | `analytics.perpost` | Analytics |
| 840+ schema types / 20+ pre-defined | `schema.types.*` (Course, Event, JobPosting, Movie, Music, Recipe, Restaurant, Review, Service, SoftwareApplication, Book, Dataset, Fact Check, Podcast, Carousel, Mentions/About, HowTo, Q&A, Speakable) | Schema |
| Schema Templates | `schema.templates` | Schema |
| Conditional Schema Markup | `schema.conditional` | Schema |
| Multiple Schemas per page | `schema.multiple` | Schema |
| Custom Schema Builder (JSON-LD/HTML) | `schema.custom` | Schema |
| Schema validation with Google | `schema.validate` | Schema / Validator |
| Automate Schema Implementation | `schema.automate` | Schema |
| Import schema from other websites | `schema.import` | Schema / Migration |
| Schema for bbPress Q&A | `schema.qa` | Schema |
| Noindex paginated/archive/search pages | `robots.noindex.archives` | Technical / Crawl |
| Noindex password-protected pages | `robots.noindex.password` | Technical |
| Sync redirects to .htaccess | `redirects.htaccess` | Technical / Redirects |
| Export 404 log | `monitor.404.export` | Technical / Redirects |
| Auto-link keyword variations | `links.autolink` | On-page / Internal |
| Link audits + monitor link health | `links.health` | On-page / Internal |
| Mark cloaked links as external | `links.cloaked` | On-page |
| Open external links in new tabs / nofollow external | `links.external` | On-page |
| Detect orphan pages | `pages.orphan` | On-page / Content |
| Watermark images | `image.watermark` | Image SEO |
| Find & replace image alt/title/caption | `image.findreplace` | Image SEO |
| Automate image captions | `image.captions` | Image SEO |
| Auto-flush Facebook thumbnails | `social.fb.flush` | Social |
| Auto-detect videos + schema | `video.autodetect` | Video SEO |
| Auto-fetch YouTube/Vimeo thumbnail + duration | `video.metadata` | Video SEO |
| Automatic video data fill | `video.autofill` | Video SEO |
| Google Video SEO Sitemap | `sitemap.video` | Video / Technical |
| Google News SEO Sitemap | `sitemap.news` | News / Technical |
| Podcast Module + Schema | `podcast.seo` | Podcast / Schema |
| WooCommerce SEO PRO (all sub-features) | `woo.seo.*` (auto schema, OG, noindex hidden, remove base, brands, GTIN/MPN) | eCommerce |
| EDD SEO | `edd.seo` | eCommerce |
| bbPress/BuddyPress Q&A schema | `forum.seo` | Schema / Integrations |
| Local SEO Pro multi-location | `local.multi` | Local |
| Advanced Local SEO Blocks | `local.blocks` | Local |
| Multiple Location Schema | `local.schema.multi` | Local / Schema |
| GA4 integration | `analytics.ga4` | Analytics |
| Keyword Rank Tracker (high volume) | (extend rankings — `rankings.bulk`) | Rank tracking |
| Google Index Status tracking | `index.status` | Technical / Indexing |
| Position history (keywords + posts) | `rankings.history` / `posts.history` | Analytics / Rank tracking |
| Top winning/losing keywords | `rankings.winning` / `rankings.losing` | Analytics |
| Top winning/losing posts | `posts.winning` / `posts.losing` | Analytics |
| PageSpeed per post & page | `pagespeed.perpost` | Performance |
| Google AdSense earning history | `analytics.adsense` | Analytics |
| GSC/GA data from specific country | `analytics.country` | Analytics / Geo |
| Google Trends integration | `keywords.trends` | Keyword research |
| Email report frequency (7/15/30 days) | `reports.schedule` | Reporting |
| Client Management | `clients.manage` | Workflow / Agency |
| Client Sites per account | `clients.sites` | Workflow / Agency |
| Role Manager | `roles.manage` | Team / Permissions |
| Elementor/Divi/Oxygen/WPBakery/Avada/Beaver Builder integration | `pagebuilder.*` | Integrations |
| WPML/Weglot/TranslatePress/Polylang | `i18n.integrate` | Multilingual |
| WordPress Multisite | `multisite.support` | Integrations |
| Google AMP SEO | `amp.seo` | Mobile / Technical |
| Instant Indexing (Bing, Yandex, Google) | `indexnow.submit` (have — extend to `instantindex.*`) | Indexing |
| Meta Tag Analyzer (online tool) | `meta.analyzer` | On-page / Validator |
| SEO Analyzer (online tool) | `site.analyzer` | Audit / Validator |
| Robots.txt Tester (online tool) | `robots.txt.test` | Validator |

---

## 5. Yoast — `Yoast/wordpress-seo`

**Source:** WP.org readme.txt (v28.4) + repo README. Includes Local/Video/News addons via Premium.

### 5.1 Complete Feature List

**Schema / AI Discovery**
1. Schema.org structured data (deep integration)
2. More schema types in Premium (E-E-A-T signals: experience, expertise, authoritativeness, trustworthiness)
3. Schema aggregation for NLWeb (Premium) — single deduplicated graph for AI agents
4. LLMs.txt management (manual control over included pages)
5. Bot blocker (Premium) — GPTBot, CCBot, Google-Extended
6. Abilities API — AI tools read SEO/readability/inclusive-language scores

**AI Tools (Premium)**
7. Yoast AI Generate — 5 titles + 5 meta descriptions, one-click regeneration
8. Yoast AI Optimize — keyphrase placement, intro, distribution, density
9. Yoast AI Summarize — post summary
10. Yoast AI Content Planner — 5 site-specific post ideas + structured draft
11. Bulk editor with AI drafts — incl. social sharing titles/descriptions

**Content Analysis**
12. SEO analysis (up to 5 keyphrases Premium, 20+ languages)
13. Readability analysis
14. Inclusive language analysis
15. SERP previews (desktop & mobile)
16. HowTo and FAQ blocks (with schema)
17. Breadcrumbs block
18. Semrush integration (keyword research in editor)
19. Wincher integration (rank tracking)
20. Cornerstone content tools
21. Front-end SEO inspector (live edit titles/descriptions/schema)
22. SEO workouts (orphaned + cornerstone content)
23. Task list (priority levels + time estimates)

**Technical SEO**
24. Automated meta tag optimization
25. Canonical URLs
26. Advanced XML sitemaps
27. Complete breadcrumb control
28. Performance improvements (load time reduction)
29. Crawl settings (manage bot access, reduce server load)
30. IndexNow integration (Premium)

**AI / GEO**
31. AI search readiness (schema + NLWeb + LLMs.txt + bot blocker)

**Premium Redirects**
32. Redirect manager (bulk tools, CSV import/export, automatic prompts on move/delete)

**Internal Linking**
33. Smart internal linking suggestions (Premium)

**Social**
34. Social previews (Facebook and X) (Premium)
35. Jetpack social previews integration

**Integrations**
36. Google Site Kit (Search Console, Analytics, PageSpeed)
37. Advanced Custom Fields (ACF) Content Analysis
38. Elementor integration
39. Algolia (internal search)
40. Semrush (keywords)
41. Wincher (rank tracking)
42. Jetpack (SEO + social)
43. Easy Digital Downloads (schema)
44. Mastodon verification (Premium)
45. WooCommerce (via extension)

**Setup / Migration**
46. Step-by-step configuration wizard
47. Built-in import/export tools (migration)

**Roles / Team**
48. SEO roles (delegate plugin access)

**Developer APIs**
49. REST API (meta tags, OG, Twitter Cards, Schema.org)
50. Surfaces API (`YoastSEO()->meta->for_current_page()`)
51. Metadata API (`wpseo_title`, `wpseo_metadesc`, `wpseo_canonical`)
52. Schema API (Article, Organization, Person, Breadcrumb, WebPage)
53. Abilities API integration
54. Block editor schema (HowTo, FAQ, custom blocks)
55. Indexables system (unified SEO data)

**Premium Included Addons**
56. Yoast Local SEO — local schema, store locator, opening hours management
57. Yoast Video SEO — video sitemaps + schema
58. Yoast News SEO — Google News + Top Stories

**Yoast WooCommerce SEO (separate)**
59. WooCommerce-specific XML sitemap (excludes non-shopping)
60. Product structured data (price, reviews, availability)
61. Canonical URL management (prevent duplicates)
62. Ecommerce-focused content analysis (GTINs, SKUs, short descriptions)
63. AI Generate for ecommerce (titles + meta, page-level or bulk)

**Other**
64. Yoast SEO Academy (free + premium courses)
65. Google Docs add-on (run Yoast analysis before WordPress)
66. 2-week update cycle
67. Bulk editor (free) — titles, meta descriptions, focus keyphrases across site

### 5.2 Features Sage is MISSING (vs. Yoast)

| Missing Feature | Suggested Sage Tool | Category |
|---|---|---|
| AI Generate 5 title + 5 meta variations, one-click regen | (extend generate.* → `meta.generate.variations`) | Content / AI |
| AI Optimize keyphrase placement (intro, distribution, density) | `ai.keyphrase.optimize` | Content / AI |
| AI Summarize post | `content.summarize` | Content / AI |
| AI Content Planner (5 post ideas + structured draft) | `content.planner` | Content / Workflow |
| Bulk editor with AI drafts (incl. social titles/descriptions) | `bulk.editor.ai` | Workflow / Content |
| Inclusive language analysis | `content.inclusive` | Content |
| Up to 5 focus keyphrases per post | (extend keywords.add → multi-keyphrase) | On-page |
| 20+ languages support | `i18n.languages` | Multilingual |
| HowTo block + schema | `schema.howto` + block | Schema |
| FAQ block + schema | `schema.faq` + block | Schema |
| Breadcrumbs block | `breadcrumbs.block` | Schema / UX |
| Cornerstone content tools | `content.cornerstone` | Content / Workflow |
| Front-end SEO inspector (live edit) | `inspector.frontend` | On-page / UX |
| SEO workouts (orphaned + cornerstone) | `workout.orphaned`, `workout.cornerstone` | Workflow |
| Task list with priority + time estimates | `tasks.list` | Workflow |
| Crawl settings (manage bot access, reduce server load) | `crawl.settings` | Technical / Crawl |
| Redirect manager bulk tools + CSV | (extend redirect.* → `redirect.bulk`) | Redirects |
| Automatic redirect prompts on move/delete | `redirect.autoprompt` | Redirects / Workflow |
| Smart internal linking suggestions | (have links.internal — extend `links.suggest`) | On-page |
| Social previews (Facebook + X) | `social.preview.fb`, `social.preview.x` | Social |
| Google Site Kit integration | `integration.sitekit` | Integrations |
| ACF Content Analysis | `acf.analysis` | Integrations |
| Algolia internal search | `integration.algolia` | Integrations |
| Wincher rank tracking | `integration.wincher` | Integrations / Rank tracking |
| Mastodon verification | `social.mastodon` | Social |
| Google Docs add-on | `googledocs.addon` | Integrations / Content |
| NLWeb schema aggregation | `schema.nlweb` | Schema / GEO |
| E-E-A-T schema signals | `schema.eeat` | Schema |
| Store locator (Local SEO) | `local.locator` | Local |
| Opening hours management | `local.hours` | Local |
| Video sitemap + schema | `sitemap.video`, `schema.video` | Video SEO |
| News SEO (Google News, Top Stories) | `news.seo` | News SEO |
| WooCommerce XML sitemap (excludes non-shopping) | `woo.sitemap` | eCommerce |
| Product structured data (price, reviews, availability) | `woo.product.schema` | eCommerce / Schema |
| Ecommerce content analysis (GTINs, SKUs, short descriptions) | `woo.content.analysis` | eCommerce |
| AI Generate for ecommerce (bulk product titles/meta) | `woo.ai.generate` | eCommerce / AI |
| REST API for SEO metadata | `api.rest` | Developer |
| Surfaces API | `api.surfaces` | Developer |
| Metadata API hooks | `api.metadata` | Developer |
| Schema API (graph piece modification) | `api.schema` | Developer |
| Indexables system | `system.indexables` | Developer / Performance |
| Yoast SEO Academy (courses) | `academy.courses` | Education |
| SEO roles / delegation | `roles.seo` | Team / Permissions |
| Configuration wizard | `wizard.config` | Workflow / Onboarding |

---

## 6. Open SEO — `every-app/open-seo`

**Source:** Repo README + openseo.so docs/features/pricing/roadmap/MCP/skills pages.

### 6.1 Complete Feature List

**Main Workflows (8)**
1. Keyword Research — volume, difficulty, CPC, ideas, SERPs
2. Saved Keywords — organize opportunities
3. Rank Tracking — monitor keyword positions
4. Domain Overview — traffic, keywords, pages for any domain
5. Backlinks — links + referring domains
6. Site Audit — page-level SEO signals
7. AI Visibility — brand mentions in AI search (ChatGPT, Google AI Overview)
8. Prompt Explorer — compare answers across models

**MCP Tools (exposed to AI agents)**
9. Keyword research with volume/difficulty/CPC
10. Live Google organic SERP results for keywords
11. Keyword/page/rank/volume/CPC/intent/traffic rows for domain or page
12. Compare SERP competitors across keyword set
13. Search local businesses near coordinate (filter by rating, review count, claimed status)
14. Fetch Maps/Local Finder SERP + read Google Business Q&A
15. Audit Google Business Profile (categories, rating, hours, photos, claim status)
16. Collect Google reviews (incl. from other sites) + Google Business posts
17. Look up Google Business category slugs
18. Check Google Maps rank at each point of a grid around a business (geo-grid)
19. Hydrate keywords (volume, difficulty, intent, CPC, trends)
20. List saved keywords from project
21. Save keywords back to project
22. Read rank tracker configs + latest positions
23. Summarize domain organic footprint
24. Find keywords a domain already ranks for
25. Check backlink + referring-domain overview
26. Read GSC performance (clicks, impressions, CTR, position)
27. Inspect index status, crawl, canonical for URLs (up to 10)
28. Read/update project shared context (business, goal, positioning, writing prefs, competitors, key pages, research log)

**Search Console MCP (separate)**
29. Clicks, impressions, CTR, position
30. URL inspection

**Agent Skills (9)**
31. `/seo-project-setup` — interview + save goals/positioning/competitors/key pages
32. `/seo-coach` — learn SEO, choose workflow
33. `/keyword-research` — find opportunities
34. `/keyword-clustering` — cluster by intent, map to pages
35. `/competitive-landscape` — map market leaders, content patterns, keyword coverage, backlinks, gaps
36. `/competitor-analysis` — one competitor's keywords, pages, backlinks, content themes, gaps
37. `/link-prospecting` — find outreach prospects from SERPs, competitor backlinks, topical publishers
38. `/local-seo` — audit GBP, compare to local competitors, map visibility
39. `/seo-audit` — one-page plain-language report

**Free Tools**
40. Backlink Checker

**Resources**
41. Strategy Library (SEO strategies grouped by topic)

**Roadmap (planned)**
42. Teammates on an account
43. Community skill library
44. Web Bot Auth for bot-protected sites (Audit)
45. In-app agent
46. IndexNow support
47. Prompt tracking for AI search visibility
48. Google Business Profile integration
49. Google Maps geo-grid rank tracking
50. Multi-user for Docker self-hosting
51. Configurable daily/weekly email reports
52. Scheduled Site Audits
53. GSC Reports
54. Rank Tracking Alerts
55. Custom reports (via Claude Skill)
56. Share reports with clients
57. Content writing workflows for Agents
58. Agent readiness checks in site audits
59. Bing Webmaster Tools integration

### 6.2 Features Sage is MISSING (vs. Open SEO)

| Missing Feature | Suggested Sage Tool | Category |
|---|---|---|
| Keyword volume/difficulty/CPC hydration | `keywords.volume`, `keywords.difficulty`, `keywords.cpc` | Keyword research |
| Live Google organic SERP results fetch | `serp.fetch` | SERP / Keyword |
| Domain organic footprint summary | `domain.overview` | Competitor |
| Keywords a domain already ranks for | `domain.keywords` | Competitor / Keyword |
| SERP competitor comparison across keyword set | `serp.competitors` | Competitor / SERP |
| Backlink + referring-domain overview | `backlinks.profile` | Backlink |
| Local businesses near coordinate (rating/review/claimed filter) | `local.search` | Local |
| Maps/Local Finder SERP fetch | `local.serp` | Local / SERP |
| Google Business Q&A | `local.gbp.qa` | Local |
| Google Business Profile audit (categories, rating, hours, photos, claim) | `local.gbp.audit` | Local |
| Google reviews collection (incl. cross-site) | `local.reviews` | Local |
| Google Business posts | `local.gbp.posts` | Local |
| Google Business category slug lookup | `local.gbp.categories` | Local |
| Google Maps geo-grid rank tracking | `local.geogrid` | Local / Rank tracking |
| Index status + crawl + canonical inspection per URL | `url.inspect` | Technical / Indexing |
| Project shared context (positioning, competitors, key pages, research log) | (extend brandbrain → `project.context`) | Workflow |
| SEO Coach (learn SEO, choose workflow) | `coach.seo` | Workflow / Education |
| Competitive landscape mapping | `competitor.landscape` | Competitor |
| Link prospecting from SERPs + competitor backlinks + topical publishers | `backlinks.prospect` | Backlink / Outreach |
| Plain-language one-page SEO audit report | `audit.report` | Audit / Reporting |
| Prompt Explorer (compare AI answers across models) | `ai.prompts.compare` | GEO / AI Visibility |
| Prompt tracking for AI search visibility | `ai.prompts.track` | GEO / AI Visibility |
| AI Visibility brand lookup (ChatGPT + Google AI Overview) | (extend citations → `aivisibility.lookup`) | GEO |
| Scheduled Site Audits | `audits.schedule` | Workflow / Audit |
| Rank Tracking Alerts | `rankings.alerts` | Rank tracking / Reporting |
| Configurable daily/weekly email reports | `reports.email.schedule` | Reporting |
| GSC Reports | `reports.gsc` | Reporting / Analytics |
| Custom reports | `reports.custom` | Reporting |
| Share reports with clients | `reports.share` | Reporting / Agency |
| Teammates on an account | `team.add` | Team |
| Bing Webmaster Tools integration | `bing.webmaster` | Integrations / Indexing |
| Web Bot Auth for bot-protected sites (audit) | `audit.bot.auth` | Technical / Audit |
| Agent readiness checks in site audits | `audit.agent.readiness` | Audit / AI |
| Strategy Library | `library.strategy` | Education / Workflow |
| Community skill library | `library.skills` | Workflow / Extensibility |

---

## 7. Consolidated Missing-Tools List (Categorized)

Below is the **deduplicated, categorized master list** of tools Sage is missing, with proposed tool names following Sage's existing `namespace.action` convention. Each entry shows which repo(s) exposed the gap.

### 7.1 Keyword Research 🔴 Critical (Sage has only keywords.list/add + rankings)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 1 | `keywords.volume` | Search volume lookup (single + bulk) | Open SEO, awesome-seo, Rank Math |
| 2 | `keywords.difficulty` | Keyword difficulty score (0-100) | Open SEO, awesome-seo |
| 3 | `keywords.cpc` | CPC + paid metrics | Open SEO, awesome-seo |
| 4 | `keywords.intent` | Intent classification (info/nav/transactional/commercial) | SEO Machine, Open SEO |
| 5 | `keywords.autocomplete` | Google Autocomplete mining | awesome-seo (Keyword Tool, Serp Miner) |
| 6 | `keywords.longtail` | Long-tail discovery | awesome-seo (Serp Miner) |
| 7 | `keywords.questions` / `paa.mine` | People Also Ask / question mining | awesome-seo (AnswerThePublic, kwrds.ai) |
| 8 | `keywords.lsi` | LSI / semantically related keywords | awesome-seo (KeySearch, LSIGraph), Rank Math, SEO Machine |
| 9 | `keywords.trends` | Google Trends integration | Rank Math, awesome-seo |
| 10 | `keywords.cluster` | Clustering by intent (TF-IDF/K-means) | SEO Machine, Open SEO |
| 11 | `keywords.gap` | Keyword gap analysis vs competitor | awesome-seo, Open SEO |
| 12 | `keywords.suggestions` | Keyword ideas from URL/seed | awesome-seo (Keywordideas.xyz) |
| 13 | `keywords.semrush` | Semrush keyword data pull | AIOSEO, Yoast |
| 14 | `keywords.import` | Import/export focus keywords (CSV) | Rank Math |
| 15 | `keywords.save` | Save keyword opportunities to project | Open SEO |

### 7.2 Backlinks 🔴 Critical (Sage has ZERO backlink tools)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 16 | `backlinks.profile` | Backlink profile + referring domains overview | Open SEO, awesome-seo |
| 17 | `backlinks.monitor` | New/lost backlink monitoring | awesome-seo (Monitor Backlinks) |
| 18 | `backlinks.authority` | Backlink quality / domain authority scoring | awesome-seo (Majestic, Moz) |
| 19 | `backlinks.competitor` | Competitor backlink analysis | awesome-seo, Open SEO |
| 20 | `backlinks.prospect` | Link prospecting from SERPs + competitor backlinks + publishers | Open SEO, awesome-seo (BacklinkGPT, Respona) |
| 21 | `backlinks.outreach` | Personalized outreach email generation | awesome-seo (BacklinkGPT, Respona) |
| 22 | `backlinks.disavow` | Disavow file generation | awesome-seo (implied) |
| 23 | `backlinks.broken_build` | Broken link building | awesome-seo |
| 24 | `backlinks.anchor` | Anchor text analysis | awesome-seo |
| 25 | `backlinks.checker` | Free backlink checker tool | Open SEO |

### 7.3 Competitor Analysis 🔴 Critical (Sage has serp.analyzer only)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 26 | `domain.overview` | Domain traffic/keywords/pages summary | Open SEO, awesome-seo |
| 27 | `domain.keywords` | Keywords a domain already ranks for | Open SEO |
| 28 | `competitor.landscape` | Market leader mapping, content patterns, keyword coverage | Open SEO |
| 29 | `competitor.analysis` | One competitor: keywords, pages, backlinks, themes, gaps | Open SEO, SEO Machine |
| 30 | `competitor.screenshot` | Competitor SERP screenshot | AIOSEO |
| 31 | `competitor.alternatives` | "Competitor alternatives" content generator | SEO Machine |
| 32 | `content.gap` | Competitor content gap analysis | SEO Machine, Open SEO |
| 33 | `serp.competitors` | Compare SERP competitors across keyword set | Open SEO |
| 34 | `landing.competitor` | Deep competitor landing page analysis | SEO Machine |

### 7.4 SERP Feature Tracking 🟠 High (Sage has serp.preview + featured.snippet.check only)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 35 | `serp.features` | Detect which SERP features appear per keyword (PAA, featured snippet, image pack, video carousel, etc.) | SEO Machine, awesome-seo |
| 36 | `serp.fetch` | Live Google organic SERP fetch | Open SEO |
| 37 | `serp.geo` | Country/location changer for SERP view | awesome-seo (Ahrefs toolbar, SEO Search Simulator) |
| 38 | `rankings.history` | Position history over time (keywords + posts) | Rank Math, SEO Machine |
| 39 | `rankings.winning` / `rankings.losing` | Top winning/losing keywords | Rank Math |
| 40 | `rankings.sov` | Share of Voice / SOV tracking | awesome-seo (SERPrecon) |

### 7.5 Rank Tracking Depth 🟠 High (Sage has rankings.get/refresh only)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 41 | `rankings.device` | Multi-device (desktop/mobile/tablet) | awesome-seo (DAXRM) |
| 42 | `rankings.location` | Multi-location rank tracking | awesome-seo (DAXRM) |
| 43 | `rankings.country` | Per-country rank tracking | Rank Math |
| 44 | `rankings.alerts` | Rank tracking alerts (email/notification) | Open SEO (roadmap) |
| 45 | `rankings.bulk` | High-volume keyword tracking (500-50,000) | Rank Math |

### 7.6 Local SEO 🟠 High (Sage has local.seo only — extend significantly)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 46 | `local.gbp.audit` | Google Business Profile audit (categories, rating, hours, photos, claim) | Open SEO |
| 47 | `local.gbp.qa` | Google Business Q&A | Open SEO |
| 48 | `local.gbp.posts` | Google Business posts | Open SEO |
| 49 | `local.gbp.categories` | Google Business category slug lookup | Open SEO |
| 50 | `local.reviews` | Google reviews collection (incl. cross-site) | Open SEO, awesome-seo (Moz Local) |
| 51 | `local.geogrid` | Google Maps geo-grid rank tracking | Open SEO, awesome-seo (LocalFalcon, Grid My Business) |
| 52 | `local.multi` | Multi-location management | Rank Math, AIOSEO |
| 53 | `local.locations` | Store locator | Yoast, AIOSEO |
| 54 | `local.hours` | Opening hours management | Yoast, AIOSEO |
| 55 | `local.knowledgepanel` | Knowledge Panel optimization | AIOSEO |
| 56 | `local.citations` | Local citation building/monitoring | awesome-seo (BrightLocal, Whitespark) |
| 57 | `local.schema.multi` | Multiple-location schema | Rank Math |
| 58 | `local.search` | Search local businesses near coordinate | Open SEO |
| 59 | `local.serp` | Maps/Local Finder SERP fetch | Open SEO |
| 60 | `local.blocks` | Advanced Local SEO blocks (UI) | Rank Math |

### 7.7 WooCommerce / eCommerce SEO 🟠 High (Sage has ZERO)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 61 | `woo.product.schema` | Auto product schema (price, reviews, availability) | AIOSEO, Rank Math, Yoast |
| 62 | `woo.sitemap` | WooCommerce-specific XML sitemap (excludes non-shopping) | Yoast |
| 63 | `woo.og` | Advanced OG tags for products | Rank Math |
| 64 | `woo.noindex.hidden` | Auto noindex hidden products | Rank Math |
| 65 | `woo.base.remove` | Remove product/category base | Rank Math |
| 66 | `woo.brands` | Custom brands | Rank Math |
| 67 | `woo.gtin_mpn` | GTIN/MPN (even variations) | Rank Math |
| 68 | `woo.content.analysis` | Ecommerce content analysis (GTINs, SKUs, short descriptions) | Yoast |
| 69 | `woo.ai.generate` | AI bulk product titles/meta | Yoast |
| 70 | `edd.seo` | Easy Digital Downloads SEO | Rank Math, Yoast |
| 71 | `shopify.seo` | Shopify SEO (Sage-agnostic) | (implied market gap) |

### 7.8 Schema 🟠 High (Sage has schema.generate, breadcrumbs, author — extend massively)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 72 | `schema.types.*` | 16-840+ types: Article, Book, Course, Dataset, Event, FAQ, JobPosting, Movie, Music, Product, Recipe, Restaurant, Review, Service, SoftwareApplication, Video, Person, Organization | Rank Math, AIOSEO |
| 73 | `schema.faq` | FAQ schema (block) | Yoast, Rank Math |
| 74 | `schema.howto` | HowTo schema (block) | Yoast, Rank Math |
| 75 | `schema.qa` | Q&A schema (bbPress) | Rank Math |
| 76 | `schema.speakable` | Speakable schema | Rank Math |
| 77 | `schema.dataset` | Dataset schema | Rank Math |
| 78 | `schema.factcheck` | Fact Check schema | Rank Math |
| 79 | `schema.podcast` | Podcast schema | Rank Math |
| 80 | `schema.carousel` | Carousel schema | Rank Math |
| 81 | `schema.mentions_about` | Mentions & About schema | Rank Math |
| 82 | `schema.eeat` | E-E-A-T signals (experience, expertise, authority, trust) | Yoast |
| 83 | `schema.nlweb` | NLWeb schema aggregation | Yoast |
| 84 | `schema.templates` | Reusable schema templates | AIOSEO, Rank Math |
| 85 | `schema.conditional` | Conditional schema markup | Rank Math |
| 86 | `schema.multiple` | Multiple schemas per page | Rank Math |
| 87 | `schema.custom` | Custom schema builder (JSON-LD/HTML) | Rank Math |
| 88 | `schema.validate` | Rich Results Test integration | Rank Math, awesome-seo |
| 89 | `schema.automate` | Automate schema implementation | Rank Math |
| 90 | `schema.import` | Import schema from other websites | Rank Math |

### 7.9 Social / Open Graph 🟠 High (Sage has ZERO)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 91 | `og.image.generate` | OG image generation API (templates, branding) | awesome-seo (ShotOG, ogimg.xyz) |
| 92 | `social.preview.fb` | Facebook preview | Yoast, AIOSEO |
| 93 | `social.preview.x` | Twitter/X preview | Yoast, AIOSEO |
| 94 | `social.preview.pinterest` | Pinterest preview | AIOSEO |
| 95 | `social.og.data` | Open Graph data management | AIOSEO |
| 96 | `social.watermark` | Watermarked social media images | Rank Math |
| 97 | `social.fb.flush` | Auto-flush Facebook thumbnails | Rank Math |
| 98 | `social.mastodon` | Mastodon verification | Yoast |
| 99 | `social.appearance` | Social appearance settings (per-post) | AIOSEO |

### 7.10 Video / News / Image Advanced SEO 🟠 High

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 100 | `sitemap.video` | Video sitemap | AIOSEO, Rank Math, Yoast |
| 101 | `sitemap.news` | News sitemap | AIOSEO, Rank Math |
| 102 | `video.autodetect` | Auto-detect videos + schema | Rank Math |
| 103 | `video.metadata` | Auto-fetch YouTube/Vimeo thumbnail + duration | Rank Math |
| 104 | `video.autofill` | Automatic video data fill | Rank Math |
| 105 | `schema.video` | Video schema | Yoast |
| 106 | `news.seo` | Google News + Top Stories optimization | Yoast |
| 107 | `podcast.seo` | Podcast module + schema | Rank Math |
| 108 | `image.watermark` | Image watermarking | Rank Math |
| 109 | `image.findreplace` | Find & replace image alt/title/caption | Rank Math |
| 110 | `image.captions` | Automate image captions | Rank Math |
| 111 | `image.alt.ai` | AI image alt text generation | awesome-seo (AltTextLab), Rank Math, AIOSEO |

### 7.11 Technical SEO / Crawl / Index 🟡 Medium (Sage has sitemap, robots, redirects, 404, indexnow)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 112 | `sitemap.rss` | RSS sitemap | AIOSEO |
| 113 | `sitemap.html` | HTML sitemap | AIOSEO |
| 114 | `sitemap.multilingual` | Multilingual XML sitemap | AIOSEO |
| 115 | `sitemap.settings` | Granular sitemap controls (priority, frequency, include/exclude) | AIOSEO |
| 116 | `sitemap.validate` | XML sitemap validator | awesome-seo |
| 117 | `robots.meta.set` | Per-page robots meta (noindex, nofollow, noarchive, max-snippet, max-image-preview, max-video-preview) | AIOSEO |
| 118 | `robots.noindex.archives` | Noindex paginated/archive/search | Rank Math |
| 119 | `robots.noindex.password` | Noindex password-protected pages | Rank Math |
| 120 | `robots.txt.test` | Robots.txt tester | Rank Math, awesome-seo |
| 121 | `crawl.settings` | Crawl settings / crawl budget management | Yoast |
| 122 | `index.status` | Google index status tracking | Rank Math |
| 123 | `url.inspect` | Per-URL index/crawl/canonical inspection | Open SEO |
| 124 | `redirect.htaccess` | Sync redirects to .htaccess | Rank Math |
| 125 | `redirect.fullsite` | Full-site redirect (domain move) | AIOSEO |
| 126 | `redirect.bulk` | Bulk redirect tools + CSV | Yoast, Rank Math |
| 127 | `redirect.autoprompt` | Auto-prompt redirects on move/delete | Yoast |
| 128 | `redirect.conflicts` | Overlapping-redirect ordering | AIOSEO |
| 129 | `redirect.trace` | Redirect tracer / HTTP header checker | awesome-seo |
| 130 | `monitor.404.export` | Export 404 log | Rank Math |
| 131 | `crawler.brokenlinks` | Site-wide broken link crawler | awesome-seo |
| 132 | `content.duplicate` | Duplicate content detection | awesome-seo (Siteliner) |
| 133 | `technical.jsrender` | JavaScript rendering / SSR check | awesome-seo |
| 134 | `technical.prerender` | Pre-rendering for SPAs | awesome-seo |
| 135 | `amp.seo` | Google AMP SEO | AIOSEO, Rank Math |
| 136 | `canonical.manage` | Canonical URL management (per-post + bulk) | AIOSEO, Yoast |
| 137 | `bing.webmaster` | Bing Webmaster Tools integration | Open SEO, awesome-seo |
| 138 | `webmaster.verify` | Multi-engine verification (Bing, Yandex, Baidu, Pinterest) | AIOSEO |
| 139 | `instantindex.google` | Google Indexing API (via plugin) | Rank Math |

### 7.12 Analytics Depth 🟡 Medium (Sage has analytics.gsc + analytics.decay)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 140 | `analytics.ga4` | Google Analytics 4 integration | Rank Math, SEO Machine, Yoast |
| 141 | `analytics.adsense` | Google AdSense earning history | Rank Math |
| 142 | `analytics.clarity` | Microsoft Clarity (heatmaps, sessions) | AIOSEO |
| 143 | `analytics.perpost` | Per-post/page SEO performance | Rank Math |
| 144 | `analytics.country` | GSC/GA data from specific country | Rank Math |
| 145 | `analytics.quickwins` | Quick wins detection (position 11-20) | SEO Machine |
| 146 | `analytics.privacy` | Privacy-focused analytics (SEO Gets-style) | awesome-seo |
| 147 | `pagespeed.crux` | CrUX data integration | awesome-seo |
| 148 | `pagespeed.perpost` | PageSpeed per post & page | Rank Math |
| 149 | `posts.winning` / `posts.losing` | Top winning/losing posts | Rank Math |
| 150 | `posts.ranking_keywords` | Ranking keywords per post | Rank Math |

### 7.13 Content Tools 🟡 Medium (Sage has generate.*, content.score, content.humanize, content.brief)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 151 | `content.rewrite` | Rewrite/update existing content | SEO Machine |
| 152 | `content.scrub` | AI watermark removal (em-dashes, filler, robotic patterns) | SEO Machine |
| 153 | `content.health` | Content health score (0-100) | SEO Machine |
| 154 | `content.length.compare` | Length vs top 10-20 SERP competitors (median, 75th percentile) | SEO Machine |
| 155 | `content.stuffing` | Keyword stuffing risk detection | SEO Machine |
| 156 | `content.distribution` | Distribution heatmap by section | SEO Machine |
| 157 | `content.inclusive` | Inclusive language analysis | Yoast |
| 158 | `content.summarize` | AI post summary | Yoast |
| 159 | `content.planner` | AI content planner (post ideas + draft) | Yoast, SEO Machine |
| 160 | `content.opportunity` | 8-factor opportunity scoring | SEO Machine |
| 161 | `content.engagement` | Engagement pattern analysis | SEO Machine |
| 162 | `content.section` | Section-level writing guidance | SEO Machine |
| 163 | `content.cornerstone` | Cornerstone content marking | Yoast |
| 164 | `content.programmatic` | Programmatic SEO | SEO Machine |
| 165 | `meta.generate.variations` | AI 5 title + 5 meta variations | Yoast, SEO Machine |
| 166 | `ai.keyphrase.optimize` | AI keyphrase placement (intro, distribution, density) | Yoast |
| 167 | `ai.post.optimize` | One-click AI optimize post | AIOSEO |
| 168 | `ai.sentence.rewrite` | AI rewrite sentences/paragraphs for fixes | AIOSEO |
| 169 | `ai.image.generate` | AI image generator | AIOSEO |
| 170 | `content.brief.competitor` | SERP-based content brief with competitor word counts | AIOSEO (SEOBoost), SEO Machine |
| 171 | `headline.generate` | Headline generator (10+ variations + A/B) | SEO Machine |
| 172 | `googledocs.addon` | Google Docs add-on (analysis before CMS) | Yoast |

### 7.14 On-Page / Editor UX 🟡 Medium (Sage has meta, headline.analyze, readability.analyze, keyword.density)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 173 | `editor.highlighter` | In-editor issue highlighting (TruSEO Highlighter) | AIOSEO |
| 174 | `editor.spellcheck` | Spell checker in editor | AIOSEO |
| 175 | `inspector.frontend` | Front-end SEO inspector (live edit) | Yoast |
| 176 | `seo.tests.run` | 30+ SEO tests with 1-click | Rank Math |
| 177 | `audit.scorecard` | 28-check scorecard with prioritized fixes | awesome-seo (SEO Score API) |
| 178 | `links.autolink` | Auto-link keyword variations | Rank Math |
| 179 | `links.health` | Link audits + monitor link health | Rank Math |
| 180 | `links.cloaked` | Mark cloaked links as external | Rank Math |
| 181 | `links.external` | Open external in new tabs / nofollow external | Rank Math |
| 182 | `links.suggest` | Smart internal linking suggestions | Yoast, AIOSEO |
| 183 | `pages.orphan` | Detect orphan pages | Rank Math, Yoast |
| 184 | `quickedit.seo` | Quick edit SEO details | Rank Math |
| 185 | `bulk.posts.edit` | Bulk edit (index/noindex/redirect) | Rank Math |
| 186 | `bulk.editor.ai` | Bulk editor with AI drafts | Yoast |
| 187 | `bulk.ai.optimize` | Bulk AI actions across posts | AIOSEO |
| 188 | `meta.analyzer` | Meta tag analyzer (online tool) | Rank Math |
| 189 | `onpage.report` | On-page SEO report (extension-style) | awesome-seo |
| 190 | `tasks.list` | Task list with priority + time estimates | Yoast |

### 7.15 CRO / Landing Page 🟡 Medium (Sage has ZERO)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 191 | `cro.analyze` | CRO analysis (above-fold, CTA, trust, friction) | SEO Machine |
| 192 | `cro.abovefold` | Above-the-fold analyzer | SEO Machine |
| 193 | `cro.cta` | CTA analyzer | SEO Machine |
| 194 | `cro.trust` | Trust signal analyzer | SEO Machine |
| 195 | `cro.abtest` | A/B test setup | SEO Machine |
| 196 | `landing.optimize` | Landing page optimizer (CRO score 0-100) | SEO Machine |
| 197 | `landing.write` | Conversion-optimized landing page writer | SEO Machine |
| 198 | `landing.audit` | Landing page CRO audit | SEO Machine |
| 199 | `cro.page` / `cro.form` / `cro.signup` / `cro.onboarding` / `cro.popup` / `cro.paywall` | Specialized CRO skills | SEO Machine |

### 7.16 GEO / AI Visibility Depth 🟡 Medium (Sage has citations.get/battlecards + llmstxt)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 200 | `aivisibility.score` | Composite AI Visibility Score (per-dimension) | awesome-seo (LLM Optimizer), Rank Math |
| 201 | `aivisibility.lookup` | Brand lookup in ChatGPT + Google AI Overview | Open SEO |
| 202 | `aivisibility.sentiment` | Brand sentiment across AI responses | Rank Math |
| 203 | `aivisibility.transcripts` | Complete transcripts of AI responses | Rank Math |
| 204 | `aivisibility.country` | Country-level AI visibility | Rank Math |
| 205 | `aivisibility.rank` | AI search rank tracking | AIOSEO |
| 206 | `ai.prompts.compare` | Prompt Explorer (compare answers across models) | Open SEO |
| 207 | `ai.prompts.track` | Prompt tracking for AI visibility | Open SEO (roadmap) |
| 208 | `geo.lint` | GEO linter (92 rules, citation density, answer-ready formatting) | awesome-seo |
| 209 | `aivisibility.sov` | AI Share of Voice tracking | awesome-seo (SERPrecon) |

### 7.17 Reports / Email / White-label 🟠 High (Sage has ZERO)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 210 | `reports.email` | SEO performance email reports | Rank Math |
| 211 | `reports.whitelabel` | White-labelled email reports | Rank Math |
| 212 | `reports.schedule` | Configurable daily/weekly email report frequency | Rank Math, Open SEO |
| 213 | `reports.gsc` | GSC reports | Open SEO |
| 214 | `reports.custom` | Custom reports (via Claude Skill) | Open SEO |
| 215 | `reports.share` | Share reports with clients | Open SEO |
| 216 | `audit.report` | Plain-language one-page SEO audit report | Open SEO |
| 217 | `posts.badges` | Single post performance badges | Rank Math |

### 7.18 Team / Roles / Client Management 🟡 Medium (Sage has ZERO)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 218 | `roles.manage` | Role Manager | Rank Math |
| 219 | `roles.seo` | SEO roles / delegation | Yoast |
| 220 | `team.add` | Teammates on an account | Open SEO |
| 221 | `clients.manage` | Client management | Rank Math |
| 222 | `clients.sites` | Client sites per account | Rank Math |
| 223 | `multisite.support` | WordPress Multisite support | Rank Math |

### 7.19 Setup Wizard / Migration / CSV 🟡 Medium (Sage has bulk.meta.export/import)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 224 | `wizard.setup` | SEO Setup Wizard (<5 min) | AIOSEO |
| 225 | `wizard.config` | Step-by-step configuration wizard | Yoast |
| 226 | `wizard.custom` | Custom Setup Wizard Mode | Rank Math |
| 227 | `import.seo_plugin` | Importer (Yoast/Rank Math/SEOPress) | AIOSEO |
| 228 | `import.redirects` | Redirect importer (Redirection, Simple 301, Safe Redirect, 301 Redirects) | AIOSEO |
| 229 | `redirects.import.csv` | CSV redirects import | Rank Math |
| 230 | `seo.meta.import.csv` | CSV SEO meta import | Rank Math |
| 231 | `settings.backup` | Settings backup/restore | AIOSEO |

### 7.20 Multilingual / Multi-region 🟡 Medium (Sage has hreflang.generate)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 232 | `i18n.integrate` | WPML/Weglot/TranslatePress/Polylang integration | Rank Math, AIOSEO |
| 233 | `i18n.languages` | 20+ language support | Yoast |
| 234 | `sitemap.multilingual` | Multilingual XML sitemap | AIOSEO |
| 235 | `content.translate` | Per-language meta/schema | AIOSEO |
| 236 | `rankings.country` | Multi-country rank tracking | Rank Math |

### 7.21 Page Builder / CMS Integrations 🟡 Medium (architecture-dependent)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 237 | `pagebuilder.elementor` | Elementor SEO + breadcrumbs widget + accordion-to-FAQ | Rank Math, AIOSEO, Yoast |
| 238 | `pagebuilder.divi` | Divi SEO + accordion-to-FAQ | Rank Math, AIOSEO |
| 239 | `pagebuilder.bricks` / `oxygen` / `wpbakery` / `avada` / `beaver` / `seedprod` / `siteorigin` | Other page builders | AIOSEO, Rank Math |
| 240 | `acf.integrate` | ACF + custom fields into analysis + smart tags + schema | AIOSEO, Yoast |
| 241 | `cms.wordpress.publish` | WordPress REST API publishing | SEO Machine |
| 242 | `integration.sitekit` | Google Site Kit | Yoast |
| 243 | `integration.algolia` | Algolia internal search | Yoast |
| 244 | `integration.wincher` | Wincher rank tracking | Yoast |
| 245 | `api.rest` / `api.surfaces` / `api.metadata` / `api.schema` | Developer APIs | Yoast |
| 246 | `system.indexables` | Indexables system (unified SEO data) | Yoast |

### 7.22 Marketing Skills 🟡 Medium (Sage has ZERO — strategic differentiator from SEO Machine)

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 247 | `copy.write` / `copy.edit` | Copywriting + copy editing | SEO Machine |
| 248 | `strategy.content` / `strategy.pricing` / `strategy.launch` / `strategy.ideas` | Strategy skills | SEO Machine |
| 249 | `gen.email` / `gen.social` / `gen.ads` | Channel content generators | SEO Machine |
| 250 | `gen.referral` / `strategy.freetool` / `strategy.psychology` | Other marketing skills | SEO Machine |
| 251 | `analytics.tracking` | Analytics tracking setup | SEO Machine |
| 252 | `coach.seo` | SEO Coach (learn SEO, choose workflow) | Open SEO |
| 253 | `library.strategy` | Strategy Library | Open SEO |
| 254 | `academy.courses` | SEO Academy (courses) | Yoast |

### 7.23 Performance / Validators 🟡 Medium

| # | Proposed Tool | Description | Found In |
|---|---|---|---|
| 255 | `validator.richresults` | Rich Results checker | awesome-seo |
| 256 | `validator.brokenlinks` | Broken link checker | awesome-seo |
| 257 | `site.analyzer` | Online SEO analyzer | Rank Math, awesome-seo |
| 258 | `performance.lazyload` | Lazy-loading optimization | AIOSEO |
| 259 | `performance.code` | Code optimization | AIOSEO, Yoast |

---

## 8. Priority Recommendations (What to Build Next)

### Phase 1 — Critical Revenue Drivers (🔴 Build First)
These are the features prospects will compare Sage against Ahrefs/SEMrush/Open SEO on day one.

1. **Keyword Research suite** (#1-15) — `keywords.volume`, `keywords.difficulty`, `keywords.cpc`, `keywords.intent`, `keywords.autocomplete`, `keywords.questions`, `keywords.lsi`, `keywords.cluster`, `keywords.gap`, `keywords.trends`. DataForSEO integration recommended (Open SEO uses it).
2. **Backlinks suite** (#16-25) — `backlinks.profile`, `backlinks.monitor`, `backlinks.competitor`, `backlinks.prospect`, `backlinks.outreach`, `backlinks.disavow`, `backlinks.anchor`. This is Sage's biggest gap (zero tools).
3. **Competitor Analysis suite** (#26-34) — `domain.overview`, `domain.keywords`, `competitor.landscape`, `competitor.analysis`, `content.gap`, `serp.competitors`.
4. **SERP Feature Tracking** (#35-40) — `serp.features`, `serp.fetch`, `rankings.history`, `rankings.winning/losing`, `rankings.sov`.

### Phase 2 — High-Value Verticals (🟠 Build Next)
5. **Local SEO suite** (#46-60) — `local.gbp.audit`, `local.gbp.qa`, `local.gbp.posts`, `local.reviews`, `local.geogrid`, `local.multi`, `local.locations`, `local.hours`, `local.citations`, `local.schema.multi`.
6. **WooCommerce/eCommerce SEO suite** (#61-71) — `woo.product.schema`, `woo.sitemap`, `woo.og`, `woo.noindex.hidden`, `woo.base.remove`, `woo.brands`, `woo.gtin_mpn`, `woo.content.analysis`, `woo.ai.generate`.
7. **Schema expansion** (#72-90) — `schema.faq`, `schema.howto`, `schema.video`, `schema.event`, `schema.course`, `schema.jobposting`, `schema.recipe`, `schema.review`, `schema.product`, `schema.softwareapp`, `schema.eeat`, `schema.nlweb`, `schema.templates`, `schema.conditional`, `schema.multiple`, `schema.validate`.
8. **Social / Open Graph** (#91-99) — `og.image.generate`, `social.preview.fb`, `social.preview.x`, `social.preview.pinterest`, `social.og.data`, `social.watermark`.
9. **Reports / Email / White-label** (#210-217) — `reports.email`, `reports.whitelabel`, `reports.schedule`, `reports.custom`, `reports.share`, `audit.report`. Critical for agency clients.
10. **Video/News/Image advanced** (#100-111) — `sitemap.video`, `sitemap.news`, `video.autodetect`, `video.metadata`, `news.seo`, `podcast.seo`, `image.watermark`, `image.findreplace`, `image.alt.ai`.

### Phase 3 — Depth & Differentiation (🟡 Build After)
11. **AI Visibility / GEO depth** (#200-209) — extends Sage's existing citations + llmstxt with `aivisibility.score`, `aivisibility.sentiment`, `aivisibility.transcripts`, `aivisibility.country`, `ai.prompts.compare`, `geo.lint`.
12. **Technical SEO / Crawl / Index** (#112-139) — `sitemap.rss/html/multilingual`, `robots.meta.set`, `crawl.settings`, `index.status`, `url.inspect`, `redirect.htaccess/fullsite/bulk/autoprompt`, `crawler.brokenlinks`, `content.duplicate`, `technical.jsrender`, `bing.webmaster`.
13. **Analytics depth** (#140-150) — `analytics.ga4`, `analytics.adsense`, `analytics.clarity`, `analytics.perpost`, `analytics.quickwins`, `pagespeed.perpost`.
14. **Content tools depth** (#151-172) — `content.rewrite`, `content.scrub`, `content.health`, `content.length.compare`, `content.planner`, `content.cornerstone`, `meta.generate.variations`, `ai.keyphrase.optimize`, `ai.post.optimize`, `ai.image.generate`, `headline.generate`, `googledocs.addon`.
15. **On-page / Editor UX** (#173-190) — `editor.highlighter`, `inspector.frontend`, `seo.tests.run`, `audit.scorecard`, `links.autolink/health/cloaked/external/suggest`, `pages.orphan`, `bulk.posts.edit`, `tasks.list`.
16. **CRO / Landing Page** (#191-199) — `cro.analyze`, `cro.abovefold`, `cro.cta`, `cro.trust`, `cro.abtest`, `landing.optimize/write/audit`. SEO Machine shows this is a real differentiator.
17. **Setup / Migration / Team / Roles** (#218-231) — `wizard.setup`, `import.seo_plugin`, `import.redirects`, `roles.manage`, `team.add`, `clients.manage`.
18. **Marketing skills** (#247-254) — `copy.write`, `strategy.*`, `gen.email/social/ads`, `coach.seo`, `library.strategy`. (Borrow directly from SEO Machine's 26 skills.)
19. **Multilingual / Page Builder / Developer APIs** (#232-246, #255-259) — `i18n.integrate`, `pagebuilder.*`, `acf.integrate`, `api.rest/surfaces/metadata/schema`, `system.indexables`.

---

## 9. Summary Stats

| Metric | Count |
|---|---|
| Repos audited | 6 |
| Total features cataloged across repos | ~340+ (with duplicates) |
| Unique missing tools identified for Sage | **~259** |
| 🔴 Critical (revenue-blocking) gaps | ~41 (keyword research + backlinks + competitor + SERP features) |
| 🟠 High-value vertical gaps | ~75 (local, ecommerce, schema, social, video/news, reports) |
| 🟡 Medium (depth/differentiation) gaps | ~143 (technical, analytics, content, on-page, CRO, GEO, team, marketing) |
| Sage's existing tools (baseline) | 59 |
| Projected Sage tool count after Phases 1-3 | ~250-300 |

### Top 5 "Build Immediately" Recommendations
1. **Backlinks suite** — Sage has zero; every competitor has 5-10 tools here.
2. **Keyword Research suite** — Sage only has list/add; missing volume/difficulty/CPC/intent/clustering which are table-stakes.
3. **Competitor Analysis suite** — `domain.overview`, `domain.keywords`, `content.gap` are core agency workflows.
4. **Local SEO GBP suite** — Open SEO's roadmap shows this is the next battleground (GBP audit, reviews, geo-grid).
5. **Reports / Email / White-label** — Required for agency/client use; Rank Math and Open SEO both prioritize this.

### Top 3 "Unique Differentiators to Adopt"
1. **CRO + Landing Page tools** (from SEO Machine) — most SEO suites lack these; Sage could own "SEO + CRO."
2. **Marketing Skills library** (from SEO Machine's 26 skills + Open SEO's 9 agent skills) — turn Sage into a full marketing co-pilot, not just SEO.
3. **GEO Linter + AI Visibility Score** (from awesome-seo geo-lint + LLM Optimizer + Rank Math AI Visibility) — Sage already has citations + llmstxt; extend with composite scoring + sentiment + transcripts to lead the GEO category.

---

*Report saved to `/home/z/my-project/missing-tools-audit.md`. Raw audit data cached in `/tmp/audit/` for re-reference.*
