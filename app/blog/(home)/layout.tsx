// app/blog/(home)/layout.tsx

import type { Metadata } from "next";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";

export const metadata: Metadata = {
  title: {
    default: "Concrete Calculator Blog",
    template: "%s | Concrete Calculator Blog",
  },
  description:
    "Guides, tutorials, and concrete calculation formulas for slabs, columns, beams, walls, and more.",
  alternates: {
    canonical: "https://concretecalculatormax.com/blog",
  },
  openGraph: {
    type: "website",
    url: "https://concretecalculatormax.com/blog",
    title: "Concrete Calculator Blog",
    description:
      "Practical concrete calculation guides, examples, and how-tos — by Concrete Calculator Max.",
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
    title: "Concrete Calculator Blog",
    description:
      "Guides, tutorials, and how-tos for concrete calculation and estimation.",
    images: ["/og/blog-home.png"],
  },
};

export default function BlogHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-poppins">
      {/* Light Header */}
      <Header variant="light" />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Light Footer */}
      <Footer variant="light" />
    </div>
  );
}
