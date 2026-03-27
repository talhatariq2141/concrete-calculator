// components/calculators/articles/WireMeshCalcArticle.tsx
"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function WireMeshCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* Introduction */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    How to Calculate Wire Mesh for Concrete Slabs
                </h2>
                <p className="mb-4 leading-relaxed">
                    The Wire Mesh / WWF Calculator is a tool that estimates how many rolls or sheets of
                    welded wire fabric you need for a concrete project, along with total weight and cost.
                    It uses your slab dimensions, ASTM A1064 mesh designation, form factor (roll or sheet),
                    lap-splice allowance, and waste factor to produce an accurate material takeoff in seconds.
                </p>
                <p className="mb-4 leading-relaxed">
                    Welded wire fabric — also known as WWF, wire mesh, or welded wire reinforcement (WWR) —
                    is a grid of steel wires welded together at each intersection, used to control cracking
                    and provide tensile reinforcement in concrete flatwork. Accurately estimating the quantity
                    before ordering prevents costly shortfalls, avoids excess waste, and ensures your slab
                    meets the minimum reinforcement requirements of ACI 360R-10 and ASTM A1064.
                </p>
            </section>

            {/* Features Grid */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Wire Mesh Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "ASTM A1064 Mesh Designation Reference",
                            desc: "Built-in lookup table for all standard WWF designations from 4×4 W1.4 to 4×4 W2.9, showing wire spacing, diameter, and weight per square foot."
                        },
                        {
                            title: "Project-Type Presets",
                            desc: "One-click presets for Driveway, Patio/Slab, Sidewalk, and Industrial Floor load sensible mesh designations, form factors, and waste percentages for each application."
                        },
                        {
                            title: "Rolls and Sheets Estimator",
                            desc: "Calculates the exact number of rolls (5×150 ft) or sheets (5×10 ft or 6×20 ft) needed — matching how wire mesh is actually sold and ordered."
                        },
                        {
                            title: "Lap Splice Allowance",
                            desc: "Accounts for the overlap at each sheet join (typically one mesh spacing per ACI 318 §25.8.1), which significantly affects total material needed on large pours."
                        },
                        {
                            title: "ACI 360R-10 Compliance Warning",
                            desc: "Automatically warns when a light-gauge mesh (W1.4) is selected for driveways or industrial floors that require heavier reinforcement under ACI 360R-10 guidance."
                        },
                        {
                            title: "Custom Mesh Support",
                            desc: "Enter non-standard wire spacing and W-number for specialty mesh not covered by the standard designation list — useful for commercial or engineered specifications."
                        },
                        {
                            title: "Weight Calculation",
                            desc: "Converts total mesh area to total weight in pounds and US tons automatically, essential for delivery logistics and structural load planning."
                        },
                        {
                            title: "Double-Layer Mat Support",
                            desc: "Toggle a second mesh layer for slabs 6 inches or thicker, elevated structural decks, or applications requiring top and bottom reinforcement."
                        },
                        {
                            title: "Adjustable Waste Factor",
                            desc: "Set a waste percentage (default 10%) to account for cut edges, irregular slab shapes, and on-site trim waste. Recommend 15% for L-shaped or complex layouts."
                        },
                        {
                            title: "Cost Estimator (Advanced Mode)",
                            desc: "Enter price per square foot or price per roll/sheet to generate a full material cost estimate. Add delivery fees for a complete project total."
                        },
                        {
                            title: "Unit Flexibility",
                            desc: "Input dimensions in feet, inches, or meters. Lap splice can be entered in inches or feet. All conversions are handled internally."
                        },
                        {
                            title: "Print / Save PDF",
                            desc: "Export a print-ready summary of all inputs and results as a PDF — ideal for bids, purchase orders, permits, and site records."
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

            {/* How to Use */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Wire Mesh Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select a project type preset — Driveway, Patio/Slab, Sidewalk, or Industrial Floor — to load sensible defaults, or enter your own values from scratch.",
                        "Enter the length and width of your concrete slab. Choose your preferred unit — feet, inches, or meters.",
                        "Select your mesh designation from the ASTM A1064 dropdown. The built-in info panel shows the wire diameter, weight per square foot, and typical application for the selected mesh.",
                        "If your supplier sells a non-standard mesh, select Custom dimensions and enter the longitudinal spacing, transverse spacing, and W-number manually.",
                        "Choose a form factor — Roll (5×150 ft), Sheet (5×10 ft), or Large sheet (6×20 ft) — to match how your supplier sells the material.",
                        "Enter your lap / overlap dimension. ACI 318 §25.8.1 requires a minimum lap of one mesh spacing (usually 6 inches). This is added to the gross area calculation.",
                        "Set a waste percentage. Use 10% for simple rectangular slabs; increase to 15% for L-shapes, cut-outs, or complex layouts.",
                        "Switch to Advanced mode to add a second layer, enter material price per square foot or per roll/sheet, and include delivery costs for a full project estimate.",
                        "Press Calculate. Review total rolls or sheets needed, gross mesh area, weight in lbs and tons, and the detailed breakdown.",
                        "Check for the ACI 360R-10 warning — if your mesh is too light for your project type, the calculator flags it with a recommended upgrade.",
                        "Use Print / Save to export a PDF for purchase orders, bids, permit documentation, or site records.",
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

            {/* Formulas */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Formulas Used in the Wire Mesh Calculator
                </h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Slab Area</strong>
                        Slab Area = Length × Width<br />
                        <span className="text-white/60 text-sm">Both dimensions converted to feet before multiplication.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Lap / Overlap Allowance</strong>
                        Overlap Fraction = Lap Distance ÷ Longer Span × 0.5<br />
                        Net Area with Lap = Slab Area × (1 + Overlap Fraction)<br />
                        <span className="text-white/60 text-sm">Approximates the additional area consumed by lap splices at sheet joins. ACI 318 §25.8.1 requires a minimum lap of one full mesh spacing (typically 6 inches).</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Gross Area with Waste and Layers</strong>
                        Gross Area = Net Area with Lap × (1 + Waste % ÷ 100) × Number of Layers<br />
                        <span className="text-white/60 text-sm">Waste covers cut edges, off-cuts at perimeter, and on-site trim. Double the gross area for two-layer applications.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Units (Rolls or Sheets) Needed</strong>
                        Units Needed = ⌈Gross Area ÷ Form Factor Area (sq ft)⌉<br />
                        <span className="text-white/60 text-sm">Always rounded up to the next whole unit. Roll = 750 sq ft (5×150 ft); Sheet = 50 sq ft (5×10 ft); Large sheet = 120 sq ft (6×20 ft).</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) Weight</strong>
                        Total Weight (lbs) = Gross Area × Weight per Sq Ft (lb/sf)<br />
                        Total Weight (tons) = Total Weight (lbs) ÷ 2,000<br />
                        <span className="text-white/60 text-sm">Weight per sq ft values per ASTM A1064 published data for each mesh designation.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) Custom Mesh Weight Estimate</strong>
                        Weight per Sq Ft ≈ W-Number × 0.003 × 2 (for two wire directions)<br />
                        <span className="text-white/60 text-sm">Approximate formula based on the relationship W-Number × 0.001 in² = wire cross-sectional area. Used only for custom designations not in the standard table.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) Cost Estimate (Advanced Mode)</strong>
                        Material Cost = Gross Area × Price per Sq Ft (preferred)<br />
                        Material Cost = Units Needed × Price per Unit (if sq ft price is not entered)<br />
                        Grand Total = Material Cost + Delivery / Misc Cost
                    </li>
                </ul>
            </section>

            {/* ASTM A1064 Designation Guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    ASTM A1064 Mesh Designation Selection Guide
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    ASTM A1064 is the standard specification for carbon-steel wire and welded wire reinforcement
                    for concrete. Wire mesh designations follow the format{" "}
                    <span className="text-white font-medium">Spacing-L × Spacing-T – W-L × W-T</span>, where
                    spacing is in inches and W-numbers represent the cross-sectional area of each wire in
                    hundredths of a square inch (W2.0 = 0.020 in²). The table below shows the most common
                    residential and commercial designations.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Designation</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Wire spacing</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Wire dia.</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">lb / sq ft</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium hidden sm:table-cell">Typical application</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { d: "4×4 – W1.4×W1.4", sp: '4"×4"', dia: '0.135"', wt: "0.30", use: "Sidewalks, patios, light residential flatwork" },
                                { d: "6×6 – W1.4×W1.4", sp: '6"×6"', dia: '0.135"', wt: "0.21", use: "Standard residential slabs, light patios" },
                                { d: "6×6 – W2.0×W2.0", sp: '6"×6"', dia: '0.160"', wt: "0.29", use: "Residential driveways, garage floors" },
                                { d: "6×6 – W2.9×W2.9", sp: '6"×6"', dia: '0.192"', wt: "0.42", use: "Heavy driveways, commercial parking" },
                                { d: "4×4 – W2.0×W2.0", sp: '4"×4"', dia: '0.160"', wt: "0.58", use: "Structural slabs, elevated decks" },
                                { d: "4×4 – W2.9×W2.9", sp: '4"×4"', dia: '0.192"', wt: "0.84", use: "Industrial floors, heavy-load applications" },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">{row.d}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.sp}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.dia}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.wt}</td>
                                    <td className="py-3 px-4 text-slate-400 hidden sm:table-cell">{row.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-xs text-white/50">
                    These are the most common residential and commercial designations. Other designations
                    (e.g. D-series deformed wire, heavier gauges) are available for structural and
                    specialty applications — use the custom input for those.
                </p>
            </section>

            {/* Application Guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Wire Mesh Application Quick Reference
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    Use this guide to select the right mesh designation before opening the calculator.
                    Final reinforcement must always be confirmed by a licensed engineer for structural applications.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { project: "Residential sidewalk (4\" slab)",       mesh: "6×6 W1.4×W1.4 or 4×4 W1.4×W1.4", note: "Light pedestrian load" },
                        { project: "Backyard patio (4\" slab)",             mesh: "6×6 W1.4×W1.4",                   note: "Foot traffic only" },
                        { project: "Residential driveway (4–5\" slab)",     mesh: "6×6 W2.0×W2.0",                   note: "Passenger vehicles" },
                        { project: "Heavy driveway / RV pad (5–6\" slab)", mesh: "6×6 W2.9×W2.9",                   note: "Heavy vehicle load" },
                        { project: "Garage floor (4–6\" slab)",            mesh: "6×6 W2.0×W2.0",                   note: "Light vehicle traffic" },
                        { project: "Pool deck (4\" slab)",                  mesh: "6×6 W1.4×W1.4",                   note: "Pedestrian, wet exposure" },
                        { project: "Structural elevated slab (6\"+ slab)", mesh: "4×4 W2.0×W2.0, double layer",     note: "Engineer to specify" },
                        { project: "Industrial floor (6–8\" slab)",         mesh: "4×4 W2.9×W2.9",                   note: "Forklift / heavy equipment" },
                    ].map((row, i) => (
                        <div key={i} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                            <p className="text-slate-200 font-medium text-sm">{row.project}</p>
                            <p className="text-teal-400 text-sm mt-1">{row.mesh}</p>
                            <p className="text-white/50 text-xs mt-0.5">{row.note}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-white/50">
                    Starting-point values only. Always verify with local code requirements and your structural engineer.
                </p>
            </section>

            {/* FAQ */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: "What is a wire mesh calculator?",
                            a: "A wire mesh calculator is a tool that estimates how many rolls or sheets of welded wire fabric (WWF) you need for a concrete project based on your slab dimensions, mesh designation, lap-splice allowance, and waste factor. It also calculates total weight and optional cost."
                        },
                        {
                            q: "How does a wire mesh calculator work?",
                            a: "The calculator multiplies your slab length by width to get the net area, then adds an allowance for lap splices at sheet joins. It applies your waste factor and number of layers to get a gross coverage area, then divides by the roll or sheet size and rounds up to get the total units needed."
                        },
                        {
                            q: "How many sheets of wire mesh do I need for a 20×20 concrete slab?",
                            a: "For a 20×20 ft slab (400 sq ft) using 5×10 ft sheets (50 sq ft each) with 6×6 W2.0×W2.0 mesh, a 6-inch lap, and 10% waste, you need approximately 9–10 sheets. Use the calculator above for your exact dimensions and mesh selection."
                        },
                        {
                            q: "What is the difference between W1.4 and W2.0 wire mesh?",
                            a: "W1.4 and W2.0 refer to the cross-sectional area of the wire in hundredths of a square inch per ASTM A1064. W1.4 wire has a 0.135-inch diameter and weighs 0.21 lb/sq ft in a 6×6 spacing — suited for light slabs. W2.0 wire is 0.160 inches in diameter and weighs 0.29 lb/sq ft — recommended for driveways and garage floors subject to vehicle loads."
                        },
                        {
                            q: "What mesh should I use for a concrete driveway?",
                            a: "ACI 360R-10 recommends a minimum of W2.0 wire for driveways subject to passenger vehicle loads. The most common specification is 6×6 W2.0×W2.0. For driveways that see heavy trucks or RVs, upgrade to 6×6 W2.9×W2.9 or consider supplementing with rebar."
                        },
                        {
                            q: "What is the lap splice requirement for wire mesh?",
                            a: "ACI 318 §25.8.1 requires that welded wire fabric overlaps by at least one full mesh spacing at each joint. For 6×6 mesh this is a minimum 6-inch lap; for 4×4 mesh it is a minimum 4-inch lap. In practice most contractors use a 6-inch lap on all mesh to simplify placement."
                        },
                        {
                            q: "What does ASTM A1064 mean on a wire mesh label?",
                            a: "ASTM A1064 is the standard specification published by ASTM International for carbon-steel wire and welded wire reinforcement for concrete. A mesh labeled ASTM A1064 has been manufactured and tested to meet these standards for wire tensile strength, weld shear strength, and dimensional tolerances."
                        },
                        {
                            q: "Is wire mesh the same as rebar?",
                            a: "No. Wire mesh (WWF/WWR) is a pre-assembled grid of welded steel wires that provides distributed crack control across the full slab area. Rebar consists of individual deformed steel bars placed in a grid pattern on site. Wire mesh is faster to install for flatwork; rebar provides higher structural strength and is required for load-bearing elements like beams, columns, and foundations."
                        },
                        {
                            q: "When should I use wire mesh instead of rebar?",
                            a: "Wire mesh is best for large flatwork pours — driveways, sidewalks, patios, warehouse floors, and slabs-on-grade — where the primary goal is crack control rather than structural load transfer. Rebar is required for load-bearing elements, elevated slabs, footings, walls, and any application governed by a structural engineer's drawing."
                        },
                        {
                            q: "How do I calculate the weight of wire mesh for delivery?",
                            a: "Multiply the total gross mesh area (including lap and waste) by the weight per square foot of your chosen designation. For 6×6 W2.0×W2.0 at 0.29 lb/sq ft: 500 sq ft × 0.29 = 145 lbs. Our calculator performs this automatically for all standard and custom designations."
                        },
                        {
                            q: "Should I use a single or double layer of wire mesh?",
                            a: "A single layer placed at mid-depth is standard for slabs 4–5 inches thick. A double layer (top and bottom mat) is used for slabs 6 inches or thicker, elevated structural slabs, two-way slabs, and applications specified by a structural engineer. Double-layer installations roughly double the material cost."
                        },
                        {
                            q: "How much waste factor should I add for wire mesh?",
                            a: "Add 10% for simple rectangular or square slabs where cuts are minimal. Use 15% for L-shaped, T-shaped, or irregular slab footprints where more cutting is needed at edges and cut-outs. On very large rectangular pours using rolls, 5–8% may be sufficient."
                        },
                        {
                            q: "Is the wire mesh calculator free to use?",
                            a: "Yes. The Wire Mesh / WWF Calculator on Concrete Calculator Max is completely free to use with no registration, subscription, or hidden fees. You can calculate unlimited projects and export PDF reports at no cost."
                        },
                        {
                            q: "Can I print or save my wire mesh estimate?",
                            a: "Yes. After calculating, press the Print / Save button to open a print-optimized report showing all your inputs and results. In your browser's print dialog, select Save as PDF to keep a digital copy for purchase orders, permits, or contractor bids."
                        },
                        {
                            q: "What is the difference between a roll and a sheet of wire mesh?",
                            a: "Wire mesh rolls are large continuous pieces — typically 5 ft wide × 150 ft long (750 sq ft) — used for long sidewalks, large slabs, and commercial projects where continuous runs are efficient. Sheets are pre-cut panels — commonly 5×10 ft (50 sq ft) or 6×20 ft (120 sq ft) — easier to handle on smaller residential jobs and transport in a pickup truck."
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
