"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function SonotubeCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* Introduction */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    How to Calculate Concrete for Sonotube Forms
                </h2>
                <p className="mb-4 leading-relaxed">
                    Sonotube concrete forms (also called tube forms, cardboard pier forms, or biodegradable
                    column forms) are the fastest way to pour cylindrical deck posts, fence posts, mailbox
                    footings, lamp post bases, and small structural piers. Because the finished pour is a
                    perfect cylinder, the volume math is simple — but getting the bag count and cubic yards
                    right for the <em>number</em> of tubes on your project still trips up most DIYers and
                    site foremen.
                </p>
                <p className="leading-relaxed">
                    This calculator removes that friction. Enter tube diameter, tube depth (with mixed units
                    if you prefer), the number of tubes, and an optional waste allowance. You get cubic
                    feet, cubic yards, cubic meters, and bag counts for 40-lb, 60-lb, and 80-lb
                    pre-mixed concrete bags — backed by the shared Concrete Calculator Max calc-engine and
                    IBC §1809 frost-line safety check.
                </p>
            </section>

            {/* Features Cards */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of Our Free Sonotube Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Cylinder Volume (π·r²·h)",
                            desc: "Accurate concrete volume per tube using the circle-area × depth formula — no geometry guesswork.",
                        },
                        {
                            title: "Mixed Diameter & Depth Units",
                            desc: "Enter tube diameter in inches, feet, cm, or mm and depth in inches, feet, meters, or cm independently.",
                        },
                        {
                            title: "Multi-Tube Totals",
                            desc: "Multiply per-tube volume by the number of tubes for a complete project total in one click.",
                        },
                        {
                            title: "Project Type Presets",
                            desc: "One-click presets for deck posts (8″×42″), fence posts (6″×36″), and structural piers (12″×48″).",
                        },
                        {
                            title: "Waste Allowance Built In",
                            desc: "Apply 5–10% overage for spill, over-excavation, and pump-line loss so you do not run short mid-pour.",
                        },
                        {
                            title: "Bag Counts for 40 / 60 / 80 lb",
                            desc: "Per-bag coverage from the shared material database converts cubic feet to bags instantly.",
                        },
                        {
                            title: "Cubic Yards for Ready-Mix",
                            desc: "Compare bag totals against ready-mix truck yardage to decide the cheaper pour method.",
                        },
                        {
                            title: "IBC §1809 Frost-Line Warning",
                            desc: "Alerts you when tube depth falls below 36″ so piers do not heave in winter freeze-thaw.",
                        },
                        {
                            title: "Print / Save Results",
                            desc: "Export a clean, branded summary for site logs, permit submittals, or supplier orders.",
                        },
                        {
                            title: "Advanced Cost Mode",
                            desc: "Add price per bag, price per cubic yard, and tube form cost to compare total project spend.",
                        },
                        {
                            title: "Sonotube Size Reference",
                            desc: "Built-in reference table for 6″ through 24″ tube diameters with volume-per-foot values.",
                        },
                        {
                            title: "Shared Calc Engine",
                            desc: "Powered by cylinderVolume() and multiHoleVolume() from the site-wide engine — results stay consistent across tools.",
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
                    How to Use the Sonotube Concrete Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Pick a Project Type preset — Deck Post, Fence Post, or Structural Pier — to load sensible defaults.",
                        "Enter the Tube Diameter (outer nominal size printed on the form) and choose its unit.",
                        "Enter the Tube Depth (total pour depth from grade to bottom of hole) and choose its unit.",
                        "Set the Number of Tubes you are pouring on this project.",
                        "Add a Waste Allowance — 5% is typical for clean pours, 10% for rougher hand-dug holes.",
                        "Choose your Bag Size (40 lb, 60 lb, or 80 lb) — the bag count updates for all three.",
                        "Switch to Advanced Mode to add price per bag, ready-mix price per cubic yard, or tube form unit cost.",
                        "Click Calculate to reveal per-tube volume, project totals, bag counts, and cost breakdown.",
                        "Review the IBC §1809 frost-line warning if your depth is less than 36 inches.",
                        "Click Print / Save to generate a branded PDF-ready summary for your file or supplier.",
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
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
                <ul className="space-y-4 text-slate-400">
                    <li>
                        <strong className="text-white block">1) Per-Tube Volume (Cylinder)</strong>
                        V = π × r² × h<br />
                        r = Diameter ÷ 2 (converted to feet)<br />
                        h = Depth (converted to feet)
                    </li>
                    <li>
                        <strong className="text-white block">2) Project Total</strong>
                        V<sub>total</sub> = V<sub>per-tube</sub> × Number of Tubes
                    </li>
                    <li>
                        <strong className="text-white block">3) Waste Allowance</strong>
                        V<sub>order</sub> = V<sub>total</sub> × (1 + Waste %)
                    </li>
                    <li>
                        <strong className="text-white block">4) Bag Count</strong>
                        Bags = ⌈ V<sub>order (ft³)</sub> ÷ Bag Coverage (ft³) ⌉<br />
                        40 lb = 0.30 ft³ · 60 lb = 0.45 ft³ · 80 lb = 0.60 ft³
                    </li>
                    <li>
                        <strong className="text-white block">5) Cubic Yards</strong>
                        yd³ = ft³ ÷ 27
                    </li>
                    <li>
                        <strong className="text-white block">6) Project Cost (Advanced)</strong>
                        Total = (Bags × Bag Price) + (yd³ × Yardage Price) + (Tubes × Tube Form Price)
                    </li>
                </ul>
            </section>

            {/* Reference Guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Common Sonotube Sizes &amp; Uses</h2>
                <p className="text-sm text-slate-400 mb-4">
                    Sonotube-brand and compatible cardboard forms are sold in standard diameters. Use this
                    guide to pick the right size for your load case.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-slate-200">
                            <tr>
                                <th className="px-4 py-2 text-left">Diameter</th>
                                <th className="px-4 py-2 text-left">Volume per Foot (ft³)</th>
                                <th className="px-4 py-2 text-left">Typical Use</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-400">
                            {[
                                { d: '6"', v: "0.196", use: "Fence posts, light mailboxes, small signs" },
                                { d: '8"', v: "0.349", use: "Deck footings, pergola posts, lamp posts" },
                                { d: '10"', v: "0.545", use: "Heavier decks, gazebo bases, short columns" },
                                { d: '12"', v: "0.785", use: "Structural piers, carports, small foundations" },
                                { d: '14"', v: "1.069", use: "Commercial decks, light industrial posts" },
                                { d: '16"', v: "1.396", use: "Medium piers, garage-corner footings" },
                                { d: '18"', v: "1.767", use: "Heavy piers, small-bridge abutments" },
                                { d: '20"', v: "2.182", use: "Commercial columns, pole-barn piers" },
                                { d: '24"', v: "3.142", use: "Large structural columns, bell caissons (shaft)" },
                            ].map((row) => (
                                <tr key={row.d} className="border-t border-slate-700">
                                    <td className="px-4 py-2 font-medium text-slate-200">{row.d}</td>
                                    <td className="px-4 py-2">{row.v}</td>
                                    <td className="px-4 py-2">{row.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Why Choose */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Why Choose Our Sonotube Calculator?</h2>
                <ul className="list-disc pl-5 space-y-3 ms-2 text-slate-400">
                    <li>Purpose-built for cardboard tube forms — no square-footing detours.</li>
                    <li>Independent diameter and depth units so you can enter field measurements as-taken.</li>
                    <li>Three-bag-size coverage (40 / 60 / 80 lb) from a single pour — no second lookup.</li>
                    <li>IBC §1809 frost-line warning protects you from a common rookie mistake.</li>
                    <li>Preset buttons speed up estimating for the three most common use cases.</li>
                    <li>Printable, branded results make supplier orders and permit files effortless.</li>
                </ul>
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
                            q: "What is a sonotube?",
                            a: "Sonotube is the trademarked name (now genericized) for a waxed-cardboard cylindrical concrete form used to shape round columns, piers, and posts. Similar products from other brands work the same way — enter the nominal inside diameter into the calculator.",
                        },
                        {
                            q: "How many bags of concrete do I need for one sonotube?",
                            a: "It depends on diameter and depth. An 8″ × 42″ tube holds about 1.22 ft³, which works out to roughly 3 bags of 60 lb or 2 bags of 80 lb pre-mixed concrete per tube — before waste. This calculator does the exact math for any size.",
                        },
                        {
                            q: "Should I pour with bags or order ready-mix?",
                            a: "Bags are cheaper and easier for up to ~20 cubic feet (roughly 5–7 small tubes). Beyond that, a ready-mix truck is faster and usually cheaper once you factor in labor. Advanced Mode lets you compare both costs side-by-side.",
                        },
                        {
                            q: "How deep does a sonotube need to go?",
                            a: "In the U.S., the IBC §1809.5 and IRC R403.1.4 require footings to extend below the frost line — typically 36 inches, but up to 48+ inches in northern states. The calculator warns you if you enter less than 36″.",
                        },
                        {
                            q: "What diameter sonotube should I use for a deck post?",
                            a: "8″ diameter is the residential standard for deck posts supporting 6×6 wood columns. Use 10″ or 12″ for heavy loads, long-span beams, or commercial work per your structural drawings.",
                        },
                        {
                            q: "Do I need to add waste allowance for sonotubes?",
                            a: "Yes, 5–10% is recommended. Tubes are clean forms, so waste is lower than slab pours, but over-excavation, spillage, and partial bags still add up. Use 10% for hand-dug holes, 5% for augered or machine-drilled holes.",
                        },
                        {
                            q: "Can I use this for belled or flared bases?",
                            a: "No — this tool is for straight cylindrical tubes only. For belled caissons, use our Pier / Caisson Concrete Calculator which adds a frustum (belled base) volume to the shaft.",
                        },
                        {
                            q: "What concrete mix strength should I use?",
                            a: "3000–4000 psi (20–28 MPa) is standard for residential piers per ACI 332. For structural piers, follow the engineer's spec — typically 4000 psi or higher with air-entrainment in freeze-thaw zones.",
                        },
                        {
                            q: "Do I need rebar in a sonotube?",
                            a: "Short answer: yes for anything structural. ACI 318 requires longitudinal reinforcement in columns. Even fence and deck posts benefit from one or two vertical #4 bars plus ties to resist uplift and lateral loads. The calculator does not size rebar — that is a structural engineer's job.",
                        },
                        {
                            q: "Does the calculator account for the tube wall thickness?",
                            a: "No — cardboard tube walls are typically 0.2–0.3 inches and the nominal diameter printed on the form already refers to the inside dimension. Volume math uses the nominal diameter as the concrete diameter.",
                        },
                        {
                            q: "Can I enter different units for diameter and depth?",
                            a: "Yes. Diameter accepts inches, feet, cm, or mm; depth accepts inches, feet, meters, or cm. Enter each field in whatever unit your tape measure or spec sheet uses — the engine converts everything to feet internally.",
                        },
                        {
                            q: "What if my hole is wider than the tube at the bottom?",
                            a: "Extra concrete will fill the over-excavated space. This calculator assumes a clean cylindrical pour. Add 5–10% waste, or bump one step further to account for typical over-digging.",
                        },
                        {
                            q: "How do I brace a sonotube before pouring?",
                            a: "Backfill tamped earth around the tube every 12 inches of depth, and use 2×4 braces nailed to stakes above grade to hold alignment. Check plumb on two faces before pouring. Brace stays on for 24 hours minimum.",
                        },
                        {
                            q: "When can I strip the sonotube off?",
                            a: "Wait at least 24–48 hours after pour in warm weather, longer in cold weather. Score the seam with a utility knife and peel the cardboard away. Concrete should be hard to the touch with no surface moisture.",
                        },
                        {
                            q: "Is this calculator free?",
                            a: "Yes — completely free, no sign-up, no ads in the tool area, and results are printable. Concrete Calculator Max is 100% free for contractors, engineers, and DIYers.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50"
                        >
                            <h3 className="font-semibold text-lg text-slate-200 mb-2">{item.q}</h3>
                            <p className="text-slate-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}