import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "../data";
import { ChevronRight, Box, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Pier & Caisson Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free pier & caisson calculators to estimate weight, volume, and cost for your projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/pier-caisson",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/pier-caisson",
    title: "Pier & Caisson Calculators Hub",
    description: "Suite of tools to calculate pier & caisson estimates and project cost.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pier & Caisson Calculators Hub",
    description: "Suite of tools to calculate pier & caisson estimates and project cost.",
  },
};

export default function PierCaissonCalculatorsHubPage() {
  const hubCalcs = CALCULATORS.filter(
    (c) => c.category === "Pier/Caisson"
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
            Pier & Caisson
          </li>
        </ol>
      </nav>

      <div className="mb-10 mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Box className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Pier & Caisson Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Explore our suite of free pier & caisson calculators to precisely estimate volume, weight, and costs for your next project. Select a tool below to get started.
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
          Estimating Concrete for Piers and Caissons
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Piers and caissons are deep foundation elements used to transfer structural loads through weak soil down to solid rock or stable strata. Since they consist of deep cylindrical shafts (and sometimes belled bottoms), calculating volume utilizes circular geometry.
        </p>
        <div className="flex items-start gap-2.5 rounded-lg border border-teal-800/40 bg-teal-900/10 px-4 py-3">
          <Info className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 mb-0.5">
              Core Formula
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">
                Cylindrical Volume (yd³) = π × radius² × Depth (ft) ÷ 27
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
          {[{"q":"What is the difference between a pier and a caisson?","a":"Functionally they are similar deep foundations. Caissons generally refer to larger, watertight retaining structures installed into water or deep excavations, while drilled piers (or drilled shafts) are created by augering a hole into soil and filling it with concrete."},{"q":"How do I calculate a belled pier?","a":"You must calculate the volume of the cylindrical shaft and then add the volume of the bell (frustum of a cone). Our advanced calculators handle this compound math for you."},{"q":"Do these estimates account for soil collapse?","a":"No. If you drill into unstable soil and the hole caves or expands before pouring, the volume required will increase. Always add a healthy 10-15% overage."},{"q":"Can I pour piers using bagged concrete?","a":"Yes, for small deck footings or shallow piers (like fence posts). For deep structural piers, ready-mix concrete is highly recommended due to the massive volumes required."}].map(({ q, a }) => (
            <div key={q} className="border-b border-slate-800/60 pb-5 last:border-0 last:pb-0">
              <dt className="text-sm font-semibold text-slate-200 mb-1.5">{q}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.concretecalculatormax.com/calculators/pier-caisson","url":"https://www.concretecalculatormax.com/calculators/pier-caisson","name":"Pier & Caisson Calculators Hub | Concrete Calculator Max","description":"Suite of tools to calculate pier & caisson estimates and project cost."},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.concretecalculatormax.com/"},{"@type":"ListItem","position":2,"name":"Calculators","item":"https://www.concretecalculatormax.com/calculators"},{"@type":"ListItem","position":3,"name":"Pier & Caisson Calculators","item":"https://www.concretecalculatormax.com/calculators/pier-caisson"}]},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the difference between a pier and a caisson?","acceptedAnswer":{"@type":"Answer","text":"Functionally they are similar deep foundations. Caissons generally refer to larger, watertight retaining structures installed into water or deep excavations, while drilled piers (or drilled shafts) are created by augering a hole into soil and filling it with concrete."}},{"@type":"Question","name":"How do I calculate a belled pier?","acceptedAnswer":{"@type":"Answer","text":"You must calculate the volume of the cylindrical shaft and then add the volume of the bell (frustum of a cone). Our advanced calculators handle this compound math for you."}},{"@type":"Question","name":"Do these estimates account for soil collapse?","acceptedAnswer":{"@type":"Answer","text":"No. If you drill into unstable soil and the hole caves or expands before pouring, the volume required will increase. Always add a healthy 10-15% overage."}},{"@type":"Question","name":"Can I pour piers using bagged concrete?","acceptedAnswer":{"@type":"Answer","text":"Yes, for small deck footings or shallow piers (like fence posts). For deep structural piers, ready-mix concrete is highly recommended due to the massive volumes required."}}]}]}) }}
      />
    </main>
  );
}
