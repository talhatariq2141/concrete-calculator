// app/calculators/slab-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import SlabConcreteCalc from "@/components/calculators/SlabConcreteCalc";
import { Container } from "lucide-react";
import SlabConcreteCalcArticle from "@/components/calculators/articles/SlabConcreteCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";

export const metadata: Metadata = {
  title: "Slab Concrete Calculator - Concrete Calculator Max",
  description: "Calculate the amount of concrete needed for a slab with our easy-to-use calculator. Input dimensions in metric or imperial units and get instant results.",
  alternates: { canonical: "https://concretecalculatormax.com/calculators/slab-concrete-calculator" },
};

export default function SlabConcreteCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Calculate Concrete for Slab",
    description:
      "A clear, step-by-step method to calculate concrete for a slab in metric or imperial units, with tips to add overage and avoid common mistakes.",
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
      "@id": "https://concretecalculatormax.com/calculators/slab-concrete-calculator",
    },
    articleSection: "Construction",
    keywords: [
      "slab concrete calculator",
      "how to calculate concrete for slab",
      "concrete volume formula",
      "cubic yards",
      "cubic meters",
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
                    <Container className="h-5 w-5 text-green-400" />
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">Slab Concrete Calculator</h1>
                  </div>
                  {/* <div className="flex flex-col text-right mb-4 flex justify-between items-top">
                      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                      <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
                  </div>                   */}
              </div>              
              <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading relaxed font-poppins">Use our free Slab Concrete Calculator to estimate the concrete volume for floors, patios, driveways, and
                  foundation slabs. Enter the slab’s length, width, and thickness in your preferred units to instantly see
                  cubic yards and cubic meters—plus practical extras like waste allowance and mix guidance.</p>
            </div>
            {/* Tile of the Calculator */}
            <SlabConcreteCalc />
            

            <SlabConcreteCalcArticle />
            
            
            <RelatedCalculators className="mt-8 mb-8" exclude={['slab']} />
                       
            
          </article>         
        </div>
      </main>
    </>
  );
}
