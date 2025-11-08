// lib/blog-data.ts
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

type RequiredFrontmatterFields = "title" | "slug" | "excerpt";

const REQUIRED_FIELDS: RequiredFrontmatterFields[] = [
  "title",
  "slug",
  "excerpt",
];

const ALLOWED_COVER_HOSTS = new Set([
  "concretecalculatormax.com",
  "www.concretecalculatormax.com",
  "images.concretecalculatormax.com",
]);

function validateFrontmatter(
  frontmatter: BlogFrontmatter
): asserts frontmatter is BlogFrontmatter & {
  [K in RequiredFrontmatterFields]: string;
} {
  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = frontmatter[field];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required frontmatter field(s): ${missing.join(", ")}`
    );
  }

  if (typeof frontmatter.cover === "string" && frontmatter.cover.trim() !== "") {
    const coverValue = frontmatter.cover.trim();

    if (coverValue.startsWith("/")) {
      if (coverValue.includes("..")) {
        throw new Error(
          "Cover image path must not contain parent directory segments"
        );
      }
    } else {
      let url: URL;
      try {
        url = new URL(coverValue);
      } catch (error) {
        throw new Error(
          `Cover image must be a relative path or a valid HTTPS URL (${error})`
        );
      }

      if (url.protocol !== "https:") {
        throw new Error("Cover image URL must use https scheme");
      }

      if (!ALLOWED_COVER_HOSTS.has(url.hostname)) {
        throw new Error(
          `Cover image host \"${url.hostname}\" is not in the allowed list`
        );
      }
    }
  }
}

// ---- Paths -------------------------------------------------
const POSTS_ROOT = path.join(process.cwd(), "content/blog/posts");
const CATEGORIES_JSON = path.join(process.cwd(), "content/blog/categories.json");

// ---- Types (loose enough to match MDX front-matter) --------
export type BlogFrontmatter = {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  cover?: string;       // e.g. "/images/blog/your-image.png"
  category?: string;    // e.g. "concrete-bags"
  silo?: string;
  calculator?: string;  // e.g. "concrete-bags"
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
async function walkMdx(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true });
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

// ---- Internal: read all posts (front-matter + content optionally)
async function readAllMdxFrontmatter() {
  const files = await walkMdx(POSTS_ROOT);
  const posts = await Promise.all(
    files.map(async (abs) => {
      const relPath = path.relative(POSTS_ROOT, abs);

      try {
        const raw = await fs.readFile(abs, "utf8");
        const parsed = matter(raw); // { content, data }
        const fm = parsed.data as BlogFrontmatter;

        if (typeof fm.cover === "string") {
          fm.cover = fm.cover.trim();
        }

        // Normalize cover path: must not include /public prefix
        if (fm.cover && fm.cover.startsWith("/public/")) {
          fm.cover = fm.cover.replace(/^\/public/, "");
        }

        validateFrontmatter(fm);

        return {
          absPath: abs,
          content: parsed.content,
          frontmatter: fm,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown frontmatter error";
        throw new Error(`Invalid frontmatter in ${relPath}: ${message}`);
      }
    })
  );

  return posts;
}

// ---- Public API --------------------------------------------

// Flat list for listings (newest first by date)
export async function getAllPosts(): Promise<BlogListItem[]> {
  const entries = await readAllMdxFrontmatter();
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
  const entries = await readAllMdxFrontmatter();
  const hit = entries.find((e) => e.frontmatter.slug === slug);
  if (!hit) return null;
  return { content: hit.content, frontmatter: hit.frontmatter };
}

export async function getPostsByCategory(categorySlug: string) {
  const all = await getAllPosts();
  const wanted = (categorySlug || "").toLowerCase();
  return all.filter(
    (p) => (p.category || "").toLowerCase() === wanted
  );
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
  const raw = await fs.readFile(CATEGORIES_JSON, "utf8");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.categories)) return parsed.categories;
  return [];
}
