"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Square,
  Layers,
  Beaker,
  ClipboardList,
  Printer,
} from "lucide-react";

export default function TankTrenchConcreteCalcArticle() {
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
          aria-controls="tanktrench-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="tanktrench-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Tank / Trench Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Three Purpose-Built Modes"
            desc="Trench, Rectangular Tank, and Circular Tank — switch by tabs to match your scope."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Global Unit Selector"
            desc="Enter all dimensions in meters, centimeters, feet, or inches; conversions are handled for you."
          />
          <FeatureCard
            icon={<Square className="h-5 w-5" />}
            title="Trench: Rectangular or Trapezoidal"
            desc="Use Width for rectangular trenches or Top/Bottom Widths for trapezoidal sections."
          />
          <FeatureCard
            icon={<Beaker className="h-5 w-5" />}
            title="Tank Wall & Slab Thickness"
            desc="Rectangular & circular tanks include wall, base, and optional cover slab thicknesses."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Results After Calculate"
            desc="Clean, gated results in m³, with quick conversions to yd³ and ft³. Yardage helpers included."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Breakdown for Tanks"
            desc="See base slab, walls, and cover slab volumes separately when using tank modes."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save & Reset"
            desc="Export an A4-friendly summary for records and reset inputs with one click."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Tank / Trench Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Accurate geometry for trenches and tanks with proper unit handling throughout.</WhyItem>
            <WhyItem>Built-in waste allowance helps avoid shortages during pours.</WhyItem>
            <WhyItem>Per-mode inputs reduce confusion and keep your workflow fast.</WhyItem>
            <WhyItem>Tank breakdown (base, walls, cover) supports estimating and approvals.</WhyItem>
            <WhyItem>Yardage helper (+5% / +10%) mirrors supplier rounding practices.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4
          id="how-to-use"
          className="text-lg font-semibold text-white mt-12 mb-3"
        >
          How to Use the Tank / Trench Concrete Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select a <span className="text-white">Mode</span>: <em>Trench</em>, <em>Rectangular Tank</em>, or <em>Circular Tank</em>.</li>
          <li>Choose one <span className="text-white">Unit</span> (m, cm, ft, or in). Enter all fields using that unit.</li>
          <li>Provide dimensions:
            <ul className="list-disc list-inside ml-5">
              <li><span className="text-white">Trench</span>: Length, Depth, and either Width (Rectangular) or Top/Bottom Widths (Trapezoidal).</li>
              <li><span className="text-white">Rectangular Tank</span>: Inner L×W×H plus Wall, Base, and optional Cover thickness.</li>
              <li><span className="text-white">Circular Tank</span>: Inner Diameter & Height plus Wall, Base, and optional Cover thickness.</li>
            </ul>
          </li>
          <li>Enter a <span className="text-white">Waste / Overage %</span> (commonly 5–10%).</li>
          <li>Click <span className="text-white">Calculate</span> to reveal <strong>Net</strong> and <strong>With Waste</strong> volumes in m³, yd³, and ft³.</li>
          <li>Use the <span className="text-white">Cubic Yards</span> helper (+5% / +10%) and <span className="text-white">Print / Save Calculations</span> for ordering.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Trench (Rectangular)"
            lines={["Volume = Length × Width × Depth"]}
            note="All dimensions are converted to a single base before multiplication."
          />
          <FormulaBlock
            title="2) Trench (Trapezoidal Section)"
            lines={[
              "Section Area = Depth × (Top Width + Bottom Width) ÷ 2",
              "Volume = Length × Section Area",
            ]}
          />
          <FormulaBlock
            title="3) Rectangular Tank (Outer − Inner)"
            lines={[
              "Outer: (L + 2t_w) × (W + 2t_w) × (H + t_base + t_top)",
              "Inner: L × W × H",
              "Net Concrete = Outer − Inner",
              "Breakdown: Base = Outer Footprint × t_base; Cover = Outer Footprint × t_top; Walls = Net − Base − Cover",
            ]}
          />
          <FormulaBlock
            title="4) Circular Tank (Outer − Inner)"
            lines={[
              "Outer: π × (D_out/2)² × (H + t_base + t_top), where D_out = D_in + 2t_w",
              "Inner: π × (D_in/2)² × H",
              "Net Concrete = Outer − Inner",
              "Breakdown: Base = π × (D_out/2)² × t_base; Cover = π × (D_out/2)² × t_top; Walls = Net − Base − Cover",
            ]}
          />
          <FormulaBlock
            title="5) Waste Allowance & Conversions"
            lines={[
              "With Waste = Net × (1 + Waste%)",
              "yd³ = m³ × 1.30795",
              "ft³ = m³ × 35.3147",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Can I calculate both rectangular and trapezoidal trenches?"
            a="Yes. Choose Rectangular to use a single width, or Trapezoidal to enter top and bottom widths; the calculator uses the correct area formula."
          />
          <FAQ
            q="How are tank volumes computed?"
            a="Both tank modes compute an outer concrete shell minus the inner water volume. We also show a breakdown for base slab, walls, and cover slab."
          />
          <FAQ
            q="Which units can I use?"
            a="Meters, centimeters, feet, or inches. Pick one unit and enter all dimensions consistently; the tool converts internally."
          />
          <FAQ
            q="What waste percentage should I add?"
            a="5–10% is common for over-excavation and placement losses. Use higher allowances if site access or formwork is challenging."
          />
          <FAQ
            q="How do I get cubic yards for ordering?"
            a="After calculating, yardage is shown along with +5% and +10% helpers to round orders to supplier increments."
          />
          <FAQ
            q="Can I print or save the results?"
            a="Yes. Use the Print / Save function to export an A4-friendly summary with inputs, volumes, breakdown, and yardage."
          />
          <FAQ
            q="Does the calculator handle reinforcement or water-tightness checks?"
            a="No. It focuses on concrete volume. Reinforcement, crack control, and waterproofing must follow your design and local codes."
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
