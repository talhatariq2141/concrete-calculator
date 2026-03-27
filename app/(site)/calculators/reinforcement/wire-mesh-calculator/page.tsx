// app/(site)/calculators/wire-mesh-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrors existing calculators:
// - Page-level Metadata (title/desc/canonical + OG/Twitter + robots)
// - Single JSON-LD <script> with @graph: WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs, intro, calculator, article, related calculators
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import WireMeshCalc from "@/components/calculators/WireMeshCalc";
import { Grid2x2 } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import WireMeshCalcArticle from "@/components/calculators/articles/WireMeshCalcArticle";

/** ─────────────────────────────────────────────
 *  Page-level Metadata
 * ───────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Wire Mesh Calculator",
    description:
        "Free Wire Mesh / WWF Calculator — estimate how many rolls or sheets of welded wire fabric you need for concrete slabs, driveways, sidewalks, and industrial floors. Includes ASTM A1064 mesh designation reference, lap splice allowance, weight in lbs and tons, ACI 360R-10 compliance warning, and optional cost estimation.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/wire-mesh-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/wire-mesh-calculator",
        title: "Wire Mesh / WWF Calculator — Rolls, Sheets, Weight & Cost",
        description:
            "Estimate welded wire fabric rolls or sheets, total weight, and cost for concrete slabs, driveways, and flatwork. Supports ASTM A1064 designations, lap splice allowance, double-layer mats, and ACI 360R-10 compliance checks.",
        images: [
            {
                url: "/og/wire-mesh-calculator.png",
                width: 1200,
                height: 630,
                alt: "Wire Mesh / WWF Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Wire Mesh / WWF Calculator — Rolls, Sheets, Weight & Cost",
        description:
            "Estimate welded wire fabric rolls or sheets, weight, and cost for concrete slabs, driveways, and flatwork. ASTM A1064 reference included.",
        images: ["/og/wire-mesh-calculator.png"],
    },
    robots: { index: true, follow: true },
};

/** ─────────────────────────────────────────────
 *  Page Component
 * ───────────────────────────────────────────── */
export default function WireMeshCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [

            /* ── WebApplication ── */
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/wire-mesh-calculator#app",
                name: "Wire Mesh / WWF Calculator",
                url: "https://www.concretecalculatormax.com/calculators/wire-mesh-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Estimate how many rolls or sheets of welded wire fabric (WWF) you need for concrete slabs, driveways, sidewalks, and industrial floors. Includes ASTM A1064 mesh designation reference, lap splice allowance, weight in lbs and tons, ACI 360R-10 compliance warning, and optional cost estimation.",
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
                    name: "Calculate Wire Mesh",
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
                        name: "Wire Mesh Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/wire-mesh-calculator",
                    },
                ],
            },

            /* ── HowTo ── */
            {
                "@type": "HowTo",
                name: "How to use the Wire Mesh / WWF Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select a project type",
                        text: "Choose Driveway, Patio/Slab, Sidewalk, or Industrial Floor to load sensible defaults, or enter your own values.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter slab dimensions",
                        text: "Enter the length and width of your concrete slab. Choose your preferred unit — feet, inches, or meters.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select a mesh designation",
                        text: "Choose an ASTM A1064 mesh designation from the dropdown. The info panel shows wire diameter, weight, and typical application for the selected mesh.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose a form factor",
                        text: "Select Roll (5×150 ft), Sheet (5×10 ft), or Large sheet (6×20 ft) to match how your supplier sells the material.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter lap splice and waste",
                        text: "Set the lap overlap (minimum one mesh spacing per ACI 318) and waste percentage. Use 10% for rectangular slabs and 15% for irregular shapes.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enable Advanced mode (optional)",
                        text: "Switch to Advanced mode to add a second layer, price per square foot or per unit, and delivery cost for a full project estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Check the ACI compliance warning",
                        text: "If your selected mesh is too light for your project type, an ACI 360R-10 warning is displayed with an upgrade recommendation.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Press Calculate",
                        text: "Click Calculate to see total rolls or sheets needed, gross area, weight in lbs and tons, breakdown, and optional cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Review and print",
                        text: "Review your estimate. Use Print / Save to export a PDF for purchase orders, permits, or site records.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Slab dimensions, ASTM A1064 mesh designation, form factor, lap splice distance, and optional cost inputs",
                    },
                ],
            },

            /* ── FAQPage ── */
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What is a wire mesh calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A wire mesh calculator estimates how many rolls or sheets of welded wire fabric you need for a concrete project based on slab dimensions, mesh designation, lap-splice allowance, and waste factor. It also calculates total weight and optional material cost.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How does a wire mesh calculator work?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The calculator multiplies length by width to get slab area, adds a lap-splice allowance for sheet joins, applies the waste factor and number of layers, then divides by the roll or sheet size and rounds up to get total units needed.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many sheets of wire mesh do I need for a 20x20 concrete slab?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "For a 20×20 ft slab (400 sq ft) using 5×10 ft sheets with 6×6 W2.0×W2.0 mesh, a 6-inch lap, and 10% waste, you need approximately 9–10 sheets. Use the calculator above to get the exact count for your dimensions and mesh selection.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What mesh designation should I use for a concrete driveway?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 360R-10 recommends a minimum of W2.0 wire for driveways subject to passenger vehicle loads. The most common specification is 6×6 W2.0×W2.0. For driveways used by heavy trucks or RVs, upgrade to 6×6 W2.9×W2.9.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between W1.4 and W2.0 wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "W1.4 has a 0.135-inch diameter wire and weighs 0.21 lb/sq ft in 6×6 spacing — suited for light slabs and sidewalks. W2.0 has a 0.160-inch diameter and weighs 0.29 lb/sq ft — recommended for driveways and garage floors subject to vehicle loads.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is ASTM A1064 wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ASTM A1064 is the standard specification for carbon-steel wire and welded wire reinforcement for concrete, published by ASTM International. It defines requirements for wire tensile strength, weld shear strength, and dimensional tolerances for welded wire fabric used in concrete flatwork.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the lap splice requirement for wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ACI 318 Section 25.8.1 requires that welded wire fabric overlaps by at least one full mesh spacing at each joint. For 6×6 mesh this is a minimum 6-inch lap; for 4×4 mesh it is a minimum 4-inch lap. Most contractors use a standard 6-inch lap on all mesh.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is wire mesh the same as rebar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "No. Wire mesh is a pre-assembled grid of welded steel wires providing distributed crack control across the full slab area. Rebar consists of individual deformed bars placed in a grid on site. Wire mesh is faster to install for flatwork; rebar is required for structural load-bearing elements.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "When should I use wire mesh instead of rebar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Wire mesh is best for large flatwork pours — driveways, sidewalks, patios, and slabs-on-grade — where the goal is crack control. Rebar is required for beams, columns, footings, and any application governed by a structural engineer's drawing.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Should I use a single or double layer of wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A single layer at mid-depth is standard for 4 to 5 inch slabs. A double layer is used for slabs 6 inches or thicker, elevated structural slabs, and applications specified by a structural engineer. Double-layer installations roughly double the material cost.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I calculate the weight of wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply the total gross mesh area (including lap and waste) by the weight per square foot for your designation. For 6×6 W2.0×W2.0 at 0.29 lb/sq ft: 500 sq ft × 0.29 = 145 lbs. The wire mesh calculator does this automatically.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What waste percentage should I add for wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Use 10% for simple rectangular slabs. Use 15% for L-shaped, T-shaped, or irregular slab footprints where more edge cutting is required. On very large pours using rolls, 5 to 8% may be sufficient.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between a roll and a sheet of wire mesh?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Rolls are large continuous pieces — typically 5 ft wide by 150 ft long (750 sq ft) — used for long sidewalks and large commercial slabs. Sheets are pre-cut panels — 5×10 ft (50 sq ft) or 6×20 ft (120 sq ft) — easier to handle on smaller residential jobs and transport in a pickup truck.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I estimate cost with the wire mesh calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Enable Advanced mode and enter a price per square foot or price per roll/sheet. Add an optional delivery cost for a full project total. If both price inputs are entered, square foot price takes precedence.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is the wire mesh calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The Wire Mesh / WWF Calculator on Concrete Calculator Max is completely free to use with no registration, subscription, or hidden fees required.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I print or save my wire mesh estimate?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. After calculating, press the Print / Save button to open a print-optimized report with all inputs and results. In your browser's print dialog, choose Save as PDF to keep a digital copy for purchase orders, permits, or bid documentation.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the wire mesh calculator support metric units?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. You can enter slab length and width in feet, inches, or meters. The calculator converts all inputs to feet internally before computing results.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use a custom mesh designation in the calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Select Custom dimensions from the mesh dropdown and enter your longitudinal wire spacing, transverse wire spacing, and W-number. The calculator uses these values to estimate weight and coverage for any non-standard or engineered mesh specification.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <>
            {/* JSON-LD structured data */}
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
                            Wire Mesh Calculator
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
                                        <Grid2x2 className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Wire Mesh / WWF Calculator
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
                                    Estimate rolls or sheets of welded wire fabric (WWF), total weight, and
                                    material cost for concrete slabs, driveways, sidewalks, and industrial
                                    floors. Includes the full ASTM A1064 mesh designation reference, lap-splice
                                    allowance, double-layer mat support, and an ACI 360R-10 compliance warning
                                    for vehicle-load applications.
                                </p>
                            </div>
                        </div>

                        {/* Calculator component */}
                        <WireMeshCalc />

                        {/* Article component */}
                        <WireMeshCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["wire-mesh-calculator"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
