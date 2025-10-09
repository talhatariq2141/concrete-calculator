
// app/calculators/staircase-concrete-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import StaircaseConcreteCalc from "@/components/calculators/StaircaseConcreteCalc";

export const metadata: Metadata = {
  title: "Staircase Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the concrete required for staircases using waist-slab and solid stair formulas. Includes landings, wedges, unit conversions, and waste allowances.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/staircase-concrete-calculator",
  },
};

export default function StaircaseCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of a Staircase",
        description:
          "Step-by-step method for calculating concrete volume in staircases, including waist-slab and solid stair methods, landings, wedges, and waste allowance.",
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
          "@id": "https://concretecalculatormax.com/calculators/staircase-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "staircase concrete calculator",
          "how to calculate staircase concrete",
          "waist slab stairs",
          "solid concrete stairs",
          "staircase landing volume",
          "step wedge volume",
          "construction concrete estimation",
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

      <main className="container-xl py-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {/* ===== Calculator Slot ===== */}
            <StaircaseConcreteCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete of a Staircase
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Staircases are a vital structural and architectural feature in buildings.
              Concrete stair design may use a <strong>waist-slab</strong> (an inclined
              slab supporting the steps) or <strong>solid (mass)</strong> construction,
              where each step is modeled as a block. Below is a practical method to
              calculate the volume of concrete required for staircases, including
              landings, wedges, and waste allowance.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Define Stair Inputs</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Gather the number of steps (n), tread depth (T), riser height (R),
              staircase width (W), and waist thickness (t<sub>w</sub> if applicable).
              Landings require their own length (L), width (B), and thickness (t).
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 2: Calculate Sloped Length</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Total horizontal run = <strong>n × T</strong>, total vertical rise ={" "}
              <strong>n × R</strong>. The sloped length of the stair flight is:
              <br />
              <strong>L<sub>s</sub> = √[(nT)² + (nR)²]</strong>
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 3: Waist-Slab Method</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For waist-slab stairs:
              <br />
              Inclined slab volume = <strong>V<sub>waist</sub> = t<sub>w</sub> × W × L<sub>s</sub></strong>
              <br />
              Wedge volume = <strong>V<sub>wedge</sub> = ½ × n × T × R × W</strong>
              <br />
              Add landing volumes = <strong>Σ(L × B × t)</strong>
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 4: Solid Stair Method</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For solid stairs, volume is approximated as stacked blocks:
              <br />
              <strong>V<sub>solid</sub> = n × T × R × W</strong> (plus landings)
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (Metric):</em> n = 12, T = 0.28 m, R = 0.17 m, W = 1.20 m,
                t<sub>w</sub> = 0.15 m. Landings: L = 1.20 m, B = 1.20 m, t = 0.15 m.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                L<sub>s</sub> ≈ 3.92 m → V<sub>waist</sub> = 0.706 m³; V<sub>wedge</sub> = 0.343 m³;
                landings = 0.432 m³ → Total ≈ <strong>1.481 m³</strong>.
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 5: Add Waste Allowance</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Always add <strong>5–10%</strong> extra to account for over-excavation,
              spillage, and practical site losses. This ensures sufficient supply for
              finishing.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Conversion Tips</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">1 m³ = 35.315 ft³</li>
              <li className="mt-2 ml-4">1 m³ = 1.308 yd³</li>
              <li className="mt-2 ml-4">Concrete weight ≈ 2,400 kg/m³</li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Mixing metric and imperial units.</li>
              <li className="mt-2 ml-4">Forgetting to add wedge volumes in waist-slab stairs.</li>
              <li className="mt-2 ml-4">Not including landings in total calculation.</li>
              <li className="mt-2 ml-4">Skipping waste allowance.</li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In summary: define your step dimensions, calculate sloped length, apply
              waist-slab or solid formulas, add landings, and include 5–10% waste. A
              staircase concrete calculator simplifies this process, reduces errors,
              and ensures accurate material planning for your project.
            </p>
          </article>

          <div className="lg:col-span-4">
            <RightSidebar />
          </div>
        </div>
      </main>
    </>
  );
}
