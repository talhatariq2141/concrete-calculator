// app/calculators/wall-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import WallConcreteCalc from "@/components/calculators/WallConcreteCalc";
import { BrickWall } from "lucide-react";
import WallConcreteCalcArticle from "@/components/calculators/articles/WallConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Wall Concrete Calculator - Concrete Calculator Max",
  description:
    "Easily calculate the concrete required for walls with or without openings. Step-by-step guide with formulas, examples, and waste allowance for accurate estimates.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/wall-concrete-calculator",
  },
};

export default function WallConcreteCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of a Wall",
        description:
          "Learn how to calculate wall concrete volume using length, height, and thickness. Includes adjustments for door/window openings, unit conversions, and waste allowances.",
        author: { "@type": "Organization", name: "Concrete Calculator Max" },
        publisher: {
          "@type": "Organization",
          name: "Concrete Calculator",
          logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
        },
        datePublished: "2025-10-09",
        dateModified: "2025-10-09",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://concretecalculatormax.com/calculators/wall-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "wall concrete calculator",
          "how to calculate wall concrete",
          "concrete volume for wall",
          "wall thickness concrete",
          "wall construction concrete estimate",
          "cubic meters",
          "cubic feet",
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
                    <BrickWall className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Wall Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Calculate wall concrete volume quickly and accurately with this Wall Concrete Calculator. Enter wall length, height, thickness and any openings (doors/windows) to get net volume in m³, ft³ or yd³ — includes unit conversions and a configurable waste allowance for precise ordering and cost estimates.
              </p>
            </div>





            {/* ===== Calculator Slot ===== */}
            <WallConcreteCalc />

            <WallConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={['wall']} />

            
          </article>

          
        </div>
      </main>
    </>
  );
}
