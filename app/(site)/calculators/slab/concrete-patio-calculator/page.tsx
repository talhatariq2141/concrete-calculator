// app/(site)/calculators/slab/concrete-patio-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import ConcretePatioCalc from "@/components/calculators/ConcretePatioCalc";
import ConcretePatioCalcArticle from "@/components/calculators/articles/ConcretePatioCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Concrete Patio Calculator | Volume, Bags, Weight & Cost",
    description:
        "Free Concrete Patio Calculator — estimate cubic yards, pre-mixed bag counts, slab weight, and total project cost for any rectangular or circular patio. Includes ACI 318-19 thickness compliance check, ready-mix vs bag comparison, and printable PDF report.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/slab/concrete-patio-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/slab/concrete-patio-calculator",
        title: "Concrete Patio Calculator — Volume, Bags, Weight & Cost",
        description:
            "Calculate concrete volume in cubic yards and feet, bag counts for 40-lb, 60-lb, and 80-lb bags, slab weight, and full project cost for rectangular or circular patios. ACI 318-19 compliance check included.",
        images: [
            {
                url: "/og/concrete-patio-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Patio Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Patio Calculator — Volume, Bags, Weight & Cost",
        description:
            "Estimate concrete for any patio in seconds. Rectangular or circular shapes, bag counts, weight, and cost estimate with ACI compliance check.",
        images: ["/og/concrete-patio-calculator.png"],
    },
    robots: { index: true, follow: true },
};

// ── Page Component ────────────────────────────────────────────────────────────
export default function ConcretePatioCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [

            /* ── WebApplication ── */
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/slab/concrete-patio-calculator#app",
                name: "Concrete Patio Calculator",
                url: "https://www.concretecalculatormax.com/calculators/slab/concrete-patio-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Estimate concrete volume in cubic yards, cubic feet, and cubic meters; 40-lb, 60-lb, and 80-lb pre-mixed bag counts; slab weight in pounds and tons; and total project cost for rectangular or circular concrete patios. Includes ACI 318-19 §7.3 slab thickness compliance check, configurable waste factor, and optional cost estimation with ready-mix, labor, and finishing rates.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: {
                    "@type": "Organization",
                    name: "Concrete Calculator Max",
                    logo: {
                        "@type": "ImageObject",
                        url: "https://www.concretecalculatormax.com/og/logo.png",
                    },
                },
                potentialAction: {
                    "@type": "Action",
                    name: "Calculate Concrete Patio",
                },
            },

            /* ── BreadcrumbList ── */
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
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "Concrete Patio Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/slab/concrete-patio-calculator",
                    },
                ],
            },

            /* ── HowTo ── */
            {
                "@type": "HowTo",
                name: "How to use the Concrete Patio Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select estimate mode",
                        text: "Choose Quick for volume and bag counts, or Advanced to add a full cost breakdown including ready-mix price, labor rate, and finishing rate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose patio shape",
                        text: "Select Rectangular / Square for standard box patios, or Circular / Round for round patios. The correct volume formula is applied automatically.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select a project size preset",
                        text: "Click Small (10×10), Medium (12×16), or Large (16×20) to load default dimensions as a starting point, then adjust any value to match your actual project.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter patio dimensions",
                        text: "For rectangular patios, enter length and width in feet. For circular patios, enter the full diameter in feet.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set slab thickness",
                        text: "Enter slab thickness in inches. The ACI 318-19 minimum for residential patios is 4 inches. Use 5–6 inches for heavy outdoor furniture, hot tubs, or occasional light vehicle access.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set the waste factor",
                        text: "Enter a waste percentage (default 10%) to account for subgrade irregularities, form flex, and spillage. Use 15% for curved or irregular patio shapes.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter cost inputs (Advanced mode only)",
                        text: "In Advanced mode, enter your local ready-mix concrete price per cubic yard, labor rate per square foot for forming and placement, and any decorative finishing rate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Press Calculate",
                        text: "Click the Calculate button to see concrete volume in cubic yards, cubic feet, and cubic meters; bag counts for 40-lb, 60-lb, and 80-lb bags; slab weight; ACI compliance status; and cost estimate in Advanced mode.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Review ACI compliance check",
                        text: "If your slab thickness is below 4 inches, an ACI 318-19 §7.3 warning appears. Consider increasing thickness to meet the minimum before placing your order.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Check the reference table",
                        text: "Review the quick reference table for common patio sizes from 10×10 to 20×30 ft with pre-calculated volumes at 4-inch and 6-inch thickness.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Print or save the estimate",
                        text: "Press Print / Save to open a formatted report with all inputs, results, and compliance notes. Use Save as PDF in your browser's print dialog for a digital copy.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Patio dimensions (length, width or diameter), slab thickness, and waste factor",
                    },
                ],
            },

            /* ── FAQPage ── */
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "How much concrete do I need for a 10×10 patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A 10×10 ft patio at 4-inch thickness requires approximately 1.23 cubic yards including a 10% waste allowance. At 6 inches, it requires about 1.85 cubic yards. You would need approximately 56 bags of 80-lb pre-mixed concrete at 4-inch thickness.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much concrete do I need for a 12×16 patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A 12×16 ft patio at 4 inches thick requires approximately 2.37 cubic yards of concrete with 10% waste. At 6 inches it requires about 3.56 cubic yards. A project this size is more economical with ready-mix truck delivery than pre-bagged concrete.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much concrete do I need for a 16×20 patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A 16×20 ft patio at 4 inches thick requires approximately 3.95 cubic yards with 10% waste, and about 5.93 cubic yards at 6-inch thickness. At this volume, ready-mix concrete delivery is strongly recommended over hand-mixing bags.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How thick should a concrete patio be?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318-19 §7.3 recommends a minimum of 4 inches for residential exposed slabs. Use 5 inches for heavy patio furniture or hot tub slabs, and 6 inches for areas with occasional vehicle access. Thicker slabs are also advisable in freeze-thaw climates.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Should I use ready-mix or bags for a concrete patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "For patios over 1.5–2 cubic yards, ready-mix truck delivery is more economical and produces a more consistent mix than hand-mixing bags. Bags are practical only for very small patches under 0.5 cubic yards. A 12×16 patio at 4 inches requires about 107 bags of 80-lb concrete — a full day of hard labor.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What PSI concrete should I use for a patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Use 2,500–3,000 PSI for a standard residential patio in a temperate climate. Specify 3,500–4,000 PSI with air entrainment (5–7% air content) in freeze-thaw climates to prevent surface scaling. Commercial or load-bearing patios should use 4,000 PSI or higher.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate concrete for a circular patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Volume = π × (diameter ÷ 2)² × thickness in feet. For a 16 ft circular patio at 4 inches: π × 64 × 0.333 = 66.99 ft³ ÷ 27 = 2.48 yd³. Our calculator handles this automatically when you select the Circular shape option.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What waste factor should I use for a concrete patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Use 10% for standard rectangular patios. This accounts for subgrade irregularities, form flex, spillage, and rounding up to the nearest half-yard on a ready-mix order. Increase to 15% for curved or irregularly shaped patios.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How heavy is a concrete patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Normal-weight concrete weighs approximately 150 lb/ft³. A 12×16 ft patio at 4 inches (64 ft³) weighs about 9,600 lbs — nearly 5 US tons. This weight is relevant for elevated patios or when assessing soil bearing capacity beneath the slab.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does a concrete patio need rebar or wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318 does not mandate reinforcement for lightly-loaded ground-supported residential patios, but most contractors recommend 6×6 wire mesh or #3 rebar on 18-inch centers to control crack width and extend service life, especially in freeze-thaw climates.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much does a concrete patio cost?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A standard broom-finish concrete patio costs $6–$10 per square foot installed in the US, including materials, forming, placement, and curing. Decorative finishes (stamped, stained, or exposed aggregate) add $3–$8 per square foot. Use Advanced mode in the calculator to build a project-specific estimate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the ACI 318-19 §7.3 warning in the calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318-19 Section 7.3 specifies minimum thickness requirements for slabs exposed to weather. The calculator warns you when your thickness is below 4 inches because thinner slabs are more susceptible to cracking under thermal cycling, freeze-thaw, and point loading from furniture legs.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is a concrete patio calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A concrete patio calculator is a tool that estimates how much concrete is needed for a patio slab. You enter the patio dimensions and thickness, and it outputs volume in cubic yards (for ready-mix ordering), cubic feet, bag counts for pre-mixed concrete, weight, and optionally a project cost estimate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is the concrete patio calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The Concrete Patio Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees. You can use it unlimited times for different project sizes and shapes.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I print or save my patio concrete estimate?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. After calculating, click Print / Save to open a formatted report showing all inputs, volume results, bag counts, weight, and cost breakdown. In your browser's Print dialog, choose Save as PDF to keep a digital copy for purchase orders or contractor comparisons.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate cubic yards for a patio?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply length × width × thickness (all in feet), then divide by 27. For a 12×16 ft patio at 4 inches: 12 × 16 × 0.333 = 63.97 ft³ ÷ 27 = 2.37 yd³. Add your waste factor (10% is standard): 2.37 × 1.10 = 2.61 yd³ to order.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container-xl">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
                    <ol className="flex items-center flex-wrap gap-1">
                        <li>
                            <Link href="/" className="hover:underline">Home</Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
                        <li>
                            <Link href="/calculators" className="hover:underline">Calculators</Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
                        <li>
                            <Link href="/calculators/slab" className="hover:underline">Slab</Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">
                            Concrete Patio Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        {/* Title & intro */}
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Layers className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Patio Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-04-18"
                                />
                            </div>
                            <div>
                                <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                    Estimate concrete volume in cubic yards, pre-mixed bag counts, slab
                                    weight, and total project cost for any rectangular or circular patio.
                                    Includes an ACI 318-19 §7.3 thickness compliance check, configurable
                                    waste factor, and a one-click printable PDF report — from three simple
                                    dimensions.
                                </p>
                            </div>
                        </div>

                        {/* Calculator */}
                        <ConcretePatioCalc />

                        {/* Article */}
                        <ConcretePatioCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["concrete-patio-calculator"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}