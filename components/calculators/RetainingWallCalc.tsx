// components/calculators/RetainingWallCalc.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Info, Printer, AlertTriangle } from "lucide-react";
import {
    toFeet,
    blockCount,
    rectangularVolume,
    gravelWeight,
    applyWaste,
    materialCost,
    type LengthUnit,
} from "@/lib/calc-engine";

/* =========================
   Types & Constants
========================= */

type ProjectType = "garden" | "standard" | "engineered";
type DimUnit = Extract<LengthUnit, "ft" | "in" | "m" | "cm">;
type GravelKey = "crushed" | "pea" | "river";

/**
 * Retaining wall block size catalog.
 * L/H in inches (face dimensions — controlling for block count).
 * D = thickness into the earth. weightLbs = nominal per-block weight.
 *
 * Sources: manufacturer data (Allan Block, Versa-Lok, Keystone) —
 * nominal dimensions consistent with TEK 15-8A (NCMA segmental retaining walls).
 */
const RETAIN_BLOCKS = [
    { key: "garden", label: "Small garden block (12 × 4 × 8 in)", L: 12, H: 4, D: 8, weightLbs: 20 },
    { key: "medium", label: "Medium SRW block (16 × 6 × 10 in)", L: 16, H: 6, D: 10, weightLbs: 50 },
    { key: "standard", label: "Standard SRW block (18 × 8 × 12 in)", L: 18, H: 8, D: 12, weightLbs: 80 },
    { key: "large", label: "Large gravity block (24 × 8 × 18 in)", L: 24, H: 8, D: 18, weightLbs: 120 },
    { key: "custom", label: "Custom size", L: 0, H: 0, D: 0, weightLbs: 0 },
] as const;

type BlockKey = (typeof RETAIN_BLOCKS)[number]["key"];

/**
 * Drainage gravel densities (lb/ft³) for typical retaining-wall backfill.
 * Crushed stone #57/#67 is the standard drainage aggregate behind SRWs.
 */
const GRAVEL_OPTIONS: Record<GravelKey, { label: string; lbPerFt3: number }> = {
    crushed: { label: "Crushed stone #57 (drainage)", lbPerFt3: 100 },
    pea: { label: "Pea gravel", lbPerFt3: 96 },
    river: { label: "River rock", lbPerFt3: 105 },
};

/** IBC 2021 §1807.2.3 — retaining walls > 4 ft (unbalanced fill) require engineered design. */
const IBC_HEIGHT_THRESHOLD_FT = 4;

const LOGO_URL = "/logo.svg";

/* ===================== Helpers ===================== */

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

/* ===================== UI Tokens — verbatim from skill ===================== */

const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";

const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";

const selectContentClass =
    "rounded-sm border border-slate-700 bg-slate-900 text-white";

const stepClass = "pt-6 mt-4 border-t border-slate-800";

/* ===================== Sub-components ===================== */

function Field({
    id, label, children, hint, subHint,
}: {
    id?: string; label: string; children: React.ReactNode; hint?: string; subHint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-teal-500 text-sm font-medium">{label}</Label>
            {children}
            {hint && <p className="text-xs text-slate-300">{hint}</p>}
            {subHint && <p className="text-[11px] text-white/60">{subHint}</p>}
        </div>
    );
}

function NumberInput({
    id, value, onChange, placeholder, badge, ariaLabel,
}: {
    id?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; badge?: string; ariaLabel?: string;
}) {
    return (
        <div className="relative">
            <Input
                id={id} type="text" inputMode="decimal" value={value}
                onChange={(e) => {
                    const v = e.target.value.replace(/,/g, "");
                    if (/^\d*\.?\d*$/.test(v) || v === "") onChange(v);
                }}
                placeholder={placeholder} className={fieldInputClass} aria-label={ariaLabel}
            />
            {badge && (
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">
                    {badge}
                </span>
            )}
        </div>
    );
}

function KV({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex justify-between items-center rounded-sm border border-slate-700 px-3 py-2">
            <span className="text-slate-300 text-xs">{k}</span>
            <span className="text-teal-400 font-semibold text-sm">{v}</span>
        </div>
    );
}

function UnitSelect({
    value, onChange, options, ariaLabel,
}: {
    value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[]; ariaLabel?: string;
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                className="h-11 w-24 shrink-0 rounded-sm border border-slate-700 bg-slate-700 text-white focus-visible:ring-0 focus:border-teal-400"
                aria-label={ariaLabel}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
                {options.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-white">{o.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/* =========================
   Main Component
========================= */

export default function RetainingWallCalc() {

    /* ---------- Mode & preset ---------- */
    const [advancedMode, setAdvancedMode] = React.useState(false);
    const [projectType, setProjectType] = React.useState<ProjectType>("standard");

    /* ---------- Wall dimensions ---------- */
    const [wallLength, setWallLength] = React.useState("30");
    const [lenUnit, setLenUnit] = React.useState<DimUnit>("ft");
    const [wallHeight, setWallHeight] = React.useState("4");
    const [heightUnit, setHeightUnit] = React.useState<DimUnit>("ft");

    /* ---------- Block selection ---------- */
    const [blockKey, setBlockKey] = React.useState<BlockKey>("standard");
    const [customBlockL, setCustomBlockL] = React.useState("18");
    const [customBlockH, setCustomBlockH] = React.useState("8");

    /* ---------- Backfill gravel ---------- */
    const [backfillDepth, setBackfillDepth] = React.useState("12");
    const [backfillUnit, setBackfillUnit] = React.useState<DimUnit>("in");
    const [gravelKey, setGravelKey] = React.useState<GravelKey>("crushed");

    /* ---------- Waste ---------- */
    const [waste, setWaste] = React.useState("10");

    /* ---------- Advanced — geogrid ---------- */
    const [includeGeogrid, setIncludeGeogrid] = React.useState(true);
    const [geogridEmbedmentPct, setGeogridEmbedmentPct] = React.useState("60");
    const [geogridLayerSpacing, setGeogridLayerSpacing] = React.useState("2"); // courses between layers

    /* ---------- Advanced — cost ---------- */
    const [pricePerBlock, setPricePerBlock] = React.useState("");
    const [pricePerTonGravel, setPricePerTonGravel] = React.useState("");
    const [geogridCostPerSqFt, setGeogridCostPerSqFt] = React.useState("");
    const [laborPerSqFt, setLaborPerSqFt] = React.useState("");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Derived block dims ===================== */

    const selectedBlock = RETAIN_BLOCKS.find((b) => b.key === blockKey) ?? RETAIN_BLOCKS[2];
    const isCustomBlock = selectedBlock.key === "custom";
    const blockL_in = isCustomBlock ? (parseFloat(customBlockL) || 0) : selectedBlock.L;
    const blockH_in = isCustomBlock ? (parseFloat(customBlockH) || 0) : selectedBlock.H;

    /* ===================== Derived values ===================== */

    const lenFt = toFeet(parseFloat(wallLength) || 0, lenUnit);
    const heightFt = toFeet(parseFloat(wallHeight) || 0, heightUnit);
    const backfillFt = toFeet(parseFloat(backfillDepth) || 0, backfillUnit);
    const wastePct = Math.max(0, Math.min(50, parseFloat(waste) || 0));

    const wallFaceAreaFt2 = lenFt * heightFt;

    // Block count via shared engine. Retaining walls are dry-stacked → no mortar bags.
    // blockCount(wallLenFt, wallHeightFt, blockL_in, blockH_in, wastePct, openingsAreaFt2, blocksPerMortarBag=0)
    const blockResult = blockCount(
        lenFt,
        heightFt,
        blockL_in,
        blockH_in,
        wastePct,
        0,
        0, // 0 → mortarBags = 0 (dry-stacked SRW)
    );

    // Drainage gravel volume behind wall: length × height × backfill depth
    const drainageVol = rectangularVolume(lenFt, heightFt, backfillFt, "ft");
    const withWasteGravel = applyWaste(drainageVol.cubicYards, wastePct);
    const drainageGravelYd3 = withWasteGravel.total;
    const drainageGravelFt3 = drainageVol.cubicFeet * (1 + wastePct / 100);
    const gravelDensity = GRAVEL_OPTIONS[gravelKey].lbPerFt3;
    const gravelWt = gravelWeight(drainageGravelFt3, gravelDensity);

    // Geogrid reinforcement (advanced, only meaningful for walls > 4 ft)
    const embedmentPct = Math.max(20, Math.min(120, parseFloat(geogridEmbedmentPct) || 0));
    const layerSpacing = Math.max(1, parseInt(geogridLayerSpacing) || 1);
    const geogridRequired = heightFt > IBC_HEIGHT_THRESHOLD_FT;
    const numCourses = blockH_in > 0 ? Math.ceil((heightFt * 12) / blockH_in) : 0;
    const numGeogridLayers = geogridRequired && layerSpacing > 0
        ? Math.max(0, Math.floor(numCourses / layerSpacing) - 1)
        : 0;
    const embedmentFt = heightFt * (embedmentPct / 100);
    const geogridAreaFt2 = includeGeogrid ? numGeogridLayers * lenFt * embedmentFt : 0;

    // Total wall weight (informational)
    const totalWallWeightLbs = blockResult.blocksNeeded * selectedBlock.weightLbs;

    // Cost estimation (advanced)
    const blockPrice = parseFloat(pricePerBlock) || 0;
    const gravelPrice = parseFloat(pricePerTonGravel) || 0;
    const geogridPrice = parseFloat(geogridCostPerSqFt) || 0;
    const laborPrice = parseFloat(laborPerSqFt) || 0;

    const blockCost = materialCost(blockResult.blocksNeeded, blockPrice).subtotal;
    const gravelCost = materialCost(gravelWt.tons, gravelPrice).subtotal;
    const geogridCost = materialCost(geogridAreaFt2, geogridPrice).subtotal;
    const laborCost = materialCost(wallFaceAreaFt2, laborPrice).subtotal;
    const grandTotal = blockCost + gravelCost + geogridCost + laborCost;
    const hasCost =
        blockPrice > 0 || gravelPrice > 0 || geogridPrice > 0 || laborPrice > 0;

    // IBC compliance warning
    const ibcWarning = heightFt > IBC_HEIGHT_THRESHOLD_FT;

    /* ===================== Presets ===================== */

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "garden") {
            setWallLength("20"); setLenUnit("ft");
            setWallHeight("2"); setHeightUnit("ft");
            setBlockKey("garden");
            setBackfillDepth("8"); setBackfillUnit("in");
            setGravelKey("crushed");
            setWaste("10");
            setIncludeGeogrid(false);
        } else if (pt === "standard") {
            setWallLength("30"); setLenUnit("ft");
            setWallHeight("4"); setHeightUnit("ft");
            setBlockKey("standard");
            setBackfillDepth("12"); setBackfillUnit("in");
            setGravelKey("crushed");
            setWaste("10");
            setIncludeGeogrid(true);
            setGeogridEmbedmentPct("60");
            setGeogridLayerSpacing("2");
        } else {
            setWallLength("40"); setLenUnit("ft");
            setWallHeight("6"); setHeightUnit("ft");
            setBlockKey("large");
            setBackfillDepth("18"); setBackfillUnit("in");
            setGravelKey("crushed");
            setWaste("10");
            setIncludeGeogrid(true);
            setGeogridEmbedmentPct("70");
            setGeogridLayerSpacing("2");
        }
    }

    /* ===================== Actions ===================== */

    function handleCalculate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setSubmitted(true);
    }

    function resetAll() {
        setAdvancedMode(false);
        setProjectType("standard");
        setWallLength("30"); setLenUnit("ft");
        setWallHeight("4"); setHeightUnit("ft");
        setBlockKey("standard");
        setCustomBlockL("18"); setCustomBlockH("8");
        setBackfillDepth("12"); setBackfillUnit("in");
        setGravelKey("crushed");
        setWaste("10");
        setIncludeGeogrid(true);
        setGeogridEmbedmentPct("60");
        setGeogridLayerSpacing("2");
        setPricePerBlock(""); setPricePerTonGravel("");
        setGeogridCostPerSqFt(""); setLaborPerSqFt("");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Retaining Wall Calculator – Print View</title>
<style>
  *{box-sizing:border-box}body{margin:0;background:#fff;color:#0f172a;font:14px/1.5 system-ui,-apple-system,sans-serif}
  .container{max-width:960px;margin:0 auto;padding:24px}
  .header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;margin-bottom:20px}
  .brand{display:flex;align-items:center;gap:10px}.brand img{height:36px}.brand-name{font-weight:800;font-size:18px;color:#0f766e}
  .meta{margin-left:auto;text-align:right;color:#475569;font-size:12px}
  h2{font-size:16px;margin:18px 0 8px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .kv{display:flex;align-items:center;justify-content:space-between;border:1px solid #e5e7eb;border-radius:6px;padding:8px;margin-bottom:4px}
  .kv .k{color:#475569}.kv .v{color:#0f766e;font-weight:700}
  .warn{color:#b45309;background:#fef3c7;border:1px solid #fcd34d;border-radius:6px;padding:8px;margin:8px 0;font-size:12px}
  .footer{margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px}
  @media print{@page{margin:12mm}.footer{page-break-inside:avoid}}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="brand">
      <img src="${LOGO_URL}" alt="Concrete Calculator Max" onerror="this.style.display='none'"/>
      <div class="brand-name">Concrete Calculator Max</div>
    </div>
    <div class="meta"><div>Retaining Wall Calculator</div><div>Printed: ${now}</div></div>
  </div>

  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project type</div><div class="v">${projectType.charAt(0).toUpperCase() + projectType.slice(1)}</div></div>
    <div class="kv"><div class="k">Wall length</div><div class="v">${wallLength} ${lenUnit}</div></div>
    <div class="kv"><div class="k">Wall height</div><div class="v">${wallHeight} ${heightUnit}</div></div>
    <div class="kv"><div class="k">Block size</div><div class="v">${selectedBlock.label}</div></div>
    <div class="kv"><div class="k">Backfill depth</div><div class="v">${backfillDepth} ${backfillUnit}</div></div>
    <div class="kv"><div class="k">Gravel type</div><div class="v">${GRAVEL_OPTIONS[gravelKey].label}</div></div>
    <div class="kv"><div class="k">Waste factor</div><div class="v">${waste}%</div></div>
  </div>

  <h2>Block &amp; Material Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">Blocks needed</div><div class="v">${nf(blockResult.blocksNeeded, 0)}</div></div>
    <div class="kv"><div class="k">Courses</div><div class="v">${nf(blockResult.courses, 0)}</div></div>
    <div class="kv"><div class="k">Blocks per course</div><div class="v">${nf(blockResult.blocksPerCourse, 0)}</div></div>
    <div class="kv"><div class="k">Wall face area</div><div class="v">${nf(wallFaceAreaFt2, 1)} sq ft</div></div>
    <div class="kv"><div class="k">Total block weight</div><div class="v">${nf(totalWallWeightLbs, 0)} lbs</div></div>
    <div class="kv"><div class="k">Drainage gravel (yd³)</div><div class="v">${nf(drainageGravelYd3, 2)} yd³</div></div>
    <div class="kv"><div class="k">Drainage gravel (tons)</div><div class="v">${nf(gravelWt.tons, 2)} tons</div></div>
    ${geogridAreaFt2 > 0 ? `<div class="kv"><div class="k">Geogrid reinforcement</div><div class="v">${nf(geogridAreaFt2, 0)} sq ft (${numGeogridLayers} layers)</div></div>` : ""}
  </div>

  ${hasCost ? `
  <h2>Cost Estimate</h2>
  <div class="grid">
    ${blockCost > 0 ? `<div class="kv"><div class="k">Block material</div><div class="v">$${nf(blockCost)}</div></div>` : ""}
    ${gravelCost > 0 ? `<div class="kv"><div class="k">Drainage gravel</div><div class="v">$${nf(gravelCost)}</div></div>` : ""}
    ${geogridCost > 0 ? `<div class="kv"><div class="k">Geogrid</div><div class="v">$${nf(geogridCost)}</div></div>` : ""}
    ${laborCost > 0 ? `<div class="kv"><div class="k">Labor</div><div class="v">$${nf(laborCost)}</div></div>` : ""}
    <div class="kv"><div class="k">Grand total</div><div class="v">$${nf(grandTotal)}</div></div>
  </div>` : ""}

  ${ibcWarning ? `<div class="warn">IBC 2021 §1807.2.3: Retaining walls over 4 ft (unbalanced backfill) require engineered design by a licensed professional. This estimate is for material take-off only and does not replace structural analysis.</div>` : ""}

  <div class="footer">
    <p>Estimates only. Actual quantities vary by block manufacturer, site conditions, and engineering details.</p>
    <p>Tip: In your browser's Print dialog, choose "Save as PDF" to keep a digital copy.</p>
  </div>
</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),100));</script>
</body>
</html>`;
    }

    function handlePrint() {
        if (!submitted) return;
        const w = window.open("", "_blank");
        if (!w) { alert("Please allow pop-ups to use Print/Save."); return; }
        w.document.open();
        w.document.write(buildPrintHtml());
        w.document.close();
        w.focus();
    }

    /* ===================== Render ===================== */

    const dimUnitOptions = [
        { value: "ft", label: "ft" },
        { value: "in", label: "in" },
        { value: "m", label: "m" },
        { value: "cm", label: "cm" },
    ];

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Retaining Wall Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate retaining-wall block count, drainage gravel, geogrid reinforcement, and total project cost
                    for segmental retaining walls. Results appear after you press{" "}
                    <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate} className="space-y-0">

                    {/* ── MODE TOGGLE ── */}
                    <section className={stepClass} aria-labelledby="modeToggle">
                        <div className="flex items-center justify-between">
                            <h3 id="modeToggle" className="text-sm font-semibold text-white/80">Estimate Mode</h3>
                            <div className="flex gap-2">
                                <Button type="button"
                                    onClick={() => { setAdvancedMode(false); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        !advancedMode ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    Quick
                                </Button>
                                <Button type="button"
                                    onClick={() => { setAdvancedMode(true); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        advancedMode ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    Advanced
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* ── PROJECT TYPE PRESETS ── */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">Project Type</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {([
                                { key: "garden", label: "Small garden (2 ft)" },
                                { key: "standard", label: "Standard retaining (4 ft)" },
                                { key: "engineered", label: "Engineered wall (6 ft+)" },
                            ] as { key: ProjectType; label: string }[]).map(({ key, label }) => (
                                <Button key={key} type="button" onClick={() => applyPreset(key)}
                                    className={cn("h-9 rounded-sm text-sm",
                                        projectType === key
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    {label}
                                </Button>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">
                            Presets load typical dimensions, block sizes, and geogrid defaults. Override any value below.
                        </p>
                    </section>

                    {/* ── STEP 1 — Wall dimensions ── */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Wall Dimensions</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Wall length" hint="Total length along the top of the wall."
                                subHint="Measured on the finished face">
                                <div className="flex gap-2">
                                    <NumberInput value={wallLength}
                                        onChange={(v) => { setWallLength(v); setSubmitted(false); }}
                                        placeholder="30" ariaLabel="Wall length" />
                                    <UnitSelect value={lenUnit}
                                        onChange={(v) => { setLenUnit(v as DimUnit); setSubmitted(false); }}
                                        options={dimUnitOptions} ariaLabel="Wall length unit" />
                                </div>
                            </Field>

                            <Field label="Wall height" hint="Exposed face height from grade to top course."
                                subHint="Walls over 4 ft require engineering per IBC 2021 §1807.2.3">
                                <div className="flex gap-2">
                                    <NumberInput value={wallHeight}
                                        onChange={(v) => { setWallHeight(v); setSubmitted(false); }}
                                        placeholder="4" ariaLabel="Wall height" />
                                    <UnitSelect value={heightUnit}
                                        onChange={(v) => { setHeightUnit(v as DimUnit); setSubmitted(false); }}
                                        options={dimUnitOptions} ariaLabel="Wall height unit" />
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* ── STEP 2 — Block selection ── */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Block Size</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Retaining-wall block"
                                hint="Face dimensions control block count."
                                subHint="Typical SRW weights: 20–120 lbs per block">
                                <Select value={blockKey} onValueChange={(v) => { setBlockKey(v as BlockKey); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass} aria-label="Block size">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {RETAIN_BLOCKS.map((b) => (
                                            <SelectItem key={b.key} value={b.key} className="text-white">
                                                {b.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            {isCustomBlock ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Custom length (in)">
                                        <NumberInput value={customBlockL}
                                            onChange={(v) => { setCustomBlockL(v); setSubmitted(false); }}
                                            placeholder="18" badge="in" ariaLabel="Custom block length" />
                                    </Field>
                                    <Field label="Custom height (in)">
                                        <NumberInput value={customBlockH}
                                            onChange={(v) => { setCustomBlockH(v); setSubmitted(false); }}
                                            placeholder="8" badge="in" ariaLabel="Custom block height" />
                                    </Field>
                                </div>
                            ) : (
                                <Field label="Waste / breakage allowance"
                                    hint="Covers cutting, corner blocks, and damage."
                                    subHint="10% typical; 15% for curved walls">
                                    <NumberInput value={waste}
                                        onChange={(v) => { setWaste(v); setSubmitted(false); }}
                                        placeholder="10" badge="%" ariaLabel="Waste %" />
                                </Field>
                            )}
                        </div>
                        {isCustomBlock && (
                            <div className="mt-4">
                                <Field label="Waste / breakage allowance"
                                    hint="Covers cutting, corner blocks, and damage."
                                    subHint="10% typical; 15% for curved walls">
                                    <NumberInput value={waste}
                                        onChange={(v) => { setWaste(v); setSubmitted(false); }}
                                        placeholder="10" badge="%" ariaLabel="Waste %" />
                                </Field>
                            </div>
                        )}
                    </section>

                    {/* ── STEP 3 — Drainage gravel ── */}
                    <section className={stepClass} aria-labelledby="step3">
                        <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Drainage Gravel (Behind Wall)</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Backfill depth"
                                hint="Depth of free-draining gravel behind wall."
                                subHint="NCMA recommends 12 in minimum drainage zone">
                                <div className="flex gap-2">
                                    <NumberInput value={backfillDepth}
                                        onChange={(v) => { setBackfillDepth(v); setSubmitted(false); }}
                                        placeholder="12" ariaLabel="Backfill depth" />
                                    <UnitSelect value={backfillUnit}
                                        onChange={(v) => { setBackfillUnit(v as DimUnit); setSubmitted(false); }}
                                        options={dimUnitOptions} ariaLabel="Backfill unit" />
                                </div>
                            </Field>

                            <Field label="Gravel type"
                                hint="Crushed #57/#67 is the standard drainage aggregate.">
                                <Select value={gravelKey}
                                    onValueChange={(v) => { setGravelKey(v as GravelKey); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass} aria-label="Gravel type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.keys(GRAVEL_OPTIONS) as GravelKey[]).map((k) => (
                                            <SelectItem key={k} value={k} className="text-white">
                                                {GRAVEL_OPTIONS[k].label} — {GRAVEL_OPTIONS[k].lbPerFt3} lb/ft³
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </section>

                    {/* ── STEP 4 — Geogrid (Advanced) ── */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step4">
                            <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Geogrid Reinforcement</h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field label="Include geogrid?"
                                    hint="Required for walls &gt; 4 ft per most manufacturer specs."
                                    subHint="Geogrid tied-back layers increase wall stability">
                                    <Select value={includeGeogrid ? "yes" : "no"}
                                        onValueChange={(v) => { setIncludeGeogrid(v === "yes"); setSubmitted(false); }}>
                                        <SelectTrigger className={selectTriggerClass} aria-label="Include geogrid">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            <SelectItem value="yes" className="text-white">Yes — include geogrid</SelectItem>
                                            <SelectItem value="no" className="text-white">No — gravity wall only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field label="Embedment depth"
                                    hint="Geogrid length tied back into soil."
                                    subHint="60–70% of wall height typical">
                                    <NumberInput value={geogridEmbedmentPct}
                                        onChange={(v) => { setGeogridEmbedmentPct(v); setSubmitted(false); }}
                                        placeholder="60" badge="%" ariaLabel="Embedment %" />
                                </Field>

                                <Field label="Layer spacing (courses)"
                                    hint="Vertical spacing between geogrid layers."
                                    subHint="Every 2 courses is typical for 4–6 ft walls">
                                    <NumberInput value={geogridLayerSpacing}
                                        onChange={(v) => { setGeogridLayerSpacing(v); setSubmitted(false); }}
                                        placeholder="2" badge="courses" ariaLabel="Geogrid layer spacing" />
                                </Field>
                            </div>
                            {!geogridRequired && includeGeogrid && (
                                <p className="mt-2 text-[11px] text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                    Walls ≤ 4 ft may not require geogrid. Gravity-block designs are usually sufficient at this height.
                                </p>
                            )}
                        </section>
                    )}

                    {/* ── STEP 5 — Cost (Advanced) ── */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step5">
                            <h3 id="step5" className="text-sm font-semibold text-white/80">Step 5 — Cost Inputs</h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Field label="Price per block">
                                    <NumberInput value={pricePerBlock}
                                        onChange={(v) => { setPricePerBlock(v); setSubmitted(false); }}
                                        placeholder="e.g., 6.50" badge="$" ariaLabel="Price per block" />
                                </Field>
                                <Field label="Gravel price">
                                    <NumberInput value={pricePerTonGravel}
                                        onChange={(v) => { setPricePerTonGravel(v); setSubmitted(false); }}
                                        placeholder="e.g., 45" badge="$/ton" ariaLabel="Gravel price per ton" />
                                </Field>
                                <Field label="Geogrid price">
                                    <NumberInput value={geogridCostPerSqFt}
                                        onChange={(v) => { setGeogridCostPerSqFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 0.85" badge="$/sq ft" ariaLabel="Geogrid price per sq ft" />
                                </Field>
                                <Field label="Labor">
                                    <NumberInput value={laborPerSqFt}
                                        onChange={(v) => { setLaborPerSqFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 18" badge="$/sq ft" ariaLabel="Labor per sq ft" />
                                </Field>
                            </div>
                            <p className="mt-2 text-[11px] text-white/60 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                All cost fields are optional. Leave blank to skip cost estimate.
                            </p>
                        </section>
                    )}

                    {/* ── ACTIONS ── */}
                    <section className={stepClass} aria-labelledby="actions">
                        <h3 id="actions" className="text-sm font-semibold text-white/80">Actions</h3>
                        <div className="mt-2 flex flex-col sm:flex-row gap-2">
                            <Button type="submit"
                                className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0">
                                Calculate
                            </Button>
                            <Button type="button" onClick={resetAll}
                                className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400">
                                Reset
                            </Button>
                        </div>
                    </section>
                </form>

                {/* ==================== RESULTS ==================== */}
                {!submitted ? (
                    <p className="mt-4 text-sm text-white/70">
                        Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
                    </p>
                ) : (
                    <>
                        {/* Print */}
                        <div className="mt-4 flex justify-end">
                            <Button type="button" onClick={handlePrint}
                                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400">
                                <Printer className="h-4 w-4 mr-2" /> Print / Save
                            </Button>
                        </div>

                        {/* Inputs summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Project type" v={projectType.charAt(0).toUpperCase() + projectType.slice(1)} />
                                <KV k="Wall length" v={`${wallLength} ${lenUnit}`} />
                                <KV k="Wall height" v={`${wallHeight} ${heightUnit}`} />
                                <KV k="Block size" v={selectedBlock.label} />
                                <KV k="Backfill depth" v={`${backfillDepth} ${backfillUnit}`} />
                                <KV k="Gravel" v={GRAVEL_OPTIONS[gravelKey].label} />
                                <KV k="Waste" v={`${waste}%`} />
                                <KV k="Mode" v={advancedMode ? "Advanced" : "Quick"} />
                            </div>
                        </div>

                        {/* Primary results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Block &amp; Wall Results</div>

                            {/* Hero number */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">Blocks Needed</span>
                                <span className="text-4xl font-extrabold text-teal-400">{nf(blockResult.blocksNeeded, 0)}</span>
                                <span className="text-xs text-slate-400 mt-1">
                                    includes {waste}% waste&nbsp;·&nbsp;{nf(blockResult.courses, 0)} courses × {nf(blockResult.blocksPerCourse, 0)}/course
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Blocks needed" v={`${nf(blockResult.blocksNeeded, 0)}`} />
                                <KV k="Courses" v={`${nf(blockResult.courses, 0)}`} />
                                <KV k="Blocks per course" v={`${nf(blockResult.blocksPerCourse, 0)}`} />
                                <KV k="Wall face area" v={`${nf(wallFaceAreaFt2, 1)} sq ft`} />
                                <KV k="Wall weight (total)" v={`${nf(totalWallWeightLbs, 0)} lbs`} />
                                <KV k="Weight per block" v={`${nf(selectedBlock.weightLbs, 0)} lbs`} />
                            </div>
                        </div>

                        {/* Drainage gravel */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Drainage Gravel (Behind Wall)</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Volume (yd³)" v={`${nf(drainageGravelYd3, 2)} yd³`} />
                                <KV k="Volume (ft³)" v={`${nf(drainageGravelFt3, 1)} ft³`} />
                                <KV k="Volume (m³)" v={`${nf(drainageVol.cubicMeters * (1 + wastePct / 100), 2)} m³`} />
                                <KV k="Weight (tons)" v={`${nf(gravelWt.tons, 2)} tons`} />
                                <KV k="Weight (lbs)" v={`${nf(gravelWt.pounds, 0)} lbs`} />
                                <KV k="Density used" v={`${gravelDensity} lb/ft³`} />
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Volume = wall length × height × backfill depth. Include 12 in minimum drainage zone per NCMA TEK 15-8A.
                            </p>
                        </div>

                        {/* Geogrid */}
                        {advancedMode && includeGeogrid && geogridAreaFt2 > 0 && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Geogrid Reinforcement</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <KV k="Geogrid layers" v={`${numGeogridLayers}`} />
                                    <KV k="Layer spacing" v={`every ${layerSpacing} courses`} />
                                    <KV k="Embedment depth" v={`${nf(embedmentFt, 1)} ft (${embedmentPct}%)`} />
                                    <KV k="Length per layer" v={`${nf(lenFt, 1)} ft`} />
                                    <KV k="Total geogrid area" v={`${nf(geogridAreaFt2, 0)} sq ft`} />
                                    <KV k="Total geogrid (m²)" v={`${nf(geogridAreaFt2 * 0.092903, 1)} m²`} />
                                </div>
                            </div>
                        )}

                        {/* Cost */}
                        {advancedMode && hasCost && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {blockCost > 0 && <KV k="Block material" v={`$${nf(blockCost)}`} />}
                                    {gravelCost > 0 && <KV k="Drainage gravel" v={`$${nf(gravelCost)}`} />}
                                    {geogridCost > 0 && <KV k="Geogrid" v={`$${nf(geogridCost)}`} />}
                                    {laborCost > 0 && <KV k="Labor" v={`$${nf(laborCost)}`} />}
                                    <KV k="Grand total" v={`$${nf(grandTotal)}`} />
                                    <KV k="Cost per sq ft" v={`$${nf(wallFaceAreaFt2 > 0 ? grandTotal / wallFaceAreaFt2 : 0)}`} />
                                </div>
                            </div>
                        )}

                        {/* Reference table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                Retaining Wall Block Size Reference
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            {["Block class", "Face L × H", "Depth", "Weight", "Typical use"].map((h) => (
                                                <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { cls: "Small garden", lh: "12 × 4 in", d: "8 in", wt: "~20 lbs", use: "Planters, edging, walls ≤ 2 ft" },
                                            { cls: "Medium SRW", lh: "16 × 6 in", d: "10 in", wt: "~50 lbs", use: "Terraces, walls 2–4 ft" },
                                            { cls: "Standard SRW", lh: "18 × 8 in", d: "12 in", wt: "~80 lbs", use: "Residential walls 3–6 ft" },
                                            { cls: "Large gravity", lh: "24 × 8 in", d: "18 in", wt: "~120 lbs", use: "Engineered walls 4–10 ft" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-slate-800 text-slate-300">
                                                <td className="py-2 px-2 font-medium">{row.cls}</td>
                                                <td className="py-2 px-2 text-teal-400 font-semibold">{row.lh}</td>
                                                <td className="py-2 px-2">{row.d}</td>
                                                <td className="py-2 px-2">{row.wt}</td>
                                                <td className="py-2 px-2 text-white/60">{row.use}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Nominal manufacturer sizes (Allan Block, Versa-Lok, Keystone). Weights vary by aggregate mix.
                            </p>
                        </div>

                        {/* IBC compliance warning */}
                        {ibcWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">
                                    <strong>IBC 2021 §1807.2.3:</strong> Retaining walls over 4 ft
                                    ({nf(heightFt, 1)} ft entered) with unbalanced backfill require engineered
                                    design by a licensed professional. This calculator provides material take-off
                                    only and does not replace a signed structural analysis for geogrid layout, base
                                    leveling pad, or global-stability checks.
                                </p>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This retaining wall
                                    calculator provides material estimates only. Block counts, drainage gravel,
                                    and geogrid quantities vary by manufacturer, soil type, surcharge loading,
                                    site slope, and groundwater conditions. Always verify geogrid layout, base-leveling
                                    pad dimensions, and wall cross-section with a licensed engineer for any wall
                                    over 4 ft tall or supporting surcharge loads.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}