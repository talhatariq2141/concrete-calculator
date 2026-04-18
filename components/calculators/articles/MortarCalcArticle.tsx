"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function MortarCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* ── Section 1 — Introduction ─────────────────────────────── */}
            <section>
                <p className="text-base leading-relaxed">
                    Mortar is the adhesive that binds masonry units together — every block wall, brick
                    façade, and stone veneer installation depends on the right amount of properly mixed
                    mortar. Under-ordering leads to mid-project supply runs and inconsistent joint
                    coloring; over-ordering wastes both material and budget. This free Mortar Calculator
                    takes the guesswork out of your estimate by computing the exact number of premix
                    mortar bags required for block walls, brick veneer, and stone veneer projects, with
                    a configurable waste allowance and optional cost breakdown.
                </p>
                <p className="text-base leading-relaxed mt-4">
                    Enter either your total block count (for CMU block walls) or your wall area in
                    square feet (for brick or stone veneer), select your mortar joint thickness and
                    ASTM C270 mortar type, and set a waste percentage. The calculator instantly returns
                    bag counts for 80 lb, 60 lb, and 40 lb bags. Switch to Advanced mode to add bag
                    pricing and labor cost per bag for a complete installed-cost estimate you can print
                    and take to the job site.
                </p>
            </section>

            {/* ── Section 2 — Key Features ─────────────────────────────── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Mortar Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Three Project Presets",
                            desc: "One-click presets for Block Wall (CMU), Brick Veneer, and Stone Veneer load sensible defaults for each application type.",
                        },
                        {
                            title: "Block-Count Mode",
                            desc: "Enter the number of standard 8×8×16 CMU blocks and the calculator converts directly to bag counts using the 13-blocks-per-80-lb-bag coverage rule.",
                        },
                        {
                            title: "Area Mode for Brick & Stone",
                            desc: "Enter wall area in sq ft for brick or stone veneer. Coverage adjusts automatically for 3/8\", 1/2\", and 3/4\" joint thicknesses.",
                        },
                        {
                            title: "ASTM C270 Mortar Type Selector",
                            desc: "Choose Type M, S, N, or O with real-time guidance on compressive strength and appropriate application for each type.",
                        },
                        {
                            title: "Configurable Waste Allowance",
                            desc: "Add 5–20% overage to account for mixing waste, dropped mortar, and irregular joint widths. Default is 10% for block and brick, 15% for stone.",
                        },
                        {
                            title: "Bag Counts for Three Bag Sizes",
                            desc: "Simultaneously see 80 lb, 60 lb, and 40 lb bag quantities so you can choose the bag size that best fits your project and equipment.",
                        },
                        {
                            title: "ASTM C270 Compliance Warnings",
                            desc: "Real-time alerts flag inappropriate mortar type selections — for example, using Type O (350 PSI) on a structural block wall that requires Type N or higher.",
                        },
                        {
                            title: "Advanced Cost Estimation",
                            desc: "Switch to Advanced mode to enter price per bag and labor cost per bag for a complete installed material-and-labor cost estimate.",
                        },
                        {
                            title: "Print / Save to PDF",
                            desc: "Generate a clean printable report with all inputs, bag counts, and cost estimates. Save as PDF directly from your browser's print dialog.",
                        },
                        {
                            title: "Mortar Type Reference Table",
                            desc: "A quick-reference table in the results section shows all four ASTM C270 mortar types with minimum compressive strength and recommended applications.",
                        },
                        {
                            title: "Instant Recalculation",
                            desc: "Results update the moment you press Calculate. Any change to an input clears the results so you always see fresh numbers, never stale data.",
                        },
                        {
                            title: "Mobile-Optimized Layout",
                            desc: "Responsive design works on phones, tablets, and desktops. Take the calculator to the job site and calculate on the spot.",
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-200">{feature.title}</h3>
                                <p className="text-sm text-slate-400 mt-1">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Section 3 — How to Use ────────────────────────────────── */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Mortar Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select your Estimate Mode — Quick for a fast bag count, or Advanced to include pricing and labor cost.",
                        "Click a Project Type preset: Block Wall loads a 100-block default; Brick Veneer and Stone Veneer load a 100 sq ft default with appropriate joint thickness.",
                        "For Block Wall projects, enter the total number of standard CMU blocks in your wall. To calculate block count yourself, multiply the wall length by height in feet, then divide by the block face area (0.889 sq ft for standard 8×8×16 blocks).",
                        "For Brick Veneer or Stone Veneer, enter the total wall area in square feet. Measure the full surface, then subtract large openings such as windows and doors.",
                        "If you selected Brick or Stone Veneer, choose the Mortar Joint Thickness: 3/8\" is standard for brick, 1/2\" is a wide joint, and 3/4\" is common for rustic stone.",
                        "Select the Mortar Type per ASTM C270. Type N is the general-purpose choice for above-grade masonry. Use Type S for below-grade or high-moisture exposure, and Type M for retaining walls and heavy structural loads.",
                        "Set a Waste / Overage Allowance. A 10% waste factor is a safe baseline for block and brick; stone veneer work often warrants 15–20% due to irregular joint widths.",
                        "In Advanced mode, enter the Price per 80 lb Bag (typically $10–$15) and the Labor Cost per Bag mixed and applied.",
                        "Press Calculate to see your 80 lb, 60 lb, and 40 lb bag counts with and without waste, plus approximate wall area coverage and optional cost breakdown.",
                        "Review the ASTM C270 Mortar Type Reference table in the results to confirm you have selected the right type for your application.",
                        "If a compliance warning appears (amber alert), adjust your mortar type selection before ordering materials.",
                        "Use the Print / Save button to generate a PDF report for your records or to share with a supplier.",
                    ].map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-sm shrink-0 border border-teal-500/30">
                                {idx + 1}
                            </div>
                            <span className="text-slate-300 pt-0.5">{step}</span>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ── Section 4 — Formulas ─────────────────────────────────── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Block Wall — Bag Count</strong>
                        Bags (80 lb) = ⌈ Block Count ÷ 13 ⌉<br />
                        <span className="text-white/60 text-sm">
                            Based on the industry-standard coverage of 13 standard 8×8×16 CMU blocks per
                            80 lb premix mortar bag, including bed joints and head joints at a nominal
                            3/8″ thickness. Coverage for 60 lb bags uses 10 blocks/bag and 40 lb bags
                            use 7 blocks/bag, proportional to bag weight.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Brick / Stone Veneer — Bag Count</strong>
                        Bags (80 lb) = ⌈ (Wall Area ÷ 100) × Coverage Rate ⌉<br />
                        <span className="text-white/60 text-sm">
                            Coverage rates (80 lb bags per 100 sq ft): Brick at 3/8″ joint = 7 bags,
                            brick at 1/2″ joint = 9 bags, brick at 3/4″ joint = 12 bags. Stone at 3/8″
                            = 8 bags, stone at 1/2″ = 10 bags, stone at 3/4″ = 14 bags. Stone requires
                            more mortar per area because of less-uniform unit shapes.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Waste Factor</strong>
                        Total Bags = ⌈ Base Bags × (1 + Waste% ÷ 100) ⌉<br />
                        <span className="text-white/60 text-sm">
                            Mortar loss occurs during mixing (typically 5–10%), from overfilling joints,
                            and from spills. A 10% waste factor is the standard recommendation for block
                            and brick; use 15–20% for stone veneer where joint widths vary more.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Cost Estimate (Advanced)</strong>
                        Material Cost = Bags (80 lb) × Price per Bag<br />
                        Labor Cost = Bags (80 lb) × Labor Cost per Bag<br />
                        Total = Material Cost + Labor Cost<br />
                        <span className="text-white/60 text-sm">
                            Expressed for 80 lb bags because that is the most common size for mortar.
                            Scale bag count proportionally if your crew uses 60 lb or 40 lb bags.
                        </span>
                    </li>
                </ul>
            </section>

            {/* ── Section 5 — Mortar Types Reference Guide ─────────────── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    ASTM C270 Mortar Types — Complete Reference Guide
                </h2>
                <p className="text-slate-400 mb-4">
                    ASTM C270 is the governing standard for mortar for unit masonry in North America.
                    It defines four mortar types — M, S, N, and O — each with a minimum compressive
                    strength, a specific application range, and performance characteristics for bond
                    strength, durability, and workability.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Type</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Min. Strength</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Bond Strength</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Recommended Use</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Not Suitable For</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    type: "M",
                                    strength: "2,500 PSI",
                                    bond: "Low",
                                    use: "Below grade, retaining walls, manholes, sewers, heavily loaded walls",
                                    not: "Brick veneer, interior walls where flexibility is needed",
                                },
                                {
                                    type: "S",
                                    strength: "1,800 PSI",
                                    bond: "Moderate",
                                    use: "Exterior walls at or below grade, structures in contact with soil, high lateral load masonry, pavers",
                                    not: "Highly flexible or non-structural applications",
                                },
                                {
                                    type: "N",
                                    strength: "750 PSI",
                                    bond: "High",
                                    use: "Above-grade exterior masonry, interior load-bearing walls, standard CMU, general-purpose brick and block work",
                                    not: "Below-grade applications or areas with persistent moisture exposure",
                                },
                                {
                                    type: "O",
                                    strength: "350 PSI",
                                    bond: "Very High",
                                    use: "Interior non-load-bearing partitions, low-exposure decorative veneer, protected interior stone work",
                                    not: "Structural walls, exterior applications, or any area subject to freezing and thawing",
                                },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">Type {row.type}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.strength}</td>
                                    <td className="py-3 px-4 text-slate-400">{row.bond}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.use}</td>
                                    <td className="py-3 px-4 text-slate-400">{row.not}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Source: ASTM C270 — Standard Specification for Mortar for Unit Masonry. Always consult
                    local building codes and a licensed masonry professional for structural applications.
                </p>
            </section>

            {/* ── Section 6 — FAQ ───────────────────────────────────────── */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: "What is a mortar calculator and what does it estimate?",
                            a: "A mortar calculator estimates the number of premix mortar bags required for a masonry project based on the number of blocks or the wall area, joint thickness, and a waste allowance. This calculator supports block walls (CMU), brick veneer, and stone veneer and returns bag counts for 80 lb, 60 lb, and 40 lb bags.",
                        },
                        {
                            q: "How does the mortar calculator work?",
                            a: "For block walls, it divides your block count by the coverage rate (13 standard 8×8×16 blocks per 80 lb bag). For brick and stone veneer, it multiplies your wall area in sq ft by a bags-per-100-sqft rate that depends on joint thickness. Both paths then apply your waste percentage and round up to the nearest whole bag.",
                        },
                        {
                            q: "How many mortar bags do I need per 100 standard blocks?",
                            a: "Approximately 7–8 bags of 80 lb premix mortar per 100 standard 8×8×16 CMU blocks, before waste. Adding 10% waste brings that to about 8–9 bags. This assumes a nominal 3/8\" mortar joint on bed and head joints as specified in ASTM C270.",
                        },
                        {
                            q: "How much mortar do I need per 100 square feet of brick wall?",
                            a: "For a standard 3/8\" mortar joint, you need approximately 7 bags of 80 lb premix mortar per 100 sq ft of standard brick veneer. Wider joints increase consumption: a 1/2\" joint requires about 9 bags per 100 sq ft. Always add a 10% waste factor, bringing your order to 8–10 bags per 100 sq ft.",
                        },
                        {
                            q: "What is the difference between mortar types M, S, N, and O?",
                            a: "All four types are defined by ASTM C270. Type M (2,500 PSI) is the strongest and is used below grade and for retaining walls. Type S (1,800 PSI) is for exterior walls at or below grade. Type N (750 PSI) is the general-purpose choice for above-grade masonry and is the most commonly used type. Type O (350 PSI) is the weakest and is limited to interior non-load-bearing applications.",
                        },
                        {
                            q: "Which mortar type should I use for a standard block wall?",
                            a: "Type N (750 PSI) is the standard choice for above-grade structural block walls. If the wall is below grade, in contact with soil, or subject to high lateral loads (like a retaining wall), use Type S (1,800 PSI). For retaining walls or other heavy structural applications, Type M (2,500 PSI) may be required by the engineer of record.",
                        },
                        {
                            q: "Can I use Type O mortar for an exterior brick wall?",
                            a: "No. Type O mortar is not suitable for exterior masonry applications. It has a minimum compressive strength of only 350 PSI and low resistance to freeze-thaw cycles. Exterior brick walls require at minimum Type N (750 PSI); walls subject to moisture, below grade, or in severe climates should use Type S (1,800 PSI).",
                        },
                        {
                            q: "How much waste should I add to my mortar estimate?",
                            a: "For block and brick work, a 10% waste allowance is the standard recommendation. Stone veneer work typically requires 15–20% because irregular unit shapes lead to variable joint widths, more over-filling, and more mixing waste. Always round up to the nearest whole bag.",
                        },
                        {
                            q: "What is the difference between premix mortar and site-mixed mortar?",
                            a: "Premix mortar (also called mortar mix or type S/N mix in bags) comes with cement, sand, and lime pre-blended — you just add water. Site-mixed mortar is prepared from separate components (Portland cement, hydrated lime, and sand) per ASTM C270 volume proportions. Premix bags are more convenient for small projects; site mixing is more economical for large jobs.",
                        },
                        {
                            q: "How do I calculate the number of blocks I need for a wall?",
                            a: "For standard 8×8×16 CMU blocks, the nominal face area per block (including a 3/8\" mortar joint) is approximately 0.952 sq ft. Multiply your wall length by height in feet to get gross area, deduct openings, then divide by 0.952 and add a 5–7% waste factor. For a quick estimate: about 1.125 standard blocks per square foot of wall area.",
                        },
                        {
                            q: "Is this calculator suitable for tuckpointing (repointing) projects?",
                            a: "This calculator is designed for new masonry construction. Tuckpointing involves removing old mortar to a depth of 3/4\" and replacing it, which requires a different volume calculation based on the joint perimeter and depth. For tuckpointing, the actual mortar volume is much smaller — typically 1–2 bags per 100 sq ft for standard brick repointing.",
                        },
                        {
                            q: "Does mortar bag weight affect coverage?",
                            a: "Yes — coverage is roughly proportional to bag weight. An 80 lb bag covers approximately 13 standard CMU blocks or 7 sq ft of brick veneer at 3/8\". A 60 lb bag covers about 10 blocks or 5.25 sq ft, and a 40 lb bag covers about 7 blocks or 3.5 sq ft. The calculator computes all three simultaneously.",
                        },
                        {
                            q: "Is the calculator free to use?",
                            a: "Yes, this mortar calculator is completely free. There are no sign-ups, subscriptions, or hidden fees. You can use it as many times as needed and print or save your results to PDF from your browser's print dialog.",
                        },
                        {
                            q: "Can I print or save my mortar estimate?",
                            a: "Yes. After pressing Calculate, a Print / Save button appears in the results section. Clicking it opens a clean print view in a new browser tab. In your browser's Print dialog, select Save as PDF to keep a digital copy. The printout includes all your inputs, bag counts, and (if Advanced mode is on) cost estimates.",
                        },
                        {
                            q: "How accurate are the mortar bag estimates from this calculator?",
                            a: "The estimates are based on standard industry coverage rates per ASTM C270 and are accurate for typical well-controlled masonry work. Real-world consumption varies based on mason technique, mortar consistency (water content), ambient temperature, unit absorption, and joint irregularity — particularly for stone. Use the waste percentage field to build in a buffer. For large structural projects, always obtain a professional takeoff.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                            <h3 className="font-semibold text-lg text-slate-200 mb-2">{item.q}</h3>
                            <p className="text-slate-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}