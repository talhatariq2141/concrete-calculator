"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function GravelCalculatorArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Gravel Quantity & Cost
        </h2>
        <p className="mb-4 leading-relaxed">
          Whether you are building a new driveway, laying a decorative mulch bed, or setting up a French drain, figuring out exactly how much gravel you need can be tricky. This calculator converts the dimensions of your project area into precise cubic yards and tons based on industry density standards.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Volume Estimation",
              desc: "Calculates gravel volume in cubic feet, cubic yards, and cubic meters."
            },
            {
              title: "Weight Conversion",
              desc: "Converts estimated gravel quantity into pounds, tons, and kilograms."
            },
            {
              title: "Density-Based Results",
              desc: "Uses gravel type or custom density for more realistic estimates."
            },
            {
              title: "Cost Estimation",
              desc: "Calculates total material cost from tons or cubic yards pricing."
            },
            {
              title: "Waste Factor Support",
              desc: "Adds extra material for installation waste and uneven coverage."
            },
            {
              title: "Multiple Shapes",
              desc: "Supports rectangular and optional circular or triangular project layouts."
            },
            {
              title: "US and Metric Units",
              desc: "Works with common American and metric measurement systems."
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
          How to Use This Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select your Project Shape (Rectangle, Circle, or Triangle) and Dimension Unit.",
            "Enter the Dimensions (Length and Width, or Radius, etc.) and Depth of your project area.",
            "Choose a Gravel Type for an approximate density, or select Custom Density.",
            "Enter a Waste Factor (usually 5% to 15%) to account for spills, settling, or uneven ground.",
            "(Optional) Enter the Price per Ton or Cubic Yard to calculate estimated material costs.",
            "Click Calculate to see the total volume, weight in tons and pounds, and total cost."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formula</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Area Calculation</strong>
            Rectangle: Area = Length × Width<br/>
            Circle: Area = π × Radius²<br/>
            Triangle: Area = (Base × Height) / 2
          </li>
          <li>
            <strong className="text-white block">2) Volume & Conversions</strong>
            Volume (cubic feet) = Area (sq ft) × Depth (ft)<br/>
            Volume (cubic yards) = Volume (cubic feet) ÷ 27
          </li>
          <li>
            <strong className="text-white block">3) Weight Estimation</strong>
            Weight (lbs) = Volume (cubic feet) × Density (lb/ft³)<br/>
            Weight (tons) = Weight (lbs) ÷ 2000
          </li>
          <li>
            <strong className="text-white block">4) Waste Factor Adjustment</strong>
            Adjusted Quantity = Base Quantity × (1 + Waste Percentage / 100)
          </li>
        </ul>
      </section>
      
      {/* Gravel Density Details */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Gravel Density and Weight Assumptions</h2>
        <p className="mb-4 text-slate-400">
            Because gravel types, size, and moisture content vary, the weight of gravel per cubic yard can also fluctuate. This calculator uses typical density values to estimate weight:
        </p>
        <ul className="list-disc pl-5 space-y-2 ms-2 text-slate-400">
            <li><strong>General Gravel:</strong> ~105 lb/ft³</li>
            <li><strong>Pea Gravel:</strong> ~100 lb/ft³</li>
            <li><strong>Crushed Stone:</strong> ~105 lb/ft³</li>
        </ul>
        <p className="mt-4 text-sm text-slate-400 italic">
            * Note: Actual density varies by stone type, moisture, and compaction. If you know the exact density from your supplier, select &quot;Custom Density&quot; to input it directly.
        </p>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-teal-400" />
          <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I calculate how much gravel I need?</h3>
            <p className="text-slate-400">
              Measure the length, width, and desired depth of your project. Multiply length by width to get the area, then multiply by the depth to get the volume. Use our Gravel Calculator to easily convert this into cubic yards and tons based on proper density.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many cubic yards of gravel do I need?</h3>
            <p className="text-slate-400">
              Once you know your volume in cubic feet, divide it by 27 to get cubic yards. A project area of 10 ft by 10 ft with a 3-inch depth needs approximately 0.93 cubic yards.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many tons of gravel do I need?</h3>
            <p className="text-slate-400">
              A cubic yard of typical gravel weighs about 1.4 to 1.5 tons (2,800 to 3,000 lbs). You calculate the tons needed by taking your cubic foot volume, multiplying it by the material&apos;s density (e.g., 105 lbs/ft³), and dividing by 2000.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How deep should gravel be for landscaping?</h3>
            <p className="text-slate-400">
              For most landscape beds and decorative coverage, a depth of 2 to 3 inches is recommended to prevent weed growth and provide solid coverage.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does gravel weight vary by type?</h3>
            <p className="text-slate-400">
              Yes. Smaller, smoother stones like pea gravel pack differently than angular crushed stone. Additionally, damp gravel will weigh more than dry gravel.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
