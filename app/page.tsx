"use client";

import React from "react";

import HeroHome from "@/components/app/HeroHome";
import { CalculatorForm } from "@/components/app/HomeCalcForm";
import { HomepageArticle } from "@/components/app/HomepageArticle";
import { HomepageFAQs } from "@/components/app/HomepageFAQs";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { homepageFaqs } from "@/lib/faqs";
import Hero2 from "@/components/app/Hero-2";
import FeaturedCalcSection from "@/components/app/FeaturedCalcSection";
import WhyChooseSection from "@/components/app/WhyChooseSection";

/* ----------------------------- */
export default function Page() {

  return (
    <main>
      <Hero2 />
      <FeaturedCalcSection />
      <WhyChooseSection />      
      <HomepageArticle />
      <HomepageFAQs items={homepageFaqs} />
      {/* JSON-LD for the same FAQs (place anywhere in the page body) */}
      <FaqJsonLd items={homepageFaqs} />
      
    </main>
  );
}
