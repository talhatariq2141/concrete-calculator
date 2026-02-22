"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ruler, Calculator as CalcIcon, DollarSign, Layers, TrendingUp, HandCoins } from "lucide-react";

export default function ConcreteSlabCostCalcArticle() {
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
                    aria-controls="cost-article-collapse"
                    className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
                >
                    {open ? "Hide Guide" : "Learn more about costs"}
                </button>
            </div>

            <div
                id="cost-article-collapse"
                ref={wrapperRef}
                className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[15000px]"
                style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
            >
                <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter border-l-4 border-teal-500 pl-4">Complete Guide to Concrete Slab Costs</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <FeatureCard
                        icon={<DollarSign className="h-5 w-5" />}
                        title="Material & Labor Estimates"
                        desc="Estimate not just the volume, but the total financial layout including professional installation and ready-mix delivery."
                    />
                    <FeatureCard
                        icon={<HandCoins className="h-5 w-5" />}
                        title="Ready-Mix vs. Bagged Mix"
                        desc="Compare costs between ordering a concrete truck or mixing it yourself using standard 80lb bags for smaller projects."
                    />
                    <FeatureCard
                        icon={<Layers className="h-5 w-5" />}
                        title="Reinforcement Planning"
                        desc="Account for rebar, wire mesh, or vapor barriers by adding extra costs per square foot to your estimate."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="h-5 w-5" />}
                        title="Regional Pricing Adjustments"
                        desc="Customize your estimate with local labor rates and material prices to match your specific ZIP code market."
                    />
                    <FeatureCard
                        icon={<Ruler className="h-5 w-5" />}
                        title="Smart Waste Allowance"
                        desc="Built-in 10-15% overrun calculator ensures you don't run dry during the pour due to spillage or uneven subgrade."
                    />
                    <FeatureCard
                        icon={<CalcIcon className="h-5 w-5" />}
                        title="Professional PDF Export"
                        desc="Generate a clean, printable summary of your project inputs and costs to share with contractors or keep for records."
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Why Use Our Concrete Slab Cost Calculator?</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
                    <ul className="space-y-4 text-slate-300">
                        <WhyItem>Accurate financial planning for patios, driveways, garage floors, and shed bases.</WhyItem>
                        <WhyItem>Avoid &quot;sticker shock&quot; by understanding the breakdown between material and labor costs upfront.</WhyItem>
                        <WhyItem>Transparent formulas based on current US industry standards for ready-mix and labor averages.</WhyItem>
                        <WhyItem>Compare supply methods to see if DIY bagging is truly cheaper than a professional truck delivery.</WhyItem>
                        <WhyItem>SEO and construction-ready precise calculations that help you negotiate better with local suppliers.</WhyItem>
                    </ul>
                </div>

                <h4 className="text-lg font-semibold text-white mt-12 mb-3">How to Estimate Your Slab Project</h4>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                        <li>Measure your slab <span className="text-white">Length, Width, and Thickness</span>.</li>
                        <li>Choose your <span className="text-white">Supply Method</span> (Ready Mix is best for large areas, Bagged for tiny ones).</li>
                        <li>Enter local <span className="text-white">Ready-Mix Prices</span> (typically $150–$180 per yard) or <span className="text-white">Bag Prices</span>.</li>
                        <li>Input the <span className="text-white">Labor Rate</span> if hiring a crew (usually $3–$10 per square foot depending on finish).</li>
                        <li>Add <span className="text-white">Extras</span> for gravel sub-base or rebar reinforcements.</li>
                        <li>Click <span className="text-white">Calculate</span> and save your PDF summary.</li>
                    </ol>
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Calculation Formulas Behind the Tool</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
                    <FormulaBlock
                        title="1) Concrete Volume"
                        lines={[
                            "Volume (ft³) = Length (ft) × Width (ft) × (Thickness (in) / 12)",
                            "Volume (yd³) = Volume (ft³) / 27",
                        ]}
                        note="Our tool handles all unit conversions internally so you can mix feet, inches, and meters."
                    />
                    <FormulaBlock
                        title="2) Ready-Mix Cost"
                        lines={[
                            "Material Cost = Adjusted Volume (yd³) × Price per Yard",
                            "Adjusted Volume = Raw Volume × (1 + Waste %)",
                        ]}
                    />
                    <FormulaBlock
                        title="3) Labor & Extras"
                        lines={[
                            "Labor Cost = Total Area (sq ft) × Labor Rate ($/sq ft)",
                            "Total Est. Cost = Materials + Labor + Extras (Reinforcement/Base)",
                        ]}
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Frequently Asked Questions</h3>
                <div className="rounded-lg  border border-slate-800 p-5 space-y-6">
                    <FAQ
                        q="What is the average cost of a concrete slab per square foot?"
                        a="In the US, most standard slabs cost between $6 and $12 per square foot installed. This includes both materials and professional labor. DIY projects using bagged mix may cost significantly less but require much more manual effort."
                    />
                    <FAQ
                        q="How much concrete do I need for a 20x20 slab?"
                        a="A standard 4-inch thick 20x20 slab requires approximately 5 cubic yards of concrete. This includes a 10% waste allowance to cover spillage and sub-base variations."
                    />
                    <FAQ
                        q="Is it cheaper to use a concrete truck or buy bags?"
                        a="Generally, projects requiring more than 1 cubic yard (about 45-50 bags) are cheaper and much faster via ready-mix truck. Bagged mix is ideal for small footings or tiny repairs where the truck delivery fee would outweigh the material cost."
                    />
                    <FAQ
                        q="What labor rate should I expect for my slab?"
                        a="Labor rates vary by finish. A standard broom finish ranges from $3 to $5 per sq ft, while decorative stamped or polished finishes can exceed $10-$15 per sq ft."
                    />
                    <FAQ
                        q="Why do I need a waste allowance?"
                        a="Soil is rarely perfectly flat. If your sub-grade is slightly lower in some areas, or if there is spillage during the pour, you will need more concrete than the exact mathematical calculation suggest. A 10-15% 'buffer' is industry standard."
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
