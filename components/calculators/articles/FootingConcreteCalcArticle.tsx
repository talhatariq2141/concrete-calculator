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

export default function FootingConcreteCalcArticle() {
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
          aria-controls="footing-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="footing-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ----------------- ARTICLE CONTENT ----------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Footing Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Square className="h-5 w-5" />}
            title="Rectangular / Square Footings"
            desc="Compute volume with L × W × D for isolated or strip footings—unit conversions handled internally."
          />
          <FeatureCard
            icon={<Circle className="h-5 w-5" />}
            title="Circular Footings"
            desc="Use diameter and depth to calculate π × r² × D for round pads and pier bases."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Multi-Unit Inputs"
            desc="Enter dimensions in meters, centimeters, feet, or inches; we convert to a common base for accuracy."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Waste Allowance Built-In"
            desc="Add any waste percentage (commonly 5–10%) to cover over-excavation and placement losses."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Display Units Toggle"
            desc="Show results in m³, yd³, or ft³ without re-entering values."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Gated Results"
            desc="Results appear after you click Calculate—keeps the form focused and prevents accidental reads."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save + Yardage Helper"
            desc="Export a tidy summary and view yd³ with +5% and +10% helpers for supplier rounding."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Footing Concrete Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Supports both rectangular/square and circular footings in one place.</WhyItem>
            <WhyItem>Accurate unit handling across m, cm, ft, and in—no manual conversions needed.</WhyItem>
            <WhyItem>Waste % included to reduce the risk of under-ordering due to over-excavation.</WhyItem>
            <WhyItem>Switch display units instantly for engineering checks or ready-mix ordering.</WhyItem>
            <WhyItem>Printable results streamline site approvals and purchase orders.</WhyItem>
          </ul>
        </div>

        {/* How-to (H4) */}
        <h4
          id="how-to-use"
          className="text-lg font-semibold text-white mt-12 mb-3"
        >
          How to Use the Footing Concrete Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
        <ol className="list-decimal list-inside space-y-2 text-slate-300">
          <li>Select the <span className="text-white">Rectangular / Square</span> or <span className="text-white">Circular</span> tab.</li>
          <li>Choose your <span className="text-white">input unit</span> (m, cm, ft, or in) and enter dimensions.</li>
          <li>Add a <span className="text-white">Waste Allowance (%)</span>—5–10% is typical for footings.</li>
          <li>Click <span className="text-white">Calculate</span> to reveal <strong>Net Volume</strong>, <strong>With Waste</strong>, and <strong>Waste Added</strong>.</li>
          <li>Set <span className="text-white">Show in</span> to view m³, yd³, or ft³, and use the yd³ helper (+5% / +10%) for ordering.</li>
          <li>Use <span className="text-white">Print / Save Calculations</span> to export a clean summary.</li>
        </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Rectangular / Square Footing"
            lines={["Volume = Length × Width × Depth (Thickness)"]}
            note="Inputs are converted to meters internally before multiplication to keep units consistent."
          />
          <FormulaBlock
            title="2) Circular Footing"
            lines={["Volume = π × r² × Depth, where r = Diameter ÷ 2"]}
          />
          <FormulaBlock
            title="3) Waste Allowance"
            lines={["Adjusted Volume = Raw Volume × (1 + Waste%)"]}
            note="Typical waste for footings is 5–10% depending on excavation, formwork, and placement method."
          />
          <FormulaBlock
            title="4) Display Conversions"
            lines={["1 m³ = 35.3147 ft³", "1 m³ = 1.30795 yd³", "yd³ = ft³ ÷ 27"]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="Can I calculate both rectangular and circular footings?"
            a="Yes. Use the tabs to switch between Rectangular/Square and Circular modes; each uses the appropriate geometric formula."
          />
          <FAQ
            q="Which input units are supported?"
            a="Meters (m), centimeters (cm), feet (ft), and inches (in). You can display results in m³, yd³, or ft³."
          />
          <FAQ
            q="How much waste should I add for footings?"
            a="5–10% is common to account for over-excavation, trench irregularities, and placement losses. Follow your project specifications."
          />
          <FAQ
            q="Why is there a ‘Show in’ selector?"
            a="It lets you view the same computed volume in cubic meters, cubic yards, or cubic feet, which helps when coordinating with suppliers."
          />
          <FAQ
            q="What does the yards helper do?"
            a="It provides yd³ with +5% and +10% additions to quickly round orders for ready-mix deliveries."
          />
          <FAQ
            q="Does this include rebar, cover, or mix design?"
            a="No. The calculator focuses on volume. Reinforcement and mix grade must follow your structural drawings and local codes."
          />
          <FAQ
            q="Can I print or save the calculation?"
            a="Yes. Use the Print / Save button to export a clean, A4-friendly summary of your inputs and results."
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
