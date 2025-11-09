// app/layout.tsx

import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/app/theme-provider";
import { JetBrains_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Load both fonts with CSS variable bindings
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

/**
 * SEO: cleaned global metadata (fixed siteName, removed placeholders),
 * added robots hints, solid OG/Twitter defaults. Keep images lightweight.
 */
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
    siteName: "Concrete Calculator Max", // fixed label
    url: "https://concretecalculatormax.com",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Concrete Calculator Max" }],
  },
  twitter: {
    card: "summary_large_image",
    // TODO: set your real handle(s) instead of placeholders or delete these two keys
    site: "@Concretecalcmax",
    creator: "@Concretecalcmax",
    images: ["/og/default.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressContentEditableWarning
      className={`${jetbrains.variable} ${poppins.variable}`}
    >
      <head>
        {/* JSON-LD (WebSite + SearchAction) — site-level entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://concretecalculatormax.com/#website",
              url: "https://concretecalculatormax.com",
              name: "Concrete Calculator Max",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://concretecalculatormax.com/search?q={query}",
                "query-input": "required name=query",
              },
              publisher: { "@type": "Organization", name: "Concrete Calculator Max" },
            }),
          }}
        />
        {/* JSON-LD Organization profile for E-E-A-T signals */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://concretecalculatormax.com/#organization",
              name: "Concrete Calculator Max",
              url: "https://concretecalculatormax.com",
              logo: "https://concretecalculatormax.com/og/logo.png",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "info@concretecalculatormax.com",
                  availableLanguage: ["en"],
                },
              ],
              sameAs: [],
            }),
          }}
        />

        {/* Ahrefs Analytics (keep async) */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="AC8Pc7sS5c2kpF5jtd2qKw"
          async
        />

        {/* Bing / MS validation */}
        <meta name="msvalidate.01" content="1CD2FCEA3D1A7CE25462E9DDC3234B05" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <Header />
          {children}
          <Footer />

        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
      {/* GA4 tag (single instance site-wide) */}
      <GoogleAnalytics gaId="G-3KLHD7BGFD" />
    </html>
  );
}
