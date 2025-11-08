// lib/blog-data.ts
import matter from "gray-matter";
import path from "node:path";
import { logError } from "./logger";
import { readFileSafe, readMdxFile, walkMdxFiles } from "./mdx";

// ---- Paths -------------------------------------------------
const POSTS_ROOT = path.join(process.cwd(), "content/blog/posts");
const CATEGORIES_JSON = path.join(
  process.cwd(),
  "content/blog/categories.json"
);

// ---- Types (loose enough to match MDX front-matter) --------
export type BlogFrontmatter = {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  cover?: string; // e.g. "/images/blog/your-image.png"
  category?: string; // e.g. "concrete-bags"
  silo?: string;
  calculator?: string; // e.g. "concrete-bags"
  related_posts?: string[];
  related_calculator_link?: string;
  // Allow additional frontmatter fields but avoid `any` so linting stays strict.
  // Use `unknown` to force call-sites to narrow before use.
  [key: string]: unknown;
};

export type BlogListItem = {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  cover?: string;
  category?: string;
  calculator?: string;
};

// ---- Internal: read all posts (front-matter + content optionally)
async function readAllMdxFrontmatter() {
  const files = await walkMdxFiles(POSTS_ROOT);
  if (files.length === 0) return [];

  const posts = await Promise.all(
    files.map(async (abs) => {
      const raw = await readMdxFile(abs);
      if (!raw) return null;

      let parsed;
      try {
        parsed = matter(raw);
      } catch (error) {
        logError(`failed to parse frontmatter for ${abs}`, error);
        return null;
      }

      const fm = parsed.data as BlogFrontmatter;

      // Require minimum fields
      if (!fm?.slug || !fm?.title) return null;

      // Normalize cover path: must not include /public prefix
      if (fm.cover && typeof fm.cover === "string" && fm.cover.startsWith("/public/")) {
        fm.cover = fm.cover.replace(/^\/public/, "");
      }

      return {
        absPath: abs,
        content: parsed.content,
        frontmatter: fm,
      };
    })
  );

  return posts.filter(Boolean) as Array<{
    absPath: string;
    content: string;
    frontmatter: BlogFrontmatter;
  }>;
}

// ---- Public API --------------------------------------------

// Flat list for listings (newest first by date)
export async function getAllPosts(): Promise<BlogListItem[]> {
  const entries = await readAllMdxFrontmatter();
  if (entries.length === 0) return [];

  const items = entries.map(({ frontmatter }) => ({
    title: frontmatter.title,
    slug: frontmatter.slug,
    // Ensure date is always a string for consumers; use empty string when missing
    date: frontmatter.date ?? "",
    excerpt: frontmatter.excerpt,
    cover: frontmatter.cover,
    category: frontmatter.category,
    calculator: frontmatter.calculator,
  })) as BlogListItem[];

  return items.sort((a, b) => {
    const ad = a.date ? Date.parse(a.date) : 0;
    const bd = b.date ? Date.parse(b.date) : 0;
    return bd - ad;
  });
}

export async function getAllPostSlugs(): Promise<string[]> {
  const list = await getAllPosts();
  return list.map((p) => p.slug);
}

export async function getPostBySlug(slug: string) {
  if (!slug) return null;
  const entries = await readAllMdxFrontmatter();
  const hit = entries.find((e) => e.frontmatter.slug === slug);
  if (!hit) return null;
  return { content: hit.content, frontmatter: hit.frontmatter };
}

export async function getPostsByCategory(categorySlug: string) {
  const all = await getAllPosts();
  if (all.length === 0) return [];
  const wanted = (categorySlug || "").toLowerCase();
  return all.filter((p) => (p.category || "").toLowerCase() === wanted);
}

export async function getRelatedByCategory(
  categorySlug: string,
  excludeSlug?: string,
  limit = 12
) {
  const list = await getPostsByCategory(categorySlug);
  const filtered = list.filter((p) => p.slug !== excludeSlug);
  return filtered.slice(0, limit);
}

export async function getCategories(): Promise<
  { slug: string; name: string; description?: string; feature_calculator?: string }[]
> {
  const raw = await readFileSafe(CATEGORIES_JSON);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.categories)) return parsed.categories;
  } catch (error) {
    logError(`failed to parse categories JSON ${CATEGORIES_JSON}`, error);
  }
  return [];
}
