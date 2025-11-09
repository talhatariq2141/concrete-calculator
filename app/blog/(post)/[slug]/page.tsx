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

import { ClientTOC } from "@/components/blog/ClientTOC";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog-data";

type SiloCalculator = {
  title: string;
  href: string;
  description: string;
};

const SILO_CALCULATORS: Record<string, SiloCalculator[]> = {
  slab: [
    {
      title: "Slab Concrete Calculator",
      href: "/calculators/slab-concrete-calculator#how-to-use",
      description: "Jump to the how-to steps for slab pours and waste planning.",
    },
    {
      title: "Concrete Bag Calculator",
      href: "/calculators/concrete-bag-calculator#how-to-use",
      description: "Translate slab volumes into bag counts without guesswork.",
    },
    {
      title: "Concrete Yards Calculator",
      href: "/calculators/concrete-yards-calculator#how-to-use",
      description: "Convert area and thickness into cubic yards before ordering.",
    },
  ],
  beam: [
    {
      title: "Beam Concrete Calculator",
      href: "/calculators/beam-concrete-calculator#how-to-use",
      description: "Review the workflow for beams with haunches or voids.",
    },
    {
      title: "Column Concrete Calculator",
      href: "/calculators/column-concrete-calculator#how-to-use",
      description: "Plan companion columns or posts tied into your beam design.",
    },
    {
      title: "Concrete Bag Calculator",
      href: "/calculators/concrete-bag-calculator#how-to-use",
      description: "Jump to the bag conversion steps for smaller beam pours.",
    },
  ],
  column: [
    {
      title: "Column Concrete Calculator",
      href: "/calculators/column-concrete-calculator#how-to-use",
      description: "Follow the column checklist for square or round shafts.",
    },
    {
      title: "Pier / Caisson Calculator",
      href: "/calculators/pier-caisson-concrete-calculator#how-to-use",
      description: "Use the pier workflow when columns continue below grade.",
    },
    {
      title: "Concrete Bag Calculator",
      href: "/calculators/concrete-bag-calculator#how-to-use",
      description: "Translate column volumes into precise bag totals instantly.",
    },
  ],
  wall: [
    {
      title: "Wall Concrete Calculator",
      href: "/calculators/wall-concrete-calculator#how-to-use",
      description: "Jump to the wall calculator steps covering openings and waste.",
    },
    {
      title: "Footing Concrete Calculator",
      href: "/calculators/footing-concrete-calculator#how-to-use",
      description: "Review footing guidance for stem walls and retaining runs.",
    },
    {
      title: "Concrete Bag Calculator",
      href: "/calculators/concrete-bag-calculator#how-to-use",
      description: "Convert wall pours into manageable bag counts.",
    },
  ],
  "tank-trench": [
    {
      title: "Tank / Trench Concrete Calculator",
      href: "/calculators/tank-trench-concrete-calculator#how-to-use",
      description: "See the trench calculator workflow for benches and slopes.",
    },
    {
      title: "Footing Concrete Calculator",
      href: "/calculators/footing-concrete-calculator#how-to-use",
      description: "Use the footing steps for slab-on-grade trench bases.",
    },
    {
      title: "Concrete Yards Calculator",
      href: "/calculators/concrete-yards-calculator#how-to-use",
      description: "Quickly convert long runs into cubic yard totals.",
    },
  ],
  staircase: [
    {
      title: "Staircase Concrete Calculator",
      href: "/calculators/staircase-concrete-calculator#how-to-use",
      description: "Jump to the staircase how-to section for flights and landings.",
    },
    {
      title: "Concrete Bag Calculator",
      href: "/calculators/concrete-bag-calculator#how-to-use",
      description: "Plan bag counts for precast or cast-in-place stairs.",
    },
    {
      title: "Concrete Yards Calculator",
      href: "/calculators/concrete-yards-calculator#how-to-use",
      description: "Check yardage for stair pads and approaches.",
    },
  ],
  "concrete-bags": [
    {
      title: "Concrete Bag Calculator",
      href: "/calculators/concrete-bag-calculator#how-to-use",
      description: "Skip straight to the how-to workflow for bag conversions.",
    },
    {
      title: "Concrete Yards Calculator",
      href: "/calculators/concrete-yards-calculator#how-to-use",
      description: "Use the yards calculator steps before converting to bags.",
    },
    {
      title: "Slab Concrete Calculator",
      href: "/calculators/slab-concrete-calculator#how-to-use",
      description: "Validate slab volumes before you buy bags.",
    },
  ],
};

const SILO_ALIASES: Record<string, keyof typeof SILO_CALCULATORS> = {
  "concrete-slab": "slab",
};

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

  const rawSiloKey =
    (frontmatter.silo as string | undefined) ?? (category as string | undefined);
  const normalizedSiloKey = rawSiloKey
    ? (SILO_ALIASES[rawSiloKey] ?? rawSiloKey)
    : undefined;
  const siloCalculators =
    normalizedSiloKey && normalizedSiloKey in SILO_CALCULATORS
      ? SILO_CALCULATORS[normalizedSiloKey]
      : undefined;

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

      {siloCalculators && siloCalculators.length ? (
        <section className="mt-12 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            In this silo
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Jump straight into the calculators that expand on this topic.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {siloCalculators.map((item) => (
              <li key={item.href} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <Link
                  href={item.href}
                  className="text-teal-700 hover:text-teal-800 font-semibold"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-slate-600 mt-2">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
