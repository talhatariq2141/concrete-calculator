"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Layers,
  Droplets,
  Package,
  ClipboardList,
  FlaskConical,
  Gauge,
} from "lucide-react";

export default function NominalMixConcreteCalcArticle() {
  // --- collapse/expand (same mechanism as your approved articles) ---
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
    <section className="mt-8 w-full mx-auto max-w-8xl text-slate-200 font-poppins">
      {/* Top-right toggle button */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="nominalmix-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="nominalmix-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Nominal Mix (M5–M25) Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Gauge className="h-5 w-5" />}
            title="Grade Presets (M5–M25)"
            desc="Built-in mix ratios with typical default w/c for each grade (e.g., M20 → 1:1.5:3, w/c ≈ 0.50)."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Volume in m³ / ft³ / yd³"
            desc="Enter project volume in your preferred unit. The calculator converts internally for accurate results."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Dry Volume & Wastage"
            desc="Applies a dry volume factor (e.g., 1.50–1.57) and your wastage % to arrive at field-ready quantities."
          />
          <FeatureCard
            icon={<Package className="h-5 w-5" />}
            title="Bag Calculator"
            desc="Choose your bag size (e.g., 50 kg) to see total cement bags required for the batch."
          />
          <FeatureCard
            icon={<FlaskConical className="h-5 w-5" />}
            title="Editable Densities"
            desc="Tune bulk densities for cement, sand, and aggregate (kg/m³) to match local materials."
          />
          <FeatureCard
            icon={<Droplets className="h-5 w-5" />}
            title="W/C & Moisture Corrections"
            desc="Override w/c, include sand/aggregate moisture, and see adjusted water and material masses."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Gated Results + Yardage Helper"
            desc="Results appear after Calculate, with yd³ quick helpers (+5% / +10%) for ordering."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Print / Save Sheet"
            desc="Export a clean, A4-friendly summary of inputs, materials, and yardage for records."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Nominal Mix Concrete Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Fast material splits from grade presets M5–M25 with editable factors.</WhyItem>
            <WhyItem>Accurate, consistent unit handling across m³, ft³, and yd³.</WhyItem>
            <WhyItem>Includes real-world allowances: dry factor, wastage, and moisture.</WhyItem>
            <WhyItem>Bag count, adjusted water, and yd³ helpers streamline ordering.</WhyItem>
            <WhyItem>Printable summary for purchase orders and site documentation.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4
          id="how-to-use"
          className="text-lg font-semibold text-white mt-12 mb-3"
        >
          How to Use the Nominal Mix M5–M25 Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select the <span className="text-white">Grade (M5–M25)</span> to load its ratio and default w/c.</li>
          <li>Enter your <span className="text-white">Volume</span> and choose the unit (<strong>m³</strong>, <strong>ft³</strong>, or <strong>yd³</strong>).</li>
          <li>(Optional) Adjust <span className="text-white">Dry Volume Factor</span>, <span className="text-white">Wastage %</span>, and <span className="text-white">Bag Size (kg)</span>.</li>
          <li>(Optional) Edit <span className="text-white">bulk densities</span> and <span className="text-white">moisture %</span> for sand/aggregate; override <span className="text-white">w/c</span> if needed.</li>
          <li>Click <span className="text-white">Calculate</span> to reveal cement bags, adjusted materials, water, and volumes.</li>
          <li>Use the <span className="text-white">Cubic Yards helper</span> (+5% / +10%) and <span className="text-white">Print / Save</span> to finalize ordering.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Dry Volume & Wastage"
            lines={[
              "V_input (m³) = convert(volume, unit → m³)",
              "V_dry = V_input × DryFactor",
              "V_dry+waste = V_dry × (1 + Wastage%)",
            ]}
            note="Typical DryFactor is 1.50–1.57 for volume batching; Wastage often 2–10% based on site practice."
          />
          <FormulaBlock
            title="2) Material Split (by parts)"
            lines={[
              "PartsSum = Cement + Sand + Aggregate",
              "Vol_cem = (Cement/PartsSum) × V_dry+waste",
              "Vol_sand = (Sand/PartsSum) × V_dry+waste",
              "Vol_agg = (Aggregate/PartsSum) × V_dry+waste",
            ]}
            note="Grade presets (e.g., M20 = 1:1.5:3) define Cement:Sand:Aggregate."
          />
          <FormulaBlock
            title="3) Masses & Bags"
            lines={[
              "Mass_cem (kg) = Vol_cem × ρ_cement",
              "Mass_sand (kg) = Vol_sand × ρ_sand",
              "Mass_agg (kg) = Vol_agg × ρ_aggregate",
              "Bags = Mass_cem / BagSizeKg",
            ]}
          />
          <FormulaBlock
            title="4) Water & Moisture Adjustment"
            lines={[
              "Water_theoretical (kg) = (w/c) × Mass_cem",
              "AddedWater_from_sand = (MoistSand%/100) × Mass_sand",
              "AddedWater_from_agg = (MoistAgg%/100) × Mass_agg",
              "Water_adjusted = max(Water_theoretical − AddedWater_total, 0)",
            ]}
          />
          <FormulaBlock
            title="5) Display Conversions"
            lines={["ft³ = m³ × 35.3147", "yd³ = m³ × 1.30795"]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="What’s the difference between nominal and design mix?"
            a="Nominal mix uses standard ratios (M5–M25) for routine work; design mix is laboratory-designed to meet a target strength and workability."
          />
          <FAQ
            q="Which dry volume factor should I use?"
            a="Field practice commonly uses 1.50–1.57. Use 1.54 as a starting point unless your organization specifies otherwise."
          />
          <FAQ
            q="Can I change the water–cement ratio?"
            a="Yes. Leave the field blank to use the grade’s typical default, or override w/c to match your specification."
          />
          <FAQ
            q="How does the calculator compute cement bags?"
            a="It converts the cement volume to mass using your density, then divides by your bag size (e.g., 50 kg) to get total bags."
          />
          <FAQ
            q="Why do I enter moisture for sand and aggregates?"
            a="Surface moisture contributes water to the mix. The tool subtracts that from theoretical water to avoid overwetting."
          />
          <FAQ
            q="Can I print the results for approvals?"
            a="Yes. Use Print / Save to export an A4-friendly summary of inputs, materials, and yardage (+5% / +10%)."
          />
          <FAQ
            q="Are these quantities suitable for structural members?"
            a="They’re planning estimates for nominal mixes. For structural elements with strength requirements, use a design mix per your code."
          />
        </div>
        {/* ----------------- END CONTENT ----------------- */}
      </div>
    </section>
  );
}

/* ---------- Reusable UI atoms (same as your other articles) ---------- */

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
