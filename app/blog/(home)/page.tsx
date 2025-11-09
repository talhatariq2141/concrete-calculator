// app/blog/(home)/page.tsx

import Link from "next/link";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { getAllPosts, getCategories } from "@/lib/blog-data";
import { stringifyJsonLd } from "@/lib/jsonLd";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Concrete Calculator Max",
  description:
    "Guides, tutorials, and formulas for concrete calculations. Explore categories like Slab, Column, Beam, Wall, Tank/Trench, and Staircase.",
};

export default async function BlogHomePage() {
  const [categories, posts] = await Promise.all([getCategories(), getAllPosts()]);

  // Group posts by category (newest first already handled in getAllPosts)
  const grouped = categories.map((cat) => ({
    ...cat,
    items: posts.filter((p) => p.category === cat.slug).slice(0, 5),
  }));

  // CollectionPage JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Concrete Calculator Blog",
    description:
      "Guides, tutorials, and formulas for concrete calculations across slab, column, beam, wall, tank/trench, and staircase categories.",
    url: "https://concretecalculatormax.com/blog",
    hasPart: grouped.map((cat) => ({
      "@type": "CollectionPage",
      name: cat.name,
      url: `https://concretecalculatormax.com/blog/category/${cat.slug}`,
    })),
  };

  return (
    <main className="min-h-[70vh]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-poppins tracking-tight">
            Concrete Calculator Blog
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Practical, field-tested guides for calculating concrete volume, mix, yardage, and more.
            Each article links to the exact calculator you need.
          </p>
          <div className="mt-6">
            <Link
              href="#categories"
              className="inline-flex items-center font-medium text-teal-600 hover:text-teal-700"
            >
              Browse all categories →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.length === 0 ? (
            <Card className="border-slate-200 bg-white p-6">
              <p className="text-slate-600">No categories found. Add items to <code>content/blog/categories.json</code>.</p>
            </Card>
          ) : (
            grouped.map((cat) => <CategoryCard key={cat.slug} cat={cat} />)
          )}
        </div>
      </section>
    </main>
  );
}

/* =========================
   Components (local)
   ========================= */

function CategoryCard({
  cat,
}: {
  cat: {
    slug: string;
    name: string;
    description?: string;
    items: Array<{
      slug: string;
      title: string;
      date: string;
    }>;
  };
}) {
  return (
    <Card className="border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 font-poppins">{cat.name}</h2>
          {cat.description ? (
            <p className="mt-1 text-sm text-slate-600">{cat.description}</p>
          ) : null}
        </div>
        <Link
          href={`/blog/category/${cat.slug}`}
          className="shrink-0 text-sm font-medium text-teal-600 hover:text-teal-700"
          aria-label={`Show more posts in ${cat.name}`}
        >
          Show more →
        </Link>
      </div>

      <ul className="mt-4 space-y-2.5">
        {cat.items.length === 0 ? (
          <li className="text-sm text-slate-500">No posts in this category yet.</li>
        ) : (
          cat.items.map((post) => <PostListItem key={post.slug} post={post} />)
        )}
      </ul>
    </Card>
  );
}

function PostListItem({
  post,
}: {
  post: { slug: string; title: string; date: string };
}) {
  const date = safeDate(post.date);
  return (
    <li className="flex items-baseline justify-between gap-3">
      <Link
        href={`/blog/${post.slug}`}
        className="text-sm font-medium text-slate-800 hover:text-teal-700"
      >
        {post.title}
      </Link>
      <time
        dateTime={date?.toISOString() ?? post.date}
        className="text-[12px] text-slate-500 whitespace-nowrap"
        title={date ? date.toDateString() : undefined}
      >
        {date ? formatShort(date) : post.date}
      </time>
    </li>
  );
}

/* =========================
   Small date helpers
   ========================= */
function safeDate(input: string) {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}
function formatShort(d: Date) {
  // e.g., Oct 29, 2025
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
