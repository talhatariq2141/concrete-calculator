// app/(site)/calculators/rebar-weight-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrors existing calculators:
// - Page-level Metadata (title/desc/canonical + OG/Twitter + robots)
// - Single JSON-LD <script> with @graph: WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs, intro, calculator, article, related calculators
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import RebarWeightCalc from "@/components/calculators/RebarWeightCalc";
import { Scale } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import RebarWeightCalcArticle from "@/components/calculators/articles/RebarWeightCalcArticle";

/** ─────────────────────────────────────────────
 *  Page-level Metadata
 * ───────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Rebar Weight Calculator",
    description:
        "Free Rebar Weight Calculator — convert rebar linear footage to weight in lbs, US tons, and kg using ASTM A615/A706 unit weights. Supports single bar, multi-bar mix up to 6 sizes, reverse weight-to-footage lookup, per-ton steel pricing, and bars-to-order output for #3 through #10 deformed bars.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/rebar-weight-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/rebar-weight-calculator",
        title: "Rebar Weight Calculator — Footage to Lbs, Tons & Kg",
        description:
            "Convert rebar footage to weight or reverse-calculate footage from a tonnage spec. Supports #3–#10 bars, multi-bar mix, per-ton pricing, and ASTM A615/A706 unit weights.",
        images: [
            {
                url: "/og/rebar-weight-calculator.png",
                width: 1200,
                height: 630,
                alt: "Rebar Weight Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Rebar Weight Calculator — Footage to Lbs, Tons & Kg",
        description:
            "Convert rebar linear footage to weight in lbs, tons, and kg — or reverse from a tonnage spec to footage. ASTM A615/A706 unit weights, multi-bar mix, per-ton pricing.",
        images: ["/og/rebar-weight-calculator.png"],
    },
    robots: { index: true, follow: true },
};

/** ─────────────────────────────────────────────
 *  Page Component
 * ───────────────────────────────────────────── */
export default function RebarWeightCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [

            /* ── WebApplication ── */
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/rebar-weight-calculator#app",
                name: "Rebar Weight Calculator",
                url: "https://www.concretecalculatormax.com/calculators/rebar-weight-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Convert rebar linear footage to weight in lbs, US tons, and kg using ASTM A615/A706 unit weights. Supports single bar size, multi-bar mix for up to 6 sizes, and reverse weight-to-footage lookup. Includes per-ton steel pricing, bars-to-order output, and a complete ASTM reference table for #3 through #10 deformed bars.",
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
                    name: "Calculate Rebar Weight",
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
                        name: "Rebar Weight Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/rebar-weight-calculator",
                    },
                ],
            },

            /* ── HowTo ── */
            {
                "@type": "HowTo",
                name: "How to use the Rebar Weight Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Select a project type preset",
                        text: "Choose Residential, Commercial Mix, Bridge/Civil, or Target Weight to load appropriate defaults, or enter your own values.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose a calculation mode",
                        text: "Select Single bar size to convert one bar's footage to weight; Multi-bar mix for projects using several bar types; or Target weight to reverse-calculate footage from a weight spec.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter bar size and footage",
                        text: "Select your bar size (#3 through #10). Enter the total net linear footage from your material takeoff. Choose feet or metres.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set a waste factor",
                        text: "Enter a waste percentage (default 10%) to cover lap splices, hook extensions, and off-cut trim. Use 15% for complex or heavily lapped layouts.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter stock bar length",
                        text: "Enter the standard bar length from your supplier (typically 20 ft). The calculator divides gross footage by this length and rounds up to the nearest whole bar.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Add pricing (optional)",
                        text: "Enter a price per US ton to generate a material cost estimate. Add delivery or misc costs for a complete project total.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "For multi-bar mix: add all bar sizes",
                        text: "In Multi-bar mix mode, add a row for each bar size with its own footage, stock length, and waste percentage. Up to 6 bar types supported.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Press Calculate",
                        text: "Click Calculate to see weight in lbs, US tons, and kg, bars to order, and the full ASTM A615/A706 reference table with active bars highlighted.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Print or save the estimate",
                        text: "Use Print / Save to export a PDF of all inputs and results for purchase orders, RFQs, supplier quotes, or project records.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Rebar bar size, linear footage or target weight, stock bar length, and optional per-ton price",
                    },
                ],
            },

            /* ── FAQPage ── */
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What is a rebar weight calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A rebar weight calculator converts rebar linear footage to weight in lbs, US tons, and kg using ASTM A615/A706 unit weights. It can also reverse the calculation — converting a target weight from a structural spec or delivery manifest back to the equivalent footage and bar count.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How much does rebar weigh per foot?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Rebar weight per foot per ASTM A615/A706: #3 = 0.376 lb/ft, #4 = 0.668 lb/ft, #5 = 1.043 lb/ft, #6 = 1.502 lb/ft, #7 = 2.044 lb/ft, #8 = 2.670 lb/ft, #9 = 3.400 lb/ft, #10 = 4.303 lb/ft. Actual mill weights may vary ±3.5%.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I convert rebar linear footage to tons?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply total linear footage by the unit weight (lb/ft) for your bar size, then divide by 2,000. Example: 1,000 ft of #5 × 1.043 lb/ft = 1,043 lbs ÷ 2,000 = 0.522 US tons.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How do I convert rebar weight to linear footage?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Divide the weight in lbs by the unit weight (lb/ft) for your bar size. Example: 2,000 lbs ÷ 1.043 lb/ft = 1,918 ft of #5 bar. Use the Target Weight mode in our calculator to do this automatically.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between ASTM A615 and ASTM A706 rebar weight?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ASTM A615 and A706 specify identical theoretical unit weights for each bar size — the standards differ in chemistry and mechanical properties, not weight. Weight calculations apply equally to both grades.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many linear feet are in a ton of rebar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Linear feet per US ton by bar size: #3 = 5,319 ft, #4 = 2,994 ft, #5 = 1,918 ft, #6 = 1,331 ft, #7 = 979 ft, #8 = 749 ft, #9 = 588 ft, #10 = 465 ft.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Why is rebar sold by the ton?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Steel commodities are traded by weight globally because weight reflects material content and production cost. Pricing per ton is consistent across bar sizes — a ton of #4 and a ton of #8 contain the same mass of steel.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What waste percentage should I use for rebar weight?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Use 10% for standard rectangular layouts with normal laps. Use 15% for complex layouts with many bends, hooks, or irregular shapes. Waste covers lap splice lengths, hooks, and off-cut trim.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I calculate the combined weight of multiple bar sizes?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Use Multi-bar mix mode and add a row for each bar size. Enter footage, stock length, and waste per size. The calculator shows individual weights as a percentage of total steel plus a combined tonnage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the weight of a 20-foot rebar bar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Weight of a single 20-foot stock bar per ASTM: #3 = 7.5 lbs, #4 = 13.4 lbs, #5 = 20.9 lbs, #6 = 30.0 lbs, #7 = 40.9 lbs, #8 = 53.4 lbs, #9 = 68.0 lbs, #10 = 86.1 lbs.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I calculate rebar weight in kilograms?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. All results include weight in kg alongside lbs and US tons. The Target Weight mode also accepts input in kg. The calculator uses 1 lb = 0.453592 kg for all conversions.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is a standard rebar stock bar length?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "20-foot bars are the most common standard stock length in North America for #3–#8 bars. Some suppliers also offer 30-foot and 40-foot lengths. Enter any stock length in the calculator to get the exact bar count to order.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How accurate are ASTM rebar unit weights?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "ASTM A615/A706 theoretical unit weights are highly accurate for estimation. ASTM allows ±3.5% weight tolerance per bar and per lot. For structural or certified-weight applications, verify with mill test reports from your supplier.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is the rebar weight calculator free?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. The Rebar Weight Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees. All three modes — Single bar, Multi-bar mix, and Target weight reverse — are available at no cost.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I print or save my rebar weight estimate?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. After calculating, press Print / Save to open a print-ready report. In your browser's print dialog, choose Save as PDF to keep a copy for purchase orders, RFQs, or project records.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What bars does the rebar weight calculator cover?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The calculator covers #3 through #10 deformed bars per ASTM A615/A706, which accounts for the vast majority of concrete reinforcement applications from residential slabs to bridge decks.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I estimate the cost of a rebar order?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Enter a price per US ton to generate a material cost estimate. The calculator multiplies your total tonnage by the per-ton price, matching standard steel supplier invoicing. Add a delivery cost for a complete project total.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between rebar weight and rebar quantity calculators?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A rebar quantity calculator starts from a slab area and spacing to produce footage and weight — it is a design tool. A rebar weight calculator starts from a known footage or tonnage and converts between units — it is a procurement and logistics tool. Both serve different stages of a concrete project.",
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
                            Rebar Weight Calculator
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
                                        <Scale className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Rebar Weight Calculator
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
                                    Convert rebar linear footage to weight in lbs, US tons, and kg using ASTM A615 and
                                    A706 published unit weights. Supports single bar size, multi-bar mix for up to six
                                    bar types with individual waste factors, and reverse lookup from a target weight
                                    to equivalent footage and bars to order. Includes per-ton steel pricing for full
                                    procurement cost estimation.
                                </p>
                            </div>
                        </div>

                        {/* Calculator component */}
                        <RebarWeightCalc />

                        {/* Article component */}
                        <RebarWeightCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["rebar-weight-calculator"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
