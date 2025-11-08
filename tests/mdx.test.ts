import assert from "node:assert";
import fs from "node:fs/promises";
import { mock, test } from "node:test";

import * as blogData from "../lib/blog-data";
import * as mdx from "../lib/mdx";

const missingPath = `/tmp/concrete-calculator-missing-${Date.now()}`;

test("walkMdxFiles returns an empty list when the directory is missing", async () => {
  const errorSpy = mock.method(console, "error", () => {});
  const result = await mdx.walkMdxFiles(missingPath);
  assert.deepStrictEqual(result, []);
  assert.strictEqual(errorSpy.mock.callCount(), 1);
  errorSpy.mock.restore();
});

test("getCategories returns an empty array when JSON is invalid", async () => {
  const readMock = mock.method(fs, "readFile", async () => "not valid json");
  const errorSpy = mock.method(console, "error", () => {});

  const categories = await blogData.getCategories();

  assert.deepStrictEqual(categories, []);
  assert.ok(errorSpy.mock.callCount() >= 1);

  readMock.mock.restore();
  errorSpy.mock.restore();
});

test("getAllPosts ignores files that fail to read", async () => {
  const fakePath = "/fake/path/post-a.mdx";
  const walkMock = mock.method(mdx, "walkMdxFiles", async () => [fakePath]);
  const readMock = mock.method(fs, "readFile", async (file: unknown) => {
    if (typeof file === "string" && file === fakePath) {
      throw new Error("boom");
    }
    return "";
  });
  const errorSpy = mock.method(console, "error", () => {});

  const posts = await blogData.getAllPosts();

  assert.deepStrictEqual(posts, []);
  assert.ok(errorSpy.mock.callCount() >= 1);

  walkMock.mock.restore();
  readMock.mock.restore();
  errorSpy.mock.restore();
});
