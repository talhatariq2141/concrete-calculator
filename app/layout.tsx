import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { ThemeProvider } from "@/components/app/theme-provider";
import { JetBrains_Mono, Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Load both fonts with CSS variable bindings
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains", // must match the variable name in globals.css
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins", // must match globals.css variable
});

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
    <html 
        lang="en"
        suppressContentEditableWarning 
        className={`${jetbrains.variable} ${poppins.variable}`}
        >
      <head>
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

        {/* Ahref Analytics Script */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="AC8Pc7sS5c2kpF5jtd2qKw" async></script>

      </head>      
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <div className="min-h-screen bg-slate-900">        
            <Header />
              {children}
            <Footer />        
          </div>        
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        
      </body>
    </html>
  );
}
