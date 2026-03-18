import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import GravelDrivewayCalculator from "@/components/calculators/GravelDrivewayCalculator";
import GravelDrivewayCalculatorArticle from "@/components/calculators/articles/GravelDrivewayCalculatorArticle";
import { Truck } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Gravel Driveway Calculator (Tons, Yards & Cost) | Free Driveway Estimator",
  "description":
    "Use this Gravel Driveway Calculator to estimate driveway gravel in tons, yards, and total cost. Easy material planning for driveway base and surface layers.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-driveway-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-driveway-calculator",
    "title": "Gravel Driveway Calculator (Tons, Yards & Cost) | Free Driveway Estimator",
    "description":
      "Estimate driveway gravel required based on length, width, and depth in tons and cubic yards.",
    "images": [
      {
        "url": "/og/gravel-driveway-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Gravel Driveway Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Gravel Driveway Calculator (Tons, Yards & Cost)",
    "description":
      "Use this Gravel Driveway Calculator to estimate driveway gravel in tons, yards, and total cost.",
    "images": ["/og/gravel-driveway-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function GravelDrivewayCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-driveway-calculator#app",
        "name": "Driveway Gravel Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-driveway-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Use this Gravel Driveway Calculator to estimate driveway gravel in tons, yards, and total cost.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Driveway Gravel"
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
            "name": "Gravel Driveway Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-driveway-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate driveway gravel",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select units",
            "text": "Select your measurement unit for length and width."
          },
          {
            "@type": "HowToStep",
            "name": "Enter driveway dimensions",
            "text": "Enter the length and width of the driveway."
          },
          {
            "@type": "HowToStep",
            "name": "Set layer depth",
            "text": "Enter the desired gravel layer depth depending on base vs top layer requirements."
          },
          {
            "@type": "HowToStep",
            "name": "Select material and waste",
            "text": "Select the gravel type and enter an optional waste or overage percentage."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate Costs",
            "text": "Provide price per ton or cy and your delivery fee, then hit Calculate to see total estimated project cost."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much gravel do I need for my driveway?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on the length and width of your driveway, and the depth of the gravel layers. Just measure your driveway's footprint and enter the desired depth into our calculator."
            }
          },
          {
            "@type": "Question",
            "name": "How deep should gravel be for a driveway?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A typical gravel driveway comprises a base layer of crushed stone (4-6 inches) and a top layer of smaller surface gravel (2-3 inches)."
            }
          },
          {
            "@type": "Question",
            "name": "How many tons of driveway gravel do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tonnage is based on total cubic volume multiplied by gravel density. On average, a cubic yard of driveway crushed stone weighs about 1.4 to 1.5 tons."
            }
          },
          {
            "@type": "Question",
            "name": "How much does driveway gravel cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Depending on materials and your region, costs range from $25 to $65 per ton. Expect to pay extra for delivery."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best gravel depth for a driveway base?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A strong driveway base usually requires 4 to 6 inches of larger crushed stone to provide a stable foundation."
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
            <li aria-current="page" className="text-slate-200">Gravel Driveway Calculator</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Truck className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Gravel Driveway Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-25"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Estimate how much gravel is required for your driveway. Use this free tool to calculate driveway gravel volume in cubic yards, weight in tons, and totally project cost including delivery fees. Easily figure out the necessary material for both base layers and soft top layers.
              </p>
            </div>

            <GravelDrivewayCalculator />
            <GravelDrivewayCalculatorArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={["gravel-driveway-calculator"]} />
          </article>
        </div>
      </main>
    </>
  );
}
