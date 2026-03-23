"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function CMUBlockCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          What is a CMU Block Calculator?
        </h2>
        <p className="mb-4 leading-relaxed">
          Our CMU Block Calculator is a precise estimating tool designed to help you determine exactly how many Concrete Masonry Units (CMUs) you need for a concrete block wall project. It calculates the net wall area by deducting openings (like windows and doors) and factors in a wastage allowance. 
        </p>
        <p className="leading-relaxed">
          Crucially, it doubles as a CMU Block Cost Calculator and a Cinder Block Cost Calculator, allowing you to estimate the total expense of your masonry project planning—from plain blocks to advanced add-ons like mortar, grout, labor, and delivery—all tailored for standard USA construction practice.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our CMU Block Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "CMU Block Quantity Estimation",
              desc: "Calculates exactly how many CMU blocks are needed based on your gross wall dimensions, block size, and net area."
            },
            {
              title: "CMU Block Cost Calculator",
              desc: "Computes the total cost of CMU blocks using your local price per block."
            },
            {
              title: "Openings Deduction",
              desc: "Subtracts windows, doors, vents, and other structural openings for a highly accurate estimate."
            },
            {
              title: "Waste Allowance",
              desc: "Adds a customizable extra block percentage for cuts, breakage, and jobsite waste."
            },
            {
              title: "Standard USA CMU Sizes",
              desc: "Supports common U.S. block sizes including 4&quot;, 6&quot;, 8&quot;, 10&quot;, and 12&quot; CMU widths."
            },
            {
              title: "Custom Block Size Support",
              desc: "Lets advanced users calculate with custom block face dimensions."
            },
            {
              title: "Advanced Cost Estimation",
              desc: "Optionally includes labor, delivery, grout, mortar, and reinforcement costs."
            },
            {
              title: "Contractor and DIY Friendly",
              desc: "Outputs a professional, easy-to-read printable summary containing all inputs and estimates."
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
          CMU Blocks: Nominal vs Actual Dimensions
        </h2>
        <ul className="space-y-4 text-slate-300">
          <li className="flex items-start gap-3">
             <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-teal-400"></div>
             <div><strong className="text-white">Standard Nominal Size:</strong> The industry standard is an 8x8x16 CMU block. This means it is 8 inches thick, 8 inches high, and 16 inches long including the mortar joint.</div>
          </li>
          <li className="flex items-start gap-3">
             <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-teal-400"></div>
             <div><strong className="text-white">Actual Size:</strong> The actual manufactured dimensions are approximately 3/8 inch less. So, an 8×8×16 nominal block actually measures about 7-5/8&quot; × 7-5/8&quot; × 15-5/8&quot;.</div>
          </li>
          <li className="flex items-start gap-3">
             <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-teal-400"></div>
             <div><strong className="text-white">Block Thickness vs Face Area:</strong> For standard 4&quot;, 6&quot;, 8&quot;, 10&quot;, and 12&quot; width CMU blocks, the face size (height and length) stays the same (8&quot; × 16&quot;). Therefore, the face coverage per block remains identical.</div>
          </li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the CMU Block Estimator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Net Wall Area & Openings</strong>
            Wall Area = Length × Height<br/>
            Net Wall Area = Total Wall Area − Openings Area
          </li>
          <li>
            <strong className="text-white block">2) Number of Blocks Needed</strong>
            Blocks Needed = Net Wall Area ÷ Block Face Area<br/>
            Blocks with Waste = Blocks Needed × (1 + Waste Percentage)
          </li>
          <li>
            <strong className="text-white block">3) The Standard 8x8x16 CMU Rule</strong>
            One standard modular CMU block covers about 0.8889 sq ft.<br/>
            Approximate blocks needed = Net Wall Area × 1.125.<br/>
            Approximate blocks needed per 100 sq ft = 112.5 blocks.
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What does CMU stand for in construction?</h3>
            <p className="text-slate-400">
              CMU stands for Concrete Masonry Unit. While often called cinder blocks or concrete blocks, CMU is the proper technical term used by masons, engineers, and architects.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many CMU blocks do I need for a wall?</h3>
            <p className="text-slate-400">
              To find the number of blocks needed, calculate your net wall area in square feet and multiply by 1.125 (for standard 8x16 face blocks). Add a percentage for waste (usually 5% to 10%) and round up to the nearest whole block.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How do I calculate CMU block cost?</h3>
            <p className="text-slate-400">
              Multiply your final block count (including waste allowance) by your local cost per block. Use our advanced cost inputs to add mortar, labor, and delivery to estimate the fully installed wall cost.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How much waste should I add when ordering CMU blocks?</h3>
            <p className="text-slate-400">
              We recommend adding at least 10% waste for standard projects to account for cuts around edges/openings and accidental breakage. For highly complex walls, 15% is safer.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does block thickness affect wall face coverage?</h3>
            <p className="text-slate-400">
              No. Whether you use a 4&quot;, 6&quot;, 8&quot;, 10&quot;, or 12&quot; thick CMU block, the front face (height and length) is almost always nominally 8&quot; x 16&quot;. The coverage rate of 1.125 blocks per square foot remains exactly the same.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
