// components/app/HomeCategoryList.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    CALCULATORS,
    CATEGORIES,
    FALLBACK_ICON,
    type CalcCard,
    type Category,
} from "@/app/(site)/calculators/data";

/* ─── SEO descriptions per category ─── */
const CATEGORY_SEO: Record<
    Exclude<Category, "All">,
    { heading: string; description: string }
> = {
    Slab: {
        heading: "Slab Concrete Calculators",
        description:
            "Estimate concrete volume, cost, weight, and load capacity for slabs, patios, driveways, and garage floors.",
    },
    Beam: {
        heading: "Beam Concrete Calculators",
        description:
            "Calculate concrete for beams and lintels, including rectangular and T-beam cross-sections.",
    },
    Column: {
        heading: "Column Concrete Calculators",
        description:
            "Compute concrete for square, rectangular, and circular columns used in structural frames.",
    },
    "Concrete Block": {
        heading: "Concrete Block Calculators",
        description:
            "Estimate CMU block quantities, mortar, grout, reinforcement, and wall cost for masonry projects.",
    },
    "Concrete Yards": {
        heading: "Concrete Yards Calculators",
        description:
            "Convert and compute concrete volume into cubic yards for ordering ready-mix trucks.",
    },
    Cost: {
        heading: "Concrete Cost Calculators",
        description:
            "Estimate total project costs including materials, labor, and delivery for concrete work.",
    },
    Footing: {
        heading: "Footing Concrete Calculators",
        description:
            "Calculate concrete for continuous, isolated, and combined footings and foundations.",
    },
    "Concrete Mix": {
        heading: "Concrete Mix Calculators",
        description:
            "Determine material ratios for nominal concrete mixes from M5 to M25 strength grades.",
    },
    "Pier/Caisson": {
        heading: "Pier & Caisson Concrete Calculators",
        description:
            "Estimate concrete for cylindrical piers, drilled shafts, and caisson foundations.",
    },
    Staircase: {
        heading: "Staircase Concrete Calculators",
        description:
            "Estimate concrete for staircases including flights, landings, risers, and treads.",
    },
    "Tank/Trench": {
        heading: "Tank & Trench Calculators",
        description:
            "Calculate concrete volume for tanks, trenches, and below-grade containment structures.",
    },
    Wall: {
        heading: "Wall Concrete Calculators",
        description:
            "Estimate concrete for poured walls, retaining walls, and barrier walls with opening deductions.",
    },
    "Concrete Bags": {
        heading: "Concrete Bag Calculators",
        description:
            "Find out how many bags of concrete you need for slabs, footings, posts, and sonotubes.",
    },
    "Misc. Concrete": {
        heading: "Miscellaneous Concrete Calculators",
        description:
            "A collection of specialized calculators for fence posts, gate posts, deck posts, and other general concrete needs.",
    },
    Gravel: {
        heading: "Gravel Calculators",
        description:
            "Calculate volume, weight (tons & lbs), and cost for gravel driveways, landscaping, pea gravel, aquarium substrate, and material conversions.",
    },
};

const INITIAL_VISIBLE = 4;

/* ─── Category Section ─── */
function CategorySection({
    category,
    cards,
}: {
    category: Exclude<Category, "All">;
    cards: CalcCard[];
}) {
    const [expanded, setExpanded] = useState(false);
    const seo = CATEGORY_SEO[category];

    const visibleCards = expanded ? cards : cards.slice(0, INITIAL_VISIBLE);
    const hasMore = cards.length > INITIAL_VISIBLE;

    return (
        <div className="mb-14">
            {/* category heading */}
            <h3
                className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: "var(--font-poppins)" }}
            >
                {seo.heading}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
                {seo.description}
            </p>

            {/* cards grid */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
                {visibleCards.map((card) => (
                    <CalcCardItem key={card.id} card={card} />
                ))}
            </div>

            {/* show more / show less */}
            {hasMore && (
                <div className="mt-5 flex justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setExpanded((v) => !v)}
                        className="rounded-sm border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white text-sm px-5"
                    >
                        {expanded ? "Show Less" : `Show All ${cards.length} Calculators`}
                        <ChevronDown
                            className={`ml-1.5 h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""
                                }`}
                        />
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ─── Individual Card ─── */
function CalcCardItem({ card }: { card: CalcCard }) {
    const Icon = card.icon || FALLBACK_ICON;
    return (
        <div className="group relative flex h-full flex-col rounded-sm border border-slate-800 bg-transparent transition-colors hover:border-primary/60">
            <div className="p-3 pb-0 flex-1 flex flex-col">
                {/* icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-400 group-hover:bg-primary group-hover:text-background transition-colors">
                    <Icon size={20} />
                </div>

                {/* title + desc */}
                <div className="mt-4">
                    <h4
                        className="text-lg font-semibold text-white tracking-tight"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        {card.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-400">{card.desc}</p>
                </div>
            </div>

            {/* bottom row */}
            <div className="mt-4 border-t border-slate-800 px-4 py-3 flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 font-poppins">
                    {card.category}
                </span>
                <Button
                    asChild
                    className="h-8 px-3 text-xs bg-slate-800 text-slate-200 hover:bg-primary hover:text-background transition-colors"
                >
                    <Link href={`/${card.id}`}>
                        Try Now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

/* ─── Main Export ─── */
export default function HomeCategoryList() {
    // Build map: category -> cards[]  (skip "All")
    const categoryMap = new Map<Exclude<Category, "All">, CalcCard[]>();

    for (const cat of CATEGORIES) {
        if (cat === "All") continue;
        const cards = CALCULATORS.filter((c) => c.category === cat);
        if (cards.length > 0) categoryMap.set(cat, cards);
    }

    return (
        <section className="py-16 sm:py-20 bg-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* section badge */}
                <div className="flex justify-center">
                    <span
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-900/40 px-4 py-1.5 text-emerald-300 text-sm"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        <LayoutGrid size={16} /> Browse by Category
                    </span>
                </div>

                {/* section heading */}
                <h2
                    className="mt-6 text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                    style={{ fontFamily: "var(--font-poppins)" }}
                >
                    All Concrete Calculators by Category
                </h2>
                <p className="mt-3 text-center text-slate-400 font-poppins max-w-2xl mx-auto">
                    Find the right calculator for your project — organized by concrete
                    element type for quick access.
                </p>

                {/* category sections */}
                <div className="mt-14">
                    {Array.from(categoryMap.entries()).map(([cat, cards]) => (
                        <CategorySection key={cat} category={cat} cards={cards} />
                    ))}
                </div>

                {/* footer CTA */}
                <div className="mt-4 flex justify-center">
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-sm border-1 border-yellow-800 bg-slate-900/60 text-slate-200 hover:bg-slate-900"
                    >
                        <Link href="/calculators">
                            ✨ View All Calculators{" "}
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
