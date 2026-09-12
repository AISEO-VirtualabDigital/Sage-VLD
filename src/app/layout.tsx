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
    default: "Sage by VirtuaLab Digital — AI-Native SEO Platform",
    template: "%s · Sage by VirtuaLab Digital",
  },
  description:
    "Sage is the AI-native SEO platform that audits your site, writes optimized content, tracks AI-search visibility (GEO), and ships technical fixes — automatically. Built by SEO engineers tired of bloated tools.",
  keywords: [
    "AI SEO",
    "SEO platform",
    "AI content generator",
    "GEO",
    "Generative Engine Optimization",
    "AI visibility",
    "rank tracking",
    "schema markup",
    "site audit",
    "internal linking",
    "SEO SaaS",
    "Sage SEO",
    "VirtuaLab Digital",
    "WordPress SEO alternative",
    "Yoast alternative",
    "Rank Math alternative",
    "Ahrefs alternative",
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
    title: "Sage by VirtuaLab Digital — The AI-Native SEO Platform",
    description:
      "Audit, optimize, write, and track — all powered by AI. Sage handles on-page SEO, technical audits, schema generation, AI-search visibility (GEO), and rank tracking in one workspace.",
    url: siteUrl,
    siteName: "Sage by VirtuaLab Digital",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Sage by VirtuaLab Digital — AI-Native SEO Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage by VirtuaLab Digital — AI-Native SEO Platform",
    description:
      "Audit, optimize, write, and track — all powered by AI. The SEO workspace for the agentic web.",
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
    "Sage is the AI-native SEO platform that audits your site, writes optimized content, tracks AI-search visibility (GEO), and ships technical fixes — automatically. Built by SEO engineers tired of bloated tools.",
  url: siteUrl,
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "29",
      priceCurrency: "USD",
      description: "For solo founders and small blogs getting started with AI-driven SEO.",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "89",
      priceCurrency: "USD",
      description: "For growing teams that need full AI SEO workflows + rank tracking.",
    },
    {
      "@type": "Offer",
      name: "Agency",
      price: "249",
      priceCurrency: "USD",
      description: "For agencies and enterprises managing multiple client sites at scale.",
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
    "AI Content Generator",
    "AI Search Visibility (GEO) Tracking",
    "AI Schema Markup Generator",
    "Automated Site Audits",
    "AI Internal Linking",
    "Rank Tracking",
    "Competitor Intelligence",
    "Backlink Monitoring",
    "MCP / Agent API",
    "llms.txt Generation",
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
      name: "What makes Sage different from Yoast or Rank Math?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yoast and Rank Math are WordPress plugins focused on on-page SEO for a single CMS. Sage is an AI-native platform that works across any stack, tracks AI-search visibility (GEO) — how often your brand shows up in ChatGPT, Perplexity, and Google AI Overviews — and ships agentic workflows via an MCP API so AI agents can run SEO for you.",
      },
    },
    {
      "@type": "Question",
      name: "Does Sage work on non-WordPress sites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Sage is CMS-agnostic. Connect any site via a JavaScript snippet, sitemap URL, or our REST/MCP API. We have native integrations for WordPress, Shopify, Webflow, Next.js, Astro, and static HTML.",
      },
    },
    {
      "@type": "Question",
      name: "What is GEO (Generative Engine Optimization)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GEO is the practice of optimizing your content so AI engines like ChatGPT, Perplexity, Google AI Overviews, and Claude cite your brand as a source. Sage tracks your visibility across these engines, generates llms.txt files, and scores how 'AI-citable' your content is.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Sage with my existing SEO tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Sage integrates with Google Search Console, GA4, Ahrefs, DataForSEO, WordPress, Shopify, Webflow, Zapier, and Slack. The MCP API also lets you connect Sage to any AI agent (Claude, Cursor, ChatGPT) or custom workflow.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — every paid plan starts with a 14-day free trial. No credit card required. The Starter plan also has a free tier limited to 1 site and 50 keywords.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the AI content generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sage's AI is trained on top-ranking pages in your niche and grounded in your existing site content, so it produces factually accurate, on-brand copy that already matches search intent. Every generated piece includes a content score, readability analysis, and a one-click humanize pass.",
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
