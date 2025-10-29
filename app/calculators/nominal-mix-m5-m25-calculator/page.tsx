// app/calculators/nominal-mix-m5-m25-calculator/page.tsx
// -----------------------------------------------------------------------------
// Mirrors the Column/Beam/Yards/Footing calculator SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// - Intro copy aligned to "Nominal Mix (M5–M25) Concrete Calculator" intent
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import NominalMixConcreteCalc from "@/components/calculators/NominalMixConcreteCalc";
import { Boxes } from "lucide-react";
import NominalMixConcreteCalcArticle from "@/components/calculators/articles/NominalMixConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Nominal Mix (M5–M25) Concrete Calculator — Concrete Calculator Max",
  "description":
    "Calculate cement, sand, aggregate, and water for nominal mix grades M5 to M25. Includes dry-volume factor, waste allowance, bag counts, and recommended water–cement ratios.",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator",
    "title": "Nominal Mix (M5–M25) Concrete Calculator",
    "description":
      "Instant material breakdown for M5–M25 nominal mixes with dry-volume factor, waste, and bag counts. m³/yd³ supported.",
    // Ensure this image exists ≈1200×630 and is compressed (<200KB)
    "images": [
      {
        "url": "/og/nominal-mix-m5-m25-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Nominal Mix M5–M25 Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Nominal Mix (M5–M25) Concrete Calculator",
    "description":
      "Compute cement, sand, aggregate, and water for M5–M25 nominal mixes with dry-volume factor and bag counts.",
    "images": ["/og/nominal-mix-m5-m25-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function NominalMixCalculatorPage() {
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
        "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator#app",
      "name": "Nominal Mix (M5–M25) Concrete Calculator",
      "url": "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate cement, sand, aggregate, and water for nominal mix grades M5–M25 with dry-volume factor, waste allowance, and bag counts.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png" // ensure file exists
        }
      },
      "potentialAction": {
        "@type": "Action",
        "name": "Calculate Nominal Mix Materials"
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
          "name": "Nominal Mix (M5–M25) Calculator",
          "item":
            "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate materials for nominal mix concrete (M5–M25)",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Select grade",
          "text":
            "Choose a nominal mix grade (M5, M7.5, M10, M15, M20, M25) with its standard cement : sand : aggregate ratio."
        },
        {
          "@type": "HowToStep",
          "name": "Enter wet volume",
          "text":
            "Provide the required wet volume of concrete; choose your preferred units (m³/yd³/ft³)."
        },
        {
          "@type": "HowToStep",
          "name": "Apply dry-volume factor",
          "text":
            "Use a dry-volume factor (commonly ~1.54) to account for bulking and voids between aggregates."
        },
        {
          "@type": "HowToStep",
          "name": "Add waste allowance (optional)",
          "text":
            "Include 3–10% waste to cover spillage and site variability if required by your spec."
        },
        {
          "@type": "HowToStep",
          "name": "Review outputs",
          "text":
            "See cement, sand, aggregate quantities and bag counts, plus recommended water–cement ratio guidance."
        }
      ],
      "supply": [
        { "@type": "HowToSupply", "name": "Wet volume and selected nominal grade" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What’s the difference between nominal and design mix?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Nominal mix uses standard ratios (M5–M25) for routine work; design mix is laboratory-designed to meet a target strength and workability."
          }
        },
        {
          "@type": "Question",
          "name": "Which dry volume factor should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Field practice commonly uses 1.50–1.57. Use 1.54 as a starting point unless your organization specifies otherwise."
          }
        },
        {
          "@type": "Question",
          "name": "Can I change the water–cement ratio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Leave the field blank to use the grade’s typical default, or override w/c to match your specification."
          }
        },
        {
          "@type": "Question",
          "name": "How does the calculator compute cement bags?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "It converts the cement volume to mass using your density, then divides by your bag size (e.g., 50 kg) to get total bags."
          }
        },
        {
          "@type": "Question",
          "name": "Why do I enter moisture for sand and aggregates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Surface moisture contributes water to the mix. The tool subtracts that from theoretical water to avoid overwetting."
          }
        },
        {
          "@type": "Question",
          "name": "Can I print the results for approvals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Use Print / Save to export an A4-friendly summary of inputs, materials, and yardage (+5% / +10%)."
          }
        },
        {
          "@type": "Question",
          "name": "Are these quantities suitable for structural members?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "They’re planning estimates for nominal mixes. For structural elements with strength requirements, use a design mix per your code."
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
              Nominal Mix M5-M25 Calculator
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
                    Nominal Mix M5–M25 Calculator
                  </h1>
                </div>
                <EEATBlock
                    reviewerName="Engr. Talha Tariq"
                    licenseNumber="PEC-CIVIL-37815"
                    lastUpdated="2025-10-24"
                  />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Quickly estimate cement, sand, aggregate, and water for nominal mix grades M5–M25.
                Enter wet volume, apply dry-volume and optional waste, and get material quantities,
                50&nbsp;kg bag counts, and water–cement ratio guidance.
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <NominalMixConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <NominalMixConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["nominal-mix"]} />
          </article>
        </div>
      </main>
    </>
  );
}
