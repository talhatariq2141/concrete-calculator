import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS, Category } from "@/app/(site)/calculators/data";
import { ChevronRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Gravel Calculators | Concrete Calculator Max",
  description:
    "Explore our suite of free gravel calculators to estimate weight, volume, and cost for driveway, pea gravel, and aquarium projects.",
  alternates: {
    canonical: "https://www.concretecalculatormax.com/calculators/gravel-calculators",
  },
  openGraph: {
    type: "website",
    url: "https://www.concretecalculatormax.com/calculators/gravel-calculators",
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

      <div className="mb-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-teal-500/20 rounded-lg">
            <Layers className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-poppins">
            Gravel Calculators
          </h1>
        </div>
        <p className="text-lg text-slate-400">
          Whether you're building a structural driveway base, laying decorative pea gravel in your garden, or filling an aquarium, our suite of free gravel calculators helps you precisely estimate volume, weight, and costs depending on the exact material density.
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
      
      <section className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-4 font-poppins">
          How to estimate gravel projects accurately
        </h2>
        <div className="prose prose-invert max-w-none prose-p:text-slate-400">
          <p>
            The trickiest part of ordering materials for a landscaping or construction project is that volume and weight aren't directly interchangeable without knowing the material's density. Bulk landscape yards typically load material by the cubic yard (volume), while commercial stone quarries weigh trucks to sell material by the ton (weight).
          </p>
          <p>
            When utilizing our gravel calculators, always be mindful of your material type:
          </p>
          <ul>
            <li><strong>Standard Gravel/Crushed Stone:</strong> Very dense, typically weighing around 105 pounds per cubic foot (roughly 1.4 tons per cubic yard).</li>
            <li><strong>Pea Gravel:</strong> Slightly less dense due to the uniform rounded edges leaving air pockets, usually weighing around 100 lb/ft³.</li>
            <li><strong>River Rock/Lava Rock:</strong> Varies wildly from 80 lb/ft³ to over 110 lb/ft³ depending on porosity and mineral composition.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
