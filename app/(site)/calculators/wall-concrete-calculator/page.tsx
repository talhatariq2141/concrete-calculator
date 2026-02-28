// app/calculators/wall-concrete-calculator/page.tsx
// -----------------------------------------------------------------------------
// Mirrors your standardized calculator SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import WallConcreteCalc from "@/components/calculators/WallConcreteCalc";
import { BrickWall } from "lucide-react";
import WallConcreteCalcArticle from "@/components/calculators/articles/WallConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Wall Concrete Calculator",
  "description":
    "Calculate concrete volume for walls with or without openings. Enter length, height, thickness, subtract door/window voids, add waste allowance, and get results in m³/yd³/ft³.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/wall-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/wall-concrete-calculator",
    "title": "Wall Concrete Calculator",
    "description":
      "Instant wall concrete volume with openings handling, waste allowance, and unit switching (m³/yd³/ft³).",
    "images": [
      {
        "url": "/og/wall-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Wall Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Wall Concrete Calculator",
    "description":
      "Compute wall concrete volume with openings, waste, and m³/yd³/ft³ outputs.",
    "images": ["/og/wall-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function WallConcreteCalculatorPage() {
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
          "https://www.concretecalculatormax.com/calculators/wall-concrete-calculator#app",
        "name": "Wall Concrete Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/wall-concrete-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate concrete volume for walls, including openings subtraction, waste allowance, and unit switching (m³/yd³/ft³).",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.concretecalculatormax.com/og/logo.png"
          }
        },
        "potentialAction": { "@type": "Action", "name": "Calculate Wall Concrete" }
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
            "name": "Wall Concrete Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/wall-concrete-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate concrete for a wall",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter wall dimensions",
            "text":
              "Provide total wall length, height, and thickness. Choose your input units."
          },
          {
            "@type": "HowToStep",
            "name": "Subtract openings (optional)",
            "text":
              "Enter door/window opening sizes to subtract their volume from the gross wall volume."
          },
          {
            "@type": "HowToStep",
            "name": "Add allowances",
            "text":
              "Optionally include a waste percentage and a dry-volume factor if you’re sizing dry constituents."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate",
            "text":
              "Click Calculate to get net wall volume in m³ and yd³ (and ft³ if enabled)."
          }
        ],
        "supply": [
          { "@type": "HowToSupply", "name": "Wall dimensions and opening sizes" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can I mix units when entering dimensions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Use meters or feet for length and height, and meters/centimeters/inches for thickness. The tool converts internally—just keep each field’s unit consistent with its selector."
            }
          },
          {
            "@type": "Question",
            "name": "How are openings handled?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Each opening’s volume is width × height × wall thickness × count. The calculator subtracts the total of all openings from the gross wall volume."
            }
          },
          {
            "@type": "Question",
            "name": "Which nominal mixes are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "1:1.5:3, 1:2:4, and 1:3:6 by volume. The calculator uses a 1.54 dry-volume factor to derive ingredient volumes."
            }
          },
          {
            "@type": "Question",
            "name": "How do you compute cement bags and water?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Cement volume (from mix split) is converted to mass using 1440 kg/m³, then divided by 50 kg/bag. Water = w/c × cement mass, reported in liters."
            }
          },
          {
            "@type": "Question",
            "name": "Can I view the result in cubic yards?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Set the output unit to yd³. A helper also shows yd³ with +5% and +10% additions for ordering."
            }
          },
          {
            "@type": "Question",
            "name": "Is cost estimation included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Choose Rate per m³ or By Materials to get a quick cost; you control unit rates and bag price."
            }
          },
          {
            "@type": "Question",
            "name": "Can I print or save the results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Use the Print / Save button to export an A4-friendly summary of inputs, volumes, materials, yardage, and cost."
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
              Wall Concrete Calculator
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
                    <BrickWall className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Wall Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-24"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Calculate wall concrete volume quickly and accurately. Enter wall length, height and thickness,
                subtract openings (doors/windows), choose units, and add waste to get ordering values in m³ and yd³
                (ft³ available).
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <WallConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <WallConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["wall"]} />
          </article>
        </div>
      </main>
    </>
  );
}
