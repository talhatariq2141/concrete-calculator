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

/** CinderBlockCalcArticle.tsx
 *  Article component aligned to Cinder Block Calculator.
 *  Follows the finalized article UI/UX pattern.
 */
export default function CinderBlockCalcArticle() {
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
          aria-controls="cinderblock-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="cinderblock-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* ─── ARTICLE CONTENT ─── */}

        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Cinder Block Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<BrickWall className="h-5 w-5" />}
            title="Block Quantity Estimator"
            desc="Calculates exactly how many cinder blocks you need based on wall dimensions, selected block size, and openings — with waste allowance included."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Cinder Block Cost Calculator"
            desc="Estimates total block cost using your price per block. Works as a full cinder block cost calculator with mortar, labor, delivery, and optional add-ons."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Mortar Estimator"
            desc="Estimates mortar bags required for standard CMU block wall installation. Supports 60 lb, 80 lb, and custom coverage inputs."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Wall Openings Deduction"
            desc="Add multiple doors, windows, vents, or gates as openings. The calculator deducts their area for a more accurate net block count."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Waste Allowance Control"
            desc="Includes a fully adjustable waste percentage (default 5%) with quick presets for simple, moderate, and complex wall layouts."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Installed Wall Cost Estimator"
            desc="Estimates total installed cinder block wall cost by combining block cost, mortar, labor, delivery, tax, and optional add-ons like grout, rebar, and footing."
          />
          <FeatureCard
            icon={<Scale className="h-5 w-5" />}
            title="USA Standard Block Sizes"
            desc="Supports common U.S. nominal CMU block sizes including 4×8×16, 6×8×16, 8×8×16, 10×8×16, 12×8×16, and half block options."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Print / Save Results"
            desc="Print or save your full calculation results as a PDF for project documentation, contractor quotes, or material ordering reference."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Use Our Cinder Block Calculator as Your Cinder Block Cost Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Purpose-built for U.S. cinder block walls using standard nominal dimensions and ASTM conventions.</WhyItem>
            <WhyItem>Serves as both a block quantity estimator <em>and</em> a cinder block cost calculator in one tool.</WhyItem>
            <WhyItem>Supports multiple wall openings — windows, doors, vents, and gates — for a more accurate net block count.</WhyItem>
            <WhyItem>Mortar estimation built-in: standard 80 lb and 60 lb bag sizes, or enter custom coverage per bag.</WhyItem>
            <WhyItem>Optional add-on cost inputs for grout, rebar, footing, waterproofing, and finish work help you plan a complete project budget.</WhyItem>
            <WhyItem>Step-by-step calculation breakdown shown after every result so you can audit the numbers.</WhyItem>
          </ul>
        </div>

        {/* How to Use */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Cinder Block Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Select your <span className="text-white">unit system</span> — imperial (ft) or metric (m).</li>
            <li>Enter <span className="text-white">wall length</span> and <span className="text-white">wall height</span> as gross dimensions.</li>
            <li>Select your <span className="text-white">nominal block size</span> from the preset list, or choose Custom to enter your own dimensions.</li>
            <li>Set the <span className="text-white">mortar bag size</span> and <span className="text-white">waste percentage</span> (default: 80 lb bag, 5% waste).</li>
            <li>Add any <span className="text-white">openings</span> (doors, windows, vents) to deduct from the wall area.</li>
            <li>Optionally enter <span className="text-white">cost per block, mortar bag price, labor rate</span>, delivery, and tax to get a full cost estimate.</li>
            <li>Click <span className="text-white">Calculate</span> to see block count, mortar bags, and a full cost breakdown.</li>
          </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in This Cinder Block Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Gross Wall Area"
            lines={["Gross Wall Area = Wall Length × Wall Height"]}
            note="Results in square feet (imperial) or square meters (metric)."
          />
          <FormulaBlock
            title="2) Net Wall Area"
            lines={[
              "Opening Area = Width × Height × Quantity  (for each opening)",
              "Net Wall Area = Gross Wall Area − Sum of All Opening Areas",
            ]}
            note="Net area must be greater than zero to proceed."
          />
          <FormulaBlock
            title="3) Block Quantity"
            lines={[
              "Block Face Area = Nominal Length × Nominal Height  (in ft²)",
              "Blocks per ft² = 1 / Block Face Area",
              "Blocks Before Waste = Net Area × Blocks per ft²",
              "Waste Blocks = Blocks Before Waste × (Waste% / 100)",
              "Final Total Blocks = ⌈ Blocks Before Waste + Waste Blocks ⌉",
            ]}
            note="For the standard 8×8×16 nominal block: 1 / (16/12 × 8/12) = 1.125 blocks per ft²."
          />
          <FormulaBlock
            title="4) Mortar Estimation"
            lines={[
              "80 lb bag: Bags = ⌈ Final Blocks / 13 ⌉",
              "60 lb bag: Bags = ⌈ Final Blocks / 9.75 ⌉",
              "Custom: Bags = ⌈ Final Blocks / Custom Coverage ⌉",
            ]}
            note="Mortar coverage varies by joint thickness, block size, and mason technique."
          />
          <FormulaBlock
            title="5) Cost Estimation"
            lines={[
              "Block Cost = Final Blocks × Cost per Block",
              "Mortar Cost = Mortar Bags × Price per Mortar Bag",
              "Material Cost = Block Cost + Mortar Cost + Add-On Costs",
              "Labor Cost = Net Wall Area × Labor Cost per ft²",
              "Tax = Material Cost × (Tax% / 100)",
              "Installed Cost = Material Cost + Labor + Delivery + Tax",
            ]}
          />
        </div>

        {/* What is cinder block vs concrete block */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Cinder Block vs Concrete Block: What You Should Know
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 text-slate-300 space-y-3">
          <p>
            The terms <strong className="text-white">cinder block</strong> and <strong className="text-white">concrete block</strong> are often used interchangeably, but they are technically different. Traditional cinder blocks used cinders from coal combustion as aggregate, while modern masonry units — officially called <strong className="text-white">CMUs (Concrete Masonry Units)</strong> — use sand, gravel, or other aggregates.
          </p>
          <p>
            Today, almost all blocks sold at U.S. home improvement and building supply stores are concrete blocks or CMUs. This calculator is marketed as a <strong className="text-white">cinder block calculator</strong> to reflect how most homeowners search for this tool, but it is fully accurate for modern concrete blocks.
          </p>
          <p>
            Standard U.S. nominal block dimensions are <strong className="text-white">8 in × 8 in × 16 in</strong>. The actual dimensions are approximately <strong className="text-white">7-5/8 × 7-5/8 × 15-5/8 in</strong> — 3/8 in less in each direction to accommodate the mortar joint.
          </p>
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How many cinder blocks do I need for a wall?"
            a="Divide the net wall area (length × height minus openings) by the block face area. For a standard 8×8×16 nominal block, you need 1.125 blocks per square foot. Add a 5–10% waste allowance and always round up to whole blocks."
          />
          <FAQ
            q="How do I calculate cinder block cost?"
            a="Multiply the total number of blocks by the price per block. Our cinder block cost calculator adds mortar, labor, delivery, and optional extras like grout and rebar to give you a complete project estimate."
          />
          <FAQ
            q="What size is a standard cinder block in the USA?"
            a="The most common nominal size is 8 × 8 × 16 inches. Actual dimensions are approximately 7-5/8 × 7-5/8 × 15-5/8 inches. Common thicknesses are 4, 6, 8, 10, and 12 inches."
          />
          <FAQ
            q="How many 8×8×16 cinder blocks are in a square foot?"
            a="There are 1.125 standard 8×8×16 nominal blocks per square foot. This is derived from the face area: (16/12) × (8/12) = 0.888 ft², and 1 / 0.888 ≈ 1.125 blocks."
          />
          <FAQ
            q="How much mortar do I need for cinder blocks?"
            a="A standard rule of thumb is that one 80 lb bag of mortar covers approximately 13 standard blocks. For 60 lb bags, expect around 9–10 blocks per bag. These are estimates; actual usage varies by joint thickness and technique."
          />
          <FAQ
            q="Does this cinder block calculator include waste?"
            a="Yes. The default waste factor is 5%, with preset options for 7% (moderate) and 10% (complex). You can also enter any custom percentage."
          />
          <FAQ
            q="Can this tool be used as a cinder block cost calculator?"
            a="Yes. Enter the cost per block, price per mortar bag, labor rate, delivery, and tax to get a complete material and installed wall cost estimate. This tool is designed to function as both a quantity estimator and a cinder block cost calculator."
          />
          <FAQ
            q="What is the difference between a cinder block and a concrete block?"
            a="Traditional cinder blocks used coal cinders as aggregate; modern blocks use sand or gravel and are technically CMUs (Concrete Masonry Units). Most blocks sold in the U.S. today are concrete blocks, but both terms are used interchangeably in everyday usage."
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
