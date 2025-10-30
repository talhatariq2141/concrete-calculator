// app/calculators/concrete-bag-calculator/page.tsx
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
import ConcreteBagCalculator from "@/components/calculators/ConcreteBagsCalc";
import { Briefcase } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import ConcreteBagCalcArticle from "@/components/calculators/articles/ConcreteBagCalcArticle";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Concrete Bag Calculator — Concrete Calculator Max",
  "description":
    "Instantly calculate how many concrete bags you need for slabs, footings, post holes, or sonotubes. Supports 40/50/60/80 lb and 20 kg bags, unit conversions, and +5%/+10% waste buffers.",
  "alternates": {
    "canonical":
      "https://concretecalculatormax.com/calculators/concrete-bag-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://concretecalculatormax.com/calculators/concrete-bag-calculator",
    "title": "Concrete Bag Calculator",
    "description":
      "Calculate how many concrete bags you need with unit conversions, bag sizes (40/50/60/80 lb & 20 kg), and waste buffers. Covers slabs, footings, posts, and sonotubes.",
    "images": [
      {
        "url": "/og/concrete-bags-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Concrete Bags Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Concrete Bags Calculator",
    "description":
      "Find exact concrete bag counts for slabs, footings, posts, and sonotubes. Supports 40/50/60/80 lb & 20 kg, with +5%/+10% buffers.",
    "images": ["/og/concrete-bags-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function ConcreteBagCalculatorPage() {
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
        "https://concretecalculatormax.com/calculators/concrete-bag-calculator#app",
      "name": "Concrete Bags Calculator",
      "url": "https://concretecalculatormax.com/calculators/concrete-bag-calculator",
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "description":
        "Calculate how many concrete bags you need for slabs, footings, post holes, or sonotubes. Choose bag size (40/50/60/80 lb or 20 kg), switch units, and add +5%/+10% buffers.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "publisher": {
        "@type": "Organization",
        "name": "Concrete Calculator Max",
        "logo": {
          "@type": "ImageObject",
          "url": "https://concretecalculatormax.com/og/logo.png"
        }
      },
      "potentialAction": { "@type": "Action", "name": "Calculate Concrete Bags" }
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
          "name": "Concrete Bags Calculator",
          "item":
            "https://concretecalculatormax.com/calculators/concrete-bag-calculator"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to calculate how many concrete bags you need",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose unit system",
          "text":
            "Select Imperial (ft/in/yd) or Metric (m/cm/mm) and set your linear units."
        },
        {
          "@type": "HowToStep",
          "name": "Select project type",
          "text":
            "Pick Slab, Footing, Post Holes, Sonotube, or Custom Volume to load the right inputs."
        },
        {
          "@type": "HowToStep",
          "name": "Enter dimensions",
          "text":
            "Provide all required dimensions in the same unit. The calculator converts everything consistently."
        },
        {
          "@type": "HowToStep",
          "name": "Choose bag size",
          "text":
            "Select 40 lb, 50 lb, 60 lb, 80 lb, or 20 kg. The tool uses nominal yield per bag for accuracy."
        },
        {
          "@type": "HowToStep",
          "name": "Calculate and review buffers",
          "text":
            "Click Calculate to get exact bags, plus +5% and +10% waste buffers. Use mini tools for Bags ↔ Yards and Volume ↔ Bags if needed."
        }
      ],
      "supply": [{ "@type": "HowToSupply", "name": "Project dimensions and chosen bag size" }]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How can I calculate how many bags of concrete I need?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the Concrete Bags Calculator: select your project type (Slab, Footing, Post Holes, or Sonotube), enter dimensions in your preferred units, choose a bag size (40/50/60/80 lb or 20 kg), and press Calculate. The tool converts geometry to volume, applies the selected bag yield, and returns exact bags plus +5% and +10% buffers for waste."
          }
        },
        {
          "@type": "Question",
          "name": "How do I calculate bags of concrete manually?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "1) Compute volume. For slabs/footings: L × W × T. For cylinders (posts/sonotubes): π × (d/2)² × H. 2) Convert to cubic feet or cubic yards as needed (1 yd³ = 27 ft³). 3) Divide by the bag yield. Typical yields: 40 lb ≈ 0.30 ft³, 50 lb ≈ 0.37 ft³, 60 lb ≈ 0.45 ft³, 80 lb ≈ 0.60 ft³, and 20 kg ≈ 0.014 m³ (≈ 0.49 ft³). Add 5–10% for waste."
          }
        },
        {
          "@type": "Question",
          "name": "What’s the formula for calculating concrete bags?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bags Needed = Total Volume ÷ Yield per Bag. Example (slab): Volume = L × W × T. If your slab is 20 ft × 12 ft × 0.33 ft, volume ≈ 79.2 ft³. Using 80 lb bags (≈ 0.60 ft³/bag): 79.2 ÷ 0.60 ≈ 132 bags. Consider +5–10% extra for cuts, spillage, and subgrade irregularities."
          }
        },
        {
          "@type": "Question",
          "name": "How do I figure out the number of concrete bags required?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pick a bag size, find the project volume, then divide volume by bag yield. The calculator handles unit conversions (ft/in ↔ m/cm) and geometry automatically, so you can focus on getting clean dimensions while it returns exact bags, +5%, and +10% options."
          }
        },
        {
          "@type": "Question",
          "name": "How many concrete bags are needed per cubic yard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A cubic yard is 27 ft³. Divide 27 by the bag yield in ft³. Approximate counts: 80 lb ≈ 45 bags/yd³ (27 ÷ 0.60), 60 lb ≈ 60 bags/yd³ (27 ÷ 0.45), 50 lb ≈ ~73 bags/yd³ (27 ÷ 0.37), 40 lb ≈ 90 bags/yd³ (27 ÷ 0.30). For 20 kg bags (≈ 0.014 m³ each), 1 yd³ ≈ 0.7646 m³ → about 55 bags/yd³ (0.7646 ÷ 0.014)."
          }
        },
        {
          "@type": "Question",
          "name": "How many bags of concrete do I need for one fence post?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the cylinder formula: Volume = π × (d/2)² × Depth. Convert measurements to the same unit first. Example: 12 in diameter (1 ft), 2.5 ft depth → π × (0.5²) × 2.5 ≈ 1.96 ft³. With 80 lb bags (0.60 ft³), that’s about 3.3 bags → round up to 4; add 5–10% contingency or follow local specs."
          }
        },
        {
          "@type": "Question",
          "name": "How many cement bags are used in one cubic meter of concrete?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "That depends on the mix design (e.g., nominal mixes like 1:2:4) and local standards. As a rough guide for plain concrete, many engineers estimate ~7–8 × 50 kg cement bags per 0.5 m³ at certain strengths, but this varies. Use project specs, or a dedicated mix calculator, for precise cement-only counts."
          }
        },
        {
          "@type": "Question",
          "name": "How many concrete bags do I need for my project?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enter your dimensions and bag size in the calculator and click Calculate. You’ll get exact bags plus +5% and +10% options. If you’re between sizes, choose the next whole bag. For large pours, compare bag counts with ready-mix delivery pricing."
          }
        },
        {
          "@type": "Question",
          "name": "How many bags of concrete are required for a sonotube?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Compute cylinder volume: π × (d/2)² × H, multiply by the number of tubes, then divide by bag yield. Example: four 12 in dia × 36 in tubes → each ≈ 2.35 ft³; total ≈ 9.4 ft³. Using 80 lb bags (0.60 ft³): 9.4 ÷ 0.60 ≈ 15.7 → 16–18 bags with waste."
          }
        },
        {
          "@type": "Question",
          "name": "How to estimate cement bags needed for concrete mix?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Decide the mix (e.g., 1:2:4), convert your total concrete volume to the constituent volumes using the ratio, then account for bulking/voids and density. Because this is mix-specific, most users prefer a mix-design calculator or manufacturer guidance. Our bag calculator focuses on pre-mixed concrete bag counts."
          }
        },
        {
          "@type": "Question",
          "name": "How many cement bags per cubic meter of concrete?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends on the targeted strength and mix design. A common rough range might be ~7–12 × 50 kg bags per m³ depending on mix and aggregate moisture, but you should verify with structural specs or a mix design tool. Use this as orientation rather than a substitute for engineered design."
          }
        },
        {
          "@type": "Question",
          "name": "How many bags of concrete do I need for a slab?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Volume = L × W × Thickness (all in the same unit). Convert to ft³ or yd³. Divide by the bag yield. Example: 10 ft × 10 ft × 4 in (0.333 ft) → 33.3 ft³. With 80 lb bags (0.60 ft³): ≈ 55.5 → 56–62 bags with 5–10% extra for waste and edge thickening."
          }
        },
        {
          "@type": "Question",
          "name": "How many concrete bags do I need for a footing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Treat the footing as a rectangular prism: L × W × H. Convert to ft³ or m³. Divide by bag yield. Example: 30 ft × 1.5 ft × 1.0 ft = 45 ft³. With 60 lb bags (0.45 ft³): 100 bags; add 5–10% contingency for trench irregularities and consolidation losses."
          }
        },
        {
          "@type": "Question",
          "name": "Does this calculator work for Lowe’s or Home Depot bag sizes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The calculator supports 40, 50, 60, and 80 lb bags that match typical retail sizes (including Lowe’s and Home Depot), plus 20 kg for metric markets. If a specific product lists a different yield, use that manufacturer yield to refine results."
          }
        },
        {
          "@type": "Question",
          "name": "What area does one 80 lb bag of concrete cover?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Coverage depends on thickness: Area (ft²) = Yield (ft³) ÷ Thickness (ft). An 80 lb bag yields ≈ 0.60 ft³. At 4 in (0.333 ft) thickness: 0.60 ÷ 0.333 ≈ 1.8 ft² per bag. At 6 in (0.5 ft): 0.60 ÷ 0.5 = 1.2 ft² per bag."
          }
        },
        {
          "@type": "Question",
          "name": "How many concrete bags are required for my project area?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Convert area to volume by multiplying by thickness, then divide by bag yield. Example: 200 ft² at 4 in (0.333 ft) → 66.7 ft³. With 50 lb bags (~0.37 ft³): 66.7 ÷ 0.37 ≈ 180 bags. The calculator automates these steps, including optional waste buffers."
          }
        },
        {
          "@type": "Question",
          "name": "What formula does the Concrete Bag Calculator use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It converts your geometry to total volume (rectangular or cylindrical), normalizes units, and divides by the selected bag’s nominal yield: Bags = Volume ÷ Yield per Bag. It also returns +5% and +10% buffers for practical ordering."
          }
        },
        {
          "@type": "Question",
          "name": "Can I calculate using inches or metric units?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. You can switch between Imperial (ft/in/yd) and Metric (m/cm/mm) systems. The calculator handles conversions internally, so you can enter dimensions in inches or centimeters while still getting results in bags, ft³/yd³, or m³."
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
              Concrete Bag Calculator
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
                    <Briefcase className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Concrete Bags Calculator
                  </h1>                  
                </div>
                <EEATBlock
                    reviewerName="Engr. Talha Tariq"
                    licenseNumber="PEC-CIVIL-37815"
                    lastUpdated="2025-10-30"
                  />
              </div>
              <div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Instantly calculate how many concrete bags you need for slabs, 
                footings, post holes, or sonotubes. Supports 40/50/60/80 lb and 20 kg bags, unit conversions, and +5%/+10% waste buffers.
              </p>
              </div>
            </div>

            {/* Calculator */}
            <ConcreteBagCalculator />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <ConcreteBagCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["concrete-bag"]} />
          </article>
        </div>
      </main>
    </>
  );
}
