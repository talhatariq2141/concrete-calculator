// app/calculators/slab-concrete-calculator/page.tsx
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
import SlabConcreteCalc from "@/components/calculators/SlabConcreteCalc";
import { Container } from "lucide-react";
import SlabConcreteCalcArticle from "@/components/calculators/articles/SlabConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Slab Concrete Calculator — Concrete Calculator Max",
  "description":
    "Estimate concrete volume for slabs, patios, driveways, and floors. Enter length, width, thickness, add waste allowance, and get results in m³/yd³/ft³.",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/slab-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/slab-concrete-calculator",
    "title": "Slab Concrete Calculator",
    "description":
      "Instant slab concrete volume with waste allowance and unit switching (m³/yd³/ft³).",
    // Ensure the image exists (~1200×630) and is compressed (<200KB)
    "images": [
      {
        "url": "/og/slab-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Slab Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Slab Concrete Calculator",
    "description":
      "Estimate slab concrete quickly. Enter L × W × T, add waste, and switch units.",
    "images": ["/og/slab-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function SlabConcreteCalculatorPage() {
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
        "https://concretecalculatormax.com/calculators/slab-concrete-calculator#app",
      "name": "Slab Concrete Calculator",
      "url": "https://concretecalculatormax.com/calculators/slab-concrete-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate concrete volume for slabs, patios, driveways, and floors. Add waste allowance and toggle outputs in m³, yd³, or ft³.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png"
        }
      },
      "potentialAction": { "@type": "Action", "name": "Calculate Slab Concrete" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://concretecalculatormax.com" },
        { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://concretecalculatormax.com/calculators" },
        { "@type": "ListItem", "position": 3, "name": "Slab Concrete Calculator", "item": "https://concretecalculatormax.com/calculators/slab-concrete-calculator" }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate concrete for a slab",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Enter slab dimensions", "text": "Provide length and width of the slab and its thickness. Choose your preferred units." },
        { "@type": "HowToStep", "name": "Add waste allowance (optional)", "text": "Include 5–10% to cover spillage, pump line losses, and tolerances." },
        { "@type": "HowToStep", "name": "Calculate", "text": "Click Calculate to get total volume in m³ and yd³ (and ft³ if enabled)." },
        { "@type": "HowToStep", "name": "Review ordering helpers", "text": "Use the yardage helper values to see +5% and +10% options for suppliers." }
      ],
      "supply": [{ "@type": "HowToSupply", "name": "Slab dimensions and thickness" }]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How accurate is the Slab Concrete Calculator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It uses straightforward geometry with strict unit conversion to provide reliable cubic yard and cubic meter estimates. Always round up when placing an order and consider a 5–10% waste allowance."
          }
        },
        {
          "@type": "Question",
          "name": "What slab thickness should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Light patios and walkways often use 4 in (100 mm). Driveways or heavier loads may require 5–6 in (125–150 mm) or engineer-specified thickness. Always follow local codes and structural drawings."
          }
        },
        {
          "@type": "Question",
          "name": "Does the calculator support both imperial and metric units?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Enter dimensions in feet/meters and thickness in inches/mm/cm—the tool converts everything and outputs both yd³ and m³."
          }
        },
        {
          "@type": "Question",
          "name": "How do I add extra concrete for waste and uneven sub-base?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the Waste/Overage field (e.g., 5–10%). The calculator multiplies the raw volume by this factor to show an adjusted order quantity."
          }
        },
        {
          "@type": "Question",
          "name": "Will this tell me how many concrete trucks I need?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can divide the total cubic yards by your supplier’s truck capacity (commonly 8–10 yd³). Order policies vary—confirm with your ready-mix provider."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this for irregular or multiple slab sections?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For L-shapes or complex layouts, break the area into rectangles, calculate each area, then sum the volumes. Add a suitable waste allowance before ordering."
          }
        },
        {
          "@type": "Question",
          "name": "Does the calculator include reinforcement or mix design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No—those are specified by your engineer or code official. The tool focuses on concrete volume; reinforcement, fiber, and mix design must follow project specifications."
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
              Slab Concrete Calculator
            </li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            {/* Title and Description (intent match) */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Container className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Slab Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                    reviewerName="Engr. Talha Tariq"
                    licenseNumber="PEC-CIVIL-37815"
                    lastUpdated="2025-10-24"
                  />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Use our free Slab Concrete Calculator to estimate the concrete volume for floors, patios, driveways, and
                foundation slabs. Enter length, width, and thickness, choose your units, and add waste to get ordering
                values in m³ and yd³ (ft³ available).
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <SlabConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <SlabConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["slab"]} />
          </article>
        </div>
      </main>
    </>
  );
}
