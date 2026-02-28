// app/(site)/calculators/concrete-slab-load-capacity-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "lucide-react";
import ConcreteSlabLoadCapacityCalc from "@/components/calculators/ConcreteSlabLoadCapacityCalc";
import ConcreteSlabLoadCapacityCalcArticle from "@/components/calculators/articles/ConcreteSlabLoadCapacityCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
    title: "Concrete Slab Load Capacity Calculator",
    description:
        "Free Concrete Slab Load Capacity Calculator. Estimate max service live load and factored uniform load capacity for reinforced one-way suspended slabs per ACI 318 standards.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/concrete-slab-load-capacity-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/concrete-slab-load-capacity-calculator",
        title: "Concrete Slab Load Capacity Calculator",
        description:
            "Estimate structural load capacity for reinforced concrete slabs. Professional LRFD analysis for engineers and builders.",
        images: [
            {
                url: "/og/concrete-slab-load-capacity-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Slab Load Capacity Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Slab Load Capacity Calculator",
        description:
            "Structural load analysis for concrete slabs. Compute max psf based on reinforcement and geometry.",
        images: ["/og/concrete-slab-load-capacity-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function ConcreteSlabLoadCapacityCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": "https://www.concretecalculatormax.com/calculators/concrete-slab-load-capacity-calculator#app",
                name: "Concrete Slab Load Capacity Calculator",
                url: "https://www.concretecalculatormax.com/calculators/concrete-slab-load-capacity-calculator",
                applicationCategory: "DesignApplication",
                operatingSystem: "Web",
                description:
                    "Analyze the structural load capacity of reinforced concrete slabs. Supports ACI 318 strength design checks for flexure and shear.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: {
                    "@type": "Organization",
                    "name": "Concrete Calculator Max",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.concretecalculatormax.com/og/logo.png",
                    },
                },
                potentialAction: { "@type": "Action", name: "Calculate Slab Capacity" },
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
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
                        name: "Concrete Slab Load Capacity Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/concrete-slab-load-capacity-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to estimate concrete slab load capacity",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Enter slab dimensions",
                        text: "Inputs include slab thickness and clear span length.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Define materials",
                        text: "Provide concrete compressive strength (f'c) and steel yield strength (fy).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Detailability rebar",
                        text: "Select bar size and spacing to define the reinforcement area per foot.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Analyze Capacity",
                        text: "Click analyze to get the governed service live load capacity in psf.",
                    },
                ],
                supply: [{ "@type": "HowToSupply", name: "Blueprint data and material specs" }],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        "name": "How is slab load capacity calculated?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Capacity is typically determined using ACI 318 strength design, checking for both flexural (bending) and one-way shear resistance based on thickness and rebar count.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "What dead loads are considered in the calculation?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The calculator factors in the slab's own self-weight (approx 150 pcf) plus any superimposed dead loads like tiles, partitions, or ceilings.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "What is the LRFD combination used?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Modern US engineering uses the ASCE 7 combination: 1.2 x Dead Load + 1.6 x Live Load to find the governing strength limit.",
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
                            Concrete Slab Load Capacity Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8 w-full">
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <Calculator className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Slab Load Capacity Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-02-22"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Determine the maximum weight limits for your structural concrete flooring.
                                Our advanced Slab Load Capacity Calculator uses ACI 318 Strength Design principles
                                to estimate max service live loads (PSF) based on your reinforcement detailing and span geometry.
                            </p>
                        </div>

                        <ConcreteSlabLoadCapacityCalc />

                        <ConcreteSlabLoadCapacityCalcArticle />

                        <RelatedCalculators className="mt-12 mb-12" exclude={["slab", "load", "capacity"]} />
                    </article>
                </div>
            </main>
        </>
    );
}
