"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ruler, Calculator as CalcIcon, DollarSign, Layers, TrendingUp, Truck } from "lucide-react";

export default function ConcreteDrivewayCostCalcArticle() {
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
                    aria-controls="driveway-article-collapse"
                    className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
                >
                    {open ? "Hide Guide" : "Learn more about driveway costs"}
                </button>
            </div>

            <div
                id="driveway-article-collapse"
                ref={wrapperRef}
                className="mt-6 overflow-hidden transition-all duration-500 ease-in-out opacity-100 max-h-[15000px]"
                style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
            >
                <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter border-l-4 border-teal-500 pl-4">Complete Guide to Concrete Driveway Costs</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <FeatureCard
                        icon={<DollarSign className="h-5 w-5" />}
                        title="Transparent Cost Breakdown"
                        desc="See every line item — concrete material, delivery fees, short-load charges, and optional add-ons — so you know exactly where your money goes."
                    />
                    <FeatureCard
                        icon={<Truck className="h-5 w-5" />}
                        title="Real-World Delivery Handling"
                        desc="Built-in support for supplier constraints like short-load fees, minimum orders, after-hours charges, and multi-truck estimates."
                    />
                    <FeatureCard
                        icon={<Layers className="h-5 w-5" />}
                        title="DIY vs. Professional"
                        desc="Compare Ready-Mix (truck delivery) with Bagged Concrete (DIY mixing). The calculator warns you when DIY becomes impractical."
                    />
                    <FeatureCard
                        icon={<Ruler className="h-5 w-5" />}
                        title="Thickness Guidance"
                        desc="Preset buttons for 4″, 5″, and 6″ slabs based on industry standards — 4″ for cars, 5″–6″ for heavier vehicles or RVs."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="h-5 w-5" />}
                        title="Smart Waste Allowance"
                        desc="Built-in 5–10% overage calculator ensures you don't run short during the pour due to spillage or uneven subgrade."
                    />
                    <FeatureCard
                        icon={<CalcIcon className="h-5 w-5" />}
                        title="Professional PDF Export"
                        desc="Generate a clean, printable summary of your project inputs and costs to share with contractors or keep for records."
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Why Use Our Concrete Driveway Cost Calculator?</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
                    <ul className="space-y-4 text-slate-300">
                        <WhyItem>Accurate financial planning for new driveways, replacements, extensions, and turnarounds.</WhyItem>
                        <WhyItem>Handles real supplier constraints — short-load, minimum delivery, after-hours, and returned concrete fees.</WhyItem>
                        <WhyItem>Transparent formulas based on US industry standards for ready-mix pricing and QUIKRETE bag yields.</WhyItem>
                        <WhyItem>Compare ready-mix vs. bagged concrete to see which option makes sense for your project size.</WhyItem>
                        <WhyItem>Rounded order quantities (nearest 0.25 yd³) that match how suppliers actually sell concrete.</WhyItem>
                    </ul>
                </div>

                <h4 className="text-lg font-semibold text-white mt-12 mb-3">How to Estimate Your Driveway Project</h4>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                        <li>Measure your driveway <span className="text-white">Length and Width</span> in feet.</li>
                        <li>Add any <span className="text-white">Extra Area</span> for turnarounds, aprons, or widened sections.</li>
                        <li>Select a <span className="text-white">Thickness</span> — 4″ for most cars, 5″+ for heavier loads.</li>
                        <li>Choose your <span className="text-white">Pricing Method</span>: Ready-Mix for most driveways, Bagged for small repairs.</li>
                        <li>Enter your local <span className="text-white">Price per yd³</span> (typically $120–$210) or <span className="text-white">Price per Bag</span>.</li>
                        <li>Optionally fill in <span className="text-white">Supplier Constraints</span> and <span className="text-white">Add-ons</span>.</li>
                        <li>Click <span className="text-white">Calculate</span> and save your PDF summary.</li>
                    </ol>
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Calculation Formulas Behind the Tool</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-5 space-y-4 text-slate-300">
                    <FormulaBlock
                        title="1) Driveway Area & Volume"
                        lines={[
                            "Area (ft²) = (Length × Width) + Extra Area",
                            "Volume (ft³) = Area × (Thickness (in) / 12)",
                            "Volume (yd³) = Volume (ft³) / 27",
                        ]}
                    />
                    <FormulaBlock
                        title="2) Waste-Adjusted Volume"
                        lines={[
                            "Waste Factor = 1 + (Waste % / 100)",
                            "Adjusted Volume = Raw Volume × Waste Factor",
                        ]}
                        note="Default waste is 7%. Range: 5–10% is common for driveways."
                    />
                    <FormulaBlock
                        title="3) Ready-Mix Cost"
                        lines={[
                            "Billable yd³ = MAX(Adjusted Volume, Supplier Minimum)",
                            "Concrete Cost = Billable yd³ × Price per yd³",
                            "Order Qty = CEIL(Volume / 0.25) × 0.25 (rounded to nearest quarter-yard)",
                            "Total = Concrete + Delivery + Fees + Add-ons",
                        ]}
                    />
                    <FormulaBlock
                        title="4) Bagged Cost"
                        lines={[
                            "Bag Count = CEIL(Adjusted Volume (ft³) / Yield per Bag (ft³))",
                            "Concrete Cost = Bag Count × Price per Bag",
                            "Total = Concrete Cost + Add-ons",
                        ]}
                        note="Yields: 40lb → 0.30 ft³, 60lb → 0.45 ft³, 80lb → 0.60 ft³ (QUIKRETE 1101)."
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Frequently Asked Questions</h3>
                <div className="rounded-lg border border-slate-800 p-5 space-y-6">
                    <FAQ
                        q="How much does a concrete driveway cost?"
                        a="In the US, a typical concrete driveway costs between $6 and $12 per square foot installed. A standard 40×12 ft driveway (480 sq ft) runs roughly $2,880–$5,760 including materials and labor. Decorative finishes like stamping or coloring add to the cost."
                    />
                    <FAQ
                        q="How thick should a residential driveway be?"
                        a="Most residential driveways are 4 inches thick. If your driveway sees delivery trucks, RVs, or heavier traffic, 5–6 inches is recommended. Always use at least 4 inches for structural integrity."
                    />
                    <FAQ
                        q="Is ready-mix or bagged concrete better for a driveway?"
                        a="Ready-mix (truck delivery) is almost always better for driveways. A typical 2-car driveway needs 5–7 cubic yards — that's over 200 bags of 80lb concrete to mix by hand. Ready-mix ensures consistent quality and is poured in one session."
                    />
                    <FAQ
                        q="What is a short-load fee?"
                        a="A short-load fee is an extra charge applied when you order less concrete than the supplier's minimum threshold (often 3–5 yd³). This covers the cost of sending a partially loaded truck. Always confirm your supplier's policy."
                    />
                    <FAQ
                        q="Why do I need a waste allowance?"
                        a="Soil is rarely perfectly flat. If your subgrade is slightly lower in some areas, or if there is spillage during the pour, you'll need more concrete than the exact calculation suggests. A 5–10% buffer is industry standard for driveways."
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
