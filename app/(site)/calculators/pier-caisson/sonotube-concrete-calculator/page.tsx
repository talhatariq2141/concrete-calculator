// app/(site)/calculators/pier-caisson/sonotube-concrete-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO page for the Sonotube Concrete Calculator.
// - Page-level Metadata (title/description/canonical + OG/Twitter + robots)
// - One JSON-LD <script> with an @graph containing:
//     WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs that match the BreadcrumbList
// -----------------------------------------------------------------------------

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SonotubeCalc from "@/components/calculators/SonotubeCalc";
import { Box } from "lucide-react";
import SonotubeCalcArticle from "@/components/calculators/articles/SonotubeCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

const CANONICAL =
    "https://www.concretecalculatormax.com/calculators/pier-caisson/sonotube-concrete-calculator";

export const metadata: Metadata = {
    title: "Sonotube Concrete Calculator — Bags, Yards & Volume per Tube",
    description:
        "Free sonotube concrete calculator. Compute volume, cubic yards, and 40/60/80-lb bag counts for any tube diameter and depth. Presets for deck posts, fence posts, and structural piers. Includes IBC §1809 frost-line warning.",
    alternates: { canonical: CANONICAL },
    openGraph: {
        type: "article",
        url: CANONICAL,
        title: "Sonotube Concrete Calculator — Bags, Yards & Volume per Tube",
        description:
            "Calculate concrete for sonotube forms in seconds. Per-tube volume, project totals, bag counts (40/60/80 lb), cubic yards, and frost-line compliance check.",
        images: [
            {
                url: "/og/sonotube-concrete-calculator.png",
                width: 1200,
                height: 630,
                alt: "Sonotube Concrete Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sonotube Concrete Calculator",
        description:
            "Instant concrete volume & bag count for sonotube piers. Deck post, fence post, and structural pier presets.",
        images: ["/og/sonotube-concrete-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function SonotubeCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": `${CANONICAL}#app`,
                name: "Sonotube Concrete Calculator",
                url: CANONICAL,
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Free online sonotube concrete calculator. Computes per-tube volume, project totals, cubic yards, and bag counts for 40/60/80-lb pre-mixed concrete bags. Presets for deck posts, fence posts, and structural piers. Includes IBC §1809 frost-line compliance warning.",
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
                    name: "Calculate Sonotube Concrete",
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
                        name: "Pier & Caisson Calculators",
                        item:
                            "https://www.concretecalculatormax.com/calculators/pier-caisson",
                    },
                    {
                        "@type": "ListItem",
                        position: 4,
                        name: "Sonotube Concrete Calculator",
                        item: CANONICAL,
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to calculate concrete for a sonotube",
                totalTime: "PT1M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Pick a project type preset",
                        text: "Click Deck Post (8″×42″), Fence Post (6″×36″), or Structural Pier (12″×48″) to load sensible defaults you can override.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter tube diameter",
                        text: "Input the nominal sonotube diameter and choose its unit — inches, feet, centimeters, or millimeters.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter tube depth",
                        text: "Input the total pour depth from grade to bottom of hole. Pick inches, feet, meters, or centimeters.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set number of tubes",
                        text: "Enter how many identical tubes you are pouring on this project. Totals multiply automatically.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Add waste allowance",
                        text: "Apply 5–10% overage to protect against spill, over-excavation, and partial-bag loss. Default is 10%.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose bag size",
                        text: "Pick 40-lb, 60-lb, or 80-lb bags. The calculator reports counts for all three simultaneously.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Switch to advanced mode (optional)",
                        text: "Toggle Advanced to add price per bag, ready-mix price per cubic yard, and tube-form unit cost.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate",
                        text: "Click Calculate to reveal per-tube volume, project totals, bag counts, cost breakdown, and compliance warnings.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Review frost-line warning",
                        text: "If tube depth is below 36 inches, the IBC §1809 warning appears. Verify your local frost-line requirement before pouring.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Print or save results",
                        text: "Use the Print / Save button to export a branded summary for site logs, permit files, or supplier orders.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Tube diameter, depth, and quantity",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What is a sonotube?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Sonotube is the trademarked (now genericized) name for a waxed-cardboard cylindrical concrete form used to shape round columns, piers, and posts. Other brands work the same — enter the nominal inside diameter into the calculator.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many bags of concrete do I need for one sonotube?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "It depends on diameter and depth. An 8″ × 42″ tube holds about 1.22 ft³, which equals roughly 3 bags of 60 lb or 2 bags of 80 lb pre-mixed concrete per tube — before waste. This calculator does the exact math for any size.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Should I pour with bags or order ready-mix?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Bags are cheaper and easier for up to about 20 cubic feet (roughly 5–7 small tubes). Beyond that, a ready-mix truck is faster and usually cheaper once you factor in labor. Advanced Mode compares both cost paths.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How deep does a sonotube need to go?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "In the U.S., IBC §1809.5 and IRC R403.1.4 require footings to extend below the local frost line — typically 36 inches, but up to 48+ inches in northern states. The calculator warns you if you enter less than 36 inches.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What diameter sonotube should I use for a deck post?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "8″ diameter is the residential standard for deck posts supporting 6×6 wood columns. Use 10″ or 12″ for heavy loads, long-span beams, or commercial work per your structural drawings.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Do I need to add waste allowance for sonotubes?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes — 5–10% is recommended. Tubes are clean forms, so waste is lower than slab pours, but over-excavation, spillage, and partial bags still add up. Use 10% for hand-dug holes and 5% for augered or machine-drilled holes.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use this for belled or flared bases?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "No — this tool is for straight cylindrical tubes only. For belled caissons, use the Pier / Caisson Concrete Calculator which adds a frustum (belled base) volume to the shaft.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What concrete mix strength should I use?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "3000–4000 psi (20–28 MPa) is standard for residential piers per ACI 332. For structural piers, follow the engineer's spec — typically 4000 psi or higher with air-entrainment in freeze-thaw zones.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Do I need rebar in a sonotube?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "For anything structural, yes. ACI 318 requires longitudinal reinforcement in columns. Even fence and deck posts benefit from one or two vertical #4 bars plus ties to resist uplift and lateral loads. The calculator does not size rebar — that is a structural engineer's job.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the calculator account for tube wall thickness?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "No — cardboard tube walls are typically 0.2–0.3 inches and the nominal diameter printed on the form already refers to the inside dimension. Volume math uses the nominal diameter as the concrete diameter.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I enter different units for diameter and depth?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Diameter accepts inches, feet, cm, or mm; depth accepts inches, feet, meters, or cm. Enter each field in whatever unit your tape measure or spec sheet uses — the engine converts everything to feet internally.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What if my hole is wider than the tube at the bottom?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Extra concrete fills the over-excavated space. This calculator assumes a clean cylindrical pour. Add 5–10% waste, or bump one step further to account for typical over-digging.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I brace a sonotube before pouring?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Backfill tamped earth around the tube every 12 inches of depth, and use 2×4 braces nailed to stakes above grade to hold alignment. Check plumb on two faces before pouring. Bracing stays on for 24 hours minimum.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "When can I strip the sonotube off?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Wait 24–48 hours after pour in warm weather, longer in cold weather. Score the seam with a utility knife and peel the cardboard away. Concrete should be hard to the touch with no surface moisture.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What project presets are included?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Three one-click presets: Deck Post (8″ × 42″), Fence Post (6″ × 36″), and Structural Pier (12″ × 48″). Each loads defaults you can override for any field.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is this calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes — completely free, no sign-up, no ads in the tool area, and results are printable. Concrete Calculator Max is 100% free for contractors, engineers, and DIYers.",
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
                        <li>
                            <Link
                                href="/calculators/pier-caisson"
                                className="hover:underline"
                            >
                                Pier &amp; Caisson
                            </Link>
                        </li>
                        <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">
                            Sonotube Concrete Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Box className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Sonotube Concrete Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-04-17"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Calculate concrete volume, cubic yards, and bag counts for
                                sonotube forms in seconds. Supports deck-post, fence-post, and
                                structural-pier presets, mixed-unit inputs (in / ft / m / cm /
                                mm), 40 / 60 / 80-lb bag sizing, waste allowance, and IBC §1809
                                frost-line compliance checks — ideal for contractors, builders,
                                and DIYers.
                            </p>
                        </div>

                        {/* ===== Calculator Slot ===== */}
                        <SonotubeCalc />

                        {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
                        <SonotubeCalcArticle />

                        {/* Internal linking to related tools */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["sonotube-concrete-calculator"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}