// app/(site)/calculators/cmu-block-calculator/page.tsx
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
import CMUBlockCalc from "@/components/calculators/CMUBlockCalc";
import CMUBlockCalcArticle from "@/components/calculators/articles/CMUBlockCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

/** Page-level metadata */
export const metadata: Metadata = {
    title: "CMU Block Calculator | Block Quantity, Cost & Mortar Estimator",
    description:
        "Calculate how many CMU blocks are needed for a wall, deduct wall openings, and estimate the total block and installed cost with this USA-focused CMU Block Calculator.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/cmu-block-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/cmu-block-calculator",
        title:
            "CMU Block Calculator | Block Quantity, Cost & Mortar Estimator",
        description:
            "Estimate CMU block quantity, wall openings deduction, waste allowance, and full installed cost. Supports standard U.S. CMU block sizes with custom options.",
        images: [
            {
                url: "/og/cmu-block-calculator.png", // Assuming an open graph image will exist or fallback
                width: 1200,
                height: 630,
                alt: "CMU Block Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "CMU Block Calculator",
        description:
            "Free CMU block calculator and cost estimator — calculate block quantity, openings, waste, and installed wall cost.",
        images: ["/og/cmu-block-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function CMUBlockCalculatorPage() {
    /** JSON-LD rich results graph */
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/cmu-block-calculator#app",
                name: "CMU Block Calculator",
                url: "https://www.concretecalculatormax.com/calculators/cmu-block-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Calculate how many CMU blocks are needed for a wall project, accurately deduct openings, calculate waste, and estimate the complete CMU block cost and total installed cost.",
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
                    name: "Calculate CMU Block Quantity and Cost",
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
                        name: "CMU Block Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/cmu-block-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to calculate CMU blocks for a wall",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Choose Measurement System",
                        text: "Select either Imperial (feet) or Metric (meters) for your dimensions.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Input Wall Dimensions",
                        text: "Enter the gross wall length and height for the wall(s) you are building.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select CMU Block Size",
                        text: "Choose your nominal block size. Standard options are usually 8x8x16, but other thicknesses like 4, 6, 10, or 12 inches are available.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Adjust Waste Allowance",
                        text: "Set a waste percentage to cover breakages and cuts (typically 10%).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Define Openings",
                        text: "Add structural openings like doors, windows, and gates. The calculator deducts their area from the gross wall area.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Add Cost Details to Budget",
                        text: "Enter cost inputs such as cost per block, labor, delivery, mortar, and others to get an estimated total project cost.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Click Calculate and Review Results",
                        text: "Hit Calculate to see your net wall area, the required block quantities, and detailed estimated costs.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Wall dimensions, structure plans, and desired CMU block specifications.",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "How do I calculate CMU block cost?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Multiply your final block count (including waste allowance) by your local cost per block. Use our advanced cost inputs to add mortar, labor, and delivery to estimate the fully installed wall cost.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the standard size of a CMU block in the USA?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The most common standard USA size is the 8x8x16 block. It has a nominal width of 8 inches, nominal height of 8 inches, and nominal length of 16 inches.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many 8x8x16 blocks do I need per square foot?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "You need exactly 1.125 blocks per square foot. Since one block covers 0.8889 square feet, dividing 1 by 0.8889 gives 1.125.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use this calculator as a cinder block cost calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Cinder blocks and concrete blocks use the exact same dimensional standards in the USA. You can use this tool to estimate both cinder block quantities and costs.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does block thickness affect wall face coverage?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "No. Whether you use a 4 inch, 6 inch, 8 inch, 10 inch, or 12 inch thick CMU block, the front face (height and length) is almost always nominally 8x16 inches. The coverage rate of 1.125 blocks per square foot remains exactly the same.",
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
                            CMU Block Calculator
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
                                        CMU Block Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-03-22"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Calculate how many CMU blocks are required for your wall or project. Quickly deduct openings and add a waste allowance. Use our <strong className="text-slate-300">CMU block cost calculator</strong> to estimate total brick cost and an optional fully installed cost for comprehensive masonry project planning.
                            </p>
                        </div>

                        {/* ===== Calculator Slot ===== */}
                        <CMUBlockCalc />

                        {/* Article (features, formulas, FAQs) — visible content for E-E-A-T + SEO */}
                        <CMUBlockCalcArticle />

                        {/* Internal linking to related tools */}
                        <RelatedCalculators className="mt-8 mb-8" exclude={["cmu-block"]} />
                    </article>
                </div>
            </main>
        </>
    );
}

