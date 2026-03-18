"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Layers,
  ClipboardList,
  Shovel,
  DollarSign,
  Truck,
  Map
} from "lucide-react";

export default function GravelDrivewayCalculatorArticle() {
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
          aria-controls="gravel-driveway-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      <div
        id="gravel-driveway-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Features of the Driveway Gravel Calculator
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Map className="h-5 w-5" />}
            title="Driveway Material Estimation"
            desc="Calculates gravel needed for driveway base or top layers."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Tons and Yards Output"
            desc="Shows results in the most commonly used purchasing units."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Cost Planning"
            desc="Estimates material budget for driveway gravel projects."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Waste Adjustment"
            desc="Helps account for settling, compaction, and extra coverage."
          />
          <FeatureCard
            icon={<Truck className="h-5 w-5" />}
            title="Delivery Fee Support"
            desc="Easily include your supplier's delivery fee into your total estimate."
          />
          <FeatureCard
            icon={<Shovel className="h-5 w-5" />}
            title="Material Density Presets"
            desc="Choose between general gravel, pea gravel, crushed stone, or use custom density."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          How to Use the Calculator
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select the <span className="text-white">Unit</span> for your measurements (feet, inches, meters).</li>
            <li>Enter the <span className="text-white">Driveway Length</span> and <span className="text-white">Width</span>.</li>
            <li>Input the <span className="text-white">Gravel Layer Depth</span> based on which layer you are calculating (e.g., base layer vs top layer).</li>
            <li>Select the <span className="text-white">Gravel Type</span> or input a Custom Density for weight estimation.</li>
            <li>Add a <span className="text-white">Waste Factor</span> (10% is standard) to account for gravel compacting and settling into the soil.</li>
            <li>(Optional) Input the <span className="text-white">Material Price</span> and a <span className="text-white">Delivery Fee</span> for total cost estimation.</li>
            <li>Click <span className="text-white">Calculate</span>.</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Volume Requirements"
            lines={[
              "Area = Length × Width",
              "Volume = Area × Depth",
              "Volume in Cubic Yards = Volume in Cubic Feet ÷ 27"
            ]}
          />
          <FormulaBlock
            title="2) Tonnage Calculation"
            lines={[
              "Weight = Volume (Cubic Feet) × Material Density (lb/ft³)",
              "Tons = Weight (lbs) ÷ 2000"
            ]}
          />
          <FormulaBlock
            title="3) Total Project Cost"
            lines={[
              "Material Cost = Estimated Tons × Price per Ton",
              "Total Cost = Material Cost + Delivery Fee"
            ]}
            note="If you buy by the cubic yard, substitute Estimated Tons with Estimated Cubic Yards."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          FAQs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How much gravel do I need for my driveway?"
            a="It depends on the length and width of your driveway, and the depth of the gravel layers. Simply measure your driveway's footprint and enter the desired depth into our calculator to get an accurate estimate in tons and cubic yards."
          />
          <FAQ
            q="How deep should gravel be for a driveway?"
            a="A typical gravel driveway consists of two main layers: a base layer of larger crushed stone (about 4 to 6 inches deep) and a top layer of smaller surface gravel (about 2 to 3 inches deep). You should calculate the material for each layer separately."
          />
          <FAQ
            q="How many tons of driveway gravel do I need?"
            a="Tonnage relies on the total volume in cubic feet and the density of your gravel. On average, a cubic yard of crushed stone driveway gravel weighs about 1.4 to 1.5 tons. Use our calculator to automate the math."
          />
          <FAQ
            q="How much does driveway gravel cost?"
            a="Depending on your region and the type of crushed stone or gravel, costs typically range from $25 to $65 per ton or $35 to $75 per cubic yard. Expect to pay extra for delivery."
          />
          <FAQ
            q="What is the best gravel depth for a driveway base?"
            a="A strong driveway base usually requires 4 to 6 inches of larger crushed stone (like #3 or #4 stone) to provide a stable, well-draining foundation for the smaller top surface layer."
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
