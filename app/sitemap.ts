// app/sitemap.ts
import type { MetadataRoute } from "next";

// Cache for an hour so lastModified stays stable between builds
export const revalidate = 3600;               // Cache sitemap for 1 hour
export const contentType = "application/xml"; // Ensures proper XML MIME type
export const dynamic = "force-static";        // Serve statically for Googlebot

// Pick ONE canonical host and stick to it everywhere (no trailing slash)
const baseUrl = "https://concretecalculatormax.com";

// List every crawlable route you want in the sitemap.
// Keep it alphabetical and without trailing slashes for consistency.
const routes: string[] = [
  "/", // homepage
  "/about-us",
  "/privacy-policy",
  "/terms-of-service",
  "/calculators",
  "/calculators/beam-concrete-calculator",
  "/calculators/column-concrete-calculator",
  "/calculators/concrete-yards-calculator",
  "/calculators/footing-concrete-calculator", // ← fixed typo
  "/calculators/nominal-mix-m5-m25-calculator",
  "/calculators/pier-caisson-concrete-calculator",
  "/calculators/slab-concrete-calculator",
  "/calculators/staircase-concrete-calculator",
  "/calculators/tank-or-trench-concrete-calculator",
  "/calculators/wall-concrete-calculator",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Using a single timestamp per generation keeps diffs small.
  const now = new Date();

  return routes.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1.0 : 0.8
    // `changeFrequency` and `priority` are optional; Google largely ignores them.
    // If you want them, add realistic values per-URL instead of blanket values.
    // changeFrequency: "monthly",
    // priority: path === "/" ? 1.0 : 0.8,
  }));
}
