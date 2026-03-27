import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, Briefcase, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Concrete Bags Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free concrete bags calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/concrete-bags",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/concrete-bags",
    title: "Concrete Bags Calculators Hub",
    description: "Suite of tools to calculate concrete bags estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concrete Bags Calculators Hub",
    description: "Suite of tools to calculate concrete bags estimates and project cost.",
  },
};

export default function ConcreteBagsCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Concrete Bags"
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
            Concrete Bags
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Briefcase className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Concrete Bags Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free concrete bags calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
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
          Estimating Premixed Bagged Concrete
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          For small patios, fence posts, and minor repairs, hauling bulk ready-mix isn&apos;t feasible. Bagged concrete (sold in 40 lb, 50 lb, 60 lb, and 80 lb sizes) is mixed on-site. Knowing your precise cubic yard requirements allows you to directly translate the volume into the exact bag count needed at the hardware store.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Bag Count = Total Cubic Yards Required ÷ Yield per Bag (yd³)
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
          {[{"q":"How many 80 lb bags make a cubic yard?","a":"It takes exactly 45 bags of 80 lb concrete to produce one cubic yard of wet concrete (assuming a yield of 0.60 cubic feet per bag)."},{"q":"How many 60 lb bags make a cubic yard?","a":"It takes exactly 60 bags of 60 lb concrete to produce one cubic yard (assuming a yield of 0.45 cubic feet per bag)."},{"q":"Is it cheaper to mix bags or order a truck?","a":"Bagged concrete is far more expensive per yard. The breakeven point is usually around 1 to 1.5 cubic yards. For projects demanding 2 yards or more, ordering a ready-mix truck is much cheaper."},{"q":"How do I mix bagged concrete properly?","a":"Empty the bags into a wheelbarrow or mechanical mixer, form a crater in the center, and slowly add the instructed amount of water. Mix until it achieves a thick, oatmeal-like consistency without dry clumps."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/concrete-bags","url":"https://www.concretecalculatormax.com/calculators/concrete-bags","name":"Concrete Bags Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate concrete bags estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Concrete Bags Calculators","item":"https://www.concretecalculatormax.com/calculators/concrete-bags"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How many 80 lb bags make a cubic yard?","acceptedAnswer":{"@type":"Answer","text":"It takes exactly 45 bags of 80 lb concrete to produce one cubic yard of wet concrete (assuming a yield of 0.60 cubic feet per bag)."}},{"@type":"Question","name":"How many 60 lb bags make a cubic yard?","acceptedAnswer":{"@type":"Answer","text":"It takes exactly 60 bags of 60 lb concrete to produce one cubic yard (assuming a yield of 0.45 cubic feet per bag)."}},{"@type":"Question","name":"Is it cheaper to mix bags or order a truck?","acceptedAnswer":{"@type":"Answer","text":"Bagged concrete is far more expensive per yard. The breakeven point is usually around 1 to 1.5 cubic yards. For projects demanding 2 yards or more, ordering a ready-mix truck is much cheaper."}},{"@type":"Question","name":"How do I mix bagged concrete properly?","acceptedAnswer":{"@type":"Answer","text":"Empty the bags into a wheelbarrow or mechanical mixer, form a crater in the center, and slowly add the instructed amount of water. Mix until it achieves a thick, oatmeal-like consistency without dry clumps."}}]}]}) }}
      />
    </main>
  );
}
