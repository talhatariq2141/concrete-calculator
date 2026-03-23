"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function SlabConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Concrete Slabs
        </h2>
        <p className="mb-4 leading-relaxed">
          The slab is the most fundamental poured flatwork in construction. From a simple outdoor patio to a reinforced commercial warehouse floor, estimating exactly how much volume of wet mixed concrete to order is the critical first step for managing budgets and avoiding short pours.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Slab Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Multi-Unit Inputs",
              desc: "Enter length & width in feet/meters and thickness in inches/mm/cm. The calculator converts everything automatically."
            },
            {
              title: "Accurate Volume Results",
              desc: "Get precise cubic yards (yd³) and cubic meters (m³) for any slab dimension and thickness."
            },
            {
              title: "Waste Allowance",
              desc: "Add an optional overage factor (commonly 5–10%) so you order enough concrete for spillage and grading."
            },
            {
              title: "Real-Time Calculation",
              desc: "Results update instantly as you type—no page reloads, no waiting."
            },
            {
              title: "Mix Guidance (Informational)",
              desc: "Displays typical mix guidance for slabs (e.g., 3000–4000 PSI / 20–28 MPa)—use your engineer's spec when available."
            },
            {
              title: "Clear Result Summary",
              desc: "Clean results with unit labels and formatted values that are easy to read on site."
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
          How to Use the Slab Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Enter Length and Width of the slab.",
            "Enter Thickness (commonly 4 in / 100 mm for light-duty slabs).",
            "(Optional) Add a Waste/Overage % to cover spillage and uneven sub-base.",
            "View instant results in cubic yards (yd³) and cubic meters (m³).",
            "Round up when ordering ready-mix; suppliers typically deliver in 0.5 or 1.0 yd³ increments."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Slab Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Completely free to use — no sign-up, subscriptions, or limits.</li>
          <li>Construction-grade precision with consistent unit conversions and decimal handling.</li>
          <li>Real-time results with optional waste margin so orders don't come up short.</li>
          <li>Clear, share-friendly outputs in both cubic yards and cubic meters for suppliers and crews.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Core Volume Formula</strong>
            Volume = Length × Width × Thickness<br/>
            <em>All dimensions are internally converted to the same base unit before multiplying.</em>
          </li>
          <li>
            <strong className="text-white block">2) Unit Conversions</strong>
            1 ft = 12 in, 1 m = 1000 mm<br/>
            1 yd³ = 27 ft³<br/>
            1 m³ ≈ 1.30795 yd³
          </li>
          <li>
            <strong className="text-white block">3) Waste / Overage</strong>
            Adjusted Volume = Raw Volume × (1 + Waste%)
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How accurate is the Slab Concrete Calculator?</h3>
            <p className="text-slate-400">
              It uses straightforward geometry with strict unit conversion to provide reliable cubic yard and cubic meter estimates. Always round up when placing an order and consider a 5–10% waste allowance.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What slab thickness should I use?</h3>
            <p className="text-slate-400">
              Light patios and walkways often use 4 in (100 mm). Driveways or heavier loads may require 5–6 in (125–150 mm) or engineer-specified thickness. Always follow local codes and structural drawings.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does the calculator support both imperial and metric units?</h3>
            <p className="text-slate-400">
              Yes. Enter dimensions in feet/meters and thickness in inches/mm/cm—the tool converts everything and outputs both yd³ and m³.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I add extra concrete for waste and uneven sub-base?</h3>
            <p className="text-slate-400">
              Use the Waste/Overage field (e.g., 5–10%). The calculator multiplies the raw volume by this factor to show an adjusted order quantity.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I use this for irregular or multiple slab sections?</h3>
            <p className="text-slate-400">
              For L-shapes or complex layouts, break the area into rectangles, calculate each section, then sum the volumes. Add a suitable waste allowance before ordering.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
