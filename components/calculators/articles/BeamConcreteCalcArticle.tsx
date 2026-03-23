"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function BeamConcreteCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          How to Estimate Concrete for Beams
        </h2>
        <p className="mb-4 leading-relaxed">
          Accurate net volume estimation for concrete beams is essential for avoiding shortage or massive over-ordering on your projects. This involves getting the exact dimensions while optionally subtracting voids that run through them for ductwork or pipes.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Features of Our Free Beam Concrete Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Multi-Unit Inputs",
              desc: "Enter length (L), breadth/width (b), and depth/height (d) in meters, centimeters, millimeters, yards, feet, or inches."
            },
            {
              title: "Per-Beam & Total Results",
              desc: "Get volume per beam and totals for multiple beams in m³, with quick conversions to ft³ and yd³ for ordering."
            },
            {
              title: "Subtract Voids / Ducts",
              desc: "Optional uniform void (length × width × depth) subtraction per beam for ducts or recesses."
            },
            {
              title: "Waste & Dry Volume",
              desc: "Apply a waste/overage percentage and (optionally) a dry volume factor (e.g., 1.50–1.54) for material planning."
            },
            {
              title: "Guided Workflow",
              desc: "Results appear after Calculate, keeping the form focused and reducing accidental reads."
            },
            {
              title: "Print / Save Sheet",
              desc: "Export a clean A4-style printable summary with inputs, per-beam values, totals, and yardage helpers."
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
          How to Use the Beam Concrete Calculator
        </h2>
        <ol className="space-y-4">
          {[
            "Select your Units and enter the Number of Beams.",
            "Enter beam dimensions: Length (L), Breadth/Width (b), and Depth/Height (d).",
            "(Optional) Toggle Subtract a void and provide void Width, Depth, and Length.",
            "(Optional) Add Waste % and enable Dry Volume Factor if you want material estimates beyond wet volume.",
            "Press Calculate to reveal results: per-beam, totals, and quick yd³/ft³ conversions.",
            "Use Print / Save Calculations to export a neat summary for records."
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
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Free Beam Calculator?</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li>Accurate net volume with optional void subtraction and precise unit conversions.</li>
          <li>Supports waste allowance and optional dry factor for mix planning and procurement.</li>
          <li>Handles multiple beams in one go — see per-beam and project totals instantly.</li>
          <li>Quick yd³ and ft³ conversions for ready-mix ordering and supplier coordination.</li>
          <li>Simple print/save workflow to document calculations for submittals or site records.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Beam Volume (per beam)</strong>
            Gross Volume = L × b × d<br/>
            Void Volume (optional) = L_void × b_void × d_void<br/>
            Wet Volume (net) = Gross Volume − Void Volume
          </li>
          <li>
            <strong className="text-white block">2) Waste & Dry Factor</strong>
            Wet + Waste = Wet Volume × (1 + Waste%)<br/>
            Dry Volume (if enabled) = (Wet + Waste) × DryFactor
          </li>
          <li>
            <strong className="text-white block">3) Multi-Beam Totals</strong>
            Total = Per-Beam × Quantity (number of beams)
          </li>
          <li>
            <strong className="text-white block">4) Unit Conversions (display)</strong>
            1 m³ = 35.3147 ft³<br/>
            1 m³ = 1.30795 yd³
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
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Do all inputs need to be in the same unit?</h3>
            <p className="text-slate-400">
              Yes. Choose one unit system (e.g., feet or meters) and enter all beam and void dimensions in that unit. The calculator then converts consistently for volume.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How does the void option affect results?</h3>
            <p className="text-slate-400">
              When enabled, the uniform void volume (length × width × depth) is subtracted from each beam before applying waste and dry factors.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What waste percentage should I use for beams?</h3>
            <p className="text-slate-400">
              A 5–10% allowance is common, but congested reinforcement, pump line losses, or difficult placement may warrant more. Follow your project&apos;s practice.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What is the dry volume factor?</h3>
            <p className="text-slate-400">
              An optional multiplier (often ~1.50–1.54) used for material proportioning beyond wet concrete volume. Enable it if you&apos;re estimating material quantities.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this calculator specify reinforcement or mix design?</h3>
            <p className="text-slate-400">
              No. It focuses on concrete volume. Reinforcement, cover, and mix grade must follow structural drawings and local codes.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
