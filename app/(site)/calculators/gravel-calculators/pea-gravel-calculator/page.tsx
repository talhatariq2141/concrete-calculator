import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PeaGravelCalculator from "@/components/calculators/PeaGravelCalculator";
import PeaGravelCalculatorArticle from "@/components/calculators/articles/PeaGravelCalculatorArticle";
import { Shovel } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Pea Gravel Calculator for Landscaping Projects | Est. Bags & Yards",
  "description":
    "Estimate pea gravel needed for garden beds, pathways, and decorative areas with our easy Pea Gravel Calculator. Output in bags, tons, yards, and cost.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/gravel-calculators/pea-gravel-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/pea-gravel-calculator",
    "title": "Pea Gravel Calculator for Landscaping Projects",
    "description":
      "Calculate Pea Gravel volume across your yard, outputting quantities in convenient bags, bulk yards, tons, and cost.",
    "images": [
      {
        "url": "/og/pea-gravel-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Pea Gravel Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Pea Gravel Calculator for Landscaping Projects",
    "description":
      "Estimate pea gravel needed for garden beds, pathways, and decorative areas. Fast estimate of bags, bulk yards, and tons.",
    "images": ["/og/pea-gravel-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function PeaGravelCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/gravel-calculators/pea-gravel-calculator#app",
        "name": "Pea Gravel Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/pea-gravel-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Estimate pea gravel needed for garden beds, pathways, and decorative areas with our Pea Gravel Calculator.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Pea Gravel Coverage"
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
            "item": "https://www.concretecalculatormax.com/calculators/gravel-calculators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Pea Gravel Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/gravel-calculators/pea-gravel-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate pea gravel needed",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter landscape area dimensions",
            "text": "Measure length and width of the garden bed or pathway."
          },
          {
            "@type": "HowToStep",
            "name": "Enter depth",
            "text": "Typically enter 2-3 inches for pea gravel depth for proper landscaping coverage."
          },
          {
            "@type": "HowToStep",
            "name": "Specify Bag format",
            "text": "Choose standard 50 lb bags or enter custom metrics."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate Needs",
            "text": "Press Calculate to instantly get the total cubic yards, total bags, and price."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much pea gravel do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can calculate your needs by measuring your the length and width of the site and using a depth of 2-3 inches, then viewing the cubic yards or bags output."
            }
          },
          {
            "@type": "Question",
            "name": "How deep should pea gravel be for landscaping?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For garden beds, a depth of 2 inches will conceal soil perfectly. For pathways, 2-3 inches works best."
            }
          },
          {
            "@type": "Question",
            "name": "How many bags of pea gravel do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If buying typical 0.5 cubic foot bags (~50 lbs each), you will need exactly 54 bags to make one full cubic yard."
            }
          },
          {
            "@type": "Question",
            "name": "Is pea gravel sold by yard or ton?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Usually, garden and hardware stores sell bulk pea gravel by the cubic yard, while some construction sites measure it in tons."
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
            <li><Link href="/calculators/gravel-calculators" className="hover:underline">Gravel Calculators</Link></li>
            <li className="px-1 text-slate-500">/</li>
            <li aria-current="page" className="text-slate-200">Pea Gravel Calculator</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Shovel className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Pea Gravel Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-25"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Estimate exactly how much pea gravel you need for landscaping beds, walkways, and decorative projects. Get your estimates in bulk volume like tons and cubic yards, as well as an exact tally of 50 lb bags required for convenient purchasing. 
              </p>
            </div>

            <PeaGravelCalculator />
            <PeaGravelCalculatorArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={["pea-gravel-calculator"]} />
          </article>
        </div>
      </main>
    </>
  );
}
