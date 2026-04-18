// app/(site)/calculators/concrete-mix/mortar-calculator/page.tsx

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrickWall } from "lucide-react";
import MortarCalc from "@/components/calculators/MortarCalc";
import MortarCalcArticle from "@/components/calculators/articles/MortarCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
    title: "Mortar Calculator — How Many Bags Do I Need?",
    description:
        "Free Mortar Calculator — estimate mortar bags for block walls, brick veneer, and stone veneer. Supports ASTM C270 Types M, S, N, O. Returns 80 lb, 60 lb, and 40 lb bag counts with waste allowance, optional cost estimate, and printable PDF report.",
    alternates: {
        canonical: "https://www.concretecalculatormax.com/calculators/concrete-mix/mortar-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/concrete-mix/mortar-calculator",
        title: "Mortar Calculator — Bags Needed for Block Walls, Brick & Stone Veneer",
        description:
            "Enter block count or wall area, choose ASTM C270 mortar type and joint thickness, set waste %, and instantly get 80 lb / 60 lb / 40 lb bag counts with optional installed-cost breakdown. Free, printable, no sign-up required.",
        images: [
            {
                url: "/og/mortar-calculator.png",
                width: 1200,
                height: 630,
                alt: "Mortar Calculator — Concrete Calculator Max",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Mortar Calculator — How Many Bags Do I Need?",
        description:
            "Free mortar bag estimator for block walls, brick veneer, and stone veneer. ASTM C270 Types M, S, N, O. 80/60/40 lb bag counts with waste and cost.",
        images: ["/og/mortar-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function MortarCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            // 1 — WebApplication
            {
                "@type": "WebApplication",
                "@id": "https://www.concretecalculatormax.com/calculators/concrete-mix/mortar-calculator#app",
                "name": "Mortar Calculator",
                "url": "https://www.concretecalculatormax.com/calculators/concrete-mix/mortar-calculator",
                "applicationCategory": "UtilityApplication",
                "operatingSystem": "Web",
                "description":
                    "Estimate mortar bags for block walls, brick veneer, and stone veneer. Supports ASTM C270 Types M, S, N, O with joint thickness options, configurable waste allowance, and optional cost estimation.",
                "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                "publisher": {
                    "@type": "Organization",
                    "name": "Concrete Calculator Max",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.concretecalculatormax.com/og/logo.png",
                    },
                },
                "potentialAction": { "@type": "Action", "name": "Calculate Mortar Bags" },
            },

            // 2 — BreadcrumbList
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.concretecalculatormax.com",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Calculators",
                        "item": "https://www.concretecalculatormax.com/calculators",
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Mortar Calculator",
                        "item": "https://www.concretecalculatormax.com/calculators/concrete-mix/mortar-calculator",
                    },
                ],
            },

            // 3 — HowTo
            {
                "@type": "HowTo",
                "name": "How to Calculate Mortar Bags for a Masonry Project",
                "description":
                    "Use the free Mortar Calculator to estimate how many premix mortar bags you need for block walls, brick veneer, or stone veneer projects.",
                "step": [
                    {
                        "@type": "HowToStep",
                        "position": 1,
                        "name": "Choose Estimate Mode",
                        "text": "Select Quick for a fast bag count, or Advanced to include bag pricing and labor cost for a full installed-cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 2,
                        "name": "Select Project Type",
                        "text": "Click Block Wall to enter a block count, or Brick Veneer or Stone Veneer to enter wall area in square feet. Each preset loads sensible defaults.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 3,
                        "name": "Enter Block Count or Wall Area",
                        "text": "For block walls, enter the total number of CMU blocks. For brick or stone, enter the wall face area in sq ft, deducting large openings.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 4,
                        "name": "Set Joint Thickness (Brick/Stone Only)",
                        "text": "Choose 3/8 inch for standard brick joints, 1/2 inch for wide joints, or 3/4 inch for rustic stone. Thicker joints use significantly more mortar.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 5,
                        "name": "Select Mortar Type",
                        "text": "Choose an ASTM C270 mortar type: Type M for below-grade/retaining walls, Type S for exterior at-grade walls, Type N for general above-grade masonry, or Type O for interior non-load-bearing only.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 6,
                        "name": "Set Waste Allowance",
                        "text": "Enter a waste percentage — 10% for block and brick, 15% for stone veneer. This accounts for mixing waste, dropped mortar, and joint overfill.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 7,
                        "name": "Enter Cost Inputs (Advanced Mode)",
                        "text": "In Advanced mode, enter the price per 80 lb bag and labor cost per bag to generate a complete material-and-labor cost estimate.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 8,
                        "name": "Press Calculate",
                        "text": "Click Calculate to see 80 lb, 60 lb, and 40 lb bag counts with and without waste, approximate wall coverage, and optional cost breakdown.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 9,
                        "name": "Review Compliance Warning",
                        "text": "If a compliance warning appears, review the ASTM C270 mortar type recommendation and adjust your selection before ordering materials.",
                    },
                    {
                        "@type": "HowToStep",
                        "position": 10,
                        "name": "Print or Save to PDF",
                        "text": "Click Print / Save to open a clean printable report. In the browser's Print dialog, choose Save as PDF to keep a digital copy for your records or supplier.",
                    },
                ],
            },

            // 4 — FAQPage
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is a mortar calculator?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A mortar calculator estimates the number of premix mortar bags needed for a masonry project. You enter your block count or wall area, joint thickness, mortar type, and waste allowance, and the calculator returns bag counts for 80 lb, 60 lb, and 40 lb bags.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How many mortar bags do I need per 100 blocks?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Approximately 7–8 bags of 80 lb premix mortar per 100 standard 8×8×16 CMU blocks before waste. With a 10% waste allowance, plan for 8–9 bags per 100 blocks.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How much mortar do I need for 100 square feet of brick?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "For standard brick with a 3/8 inch joint, approximately 7 bags of 80 lb premix mortar per 100 sq ft before waste. Adding 10% waste brings the total to about 8 bags per 100 sq ft.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "What is the difference between Type M, S, N, and O mortar?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "All four are defined by ASTM C270. Type M (2,500 PSI) is for below-grade structural masonry and retaining walls. Type S (1,800 PSI) is for exterior walls at or below grade and high-moisture exposure. Type N (750 PSI) is the general-purpose above-grade choice. Type O (350 PSI) is limited to interior non-load-bearing masonry.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Which mortar type should I use for a CMU block wall?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Type N (750 PSI) is the standard choice for above-grade structural block walls. Use Type S (1,800 PSI) for walls below grade, in contact with soil, or subject to high lateral loads.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Can I use Type O mortar on an exterior wall?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. Type O mortar is not suitable for exterior applications due to its low compressive strength (350 PSI) and poor freeze-thaw resistance. Use Type N at minimum for exterior above-grade walls.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How much waste should I add to my mortar estimate?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A 10% waste allowance is standard for block and brick masonry. Stone veneer should use 15–20% because irregular unit shapes produce more variable joint widths and mixing waste.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Does joint thickness affect mortar consumption?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, significantly. A 3/8 inch joint for brick requires about 7 bags per 100 sq ft; a 1/2 inch joint requires about 9 bags; a 3/4 inch joint can require 12 or more bags per 100 sq ft.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "What is premix mortar vs. site-mixed mortar?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Premix mortar bags contain pre-blended cement, sand, and lime — you only add water. Site-mixed mortar uses separate components per ASTM C270 proportions. Premix is more convenient for smaller projects; site mixing is more economical for large jobs.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How do I calculate wall area for the mortar calculator?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Measure the full wall length and height in feet and multiply them together. Subtract the area of large openings such as doors and windows. Enter the resulting net area in sq ft into the calculator.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is the mortar calculator suitable for tuckpointing?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "This calculator is designed for new masonry construction. Tuckpointing (repointing) requires a smaller volume calculation based on joint depth and perimeter. Typical repointing consumes 1–2 bags per 100 sq ft for standard brick.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How does bag weight affect coverage?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Coverage is roughly proportional to bag weight. An 80 lb bag covers ~13 standard CMU blocks. A 60 lb bag covers ~10 blocks. A 40 lb bag covers ~7 blocks. The calculator shows all three simultaneously.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is the mortar calculator free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. This mortar calculator is completely free with no sign-up, subscription, or hidden fees. Use it as many times as needed.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Can I print or save my mortar estimate?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. After pressing Calculate, click the Print / Save button to open a clean printable report. In your browser's Print dialog, select Save as PDF to keep a digital copy.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How accurate are mortar bag estimates?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Estimates are based on ASTM C270 standard coverage rates and are accurate for typical controlled masonry work. Actual consumption varies with mason technique, mortar consistency, temperature, and unit absorption. Always add a 10–15% waste allowance.",
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
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
                    <ol className="flex items-center flex-wrap gap-1">
                        <li><Link href="/" className="hover:underline">Home</Link></li>
                        <li className="px-1 text-slate-500">/</li>
                        <li><Link href="/calculators" className="hover:underline">Calculators</Link></li>
                        <li className="px-1 text-slate-500">/</li>
                        <li aria-current="page" className="text-slate-200">Mortar Calculator</li>
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
                                        Mortar Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-04-17"
                                />
                            </div>
                            <div>
                                <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                    Estimate premix mortar bags for block walls, brick veneer, and stone veneer projects.
                                    Select your ASTM C270 mortar type, enter block count or wall area, and get instant
                                    80 lb, 60 lb, and 40 lb bag counts with waste allowance and optional cost breakdown.
                                </p>
                            </div>
                        </div>

                        <MortarCalc />
                        <MortarCalcArticle />
                        <RelatedCalculators className="mt-8 mb-8" exclude={["mortar-calculator"]} />
                    </article>
                </div>
            </main>
        </>
    );
}