
"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ruler, Calculator as CalcIcon, Clock, Layers, Scale, ClipboardList } from "lucide-react";

export default function SlabConcreteCalcArticle() {
  // --- NEW: collapse/expand state + height animation ---
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  // Measure content height whenever open toggles or window resizes (for responsive layouts)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      if (open) {
        // Temporarily set height to 'auto' to capture full content height, then animate to that value
        el.style.height = "auto";
        const full = el.scrollHeight;
        setHeight(full);
        // Re-apply the measured height so CSS transition runs from current -> full
        requestAnimationFrame(() => {
          el.style.height = `${full}px`;
        });
      } else {
        // Collapse to 0
        setHeight(0);
        el.style.height = `0px`;
      }
    };

    measure();
    // keep height correct on viewport changes while open
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

  // After the expand transition finishes, set height to 'auto' to allow internal content changes without snapping
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== "height") return;
      if (open) {
        el.style.height = "auto";
      }
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [open]);

  return (
    <section className="mt-10 w-full mx-auto max-w-8xl text-slate-200 font-poppins">
      {/* NEW: top-right toggle button */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="slab-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* NEW: collapsible wrapper around the original article body */}
      <div
        id="slab-article-collapse"
        ref={wrapperRef}
        className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[10000px]"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* --- ORIGINAL CONTENT STARTS HERE (unchanged) --- */}

        {/* Key Features grid — matches the “cards” structure in your screenshots */}
        <h2 className="text-2xl font-semibold text-white mb-4">Key Features of Our Free Slab Concrete Calculator</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Multi-Unit Inputs"
            desc="Enter length & width in feet/meters and thickness in inches/mm/cm. The calculator converts everything automatically."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Accurate Volume Results"
            desc="Get precise cubic yards (yd³) and cubic meters (m³) for any slab dimension and thickness."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Waste Allowance"
            desc="Add an optional overage factor (commonly 5–10%) so you order enough concrete for spillage and grading."
          />
          <FeatureCard
            icon={<Clock className="h-5 w-5" />}
            title="Real-Time Calculation"
            desc="Results update instantly as you type—no page reloads, no waiting."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="Mix Guidance (Informational)"
            desc="Displays typical mix guidance for slabs (e.g., 3000–4000 PSI / 20–28 MPa)—use your engineer’s spec when available."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Clear Result Summary"
            desc="Clean results with unit labels and formatted values that are easy to read on site or in meetings."
          />
        </div>

        {/* Why Choose block — mirrors your second screenshot list style */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">Why Choose Our Free Slab Calculator?</h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Completely free to use — no sign-up, subscriptions, or limits on daily calculations.</WhyItem>
            <WhyItem>Construction-grade precision with consistent unit conversions and decimal handling.</WhyItem>
            <WhyItem>Fast entry workflow with responsive inputs optimized for desktop, tablet, and mobile.</WhyItem>
            <WhyItem>Real-time results with optional waste margin so orders don’t come up short.</WhyItem>
            <WhyItem>Clear, share-friendly outputs in both cubic yards and cubic meters for suppliers and crews.</WhyItem>
          </ul>
        </div>

        {/* How To — must be H4 per your rule */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">How to Use the Slab Concrete Calculator</h4>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">

            <li>
              Enter <span className="text-white">Length</span> and <span className="text-white">Width</span> of the slab.
            </li>
            <li>
              Enter <span className="text-white">Thickness</span> (commonly 4 in / 100 mm for light-duty slabs).
            </li>
            <li>
              (Optional) Add a <span className="text-white">Waste/Overage %</span> to cover spillage and uneven sub-base.
            </li>
            <li>
              View instant results in <span className="text-white">cubic yards (yd³)</span> and{" "}
              <span className="text-white">cubic meters (m³)</span>.
            </li>
            <li>Round up when ordering ready-mix; suppliers typically deliver in 0.5 or 1.0 yd³ increments.</li>
          </ol>
        </div>

        {/* Formulas Used */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">Formulas Used in the Calculator</h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Core Volume Formula"
            lines={[
              "Volume = Length × Width × Thickness",
              "All dimensions are internally converted to the same base unit before multiplying.",
            ]}
            note="If you enter thickness in inches or millimeters, the calculator converts it to feet or meters to match the length and width before computing volume."
          />
          <FormulaBlock
            title="2) Unit Conversions"
            lines={["1 ft = 12 in", "1 m = 100 cm = 1000 mm", "1 yd³ = 27 ft³", "1 m³ ≈ 1.30795 yd³"]}
          />
          <FormulaBlock
            title="3) Waste / Overage"
            lines={["Adjusted Volume = Raw Volume × (1 + Waste%)"]}
            note="Common practice is 5%–10% depending on site access, crew experience, pump line losses, and slab geometry."
          />
        </div>

        {/* FAQs — SEO-focused, mirrors your FAQ block layout */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">Frequently Asked Questions</h3>
        <div className="rounded-lg  border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How accurate is the Slab Concrete Calculator?"
            a="It uses straightforward geometry with strict unit conversion to provide reliable cubic yard and cubic meter estimates. Always round up when placing an order and consider a 5–10% waste allowance."
          />
          <FAQ
            q="What slab thickness should I use?"
            a="Light patios and walkways often use 4 in (100 mm). Driveways or heavier loads may require 5–6 in (125–150 mm) or engineer-specified thickness. Always follow local codes and structural drawings."
          />
          <FAQ
            q="Does the calculator support both imperial and metric units?"
            a="Yes. Enter dimensions in feet/meters and thickness in inches/mm/cm—the tool converts everything and outputs both yd³ and m³."
          />
          <FAQ
            q="How do I add extra concrete for waste and uneven sub-base?"
            a="Use the Waste/Overage field (e.g., 5–10%). The calculator multiplies the raw volume by this factor to show an adjusted order quantity."
          />
          <FAQ
            q="Will this tell me how many concrete trucks I need?"
            a="You can divide the total cubic yards by your supplier’s truck capacity (commonly 8–10 yd³). Order policies vary—confirm with your ready-mix provider."
          />
          <FAQ
            q="Can I use this for irregular or multiple slab sections?"
            a="For L-shapes or complex layouts, break the area into rectangles, calculate each section, then sum the volumes. Add a suitable waste allowance before ordering."
          />
          <FAQ
            q="Does the calculator include reinforcement or mix design?"
            a="No—those are specified by your engineer or code official. The tool focuses on concrete volume; reinforcement, fiber, and mix design must follow project specifications."
          />
        </div>

        {/* --- ORIGINAL CONTENT ENDS HERE --- */}
      </div>
    </section>
  );
}

/* ---------- Reusable UI bits (unchanged) ---------- */

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
