import { BlogListItem } from "./blog-data";

const SITE_URL = "https://concretecalculatormax.com";
const BLOG_URL = `${SITE_URL}/blog`;
export const FEED_URL = `${SITE_URL}/rss.xml`;

function toCdata(value: string) {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toUTCString();
}

export function generateRssFeed(posts: BlogListItem[]): string {
  const items = posts
    .map((post) => {
      const link = `${BLOG_URL}/${post.slug}`;
      const pubDate = post.date ? formatDate(post.date) : "";
      const description = post.excerpt ? `      <description>${toCdata(post.excerpt)}</description>\n` : "";

      return [
        "    <item>",
        `      <title>${toCdata(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink=\"true\">${link}</guid>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        description,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const latestDate = posts.find((p) => p.date)?.date;
  const lastBuildDate = latestDate ? formatDate(latestDate) : new Date().toUTCString();

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${toCdata("Concrete Calculator Blog")}</title>`,
    `    <link>${BLOG_URL}</link>`,
    `    <description>${toCdata("Guides and tutorials for concrete calculation and estimation.")}</description>`,
    `    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    "    <language>en-US</language>",
    items,
    "  </channel>",
    "</rss>",
  ]
    .filter(Boolean)
    .join("\n");
}
