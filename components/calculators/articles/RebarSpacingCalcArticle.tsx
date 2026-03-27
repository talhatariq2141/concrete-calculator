// components/calculators/articles/RebarSpacingCalcArticle.tsx
"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function RebarSpacingCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* Introduction */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    How to Calculate Rebar Spacing for Concrete Structures
                </h2>
                <p className="mb-4 leading-relaxed">
                    The Rebar Spacing Calculator determines bar count, centre-to-centre spacing, and clear
                    spacing for reinforced concrete slabs, footings, walls, and beams — and checks all results
                    against ACI 318-19 code requirements automatically. It works bidirectionally: enter a
                    target spacing to find how many bars fit, or enter a bar count to find the resulting
                    spacing, along with a live slab diagram that redraws proportionally every time inputs change.
                </p>
                <p className="mb-4 leading-relaxed">
                    Rebar spacing errors are one of the most common causes of field inspection failures on
                    reinforced concrete projects. Bars placed too close violate ACI 318 §25.8.1 minimum clear
                    spacing, preventing proper concrete consolidation around the steel. Bars placed too far
                    apart violate ACI 318 §7.7.2.3 maximum spacing for slabs, leaving sections of concrete
                    under-reinforced. This calculator flags both violations instantly so contractors, engineers,
                    and inspectors can verify compliance before the pour.
                </p>
            </section>

            {/* Features Grid */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Rebar Spacing Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Bidirectional calculation",
                            desc: "Enter a target c-t-c spacing to get bar count, or enter a bar count to get the resulting spacing. Both directions produce the same full output: bar count, c-t-c, clear spacing, and ACI compliance."
                        },
                        {
                            title: "ACI 318-19 §25.8.1 minimum clear check",
                            desc: "Verifies that clear spacing (c-t-c minus bar diameter) meets the ACI minimum: greater than or equal to 1 inch, the bar diameter, and 4/3 times the maximum aggregate size."
                        },
                        {
                            title: "ACI 318-19 §7.7.2.3 maximum spacing check",
                            desc: "Verifies that c-t-c spacing does not exceed the ACI maximum for non-prestressed slabs: the smaller of 3 times the slab thickness or 18 inches."
                        },
                        {
                            title: "Live slab diagram",
                            desc: "An SVG cross-section redraws proportionally every time you calculate, showing the full span, concrete cover zones, and rebar positions at their correct relative spacing."
                        },
                        {
                            title: "Four project-type presets",
                            desc: "One-click presets for Slab/Patio, Strip Footing, Concrete Wall, and Beam load appropriate span, bar size, cover, and spacing defaults for each application."
                        },
                        {
                            title: "Concrete cover deduction",
                            desc: "Subtracts the concrete cover from both ends of the span before calculating bar positions — matching real-world reinforcing practice and ACI cover requirements."
                        },
                        {
                            title: "Total steel area output",
                            desc: "Shows the combined cross-sectional steel area (As = bar count × bar area) — the number structural engineers use to verify reinforcement adequacy against design requirements."
                        },
                        {
                            title: "Advanced aggregate size input",
                            desc: "In Advanced mode, enter the actual maximum aggregate size to get a more precise ACI §25.8.1 minimum clear spacing check using the 4/3 × aggregate criterion."
                        },
                        {
                            title: "Slab thickness for max spacing",
                            desc: "In Advanced mode, enter slab or member thickness to activate the full ACI §7.7.2.3 check: max c-t-c = min(3 × thickness, 18 inches)."
                        },
                        {
                            title: "Multi-unit support",
                            desc: "Enter span in feet, inches, or metres; cover in inches or feet; spacing in inches or feet. All conversions handled internally."
                        },
                        {
                            title: "Bar size reference table",
                            desc: "Built-in ASTM A615/A706 table showing diameter, area, ACI minimum clear, and maximum slab spacing for #3 through #8. Active bar is highlighted."
                        },
                        {
                            title: "Print / Save PDF",
                            desc: "Export a print-ready report with all inputs, results, and ACI compliance status for inspections, permit applications, or project records."
                        },
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
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
                    How to Use the Rebar Spacing Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select a project type preset — Slab/Patio, Strip Footing, Concrete Wall, or Beam — to load typical values, or enter your own.",
                        "Enter the span length: the total concrete dimension being reinforced. Select feet, inches, or metres.",
                        "Enter the concrete cover: the distance from the edge of the concrete to the centre of the first bar. Typically 2 inches for slabs, 3 inches for footings and ground-exposed members.",
                        "Select the bar size (#3 through #8). The info panel shows diameter, area, and common application.",
                        "Choose a calculation direction: 'Enter spacing → get bar count' if you know your target spacing; 'Enter bar count → get spacing' if you know how many bars you want.",
                        "Enter either the target c-t-c spacing or the number of bars, depending on direction selected.",
                        "Switch to Advanced mode to enter slab thickness (for the ACI §7.7.2.3 max spacing check) and maximum aggregate size (for a more precise §25.8.1 min clear check).",
                        "Press Calculate. Review bar count, c-t-c spacing, clear spacing, and total steel area.",
                        "Check the ACI 318 compliance panel — each check shows PASS or FAIL with the specific code section and required value.",
                        "Review the live slab diagram showing bars at their correct proportional positions across the span.",
                        "Use Print / Save to export a PDF for inspections, permit documentation, or site records.",
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
                    Formulas Used in the Rebar Spacing Calculator
                </h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Net span (after cover deduction)</strong>
                        Net Span = Total Span − (2 × Concrete Cover)<br />
                        <span className="text-white/60 text-sm">Cover is subtracted from both ends. This is the length available for bar placement.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Bar count from spacing (forward direction)</strong>
                        Bar Count = ⌊Net Span ÷ C-t-c Spacing⌋ + 1<br />
                        <span className="text-white/60 text-sm">Floor division gives the number of equal spacings; adding 1 gives the bar count including both end bars.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) C-t-c spacing from bar count (reverse direction)</strong>
                        C-t-c Spacing = Net Span ÷ (Bar Count − 1)<br />
                        <span className="text-white/60 text-sm">Bar count minus 1 gives the number of spaces between bars.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Clear spacing</strong>
                        Clear Spacing = C-t-c Spacing − Bar Diameter<br />
                        <span className="text-white/60 text-sm">The gap between the faces of adjacent bars. This is what inspectors measure in the field.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) ACI 318-19 §25.8.1 — Minimum clear spacing</strong>
                        Min Clear = max(1.0&quot;, bar diameter, 4/3 × max aggregate size)<br />
                        <span className="text-white/60 text-sm">The largest of these three values governs. Default: max(1.0&quot;, bar dia) for 3/4&quot; aggregate. Violation = clear spacing &lt; min clear.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) ACI 318-19 §7.7.2.3 — Maximum c-t-c spacing (slabs)</strong>
                        Max C-t-c = min(3 × slab thickness, 18&quot;)<br />
                        <span className="text-white/60 text-sm">Applies to non-prestressed one-way and two-way slabs. If slab thickness is not entered, the 18&quot; absolute limit is used. Violation = c-t-c spacing &gt; max c-t-c.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) Total steel area</strong>
                        As = Bar Count × Bar Area (in²)<br />
                        <span className="text-white/60 text-sm">Per ASTM A615/A706: #3 = 0.11 in², #4 = 0.20 in², #5 = 0.31 in², #6 = 0.44 in², #7 = 0.60 in², #8 = 0.79 in². Used to verify As provided vs. As required from structural design.</span>
                    </li>
                </ul>
            </section>

            {/* ACI Spacing Quick Reference */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    ACI 318 Rebar Spacing Quick Reference
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    Use this table as a starting point when selecting spacing. The ACI minimum clear spacing
                    governs how close bars can be; the ACI maximum c-t-c governs how far apart they can be
                    in slabs. Your actual design spacing must fall between these limits.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Bar size</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Diameter</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Area (in²)</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Min clear (ACI §25.8.1)</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Max c-t-c slabs</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium hidden sm:table-cell">Typical use</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { n:"3", dia:'3/8"',  area:"0.11", minClear:'≥ 1.0"',  maxCtc:'≤ 18"', use:"Temperature steel, ties, light slabs" },
                                { n:"4", dia:'1/2"',  area:"0.20", minClear:'≥ 1.0"',  maxCtc:'≤ 18"', use:"Driveways, patios, residential slabs" },
                                { n:"5", dia:'5/8"',  area:"0.31", minClear:'≥ 0.625"',maxCtc:'≤ 18"', use:"Structural slabs, beams, columns" },
                                { n:"6", dia:'3/4"',  area:"0.44", minClear:'≥ 0.75"', maxCtc:'≤ 18"', use:"Heavy beams, retaining walls" },
                                { n:"7", dia:'7/8"',  area:"0.60", minClear:'≥ 0.875"',maxCtc:'≤ 18"', use:"Foundations, large retaining walls" },
                                { n:"8", dia:'1"',    area:"0.79", minClear:'≥ 1.0"',  maxCtc:'≤ 18"', use:"Heavy columns, mat foundations" },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">#{row.n}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.dia}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.area}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.minClear}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.maxCtc}</td>
                                    <td className="py-3 px-4 text-slate-400 hidden sm:table-cell">{row.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-white/50">
                    Min clear per ACI 318-19 §25.8.1 assuming 3/4&quot; max aggregate. #5, #6, #7 min clear is governed by bar diameter (less than 1&quot;). Max c-t-c §7.7.2.3 assumes slab thickness ≥ 6&quot;. Always verify with your structural drawings.
                </p>
            </section>

            {/* Common spacing guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Typical Rebar Spacing by Project Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { project: "Residential driveway (4\" slab)",       bar: "#4", spacing: "12\" o.c. each way",  note: "Passenger vehicles" },
                        { project: "Patio / backyard slab (4\" slab)",      bar: "#4", spacing: "12–18\" o.c. each way", note: "Foot traffic only" },
                        { project: "Garage floor (4–6\" slab)",            bar: "#4", spacing: "12–16\" o.c. each way", note: "Light vehicle traffic" },
                        { project: "Sidewalk (4\" slab)",                   bar: "#3 or #4", spacing: "18\" o.c. (or WWF)", note: "Pedestrian load" },
                        { project: "Residential footing",                   bar: "#4 or #5", spacing: "2–3 bars long., ties at 18\"", note: "Continuous footing" },
                        { project: "Structural slab (6\"+ slab)",          bar: "#5", spacing: "12\" o.c. both ways, double mat", note: "Engineer to specify" },
                        { project: "Retaining wall (stem)",                bar: "#5 or #6", spacing: "12\" vertical, 18\" horizontal", note: "Lateral earth pressure" },
                        { project: "Beam stirrups",                        bar: "#3 or #4", spacing: "d/2 max (ACI §9.7.6)", note: "d = effective depth" },
                    ].map((row, i) => (
                        <div key={i} className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                            <p className="text-slate-200 font-medium text-sm">{row.project}</p>
                            <p className="text-teal-400 text-sm mt-1">{row.bar} @ {row.spacing}</p>
                            <p className="text-white/50 text-xs mt-0.5">{row.note}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-white/50">
                    Starting-point values only. Final layout must be designed by a licensed structural engineer
                    and comply with local code, project drawings, and applicable ACI standards.
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
                            q: "What is a rebar spacing calculator?",
                            a: "A rebar spacing calculator determines bar count, centre-to-centre spacing, and clear spacing for reinforced concrete members. It uses span length, concrete cover, and bar size to calculate how many bars fit at a given spacing — or what spacing results from a given bar count — and checks results against ACI 318 code requirements."
                        },
                        {
                            q: "How do I calculate rebar spacing?",
                            a: "Subtract the concrete cover from both ends of the span to get the net span. Divide the net span by the desired c-t-c spacing and add 1 to get bar count: bars = floor(net span ÷ spacing) + 1. To go the other way, divide the net span by (bar count − 1) to get c-t-c spacing. Clear spacing = c-t-c spacing − bar diameter."
                        },
                        {
                            q: "What is c-t-c spacing in rebar?",
                            a: "C-t-c stands for centre-to-centre — the distance measured from the centreline of one bar to the centreline of the adjacent bar. This is the standard way rebar spacing is specified on structural drawings and placement plans. Clear spacing is the gap between bar faces and equals c-t-c minus bar diameter."
                        },
                        {
                            q: "What is the minimum rebar spacing per ACI 318?",
                            a: "ACI 318-19 §25.8.1 requires the clear distance between parallel bars to be at least: 1 inch, the nominal bar diameter, or 4/3 times the nominal maximum coarse aggregate size — whichever is greatest. For most residential concrete with 3/4-inch aggregate, the minimum clear is 1 inch for #3 and #4 bar, and equals the bar diameter for #5 through #7."
                        },
                        {
                            q: "What is the maximum rebar spacing for concrete slabs?",
                            a: "ACI 318-19 §7.7.2.3 limits c-t-c spacing for non-prestressed slabs to the smaller of 3 times the slab thickness or 18 inches. For a 4-inch slab the maximum is min(12 inches, 18 inches) = 12 inches. For a 6-inch slab it is min(18 inches, 18 inches) = 18 inches. Our calculator applies this check automatically when slab thickness is entered."
                        },
                        {
                            q: "Why does minimum clear spacing matter?",
                            a: "Insufficient clear spacing prevents concrete from flowing and consolidating properly between bars, creating voids, honeycombing, and bond failure. ACI 318 sets the minimum clear to ensure fresh concrete can pass between bars without the aggregate getting trapped. This is why the minimum is tied to aggregate size — larger aggregate needs more room."
                        },
                        {
                            q: "What is concrete cover for rebar?",
                            a: "Concrete cover is the distance from the outer face of the concrete to the nearest edge of the rebar. ACI 318-19 Table 20.6.1.3 requires different cover for different exposure conditions: 3/4 inch for concrete cast in forms not exposed to weather (#5 and smaller), 1.5 inches for weather exposure, and 3 inches for concrete cast against ground. Cover protects steel from corrosion and provides fire resistance."
                        },
                        {
                            q: "What is the difference between clear spacing and c-t-c spacing?",
                            a: "C-t-c spacing (centre-to-centre) is measured from bar centreline to bar centreline. Clear spacing is measured from the face of one bar to the face of the adjacent bar. Clear spacing = c-t-c spacing − bar diameter. ACI code limits are stated in terms of clear spacing; structural drawings typically specify c-t-c spacing. Our calculator shows both."
                        },
                        {
                            q: "How do I check rebar spacing for ACI 318 compliance?",
                            a: "Check three things: (1) clear spacing ≥ max(1 inch, bar diameter, 4/3 × max aggregate size) per §25.8.1; (2) for slabs, c-t-c spacing ≤ min(3 × slab thickness, 18 inches) per §7.7.2.3; (3) concrete cover meets Table 20.6.1.3 requirements for your exposure condition. Our calculator automates checks 1 and 2."
                        },
                        {
                            q: "What rebar spacing should I use for a 20-foot concrete driveway?",
                            a: "For a 20-foot residential driveway with #4 bar and 2-inch cover, a 12-inch c-t-c spacing gives approximately 19 bars across a 4-inch slab and passes all ACI 318 checks. Enter your exact dimensions in the calculator to confirm bar count and compliance before ordering."
                        },
                        {
                            q: "Can I use this calculator for both slabs and footings?",
                            a: "Yes. Use the Slab/Patio preset for flatwork and the Strip Footing preset for continuous footings. Change the cover to 3 inches for footings in contact with soil. The ACI compliance checks apply to both applications, though footing design often involves additional requirements from ACI 318 Chapter 13."
                        },
                        {
                            q: "What is total steel area and why does it matter?",
                            a: "Total steel area (As) is the sum of cross-sectional areas of all bars: bar count × individual bar area. Structural engineers use As to verify that the reinforcement provided meets or exceeds the As required from flexural, shear, and temperature/shrinkage calculations. Our calculator shows As so you can compare it to your structural drawing requirements."
                        },
                        {
                            q: "Is the rebar spacing calculator free?",
                            a: "Yes. The Rebar Spacing Calculator on Concrete Calculator Max is completely free to use with no registration, subscription, or hidden fees. Both calculation directions — spacing to bars and bars to spacing — and all ACI 318 compliance checks are available at no cost."
                        },
                        {
                            q: "Can I print or save my rebar spacing results?",
                            a: "Yes. After calculating, press Print / Save to open a print-optimized report with all inputs, results, and ACI compliance status. In your browser's print dialog, choose Save as PDF to keep a digital copy for inspections, permit applications, or site records."
                        },
                        {
                            q: "Does the rebar spacing calculator replace a structural engineer?",
                            a: "No. This calculator checks spacing against ACI 318 dimensional limits but does not perform structural design calculations. It cannot determine whether the chosen bar size and spacing provide adequate strength for your specific loads, soil conditions, or structural system. All reinforcement must be designed and sealed by a licensed structural engineer for load-bearing applications."
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
