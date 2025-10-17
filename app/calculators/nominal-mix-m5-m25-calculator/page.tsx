// app/calculators/nominal-mix-m5-m25-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import NominalMixConcreteCalc from "@/components/calculators/NominalMixConcreteCalc";
import { Boxes } from "lucide-react";
import NominalMixConcreteCalcArticle from "@/components/calculators/articles/NominalMixConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Nominal Mix (M5–M25) Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the cement, sand, aggregate, and water required for nominal mix concrete grades M5 to M25 using standard proportions and dry-volume adjustments.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator",
  },
};

export default function NominalMixCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete for Nominal Mix (M5–M25)",
        description:
          "Step-by-step method for calculating cement, sand, aggregate, and water quantities for nominal concrete grades M5–M25 with dry-volume factor, wastage, and water–cement ratio guidance.",
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
          "@id": "https://concretecalculatormax.com/calculators/nominal-mix-m5-m25-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "nominal mix calculator",
          "M5 concrete calculator",
          "M20 nominal mix",
          "how to calculate nominal mix concrete",
          "cement sand aggregate ratio",
          "M25 mix design",
          "dry volume factor",
          "water cement ratio",
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
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Nominal Mix M5-M25 Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Quickly estimate cement, sand, aggregate, and water for Nominal Mix grades M5–M25 with this Nominal Mix Calculator. Enter wet volume and grade to get dry-volume adjusted quantities, bag counts, and recommended water–cement ratios for accurate material estimation and efficient site ordering.
              </p>
            </div>





            {/* ===== Calculator Slot ===== */}
            <NominalMixConcreteCalc />

            <NominalMixConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={['nominal-mix']} />
          </article>


          </div>

          
        
      </main>
    </>
  );
}
