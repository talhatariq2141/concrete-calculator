import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";

export const metadata: Metadata = {
metadataBase: new URL("https://concretecalculatormax.com"),
  title: {
    default: "Concrete Calculator Max",
    template: "%s — Concrete Calculator Max",
  },
  description:
    "Fast, accurate concrete volume, mix, weight, cost, and reinforcement calculators.",
  openGraph: {
    type: "website",
    siteName: "Concrete Calculator Mas",
    url: "https://concretecalculatormax.com",
    images: [{ url: "/og/default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@YourHandle", // optional
    creator: "@YourHandle", // optional
    images: ["/og/default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">      
      <body>
        <div className="min-h-screen bg-slate-900">        
          <Header />
            {children}
          <Footer />        
        </div>

        {/* Site JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://concretecalculatormax.com",
              "name": "Concrete Calculator Max",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://concretecalculatormax.com/search?q={query}",
                "query-input": "required name=query"
              },
              "publisher": { "@type": "Organization", "name": "Concrete Calculator Max" }
            }),
          }}
        />

      </body>
    </html>
  );
}
