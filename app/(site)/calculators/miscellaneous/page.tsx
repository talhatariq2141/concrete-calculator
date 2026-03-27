import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, CircleDot, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Miscellaneous Concrete Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free miscellaneous concrete calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/miscellaneous",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/miscellaneous",
    title: "Miscellaneous Concrete Calculators Hub",
    description: "Suite of tools to calculate miscellaneous concrete estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miscellaneous Concrete Calculators Hub",
    description: "Suite of tools to calculate miscellaneous concrete estimates and project cost.",
  },
};

export default function MiscellaneousConcreteCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Misc. Concrete"
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
            Miscellaneous Concrete
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <CircleDot className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Miscellaneous Concrete Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free miscellaneous concrete calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
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
          Post Holes, Crushed Concrete, and More
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Smaller and specialized projects still require precise material calculations. Setting fence posts correctly using dry-pour methods or bulk mixing ensures fences hold against wind shear. Additionally, using recycled crushed concrete as a base requires accurate tonnage conversions depending on compaction rates.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Post Hole Volume = (π × r² × Depth) - Post Volume.
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
          {[{"q":"How deep should fence post holes be?","a":"Post holes should generally be dug to a depth of 1/3 to 1/2 of the above-ground post height, and extending below the local frost line to prevent ground heaving."},{"q":"Should I pour dry concrete in the post hole?","a":"You can pour fast-setting concrete mix dry into the hole around the post, then soak it with water. It cures rapidly and is perfectly fine for residential fencing."},{"q":"What is crushed concrete used for?","a":"Crushed recycled concrete is a highly sustainable, cost-effective substitute for crushed gravel. It acts as an excellent compacting sub-base for driveways, roads, and large parking slabs."},{"q":"Will crushed concrete leach chemicals?","a":"While completely safe for standard sub-bases, crushed concrete has a high alkalinity. It should not be used as decorative mulch directly adjacent to sensitive plants or acidic soil gardens."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/miscellaneous","url":"https://www.concretecalculatormax.com/calculators/miscellaneous","name":"Miscellaneous Concrete Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate miscellaneous concrete estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Miscellaneous Concrete Calculators","item":"https://www.concretecalculatormax.com/calculators/miscellaneous"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How deep should fence post holes be?","acceptedAnswer":{"@type":"Answer","text":"Post holes should generally be dug to a depth of 1/3 to 1/2 of the above-ground post height, and extending below the local frost line to prevent ground heaving."}},{"@type":"Question","name":"Should I pour dry concrete in the post hole?","acceptedAnswer":{"@type":"Answer","text":"You can pour fast-setting concrete mix dry into the hole around the post, then soak it with water. It cures rapidly and is perfectly fine for residential fencing."}},{"@type":"Question","name":"What is crushed concrete used for?","acceptedAnswer":{"@type":"Answer","text":"Crushed recycled concrete is a highly sustainable, cost-effective substitute for crushed gravel. It acts as an excellent compacting sub-base for driveways, roads, and large parking slabs."}},{"@type":"Question","name":"Will crushed concrete leach chemicals?","acceptedAnswer":{"@type":"Answer","text":"While completely safe for standard sub-bases, crushed concrete has a high alkalinity. It should not be used as decorative mulch directly adjacent to sensitive plants or acidic soil gardens."}}]}]}) }}
      />
    </main>
  );
}
