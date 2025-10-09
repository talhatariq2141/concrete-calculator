import React from "react";
import type { Metadata } from "next";
import RightSidebar from "@/components/app/RightSidebar";
import FootingConcreteCalc from "@/components/calculators/FootingConcreteCalc";

export const metadata: Metadata = {
  title: "Footing Concrete Calculator - Concrete Calculator",
  description:
    "Learn how to calculate the concrete of a footing using simple formulas for rectangular and circular footings, plus tips for waste allowance and unit conversions.",
  alternates: {
    canonical:
      "https://concretecalculatormax.com/footing-concrete-calculator",
  },
};

export default function FootingConcreteCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Calculate Concrete of a Footing?",
    description:
      "Practical guide for calculating concrete of rectangular and circular footings using V = L × W × D or V = π × r² × D, with waste allowance and conversion tips.",
    author: { "@type": "Organization", name: "Concrete Calculator" },
    publisher: {
      "@type": "Organization",
      name: "Concrete Calculator",
      logo: { "@type": "ImageObject", url: "https://example.com/logo.png" },
    },
    datePublished: "2025-09-29",
    dateModified: "2025-09-29",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://concretecalculatormax.com/footing-concrete-calculator",
    },
    articleSection: "Construction",
    keywords: [
      "footing concrete calculator",
      "how to calculate concrete of a footing",
      "footing concrete formula",
      "rectangular footing volume",
      "circular footing volume",
      "concrete calculation tips",
    ],
  };

  return (
    <>
      
      <main className="container-xl py-6">
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {/* ===== Calculator Slot ===== */}
            <FootingConcreteCalc />

            <div className="my-10 h-px w-full bg-border" />

            <header className="mb-6 mt-8">
              <h1 className="text-3xl font-bold text-[var(--brand-primary)]">
                How to Calculate Concrete of a Footing?
              </h1>
            </header>

            <p className="mt-2 text-[var(--brand-subtle)]">
              Calculating the right volume of concrete for a footing is essential
              to avoid under-ordering or costly wastage. Whether your footing is
              rectangular, square, or circular, the process is straightforward if
              you apply the correct formulas and unit conversions.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 1: Work in Consistent Units</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Always normalize dimensions into one system. In metric, use meters
              for length, width, and depth. In imperial, use feet or inches but
              convert them consistently before multiplying.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 2: Apply the Correct Formula</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              For a rectangular or square footing, use{" "}
              <code>V = L × W × D</code>. For a circular footing, use{" "}
              <code>V = π × r² × D</code> where <code>r</code> is half the
              diameter. Keep units consistent to get cubic meters or cubic feet.
            </p>
            <div className="mt-2 rounded-md bg-[var(--brand-muted)] p-4 text-sm text-[var(--brand-primary)] shadow-sm">
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (rectangular, metric):</em> L = 2&nbsp;m, W = 1.5&nbsp;m,
                D = 0.5&nbsp;m → 2 × 1.5 × 0.5 ={" "}
                <strong>1.5&nbsp;m³</strong>.
              </p>
              <p className="mt-2 text-[var(--brand-subtle)]">
                <em>Example (circular, metric):</em> Dia = 1&nbsp;m, r = 0.5&nbsp;m,
                D = 0.4&nbsp;m → π × 0.5² × 0.4 ={" "}
                <strong>0.314&nbsp;m³</strong>.
              </p>
            </div>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Step 3: Add Waste Allowance</h2>
            </div>
            <p className="mt-2 text-[var(--brand-subtle)]">
              Multiply the wet volume by <strong>1.05–1.10</strong> to cover
              spillage, over-excavation, or honeycombing. A 5–10% buffer ensures
              you don’t run short during pouring.
            </p>

            <div className="mt-2 text-xl font-bold prose max-w-none">
              <h2>Pro Tips for Footing Concrete</h2>
            </div>
            <ul>
              <li className=" mt-2 ml-4">
                <strong>Check drawings vs site:</strong> Actual excavation can differ
                from plans—measure at the site before finalizing.
              </li>
              <li className=" mt-2 ml-4">
                <strong>Match supplier units:</strong> Ready-mix plants usually quote
                in m³ or yd³, so convert accordingly.
              </li>
              <li className=" mt-2 ml-4">
                <strong>Break down irregular shapes:</strong> Divide into basic
                rectangular or cylindrical parts and sum their volumes.
              </li>
            </ul>

            <p className="mt-2 text-[var(--brand-subtle)]">
              In summary: normalize units, apply the footing volume formula, add a
              sensible waste percentage, and order in supplier-friendly units. For
              speed and accuracy, use a dedicated footing concrete calculator.
            </p>
          </article>

          <div className="lg:col-span-4">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
