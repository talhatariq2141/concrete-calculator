import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, Columns2, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Column Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free column calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/column",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/column",
    title: "Column Calculators Hub",
    description: "Suite of tools to calculate column estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Column Calculators Hub",
    description: "Suite of tools to calculate column estimates and project cost.",
  },
};

export default function ColumnCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Column"
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
            Column
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Columns2 className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Column Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free column calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {hubCalcs.map((calc) => {
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
          Calculating Concrete for Columns
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Concrete columns transfer structural loads from beams and slabs down to the footings. Depending on your design, columns can be square, rectangular, or circular (cylindrical). Accuracy in formwork dimensions is crucial since tall columns can consume surprisingly large volumes of concrete.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Rectangular Volume (yd³) = L × W × H ÷ 27. Circular Volume (yd³) = π × r² × H ÷ 27.
              </strong>
            </p>
          </div>
        </div>
      </section>

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
          {[{"q":"How do I measure the radius of a circular column?","a":"Measure the full diameter (width) of the column tube (Sonotube) in inches, divide by 2 to get the radius, then divide by 12 to convert it to feet for standard volume formulas."},{"q":"Do I need to account for the loss at the top of the column?","a":"No, always calculate to the absolute top of your intended pour line. Keep a 5% overage allowance for spillage."},{"q":"How many columns can I pour from one cubic yard?","a":"A single cubic yard contains 27 cubic feet. A standard 12-inch diameter column that is 10 feet tall requires about 0.29 cubic yards. Therefore, one yard can fill roughly three 12-inch by 10-foot columns."},{"q":"What strength of concrete is used for columns?","a":"Structural columns typically require high-strength concrete ranging from 3,000 to 5,000 PSI, depending on the load requirements engineered for the building."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/column","url":"https://www.concretecalculatormax.com/calculators/column","name":"Column Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate column estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Column Calculators","item":"https://www.concretecalculatormax.com/calculators/column"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I measure the radius of a circular column?","acceptedAnswer":{"@type":"Answer","text":"Measure the full diameter (width) of the column tube (Sonotube) in inches, divide by 2 to get the radius, then divide by 12 to convert it to feet for standard volume formulas."}},{"@type":"Question","name":"Do I need to account for the loss at the top of the column?","acceptedAnswer":{"@type":"Answer","text":"No, always calculate to the absolute top of your intended pour line. Keep a 5% overage allowance for spillage."}},{"@type":"Question","name":"How many columns can I pour from one cubic yard?","acceptedAnswer":{"@type":"Answer","text":"A single cubic yard contains 27 cubic feet. A standard 12-inch diameter column that is 10 feet tall requires about 0.29 cubic yards. Therefore, one yard can fill roughly three 12-inch by 10-foot columns."}},{"@type":"Question","name":"What strength of concrete is used for columns?","acceptedAnswer":{"@type":"Answer","text":"Structural columns typically require high-strength concrete ranging from 3,000 to 5,000 PSI, depending on the load requirements engineered for the building."}}]}]}) }}
      />
    </main>
  );
}
