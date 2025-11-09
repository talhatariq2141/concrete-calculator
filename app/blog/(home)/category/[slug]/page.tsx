// app/blog/(home)/category/[slug]/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getCategories, getPostsByCategory } from "@/lib/blog-data";
import {
  buildCategoryPagination,
  categoryPagePath,
} from "@/lib/blog-pagination";
import { stringifyJsonLd } from "@/lib/jsonLd";

export const revalidate = 300; // ISR refresh
const PER_PAGE = 9;

const SITE_URL = "https://concretecalculatormax.com";

type Params = { slug: string };
type SearchParams = { page?: string };

// Accept async request APIs
type PageProps = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

// ---- helpers ----
function toIntPage(input?: string) {
  const n = Number(input ?? "1");
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}
function safeDate(input?: string) {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}
function formatShort(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// ---- Dynamic <head> metadata per category ----
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const page = toIntPage(searchParams.page);
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === params.slug);
  if (!cat) return { title: "Category Not Found" };

  const posts = await getPostsByCategory(cat.slug);
  const pagination = buildCategoryPagination({
    slug: cat.slug,
    page,
    totalPosts: posts.length,
    perPage: PER_PAGE,
  });

  if (!pagination.isPageWithinRange) {
    return { title: "Category Not Found" };
  }

  const titleBase = `${cat.name} — Concrete Calculator Blog`;
  const title = page > 1 ? `${titleBase} (Page ${page})` : titleBase;
  const description =
    cat.description ||
    `Articles and tutorials in the ${cat.name} category from Concrete Calculator Max.`;

  const paginationHints: Record<string, string> = {};
  if (pagination.prev) paginationHints["link:prev"] = pagination.prev;
  if (pagination.next) paginationHints["link:next"] = pagination.next;

  return {
    title,
    description,
    alternates: { canonical: pagination.canonical },
    other: Object.keys(paginationHints).length ? paginationHints : undefined,
    openGraph: {
      type: "website",
      url: pagination.canonical,
      title,
      description,
      siteName: "Concrete Calculator Max",
      images: [
        {
          url: `${SITE_URL}/og/blog-home.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@ConcreteCalcMax",
      images: [`${SITE_URL}/og/blog-home.png`],
    },
  };
}

// ---- Prebuild category routes ----
export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage(props: PageProps) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const page = toIntPage(searchParams.page);

  const [cats, allPosts] = await Promise.all([
    getCategories(),
    getPostsByCategory(params.slug),
  ]);

  const cat = cats.find((c) => c.slug === params.slug);
  if (!cat) return notFound();

  const pagination = buildCategoryPagination({
    slug: cat.slug,
    page,
    totalPosts: allPosts.length,
    perPage: PER_PAGE,
  });

  if (!pagination.isPageWithinRange) return notFound();

  const totalPages = pagination.totalPages;

  const start = (page - 1) * PER_PAGE;
  const posts = allPosts.slice(start, start + PER_PAGE);

  // JSON-LD CollectionPage for this category
  const itemListElement = posts.map((post, index) => ({
    "@type": "ListItem",
    position: start + index + 1,
    item: {
      "@type": "Article",
      name: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — Concrete Calculator Blog`,
    description:
      cat.description ||
      `Articles and tutorials in the ${cat.name} category from Concrete Calculator Max.`,
    url: pagination.canonical,
    itemListElement,
  };

  return (
    <main className="min-h-[70vh]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/blog" className="hover:text-teal-700">
                Blog
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li aria-current="page" className="text-slate-700">
              {cat.name}
            </li>
          </ol>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-poppins tracking-tight">
          {cat.name}
        </h1>
        {cat.description ? (
          <p className="mt-2 text-slate-600">{cat.description}</p>
        ) : null}
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <Pagination slug={cat.slug} page={page} totalPages={totalPages} />
        </section>
      )}

      {/* Featured Tool (silo hero) */}
      {cat.feature_calculator && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Featured Tool</h2>
            <p className="mt-1 text-slate-600">
              Need instant results? Use the{" "}
              <Link
                href={cat.feature_calculator}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Concrete Bags Calculator
              </Link>
              .
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

/* =========================
   Local UI pieces
   ========================= */

function EmptyState() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
      <p className="text-slate-700 font-medium">No posts yet.</p>
      <p className="text-slate-500 mt-1 text-sm">
        Please check back soon for new articles.
      </p>
      <div className="mt-4">
        <Link href="/blog" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}

function ArticleCard({
  post,
}: {
  post: {
    slug: string;
    title: string;
    excerpt?: string;
    date?: string;
    cover?: string;
  };
}) {
  const date = safeDate(post.date);

  return (
    <article className="rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {post.cover ? (
        <div className="relative h-40 w-full bg-slate-100">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      ) : null}

      <div className="p-5">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-teal-700">
            {post.title}
          </Link>
        </h2>

        <p className="mt-2 text-sm text-slate-600 line-clamp-3">
          {post.excerpt || "Read this article"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <time
            dateTime={date?.toISOString() ?? post.date}
            className="text-xs text-slate-500"
            title={date ? date.toDateString() : undefined}
          >
            {date ? formatShort(date) : post.date}
          </time>

          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
            aria-label={`Read: ${post.title}`}
          >
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Pagination({
  slug,
  page,
  totalPages,
}: {
  slug: string;
  page: number;
  totalPages: number;
}) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Show compact window of page numbers
  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      <PaginationLink
        href={pageUrl(slug, page - 1)}
        disabled={!hasPrev}
        className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
        activeClassName="border-slate-300 text-slate-700 hover:bg-slate-50"
        disabledClassName="border-slate-200 text-slate-300 cursor-not-allowed pointer-events-none"
      >
        ← Previous
      </PaginationLink>

      <ul className="flex items-center gap-1">
        {start > 1 && (
          <>
            <li>
              <Link
                href={categoryPagePath(slug, 1)}
                className="inline-flex min-w-9 justify-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                1
              </Link>
            </li>
            {start > 2 && <li className="px-2 text-slate-400 select-none">…</li>}
          </>
        )}

        {pages.map((p) =>
          p === page ? (
            <li key={p}>
              <span className="inline-flex min-w-9 justify-center rounded-md border border-teal-600 bg-teal-600 px-3 py-2 text-sm font-medium text-white">
                {p}
              </span>
            </li>
          ) : (
            <li key={p}>
              <Link
                href={categoryPagePath(slug, p)}
                className="inline-flex min-w-9 justify-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                aria-label={`Go to page ${p}`}
              >
                {p}
              </Link>
            </li>
          )
        )}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <li className="px-2 text-slate-400 select-none">…</li>}
            <li>
              <Link
                href={categoryPagePath(slug, totalPages)}
                className="inline-flex min-w-9 justify-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {totalPages}
              </Link>
            </li>
          </>
        )}
      </ul>

      <PaginationLink
        href={pageUrl(slug, page + 1)}
        disabled={!hasNext}
        className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
        activeClassName="border-slate-300 text-slate-700 hover:bg-slate-50"
        disabledClassName="border-slate-200 text-slate-300 cursor-not-allowed pointer-events-none"
      >
        Next →
      </PaginationLink>
    </nav>
  );
}

type PaginationLinkProps = {
  href: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  disabledClassName?: string;
};

function PaginationLink({
  href,
  disabled = false,
  children,
  className = "",
  activeClassName = "",
  disabledClassName = "",
}: PaginationLinkProps) {
  const classes = [className, disabled ? disabledClassName : activeClassName]
    .filter(Boolean)
    .join(" ");

  if (disabled) {
    return (
      <Link
        href="#"
        aria-disabled={true}
        tabIndex={-1}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className={classes}
        role="link"
        prefetch={false}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={classes} prefetch={false}>
      {children}
    </Link>
  );
}
