/**
 * Sage — NextAuth Configuration
 *
 * Uses JWT strategy (edge-compatible — no database session lookups needed).
 * Credentials provider for email/password. Google OAuth provider optional.
 *
 * In production, the JWT secret comes from NEXTAUTH_SECRET env var.
 * The session token is stored as an httpOnly cookie.
 */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // JWT strategy — works on Cloudflare Workers edge runtime
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/?view=app&auth=signin", // sign-in rendered in dashboard
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            apiKey: true,
            plan: true,
            passwordHash: true,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // In production, use bcrypt/argon2. For demo, plain comparison.
        // import bcrypt from "bcryptjs";
        // const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        const valid = credentials.password === user.passwordHash; // demo only

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          apiKey: user.apiKey,
          plan: user.plan,
        } as const;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in: attach user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.apiKey = user.apiKey;
        token.plan = user.plan;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token fields on the session object
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).apiKey = token.apiKey;
        (session.user as Record<string, unknown>).plan = token.plan;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Plan definitions — used by billing + feature gating
export const PLANS = {
  free: {
    name: "Free · BYOK",
    priceMonthly: 0,
    priceAnnual: 0,
    includedCreditsCents: 0, // $0
    siteLimit: 1,
    keywordLimit: 100,
    contentDraftsPerMonth: 5,
    features: [
      "BYOK DataForSEO + LLM keys",
      "Google + Bing rank tracking",
      "All 3 content generators (5/mo)",
      "Site audit engine (weekly)",
      "Schema + llms.txt automation",
      "MCP server + REST API",
    ],
  },
  pro: {
    name: "Pro",
    priceMonthly: 49,
    priceAnnual: 39, // 20% off = $39/mo billed annually
    includedCreditsCents: 3000, // $30
    siteLimit: 5,
    keywordLimit: 1000,
    contentDraftsPerMonth: Infinity,
    features: [
      "Includes $30/mo usage credits",
      "BYOK optional (cheaper if you do)",
      "Unlimited AI content generation",
      "AI Citation Tracker (5 engines)",
      "Brand Brain + Version Control",
      "Competitive AI Battlecards",
      "AI internal linking + auto-fix PRs",
      "Priority support (4h SLA)",
    ],
  },
  agency: {
    name: "Agency",
    priceMonthly: 149,
    priceAnnual: 119, // 20% off
    includedCreditsCents: 10000, // $100
    siteLimit: Infinity,
    keywordLimit: 10000,
    contentDraftsPerMonth: Infinity,
    features: [
      "Includes $100/mo usage credits",
      "Everything in Pro, plus:",
      "White-label dashboard + reports",
      "Client workspaces + permissions",
      "Bulk CSV automation",
      "SOC 2 Type II + DPAs",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
