"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function StaircaseConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Staircase Concrete Quantity
        </h2>
        <p className="mb-4 leading-relaxed">
          Staircase formwork is notoriously complex, and ordering the exact amount of concrete to fill an inclined waist slab and step wedges can save immense trouble on pouring day. Use our tool to calculate volumes for Waist-Slab stairs or Solid mass stairs, including optional landings.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Staircase Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Two Calculation Modes",
              desc: "Choose Waist-Slab (inclined slab + step wedges) or Solid (mass) stairs—whichever your design requires."
            },
            {
              title: "Global Unit Selector",
              desc: "Enter all dimensions in meters, centimeters, millimeters, feet, or inches; consistent conversions are handled for you."
            },
            {
              title: "Real Stair Geometry",
              desc: "Inputs include number of steps, tread (depth), riser (height), stair width, and—on waist-slab—waist thickness."
            },
            {
              title: "Optional Landings",
              desc: "Add rectangular Top and/or Bottom landings with length × width × thickness for full-flight volume."
            },
            {
              title: "Volume, Weight & Conversions",
              desc: "See m³, ft³, yd³, liters, and approx. weight using 2400 kg/m³—plus a readable component breakdown."
            },
            {
              title: "Print / Save & Copy",
              desc: "Export an A4-friendly summary or copy the breakdown for emails, site logs, and POs."
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
          How to Use the Staircase Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select Unit (m, cm, mm, ft, or in).",
            "Choose a mode: Waist-Slab or Solid (Mass).",
            "Enter stair geometry: Number of Steps, Tread (depth), Riser (height), and Width.",
            "In Waist-Slab mode, also enter Waist Thickness.",
            "(Optional) Enable Bottom and/or Top Landing and provide their Length, Width, and Thickness.",
            "Click Calculate to reveal Total Volume, Liters, Approx. Weight, and a Breakdown.",
            "Use Cubic Yards (for ordering) with quick +5% and +10% helpers, then Print / Save."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Staircase Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Purpose-built for stair flights with waist-slab or solid modeling.</li>
          <li>Accurate unit handling across m, cm, mm, ft, and in—no manual conversions or spreadsheets.</li>
          <li>Readable results: total volume, liters, yardage, and approximate weight at a glance.</li>
          <li>Includes a detailed component breakdown (waist slab, wedges, landings) for reviews.</li>
          <li>Print/Save and Copy features streamline documentation and team communication.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Waist-Slab Stairs</strong>
            Sloped length (Ls) = √(Total Run² + Total Rise²)<br/>
            Waist volume = Waist Thickness × Stair Width × Ls<br/>
            Step wedges = 0.5 × Steps × Tread × Riser × Stair Width
          </li>
          <li>
            <strong className="text-white block">2) Solid (Mass) Stairs</strong>
            Steps volume ≈ Steps × Tread × Riser × Stair Width<br/>
            <em>This conservative model treats the flight as stacked rectangular steps.</em>
          </li>
          <li>
            <strong className="text-white block">3) Landings (Rectangular Prisms)</strong>
            Landing volume = Length × Width × Thickness
          </li>
          <li>
            <strong className="text-white block">4) Weight</strong>
            approx. weight = m³ × 2400 kg/m³ (normal-weight concrete)
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What's the difference between Waist-Slab and Solid stairs?</h3>
            <p className="text-slate-400">
              Waist-Slab models an inclined slab plus triangular step wedges, typically yielding a lower volume. Solid stairs approximate stacked rectangular steps and are more conservative.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I include landings?</h3>
            <p className="text-slate-400">
              Yes. Toggle Bottom and/or Top Landing and provide their Length, Width, and Thickness to include them in the total volume.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does the calculator show weight?</h3>
            <p className="text-slate-400">
              Yes. It multiplies total m³ by 2400 kg/m³ (normal-weight concrete) to provide an approximate mass in kg and metric tons.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I get cubic yards for ordering?</h3>
            <p className="text-slate-400">
              Results include yd³ and a helper that shows +5% and +10% additions so you can round orders to supplier increments.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this tool handle reinforcement or code checks?</h3>
            <p className="text-slate-400">
              No. It focuses on concrete volume. Reinforcement, cover, and code compliance should follow your structural drawings and local standards.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
