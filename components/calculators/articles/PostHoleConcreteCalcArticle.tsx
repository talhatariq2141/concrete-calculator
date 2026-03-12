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

/** PostHoleConcreteCalcArticle.tsx
 *  Article component aligned to Post Hole Concrete Calculator.
 *  Matches the finalized article UI/UX pattern.
 */
export default function PostHoleConcreteCalcArticle() {
  // --- collapse/expand (identical to existing articles) ---
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
          aria-controls="posthole-article-collapse"
          className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-teal-400 transition-colors"
        >
          {open ? "Hide Guide" : "Learn more"}
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        id="posthole-article-collapse"
        ref={wrapperRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-out"
        style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        {/* --------------- ARTICLE CONTENT --------------- */}

        {/* H2 */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Key Features of Our Free Post Hole Concrete Calculator
        </h2>

        {/* Features grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<Circle className="h-5 w-5" />}
            title="Accurate Concrete Volume Calculation"
            desc="Calculates concrete volume for round and square post holes using precise cylindrical and rectangular geometry."
          />
          <FeatureCard
            icon={<Layers className="h-5 w-5" />}
            title="Net Concrete Estimate"
            desc="Subtracts post displacement from the hole volume for a more accurate material estimate, reducing waste and over-ordering."
          />
          <FeatureCard
            icon={<CalcIcon className="h-5 w-5" />}
            title="Bag Count Calculator"
            desc="Converts total concrete volume into estimated 40 lb, 60 lb, and 80 lb concrete bag counts so you know exactly how many bags to buy."
          />
          <FeatureCard
            icon={<Shovel className="h-5 w-5" />}
            title="Gravel Base Estimator"
            desc="Estimates how much gravel is needed for a drainage base below each post hole, improving long-term stability."
          />
          <FeatureCard
            icon={<Ruler className="h-5 w-5" />}
            title="Smart Hole Size Recommendations"
            desc="Suggests hole diameter and embedment depth based on post size, post type, frost depth, and the one-third rule."
          />
          <FeatureCard
            icon={<ClipboardList className="h-5 w-5" />}
            title="Waste Factor Adjustment"
            desc="Adds a customizable waste allowance (typically 5–15%) to help avoid running short on concrete or gravel."
          />
          <FeatureCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Cost Estimation"
            desc="Calculates concrete, gravel, labor, and delivery costs for a more complete project budget in Advanced mode."
          />
          <FeatureCard
            icon={<Printer className="h-5 w-5" />}
            title="Quick & Advanced Modes + Print"
            desc="Serves both DIY users who want a fast estimate and professionals who need detailed calculations. Includes a print/save feature."
          />
        </div>

        {/* Why Choose */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Why Choose Our Post Hole Concrete Estimator Calculator?
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
          <ul className="space-y-4 text-slate-300">
            <WhyItem>Purpose-built for fence posts, gate posts, deck posts, mailbox posts, and other post-setting applications.</WhyItem>
            <WhyItem>Three calculator modes (Quick, Advanced, Recommendation) let you get a fast estimate or a detailed breakdown.</WhyItem>
            <WhyItem>Net concrete after post displacement helps you avoid over-ordering bags of concrete.</WhyItem>
            <WhyItem>Side-by-side bag comparison (40 lb, 60 lb, 80 lb) simplifies purchasing decisions at the hardware store.</WhyItem>
            <WhyItem>Includes gravel base estimation, frost depth considerations, and cost calculations for complete project planning.</WhyItem>
            <WhyItem>Printable results simplify documentation for DIY projects and contractor job sites.</WhyItem>
          </ul>
        </div>

        {/* How to Use */}
        <h4 className="text-lg font-semibold text-white mt-12 mb-3">
          How to Use the Post Hole Concrete Calculator
        </h4>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Choose your <span className="text-white">Calculator Mode</span> — Quick Estimate, Advanced, or Recommendation.</li>
            <li>Select the <span className="text-white">hole shape</span> (round or square) and enter <span className="text-white">hole diameter/width</span> and <span className="text-white">hole depth</span>.</li>
            <li>Enter the <span className="text-white">number of post holes</span> for your project.</li>
            <li>Toggle the <span className="text-white">gravel base</span> option and set <span className="text-white">gravel depth</span> (typically 4–6 inches).</li>
            <li>(Advanced) Enter <span className="text-white">post dimensions</span> for more accurate results with post displacement subtraction.</li>
            <li>Select <span className="text-white">bag size</span> or enter a <span className="text-white">custom yield</span> per bag.</li>
            <li>Click <span className="text-white">Calculate</span> to view volume, bag counts, gravel, and cost estimates.</li>
          </ol>
        </div>

        {/* Formulas */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Formulas Used in the Post Hole Concrete Calculator
        </h3>
        <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
          <FormulaBlock
            title="1) Round Hole Volume (Cylinder)"
            lines={["Volume = π × (Diameter / 2)² × Concrete Fill Depth"]}
            note="Concrete Fill Depth = Hole Depth − Gravel Depth (if gravel is included)."
          />
          <FormulaBlock
            title="2) Square / Rectangular Hole Volume"
            lines={["Volume = Width × Length × Concrete Fill Depth"]}
          />
          <FormulaBlock
            title="3) Post Displacement (Optional)"
            lines={[
              "Round post: V = π × (Post Diameter / 2)² × Embedded Depth",
              "Square post: V = Post Width × Post Length × Embedded Depth",
            ]}
            note="Subtracted from hole volume to give net concrete per hole."
          />
          <FormulaBlock
            title="4) Waste & Bags"
            lines={[
              "Adjusted Volume = Total Volume × (1 + Waste% / 100)",
              "Bags = ⌈Adjusted Volume / Yield Per Bag⌉  (round up)",
            ]}
          />
          <FormulaBlock
            title="5) Recommendation Engine"
            lines={[
              "Recommended Hole Diameter = 3 × Post Width",
              "Recommended Embed Depth = max(Post Length / 3, Frost Depth)",
            ]}
          />
        </div>

        {/* FAQs */}
        <h3 className="text-xl font-semibold text-white mt-12 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="rounded-lg border border-slate-800 p-5 space-y-6">
          <FAQ
            q="How much concrete do I need for a post hole?"
            a="The amount of concrete depends on the hole diameter, hole depth, number of holes, gravel base depth, and whether the post volume is subtracted from the total. Use the calculator above for an accurate estimate."
          />
          <FAQ
            q="How many bags of concrete do I need per fence post?"
            a="The number of bags depends on the size of the hole and the yield of the selected concrete mix. For a typical 4×4 fence post in a 10-inch diameter hole 36 inches deep, you'll need about 2–3 bags of 80 lb concrete."
          />
          <FAQ
            q="Should I put gravel at the bottom of a post hole?"
            a="A gravel base of 4 to 6 inches is commonly used to improve drainage and provide a stable foundation at the bottom of the hole. Our calculator includes an optional gravel base estimator."
          />
          <FAQ
            q="How deep should a post hole be?"
            a="A common starting rule is to bury about one-third of the total post length below grade, but local frost depth, soil conditions, and post type can affect the final depth. Use our Recommendation mode for guidance."
          />
          <FAQ
            q="How wide should a post hole be?"
            a="A common rule of thumb is to make the hole about three times the width or diameter of the post. For a 4×4 post (3.5 inches actual), that means roughly a 10-inch diameter hole."
          />
          <FAQ
            q="Should gate posts use more concrete than line posts?"
            a="Yes. Gate posts typically carry more load and swing forces, so they often require larger holes, deeper embedment, and more concrete than standard line posts."
          />
          <FAQ
            q="Can I calculate gravel and concrete together?"
            a="Yes. This calculator estimates both the gravel base volume and the concrete needed above it in a single calculation."
          />
          <FAQ
            q="Does this calculator include waste?"
            a="Yes. The calculator includes an adjustable waste percentage (default 10%) to account for spillage, uneven excavation, and material waste during mixing."
          />
        </div>
        {/* --------------- END CONTENT --------------- */}
      </div>
    </section>
  );
}

/* ---------- Reusable UI atoms (same as other articles) ---------- */

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
