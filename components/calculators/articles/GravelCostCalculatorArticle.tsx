"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Layers,
  DollarSign,
  Truck,
  Map
} from "lucide-react";

export default function GravelCostCalculatorArticle() {
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
          aria-controls="gravel-cost-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      <div
        id="gravel-cost-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Features of the Cost Estimator
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Map className="h-5 w-5" />}
            title="Dimensional Costing"
            desc="Estimate cost directly from your project's length, width, and depth."
          />
          <FeatureCard
            icon={<Calculator className="h-5 w-5" />}
            title="Known Quantity Costing"
            desc="Already know how many tons or yards you need? Jump straight to price mapping."
          />
          <FeatureCard
            icon={<Truck className="h-5 w-5" />}
            title="Delivery Included"
            desc="Add your local supplier's delivery fee to visualize the true final invoice."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Smart Inter-Conversions"
            desc="If you need 10 yards, but your supplier charges per ton, this calculator automatically bridges the gap using density."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          How to Estimate Gravel Costs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Choose your input method using the tabs: <span className="text-white">Calculate from Dimensions</span> OR <span className="text-white">Enter Known Quantity</span>.</li>
            <li>If using Dimensions, enter your <span className="text-white">Length, Width, Depth</span>, and an optional Waste Factor.</li>
            <li>If using Known Quantity, enter the number of <span className="text-white">Tons or Yards</span> you plan to buy.</li>
            <li>In the Pricing section, enter your supplier&apos;s <span className="text-white">Price</span> and select whether they charge per Ton or per Yard.</li>
            <li>Select the correct <span className="text-white">Gravel Density Type</span> (this is mandatory if the input metric and pricing metric don&apos;t match, to allow for weight-to-volume math).</li>
            <li>Click <span className="text-white">Calculate Free Estimate</span>.</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          FAQs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How much does gravel cost?"
            a="Depending on region and the type of crushed stone or landscaping gravel, expect to pay anywhere from $25 to $65 per ton, or $35 to $75 per cubic yard when buying in bulk."
          />
          <FAQ
            q="Is it cheaper to buy gravel by the ton or by the yard?"
            a="Neither is inherently 'cheaper'—they are just different measurement systems. Commercial quarries generally sell by the ton because they weigh trucks on scales. Local landscape yards often sell by the yard (volume) utilizing a front-end loader scoop. This calculator helps you compare quotes across both methods seamlessly."
          />
          <FAQ
            q="How much is delivery for gravel?"
            a="Most local suppliers charge a flat delivery drop fee ranging from $75 to $150 depending on distance from their facility to your house."
          />
          <FAQ
            q="Why do I need to enter a gravel type?"
            a="If you enter dimensions (which creates a Volume in yards) but your gravel supplier charges by Weight (Tons), the calculator needs to know the material density (how heavy it is) to translate your volume requirement into the correct ton-based price quote."
          />
        </div>
      </div>
    </section>
  );
}

function Calculator(props: React.SVGProps<SVGSVGElement>) { return <CalcIcon {...props} />; }

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
