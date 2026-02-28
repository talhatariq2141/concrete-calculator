// app/calculators/column-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ColumnConcreteCalc from "@/components/calculators/ColumnConcreteCalc";
import { Columns2 } from "lucide-react";
import ColumnConcreteCalcArticle from "@/components/calculators/articles/ColumnConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Column Concrete Calculator (Rectangular & Circular)",
  "description":
    "Instant column concrete volume for rectangular/square and circular columns. Includes waste allowance, dry-volume factor, unit switching (m³/yd³), and worked examples.",
  "alternates": {
    "canonical": "https://www.concretecalculatormax.com/calculators/column-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/column-concrete-calculator",
    "title": "Column Concrete Calculator (Rectangular & Circular)",
    "description":
      "Calculate column concrete volume with waste allowance and dry-volume factor. m³/yd³ supported.",
    "images": [
      {
        "url": "/og/column-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Column Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Column Concrete Calculator (Rectangular & Circular)",
    "description":
      "Instant column concrete volume with waste allowance & dry-volume factor.",
    "images": ["/og/column-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function ColumnConcreteCalculatorPage() {
  /** IMPORTANT: Single JSON-LD graph for this page (rich results).
   * - WebApplication: the calculator as an app
   * - BreadcrumbList: aligns with visible breadcrumbs below
   * - HowTo: short steps to use
   * - FAQPage: common Qs (visible content also lives in the Article component)
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://www.concretecalculatormax.com/calculators/column-concrete-calculator#app",
        "name": "Column Concrete Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/column-concrete-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate concrete volume for rectangular/square and circular columns with waste allowance and dry-volume factor.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.concretecalculatormax.com/og/logo.png"
          }
        },
        "potentialAction": { "@type": "Action", "name": "Calculate Column Concrete" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.concretecalculatormax.com" },
          { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://www.concretecalculatormax.com/calculators" },
          { "@type": "ListItem", "position": 3, "name": "Column Concrete Calculator", "item": "https://www.concretecalculatormax.com/calculators/column-concrete-calculator" }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate concrete for a column",
        "totalTime": "PT1M",
        "step": [
          { "@type": "HowToStep", "name": "Select shape", "text": "Choose rectangular/square or circular column." },
          { "@type": "HowToStep", "name": "Enter dimensions", "text": "Input height and cross-section dimensions; choose units." },
          { "@type": "HowToStep", "name": "Add allowances", "text": "Optionally add waste (%) and dry-volume factor." },
          { "@type": "HowToStep", "name": "Calculate", "text": "Click Calculate to get volume in m³ and yd³." }
        ],
        "supply": [{ "@type": "HowToSupply", "name": "Dimensions of the column" }]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does the calculator handle both rectangular and circular columns?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Use the tabs to switch between Rectangular/Square and Circular modes; each uses the appropriate geometric formula."
            }
          },
          {
            "@type": "Question",
            "name": "Which input units are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Meters, centimeters, feet, and inches for dimensions. You can display results in cubic meters, cubic yards, or cubic feet."
            }
          },
          {
            "@type": "Question",
            "name": "How much waste should I add?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Many projects use 5–10% to cover spillage, pumping losses, and subgrade variation. Always follow your project’s specification."
            }
          },
          {
            "@type": "Question",
            "name": "Can I enter multiple columns at once?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Enter the quantity of columns; the tool multiplies per-column volume to produce net totals and totals with waste."
            }
          },
          {
            "@type": "Question",
            "name": "How do I get cubic yards for ordering?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "After calculating, set the display to yd³, or use the built-in yardage helper that also shows +5% and +10% options."
            }
          },
          {
            "@type": "Question",
            "name": "Does this include reinforcement or mix design?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The tool focuses on volume. Reinforcement, cover, and mix grade must follow your structural drawings and local codes."
            }
          },
          {
            "@type": "Question",
            "name": "Can I print or save the results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Use the Print / Save button in the calculator to export a clean, paper-friendly summary."
            }
          }
        ]
      }
    ]
  };


  return (
    <>
      {/* JSON-LD graph (single block) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
              Column Concrete Calculator
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
                    <Columns2 className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Column Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-24"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Easily estimate the concrete volume needed for rectangular, square, or circular columns. Enter your dimensions,
                choose units, and get instant results with waste and dry-volume options.
              </p>
            </div>


            {/* Calculator */}
            <ColumnConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <ColumnConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["column"]} />
          </article>
        </div>
      </main>
    </>
  );
}
