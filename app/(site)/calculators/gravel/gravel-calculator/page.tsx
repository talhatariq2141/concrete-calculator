import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import GravelCalculator from "@/components/calculators/GravelCalculator";
import GravelCalculatorArticle from "@/components/calculators/articles/GravelCalculatorArticle";
import { Layers } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Gravel Calculator (yd³, Tons & Cost) | Free Gravel Estimator",
  "description":
    "Calculate gravel volume, tons, cubic yards, and estimated cost with this easy Gravel Calculator for US projects.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-calculator",
    "title": "Gravel Calculator (yd³, Tons & Cost) | Free Gravel Estimator",
    "description":
      "Estimate how much gravel is needed based on project dimensions and selected depth.",
    "images": [
      {
        "url": "/og/gravel-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Gravel Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Gravel Calculator (yd³, Tons & Cost)",
    "description":
      "Calculate gravel volume, tons, cubic yards, and estimated cost with this easy Gravel Calculator.",
    "images": ["/og/gravel-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function GravelCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-calculator#app",
        "name": "Gravel Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate gravel volume, tons, cubic yards, and estimated cost with this easy Gravel Calculator.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Gravel Quantity"
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
            "name": "Gravel Calculator",
            "item":
              "https://www.concretecalculatormax.com/calculators/gravel-calculators/gravel-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate gravel",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select project shape and units",
            "text": "Choose Rectangle, Circle, or Triangle and proper units (ft, in, cm, m)."
          },
          {
            "@type": "HowToStep",
            "name": "Enter project dimensions",
            "text": "Enter the length and width (or radius/base) and desired gravel depth."
          },
          {
            "@type": "HowToStep",
            "name": "Select gravel type",
            "text": "Choose a type like General Gravel or Pea Gravel to automatically get an estimated gravel density for weight."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate",
            "text": "Click Calculate to view estimated volume (yd³, ft³), weight (tons, lbs), and total cost."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate how much gravel I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Multiply length by width to get the area, then multiply by depth for volume. Our calculator can easily convert this into cubic yards and tons based on gravel density."
            }
          },
          {
            "@type": "Question",
            "name": "How many cubic yards of gravel do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Once you know your volume in cubic feet, divide it by 27 to get cubic yards. A 10 ft by 10 ft area at 3 inches deep requires about 0.93 yd³."
            }
          },
          {
            "@type": "Question",
            "name": "How many tons of gravel do I need?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A cubic yard of gravel generally weighs between 1.4 to 1.5 tons (2,800 to 3,000 lbs). You calculate the tons by taking the cubic foot volume, multiplying it by density (e.g., 105 lbs/ft³), and dividing by 2000."
            }
          },
          {
            "@type": "Question",
            "name": "How deep should gravel be for landscaping?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For landscaping and decorative beds, a 2 to 3-inch depth is recommended for full coverage."
            }
          },
          {
            "@type": "Question",
            "name": "Does gravel weight vary by type?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, pea gravel typically packs lighter than angular crushed stone. Dampness also increases actual material weight."
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
            <li aria-current="page" className="text-slate-200">Gravel Calculator</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Layers className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Gravel Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-25"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Estimate how much gravel you need based on your project dimensions and desired depth. This free gravel calculator quickly converts your measurements into cubic yards, tons, and provides an estimated cost. Supports rectangular, circular, and triangular areas with custom gravel density inputs.
              </p>
            </div>

            <GravelCalculator />
            <GravelCalculatorArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={["gravel-calculator"]} />
          </article>
        </div>
      </main>
    </>
  );
}
