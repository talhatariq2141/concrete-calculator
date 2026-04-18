// components/calculators/articles/ConcretePatioCalcArticle.tsx
"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ConcretePatioCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* ── Section 1 — Introduction ── */}
            <section>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The Concrete Patio Calculator takes the guesswork out of one of the most
                    popular backyard projects. Whether you&apos;re pouring a simple square slab for
                    a bistro table or a sweeping 20×30 ft entertaining space, accurate concrete
                    estimation prevents the frustration of short-ordering mid-pour or overpaying
                    for material that never gets used. Under-ordering by even half a yard can halt
                    a project and leave cold joints; over-ordering wastes hundreds of dollars in
                    ready-mix. This tool gives you the numbers you need in seconds.
                </p>
                <p className="text-slate-300 leading-relaxed">
                    The calculator accepts both rectangular and circular patio shapes. Enter your
                    dimensions in feet and your slab thickness in inches, and it outputs concrete
                    volume in cubic yards, cubic feet, and cubic meters; pre-mixed bag counts for
                    40-lb, 60-lb, and 80-lb bags; estimated slab weight in pounds and tons; and —
                    in Advanced mode — a full cost breakdown including ready-mix, labor, and
                    finishing. An ACI 318-19 §7.3 compliance check flags any thickness below
                    4 inches before you order.
                </p>
            </section>

            {/* ── Section 2 — Key Features ── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Concrete Patio Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Rectangular & Circular Shapes",
                            desc: "Switch between rectangular/square and circular/round patio shapes with a single click. The correct volume formula is applied automatically.",
                        },
                        {
                            title: "Three One-Click Presets",
                            desc: "Load typical Small (10×10), Medium (12×16), or Large (16×20) patio dimensions instantly, then fine-tune any value to match your actual project.",
                        },
                        {
                            title: "Configurable Waste Factor",
                            desc: "Default 10% waste covers subgrade irregularities, spillage, and form flex. Increase to 15% for curved patios or sites with uneven subbase.",
                        },
                        {
                            title: "Multi-Unit Volume Output",
                            desc: "Results are displayed in cubic yards (for ready-mix ordering), cubic feet (for bag calculations), and cubic meters (for international or metric projects).",
                        },
                        {
                            title: "Pre-Mixed Bag Count Estimates",
                            desc: "Calculates 40-lb, 60-lb, and 80-lb bag counts using industry-standard yields so you can compare DIY bagged options before deciding.",
                        },
                        {
                            title: "Slab Weight Output",
                            desc: "Reports the estimated slab weight in pounds, US tons, kilograms, and metric tons — useful for structural support calculations and delivery logistics.",
                        },
                        {
                            title: "ACI 318-19 §7.3 Thickness Warning",
                            desc: "An automatic warning appears when slab thickness is below 4 inches, the ACI-recommended minimum for residential exposed slabs subject to freeze-thaw.",
                        },
                        {
                            title: "Advanced Cost Estimation",
                            desc: "Switch to Advanced mode to enter ready-mix price per cubic yard, labor rate per square foot, and finishing cost for stamping, staining, or sealing.",
                        },
                        {
                            title: "Cost per Square Foot Breakdown",
                            desc: "Advanced mode also reports total cost per square foot, making it easy to compare bids from contractors or benchmark your DIY budget.",
                        },
                        {
                            title: "Ready-Mix vs Bag Recommendation",
                            desc: "A contextual tip automatically appears for projects over 2 cubic yards, recommending ready-mix delivery as the more cost-effective and time-efficient choice.",
                        },
                        {
                            title: "Printable PDF Report",
                            desc: "The Print / Save button generates a branded report with all inputs, results, and compliance notes — ideal for purchase orders and contractor quotes.",
                        },
                        {
                            title: "Quick Reference Size Table",
                            desc: "An in-results table lists common patio dimensions from 10×10 to 20×30 ft with pre-calculated concrete volumes at 4-inch and 6-inch thickness.",
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

            {/* ── Section 3 — How to Use ── */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Concrete Patio Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select Quick or Advanced mode. Quick gives you volume, bag counts, and weight. Advanced adds a full cost breakdown.",
                        "Choose your patio shape: Rectangular / Square for standard box patios, or Circular / Round for round feature patios.",
                        "Click a project size preset — Small (10×10), Medium (12×16), or Large (16×20) — to load sensible default dimensions for a starting point.",
                        "Enter the patio length and width in feet for rectangular shapes, or the full diameter in feet for circular shapes. Override the preset values as needed.",
                        "Enter the slab thickness in inches. Residential patios typically use 4 inches; high-traffic or vehicle-adjacent slabs benefit from 5–6 inches.",
                        "Set the waste factor. The default 10% is appropriate for most rectangular patios. Increase to 15% for irregular or curved shapes.",
                        "In Advanced mode, enter your local concrete price per cubic yard, labor rate per square foot, and finishing rate for any decorative treatment.",
                        "Press Calculate. The results panel shows cubic yards (hero number), full volume breakdown, bag counts, weight, and — in Advanced mode — total project cost.",
                        "Check the ACI 318-19 §7.3 compliance indicator. If your thickness is below 4 inches, a warning appears before you finalise your order.",
                        "Review the ready-mix tip if your project exceeds 2 cubic yards — hand-mixing that volume of bagged concrete is impractical for most DIYers.",
                        "Consult the reference table to cross-check your calculated volumes against pre-computed values for common patio sizes.",
                        "Press Print / Save to export a PDF of all inputs, results, and compliance notes for purchase orders or contractor discussions.",
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

            {/* ── Section 4 — Formulas Used ── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Formulas Used in the Calculator
                </h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Rectangular Patio Volume</strong>
                        Volume (ft³) = Length (ft) × Width (ft) × Thickness (ft)<br />
                        <span className="text-white/60 text-sm">
                            Thickness is entered in inches and converted to feet by dividing by 12.
                            A 12 × 16 ft patio at 4 in: 12 × 16 × 0.333 = 64.0 ft³ = 2.37 yd³.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Circular Patio Volume</strong>
                        Volume (ft³) = π × (Diameter / 2)² × Thickness (ft)<br />
                        <span className="text-white/60 text-sm">
                            A 16 ft diameter circular patio at 4 in: π × 8² × 0.333 = 66.99 ft³ ≈ 2.48 yd³.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Cubic Yards Conversion</strong>
                        Cubic Yards = Cubic Feet ÷ 27<br />
                        <span className="text-white/60 text-sm">
                            There are 27 cubic feet in one cubic yard. Ready-mix concrete is ordered
                            and priced by the cubic yard in the United States.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Waste Factor</strong>
                        Total Volume = Base Volume × (1 + Waste% ÷ 100)<br />
                        <span className="text-white/60 text-sm">
                            At 10% waste: 2.37 yd³ × 1.10 = 2.61 yd³ to order. Industry standard
                            for flat slabs is 5–10%; use 15% for irregular shapes.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) Bag Count</strong>
                        Bags = ⌈Total ft³ ÷ Yield per bag⌉ (always rounded up)<br />
                        <span className="text-white/60 text-sm">
                            Yields: 40-lb = 0.30 ft³, 60-lb = 0.45 ft³, 80-lb = 0.60 ft³.
                            For 70.4 ft³: 80-lb bags = ⌈70.4 ÷ 0.60⌉ = 118 bags.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) Slab Weight</strong>
                        Weight (lb) = Total Volume (ft³) × 150 lb/ft³<br />
                        <span className="text-white/60 text-sm">
                            Normal-weight concrete density is 150 lb/ft³ (ACI 318). A 70 ft³ slab
                            weighs approximately 10,500 lbs (5.25 US tons).
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) Total Project Cost (Advanced)</strong>
                        Total Cost = (Volume in yd³ × Price/yd³) + (Area in ft² × Labor/ft²) + (Area in ft² × Finishing/ft²)<br />
                        <span className="text-white/60 text-sm">
                            Material, labor, and finishing are calculated independently so you can
                            adjust any component without affecting the others.
                        </span>
                    </li>
                </ul>
            </section>

            {/* ── Section 5 — Patio Thickness Guide ── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Concrete Patio Thickness Guide
                </h2>
                <p className="text-slate-400 mb-4">
                    Slab thickness is the single most influential dimension for both structural
                    performance and material cost. Doubling thickness from 4 to 8 inches doubles
                    your concrete order and roughly doubles cost. Use this guide to select the
                    right thickness for your patio use case.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">
                                    Thickness
                                </th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">
                                    Use Case
                                </th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">
                                    Standard / Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    thick: "3 inches",
                                    use: "Decorative overlays / thin-set repairs",
                                    note: "Not a structural slab. ACI 318 minimum not met.",
                                },
                                {
                                    thick: "4 inches",
                                    use: "Residential patio, walkway, garden path",
                                    note: "ACI 318-19 §7.3 minimum for residential exposed slabs.",
                                },
                                {
                                    thick: "5 inches",
                                    use: "Heavy-use patio, BBQ/outdoor kitchen slab",
                                    note: "Recommended when heavy furniture or hot tubs are placed on the slab.",
                                },
                                {
                                    thick: "6 inches",
                                    use: "Adjacent to driveway, light vehicle access",
                                    note: "Suitable for occasional vehicle access or heavy loading.",
                                },
                                {
                                    thick: "8 inches",
                                    use: "Commercial patio, regular vehicle traffic",
                                    note: "Typically requires rebar reinforcement per ACI 318.",
                                },
                            ].map((row, i) => (
                                <tr
                                    key={i}
                                    className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">{row.thick}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.use}</td>
                                    <td className="py-3 px-4 text-slate-400 text-xs">{row.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-slate-400 text-sm">
                    In freeze-thaw climates, specify air-entrained concrete with 5–7% air content
                    regardless of thickness. This dramatically improves resistance to surface
                    scaling caused by deicing salts.
                </p>
            </section>

            {/* ── Section 6 — FAQ ── */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">
                        Frequently Asked Questions
                    </h2>
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: "What is a concrete patio calculator?",
                            a: "A concrete patio calculator estimates the volume of concrete needed to pour a patio slab given its length, width, and thickness. It converts that volume to cubic yards (for ready-mix ordering), cubic feet, bag counts for pre-mixed concrete, and estimated slab weight. Our calculator also includes a cost estimator and ACI compliance check.",
                        },
                        {
                            q: "How much concrete do I need for a 10×10 patio?",
                            a: "A 10×10 ft patio at 4 inches thick requires approximately 1.23 cubic yards including a 10% waste allowance. At 6 inches thick, that increases to 1.85 cubic yards. At 4 inches, you would need approximately 56 bags of 80-lb pre-mixed concrete, or about 75 bags of 60-lb.",
                        },
                        {
                            q: "How much concrete do I need for a 12×16 patio?",
                            a: "A 12×16 ft patio at standard 4-inch thickness requires approximately 2.37 cubic yards of concrete including 10% waste. At 6 inches thick, the estimate rises to 3.56 cubic yards. This is large enough that ready-mix delivery is typically more economical than pre-bagged concrete.",
                        },
                        {
                            q: "How much concrete do I need for a 16×20 patio?",
                            a: "A 16×20 ft patio at 4 inches thick requires approximately 3.95 cubic yards with 10% waste. At 6 inches thick, it requires roughly 5.93 cubic yards. A project of this scale strongly benefits from ready-mix truck delivery, as hand-mixing that many bags is impractical.",
                        },
                        {
                            q: "How thick should a concrete patio be?",
                            a: "ACI 318-19 §7.3 recommends a minimum of 4 inches for residential exposed slabs. Most contractors pour to 4 inches for standard patios. Use 5–6 inches if heavy outdoor furniture, a hot tub, or occasional vehicle access is planned. Always reinforce with rebar or wire mesh for 6-inch or thicker slabs.",
                        },
                        {
                            q: "Should I use ready-mix concrete or bags for a patio?",
                            a: "For patios over 1.5–2 cubic yards, ready-mix truck delivery is almost always more economical and produces a superior, more consistent mix. Hand-mixing 80-lb bags for a medium patio means opening and mixing 100+ bags — a full day's labor. Bags are appropriate for small patch jobs or patios under roughly 50 square feet at 4 inches.",
                        },
                        {
                            q: "What PSI concrete should I use for a patio?",
                            a: "2,500–3,000 PSI is the standard specification for residential patios in temperate climates. In freeze-thaw climates, specify 3,500–4,000 PSI with 5–7% air entrainment to resist surface scaling. Commercial or load-bearing patios should use 4,000 PSI or higher as directed by a structural engineer.",
                        },
                        {
                            q: "How do I calculate concrete for a circular patio?",
                            a: "Use the formula: Volume (ft³) = π × (diameter ÷ 2)² × thickness in feet. For a 16 ft diameter circular patio at 4 inches thick: π × 8² × 0.333 = 66.99 ft³ ÷ 27 = 2.48 yd³. Our calculator handles this automatically when you select the Circular / Round shape option.",
                        },
                        {
                            q: "What is the waste factor and how much should I add?",
                            a: "A waste factor accounts for subgrade irregularities, form flex, accidental spillage, and the need to round up to the nearest half-yard on a ready-mix order. The industry standard for flat rectangular slabs is 5–10%. Use 10% as a default; increase to 15% for curved patios or sites with uneven or soft subbase.",
                        },
                        {
                            q: "How heavy is a concrete patio?",
                            a: "Normal-weight concrete weighs approximately 150 lb/ft³. A 12×16 ft patio at 4 inches thick (64 ft³) weighs around 9,600 lbs — nearly 5 tons. This matters for structural support if the patio is elevated, and for understanding load transfer to underlying soil.",
                        },
                        {
                            q: "Do concrete patios need rebar or wire mesh?",
                            a: "ACI 318 does not mandate rebar for lightly-loaded residential ground-supported slabs, but most contractors recommend wire mesh (6×6 W1.4×W1.4) or #3 rebar on 18-inch centers for slabs 4 inches or thicker. Reinforcement controls crack width and extends service life, especially in freeze-thaw climates.",
                        },
                        {
                            q: "How much does a concrete patio cost?",
                            a: "In the US, a standard poured concrete patio costs $6–$10 per square foot for a basic broom finish, including materials, forming, placement, and curing. Decorative finishes (stamped, stained, or exposed aggregate) add $3–$8 per square foot. A 12×16 ft patio typically costs $1,150–$1,900 basic or up to $3,000 with decorative finish.",
                        },
                        {
                            q: "Is the concrete patio calculator free?",
                            a: "Yes. The Concrete Patio Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees. You can use it as many times as needed for different project sizes and shapes.",
                        },
                        {
                            q: "Can I print or save my patio concrete estimate?",
                            a: "Yes. After calculating, press the Print / Save button. A formatted report opens in a new tab with all your inputs, volume results, bag counts, weight, and cost breakdown. In your browser's Print dialog, choose Save as PDF to save a digital copy for purchase orders, permits, or contractor comparisons.",
                        },
                        {
                            q: "What is the ACI 318-19 §7.3 warning in the calculator?",
                            a: "ACI 318-19 Section 7.3 specifies minimum thickness requirements for slabs-on-ground. The calculator warns you when your entered thickness falls below 4 inches because thinner slabs are more susceptible to cracking under thermal cycling, freeze-thaw action, and point loading from furniture legs or foot traffic.",
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