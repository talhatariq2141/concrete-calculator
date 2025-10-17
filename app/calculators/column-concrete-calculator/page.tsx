// app/concrete-volume-calculators/calculators/column-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import ColumnConcreteCalc from "@/components/calculators/ColumnConcreteCalc";
import { Columns2 } from "lucide-react";
import ColumnConcreteCalcArticle from "@/components/calculators/articles/ColumnConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Column Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the amount of concrete needed for a column using V = Area × Height for rectangular/square and circular columns, with waste allowance and dry-volume factor.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/column-concrete-calculator",
  },
};

export default function ColumnConcreteCalculatorPage() {
  // JSON-LD (Article). If you inject elsewhere globally, you can lift this object.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of a Column?",
        description:
          "Practical, site-tested steps for calculating column concrete for rectangular/square and circular sections using V = Area × Height, plus waste and dry-volume tips.",
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
          "@id": "https://concretecalculatormax.com/calculators/column-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "column concrete calculator",
          "how to calculate concrete of a column",
          "circular column volume",
          "rectangular column volume",
          "concrete volume formula",
          "dry volume factor",
          "waste allowance",
          "cubic meters",
          "cubic yards",
        ],
      }
    ],
  };

  return (
    <>
      {/* JSON-LD rendered inline for this page */}
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
                    <Columns2 className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Column Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Easily estimate the concrete volume needed for rectangular, square, or circular columns. Enter your dimensions, choose units, and get instant results with waste and dry-volume options.
              </p>
            </div>






            {/* ===== Calculator Slot (add later) ===== */}
            <ColumnConcreteCalc />

            <ColumnConcreteCalcArticle />
            <RelatedCalculators className="mt-8 mb-8" exclude={['column']} />
        
          </article>

          
        </div>
      </main>
    </>
  );
}
