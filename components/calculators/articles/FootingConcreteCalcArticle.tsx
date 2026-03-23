"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function FootingConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Footing Concrete Volume
        </h2>
        <p className="mb-4 leading-relaxed">
          Accurate volume estimation for concrete footings is essential to establish a strong structural foundation without costly over-ordering. This calculator provides precise volume requirements for both continuous strip footings (rectangular) and isolated pier bases (circular).
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Footing Concrete Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Rectangular / Square Footings",
              desc: "Compute volume with L × W × D for isolated or strip footings—unit conversions handled internally."
            },
            {
              title: "Circular Footings",
              desc: "Use diameter and depth to calculate π × r² × D for round pads and pier bases."
            },
            {
              title: "Multi-Unit Inputs",
              desc: "Enter dimensions in meters, centimeters, feet, or inches; we convert to a common base for accuracy."
            },
            {
              title: "Waste Allowance Built-In",
              desc: "Add any waste percentage (commonly 5–10%) to cover over-excavation and placement losses."
            },
            {
              title: "Display Units Toggle",
              desc: "Show results in m³, yd³, or ft³ without re-entering values."
            },
            {
              title: "Gated Results",
              desc: "Results appear after you click Calculate—keeps the form focused and prevents accidental reads."
            },
            {
              title: "Print / Save + Yardage Helper",
              desc: "Export a tidy summary and view yd³ with +5% and +10% helpers for supplier rounding."
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
          How to Use the Footing Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select the Rectangular / Square or Circular tab.",
            "Choose your input unit (m, cm, ft, or in) and enter dimensions.",
            "Add a Waste Allowance (%)—5–10% is typical for footings.",
            "Click Calculate to reveal Net Volume, With Waste, and Waste Added.",
            "Set Show in to view m³, yd³, or ft³, and use the yd³ helper (+5% / +10%) for ordering.",
            "Use Print / Save Calculations to export a clean summary."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Footing Concrete Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Supports both rectangular/square and circular footings in one place.</li>
          <li>Accurate unit handling across m, cm, ft, and in—no manual conversions needed.</li>
          <li>Waste % included to reduce the risk of under-ordering due to over-excavation.</li>
          <li>Switch display units instantly for engineering checks or ready-mix ordering.</li>
          <li>Printable results streamline site approvals and purchase orders.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Rectangular / Square Footing</strong>
            Volume = Length × Width × Depth (Thickness)<br/>
            Inputs are converted to meters internally before multiplication to keep units consistent.
          </li>
          <li>
            <strong className="text-white block">2) Circular Footing</strong>
            Volume = π × r² × Depth, where r = Diameter ÷ 2
          </li>
          <li>
            <strong className="text-white block">3) Waste Allowance</strong>
            Adjusted Volume = Raw Volume × (1 + Waste%)<br/>
            Typical waste for footings is 5–10% depending on excavation, formwork, and placement method.
          </li>
          <li>
            <strong className="text-white block">4) Display Conversions</strong>
            1 m³ = 35.3147 ft³<br/>
            1 m³ = 1.30795 yd³<br/>
            yd³ = ft³ ÷ 27
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I calculate both rectangular and circular footings?</h3>
            <p className="text-slate-400">
              Yes. Use the tabs to switch between Rectangular/Square and Circular modes; each uses the appropriate geometric formula.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Which input units are supported?</h3>
            <p className="text-slate-400">
              Meters (m), centimeters (cm), feet (ft), and inches (in). You can display results in m³, yd³, or ft³.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much waste should I add for footings?</h3>
            <p className="text-slate-400">
              5–10% is common to account for over-excavation, trench irregularities, and placement losses. Follow your project specifications.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What does the yards helper do?</h3>
            <p className="text-slate-400">
              It provides yd³ with +5% and +10% additions to quickly round orders for ready-mix deliveries.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this include rebar, cover, or mix design?</h3>
            <p className="text-slate-400">
              No. The calculator focuses on volume. Reinforcement and mix grade must follow your structural drawings and local codes.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
