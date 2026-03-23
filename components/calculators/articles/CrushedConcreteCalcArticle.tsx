"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function CrushedConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Estimate Crushed Concrete Quantities
        </h2>
        <p className="mb-4 leading-relaxed">
          Crushed concrete, also known as recycled concrete aggregate (RCA), is an incredibly versatile and cost-effective material. Whether you are building a solid driveway base, setting up a patio, or creating a parking pad, ordering the right amount is essential to keeping costs down and maintaining structural integrity.
        </p>
        <p className="leading-relaxed">
          Our calculator helps you determine the exact volume in <strong>cubic yards</strong> and estimates the weight in <strong>tons</strong>. More importantly, it features standard contractor-level adjustments for compaction and waste. In the field, crushed concrete settles up to 15% when compacted, meaning you often need to order more than the pure mathematical volume of your trench or pad.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Calculator Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Volume Estimation",
              desc: "Calculates cubic feet and cubic yards for crushed concrete projects."
            },
            {
              title: "Tons Conversion",
              desc: "Converts crushed concrete volume into estimated tons for ordering."
            },
            {
              title: "Coverage Planning",
              desc: "Shows how much area crushed concrete can cover at a chosen depth."
            },
            {
              title: "Compaction Adjustment",
              desc: "Adds overage for compaction, settling, and jobsite waste."
            },
            {
              title: "Cost Estimation",
              desc: "Calculates project cost using price per ton or price per cubic yard."
            },
            {
              title: "Truckload Estimator",
              desc: "Helps plan delivery loads for large driveway or base projects."
            },
            {
              title: "Multi-Shape Support",
              desc: "Calculates concrete needs for rectangular, circular, triangular, and custom areas."
            },
            {
              title: "Unit Conversion",
              desc: "Supports both imperial and metric measurement systems."
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
          How to Use the Crushed Concrete Cost Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select your project calculation mode (e.g., Rectangle Area, Known Volume, or Reverse Coverage).",
            "Enter dimensions (length, width, or total area) and your desired installation depth.",
            "Choose a unit system (feet, inches, yards or metric).",
            "Select the density profile of the crushed concrete (standard is 105 lb/ft³).",
            "Add a compaction/waste percentage (typically 5% to 15% for driveway bases).",
            "Enter material pricing and delivery fees, then click Calculate."
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

      {/* Typical Depths */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Recommended Project Depths</h2>
        <p className="mb-4 text-slate-400">
          The following are general planning estimates for how thick your crushed concrete base should be. Always consult local codes or an engineer for heavy duty applications.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> <strong>Walkways:</strong> 2 to 4 inches (light base depth)</li>
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> <strong>Patio Base:</strong> 4 inches (moderate base depth)</li>
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> <strong>Shed Base:</strong> 4 to 6 inches (moderate to heavy base depth)</li>
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> <strong>Driveway Base:</strong> 6 to 8+ inches (heavier base depth)</li>
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> <strong>Road Base / Sub-base:</strong> 8 to 12+ inches (heavier compacted base depth)</li>
        </ul>
      </section>
      
      {/* Ton vs Yard vs Compaction */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Estimate Carefully?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2">
          <li><strong>Supplier Ordering Differences:</strong> Depending on where you live, crushed concrete is sold by the cubic yard or by the US Ton. Knowing both numbers prevents confusion when calling suppliers.</li>
          <li><strong>Density Variation:</strong> Wet weather or the degree of pulverization changes the weight. Standard crushed concrete weighs roughly 1.4 tons per cubic yard (105 lbs/ft³), but compact, finely crushed materials weigh more.</li>
          <li><strong>Compaction Effects:</strong> When you roll or tamp crushed concrete, the air voids are squeezed out. A 6-inch loose layer may compact down to 5 inches. Planning a 10-15% overage prevents you from coming up short.</li>
          <li><strong>Delivery Planning:</strong> A standard tri-axle dump truck generally holds about 15-20 tons depending on local road regulations. Estimating truckloads tells you how many delivery fees you might need to pay.</li>
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I calculate crushed concrete?</h3>
            <p className="text-slate-400">
              To calculate crushed concrete, multiply the project area by the depth to get volume. Convert cubic feet to cubic yards by dividing by 27. To find tons, multiply the cubic yards by the material density factor (usually around 1.4 tons per yard).
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many tons of crushed concrete do I need?</h3>
            <p className="text-slate-400">
              The number of tons depends on your project volume and the density of the crushed concrete. A calculator can convert cubic yards into tons using a selected density factor. Generally, 1 cubic yard equals about 1.4 US tons.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much area does 1 ton of crushed concrete cover?</h3>
            <p className="text-slate-400">
              Coverage depends on the density of the material and the depth you plan to install. At a 2-inch depth, 1 ton covers roughly 100-110 square feet. Shallower depths cover more area, while deeper base layers cover less.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Should I add extra crushed concrete for compaction?</h3>
            <p className="text-slate-400">
              Yes. Many projects need extra material for compaction, settling, and normal jobsite waste. Adding a 5% to 15% overage percentage helps avoid under-ordering and paying for a smaller second delivery truck.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is crushed concrete sold by ton or by yard?</h3>
            <p className="text-slate-400">
              Crushed concrete may be sold by either ton or cubic yard depending on the supplier and region. A good calculator should estimate both so you&apos;re prepared.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
