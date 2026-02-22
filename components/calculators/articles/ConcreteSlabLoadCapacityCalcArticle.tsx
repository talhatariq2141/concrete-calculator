"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Ruler, ShieldCheck, Info, HelpingHand, ListChecks, Scale } from "lucide-react";

export default function ConcreteSlabLoadCapacityCalcArticle() {
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
        <section className="mt-10 w-full mx-auto max-w-8xl text-slate-200 font-poppins text-justify leading-relaxed">
            <div className="flex justify-end mb-3">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="capacity-article-collapse"
                    className="text-xs md:text-sm px-3 py-1.5 rounded-sm border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-primary transition-colors"
                >
                    {open ? "Hide Guide" : "Learn more about load capacity"}
                </button>
            </div>

            <div
                id="capacity-article-collapse"
                ref={wrapperRef}
                className="mt-6 overflow-hidden transition-all duration-700 ease-in-out opacity-100 max-h-[20000px]"
                style={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
            >
                <h2 className="text-2xl font-semibold text-white mb-4">Engineering Guide: Slab Load Capacity Analysis</h2>

                <div className="grid gap-6 md:grid-cols-2">
                    <FeatureCard
                        icon={<ShieldCheck className="h-5 w-5" />}
                        title="Strength Design Basis"
                        desc="Employs ACI 318 Rectangular Section Analysis for flexural and shear strength checks, ensuring calculations adhere to modern structural principles."
                    />
                    <FeatureCard
                        icon={<ListChecks className="h-5 w-5" />}
                        title="LRFD Gravity Combinations"
                        desc="Calculates capacity using the 1.2D + 1.6L gravity combination, factoring in slab self-weight and superimposed dead loads automatically."
                    />
                    <FeatureCard
                        icon={<Scale className="h-5 w-5" />}
                        title="Governing Mode Detection"
                        desc="Automatically determines if Flexure or One-Way Shear governs the design, providing a deeper understanding of the slab's structural limitations."
                    />
                    <FeatureCard
                        icon={<Ruler className="h-5 w-5" />}
                        title="Material Versatility"
                        desc="Supports variations in concrete strength (f'c), steel yield (fy), and concrete density, allowing for custom residential or industrial project analysis."
                    />
                    <FeatureCard
                        icon={<HelpingHand className="h-5 w-5" />}
                        title="Serviceable Comparisons"
                        desc="Input your required occupancy live load (psf) and get an instant Pass/Fail status based on governed structural capacity."
                    />
                    <FeatureCard
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        title="1-Foot Strip Method"
                        desc="Standard engineering approach for one-way slab analysis, making the results easy to verify against traditional manual calculations."
                    />
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">The Science of Slab Capacity</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-6 space-y-4 text-slate-300 shadow-inner">
                    <p>
                        The load capacity of a concrete slab is not just about its thickness; it is a complex interaction between geometry, material strengths, and reinforcement detailing. For a <span className="text-white italic">one-way suspended slab</span>, we analyze a 12-inch wide strip as a shallow beam.
                    </p>
                    <ul className="space-y-4">
                        <WhyItem>Flexural Strength: The ability of the tension reinforcement (rebar) to resist bending moments under downward loads.</WhyItem>
                        <WhyItem>Shear Resistance: The capacity of the concrete section itself to resist being 'cut' near the supports.</WhyItem>
                        <WhyItem>Dead vs Live Load: Dead load remains constant (slab weight, finishes), while Live Load (occupants, furniture) is the variable capacity we seek to determine.</WhyItem>
                        <WhyItem>Effective Depth (d): The distance from the top of the concrete to the center of the rebar; this factor is critical for mechanical advantage in bending.</WhyItem>
                    </ul>
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Structural Calculation Workflow</h3>
                <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-8 shadow-inner overflow-x-auto">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <FormulaBlock
                                title="Flexural Capacity Equations"
                                lines={[
                                    "a = (As * fy) / (0.85 * f'c * b)",
                                    "Mn = As * fy * (d - a/2)",
                                    "wu_max = (8 * φMn) / L²",
                                ]}
                                note="ACI 318 Strength Design for Flexure"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <FormulaBlock
                                title="One-Way Shear check"
                                lines={[
                                    "φVc = 0.75 * 2 * sqrt(f'c) * b * d",
                                    "wu_shear = (2 * φVc) / L",
                                ]}
                                note="Assume normal-weight concrete (λ=1.0)"
                            />
                        </div>
                    </div>
                    <div className="mt-8 border-t border-slate-800 pt-6">
                        <p className="text-sm font-bold text-white mb-2 uppercase tracking-widest text-teal-400">Governing Logic</p>
                        <p className="text-sm text-slate-400 font-mono italic">Factored Capacity (wu_governing) = min(wu_flexure, wu_shear)</p>
                        <p className="text-sm text-slate-400 font-mono italic mt-2">Max Service Live Load (L_max) = (wu_governing - 1.2 * DeadLoad) / 1.6</p>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-white mt-12 mb-4">Frequently Asked Questions</h3>
                <div className="rounded-lg border border-slate-800 p-6 space-y-8 shadow-inner">
                    <FAQ
                        q="What is the standard live load for residential floors?"
                        a="Per ASCE 7, most residential living areas require a live load capacity of 40 psf, while sleeping areas require 30 psf. Public corridors or industrial spaces often require 100 psf or more."
                    />
                    <FAQ
                        q="How does increasing rebar size affect capacity?"
                        a="Generally, more steel (As) increases flexural capacity until the slab becomes 'over-reinforced.' However, shear capacity is independent of rebar and depends almost entirely on slab thickness and concrete strength."
                    />
                    <FAQ
                        q="Why is the result in 'psf' instead of total pounds?"
                        a="Structural loads for floors are standardized in Pounds per Square Foot (psf) to allow engineers to apply load regardless of the total floor area. The internal math uses a 1-foot strip to derive this unit."
                    />
                    <FAQ
                        q="Does this calculator account for two-way slabs?"
                        a="No. This tool is specific to one-way suspended slabs. Two-way slabs (piers/columns in a grid) involve complex punching shear and distribution factors not covered by this singular strip analysis."
                    />
                    <FAQ
                        q="What if my span is continuous?"
                        a="Simply supported spans derive the highest moments and are the most 'conservative' estimate. Continuous spans often have higher capacity but require specific ACI moment coefficients which are not currently integrated into this basic analysis tool."
                    />
                </div>

                <div className="mt-12 p-6 bg-red-900/10 border border-red-500/30 rounded-lg text-sm italic text-slate-400">
                    <p className="font-bold text-red-400 mb-2 uppercase not-italic tracking-widest">⚠️ Engineering Limitation Notice</p>
                    This calculator assumes the slab is adequately detailed for shrinkage, temperature, and fire rating requirements. It does not check for <span className="text-white">serviceability deflections</span>, which often govern slab design more strictly than strength. Use as a reference for preliminary sizing only.
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
