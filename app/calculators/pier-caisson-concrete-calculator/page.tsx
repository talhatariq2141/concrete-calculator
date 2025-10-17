// app/calculators/pier-caisson-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import PierCaissonCalc from "@/components/calculators/PierCaissonCalc";
import { Box } from "lucide-react";
import PierCaissonConcreteCalcArticle from "@/components/calculators/articles/PierCaissonConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Pier / Caisson Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the concrete required for piers and caissons using cylindrical and belled base formulas. Includes waste allowance and dry-volume guidance.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/pier-caisson-concrete-calculator",
  },
};

export default function PierCaissonCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of Pier and Caisson",
        description:
          "Step-by-step method for calculating concrete volume in piers and caissons using cylindrical and belled base formulas, with waste allowances and conversion tips.",
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
          "@id": "https://concretecalculatormax.com/calculators/pier-caisson-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "pier concrete calculator",
          "caisson concrete calculator",
          "how to calculate concrete of pier",
          "how to calculate concrete of caisson",
          "cylindrical concrete formula",
          "bell base caisson volume",
          "deep foundation concrete",
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
                    <Box className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Pier Caisson Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Calculate concrete volumes for piers and caissons quickly and accurately. Supports cylindrical and belled‑base formulas, unit conversions (m³ / yd³), quantity multipliers and 5–10% waste allowance — ideal for contractors and engineers to order the right amount of concrete.
              </p>
            </div>



            {/* ===== Calculator Slot ===== */}
            <PierCaissonCalc />

            <PierCaissonConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={['pier-caisson']} />

            
          </article>

          </div>

          
        
      </main>
    </>
  );
}
