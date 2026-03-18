"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  Circle,
  Layers,
  ClipboardList,
  Printer,
  Shovel,
  DollarSign,
} from "lucide-react";

export default function GravelCalculatorArticle() {
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
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="gravel-calc-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      <div
        id="gravel-calc-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Features
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Volume Estimation"
            desc="Calculates gravel volume in cubic feet, cubic yards, and cubic meters."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Weight Conversion"
            desc="Converts estimated gravel quantity into pounds, tons, and kilograms."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Density-Based Results"
            desc="Uses gravel type or custom density for more realistic estimates."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Cost Estimation"
            desc="Calculates total material cost from tons or cubic yards pricing."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Waste Factor Support"
            desc="Adds extra material for installation waste and uneven coverage."
          />
          <FeatureCard
            icon={<Circle className="h-5 w-5" />}
            title="Multiple Shapes"
            desc="Supports rectangular and optional circular or triangular project layouts."
          />
          <FeatureCard
            icon={<Shovel className="h-5 w-5" />}
            title="US and Metric Units"
            desc="Works with common American and metric measurement systems."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          How to Use This Calculator
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select your <span className="text-white">Project Shape</span> (Rectangle, Circle, or Triangle) and <span className="text-white">Dimension Unit</span>.</li>
            <li>Enter the <span className="text-white">Dimensions</span> (Length and Width, or Radius, etc.) and <span className="text-white">Depth</span> of your project area.</li>
            <li>Choose a <span className="text-white">Gravel Type</span> for an approximate density, or select Custom Density.</li>
            <li>Enter a <span className="text-white">Waste Factor</span> (usually 5% to 15%) to account for spills, settling, or uneven ground.</li>
            <li>(Optional) Enter the <span className="text-white">Price</span> per Ton or Cubic Yard to calculate estimated material costs.</li>
            <li>Click <span className="text-white">Calculate</span> to see the total volume, weight in tons and pounds, and total cost.</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formula
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Area Calculation"
            lines={[
              "Rectangle: Area = Length × Width",
              "Circle: Area = π × Radius²",
              "Triangle: Area = (Base × Height) / 2"
            ]}
          />
          <FormulaBlock
            title="2) Volume & Conversions"
            lines={[
              "Volume (cubic feet) = Area (sq ft) × Depth (ft)",
              "Volume (cubic yards) = Volume (cubic feet) ÷ 27"
            ]}
          />
          <FormulaBlock
            title="3) Weight Estimation"
            lines={[
              "Weight (lbs) = Volume (cubic feet) × Density (lb/ft³)",
              "Weight (tons) = Weight (lbs) ÷ 2000"
            ]}
          />
          <FormulaBlock
            title="4) Waste Factor Adjustment"
            lines={[
              "Adjusted Quantity = Base Quantity × (1 + Waste Percentage / 100)"
            ]}
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Gravel Density and Weight Assumptions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6 text-slate-300">
          <p>
            Because gravel types, size, and moisture content vary, the weight of gravel per cubic yard can also fluctuate. This calculator uses typical density values to estimate weight:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>General Gravel:</strong> ~105 lb/ft³</li>
            <li><strong>Pea Gravel:</strong> ~100 lb/ft³</li>
            <li><strong>Crushed Stone:</strong> ~105 lb/ft³</li>
          </ul>
          <p className="text-sm text-slate-400 mt-2">
            * Note: Actual density varies by stone type, moisture, and compaction. If you know the exact density from your supplier, select "Custom Density" to input it directly.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          FAQs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How do I calculate how much gravel I need?"
            a="Measure the length, width, and desired depth of your project. Multiply length by width to get the area, then multiply by the depth to get the volume. Use our Gravel Calculator to easily convert this into cubic yards and tons based on proper density."
          />
          <FAQ
            q="How many cubic yards of gravel do I need?"
            a="Once you know your volume in cubic feet, divide it by 27 to get cubic yards. A project area of 10 ft by 10 ft with a 3-inch depth needs approximately 0.93 cubic yards."
          />
          <FAQ
            q="How many tons of gravel do I need?"
            a="A cubic yard of typical gravel weighs about 1.4 to 1.5 tons (2,800 to 3,000 lbs). You calculate the tons needed by taking your cubic foot volume, multiplying it by the material's density (e.g., 105 lbs/ft³), and dividing by 2000."
          />
          <FAQ
            q="How deep should gravel be for landscaping?"
            a="For most landscape beds and decorative coverage, a depth of 2 to 3 inches is recommended to prevent weed growth and provide solid coverage."
          />
          <FAQ
            q="Does gravel weight vary by type?"
            a="Yes. Smaller, smoother stones like pea gravel pack differently than angular crushed stone. Additionally, damp gravel will weigh more than dry gravel."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string; }) {
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

function FormulaBlock({ title, lines, note }: { title: string; lines: string[]; note?: string; }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-white font-medium mb-2">
        <CheckCircle2 className="h-4 w-4 text-teal-400" />
        <span>{title}</span>
      </div>
      <ul className="list-disc list-inside text-slate-300">
        {lines.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      {note && <p className="text-xs text-slate-400 mt-2">{note}</p>}
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
