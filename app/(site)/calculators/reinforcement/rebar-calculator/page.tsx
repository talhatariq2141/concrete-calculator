// app/(site)/calculators/rebar-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrors concrete-block-calculator/page.tsx:
// - Page-level Metadata (title/desc/canonical + OG/Twitter + robots)
// - Single JSON-LD <script> with @graph: WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs, intro, calculator, article, related calculators
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import RebarCalc from "@/components/calculators/RebarCalc";
import { Layers } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import RebarCalcArticle from "@/components/calculators/articles/RebarCalcArticle";

/** ─────────────────────────────────────────────
 *  Page-level Metadata
 * ───────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Rebar Calculator",
    description:
        "Free Rebar Calculator — estimate how many rebar bars you need, total linear footage, weight in lbs and tons, and project cost for concrete slabs, footings, and walls. Supports #3–#8 bars, dual-direction spacing, concrete cover, waste factor, multi-layer mats, and ACI 318 spacing checks.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/rebar-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/rebar-calculator",
        title: "Rebar Calculator — Bar Count, Footage, Weight & Cost",
        description:
            "Estimate rebar bars, total linear footage, weight, and cost for slabs, footings, and walls. Supports #3–#8 bars, dual-direction spacing, multi-layer mats, and ACI 318 minimum spacing checks.",
        images: [
            {
                url: "/og/rebar-calculator.png",
                width: 1200,
                height: 630,
                alt: "Rebar Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Rebar Calculator — Bar Count, Footage, Weight & Cost",
        description:
            "Estimate rebar bars, linear footage, weight, and cost for concrete slabs, footings, and walls.",
        images: ["/og/rebar-calculator.png"],
    },
    robots: { index: true, follow: true },
};

/** ─────────────────────────────────────────────
 *  Page Component
 * ───────────────────────────────────────────── */
export default function RebarCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            /* ── WebApplication ── */
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/rebar-calculator#app",
                name: "Rebar Calculator",
                url: "https://www.concretecalculatormax.com/calculators/rebar-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Estimate how many rebar bars you need, total linear footage, weight in lbs and tons, and project cost for concrete slabs, footings, and walls. Supports #3–#8 bars, dual-direction spacing, concrete cover, adjustable waste, multi-layer mats, and ACI 318 spacing checks.",
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
                    name: "Calculate Rebar",
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
                        name: "Rebar Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/rebar-calculator",
                    },
                ],
            },

            /* ── HowTo ── */
            {
                "@type": "HowTo",
                name: "How to use the Rebar Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select a project type",
                        text: "Choose Slab, Strip Footing, or Wall to load sensible defaults, or enter your own values.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter dimensions",
                        text: "Enter the length and width of your concrete structure in feet, inches, or meters.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set concrete cover",
                        text: "Enter the edge cover (setback from edge to first bar). Typically 2 inches for slabs and 3 inches for footings.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter a waste percentage",
                        text: "Use 10% for simple pours. Increase to 15–20% for complex layouts with many lap splices, bends, and cuts.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select bar size",
                        text: "Choose a standard ASTM bar size from #3 to #8. The reference panel shows diameter, area, weight, and common use.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set spacing per direction",
                        text: "Enter the center-to-center spacing along the length direction and width direction independently.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose number of layers",
                        text: "Select single or double-layer mat. Use double for structural slabs 6 inches or thicker.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enable Advanced mode (optional)",
                        text: "Add stock bar length, material price per foot, labor rate, and delivery cost for a full cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate",
                        text: "Click Calculate to get total bar count, linear footage, weight in lbs and tons, directional breakdown, and cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Review and print",
                        text: "Review your rebar estimate. Use Print / Save to export a PDF for bids, permits, and site records.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Slab or structure dimensions, bar size, spacing, concrete cover, and optional cost inputs",
                    },
                ],
            },

            /* ── FAQPage ── */
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What is a Rebar Calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Rebar Calculator is a tool that estimates how many rebar bars are needed for a concrete project based on the dimensions, bar size, center-to-center spacing, concrete cover, and waste factor. It can also calculate total linear footage, weight in lbs and tons, and project cost.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How does a Rebar Calculator work?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Rebar Calculator works by calculating the net span inside the concrete cover, dividing it by the spacing to find bar count, then multiplying bars by their length to get linear footage. It applies a waste factor for lap splices and off-cuts, and multiplies by the weight per foot to produce total weight.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many rebar bars do I need for my slab?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The number of rebar bars depends on your slab dimensions, concrete cover, bar spacing, and number of layers. A Rebar Calculator gives a faster and more accurate estimate than doing the math by hand.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What rebar size should I use for a concrete driveway?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "#4 rebar (1/2 inch diameter) at 12 inch center-to-center spacing in both directions is the most common specification for a 4 to 5 inch residential concrete driveway slab.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is concrete cover for rebar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Concrete cover is the minimum distance from the edge of the rebar to the nearest concrete surface. ACI 318 requires at least 1.5 inches for concrete exposed to weather and 3 inches for concrete cast against ground. Most slab edge designs use 2 to 3 inches.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the ACI 318 minimum rebar spacing?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318-19 requires that the clear distance between parallel bars be at least 1 inch, the nominal bar diameter, or 4/3 times the nominal maximum aggregate size — whichever is greatest. The Rebar Calculator warns you when your chosen spacing is tighter than this minimum.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Why should I add a waste percentage to rebar calculations?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Rebar is cut to fit, creating unusable off-cuts. Bars must overlap at splices and are often bent at ends. A 10% waste factor accounts for typical lap splices and cuts. Use 15 to 20% for complex layouts with many bends.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Rebar Calculator estimate cost?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. In Advanced mode, you can enter the material price per linear foot, labor rate per linear foot, and delivery cost. The Rebar Calculator will multiply your total footage by those rates to produce a full project cost estimate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is a double-layer rebar mat?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A double-layer rebar mat uses two grids of rebar — one near the top of the slab and one near the bottom. This is required for structural slabs 6 inches or thicker, elevated slabs, two-way slabs, and slabs subject to heavy point loads or seismic forces.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is a Rebar Calculator accurate enough for structural design?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Rebar Calculator is accurate for material quantity estimation and preliminary budgeting. However, it does not perform structural design calculations. Load-bearing elements must be designed and sealed by a licensed structural engineer.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use a Rebar Calculator for footings?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Select the Strip Footing preset to load typical dimensions and bar specifications, then adjust as needed. The calculator produces bar count, linear footage, and weight for the footing reinforcement.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I convert rebar linear footage to weight?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply total linear footage by the weight per linear foot for your bar size. For example, #4 rebar weighs 0.668 lb/ft, so 1,000 linear feet equals 668 lbs or 0.334 US tons. The Rebar Calculator performs this conversion automatically.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is the Rebar Calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The Rebar Calculator on Concrete Calculator Max is completely free to use with no registration, subscription, or hidden fees required.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I print or save my rebar estimate?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. After calculating, use the Print / Save button to open a print-optimized view with all inputs and results. Choose Save as PDF in your browser's print dialog to keep a digital copy for bids, permits, or site records.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the Rebar Calculator support metric units?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. You can enter dimensions in feet, inches, or meters for the length and width fields. The calculator converts all inputs to feet internally before computing results.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between a Rebar Calculator and a rebar estimator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The terms are used interchangeably. Both refer to a tool that estimates the quantity of reinforcing steel bars required for a concrete project based on dimensions, spacing, and bar size.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Rebar Calculator be used by homeowners?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Homeowners can use the Rebar Calculator to estimate how much rebar to buy for a DIY driveway, patio, sidewalk, or footing project before visiting a materials supplier.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can contractors use a Rebar Calculator for bidding?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Contractors can use the Rebar Calculator in Advanced mode to produce a fast material takeoff — bar count, total footage, weight in tons, and full cost estimate — for inclusion in project bids and proposals.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <>
            {/* JSON-LD graph */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container-xl">
                {/* Visible breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
                    <ol className="flex items-center flex-wrap gap-1">
                        <li>
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
                        <li>
                            <Link href="/calculators" className="hover:underline">
                                Calculators
                            </Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
            <li>
              <Link href="/calculators/reinforcement" className="hover:underline">
                Reinforcement
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">
                            Rebar Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        {/* Title & short intro */}
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Layers className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Rebar Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-03-27"
                                />
                            </div>
                            <div>
                                <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                    Estimate rebar bar count, total linear footage, weight in lbs and
                                    tons, and project cost for concrete slabs, footings, and walls.
                                    Supports #3–#8 bars, dual-direction spacing, concrete cover, multi-layer
                                    mats, ACI 318 spacing checks, and optional cost estimation in Advanced
                                    mode.
                                </p>
                            </div>
                        </div>

                        {/* Calculator */}
                        <RebarCalc />

                        {/* Article (features, formulas, spacing guide, FAQs) */}
                        <RebarCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["rebar"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
