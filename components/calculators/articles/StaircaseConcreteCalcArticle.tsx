"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Square,
  Layers,
  ClipboardList,
  Printer,
  Box,
} from "lucide-react";

export default function StaircaseConcreteCalcArticle() {
  // --- collapse/expand (same behavior as your approved articles) ---
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
          aria-controls="stair-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="stair-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Staircase Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Box className="h-5 w-5" />}
            title="Two Calculation Modes"
            desc="Choose Waist-Slab (inclined slab + step wedges) or Solid (mass) stairs—whichever your design requires."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Global Unit Selector"
            desc="Enter all dimensions in meters, centimeters, millimeters, feet, or inches; consistent conversions are handled for you."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Real Stair Geometry"
            desc="Inputs include number of steps, tread (depth), riser (height), stair width, and—on waist-slab—waist thickness."
          />
          <FeatureCard
            icon={<Square className="h-5 w-5" />}
            title="Optional Landings"
            desc="Add rectangular Top and/or Bottom landings with length × width × thickness for full-flight volume."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Gated, Clear Results"
            desc="Press Calculate to reveal totals, breakdown by component, and conversions—keeps focus on accurate entry."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Volume, Weight & Conversions"
            desc="See m³, ft³, yd³, liters, and approx. weight using 2400 kg/m³—plus a readable component breakdown."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save & Copy"
            desc="Export an A4-friendly summary or copy the breakdown for emails, site logs, and POs."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Staircase Concrete Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Purpose-built for stair flights with waist-slab or solid modeling, plus optional landings.</WhyItem>
            <WhyItem>Accurate unit handling across m, cm, mm, ft, and in—no manual conversions or spreadsheets.</WhyItem>
            <WhyItem>Readable results: total volume, liters, yardage, and approximate weight at a glance.</WhyItem>
            <WhyItem>Includes a detailed component breakdown (waist slab, wedges, landings) for reviews and approvals.</WhyItem>
            <WhyItem>Print/Save and Copy features streamline documentation and team communication.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4
          id="how-to-use"
          className="text-lg font-semibold text-white mt-12 mb-3"
        >
          How to Use the Staircase Concrete Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select <span className="text-white">Unit</span> (m, cm, mm, ft, or in).</li>
          <li>Choose a mode: <span className="text-white">Waist-Slab</span> or <span className="text-white">Solid (Mass)</span>.</li>
          <li>Enter stair geometry: <span className="text-white">Number of Steps</span>, <span className="text-white">Tread (depth)</span>, <span className="text-white">Riser (height)</span>, and <span className="text-white">Width</span>.  
              In Waist-Slab mode, also enter <span className="text-white">Waist Thickness</span>.</li>
          <li>(Optional) Enable <span className="text-white">Bottom</span> and/or <span className="text-white">Top Landing</span> and provide their <span className="text-white">Length</span>, <span className="text-white">Width</span>, and <span className="text-white">Thickness</span>.</li>
          <li>Click <span className="text-white">Calculate</span> to reveal <strong>Total Volume</strong> (m³, ft³, yd³), <strong>Liters</strong>, <strong>Approx. Weight</strong>, and a <strong>Breakdown</strong>.</li>
          <li>Use <span className="text-white">Cubic Yards (for ordering)</span> with quick <strong>+5%</strong> and <strong>+10%</strong> helpers, then <span className="text-white">Print / Save</span> or <span className="text-white">Copy Breakdown</span> as needed.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Waist-Slab Stairs"
            lines={[
              "Sloped length (Ls) = √(Total Run² + Total Rise²)",
              "Waist volume = Waist Thickness × Stair Width × Ls",
              "Step wedges = 0.5 × Steps × Tread × Riser × Stair Width",
              "Total (waist mode) = Waist volume + Step wedges + Landings",
            ]}
            note="Total Run = Steps × Tread; Total Rise = Steps × Riser. All dimensions are converted to a single base unit before multiplication."
          />
          <FormulaBlock
            title="2) Solid (Mass) Stairs"
            lines={[
              "Steps volume ≈ Steps × Tread × Riser × Stair Width",
              "Total (solid mode) = Steps volume + Landings",
            ]}
            note="This conservative model treats the flight as stacked rectangular steps."
          />
          <FormulaBlock
            title="3) Landings (Rectangular Prisms)"
            lines={["Landing volume = Length × Width × Thickness (for each enabled landing)"]}
          />
          <FormulaBlock
            title="4) Conversions & Weight"
            lines={[
              "ft³ = m³ × 35.3147",
              "yd³ = m³ × 1.30795",
              "liters = m³ × 1000",
              "approx. weight = m³ × 2400 kg/m³ (normal-weight concrete)",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="What’s the difference between Waist-Slab and Solid stairs?"
            a="Waist-Slab models an inclined slab plus triangular step wedges, typically yielding a lower volume. Solid stairs approximate stacked rectangular steps and are more conservative."
          />
          <FAQ
            q="Which units can I use?"
            a="Meters, centimeters, millimeters, feet, or inches. Pick one unit and enter all fields consistently; the calculator converts internally."
          />
          <FAQ
            q="Can I include landings?"
            a="Yes. Toggle Bottom and/or Top Landing and provide their Length, Width, and Thickness to include them in the total volume."
          />
          <FAQ
            q="Does the calculator show weight?"
            a="Yes. It multiplies total m³ by 2400 kg/m³ (normal-weight concrete) to provide an approximate mass in kg and metric tons."
          />
          <FAQ
            q="How do I get cubic yards for ordering?"
            a="Results include yd³ and a helper that shows +5% and +10% additions so you can round orders to supplier increments."
          />
          <FAQ
            q="Can I print or copy the results?"
            a="Use Print / Save for an A4-friendly summary or Copy Breakdown to paste the component list into emails or notes."
          />
          <FAQ
            q="Does this tool handle reinforcement or code checks?"
            a="No. It focuses on concrete volume. Reinforcement, cover, and code compliance should follow your structural drawings and local standards."
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
