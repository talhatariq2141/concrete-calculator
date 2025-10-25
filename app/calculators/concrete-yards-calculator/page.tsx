// app/calculators/concrete-yards-calculator/page.tsx
// -----------------------------------------------------------------------------
// Mirrors the Column Calculator SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// - Clean intro copy aligned to "Concrete Yards Calculator" intent
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ConcreteYardsCalc from "@/components/calculators/ConcreteYardsCalc";
import { Ruler } from "lucide-react";
import ConcreteYardsCalcArticle from "@/components/calculators/articles/ConcreteYardsCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Concrete Yards Calculator — Concrete Calculator Max",
  "description":
    "Instantly convert concrete volume to cubic yards for slabs, footings, walls, and more. Enter dimensions or ft³/m³, add waste allowance, and get yd³ for ordering.",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/concrete-yards-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/concrete-yards-calculator",
    "title": "Concrete Yards Calculator",
    "description":
      "Calculate concrete yardage quickly. Convert from ft³ or m³ to yd³ and add waste for ordering.",
    "images": [
      {
        "url": "/og/concrete-yards-calculator.png", // ensure this exists (≈1200×630, <200KB)
        "width": 1200,
        "height": 630,
        "alt": "Concrete Yards Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Concrete Yards Calculator",
    "description":
      "Instant yardage (yd³) from dimensions or ft³/m³ with optional waste allowance.",
    "images": ["/og/concrete-yards-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function ConcreteYardCalculatorPage() {
  /** Single JSON-LD graph (rich results):
   * - WebApplication: the calculator as an app
   * - BreadcrumbList: aligns with visible breadcrumbs below
   * - HowTo: short steps to use
   * - FAQPage: common Qs (make sure these also appear visibly in the Article)
   */
  const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id":
        "https://concretecalculatormax.com/calculators/concrete-yards-calculator#app",
      "name": "Concrete Yards Calculator",
      "url": "https://concretecalculatormax.com/calculators/concrete-yards-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Convert concrete volume to cubic yards (yd³) from dimensions or known volume. Add waste and toggle display units.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png" // ensure file exists
        }
      },
      "potentialAction": { "@type": "Action", "name": "Calculate Concrete Yardage" }
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
          "name": "Concrete Yards Calculator",
          "item":
            "https://concretecalculatormax.com/calculators/concrete-yards-calculator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate concrete in cubic yards (yd³)",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter dimensions or volume",
          "text":
            "Provide slab/footing dimensions or a known volume in ft³ or m³. The tool converts to yd³."
        },
        {
          "@type": "HowToStep",
          "name": "Choose units",
          "text": "Select your input units and preferred output display (yd³/m³/ft³)."
        },
        {
          "@type": "HowToStep",
          "name": "Add waste allowance (optional)",
          "text":
            "Include 5–10% waste to account for spillage, pumping, and tolerances."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate",
          "text":
            "Click Calculate to get total yardage (yd³) and optional +5%/+10% ordering helpers."
        }
      ],
      "supply": [{ "@type": "HowToSupply", "name": "Project dimensions or volume" }]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I have to enter all dimensions in the same unit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Pick a single input unit in the dropdown and enter all fields using that unit. The calculator handles the conversions internally."
          }
        },
        {
          "@type": "Question",
          "name": "Why are the results shown in cubic yards?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ready-mix concrete is typically ordered in cubic yards. We also display ft³ and m³ for engineering checks and international projects."
          }
        },
        {
          "@type": "Question",
          "name": "Which waste percentage should I use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "5% is a common minimum; use 10% for uneven subgrade, edge forms, or when pumping. Follow your project standards."
          }
        },
        {
          "@type": "Question",
          "name": "What if my slab isn’t perfectly rectangular or circular?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Break complex shapes into rectangles or circles, calculate each area’s yardage, then add them together. Apply a suitable waste allowance before ordering."
          }
        },
        {
          "@type": "Question",
          "name": "Can I print the results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Use the Print / Save button to export an A4-friendly summary of your inputs and yardage."
          }
        },
        {
          "@type": "Question",
          "name": "Does this tool include rebar or mix design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. It focuses on volume. Reinforcement, control joints, and mix grade should follow your engineer’s drawings and local codes."
          }
        },
        {
          "@type": "Question",
          "name": "Is there support for inches or millimeters?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can select inches or millimeters (and other units) as the single input unit for all fields."
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
              Concrete Yards Calculator
            </li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            {/* Title and Description (intent match) */}
            <div className="mb-4 flex justify-between items-start">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Ruler className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold font-poppins tracking-tight leading-tight text-slate-200">
                    Concrete Yards Calculator
                  </h1>
                </div>
                <EEATBlock
                    reviewerName="Engr. Talha Tariq"
                    licenseNumber="PEC-CIVIL-37815"
                    lastUpdated="2025-10-24"
                  />
                <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                  Quickly estimate yardage in yd³ for slabs, footings, walls, and more. Convert
                  from ft³ or m³, add waste allowance, and switch display units for ordering.
                </p>
              </div>
            </div>

            {/* ===== Calculator Slot ===== */}
            <ConcreteYardsCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <ConcreteYardsCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["yards"]} />
          </article>
        </div>
      </main>
    </>
  );
}
