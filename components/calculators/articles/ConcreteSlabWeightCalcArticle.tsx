"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function ConcreteSlabWeightCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Guide to Calculating Concrete Slab Weight
        </h2>
        <p className="mb-4 leading-relaxed">
          Determining the precise weight of a concrete slab is critical for logistical planning, structural engineering, and haul-away estimations. This tool converts simple dimensional inputs into accurate pound and ton limits using established industry density standards.
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
              title: "Precision Weight Distribution",
              desc: "Calculate exact project load in pounds and tons based on verified engineering densities for standard, reinforced, and lightweight concrete."
            },
            {
              title: "Density Presets",
              desc: "Built-in presets (150 lb/ft³ for standard, 156 lb/ft³ for reinforced) save time, while custom inputs allow for specific material variations."
            },
            {
              title: "Multi-Dimensional Support",
              desc: "Easily input dimensions in feet or inches and toggle units dynamically to match your blueprints or field measurements."
            },
            {
              title: "Bulk Load Estimates",
              desc: "Estimate the weight for single or multiple slabs simultaneously—essential for transportation logistics and structural planning."
            },
            {
              title: "Unit Coalescence",
              desc: "Internal conversion engine seamlessly handles the math between cubic yards, cubic feet, and imperial weight units."
            },
            {
              title: "Ready-to-Print Estimates",
              desc: "Generate professional PDF weight summaries to share with logistics teams, engineers, or structural contractors."
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
          Step-by-Step Weight Calculation
        </h2>
        <ol className="space-y-4">
          {[
            "Find the total volume by multiplying Length × Width × Thickness (convert all to feet first).",
            "Select the concrete density (150 lb/ft³ is standard for most residential pours).",
            "Multiply Volume (ft³) × Density (lb/ft³) to get the total weight in pounds.",
            "Divide by 2,000 to convert the results into short tons.",
            "Always account for internal reinforcements like rebar, which can increase the total weight by 3-5%."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Slab Weight Matters in Construction</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li><strong>Structural Integrity:</strong> Ensuring the sub-base, deck, or supporting structure can handle the dead load of the cured slab.</li>
          <li><strong>Logistics & Transport:</strong> Determining if a specific truck or trailer can safely haul pre-cast or wet mix components.</li>
          <li><strong>Formwork Design:</strong> Calculating the lateral and vertical pressure exerted on forms during the pour.</li>
          <li><strong>Project Costing:</strong> Weight is often linked to the volume and density of materials ordered from suppliers.</li>
          <li><strong>Permitting & Compliance:</strong> Adhering to local building codes that specify minimum or maximum weights for certain residential structures.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">The Math Behind the Weight</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Area & Volume</strong>
            Surface Area = Length × Width<br/>
            Volume (ft³) = Surface Area × Thickness (conv. to ft)
          </li>
          <li>
            <strong className="text-white block">2) Weight Equations</strong>
            Total Weight (lb) = Volume (ft³) × Density (lb/ft³)<br/>
            Weight (Tons) = lb / 2000<br/>
            <em>Note: 1 cubic yard of standard concrete (27 ft³) weighs approximately 4,050 lbs (2.025 tons).</em>
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much does a 20x20 concrete slab weigh?</h3>
            <p className="text-slate-400">
              A standard 4-inch thick 20x20 slab has a volume of 133.33 ft³. Using standard concrete (150 lb/ft³), it weighs approximately 20,000 lbs, or 10 short tons. Reinforced slabs will weigh slightly more due to steel content.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What is the difference between wet and dry concrete weight?</h3>
            <p className="text-slate-400">
              Wet concrete is slightly heavier than dry concrete due to its water content. As concrete cures (hydrates), it retains much of that weight as chemically bound water, although some evaporation occurs. Structural calculations usually design for the 'dead load' of cured concrete.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How heavy is reinforced concrete relative to regular concrete?</h3>
            <p className="text-slate-400">
              Reinforced concrete is typically calculated at 156 lb/ft³, roughly 4% heavier than standard unreinforced concrete. This accounts for the high density of steel rebar or mesh embedded within the slab.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does the slab thickness affect the density?</h3>
            <p className="text-slate-400">
              No, density is a material property (lb per cubic foot). However, thicker slabs result in higher volume, which directly increases the total weight proportionally.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I use this for pre-cast concrete sections?</h3>
            <p className="text-slate-400">
              Yes. As long as you know the dimensions and the specific density of the pre-cast mix (which is often higher due to compaction), this calculator will provide an accurate weight for lifting and transport planning.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
