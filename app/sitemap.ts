import type { MetadataRoute } from "next";

export const revalidate = 3600;               // cache for 1 hour
export const contentType = "application/xml"; // proper XML MIME type
export const dynamic = "force-static";        // static response for bots

const baseUrl = "https://concretecalculatormax.com";

// Adjust if your blog base path differs (e.g. "/articles")
const BLOG_BASE = "/blog";

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
  "/calculators/concrete-bag-calculator",
  "/calculators/concrete-slab-cost-calculator",
  "/calculators/concrete-slab-weight-calculator",
  "/calculators/concrete-slab-load-capacity-calculator",

];

// ✅ Single source of truth for blog post slugs
// Fill this with your 20 posts (pillar + 19). A few are prefilled from our earlier work.
const blogSlugs: string[] = [
  // Pillar + Concrete Bags cluster (examples — add the rest of your 20 here)
  "reference-calculating-bags-of-concrete",
  "calculate-cement-bags-in-concrete",
  "calculate-bags-of-concrete-mix",
  "estimate-bags-of-concrete",
  "science-behind-concrete-bag-calculations",
  "convert-concrete-volume-into-bags",
  "concrete-bags-per-yard",
  "concrete-bag-mix-ratios",
  "choosing-right-concrete-mix-bag",
  "ready-mix-concrete-how-many-bags",
  "sonotube-bags-of-concrete",
  "slab-bags-of-concrete",
  "fence-post-bags-of-concrete",
  "footing-bags-of-concrete",
  "concrete-bags-in-a-yard",
  "convert-yards-to-bags",
  "concrete-bag-size-differences-us-uk-au",
  "cement-bag-calculator-projects",
  "concrete-bag-coverage-and-yield",
  "retaining-wall-bags-of-concrete",
  // 👉 Add your remaining slugs here...
];
// Map slugs to absolute paths
const blogRoutes = blogSlugs.map((slug) => `${BLOG_BASE}/${slug}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const all = [...routes, ...blogRoutes];

  return all.map((path) => {
    const isHome = path === "/";
    const isBlog = path.startsWith(BLOG_BASE);

    return {
      url: `${baseUrl}${path === "/" ? "" : path}`,
      // If you don’t have per-post dates handy, `now` is fine.
      // Optionally: store a parallel array of lastModified dates per slug.
      lastModified: now,
      changeFrequency: isBlog ? "yearly" : "monthly",
      priority: isHome ? 1.0 : isBlog ? 0.6 : 0.8,
    };
  });
}