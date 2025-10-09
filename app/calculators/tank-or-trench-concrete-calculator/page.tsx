// app/calculators/tank-or-trench-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import TankTrenchConcreteCalc from "@/components/calculators/TankTrenchConcreteCalc";

export const metadata: Metadata = {
  title: "Tank / Trench Concrete Calculator – Concrete Calculator Max",
  description:
    "Learn how to calculate concrete volume for rectangular tanks, circular tanks, and foundation trenches. Step-by-step formulas, examples, conversion tips, and waste allowances.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator",
  },
};

export default function TankTrenchCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Tank or Trench Concrete",
        description:
          "A practical guide to computing concrete for rectangular tanks, circular tanks, and trenches with step-by-step formulas, examples, and waste allowances.",
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
          "@id": "https://concretecalculatormax.com/calculators/tank-or-trench-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "tank concrete calculator",
          "trench concrete calculator",
          "rectangular tank concrete",
          "circular tank concrete",
          "foundation trench volume",
          "concrete volume m3 to yd3",
          "how to calculate tank concrete",
          "how to calculate trench concrete",
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
            
            <TankTrenchConcreteCalc />
            
            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Tank or Trench Concrete
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              This guide explains exactly how much concrete you need for{" "}
              <strong>tanks (rectangular &amp; circular)</strong> and{" "}
              <strong>foundation trenches</strong>. You’ll learn the core
              formulas, get worked examples, and see the most common pitfalls so you can
              order confidently with the right waste allowance.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Use Consistent Units</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Convert all inputs to a single system <em>before</em> calculating.
              Metric: meters (m). Imperial: feet (ft). If your drawings show cm or inches,
              convert them into meters or feet respectively to avoid errors.
            </p>

            {/* ===================== RECTANGULAR TANK ===================== */}
            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Rectangular (Regular) Tank Concrete</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For a water-retaining tank, the concrete volume is computed as the{" "}
              <strong>outer volume minus inner volume</strong>, which naturally includes
              the base slab, the walls, and (if provided) the cover slab.
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm shadow-sm">
              <p className="text-[var(--brand-primary)] font-semibold">Formulas</p>
              <ul className="mt-2 list-disc pl-6 text-[var(--brand-subtle)]">
                <li>
                  <strong>Outer dims</strong>: L<sub>o</sub> = L<sub>i</sub> + 2t<sub>w</sub>, W<sub>o</sub> = W<sub>i</sub> + 2t<sub>w</sub>, H<sub>o</sub> = H<sub>i</sub> + t<sub>b</sub> + t<sub>t</sub>
                </li>
                <li>
                  <strong>Outer Volume</strong> = L<sub>o</sub> × W<sub>o</sub> × H<sub>o</sub>
                </li>
                <li>
                  <strong>Inner Volume</strong> = L<sub>i</sub> × W<sub>i</sub> × H<sub>i</sub>
                </li>
                <li>
                  <strong>Concrete</strong> = Outer − Inner
                </li>
              </ul>
            </div>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Where L<sub>i</sub>, W<sub>i</sub>, H<sub>i</sub> are the clear internal
              dimensions; t<sub>w</sub> is wall thickness; t<sub>b</sub> base thickness;
              and t<sub>t</sub> cover slab thickness (0 if not provided).
            </p>

            <div className="mt-2 rounded-md border border-[var(--brand-border)] bg-white p-4 text-sm">
              <p className="text-[var(--brand-primary)] font-semibold">Example (Metric)</p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                L<sub>i</sub>=3.0 m, W<sub>i</sub>=2.0 m, H<sub>i</sub>=2.0 m,
                t<sub>w</sub>=0.20 m, t<sub>b</sub>=0.25 m, t<sub>t</sub>=0.15 m.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                L<sub>o</sub>=3.4, W<sub>o</sub>=2.4, H<sub>o</sub>=2.40 → Outer=3.4×2.4×2.4=19.58 m³
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                Inner=3.0×2.0×2.0=12.00 m³ → <strong>Concrete = 7.58 m³</strong>
              </p>
            </div>

            {/* ===================== CIRCULAR TANK ===================== */}
            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Circular Tank Concrete</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Similar idea: compute the outer cylinder and subtract the inner cylinder.
              Include the base (and top, if applicable).
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm shadow-sm">
              <p className="text-[var(--brand-primary)] font-semibold">Formulas</p>
              <ul className="mt-2 list-disc pl-6 text-[var(--brand-subtle)]">
                <li>
                  D<sub>o</sub> = D<sub>i</sub> + 2t<sub>w</sub>, H<sub>o</sub> = H<sub>i</sub> + t<sub>b</sub> + t<sub>t</sub>
                </li>
                <li>
                  Outer = π × (D<sub>o</sub>/2)² × H<sub>o</sub>
                </li>
                <li>
                  Inner = π × (D<sub>i</sub>/2)² × H<sub>i</sub>
                </li>
                <li>
                  Concrete = Outer − Inner
                </li>
              </ul>
            </div>

            <div className="mt-2 rounded-md border border-[var(--brand-border)] bg-white p-4 text-sm">
              <p className="text-[var(--brand-primary)] font-semibold">Example (Metric)</p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                D<sub>i</sub>=2.5 m, H<sub>i</sub>=2.0 m, t<sub>w</sub>=0.20 m,
                t<sub>b</sub>=0.25 m, t<sub>t</sub>=0.15 m → D<sub>o</sub>=2.9 m, H<sub>o</sub>=2.40 m.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                Outer = π×(2.9/2)²×2.4 = 15.83 m³; Inner = π×(2.5/2)²×2.0 = 9.82 m³ →
                <strong> Concrete = 6.01 m³</strong>
              </p>
            </div>

            {/* ===================== TRENCH ===================== */}
            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Trench Concrete</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Trench volume is a prismatic approximation. Use a rectangular or trapezoidal
              cross-section depending on the excavation shape.
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm shadow-sm">
              <p className="text-[var(--brand-primary)] font-semibold">Formulas</p>
              <ul className="mt-2 list-disc pl-6 text-[var(--brand-subtle)]">
                <li>
                  <strong>Rectangular</strong>: V = L × W × D
                </li>
                <li>
                  <strong>Trapezoidal</strong>: V = L × D × (TopW + BottomW) / 2
                </li>
              </ul>
            </div>

            <div className="mt-2 rounded-md border border-[var(--brand-border)] bg-white p-4 text-sm">
              <p className="text-[var(--brand-primary)] font-semibold">Example (Trapezoidal)</p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                L=24 m, D=0.9 m, TopW=0.8 m, BottomW=0.5 m
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                V = 24 × 0.9 × (0.8+0.5)/2 = 14.04 m³
              </p>
            </div>

            {/* ===================== WASTE & CONVERSIONS ===================== */}
            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Waste Allowance &amp; Conversions</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Add <strong>5–10%</strong> for spillage, pump line losses, and minor
              over-excavation. Order in the supplier’s preferred units and round up to
              the nearest truck load if needed.
            </p>
            <ul>
              <li className="mt-2 ml-4">1 m³ = 35.3147 ft³</li>
              <li className="mt-2 ml-4">1 m³ = 1.30795 yd³</li>
            </ul>

            {/* ===================== DESIGN NOTES ===================== */}
            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Design Notes &amp; Best Practices</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">
                Use <strong>clear (inner) dimensions</strong> for tanks when deriving
                outer dimensions via thicknesses.
              </li>
              <li className="mt-2 ml-4">
                Confirm <strong>wall/base/top thickness</strong>, reinforcement, and joints
                per structural drawings—especially for water-retaining structures.
              </li>
              <li className="mt-2 ml-4">
                For trenches, ensure the section shape (rectangular vs. trapezoidal) matches
                the excavation profile approved on site.
              </li>
              <li className="mt-2 ml-4">
                Consider site access, pour sequence, and lift heights to minimize cold joints.
              </li>
            </ul>

            {/* ===================== COMMON MISTAKES ===================== */}
            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Mixing metric and imperial units in one calculation.</li>
              <li className="mt-2 ml-4">Ignoring cover slab thickness when it’s specified.</li>
              <li className="mt-2 ml-4">Underestimating trench width due to side batter or collapse.</li>
              <li className="mt-2 ml-4">Forgetting to add waste allowance (5–10%).</li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In summary, calculate tanks by subtracting the inner volume from the outer
              (including base and optional cover), and compute trenches using the correct
              cross-section. Add waste, convert to supplier units, and round sensibly for
              delivery. Your on-page calculator will handle these steps in seconds and
              reduce errors.
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
