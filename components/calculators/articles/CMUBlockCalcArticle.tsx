"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Calculator as CalcIcon,
  Ruler,
  BrickWall,
  Layers,
  ClipboardList,
  Printer,
  DollarSign,
  Scale,
} from "lucide-react";

/** CMUBlockCalcArticle.tsx
 *  Article component aligned to CMU Block Calculator.
 *  Follows the finalized article UI/UX pattern.
 */
export default function CMUBlockCalcArticle() {
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
      {/* Toggle button */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="cmu-block-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="cmu-block-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ─── ARTICLE CONTENT ─── */}

        <h2 className="text-2xl font-semibold text-white mb-4">
          What is a CMU Block Calculator?
        </h2>
        <p className="text-slate-300 mb-6 border border-slate-800 p-5 rounded-lg bg-slate-900/40">
          Our <strong className="text-white">CMU Block Calculator</strong> is a precise estimating tool designed to help you determine exactly how many Concrete Masonry Units (CMUs) you need for a concrete block wall project. It calculates the net wall area by deducting openings (like windows and doors) and factors in wastage allowance. Crucially, it doubles as a <strong className="text-white">CMU Block Cost Calculator</strong> and a <strong className="text-white">Cinder Block Cost Calculator</strong>, allowing you to estimate the total expense of your masonry project planning—from plain blocks to advanced add-ons like mortar, grout, labor, and delivery—all tailored for standard USA construction practice.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our CMU Block Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<BrickWall className="h-5 w-5" />}
            title="CMU Block Quantity Estimation"
            desc="Calculates exactly how many CMU blocks are needed based on your gross wall dimensions, block size, and net area."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="CMU Block Cost Calculator"
            desc="Functioning as a cinder block wall cost estimator, it computes the total cost of CMU blocks using your local price per block."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Openings Deduction"
            desc="Subtracts windows, doors, vents, and other structural openings for a highly accurate net wall area and material estimate."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Waste Allowance"
            desc="Adds a customizable extra block percentage for cuts, breakage, and jobsite waste to ensure you don't run short."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="Standard USA CMU Sizes"
            desc="Supports common U.S. block sizes including 4\u0022, 6\u0022, 8\u0022, 10\u0022, and 12\u0022 CMU widths, all conforming to standard 8×16 nominal face coverage."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Custom Block Size Support"
            desc="Lets advanced users calculate with custom block face dimensions if they are working with non-standard masonry units."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Advanced Cost Estimation"
            desc="Optionally includes labor, delivery, grout, mortar, and reinforcement costs for comprehensive masonry project planning."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Contractor and DIY Friendly"
            desc="Outputs a professional, easy-to-read printable summary containing all inputs, wall area breakdown, block quantities, and cost estimates."
          />
        </div>

        {/* Educational Content */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          CMU Blocks: Nominal vs Actual Dimensions
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <p className="text-slate-300 mb-4">
            A Concrete Masonry Unit (CMU) is the standard term for what many people call a concrete block or cinder block. When buying CMU blocks in the USA, they are sold by their <strong className="text-white">nominal dimensions</strong>, which includes the thickness of the mortar joint (typically 3/8 inch).
          </p>
          <ul className="space-y-4 text-slate-300">
            <WhyItem>
              <strong className="text-white">Standard Nominal Size:</strong> The industry standard is an <strong className="text-white">8x8x16 CMU block</strong>. This means it is 8 inches thick, 8 inches high, and 16 inches long including the mortar joint.
            </WhyItem>
            <WhyItem>
              <strong className="text-white">Actual Size:</strong> The actual manufactured dimensions are approximately 3/8 inch less. So, an 8×8×16 nominal block actually measures about <strong className="text-white">7-5/8\u0022 × 7-5/8\u0022 × 15-5/8\u0022</strong>.
            </WhyItem>
            <WhyItem>
              <strong className="text-white">Block Thickness vs Face Area:</strong> For standard 4\u0022, 6\u0022, 8\u0022, 10\u0022, and 12\u0022 width CMU blocks, the face size (height and length) stays the same (8\u0022 × 16\u0022). Therefore, the face coverage per block remains identical regardless of how thick the wall is.
            </WhyItem>
          </ul>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the CMU Block Estimator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Net Wall Area & Openings"
            lines={[
              "Wall Area = Length × Height",
              "Net Wall Area = Total Wall Area − Openings Area",
            ]}
          />
          <FormulaBlock
            title="2) Number of Blocks Needed"
            lines={[
              "Blocks Needed = Net Wall Area ÷ Block Face Area",
              "Blocks with Waste = Blocks Needed × (1 + Waste Percentage)",
            ]}
            note="Our calculator always rounds the final quantity up to the next whole block so you don't run short."
          />
          <FormulaBlock
            title="3) The Standard 8x8x16 CMU Rule"
            lines={[
              "One standard modular CMU block covers about 0.8889 sq ft.",
              "Approximate blocks needed = Net Wall Area × 1.125.",
              "Approximate blocks needed per 100 sq ft = 112.5 blocks."
            ]}
            note="Some contractors use shorthand rules like '18 blocks per 100 sq ft', however mathematically, 112.5 blocks is the accurate coverage."
          />
          <FormulaBlock
            title="4) Block Cost Estimation"
            lines={[
              "Block Cost = Final Blocks × Cost Per Block"
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="What is a CMU block?"
            a="CMU stands for Concrete Masonry Unit. It is a standard-size rectangular block used in building construction, commonly made from cast concrete (Portland cement and aggregate)."
          />
          <FAQ
            q="What does CMU stand for in construction?"
            a="CMU stands for Concrete Masonry Unit. While often called cinder blocks or concrete blocks, CMU is the proper technical term used by masons, engineers, and architects."
          />
          <FAQ
            q="How many CMU blocks do I need for a wall?"
            a="To find the number of blocks needed, calculate your net wall area in square feet and multiply by 1.125 (for standard 8x16 face blocks). Add a percentage for waste (usually 5% to 10%) and round up to the nearest whole block."
          />
          <FAQ
            q="How do I calculate CMU block cost?"
            a="Multiply your final block count (including waste allowance) by your local cost per block. Use our advanced cost inputs to add mortar, labor, and delivery to estimate the fully installed wall cost."
          />
          <FAQ
            q="What is the standard size of a CMU block in the USA?"
            a="The most common standard USA size is the 8x8x16 block. It has a nominal width of 8 inches, nominal height of 8 inches, and nominal length of 16 inches."
          />
          <FAQ
            q="What is the difference between nominal and actual CMU block size?"
            a="Nominal size includes the thickness of the standard 3/8 inch mortar joint used in construction. The actual physical size of the manufactured block is 3/8 inch smaller on all sides."
          />
          <FAQ
            q="Does this CMU Block Calculator subtract windows and doors?"
            a="Yes. You can add as many openings as you need. The calculator will determine the total openings area and subtract it from the gross wall area to provide an accurate net wall area."
          />
          <FAQ
            q="How much waste should I add when ordering CMU blocks?"
            a="We recommend adding at least 10% waste for standard projects to account for cuts around edges/openings and accidental breakage. For highly complex walls with many openings or corners, 15% is safer."
          />
          <FAQ
            q="Is this also a CMU Block Cost Calculator?"
            a="Absolutely. By entering the price per block and optional material/labor costs, the tool functions as an all-in-one CMU block cost calculator and estimator."
          />
          <FAQ
            q="Can I use this calculator as a cinder block cost calculator?"
            a="Yes. Cinder blocks and concrete blocks use the exact same dimensional standards in the USA. You can use this tool to estimate both cinder block quantities and costs."
          />
          <FAQ
            q="How many 8x8x16 blocks do I need per square foot?"
            a="You need exactly 1.125 blocks per square foot. Since one block covers 0.8889 square feet, dividing 1 by 0.8889 gives 1.125."
          />
          <FAQ
            q="Does block thickness affect wall face coverage?"
            a="No. Whether you use a 4\u0022, 6\u0022, 8\u0022, 10\u0022, or 12\u0022 thick CMU block, the front face (height and length) is almost always nominally 8\u0022 x 16\u0022. The coverage rate of 1.125 blocks per square foot remains exactly the same."
          />
        </div>
        {/* ─── END CONTENT ─── */}
      </div>
    </section>
  );
}

/* ─── Reusable UI atoms ─── */

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
      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-teal-400 flex-shrink-0" />
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
