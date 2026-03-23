"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ConcreteBlockCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Concrete Blocks for Walls
        </h2>
        <p className="mb-4 leading-relaxed">
          The Concrete Block Calculator is a tool that helps estimate how many concrete blocks are needed for a wall, foundation, partition, or other masonry project based on wall dimensions, block size, and openings.
        </p>
        <p className="mb-4 leading-relaxed">
          It calculates the total wall area, subtracts any door or window openings, and divides the remaining area by the face coverage of a standard concrete block. This estimation is crucial for ordering exactly what you need without extensive shortages.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of the Concrete Block Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Concrete Block Count Estimator",
              desc: "Estimate how many concrete blocks are needed for a wall based on wall size, block size, and waste allowance."
            },
            {
              title: "Opening Deduction Calculator",
              desc: "Subtract doors, windows, and other openings to produce a more accurate concrete block wall estimate."
            },
            {
              title: "Adjustable Waste Percentage",
              desc: "Customize block wastage for cuts, breakage, corners, and layout complexity for more realistic material planning."
            },
            {
              title: "Mortar Estimator",
              desc: "Calculate mortar bags and estimated mortar volume for standard concrete block installation."
            },
            {
              title: "Grout / Core Fill Estimator",
              desc: "Estimate grout volume for partially filled or fully grouted CMU walls using flexible fill settings."
            },
            {
              title: "Reinforcement Estimator",
              desc: "Estimate horizontal and vertical reinforcement lengths for concrete block wall planning."
            },
            {
              title: "Block Wall Cost Calculator",
              desc: "Add material prices to estimate total concrete block wall cost, including blocks, mortar, grout, and reinforcement."
            },
            {
              title: "U.S. Standard CMU Sizes",
              desc: "Use common U.S. concrete block sizes such as 4\", 6\", 8\", 10\", and 12\" CMU blocks for practical estimating."
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
          How to Use the Concrete Block Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Enter wall length and wall height in feet and inches.",
            "Select the concrete block size (e.g., 8×8×16 CMU).",
            "Add doors and window openings if needed (Advanced mode).",
            "Choose your waste percentage (default 5%).",
            "Enable mortar, grout, reinforcement, or cost options if needed (Advanced mode).",
            "Click Calculate.",
            "Review your estimated block quantity and material breakdown."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Wall Area & Openings</strong>
            Wall Area = Length × Height<br/>
            Net Wall Area = Gross Wall Area − Opening Area
          </li>
          <li>
            <strong className="text-white block">2) Block Calculation</strong>
            Base Blocks = Net Wall Area ÷ Block Face Coverage (typically 0.8889 sq ft)<br/>
            Final Blocks = Base Blocks × (1 + Waste % ÷ 100)
          </li>
          <li>
            <strong className="text-white block">3) Mortar & Supplies</strong>
            Mortar Bags = Final Blocks ÷ 13<br/>
            Total Material Cost = Blocks + Mortar + Grout + Reinforcement
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many concrete blocks do I need for my wall?</h3>
            <p className="text-slate-400">
              The number of concrete blocks you need depends on the wall length, wall height, block size, and any openings. A Concrete Block Calculator gives a faster and more accurate estimate than manual calculation.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What block size does a Concrete Block Calculator use?</h3>
            <p className="text-slate-400">
              Most concrete block calculators use common U.S. CMU sizes such as 4 in × 8 in × 16 in, 6 in × 8 in × 16 in, 8 in × 8 in × 16 in, 10 in × 8 in × 16 in, and 12 in × 8 in × 16 in.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can a Concrete Block Calculator estimate mortar?</h3>
            <p className="text-slate-400">
              Some advanced concrete block calculators can estimate mortar bags or mortar volume in addition to block count. This helps with planning the full masonry material requirement.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Why should I use a Concrete Block Calculator instead of manual math?</h3>
            <p className="text-slate-400">
              A Concrete Block Calculator is faster, easier, and usually more accurate because it can account for block size, openings, waste, mortar, grout, and other important variables in one place.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
