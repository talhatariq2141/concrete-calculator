"use client";

import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function FencePostCalcArticle() {
    return (
        <div className="mt-12 max-w-4xl mx-auto space-y-12 font-poppins text-slate-300">

            {/* ── Section 1: Introduction ─────────────────────────────────── */}
            <section>
                <p className="text-slate-300 leading-relaxed">
                    The Fence Post Concrete Calculator estimates exactly how much concrete you need to set fence
                    posts for privacy fences, picket fences, farm fences, and any other post-in-ground installation.
                    Rather than guessing at the hardware store, you enter your total fence length and post spacing —
                    and the calculator automatically determines how many posts you need, then computes the concrete
                    volume and bag count for every hole. Accurate estimates prevent costly over-ordering and
                    frustrating mid-project shortages.
                </p>
                <p className="mt-4 text-slate-300 leading-relaxed">
                    The calculator uses a cylindrical hole volume formula (π × r² × depth) and subtracts the
                    physical volume of the post itself — a step most fence calculators skip — to give you a more
                    accurate net fill volume. Outputs include concrete volume in cubic feet, cubic yards, and cubic
                    meters, plus a three-way bag comparison (40 lb, 60 lb, and 80 lb) so you can buy exactly the
                    right size at your local home improvement store.
                </p>
            </section>

            {/* ── Section 2: Key Features ─────────────────────────────────── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-6 border-b border-slate-700 pb-2">
                    Key Features of the Fence Post Concrete Calculator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            title: "Auto Post Count from Fence Length",
                            desc: "Enter total fence length and on-center post spacing — the calculator divides and adds the terminal end post automatically, so you never have to do that math by hand.",
                        },
                        {
                            title: "Accurate Post Displacement",
                            desc: "The post itself occupies volume inside the hole. The calculator subtracts this displacement (using the actual post cross-section × embed depth) for a true net concrete fill.",
                        },
                        {
                            title: "Privacy, Picket & Farm Presets",
                            desc: "One-click defaults for three common fence types load appropriate hole diameters, depths, post sizes, and spacing — saving you setup time on every estimate.",
                        },
                        {
                            title: "Dual Unit System",
                            desc: "Fence layout dimensions (length, spacing) use feet, yards, or meters. Hole and post dimensions use inches, feet, or centimeters — each independently selectable to match how you measure on site.",
                        },
                        {
                            title: "Three-Way Bag Comparison",
                            desc: "Results show bag counts for 40 lb, 60 lb, and 80 lb bags simultaneously, so you can buy whichever size is in stock or on sale without recalculating.",
                        },
                        {
                            title: "Waste Factor",
                            desc: "A configurable waste percentage (default 10%) adds overage for spillage, over-dug holes, and bags mixed too early. Essential for accurate shopping-list quantities.",
                        },
                        {
                            title: "IRC Compliance Warning",
                            desc: "If your embed depth is below 24 inches, the calculator flags it with an IRC R403.1.4 warning — helping you catch undersized footings before you dig.",
                        },
                        {
                            title: "Post Size Reference Table",
                            desc: "An in-results reference table maps common post types (4×4, 6×6, round, steel pipe) to their actual dimensions, recommended hole diameters, and minimum embed depths.",
                        },
                        {
                            title: "Volume in All Units",
                            desc: "Results display in cubic feet, cubic yards, and cubic meters — making it easy to communicate with concrete suppliers and contractors regardless of which unit system they prefer.",
                        },
                        {
                            title: "Advanced Cost Estimation",
                            desc: "Switch to Advanced mode to enter bag price and labor cost for a full project cost estimate that you can print and bring to the hardware store.",
                        },
                        {
                            title: "Print / PDF Export",
                            desc: "The Print / Save button generates a formatted PDF with all inputs and results — perfect for bringing to the store, sharing with a contractor, or keeping in your project records.",
                        },
                        {
                            title: "Mobile-First Responsive Design",
                            desc: "Fully usable on a smartphone at the job site. No app download required — works in any modern browser.",
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

            {/* ── Section 3: How to Use ────────────────────────────────────── */}
            <section className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-5">
                    How to Use the Fence Post Concrete Calculator
                </h2>
                <ol className="space-y-4">
                    {[
                        "Select your project type — Privacy Fence, Picket Fence, or Farm Fence — to instantly load sensible default values for all inputs.",
                        "In Step 1, enter your total fence length (the full linear run). Choose your unit: feet, yards, or meters.",
                        "Enter your on-center post spacing. Privacy and picket fences typically use 8 ft spacing; farm and agricultural fences often use 10–12 ft.",
                        "The calculator shows a live post count preview below the layout fields as you type — confirm it matches your project before proceeding.",
                        "In Step 2, enter the hole diameter. A common rule of thumb: the hole should be at least 3 times the actual post width. For a 4×4 post (3.5\" actual), use a 10\"–12\" diameter hole.",
                        "Enter the hole depth. Holes must extend at or below the local frost line. In most of the continental US, this is 24\"–48\" depending on your climate zone.",
                        "In Step 3, select your post shape (square or round) and enter the actual post dimension — the true measured size, not the nominal lumber size. A '4×4' post is actually 3.5\" × 3.5\".",
                        "Enter the post embed depth — how far the post sits inside the concrete. This is typically equal to the hole depth.",
                        "In Step 4, set your waste factor. For fence post work, 10% is a good starting point to cover spillage, over-dug holes, and bags mixed ahead of schedule.",
                        "Click Calculate. Review the hero bag count, the fence layout breakdown (post count, per-hole volume, post displacement), and the three-way bag comparison.",
                        "In Advanced mode, add your bag price and labor cost to get a full project cost estimate.",
                        "Click Print / Save to export a formatted PDF of your estimate to bring to the hardware store or share with your crew.",
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

            {/* ── Section 4: Formulas ──────────────────────────────────────── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Formulas Used in the Calculator</h2>
                <ul className="space-y-5 text-slate-400">
                    <li>
                        <strong className="text-white block mb-1">1) Number of Posts</strong>
                        Posts = ⌈ fenceLength ÷ postSpacing ⌉ + 1<br />
                        <span className="text-white/60 text-sm">
                            The ceiling function ensures enough interior posts; the +1 adds the terminal end post.
                            For example, a 100 ft fence with 8 ft spacing: ⌈100 ÷ 8⌉ + 1 = 13 + 1 = 14 posts.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">2) Hole Volume (Cylindrical)</strong>
                        V<sub>hole</sub> = π × (D ÷ 2)² × depth<br />
                        <span className="text-white/60 text-sm">
                            Standard formula for a cylindrical auger-drilled hole. D is the hole diameter.
                            A 12-inch diameter, 24-inch deep hole yields approximately 0.1963 ft³ per hole.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">3) Post Displacement — Round Post</strong>
                        V<sub>post</sub> = π × (d ÷ 2)² × embedDepth<br />
                        <span className="text-white/60 text-sm">
                            d is the actual post diameter. This volume is subtracted from the hole volume because
                            the post itself occupies that space.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">4) Post Displacement — Square / Rectangular Post</strong>
                        V<sub>post</sub> = width × length × embedDepth<br />
                        <span className="text-white/60 text-sm">
                            For a 4×4 post (3.5" × 3.5" actual) embedded 24 inches (2 ft):
                            V<sub>post</sub> = (3.5/12) × (3.5/12) × 2 ≈ 0.0170 ft³ per post.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">5) Net Concrete Per Hole</strong>
                        V<sub>net</sub> = max(0, V<sub>hole</sub> − V<sub>post</sub>)<br />
                        <span className="text-white/60 text-sm">
                            The post displaces some concrete in the hole. Subtracting it prevents over-ordering,
                            especially significant on large post counts or large post sizes.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">6) Total Volume with Waste</strong>
                        V<sub>total</sub> = (V<sub>net</sub> × numPosts) × (1 + waste% ÷ 100)<br />
                        <span className="text-white/60 text-sm">
                            A 10% waste factor on 14 posts adds roughly 1–2 extra bags depending on hole size —
                            worth it to avoid a mid-project run to the store.
                        </span>
                    </li>
                    <li>
                        <strong className="text-white block mb-1">7) Bag Count</strong>
                        bags = ⌈ V<sub>total</sub> ÷ yield_per_bag ⌉<br />
                        <span className="text-white/60 text-sm">
                            Yield per bag: 40 lb = 0.30 ft³ · 60 lb = 0.45 ft³ · 80 lb = 0.60 ft³.
                            All counts rounded up to the nearest whole bag.
                        </span>
                    </li>
                </ul>
            </section>

            {/* ── Section 5: Reference Guide ───────────────────────────────── */}
            <section>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">
                    Post Size &amp; Hole Diameter Reference Guide
                </h2>
                <p className="text-slate-400 mb-4 text-sm">
                    Use this table to select the right hole diameter and embedment depth for your post type.
                    Remember: nominal lumber sizes differ from actual dimensions — a "4×4" post measures 3.5" × 3.5".
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="text-left py-3 px-4 text-teal-400 font-semibold">Post Type</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Actual Size</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Rec. Hole Dia.</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Min Embed Depth</th>
                                <th className="text-left py-3 px-4 text-slate-300 font-medium">Common Use</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { type: "4×4 Wood Post", actual: '3.5" × 3.5"', hole: '10"–12"', embed: '24"', use: "Privacy, picket, garden fence" },
                                { type: "6×6 Wood Post", actual: '5.5" × 5.5"', hole: '12"–16"', embed: '24"–30"', use: "Gate posts, heavy privacy fence" },
                                { type: '4" Round Post', actual: '4" diameter', hole: '10"–12"', embed: '24"', use: "Farm fence, round rail fence" },
                                { type: '6" Round Post', actual: '6" diameter', hole: '12"–16"', embed: '30"', use: "Farm fence, heavy loads" },
                                { type: '4" Steel Pipe', actual: '4" O.D.', hole: '10"–12"', embed: '24"', use: "Chain-link, commercial fence" },
                                { type: '2-3/8" Line Post', actual: '2.375" O.D.', hole: '6"–8"', embed: '18"–24"', use: "Chain-link line posts" },
                                { type: '4" × 4" Vinyl Post', actual: '3.5" × 3.5"', hole: '10"–12"', embed: '24"', use: "Vinyl privacy fence" },
                            ].map((row, i) => (
                                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4 font-bold text-teal-400">{row.type}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.actual}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.hole}</td>
                                    <td className="py-3 px-4 text-slate-300">{row.embed}</td>
                                    <td className="py-3 px-4 text-slate-400 text-xs">{row.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                    Source: Industry standards including IRC 2021 Table R403.1 and fence manufacturer installation guides.
                    Embed depths assume no frost depth requirement — increase depth to match local frost line per IRC R403.1.4.
                </p>
            </section>

            {/* ── Section 6: FAQ ───────────────────────────────────────────── */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-6 h-6 text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-200">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-6">
                    {[
                        {
                            q: "What is a fence post concrete calculator?",
                            a: "A fence post concrete calculator estimates how much concrete you need to set fence posts in the ground. You enter your fence length, post spacing, hole diameter, hole depth, and post size — and the calculator outputs the total concrete volume and the number of bags to buy. This prevents guesswork at the hardware store and ensures you don't run short mid-project.",
                        },
                        {
                            q: "How does the calculator determine the number of fence posts?",
                            a: "The calculator uses the formula: Posts = ⌈ fenceLength ÷ postSpacing ⌉ + 1. The ceiling function rounds up to ensure enough interior posts, and the +1 accounts for the terminal end post. For example, a 100-foot fence at 8-foot spacing requires ⌈100 ÷ 8⌉ + 1 = 14 posts.",
                        },
                        {
                            q: "How much concrete do I need per fence post?",
                            a: "It depends on hole size and depth. A common 12-inch diameter hole drilled 24 inches deep (minus a 3.5\" × 3.5\" 4×4 post displacement) requires about 0.18 cubic feet of concrete — roughly 0.3 bags of 80 lb Quikrete. Larger holes, deeper holes, or gate posts require significantly more. Use the calculator to get an exact number for your specific dimensions.",
                        },
                        {
                            q: "How deep should fence post holes be?",
                            a: "A common rule of thumb is to bury one-third of the total post length below grade — so a 9-foot post would need a 3-foot hole. However, the hole must also extend below the local frost line per IRC R403.1.4. In colder climates (USDA Zones 5–7), the frost line can be 36–48 inches, which may govern. Always check your local building department for the required depth.",
                        },
                        {
                            q: "What hole diameter should I use for a 4×4 post?",
                            a: "The standard recommendation is a hole diameter 3 times the post width. A 4×4 post has an actual width of 3.5 inches, so 3 × 3.5 = 10.5 inches — meaning a 10- or 12-inch hole is appropriate. Using a 12-inch hole gives a bit more concrete around the post for better stability, which is recommended for privacy fence line posts.",
                        },
                        {
                            q: "What hole diameter should I use for a 6×6 post?",
                            a: "A 6×6 post has an actual dimension of 5.5 inches. Applying the 3× rule: 3 × 5.5 = 16.5 inches. In practice, a 12- to 16-inch hole is common for 6×6 gate posts and corner posts. A 16-inch hole with a 6×6 post embedded 30 inches requires about 1.9 cubic feet of concrete — roughly 3 bags of 80 lb Quikrete per post.",
                        },
                        {
                            q: "How many bags of concrete do I need per fence post?",
                            a: "For a standard residential line post (10-inch hole, 24-inch depth, 4×4 post), you'll need approximately 1–2 bags of 80 lb Quikrete per post. Gate posts and corner posts with larger holes and deeper embedment can require 3–5 bags each. Always calculate your specific dimensions rather than relying on rule-of-thumb bag counts.",
                        },
                        {
                            q: "What is post displacement and why does it matter?",
                            a: "Post displacement is the volume of concrete displaced by the post itself. When you set a post in a hole, the post takes up space — you're not filling a completely empty cylinder. Subtracting post displacement gives you the true volume of concrete needed. For a 4×4 post in a 12-inch hole at 24 inches deep, the displacement is about 0.017 cubic feet — small but meaningful across 20+ posts.",
                        },
                        {
                            q: "Should I subtract the post volume from my concrete estimate?",
                            a: "Yes, for the most accurate estimate. The calculator does this automatically using the post's actual cross-section × embed depth. In practice, small errors in hole diameter and shape mean you should still include a 5–10% waste factor on top. The displacement subtraction is most impactful for large posts (6×6 or round) in smaller holes.",
                        },
                        {
                            q: "What concrete strength should I use for fence posts?",
                            a: "Most residential fence posts use standard 3,000 PSI concrete mix (ACI 211.1). Quikrete's 80 lb Concrete Mix (#1101) and Fast-Setting Concrete (#1004) both target approximately 4,000 PSI at 28 days, which exceeds the minimum for residential use. For gate posts and corner posts that carry higher lateral loads, use at least 4,000 PSI mix.",
                        },
                        {
                            q: "Can I use quick-set concrete for fence posts?",
                            a: "Yes — products like Quikrete Fast-Setting Concrete are popular for fence posts because you can pour dry mix directly into the hole around the post and add water on top, without mixing. This method works well for line posts and is IRC-compliant for residential fencing. However, mix the concrete for gate posts, corner posts, and deck posts where structural strength is critical.",
                        },
                        {
                            q: "What is the 1/3 rule for fence post depth?",
                            a: "The 1/3 rule states that the buried portion of a fence post should be approximately 1/3 of the total post length. For example, to have 6 feet of fence above grade, you'd need a 9-foot post buried 3 feet deep (⅓ of 9). This is a starting point — local frost line requirements and soil conditions may dictate a deeper hole, and that depth always takes precedence.",
                        },
                        {
                            q: "Is the fence post concrete calculator free?",
                            a: "Yes, completely free. No account, no subscription, and no limit on how many times you can use it. You can also use the Print / Save feature to export your estimate as a PDF at no cost.",
                        },
                        {
                            q: "Can I print or save my fence post estimate?",
                            a: "Yes. After clicking Calculate, a Print / Save button appears in the results section. Clicking it opens a print-optimized version of your estimate in a new tab. In your browser's print dialog, select 'Save as PDF' to export a digital copy. The printout includes all your inputs, the post count, volume breakdown, and bag comparison.",
                        },
                        {
                            q: "How accurate is the fence post concrete calculator?",
                            a: "The calculator uses exact cylindrical volume and post displacement formulas, so the math is accurate given your inputs. Real-world accuracy depends on how precisely your holes are drilled — hand-dug holes or worn auger bits can result in holes larger than the nominal diameter. Including a 10% waste factor accounts for typical field variability and ensures you don't run short.",
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
