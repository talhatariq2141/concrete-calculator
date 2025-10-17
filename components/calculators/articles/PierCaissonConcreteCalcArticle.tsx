"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Circle,
  Beaker,
  Layers,
  ClipboardList,
  Printer,
} from "lucide-react";

/** PierCaissonConcreteCalcArticle.tsx
 *  Article component aligned to Pier/Caisson calculator functionality.
 *  Matches your finalized article UI/UX.
 */
export default function PierCaissonConcreteCalcArticle() {
  // --- collapse/expand (identical behavior to your approved articles) ---
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
          aria-controls="piercaisson-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="piercaisson-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 (required to start the page) */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Pier / Caisson Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Circle className="h-5 w-5" />}
            title="Shaft (Cylinder) Volume"
            desc="Compute concrete for straight shafts using diameter and depth with accurate πr²h geometry."
          />
          <FeatureCard
            icon={<Beaker className="h-5 w-5" />}
            title="Optional Belled Base"
            desc="Add a frustum (top dia, bottom dia, height) for belled caissons; volume auto-added to the shaft."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Multi-Unit Inputs"
            desc="Enter dimensions in meters, centimeters, millimeters, feet, or inches; conversions are handled for you."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Quantity & Waste"
            desc="Multiply per-pier volume by pier count and apply a waste/overage % (e.g., 5–10%)."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Per-Pier & Totals in m³ / yd³ / ft³"
            desc="See net and with-waste volumes per pier and for all piers, displayed in the units you need."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Gated Results"
            desc="Results appear after you click Calculate—keeps focus on inputs and avoids accidental reads."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save + Yardage Helpers"
            desc="Export a clean summary and quickly view yd³ +5% and +10% for supplier ordering."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Pier / Caisson Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Purpose-built for drilled shafts and belled caissons with field-ready outputs.</WhyItem>
            <WhyItem>Accurate unit handling across m, cm, mm, ft, and in—no manual conversions required.</WhyItem>
            <WhyItem>Shows per-pier and total volumes, both net and with waste, to prevent under-ordering.</WhyItem>
            <WhyItem>Yardage helpers (+5% / +10%) speed up ready-mix rounding and truck planning.</WhyItem>
            <WhyItem>Printable results simplify documentation for site logs and purchase orders.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Pier / Caisson Concrete Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select the <span className="text-white">Input Unit</span> (m, cm, mm, ft, or in).</li>
          <li>Enter <span className="text-white">Shaft Diameter</span>, <span className="text-white">Shaft Depth</span>, and <span className="text-white">Quantity (No. of Piers)</span>.</li>
          <li>(Optional) Toggle <span className="text-white">Belled Base</span> and provide <span className="text-white">Top Diameter</span>, <span className="text-white">Bottom Diameter</span>, and <span className="text-white">Bell Height</span>.</li>
          <li>Add a <span className="text-white">Waste / Overage %</span>—typical ranges are 5–10%.</li>
          <li>Click <span className="text-white">Calculate</span> to reveal per-pier and total volumes in <strong>m³</strong>, <strong>yd³</strong>, and <strong>ft³</strong>.</li>
          <li>Use the <span className="text-white">Cubic Yards</span> helper (+5% / +10%) and <span className="text-white">Print / Save Calculations</span> for ordering.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Shaft (Cylinder)"
            lines={["Volume = π × r² × h", "r = Diameter ÷ 2"]}
            note="All dimensions are converted to a single base unit before multiplication to avoid unit mismatch."
          />
          <FormulaBlock
            title="2) Belled Base (Frustum)"
            lines={["Volume = (π × h / 3) × (R₁² + R₁R₂ + R₂²)", "R₁ = Top Radius, R₂ = Bottom Radius"]}
          />
          <FormulaBlock
            title="3) Quantity & Waste"
            lines={[
              "Per-Pier With Waste = Per-Pier × (1 + Waste%)",
              "Totals = Per-Pier × Quantity; Totals With Waste = Totals × (1 + Waste%)",
            ]}
          />
          <FormulaBlock
            title="4) Unit Conversions (display)"
            lines={["1 m³ = 35.3147 ft³", "1 m³ = 1.30795 yd³"]}
          />
        </div>

        {/* FAQs (SEO-focused) */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Can this calculator handle belled caissons?"
            a="Yes. Enable Belled Base and enter top diameter, bottom diameter, and bell height. The frustum volume is added to the shaft volume automatically."
          />
          <FAQ
            q="Which units can I use for inputs?"
            a="Meters, centimeters, millimeters, feet, and inches. The tool converts internally and displays volumes in m³, yd³, and ft³."
          />
          <FAQ
            q="How much waste should I add?"
            a="A 5–10% allowance is common for placement losses, uneven excavation, and pump line waste. Follow your project’s specification."
          />
          <FAQ
            q="Does the calculator show per-pier and total volumes?"
            a="Yes. You’ll see net and with-waste values per pier and for the total number of piers."
          />
          <FAQ
            q="How do I use the yd³ (+5% / +10%) helpers?"
            a="After calculating, the yd³ helper block shows ‘with waste’ yardage and quick +5% and +10% additions for rounding truck orders."
          />
          <FAQ
            q="Can I print or save the results?"
            a="Yes. Use the Print / Save Calculations button to generate a clean, A4-friendly summary."
          />
          <FAQ
            q="Does this tool include reinforcement or mix design?"
            a="No. It focuses on volume. Reinforcement, cover, and mix grade must follow structural drawings and local codes."
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
