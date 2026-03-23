"use client";

import React from "react";
import { CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

export default function AquariumGravelCalculatorArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Estimate Aquarium Gravel Quantities
        </h2>
        <p className="mb-4 leading-relaxed">
          Traditional calculator math for aquariums suggests about <strong>1 to 1.5 pounds of gravel per gallon of water</strong>. However, that estimate breaks down for unusually shaped aquariums (like very tall cylinders or shallow frag tanks).
        </p>
        <p className="leading-relaxed">
          A much more accurate method is calculating the <strong>square area of the tank&apos;s footprint</strong> and multiplying it by your desired <strong>substrate depth</strong> to find the volume, then converting that volume to weight based on gravel density.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Calculator Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Tank Shape Support",
              desc: "Calculates substrate needed for Rectangular, Bow Front, and Cylinder tanks."
            },
            {
              title: "Variable Depth Control",
              desc: "Easily adjust for deeper plant beds, or shallower decorative coverage."
            },
            {
              title: "Weight Translations",
              desc: "Provides estimates in both Pounds (lbs) and Kilograms (kg) for easy purchasing universally."
            },
            {
              title: "Shopping Cart Math",
              desc: "Convert the total weight into exact number of bags needed (e.g., 5lb bags)."
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
            "Select the Unit (Inches or Centimeters).",
            "Select your Tank Shape (Rectangle, Bow Front, or Cylinder).",
            "Input the exact Tank Dimensions corresponding to your shape choice (e.g. Length and Width).",
            "Decide on your Desired Gravel Depth (typically 1.5 to 2.5 inches for a healthy ecosystem).",
            "Enter the Typical Bag Size you plan to buy (like 5 lb or 20 lb bags) so the calculator can tell you how many to grab.",
            "Click Calculate Amount to view your needs."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">The Mathematical Formula</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> Volume (Cubic Inches) = Bottom Area × Depth</li>
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> Weight (lbs) = Volume (Cubic Inches) × 0.0578 lb/in³</li>
          <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-teal-500"/> Total Bags = Weight (lbs) ÷ Bag Size</li>
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How deep should aquarium gravel be?</h3>
            <p className="text-slate-400">
              For a standard fish-only or artificial plant tank, 1.5 to 2 inches is ideal. It provides enough depth to hold decorations and beneficial bacteria without building up toxic gas pockets. For heavy planted tanks with root feeders, you may need 2.5 to 3 inches.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many pounds of gravel do I need for a 10 gallon tank?</h3>
            <p className="text-slate-400">
              A standard 10-gallon tank (20&quot; × 10&quot;) needs about 15 to 20 pounds of gravel to achieve a ~1.5 to 2 inch depth.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How many pounds of gravel per gallon?</h3>
            <p className="text-slate-400">
              As a general rule of thumb, most aquarists recommend 1 to 1.5 pounds of gravel per gallon of water for standard rectangular tanks.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does substrate type affect the weight?</h3>
            <p className="text-slate-400">
              Yes. Volcanic planted soils (like Fluval Stratum) are very lightweight and porous, so they weigh less per cubic inch than dense, solid epoxy-coated gravel or pure sand.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
