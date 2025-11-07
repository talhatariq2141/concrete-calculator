// app/page.tsx

"use client";

import React from "react";
import { HomepageArticle } from "@/components/app/HomepageArticle";
import { HomepageFAQs } from "@/components/app/HomepageFAQs";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { homepageFaqs } from "@/lib/faqs";
import Hero2 from "@/components/app/Hero-2";
import FeaturedCalcSection from "@/components/app/FeaturedCalcSection";
import WhyChooseSection from "@/components/app/WhyChooseSection";


/**
 * Home page: already strong. We keep FAQs mirrored as JSON-LD via <FaqJsonLd>.
 * No extra JSON-LD here to avoid redundancy; site-level JSON-LD is in RootLayout.
 */
export default function Page() {
  return (
    <main>
      
      <Hero2 />            
      <FeaturedCalcSection />
      <WhyChooseSection />
      <HomepageArticle />
      <HomepageFAQs items={homepageFaqs} />
      <FaqJsonLd items={homepageFaqs} />
    </main>
  );
}
