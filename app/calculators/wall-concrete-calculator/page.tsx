// app/calculators/wall-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import WallConcreteCalc from "@/components/calculators/WallConcreteCalc";

export const metadata: Metadata = {
  title: "Wall Concrete Calculator - Concrete Calculator Max",
  description:
    "Easily calculate the concrete required for walls with or without openings. Step-by-step guide with formulas, examples, and waste allowance for accurate estimates.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/wall-concrete-calculator",
  },
};

export default function WallConcreteCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of a Wall",
        description:
          "Learn how to calculate wall concrete volume using length, height, and thickness. Includes adjustments for door/window openings, unit conversions, and waste allowances.",
        author: { "@type": "Organization", name: "Concrete Calculator Max" },
        publisher: {
          "@type": "Organization",
          name: "Concrete Calculator",
          logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
        },
        datePublished: "2025-10-09",
        dateModified: "2025-10-09",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://concretecalculatormax.com/calculators/wall-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "wall concrete calculator",
          "how to calculate wall concrete",
          "concrete volume for wall",
          "wall thickness concrete",
          "wall construction concrete estimate",
          "cubic meters",
          "cubic feet",
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
            <WallConcreteCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete of a Wall
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Walls are one of the most common structural elements in buildings,
              boundary structures, and retaining systems. To estimate the
              concrete required, you need to calculate the net volume of the wall
              and make adjustments for openings like doors or windows. Below is a
              practical step-by-step guide.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Work in Consistent Units</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Convert all measurements into a single system. In metric, use{" "}
              <strong>meters</strong> for length, height, and thickness. In
              imperial, convert inches to feet. Consistency prevents errors in
              volume estimation.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 2: Apply the Wall Volume Formula</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              The basic formula is:{" "}
              <strong>V = L × H × T</strong>, where <em>L</em> is wall length,
              <em>H</em> is height, and <em>T</em> is thickness.
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (Metric):</em> L = 10&nbsp;m, H = 3&nbsp;m, T =
                0.20&nbsp;m → V = 10 × 3 × 0.20 ={" "}
                <strong>6.0&nbsp;m³</strong>.
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 3: Subtract Openings</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For walls with windows, doors, or vents, calculate each opening’s
              volume using the same formula (width × height × thickness), then
              subtract from the gross wall volume.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 4: Multiply by Quantity</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              If your project includes multiple walls, multiply the net volume of
              one wall by the total number of walls of the same dimension.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 5: Add Waste Allowance</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Always include <strong>5–10%</strong> extra volume to cover
              over-excavation, spillage, or construction tolerances. This ensures
              you won’t run short on pour day.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Conversion Tips</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">1 m³ = 35.315 ft³</li>
              <li className="mt-2 ml-4">1 m³ = 1.308 yd³</li>
              <li className="mt-2 ml-4">
                Always order in supplier-preferred units (m³ or yd³).
              </li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Mixing metric and imperial units.</li>
              <li className="mt-2 ml-4">
                Forgetting to subtract openings like doors and windows.
              </li>
              <li className="mt-2 ml-4">Not adding waste allowance.</li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In summary: calculate gross wall volume, subtract openings, multiply
              by the number of walls, and add 5–10% for waste. Using a{" "}
              <strong>Wall Concrete Calculator</strong> makes the process faster,
              reduces errors, and ensures you order the right amount of concrete
              for your construction project.
            </p>
          </article>

          
        </div>
      </main>
    </>
  );
}
