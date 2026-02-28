// app/calculators/staircase-concrete-calculator/page.tsx
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
import StaircaseConcreteCalc from "@/components/calculators/StaircaseConcreteCalc";
import { Boxes } from "lucide-react";
import StaircaseConcreteCalcArticle from "@/components/calculators/articles/StaircaseConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Staircase Concrete Calculator",
  "description":
    "Calculate staircase concrete volume using waist-slab and solid stair methods. Includes landings, wedges, unit switching (m³/yd³/ft³), and waste allowance.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/staircase-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/staircase-concrete-calculator",
    "title": "Staircase Concrete Calculator",
    "description":
      "Instant staircase concrete volume (waist slab or solid) with landing and wedge options, plus waste and unit switching.",
    // Ensure this image exists (~1200×630) and is compressed (<200KB)
    "images": [
      {
        "url": "/og/staircase-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Staircase Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Staircase Concrete Calculator",
    "description":
      "Compute staircase concrete volume with waist-slab or solid method, including landings and wedges.",
    "images": ["/og/staircase-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function StaircaseCalculatorPage() {
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
          "https://www.concretecalculatormax.com/calculators/staircase-concrete-calculator#app",
        "name": "Staircase Concrete Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/staircase-concrete-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate staircase concrete volume using waist-slab and solid stair methods, including landing and wedge volumes, with waste allowance and unit switching.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.concretecalculatormax.com/og/logo.png"
          }
        },
        "potentialAction": { "@type": "Action", "name": "Calculate Staircase Concrete" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.concretecalculatormax.com" },
          { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://www.concretecalculatormax.com/calculators" },
          { "@type": "ListItem", "position": 3, "name": "Staircase Concrete Calculator", "item": "https://www.concretecalculatormax.com/calculators/staircase-concrete-calculator" }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate concrete for a staircase",
        "totalTime": "PT1M",
        "step": [
          { "@type": "HowToStep", "name": "Choose method", "text": "Select Waist-Slab or Solid Stair based on your design and detailing." },
          { "@type": "HowToStep", "name": "Enter geometry", "text": "Provide total run and rise, tread and riser sizes, slab thickness (waist), number of steps, and landing dimensions if present." },
          { "@type": "HowToStep", "name": "Include wedges/landings", "text": "Add wedge (step) volume and landing volume where applicable. Choose input units." },
          { "@type": "HowToStep", "name": "Add allowances", "text": "Optionally add waste percentage and a dry-volume factor for material sizing." },
          { "@type": "HowToStep", "name": "Calculate", "text": "Click Calculate to get the staircase volume in m³ and yd³ (and ft³ if enabled)." }
        ],
        "supply": [{ "@type": "HowToSupply", "name": "Staircase dimensions and specifications" }]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What’s the difference between Waist-Slab and Solid stairs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Waist-Slab models an inclined slab plus triangular step wedges, typically yielding a lower volume. Solid stairs approximate stacked rectangular steps and are more conservative."
            }
          },
          {
            "@type": "Question",
            "name": "Which units can I use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Meters, centimeters, millimeters, feet, or inches. Pick one unit and enter all fields consistently; the calculator converts internally."
            }
          },
          {
            "@type": "Question",
            "name": "Can I include landings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Toggle Bottom and/or Top Landing and provide their Length, Width, and Thickness to include them in the total volume."
            }
          },
          {
            "@type": "Question",
            "name": "Does the calculator show weight?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. It multiplies total m³ by 2400 kg/m³ (normal-weight concrete) to provide an approximate mass in kg and metric tons."
            }
          },
          {
            "@type": "Question",
            "name": "How do I get cubic yards for ordering?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Results include yd³ and a helper that shows +5% and +10% additions so you can round orders to supplier increments."
            }
          },
          {
            "@type": "Question",
            "name": "Can I print or copy the results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use Print / Save for an A4-friendly summary or Copy Breakdown to paste the component list into emails or notes."
            }
          },
          {
            "@type": "Question",
            "name": "Does this tool handle reinforcement or code checks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. It focuses on concrete volume. Reinforcement, cover, and code compliance should follow your structural drawings and local standards."
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
              Staircase Concrete Calculator
            </li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            {/* Title & short intro (intent match) */}
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Boxes className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Staircase Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-24"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Calculate staircase concrete volume quickly and accurately. Supports waist-slab
                and solid-stair methods, landing and wedge volumes, unit conversions (m³ / yd³),
                and waste allowance for precise material planning.
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <StaircaseConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <StaircaseConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["staircase"]} />
          </article>
        </div>
      </main>
    </>
  );
}
