import type { Metadata } from "next";
import { Inter, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://sage.virtualab.digital";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sage by VirtuaLab Digital — AI-Visibility-first, Agent-Native SEO Platform",
    template: "%s · Sage by VirtuaLab Digital",
  },
  description:
    "Sage is the AI-Visibility-first, agent-native SEO platform. Track Google + Bing, monitor AI citations across ChatGPT/Perplexity/AI Overviews, generate humanized content from 3 specialized engines (Home/Services/Blog), and let your AI agents run fixes via MCP. BYOK + wholesale DataForSEO pricing.",
  keywords: [
    "AI SEO",
    "SEO platform",
    "AI Visibility",
    "GEO",
    "Generative Engine Optimization",
    "AI Citation Tracker",
    "Bing rank tracking",
    "Google rank tracking",
    "llms.txt",
    "NLWeb",
    "De-AI humanizer",
    "E-E-A-T Scorer",
    "Content Gap Analyzer",
    "Brand Brain",
    "SEO Version Control",
    "Competitive AI Battlecards",
    "MCP server",
    "BYOK DataForSEO",
    "Sage SEO",
    "VirtuaLab Digital",
    "Yoast alternative",
    "Rank Math alternative",
    "Ahrefs alternative",
    "Cloudflare Workers",
  ],
  authors: [{ name: "VirtuaLab Digital", url: siteUrl }],
  creator: "VirtuaLab Digital",
  publisher: "VirtuaLab Digital",
  applicationName: "Sage",
  category: "SEO Software",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Sage by VirtuaLab Digital — Stop selling dashboards. Start shipping rankings.",
    description:
      "The AI-Visibility-first, agent-native SEO platform. Track Google + Bing, dominate AI search, generate humanized content from 3 specialized generators, and let your AI agents run fixes via MCP. BYOK + wholesale pricing.",
    url: siteUrl,
    siteName: "Sage by VirtuaLab Digital",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Sage by VirtuaLab Digital — AI-Visibility-first, Agent-Native SEO Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage — Stop selling dashboards. Start shipping rankings.",
    description:
      "AI-Visibility-first, agent-native SEO. Google + Bing, GEO tracking, 3 content generators, MCP server, BYOK pricing.",
    creator: "@virtuablab",
    images: ["/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  manifest: "/manifest.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sage by VirtuaLab Digital",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "SEO Software",
  operatingSystem: "Web",
  description:
    "Sage is the AI-Visibility-first, agent-native SEO platform. Track Google + Bing, monitor AI citations across ChatGPT/Perplexity/AI Overviews, generate humanized content from 3 specialized engines (Home/Services/Blog), and let your AI agents run fixes via MCP. BYOK + wholesale DataForSEO pricing.",
  url: siteUrl,
  offers: [
    {
      "@type": "Offer",
      name: "Free · BYOK",
      price: "0",
      priceCurrency: "USD",
      description: "Bring your own DataForSEO + LLM API keys. Full platform access. Pay wholesale data costs only.",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "49",
      priceCurrency: "USD",
      description: "For growing teams — includes $30/mo usage credits, BYOK optional, all 3 generators, GEO tracking, Brand Brain, Version Control.",
    },
    {
      "@type": "Offer",
      name: "Agency",
      price: "149",
      priceCurrency: "USD",
      description: "For agencies — includes $100/mo usage credits, white-label, client workspaces, Battlecards, SOC 2.",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1284",
    reviewCount: "1284",
  },
  publisher: {
    "@type": "Organization",
    name: "VirtuaLab Digital",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/favicon.svg`,
    },
  },
  featureList: [
    "Google + Bing Dual-Core Rank Tracking",
    "AI Citation Tracker (GEO) across 5 AI engines",
    "Home Page Generator (conversion-architected)",
    "Services Generator (LocalBusiness schema)",
    "Blog Post Generator (long-form + gap analysis)",
    "De-AI Humanizer (strips AI watermarks + em-dashes)",
    "E-E-A-T Scorer (0–100)",
    "SEO Scorer + Content Gap Analyzer vs top 10 SERPs",
    "Brand Brain (context-file repository)",
    "SEO Version Control with one-click rollback",
    "Competitive AI Battlecards",
    "Schema & GEO Automation (llms.txt + NLWeb)",
    "Cloud Site Audit Engine (358 checks, 24h refresh)",
    "AI Internal Linking & Link Health",
    "MCP Server (28 tools) + REST API",
    "BYOK DataForSEO + wholesale pricing",
  ],
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VirtuaLab Digital",
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  sameAs: [
    "https://twitter.com/virtuablab",
    "https://github.com/virtuablab",
    "https://www.linkedin.com/company/virtuablab",
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does AI-Visibility-first mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It means Sage is built around the assumption that 60%+ of informational queries in 2026 end on Google without a click — the answer is generated in-place by an AI engine. We track your visibility across Google, Bing, ChatGPT, Perplexity, Google AI Overviews, SearchGPT, and Claude, generate llms.txt + NLWeb schema to make your content AI-citable, and run a Content Gap Analyzer against top SERPs so your drafts include the topics AI engines actually cite.",
      },
    },
    {
      "@type": "Question",
      name: "Why does Sage track Bing natively?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bing powers ChatGPT's web search, Microsoft Copilot, and a growing share of voice-search via Edge. If you're not tracking Bing, you're blind to how AI engines that ingest Bing's index perceive you. Sage tracks Google + Bing daily on every plan — including the free BYOK tier — at the same wholesale cost.",
      },
    },
    {
      "@type": "Question",
      name: "How does BYOK (Bring Your Own Key) pricing work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On the Free tier, you bring your own DataForSEO API key (for rank tracking, SERP lookups, audits) and your own LLM API key (for content generation). Sage charges $0 platform fee — you pay providers directly at their wholesale rates. On Pro ($49/mo) and Agency ($149/mo), we include usage credits ($30 and $100 respectively) and you can still BYOK to bypass credits entirely. We publish our exact wholesale rates in a transparent cost table on the pricing page.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between the 3 content generators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Home Page Generator outputs hero copy, value props, social proof blocks, and Organization + FAQ schema. Services Generator outputs service H1/H2 structure, pricing tiers, benefit stacks, and Service + LocalBusiness schema for local and national SEO. Blog Post Generator outputs 2,000–4,000 word long-form articles with Article schema, internal link suggestions, and a Content Gap report vs the top 10 SERPs. All three run the same De-AI humanizer + E-E-A-T Scorer + SEO Scorer pipeline.",
      },
    },
    {
      "@type": "Question",
      name: "What does the De-AI humanizer actually do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every draft runs through a humanizer that strips AI watermarks: robotic em-dashes (—), repetitive sentence openers, ChatGPT's telltale transitions, bulleted-list padding, and filler phrases. Combined with the Brand Brain (your voice + style guide), drafts come out sounding like your team — not like a chatbot. Each draft shows a humanize-pass diff so you can see exactly what was stripped.",
      },
    },
    {
      "@type": "Question",
      name: "What is the Brand Brain and how does it ground generations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brand Brain is a versioned context-file repository: your brand voice doc, style guide, banned-phrase list, approved glossary, internal link map, and tone examples. Every Home, Services, and Blog generation pulls from your Brand Brain before producing output, so drafts inherit your voice without re-prompting. Team-editable, version-controlled, and exposed via MCP so your AI agents can read it too.",
      },
    },
    {
      "@type": "Question",
      name: "What is the MCP server and what can my AI agent do with it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Model Context Protocol server exposes 28 Sage tools to any MCP-compatible agent (Claude Code, Cursor, Cline, custom agents). Your agent can run audits, generate content via any of the 3 generators, query keyword rankings on Google + Bing, pull AI-citation reports, apply schema, ship auto-fix PRs, read the Brand Brain, and trigger SEO Version Control rollbacks — all without touching the Sage UI. We publish 5 starter Agent Skills installable via `npx skills add`.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer white-label / agency features?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Agency plan ($149/mo) includes white-labeled dashboards, client workspaces with granular permissions, bulk CSV automation, custom branded PDF reports, Competitive AI Battlecards for client-vs-rival benchmarks, and a dedicated success manager. We also offer SOC 2 Type II reports and DPAs for enterprise customers. BYOK is supported on all tiers — agencies often BYOK DataForSEO and pass the wholesale savings through to clients.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${display.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
