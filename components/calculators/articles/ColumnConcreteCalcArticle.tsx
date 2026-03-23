"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ColumnConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Estimate Concrete for Columns
        </h2>
        <p className="mb-4 leading-relaxed">
          Accurate volume estimation for concrete columns is essential for strong structural supports and saving money on material. Using this calculator, you can quickly find volume for cylindrical or rectangular columns to prevent costly over-ordering or mid-pour shortages.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Column Concrete Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Rectangular / Square Columns",
              desc: "Compute volume using L × W × H with automatic unit handling."
            },
            {
              title: "Circular Columns",
              desc: "Calculate π × r² × H from diameter and height—with conversions built-in."
            },
            {
              title: "Multi-Unit Inputs",
              desc: "Enter dimensions in meters, centimeters, feet, or inches; results stay consistent."
            },
            {
              title: "Quantity & Waste Allowance",
              desc: "Multiply per-column volume by count and add a waste % (commonly 5–10%)."
            },
            {
              title: "Display Units Toggle",
              desc: "Show totals in m³, yd³, or ft³ without re-entering your inputs."
            },
            {
              title: "Clear, Gated Results",
              desc: "Results appear after Calculate to avoid accidental reads and keep focus on inputs."
            },
            {
              title: "Print / Save",
              desc: "Export a tidy summary of inputs and results; includes yd³ helpers (+5% / +10%)."
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
          How to Use the Column Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select the Rectangular / Square or Circular tab.",
            "Choose your unit (m, cm, ft, or in) and enter dimensions.",
            "Enter the Quantity (No. of Columns) and a Waste % (e.g., 5–10%).",
            "Press Calculate to reveal results.",
            "Use Show in to toggle m³, yd³, or ft³ as needed for ordering.",
            "Optionally hit Print / Save Calculations to export a clean summary."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Free Column Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Supports both rectangular/square and circular columns in one tool.</li>
          <li>Accurate unit conversions and numeric input guards reduce entry errors.</li>
          <li>Quantity and waste % built in—perfect for multi-column projects.</li>
          <li>One-click display switch between m³, yd³, and ft³ for ordering.</li>
          <li>Printable summary helps communicate quantities to suppliers and crews.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Rectangular / Square Column</strong>
            Gross Volume per Column = L × W × H<br/>
            (Inputs are converted to a common base before multiplication to avoid unit mismatch.)
          </li>
          <li>
            <strong className="text-white block">2) Circular Column</strong>
            Gross Volume per Column = π × r² × H<br/>
            r = Diameter ÷ 2
          </li>
          <li>
            <strong className="text-white block">3) Quantity & Waste</strong>
            Net Total = Per-Column Volume × Quantity<br/>
            With Waste = Net Total × (1 + Waste%)
          </li>
          <li>
            <strong className="text-white block">4) Display Conversions</strong>
            1 m³ = 35.3147 ft³<br/>
            1 m³ = 1.30795 yd³
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does the calculator handle both rectangular and circular columns?</h3>
            <p className="text-slate-400">
              Yes. Use the tabs to switch between Rectangular/Square and Circular modes; each uses the appropriate geometric formula.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Which input units are supported?</h3>
            <p className="text-slate-400">
              Meters, centimeters, feet, and inches for dimensions. You can display results in cubic meters, cubic yards, or cubic feet.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much waste should I add?</h3>
            <p className="text-slate-400">
              Many projects use 5–10% to cover spillage, pumping losses, and subgrade variation. Always follow your project&apos;s specification.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I enter multiple columns at once?</h3>
            <p className="text-slate-400">
              Yes. Enter the quantity of columns; the tool multiplies per-column volume to produce net totals and totals with waste.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I get cubic yards for ordering?</h3>
            <p className="text-slate-400">
              After calculating, set the display to yd³, or use the built-in yardage helper that also shows +5% and +10% options.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this include reinforcement or mix design?</h3>
            <p className="text-slate-400">
              No. The tool focuses on volume. Reinforcement, cover, and mix grade must follow your structural drawings and local codes.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
