"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function PostHoleConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Calculate Concrete for Post Holes
        </h2>
        <p className="mb-4 leading-relaxed">
          Whether setting fence posts, deck footings, or a mailbox, knowing the exact amount of concrete per hole prevents costly material runs and guarantees structural stability. Our Post Hole Calculator provides fast, accurate volume sizing alongside bag estimates for DIY projects and contractors alike.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Post Hole Estimator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Accurate Concrete Volume",
              desc: "Calculates concrete volume for round and square post holes using precise cylindrical and rectangular geometry."
            },
            {
              title: "Net Concrete Estimate",
              desc: "Subtracts post displacement from the hole volume for a more accurate material estimate, reducing waste."
            },
            {
              title: "Bag Count Calculator",
              desc: "Converts total concrete volume into estimated 40 lb, 60 lb, and 80 lb concrete bag counts."
            },
            {
              title: "Gravel Base Estimator",
              desc: "Estimates how much gravel is needed for a drainage base below each post hole, improving stability."
            },
            {
              title: "Smart Hole Size Recommendations",
              desc: "Suggests hole diameter and embedment depth based on post size, post type, and frost depth rules."
            },
            {
              title: "Waste & Cost Adjustment",
              desc: "Adds customizable waste allowance to avoid running short and estimates total project cost."
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
          How to Use the Post Hole Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Choose your Calculator Mode — Quick Estimate, Advanced, or Recommendation.",
            "Select the hole shape (round or square) and enter hole diameter/width and hole depth.",
            "Enter the number of post holes for your project.",
            "Toggle the gravel base option and set gravel depth (typically 4–6 inches).",
            "(Advanced) Enter post dimensions for more accurate results with post displacement subtraction.",
            "Select bag size or enter a custom yield per bag.",
            "Click Calculate to view volume, bag counts, gravel, and cost estimates."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Post Hole Formulas</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Round Hole Volume (Cylinder)</strong>
            Volume = π × (Diameter / 2)² × Concrete Fill Depth<br/>
            <em>Concrete Fill Depth = Hole Depth − Gravel Depth</em>
          </li>
          <li>
            <strong className="text-white block">2) Square / Rectangular Hole Volume</strong>
            Volume = Width × Length × Concrete Fill Depth
          </li>
          <li>
            <strong className="text-white block">3) Post Displacement (Optional)</strong>
            Round post: V = π × (Post Diameter / 2)² × Embedded Depth<br/>
            Square post: V = Post Width × Post Length × Embedded Depth
          </li>
          <li>
            <strong className="text-white block">4) Waste & Bags</strong>
            Adjusted Volume = Total Volume × (1 + Waste% / 100)<br/>
            Bags = ⌈Adjusted Volume / Yield Per Bag⌉
          </li>
          <li>
            <strong className="text-white block">5) Recommendation Engine</strong>
            Recommended Hole Diameter = 3 × Post Width<br/>
            Recommended Embed Depth = max(Post Length / 3, Frost Depth)
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many bags of concrete do I need per fence post?</h3>
            <p className="text-slate-400">
              The number of bags depends on the size of the hole and the yield of the selected concrete mix. For a typical 4×4 fence post in a 10-inch diameter hole 36 inches deep, you&apos;ll need about 2–3 bags of 80 lb concrete.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Should I put gravel at the bottom of a post hole?</h3>
            <p className="text-slate-400">
              A gravel base of 4 to 6 inches is commonly used to improve drainage and provide a stable foundation at the bottom of the hole. Our calculator includes an optional gravel base estimator.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How deep should a post hole be?</h3>
            <p className="text-slate-400">
              A common starting rule is to bury about one-third of the total post length below grade, but local frost depth, soil conditions, and post type can affect the final depth. Use our Recommendation mode for guidance.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How wide should a post hole be?</h3>
            <p className="text-slate-400">
              A common rule of thumb is to make the hole about three times the width or diameter of the post. For a 4×4 post (3.5 inches actual), that means roughly a 10-inch diameter hole.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Should gate posts use more concrete than line posts?</h3>
            <p className="text-slate-400">
              Yes. Gate posts typically carry more load and swing forces, so they often require larger holes, deeper embedment, and more concrete than standard line posts.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
