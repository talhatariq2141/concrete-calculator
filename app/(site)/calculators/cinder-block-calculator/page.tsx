// app/calculators/cinder-block-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrors existing calculator pages:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs matching BreadcrumbList
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrickWall } from "lucide-react";
import CinderBlockCalc from "@/components/calculators/CinderBlockCalc";
import CinderBlockCalcArticle from "@/components/calculators/articles/CinderBlockCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata */
export const metadata: Metadata = {
    title: "Cinder Block Calculator | Block Quantity, Mortar & Cost Estimator",
    description:
        "Calculate how many cinder blocks you need for a wall, estimate mortar, wastage, and total material cost with this USA-focused Cinder Block Calculator and Cinder Block Cost Calculator.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/cinder-block-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/cinder-block-calculator",
        title:
            "Cinder Block Calculator | Block Quantity, Mortar & Cost Estimator",
        description:
            "Estimate cinder block quantity, mortar bags, wall openings deduction, and full installed cost. Supports standard U.S. CMU block sizes with imperial and metric input.",
        images: [
            {
                url: "/og/cinder-block-calculator.png",
                width: 1200,
                height: 630,
                alt: "Cinder Block Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Cinder Block Calculator",
        description:
            "Free cinder block calculator and cost estimator — calculate block quantity, mortar, and installed wall cost for your masonry project.",
        images: ["/og/cinder-block-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function CinderBlockCalculatorPage() {
    /** JSON-LD rich results graph */
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/cinder-block-calculator#app",
                name: "Cinder Block Calculator",
                url: "https://www.concretecalculatormax.com/calculators/cinder-block-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Calculate how many cinder blocks you need for a wall, estimate mortar bags, deduct wall openings, and estimate total block material cost and installed wall cost.",
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
                    name: "Calculate Cinder Block Quantity and Cost",
                },
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
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "Cinder Block Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/cinder-block-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to calculate cinder blocks for a wall",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select unit system",
                        text: "Choose imperial (feet) or metric (meters) for your input dimensions.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter wall dimensions",
                        text: "Enter the gross wall length and height. These are the outer dimensions before deducting openings.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select block size",
                        text: "Choose from common U.S. nominal CMU block sizes or enter a custom block size.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set mortar and waste",
                        text: "Select your mortar bag size and adjust the waste percentage (default 5%).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Add openings",
                        text: "Add doors, windows, vents, or other openings with their dimensions and quantities to deduct area.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter cost inputs",
                        text: "Optionally enter cost per block, mortar bag price, labor rate, and other costs to get a full installed cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate",
                        text: "Click Calculate to see block count, mortar bags, cost breakdown, and a step-by-step calculation summary.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Wall dimensions and block specifications",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "How many cinder blocks do I need for a wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Divide the net wall area (length × height minus openings) by the block face area. For a standard 8×8×16 nominal block, you need 1.125 blocks per square foot. Add a 5–10% waste allowance and always round up.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate cinder block cost?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply your final block count by the cost per block. Our cinder block cost calculator extends this by adding mortar, labor, delivery, tax, and optional extras for a complete project budget.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What size is a standard cinder block in the USA?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The most common nominal size is 8 × 8 × 16 inches. Actual dimensions are approximately 7-5/8 × 7-5/8 × 15-5/8 inches to allow for a 3/8 inch mortar joint.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many 8x8x16 cinder blocks are in a square foot?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "There are 1.125 standard 8×8×16 nominal blocks per square foot, derived from the face area: (16/12) × (8/12) = 0.888 ft², and 1 / 0.888 ≈ 1.125.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much mortar do I need for cinder blocks?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "One 80 lb bag of mortar covers approximately 13 standard 8×8×16 blocks. One 60 lb bag covers roughly 9–10 blocks. Actual usage varies by joint thickness, block size, and technique.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does this cinder block calculator include waste?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The default waste factor is 5%, with quick presets for 7% (moderate layouts) and 10% (complex layouts with many cuts). You can also enter any custom percentage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can this tool be used as a cinder block cost calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Enter the cost per block, mortar bag price, labor rate, delivery cost, and tax to get an estimated total material and installed wall cost. This is a combined quantity estimator and cinder block cost calculator.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between a cinder block and a concrete block?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Traditional cinder blocks used coal cinder aggregate; modern CMUs use concrete aggregate. Today most blocks sold in the U.S. are concrete blocks, but both terms are used interchangeably by homeowners and contractors.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <>
            {/* JSON-LD graph (single block) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container-xl">
                {/* Visible breadcrumbs (match BreadcrumbList above) */}
                <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
                    <ol className="flex gap-2">
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
                        <li aria-current="page" className="text-slate-200">
                            Cinder Block Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        {/* Title & short intro (intent match) */}
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <BrickWall className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Cinder Block Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-03-12"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Calculate how many cinder blocks you need for your wall, estimate mortar bags, deduct openings for doors and windows, and use this free <strong className="text-slate-300">cinder block cost calculator</strong> to get a complete material and installed wall cost estimate — using standard U.S. nominal CMU block sizes.
                            </p>
                        </div>

                        {/* ===== Calculator Slot ===== */}
                        <CinderBlockCalc />

                        {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
                        <CinderBlockCalcArticle />

                        {/* Internal linking to related tools */}
                        <RelatedCalculators className="mt-8 mb-8" exclude={["cinder-block"]} />
                    </article>
                </div>
            </main>
        </>
    );
}
