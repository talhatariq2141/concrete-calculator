"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Square,
  Layers,
  Printer,
  DoorClosed,
  DollarSign,
  Droplets,
} from "lucide-react";

export default function WallConcreteCalcArticle() {
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
          aria-controls="wall-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="wall-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Wall Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Flexible Units"
            desc="Length/Height in meters or feet; thickness in meters, centimeters, or inches. All conversions are handled internally."
          />
          <FeatureCard
            icon={<Square className="h-5 w-5" />}
            title="Net Volume with Openings"
            desc="Subtract doors, windows, and vents automatically using width × height × thickness × count for each opening."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Nominal Mix & Materials"
            desc="Select 1:1.5:3, 1:2:4, or 1:3:6. The tool applies a 1.54 dry-factor, computes cement (bags), sand, aggregate, and water."
          />
          <FeatureCard
            icon={<Droplets className="h-5 w-5" />}
            title="Water–Cement Ratio"
            desc="Enter w/c (e.g., 0.5). Water is calculated in liters (≈ kg) from cement mass."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Results in m³ / ft³ / yd³"
            desc="Switch the display unit for net volume. A Yardage helper shows +5% and +10% for supplier rounding."
          />
          <FeatureCard
            icon={<DoorClosed className="h-5 w-5" />}
            title="Tabbed Workflow"
            desc="Inputs → Openings → Results. Outputs appear only after Calculate, keeping data entry focused."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Optional Costing"
            desc="Estimate cost by rate per m³ or by materials (cement bags, sand m³, aggregate m³)."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save"
            desc="Export an A4-friendly summary with inputs, volumes, materials, yardage, and cost."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Wall Concrete Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Purpose-built for straight concrete walls with accurate opening subtraction.</WhyItem>
            <WhyItem>Consistent unit handling across m/ft and m/cm/in—no manual conversions.</WhyItem>
            <WhyItem>Real-world allowances via dry-volume factor (1.54) and material breakdown for procurement.</WhyItem>
            <WhyItem>Yardage (+5% / +10%) mirrors ready-mix ordering and truck rounding.</WhyItem>
            <WhyItem>Printable results and optional costing streamline budgets and approvals.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Wall Concrete Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select <span className="text-white">Length</span>, <span className="text-white">Height</span>, and <span className="text-white">Thickness</span> with their units (m/ft for L & H; m/cm/in for thickness).</li>
          <li>Pick a <span className="text-white">Nominal Mix</span> (1:1.5:3, 1:2:4, or 1:3:6) and enter the <span className="text-white">Water–Cement Ratio</span> (e.g., 0.5).</li>
          <li>Open the <span className="text-white">Openings</span> tab to add doors/windows/vents with <em>Width</em>, <em>Height</em>, and <em>Count</em>.</li>
          <li>Choose your <span className="text-white">Output Volume Unit</span> (m³/ft³/yd³) and press <span className="text-white">Calculate</span>.</li>
          <li>Review <strong>Net Volume</strong>, <strong>Materials</strong> (dry volume, cement bags, sand, aggregate, water), and the <strong>Yardage helper</strong> (+5% / +10%).</li>
          <li>(Optional) Use <span className="text-white">Cost Estimation</span> by rate per m³ or by materials, then <span className="text-white">Print / Save</span> your results.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Wall & Openings"
            lines={[
              "Gross Wall Volume = Length × Height × Thickness",
              "Opening Volume (each) = Opening Width × Opening Height × Thickness",
              "Net Concrete Volume = Gross − Σ(Openings)",
            ]}
            note="All dimensions are converted to a common base unit before multiplication."
          />
          <FormulaBlock
            title="2) Dry Volume & Materials"
            lines={[
              "Dry Volume = Net × 1.54",
              "Mix parts: Cement : Sand : Aggregate (e.g., 1:2:4)",
              "Cement Volume = (Cement / PartsSum) × Dry Volume",
              "Sand Volume = (Sand / PartsSum) × Dry Volume",
              "Aggregate Volume = (Aggregate / PartsSum) × Dry Volume",
            ]}
          />
          <FormulaBlock
            title="3) Bags & Water"
            lines={[
              "Cement Mass (kg) = Cement Volume × 1440 kg/m³",
              "Bags = Cement Mass ÷ 50 kg",
              "Water (liters ≈ kg) = (w/c) × Cement Mass",
            ]}
          />
          <FormulaBlock
            title="4) Display Conversions & Yardage"
            lines={[
              "ft³ = m³ × 35.3147",
              "yd³ = m³ × 1.30795",
              "Yardage helpers: yd³(+5%), yd³(+10%)",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Can I mix units when entering dimensions?"
            a="Use meters or feet for length and height, and meters/centimeters/inches for thickness. The tool converts internally—just keep each field’s unit consistent with its selector."
          />
          <FAQ
            q="How are openings handled?"
            a="Each opening’s volume is width × height × wall thickness × count. The calculator subtracts the total of all openings from the gross wall volume."
          />
          <FAQ
            q="Which nominal mixes are available?"
            a="1:1.5:3, 1:2:4, and 1:3:6 by volume. The calculator uses a 1.54 dry-volume factor to derive ingredient volumes."
          />
          <FAQ
            q="How do you compute cement bags and water?"
            a="Cement volume (from mix split) is converted to mass using 1440 kg/m³, then divided by 50 kg/bag. Water = w/c × cement mass, reported in liters."
          />
          <FAQ
            q="Can I view the result in cubic yards?"
            a="Yes. Set the output unit to yd³. A helper also shows yd³ with +5% and +10% additions for ordering."
          />
          <FAQ
            q="Is cost estimation included?"
            a="Yes. Choose Rate per m³ or By Materials to get a quick cost; you control unit rates and bag price."
          />
          <FAQ
            q="Can I print or save the results?"
            a="Use the Print / Save button to export an A4-friendly summary of inputs, volumes, materials, yardage, and cost."
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
