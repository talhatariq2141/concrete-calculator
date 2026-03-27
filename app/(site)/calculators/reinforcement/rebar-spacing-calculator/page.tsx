// app/(site)/calculators/rebar-spacing-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrors existing calculators:
// - Page-level Metadata (title/desc/canonical + OG/Twitter + robots)
// - Single JSON-LD <script> with @graph: WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs, intro, calculator, article, related calculators
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import RebarSpacingCalc from "@/components/calculators/RebarSpacingCalc";
import { AlignJustify } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import RebarSpacingCalcArticle from "@/components/calculators/articles/RebarSpacingCalcArticle";

/** ─────────────────────────────────────────────
 *  Page-level Metadata
 * ───────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Rebar Spacing Calculator",
    description:
        "Free Rebar Spacing Calculator — calculate rebar bar count from a target spacing, or find the c-t-c spacing for a given bar count. Includes ACI 318-19 §25.8.1 minimum clear spacing check, §7.7.2.3 maximum slab spacing check, concrete cover deduction, total steel area, and a live slab cross-section diagram for slabs, footings, walls, and beams.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/rebar-spacing-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/rebar-spacing-calculator",
        title: "Rebar Spacing Calculator — ACI 318 Bar Count & Spacing",
        description:
            "Calculate rebar bar count from a target spacing or find spacing from a bar count. ACI 318-19 compliance checks for minimum clear and maximum slab spacing, plus a live slab diagram.",
        images: [
            {
                url: "/og/rebar-spacing-calculator.png",
                width: 1200,
                height: 630,
                alt: "Rebar Spacing Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Rebar Spacing Calculator — ACI 318 Bar Count & Spacing",
        description:
            "Bidirectional rebar spacing calculator with ACI 318 compliance checks, live slab diagram, and cover deduction for slabs, footings, walls, and beams.",
        images: ["/og/rebar-spacing-calculator.png"],
    },
    robots: { index: true, follow: true },
};

/** ─────────────────────────────────────────────
 *  Page Component
 * ───────────────────────────────────────────── */
export default function RebarSpacingCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [

            /* ── WebApplication ── */
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/rebar-spacing-calculator#app",
                name: "Rebar Spacing Calculator",
                url: "https://www.concretecalculatormax.com/calculators/rebar-spacing-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Calculate rebar bar count from a target spacing, or find the resulting c-t-c spacing for a given bar count. Includes ACI 318-19 §25.8.1 minimum clear spacing check, §7.7.2.3 maximum slab spacing check, concrete cover deduction, total steel area output, and a live slab cross-section diagram. Supports slabs, footings, walls, and beams.",
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
                    name: "Calculate Rebar Spacing",
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
                        name: "Rebar Spacing Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/rebar-spacing-calculator",
                    },
                ],
            },

            /* ── HowTo ── */
            {
                "@type": "HowTo",
                name: "How to use the Rebar Spacing Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select a project type",
                        text: "Choose Slab/Patio, Strip Footing, Concrete Wall, or Beam to load sensible defaults, or enter your own values.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter span length",
                        text: "Enter the total concrete dimension being reinforced. Select feet, inches, or metres.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter concrete cover",
                        text: "Enter the edge cover — the distance from the concrete edge to the centre of the first bar. Typically 2 inches for slabs and 3 inches for footings in contact with ground.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select bar size",
                        text: "Choose your bar size from #3 through #8. The info panel shows diameter, area, and typical application.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose a calculation direction",
                        text: "Select 'Enter spacing → get bar count' if you know the target c-t-c spacing, or 'Enter bar count → get spacing' if you know how many bars you want.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter spacing or bar count",
                        text: "Enter the target c-t-c spacing in inches or feet, or enter the number of bars depending on your chosen direction.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Use Advanced mode for precise ACI checks",
                        text: "Switch to Advanced mode and enter slab thickness (for §7.7.2.3 max spacing) and maximum aggregate size (for §25.8.1 min clear with aggregate criterion).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Press Calculate",
                        text: "Click Calculate to see bar count, c-t-c spacing, clear spacing, total steel area, and the ACI 318 compliance status for each check.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Review the live slab diagram",
                        text: "Check the proportional slab cross-section diagram showing bars at their computed positions across the span.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Print or save the report",
                        text: "Use Print / Save to export a PDF with all inputs, results, and ACI compliance notes for inspections, permits, or site records.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Span length, concrete cover, bar size, and either target c-t-c spacing or desired bar count",
                    },
                ],
            },

            /* ── FAQPage ── */
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What is a rebar spacing calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A rebar spacing calculator determines bar count, c-t-c spacing, and clear spacing for reinforced concrete members and checks results against ACI 318 code requirements. It works both ways: enter a spacing to get bar count, or enter a bar count to get spacing.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate rebar spacing?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Subtract cover from both ends to get net span. Bar count = floor(net span ÷ c-t-c spacing) + 1. Reverse: c-t-c = net span ÷ (bar count − 1). Clear spacing = c-t-c − bar diameter.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the minimum rebar spacing per ACI 318?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318-19 §25.8.1 requires clear spacing ≥ max(1 inch, bar diameter, 4/3 × max aggregate size). For typical 3/4-inch aggregate and #4 bar: min clear = 1 inch.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the maximum rebar spacing for concrete slabs per ACI 318?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318-19 §7.7.2.3 limits c-t-c spacing in non-prestressed slabs to min(3 × slab thickness, 18 inches). For a 4-inch slab the max is 12 inches; for a 6-inch slab the max is 18 inches.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is c-t-c rebar spacing?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "C-t-c (centre-to-centre) spacing is measured between bar centrelines. Clear spacing is measured between bar faces. Clear = c-t-c − bar diameter. ACI limits apply to clear spacing; drawings typically show c-t-c.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Why does minimum clear rebar spacing matter?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Insufficient clear spacing prevents concrete from flowing between bars, causing voids, honeycombing, and bond failure. ACI requires minimum clear to ensure fresh concrete and aggregate can consolidate properly around the steel.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is concrete cover for rebar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Concrete cover is the distance from the concrete surface to the nearest bar face. ACI 318 Table 20.6.1.3 requires 3/4 inch to 3 inches depending on exposure. Typical values: 2 inches for indoor slabs, 3 inches for footings in contact with ground.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What rebar spacing should I use for a concrete driveway?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "#4 bar at 12 inches c-t-c in both directions is the most common specification for a 4-inch residential driveway. This passes both ACI §25.8.1 and §7.7.2.3. Use the calculator to confirm for your specific span and cover.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is total steel area in rebar calculations?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Total steel area (As) = bar count × individual bar area per ASTM A615/A706. Engineers compare As provided to As required from structural design to verify adequacy.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use this calculator for footings and walls?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Use the Strip Footing preset with 3-inch cover for footings, or the Concrete Wall preset for vertical reinforcement. ACI compliance checks apply to both. Additional ACI Chapter 13 footing requirements may also apply.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How does the bidirectional calculation work?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "In 'spacing to bars' mode: bar count = floor(net span ÷ spacing) + 1. In 'bars to spacing' mode: c-t-c = net span ÷ (bar count − 1). Both directions produce c-t-c spacing, clear spacing, steel area, and ACI compliance status.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the calculator replace a structural engineer?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "No. The calculator checks ACI 318 dimensional limits but does not perform structural design. Bar size and spacing must be designed for specific loads by a licensed structural engineer. Use this tool for estimation and code checking, not structural design.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is the rebar spacing calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The Rebar Spacing Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I print or save my rebar spacing results?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. After calculating, press Print / Save to open a print-ready report with all inputs, results, and ACI compliance status. Choose Save as PDF in your browser's print dialog to keep a digital copy.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What does the slab diagram show?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The live slab diagram shows a proportional cross-section of the span with gray cover zones at each end and teal circles representing rebar cross-sections at their computed positions. It redraws every time you calculate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What ACI code sections does the calculator check?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The calculator checks ACI 318-19 §25.8.1 (minimum clear spacing: max of 1 inch, bar diameter, 4/3 × aggregate size) and §7.7.2.3 (maximum c-t-c spacing for slabs: min of 3 × thickness, 18 inches).",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the calculator support metric units?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Span can be entered in feet, inches, or metres. Cover in inches or feet. Spacing in inches or feet. All inputs are converted internally to inches before calculation.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between rebar spacing and rebar quantity?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A rebar quantity calculator starts from a slab area and computes total footage needed for ordering. A rebar spacing calculator works within a single span, computing bar count or spacing for placement and code compliance. Both are needed at different project stages.",
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
                        <li><Link href="/" className="hover:underline">Home</Link></li>
                        <li className="px-1 text-slate-500">/</li>
                        <li><Link href="/calculators" className="hover:underline">Calculators</Link></li>
                        <li className="px-1 text-slate-500">/</li>
            <li>
              <Link href="/calculators/reinforcement" className="hover:underline">
                Reinforcement
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">Rebar Spacing Calculator</li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        {/* Title & intro */}
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <AlignJustify className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Rebar Spacing Calculator
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
                                    Calculate rebar bar count from a target centre-to-centre spacing, or find the
                                    resulting spacing for a given bar count — with automatic ACI 318-19 compliance
                                    checks for minimum clear spacing (§25.8.1) and maximum slab spacing (§7.7.2.3),
                                    concrete cover deduction, total steel area output, and a live proportional slab
                                    diagram. Supports slabs, footings, walls, and beams.
                                </p>
                            </div>
                        </div>

                        {/* Calculator component */}
                        <RebarSpacingCalc />

                        {/* Article component */}
                        <RebarSpacingCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["rebar-spacing-calculator"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
