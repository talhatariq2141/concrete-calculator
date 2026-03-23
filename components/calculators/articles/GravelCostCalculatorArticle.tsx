"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function GravelCostCalculatorArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Guide to Estimating Gravel Costs
        </h2>
        <p className="mb-4 leading-relaxed">
          Determining the cost of gravel for your project doesn't have to be a guessing game. Whether you are laying a driveway or filling a landscape bed, our Gravel Cost Estimator helps you calculate exactly how much volume you need and what the final invoice might look like—including delivery fees.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Features of the Cost Estimator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Dimensional Costing",
              desc: "Estimate cost directly from your project's length, width, and depth."
            },
            {
              title: "Known Quantity Costing",
              desc: "Already know how many tons or yards you need? Jump straight to price mapping."
            },
            {
              title: "Delivery Included",
              desc: "Add your local supplier's delivery fee to visualize the true final invoice."
            },
            {
              title: "Smart Inter-Conversions",
              desc: "If you need 10 yards, but your supplier charges per ton, this calculator automatically bridges the gap using density."
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
          How to Estimate Gravel Costs
        </h2>
        <ol className="space-y-4">
          {[
            "Choose your input method using the tabs: Calculate from Dimensions OR Enter Known Quantity.",
            "If using Dimensions, enter your Length, Width, Depth, and an optional Waste Factor.",
            "If using Known Quantity, enter the number of Tons or Yards you plan to buy.",
            "In the Pricing section, enter your supplier's Price and select whether they charge per Ton or per Yard.",
            "Select the correct Gravel Density Type (this is mandatory if the input metric and pricing metric don't match, to allow for weight-to-volume math).",
            "Click Calculate Free Estimate."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">How Cost is Calculated</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Volume-to-Weight Conversion</strong>
            If your dimensions yield cubic yards but your supplier prices by the ton, the tool multiplies the cubic yards by the selected gravel density to find total tons before applying the price.
          </li>
          <li>
            <strong className="text-white block">2) Waste Inclusion</strong>
            Cost naturally includes any waste % you add, so your estimate reflects the actual purchasing requirement, not just theoretical exact volume.
          </li>
          <li>
            <strong className="text-white block">3) Total Invoice</strong>
            Material Cost = (Tons or Yards) × Unit Price<br/>
            Total Project Cost = Material Cost + Delivery Fee
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much does gravel cost?</h3>
            <p className="text-slate-400">
              Depending on region and the type of crushed stone or landscaping gravel, expect to pay anywhere from $25 to $65 per ton, or $35 to $75 per cubic yard when buying in bulk.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is it cheaper to buy gravel by the ton or by the yard?</h3>
            <p className="text-slate-400">
              Neither is inherently 'cheaper'—they are just different measurement systems. Commercial quarries generally sell by the ton because they weigh trucks on scales. Local landscape yards often sell by the yard (volume) utilizing a front-end loader scoop. This calculator helps you compare quotes across both methods seamlessly.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much is delivery for gravel?</h3>
            <p className="text-slate-400">
              Most local suppliers charge a flat delivery drop fee ranging from $75 to $150 depending on distance from their facility to your house.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Why do I need to enter a gravel type?</h3>
            <p className="text-slate-400">
              If you enter dimensions (which creates a Volume in yards) but your gravel supplier charges by Weight (Tons), the calculator needs to know the material density (how heavy it is) to translate your volume requirement into the correct ton-based price quote.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
