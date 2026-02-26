// app/(site)/calculators/concrete-driveway-cost-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Truck } from "lucide-react";
import ConcreteDrivewayCostCalc from "@/components/calculators/ConcreteDrivewayCostCalc";
import ConcreteDrivewayCostCalcArticle from "@/components/calculators/articles/ConcreteDrivewayCostCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
    title: "Concrete Driveway Cost Calculator | Ready-Mix & Bagged Estimate",
    description:
        "Free Concrete Driveway Cost Calculator. Estimate total costs for driveways including ready-mix delivery, bagged DIY mix, supplier fees, add-ons, and waste allowance.",
    alternates: {
        canonical:
            "https://concretecalculatormax.com/calculators/concrete-driveway-cost-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://concretecalculatormax.com/calculators/concrete-driveway-cost-calculator",
        title: "Concrete Driveway Cost Calculator",
        description:
            "Estimate driveway concrete cost accurately. Compare Ready-Mix vs Bagged pricing, handle supplier fees, and export printable PDF quotes.",
        images: [
            {
                url: "/og/concrete-driveway-cost-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Driveway Cost Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Driveway Cost Calculator",
        description:
            "Estimate driveway project costs in seconds. Compare ready-mix and bagged pricing with real supplier constraints.",
        images: ["/og/concrete-driveway-cost-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function ConcreteDrivewayCostCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": "https://concretecalculatormax.com/calculators/concrete-driveway-cost-calculator#app",
                name: "Concrete Driveway Cost Calculator",
                url: "https://concretecalculatormax.com/calculators/concrete-driveway-cost-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Calculate concrete volume and total cost for driveway projects. Supports ready-mix delivery, bagged concrete, supplier constraints, and optional add-ons.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: {
                    "@type": "Organization",
                    "name": "Concrete Calculator Max",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://concretecalculatormax.com/og/logo.png",
                    },
                },
                potentialAction: { "@type": "Action", name: "Calculate Driveway Cost" },
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://concretecalculatormax.com",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Calculators",
                        item: "https://concretecalculatormax.com/calculators",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "Concrete Driveway Cost Calculator",
                        item: "https://concretecalculatormax.com/calculators/concrete-driveway-cost-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to estimate concrete driveway costs",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Enter driveway dimensions",
                        text: "Provide your driveway length, width, and any extra area for turnarounds or aprons in feet.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Choose thickness",
                        text: "Select 4 inches for standard use, 5–6 inches for heavier vehicles.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select pricing method",
                        text: "Choose between Ready-Mix (truck delivery) or Bagged Concrete (DIY mixing).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Enter pricing and fees",
                        text: "Input your local price per cubic yard or per bag, plus any delivery or supplier fees.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate total",
                        text: "Click calculate to see the full breakdown, order quantity, and save as a PDF.",
                    },
                ],
                supply: [{ "@type": "HowToSupply", name: "Driveway dimensions and local pricing" }],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        "name": "How much does a concrete driveway cost?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "In the US, a typical concrete driveway costs between $6 and $12 per square foot installed. A standard 40×12 ft driveway runs roughly $2,880–$5,760 including materials and labor.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How thick should a residential driveway be?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Most residential driveways are 4 inches thick. If your driveway sees delivery trucks, RVs, or heavier traffic, 5–6 inches is recommended.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is ready-mix or bagged concrete better for a driveway?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ready-mix is almost always better for driveways. A typical 2-car driveway needs 5–7 cubic yards — over 200 bags of 80lb concrete to mix by hand.",
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
                        <li aria-current="page" className="text-slate-200">
                            Concrete Driveway Cost Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Truck className="h-5 w-5 text-teal-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Driveway Cost Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-02-26"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Our Concrete Driveway Cost Calculator helps you estimate the full financial layout for your next driveway project.
                                Compare Ready-Mix and Bagged pricing, account for supplier constraints like short-load fees and minimums,
                                add optional extras, and export a professional PDF estimate.
                            </p>
                        </div>

                        <ConcreteDrivewayCostCalc />

                        <ConcreteDrivewayCostCalcArticle />

                        <RelatedCalculators className="mt-8 mb-8" exclude={["driveway", "cost"]} />
                    </article>
                </div>
            </main>
        </>
    );
}
