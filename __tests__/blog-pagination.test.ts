import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCategoryPagination,
  categoryPagePath,
  categoryPageUrl,
} from "../lib/blog-pagination";

test("categoryPagePath omits query for first page", () => {
  assert.equal(categoryPagePath("mix", 1), "/blog/category/mix");
});

test("categoryPagePath appends query for subsequent pages", () => {
  assert.equal(
    categoryPagePath("mix", 3),
    "/blog/category/mix?page=3",
  );
});

test("categoryPageUrl builds absolute URLs", () => {
  assert.equal(
    categoryPageUrl("mix", 2),
    "https://concretecalculatormax.com/blog/category/mix?page=2",
  );
});

test("buildCategoryPagination exposes canonical/prev/next navigation", () => {
  const pagination = buildCategoryPagination({
    slug: "mix",
    page: 2,
    totalPosts: 25,
    perPage: 9,
  });

  assert.equal(
    pagination.canonical,
    "https://concretecalculatormax.com/blog/category/mix?page=2",
  );
  assert.equal(
    pagination.prev,
    "https://concretecalculatormax.com/blog/category/mix",
  );
  assert.equal(
    pagination.next,
    "https://concretecalculatormax.com/blog/category/mix?page=3",
  );
  assert.equal(pagination.totalPages, 3);
  assert.equal(pagination.currentPage, 2);
  assert.equal(pagination.isPageWithinRange, true);
});

test("buildCategoryPagination detects final page", () => {
  const pagination = buildCategoryPagination({
    slug: "mix",
    page: 3,
    totalPosts: 25,
    perPage: 9,
  });

  assert.equal(pagination.next, undefined);
  assert.equal(pagination.totalPages, 3);
});

test("buildCategoryPagination flags out-of-range pages", () => {
  const pagination = buildCategoryPagination({
    slug: "mix",
    page: 9,
    totalPosts: 5,
    perPage: 5,
  });

  assert.equal(pagination.isPageWithinRange, false);
  assert.equal(pagination.totalPages, 1);
});

test("buildCategoryPagination is deterministic", () => {
  const left = buildCategoryPagination({
    slug: "mix",
    page: 2,
    totalPosts: 18,
    perPage: 9,
  });
  const right = buildCategoryPagination({
    slug: "mix",
    page: 2,
    totalPosts: 18,
    perPage: 9,
  });

  assert.deepEqual(left, right);
});
