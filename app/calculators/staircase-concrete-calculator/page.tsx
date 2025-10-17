
// app/calculators/staircase-concrete-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import StaircaseConcreteCalc from "@/components/calculators/StaircaseConcreteCalc";
import { Boxes } from "lucide-react";
import StaircaseConcreteCalcArticle from "@/components/calculators/articles/StaircaseConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Staircase Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the concrete required for staircases using waist-slab and solid stair formulas. Includes landings, wedges, unit conversions, and waste allowances.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/staircase-concrete-calculator",
  },
};

export default function StaircaseCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of a Staircase",
        description:
          "Step-by-step method for calculating concrete volume in staircases, including waist-slab and solid stair methods, landings, wedges, and waste allowance.",
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
          "@id": "https://concretecalculatormax.com/calculators/staircase-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "staircase concrete calculator",
          "how to calculate staircase concrete",
          "waist slab stairs",
          "solid concrete stairs",
          "staircase landing volume",
          "step wedge volume",
          "construction concrete estimation",
          "cubic meters",
          "cubic yards",
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Staircase Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Calculate staircase concrete volume quickly and accurately with this Staircase Concrete Calculator. Supports waist-slab and solid-stair methods, landing and wedge volumes, unit conversions (m³/yd³), and waste allowance for precise material planning.
              </p>
            </div>



            {/* ===== Calculator Slot ===== */}
            <StaircaseConcreteCalc />

            <StaircaseConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={['staircase']} />

            

            
          </article>

          
        </div>
      </main>
    </>
  );
}
