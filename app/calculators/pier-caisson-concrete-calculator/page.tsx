// app/calculators/pier-caisson-concrete-calculator/page.tsx
// -----------------------------------------------------------------------------
// Mirrors your other calculator SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PierCaissonCalc from "@/components/calculators/PierCaissonCalc";
import { Box } from "lucide-react";
import PierCaissonConcreteCalcArticle from "@/components/calculators/articles/PierCaissonConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Pier / Caisson Concrete Calculator — Concrete Calculator Max",
  "description":
    "Calculate concrete volume for cylindrical and belled-base piers/caissons. Includes unit switching (m³/yd³/ft³), quantity multipliers, waste allowance, and dry-volume guidance.",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator",
    "title": "Pier / Caisson Concrete Calculator",
    "description":
      "Compute concrete for piers and caissons (cylindrical + belled base) with waste and dry-volume options. m³/yd³ supported.",
    // Ensure this image exists (~1200×630, <200KB)
    "images": [
      {
        "url": "/og/pier-caisson-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Pier / Caisson Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Pier / Caisson Concrete Calculator",
    "description":
      "Instant pier/caisson concrete volume with waste allowance & dry-volume factor.",
    "images": ["/og/pier-caisson-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function PierCaissonCalculatorPage() {
  /** Single JSON-LD graph (rich results):
   * - WebApplication: the calculator as an app
   * - BreadcrumbList: aligns with visible breadcrumbs below
   * - HowTo: short steps to use
   * - FAQPage: common Qs (ensure these Q/As also appear visibly in the Article)
   */
  const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id":
        "https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator#app",
      "name": "Pier / Caisson Concrete Calculator",
      "url": "https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate concrete volume for cylindrical and belled-base piers/caissons with unit switching, quantity multipliers, waste allowance, and dry-volume factor.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png"
        }
      },
      "potentialAction": {
        "@type": "Action",
        "name": "Calculate Pier/Caisson Concrete"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://concretecalculatormax.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Calculators",
          "item": "https://concretecalculatormax.com/calculators"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Pier / Caisson Concrete Calculator",
          "item":
            "https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate concrete for a pier or caisson",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose pier/caisson type",
          "text":
            "Select cylindrical or belled-base configuration based on your geotechnical/structural design."
        },
        {
          "@type": "HowToStep",
          "name": "Enter dimensions",
          "text":
            "For cylindrical: enter diameter and depth. For belled base: also enter bell diameter and bell height. Choose input units."
        },
        {
          "@type": "HowToStep",
          "name": "Quantity & allowances",
          "text":
            "Enter the number of shafts, and optionally add waste % and a dry-volume factor for material sizing."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate",
          "text":
            "Click Calculate to get total volume in m³ and yd³ (and ft³ if enabled)."
        }
      ],
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Pier/Caisson dimensions and specifications"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can this calculator handle belled caissons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Enable Belled Base and enter top diameter, bottom diameter, and bell height. The frustum volume is added to the shaft volume automatically."
          }
        },
        {
          "@type": "Question",
          "name": "Which units can I use for inputs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Meters, centimeters, millimeters, feet, and inches. The tool converts internally and displays volumes in m³, yd³, and ft³."
          }
        },
        {
          "@type": "Question",
          "name": "How much waste should I add?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "A 5–10% allowance is common for placement losses, uneven excavation, and pump line waste. Follow your project’s specification."
          }
        },
        {
          "@type": "Question",
          "name": "Does the calculator show per-pier and total volumes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. You’ll see net and with-waste values per pier and for the total number of piers."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use the yd³ (+5% / +10%) helpers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "After calculating, the yd³ helper block shows ‘with waste’ yardage and quick +5% and +10% additions for rounding truck orders."
          }
        },
        {
          "@type": "Question",
          "name": "Can I print or save the results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Use the Print / Save Calculations button to generate a clean, A4-friendly summary."
          }
        },
        {
          "@type": "Question",
          "name": "Does this tool include reinforcement or mix design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. It focuses on volume. Reinforcement, cover, and mix grade must follow structural drawings and local codes."
          }
        }
      ]
    }
  ]
};


  return (
    <>
      {/* JSON-LD graph (single block) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container-xl">
        {/* Visible breadcrumbs (match BreadcrumbList above) */}
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
            <li>
              <Link href="/calculators" className="hover:underline">
                Calculators
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
            <li aria-current="page" className="text-slate-200">
              Pier Caisson Concrete Calculator
            </li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            {/* Title & short intro (intent match) */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Box className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Pier / Caisson Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                    reviewerName="Engr. Talha Tariq"
                    licenseNumber="PEC-CIVIL-37815"
                    lastUpdated="2025-10-24"
                  />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Calculate concrete volumes for piers and caissons quickly and accurately. Supports cylindrical and belled-base formulas, unit conversions (m³ / yd³), quantity multipliers and 5–10% waste allowance — ideal for contractors and engineers to order the right amount of concrete.
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <PierCaissonCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <PierCaissonConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["pier-caisson"]} />
          </article>
        </div>
      </main>
    </>
  );
}
