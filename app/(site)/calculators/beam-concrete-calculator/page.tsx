// app/calculators/beam-concrete-calculator/page.tsx
// -----------------------------------------------------------------------------
// This page mirrors the Column Calculator's SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// - Clean intro copy aligned to "Beam Concrete Calculator" intent
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import BeamConcreteCalc from "@/components/calculators/BeamConcreteCalc";
import { Container } from "lucide-react";
import BeamConcreteCalcArticle from "@/components/calculators/articles/BeamConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Beam Concrete Calculator — Concrete Calculator Max",
  "description":
    "Instant beam concrete volume using V = L × b × d. Includes optional void subtraction, waste allowance, dry-volume factor, and results in m³/yd³/ft³.",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/beam-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/beam-concrete-calculator",
    "title": "Beam Concrete Calculator",
    "description":
      "Calculate beam concrete volume (V = L × b × d) with voids, waste, and dry-volume options. m³/yd³ supported.",
    "images": [
      {
        "url": "/og/beam-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Beam Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Beam Concrete Calculator",
    "description":
      "Instant beam concrete volume with voids, waste allowance & dry-volume factor.",
    "images": ["/og/beam-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function BeamConcreteCalculatorPage() {
  /** IMPORTANT: Single JSON-LD graph for this page (rich results).
   * - WebApplication: the calculator as an app
   * - BreadcrumbList: aligns with visible breadcrumbs below
   * - HowTo: short steps to use the beam calc
   * - FAQPage: common Qs (ensure these Q/As also appear visibly on the page/article)
   */
  const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id":
        "https://concretecalculatormax.com/calculators/beam-concrete-calculator#app",
      "name": "Beam Concrete Calculator",
      "url": "https://concretecalculatormax.com/calculators/beam-concrete-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate concrete volume for beams using V = L × b × d, with optional void subtraction, waste allowance, and dry-volume factor.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png"
        }
      },
      "potentialAction": { "@type": "Action", "name": "Calculate Beam Concrete" }
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
          "name": "Beam Concrete Calculator",
          "item":
            "https://concretecalculatormax.com/calculators/beam-concrete-calculator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate concrete for a beam",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enter dimensions",
          "text":
            "Input beam length (L), breadth/width (b), and depth/height (d). Choose your input units."
        },
        {
          "@type": "HowToStep",
          "name": "Account for voids (optional)",
          "text":
            "If your beam has ducts, recesses, or openings, enter their total volume to subtract from gross."
        },
        {
          "@type": "HowToStep",
          "name": "Add allowances",
          "text":
            "Optionally add waste percentage and a dry-volume factor for material sizing."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate",
          "text":
            "Click Calculate to get volume in m³ and yd³ (and ft³ if enabled)."
        }
      ],
      "supply": [{ "@type": "HowToSupply", "name": "Beam dimensions and specs" }]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do all inputs need to be in the same unit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Choose one unit system (e.g., feet or meters) and enter all beam and void dimensions in that unit. The calculator then converts consistently for volume."
          }
        },
        {
          "@type": "Question",
          "name": "How does the void option affect results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When enabled, the uniform void volume (length × width × depth) is subtracted from each beam before applying waste and dry factors."
          }
        },
        {
          "@type": "Question",
          "name": "What waste percentage should I use for beams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 5–10% allowance is common, but congested reinforcement, pump line losses, or difficult placement may warrant more. Follow your project’s practice."
          }
        },
        {
          "@type": "Question",
          "name": "What is the dry volume factor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An optional multiplier (often ~1.50–1.54) used for material proportioning beyond wet concrete volume. Enable it if you’re estimating material quantities."
          }
        },
        {
          "@type": "Question",
          "name": "Can I calculate multiple beams at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Enter the number of beams and the tool will compute per-beam and total volumes automatically."
          }
        },
        {
          "@type": "Question",
          "name": "Does this calculator specify reinforcement or mix design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. It focuses on concrete volume. Reinforcement, cover, and mix grade must follow structural drawings and local codes."
          }
        },
        {
          "@type": "Question",
          "name": "Can I export or print the results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the Print / Save button in the calculator to generate a clean A4-style summary with inputs and results."
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
          <ol className="flex items-center flex-wrap gap-1">
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
              Beam Concrete Calculator
            </li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            {/* Title & short intro (intent match) */}
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4 ">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Container className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Beam Concrete Calculator
                  </h1>                  
                </div>
                <EEATBlock
                    reviewerName="Engr. Talha Tariq"
                    licenseNumber="PEC-CIVIL-37815"
                    lastUpdated="2025-10-24"
                  />
              </div>
              <div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Instantly estimate the concrete volume for beams using V = L × b
                × d. Optionally subtract voids and add waste or dry-volume
                factors. Switch display units between m³, yd³, and ft³ for
                ordering.
              </p>
              </div>
            </div>

            {/* Calculator */}
            <BeamConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <BeamConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["beam"]} />
          </article>
        </div>
      </main>
    </>
  );
}
