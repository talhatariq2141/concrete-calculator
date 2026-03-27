import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import AquariumGravelCalculator from "@/components/calculators/AquariumGravelCalculator";
import AquariumGravelCalculatorArticle from "@/components/calculators/articles/AquariumGravelCalculatorArticle";
import { Fish } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
  "title": "Aquarium Gravel Calculator | Tank Substrate Estimates",
  "description":
    "Calculate exactly how many pounds, kilograms, and bags of gravel you need for your aquarium. Supports rectangular, cyclinder, and bow front tanks.",
  "alternates": {
    "canonical":
      "https://www.concretecalculatormax.com/calculators/gravel-calculators/aquarium-gravel-calculator"
  },
  "openGraph": {
    "type": "article",
    "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/aquarium-gravel-calculator",
    "title": "Aquarium Gravel Calculator",
    "description":
      "Calculate exactly how many pounds, kilograms, and bags of gravel you need for your aquarium.",
    "images": [
      {
        "url": "/og/aquarium-gravel-calculator.png",
        "width": 1200,
        "height": 630,
        "alt": "Aquarium Gravel Calculator"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Aquarium Gravel Calculator",
    "description":
      "Calculate exactly how many pounds, kilograms, and bags of gravel you need for your aquarium.",
    "images": ["/og/aquarium-gravel-calculator.png"]
  },
  "robots": { "index": true, "follow": true }
};

export default function AquariumGravelCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://www.concretecalculatormax.com/calculators/gravel-calculators/aquarium-gravel-calculator#app",
        "name": "Aquarium Gravel Calculator",
        "url": "https://www.concretecalculatormax.com/calculators/gravel-calculators/aquarium-gravel-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "description":
          "Calculate exactly how many pounds, kilograms, and bags of gravel you need for your aquarium.",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "publisher": {
          "@type": "Organization",
          "name": "Concrete Calculator Max"
        },
        "potentialAction": {
          "@type": "Action",
          "name": "Calculate Aquarium Gravel"
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
            "name": "Aquarium Gravel",
            "item":
              "https://www.concretecalculatormax.com/calculators/gravel-calculators/aquarium-gravel-calculator"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to calculate aquarium gravel needed",
        "totalTime": "PT1M",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select your tank shape",
            "text": "Choose from rectangular, bow front, or cyclinder shapes."
          },
          {
            "@type": "HowToStep",
            "name": "Enter tank dimensions",
            "text": "Provide the length and width (or diameter) of you tank's footprint."
          },
          {
            "@type": "HowToStep",
            "name": "Set Substrate Depth",
            "text": "Choose a depth for your substrate, typically 1.5 to 2 inches for a standard aquarium."
          },
          {
            "@type": "HowToStep",
            "name": "Calculate Shopping Needs",
            "text": "Enter the amount of pounds in a typical bag, and press calculate to reveal how many total bags you need to purchase."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How deep should aquarium gravel be?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A depth of 1.5 to 2 inches is ideal for a standard tank. It holds artificial plants securely and fosters beneficial bacteria without risking trapped toxic gas."
            }
          },
          {
            "@type": "Question",
            "name": "How many pounds of gravel do I need for a 10 gallon tank?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A standard 10-gallon tank requires approximately 15 to 20 pounds of gravel for a healthy 1.5 - 2 inch deep bed."
            }
          },
          {
            "@type": "Question",
            "name": "How many pounds of gravel per gallon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The common rule of thumb is 1 to 1.5 pounds of gravel per gallon of water, though measuring by exact bottom footprint and desired depth is more accurate."
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
            <li aria-current="page" className="text-slate-200">Aquarium Gravel Calculator</li>
          </ol>
        </nav>

        <div className="flex">
          <article className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
              <div className="w-full text-left lg:w-1/2">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Fish className="h-5 w-5 text-teal-400" />
                  </div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                    Aquarium Gravel Calculator
                  </h1>
                </div>
                <EEATBlock
                  reviewerName="Engr. Talha Tariq"
                  licenseNumber="PEC-CIVIL-37815"
                  lastUpdated="2025-10-25"
                />
              </div>
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                Building a new fish tank? Calculate exactly how much substrate you need. Determine your aquarium gravel requirements in pounds, kilograms, and total bags based on your specific tank dimensions and shape. 
              </p>
            </div>

            <AquariumGravelCalculator />
            <AquariumGravelCalculatorArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={["aquarium-gravel-calculator"]} />
          </article>
        </div>
      </main>
    </>
  );
}
