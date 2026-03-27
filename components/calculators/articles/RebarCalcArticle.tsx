// components/calculators/articles/RebarCalcArticle.tsx
"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function RebarCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* Introduction */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    How to Calculate Rebar for Concrete Projects
                </h2>
                <p className="mb-4 leading-relaxed">
                    The Rebar Calculator is a tool that helps estimate how many rebar bars you need, total linear footage, total weight, and project cost for concrete slabs, footings, walls, and other reinforced concrete structures. It uses your slab dimensions, bar size, spacing, and number of layers to produce an accurate material takeoff.
                </p>
                <p className="mb-4 leading-relaxed">
                    Rebar — short for reinforcing bar — is deformed steel placed inside concrete to resist tensile and shear forces that concrete alone cannot handle. Correctly estimating rebar before ordering prevents costly shortages, excess waste, and project delays. A rebar calculator gives you a precise quantity in minutes rather than working through the math by hand.
                </p>
            </section>

            {/* Features Cards */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Rebar Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Rebar Quantity Estimator",
                            desc: "Calculates total bar count and linear footage for rectangular layouts with independent spacing per direction."
                        },
                        {
                            title: "Dual-Direction Spacing",
                            desc: "Set different spacing along the length and width axes — critical for non-square slabs and one-way reinforcement layouts."
                        },
                        {
                            title: "Multi-Layer Support",
                            desc: "Choose single or double-layer rebar mats for structural slabs, elevated decks, and heavily loaded foundations."
                        },
                        {
                            title: "Concrete Cover Setback",
                            desc: "Accounts for the required concrete cover at each edge before the first bar, improving count accuracy."
                        },
                        {
                            title: "ACI Spacing Warning",
                            desc: "Alerts you when your chosen spacing is tighter than the ACI 318 minimum clear spacing requirement for the selected bar size."
                        },
                        {
                            title: "Bar Size Reference Table",
                            desc: "Built-in ASTM A615/A706 table showing diameter, cross-sectional area, and weight per foot for #3 through #8 bars."
                        },
                        {
                            title: "Weight & Tonnage",
                            desc: "Converts linear footage to pounds and US tons automatically — essential for procurement, delivery, and structural load planning."
                        },
                        {
                            title: "Cost Estimator (Advanced)",
                            desc: "Add material price per linear foot, labor rate, and delivery fees to produce a full rebar cost estimate for your project."
                        },
                        {
                            title: "Stock Bar Count (Advanced)",
                            desc: "Enter your standard stock bar length (e.g., 20 ft) and the calculator tells you how many bars to order."
                        },
                        {
                            title: "Project-Type Presets",
                            desc: "One-click presets for Slab / Patio, Strip Footing, and Wall load sensible defaults for dimensions, cover, spacing, and bar size."
                        },
                        {
                            title: "Waste / Overlap Factor",
                            desc: "Adjustable waste percentage covers lap splices, off-cuts, bent hooks, and on-site wastage. Default is 10%."
                        },
                        {
                            title: "Printable Estimate",
                            desc: "Print or save a PDF summary of all inputs and results for use in bids, permits, and site records."
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700"
                        >
                            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-200">{feature.title}</h3>
                                <p className="text-sm text-slate-400 mt-1">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How to use */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Rebar Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select a project type preset (Slab, Footing, or Wall) to load typical defaults, or enter your own values from scratch.",
                        "Enter the length and width of your concrete structure. Choose your preferred unit — feet, inches, or meters.",
                        "Set the concrete cover (edge setback). This is the distance from the edge of the pour to the center of the first bar — typically 2\" for slabs and 3\" for footings.",
                        "Enter your waste / overlap percentage. Use 10% for simple rectangular pours; 15–20% for complex layouts with many lap splices.",
                        "Select your bar size (#3 through #8). The built-in reference panel shows the diameter, area, weight, and common use for your chosen bar.",
                        "Set the spacing for the length direction and width direction independently. Enter 0 for the width direction if running bars one-way only.",
                        "Choose Single or Double layer. Double-layer mats are used for structural slabs, elevated decks, and heavily loaded foundations.",
                        "Switch to Advanced mode to enter stock bar length, material price per foot, labor rate, and delivery cost for a full cost estimate.",
                        "Press Calculate. Review total bar count, total linear footage, weight in lbs and tons, and the directional breakdown.",
                        "Use Print / Save to export a PDF summary for bids, permit applications, or site records.",
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

            {/* Formulas Used */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Formulas Used in the Rebar Calculator
                </h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Net Span Calculation</strong>
                        Net Length = Total Length − (2 × Concrete Cover)<br />
                        Net Width = Total Width − (2 × Concrete Cover)
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Bar Count per Direction</strong>
                        Bars along length = floor(Net Length ÷ Spacing) + 1<br />
                        Bars along width = floor(Net Width ÷ Spacing) + 1<br />
                        <span className="text-white/60 text-sm">Each set of bars spans the perpendicular dimension.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Linear Footage</strong>
                        LF (length-dir bars) = Bars along length × Total Width × Layers<br />
                        LF (width-dir bars) = Bars along width × Total Length × Layers<br />
                        Total Raw LF = LF (length-dir) + LF (width-dir)<br />
                        Total LF with Waste = Total Raw LF × (1 + Waste % ÷ 100)
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Weight</strong>
                        Total Weight (lbs) = Total LF × Weight per Linear Foot (lb/ft)<br />
                        Total Weight (tons) = Total Weight (lbs) ÷ 2,000<br />
                        <span className="text-white/60 text-sm">Weight per foot values per ASTM A615/A706 standard.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) Stock Bars to Order (Advanced)</strong>
                        Stock Bars = ⌈Total LF ÷ Stock Bar Length⌉
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) ACI 318 Minimum Clear Spacing Check</strong>
                        Min Clear Spacing = Bar Diameter + 1&quot;<br />
                        <span className="text-white/60 text-sm">ACI 318-19 Section 25.8.1 requires a minimum clear distance of 1&quot; between parallel bars or 4/3 times the nominal maximum aggregate size, whichever is greater. The calculator uses the bar diameter + 1&quot; as a practical minimum check.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) Cost Estimate (Advanced)</strong>
                        Material Cost = Total LF × Price per Linear Foot<br />
                        Labor Cost = Total LF × Labor Rate per Linear Foot<br />
                        Grand Total = Material Cost + Labor Cost + Delivery
                    </li>
                </ul>
            </section>

            {/* Rebar Size Guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Rebar Size Selection Guide
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    Choosing the correct rebar size is critical for structural performance and code compliance.
                    The table below shows standard ASTM A615/A706 deformed bar properties and their most common
                    residential and commercial applications.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Bar #</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Diameter</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">lb / ft</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium hidden sm:table-cell">Common application</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { bar: "3", dia: '3/8"', lbft: "0.376", use: "Temperature / shrinkage steel, ties, light pedestrian slabs" },
                                { bar: "4", dia: '1/2"', lbft: "0.668", use: "Residential driveways, patios, sidewalks, footing ties" },
                                { bar: "5", dia: '5/8"', lbft: "1.043", use: "Structural slabs, beams, columns, residential foundations" },
                                { bar: "6", dia: '3/4"', lbft: "1.502", use: "Heavy beams, retaining walls, elevated slabs" },
                                { bar: "7", dia: '7/8"', lbft: "2.044", use: "Deep foundations, large retaining walls, commercial columns" },
                                { bar: "8", dia: '1"',   lbft: "2.670", use: "Heavy structural columns, transfer beams, mat foundations" },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">#{row.bar}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.dia}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.lbft}</td>
                                    <td className="py-3 px-4 text-slate-400 hidden sm:table-cell">{row.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Spacing Guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Rebar Spacing Quick Reference
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    Rebar spacing depends on the structural load, slab thickness, concrete strength, and applicable building code.
                    Use this quick-reference guide to select a starting point for your project:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { project: "Residential driveway (4–5\" slab)", bar: "#4", spacing: "12\" o.c. each way" },
                        { project: "Residential garage floor (4–6\" slab)", bar: "#4 or #5", spacing: "12–16\" o.c. each way" },
                        { project: "Sidewalk / footpath (4\" slab)", bar: "#3 or #4", spacing: "18\" o.c. (or WWF mesh)" },
                        { project: "Patio / backyard slab (4\" slab)", bar: "#4", spacing: "12–18\" o.c. each way" },
                        { project: "Strip footing (residential)", bar: "#4 or #5", spacing: "2–3 bars longitudinal, ties at 18\"" },
                        { project: "Retaining wall stem", bar: "#5 or #6", spacing: "12\" o.c. vertical, 18\" horizontal" },
                        { project: "Structural slab (6–8\" thick)", bar: "#5", spacing: "12\" o.c. each way, double mat" },
                        { project: "Pool shell / gunite", bar: "#3", spacing: "12\" o.c. each way" },
                    ].map((row, i) => (
                        <div key={i} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                            <p className="text-slate-200 font-medium text-sm">{row.project}</p>
                            <p className="text-teal-400 text-sm mt-1">
                                {row.bar} — {row.spacing}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-white/50">
                    These are typical starting-point values only. Final spacing must be determined by a licensed engineer based on project-specific loading, soil conditions, and local code requirements.
                </p>
            </section>

            {/* FAQ Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-6">
                    {[
                        {
                            q: "How many rebar bars do I need for a 20×20 concrete slab?",
                            a: "For a 20×20 ft slab with #4 rebar at 12\" spacing in both directions (2\" cover, 10% waste), you need approximately 42 bars and around 860 linear feet. Enter your exact dimensions into the calculator above to get a precise answer."
                        },
                        {
                            q: "What size rebar should I use for a residential concrete driveway?",
                            a: "#4 rebar (1/2\" diameter) at 12\" center-to-center in both directions is the most common specification for a 4–5\" residential driveway slab. Some contractors use wire mesh (WWF) for light driveways, but #4 rebar provides superior crack resistance under vehicle loads."
                        },
                        {
                            q: "What is the concrete cover for rebar?",
                            a: "Concrete cover is the minimum distance from the outer edge of the rebar to the surface of the concrete. ACI 318 requires at least 3/4\" for concrete cast in forms not exposed to weather, 1.5\" for concrete exposed to weather, and 3\" for concrete cast against and permanently in contact with ground. For simplicity, most slab designs use 2–3\" of cover at edges."
                        },
                        {
                            q: "What is rebar spacing and why does it matter?",
                            a: "Rebar spacing is the center-to-center distance between parallel bars. Closer spacing provides more reinforcement but increases cost. Wider spacing reduces cost but may leave areas of concrete under-reinforced. ACI 318 requires minimum clear spacing of 1\" between bars (or the bar diameter, whichever is greater) to ensure proper concrete consolidation around the steel."
                        },
                        {
                            q: "What is the difference between single-layer and double-layer rebar?",
                            a: "A single-layer mat is the most common setup — one grid of rebar placed at mid-depth or slightly below center of a slab. A double-layer mat uses two grids of rebar (top and bottom), which is required for slabs 6\" or thicker, elevated structural slabs, two-way slabs, and slabs subject to heavy point loads or seismic forces."
                        },
                        {
                            q: "Why add a waste percentage to rebar calculations?",
                            a: "Rebar is cut to fit, meaning off-cuts are discarded. Bars must also overlap at splices (typically 40–60 bar diameters for standard laps). Additionally, bars are bent into hooks at footings and walls. A 10% waste factor covers typical lap splices and cuts; use 15–20% for complex layouts with many bends and cuts."
                        },
                        {
                            q: "How do I convert rebar linear footage to weight?",
                            a: "Multiply total linear footage by the weight per linear foot for your bar size. #4 rebar weighs 0.668 lb/ft, so 1,000 linear feet = 668 lbs = 0.334 US tons. Our rebar calculator does this automatically for #3 through #8 bars using ASTM A615/A706 standard weights."
                        },
                        {
                            q: "Is a rebar calculator accurate enough for structural design?",
                            a: "A rebar calculator is accurate for material quantity estimation and preliminary budgeting. However, it does not perform structural design calculations. For any load-bearing element — beams, columns, foundations, retaining walls — the final reinforcement layout, bar size, spacing, and splice lengths must be designed and sealed by a licensed structural engineer."
                        },
                        {
                            q: "How many 20-foot rebar bars do I need for my project?",
                            a: "Enable Advanced mode in the calculator and enter 20 ft as your stock bar length. The calculator will divide your total required linear footage (including waste) by 20 and round up to give you the exact number of bars to purchase."
                        },
                        {
                            q: "What is the ACI minimum rebar spacing requirement?",
                            a: "ACI 318-19 Section 25.8.1 requires the clear distance between parallel bars to be at least 1 inch, the nominal bar diameter, or 4/3 times the nominal maximum coarse aggregate size — whichever is greatest. Our calculator flags a warning if your entered spacing is tighter than bar diameter + 1\" as a practical check."
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                            <h3 className="font-semibold text-lg text-slate-200 mb-2">{item.q}</h3>
                            <p className="text-slate-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
