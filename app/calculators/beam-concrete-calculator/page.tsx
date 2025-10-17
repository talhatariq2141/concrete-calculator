// app/concrete-volume-calculators/calculators/beam-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import BeamConcreteCalc from "@/components/calculators/BeamConcreteCalc";
import { Container } from "lucide-react";
import BeamConcreteCalcArticle from "@/components/calculators/articles/BeamConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";


export const metadata: Metadata = {
  title: "Beam Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the amount of concrete needed for a beam using V = L × b × d, with optional void subtraction, waste allowance, and dry-volume factor.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/beam-concrete-calculator",
  },
};

export default function BeamConcreteCalculatorPage() {
  // (Optional) If you inject JSON-LD elsewhere globally, keep this object.
  // Otherwise, you can render it with a <script> tag in this component.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Calculate Concrete of a Beam?",
    description:
      "Practical, site-tested steps for calculating beam concrete using V = L × b × d, plus adjustments for voids, waste, and dry-volume factor.",
    author: { "@type": "Organization", name: "Concrete Calculator max" },
    publisher: {
      "@type": "Organization",
      name: "Concrete Calculator Max",
      logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
    },
    datePublished: "2025-10-09",
    dateModified: "2025-10-09",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://concretecalculatormax.com/calculators/beam-concrete-calculator",
    },
    articleSection: "Construction",
    keywords: [
      "beam concrete calculator",
      "how to calculate concrete of a beam",
      "concrete volume formula",
      "dry volume factor",
      "waste allowance",
      "void subtraction",
      "cubic meters",
      "cubic yards",
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
              <div className="mb-4 flex justify-between items-start">
                <div className="w-full/50 text-left">
                    <div className="flex item-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                      <Container className="h-5 w-5 text-green-400" />
                      </div>
                      <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold font-poppins tracking-tight leading-tight">Beam Concrete Calculator</h1>
                    </div>
                    <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font poppins">Estimate concrete for slabs, patios, and floors.</p>
                </div>
                <div className="flex flex-col text-right mb-4 flex justify-between">
                    <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                    <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                </div>
              </div>
              {/* ===== Calculator Slot (add later) ===== */}
              <BeamConcreteCalc />

              <BeamConcreteCalcArticle />
              <RelatedCalculators className="mt-8 mb-8" exclude={['beam']} />
              
            </article>

            
          
        </div>
      </main>

     
    </>
  );
}
