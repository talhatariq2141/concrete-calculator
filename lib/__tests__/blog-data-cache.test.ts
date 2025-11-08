import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";

const CATEGORIES_JSON = path.join(
  process.cwd(),
  "content/blog/categories.json"
);

test("getAllPosts caches parsed frontmatter", async () => {
  const {
    getAllPosts,
    __dangerous__resetBlogCacheForTests,
    __dangerous__getFrontmatterLoadCount,
  } = await import("../blog-data.ts");

  __dangerous__resetBlogCacheForTests();
  assert.equal(__dangerous__getFrontmatterLoadCount(), 0);

  const first = await getAllPosts();
  const afterFirst = __dangerous__getFrontmatterLoadCount();

  assert.ok(afterFirst >= 1, "initial call should populate the cache");

  const second = await getAllPosts();
  const afterSecond = __dangerous__getFrontmatterLoadCount();

  assert.deepStrictEqual(second, first);
  assert.equal(afterSecond, afterFirst, "cache should prevent reloading MDX");
});

test("getPostBySlug shares cached MDX entries", async () => {
  const {
    getAllPosts,
    getPostBySlug,
    __dangerous__resetBlogCacheForTests,
    __dangerous__getFrontmatterLoadCount,
  } = await import("../blog-data.ts");

  const slug = (await getAllPosts())[0]?.slug;
  assert(slug, "expected at least one post to derive a slug");

  __dangerous__resetBlogCacheForTests();
  assert.equal(__dangerous__getFrontmatterLoadCount(), 0);

  const first = await getPostBySlug(slug);
  assert(first, "expected a post to be returned for the test slug");
  const afterFirst = __dangerous__getFrontmatterLoadCount();

  const second = await getPostBySlug(slug);
  assert(second, "expected cached post data on repeated call");
  const afterSecond = __dangerous__getFrontmatterLoadCount();

  assert.equal(
    afterFirst,
    1,
    "first slug lookup should trigger a single frontmatter load"
  );
  assert.equal(
    afterSecond,
    afterFirst,
    "repeated slug lookups should reuse cached frontmatter"
  );
});

test("getCategories returns a safe fallback when the file read fails", async () => {
  const { getCategories } = await import("../blog-data.ts");

  const tempPath = `${CATEGORIES_JSON}.bak`;
  await fs.rename(CATEGORIES_JSON, tempPath);

  try {
    const categories = await getCategories();
    assert.deepStrictEqual(categories, []);
  } finally {
    await fs.rename(tempPath, CATEGORIES_JSON);
  }
});
