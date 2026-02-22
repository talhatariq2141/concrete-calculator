// app/(site)/calculators/concrete-slab-weight-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Weight } from "lucide-react";
import ConcreteSlabWeightCalc from "@/components/calculators/ConcreteSlabWeightCalc";
import ConcreteSlabWeightCalcArticle from "@/components/calculators/articles/ConcreteSlabWeightCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
    title: "Concrete Slab Weight Calculator | Professional Weight Estimator",
    description:
        "Calculate the weight of concrete slabs accurately. Includes support for standard, reinforced, and lightweight concrete densities. Get results in pounds and tons.",
    alternates: {
        canonical:
            "https://concretecalculatormax.com/calculators/concrete-slab-weight-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://concretecalculatormax.com/calculators/concrete-slab-weight-calculator",
        title: "Concrete Slab Weight Calculator",
        description:
            "Accurate weight estimation for concrete slabs. Factor in dimensions and mix density for structural planning.",
        images: [
            {
                url: "/og/concrete-slab-weight-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Slab Weight Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Slab Weight Calculator",
        description:
            "Estimate slab weight in seconds. Pro tools for structural and logistics planning.",
        images: ["/og/concrete-slab-weight-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function ConcreteSlabWeightCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": "https://concretecalculatormax.com/calculators/concrete-slab-weight-calculator#app",
                name: "Concrete Slab Weight Calculator",
                url: "https://concretecalculatormax.com/calculators/concrete-slab-weight-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Calculate the structural weight of concrete slabs. Supports imperial and metric dimensions with material density presets.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: {
                    "@type": "Organization",
                    "name": "Concrete Calculator Max",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://concretecalculatormax.com/og/logo.png",
                    },
                },
                potentialAction: { "@type": "Action", name: "Calculate Slab Weight" },
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
                        name: "Concrete Slab Weight Calculator",
                        item: "https://concretecalculatormax.com/calculators/concrete-slab-weight-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to calculate concrete slab weight",
                totalTime: "PT1M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Provide slab dimensions",
                        text: "Enter the length, width, and thickness of the concrete slab.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select material density",
                        text: "Choose from standard (150 lb/ft³), reinforced (156 lb/ft³), or lightweight concrete.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Generate weight",
                        text: "Click calculate to see the total weight in pounds and tons.",
                    },
                ],
                supply: [{ "@type": "HowToSupply", name: "Slab dimensions and density data" }],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        "name": "How much does a 4-inch concrete slab weigh per square foot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A standard 4-inch concrete slab weighs approximately 50 lbs per square foot (based on 150 lb/ft³ density).",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How heavy is a cubic yard of concrete?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "One cubic yard of standard concrete (27 cubic feet) weighs approximately 4,050 lbs or just over 2 tons.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Does rebar increase the weight of a slab?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, reinforced concrete is typically estimated at 156 lb/ft³, which is about 4% heavier than unreinforced concrete.",
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
                            Concrete Slab Weight Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Weight className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Slab Weight Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-02-22"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins text-justify">
                                Precision estimation for concrete project weights. Use our free tool to compute the dead load of slabs,
                                patios, and foundations based on dimensions and mix material. Essential for structural clearance
                                and logistics planning.
                            </p>
                        </div>

                        <ConcreteSlabWeightCalc />

                        <ConcreteSlabWeightCalcArticle />

                        <RelatedCalculators className="mt-8 mb-8" exclude={["slab", "weight"]} />
                    </article>
                </div>
            </main>
        </>
    );
}
