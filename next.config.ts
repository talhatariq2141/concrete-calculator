import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use URLs like /about-us (no trailing slash).
  // Next.js will normalize /path/ → /path automatically for pages.
  trailingSlash: false,

  // Do NOT add a blanket redirect that removes slashes.
  // It can accidentally affect files like /sitemap.xml or /robots.txt.

  // eslint: { ignoreDuringBuilds: true }, // optional
};

export default nextConfig;
