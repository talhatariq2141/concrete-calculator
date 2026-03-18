"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Layers,
  Droplets,
  Package,
  Fish
} from "lucide-react";

export default function AquariumGravelCalculatorArticle() {
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
          aria-controls="aquarium-gravel-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      <div
        id="aquarium-gravel-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">
          Features of the Aquarium Gravel Calculator
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Fish className="h-5 w-5" />}
            title="Tank Shape Support"
            desc="Calculates substrate needed for Rectangular, Bow Front, and Cylinder tanks."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Variable Depth Control"
            desc="Easily adjust for deeper plant beds, or shallower decorative coverage."
          />
          <FeatureCard
            icon={<Droplets className="h-5 w-5" />}
            title="Weight Translations"
            desc="Provides estimates in both Pounds (lbs) and Kilograms (kg) for easy purchasing universally."
          />
          <FeatureCard
            icon={<Package className="h-5 w-5" />}
            title="Shopping Cart Math"
            desc="Convert the total weight into exact number of bags needed (e.g., 5lb bags)."
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          How to Use the Calculator
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select the <span className="text-white">Unit</span> (Inches or Centimeters).</li>
            <li>Select your <span className="text-white">Tank Shape</span> (Rectangle, Bow Front, or Cylinder).</li>
            <li>Input the exact <span className="text-white">Tank Dimensions</span> corresponding to your shape choice (e.g. Length and Width).</li>
            <li>Decide on your <span className="text-white">Desired Gravel Depth</span> (typically 1.5 to 2.5 inches for a healthy ecosystem).</li>
            <li>Enter the <span className="text-white">Typical Bag Size</span> you plan to buy (like 5 lb or 20 lb bags) so the calculator can tell you how many to grab.</li>
            <li>Click <span className="text-white">Calculate Amount</span> to view your needs.</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Understanding Aquarium Substrate Rules
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <p>
            Traditional calculator math for aquariums suggests about <strong>1 to 1.5 pounds of gravel per gallon of water</strong>. 
            However, that estimate breaks down for unusually shaped aquariums (like very tall cylinders or shallow frag tanks).
          </p>
          <p>
            A much more accurate method is calculating the <strong>square area of the tank's footprint</strong> and multiplying it by your desired <strong>substrate depth</strong> to find the volume, then converting that volume to weight based on gravel density.
          </p>
          <FormulaBlock
            title="The Mathematical Formula"
            lines={[
              "Volume (Cubic Inches) = Bottom Area × Depth",
              "Weight (lbs) = Volume (Cubic Inches) × 0.0578 lb/in³",
              "Total Bags = Weight (lbs) ÷ Bag Size"
            ]}
          />
        </div>

        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          FAQs
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How deep should aquarium gravel be?"
            a="For a standard fish-only or artificial plant tank, 1.5 to 2 inches is ideal. It provides enough depth to hold decorations and beneficial bacteria without building up toxic gas pockets. For heavy planted tanks with root feeders, you may need 2.5 to 3 inches."
          />
          <FAQ
            q="How many pounds of gravel do I need for a 10 gallon tank?"
            a="A standard 10-gallon tank (20&quot; × 10&quot;) needs about 15 to 20 pounds of gravel to achieve a ~1.5 to 2 inch depth. "
          />
          <FAQ
            q="How many pounds of gravel per gallon?"
            a="As a general rule of thumb, most aquarists recommend 1 to 1.5 pounds of gravel per gallon of water for standard rectangular tanks."
          />
          <FAQ
            q="Does substrate type affect the weight?"
            a="Yes. Volcanic planted soils (like Fluval Stratum) are very lightweight and porous, so they weigh less per cubic inch than dense, solid epoxy-coated gravel or pure sand."
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
