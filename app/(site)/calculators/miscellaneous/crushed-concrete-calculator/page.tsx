import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CrushedConcreteCalc from "@/components/calculators/CrushedConcreteCalc";
import CrushedConcreteCalcArticle from "@/components/calculators/articles/CrushedConcreteCalcArticle";
import { CircleDot } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Crushed Concrete Calculator",
  "description":
    "Calculate crushed concrete volume, tons, yards, and cost. Professional crushed concrete estimator with compaction adjustments and truckload estimates.",
  "keywords": "crushed concrete calculator, crushed concrete cost calculator, crushed concrete yards to tons calculator, crushed concrete coverage calculator, recycled concrete calculator, crushed concrete estimator",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/crushed-concrete-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/crushed-concrete-calculator",
    "title": "Crushed Concrete Calculator (yd³, Tons & Cost)",
    "description":
      "Calculate crushed concrete quantity, yards, tons, truckloads and estimated project cost.",
    "images": [
      {
        "url": "/og/crushed-concrete-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Crushed Concrete Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Crushed Concrete Cost & Quantity Calculator",
    "description":
      "Calculate crushed concrete volume, tons, yards, and estimated cost with this professional estimator.",
    "images": ["/og/crushed-concrete-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function CrushedConcreteCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/crushed-concrete-calculator#app",
        "name": "Crushed Concrete Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/crushed-concrete-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate crushed concrete quantity in yards, tons, truckloads, and cost for any project area.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Crushed Concrete Order"
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
            "position": 4,
            "name": "Miscellaneous Concrete Calculators",
            "item": "https://www.concretecalculatormax.com/calculators/miscellaneous"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Crushed Concrete Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/crushed-concrete-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate crushed concrete",
        "totalTime": "PT1M",
        "step": [
           {
             "@type": "HowToStep",
             "name": "Select shape",
             "text": "Choose your project layout shape or enter a known volume/coverage area."
           },
           {
             "@type": "HowToStep",
             "name": "Enter measurements",
             "text": "Input the length and width of the area, then select a target depth in inches."
           },
           {
             "@type": "HowToStep",
             "name": "Adjust density and compaction",
             "text": "Choose your density and specify how much extra material you need to order to account for compaction (typically 10%)."
           },
           {
             "@type": "HowToStep",
             "name": "View results",
             "text": "Review your estimated cubic yards, US tons, total truckloads required, and approximate material cost."
           }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate crushed concrete?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Multiply project area by depth to get volume. Convert cubic feet to cubic yards by dividing by 27. Use material density to estimate tons."
            }
          },
          {
            "@type": "Question",
            "name": "How many tons of crushed concrete do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The number of tons depends on volume and density. A 10x10x4 inch pad needs about 1.2 yards, which converts to roughly 1.7 to 1.9 tons depending on density and compaction."
            }
          },
          {
            "@type": "Question",
            "name": "How much area does 1 ton of crushed concrete cover?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "At a 2-inch depth, 1 ton covers roughly 100-110 square feet."
            }
          },
          {
            "@type": "Question",
            "name": "Is crushed concrete sold by ton or by yard?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It can be sold both ways. A good calculator translates yards to tons using density factors."
            }
          },
          {
            "@type": "Question",
            "name": "Should I add extra crushed concrete for compaction?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, crushed concrete packs tightly. Always order 5% to 15% extra to allow for compaction and jobsite spillage."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container-xl">
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li className="px-1 text-slate-500">/</li>
            <li><Link href="/calculators" className="hover:underline">Calculators</Link></li>
            <li className="px-1 text-slate-500">/</li>
            <li>
              <Link href="/calculators/miscellaneous" className="hover:underline">
                Miscellaneous Concrete
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
            <li aria-current="page" className="text-slate-200">Crushed Concrete Calculator</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <CircleDot className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Crushed Concrete Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2026-03-24"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Estimate how much crushed concrete you need based on standard or coverage dimensions. This professional crushed concrete cost calculator accounts for <strong>compaction waste</strong>, giving you exact yardage, tons, logistics estimates, and project costs.
              </p>
            </div>

            <CrushedConcreteCalc />
            <CrushedConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={[]} />
          </article>
        </div>
      </main>
    </>
  );
}
