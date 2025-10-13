// app/calculators/pier-caisson-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import PierCaissonCalc from "@/components/calculators/PierCaissonCalc";

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

      <main className="container-xl py-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {/* ===== Calculator Slot ===== */}
            <PierCaissonCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete of Pier and Caisson
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Piers and caissons are deep foundation elements used where soil conditions
              require heavy load-bearing capacity. Both are cylindrical in shape, and
              their volume is based on simple geometric formulas. Below is a practical
              workflow to calculate pier or caisson concrete accurately, including for
              belled bases and waste allowance.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Work in Consistent Units</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Convert all inputs to a single system before calculating. In metric, use{" "}
              <strong>meters</strong> for depth and diameter; in imperial, convert inches
              to feet. This prevents errors in final volume.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 2: Apply the Cylinder Formula</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For a straight shaft pier or caisson, volume is calculated as:{" "}
              <strong>V = π × r² × h</strong>, where <em>r</em> is radius and <em>h</em>{" "}
              is depth.
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (Metric):</em> D = 1.2&nbsp;m, h = 10&nbsp;m → r = 0.6&nbsp;m →
                V = 3.1416 × 0.6² × 10 = <strong>11.31&nbsp;m³</strong>.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                For 6 piers: 11.31 × 6 = <strong>67.86&nbsp;m³</strong>.
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 3: Include a Belled Base if Applicable</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Caissons often have a widened base for added stability. Use the frustum
              formula:{" "}
              <strong>
                V = (πh / 3) × (R<sub>1</sub>² + R<sub>1</sub>R<sub>2</sub> + R<sub>2</sub>²)
              </strong>{" "}
              where R<sub>1</sub> is the top radius and R<sub>2</sub> is the bottom radius
              of the bell.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 4: Multiply by Quantity</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Multiply the per-unit concrete volume by the total number of piers or
              caissons required for your foundation plan.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 5: Add Waste Allowance</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Always add <strong>5–10%</strong> extra to account for over-excavation,
              spillage, or pump line losses. This ensures you won’t fall short on pour
              day.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Conversion Tips</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">1 m³ = 35.315 ft³</li>
              <li className="mt-2 ml-4">1 m³ = 1.308 yd³</li>
              <li className="mt-2 ml-4">Always order in supplier-preferred units (m³ or yd³).</li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Mixing metric and imperial units.</li>
              <li className="mt-2 ml-4">Forgetting to include belled base volume.</li>
              <li className="mt-2 ml-4">Not adding waste allowance.</li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In summary: calculate shaft volume with <strong>V = πr²h</strong>, add bell
              volume if required, multiply by number of units, and include 5–10% waste. A
              pier/caisson calculator makes this process faster, reduces human error, and
              ensures you order the right amount of concrete for your foundation.
            </p>
          </article>

          
        </div>
      </main>
    </>
  );
}
