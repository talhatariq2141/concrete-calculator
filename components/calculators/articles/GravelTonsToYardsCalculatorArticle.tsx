"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Layers,
  ArrowRightLeft,
  Settings,
  Scale
} from "lucide-react";

export default function GravelTonsToYardsCalculatorArticle() {
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
          aria-controls="gravel-tons-yards-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      <div
        id="gravel-tons-yards-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Features of this Converter
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<ArrowRightLeft className="h-5 w-5" />}
            title="Bi-Directional Conversion"
            desc="Easily swap between translating Tons to Yards, or Yards to Tons."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="Material Exactness"
            desc="Conversion relies on accurate densities rather than rough averages."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Density Presets"
            desc="Quickly choose between general gravel, pea gravel, and crushed stone."
          />
          <FeatureCard
            icon={<Settings className="h-5 w-5" />}
            title="Custom Density Control"
            desc="Input your own material's exact density if provided by your local supplier."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          How to Convert Tons to Yards (and vice-versa)
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select the <span className="text-white">Conversion Mode</span> by clicking the swap arrow button. Decide whether you are starting with "Tons" or "Yards".</li>
            <li>Input the <span className="text-white">Quantity</span> you need to convert.</li>
            <li>Select the <span className="text-white">Gravel Type</span>. This adjusts the density (weight-per-volume) that drives the conversion formula.</li>
            <li>(Optional) If you know the exact weight of your gravel, select "Custom Density" and enter its weight in <span className="text-white">lb/ft³</span>.</li>
            <li>Click <span className="text-white">Convert</span> to seamlessly translate the measurement.</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Understanding the Math
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <p>
            You cannot convert volume (Cubic Yards) directly to weight (Tons) without knowing the <strong>Density</strong> of the material. Different gravel types pack differently. 
            For example, General Gravel is usually around 105 pounds per cubic foot.
          </p>
          <FormulaBlock
            title="Calculating Tons per Cubic Yard"
            lines={[
              "1 Cubic Yard = 27 Cubic Feet",
              "Weight of 1 Cubic Yard (lbs) = 27 × Density (lb/ft³)",
              "Tons per Cubic Yard = Weight of 1 Cubic Yard (lbs) ÷ 2000"
            ]}
          />
          <FormulaBlock
            title="Tons to Yards Conversion"
            lines={[
              "Yards = Input Tons ÷ Tons per Cubic Yard",
            ]}
          />
          <FormulaBlock
            title="Yards to Tons Conversion"
            lines={[
              "Tons = Input Yards × Tons per Cubic Yard",
            ]}
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          FAQs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How many tons are in a cubic yard of gravel?"
            a="On average, a cubic yard of standard gravel weighs roughly 1.4 tons (2,800 lbs). However, this can range between 1.3 and 1.5 tons depending on stone type, rock size, and moisture content."
          />
          <FAQ
            q="Is gravel sold by the ton or by the yard?"
            a="It depends entirely on your local supplier. Some landscape yards sell by volume (the cubic yard bucket of their loader), while commercial quarries often weigh trucks on a scale and sell strictly by the ton."
          />
          <FAQ
            q="Why does gravel type matter for conversion?"
            a="Since a ton is a measure of weight and a yard is a measure of space, you must know how 'heavy' the gravel is to convert them. Dense, solid crushed stone will yield fewer yards out of one ton than lighter volcanic rock or mulch."
          />
          <FAQ
            q="How many yards is 5 tons of gravel?"
            a="Assuming typical gravel at 1.4 tons per yard: 5 tons divided by 1.4 equals approximately 3.57 cubic yards."
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
