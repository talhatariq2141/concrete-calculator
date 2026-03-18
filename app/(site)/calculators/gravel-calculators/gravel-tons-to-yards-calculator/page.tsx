import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import GravelTonsToYardsCalculator from "@/components/calculators/GravelTonsToYardsCalculator";
import GravelTonsToYardsCalculatorArticle from "@/components/calculators/articles/GravelTonsToYardsCalculatorArticle";
import { ArrowRightLeft } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Gravel Tons to Yards Calculator | Convert Weight & Volume",
  "description":
    "Easily convert between gravel tons and cubic yards based on standard material density. Perfect for comparing material quotes.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-tons-to-yards-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-tons-to-yards-calculator",
    "title": "Gravel Tons to Yards Calculator",
    "description":
      "Convert gravel tons to cubic yards (or vice-versa) based on accurate material density.",
    "images": [
      {
        "url": "/og/gravel-tons-to-yards.png",
        "width": 1200,
        "height": 630,
        "alt": "Gravel Tons To Yards Converter"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Gravel Tons to Yards Calculator",
    "description":
      "Easily convert between gravel tons and cubic yards based on standard material density.",
    "images": ["/og/gravel-tons-to-yards.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function GravelTonsToYardsCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-tons-to-yards-calculator#app",
        "name": "Gravel Tons to Yards Converter",
        "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-tons-to-yards-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Consistently convert gravel tons to cubic yards, or cubic yards back into tons based on accurate density profiles.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Convert Gravel Measurements"
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
            "name": "Gravel Tons to Yards",
            "item":
              "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-tons-to-yards-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to convert gravel tons to yards",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Pick conversion direction",
            "text": "Choose to convert from Tons to Yards, or from Yards to Tons."
          },
          {
            "@type": "HowToStep",
            "name": "Enter the quantity",
            "text": "Input the numeric value you have been quoted by a supplier."
          },
          {
            "@type": "HowToStep",
            "name": "Choose gravel density",
            "text": "Select the type of gravel (e.g. general gravel, pea gravel) to inform the density calculation."
          },
          {
            "@type": "HowToStep",
            "name": "Get results",
            "text": "Click Convert to seamlessly translate between weight and volume."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many tons are in a cubic yard of gravel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "On average, a cubic yard of standard gravel weighs roughly 1.4 tons. This varies slightly by stone density."
            }
          },
          {
            "@type": "Question",
            "name": "Is gravel sold by the ton or by the yard?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on the supplier. Bulk yards use volume bins (yards), whereas commercial quarries use vehicle weight scales (tons)."
            }
          },
          {
            "@type": "Question",
            "name": "How many yards is 5 tons of gravel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Using a standard 1.4 tons per cubic yard density: 5 tons equals roughly 3.57 cubic yards."
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
            <li aria-current="page" className="text-slate-200">Gravel Tons to Yards Converter</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <ArrowRightLeft className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Gravel Tons to Yards Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-25"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Some landscape suppliers sell materials by the cubic yard, while quarries sell by the ton. Use this straightforward converter to seamlessly translate between weight (tons) and volume (cubic yards) taking material density into account. 
              </p>
            </div>

            <GravelTonsToYardsCalculator />
            <GravelTonsToYardsCalculatorArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={["gravel-tons-to-yards-calculator"]} />
          </article>
        </div>
      </main>
    </>
  );
}
