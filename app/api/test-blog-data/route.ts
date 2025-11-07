import { NextResponse } from "next/server";
import { getAllPosts, getCategories } from "@/lib/blog-data";

export async function GET() {
  const categories = await getCategories();
  const posts = await getAllPosts();
  return NextResponse.json({ categories, posts });
}
