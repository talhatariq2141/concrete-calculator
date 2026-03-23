"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function PeaGravelCalculatorArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Pea Gravel for Landscaping
        </h2>
        <p className="mb-4 leading-relaxed">
          Pea gravel is a popular choice for decorative paths, garden borders, and play areas. Because of its small, rounded nature, getting the right depth and calculating the proper volume is critical. Our Pea Gravel Calculator turns your project dimensions into an exact estimate of cubic yards and individual bags needed.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Features of the Pea Gravel Estimator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Decorative Gravel Estimation",
              desc: "Calculates pea gravel for beds, pathways, and landscape borders."
            },
            {
              title: "Coverage Planning",
              desc: "Helps estimate area coverage at different gravel depths."
            },
            {
              title: "Bag and Bulk Estimates",
              desc: "Shows bulk cubic yards and estimates individual bag purchasing quantities."
            },
            {
              title: "Total Cost Calculations",
              desc: "Easily estimate total cost whether buying per bag, per ton, or per cubic yard."
            },
            {
              title: "Waste Factors",
              desc: "Automatically account for material spread and settling via simple waste percentages."
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
          How to Use the Pea Gravel Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select your Measurement Unit.",
            "Enter the Length and Width of the garden bed or pathway.",
            "Enter the desired Pea Gravel Depth (typically 2 inches for pathways, 3 inches for weed control buffers).",
            "Enter the Bag Size if buying bags (usually 0.5 cf bags weigh about 50 lbs).",
            "Input your Material Price based on bag, ton, or cubic yard to calculate estimated cost.",
            "Click Calculate."
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

      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Pea Gravel Formulas</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Volume Requirements</strong>
            Area = Length × Width<br/>
            Volume = Area × Depth
          </li>
          <li>
            <strong className="text-white block">2) Weight Estimation</strong>
            Pea Gravel Density ≈ 100 lb / cubic foot<br/>
            Weight = Volume (Cubic Feet) × 100
          </li>
          <li>
            <strong className="text-white block">3) Bag Calculation</strong>
            Total Bags = Total Weight ÷ Weight per Bag
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much pea gravel do I need?</h3>
            <p className="text-slate-400">
              Measure your landscaping area and input it along with a standard 2-3 inch depth into our calculator to determine the required cubic yards, bags, and tonnage.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How deep should pea gravel be for landscaping?</h3>
            <p className="text-slate-400">
              For most garden beds and weed prevention over landscape fabric, 2 to 3 inches is ideal. For frequently walked paths, 2.5 inches gives a solid feel while avoiding loose slipping.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many bags of pea gravel do I need?</h3>
            <p className="text-slate-400">
              A typical 0.5 cubic foot bag of pea gravel weighs about 50 lbs. If you need 1 cubic yard (which is 27 cubic feet), you would need 54 of these bags.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is pea gravel sold by yard or ton?</h3>
            <p className="text-slate-400">
              Bulk pea gravel is traditionally sold by the cubic yard or ton at local soil/aggregate yards. For smaller projects, it is sold by the bag at home improvement stores.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
