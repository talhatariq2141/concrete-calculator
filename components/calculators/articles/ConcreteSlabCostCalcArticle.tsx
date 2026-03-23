"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function ConcreteSlabCostCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Complete Guide to Concrete Slab Costs
        </h2>
        <p className="mb-4 leading-relaxed">
          Estimate not just the volume, but the total financial layout of your concrete slab, including professional installation and ready-mix delivery versus DIY bag mixes.
        </p>
        <p className="mb-4 leading-relaxed">
          Avoiding sticker shock requires factoring in waste percentages, regional pricing variations, and extra structural reinforcements like vapor barriers or rebar.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Slab Cost Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Material & Labor Estimates",
              desc: "Estimate total financial layout including professional installation and ready-mix delivery."
            },
            {
              title: "Ready-Mix vs. Bagged Mix",
              desc: "Compare costs between ordering a concrete truck or mixing it yourself using standard 80lb bags."
            },
            {
              title: "Reinforcement Planning",
              desc: "Account for rebar, wire mesh, or vapor barriers by adding extra costs per square foot."
            },
            {
              title: "Regional Pricing Adjustments",
              desc: "Customize your estimate with local labor rates and material prices."
            },
            {
              title: "Smart Waste Allowance",
              desc: "Built-in 10-15% overrun calculator ensures you don't run dry during the pour."
            },
            {
              title: "Professional PDF Export",
              desc: "Generate a clean, printable summary of your project inputs and costs."
            }
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-200">{feature.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-teal-400 mb-5">
          How to Estimate Your Slab Project
        </h2>
        <ol className="space-y-4">
          {[
            "Measure your slab Length, Width, and Thickness.",
            "Choose your Supply Method (Ready Mix is best for large areas, Bagged for tiny ones).",
            "Enter local Ready-Mix Prices (typically $150–$180 per yard) or Bag Prices.",
            "Input the Labor Rate if hiring a crew (usually $3–$10 per square foot depending on finish).",
            "Add Extras for gravel sub-base or rebar reinforcements.",
            "Click Calculate and save your PDF summary."
          ].map((step, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-sm shrink-0 border border-teal-500/30">
                {idx + 1}
              </div>
              <span className="text-slate-300 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Why Choose  */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Use Our Concrete Slab Cost Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Accurate financial planning for patios, driveways, garage floors, and shed bases.</li>
          <li>Avoid "sticker shock" by understanding the breakdown between material and labor costs upfront.</li>
          <li>Compare supply methods to see if DIY bagging is truly cheaper than a professional truck delivery.</li>
          <li>SEO and construction-ready precise calculations that help you negotiate better with local suppliers.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Calculation Formulas Behind the Tool</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Concrete Volume</strong>
            Volume (yd³) = Length (ft) × Width (ft) × (Thickness (in) / 12) / 27
          </li>
          <li>
            <strong className="text-white block">2) Ready-Mix Cost</strong>
            Material Cost = Adjusted Volume (yd³) × Price per Yard<br/>
            Adjusted Volume = Raw Volume × (1 + Waste %)
          </li>
          <li>
            <strong className="text-white block">3) Labor & Extras</strong>
            Labor Cost = Total Area (sq ft) × Labor Rate ($/sq ft)<br/>
            Total Est. Cost = Materials + Labor + Extras (Reinforcement/Base)
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-teal-400" />
          <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What is the average cost of a concrete slab per square foot?</h3>
            <p className="text-slate-400">
              In the US, most standard slabs cost between $6 and $12 per square foot installed. This includes both materials and professional labor.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much concrete do I need for a 20x20 slab?</h3>
            <p className="text-slate-400">
              A standard 4-inch thick 20x20 slab requires approximately 5 cubic yards of concrete. This includes a 10% waste allowance to cover spillage.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is it cheaper to use a concrete truck or buy bags?</h3>
            <p className="text-slate-400">
              Projects requiring more than 1 cubic yard (about 45-50 bags) are generally cheaper and much faster via ready-mix truck. Bagged mix is ideal for tiny repairs.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What labor rate should I expect for my slab?</h3>
            <p className="text-slate-400">
              Labor rates vary by finish. A standard broom finish ranges from $3 to $5 per sq ft, while decorative stamped finishes can exceed $10-$15 per sq ft.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
