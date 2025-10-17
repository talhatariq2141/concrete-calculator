import React from "react";
import type { Metadata } from "next";
import FootingConcreteCalc from "@/components/calculators/FootingConcreteCalc";
import { RulerDimensionLine } from "lucide-react";
import FootingConcreteCalcArticle from "@/components/calculators/articles/FootingConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Footing Concrete Calculator - Concrete Calculator",
  description:
    "Learn how to calculate the concrete of a footing using simple formulas for rectangular and circular footings, plus tips for waste allowance and unit conversions.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/footing-concrete-calculator",
  },
};

export default function FootingConcreteCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Calculate Concrete of a Footing?",
    description:
      "Practical guide for calculating concrete of rectangular and circular footings using V = L × W × D or V = π × r² × D, with waste allowance and conversion tips.",
    author: { "@type": "Organization", name: "Concrete Calculator" },
    publisher: {
      "@type": "Organization",
      name: "Concrete Calculator",
      logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
    },
    datePublished: "2025-09-29",
    dateModified: "2025-09-29",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://concretecalculatormax.com/footing-concrete-calculator",
    },
    articleSection: "Construction",
    keywords: [
      "footing concrete calculator",
      "how to calculate concrete of a footing",
      "footing concrete formula",
      "rectangular footing volume",
      "circular footing volume",
      "concrete calculation tips",
    ],
  };

  return (
    <>
      
      <main className="container-xl">

          <div className="flex">
        
          <article className="lg:col-span-8">

            {/* Title and Description of Calculator */}
            <div className="flex flex-col mb-4 justify-between">
              <div className="w-full/50 text-left">
                  <div className="flex item-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                    <RulerDimensionLine className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Footing Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">
                Footing Concrete Calculator — Quickly calculate concrete volume for rectangular, square, or circular footings in metric or imperial units. Includes waste allowance and conversion tips to help you order the right amount.
              </p>
            </div>

            {/* ===== Calculator Slot ===== */}
            <FootingConcreteCalc />

            <FootingConcreteCalcArticle />

            <RelatedCalculators className="mt-8 mb-8" exclude={['footing']} />
            </article>

          </div>

          
        
      </main>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
