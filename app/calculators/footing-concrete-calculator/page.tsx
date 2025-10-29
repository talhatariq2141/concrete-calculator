// app/calculators/footing-concrete-calculator/page.tsx
// -----------------------------------------------------------------------------
// Mirrors the Column/Beam/Yards calculator SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// - Intro copy aligned to "Footing Concrete Calculator" intent
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import FootingConcreteCalc from "@/components/calculators/FootingConcreteCalc";
import { RulerDimensionLine } from "lucide-react";
import FootingConcreteCalcArticle from "@/components/calculators/articles/FootingConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Footing Concrete Calculator — Concrete Calculator Max",
  "description":
    "Quickly calculate concrete volume for rectangular, square, or circular footings. Includes waste allowance, dry-volume factor, and unit switching (m³/yd³/ft³).",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/footing-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/footing-concrete-calculator",
    "title": "Footing Concrete Calculator",
    "description":
      "Estimate footing concrete volume (rectangular/square or circular) with waste and dry-volume options. m³/yd³ supported.",
    // Ensure this image exists ~1200×630 and is compressed (<200KB)
    "images": [
      {
        "url": "/og/footing-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Footing Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Footing Concrete Calculator",
    "description":
      "Instant footing concrete volume with waste allowance & dry-volume factor.",
    "images": ["/og/footing-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function FootingConcreteCalculatorPage() {
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
        "https://concretecalculatormax.com/calculators/footing-concrete-calculator#app",
      "name": "Footing Concrete Calculator",
      "url": "https://concretecalculatormax.com/calculators/footing-concrete-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate concrete volume for rectangular/square and circular footings with waste allowance and dry-volume factor. Toggle outputs in m³, yd³, or ft³.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png"
        }
      },
      "potentialAction": { "@type": "Action", "name": "Calculate Footing Concrete" }
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
          "name": "Footing Concrete Calculator",
          "item":
            "https://concretecalculatormax.com/calculators/footing-concrete-calculator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate concrete for a footing",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose footing shape",
          "text":
            "Select rectangular/square or circular footing based on your design."
        },
        {
          "@type": "HowToStep",
          "name": "Enter dimensions",
          "text":
            "For rectangular/square: enter L, W, and D. For circular: enter diameter and depth. Choose input units."
        },
        {
          "@type": "HowToStep",
          "name": "Add allowances (optional)",
          "text":
            "Include a waste percentage and a dry-volume factor for material sizing if required."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate",
          "text":
            "Click Calculate to get total volume in m³ and yd³ (and ft³ if enabled)."
        }
      ],
      "supply": [
        { "@type": "HowToSupply", "name": "Footing dimensions and specifications" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I calculate both rectangular and circular footings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Use the tabs to switch between Rectangular/Square and Circular modes; each uses the appropriate geometric formula."
          }
        },
        {
          "@type": "Question",
          "name": "Which input units are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Meters (m), centimeters (cm), feet (ft), and inches (in). You can display results in m³, yd³, or ft³."
          }
        },
        {
          "@type": "Question",
          "name": "How much waste should I add for footings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "5–10% is common to account for over-excavation, trench irregularities, and placement losses. Follow your project specifications."
          }
        },
        {
          "@type": "Question",
          "name": "Why is there a ‘Show in’ selector?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "It lets you view the same computed volume in cubic meters, cubic yards, or cubic feet, which helps when coordinating with suppliers."
          }
        },
        {
          "@type": "Question",
          "name": "What does the yards helper do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "It provides yd³ with +5% and +10% additions to quickly round orders for ready-mix deliveries."
          }
        },
        {
          "@type": "Question",
          "name": "Does this include rebar, cover, or mix design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "No. The calculator focuses on volume. Reinforcement and mix grade must follow your structural drawings and local codes."
          }
        },
        {
          "@type": "Question",
          "name": "Can I print or save the calculation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Use the Print / Save button to export a clean, A4-friendly summary of your inputs and results."
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
              Footing Concrete Calculator
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
                    <RulerDimensionLine className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Footing Concrete Calculator
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
                Quickly estimate concrete volume for rectangular, square, or circular footings. Enter your dimensions,
                choose units, and add waste or dry-volume factors. Results show in m³ and yd³ (ft³ available).
              </p>
              </div>
            </div>            

            {/* ===== Calculator Slot ===== */}
            <FootingConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <FootingConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["footing"]} />
          </article>
        </div>
      </main>
    </>
  );
}
