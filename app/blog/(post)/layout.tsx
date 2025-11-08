// app/blog/(post)/layout.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { ClientTOC } from "@/components/blog/ClientTOC";
import { stringifyJsonLd } from "@/lib/jsonLd";

export const metadata: Metadata = {
  title: {
    default: "Concrete Calculator Blog — Articles & Tutorials",
    template: "%s — Concrete Calculator Blog",
  },
  description:
    "In-depth articles, formulas, and tutorials for concrete volume, mix, and cost calculations — by Concrete Calculator Max.",
  openGraph: {
    type: "website",
    url: "https://concretecalculatormax.com/blog",
    title: "Concrete Calculator Blog — Articles & Tutorials",
    description:
      "Guides and tutorials for concrete calculation and estimation across slabs, beams, columns, and more.",
    images: [
      {
        url: "/og/blog-home.png",
        width: 1200,
        height: 630,
        alt: "Concrete Calculator Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Calculator Blog — Articles & Tutorials",
    description:
      "Guides and tutorials for concrete calculation and estimation across slabs, beams, columns, and more.",
    images: ["/og/blog-home.png"],
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Calculator Blog — Post",
    description:
      "Concrete Calculator Max — professional insights, tutorials, and formulas for concrete calculation.",
    url: "https://concretecalculatormax.com/blog",
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-poppins">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />

      {/* Light Header */}
      <Header variant="light" />

      {/* ── Main container ─────────────────────────────── */}
      <main className="mx-auto max-w-[1280px] px-2 sm:px-6 lg:px-4 py-4">
        
        {/* --- 3-column layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[250px_minmax(0,1fr)_280px] gap-5">
          {/* LEFT: Sticky TOC (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-10">
              <div className=" border-r border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Table of Contents
                </p>
                <ClientTOC containerSelector="#post-content" />
              </div>
            </div>
          </aside>

          {/* CENTER: Article (children) */}
          <section id="article-content" className="min-w-0">
            {children}
          </section>

          {/* RIGHT: Sidebar */}
          <aside className="hidden md:block">
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900 mb-3">
                  Quick links
                </p>
                <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-teal-600 hover:text-teal-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/calculators" className="text-teal-600 hover:text-teal-700">
                    All Calculators
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-teal-600 hover:text-teal-700">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-teal-600 hover:text-teal-700">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-teal-600 hover:text-teal-700">
                    Terms of Service
                  </Link>
                </li>
              </ul>
              </div>

              {/* Ad / Widget */}
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Sponsored
                </p>
                <div className="h-40 w-full bg-slate-100 grid place-items-center text-slate-500 text-xs rounded">
                  Ad / Widget
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Light Footer */}
      <Footer variant="light" />
    </div>
  );
}
