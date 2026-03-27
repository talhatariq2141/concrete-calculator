// components/calculators/articles/RebarWeightCalcArticle.tsx
"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function RebarWeightCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* Introduction */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    How to Calculate Rebar Weight for Concrete Projects
                </h2>
                <p className="mb-4 leading-relaxed">
                    The Rebar Weight Calculator is a procurement and logistics tool that converts rebar linear footage
                    to weight in pounds, US tons, and kilograms — and can also work in reverse, converting a known
                    steel tonnage specification back to the equivalent linear footage and bar count. It uses ASTM A615
                    and A706 published unit weights for deformed bars #3 through #10, giving accurate results that
                    match supplier invoices and structural engineer specifications.
                </p>
                <p className="mb-4 leading-relaxed">
                    This calculator solves three distinct problems that contractors, estimators, and engineers
                    encounter on every reinforced concrete project: converting a takeoff footage list to a delivery
                    weight for freight planning, combining multiple bar sizes into a single total tonnage for
                    commercial procurement, and reverse-calculating footage from a weight-based specification on
                    structural drawings. All three modes are available in one tool, with optional per-ton steel
                    pricing for full cost estimation.
                </p>
            </section>

            {/* Features Grid */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Rebar Weight Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Three calculation modes",
                            desc: "Single bar size (footage → weight), Multi-bar mix (up to 6 sizes → combined tonnage), and Target weight (weight → footage reverse lookup) — all in one calculator."
                        },
                        {
                            title: "ASTM A615 / A706 weight table",
                            desc: "Built-in unit weights for #3 through #10 deformed bars per ASTM A615/A706, showing diameter, cross-sectional area, lb/ft, and kg/m. Active bars are highlighted."
                        },
                        {
                            title: "Multi-bar mix with percentage breakdown",
                            desc: "Enter up to 6 different bar sizes with individual footage, stock length, and waste. See each bar's weight as a percentage of total steel — useful for procurement and logistics."
                        },
                        {
                            title: "Reverse weight-to-footage calculator",
                            desc: "Enter a target weight from a structural spec, delivery manifest, or budget, and the calculator tells you the equivalent footage and bars to order."
                        },
                        {
                            title: "Commercial per-ton pricing",
                            desc: "Steel is quoted per US ton on commercial projects. Enter a price per ton and the calculator produces material cost and grand total — matching how steel suppliers invoice."
                        },
                        {
                            title: "Bars to order output",
                            desc: "Enter your stock bar length (typically 20 ft) and the calculator rounds up to the nearest whole bar, giving you the exact purchase quantity for your order."
                        },
                        {
                            title: "Dual unit support — imperial and metric",
                            desc: "Enter footage in feet or metres; enter weight targets in lbs, US tons, or kg. All conversions are handled internally using ASTM standard values."
                        },
                        {
                            title: "Waste factor per bar type",
                            desc: "Apply a different waste percentage to each bar size in multi-bar mode — useful when some sizes have longer laps or more complex cut patterns than others."
                        },
                        {
                            title: "ASTM A615 plausibility warning",
                            desc: "Warns when entered footage exceeds 50,000 linear feet, which often indicates a unit entry error (metres entered as feet). Prevents costly over-ordering mistakes."
                        },
                        {
                            title: "Project-type presets",
                            desc: "One-click presets for Residential, Commercial Mix, Bridge/Civil, and Target Weight load appropriate bar sizes, footage quantities, and pricing defaults."
                        },
                        {
                            title: "Kg/m output for metric projects",
                            desc: "All results include kilograms and kg/m values — essential for international projects, metric structural drawings, and suppliers quoting in SI units."
                        },
                        {
                            title: "Print / Save PDF",
                            desc: "Export a print-ready report of all inputs and results for purchase orders, RFQs, project bids, and site documentation."
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
                    How to Use the Rebar Weight Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select a project type preset — Residential, Commercial Mix, Bridge/Civil, or Target Weight — to load sensible defaults, or enter your own values.",
                        "Choose a calculation mode: Single bar size to convert one bar's footage to weight; Multi-bar mix for projects with multiple bar types; Target weight for reverse lookup from a spec or delivery quantity.",
                        "For Single mode: select your bar size (#3–#10), enter total linear footage, and set a waste percentage (10% is typical for most projects).",
                        "For Multi-bar mix: add a row for each bar size. Enter the net footage, stock bar length, and waste percentage for each. Add up to 6 bar types.",
                        "For Target weight mode: enter the weight from your structural spec or delivery manifest and select the bar size. Choose the unit — lbs, US tons, or kg.",
                        "Enter the stock bar length (default 20 ft) to get the exact number of bars to purchase. This rounds up to the nearest whole bar.",
                        "Optionally enter a price per US ton to generate a material cost estimate. Add a delivery or misc cost for a complete project total.",
                        "Press Calculate. Review the weight in lbs, US tons, and kg, bars to order, and the ASTM A615/A706 reference table with your active bar highlighted.",
                        "In multi-bar mode, review the per-bar breakdown showing each size's weight as a percentage of total steel — useful for procurement and logistics.",
                        "Use Print / Save to export a PDF of all inputs and results for RFQs, purchase orders, or project records.",
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
                    Formulas Used in the Rebar Weight Calculator
                </h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Gross footage (with waste)</strong>
                        Gross LF = Net LF × (1 + Waste % ÷ 100)<br />
                        <span className="text-white/60 text-sm">Waste covers lap splices, hook extensions, and off-cut trim. Use 10% for standard layouts; 15% for complex or heavily lapped designs.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Weight from footage</strong>
                        Weight (lbs) = Gross LF × Unit Weight (lb/ft)<br />
                        Weight (US tons) = Weight (lbs) ÷ 2,000<br />
                        Weight (kg) = Weight (lbs) × 0.453592<br />
                        <span className="text-white/60 text-sm">Unit weights per ASTM A615/A706. Example: #5 bar = 1.043 lb/ft, so 500 ft = 521.5 lbs = 0.261 US tons.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Bars to order</strong>
                        Bars = ⌈Gross LF ÷ Stock Bar Length⌉<br />
                        <span className="text-white/60 text-sm">Always rounded up to the next whole bar. A 20 ft stock bar is the most common standard length in North America.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Multi-bar total weight</strong>
                        Total Weight = Σ (Gross LF₍ᵢ₎ × Unit Weight₍ᵢ₎) for each bar size i<br />
                        <span className="text-white/60 text-sm">Each bar size uses its own gross footage (with its own waste factor) and its own unit weight from the ASTM table.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) Reverse calculation (target weight → footage)</strong>
                        Linear Footage = Target Weight (lbs) ÷ Unit Weight (lb/ft)<br />
                        <span className="text-white/60 text-sm">Converts a structural tonnage specification or delivery manifest weight back to the equivalent footage. Then rounds up to whole bars using stock length.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) Unit conversions</strong>
                        1 US ton = 2,000 lbs<br />
                        1 lb = 0.453592 kg<br />
                        1 metre = 3.28084 ft<br />
                        <span className="text-white/60 text-sm">All metric inputs are converted to imperial internally. Output is shown in all three weight units simultaneously.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) Cost estimate</strong>
                        Material Cost = Total Weight (US tons) × Price per Ton<br />
                        Grand Total = Material Cost + Delivery / Misc Cost<br />
                        <span className="text-white/60 text-sm">Commercial rebar pricing is always quoted per US ton, not per bar or per linear foot. This matches standard steel supplier invoicing practice.</span>
                    </li>
                </ul>
            </section>

            {/* ASTM A615 / A706 Reference */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    ASTM A615 / A706 Bar Weight Reference
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    All rebar weight values in this calculator are based on ASTM A615 (carbon steel) and
                    ASTM A706 (low-alloy steel for weldability) published unit weights. Both standards specify
                    identical theoretical unit weights for each bar size — the difference between A615 and A706
                    lies in chemistry and mechanical properties, not weight. The table below covers #3 through #10,
                    which accounts for the overwhelming majority of concrete reinforcement applications.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Bar size</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Diameter</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Area (in²)</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">lb / ft</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">kg / m</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium hidden sm:table-cell">Typical application</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { n:"3",  dia:'0.375"', area:"0.11", lbft:"0.376", kgm:"0.560", use:"Ties, temperature steel, light flatwork" },
                                { n:"4",  dia:'0.500"', area:"0.20", lbft:"0.668", kgm:"0.994", use:"Driveways, patios, residential footings" },
                                { n:"5",  dia:'0.625"', area:"0.31", lbft:"1.043", kgm:"1.552", use:"Structural slabs, beams, columns" },
                                { n:"6",  dia:'0.750"', area:"0.44", lbft:"1.502", kgm:"2.235", use:"Heavy beams, retaining walls" },
                                { n:"7",  dia:'0.875"', area:"0.60", lbft:"2.044", kgm:"3.042", use:"Foundations, large retaining walls" },
                                { n:"8",  dia:'1.000"', area:"0.79", lbft:"2.670", kgm:"3.973", use:"Heavy columns, mat foundations" },
                                { n:"9",  dia:'1.128"', area:"1.00", lbft:"3.400", kgm:"5.060", use:"Bridge decks, transfer slabs" },
                                { n:"10", dia:'1.270"', area:"1.27", lbft:"4.303", kgm:"6.404", use:"High-rise columns, heavy members" },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">#{row.n}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.dia}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.area}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.lbft}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.kgm}</td>
                                    <td className="py-3 px-4 text-slate-400 hidden sm:table-cell">{row.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-white/50">
                    Weights are theoretical per ASTM A615/A706. Actual mill weights may vary ±3.5% for individual bars
                    and ±3.5% for lots per ASTM tolerances. Always verify with certified mill test reports for structural applications.
                </p>
            </section>

            {/* Quick conversion guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Rebar Weight Quick Reference — Common Quantities
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    Use this table for quick estimates of common order quantities. Values include no waste factor —
                    add 10–15% to all figures for a real procurement order.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { qty: "100 ft of #3",   lbs: "37.6 lbs",   tons: "0.019 tons",  note: "Typical tie quantity, small footing" },
                        { qty: "100 ft of #4",   lbs: "66.8 lbs",   tons: "0.033 tons",  note: "Small residential driveway section" },
                        { qty: "500 ft of #4",   lbs: "334 lbs",    tons: "0.167 tons",  note: "Typical residential driveway" },
                        { qty: "1,000 ft of #5", lbs: "1,043 lbs",  tons: "0.522 tons",  note: "Medium structural slab" },
                        { qty: "1 ton of #4",    lbs: "2,000 lbs",  tons: "1.000 ton",   note: "= 2,994 linear feet of #4" },
                        { qty: "1 ton of #5",    lbs: "2,000 lbs",  tons: "1.000 ton",   note: "= 1,918 linear feet of #5" },
                        { qty: "1 ton of #6",    lbs: "2,000 lbs",  tons: "1.000 ton",   note: "= 1,332 linear feet of #6" },
                        { qty: "1 ton of #8",    lbs: "2,000 lbs",  tons: "1.000 ton",   note: "= 749 linear feet of #8" },
                    ].map((row, i) => (
                        <div key={i} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                            <p className="text-slate-200 font-medium text-sm">{row.qty}</p>
                            <p className="text-teal-400 text-sm mt-1">{row.lbs} &nbsp;·&nbsp; {row.tons}</p>
                            <p className="text-white/50 text-xs mt-0.5">{row.note}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-white/50">
                    Values based on ASTM A615/A706 unit weights with no waste. Always add 10–15% for procurement orders.
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
                            q: "What is a rebar weight calculator?",
                            a: "A rebar weight calculator converts rebar linear footage to weight in lbs, US tons, and kg using published ASTM A615/A706 unit weights. It can also reverse the calculation — converting a target weight from a structural spec or delivery manifest back to the equivalent footage and bar count."
                        },
                        {
                            q: "How much does rebar weigh per foot?",
                            a: "Rebar weight per foot depends on bar size per ASTM A615/A706: #3 = 0.376 lb/ft, #4 = 0.668 lb/ft, #5 = 1.043 lb/ft, #6 = 1.502 lb/ft, #7 = 2.044 lb/ft, #8 = 2.670 lb/ft, #9 = 3.400 lb/ft, #10 = 4.303 lb/ft. These are theoretical unit weights; actual mill weights may vary ±3.5%."
                        },
                        {
                            q: "How do I convert rebar linear footage to tons?",
                            a: "Multiply total linear footage by the unit weight in lb/ft for your bar size, then divide by 2,000 to convert to US tons. For example: 1,000 ft of #5 bar × 1.043 lb/ft = 1,043 lbs ÷ 2,000 = 0.522 US tons. Our calculator performs this conversion automatically for all bar sizes."
                        },
                        {
                            q: "How do I convert rebar weight to linear footage?",
                            a: "Divide the weight in lbs by the unit weight in lb/ft for your bar size. For example: 2,000 lbs of #5 bar ÷ 1.043 lb/ft = 1,918 linear feet. This is the reverse calculation mode in our calculator — enter the weight in lbs, tons, or kg and select a bar size to get the equivalent footage."
                        },
                        {
                            q: "What is the difference between ASTM A615 and ASTM A706 rebar?",
                            a: "Both standards specify identical unit weights for each bar size, so weight calculations are the same. The difference is in steel chemistry and mechanical properties: A615 is standard carbon-steel rebar used in most applications; A706 is a low-alloy steel with controlled chemistry for better weldability and ductility, required in seismic zones and applications where rebar must be welded."
                        },
                        {
                            q: "Why is rebar priced per ton, not per bar?",
                            a: "Steel commodities — including rebar — are traded and priced by weight globally because weight is the fundamental measure of material content and production cost. A ton of #5 bar and a ton of #8 bar contain the same mass of steel, making per-ton pricing consistent across bar sizes. Our calculator converts your footage to tonnage so you can apply supplier per-ton quotes directly."
                        },
                        {
                            q: "How many linear feet are in a ton of rebar?",
                            a: "It depends on bar size: #3 = 5,319 ft/ton, #4 = 2,994 ft/ton, #5 = 1,918 ft/ton, #6 = 1,331 ft/ton, #7 = 979 ft/ton, #8 = 749 ft/ton, #9 = 588 ft/ton, #10 = 465 ft/ton. Use the Target Weight mode in our calculator to reverse-calculate footage from any tonnage."
                        },
                        {
                            q: "What waste percentage should I use for rebar weight calculations?",
                            a: "Use 10% for simple rectangular layouts with standard laps. Use 15% for complex layouts with many bends, hooks, or irregular shapes. The waste factor covers lap splice lengths (typically 40–60 bar diameters), hooks and bends, and off-cut trim from cutting to length. Waste increases gross footage, which increases the total weight and cost."
                        },
                        {
                            q: "Can I calculate the weight of multiple bar sizes at once?",
                            a: "Yes. Switch to Multi-bar mix mode and add a row for each bar size. Enter the footage, stock length, and waste for each. The calculator produces individual weights per bar size — shown as a percentage of total steel — plus a combined total weight, tonnage, and bars to order."
                        },
                        {
                            q: "What is a standard stock bar length for rebar?",
                            a: "In North America, 20-foot bars (6.1 m) are the most common standard stock length for #3 through #8 bars. Some suppliers also stock 30-foot (9.1 m) and 40-foot (12.2 m) lengths for larger projects. Our calculator lets you enter any stock length; it divides the gross footage by your stock length and rounds up to the nearest whole bar."
                        },
                        {
                            q: "How accurate is the ASTM rebar weight table?",
                            a: "ASTM A615/A706 theoretical unit weights are highly accurate for estimation purposes. However, ASTM allows a ±3.5% weight tolerance per bar and ±3.5% per lot. This means a 1,000-lb order may actually weigh 965–1,035 lbs. For structural and certified-weight applications, always verify with mill test reports from your supplier."
                        },
                        {
                            q: "Can I calculate rebar weight in metric units?",
                            a: "Yes. You can enter dimensions in metres and receive weight output in kilograms and kg/m values alongside imperial results. The Target Weight mode accepts weight in kg as well as lbs and US tons. All conversions use standard ASTM values: 1 lb = 0.453592 kg, 1 metre = 3.28084 ft."
                        },
                        {
                            q: "Is the rebar weight calculator free?",
                            a: "Yes. The Rebar Weight Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees. All three calculation modes — Single bar, Multi-bar mix, and Target weight reverse — are available at no cost."
                        },
                        {
                            q: "Can I print or save my rebar weight estimate?",
                            a: "Yes. After calculating, press the Print / Save button to open a print-optimized report with all inputs and results. In your browser's print dialog, choose Save as PDF to keep a digital copy for purchase orders, RFQs, supplier quotes, or project records."
                        },
                        {
                            q: "What is the rebar weight for a 20-foot bar?",
                            a: "It depends on bar size: #3 = 7.5 lbs, #4 = 13.4 lbs, #5 = 20.9 lbs, #6 = 30.0 lbs, #7 = 40.9 lbs, #8 = 53.4 lbs, #9 = 68.0 lbs, #10 = 86.1 lbs. These are the weights of a single standard 20-foot stock bar per ASTM A615/A706."
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
