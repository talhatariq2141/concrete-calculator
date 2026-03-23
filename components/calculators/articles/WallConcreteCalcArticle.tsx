"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function WallConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Concrete for Walls
        </h2>
        <p className="mb-4 leading-relaxed">
          Poured concrete walls, whether for foundations or retaining structures, are significant investments. Calculating exact volume while properly subtracting window and door openings is vital to prevent massive over-ordering and waste on site.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Wall Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Flexible Units",
              desc: "Length/Height in meters or feet; thickness in meters, centimeters, or inches. All conversions are handled internally."
            },
            {
              title: "Net Volume with Openings",
              desc: "Subtract doors, windows, and vents automatically using width &times; height &times; thickness &times; count for each opening."
            },
            {
              title: "Nominal Mix & Materials",
              desc: "Select 1:1.5:3, 1:2:4, or 1:3:6. The tool applies a 1.54 dry-factor, computes cement (bags), sand, aggregate, and water."
            },
            {
              title: "Water–Cement Ratio",
              desc: "Enter w/c (e.g., 0.5). Water is calculated in liters (≈ kg) from cement mass."
            },
            {
              title: "Results in m³ / ft³ / yd³",
              desc: "Switch the display unit for net volume. A Yardage helper shows +5% and +10% for supplier rounding."
            },
            {
              title: "Optional Costing",
              desc: "Estimate cost by rate per m³ or by materials (cement bags, sand m³, aggregate m³)."
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
          How to Use the Wall Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select Length, Height, and Thickness with their units (m/ft for L & H; m/cm/in for thickness).",
            "Pick a Nominal Mix (1:1.5:3, 1:2:4, or 1:3:6) and enter the Water–Cement Ratio (e.g., 0.5).",
            "Open the Openings tab to add doors/windows/vents with Width, Height, and Count.",
            "Choose your Output Volume Unit (m³/ft³/yd³) and press Calculate.",
            "Review Net Volume, Materials (dry volume, cement bags, sand, aggregate, water), and the Yardage helper (+5% / +10%).",
            "(Optional) Use Cost Estimation by rate per m³ or by materials, then Print / Save your results."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Wall Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Purpose-built for straight concrete walls with accurate opening subtraction.</li>
          <li>Consistent unit handling across m/ft and m/cm/in—no manual conversions.</li>
          <li>Real-world allowances via dry-volume factor (1.54) and material breakdown for procurement.</li>
          <li>Yardage (+5% / +10%) mirrors ready-mix ordering and truck rounding.</li>
          <li>Printable results and optional costing streamline budgets and approvals.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Wall & Openings</strong>
            Gross Wall Volume = Length × Height × Thickness<br/>
            Opening Volume (each) = Opening Width × Opening Height × Thickness<br/>
            Net Concrete Volume = Gross − Σ(Openings)
          </li>
          <li>
            <strong className="text-white block">2) Dry Volume & Materials</strong>
            Dry Volume = Net × 1.54<br/>
            Mix parts: Cement : Sand : Aggregate (e.g., 1:2:4)<br/>
            Cement Volume = (Cement / PartsSum) × Dry Volume
          </li>
          <li>
            <strong className="text-white block">3) Bags & Water</strong>
            Cement Mass (kg) = Cement Volume × 1440 kg/m³<br/>
            Bags = Cement Mass ÷ 50 kg<br/>
            Water (liters ≈ kg) = (w/c) × Cement Mass
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I mix units when entering dimensions?</h3>
            <p className="text-slate-400">
              Use meters or feet for length and height, and meters/centimeters/inches for thickness. The tool converts internally—just keep each field&apos;s unit consistent with its selector.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How are openings handled?</h3>
            <p className="text-slate-400">
              Each opening&apos;s volume width &times; height &times; wall thickness &times; count. The calculator subtracts the total of all openings from the gross wall volume.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Which nominal mixes are available?</h3>
            <p className="text-slate-400">
              1:1.5:3, 1:2:4, and 1:3:6 by volume. The calculator uses a 1.54 dry-volume factor to derive ingredient volumes.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do you compute cement bags and water?</h3>
            <p className="text-slate-400">
              Cement volume (from mix split) is converted to mass using 1440 kg/m³, then divided by 50 kg/bag. Water = w/c × cement mass, reported in liters.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is cost estimation included?</h3>
            <p className="text-slate-400">
              Yes. Choose Rate per m³ or By Materials to get a quick cost; you control unit rates and bag price.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
