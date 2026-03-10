// components/calculators/articles/ConcreteBlockCalcArticle.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    CheckCircle2,
    Ruler,
    Calculator as CalcIcon,
    Layers,
    Scale,
    Wrench,
    DollarSign,
    Box,
    ZapIcon,
    Target,
} from "lucide-react";

export default function ConcreteBlockCalcArticle() {
    // --- collapse/expand state + height animation ---
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
        <section className="mt-10 w-full mx-auto max-w-8xl text-slate-200 font-poppins">
            {/* toggle */}
            <div className="flex justify-end mb-3">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="block-article-collapse"
                    className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
                >
                    {open ? "Hide Guide" : "Learn more"}
                </button>
            </div>

            {/* collapsible wrapper */}
            <div
                id="block-article-collapse"
                ref={wrapperRef}
                className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[10000px]"
                style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
            >
                {/* ===== Features ===== */}
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Key Features of the Concrete Block Calculator
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <FeatureCard
                        icon={<CalcIcon className="h-5 w-5" />}
                        title="Concrete Block Count Estimator"
                        desc="Estimate how many concrete blocks are needed for a wall based on wall size, block size, and waste allowance."
                    />
                    <FeatureCard
                        icon={<Target className="h-5 w-5" />}
                        title="Opening Deduction Calculator"
                        desc="Subtract doors, windows, and other openings to produce a more accurate concrete block wall estimate."
                    />
                    <FeatureCard
                        icon={<Scale className="h-5 w-5" />}
                        title="Adjustable Waste Percentage"
                        desc="Customize block wastage for cuts, breakage, corners, and layout complexity for more realistic material planning."
                    />
                    <FeatureCard
                        icon={<Layers className="h-5 w-5" />}
                        title="Mortar Estimator"
                        desc="Calculate mortar bags and estimated mortar volume for standard concrete block installation."
                    />
                    <FeatureCard
                        icon={<Box className="h-5 w-5" />}
                        title="Grout / Core Fill Estimator"
                        desc="Estimate grout volume for partially filled or fully grouted CMU walls using flexible fill settings."
                    />
                    <FeatureCard
                        icon={<Wrench className="h-5 w-5" />}
                        title="Reinforcement Estimator"
                        desc="Estimate horizontal and vertical reinforcement lengths for concrete block wall planning."
                    />
                    <FeatureCard
                        icon={<DollarSign className="h-5 w-5" />}
                        title="Block Wall Cost Calculator"
                        desc="Add material prices to estimate total concrete block wall cost, including blocks, mortar, grout, and reinforcement."
                    />
                    <FeatureCard
                        icon={<Ruler className="h-5 w-5" />}
                        title="U.S. Standard CMU Sizes"
                        desc='Use common U.S. concrete block sizes such as 4", 6", 8", 10", and 12" CMU blocks for practical estimating.'
                    />
                    <FeatureCard
                        icon={<ZapIcon className="h-5 w-5" />}
                        title="Fast and Advanced Modes"
                        desc="Choose between a quick concrete block estimate or a more detailed wall material calculation with added outputs."
                    />
                    <FeatureCard
                        icon={<CalcIcon className="h-5 w-5" />}
                        title="SEO-Friendly Project Planning Tool"
                        desc="Designed to help homeowners, contractors, and builders quickly estimate concrete block wall materials with clear results."
                    />
                </div>

                {/* ===== How to Use ===== */}
                <h3 className="text-xl font-semibold text-white mt-12 mb-4">
                    How to Use the Concrete Block Calculator
                </h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                        <li>Enter <span className="text-white">wall length</span> and <span className="text-white">wall height</span> in feet and inches.</li>
                        <li>Select the <span className="text-white">concrete block size</span> (e.g., 8×8×16 CMU).</li>
                        <li>Add doors and window <span className="text-white">openings</span> if needed (Advanced mode).</li>
                        <li>Choose your <span className="text-white">waste percentage</span> (default 5%).</li>
                        <li>Enable <span className="text-white">mortar, grout, reinforcement, or cost</span> options if needed (Advanced mode).</li>
                        <li>Click <span className="text-white">Calculate</span>.</li>
                        <li>Review your estimated <span className="text-white">block quantity</span> and material breakdown.</li>
                    </ol>
                </div>

                {/* ===== Formulas ===== */}
                <h3 className="text-xl font-semibold text-white mt-12 mb-4">
                    Formulas Used in the Calculator
                </h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
                    <FormulaBlock
                        title="Gross Wall Area"
                        lines={["Wall Area = Length × Height"]}
                    />
                    <FormulaBlock
                        title="Net Wall Area"
                        lines={["Net Wall Area = Gross Wall Area − Opening Area"]}
                    />
                    <FormulaBlock
                        title="Base Blocks"
                        lines={[
                            "Base Blocks = Net Wall Area ÷ Block Face Coverage",
                            "Block Face Coverage = 0.8889 sq ft (for standard 8″ × 16″ face)",
                        ]}
                    />
                    <FormulaBlock
                        title="Waste Adjusted Blocks"
                        lines={["Final Blocks = Base Blocks × (1 + Waste % ÷ 100)"]}
                    />
                    <FormulaBlock
                        title="Mortar Bags"
                        lines={["Mortar Bags = Final Blocks ÷ 13"]}
                        note="Based on common manufacturer guidance for standard 8×8×16 blocks."
                    />
                    <FormulaBlock
                        title="Grout Volume"
                        lines={["Grout Volume = Fillable Blocks × Grout Volume Per Block"]}
                        note="Grout volume per block varies by thickness: 4″ = 0.15, 6″ = 0.30, 8″ = 0.40, 10″ = 0.50, 12″ = 0.60 cu ft."
                    />
                    <FormulaBlock
                        title="Horizontal Reinforcement"
                        lines={["Reinforcement Length = Reinforcement Runs × Wall Length"]}
                    />
                    <FormulaBlock
                        title="Vertical Reinforcement"
                        lines={["Reinforcement Length = Vertical Lines × Wall Height"]}
                    />
                    <FormulaBlock
                        title="Material Cost"
                        lines={["Total Material Cost = Blocks + Mortar + Grout + Reinforcement"]}
                        note="Formulas use practical estimator assumptions, not stamped engineering design criteria."
                    />
                </div>

                {/* ===== FAQs ===== */}
                <h3 className="text-xl font-semibold text-white mt-12 mb-4">
                    Frequently Asked Questions
                </h3>
                <div className="rounded-lg border border-slate-800 p-5 space-y-6">
                    <FAQ
                        q="What is a Concrete Block Calculator?"
                        a="A Concrete Block Calculator is a tool that helps estimate how many concrete blocks are needed for a wall, foundation, partition, or other masonry project based on wall dimensions, block size, and openings."
                    />
                    <FAQ
                        q="How does a Concrete Block Calculator work?"
                        a="A Concrete Block Calculator works by calculating the total wall area, subtracting any door or window openings, and dividing the remaining area by the face coverage of a standard concrete block. Many calculators also add a waste allowance for cuts and breakage."
                    />
                    <FAQ
                        q="How many concrete blocks do I need for my wall?"
                        a="The number of concrete blocks you need depends on the wall length, wall height, block size, and any openings. A Concrete Block Calculator gives a faster and more accurate estimate than manual calculation."
                    />
                    <FAQ
                        q="Does a Concrete Block Calculator include waste?"
                        a="Most concrete block calculators can include a waste factor. A 5% waste allowance is common for basic projects, but more complex wall layouts may need a higher percentage."
                    />
                    <FAQ
                        q="Can a Concrete Block Calculator subtract doors and windows?"
                        a="Yes. A better Concrete Block Calculator should allow you to subtract door openings, window openings, and other empty spaces so the block estimate is more accurate."
                    />
                    <FAQ
                        q="What block size does a Concrete Block Calculator use?"
                        a='Most concrete block calculators use common U.S. CMU sizes such as 4 in × 8 in × 16 in, 6 in × 8 in × 16 in, 8 in × 8 in × 16 in, 10 in × 8 in × 16 in, and 12 in × 8 in × 16 in.'
                    />
                    <FAQ
                        q="Is a Concrete Block Calculator the same as a cinder block calculator?"
                        a="Yes, in many cases users search for both terms interchangeably. A Concrete Block Calculator and a cinder block calculator usually estimate block quantity for similar masonry wall projects."
                    />
                    <FAQ
                        q="Can I use a Concrete Block Calculator for retaining walls?"
                        a="Yes, a Concrete Block Calculator can help estimate blocks for some retaining wall projects, but you should make sure the selected block type and wall design match the actual retaining wall system being used."
                    />
                    <FAQ
                        q="Can a Concrete Block Calculator estimate mortar?"
                        a="Some advanced concrete block calculators can estimate mortar bags or mortar volume in addition to block count. This helps with planning the full masonry material requirement."
                    />
                    <FAQ
                        q="Can a Concrete Block Calculator estimate grout or core fill?"
                        a="Yes. A more advanced Concrete Block Calculator can estimate grout volume for partially filled or fully grouted block walls, depending on the wall design and fill percentage."
                    />
                    <FAQ
                        q="Can a Concrete Block Calculator estimate reinforcement?"
                        a="Yes. Some calculators also estimate horizontal and vertical reinforcement lengths for planning block wall materials more completely."
                    />
                    <FAQ
                        q="Is a Concrete Block Calculator useful for contractors?"
                        a="Yes. Contractors use a Concrete Block Calculator to save time, reduce manual errors, and create faster material estimates for concrete block walls and masonry jobs."
                    />
                    <FAQ
                        q="Is a Concrete Block Calculator useful for homeowners?"
                        a="Yes. Homeowners can use a Concrete Block Calculator to estimate materials before starting a DIY wall project or requesting contractor quotes."
                    />
                    <FAQ
                        q="How accurate is a Concrete Block Calculator?"
                        a="A Concrete Block Calculator provides a useful estimate, but actual material needs may vary depending on bond pattern, manufacturer dimensions, mortar joints, waste, reinforcement layout, and site conditions."
                    />
                    <FAQ
                        q="What is the best waste percentage for a concrete block wall?"
                        a="A 5% waste factor is a common starting point for standard walls. Projects with many corners, cuts, openings, or custom layouts may require a higher waste percentage."
                    />
                    <FAQ
                        q="Can I use a Concrete Block Calculator for foundations?"
                        a="Yes, a Concrete Block Calculator can be used for some block foundation walls, basement walls, and structural masonry projects, but the final design should always follow local code and engineering requirements."
                    />
                    <FAQ
                        q="Does a Concrete Block Calculator help estimate block wall cost?"
                        a="Yes. If the calculator includes price inputs, it can estimate total concrete block wall cost based on block price, mortar cost, grout cost, reinforcement cost, and other project expenses."
                    />
                    <FAQ
                        q="What is the difference between a Concrete Block Calculator and a block wall calculator?"
                        a="The terms are closely related. A Concrete Block Calculator focuses on estimating CMU block quantity and related materials, while a block wall calculator may be used more broadly for different wall systems."
                    />
                    <FAQ
                        q="Can I calculate concrete blocks in square feet?"
                        a="Yes. A Concrete Block Calculator typically uses wall area in square feet and divides it by the face area covered by one concrete block to estimate the block quantity."
                    />
                    <FAQ
                        q="Why should I use a Concrete Block Calculator instead of manual math?"
                        a="A Concrete Block Calculator is faster, easier, and usually more accurate because it can account for block size, openings, waste, mortar, grout, and other important variables in one place."
                    />
                    <FAQ
                        q="Can a Concrete Block Calculator be used for commercial masonry projects?"
                        a="Yes, it can be used for planning and estimating on commercial masonry projects, though large or structural projects may require more detailed takeoffs and engineering review."
                    />
                    <FAQ
                        q="Does the calculator work for both interior and exterior block walls?"
                        a="Yes. A Concrete Block Calculator can be used for both interior and exterior concrete block walls as long as the dimensions, block size, and material assumptions are appropriate."
                    />
                    <FAQ
                        q="What information do I need to use a Concrete Block Calculator?"
                        a="You usually need the wall length, wall height, block size, and any openings. For more advanced results, you can also enter waste percentage, mortar settings, grout options, reinforcement details, and material prices."
                    />
                    <FAQ
                        q="Is a Concrete Block Calculator only for standard 8×8×16 blocks?"
                        a="No. A good Concrete Block Calculator should support multiple CMU block sizes so users can estimate different wall types and masonry applications."
                    />
                </div>

                {/* end of article */}
            </div>
        </section>
    );
}

/* ---------- Reusable UI bits ---------- */

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
