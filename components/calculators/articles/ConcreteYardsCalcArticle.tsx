"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function ConcreteYardsCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Concrete Yards
        </h2>
        <p className="mb-4 leading-relaxed">
          Order ready-mix concrete with confidence. Our free Concrete Yards Calculator simplifies volume conversions, letting you input dimensions in feet, inches, meters, or any unit you prefer, and instantly outputs the exact cubic yards needed for your pouring project.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Concrete Yards Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Rectangle / Slab Mode",
              desc: "Compute volume using L × W × T for pads, driveways, and floors—perfect for yard-based orders."
            },
            {
              title: "Circular Mode",
              desc: "Use diameter and thickness to get yardage for round pads and circular placements."
            },
            {
              title: "One Global Unit Selector",
              desc: "Enter all dimensions in the same unit (ft, in, yd, m, cm, mm). The calculator converts to ft³ internally."
            },
            {
              title: "Waste Allowance Built-In",
              desc: "Apply 0%, 5%, or 10% waste to reduce the risk of under-ordering."
            },
            {
              title: "Yard-Focused Results",
              desc: "Outputs in yd³ plus ft³ and m³. Yardage quick helpers show +5% and +10% for easy supplier rounding."
            },
            {
              title: "Gated Results",
              desc: "Results appear after you click Calculate—keeps the form focused and prevents accidental reads."
            },
            {
              title: "Print / Save",
              desc: "Export a clean, A4-friendly summary with inputs and yardage for records or purchase orders."
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
          How to Use the Concrete Yards Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select Shape: Rectangle / Slab or Circular.",
            "Choose one Input Unit (ft, in, yd, m, cm, or mm). All fields use this unit.",
            "Enter dimensions: Length, Width, Thickness (or Diameter, Thickness).",
            "Pick a Waste Allowance (0%, 5%, or 10%).",
            "Click Calculate to reveal results in yd³, with ft³ and m³ alongside.",
            "Use the yardage helpers (+5% / +10%) and optional Print / Save to finalize ordering."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Concrete Yards Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Designed for ordering in <strong>cubic yards</strong>, the industry standard for ready-mix.</li>
          <li>Rectangle and circular modes cover most slab and pad scenarios without extra steps.</li>
          <li>Single unit control avoids mixing units—fewer mistakes and cleaner calculations.</li>
          <li>Built-in waste options and yardage helpers (+5% / +10%) make supplier conversations faster.</li>
          <li>Printable summary helps document assumptions and quantities for your team.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Rectangle / Slab</strong>
            Volume (ft³) = Length × Width × Thickness (all converted to feet)<br/>
            Inputs are converted from your chosen unit (ft, in, yd, m, cm, mm) to feet before multiplication.
          </li>
          <li>
            <strong className="text-white block">2) Circular</strong>
            Volume (ft³) = π × (Diameter/2)² × Thickness<br/>
            All dimensions converted to feet before computing volume
          </li>
          <li>
            <strong className="text-white block">3) Waste Allowance</strong>
            Adjusted Volume = Raw Volume × (1 + Waste%)<br/>
            Preset options: 0%, 5%, 10%. Choose higher values for uneven subbase or difficult placement.
          </li>
          <li>
            <strong className="text-white block">4) Display Conversions</strong>
            yd³ = ft³ ÷ 27<br/>
            m³ = ft³ × 0.0283168
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Do I have to enter all dimensions in the same unit?</h3>
            <p className="text-slate-400">
              Yes. Pick a single input unit in the dropdown and enter all fields using that unit. The calculator handles the conversions internally.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Why are the results shown in cubic yards?</h3>
            <p className="text-slate-400">
              Ready-mix concrete is typically ordered in cubic yards. We also display ft³ and m³ for engineering checks and international projects.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Which waste percentage should I use?</h3>
            <p className="text-slate-400">
              5% is a common minimum; use 10% for uneven subgrade, edge forms, or when pumping. Follow your project standards.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What if my slab isn’t perfectly rectangular or circular?</h3>
            <p className="text-slate-400">
              Break complex shapes into rectangles or circles, calculate each area’s yardage, then add them together. Apply a suitable waste allowance before ordering.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this tool include rebar or mix design?</h3>
            <p className="text-slate-400">
              No. It focuses on volume. Reinforcement, control joints, and mix grade should follow your engineer’s drawings and local codes.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
