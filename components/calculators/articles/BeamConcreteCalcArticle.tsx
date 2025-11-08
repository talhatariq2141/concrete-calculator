"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ruler, Calculator as CalcIcon, Clock, Layers, Scale, ClipboardList } from "lucide-react";

export default function BeamConcreteCalcArticle() {
  // --- collapse/expand state + height animation (identical to Slab article) ---
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      if (open) {
        el.style.height = "auto";
        const full = el.scrollHeight;
        setHeight(full);
        requestAnimationFrame(() => {
          el.style.height = `${full}px`;
        });
      } else {
        setHeight(0);
        el.style.height = `0px`;
      }
    };

    measure();
    const onResize = () => {
      if (!open) return;
      el.style.height = "auto";
      const full = el.scrollHeight;
      setHeight(full);
      el.style.height = `${full}px`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== "height") return;
      if (open) el.style.height = "auto";
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [open]);

  return (
    <section className="mt-10 w-full mx-auto max-w-8xl text-slate-200 font-poppins">
      {/* top-right toggle button (same UI) */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="beam-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* collapsible wrapper */}
      <div
        id="beam-article-collapse"
        ref={wrapperRef}
        className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[10000px]"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* --- ARTICLE CONTENT STARTS --- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Beam Concrete Calculator
        </h2>

        {/* Feature cards (identical layout) */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Multi-Unit Inputs"
            desc="Enter length (L), breadth/width (b), and depth/height (d) in meters, centimeters, millimeters, yards, feet, or inches. All conversions are handled automatically."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Per-Beam & Total Results"
            desc="Get volume per beam and totals for multiple beams in m³, with quick conversions to ft³ and yd³ for ordering."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Subtract Voids / Ducts"
            desc="Optional uniform void (length × width × depth) subtraction per beam for ducts or recesses."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="Waste & Dry Volume"
            desc="Apply a waste/overage percentage and (optionally) a dry volume factor (e.g., 1.50–1.54) for material planning."
          />
          <FeatureCard
            icon={<Clock className="h-5 w-5" />}
            title="Guided Workflow"
            desc="Results appear after Calculate, keeping the form focused and reducing accidental reads."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Print / Save Sheet"
            desc="Export a clean A4-style printable summary with inputs, per-beam values, totals, and yardage helpers."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">Why Choose Our Free Beam Calculator?</h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Accurate net volume with optional void subtraction and precise unit conversions.</WhyItem>
            <WhyItem>Supports waste allowance and optional dry factor for mix planning and procurement.</WhyItem>
            <WhyItem>Handles multiple beams in one go — see per-beam and project totals instantly.</WhyItem>
            <WhyItem>Quick yd³ and ft³ conversions for ready-mix ordering and supplier coordination.</WhyItem>
            <WhyItem>Simple print/save workflow to document calculations for submittals or site records.</WhyItem>
          </ul>
        </div>

        {/* H4 How-to */}
        <h4
          id="how-to-use"
          className="text-lg font-semibold text-white mt-12 mb-3"
        >
          How to Use the Beam Concrete Calculator
        </h4>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select your <span className="text-white">Units</span> and enter the <span className="text-white">Number of Beams</span>.</li>
            <li>Enter beam dimensions: <span className="text-white">Length (L)</span>, <span className="text-white">Breadth/Width (b)</span>, and <span className="text-white">Depth/Height (d)</span>.</li>
            <li>(Optional) Toggle <span className="text-white">Subtract a void</span> and provide void <span className="text-white">Width</span>, <span className="text-white">Depth</span>, and <span className="text-white">Length</span>.</li>
            <li>(Optional) Add <span className="text-white">Waste %</span> and enable <span className="text-white">Dry Volume Factor</span> if you want material estimates beyond wet volume.</li>
            <li>Press <span className="text-white">Calculate</span> to reveal results: per-beam, totals, and quick yd³/ft³ conversions.</li>
            <li>Use <span className="text-white">Print / Save Calculations</span> to export a neat summary for records.</li>
          </ol>
        </div>

        {/* Formulas Used */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">Formulas Used in the Calculator</h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Beam Volume (per beam)"
            lines={[
              "Gross Volume = L × b × d",
              "Void Volume (optional) = L_void × b_void × d_void",
              "Wet Volume (net) = Gross Volume − Void Volume",
            ]}
            note="All dimensions are converted to a common base unit (meters or feet internally) before multiplication to avoid unit mismatch."
          />
          <FormulaBlock
            title="2) Waste & Dry Factor"
            lines={[
              "Wet + Waste = Wet Volume × (1 + Waste%)",
              "Dry Volume (if enabled) = (Wet + Waste) × DryFactor",
            ]}
            note="Typical dry factor for concrete constituents is ~1.50–1.54 depending on mix and site practice."
          />
          <FormulaBlock
            title="3) Multi-Beam Totals"
            lines={["Total = Per-Beam × Quantity (number of beams)"]}
          />
          <FormulaBlock
            title="4) Unit Conversions (display)"
            lines={[
              "1 m³ = 35.3147 ft³",
              "1 m³ = 1.30795 yd³",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">Frequently Asked Questions</h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Do all inputs need to be in the same unit?"
            a="Yes. Choose one unit system (e.g., feet or meters) and enter all beam and void dimensions in that unit. The calculator then converts consistently for volume."
          />
          <FAQ
            q="How does the void option affect results?"
            a="When enabled, the uniform void volume (length × width × depth) is subtracted from each beam before applying waste and dry factors."
          />
          <FAQ
            q="What waste percentage should I use for beams?"
            a="A 5–10% allowance is common, but congested reinforcement, pump line losses, or difficult placement may warrant more. Follow your project’s practice."
          />
          <FAQ
            q="What is the dry volume factor?"
            a="An optional multiplier (often ~1.50–1.54) used for material proportioning beyond wet concrete volume. Enable it if you’re estimating material quantities."
          />
          <FAQ
            q="Can I calculate multiple beams at once?"
            a="Yes. Enter the number of beams and the tool will compute per-beam and total volumes automatically."
          />
          <FAQ
            q="Does this calculator specify reinforcement or mix design?"
            a="No. It focuses on concrete volume. Reinforcement, cover, and mix grade must follow structural drawings and local codes."
          />
          <FAQ
            q="Can I export or print the results?"
            a="Use the Print / Save button in the calculator to generate a clean A4-style summary with inputs and results."
          />
        </div>

        {/* --- ARTICLE CONTENT ENDS --- */}
      </div>
    </section>
  );
}

/* ---------- Reusable UI bits (identical to Slab article) ---------- */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg bg-slate-900/60 border border-slate-700 p-5">
      <div className="flex items-center gap-2 text-teal-400 mb-2">
        {icon}
        <span className="font-semibold text-slate-300 text-base">{title}</span>
      </div>
      <p className="text-sm text-slate-300">{desc}</p>
    </div>
  );
}

function WhyItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-teal-400" />
      <span>{children}</span>
    </li>
  );
}

function FormulaBlock({
  title,
  lines,
  note,
}: {
  title: string;
  lines: string[];
  note?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-white font-medium mb-2">
        <CheckCircle2 className="h-4 w-4 text-teal-400" />
        <span>{title}</span>
      </div>
      <ul className="list-disc list-inside text-slate-300">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      {note ? <p className="text-xs text-slate-400 mt-2">{note}</p> : null}
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-slate-800 pb-4 last:border-0">
      <p className="font-medium text-white">{q}</p>
      <p className="text-slate-300 mt-1">{a}</p>
    </div>
  );
}
