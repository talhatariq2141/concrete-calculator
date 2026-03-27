import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, Grid2x2, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Reinforcement & Structural Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free reinforcement & structural calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/reinforcement",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/reinforcement",
    title: "Reinforcement & Structural Calculators Hub",
    description: "Suite of tools to calculate reinforcement & structural estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reinforcement & Structural Calculators Hub",
    description: "Suite of tools to calculate reinforcement & structural estimates and project cost.",
  },
};

export default function ReinforcementStructuralCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Reinforcement and Structural"
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
            Reinforcement & Structural
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Grid2x2 className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Reinforcement & Structural Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free reinforcement & structural calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
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
          Estimating Rebar and Wire Mesh
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Concrete has immense compressive strength but very weak tensile strength. Reinforcement (rebar and welded wire mesh) bridges cracks and ties slabs together so they do not separate. Estimating involves determining the spacing grid, overlap requirements (lap splices), and boundary clearances.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Total Linear Feet = (Runs across length + Runs across width) × Required Length + (Splice overlaps)
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
          {[{"q":"What does the rebar number mean? (e.g. #4 rebar)","a":"In the US, the rebar number represents the diameter in 1/8 inch increments. So #4 rebar is 4/8 inch (1/2 inch) in diameter. #3 is 3/8 inch, etc."},{"q":"What is standard rebar spacing for a slab?","a":"For residential flatwork, #3 or #4 rebar is commonly tied in a grid spacing of 18 inches to 24 inches on center."},{"q":"What is a lap splice?","a":"Rebar bars are sold in 10-foot or 20-foot lengths. To create a continuous piece, two bars must be overlapped and tied together. Code dictates lap lengths typically ranging from 20 to 40 times the bar diameter."},{"q":"Is wire mesh better than rebar?","a":"Wire mesh is excellent for preventing wide surface cracks in light-load slabs. However, rebar provides far superior structural and load-bearing strength. Wire mesh is cheaper and faster to install."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/reinforcement","url":"https://www.concretecalculatormax.com/calculators/reinforcement","name":"Reinforcement & Structural Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate reinforcement & structural estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Reinforcement & Structural Calculators","item":"https://www.concretecalculatormax.com/calculators/reinforcement"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What does the rebar number mean? (e.g. #4 rebar)","acceptedAnswer":{"@type":"Answer","text":"In the US, the rebar number represents the diameter in 1/8 inch increments. So #4 rebar is 4/8 inch (1/2 inch) in diameter. #3 is 3/8 inch, etc."}},{"@type":"Question","name":"What is standard rebar spacing for a slab?","acceptedAnswer":{"@type":"Answer","text":"For residential flatwork, #3 or #4 rebar is commonly tied in a grid spacing of 18 inches to 24 inches on center."}},{"@type":"Question","name":"What is a lap splice?","acceptedAnswer":{"@type":"Answer","text":"Rebar bars are sold in 10-foot or 20-foot lengths. To create a continuous piece, two bars must be overlapped and tied together. Code dictates lap lengths typically ranging from 20 to 40 times the bar diameter."}},{"@type":"Question","name":"Is wire mesh better than rebar?","acceptedAnswer":{"@type":"Answer","text":"Wire mesh is excellent for preventing wide surface cracks in light-load slabs. However, rebar provides far superior structural and load-bearing strength. Wire mesh is cheaper and faster to install."}}]}]}) }}
      />
    </main>
  );
}
