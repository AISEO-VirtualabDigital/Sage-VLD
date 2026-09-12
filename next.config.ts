import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Cloudflare Pages compatibility — experimental flag for next-on-pages
  experimental: {
    // Enables proper handling of server components on edge
    // Required for @cloudflare/next-on-pages
  },
};

export default nextConfig;
