// app/calculators/concrete-yards-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import ConcreteYardsCalc from "@/components/calculators/ConcreteYardsCalc";

export const metadata: Metadata = {
  title: "Concrete Yard Calculator - Concrete Calculator Max",
  description:
    "Easily calculate concrete volume in cubic yards with our Concrete Yard Calculator. Learn why cubic yards are used, how to measure dimensions, and how to convert from cubic feet to cubic yards accurately.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/calculators/concrete-yard-calculator",
  },
};

export default function ConcreteYardCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Calculate Concrete in Yards and Convert to Cubic Yards",
        description:
          "Detailed guide on how to use the Concrete Yard Calculator to estimate concrete volume in cubic yards, including conversion formulas and why cubic yards are the standard for ready-mix concrete.",
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
          "@id": "https://concretecalculatormax.com/calculators/concrete-yard-calculator",
        },
        articleSection: "Construction",
        keywords: [
          "concrete yard calculator",
          "how to calculate concrete in yards",
          "convert cubic feet to cubic yards",
          "cubic yard concrete formula",
          "ready mix concrete calculator",
          "concrete volume estimator",
          "yardage calculator",
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
            <ConcreteYardsCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete in Yards and Convert to Cubic Yards
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Concrete is often measured in <strong>cubic yards (yd³)</strong> when ordering 
              from suppliers, especially in the U.S. construction industry. This unit makes 
              it easier to estimate and purchase ready-mix concrete since plants batch and 
              deliver in yard-based quantities. Understanding how to calculate and convert 
              your measurements to cubic yards helps avoid costly overorders or shortages.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Why Concrete is Measured in Cubic Yards</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              A cubic yard represents a cube that measures <strong>3 feet × 3 feet × 3 feet</strong>. 
              Since most concrete projects are large (driveways, slabs, foundations), measuring 
              in smaller units like cubic feet quickly becomes impractical. Using cubic yards 
              provides a manageable and standardized way to communicate with ready-mix suppliers.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>How to Use the Concrete Yard Calculator</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              The Concrete Yard Calculator simplifies the process by allowing you to input 
              dimensions of your structure — <strong>length</strong>, <strong>width</strong>, 
              and <strong>thickness</strong> — in feet and inches. Once you click the{" "}
              <strong>“Calculate”</strong> button, it instantly converts those measurements 
              into total cubic feet and then divides by 27 to display the concrete volume in 
              cubic yards.
            </p>

            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example:</em> For a slab measuring 10 ft (length) × 12 ft (width) × 6 in (thickness):<br />
                Volume in cubic feet = 10 × 12 × 0.5 = <strong>60 ft³</strong><br />
                Volume in cubic yards = 60 ÷ 27 = <strong>2.22 yd³</strong>
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Formula for Converting Cubic Feet to Cubic Yards</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              You can convert manually using this simple formula:
            </p>
            <p className="mt-2 text-[var(--brand-subtle)] font-semibold">
              Cubic Yards = (Length × Width × Depth in feet) ÷ 27
            </p>
            <p className="mt-2 text-[var(--brand-subtle)]">
              The number 27 comes from the conversion factor between cubic feet and cubic 
              yards (since 3 ft × 3 ft × 3 ft = 27 ft³). Therefore, dividing your total 
              volume in cubic feet by 27 gives you the concrete volume in cubic yards.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Tips for Accurate Concrete Estimation</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">Always convert inches to feet before calculation (1 in = 0.0833 ft).</li>
              <li className="mt-2 ml-4">Measure in consistent units (don’t mix metric and imperial).</li>
              <li className="mt-2 ml-4">Add 5–10% extra to account for spillage, uneven subgrade, and waste.</li>
              <li className="mt-2 ml-4">Round up your yardage slightly to avoid running short during pouring.</li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Common Conversions</h2>
            </div>
            <ul>
              <li className="mt-2 ml-4">1 cubic yard = 27 cubic feet</li>
              <li className="mt-2 ml-4">1 cubic meter = 1.308 cubic yards</li>
              <li className="mt-2 ml-4">1 cubic yard ≈ 202 gallons</li>
            </ul>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Why Use an Online Calculator</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Manual calculations can be tedious and error-prone. The online Concrete Yard 
              Calculator performs all conversions automatically, provides instant results, 
              and ensures you can place precise concrete orders without overestimating or 
              underestimating your needs. It’s especially useful for slabs, columns, 
              driveways, and patios where uniform depth and dimensions apply.
            </p>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In short, knowing how to calculate and convert concrete into cubic yards 
              saves both money and time. Use the calculator above for instant results and 
              always verify your inputs to ensure accurate and reliable concrete estimates.
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
