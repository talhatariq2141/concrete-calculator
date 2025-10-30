// components/articles/ConcreteBagsCalcArticle.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Ruler,
  Calculator as CalcIcon,
  Clock,
  Layers,
  Scale,
  ClipboardList,
} from "lucide-react";

export default function ConcreteBagsCalcArticle() {
  // --- collapse/expand state + height animation (mirrors sample exactly) ---
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
      {/* top-right toggle button (same UI/UX as sample) */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="bags-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* collapsible wrapper */}
      <div
        id="bags-article-collapse"
        ref={wrapperRef}
        className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[10000px]"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* --- ARTICLE CONTENT STARTS --- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Concrete Bags Calculator
        </h2>

        {/* Feature cards (identical layout) */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Multi-Unit Inputs"
            desc="Enter dimensions in feet/inches or meters/centimeters/millimeters. The calculator converts everything consistently under the hood."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Project Types & Conversions"
            desc="Slab, Footing, Post Holes, Sonotube, or Custom Volume — with quick readouts in ft³, yd³, and m³ for ordering."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Bag Size Options"
            desc="Choose common pre-mix bag sizes: 40 lb, 50 lb, 60 lb, 80 lb, and 20 kg. Uses nominal yields for accurate bag counts."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="Waste Buffers"
            desc="Auto-add +5% and +10% buffers to cover spillage, edge thickening, and site variations."
          />
          <FeatureCard
            icon={<Clock className="h-5 w-5" />}
            title="Guided Workflow"
            desc="Results appear after Calculate, keeping the form focused and preventing accidental reads."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Print / Save Sheet"
            desc="Export a clean, printer-friendly summary with inputs, conversions, and bag counts."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Free Concrete Bags Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Accurate volume from slab, footing, post holes, or sonotube geometry with clean unit handling.</WhyItem>
            <WhyItem>Supports standard bag sizes and provides practical +5%/+10% ordering buffers.</WhyItem>
            <WhyItem>Instant conversions to ft³, yd³, and m³ for supplier coordination and ready-mix comparisons.</WhyItem>
            <WhyItem>Clear step-by-step flow: inputs → bag size → calculate → results and buffers.</WhyItem>
            <WhyItem>Simple print/save workflow to document calculations for site records or submittals.</WhyItem>
          </ul>
        </div>

        {/* H4 How-to */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Concrete Bags Calculator
        </h4>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select your <span className="text-white">Unit System</span> (Imperial or Metric) and set <span className="text-white">Linear Units</span>.</li>
            <li>Choose <span className="text-white">Project Type</span>: Slab, Footing, Post Holes, Sonotube, or Custom Volume.</li>
            <li>Enter all required <span className="text-white">dimensions</span> in the same unit (e.g., feet or meters).</li>
            <li>Select a <span className="text-white">Bag Size</span> (40/50/60/80 lb or 20 kg).</li>
            <li>Press <span className="text-white">Calculate</span> to reveal exact bags plus +5% and +10% buffers.</li>
            <li>Optional utility: use <span className="text-white">Bags ↔ Yards</span> and <span className="text-white">Volume ↔ Bags</span> conversions.</li>
          </ol>
        </div>

        {/* Formulas Used */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Volume by Project Type"
            lines={[
              "Slab/Footing (rectangular): Volume = L × W × T",
              "Posts/Sonotube (cylinder): Volume = π × (d/2)² × H × Count",
              "Custom Volume: Enter yd³ (Imperial) or m³ (Metric)",
            ]}
            note="All linear inputs are converted consistently to a base unit before multiplication."
          />
          <FormulaBlock
            title="2) Bags from Volume"
            lines={[
              "Bags (exact) = Total Volume ÷ Yield per Bag",
              "Typical nominal yields: 40 lb ≈ 0.30 ft³, 50 lb ≈ 0.37 ft³, 60 lb ≈ 0.45 ft³, 80 lb ≈ 0.60 ft³, 20 kg ≈ 0.014 m³ (~0.49 ft³)",
            ]}
            note="If your bag brand lists a different yield, use that for best accuracy."
          />
          <FormulaBlock
            title="3) Buffers"
            lines={["Bags (+5%) = Bags × 1.05", "Bags (+10%) = Bags × 1.10"]}
            note="Use buffers to cover waste, spillage, and small subgrade variations."
          />
          <FormulaBlock
            title="4) Unit Conversions (display)"
            lines={["1 yd³ = 27 ft³", "1 m³ = 35.3147 ft³", "1 m³ = 1.30795 yd³"]}
          />
        </div>

        {/* FAQs (the exact 18 previously agreed) */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How can I calculate how many bags of concrete I need?"
            a="Use the Concrete Bags Calculator: select your project type (Slab, Footing, Post Holes, or Sonotube), enter dimensions in your preferred units, choose a bag size (40/50/60/80 lb or 20 kg), and press Calculate. The tool converts geometry to volume, applies the selected bag yield, and returns exact bags plus +5% and +10% buffers for waste."
          />
          <FAQ
            q="How do I calculate bags of concrete manually?"
            a="1) Compute volume. For slabs/footings: L × W × T. For cylinders (posts/sonotubes): π × (d/2)² × H. 2) Convert to cubic feet or cubic yards as needed (1 yd³ = 27 ft³). 3) Divide by the bag yield. Typical yields: 40 lb ≈ 0.30 ft³, 50 lb ≈ 0.37 ft³, 60 lb ≈ 0.45 ft³, 80 lb ≈ 0.60 ft³, and 20 kg ≈ 0.014 m³ (≈ 0.49 ft³). Add 5–10% for waste."
          />
          <FAQ
            q="What’s the formula for calculating concrete bags?"
            a="Bags Needed = Total Volume ÷ Yield per Bag. Example (slab): Volume = L × W × T. If your slab is 20 ft × 12 ft × 0.33 ft, volume ≈ 79.2 ft³. Using 80 lb bags (≈ 0.60 ft³/bag): 79.2 ÷ 0.60 ≈ 132 bags. Consider +5–10% extra for cuts, spillage, and subgrade irregularities."
          />
          <FAQ
            q="How do I figure out the number of concrete bags required?"
            a="Pick a bag size, find the project volume, then divide volume by bag yield. The calculator handles unit conversions (ft/in ↔ m/cm) and geometry automatically, so you can focus on getting clean dimensions while it returns exact bags, +5%, and +10% options."
          />
          <FAQ
            q="How many concrete bags are needed per cubic yard?"
            a="A cubic yard is 27 ft³. Divide 27 by the bag yield in ft³. Approximate counts: 80 lb ≈ 45 bags/yd³ (27 ÷ 0.60), 60 lb ≈ 60 bags/yd³ (27 ÷ 0.45), 50 lb ≈ ~73 bags/yd³ (27 ÷ 0.37), 40 lb ≈ 90 bags/yd³ (27 ÷ 0.30). For 20 kg bags (~0.014 m³ each), 1 yd³ ≈ 0.7646 m³ → about 55 bags/yd³ (0.7646 ÷ 0.014)."
          />
          <FAQ
            q="How many bags of concrete do I need for one fence post?"
            a="Use the cylinder formula: Volume = π × (d/2)² × Depth. Convert measurements to the same unit first. Example: 12 in diameter (1 ft), 2.5 ft depth → π × (0.5²) × 2.5 ≈ 1.96 ft³. With 80 lb bags (0.60 ft³), that’s about 3.3 bags → round up to 4; add 5–10% contingency or follow local specs."
          />
          <FAQ
            q="How many cement bags are used in one cubic meter of concrete?"
            a="That depends on the mix design (e.g., nominal mixes like 1:2:4) and local standards. As a rough guide for plain concrete, many engineers estimate ~7–8 × 50 kg cement bags per 0.5 m³ at certain strengths, but this varies. Use project specs, or a dedicated mix calculator, for precise cement-only counts."
          />
          <FAQ
            q="How many concrete bags do I need for my project?"
            a="Enter your dimensions and bag size in the calculator and click Calculate. You’ll get exact bags plus +5% and +10% options. If you’re between sizes, choose the next whole bag. For large pours, compare bag counts with ready-mix delivery pricing."
          />
          <FAQ
            q="How many bags of concrete are required for a sonotube?"
            a="Compute cylinder volume: π × (d/2)² × H, multiply by the number of tubes, then divide by bag yield. Example: four 12 in dia × 36 in tubes → each ≈ 2.35 ft³; total ≈ 9.4 ft³. Using 80 lb bags (0.60 ft³): 9.4 ÷ 0.60 ≈ 15.7 → 16–18 bags with waste."
          />
          <FAQ
            q="How to estimate cement bags needed for concrete mix?"
            a="Decide the mix (e.g., 1:2:4), convert your total concrete volume to the constituent volumes using the ratio, then account for bulking/voids and density. Because this is mix-specific, most users prefer a mix-design calculator or manufacturer guidance. Our bag calculator focuses on pre-mixed concrete bag counts."
          />
          <FAQ
            q="How many cement bags per cubic meter of concrete?"
            a="It depends on the targeted strength and mix design. A common rough range might be ~7–12 × 50 kg bags per m³ depending on mix and aggregate moisture, but you should verify with structural specs or a mix design tool. Use this as orientation rather than a substitute for engineered design."
          />
          <FAQ
            q="How many bags of concrete do I need for a slab?"
            a="Volume = L × W × Thickness (all in the same unit). Convert to ft³ or yd³. Divide by the bag yield. Example: 10 ft × 10 ft × 4 in (0.333 ft) → 33.3 ft³. With 80 lb bags (0.60 ft³): ≈ 55.5 → 56–62 bags with 5–10% extra for waste and edge thickening."
          />
          <FAQ
            q="How many concrete bags do I need for a footing?"
            a="Treat the footing as a rectangular prism: L × W × H. Convert to ft³ or m³. Divide by bag yield. Example: 30 ft × 1.5 ft × 1.0 ft = 45 ft³. With 60 lb bags (0.45 ft³): 100 bags; add 5–10% contingency for trench irregularities and consolidation losses."
          />
          <FAQ
            q="Does this calculator work for Lowe’s or Home Depot bag sizes?"
            a="Yes. The calculator supports 40, 50, 60, and 80 lb bags that match typical retail sizes (including Lowe’s and Home Depot), plus 20 kg for metric markets. If a specific product lists a different yield, use that manufacturer yield to refine results."
          />
          <FAQ
            q="What area does one 80 lb bag of concrete cover?"
            a="Coverage depends on thickness: Area (ft²) = Yield (ft³) ÷ Thickness (ft). An 80 lb bag yields ≈ 0.60 ft³. At 4 in (0.333 ft) thickness: 0.60 ÷ 0.333 ≈ 1.8 ft² per bag. At 6 in (0.5 ft): 0.60 ÷ 0.5 = 1.2 ft² per bag."
          />
          <FAQ
            q="How many concrete bags are required for my project area?"
            a="Convert area to volume by multiplying by thickness, then divide by bag yield. Example: 200 ft² at 4 in (0.333 ft) → 66.7 ft³. With 50 lb bags (~0.37 ft³): 66.7 ÷ 0.37 ≈ 180 bags. The calculator automates these steps, including optional waste buffers."
          />
          <FAQ
            q="What formula does the Concrete Bag Calculator use?"
            a="It converts your geometry to total volume (rectangular or cylindrical), normalizes units, and divides by the selected bag’s nominal yield: Bags = Volume ÷ Yield per Bag. It also returns +5% and +10% buffers for practical ordering."
          />
          <FAQ
            q="Can I calculate using inches or metric units?"
            a="Yes. You can switch between Imperial (ft/in/yd) and Metric (m/cm/mm) systems. The calculator handles conversions internally, so you can enter dimensions in inches or centimeters while still getting results in bags, ft³/yd³, or m³."
          />
        </div>

        {/* --- ARTICLE CONTENT ENDS --- */}
      </div>
    </section>
  );
}

/* ---------- Reusable UI bits (copied style from sample) ---------- */

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
