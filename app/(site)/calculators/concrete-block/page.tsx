import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, BrickWall, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Concrete Block Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free concrete block calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/concrete-block",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/concrete-block",
    title: "Concrete Block Calculators Hub",
    description: "Suite of tools to calculate concrete block estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Block Calculators Hub",
    description: "Suite of tools to calculate concrete block estimates and project cost.",
  },
};

export default function ConcreteBlockCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Concrete Block"
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
            Concrete Block
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <BrickWall className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Concrete Block Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free concrete block calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
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
          Estimating Masonry and CMU Blocks
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Concrete Masonry Units (CMU) are heavily used in commercial walls, foundations, and retaining walls. Estimating a block project requires calculating the square footage of the wall and dividing by the surface area of the block. Standard US structural blocks are 8x8x16 inches nominal.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Block Count = Wall Area (sq ft) ÷ Block Face Area (sq ft). For standard blocks: Wall Area × 1.125.
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
          {[{"q":"What is the true size of an 8x8x16 block?","a":"The nominal size includes the mortar joint. The actual physical block is usually 7-5/8 x 7-5/8 x 15-5/8 inches. The calculator utilizes nominal dimensions to ensure perfect accounting."},{"q":"How many blocks do I need per square foot?","a":"A standard 8x8x16 inch concrete block covers 0.89 square feet. Therefore, you need roughly 1.125 blocks per square foot of wall area."},{"q":"How much mortar do I need for a block wall?","a":"A standard rule of thumb is 1 bag of pre-mixed masonry mortar (80 lbs) for every 35 to 40 standard 8-inch blocks."},{"q":"Do I need to fill the blocks with concrete (grout)?","a":"Core filling with liquid grout is required structurally for below-grade foundations and retaining walls, usually encasing rebar placed vertically inside the block cells."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/concrete-block","url":"https://www.concretecalculatormax.com/calculators/concrete-block","name":"Concrete Block Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate concrete block estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Concrete Block Calculators","item":"https://www.concretecalculatormax.com/calculators/concrete-block"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the true size of an 8x8x16 block?","acceptedAnswer":{"@type":"Answer","text":"The nominal size includes the mortar joint. The actual physical block is usually 7-5/8 x 7-5/8 x 15-5/8 inches. The calculator utilizes nominal dimensions to ensure perfect accounting."}},{"@type":"Question","name":"How many blocks do I need per square foot?","acceptedAnswer":{"@type":"Answer","text":"A standard 8x8x16 inch concrete block covers 0.89 square feet. Therefore, you need roughly 1.125 blocks per square foot of wall area."}},{"@type":"Question","name":"How much mortar do I need for a block wall?","acceptedAnswer":{"@type":"Answer","text":"A standard rule of thumb is 1 bag of pre-mixed masonry mortar (80 lbs) for every 35 to 40 standard 8-inch blocks."}},{"@type":"Question","name":"Do I need to fill the blocks with concrete (grout)?","acceptedAnswer":{"@type":"Answer","text":"Core filling with liquid grout is required structurally for below-grade foundations and retaining walls, usually encasing rebar placed vertically inside the block cells."}}]}]}) }}
      />
    </main>
  );
}
