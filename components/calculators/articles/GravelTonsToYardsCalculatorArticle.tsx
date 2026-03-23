"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function GravelTonsToYardsCalculatorArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Converting Between Tons and Yards
        </h2>
        <p className="mb-4 leading-relaxed">
          The landscaping industry frequently switches between selling bulk material by volume (cubic yards) and by weight (tons). To convert between the two, you must know the material&apos;s density. This conversion tool bridges that gap seamlessly with built-in material densities.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Features of this Converter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Bi-Directional Conversion",
              desc: "Easily swap between translating Tons to Yards, or Yards to Tons."
            },
            {
              title: "Material Exactness",
              desc: "Conversion relies on accurate densities rather than rough averages."
            },
            {
              title: "Density Presets",
              desc: "Quickly choose between general gravel, pea gravel, and crushed stone."
            },
            {
              title: "Custom Density Control",
              desc: "Input your own material&apos;s exact density if provided by your local supplier."
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
          How to Convert Tons to Yards (and vice-versa)
        </h2>
        <ol className="space-y-4">
          {[
            "Select the Conversion Mode by clicking the swap arrow button. Decide whether you are starting with &quot;Tons&quot; or &quot;Yards&quot;.",
            "Input the Quantity you need to convert.",
            "Select the Gravel Type. This adjusts the density (weight-per-volume) that drives the conversion formula.",
            "(Optional) If you know the exact weight of your gravel, select &quot;Custom Density&quot; and enter its weight in lb/ft³.",
            "Click Convert to seamlessly translate the measurement."
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

      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Understanding the Math</h2>
        <p className="mb-4 text-slate-400">
          You cannot convert volume (Cubic Yards) directly to weight (Tons) without knowing the <strong>Density</strong> of the material. Different gravel types pack differently. For example, General Gravel is usually around 105 pounds per cubic foot.
        </p>
        <ul className="space-y-4 text-slate-400 mt-4">
          <li>
            <strong className="text-white block">Calculating Tons per Cubic Yard</strong>
            1 Cubic Yard = 27 Cubic Feet<br/>
            Weight of 1 Cubic Yard (lbs) = 27 × Density (lb/ft³)<br/>
            Tons per Cubic Yard = Weight of 1 Cubic Yard (lbs) ÷ 2000
          </li>
          <li>
            <strong className="text-white block">Tons to Yards Conversion</strong>
            Yards = Input Tons ÷ Tons per Cubic Yard
          </li>
          <li>
            <strong className="text-white block">Yards to Tons Conversion</strong>
            Tons = Input Yards × Tons per Cubic Yard
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many tons are in a cubic yard of gravel?</h3>
            <p className="text-slate-400">
              On average, a cubic yard of standard gravel weighs roughly 1.4 tons (2,800 lbs). However, this can range between 1.3 and 1.5 tons depending on stone type, rock size, and moisture content.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is gravel sold by the ton or by the yard?</h3>
            <p className="text-slate-400">
              It depends entirely on your local supplier. Some landscape yards sell by volume (the cubic yard bucket of their loader), while commercial quarries often weigh trucks on a scale and sell strictly by the ton.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Why does gravel type matter for conversion?</h3>
            <p className="text-slate-400">
              Since a ton is a measure of weight and a yard is a measure of space, you must know how &apos;heavy&apos; the gravel is to convert them. Dense, solid crushed stone will yield fewer yards out of one ton than lighter volcanic rock or mulch.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many yards is 5 tons of gravel?</h3>
            <p className="text-slate-400">
              Assuming typical gravel at 1.4 tons per yard: 5 tons divided by 1.4 equals approximately 3.57 cubic yards.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
