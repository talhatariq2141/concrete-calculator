// app/calculators/concrete-block-calculator/page.tsx
// -----------------------------------------------------------------------------
// SEO structure mirrored from concrete-bag-calculator:
// - Page-level Metadata (title/desc/canonical + OG/Twitter + robots)
// - Single JSON-LD <script> with @graph: WebApplication, BreadcrumbList, HowTo, FAQPage
// - Visible breadcrumbs, intro, calculator, article, related calculators
// -----------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import ConcreteBlockCalc from "@/components/calculators/ConcreteBlockCalc";
import { BrickWall } from "lucide-react";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";
import ConcreteBlockCalcArticle from "@/components/calculators/articles/ConcreteBlockCalcArticle";

/** Page-level metadata */
export const metadata: Metadata = {
    title: "Concrete Block Calculator",
    description:
        "Free Concrete Block Calculator — estimate how many concrete blocks you need for walls, foundations, and masonry projects. Includes opening deductions, mortar, grout, reinforcement, and cost estimation for U.S. standard CMU blocks.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/concrete-block-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/concrete-block-calculator",
        title: "Concrete Block Calculator",
        description:
            "Estimate concrete blocks, mortar, grout, reinforcement, and cost for CMU block walls. Supports 4″–12″ blocks, opening deductions, and adjustable waste.",
        images: [
            {
                url: "/og/concrete-block-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Block Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Block Calculator",
        description:
            "Estimate concrete blocks, mortar, grout, reinforcement, and cost for CMU block walls.",
        images: ["/og/concrete-block-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function ConcreteBlockCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id":
                    "https://www.concretecalculatormax.com/calculators/concrete-block-calculator#app",
                name: "Concrete Block Calculator",
                url: "https://www.concretecalculatormax.com/calculators/concrete-block-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Estimate how many concrete blocks you need for walls, with opening deductions, mortar, grout, reinforcement, and cost estimation for U.S. CMU blocks.",
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
                    name: "Calculate Concrete Blocks",
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
                        name: "Concrete Block Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/concrete-block-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to use the Concrete Block Calculator",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Enter wall dimensions",
                        text: "Enter the wall length and wall height in feet and inches.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select block size",
                        text: 'Choose a standard U.S. CMU block size such as 4", 6", 8", 10", or 12" wide blocks.',
                    },
                    {
                        "@type": "HowToStep",
                        name: "Add openings",
                        text: "Add door, window, or other openings to deduct from the wall area (Advanced mode).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Set waste percentage",
                        text: "Choose a waste percentage (default 5%) for cuts, breakage, and corners.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enable advanced options",
                        text: "Optionally enable mortar estimation, grout/core fill, reinforcement, and cost inputs.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate",
                        text: "Click Calculate to estimate block quantity, mortar bags, grout volume, reinforcement, and cost.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Review results",
                        text: "Review your estimated block quantity and full material breakdown. Use Print/Save for records.",
                    },
                ],
                supply: [
                    {
                        "@type": "HowToSupply",
                        name: "Wall dimensions, block size, and optional mortar/grout/reinforcement/cost settings",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What is a Concrete Block Calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Concrete Block Calculator is a tool that helps estimate how many concrete blocks are needed for a wall, foundation, partition, or other masonry project based on wall dimensions, block size, and openings.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How does a Concrete Block Calculator work?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Concrete Block Calculator works by calculating the total wall area, subtracting any door or window openings, and dividing the remaining area by the face coverage of a standard concrete block. Many calculators also add a waste allowance for cuts and breakage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How many concrete blocks do I need for my wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The number of concrete blocks you need depends on the wall length, wall height, block size, and any openings. A Concrete Block Calculator gives a faster and more accurate estimate than manual calculation.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does a Concrete Block Calculator include waste?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Most concrete block calculators can include a waste factor. A 5% waste allowance is common for basic projects, but more complex wall layouts may need a higher percentage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Concrete Block Calculator subtract doors and windows?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. A better Concrete Block Calculator should allow you to subtract door openings, window openings, and other empty spaces so the block estimate is more accurate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What block size does a Concrete Block Calculator use?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Most concrete block calculators use common U.S. CMU sizes such as 4 in x 8 in x 16 in, 6 in x 8 in x 16 in, 8 in x 8 in x 16 in, 10 in x 8 in x 16 in, and 12 in x 8 in x 16 in.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is a Concrete Block Calculator the same as a cinder block calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes, in many cases users search for both terms interchangeably. A Concrete Block Calculator and a cinder block calculator usually estimate block quantity for similar masonry wall projects.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use a Concrete Block Calculator for retaining walls?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes, a Concrete Block Calculator can help estimate blocks for some retaining wall projects, but you should make sure the selected block type and wall design match the actual retaining wall system being used.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Concrete Block Calculator estimate mortar?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Some advanced concrete block calculators can estimate mortar bags or mortar volume in addition to block count. This helps with planning the full masonry material requirement.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Concrete Block Calculator estimate grout or core fill?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. A more advanced Concrete Block Calculator can estimate grout volume for partially filled or fully grouted block walls, depending on the wall design and fill percentage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Concrete Block Calculator estimate reinforcement?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Some calculators also estimate horizontal and vertical reinforcement lengths for planning block wall materials more completely.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is a Concrete Block Calculator useful for contractors?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Contractors use a Concrete Block Calculator to save time, reduce manual errors, and create faster material estimates for concrete block walls and masonry jobs.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is a Concrete Block Calculator useful for homeowners?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. Homeowners can use a Concrete Block Calculator to estimate materials before starting a DIY wall project or requesting contractor quotes.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "How accurate is a Concrete Block Calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Concrete Block Calculator provides a useful estimate, but actual material needs may vary depending on bond pattern, manufacturer dimensions, mortar joints, waste, reinforcement layout, and site conditions.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the best waste percentage for a concrete block wall?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A 5% waste factor is a common starting point for standard walls. Projects with many corners, cuts, openings, or custom layouts may require a higher waste percentage.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I use a Concrete Block Calculator for foundations?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes, a Concrete Block Calculator can be used for some block foundation walls, basement walls, and structural masonry projects, but the final design should always follow local code and engineering requirements.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does a Concrete Block Calculator help estimate block wall cost?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. If the calculator includes price inputs, it can estimate total concrete block wall cost based on block price, mortar cost, grout cost, reinforcement cost, and other project expenses.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What is the difference between a Concrete Block Calculator and a block wall calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "The terms are closely related. A Concrete Block Calculator focuses on estimating CMU block quantity and related materials, while a block wall calculator may be used more broadly for different wall systems.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can I calculate concrete blocks in square feet?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. A Concrete Block Calculator typically uses wall area in square feet and divides it by the face area covered by one concrete block to estimate the block quantity.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Why should I use a Concrete Block Calculator instead of manual math?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "A Concrete Block Calculator is faster, easier, and usually more accurate because it can account for block size, openings, waste, mortar, grout, and other important variables in one place.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Can a Concrete Block Calculator be used for commercial masonry projects?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes, it can be used for planning and estimating on commercial masonry projects, though large or structural projects may require more detailed takeoffs and engineering review.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Does the calculator work for both interior and exterior block walls?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Yes. A Concrete Block Calculator can be used for both interior and exterior concrete block walls as long as the dimensions, block size, and material assumptions are appropriate.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "What information do I need to use a Concrete Block Calculator?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "You usually need the wall length, wall height, block size, and any openings. For more advanced results, you can also enter waste percentage, mortar settings, grout options, reinforcement details, and material prices.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Is a Concrete Block Calculator only for standard 8x8x16 blocks?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "No. A good Concrete Block Calculator should support multiple CMU block sizes so users can estimate different wall types and masonry applications.",
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
                        <li aria-current="page" className="text-slate-200">
                            Concrete Block Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        {/* Title & short intro */}
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4 ">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <BrickWall className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Block Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-03-10"
                                />
                            </div>
                            <div>
                                <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                    Estimate the number of concrete blocks, mortar bags, grout
                                    volume, reinforcement lengths, and project cost for U.S. CMU
                                    block walls. Supports quick and advanced modes with opening
                                    deductions, adjustable waste, and multiple block sizes.
                                </p>
                            </div>
                        </div>

                        {/* Calculator */}
                        <ConcreteBlockCalc />

                        {/* Article (features, formulas, FAQs) */}
                        <ConcreteBlockCalcArticle />

                        {/* Related calculators */}
                        <RelatedCalculators
                            className="mt-8 mb-8"
                            exclude={["concrete-block"]}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}
