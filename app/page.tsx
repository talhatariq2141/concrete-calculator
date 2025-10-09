"use client";

import React from "react";
import Hero from "@/components/app/Hero";

import HeroHome from "@/components/app/HeroHome";
import { CalculatorForm } from "@/components/app/HomeCalcForm";
import { HomepageArticle } from "@/components/app/HomepageArticle";
import { HomepageFAQs } from "@/components/app/HomepageFAQs";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { homepageFaqs } from "@/lib/faqs";

/* ----------------------------- */
export default function Page() {

  return (
    <main>
      <Hero />
      
      <section id="calculator-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 mt-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Calculate Your Concrete Volume</h2>
            <CalculatorForm />
          </div>
      </section>
      <HeroHome />
      <HomepageArticle />
      <HomepageFAQs items={homepageFaqs} />
      {/* JSON-LD for the same FAQs (place anywhere in the page body) */}
      <FaqJsonLd items={homepageFaqs} />
      
    </main>
  );
}
