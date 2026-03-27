// components/calculators/articles/ConcreteSidewalkCalcArticle.tsx
"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ConcreteSidewalkCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* ── Introduction ── */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    How to Calculate Concrete for a Sidewalk
                </h2>
                <p className="mb-4 leading-relaxed">
                    The Concrete Sidewalk Calculator estimates the cubic yards, cubic feet, and cubic metres
                    of concrete needed for a new sidewalk or walkway, along with the number of 60-lb and
                    80-lb pre-mixed bags as an alternative for small pours. It calculates control joint count,
                    expansion joint count, and slab weight — and checks your control joint spacing against
                    ACPA (American Concrete Pavement Association) recommendations automatically. A live
                    plan-view joint diagram draws the joint pattern at true proportions every time you calculate.
                </p>
                <p className="mb-4 leading-relaxed">
                    Homeowners, contractors, and municipal crews use this calculator to turn three simple
                    dimensions — length, width, and thickness — into a complete material takeoff before the
                    pour. Getting the volume right prevents costly short-loads of ready-mix concrete, and
                    the joint planning section ensures the sidewalk cracks where it is supposed to crack
                    rather than at random.
                </p>
            </section>

            {/* ── Features Grid ── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Concrete Sidewalk Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Concrete volume in three units",
                            desc: "Outputs cubic yards (for ready-mix ordering), cubic feet (for volume verification), and cubic metres (for metric projects) simultaneously."
                        },
                        {
                            title: "Pre-mixed bag estimates",
                            desc: "Calculates 60-lb and 80-lb bag counts based on standard ACI 211 yields (0.45 ft³ and 0.60 ft³ per bag) — useful for small residential pours under 1 cubic yard."
                        },
                        {
                            title: "Control joint count and spacing",
                            desc: "Computes the number of interior control joints based on your target spacing, and warns if the spacing exceeds the ACPA maximum of 1.5× slab width or 15 ft."
                        },
                        {
                            title: "Expansion joint count",
                            desc: "Calculates interior expansion joints based on your spacing input. Expansion joints use compressible filler and are required every 20–30 ft and at all abutting structures."
                        },
                        {
                            title: "Plan-view joint diagram",
                            desc: "A proportional top-down SVG diagram of the sidewalk shows teal dashed control joints and orange solid expansion joints at their calculated positions — unique to this calculator."
                        },
                        {
                            title: "ACPA compliance warning",
                            desc: "Automatically flags control joint spacings wider than min(1.5 × slab width, 15 ft), the ACPA threshold above which uncontrolled cracking risk increases significantly."
                        },
                        {
                            title: "Three project-type presets",
                            desc: "One-click presets for Residential (4\" × 4 ft), Municipal/ADA (6\" × 5 ft), and Garden Walkway (4\" × 3 ft) load appropriate dimensions and joint spacings."
                        },
                        {
                            title: "Waste / overpour factor",
                            desc: "Adds a configurable percentage (default 10%) to net volume to account for subbase irregularities, spillage during placement, and form overfill."
                        },
                        {
                            title: "Slab weight output",
                            desc: "Calculates gross slab weight using the standard 150 lb/ft³ density of normal-weight concrete — useful for structural loading checks and delivery logistics."
                        },
                        {
                            title: "Cost estimation (Advanced mode)",
                            desc: "Enter price per cubic yard, finishing/labour cost, and delivery fees in Advanced mode to generate a full project cost estimate with grand total."
                        },
                        {
                            title: "Multi-unit input support",
                            desc: "Length and width accept feet, inches, or metres. Thickness accepts inches or feet. Joint spacings accept feet or inches. All conversions are handled internally."
                        },
                        {
                            title: "Print / Save PDF",
                            desc: "Export a print-ready report with all inputs, results, and the ACPA compliance status for purchase orders, permits, and contractor bid packages."
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

            {/* ── How to Use ── */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Concrete Sidewalk Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select a project type preset — Residential, Municipal/ADA, or Garden Walkway — to load sensible defaults, or enter your own dimensions from scratch.",
                        "Enter the sidewalk length (the longest dimension along the path direction). Choose feet, inches, or metres.",
                        "Enter the sidewalk width (perpendicular to travel). ADA-accessible paths require at least 36 inches of clear width; 4 feet is standard for residential.",
                        "Enter the slab thickness. Use 4 inches for pedestrian-only sidewalks; 6 inches for municipal, ADA, or heavy-use paths.",
                        "Set the waste factor (default 10%) to account for subbase irregularities, spillage, and overfill. Use 15% for curved or uneven paths.",
                        "Enter your control joint spacing. Per ACPA guidance, this should be 1× to 1.5× the slab width, with an absolute maximum of 15 ft. The calculator warns if you exceed this.",
                        "Enter your expansion joint spacing. Expansion joints should be placed every 20–30 ft along the run and at every structure (walls, steps, curbs) the sidewalk abuts.",
                        "Switch to Advanced mode to enter concrete price per cubic yard, finishing cost, and delivery fees for a complete project cost estimate.",
                        "Press Calculate. Review cubic yards, bags, weight, joint counts, and the ACPA compliance status.",
                        "Check the plan-view joint diagram — it shows the entire sidewalk top-down with teal dashed control joints and orange solid expansion joints at their proportional positions.",
                        "Use Print / Save to export a PDF for purchase orders, permits, or contractor bid documentation.",
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

            {/* ── Formulas ── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Formulas Used in the Concrete Sidewalk Calculator
                </h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Net concrete volume</strong>
                        Net Volume (ft³) = Length (ft) × Width (ft) × Thickness (ft)<br />
                        <span className="text-white/60 text-sm">All dimensions converted to feet before multiplication. Thickness is entered in inches and divided by 12.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Gross volume with waste factor</strong>
                        Gross Volume (ft³) = Net Volume × (1 + Waste % ÷ 100)<br />
                        <span className="text-white/60 text-sm">The waste factor covers subbase irregularities, spills during placement, and form overfill. 10% is standard; 15% for curved or sloped paths.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Volume unit conversions</strong>
                        Cubic yards = Gross Volume (ft³) ÷ 27<br />
                        Cubic metres = Gross Volume (ft³) × 0.0283168<br />
                        <span className="text-white/60 text-sm">Ready-mix concrete is ordered in cubic yards in North America. Always round up to the nearest 1/4 yard when ordering.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Pre-mixed bag counts</strong>
                        60-lb bags = ⌈Gross Volume (ft³) ÷ 0.45⌉<br />
                        80-lb bags = ⌈Gross Volume (ft³) ÷ 0.60⌉<br />
                        <span className="text-white/60 text-sm">Yields per ACI 211: 60-lb = 0.45 ft³; 80-lb = 0.60 ft³. Always rounded up to a whole bag. Bags become uneconomical above about 1 yd³.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) Slab weight</strong>
                        Weight (lbs) = Gross Volume (ft³) × 150 lb/ft³<br />
                        <span className="text-white/60 text-sm">Standard normal-weight concrete density is 150 lb/ft³ (approximately 2,400 kg/m³). Includes water weight after curing is complete.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) Control joint count</strong>
                        Control Joints = ⌈Length ÷ Spacing⌉ − 1<br />
                        <span className="text-white/60 text-sm">Counts interior joints only (not the slab ends). A 50 ft sidewalk with 5 ft spacing has 9 interior control joints.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) ACPA control joint maximum check</strong>
                        ACPA Max Spacing = min(1.5 × Slab Width, 15 ft)<br />
                        Warning fires when: Control Joint Spacing &gt; ACPA Max Spacing<br />
                        <span className="text-white/60 text-sm">Per ACPA (American Concrete Pavement Association) guidance. Wider spacing significantly increases the probability of uncontrolled mid-panel cracking.</span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">8) Cost estimate (Advanced)</strong>
                        Material Cost = Cubic Yards × Price per Yard<br />
                        Grand Total = Material Cost + Finishing Cost + Delivery Cost<br />
                        <span className="text-white/60 text-sm">Concrete is priced per cubic yard. Ready-mix pricing varies by region, mix design, and delivery distance.</span>
                    </li>
                </ul>
            </section>

            {/* ── Thickness & joint guide ── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Sidewalk Thickness, Strength, and Joint Spacing Guide
                </h2>
                <p className="mb-4 text-slate-400 leading-relaxed">
                    The table below summarises common sidewalk specifications. Concrete strength (PSI) and
                    joint spacing recommendations follow ACI 330R-01 (Guide for Design and Construction of
                    Concrete Parking Lots) and ACPA published guidance. Always verify with your local
                    municipality, which may have specific requirements for right-of-way sidewalks.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Application</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Thickness</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Min PSI</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Control joint max</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium hidden sm:table-cell">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { app: "Residential foot traffic", t: '4"',   psi: "2,500–3,000", ctrl: "6 ft (1.5× width)",   notes: "Standard home sidewalk" },
                                { app: "Garden / backyard walkway",t: '4"',   psi: "2,500",       ctrl: "4.5 ft (1.5× width)", notes: "3 ft wide path" },
                                { app: "Shared / light access",    t: '5"',   psi: "3,000",       ctrl: "7.5 ft (1.5× width)", notes: "Bikes, carts, strollers" },
                                { app: "Municipal / ADA",          t: '6"',   psi: "3,500–4,000", ctrl: "7.5–9 ft",            notes: "36\" min clear width" },
                                { app: "Service / utility access",  t: '6–8"', psi: "4,000",       ctrl: "8–10 ft",             notes: "Light vehicle crossings" },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 text-slate-200 font-medium">{row.app}</td>
                                    <td className="py-3 px-4 text-teal-400 font-semibold">{row.t}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.psi}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.ctrl}</td>
                                    <td className="py-3 px-4 text-slate-400 hidden sm:table-cell">{row.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-white/50">
                    Control joint depth = 1/4 of slab thickness minimum. Saw-cutting must occur within 4–12 hours of placement on warm days. Tooled joints are formed during finishing. Expansion joint filler: 1/2&quot; pre-formed asphalt or cork board. Local codes may require air-entrainment (5–7%) in freeze-thaw climates.
                </p>
            </section>

            {/* ── FAQ ── */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: "How many cubic yards of concrete do I need for a sidewalk?",
                            a: "Multiply length × width × thickness (all in feet) and divide by 27 to get cubic yards. For a 50 ft × 4 ft × 4-inch sidewalk: 50 × 4 × 0.333 = 66.6 ft³ ÷ 27 = 2.47 yd³. Add 10% waste: 2.72 yd³. Our calculator handles this automatically in all units."
                        },
                        {
                            q: "How thick should a concrete sidewalk be?",
                            a: "Residential sidewalks for pedestrian traffic only are typically 4 inches thick. Municipal and ADA-accessible sidewalks are usually 6 inches. Sidewalks that cross driveways or receive occasional vehicle traffic should be 6 inches minimum. Increase to 8 inches for light vehicle crossings that occur frequently."
                        },
                        {
                            q: "What PSI concrete should I use for a sidewalk?",
                            a: "2,500–3,000 PSI is the minimum for residential sidewalks with foot traffic only. Use 3,500–4,000 PSI for municipal, ADA, or heavy-use paths. In freeze-thaw climates (USDA Zone 4 and colder), specify air-entrained concrete with 5–7% air content to resist freeze-thaw spalling."
                        },
                        {
                            q: "How far apart should control joints be in a concrete sidewalk?",
                            a: "The American Concrete Pavement Association (ACPA) recommends control joint spacing of 1× to 1.5× the slab width, with an absolute maximum of 15 feet. For a 4-foot-wide sidewalk, control joints should be placed every 4–6 feet. Our calculator warns you if your spacing exceeds this limit."
                        },
                        {
                            q: "What is the difference between a control joint and an expansion joint?",
                            a: "A control joint (contraction joint) is a tooled groove or saw cut to a depth of 1/4 of the slab thickness. It creates a weak plane that guides the inevitable shrinkage crack to a controlled location. An expansion joint is a full-depth gap filled with compressible material (asphalt board, cork, or foam) that allows the slab to expand without pushing against adjacent structures. Expansion joints are required wherever the sidewalk meets walls, steps, or curbs."
                        },
                        {
                            q: "How deep should control joints be cut in a concrete sidewalk?",
                            a: "Control joints must be at least 1/4 of the slab thickness deep. For a 4-inch slab that is 1 inch. For a 6-inch slab that is 1.5 inches. Tooled joints are formed during finishing while the concrete is still plastic; saw-cut joints should be made within 4–12 hours of placing on warm days, or 12–24 hours on cool days, before random cracking occurs."
                        },
                        {
                            q: "How many bags of concrete do I need for a sidewalk?",
                            a: "Divide the total volume in cubic feet by the bag yield: 0.45 ft³ for a 60-lb bag, 0.60 ft³ for an 80-lb bag. For a 2.72 yd³ pour (73.4 ft³): 73.4 ÷ 0.45 = 163 sixty-pound bags, or 73.4 ÷ 0.60 = 123 eighty-pound bags. For any project larger than 1 yd³, ready-mix is more economical and practical."
                        },
                        {
                            q: "Should I use ready-mix or bags for a sidewalk?",
                            a: "For sidewalks longer than 15–20 feet, ready-mix delivered by a transit truck is almost always more economical and produces better, more consistent concrete. Bags are practical for very small patches or repairs under 0.5 yd³. The labour cost of mixing dozens of bags often exceeds the delivered ready-mix price for anything larger."
                        },
                        {
                            q: "What is the minimum width for an ADA-accessible sidewalk?",
                            a: "ADA standards require a minimum clear width of 36 inches (3 feet) for accessible routes. However, wherever the accessible route is a sidewalk adjacent to the street, most municipalities require 48 inches (4 feet) minimum clear width. Passing spaces for two wheelchairs require 60 inches (5 feet) every 200 feet along the route."
                        },
                        {
                            q: "How much does it cost to pour a concrete sidewalk?",
                            a: "Concrete sidewalk cost in the US typically ranges from $6 to $12 per square foot installed, covering concrete material, forming, placement, finishing, and curing. A 50 ft × 4 ft sidewalk (200 sq ft) typically costs $1,200 to $2,400. Ready-mix concrete alone is $130–$180 per cubic yard depending on region and mix design. Use the Advanced mode in our calculator to build a project-specific estimate."
                        },
                        {
                            q: "How do I calculate the amount of concrete for a sidewalk in metric?",
                            a: "Multiply length × width × thickness (all in metres) to get cubic metres directly. For example: 15 m × 1.2 m × 0.1 m = 1.8 m³. Add 10% waste: 1.98 m³. Our calculator accepts metre inputs and shows the result in cubic metres alongside cubic yards and cubic feet."
                        },
                        {
                            q: "What is a waste factor for concrete and why do I need it?",
                            a: "Concrete waste (or overpour factor) accounts for volume lost due to subbase irregularities, concrete splashed or spilled during placement, form deflection under pressure, and the unavoidable fact that fresh concrete is ordered in whole or half yard increments. 10% is the industry standard; use 15% for curved sidewalks, sloped sites, or irregular subbase conditions."
                        },
                        {
                            q: "Is the concrete sidewalk calculator free?",
                            a: "Yes. The Concrete Sidewalk Calculator on Concrete Calculator Max is completely free with no registration, subscription, or hidden fees. All features — volume, bags, joint planning, the plan-view diagram, and cost estimation — are available at no cost."
                        },
                        {
                            q: "Can I print or save my sidewalk concrete estimate?",
                            a: "Yes. After calculating, press Print / Save to open a print-ready report with all inputs, results, and ACPA joint compliance status. In your browser's print dialog, choose Save as PDF to keep a digital copy for purchase orders, permits, or contractor bids."
                        },
                        {
                            q: "What is the plan-view joint diagram?",
                            a: "The plan-view joint diagram is a top-down proportional drawing of your sidewalk showing control joints (teal dashed lines) and expansion joints (orange solid lines) at their calculated positions. It redraws every time you calculate, giving you a visual check that your joint pattern makes sense before placing any concrete."
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
