"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function PierCaissonConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Pier & Caisson Concrete Volume
        </h2>
        <p className="mb-4 leading-relaxed">
          Drilled shafts, piers, and caissons form the deep foundation elements of many structures. Whether you are pouring simple cylindrical piers for a deck or complex belled caissons for a commercial building, this tool provides exact volume requirements to streamline your concrete ordering process.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Pier / Caisson Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Shaft (Cylinder) Volume",
              desc: "Compute concrete for straight shafts using diameter and depth with accurate πr²h geometry."
            },
            {
              title: "Optional Belled Base",
              desc: "Add a frustum (top dia, bottom dia, height) for belled caissons; volume auto-added to the shaft."
            },
            {
              title: "Multi-Unit Inputs",
              desc: "Enter dimensions in meters, centimeters, millimeters, feet, or inches; conversions are handled for you."
            },
            {
              title: "Quantity & Waste",
              desc: "Multiply per-pier volume by pier count and apply a waste/overage % (e.g., 5–10%)."
            },
            {
              title: "Per-Pier & Totals in m³ / yd³ / ft³",
              desc: "See net and with-waste volumes per pier and for all piers, displayed in the units you need."
            },
            {
              title: "Print / Save + Yardage Helpers",
              desc: "Export a clean summary and quickly view yd³ +5% and +10% for supplier ordering."
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
          How to Use the Pier / Caisson Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select the Input Unit (m, cm, mm, ft, or in).",
            "Enter Shaft Diameter, Shaft Depth, and Quantity (No. of Piers).",
            "(Optional) Toggle Belled Base and provide Top Diameter, Bottom Diameter, and Bell Height.",
            "Add a Waste / Overage %—typical ranges are 5–10%.",
            "Click Calculate to reveal per-pier and total volumes in m³, yd³, and ft³.",
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Pier / Caisson Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Purpose-built for drilled shafts and belled caissons with field-ready outputs.</li>
          <li>Accurate unit handling across m, cm, mm, ft, and in—no manual conversions required.</li>
          <li>Shows per-pier and total volumes, both net and with waste, to prevent under-ordering.</li>
          <li>Yardage helpers (+5% / +10%) speed up ready-mix rounding and truck planning.</li>
          <li>Printable results simplify documentation for site logs and purchase orders.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Shaft (Cylinder)</strong>
            Volume = π × r² × h<br/>
            r = Diameter ÷ 2
          </li>
          <li>
            <strong className="text-white block">2) Belled Base (Frustum)</strong>
            Volume = (π × h / 3) × (R₁² + R₁R₂ + R₂²)<br/>
            R₁ = Top Radius, R₂ = Bottom Radius
          </li>
          <li>
            <strong className="text-white block">3) Quantity & Waste</strong>
            Per-Pier With Waste = Per-Pier × (1 + Waste%)<br/>
            Totals = Per-Pier × Quantity; Totals With Waste = Totals × (1 + Waste%)
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can this calculator handle belled caissons?</h3>
            <p className="text-slate-400">
              Yes. Enable Belled Base and enter top diameter, bottom diameter, and bell height. The frustum volume is added to the shaft volume automatically.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much waste should I add?</h3>
            <p className="text-slate-400">
              A 5–10% allowance is common for placement losses, uneven excavation, and pump line waste. Follow your project&apos;s specification.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does the calculator show per-pier and total volumes?</h3>
            <p className="text-slate-400">
              Yes. You&apos;ll see net and with-waste values per pier and for the total number of piers.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I use the yd³ (+5% / +10%) helpers?</h3>
            <p className="text-slate-400">
              After calculating, the yd³ helper block shows &apos;with waste&apos; yardage and quick +5% and +10% additions for rounding truck orders.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this tool include reinforcement or mix design?</h3>
            <p className="text-slate-400">
              No. It focuses on volume. Reinforcement, cover, and mix grade must follow structural drawings and local codes.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
