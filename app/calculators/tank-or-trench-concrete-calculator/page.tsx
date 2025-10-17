// app/calculators/tank-or-trench-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import TankTrenchConcreteCalc from "@/components/calculators/TankTrenchConcreteCalc";
import { Boxes } from "lucide-react";
import TankTrenchConcreteCalcArticle from "@/components/calculators/articles/TankTrenchConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Tank / Trench Concrete Calculator – Concrete Calculator Max",
  description:
    "Learn how to calculate concrete volume for rectangular tanks, circular tanks, and foundation trenches. Step-by-step formulas, examples, conversion tips, and waste allowances.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator",
  },
};

export default function TankTrenchCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Tank or Trench Concrete",
        description:
          "A practical guide to computing concrete for rectangular tanks, circular tanks, and trenches with step-by-step formulas, examples, and waste allowances.",
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
          "@id": "https://concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "tank concrete calculator",
          "trench concrete calculator",
          "rectangular tank concrete",
          "circular tank concrete",
          "foundation trench volume",
          "concrete volume m3 to yd3",
          "how to calculate tank concrete",
          "how to calculate trench concrete",
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
        <div className="flex">
          <article className="lg:col-span-8">

            {/* Title and Description of Calculator */}
            <div className="flex flex-col mb-4 justify-between">
              <div className="w-full/50 text-left">
                  <div className="flex item-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <Boxes className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Tank or Trench Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Tank or Trench Concrete Calculator: quickly compute concrete volumes for rectangular and circular tanks and foundation trenches. Get precise m³/yd³ results from clear internal dimensions and thicknesses, with waste allowance and conversion guidance for accurate ordering.
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            
            <TankTrenchConcreteCalc />

            <TankTrenchConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={['tank-trench']} />
            
            

            
          </article>

          
        </div>
      </main>
    </>
  );
}
