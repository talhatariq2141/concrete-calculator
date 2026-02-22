"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ruler, Weight, Info, HandIcon, Layout, Scale } from "lucide-react";

export default function ConcreteSlabWeightCalcArticle() {
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
            if (open) {
                el.style.height = "auto";
            }
        };
        el.addEventListener("transitionend", onEnd);
        return () => el.removeEventListener("transitionend", onEnd);
    }, [open]);

    return (
        <section className="mt-10 w-full mx-auto max-w-8xl text-slate-200 font-poppins text-justify">
            <div className="flex justify-end mb-3">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="weight-article-collapse"
                    className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
                >
                    {open ? "Hide Guide" : "Learn more about slab weight"}
                </button>
            </div>

            <div
                id="weight-article-collapse"
                ref={wrapperRef}
                className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[15000px]"
                style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
            >
                <h2 className="text-2xl font-semibold text-white mb-4">Guide to Calculating Concrete Slab Weight</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <FeatureCard
                        icon={<Scale className="h-5 w-5" />}
                        title="Precision Weight Distribution"
                        desc="Calculate exact project load in pounds and tons based on verified engineering densities for standard, reinforced, and lightweight concrete."
                    />
                    <FeatureCard
                        icon={<Layout className="h-5 w-5" />}
                        title="Density Presets"
                        desc="Built-in presets (150 lb/ft³ for standard, 156 lb/ft³ for reinforced) save time, while custom inputs allow for specific material variations."
                    />
                    <FeatureCard
                        icon={<Ruler className="h-5 w-5" />}
                        title="Multi-Dimensional Support"
                        desc="Easily input dimensions in feet or inches and toggle units dynamically to match your blueprints or field measurements."
                    />
                    <FeatureCard
                        icon={<Weight className="h-5 w-5" />}
                        title="Bulk Load Estimates"
                        desc="Estimate the weight for single or multiple slabs simultaneously—essential for transportation logistics and structural planning."
                    />
                    <FeatureCard
                        icon={<Info className="h-5 w-5" />}
                        title="Unit Coalescence"
                        desc="Internal conversion engine seamlessly handles the math between cubic yards, cubic feet, and imperial weight units."
                    />
                    <FeatureCard
                        icon={<HandIcon className="h-5 w-5" />}
                        title="Ready-to-Print Estimates"
                        desc="Generate professional PDF weight summaries to share with logistics teams, engineers, or structural contractors."
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Why Slab Weight Matters in Construction</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-6 shadow-inner">
                    <ul className="space-y-4 text-slate-300">
                        <WhyItem>Structural Integrity: Ensuring the sub-base, deck, or supporting structure can handle the dead load of the cured slab.</WhyItem>
                        <WhyItem>Logistics & Transport: Determining if a specific truck or trailer can safely haul pre-cast or wet mix components.</WhyItem>
                        <WhyItem>Formwork Design: Calculating the lateral and vertical pressure exerted on forms during the pour.</WhyItem>
                        <WhyItem>Project Costing: Weight is often linked to the volume and density of materials ordered from suppliers.</WhyItem>
                        <WhyItem>Permitting & Compliance: Adhering to local building codes that specify minimum or maximum weights for certain residential structures.</WhyItem>
                    </ul>
                </div>

                <h4 className="text-lg font-semibold text-white mt-12 mb-3">Step-by-Step Weight Calculation</h4>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-6 shadow-inner">
                    <ol className="list-decimal list-inside space-y-3 text-slate-300">
                        <li>Find the <span className="text-white">total volume</span> by multiplying Length × Width × Thickness (convert all to feet first).</li>
                        <li>Select the <span className="text-white">concrete density</span> (150 lb/ft³ is standard for most residential pours).</li>
                        <li>Multiply <span className="text-white">Volume (ft³) × Density (lb/ft³)</span> to get the total weight in pounds.</li>
                        <li>Divide by 2,000 to convert the results into <span className="text-white">short tons</span>.</li>
                        <li>Always account for <span className="text-white">internal reinforcements</span> like rebar, which can increase the total weight by 3-5%.</li>
                    </ol>
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">The Math Behind the Weight</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-6 space-y-6 text-slate-300 shadow-inner text-left">
                    <FormulaBlock
                        title="Area & Volume"
                        lines={[
                            "Surface Area = Length × Width",
                            "Volume (ft³) = Surface Area × Thickness (conv. to ft)",
                        ]}
                    />
                    <FormulaBlock
                        title="Weight Equations"
                        lines={[
                            "Total Weight (lb) = Volume (ft³) × Density (lb/ft³)",
                            "Weight (Tons) = lb / 2000",
                        ]}
                        note="Note: 1 cubic yard of standard concrete (27 ft³) weighs approximately 4,050 lbs (2.025 tons)."
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Frequently Asked Questions</h3>
                <div className="rounded-lg border border-slate-800 p-6 space-y-8 shadow-inner">
                    <FAQ
                        q="How much does a 20x20 concrete slab weigh?"
                        a="A standard 4-inch thick 20x20 slab has a volume of 133.33 ft³. Using standard concrete (150 lb/ft³), it weighs approximately 20,000 lbs, or 10 short tons. Reinforced slabs will weigh slightly more due to steel content."
                    />
                    <FAQ
                        q="What is the difference between wet and dry concrete weight?"
                        a="Wet concrete is slightly heavier than dry concrete due to its water content. As concrete cures (hydrates), it retains much of that weight as chemically bound water, although some evaporation occurs. Structural calculations usually design for the 'dead load' of cured concrete."
                    />
                    <FAQ
                        q="How heavy is reinforced concrete relative to regular concrete?"
                        a="Reinforced concrete is typically calculated at 156 lb/ft³, roughly 4% heavier than standard unreinforced concrete. This accounts for the high density of steel rebar or mesh embedded within the slab."
                    />
                    <FAQ
                        q="Does the slab thickness affect the density?"
                        a="No, density is a material property (lb per cubic foot). However, thicker slabs result in higher volume, which directly increases the total weight proportionally."
                    />
                    <FAQ
                        q="Can I use this for pre-cast concrete sections?"
                        a="Yes. As long as you know the dimensions and the specific density of the pre-cast mix (which is often higher due to compaction), this calculator will provide an accurate weight for lifting and transport planning."
                    />
                </div>
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
            <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
        </div>
    );
}

function WhyItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <span className="mt-1.5 inline-flex h-2 w-2 rounded-full bg-teal-400 flex-shrink-0" />
            <span className="leading-relaxed">{children}</span>
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
            <ul className="list-disc list-inside text-slate-300 space-y-1">
                {lines.map((l, i) => (
                    <li key={i}>{l}</li>
                ))}
            </ul>
            {note ? <p className="text-xs text-slate-400 mt-2 italic">{note}</p> : null}
        </div>
    );
}

function FAQ({ q, a }: { q: string; a: string }) {
    return (
        <div className="border-b border-slate-800 pb-4 last:border-0">
            <p className="font-medium text-white mb-2">{q}</p>
            <p className="text-slate-300 leading-relaxed">{a}</p>
        </div>
    );
}
