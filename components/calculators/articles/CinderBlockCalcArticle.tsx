"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function CinderBlockCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          What is a Cinder Block Cost Calculator?
        </h2>
        <p className="mb-4 leading-relaxed">
          Our Cinder Block Calculator serves as both a block quantity estimator and a complete cinder block cost calculator. Whether you are building a simple garden wall or a full retaining structure, this tool calculates exactly how many blocks you need.
        </p>
        <p className="leading-relaxed">
          It factors in standard nominal dimensions, automatically deducts multiple wall openings (like doors and windows), and includes fully customizable waste percentages. Plus, it calculates the mortar you need and adds up all costs for a complete project estimate.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Cinder Block Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Block Quantity Estimator",
              desc: "Calculates exactly how many cinder blocks you need based on wall dimensions and block size."
            },
            {
              title: "Cinder Block Cost Calculator",
              desc: "Estimates total block cost using your price per block, mortar, labor, delivery, and add-ons."
            },
            {
              title: "Mortar Estimator",
              desc: "Estimates mortar bags required. Supports 60 lb, 80 lb, and custom coverage inputs."
            },
            {
              title: "Wall Openings Deduction",
              desc: "Add multiple doors, windows, vents, or gates. The calculator deducts their area."
            },
            {
              title: "Waste Allowance Control",
              desc: "Includes a fully adjustable waste percentage with quick presets for layouts."
            },
            {
              title: "Installed Wall Cost Estimator",
              desc: "Estimates total installed cost by combining materials, labor, and optional extras like footing."
            },
            {
              title: "USA Standard Block Sizes",
              desc: "Supports common U.S. nominal CMU sizes including 4×8×16, 6×8×16, 8×8×16, and half blocks."
            },
            {
              title: "Print / Save Results",
              desc: "Print or save your full calculation results as a PDF for project documentation."
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
          How to Use the Cinder Block Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select your unit system — imperial (ft) or metric (m).",
            "Enter wall length and wall height as gross dimensions.",
            "Select your nominal block size from the preset list, or choose Custom.",
            "Set the mortar bag size and waste percentage (default: 80 lb bag, 5% waste).",
            "Add any openings (doors, windows, vents) to deduct from the wall area.",
            "Optionally enter cost per block, mortar bag price, labor rate, delivery, and tax.",
            "Click Calculate to see block count, mortar bags, and a full cost breakdown."
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

      {/* Cinder vs Concrete */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Cinder Block vs Concrete Block: What You Should Know</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          The terms <strong>cinder block</strong> and <strong>concrete block</strong> are often used interchangeably, but they are technically different. Traditional cinder blocks used cinders from coal combustion as aggregate, while modern masonry units — officially called <strong>CMUs (Concrete Masonry Units)</strong> — use sand, gravel, or other dense aggregates.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Today, almost all blocks sold at U.S. home improvement and building supply stores are concrete blocks or CMUs. This calculator is marketed as a cinder block calculator to reflect how most homeowners search for this tool, but it is fully accurate for modern concrete blocks.
        </p>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in This Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Net Wall Area</strong>
            Opening Area = Width × Height × Quantity<br/>
            Net Wall Area = Gross Wall Area − Sum of All Opening Areas
          </li>
          <li>
            <strong className="text-white block">2) Block Quantity</strong>
            Block Face Area = Nominal Length × Nominal Height (in ft²)<br/>
            Blocks Before Waste = Net Area × (1 / Block Face Area)<br/>
            Final Blocks = ⌈ Blocks Before Waste × (1 + Waste%) ⌉
          </li>
          <li>
            <strong className="text-white block">3) Mortar Estimation</strong>
            80 lb bag: Bags = ⌈ Final Blocks / 13 ⌉<br/>
            60 lb bag: Bags = ⌈ Final Blocks / 9.75 ⌉
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many cinder blocks do I need for a wall?</h3>
            <p className="text-slate-400">
              Divide the net wall area (length × height minus openings) by the block face area. For a standard 8×8×16 nominal block, you need 1.125 blocks per square foot. Add a 5–10% waste allowance and always round up to whole blocks.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I calculate cinder block cost?</h3>
            <p className="text-slate-400">
              Multiply the total number of blocks by the price per block. Our cinder block cost calculator adds mortar, labor, delivery, and optional extras like grout and rebar to give you a complete project estimate.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What size is a standard cinder block in the USA?</h3>
            <p className="text-slate-400">
              The most common nominal size is 8 × 8 × 16 inches. Actual dimensions are approximately 7-5/8 × 7-5/8 × 15-5/8 inches. Common thicknesses are 4, 6, 8, 10, and 12 inches.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much mortar do I need for cinder blocks?</h3>
            <p className="text-slate-400">
              A standard rule of thumb is that one 80 lb bag of mortar covers approximately 13 standard blocks. For 60 lb bags, expect around 9–10 blocks per bag. These are estimates; actual usage varies by joint thickness and technique.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can this tool be used as a cinder block cost calculator?</h3>
            <p className="text-slate-400">
              Yes. Enter the cost per block, price per mortar bag, labor rate, delivery, and tax to get a complete material and installed wall cost estimate.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
