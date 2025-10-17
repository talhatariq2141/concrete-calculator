// app/calculators/concrete-yards-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import ConcreteYardsCalc from "@/components/calculators/ConcreteYardsCalc";
import { Ruler } from "lucide-react";
import ConcreteYardsCalcArticle from "@/components/calculators/articles/ConcreteYardsCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Concrete Yard Calculator - Concrete Calculator Max",
  description:
    "Easily calculate concrete volume in cubic yards with our Concrete Yard Calculator. Learn why cubic yards are used, how to measure dimensions, and how to convert from cubic feet to cubic yards accurately.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/concrete-yard-calculator",
  },
};

export default function ConcreteYardCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete in Yards and Convert to Cubic Yards",
        description:
          "Detailed guide on how to use the Concrete Yard Calculator to estimate concrete volume in cubic yards, including conversion formulas and why cubic yards are the standard for ready-mix concrete.",
        author: { "@type": "Organization", name: "Concrete Calculator Max" },
        publisher: {
          "@type": "Organization",
          name: "Concrete Calculator Max",
          logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
        },
        datePublished: "2025-10-09",
        dateModified: "2025-10-09",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://concretecalculatormax.com/calculators/concrete-yard-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "concrete yard calculator",
          "how to calculate concrete in yards",
          "convert cubic feet to cubic yards",
          "cubic yard concrete formula",
          "ready mix concrete calculator",
          "concrete volume estimator",
          "yardage calculator",
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container-xl">

          <article className="lg:col-span-8">

             {/* Title and Description of Calculator */}
            <div className="mb-4 flex justify-between items-start">
              <div className="w-full/50 text-left">
                  <div className="flex item-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Ruler className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold font-poppins tracking-tight leading-tight">Concrete Yards Calculator</h1>
                  </div>
                  <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                    Quickly estimate the amount of concrete you need in cubic yards for slabs, footings, and more. Enter your dimensions and get instant, accurate results for your next project.
                  </p>
              </div>
              
            </div>

            {/* ===== Calculator Slot ===== */}
            <ConcreteYardsCalc />

            <ConcreteYardsCalcArticle />
            <RelatedCalculators className="mt-8 mb-8" exclude={['yards']} />

            
          </article>

          
        
      </main>
    </>
  );
}
