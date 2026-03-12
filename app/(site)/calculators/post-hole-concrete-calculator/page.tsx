// app/calculators/post-hole-concrete-calculator/page.tsx
// -----------------------------------------------------------------------------
// Mirrors existing calculator SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PostHoleConcreteCalc from "@/components/calculators/PostHoleConcreteCalc";
import { CircleDot } from "lucide-react";
import PostHoleConcreteCalcArticle from "@/components/calculators/articles/PostHoleConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata: precise title/desc, canonical, OG/Twitter parity */
export const metadata: Metadata = {
  "title": "Post Hole Concrete Calculator | Free Post Concrete Estimator",
  "description":
    "Calculate how much concrete you need for post holes. Estimates bags, gravel, and cost for fence posts, gate posts, deck posts, and mailbox posts. Free post hole concrete estimator calculator.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/post-hole-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/post-hole-concrete-calculator",
    "title": "Post Hole Concrete Calculator | Free Post Concrete Estimator",
    "description":
      "Estimate concrete, gravel, and bag counts for post holes. Supports round and square holes, post displacement, waste factor, and cost estimation.",
    "images": [
      {
        "url": "/og/post-hole-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Post Hole Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Post Hole Concrete Calculator",
    "description":
      "Free post hole concrete estimator — calculate bags, gravel, and cost for fence posts, gate posts, and more.",
    "images": ["/og/post-hole-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};


export default function PostHoleConcreteCalculatorPage() {
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
          "https://www.concretecalculatormax.com/calculators/post-hole-concrete-calculator#app",
        "name": "Post Hole Concrete Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/post-hole-concrete-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate concrete volume, bag counts, gravel base, and cost for post holes including fence posts, gate posts, deck posts, and mailbox posts.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.concretecalculatormax.com/og/logo.png"
          }
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Post Hole Concrete"
        }
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
            "name": "Post Hole Concrete Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/post-hole-concrete-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate concrete for post holes",
        "totalTime": "PT2M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select hole shape",
            "text":
              "Choose round or square/rectangular post hole shape based on your project."
          },
          {
            "@type": "HowToStep",
            "name": "Enter hole dimensions",
            "text":
              "Enter hole diameter (or width and length for square holes) and hole depth."
          },
          {
            "@type": "HowToStep",
            "name": "Set number of holes and gravel depth",
            "text":
              "Enter the number of post holes and optionally add a gravel base depth (typically 4–6 inches)."
          },
          {
            "@type": "HowToStep",
            "name": "Enter post details (optional)",
            "text":
              "In Advanced mode, enter post shape and dimensions to subtract post displacement from concrete volume."
          },
          {
            "@type": "HowToStep",
            "name": "Select bag size",
            "text":
              "Choose your concrete bag size (40, 50, 60, or 80 lb) or enter a custom yield."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate",
            "text":
              "Click Calculate to see volume, bag counts, gravel estimate, and cost breakdown."
          }
        ],
        "supply": [
          {
            "@type": "HowToSupply",
            "name": "Post hole dimensions and post specifications"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much concrete do I need for a post hole?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The amount of concrete depends on the hole diameter, hole depth, number of holes, gravel base depth, and whether the post volume is subtracted from the total."
            }
          },
          {
            "@type": "Question",
            "name": "How many bags of concrete do I need per fence post?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The number of bags depends on the size of the hole and the yield of the selected concrete mix. Larger and deeper holes require more bags."
            }
          },
          {
            "@type": "Question",
            "name": "Should I put gravel at the bottom of a post hole?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "A gravel base is commonly used to improve drainage and provide support at the bottom of the hole."
            }
          },
          {
            "@type": "Question",
            "name": "How deep should a post hole be?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "A common starting rule is to bury about one-third of the total post length, but local frost depth, soil conditions, and post type can affect the final depth."
            }
          },
          {
            "@type": "Question",
            "name": "How wide should a post hole be?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "A common rule is to make the hole around three times the width or diameter of the post."
            }
          },
          {
            "@type": "Question",
            "name": "Should gate posts use more concrete than line posts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Gate posts typically carry more load and often require larger holes, deeper embedment, and more concrete than standard line posts."
            }
          },
          {
            "@type": "Question",
            "name": "Can I calculate gravel and concrete together?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. This calculator estimates both the gravel base volume and the concrete needed above it."
            }
          },
          {
            "@type": "Question",
            "name": "Does this calculator include waste?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. The calculator allows a waste percentage to be added to the final concrete estimate."
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
              Post Hole Concrete Calculator
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
                    <CircleDot className="h-5 w-5 text-green-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Post Hole Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-24"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Calculate how much concrete you need for post holes quickly and accurately. This free post hole concrete estimator calculator supports fence posts, gate posts, deck posts, mailbox posts, and more. Estimate concrete volume, bag counts, gravel base, and project cost — with optional smart recommendations for hole size and embedment depth.
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <PostHoleConcreteCalc />

            {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
            <PostHoleConcreteCalcArticle />

            {/* Internal linking to related tools */}
            <RelatedCalculators className="mt-8 mb-8" exclude={["post-hole"]} />
          </article>
        </div>
      </main>
    </>
  );
}
