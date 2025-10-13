// app/concrete-volume-calculators/calculators/column-concrete-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import ColumnConcreteCalc from "@/components/calculators/ColumnConcreteCalc";

export const metadata: Metadata = {
  title: "Column Concrete Calculator - Concrete Calculator Max",
  description:
    "Calculate the amount of concrete needed for a column using V = Area × Height for rectangular/square and circular columns, with waste allowance and dry-volume factor.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/column-concrete-calculator",
  },
};

export default function ColumnConcreteCalculatorPage() {
  // JSON-LD (Article). If you inject elsewhere globally, you can lift this object.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete of a Column?",
        description:
          "Practical, site-tested steps for calculating column concrete for rectangular/square and circular sections using V = Area × Height, plus waste and dry-volume tips.",
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
          "@id": "https://concretecalculatormax.com/calculators/column-concrete-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "column concrete calculator",
          "how to calculate concrete of a column",
          "circular column volume",
          "rectangular column volume",
          "concrete volume formula",
          "dry volume factor",
          "waste allowance",
          "cubic meters",
          "cubic yards",
        ],
      }
    ],
  };

  return (
    <>
      {/* JSON-LD rendered inline for this page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="container-xl py-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {/* ===== Calculator Slot (add later) ===== */}
            <ColumnConcreteCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete of a Column?
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              This guide shows the exact formulas and a field-tested workflow to estimate
              concrete for columns—both rectangular/square and circular—plus sensible
              allowances so you can order confidently and avoid shortfalls.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Normalize All Dimensions</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Work in a single unit system. In metric, use meters (m) for length/width/height
              (or diameter/height). In imperial, convert inches to feet before multiplying.
              Mixed units are the quickest way to misorder concrete.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 2: Choose the Correct Area Formula</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Column wet volume is <strong>V = Area × Height</strong>. Use the right
              cross-section area:
            </p>
            <ul>
              <li className="mt-2 ml-4">
                <strong>Rectangular/Square:</strong> <code>Area = Length × Width</code>
              </li>
              <li className="mt-2 ml-4">
                <strong>Circular:</strong> <code>Area = π × (Diameter ÷ 2)²</code>
              </li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 3: Compute the Volume</h2>
            </div>
            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (Rectangular, metric):</em> L = 0.40&nbsp;m, W = 0.30&nbsp;m,
                H = 3&nbsp;m → Area = 0.40 × 0.30 = 0.12&nbsp;m² → V = 0.12 × 3 =
                <strong> 0.36&nbsp;m³</strong>.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (Circular, metric):</em> D = 0.50&nbsp;m, H = 3&nbsp;m → Area =
                π × (0.25)² = 0.19635&nbsp;m² → V = 0.19635 × 3 =
                <strong> 0.589&nbsp;m³</strong>.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Imperial tip:</em> Compute in <strong>ft³</strong> first, then ÷ 27
                to get <strong>yd³</strong>.
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 4: Account for Openings (Rare) &amp; Cover</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Most columns are solid—no volume subtraction needed. If sleeves/embedded
              conduits create continuous voids, estimate each void volume and subtract it
              from the gross volume. Reinforcement steel does <em>not</em> require any
              subtraction in typical estimating.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 5: Add a Waste Allowance</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Apply a realistic buffer—typically <strong>5–10%</strong>—after all
              subtractions. Tighter formwork and experienced crews lean toward 5%; congested
              rebar, tall lifts, or pump placement may justify 8–10%.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 6 (Optional): Convert to Dry Volume for Mix Breakdown</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For material splits (cement/sand/aggregate), multiply wet volume (after waste)
              by a dry-volume factor (often <strong>1.50–1.54</strong>). For ready-mix
              orders, you usually only need wet volume plus waste.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Pro Tips from Site Experience</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">
                <strong>Verify form size:</strong> Measure the formed cross-section (clear
                of cover) and the actual story height at site.
              </li>
              <li className="mt-2 ml-4">
                <strong>Segment unusual shapes:</strong> For chamfers or flares, split
                into simple shapes and sum volumes.
              </li>
              <li className="mt-2 ml-4">
                <strong>Match supplier units:</strong> Order in <strong>m³</strong> (metric)
                or <strong>yd³</strong> (U.S.) to avoid last-minute conversions.
              </li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Mistakes to Avoid</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Mixing units before multiplying.</li>
              <li className="mt-2 ml-4">
                Adding waste <em>before</em> subtracting any voids.
              </li>
              <li className="mt-2 ml-4">
                Using a dry-volume factor when placing a ready-mix order (it’s for material
                breakdowns, not wet-volume purchases).
              </li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In short: compute <strong>V = Area × Height</strong> with consistent units,
              subtract rare openings, then add a sensible waste buffer. For speed and fewer
              errors, run your numbers in a unit-aware column calculator and compare supplier
              quotes with confidence.
            </p>
          </article>

          
        </div>
      </main>
    </>
  );
}
