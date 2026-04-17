// app/(site)/calculators/gravel/page.tsx

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, Layers, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Gravel Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free gravel calculators to estimate weight, volume, and cost for driveway, pea gravel, and aquarium projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/gravel",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/gravel",
    title: "Gravel Calculators Hub",
    description: "Suite of tools to calculate gravel tons, yards, bags, and project cost.",
    images: [
      {
        url: "/og/gravel-calculators.png",
        width: 1200,
        height: 630,
        alt: "Gravel Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravel Calculators Hub",
    description: "Suite of tools to calculate gravel tons, yards, bags, and project cost.",
    images: ["/og/gravel-calculators.png"],
  },
};

export default function GravelCalculatorsHubPage() {
  const gravelCalcs = CALCULATORS.filter(
    (c) => c.category === "Gravel" || c.id.includes("gravel-cost-calculator")
  );

  return (
    <main className="container-xl py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li className="px-1 text-slate-500">/</li>
          <li>
            <Link href="/calculators" className="hover:underline">
              Calculators
            </Link>
          </li>
          <li className="px-1 text-slate-500">/</li>
          <li aria-current="page" className="text-slate-200">
            Gravel Calculators
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Layers className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Gravel Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Whether you&apos;re building a structural driveway base, laying decorative pea gravel in your garden, or filling an aquarium, our suite of free gravel calculators helps you precisely estimate volume, weight, and costs depending on the exact material density.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {gravelCalcs.map((calc) => {
          const Icon = calc.icon;
          return (
            <Link
              key={calc.id}
              href={`/${calc.id}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm transition-all hover:border-teal-500/40 hover:bg-slate-800/80 hover:shadow-md"
            >
              <div>
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-slate-800 p-2.5 text-teal-400 group-hover:bg-teal-500/10 group-hover:text-teal-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-slate-200 group-hover:text-teal-400 font-poppins">
                  {calc.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[95%]">
                  {calc.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-semibold text-teal-500 transition-colors group-hover:text-teal-400">
                Use Calculator
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      <section
        aria-labelledby="explainer-heading"
        className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 sm:p-8 mb-10"
      >
        <h2
          id="explainer-heading"
          className="text-lg font-bold text-slate-100 mb-4 font-poppins"
        >
          How to Estimate Gravel Projects Accurately
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          The most common mistake when ordering landscaping materials is
          confusing <strong className="text-slate-300">volume</strong> (cubic
          yards) with <strong className="text-slate-300">weight</strong> (tons).
          Local suppliers load material by the cubic yard; quarries and commercial
          operations weigh trucks and sell by the ton. Knowing your project&apos;s
          cubic yards lets you convert to tons — or to bags — depending on how your
          supplier sells the material.
        </p>

        {/* Density reference cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            {
              type: "Crushed Stone / Standard Gravel",
              density: "~105 lb/ft³",
              tons: "≈ 1.4 t/yd³",
              note: "Best for driveways & bases",
            },
            {
              type: "Pea Gravel",
              density: "~100 lb/ft³",
              tons: "≈ 1.35 t/yd³",
              note: "Walkways, play areas, decorative",
            },
            {
              type: "River Rock / Lava Rock",
              density: "80–110 lb/ft³",
              tons: "≈ 1.1–1.5 t/yd³",
              note: "Varies by porosity & mineral type",
            },
          ].map((row) => (
            <div
              key={row.type}
              className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-4"
            >
              <p className="text-xs font-semibold text-teal-400 mb-1">
                {row.type}
              </p>
              <p className="text-[11px] text-slate-300">
                Density: <span className="font-medium">{row.density}</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Per cubic yard: <span className="font-medium">{row.tons}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{row.note}</p>
            </div>
          ))}
        </div>

        {/* Formula callout */}
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Volume (yd³) = Length (ft) × Width (ft) × Depth (ft) ÷ 27
              </strong>
              &nbsp;— then multiply by material density to get weight in tons.
              Always add 10–15% for waste and compaction.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section
        aria-labelledby="faq-heading"
        className="rounded-xl border border-slate-800 bg-slate-800/20 p-6 sm:p-8"
      >
        <h2
          id="faq-heading"
          className="text-lg font-bold text-slate-100 mb-5 font-poppins"
        >
          Frequently Asked Questions
        </h2>
        <dl className="space-y-5">
          {[
            {
              q: "How many cubic yards of gravel do I need for a 10×20 driveway at 4 inches deep?",
              a: 'Volume = (10 × 20 × 0.333) ÷ 27 ≈ 2.47 yd³. Add 10% waste → order roughly 2.72 yd³. Use the Gravel Driveway Calculator above to model any size instantly.',
            },
            {
              q: "How do I convert gravel tons to cubic yards?",
              a: "Divide the weight in tons by the material density in t/yd³. For crushed stone at 1.4 t/yd³: 5 tons ÷ 1.4 = 3.57 yd³. Our Gravel Tons to Yards Calculator does this in one click.",
            },
            {
              q: "How deep should gravel be for a driveway?",
              a: "Residential driveways need 4–6 inches of compacted gravel. High-traffic or commercial driveways may require 8–12 inches. A deeper base improves drainage and prevents rutting.",
            },
            {
              q: "How much gravel do I need for an aquarium?",
              a: 'The standard rule is 1 lb per gallon of tank water, or a 1–2 inch bed. Our Aquarium Gravel Calculator accepts tank dimensions and returns the exact weight in pounds and kilograms.',
            },
            {
              q: "Does the calculator account for compaction?",
              a: "Yes — all our gravel calculators apply a 10% default waste/compaction factor. For heavily trafficked driveways, increase this to 15% for a reliable buffer.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", "@id": "https://www.concretecalculatormax.com/calculators/gravel", "url": "https://www.concretecalculatormax.com/calculators/gravel", "name": "Gravel Calculators Hub | Concrete Calculator Max", "description": "Suite of tools to calculate gravel tons, yards, bags, and project cost." }, { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.concretecalculatormax.com/" }, { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://www.concretecalculatormax.com/calculators" }, { "@type": "ListItem", "position": 3, "name": "Gravel Calculators", "item": "https://www.concretecalculatormax.com/calculators/gravel" }] }, { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "How many cubic yards of gravel do I need for a 10×20 driveway at 4 inches deep?", "acceptedAnswer": { "@type": "Answer", "text": "Volume = (10 × 20 × 0.333) ÷ 27 ≈ 2.47 yd³. Add 10% waste → order roughly 2.72 yd³. Use the Gravel Driveway Calculator above to model any size instantly." } }, { "@type": "Question", "name": "How do I convert gravel tons to cubic yards?", "acceptedAnswer": { "@type": "Answer", "text": "Divide the weight in tons by the material density in t/yd³. For crushed stone at 1.4 t/yd³: 5 tons ÷ 1.4 = 3.57 yd³. Our Gravel Tons to Yards Calculator does this in one click." } }, { "@type": "Question", "name": "How deep should gravel be for a driveway?", "acceptedAnswer": { "@type": "Answer", "text": "Residential driveways need 4–6 inches of compacted gravel. High-traffic or commercial driveways may require 8–12 inches. A deeper base improves drainage and prevents rutting." } }, { "@type": "Question", "name": "How much gravel do I need for an aquarium?", "acceptedAnswer": { "@type": "Answer", "text": "The standard rule is 1 lb per gallon of tank water, or a 1–2 inch bed. Our Aquarium Gravel Calculator accepts tank dimensions and returns the exact weight in pounds and kilograms." } }, { "@type": "Question", "name": "Does the calculator account for compaction?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — all our gravel calculators apply a 10% default waste/compaction factor. For heavily trafficked driveways, increase this to 15% for a reliable buffer." } }] }] }) }}
      />
    </main>
  );
}
