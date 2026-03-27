import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import GravelCostCalculator from "@/components/calculators/GravelCostCalculator";
import GravelCostCalculatorArticle from "@/components/calculators/articles/GravelCostCalculatorArticle";
import { DollarSign } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Gravel Cost Calculator | Free Yard & Ton Estimate",
  "description":
    "Estimate your total project cost for gravel, crushed stone, and landscaping rock. Enter dimensions or known quantity to calculate material and delivery quotes.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-cost-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-cost-calculator",
    "title": "Gravel Cost Calculator",
    "description":
      "Estimate your total project cost for gravel including material pricing by ton or yard, plus delivery fees.",
    "images": [
      {
        "url": "/og/gravel-cost-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Gravel Cost Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Gravel Cost Calculator",
    "description":
      "Estimate total project cost for gravel, crushed stone, and landscaping rock including delivery.",
    "images": ["/og/gravel-cost-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function GravelCostCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-cost-calculator#app",
        "name": "Gravel Cost Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-cost-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Estimate total project cost for gravel including material pricing by ton or yard, plus delivery fees.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Gravel Cost"
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
            "name": "Gravel Calculators",
            "item": "https://www.concretecalculatormax.com/calculators/gravel"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Gravel Calculators",
            "item": "https://www.concretecalculatormax.com/calculators/gravel-calculators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Gravel Cost",
            "item":
              "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-cost-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to estimate gravel cost",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select Input Strategy",
            "text": "Choose to estimate based on area dimensions, or by inputting a known quantity of material."
          },
          {
            "@type": "HowToStep",
            "name": "Provide Measurements",
            "text": "Input the length, width, and depth to figure out volume."
          },
          {
            "@type": "HowToStep",
            "name": "Submit Price Quote",
            "text": "Insert your supplier's price-per-ton or price-per-yard, and their flat delivery fee."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate True Cost",
            "text": "Click Calculate to reveal a breakdown of total invoice cost across materials and delivery."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does gravel cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Depending on region and type, gravel typically costs from $25 to $65 per ton, or $35 to $75 per cubic yard when purchased in bulk."
            }
          },
          {
            "@type": "Question",
            "name": "Is it cheaper to buy gravel by the ton or by the yard?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Neither is inherently cheaper. They are simply different metrics based on how local suppliers load vehicles (bucket volume vs weigh scales)."
            }
          },
          {
            "@type": "Question",
            "name": "How much is delivery for gravel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Local landscape yards usually charge a flat drop-off fee between $75 and $150 based on transit distance."
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
              <Link href="/calculators/gravel" className="hover:underline">
                Gravel
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
            <li><Link href="/calculators/gravel-calculators" className="hover:underline">Gravel Calculators</Link></li>
            <li className="px-1 text-slate-500">/</li>
            <li aria-current="page" className="text-slate-200">Gravel Cost Calculator</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <DollarSign className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Gravel Cost Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-25"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Estimate the overall cost for bulk gravel projects. Input the dimensions of a new driveway or patio, or start with a known material quantity. Automatically compare landscape yard prices whether they charge by the cubic yard, or by the ton.
              </p>
            </div>

            <GravelCostCalculator />
            <GravelCostCalculatorArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={["gravel-cost-calculator"]} />
          </article>
        </div>
      </main>
    </>
  );
}
