// app/calculators/nominal-mix-m5-m25-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import NominalMixConcreteCalc from "@/components/calculators/NominalMixConcreteCalc";

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


      <main className="container-xl py-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {/* ===== Calculator Slot ===== */}
            <NominalMixConcreteCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete for Nominal Mix (M5–M25)
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Nominal mix concrete is prepared using fixed volumetric ratios of cement, sand, and coarse aggregate. It is commonly used up to grade M25 for general construction works. Below is a practical method for estimating quantities of cement, sand, aggregate, and water for any nominal grade, along with key tips and worked examples.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Know the Mix Ratios</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Standard nominal mix ratios are defined in IS 456 for grades up to M25: M5 (1:5:10), M7.5 (1:4:8), M10 (1:3:6), M15 (1:2:4), M20 (1:1.5:3), M25 (1:1:2). These ratios indicate cement : sand : aggregate parts by volume.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 2: Convert Wet Volume to Dry Volume</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Multiply the target wet volume by a <strong>dry volume factor</strong> (typically 1.50–1.57; use 1.54 as default) and add a small wastage allowance (2–5%). This accounts for voids and bulking of sand.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 3: Split Volume by Mix Parts</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Divide the dry volume into cement, sand, and aggregate volumes using the ratio parts. For example, in M20 (1:1.5:3), the total parts = 5.5. Cement = (1/5.5) × Dry Volume, Sand = (1.5/5.5) × Dry Volume, Aggregate = (3/5.5) × Dry Volume.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 4: Convert Volumes to Mass</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Multiply volumes by material bulk densities (cement ≈ 1440 kg/m³, sand ≈ 1600 kg/m³, aggregate ≈ 1500 kg/m³). Cement mass can be divided by 50 to get the number of bags.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 5: Calculate Water Requirement</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Water is computed using the water–cement ratio. For example, if w/c = 0.5 and cement = 400 kg, then water = 0.5 × 400 = 200 liters. Adjust for moisture in aggregates if necessary.
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Worked Example (M20):</em> For 1 m³ wet volume, Dry Volume = 1 × 1.54 × 1.02 = 1.57 m³. Parts = 5.5. Cement = 0.286 m³ × 1440 = 412 kg (≈ 8.2 bags). Sand = 0.429 m³ × 1600 = 686 kg. Aggregate = 0.857 m³ × 1500 = 1286 kg. Water = 0.5 × 412 = 206 L.
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Conversion Tips</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">1 m³ = 35.315 ft³</li>
              <li className="mt-2 ml-4">1 m³ = 1.308 yd³</li>
              <li className="mt-2 ml-4">Order in the unit your supplier provides (m³, ft³, or yd³).</li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Using nominal mixes above M25 (design mix required).</li>
              <li className="mt-2 ml-4">Mixing metric and imperial units.</li>
              <li className="mt-2 ml-4">Not accounting for wastage or aggregate moisture.</li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In summary: select grade and ratio, calculate dry volume, split into parts, convert to mass, and apply water–cement ratio. The calculator automates this process, minimizes errors, and ensures accurate material estimation for site use.
            </p>
          </article>

          
        </div>
      </main>
    </>
  );
}
