// lib/blog-data.ts
import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unstable_cache } from "next/cache.js";

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

// ---- FS walk (recursively collect all *.mdx under POSTS_ROOT)
type CachedEntry = {
  absPath: string;
  content: string;
  frontmatter: BlogFrontmatter;
};

let frontmatterLoadCount = 0;
let cacheGeneration = 0;

async function walkMdx(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string) {
    let entries: Dirent[];
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (error) {
      console.error(`[blog-data] Failed to read directory: ${current}`, error);
      return;
    }

    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const abs = path.join(current, e.name);
      if (e.isDirectory()) {
        await walk(abs);
      } else if (e.isFile() && e.name.endsWith(".mdx")) {
        out.push(abs);
      }
    }
  }
  await walk(dir);
  return out;
}

async function loadAllMdxFrontmatter(): Promise<CachedEntry[]> {
  const files = await walkMdx(POSTS_ROOT);
  if (!files.length) return [];

  const posts = await Promise.all(
    files.map(async (abs) => {
      try {
        const raw = await fs.readFile(abs, "utf8");
        const parsed = matter(raw); // { content, data }
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
        } satisfies CachedEntry;
      } catch (error) {
        console.error(`[blog-data] Failed to read or parse file: ${abs}`, error);
        return null;
      }
    })
  );

  return posts.filter(Boolean) as CachedEntry[];
}

function createCachedFrontmatterReader() {
  const cacheKey = `blog-data:frontmatter:${cacheGeneration}`;
  let fallbackMemo: Promise<CachedEntry[]> | null = null;

  const loader = async () => {
    frontmatterLoadCount += 1;
    try {
      return await loadAllMdxFrontmatter();
    } catch (error) {
      console.error("[blog-data] Failed to load MDX frontmatter", error);
      return [];
    }
  };

  const cached = unstable_cache(loader, [cacheKey], { revalidate: false });

  return async () => {
    try {
      return await cached();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("incrementalCache missing")
      ) {
        if (!fallbackMemo) {
          fallbackMemo = loader().catch((err) => {
            fallbackMemo = null;
            throw err;
          });
        }
        return await fallbackMemo;
      }
      throw error;
    }
  };
}

let readAllMdxFrontmatter = createCachedFrontmatterReader();

async function getCachedFrontmatter() {
  return readAllMdxFrontmatter();
}

export function __dangerous__resetBlogCacheForTests() {
  cacheGeneration += 1;
  readAllMdxFrontmatter = createCachedFrontmatterReader();
  frontmatterLoadCount = 0;
}

export function __dangerous__getFrontmatterLoadCount() {
  return frontmatterLoadCount;
}

// ---- Public API --------------------------------------------

// Flat list for listings (newest first by date)
export async function getAllPosts(): Promise<BlogListItem[]> {
  const entries = await getCachedFrontmatter();
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

  return items
    .slice()
    .sort((a, b) => {
      const ad = a.date ? Date.parse(a.date) : 0;
      const bd = b.date ? Date.parse(b.date) : 0;
      return bd - ad;
    });
});

export async function getAllPostSlugs(): Promise<string[]> {
  const list = await getAllPosts();
  return list.map((p) => p.slug);
}

export async function getPostBySlug(slug: string) {
  const entries = await getCachedFrontmatter();
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
  try {
    const raw = await fs.readFile(CATEGORIES_JSON, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray((parsed as { categories?: unknown }).categories)) {
      return (parsed as { categories: unknown[] }).categories as {
        slug: string;
        name: string;
        description?: string;
        feature_calculator?: string;
      }[];
    }
  } catch (error) {
    console.error("[blog-data] Failed to read categories", error);
  }
  return [];
}
