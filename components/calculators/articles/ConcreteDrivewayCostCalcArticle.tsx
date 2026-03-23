"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ConcreteDrivewayCostCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Complete Guide to Concrete Driveway Costs
        </h2>
        <p className="mb-4 leading-relaxed">
          Planning a new driveway requires precise volume estimation along with real-world cost calculations depending on delivery surcharges and supplier minimums.
        </p>
        <p className="mb-4 leading-relaxed">
          Our calculator handles these specific financial inputs, revealing transparent breakdowns between material overheads, delivery, and optional DIY bag estimates.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Driveway Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Transparent Cost Breakdown",
              desc: "See every line item — concrete material, delivery fees, short-load charges, and optional add-ons."
            },
            {
              title: "Real-World Delivery Handling",
              desc: "Built-in support for supplier constraints like short-load fees, minimum orders, and after-hours charges."
            },
            {
              title: "DIY vs. Professional",
              desc: "Compare Ready-Mix (truck delivery) with Bagged Concrete (DIY mixing)."
            },
            {
              title: "Thickness Guidance",
              desc: "Preset buttons for 4″, 5″, and 6″ slabs based on industry standards."
            },
            {
              title: "Smart Waste Allowance",
              desc: "Built-in 5–10% overage calculator ensures you don't run short during the pour."
            },
            {
              title: "Professional PDF Export",
              desc: "Generate a clean, printable summary of your project inputs and costs."
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
          How to Estimate Your Driveway Project
        </h2>
        <ol className="space-y-4">
          {[
            "Measure your driveway Length and Width in feet.",
            "Add any Extra Area for turnarounds, aprons, or widened sections.",
            "Select a Thickness — 4″ for most cars, 5″+ for heavier loads.",
            "Choose your Pricing Method: Ready-Mix for most driveways, Bagged for small repairs.",
            "Enter your local Price per yd³ (typically $120–$210) or Price per Bag.",
            "Optionally fill in Supplier Constraints and Add-ons.",
            "Click Calculate and save your PDF summary."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Use Our Concrete Driveway Cost Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Accurate financial planning for new driveways, replacements, extensions, and turnarounds.</li>
          <li>Handles real supplier constraints — short-load, minimum delivery, after-hours fees.</li>
          <li>Compare ready-mix vs. bagged concrete to see which option makes sense for your project size.</li>
          <li>Rounded order quantities (nearest 0.25 yd³) that match how suppliers actually sell concrete.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Calculation Formulas Behind the Tool</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Driveway Area & Volume</strong>
            Area (ft²) = (Length × Width) + Extra Area<br/>
            Volume (yd³) = Area × (Thickness (in) / 12) / 27
          </li>
          <li>
            <strong className="text-white block">2) Waste-Adjusted Volume</strong>
            Adjusted Volume = Raw Volume × Waste Factor (e.g. 1.05)
          </li>
          <li>
            <strong className="text-white block">3) Ready-Mix Cost</strong>
            Order Qty = CEIL(Volume / 0.25) × 0.25 (rounded to nearest quarter-yard)<br/>
            Concrete Cost = Billable yd³ × Price per yd³<br/>
            Total = Concrete + Delivery + Fees + Add-ons
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much does a concrete driveway cost?</h3>
            <p className="text-slate-400">
              In the US, a typical concrete driveway costs between $6 and $12 per square foot installed. A standard 40×12 ft driveway (480 sq ft) runs roughly $2,880–$5,760 including materials and labor.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How thick should a residential driveway be?</h3>
            <p className="text-slate-400">
              Most residential driveways are 4 inches thick. If your driveway sees delivery trucks, RVs, or heavier traffic, 5–6 inches is recommended.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What is a short-load fee?</h3>
            <p className="text-slate-400">
              A short-load fee is an extra charge applied when you order less concrete than the supplier&apos;s minimum threshold (often 3–5 yd³). This covers the cost of sending a partially loaded truck.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Is ready-mix or bagged concrete better for a driveway?</h3>
            <p className="text-slate-400">
              Ready-mix is almost always better. A typical 2-car driveway needs 5–7 cubic yards — that&apos;s over 200 bags of 80lb concrete to mix by hand.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
