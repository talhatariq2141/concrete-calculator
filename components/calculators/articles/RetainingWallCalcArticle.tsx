"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function RetainingWallCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* Introduction */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-teal-400 mb-4 tracking-tight">
                    What is a Retaining Wall Calculator?
                </h2>
                <p className="mb-4 leading-relaxed">
                    Our Retaining Wall Calculator is a complete project estimator for segmental retaining walls (SRW). Enter your wall length, height, and block size — the tool instantly returns the exact number of blocks you need, the volume and weight of drainage gravel required behind the wall, and geogrid reinforcement layers for taller walls.
                </p>
                <p className="leading-relaxed">
                    Whether you are building a 2-foot garden border, a 4-foot retaining wall, or an engineered 6-foot-plus structure, this calculator covers the full material takeoff. It factors in waste allowance, supports multiple standard SRW block sizes (12 × 4 × 8 through 24 × 8 × 18), estimates drainage aggregate, and produces an installed-cost estimate with materials, labor, delivery, and tax.
                </p>
            </section>

            {/* Features */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of Our Free Retaining Wall Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Block Quantity Estimator",
                            desc: "Calculates exactly how many SRW blocks you need based on wall length, height, and block face dimensions."
                        },
                        {
                            title: "Drainage Gravel Calculator",
                            desc: "Estimates volume (ft³ / yd³) and weight (lb / tons) of drainage aggregate placed behind the wall."
                        },
                        {
                            title: "Geogrid Reinforcement Layers",
                            desc: "Calculates geogrid layer count, embedment length, and total fabric area for walls over 4 feet."
                        },
                        {
                            title: "IBC Compliance Warning",
                            desc: "Automatically flags walls taller than 4 ft that require engineering per IBC 2021 §1807.2.3."
                        },
                        {
                            title: "Multiple SRW Block Sizes",
                            desc: "Supports garden, medium, standard (18 × 8 × 12 in), and large gravity block sizes plus custom."
                        },
                        {
                            title: "Quick Presets",
                            desc: "One-click presets for Small Garden (2 ft), Standard Retaining (4 ft), and Engineered (6 ft+)."
                        },
                        {
                            title: "Cost Estimator",
                            desc: "Adds material, labor, delivery, and tax to produce a complete installed-wall cost estimate."
                        },
                        {
                            title: "Waste Allowance Control",
                            desc: "Fully adjustable waste percentage defaults to 5%, suitable for most SRW installations."
                        },
                        {
                            title: "Imperial & Metric Units",
                            desc: "Enter wall length, height, and backfill depth in feet, inches, meters, or centimeters."
                        },
                        {
                            title: "Block Weight Reference",
                            desc: "Shows total wall weight in pounds and tons — essential for delivery planning and site access."
                        },
                        {
                            title: "Drainage Aggregate Options",
                            desc: "Choose crushed stone (#57), pea gravel, or river rock — each with accurate density (96–105 lb/ft³)."
                        },
                        {
                            title: "Print / Save Results",
                            desc: "Export a professional A4-friendly PDF of inputs, materials, and cost breakdown for permit submittal."
                        }
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

            {/* How to use */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Retaining Wall Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select a Project Type preset — Small Garden, Standard Retaining, or Engineered — to load sensible defaults.",
                        "Choose your unit system: imperial (ft/in) or metric (m/cm).",
                        "Enter the wall length and wall height as gross (total) dimensions along the run.",
                        "Pick the block size from the catalog — Garden (12 × 4 × 8), Medium, Standard (18 × 8 × 12), Large, or Custom.",
                        "Set the drainage gravel depth behind the wall — 12 inches minimum for walls over 3 ft per NCMA TEK 2-4B.",
                        "Select the drainage aggregate type — crushed #57 stone, pea gravel, or river rock.",
                        "Adjust the waste percentage (default 5%) based on layout complexity and curved runs.",
                        "Switch to Advanced mode to enable geogrid reinforcement layers for walls over 4 ft.",
                        "Enter geogrid vertical spacing (typical: every 2 courses) and embedment length (typical: 0.6 × wall height).",
                        "In Advanced mode, enter cost per block, per ton of gravel, labor rate, delivery, and tax.",
                        "Click Calculate to see blocks needed, gravel weight, geogrid area, and full cost breakdown.",
                        "Use Print / Save to export a permit-ready PDF summary for your contractor, engineer, or building department."
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
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in This Calculator</h2>
                <ul className="space-y-4 text-slate-400">
                    <li>
                        <strong className="text-white block">1) Block Face Area</strong>
                        Face Area (ft²) = (Block Length × Block Height) / 144<br />
                        Example: 18 × 8 in block → (18 × 8) / 144 = 1.00 ft²
                    </li>
                    <li>
                        <strong className="text-white block">2) Block Quantity</strong>
                        Blocks Before Waste = (Wall Length × Wall Height) / Face Area<br />
                        Final Blocks = ⌈ Blocks Before Waste × (1 + Waste%) ⌉
                    </li>
                    <li>
                        <strong className="text-white block">3) Drainage Gravel Volume</strong>
                        Gravel Volume (ft³) = Wall Length × Wall Height × Backfill Depth<br />
                        Gravel Volume with Waste = Volume × (1 + Waste%)<br />
                        Convert to yd³ by dividing by 27.
                    </li>
                    <li>
                        <strong className="text-white block">4) Drainage Gravel Weight</strong>
                        Weight (lb) = Volume (ft³) × Density (lb/ft³)<br />
                        Crushed #57 stone ≈ 100 lb/ft³ · Pea gravel ≈ 96 lb/ft³ · River rock ≈ 105 lb/ft³<br />
                        Tons = Weight (lb) / 2000
                    </li>
                    <li>
                        <strong className="text-white block">5) Geogrid Layers (Walls &gt; 4 ft)</strong>
                        Number of Courses = Wall Height (in) / Block Height (in)<br />
                        Layers = max(0, ⌊ Courses / Layer Spacing ⌋ − 1)<br />
                        Total Geogrid Area (ft²) = Layers × Wall Length × Embedment Length
                    </li>
                    <li>
                        <strong className="text-white block">6) Installed Cost</strong>
                        Material Cost = Blocks × $/Block + Gravel Tons × $/Ton<br />
                        Labor Cost = Wall Area × $/ft² or Hours × $/Hour<br />
                        Total = (Material + Labor + Delivery) × (1 + Tax%)
                    </li>
                </ul>
            </section>

            {/* Reference Guide */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Retaining Wall Block Size Reference</h2>
                <p className="text-slate-400 mb-4 leading-relaxed">
                    U.S. segmental retaining wall manufacturers (Allan Block, Versa-Lok, Keystone, Pavestone) produce blocks in a wide size range. Use this table to match your wall height to the correct block and anticipated weight per block.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm text-slate-300">
                        <thead className="bg-slate-800 text-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold">Block Type</th>
                                <th className="px-4 py-3 text-left font-semibold">Nominal Size (L × H × D)</th>
                                <th className="px-4 py-3 text-left font-semibold">Weight</th>
                                <th className="px-4 py-3 text-left font-semibold">Typical Use</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            <tr>
                                <td className="px-4 py-3">Small Garden</td>
                                <td className="px-4 py-3">12 × 4 × 8 in</td>
                                <td className="px-4 py-3">~20 lb</td>
                                <td className="px-4 py-3">Borders, flower beds up to 2 ft</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Medium SRW</td>
                                <td className="px-4 py-3">16 × 6 × 10 in</td>
                                <td className="px-4 py-3">~50 lb</td>
                                <td className="px-4 py-3">Landscape walls 2–3 ft</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Standard SRW</td>
                                <td className="px-4 py-3">18 × 8 × 12 in</td>
                                <td className="px-4 py-3">~80 lb</td>
                                <td className="px-4 py-3">Retaining walls 3–5 ft</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Large Gravity</td>
                                <td className="px-4 py-3">24 × 8 × 18 in</td>
                                <td className="px-4 py-3">~120 lb</td>
                                <td className="px-4 py-3">Engineered walls 5 ft+</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* FAQs */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">How many retaining wall blocks do I need?</h3>
                        <p className="text-slate-400">
                            Divide the wall face area (length × height) by the block face area (block length × block height), then round up and add 5–10% for waste. For example, a 20 ft long × 4 ft tall wall using 18 × 8 in blocks needs (20 × 4) ÷ 1.0 = 80 blocks before waste, or 84 with 5% extra.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">Do retaining walls over 4 feet need an engineer?</h3>
                        <p className="text-slate-400">
                            Yes. Per the International Building Code (IBC) 2021 §1807.2.3, retaining walls with an exposed height greater than 4 feet (measured from top of footing) require a permit and engineered design. Many jurisdictions also require geotechnical analysis of the soil.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">How much drainage gravel do I need behind a retaining wall?</h3>
                        <p className="text-slate-400">
                            NCMA TEK 2-4B recommends a drainage zone at least 12 inches wide behind walls over 3 feet tall. For a 20 ft long × 4 ft tall wall with a 12-inch backfill, you need roughly 80 ft³ (~3 yd³) of crushed stone — about 4 tons.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">What is geogrid and when do I need it?</h3>
                        <p className="text-slate-400">
                            Geogrid is a polymer reinforcement fabric placed between block courses and extended back into the retained soil. It creates a reinforced soil mass that resists lateral pressure. Walls over 4 feet — and shorter walls with heavy surcharge loads (driveways, slopes) — typically require geogrid layers every 2 courses.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">How long should geogrid layers extend into the soil?</h3>
                        <p className="text-slate-400">
                            A common rule of thumb is geogrid embedment length = 60% of the wall height (minimum 4 ft). For a 6 ft wall, use 3.6 ft of embedment (round up to 4 ft). Always follow the specific engineered design for your site and soil type.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">What size block is best for a 4-foot retaining wall?</h3>
                        <p className="text-slate-400">
                            An 18 × 8 × 12 in standard SRW block is the most common choice for 3–5 ft walls. It has enough setback and mass for good stability, and is widely stocked at home improvement stores. For walls over 5 ft, consider 24 × 8 × 18 in large gravity blocks or an engineered system.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">Do I need a concrete footing for a retaining wall?</h3>
                        <p className="text-slate-400">
                            Most SRW systems are dry-stacked on a compacted crushed-stone base (6 inches for walls under 4 ft, 12 inches or more for taller walls). A concrete footing is generally not required for segmental blocks but is recommended for poured-in-place concrete retaining walls or mortared CMU walls.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">Why does a retaining wall need drainage?</h3>
                        <p className="text-slate-400">
                            Without drainage, water builds up behind the wall and creates hydrostatic pressure that can push the wall forward or cause it to fail. A drainage zone of crushed stone plus a 4-inch perforated drain pipe at the base allows water to escape safely.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">What is the cost of building a retaining wall?</h3>
                        <p className="text-slate-400">
                            Installed cost typically ranges from $20–$50 per face-ft² for DIY SRW walls, and $35–$100+ per face-ft² for professionally installed walls with engineering, geogrid, and drainage. Enter your local block, gravel, and labor rates in Advanced mode for an accurate site-specific estimate.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">How deep should a retaining wall base be buried?</h3>
                        <p className="text-slate-400">
                            A standard rule is to bury one block course (or at least 10% of wall height) below grade. For a 4 ft wall, bury at least 6 inches. In frost-prone regions, extend the base below the frost line to prevent seasonal heaving.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">What is batter (setback) and why does it matter?</h3>
                        <p className="text-slate-400">
                            Batter is the backward lean of the wall face. Most SRW systems build in a 1–2° setback per course, which shifts the wall's center of gravity toward the retained soil and improves stability. This calculator assumes standard manufacturer setback; follow your specific block system's instructions.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I build a retaining wall without a permit?</h3>
                        <p className="text-slate-400">
                            In most U.S. jurisdictions, walls under 4 ft (measured from bottom of footing to top of wall) do not require a permit. Walls over 4 ft, walls retaining a surcharge (driveway, slope), and walls near property lines typically require a permit and engineered plans. Always check with your local building department.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">Can I use this tool for poured concrete retaining walls?</h3>
                        <p className="text-slate-400">
                            This calculator is optimized for segmental (block) retaining walls. For poured-in-place concrete retaining walls with footings and stems, use our <strong>Wall Concrete Calculator</strong> plus the <strong>Footing Calculator</strong> to estimate concrete volume, and the <strong>Rebar Calculator</strong> for steel.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">What waste percentage should I use?</h3>
                        <p className="text-slate-400">
                            5% is the default for straight runs with minimal cutting. Use 7–10% for walls with curves, corners, step-downs, or when using split/cap blocks that require cutting. Waste accounts for damaged blocks during delivery and cuts that can't be reused.
                        </p>
                    </div>

                    <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-lg text-slate-200 mb-2">Does this calculator account for capstones or corner blocks?</h3>
                        <p className="text-slate-400">
                            The block count includes all courses in the wall face. It does not separately itemize capstones (usually 1 per linear foot of wall top) or specialty corner blocks. Add these to your order based on your specific block system's recommendations — we recommend 1 cap per ft of wall length plus 2–4 corner blocks per 90° corner.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}