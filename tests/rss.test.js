require("./helpers/register-ts");

const test = require("node:test");
const assert = require("node:assert/strict");

const { generateRssFeed } = require("../lib/feed");
const { getAllPosts } = require("../lib/blog-data");
const { GET } = require("../app/rss.xml/route");

const BLOG_URL = "https://concretecalculatormax.com/blog";

test("generateRssFeed produces an RSS channel", async () => {
  const posts = await getAllPosts();
  const sample = posts.slice(0, 3);
  const xml = generateRssFeed(sample);

  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<rss version="2.0"/);
  assert.match(xml, /<channel>/);
  assert.ok(xml.includes(`<atom:link href="https://concretecalculatormax.com/rss.xml"`));

  if (sample.length) {
    const first = sample[0];
    assert.ok(
      xml.includes(`<link>${BLOG_URL}/${first.slug}</link>`),
      "First post link should be present"
    );
    if (first.excerpt) {
      assert.ok(
        xml.includes(first.excerpt.slice(0, 10)),
        "Excerpt snippet should appear in description"
      );
    }
  }
});

test("RSS route responds with cached feed", async () => {
  const posts = await getAllPosts();
  const response = await GET();
  assert.equal(
    response.headers.get("content-type"),
    "application/rss+xml; charset=utf-8"
  );
  const body = await response.text();
  assert.match(body, /<rss version="2.0"/);
  const items = (body.match(/<item>/g) || []).length;
  assert.equal(items, posts.length);
  assert.ok(
    body.includes(`<link>${BLOG_URL}</link>`),
    "Channel link should point to blog home"
  );
});
