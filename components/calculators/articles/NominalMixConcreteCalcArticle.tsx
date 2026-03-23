"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function NominalMixConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Nominal Mix Concrete (M5–M25)
        </h2>
        <p className="mb-4 leading-relaxed">
          Planning a small pour or standard non-structural pad? Our Nominal Mix Calculator uses standard industry ratios (M5 to M25) to break your total volume down into exactly how much cement, sand, and aggregate you need—accounting for dry volume conversion and site waste.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Nominal Mix Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Grade Presets (M5–M25)",
              desc: "Built-in mix ratios with typical default w/c for each grade (e.g., M20 → 1:1.5:3, w/c ≈ 0.50)."
            },
            {
              title: "Volume in m³ / ft³ / yd³",
              desc: "Enter project volume in your preferred unit. The calculator converts internally for accurate results."
            },
            {
              title: "Dry Volume & Wastage",
              desc: "Applies a dry volume factor (e.g., 1.50–1.57) and your wastage % to arrive at field-ready quantities."
            },
            {
              title: "Bag Calculator",
              desc: "Choose your bag size (e.g., 50 kg) to see total cement bags required for the batch."
            },
            {
              title: "Editable Densities",
              desc: "Tune bulk densities for cement, sand, and aggregate (kg/m³) to match local materials."
            },
            {
              title: "W/C & Moisture Corrections",
              desc: "Override w/c, include sand/aggregate moisture, and see adjusted water and material masses."
            },
            {
              title: "Gated Results + Yardage Helper",
              desc: "Results appear after Calculate, with yd³ quick helpers (+5% / +10%) for ordering."
            },
            {
              title: "Print / Save Sheet",
              desc: "Export a clean, A4-friendly summary of inputs, materials, and yardage for records."
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
          How to Use the Nominal Mix M5–M25 Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select the Grade (M5–M25) to load its ratio and default w/c.",
            "Enter your Volume and choose the unit (m³, ft³, or yd³).",
            "(Optional) Adjust Dry Volume Factor, Wastage %, and Bag Size (kg).",
            "(Optional) Edit bulk densities and moisture % for sand/aggregate; override w/c if needed.",
            "Click Calculate to reveal cement bags, adjusted materials, water, and volumes.",
            "Use the Cubic Yards helper (+5% / +10%) and Print / Save to finalize ordering."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Nominal Mix Concrete Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Fast material splits from grade presets M5–M25 with editable factors.</li>
          <li>Accurate, consistent unit handling across m³, ft³, and yd³.</li>
          <li>Includes real-world allowances: dry factor, wastage, and moisture.</li>
          <li>Bag count, adjusted water, and yd³ helpers streamline ordering.</li>
          <li>Printable summary for purchase orders and site documentation.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Dry Volume & Wastage</strong>
            V_dry = V_input × DryFactor<br/>
            V_dry+waste = V_dry × (1 + Wastage%)<br/>
            <em>Note: Typical DryFactor is 1.50–1.57 for volume batching; Wastage often 2–10% based on site practice.</em>
          </li>
          <li>
            <strong className="text-white block">2) Material Split (by parts)</strong>
            Vol_cem = (Cement/PartsSum) × V_dry+waste<br/>
            Vol_sand = (Sand/PartsSum) × V_dry+waste<br/>
            Vol_agg = (Aggregate/PartsSum) × V_dry+waste
          </li>
          <li>
            <strong className="text-white block">3) Masses & Bags</strong>
            Mass_X (kg) = Vol_X × ρ_X<br/>
            Bags = Mass_cem / BagSizeKg
          </li>
          <li>
            <strong className="text-white block">4) Water & Moisture Adjustment</strong>
            Water_theoretical (kg) = (w/c) × Mass_cem<br/>
            AddedWater = Water from Sand Moisture + Water from Aggregate Moisture<br/>
            Water_adjusted = max(Water_theoretical − AddedWater, 0)
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What&apos;s the difference between nominal and design mix?</h3>
            <p className="text-slate-400">
              Nominal mix uses standard ratios (M5–M25) for routine work; design mix is laboratory-designed to meet a target strength and workability.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Which dry volume factor should I use?</h3>
            <p className="text-slate-400">
              Field practice commonly uses 1.50–1.57. Use 1.54 as a starting point unless your organization specifies otherwise.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I change the water–cement ratio?</h3>
            <p className="text-slate-400">
              Yes. Leave the field blank to use the grade&apos;s typical default, or override w/c to match your specification.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Why do I enter moisture for sand and aggregates?</h3>
            <p className="text-slate-400">
              Surface moisture contributes water to the mix. The tool subtracts that from theoretical water to avoid overwetting.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Are these quantities suitable for structural members?</h3>
            <p className="text-slate-400">
              They&apos;re planning estimates for nominal mixes. For structural elements with strength requirements, use a design mix per your code.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
