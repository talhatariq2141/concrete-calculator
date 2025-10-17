"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Square,
  Circle,
  Layers,
  ClipboardList,
  Printer,
} from "lucide-react";

export default function ConcreteYardsCalcArticle() {
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
          aria-controls="yards-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="yards-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Concrete Yards Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Square className="h-5 w-5" />}
            title="Rectangle / Slab Mode"
            desc="Compute volume using L × W × T for pads, driveways, and floors—perfect for yard-based orders."
          />
          <FeatureCard
            icon={<Circle className="h-5 w-5" />}
            title="Circular Mode"
            desc="Use diameter and thickness to get yardage for round pads and circular placements."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="One Global Unit Selector"
            desc="Enter all dimensions in the same unit (ft, in, yd, m, cm, mm). The calculator converts to ft³ internally."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Waste Allowance Built-In"
            desc="Apply 0%, 5%, or 10% waste to reduce the risk of under-ordering."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Yard-Focused Results"
            desc="Outputs in yd³ plus ft³ and m³. Yardage quick helpers show +5% and +10% for easy supplier rounding."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Gated Results"
            desc="Results appear after you click Calculate—keeps the form focused and prevents accidental reads."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save"
            desc="Export a clean, A4-friendly summary with inputs and yardage for records or purchase orders."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Concrete Yards Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Designed for ordering in <strong>cubic yards</strong>, the industry standard for ready-mix.</WhyItem>
            <WhyItem>Rectangle and circular modes cover most slab and pad scenarios without extra steps.</WhyItem>
            <WhyItem>Single unit control avoids mixing units—fewer mistakes and cleaner calculations.</WhyItem>
            <WhyItem>Built-in waste options and yardage helpers (+5% / +10%) make supplier conversations faster.</WhyItem>
            <WhyItem>Printable summary helps document assumptions and quantities for your team.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Concrete Yards Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select <span className="text-white">Shape</span>: <em>Rectangle / Slab</em> or <em>Circular</em>.</li>
          <li>Choose one <span className="text-white">Input Unit</span> (ft, in, yd, m, cm, or mm). All fields use this unit.</li>
          <li>Enter dimensions:
            <ul className="list-disc list-inside ml-5">
              <li>Rectangle: <span className="text-white">Length</span>, <span className="text-white">Width</span>, <span className="text-white">Thickness</span></li>
              <li>Circular: <span className="text-white">Diameter</span>, <span className="text-white">Thickness</span></li>
            </ul>
          </li>
          <li>Pick a <span className="text-white">Waste Allowance</span> (0%, 5%, or 10%).</li>
          <li>Click <span className="text-white">Calculate</span> to reveal results in <strong>yd³</strong>, with <strong>ft³</strong> and <strong>m³</strong> alongside.</li>
          <li>Use the yardage helpers (+5% / +10%) and optional <span className="text-white">Print / Save</span> to finalize ordering.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Rectangle / Slab"
            lines={["Volume (ft³) = Length × Width × Thickness (all converted to feet)"]}
            note="Inputs are converted from your chosen unit (ft, in, yd, m, cm, mm) to feet before multiplication."
          />
          <FormulaBlock
            title="2) Circular"
            lines={[
              "Volume (ft³) = π × (Diameter/2)² × Thickness",
              "All dimensions converted to feet before computing volume",
            ]}
          />
          <FormulaBlock
            title="3) Waste Allowance"
            lines={["Adjusted Volume = Raw Volume × (1 + Waste%)"]}
            note="Preset options: 0%, 5%, 10%. Choose higher values for uneven subbase or difficult placement."
          />
          <FormulaBlock
            title="4) Display Conversions"
            lines={[
              "yd³ = ft³ ÷ 27",
              "m³ = ft³ × 0.028316846592",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Do I have to enter all dimensions in the same unit?"
            a="Yes. Pick a single input unit in the dropdown and enter all fields using that unit. The calculator handles the conversions internally."
          />
          <FAQ
            q="Why are the results shown in cubic yards?"
            a="Ready-mix concrete is typically ordered in cubic yards. We also display ft³ and m³ for engineering checks and international projects."
          />
          <FAQ
            q="Which waste percentage should I use?"
            a="5% is a common minimum; use 10% for uneven subgrade, edge forms, or when pumping. Follow your project standards."
          />
          <FAQ
            q="What if my slab isn’t perfectly rectangular or circular?"
            a="Break complex shapes into rectangles or circles, calculate each area’s yardage, then add them together. Apply a suitable waste allowance before ordering."
          />
          <FAQ
            q="Can I print the results?"
            a="Yes. Use the Print / Save button to export an A4-friendly summary of your inputs and yardage."
          />
          <FAQ
            q="Does this tool include rebar or mix design?"
            a="No. It focuses on volume. Reinforcement, control joints, and mix grade should follow your engineer’s drawings and local codes."
          />
          <FAQ
            q="Is there support for inches or millimeters?"
            a="Yes. You can select inches or millimeters (and other units) as the single input unit for all fields."
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
