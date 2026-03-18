"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Layers,
  ClipboardList,
  Shovel,
  DollarSign,
  Package,
} from "lucide-react";

export default function PeaGravelCalculatorArticle() {
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
          aria-controls="pea-gravel-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      <div
        id="pea-gravel-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Features of the Pea Gravel Estimator
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Shovel className="h-5 w-5" />}
            title="Decorative Gravel Estimation"
            desc="Calculates pea gravel for beds, pathways, and landscape borders."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Coverage Planning"
            desc="Helps estimate area coverage at different gravel depths."
          />
          <FeatureCard
            icon={<Package className="h-5 w-5" />}
            title="Bag and Bulk Estimates"
            desc="Shows bulk cubic yards and estimates individual bag purchasing quantities."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Total Cost Calculations"
            desc="Easily estimate total cost whether buying per bag, per ton, or per cubic yard."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Waste Factors"
            desc="Automatically account for material spread and settling via simple waste percentages."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          How to Use the Pea Gravel Calculator
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select your <span className="text-white">Measurement Unit</span>.</li>
            <li>Enter the <span className="text-white">Length</span> and <span className="text-white">Width</span> of the garden bed or pathway.</li>
            <li>Enter the desired <span className="text-white">Pea Gravel Depth</span> (typically 2 inches for pathways, 3 inches for weed control buffers).</li>
            <li>Enter the <span className="text-white">Bag Size</span> if buying bags (usually 0.5 cf bags weigh about 50 lbs).</li>
            <li>Input your <span className="text-white">Material Price</span> based on bag, ton, or cubic yard to calculate estimated cost.</li>
            <li>Click <span className="text-white">Calculate</span>.</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Pea Gravel Formulas
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Volume Requirements"
            lines={[
              "Area = Length × Width",
              "Volume = Area × Depth",
            ]}
          />
          <FormulaBlock
            title="2) Weight Estimation"
            lines={[
              "Pea Gravel Density ≈ 100 lb / cubic foot",
              "Weight = Volume (Cubic Feet) × 100"
            ]}
          />
          <FormulaBlock
            title="3) Bag Calculation"
            lines={[
              "Total Bags = Total Weight ÷ Weight per Bag",
            ]}
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          FAQs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How much pea gravel do I need?"
            a="Measure your landscaping area and input it along with a standard 2-3 inch depth into our calculator to determine the required cubic yards, bags, and tonnage."
          />
          <FAQ
            q="How deep should pea gravel be for landscaping?"
            a="For most garden beds and weed prevention over landscape fabric, 2 to 3 inches is ideal. For frequently walked paths, 2.5 inches gives a solid feel while avoiding loose slipping."
          />
          <FAQ
            q="How many bags of pea gravel do I need?"
            a="A typical 0.5 cubic foot bag of pea gravel weighs about 50 lbs. If you need 1 cubic yard (which is 27 cubic feet), you would need 54 of these bags."
          />
          <FAQ
            q="Is pea gravel sold by yard or ton?"
            a="Bulk pea gravel is traditionally sold by the cubic yard or ton at local soil/aggregate yards. For smaller projects, it is sold by the bag at home improvement stores."
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
