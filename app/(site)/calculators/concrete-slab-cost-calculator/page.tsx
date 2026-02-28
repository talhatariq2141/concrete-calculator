// app/(site)/calculators/concrete-slab-cost-calculator/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign } from "lucide-react";
import ConcreteSlabCostCalc from "@/components/calculators/ConcreteSlabCostCalc";
import ConcreteSlabCostCalcArticle from "@/components/calculators/articles/ConcreteSlabCostCalcArticle";
import RelatedCalculators from "@/components/app/RelatedCalculators";
import EEATBlock from "@/components/app/EEATBlock";

export const metadata: Metadata = {
    title: "Concrete Slab Cost Calculator | Material & Labor Estimate",
    description:
        "Free Concrete Slab Cost Calculator. Estimate total costs for slabs, patios, and driveways including ready-mix concrete, DIY bagged mix, armor/rebar, and labor.",
    alternates: {
        canonical:
            "https://www.concretecalculatormax.com/calculators/concrete-slab-cost-calculator",
    },
    openGraph: {
        type: "article",
        url: "https://www.concretecalculatormax.com/calculators/concrete-slab-cost-calculator",
        title: "Concrete Slab Cost Calculator",
        description:
            "Estimate concrete cost accurately. Includes ready-mix vs bagged comparison, labor rates, and printable PDF quotes.",
        images: [
            {
                url: "/og/concrete-slab-cost-calculator.png",
                width: 1200,
                height: 630,
                alt: "Concrete Slab Cost Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Concrete Slab Cost Calculator",
        description:
            "Estimate slab project costs in seconds. Compare materials and labor rates easily.",
        images: ["/og/concrete-slab-cost-calculator.png"],
    },
    robots: { index: true, follow: true },
};

export default function ConcreteSlabCostCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": "https://www.concretecalculatormax.com/calculators/concrete-slab-cost-calculator#app",
                name: "Concrete Slab Cost Calculator",
                url: "https://www.concretecalculatormax.com/calculators/concrete-slab-cost-calculator",
                applicationCategory: "UtilityApplication",
                operatingSystem: "Web",
                description:
                    "Calculate material and labor costs for concrete slabs. Includes support for ready-mix, bagged mix, and reinforcement extras.",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                publisher: {
                    "@type": "Organization",
                    "name": "Concrete Calculator Max",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.concretecalculatormax.com/og/logo.png",
                    },
                },
                potentialAction: { "@type": "Action", name: "Calculate Slab Cost" },
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
                        name: "Concrete Slab Cost Calculator",
                        item: "https://www.concretecalculatormax.com/calculators/concrete-slab-cost-calculator",
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: "How to estimate concrete slab costs",
                totalTime: "PT2M",
                step: [
                    {
                        "@type": "HowToStep",
                        name: "Enter slab dimensions",
                        text: "Provide active slab length, width and thickness in feet or inches.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Select supply method",
                        text: "Choose between Ready Mix (truck delivery) or Bagged Mix (DIY manual mixing).",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Input cost factors",
                        text: "Enter local price per cubic yard, labor rate per square foot, and any reinforcement extras.",
                    },
                    {
                        "@type": "HowToStep",
                        name: "Calculate Total",
                        text: "Click calculate to see the full financial breakdown and save as a PDF.",
                    },
                ],
                supply: [{ "@type": "HowToSupply", name: "Slab dimensions and local pricing" }],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        "name": "What is the average cost of a concrete slab per square foot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "In the US, most standard slabs cost between $6 and $12 per square foot installed, including materials and labor.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "How much concrete do I need for a 20x20 slab?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A standard 4-inch thick 20x20 slab requires approximately 5 cubic yards of concrete, including a 10% waste allowance.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Is it cheaper to use a concrete truck or buy bags?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Generally, projects requiring more than 1 cubic yard (about 45-50 bags) are cheaper and much faster via ready-mix truck.",
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
                            Concrete Slab Cost Calculator
                        </li>
                    </ol>
                </nav>

                <div className="flex">
                    <article className="lg:col-span-8">
                        <div className="flex flex-col justify-between gap-4 mt-2 mb-4">
                            <div className="w-full text-left lg:w-1/2">
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-primary/30 rounded-lg flex-shrink-0 items-center">
                                        <DollarSign className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h1 className="text-lg sm:text-2xl lg:text-3xl text-slate-200 font-bold font-poppins tracking-tight leading-tight">
                                        Concrete Slab Cost Calculator
                                    </h1>
                                </div>
                                <EEATBlock
                                    reviewerName="Engr. Talha Tariq"
                                    licenseNumber="PEC-CIVIL-37815"
                                    lastUpdated="2026-02-22"
                                />
                            </div>
                            <p className="mt-3 ml-2 text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed font-poppins">
                                Our Concrete Slab Cost Calculator helps you estimate the total financial layout for your next pour.
                                Whether it&apos;s a small backyard patio or a full garage slab, compare Ready-Mix and Bagged costs,
                                factor in local labor rates, and account for reinforcement extras.
                            </p>
                        </div>

                        <ConcreteSlabCostCalc />

                        <ConcreteSlabCostCalcArticle />

                        <RelatedCalculators className="mt-8 mb-8" exclude={["slab", "cost"]} />
                    </article>
                </div>
            </main>
        </>
    );
}
