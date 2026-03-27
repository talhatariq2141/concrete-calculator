import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, Boxes, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Tank & Trench Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free tank & trench calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/tank-trench",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/tank-trench",
    title: "Tank & Trench Calculators Hub",
    description: "Suite of tools to calculate tank & trench estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tank & Trench Calculators Hub",
    description: "Suite of tools to calculate tank & trench estimates and project cost.",
  },
};

export default function TankTrenchCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Tank/Trench"
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
            Tank & Trench
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Boxes className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Tank & Trench Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free tank & trench calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
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
          Estimating Concrete for Tanks and Trenches
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Water tanks, septic tanks, and utility trenches require estimating hollow concrete structures. This involves calculating outer dimensions to establish a total outer volume, and subtracting the inner hollow void dimensions. You also must separately calculate the floor and roof slabs of a closed tank.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Wall Volume = (Outer L × Outer W) - (Inner L × Inner W) × Height
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
          {[{"q":"How do I calculate the concrete needed for trench walls?","a":"Measure the total linear run of the trench. Then calculate the volume of the two parallel wall segments along the sides."},{"q":"Do I calculate the floor of a tank separately from the walls?","a":"Yes. Calculate the floor slab as a standard rectangular pour covering the entire outer footprint. Then calculate the hollow wall structure extending upward from the slab."},{"q":"What is a retaining trench?","a":"A retaining trench (or keyway) is a trench dug beneath a retaining wall to lock the base of the wall securely against lateral soil movement."},{"q":"Should I account for pipe openings in a tank wall?","a":"Unless the pipes are exceptionally large (over 12 inches in diameter), it is standard practice to ignore small penetrations during estimating. The 'extra' concrete simply becomes a safety margin."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/tank-trench","url":"https://www.concretecalculatormax.com/calculators/tank-trench","name":"Tank & Trench Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate tank & trench estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Tank & Trench Calculators","item":"https://www.concretecalculatormax.com/calculators/tank-trench"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I calculate the concrete needed for trench walls?","acceptedAnswer":{"@type":"Answer","text":"Measure the total linear run of the trench. Then calculate the volume of the two parallel wall segments along the sides."}},{"@type":"Question","name":"Do I calculate the floor of a tank separately from the walls?","acceptedAnswer":{"@type":"Answer","text":"Yes. Calculate the floor slab as a standard rectangular pour covering the entire outer footprint. Then calculate the hollow wall structure extending upward from the slab."}},{"@type":"Question","name":"What is a retaining trench?","acceptedAnswer":{"@type":"Answer","text":"A retaining trench (or keyway) is a trench dug beneath a retaining wall to lock the base of the wall securely against lateral soil movement."}},{"@type":"Question","name":"Should I account for pipe openings in a tank wall?","acceptedAnswer":{"@type":"Answer","text":"Unless the pipes are exceptionally large (over 12 inches in diameter), it is standard practice to ignore small penetrations during estimating. The 'extra' concrete simply becomes a safety margin."}}]}]}) }}
      />
    </main>
  );
}
