"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Layers,
  Square,
  Circle,
  ClipboardList,
  Printer,
} from "lucide-react";

/** ColumnConcreteCalcArticle.tsx
 *  Identical UI/UX shell to your finalized Slab/Beam articles.
 *  Content tailored to ColumnConcreteCalc.tsx features.
 */
export default function ColumnConcreteCalcArticle() {
  // --- collapse/expand (same mechanism you approved) ---
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
      {/* Top-right toggle button */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="column-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="column-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Column Concrete Calculator
        </h2>

        {/* Features grid (same card UI) */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Square className="h-5 w-5" />}
            title="Rectangular / Square Columns"
            desc="Compute volume using L × W × H with automatic unit handling."
          />
          <FeatureCard
            icon={<Circle className="h-5 w-5" />}
            title="Circular Columns"
            desc="Calculate π × r² × H from diameter and height—with conversions built-in."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Multi-Unit Inputs"
            desc="Enter dimensions in meters, centimeters, feet, or inches; results stay consistent."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Quantity & Waste Allowance"
            desc="Multiply per-column volume by count and add a waste % (commonly 5–10%)."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Display Units Toggle"
            desc="Show totals in m³, yd³, or ft³ without re-entering your inputs."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Clear, Gated Results"
            desc="Results appear after Calculate to avoid accidental reads and keep focus on inputs."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save"
            desc="Export a tidy summary of inputs and results; includes yd³ helpers (+5% / +10%)."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Free Column Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Supports both rectangular/square and circular columns in one tool.</WhyItem>
            <WhyItem>Accurate unit conversions and numeric input guards reduce entry errors.</WhyItem>
            <WhyItem>Quantity and waste % built in—perfect for multi-column projects.</WhyItem>
            <WhyItem>One-click display switch between m³, yd³, and ft³ for ordering.</WhyItem>
            <WhyItem>Printable summary helps communicate quantities to suppliers and crews.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Column Concrete Calculator
        </h4>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select the <span className="text-white">Rectangular / Square</span> or <span className="text-white">Circular</span> tab.</li>
          <li>Choose your <span className="text-white">unit</span> (m, cm, ft, or in) and enter dimensions.</li>
          <li>Enter the <span className="text-white">Quantity (No. of Columns)</span> and a <span className="text-white">Waste %</span> (e.g., 5–10%).</li>
          <li>Press <span className="text-white">Calculate</span> to reveal results.</li>
          <li>Use <span className="text-white">Show in</span> to toggle m³, yd³, or ft³ as needed for ordering.</li>
          <li>Optionally hit <span className="text-white">Print / Save Calculations</span> to export a clean summary.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Rectangular / Square Column"
            lines={["Gross Volume per Column = L × W × H"]}
            note="Inputs are converted to a common base before multiplication to avoid unit mismatch."
          />
          <FormulaBlock
            title="2) Circular Column"
            lines={["Gross Volume per Column = π × r² × H", "r = Diameter ÷ 2"]}
          />
          <FormulaBlock
            title="3) Quantity & Waste"
            lines={[
              "Net Total = Per-Column Volume × Quantity",
              "With Waste = Net Total × (1 + Waste%)",
            ]}
          />
          <FormulaBlock
            title="4) Display Conversions"
            lines={[
              "1 m³ = 35.3147 ft³",
              "1 m³ = 1.30795 yd³",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Does the calculator handle both rectangular and circular columns?"
            a="Yes. Use the tabs to switch between Rectangular/Square and Circular modes; each uses the appropriate geometric formula."
          />
          <FAQ
            q="Which input units are supported?"
            a="Meters, centimeters, feet, and inches for dimensions. You can display results in cubic meters, cubic yards, or cubic feet."
          />
          <FAQ
            q="How much waste should I add?"
            a="Many projects use 5–10% to cover spillage, pumping losses, and subgrade variation. Always follow your project’s specification."
          />
          <FAQ
            q="Can I enter multiple columns at once?"
            a="Yes. Enter the quantity of columns; the tool multiplies per-column volume to produce net totals and totals with waste."
          />
          <FAQ
            q="How do I get cubic yards for ordering?"
            a="After calculating, set the display to yd³, or use the built-in yardage helper that also shows +5% and +10% options."
          />
          <FAQ
            q="Does this include reinforcement or mix design?"
            a="No. The tool focuses on volume. Reinforcement, cover, and mix grade must follow your structural drawings and local codes."
          />
          <FAQ
            q="Can I print or save the results?"
            a="Yes. Use the Print / Save button in the calculator to export a clean, paper-friendly summary."
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
