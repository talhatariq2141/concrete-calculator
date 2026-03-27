import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Info } from "lucide-react";

import { CALCULATORS, CATEGORIES, type CalcCard, FALLBACK_ICON } from "./data";

export const metadata: Metadata = {
    title: "All Concrete Calculators | Concrete Calculator Max",
    description:
        "Explore our complete directory of free, professional-grade concrete calculators for beams, columns, slabs, footings, blocks, and gravel.",
    alternates: {
        canonical: "https://www.concretecalculatormax.com/calculators",
    },
    openGraph: {
        type: "website",
        url: "https://www.concretecalculatormax.com/calculators",
        title: "All Concrete Calculators | Concrete Calculator Max",
        description:
            "A comprehensive directory of free concrete calculators for contractors, engineers, and DIYers.",
        images: [
            {
                url: "/og/logo.png",
                width: 1200,
                height: 630,
                alt: "Concrete Calculator Max Directory",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "All Concrete Calculators | Concrete Calculator Max",
        description:
            "A comprehensive directory of free concrete calculators for contractors, engineers, and DIYers.",
        images: ["/og/logo.png"],
    },
    robots: { index: true, follow: true },
};

function getCategorySlug(categoryName: string) {
    switch (categoryName) {
        case "Beam": return "beam";
        case "Column": return "column";
        case "Concrete Block": return "concrete-block";
        case "Concrete Yards": return "concrete-yards";
        case "Cost": return "cost";
        case "Footing": return "footing";
        case "Concrete Mix": return "concrete-mix";
        case "Misc. Concrete": return "miscellaneous";
        case "Pier/Caisson": return "pier-caisson";
        case "Slab": return "slab";
        case "Staircase": return "staircase";
        case "Tank/Trench": return "tank-trench";
        case "Wall": return "wall";
        case "Concrete Bags": return "concrete-bags";
        case "Gravel": return "gravel";
        case "Reinforcement and Structural": return "reinforcement";
        default:
            return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
}

function CalculatorCard({ card }: { card: CalcCard }) {
    const Icon = card.icon ?? FALLBACK_ICON;

    return (
        <Link href={`/${card.id}`} aria-label={card.title} className="group block h-full">
            <div
                className="
          relative flex h-full flex-col rounded-xl
          border border-slate-800
          bg-slate-900/50
          transition-all duration-300
          hover:border-teal-500/50 hover:-translate-y-1 hover:bg-slate-800/80 hover:shadow-xl
        "
            >
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-900/30 text-teal-400 group-hover:bg-teal-900/50 group-hover:text-teal-300 transition-colors">
                            <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-teal-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-100 tracking-tight leading-snug">
                        {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {card.desc}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default function AllCalculatorsPage() {
    const activeCategories = CATEGORIES.filter((c) => c !== "All" && c !== "Cost");

    const faqs = [
        {
            q: "Which concrete calculator should I use?",
            a: "Select the calculator that matches the shape of your formwork. If you have a flat rectangular patio, use the Slab Calculator. If you are filling sonotubes, use the Column or Pier Calculator. Always trace the actual geometry of what you are pouring.",
        },
        {
            q: "Are the calculators free to use?",
            a: "Yes. All of our structural, material, and geometric calculators are 100% free and have no usage limits. They are designed by industry professionals for rapid field estimations.",
        },
        {
            q: "Do I need to account for waste independently?",
            a: "Most of our tools provide a 'Waste Factor' input slider or apply a standard 10% default margin. Spills, uneven subgrades, and pump line losses always happen—never order the exact mathematical volume.",
        },
        {
            q: "How accurate are these material estimations?",
            a: "Our core calculators use exact volumetric math (L × W × H). However, real-world accuracy entirely depends on your formwork and excavation precision. A slab excavated 5 inches deep instead of 4 inches will require 25% more concrete.",
        },
        {
            q: "What is the difference between concrete and cement?",
            a: "Cement is simply the dry binding powder. Concrete is the hardened structural material created by mixing cement, water, fine sand, and coarse aggregates (gravel or crushed stone).",
        },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://www.concretecalculatormax.com/calculators",
                url: "https://www.concretecalculatormax.com/calculators",
                name: "All Concrete Calculators | Concrete Calculator Max",
                description:
                    "Main directory of all free concrete calculators available for contractors, engineers, and DIYers.",
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://www.concretecalculatormax.com",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Calculators",
                        item: "https://www.concretecalculatormax.com/calculators",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.q,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.a,
                    },
                })),
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container-xl py-6 sm:py-10">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link href="/" className="hover:text-slate-200 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li className="text-slate-600">/</li>
                        <li aria-current="page" className="text-slate-200">
                            Calculators
                        </li>
                    </ol>
                </nav>

                {/* Hero */}
                <div className="mb-12 mx-auto">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 font-poppins tracking-tight mb-4">
                        All Concrete Calculators
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-teal-500 pl-4">
                        Browse our comprehensive suite of professional-grade calculation tools.
                        Whether you are estimating cubic yards for a massive foundation slab,
                        coordinating a decorative gravel driveway, or figuring out the perfect
                        rebar spacing grid, find exactly what you need grouped by building category below.
                    </p>
                </div>

                {/* Categories Loop */}
                <div className="space-y-16">
                    {activeCategories.map((catName) => {
                        const categoryCalculators = CALCULATORS.filter(
                            (c) => c.category === catName
                        );

                        if (categoryCalculators.length === 0) return null;

                        const slug = getCategorySlug(catName);

                        return (
                            <section key={catName} aria-labelledby={`category-${slug}`}>
                                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
                                    <h2
                                        id={`category-${slug}`}
                                        className="text-2xl font-bold font-poppins text-slate-200 flex items-center gap-3"
                                    >
                                        {catName} Calculators
                                    </h2>
                                    <Link
                                        href={`/calculators/${slug}`}
                                        className="text-sm font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                                    >
                                        View Hub <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {categoryCalculators.map((calc) => (
                                        <CalculatorCard key={calc.id} card={calc} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Semantic SEO Block */}
                <section
                    aria-labelledby="explainer-heading"
                    className="mt-20 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/30 p-8 sm:p-10 mb-12"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-teal-900/30 rounded-xl border border-teal-800/50">
                            <Info className="h-6 w-6 text-teal-400" />
                        </div>
                        <div>
                            <h2
                                id="explainer-heading"
                                className="text-xl sm:text-2xl font-bold text-slate-100 mb-2 font-poppins"
                            >
                                How to Choose the Right Estimator
                            </h2>
                            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                                Estimating materials accurately prevents project delays and excess material fees.
                                Always select the calculator that explicitly matches the geometry of the formwork
                                you have constructed on site.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-400 mt-8">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-200">Flatwork (Horizontal)</h3>
                            <p>
                                For standard ground-level projects like driveways, patios, and garage floors,
                                navigate to our <strong>Slab</strong> and <strong>Driveway</strong> categories.
                                These calculations focus on wide surface areas and shallow uniform thicknesses,
                                yielding results in both cubic yards and equivalent pre-mixed bags.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-200">Structural (Vertical & Deep)</h3>
                            <p>
                                For foundations, retaining walls, and superstructure supports, utilize the
                                <strong> Footing, Wall, Beam, and Column</strong> categories. Because these forms hold
                                immense hydrostatic pressure from wet concrete, precision in subtracting window
                                voids and adding safety margins is paramount.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Platform FAQs */}
                <section
                    aria-labelledby="faq-heading"
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 sm:p-10"
                >
                    <h2
                        id="faq-heading"
                        className="text-xl sm:text-2xl font-bold text-slate-100 mb-8 font-poppins"
                    >
                        Platform & Estimation FAQs
                    </h2>
                    <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                        {faqs.map(({ q, a }) => (
                            <div key={q} className="border-l-2 border-teal-800/50 pl-4">
                                <dt className="text-base font-semibold text-slate-200 mb-2">
                                    {q}
                                </dt>
                                <dd className="text-sm text-slate-400 leading-relaxed">
                                    {a}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </main>
        </>
    );
}
