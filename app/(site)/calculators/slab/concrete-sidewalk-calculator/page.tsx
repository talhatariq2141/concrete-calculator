// app/(site)/calculators/concrete-sidewalk-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrors existing calculators:
// - Page-level Metadata (title/desc/canonical + OG/Twitter + robots)
// - Single JSON-LD <script> with @graph: WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs, intro, calculator, article, related calculators
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ConcreteSidewalkCalc from "@/components/calculators/ConcreteSidewalkCalc";
import { Footprints } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import ConcreteSidewalkCalcArticle from "@/components/calculators/articles/ConcreteSidewalkCalcArticle";

/** ─────────────────────────────────────────────
 *  Page-level Metadata
 * ───────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Concrete Sidewalk Calculator",
    description:
        "Free Concrete Sidewalk Calculator — estimate cubic yards, pre-mixed bags, slab weight, control joint count, and expansion joint count for a new concrete sidewalk or walkway. Includes a live plan-view joint diagram, ACPA control joint spacing compliance check, and optional cost estimation with ready-mix pricing.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/concrete-sidewalk-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/concrete-sidewalk-calculator",
        title: "Concrete Sidewalk Calculator — Volume, Bags, Joints & Cost",
        description:
            "Calculate concrete volume, bag count, control joints, and expansion joints for any sidewalk or walkway. Includes a proportional plan-view joint diagram and ACPA spacing compliance check.",
        images: [
            {
                url: "/og/concrete-sidewalk-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Sidewalk Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Sidewalk Calculator — Volume, Bags, Joints & Cost",
        description:
            "Estimate concrete volume, bags, joint counts, and project cost for a new sidewalk. Includes a live joint diagram and ACPA spacing check.",
        images: ["/og/concrete-sidewalk-calculator.png"],
    },
    robots: { index: true, follow: true },
};

/** ─────────────────────────────────────────────
 *  Page Component
 * ───────────────────────────────────────────── */
export default function ConcreteSidewalkCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [

            /* ── WebApplication ── */
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/concrete-sidewalk-calculator#app",
                name: "Concrete Sidewalk Calculator",
                url: "https://www.concretecalculatormax.com/calculators/concrete-sidewalk-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Estimate concrete volume in cubic yards, cubic feet, and cubic metres; 60-lb and 80-lb pre-mixed bag counts; slab weight; control joint count; and expansion joint count for a concrete sidewalk or walkway. Includes a proportional plan-view joint diagram, ACPA control joint spacing compliance check, and optional cost estimation.",
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
                    name: "Calculate Concrete Sidewalk",
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
                        name: "Concrete Sidewalk Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/concrete-sidewalk-calculator",
                    },
                ],
            },

            /* ── HowTo ── */
            {
                "@type": "HowTo",
                name: "How to use the Concrete Sidewalk Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select a project type preset",
                        text: "Choose Residential, Municipal/ADA, or Garden Walkway to load sensible defaults for dimensions and joint spacing, or enter your own values.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter sidewalk length",
                        text: "Enter the total length of the sidewalk run. Select feet, inches, or metres.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter sidewalk width",
                        text: "Enter the sidewalk width perpendicular to travel. ADA routes require at least 36 inches clear width; 4 feet is standard for residential.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter slab thickness",
                        text: "Enter the slab depth. Use 4 inches for foot-traffic-only sidewalks, 6 inches for municipal or ADA paths.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set the waste factor",
                        text: "Enter a waste percentage (default 10%) to account for subbase irregularities, spillage, and overfill. Use 15% for curved or sloped paths.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter control joint spacing",
                        text: "Enter your target control joint spacing. Per ACPA guidance, keep spacing to 1–1.5× the slab width with a maximum of 15 ft. The calculator warns if you exceed this.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter expansion joint spacing",
                        text: "Enter your expansion joint spacing (typically every 20–30 ft). Expansion joints are always required where the sidewalk meets walls, steps, or curbs.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Add cost inputs (optional)",
                        text: "Switch to Advanced mode and enter concrete price per cubic yard, finishing cost, and delivery fees for a full project cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Press Calculate",
                        text: "Click Calculate to see cubic yards, bags, slab weight, joint counts, ACPA compliance status, and the plan-view joint diagram.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Print or save the estimate",
                        text: "Use Print / Save to export a PDF with all results and ACPA compliance notes for purchase orders, permits, or contractor bids.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Sidewalk length, width, thickness, waste factor, and control/expansion joint spacings",
                    },
                ],
            },

            /* ── FAQPage ── */
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "How many cubic yards of concrete do I need for a sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply length × width × thickness (all in feet) and divide by 27. For a 50 ft × 4 ft × 4-inch sidewalk: 50 × 4 × 0.333 = 66.6 ft³ ÷ 27 = 2.47 yd³. Add 10% waste to get 2.72 yd³. Our calculator handles this automatically.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How thick should a concrete sidewalk be?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "4 inches for residential pedestrian-only sidewalks. 6 inches for municipal, ADA-accessible, or heavy-use paths. 6–8 inches for sidewalks that cross driveways or receive light vehicle traffic.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What PSI concrete should I use for a sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "2,500–3,000 PSI for residential foot-traffic sidewalks. 3,500–4,000 PSI for municipal or ADA paths. In freeze-thaw climates, specify air-entrained concrete with 5–7% air content.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How far apart should control joints be in a concrete sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACPA recommends 1× to 1.5× the slab width, with a maximum of 15 ft. For a 4-foot-wide sidewalk, place control joints every 4–6 feet. Our calculator warns when spacing exceeds this limit.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between a control joint and an expansion joint?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A control joint is a tooled groove or saw cut (at least 1/4 of slab depth) that guides shrinkage cracking to a controlled location. An expansion joint is a full-depth gap filled with compressible material that allows thermal expansion without pushing against adjacent structures.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How deep should control joints be cut in a concrete sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "At least 1/4 of the slab thickness: 1 inch for a 4-inch slab, 1.5 inches for a 6-inch slab. Saw-cutting should occur within 4–12 hours of placement on warm days before random cracking begins.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many bags of concrete do I need for a sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Divide total cubic feet by bag yield: 0.45 ft³ per 60-lb bag, 0.60 ft³ per 80-lb bag. For any project larger than 1 cubic yard, ready-mix concrete is more economical than bags.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Should I use ready-mix or bags for a concrete sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Ready-mix is more economical for sidewalks longer than 15–20 feet. Bags are practical for very small patches under 0.5 yd³. Mixing many bags is labour-intensive and rarely matches the quality of a consistent ready-mix design.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the minimum width for an ADA-accessible sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ADA requires a minimum clear width of 36 inches for accessible routes. Most municipalities require 48 inches (4 feet) for street-adjacent sidewalks. Passing spaces of 60 inches (5 feet) are required every 200 feet.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much does it cost to pour a concrete sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Typical installed cost in the US is $6–$12 per square foot, covering material, forming, placement, finishing, and curing. A 50 ft × 4 ft sidewalk typically costs $1,200–$2,400. Use Advanced mode to build a project-specific estimate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is a waste factor for concrete and why is it needed?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The waste factor (typically 10%) accounts for subbase irregularities, spills during placement, form deflection, and rounding up to the nearest order increment. Use 15% for curved or sloped paths.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate concrete for a curved sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "For a gently curved sidewalk, approximate it as a rectangle using the path centreline length and average width, then increase the waste factor to 15% to account for irregular form geometry. For complex curves, break the path into straight segments and sum the volumes.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the plan-view joint diagram?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The plan-view joint diagram is a proportional top-down drawing of your sidewalk showing control joints as teal dashed lines and expansion joints as orange solid lines at their calculated positions. It gives a visual check of your joint pattern before placing concrete.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is the concrete sidewalk calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The Concrete Sidewalk Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I print or save my sidewalk concrete estimate?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. After calculating, press Print / Save to open a print-ready report. Choose Save as PDF in your browser's print dialog to keep a copy for purchase orders, permits, or contractor bids.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the calculator support metric units?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Length and width can be entered in metres; the calculator outputs volume in cubic metres alongside cubic yards and cubic feet. Thickness and joint spacings accept feet or inches.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the ACPA control joint spacing recommendation?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The American Concrete Pavement Association (ACPA) recommends control joint spacing of 1× to 1.5× the slab width, with an absolute maximum of 15 feet. Wider spacing significantly increases the risk of mid-panel cracking.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate the weight of a concrete sidewalk?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply the gross volume in cubic feet by 150 lb/ft³ (normal-weight concrete density). For a 73 ft³ pour: 73 × 150 = 10,950 lbs (approximately 5.5 US tons). Our calculator shows this automatically.",
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
              <Link href="/calculators/slab" className="hover:underline">
                Slab
              </Link>
            </li>
            <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">Concrete Sidewalk Calculator</li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        {/* Title & intro */}
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Footprints className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Sidewalk Calculator
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
                                    Estimate concrete volume in cubic yards, pre-mixed bag counts, slab weight,
                                    control joint count, and expansion joint count for any concrete sidewalk or
                                    walkway. Includes a live plan-view joint diagram, an ACPA control joint
                                    spacing compliance check, and optional cost estimation — all from three
                                    simple dimensions.
                                </p>
                            </div>
                        </div>

                        {/* Calculator component */}
                        <ConcreteSidewalkCalc />

                        {/* Article component */}
                        <ConcreteSidewalkCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["concrete-sidewalk-calculator"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
