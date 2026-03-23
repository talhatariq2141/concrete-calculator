"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ConcreteSlabLoadCapacityCalcArticle() {
  return (
    <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">
      
      {/* Introduction */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
          Engineering Guide: Slab Load Capacity Analysis
        </h2>
        <p className="mb-4 leading-relaxed">
          The load capacity of a concrete slab is not just about its thickness; it is a complex interaction between geometry, material strengths, and reinforcement detailing. For a <em>one-way suspended slab</em>, this tool analyzes a 12-inch wide strip as a shallow beam to derive structural limits.
        </p>
      </section>

      {/* Features Cards */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
          Key Technical Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Strength Design Basis",
              desc: "Employs ACI 318 Rectangular Section Analysis for flexural and shear strength checks, ensuring calculations adhere to modern structural principles."
            },
            {
              title: "LRFD Gravity Combinations",
              desc: "Calculates capacity using the 1.2D + 1.6L gravity combination, factoring in slab self-weight and superimposed dead loads automatically."
            },
            {
              title: "Governing Mode Detection",
              desc: "Automatically determines if Flexure or One-Way Shear governs the design, providing a deeper understanding of the slab's structural limitations."
            },
            {
              title: "Material Versatility",
              desc: "Supports variations in concrete strength (f'c), steel yield (fy), and concrete density, allowing for custom residential or industrial project analysis."
            },
            {
              title: "Serviceable Comparisons",
              desc: "Input your required occupancy live load (psf) and get an instant Pass/Fail status based on governed structural capacity."
            },
            {
              title: "1-Foot Strip Method",
              desc: "Standard engineering approach for one-way slab analysis, making the results easy to verify against traditional manual calculations."
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

      {/* Why Choose  */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">The Science of Slab Capacity</h2>
        <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
          <li><strong className="text-white">Flexural Strength:</strong> The ability of the tension reinforcement (rebar) to resist bending moments under downward loads.</li>
          <li><strong className="text-white">Shear Resistance:</strong> The capacity of the concrete section itself to resist being &apos;cut&apos; near the supports.</li>
          <li><strong className="text-white">Dead vs Live Load:</strong> Dead load remains constant (slab weight, finishes), while Live Load (occupants, furniture) is the variable capacity we seek to determine.</li>
          <li><strong className="text-white">Effective Depth (d):</strong> The distance from the top of the concrete to the center of the rebar; this factor is critical for mechanical advantage in bending.</li>
        </ul>
      </section>
      
      {/* Formulas Used */}
      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Structural Calculation Workflow</h2>
        <ul className="space-y-4 text-slate-400">
          <li>
            <strong className="text-white block">1) Flexural Capacity Equations</strong>
            a = (As × fy) / (0.85 × f&apos;c × b)<br/>
            Mn = As × fy × (d - a/2)<br/>
            wu_max = (8 × φMn) / L²<br/>
            <em>Note: ACI 318 Strength Design for Flexure</em>
          </li>
          <li>
            <strong className="text-white block">2) One-Way Shear Check</strong>
            φVc = 0.75 × 2 × sqrt(f&apos;c) × b × d<br/>
            wu_shear = (2 × φVc) / L<br/>
            <em>Note: Assume normal-weight concrete (λ=1.0)</em>
          </li>
          <li>
            <strong className="text-white block">3) Governing Logic</strong>
            Factored Capacity (wu_governing) = min(wu_flexure, wu_shear)<br/>
            Max Service Live Load (L_max) = (wu_governing - 1.2 × DeadLoad) / 1.6
          </li>
        </ul>
        <div className="mt-6 p-4 bg-red-900/10 border border-red-500/30 rounded-lg text-sm italic text-slate-400">
            <p className="font-bold text-red-400 mb-2 uppercase not-italic tracking-widest">⚠️ Engineering Limitation Notice</p>
            This calculator assumes the slab is adequately detailed for shrinkage, temperature, and fire rating requirements. It does not check for <span className="text-white">serviceability deflections</span>, which often govern slab design more strictly than strength. Use as a reference for preliminary sizing only.
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-teal-400" />
          <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What is the standard live load for residential floors?</h3>
            <p className="text-slate-400">
              Per ASCE 7, most residential living areas require a live load capacity of 40 psf, while sleeping areas require 30 psf. Public corridors or industrial spaces often require 100 psf or more.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">How does increasing rebar size affect capacity?</h3>
            <p className="text-slate-400">
              Generally, more steel (As) increases flexural capacity until the slab becomes &quot;over-reinforced.&quot; However, shear capacity is independent of rebar and depends almost entirely on slab thickness and concrete strength.
            </p>
          </div>

          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Why is the result in &quot;psf&quot; instead of total pounds?</h3>
            <p className="text-slate-400">
              Structural loads for floors are standardized in Pounds per Square Foot (psf) to allow engineers to apply load regardless of the total floor area. The internal math uses a 1-foot strip to derive this unit.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this calculator account for two-way slabs?</h3>
            <p className="text-slate-400">
              No. This tool is specific to one-way suspended slabs. Two-way slabs (piers/columns in a grid) involve complex punching shear and distribution factors not covered by this singular strip analysis.
            </p>
          </div>
          
          <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-lg text-slate-200 mb-2">What if my span is continuous?</h3>
            <p className="text-slate-400">
              Simply supported spans derive the highest moments and are the most &apos;conservative&apos; estimate. Continuous spans often have higher capacity but require specific ACI moment coefficients which are not currently integrated into this basic analysis tool.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
