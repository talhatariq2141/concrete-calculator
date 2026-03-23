"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function TankTrenchConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Tank & Trench Concrete Estimator Guide
        </h2>
        <p className="mb-4 leading-relaxed">
          From civil utility trenches to residential water containment tanks, estimating concrete for hollow structures requires precise subtraction math. Our combined Tank/Trench estimator gives you the speed of dedicated presets alongside robust unit inter-conversions.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Tank / Trench Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Three Purpose-Built Modes",
              desc: "Trench, Rectangular Tank, and Circular Tank — switch by tabs to match your scope."
            },
            {
              title: "Global Unit Selector",
              desc: "Enter all dimensions in meters, centimeters, feet, or inches; conversions are handled for you."
            },
            {
              title: "Trench: Rectangular or Trapezoidal",
              desc: "Use Width for rectangular trenches or Top/Bottom Widths for trapezoidal sections."
            },
            {
              title: "Tank Wall & Slab Thickness",
              desc: "Rectangular & circular tanks include wall, base, and optional cover slab thicknesses."
            },
            {
              title: "Breakdown for Tanks",
              desc: "See base slab, walls, and cover slab volumes separately when using tank modes."
            },
            {
              title: "Print / Save & Reset",
              desc: "Export an A4-friendly summary for records and reset inputs with one click."
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
          How to Use the Tank / Trench Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select a Mode: Trench, Rectangular Tank, or Circular Tank.",
            "Choose one Unit (m, cm, ft, or in). Enter all fields using that unit.",
            "Provide dimensions: Trench (Length, Depth, Widths) or Tank (Inner dims + Wall/Base/Cover thicknesses).",
            "Enter a Waste / Overage % (commonly 5–10%).",
            "Click Calculate to reveal Net and With Waste volumes in m³, yd³, and ft³.",
            "Use the Cubic Yards helper (+5% / +10%) and Print / Save Calculations for ordering."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose This Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Accurate geometry for trenches and tanks with proper unit handling throughout.</li>
          <li>Built-in waste allowance helps avoid shortages during pours.</li>
          <li>Per-mode inputs reduce confusion and keep your workflow fast.</li>
          <li>Tank breakdown (base, walls, cover) supports estimating and approvals.</li>
          <li>Yardage helper (+5% / +10%) mirrors supplier rounding practices.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Trench (Rectangular & Trapezoidal)</strong>
            Rect: Volume = Length × Width × Depth<br/>
            Trap: Section Area = Depth × (Top Width + Bottom Width) ÷ 2<br/>
            Volume = Length × Section Area
          </li>
          <li>
            <strong className="text-white block">2) Rectangular Tank (Outer − Inner)</strong>
            Outer: (L + 2t_w) × (W + 2t_w) × (H + t_base + t_top)<br/>
            Inner: L × W × H<br/>
            Net Concrete = Outer − Inner
          </li>
          <li>
            <strong className="text-white block">3) Circular Tank (Outer − Inner)</strong>
            Outer: π × (D_out/2)² × (H + t_base + t_top), where D_out = D_in + 2t_w<br/>
            Inner: π × (D_in/2)² × H<br/>
            Net Concrete = Outer − Inner
          </li>
          <li>
            <strong className="text-white block">4) Waste Allowance</strong>
            With Waste = Net × (1 + Waste%)
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I calculate both rectangular and trapezoidal trenches?</h3>
            <p className="text-slate-400">
              Yes. Choose Rectangular to use a single width, or Trapezoidal to enter top and bottom widths; the calculator uses the correct area formula.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How are tank volumes computed?</h3>
            <p className="text-slate-400">
              Both tank modes compute an outer concrete shell minus the inner water volume. We also show a breakdown for base slab, walls, and cover slab.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What waste percentage should I add?</h3>
            <p className="text-slate-400">
              5–10% is common for over-excavation and placement losses. Use higher allowances if site access or formwork is challenging.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I get cubic yards for ordering?</h3>
            <p className="text-slate-400">
              After calculating, yardage is shown along with +5% and +10% helpers to round orders to supplier increments.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does the calculator handle reinforcement or water-tightness checks?</h3>
            <p className="text-slate-400">
              No. It focuses on concrete volume. Reinforcement, crack control, and waterproofing must follow your design and local codes.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
