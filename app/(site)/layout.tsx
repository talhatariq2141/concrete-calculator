// app/(site)/layout.tsx
import type { Metadata } from "next";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";

export const metadata: Metadata = {
  // Section defaults for non-blog pages (home, calculators, legal, etc.)
  title: {
    default: "Concrete Calculator Max – Free Concrete Volume & Bag Calculators",
    template: "%s — Concrete Calculator Max",
  },
  description:
    "Instant concrete volume, mix ratio, and cost calculators for slabs, beams, columns, walls, tanks, trenches, and more.",
  openGraph: {
    type: "website",
    url: "https://concretecalculatormax.com",
    title: "Concrete Calculators — Concrete Calculator Max",
    description:
      "Free, fast concrete calculators with precise formulas and unit conversions.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Concrete Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Calculators — Concrete Calculator Max",
    description:
      "Free, fast concrete calculators with precise formulas and unit conversions.",
    images: ["/og/calculators.png"],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // Optional: section-level WebPage JSON-LD (kept minimal)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Calculators",
    description:
      "Collection of tools for calculating concrete volume, mix ratio, and cost.",
    url: "https://concretecalculatormax.com/",
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Dark site shell for all non-blog routes */}
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
