// components/calculators/SonotubeCalc.tsx
"use client";

import { AnimatedNumber } from "./AnimatedNumber";
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
    cylinderVolume,
    multiHoleVolume,
    toFeet,
    type LengthUnit,
} from "@/lib/calc-engine";
import { CONCRETE_BAG_COVERAGE } from "@/lib/material-data";

/* =========================
   Types & Constants
========================= */

type ProjectType = "deckPost" | "fencePost" | "structuralPier";
type DiaUnit = "in" | "ft" | "cm" | "mm";
type DepthUnit = "in" | "ft" | "m" | "cm";
type BagSize = "40" | "60" | "80";

/** IBC §1809.5 / IRC R403.1.4 — footings/piers extend to frost line (36" typical). */
const FROST_LINE_MIN_IN = 36;

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
   Sonotube Reference Data
   — Common tube inside diameters and concrete volume per foot of depth.
   — Volume per ft = π × (d/24)² (d in inches → r in ft), in ft³.
========================= */

const SONOTUBE_SIZES: { dia: number; ft3PerFt: number; use: string }[] = [
    { dia: 6, ft3PerFt: Math.PI * Math.pow(6 / 24, 2), use: "Light fence & deck posts" },
    { dia: 8, ft3PerFt: Math.PI * Math.pow(8 / 24, 2), use: "Standard deck piers" },
    { dia: 10, ft3PerFt: Math.PI * Math.pow(10 / 24, 2), use: "Heavy deck / light pergola" },
    { dia: 12, ft3PerFt: Math.PI * Math.pow(12 / 24, 2), use: "Structural piers / porch" },
    { dia: 14, ft3PerFt: Math.PI * Math.pow(14 / 24, 2), use: "Light column bases" },
    { dia: 16, ft3PerFt: Math.PI * Math.pow(16 / 24, 2), use: "Column footings" },
    { dia: 18, ft3PerFt: Math.PI * Math.pow(18 / 24, 2), use: "Commercial piers" },
    { dia: 20, ft3PerFt: Math.PI * Math.pow(20 / 24, 2), use: "Heavy structural piers" },
    { dia: 24, ft3PerFt: Math.PI * Math.pow(24 / 24, 2), use: "Caisson-grade piers" },
];

/* =========================
   Main Component
========================= */

export default function SonotubeCalc() {

    /* ---------- Mode ---------- */
    const [advancedMode, setAdvancedMode] = React.useState(false);
    const [projectType, setProjectType] = React.useState<ProjectType>("deckPost");

    /* ---------- Tube dimensions ---------- */
    const [diameter, setDiameter] = React.useState("8");
    const [diaUnit, setDiaUnit] = React.useState<DiaUnit>("in");
    const [depth, setDepth] = React.useState("42");
    const [depthUnit, setDepthUnit] = React.useState<DepthUnit>("in");
    const [count, setCount] = React.useState("4");
    const [waste, setWaste] = React.useState("10");
    const [bagSize, setBagSize] = React.useState<BagSize>("80");

    /* ---------- Advanced / Cost ---------- */
    const [pricePerBag, setPricePerBag] = React.useState("");
    const [pricePerYd3, setPricePerYd3] = React.useState("");
    const [tubePrice, setTubePrice] = React.useState("");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Derived values ===================== */

    const diaNum = parseFloat(diameter) || 0;
    const depthNum = parseFloat(depth) || 0;
    const countNum = Math.max(1, Math.floor(parseFloat(count) || 0));
    const wastePct = Math.max(0, Math.min(50, parseFloat(waste) || 0));

    // Per-tube volume (ft³, yd³, m³) via shared engine
    const perTube = cylinderVolume(diaNum, depthNum, diaUnit as LengthUnit);
    // When diameter and depth use different units, recompute per-tube using a common unit (ft).
    const diaFt = toFeet(diaNum, diaUnit as LengthUnit);
    const depthFt = toFeet(depthNum, depthUnit as LengthUnit);
    const perTubeFt3 = Math.PI * Math.pow(diaFt / 2, 2) * depthFt;
    const perTubeYd3 = perTubeFt3 / 27;
    const perTubeM3 = perTubeFt3 * 0.0283168;

    // Total volume for all tubes
    const totalNetFt3 = perTubeFt3 * countNum;

    // With waste
    const totalGrossFt3 = totalNetFt3 * (1 + wastePct / 100);
    const totalGrossYd3 = totalGrossFt3 / 27;
    const totalGrossM3 = totalGrossFt3 * 0.0283168;

    // multi-hole reference (used when all dims share the same unit — keeps engine usage explicit)
    const multiHole = multiHoleVolume(diaNum, depthNum, countNum, diaUnit as LengthUnit);
    const totalEngineFt3 = diaUnit === depthUnit ? multiHole.cubicFeet : totalNetFt3;

    // Bag counts for all three standard sizes
    const bags40 = Math.ceil(totalGrossFt3 / CONCRETE_BAG_COVERAGE[40].cubicFeet);
    const bags60 = Math.ceil(totalGrossFt3 / CONCRETE_BAG_COVERAGE[60].cubicFeet);
    const bags80 = Math.ceil(totalGrossFt3 / CONCRETE_BAG_COVERAGE[80].cubicFeet);
    const selectedBagCount =
        bagSize === "40" ? bags40 : bagSize === "60" ? bags60 : bags80;

    // Weight (normal-weight concrete at 150 lb/ft³)
    const weightLbs = totalGrossFt3 * 150;

    // IBC §1809 frost-line check — compare tube depth in inches
    const depthInches = depthFt * 12;
    const ibcWarning = depthInches > 0 && depthInches < FROST_LINE_MIN_IN;

    // Cost (Advanced)
    const priceBag = parseFloat(pricePerBag) || 0;
    const priceYd3 = parseFloat(pricePerYd3) || 0;
    const priceTube = parseFloat(tubePrice) || 0;
    const bagCost = priceBag > 0 ? priceBag * selectedBagCount : 0;
    const readyMixCost = priceYd3 > 0 ? priceYd3 * totalGrossYd3 : 0;
    const tubeCost = priceTube > 0 ? priceTube * countNum : 0;
    const grandTotal = bagCost + readyMixCost + tubeCost;
    const hasCost = priceBag > 0 || priceYd3 > 0 || priceTube > 0;

    /* ===================== Presets ===================== */

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "deckPost") {
            setDiameter("8"); setDiaUnit("in");
            setDepth("42"); setDepthUnit("in");
            setCount("4"); setWaste("10"); setBagSize("80");
        } else if (pt === "fencePost") {
            setDiameter("6"); setDiaUnit("in");
            setDepth("36"); setDepthUnit("in");
            setCount("10"); setWaste("10"); setBagSize("60");
        } else {
            setDiameter("12"); setDiaUnit("in");
            setDepth("48"); setDepthUnit("in");
            setCount("6"); setWaste("10"); setBagSize("80");
        }
    }

    /* ===================== Actions ===================== */

    function handleCalculate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setSubmitted(true);
    }

    function resetAll() {
        setAdvancedMode(false);
        setProjectType("deckPost");
        setDiameter("8"); setDiaUnit("in");
        setDepth("42"); setDepthUnit("in");
        setCount("4"); setWaste("10"); setBagSize("80");
        setPricePerBag(""); setPricePerYd3(""); setTubePrice("");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Sonotube Concrete Calculator – Print View</title>
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
    <div class="meta"><div>Sonotube Concrete Calculator</div><div>Printed: ${now}</div></div>
  </div>

  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project type</div><div class="v">${projectType}</div></div>
    <div class="kv"><div class="k">Tube diameter</div><div class="v">${diameter} ${diaUnit}</div></div>
    <div class="kv"><div class="k">Tube depth</div><div class="v">${depth} ${depthUnit}</div></div>
    <div class="kv"><div class="k">Number of tubes</div><div class="v">${countNum}</div></div>
    <div class="kv"><div class="k">Waste factor</div><div class="v">${waste}%</div></div>
    <div class="kv"><div class="k">Bag size</div><div class="v">${bagSize} lb</div></div>
  </div>

  <h2>Volume &amp; Material Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">Volume per tube</div><div class="v">${nf(perTubeFt3, 3)} ft³</div></div>
    <div class="kv"><div class="k">Total net volume</div><div class="v">${nf(totalNetFt3, 2)} ft³</div></div>
    <div class="kv"><div class="k">Total w/ waste (yd³)</div><div class="v">${nf(totalGrossYd3, 2)} yd³</div></div>
    <div class="kv"><div class="k">Total w/ waste (ft³)</div><div class="v">${nf(totalGrossFt3, 2)} ft³</div></div>
    <div class="kv"><div class="k">Total w/ waste (m³)</div><div class="v">${nf(totalGrossM3, 3)} m³</div></div>
    <div class="kv"><div class="k">Total weight</div><div class="v">${nf(weightLbs, 0)} lbs</div></div>
    <div class="kv"><div class="k">40-lb bags</div><div class="v">${bags40}</div></div>
    <div class="kv"><div class="k">60-lb bags</div><div class="v">${bags60}</div></div>
    <div class="kv"><div class="k">80-lb bags</div><div class="v">${bags80}</div></div>
  </div>

  ${hasCost ? `
  <h2>Cost Estimate</h2>
  <div class="grid">
    ${bagCost > 0 ? `<div class="kv"><div class="k">Bag cost (${bagSize} lb × ${selectedBagCount})</div><div class="v">$${nf(bagCost)}</div></div>` : ""}
    ${readyMixCost > 0 ? `<div class="kv"><div class="k">Ready-mix cost</div><div class="v">$${nf(readyMixCost)}</div></div>` : ""}
    ${tubeCost > 0 ? `<div class="kv"><div class="k">Tube cost (${countNum} tubes)</div><div class="v">$${nf(tubeCost)}</div></div>` : ""}
    <div class="kv"><div class="k">Grand total</div><div class="v">$${nf(grandTotal)}</div></div>
  </div>` : ""}

  ${ibcWarning ? `<div class="warn">IBC §1809 warning: tube depth ${nf(depthInches, 1)}&quot; is shallower than the minimum 36&quot; frost-line depth commonly required for footings and piers. Verify with local frost-depth tables.</div>` : ""}

  <div class="footer">
    <p>Estimates only. Actual quantities vary with site conditions, mix, and placement methods.</p>
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

    // Silence any unused-binding linter by referencing engine call for parity with skill Phase-2 pattern
    void perTube;
    void totalEngineFt3;

    /* ===================== Render ===================== */

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Sonotube Concrete Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate concrete volume, cubic yards, pre-mixed bags, and project cost for round
                    sonotube / cardboard tube forms used in deck posts, fence posts, and structural piers.
                    Results appear after you press{" "}
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
                                { key: "deckPost", label: "Deck post (8\" × 42\")" },
                                { key: "fencePost", label: "Fence post (6\" × 36\")" },
                                { key: "structuralPier", label: "Structural pier (12\" × 48\")" },
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
                            Presets load common tube sizes and depths. Override any value below.
                        </p>
                    </section>

                    {/* ── STEP 1 — Tube Dimensions ── */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Tube Dimensions</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <Field label="Tube diameter" hint="Inside diameter of the sonotube form."
                                subHint="Common: 6, 8, 10, 12, 14, 16, 18, 20, 24&quot;">
                                <div className="flex gap-2">
                                    <NumberInput value={diameter} onChange={(v) => { setDiameter(v); setSubmitted(false); }}
                                        placeholder="8" ariaLabel="Tube diameter" />
                                    <UnitSelect value={diaUnit}
                                        onChange={(v) => { setDiaUnit(v as DiaUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "in", label: "in" },
                                            { value: "ft", label: "ft" },
                                            { value: "cm", label: "cm" },
                                            { value: "mm", label: "mm" },
                                        ]}
                                        ariaLabel="Diameter unit" />
                                </div>
                            </Field>

                            <Field label="Tube depth" hint="Depth of the hole / full tube length below grade."
                                subHint="Must extend to frost line (IBC §1809 → 36&quot; min typical)">
                                <div className="flex gap-2">
                                    <NumberInput value={depth} onChange={(v) => { setDepth(v); setSubmitted(false); }}
                                        placeholder="42" ariaLabel="Tube depth" />
                                    <UnitSelect value={depthUnit}
                                        onChange={(v) => { setDepthUnit(v as DepthUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "in", label: "in" },
                                            { value: "ft", label: "ft" },
                                            { value: "m", label: "m" },
                                            { value: "cm", label: "cm" },
                                        ]}
                                        ariaLabel="Depth unit" />
                                </div>
                            </Field>

                            <Field label="Number of tubes" hint="Total identical tubes on the project.">
                                <NumberInput value={count} onChange={(v) => {
                                    const clean = v.replace(/[^0-9]/g, "");
                                    setCount(clean);
                                    setSubmitted(false);
                                }}
                                    placeholder="4" ariaLabel="Number of tubes" />
                            </Field>
                        </div>
                    </section>

                    {/* ── STEP 2 — Waste & Bag Size ── */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Waste &amp; Bag Size</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Waste / overpour factor"
                                hint="Accounts for over-filled tubes, spillage, and cardboard expansion."
                                subHint="5–10% typical; use 10% for multiple tubes">
                                <NumberInput value={waste} onChange={(v) => { setWaste(v); setSubmitted(false); }}
                                    placeholder="10" badge="%" ariaLabel="Waste %" />
                            </Field>

                            <Field label="Primary bag size"
                                hint="Used for the hero bag-count output."
                                subHint="All three sizes are shown in results">
                                <Select value={bagSize}
                                    onValueChange={(v) => { setBagSize(v as BagSize); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass} aria-label="Bag size">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        <SelectItem value="40" className="text-white">40 lb bag (0.30 ft³)</SelectItem>
                                        <SelectItem value="60" className="text-white">60 lb bag (0.45 ft³)</SelectItem>
                                        <SelectItem value="80" className="text-white">80 lb bag (0.60 ft³)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </section>

                    {/* ── STEP 3 — Cost (Advanced) ── */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step3">
                            <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Cost Inputs</h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field label="Price per bag" hint="Cost per pre-mixed concrete bag.">
                                    <NumberInput value={pricePerBag}
                                        onChange={(v) => { setPricePerBag(v); setSubmitted(false); }}
                                        placeholder="e.g., 6.50" badge="$/bag" ariaLabel="Price per bag" />
                                </Field>
                                <Field label="Ready-mix price" hint="Alternative to bags — delivered ready-mix rate.">
                                    <NumberInput value={pricePerYd3}
                                        onChange={(v) => { setPricePerYd3(v); setSubmitted(false); }}
                                        placeholder="e.g., 160" badge="$/yd³" ariaLabel="Price per cubic yard" />
                                </Field>
                                <Field label="Tube form price" hint="Price per cardboard tube form (each).">
                                    <NumberInput value={tubePrice}
                                        onChange={(v) => { setTubePrice(v); setSubmitted(false); }}
                                        placeholder="e.g., 12" badge="$/tube" ariaLabel="Tube form price" />
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
                                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                                title="Print / Save">
                                <Printer className="h-4 w-4 mr-2" /> Print / Save
                            </Button>
                        </div>

                        {/* Inputs Summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Project type" v={projectType === "deckPost" ? "Deck post" : projectType === "fencePost" ? "Fence post" : "Structural pier"} />
                                <KV k="Diameter" v={`${diameter} ${diaUnit}`} />
                                <KV k="Depth" v={`${depth} ${depthUnit}`} />
                                <KV k="Tubes" v={`${countNum}`} />
                                <KV k="Waste" v={`${waste}%`} />
                                <KV k="Bag size" v={`${bagSize} lb`} />
                                <KV k="Mode" v={advancedMode ? "Advanced" : "Quick"} />
                            </div>
                        </div>

                        {/* Primary results — Hero number + KV grid */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Volume &amp; Material Results</div>

                            {/* Hero number */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">Total Concrete</span>
                                <span className="text-4xl font-extrabold text-teal-400"><AnimatedNumber value={totalGrossYd3} decimals={2} /></span>
                                <span className="text-xs text-slate-400 mt-1">
                                    cubic yards&nbsp;·&nbsp;includes {waste}% waste&nbsp;·&nbsp;{nf(totalGrossFt3, 1)} ft³
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Volume per tube" v={`${nf(perTubeFt3, 3)} ft³`} />
                                <KV k="Per tube (yd³)" v={`${nf(perTubeYd3, 4)} yd³`} />
                                <KV k="Per tube (m³)" v={`${nf(perTubeM3, 4)} m³`} />
                                <KV k="Total net volume" v={`${nf(totalNetFt3, 2)} ft³`} />
                                <KV k="Total w/ waste (ft³)" v={`${nf(totalGrossFt3, 2)} ft³`} />
                                <KV k="Total w/ waste (yd³)" v={`${nf(totalGrossYd3, 2)} yd³`} />
                                <KV k="Total w/ waste (m³)" v={`${nf(totalGrossM3, 3)} m³`} />
                                <KV k="Weight" v={`${nf(weightLbs, 0)} lbs`} />
                                <KV k="Waste added" v={`${nf(totalGrossFt3 - totalNetFt3, 2)} ft³`} />
                            </div>
                        </div>

                        {/* Bag breakdown */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Pre-Mixed Bag Estimates</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <KV k="40-lb bags (0.30 ft³)" v={`${bags40} bags`} />
                                <KV k="60-lb bags (0.45 ft³)" v={`${bags60} bags`} />
                                <KV k="80-lb bags (0.60 ft³)" v={`${bags80} bags`} />
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Based on <strong>CONCRETE_BAG_COVERAGE</strong>. For projects &gt; 1 yd³ ready-mix is usually more economical.
                            </p>
                        </div>

                        {/* IBC §1809 frost-line warning */}
                        {ibcWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">
                                    <strong>IBC §1809.5 / IRC R403.1.4:</strong> The tube depth ({nf(depthInches, 1)}&quot;) is
                                    shallower than the 36&quot; minimum typically required for footings/piers to extend below
                                    the frost line. Shallow piers may heave in freeze-thaw climates. Verify your local
                                    frost-depth table and consult a licensed engineer.
                                </p>
                            </div>
                        )}

                        {/* Cost (Advanced) */}
                        {advancedMode && hasCost && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {bagCost > 0 && <KV k={`Bag cost (${bagSize} lb × ${selectedBagCount})`} v={`$${nf(bagCost)}`} />}
                                    {readyMixCost > 0 && <KV k="Ready-mix cost" v={`$${nf(readyMixCost)}`} />}
                                    {tubeCost > 0 && <KV k={`Tube cost (${countNum} tubes)`} v={`$${nf(tubeCost)}`} />}
                                    <KV k="Grand total" v={`$${nf(grandTotal)}`} />
                                </div>
                                <p className="mt-2 text-xs text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                    Enter either a per-bag price or a ready-mix $/yd³ price depending on your
                                    purchase method. Prices vary by region and supplier.
                                </p>
                            </div>
                        )}

                        {/* Sonotube Size Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                Common Sonotube Sizes &amp; Volume per Foot
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            {["Diameter", "Volume per ft", "Volume per ft (yd³)", "Common use"].map((h) => (
                                                <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {SONOTUBE_SIZES.map((row) => (
                                            <tr key={row.dia} className="border-b border-slate-800 text-slate-300">
                                                <td className="py-2 px-2 font-semibold text-teal-400">{row.dia}&quot;</td>
                                                <td className="py-2 px-2">{nf(row.ft3PerFt, 4)} ft³/ft</td>
                                                <td className="py-2 px-2">{nf(row.ft3PerFt / 27, 5)} yd³/ft</td>
                                                <td className="py-2 px-2 text-white/70">{row.use}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Volume per foot = π × (D/24)² ft³ (D in inches). Multiply by tube depth and count for total concrete.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This sonotube concrete
                                    calculator provides material estimates only. Actual quantities may vary based on
                                    over-excavation, soil conditions, tube expansion, and placement methods. Always
                                    verify frost-line depth, rebar requirements, and structural adequacy with a
                                    licensed engineer or your local building department.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}