// app/blog/(post)/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { ClientTOCWidget } from "@/components/blog/ClientTOCWidget";
import {
  getAllPostSlugs,
  getPostBySlug,
  getRelatedByCategory,
} from "@/lib/blog-data";

// SSG: discover all slugs (now recursive)
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

const SITE_URL = "https://concretecalculatormax.com";

function absoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  const { title, excerpt, cover } = post.frontmatter;
  const url = `${SITE_URL}/blog/${params.slug}`;
  const desc = excerpt || "Concrete calculation tutorial and guide.";
  const imageUrl = absoluteUrl(cover);

  return {
    title: `${title} — Concrete Calculator Blog`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: "Concrete Calculator Max",
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      creator: "@ConcreteCalcMax",
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const { frontmatter, content } = post;
  const date = frontmatter.date ? new Date(frontmatter.date) : null;
  const category = (frontmatter.category as string | undefined) || undefined;

  const categoryLabel =
    category?.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  const wordCount = content
    .replace(/<[\s\S]*?>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const datePublished =
    typeof frontmatter.date === "string" ? frontmatter.date : undefined;
  const modifiedCandidates = ["updated", "modified", "dateModified", "lastmod"].map(
    (key) => frontmatter[key] as unknown
  );
  const dateModified = (modifiedCandidates.find(
    (value): value is string => typeof value === "string"
  ) || datePublished) as string | undefined;

  const authorName =
    typeof frontmatter["author"] === "string"
      ? (frontmatter["author"] as string)
      : "Concrete Calculator Max Team";
  const keywordsValue = Array.isArray(frontmatter["tags"])
    ? (frontmatter["tags"] as unknown[])
        .filter((tag): tag is string => typeof tag === "string")
        .join(", ")
    : typeof frontmatter["keywords"] === "string"
    ? (frontmatter["keywords"] as string)
    : undefined;

  const articleEntity = {
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    image: absoluteUrl(frontmatter.cover),
    author: {
      "@type": "Organization",
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Concrete Calculator Max",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${params.slug}`,
    },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(keywordsValue ? { keywords: keywordsValue } : {}),
  };

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Blog",
      item: `${SITE_URL}/blog`,
    },
  ];

  if (category) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: breadcrumbItems.length + 1,
      name: categoryLabel ?? category,
      item: `${SITE_URL}/blog/category/${category}`,
    });
  }

  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: frontmatter.title,
    item: `${SITE_URL}/blog/${frontmatter.slug}`,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      articleEntity,
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-2 py-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <ol className="flex gap-2 flex-wrap">
          <li>
            <Link href="/blog" className="hover:text-teal-700">
              Blog
            </Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/blog/category/${category}`}
                  className="hover:text-teal-700"
                >
                  {categoryLabel}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li aria-current="page" className="text-slate-700">
            {frontmatter.title}
          </li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-poppins">
        {frontmatter.title}
      </h1>

      {/* Meta */}
      {date && (
        <p className="text-sm text-slate-500 mt-2">
          {date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {/* Cover */}
      {frontmatter.cover && (
        <div className="mt-6 mb-8 relative h-64 sm:h-80 w-full rounded-lg overflow-hidden">
          <Image
            src={frontmatter.cover}
            alt={frontmatter.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* Mobile TOC */}
      <div className="md:hidden mb-6 rounded-lg border border-slate-200 bg-white">
        <details>
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900">
            Table of Contents
          </summary>
        </details>
        <div className="px-4 pb-3">
          <ClientTOCWidget containerSelector="#post-content" />
        </div>
      </div>

      {/* MDX */}
      <div
        id="post-content"
        className="prose prose-slate max-w-none prose-headings:font-poppins prose-h2:text-2xl sm:prose-h2:text-3xl prose-h3:text-xl sm:prose-h3:text-2xl"
      >
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkMath],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                rehypeKatex,
              ],
            },
          }}
        />
      </div>

      {/* In this silo */}
      {/* {category && related.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            In this silo
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {related.slice(0, 6).map((r) => (
              <li key={r.slug} className="rounded border border-slate-200 p-3">
                <Link
                  href={`/blog/${r.slug}`}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  {r.title}
                </Link>
                {r.excerpt ? (
                  <p className="text-sm text-slate-600 mt-1">{r.excerpt}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500">
            Need a quick result? Try the{" "}
            <Link
              href="/calculators/concrete-bag-calculator"
              className="underline"
            >
              Concrete Bags Calculator
            </Link>
            .
          </p>
        </section>
      )} */}
    </article>
  );
}
