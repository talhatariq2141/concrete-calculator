import type { MetadataRoute } from "next";

export const revalidate = 3600;               // cache for 1 hour
export const contentType = "application/xml"; // proper XML MIME type
export const dynamic = "force-static";        // static response for bots

const baseUrl = "https://concretecalculatormax.com";

// NOTE: All paths are WITHOUT trailing slashes (Option A).
const routes: string[] = [
  "/", // homepage
  "/about-us",
  "/privacy-policy",
  "/terms-of-service",
  "/calculators",
  "/calculators/beam-concrete-calculator",
  "/calculators/column-concrete-calculator",
  "/calculators/concrete-yards-calculator",
  "/calculators/footing-concrete-calculator",
  "/calculators/nominal-mix-m5-m25-calculator",
  "/calculators/pier-caisson-concrete-calculator",
  "/calculators/slab-concrete-calculator",
  "/calculators/staircase-concrete-calculator",
  "/calculators/tank-or-trench-concrete-calculator",
  "/calculators/wall-concrete-calculator",
  "/calculators/concrete-bag-calculator"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((path) => ({
    url: `${baseUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1.0 : 0.8,
  }));
}
