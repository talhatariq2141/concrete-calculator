"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function GravelDrivewayCalculatorArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Driveway Gravel Quantities
        </h2>
        <p className="mb-4 leading-relaxed">
          Building or resurfacing a gravel driveway requires accurate material estimates to ensure a stable, long-lasting surface. This calculator takes the guesswork out of ordering the right amount of base rock and top gravel.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Features of the Driveway Gravel Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Driveway Material Estimation",
              desc: "Calculates gravel needed for driveway base or top layers."
            },
            {
              title: "Tons and Yards Output",
              desc: "Shows results in the most commonly used purchasing units."
            },
            {
              title: "Cost Planning",
              desc: "Estimates material budget for driveway gravel projects."
            },
            {
              title: "Waste Adjustment",
              desc: "Helps account for settling, compaction, and extra coverage."
            },
            {
              title: "Delivery Fee Support",
              desc: "Easily include your supplier's delivery fee into your total estimate."
            },
            {
              title: "Material Density Presets",
              desc: "Choose between general gravel, pea gravel, crushed stone, or use custom density."
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
          How to Use the Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select the Unit for your measurements (feet, inches, meters).",
            "Enter the Driveway Length and Width.",
            "Input the Gravel Layer Depth based on which layer you are calculating (e.g., base layer vs top layer).",
            "Select the Gravel Type or input a Custom Density for weight estimation.",
            "Add a Waste Factor (10% is standard) to account for gravel compacting and settling into the soil.",
            "(Optional) Input the Material Price and a Delivery Fee for total cost estimation.",
            "Click Calculate."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Calculation Formulas</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Volume Requirements</strong>
            Area = Length × Width<br/>
            Volume = Area × Depth<br/>
            Volume in Cubic Yards = Volume in Cubic Feet ÷ 27
          </li>
          <li>
            <strong className="text-white block">2) Tonnage Calculation</strong>
            Weight = Volume (Cubic Feet) × Material Density (lb/ft³)<br/>
            Tons = Weight (lbs) ÷ 2000
          </li>
          <li>
            <strong className="text-white block">3) Total Project Cost</strong>
            Material Cost = Estimated Tons × Price per Ton<br/>
            Total Cost = Material Cost + Delivery Fee<br/>
            <em>Note: If you buy by the cubic yard, substitute Estimated Tons with Estimated Cubic Yards.</em>
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much gravel do I need for my driveway?</h3>
            <p className="text-slate-400">
              It depends on the length and width of your driveway, and the depth of the gravel layers. Simply measure your driveway&apos;s footprint and enter the desired depth into our calculator to get an accurate estimate in tons and cubic yards.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How deep should gravel be for a driveway?</h3>
            <p className="text-slate-400">
              A typical gravel driveway consists of two main layers: a base layer of larger crushed stone (about 4 to 6 inches deep) and a top layer of smaller surface gravel (about 2 to 3 inches deep). You should calculate the material for each layer separately.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many tons of driveway gravel do I need?</h3>
            <p className="text-slate-400">
              Tonnage relies on the total volume in cubic feet and the density of your gravel. On average, a cubic yard of crushed stone driveway gravel weighs about 1.4 to 1.5 tons. Use our calculator to automate the math.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much does driveway gravel cost?</h3>
            <p className="text-slate-400">
              Depending on your region and the type of crushed stone or gravel, costs typically range from $25 to $65 per ton or $35 to $75 per cubic yard. Expect to pay extra for delivery.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What is the best gravel depth for a driveway base?</h3>
            <p className="text-slate-400">
              A strong driveway base usually requires 4 to 6 inches of larger crushed stone (like #3 or #4 stone) to provide a stable, well-draining foundation for the smaller top surface layer.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
