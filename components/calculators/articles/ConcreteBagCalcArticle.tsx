"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function ConcreteBagsCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Bags of Concrete
        </h2>
        <p className="mb-4 leading-relaxed">
          Tired of doing complex volume-to-bag divisions on a piece of scrap paper? Our Concrete Bags Calculator takes the mathematical friction out of ordering bagged premix. Focus on getting clean dimensions while it returns exact bags, +5%, and +10% buffer options.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Concrete Bags Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Multi-Unit Inputs",
              desc: "Enter dimensions in feet/inches or meters/centimeters/millimeters. The calculator converts everything consistently under the hood."
            },
            {
              title: "Project Types & Conversions",
              desc: "Slab, Footing, Post Holes, Sonotube, or Custom Volume — with quick readouts in ft³, yd³, and m³ for ordering."
            },
            {
              title: "Bag Size Options",
              desc: "Choose common pre-mix bag sizes: 40 lb, 50 lb, 60 lb, 80 lb, and 20 kg. Uses nominal yields for accurate bag counts."
            },
            {
              title: "Waste Buffers",
              desc: "Auto-add +5% and +10% buffers to cover spillage, edge thickening, and site variations."
            },
            {
              title: "Guided Workflow",
              desc: "Results appear after Calculate, keeping the form focused and preventing accidental reads."
            },
            {
              title: "Print / Save Sheet",
              desc: "Export a clean, printer-friendly summary with inputs, conversions, and bag counts."
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
          How to Use the Concrete Bags Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select your Unit System (Imperial or Metric) and set Linear Units.",
            "Choose Project Type: Slab, Footing, Post Holes, Sonotube, or Custom Volume.",
            "Enter all required dimensions in the same unit (e.g., feet or meters).",
            "Select a Bag Size (40/50/60/80 lb or 20 kg).",
            "Press Calculate to reveal exact bags plus +5% and +10% buffers.",
            "Optional utility: use Bags ↔ Yards and Volume ↔ Bags conversions."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Free Concrete Bags Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Accurate volume from slab, footing, post holes, or sonotube geometry with clean unit handling.</li>
          <li>Supports standard bag sizes and provides practical +5%/+10% ordering buffers.</li>
          <li>Instant conversions to ft³, yd³, and m³ for supplier coordination and ready-mix comparisons.</li>
          <li>Clear step-by-step flow: inputs → bag size → calculate → results and buffers.</li>
          <li>Simple print/save workflow to document calculations for site records or submittals.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Volume by Project Type</strong>
            Slab/Footing (rectangular): Volume = L × W × T<br/>
            Posts/Sonotube (cylinder): Volume = π × (d/2)² × H × Count<br/>
            Custom Volume: Enter yd³ (Imperial) or m³ (Metric)
          </li>
          <li>
            <strong className="text-white block">2) Bags from Volume</strong>
            Bags (exact) = Total Volume ÷ Yield per Bag<br/>
            Typical nominal yields: 40 lb ≈ 0.30 ft³, 50 lb ≈ 0.37 ft³, 60 lb ≈ 0.45 ft³, 80 lb ≈ 0.60 ft³, 20 kg ≈ 0.014 m³ (~0.49 ft³)
          </li>
          <li>
            <strong className="text-white block">3) Buffers</strong>
            Bags (+5%) = Bags × 1.05<br/>
            Bags (+10%) = Bags × 1.10
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How can I calculate how many bags of concrete I need?</h3>
            <p className="text-slate-400">
              Use the Concrete Bags Calculator: select your project type, enter dimensions in your preferred units, choose a bag size (40/50/60/80 lb or 20 kg), and press Calculate. The tool converts geometry to volume, applies the selected bag yield, and returns exact bags plus safety buffers.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I calculate bags of concrete manually?</h3>
            <p className="text-slate-400">
              1) Compute volume (e.g. L × W × T for slabs). 2) Convert to cubic feet. 3) Divide by bag yield (80 lb ≈ 0.60 ft³, 60 lb ≈ 0.45 ft³). Add 5–10% for waste.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many concrete bags are needed per cubic yard?</h3>
            <p className="text-slate-400">
              A cubic yard is 27 ft³. Divide 27 by the bag yield in ft³. Approximate counts: 80 lb ≈ 45 bags/yd³, 60 lb ≈ 60 bags/yd³, 50 lb ≈ ~73 bags/yd³, 40 lb ≈ 90 bags/yd³.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many bags of concrete do I need for one fence post?</h3>
            <p className="text-slate-400">
              Convert the post hole into a cylinder volume: Volume = π × (d/2)² × Depth. A typical 12-inch diameter hole 2.5 ft deep represents about 1.96 ft³, needing around 3.3 (rounded to 4) 80 lb bags.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this calculator work for Lowe’s or Home Depot bag sizes?</h3>
            <p className="text-slate-400">
              Yes. The calculator supports 40, 50, 60, and 80 lb bags that match typical retail sizes (including Lowe’s, Menards, and Home Depot), plus 20 kg for metric markets.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
