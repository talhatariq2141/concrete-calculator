// app/calculators/tank-or-trench-concrete-calculator/page.tsx
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
import TankTrenchConcreteCalc from "@/components/calculators/TankTrenchConcreteCalc";
import { Boxes } from "lucide-react";
import TankTrenchConcreteCalcArticle from "@/components/calculators/articles/TankTrenchConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Tank / Trench Concrete Calculator",
  "description":
    "Compute concrete volume for rectangular and circular tanks and foundation trenches. Enter internal dimensions and thickness, add waste allowance, and get results in m³/yd³/ft³.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator",
    "title": "Tank / Trench Concrete Calculator",
    "description":
      "Instant concrete volumes for tanks (rectangular/circular) and trenches with waste and unit switching.",
    "images": [
      {
        "url": "/og/tank-or-trench-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Tank / Trench Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Tank / Trench Concrete Calculator",
    "description":
      "Calculate tank and trench concrete volumes with waste allowance and m³/yd³/ft³ outputs.",
    "images": ["/og/tank-or-trench-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function TankTrenchCalculatorPage() {
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
          "https://www.concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator#app",
        "name": "Tank / Trench Concrete Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate concrete volume for rectangular/circular tanks and foundation trenches. Includes unit switching, thickness handling, waste allowance, and ordering helpers.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.concretecalculatormax.com/og/logo.png"
          }
        },
        "potentialAction": { "@type": "Action", "name": "Calculate Tank/Trench Concrete" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.concretecalculatormax.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Calculators",
            "item": "https://www.concretecalculatormax.com/calculators"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Tank / Trench Concrete Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate concrete for a tank or trench",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Choose structure",
            "text":
              "Select Rectangular Tank, Circular Tank, or Trench based on your project."
          },
          {
            "@type": "HowToStep",
            "name": "Enter internal dimensions & thickness",
            "text":
              "Provide internal length/width/height (or diameter/height) and wall/base thickness; choose input units."
          },
          {
            "@type": "HowToStep",
            "name": "Apply allowances (optional)",
            "text":
              "Add 5–10% waste to cover losses and tolerances; optionally apply a dry-volume factor if you’re sizing dry constituents."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate and review outputs",
            "text":
              "Click Calculate to get total volume in m³ and yd³ (and ft³ if enabled). Use the ordering helpers (+5%/+10%) as needed."
          }
        ],
        "supply": [
          { "@type": "HowToSupply", "name": "Internal dimensions and thicknesses" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I calculate both rectangular and trapezoidal trenches?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Choose Rectangular to use a single width, or Trapezoidal to enter top and bottom widths; the calculator uses the correct area formula."
            }
          },
          {
            "@type": "Question",
            "name": "How are tank volumes computed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Both tank modes compute an outer concrete shell minus the inner water volume. We also show a breakdown for base slab, walls, and cover slab."
            }
          },
          {
            "@type": "Question",
            "name": "Which units can I use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Meters, centimeters, feet, or inches. Pick one unit and enter all dimensions consistently; the tool converts internally."
            }
          },
          {
            "@type": "Question",
            "name": "What waste percentage should I add?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "5–10% is common for over-excavation and placement losses. Use higher allowances if site access or formwork is challenging."
            }
          },
          {
            "@type": "Question",
            "name": "How do I get cubic yards for ordering?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "After calculating, yardage is shown along with +5% and +10% helpers to round orders to supplier increments."
            }
          },
          {
            "@type": "Question",
            "name": "Can I print or save the results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Use the Print / Save function to export an A4-friendly summary with inputs, volumes, breakdown, and yardage."
            }
          },
          {
            "@type": "Question",
            "name": "Does the calculator handle reinforcement or water-tightness checks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "No. It focuses on concrete volume. Reinforcement, crack control, and waterproofing must follow your design and local codes."
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
              Tank or Trench Concrete Calculator
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
                    Tank or Trench Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-24"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Quickly compute concrete volumes for rectangular and circular tanks and foundation trenches. Enter clear internal
                dimensions and thicknesses, choose units, and add waste to get ordering values in m³ and yd³ (ft³ available).
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <TankTrenchConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <TankTrenchConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["tank-trench"]} />
          </article>
        </div>
      </main>
    </>
  );
}
