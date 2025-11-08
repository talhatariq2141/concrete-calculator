import { getAllPosts } from "@/lib/blog-data";
import { generateRssFeed } from "@/lib/feed";

export const revalidate = 3600; // cache feed for 1 hour

export async function GET() {
  const posts = await getAllPosts();
  const xml = generateRssFeed(posts);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
