import type { Metadata } from "next";
import { LightHero } from "@/components/app/light/LightHero";
import { LightStats } from "@/components/app/light/LightStats";
import { LightFeatures } from "@/components/app/light/LightFeatures";
import { LightWorkflow } from "@/components/app/light/LightWorkflow";
import { LightFAQ } from "@/components/app/light/LightFAQ";
import { LightCTA } from "@/components/app/light/LightCTA";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { homepageFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Light Homepage",
  description:
    "Explore Concrete Calculator Max in a bright, minimal presentation with quick access to our most-used tools.",
};

export default function LightHomePage() {
  return (
    <main className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <LightHero />
      <LightStats />
      <LightFeatures />
      <LightWorkflow />
      <LightFAQ items={homepageFaqs} />
      <LightCTA />
      <FaqJsonLd items={homepageFaqs} />
    </main>
  );
}
