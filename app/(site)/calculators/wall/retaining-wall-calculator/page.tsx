// app/(site)/calculators/wall/retaining-wall-calculator/page.tsx
// -----------------------------------------------------------------------------
// Retaining Wall Calculator page — standardized SEO structure:
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs matching BreadcrumbList
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import RetainingWallCalc from "@/components/calculators/RetainingWallCalc";
import RetainingWallCalcArticle from "@/components/calculators/articles/RetainingWallCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import { BrickWall } from "lucide-react";

export const metadata: Metadata = {
    title: "Retaining Wall Calculator",
    description:
        "Calculate retaining wall blocks, drainage gravel, geogrid layers, and installed cost. Supports SRW sizes (12×4×8 through 24×8×18), IBC compliance checks, waste allowance, and imperial/metric units.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/wall/retaining-wall-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/wall/retaining-wall-calculator",
        title: "Retaining Wall Calculator",
        description:
            "Estimate SRW blocks, drainage gravel (ft³/yd³/tons), geogrid layers, and installed cost for retaining walls up to 6 ft+.",
        images: [
            {
                url: "/og/retaining-wall-calculator.png",
                width: 1200,
                height: 630,
                alt: "Retaining Wall Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Retaining Wall Calculator",
        description:
            "Blocks, drainage gravel, geogrid, and cost for segmental retaining walls. IBC §1807.2.3 compliance checks.",
        images: ["/og/retaining-wall-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function RetainingWallCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/wall/retaining-wall-calculator#app",
                name: "Retaining Wall Calculator",
                url: "https://www.concretecalculatormax.com/calculators/wall/retaining-wall-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Estimate segmental retaining wall blocks, drainage gravel volume and weight, geogrid reinforcement layers, and total installed cost. Supports IBC 2021 §1807.2.3 compliance warnings for walls over 4 ft.",
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
                    name: "Calculate Retaining Wall Materials",
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
                        name: "Wall Calculators",
                        item: "https://www.concretecalculatormax.com/calculators/wall",
                    },
                    {
                        "@type": "ListItem",
                        position: 4,
                        name: "Retaining Wall Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/wall/retaining-wall-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to calculate materials for a retaining wall",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Pick a project preset",
                        text:
                            "Choose Small Garden (2 ft), Standard Retaining (4 ft), or Engineered (6 ft+) to load sensible defaults for all fields.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter wall dimensions",
                        text:
                            "Provide the wall length and height in feet, inches, meters, or centimeters.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select a block size",
                        text:
                            "Choose from Garden (12 × 4 × 8), Medium (16 × 6 × 10), Standard (18 × 8 × 12), or Large (24 × 8 × 18) SRW blocks — or enter a custom size.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set the drainage gravel depth",
                        text:
                            "Enter the backfill depth behind the wall. NCMA TEK 2-4B recommends at least 12 inches for walls over 3 ft.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose the aggregate type",
                        text:
                            "Select crushed #57 stone, pea gravel, or river rock — each has a different density used to estimate weight.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Adjust the waste allowance",
                        text:
                            "Default is 5%. Use 7–10% for curved walls, corners, and runs with many cut blocks.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enable Advanced mode for geogrid",
                        text:
                            "Switch to Advanced to enter geogrid vertical spacing (typical: every 2 courses) and embedment length (60% of wall height).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter unit costs (optional)",
                        text:
                            "Add cost per block, per ton of gravel, labor rate, delivery, and tax to generate an installed-cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate and print",
                        text:
                            "Click Calculate to see block count, gravel tonnage, geogrid area, and total cost. Use Print / Save to export a PDF.",
                    },
                ],
                supply: [
                    { "@type": "HowToSupply", name: "Wall length and height" },
                    { "@type": "HowToSupply", name: "SRW block size" },
                    { "@type": "HowToSupply", name: "Drainage gravel depth" },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "How many retaining wall blocks do I need?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Divide the wall face area (length × height) by the block face area (block length × block height), round up, and add 5–10% for waste. A 20 ft × 4 ft wall with 18 × 8 in blocks needs roughly 84 blocks with 5% waste.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Do retaining walls over 4 feet need an engineer?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Yes. Per IBC 2021 §1807.2.3, retaining walls with an exposed height greater than 4 feet require a permit and engineered design. The calculator displays a warning when your wall exceeds this threshold.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much drainage gravel do I need behind a retaining wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "NCMA TEK 2-4B recommends a drainage zone at least 12 inches wide for walls over 3 feet. A 20 ft × 4 ft wall with 12 in of backfill needs about 80 ft³ (~3 yd³) of crushed stone — roughly 4 tons.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is geogrid and when do I need it?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Geogrid is a polymer reinforcement fabric placed between block courses and extended back into the soil. Walls over 4 feet, or shorter walls with surcharge loads, typically require geogrid layers every 2 courses.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How long should geogrid layers extend into the soil?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "A common rule is embedment length = 60% of wall height (minimum 4 ft). For a 6 ft wall, use 3.6 ft of embedment (round up to 4 ft). Always follow the engineered design for your specific site.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What block size is best for a 4-foot retaining wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "An 18 × 8 × 12 in standard SRW block is the most common choice for 3–5 ft walls. It has enough setback and mass for good stability and is widely stocked at U.S. home improvement stores.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Do I need a concrete footing for a retaining wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Most SRW systems are dry-stacked on a compacted crushed-stone base (6 in for walls under 4 ft, 12 in or more for taller walls). A concrete footing is generally not required for segmental blocks.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Why does a retaining wall need drainage?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Without drainage, water builds up behind the wall and creates hydrostatic pressure that can push it forward or cause failure. A drainage zone of crushed stone plus a 4 in perforated drain pipe at the base allows water to escape safely.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the cost of building a retaining wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Installed cost typically ranges from $20–$50 per face-ft² for DIY SRW walls, and $35–$100+ per face-ft² for professionally installed walls with engineering, geogrid, and drainage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How deep should a retaining wall base be buried?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Bury one block course, or at least 10% of wall height, below grade. For a 4 ft wall, bury at least 6 in. In frost-prone regions, extend the base below the frost line to prevent seasonal heaving.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is batter (setback) and why does it matter?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "Batter is the backward lean of the wall face. Most SRW systems build in a 1–2° setback per course, shifting the wall's center of gravity toward the retained soil and improving stability.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I build a retaining wall without a permit?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "In most U.S. jurisdictions, walls under 4 ft do not require a permit. Walls over 4 ft, walls retaining a surcharge, and walls near property lines typically require a permit and engineered plans — always check locally.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use this tool for poured concrete retaining walls?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "This calculator is optimized for segmental (block) retaining walls. For poured-in-place concrete retaining walls, use the Wall Concrete Calculator plus the Footing Calculator, and the Rebar Calculator for steel.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What waste percentage should I use?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "5% is the default for straight runs. Use 7–10% for walls with curves, corners, step-downs, or many cut blocks. Waste accounts for damaged blocks during delivery and cuts that cannot be reused.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the calculator include capstones or corner blocks?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text:
                                "The block count covers all courses in the wall face. Capstones (typically 1 per linear foot of wall top) and specialty corner blocks are not itemized separately — add them based on your block system's recommendations.",
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
                        <li>
                            <Link href="/calculators/wall" className="hover:underline">
                                Wall
                            </Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">
                            Retaining Wall Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <BrickWall className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Retaining Wall Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-04-17"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Estimate segmental retaining wall blocks, drainage gravel, geogrid reinforcement layers, and
                                installed cost. Supports SRW sizes from 12 × 4 × 8 to 24 × 8 × 18 in, with IBC 2021
                                §1807.2.3 compliance checks for walls taller than 4 ft.
                            </p>
                        </div>

                        {/* ===== Calculator Slot ===== */}
                        <RetainingWallCalc />

                        {/* Article (features, formulas, FAQs) */}
                        <RetainingWallCalcArticle />

                        {/* Internal linking to related tools */}
                        <RelatedCalculators className="mt-8 mb-8" exclude={["retaining-wall"]} />
                    </article>
                </div>
            </main>
        </>
    );
}