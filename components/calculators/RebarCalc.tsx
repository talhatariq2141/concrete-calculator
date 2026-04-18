// components/calculators/RebarCalc.tsx
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

/* =========================
   Types & Constants
========================= */

type BarSize = "3" | "4" | "5" | "6" | "7" | "8";
type LengthUnit = "ft" | "in" | "m";
type SpacingUnit = "in" | "ft";
type CoverUnit = "in" | "ft";
type ProjectType = "slab" | "footing" | "wall";
type Layers = "1" | "2";

type BarData = {
    label: string;
    diameter: number;   // inches
    area: number;       // sq in
    weightPerFt: number; // lbs/ft
    minClear: number;   // ACI min clear spacing inches
    commonUse: string;
};

const BAR_DATA: Record<BarSize, BarData> = {
    "3": { label: '#3 (3/8")',   diameter: 0.375, area: 0.11, weightPerFt: 0.376, minClear: 1.375, commonUse: "Ties, temperature steel, light flatwork" },
    "4": { label: '#4 (1/2")',   diameter: 0.500, area: 0.20, weightPerFt: 0.668, minClear: 1.500, commonUse: "Driveways, patios, residential footings" },
    "5": { label: '#5 (5/8")',   diameter: 0.625, area: 0.31, weightPerFt: 1.043, minClear: 1.625, commonUse: "Structural slabs, beams, columns" },
    "6": { label: '#6 (3/4")',   diameter: 0.750, area: 0.44, weightPerFt: 1.502, minClear: 1.750, commonUse: "Heavy beams, retaining walls" },
    "7": { label: '#7 (7/8")',   diameter: 0.875, area: 0.60, weightPerFt: 2.044, minClear: 1.875, commonUse: "Foundations, heavy retaining walls" },
    "8": { label: '#8 (1")',     diameter: 1.000, area: 0.79, weightPerFt: 2.670, minClear: 2.000, commonUse: "Columns, heavy structural foundations" },
};

const LOGO_URL = "/logo.svg";

/* ===================== Helpers ===================== */

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

function toFt(value: number, unit: LengthUnit | SpacingUnit | CoverUnit): number {
    if (unit === "in") return value / 12;
    if (unit === "m")  return value * 3.28084;
    return value; // ft
}

/* ===================== UI tokens (mirroring ConcreteBlockCalc) ===================== */

const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass =
    "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

/* ===================== Sub-components ===================== */

function Field({
    id,
    label,
    children,
    hint,
    subHint,
}: {
    id?: string;
    label: string;
    children: React.ReactNode;
    hint?: string;
    subHint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-teal-500 text-sm font-medium">
                {label}
            </Label>
            {children}
            {hint    && <p className="text-xs text-slate-300">{hint}</p>}
            {subHint && <p className="text-[11px] text-white/60">{subHint}</p>}
        </div>
    );
}

function NumberInput({
    id,
    value,
    onChange,
    placeholder,
    badge,
    ariaLabel,
}: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    badge?: string;
    ariaLabel?: string;
}) {
    return (
        <div className="relative">
            <Input
                id={id}
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => {
                    const v = e.target.value.replace(/,/g, "");
                    if (/^\d*\.?\d*$/.test(v) || v === "") onChange(v);
                }}
                placeholder={placeholder}
                className={fieldInputClass}
                aria-label={ariaLabel}
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
    value,
    onChange,
    options,
    ariaLabel,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    ariaLabel?: string;
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
                    <SelectItem key={o.value} value={o.value} className="text-white">
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/* =========================
   Main Component
========================= */

export default function RebarCalc() {

    /* ---------- Mode ---------- */
    const [advancedMode, setAdvancedMode] = React.useState(false);
    const [projectType, setProjectType]   = React.useState<ProjectType>("slab");

    /* ---------- Dimensions ---------- */
    const [length, setLength]   = React.useState("");
    const [lenUnit, setLenUnit] = React.useState<LengthUnit>("ft");
    const [width, setWidth]     = React.useState("");
    const [widUnit, setWidUnit] = React.useState<LengthUnit>("ft");

    /* ---------- Cover & Waste ---------- */
    const [cover, setCover]       = React.useState("2");
    const [coverUnit, setCoverUnit] = React.useState<CoverUnit>("in");
    const [waste, setWaste]       = React.useState("10");

    /* ---------- Rebar Spec ---------- */
    const [barSize, setBarSize]       = React.useState<BarSize>("4");
    const [spLen, setSpLen]           = React.useState("12");
    const [spLenUnit, setSpLenUnit]   = React.useState<SpacingUnit>("in");
    const [spWid, setSpWid]           = React.useState("12");
    const [spWidUnit, setSpWidUnit]   = React.useState<SpacingUnit>("in");
    const [layers, setLayers]         = React.useState<Layers>("1");

    /* ---------- Advanced ---------- */
    const [barLength, setBarLength]       = React.useState("20");   // stock bar length ft
    const [pricePerFt, setPricePerFt]     = React.useState("");
    const [laborPerFt, setLaborPerFt]     = React.useState("");
    const [deliveryCost, setDeliveryCost] = React.useState("");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Derived values ===================== */

    const bar          = BAR_DATA[barSize];
    const lenFt        = toFt(parseFloat(length)  || 0, lenUnit);
    const widFt        = toFt(parseFloat(width)   || 0, widUnit);
    const coverFt      = toFt(parseFloat(cover)   || 0, coverUnit);
    const wastePct     = Math.max(0, Math.min(50, parseFloat(waste) || 0));
    const wasteFactor  = 1 + wastePct / 100;
    const spLenFt      = toFt(parseFloat(spLen)   || 12, spLenUnit);
    const spWidFt      = toFt(parseFloat(spWid)   || 12, spWidUnit);
    const layerCount   = parseInt(layers);
    const stockLenFt   = parseFloat(barLength) || 20;
    const pPerFt       = parseFloat(pricePerFt)   || 0;
    const pLabor       = parseFloat(laborPerFt)   || 0;
    const pDelivery    = parseFloat(deliveryCost) || 0;

    // Net spans inside cover
    const netLen = Math.max(0, lenFt - 2 * coverFt);
    const netWid = Math.max(0, widFt - 2 * coverFt);

    // Bars running along width-direction (spaced along length)
    const barsAlongLen = spLenFt > 0 ? Math.floor(netLen / spLenFt) + 1 : 0;
    // Bars running along length-direction (spaced along width)
    const barsAlongWid = spWidFt > 0 ? Math.floor(netWid / spWidFt) + 1 : 0;

    // Each bar's clear length
    const barLenForAlongLen = widFt; // bars spanning width
    const barLenForAlongWid = lenFt; // bars spanning length

    const rawLfAlongLen = barsAlongLen * barLenForAlongLen * layerCount;
    const rawLfAlongWid = barsAlongWid * barLenForAlongWid * layerCount;
    const rawTotalLf    = rawLfAlongLen + rawLfAlongWid;

    const totalLf    = rawTotalLf * wasteFactor;
    const totalBars  = (barsAlongLen + barsAlongWid) * layerCount;
    const totalWtLbs = totalLf * bar.weightPerFt;
    const totalWtTon = totalWtLbs / 2000;
    const area       = lenFt * widFt;

    // Stock bars needed
    const stockBarsNeeded = stockLenFt > 0 ? Math.ceil(totalLf / stockLenFt) : 0;

    // ACI spacing warning: min clear = bar diameter + 1"
    const minClearIn = bar.diameter + 1;
    const spLenIn    = spLenFt * 12;
    const spWidIn    = spWidFt * 12;
    const spacingWarning =
        (spLenIn > 0 && spLenIn < minClearIn) ||
        (spWidIn > 0 && spWidIn < minClearIn);

    // Cost
    const materialCost = totalLf * pPerFt;
    const laborCostTotal = totalLf * pLabor;
    const grandTotal  = materialCost + laborCostTotal + pDelivery;
    const hasCost     = pPerFt > 0 || pLabor > 0 || pDelivery > 0;

    /* ===================== Project-type presets ===================== */

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "slab") {
            setLength("20"); setLenUnit("ft");
            setWidth("20");  setWidUnit("ft");
            setCover("2");   setCoverUnit("in");
            setSpLen("12"); setSpLenUnit("in");
            setSpWid("12"); setSpWidUnit("in");
            setLayers("1"); setBarSize("4");
        } else if (pt === "footing") {
            setLength("40"); setLenUnit("ft");
            setWidth("18");  setWidUnit("in");
            setCover("3");   setCoverUnit("in");
            setSpLen("18"); setSpLenUnit("in");
            setSpWid("0");  setSpWidUnit("in");
            setLayers("1"); setBarSize("5");
        } else {
            setLength("30"); setLenUnit("ft");
            setWidth("8");   setWidUnit("ft");
            setCover("2");   setCoverUnit("in");
            setSpLen("12"); setSpLenUnit("in");
            setSpWid("12"); setSpWidUnit("in");
            setLayers("2"); setBarSize("5");
        }
    }

    /* ===================== Actions ===================== */

    function handleCalculate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setSubmitted(true);
    }

    function resetAll() {
        setAdvancedMode(false);
        setProjectType("slab");
        setLength(""); setLenUnit("ft");
        setWidth("");  setWidUnit("ft");
        setCover("2"); setCoverUnit("in");
        setWaste("10");
        setBarSize("4");
        setSpLen("12"); setSpLenUnit("in");
        setSpWid("12"); setSpWidUnit("in");
        setLayers("1");
        setBarLength("20");
        setPricePerFt("");
        setLaborPerFt("");
        setDeliveryCost("");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml() {
        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Rebar Calculator – Print View</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{box-sizing:border-box}body{margin:0;background:#fff;color:#0f172a;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
  .container{max-width:960px;margin:0 auto;padding:24px}
  .header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;margin-bottom:20px}
  .brand{display:flex;align-items:center;gap:10px}.brand img{height:36px}.brand-name{font-weight:800;font-size:18px;color:#0f766e}
  .meta{margin-left:auto;text-align:right;color:#475569;font-size:12px}
  h2{font-size:16px;margin:18px 0 8px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .kv{display:flex;align-items:center;justify-content:space-between;border:1px solid #e5e7eb;border-radius:6px;padding:8px;margin-bottom:4px}
  .kv .k{color:#475569}.kv .v{color:#0f766e;font-weight:700}
  .label{text-transform:uppercase;letter-spacing:.02em;font-size:11px;color:#64748b}
  .value-md{font-size:18px;font-weight:800;color:#0f766e}
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
    <div class="meta"><div>Rebar Calculator</div><div>Printed: ${now}</div></div>
  </div>

  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project Type</div><div class="v">${projectType}</div></div>
    <div class="kv"><div class="k">Length</div><div class="v">${length} ${lenUnit}</div></div>
    <div class="kv"><div class="k">Width</div><div class="v">${width} ${widUnit}</div></div>
    <div class="kv"><div class="k">Bar Size</div><div class="v">${bar.label}</div></div>
    <div class="kv"><div class="k">Spacing (L-dir)</div><div class="v">${spLen} ${spLenUnit}</div></div>
    <div class="kv"><div class="k">Spacing (W-dir)</div><div class="v">${spWid} ${spWidUnit}</div></div>
    <div class="kv"><div class="k">Layers</div><div class="v">${layers}</div></div>
    <div class="kv"><div class="k">Cover</div><div class="v">${cover} ${coverUnit}</div></div>
    <div class="kv"><div class="k">Waste</div><div class="v">${waste}%</div></div>
  </div>

  <h2>Results — Rebar Quantity</h2>
  <div class="grid">
    <div class="kv"><div class="k">Total Bars</div><div class="v">${nf(totalBars, 0)} pcs</div></div>
    <div class="kv"><div class="k">Total Linear Footage</div><div class="v">${nf(totalLf, 1)} lf</div></div>
    <div class="kv"><div class="k">Total Weight</div><div class="v">${nf(totalWtLbs, 0)} lbs</div></div>
    <div class="kv"><div class="k">Weight in Tons</div><div class="v">${nf(totalWtTon, 3)} tons</div></div>
    <div class="kv"><div class="k">Coverage Area</div><div class="v">${nf(area, 1)} sq ft</div></div>
    ${advancedMode ? `<div class="kv"><div class="k">Stock Bars (${stockLenFt} ft)</div><div class="v">${nf(stockBarsNeeded, 0)} bars</div></div>` : ""}
  </div>

  <h2>Directional Breakdown</h2>
  <div class="grid-2">
    <div>
      <div class="kv"><div class="k">Bars along length (span width)</div><div class="v">${barsAlongLen * layerCount} bars × ${nf(barLenForAlongLen, 1)} ft</div></div>
      <div class="kv"><div class="k">Linear footage</div><div class="v">${nf(rawLfAlongLen * wasteFactor, 1)} lf</div></div>
    </div>
    <div>
      <div class="kv"><div class="k">Bars along width (span length)</div><div class="v">${barsAlongWid * layerCount} bars × ${nf(barLenForAlongWid, 1)} ft</div></div>
      <div class="kv"><div class="k">Linear footage</div><div class="v">${nf(rawLfAlongWid * wasteFactor, 1)} lf</div></div>
    </div>
  </div>

  ${hasCost ? `
  <h2>Cost Estimate</h2>
  <div class="grid">
    ${pPerFt > 0  ? `<div class="kv"><div class="k">Material Cost</div><div class="v">$${nf(materialCost)}</div></div>` : ""}
    ${pLabor > 0  ? `<div class="kv"><div class="k">Labor Cost</div><div class="v">$${nf(laborCostTotal)}</div></div>` : ""}
    ${pDelivery > 0 ? `<div class="kv"><div class="k">Delivery</div><div class="v">$${nf(pDelivery)}</div></div>` : ""}
    <div class="kv"><div class="k">Grand Total</div><div class="v">$${nf(grandTotal)}</div></div>
  </div>` : ""}

  <div class="footer">
    <p>Estimates only. Actual quantities vary by layout, lap-splice lengths, site conditions, and engineer specifications.</p>
    <p>Tip: In your browser's Print dialog choose "Save as PDF" to keep a digital copy.</p>
  </div>
</div>
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),100));</script>
</body>
</html>`;
    }

    function handlePrint() {
        if (!submitted) return;
        const w = window.open("", "_blank");
        if (!w) {
            alert("Please allow pop-ups for this site to use Print/Save.");
            return;
        }
        w.document.open();
        w.document.write(buildPrintHtml());
        w.document.close();
        w.focus();
    }

    /* ===================== Render ===================== */

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Rebar Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate rebar quantity, total footage, weight, and cost for slabs, footings, and walls.
                    Results appear after you press{" "}
                    <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate} className="space-y-0">

                    {/* MODE TOGGLE */}
                    <section className={stepClass} aria-labelledby="modeToggle">
                        <div className="flex items-center justify-between">
                            <h3 id="modeToggle" className="text-sm font-semibold text-white/80">
                                Estimate Mode
                            </h3>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => { setAdvancedMode(false); setSubmitted(false); }}
                                    className={cn(
                                        "h-9 rounded-sm text-sm",
                                        !advancedMode
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600"
                                    )}
                                >
                                    Quick
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => { setAdvancedMode(true); setSubmitted(false); }}
                                    className={cn(
                                        "h-9 rounded-sm text-sm",
                                        advancedMode
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600"
                                    )}
                                >
                                    Advanced
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* PROJECT TYPE */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">
                            Project Type
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {(["slab", "footing", "wall"] as ProjectType[]).map((pt) => (
                                <Button
                                    key={pt}
                                    type="button"
                                    onClick={() => applyPreset(pt)}
                                    className={cn(
                                        "h-9 rounded-sm text-sm capitalize",
                                        projectType === pt
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600"
                                    )}
                                >
                                    {pt === "footing" ? "Strip Footing" : pt.charAt(0).toUpperCase() + pt.slice(1)}
                                </Button>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">
                            Selecting a project type loads sensible defaults. You can override any value below.
                        </p>
                    </section>

                    {/* STEP 1 — Dimensions */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">
                            Step 1 — Dimensions
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field
                                label="Length"
                                hint={projectType === "footing" ? "Total run of footing." : "Slab / wall length."}
                                subHint="First span dimension"
                            >
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={length}
                                        onChange={(v) => { setLength(v); setSubmitted(false); }}
                                        placeholder="e.g., 20"
                                        badge=""
                                        ariaLabel="Length"
                                    />
                                    <UnitSelect
                                        value={lenUnit}
                                        onChange={(v) => { setLenUnit(v as LengthUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }, { value: "m", label: "m" }]}
                                        ariaLabel="Length unit"
                                    />
                                </div>
                            </Field>

                            <Field
                                label="Width"
                                hint={projectType === "footing" ? "Footing width (depth of trench)." : "Slab / wall width."}
                                subHint="Second span dimension"
                            >
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={width}
                                        onChange={(v) => { setWidth(v); setSubmitted(false); }}
                                        placeholder="e.g., 20"
                                        badge=""
                                        ariaLabel="Width"
                                    />
                                    <UnitSelect
                                        value={widUnit}
                                        onChange={(v) => { setWidUnit(v as LengthUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }, { value: "m", label: "m" }]}
                                        ariaLabel="Width unit"
                                    />
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* STEP 2 — Cover & Waste */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">
                            Step 2 — Cover &amp; Waste
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field
                                label="Concrete Cover (edge setback)"
                                hint="Distance from edge to first bar."
                                subHint="Typically 2–3 in for slabs, 3 in for footings"
                            >
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={cover}
                                        onChange={(v) => { setCover(v); setSubmitted(false); }}
                                        placeholder="2"
                                        ariaLabel="Cover"
                                    />
                                    <UnitSelect
                                        value={coverUnit}
                                        onChange={(v) => { setCoverUnit(v as CoverUnit); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Cover unit"
                                    />
                                </div>
                            </Field>

                            <Field
                                label="Waste / Overlap Factor"
                                hint="Added for laps, cuts, and off-cuts."
                                subHint="10% typical; 15–20% for complex layouts"
                            >
                                <NumberInput
                                    value={waste}
                                    onChange={(v) => { setWaste(v); setSubmitted(false); }}
                                    placeholder="10"
                                    badge="%"
                                    ariaLabel="Waste percentage"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* STEP 3 — Rebar Specification */}
                    <section className={stepClass} aria-labelledby="step3">
                        <h3 id="step3" className="text-sm font-semibold text-white/80">
                            Step 3 — Rebar Specification
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <Field label="Bar Size" hint="ASTM standard deformed bar size.">
                                <Select
                                    value={barSize}
                                    onValueChange={(v) => { setBarSize(v as BarSize); setSubmitted(false); }}
                                >
                                    <SelectTrigger className={selectTriggerClass} aria-label="Bar size">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.keys(BAR_DATA) as BarSize[]).map((k) => (
                                            <SelectItem key={k} value={k} className="text-white">
                                                {BAR_DATA[k].label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Spacing — length direction"
                                hint="Center-to-center along the length axis."
                            >
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={spLen}
                                        onChange={(v) => { setSpLen(v); setSubmitted(false); }}
                                        placeholder="12"
                                        ariaLabel="Spacing along length"
                                    />
                                    <UnitSelect
                                        value={spLenUnit}
                                        onChange={(v) => { setSpLenUnit(v as SpacingUnit); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Spacing unit"
                                    />
                                </div>
                            </Field>

                            <Field
                                label="Spacing — width direction"
                                hint="Center-to-center along the width axis."
                                subHint="Set to 0 to skip this direction"
                            >
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={spWid}
                                        onChange={(v) => { setSpWid(v); setSubmitted(false); }}
                                        placeholder="12"
                                        ariaLabel="Spacing along width"
                                    />
                                    <UnitSelect
                                        value={spWidUnit}
                                        onChange={(v) => { setSpWidUnit(v as SpacingUnit); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Spacing unit width"
                                    />
                                </div>
                            </Field>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field
                                label="Rebar Layers"
                                hint="Double-layer mats used for structural slabs 6″+."
                            >
                                <Select
                                    value={layers}
                                    onValueChange={(v) => { setLayers(v as Layers); setSubmitted(false); }}
                                >
                                    <SelectTrigger className={selectTriggerClass} aria-label="Layers">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        <SelectItem value="1" className="text-white">Single layer</SelectItem>
                                        <SelectItem value="2" className="text-white">Double layer (mat)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {/* Bar size quick reference inline */}
                            <div className="rounded-sm border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-300 space-y-1">
                                <p className="text-teal-400 font-semibold mb-1">Selected bar — {bar.label}</p>
                                <p>Diameter: <span className="text-white">{bar.diameter}&quot;</span></p>
                                <p>Area: <span className="text-white">{bar.area} in²</span></p>
                                <p>Weight: <span className="text-white">{bar.weightPerFt} lb/ft</span></p>
                                <p>Min ACI clear spacing: <span className="text-white">{bar.minClear}&quot;</span></p>
                                <p className="text-white/60 italic">{bar.commonUse}</p>
                            </div>
                        </div>

                        {/* ACI Spacing Warning */}
                        {spacingWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">
                                    Spacing is tighter than the ACI 318 minimum clear spacing of{" "}
                                    <strong>{bar.minClear}&quot;</strong> for #{barSize} bars. Consider increasing spacing
                                    or reducing bar size.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* STEP 4 — Advanced Options */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step4">
                            <h3 id="step4" className="text-sm font-semibold text-white/80">
                                Step 4 — Advanced Options
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field
                                    label="Stock Bar Length"
                                    hint="Standard purchased bar length."
                                    subHint="Used to estimate how many bars to order"
                                >
                                    <NumberInput
                                        value={barLength}
                                        onChange={(v) => { setBarLength(v); setSubmitted(false); }}
                                        placeholder="20"
                                        badge="ft"
                                        ariaLabel="Stock bar length"
                                    />
                                </Field>

                                <Field
                                    label="Material Price per Linear Foot"
                                    hint="Rebar purchase price."
                                >
                                    <NumberInput
                                        value={pricePerFt}
                                        onChange={(v) => { setPricePerFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 0.65"
                                        badge="$/ft"
                                        ariaLabel="Price per linear foot"
                                    />
                                </Field>

                                <Field
                                    label="Labor per Linear Foot"
                                    hint="Optional installation cost."
                                >
                                    <NumberInput
                                        value={laborPerFt}
                                        onChange={(v) => { setLaborPerFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 0.30"
                                        badge="$/ft"
                                        ariaLabel="Labor per linear foot"
                                    />
                                </Field>

                                <Field
                                    label="Delivery / Misc Cost"
                                    hint="Optional lump-sum delivery or other fees."
                                >
                                    <NumberInput
                                        value={deliveryCost}
                                        onChange={(v) => { setDeliveryCost(v); setSubmitted(false); }}
                                        placeholder="e.g., 150"
                                        badge="$"
                                        ariaLabel="Delivery cost"
                                    />
                                </Field>
                            </div>
                            <p className="mt-3 text-xs text-white/60 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                Cost fields are optional. Leave blank to skip cost estimation.
                            </p>
                        </section>
                    )}

                    {/* ACTIONS */}
                    <section className={stepClass} aria-labelledby="actions">
                        <h3 id="actions" className="text-sm font-semibold text-white/80">
                            Actions
                        </h3>
                        <div className="mt-2 flex flex-col sm:flex-row gap-2">
                            <Button
                                type="submit"
                                className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0"
                            >
                                Calculate
                            </Button>
                            <Button
                                type="button"
                                onClick={resetAll}
                                className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
                            >
                                Reset
                            </Button>
                        </div>
                    </section>
                </form>

                {/* ==================== RESULTS ==================== */}
                {!submitted ? (
                    <p className="mt-4 text-sm text-white/70">
                        Enter values above and press{" "}
                        <span className="font-semibold">Calculate</span> to reveal results.
                    </p>
                ) : (
                    <>
                        {/* Print button */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                type="button"
                                onClick={handlePrint}
                                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                                title="Print / Save"
                            >
                                <Printer className="h-4 w-4 mr-2" /> Print / Save
                            </Button>
                        </div>

                        {/* Inputs Summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Project Type"         v={projectType.charAt(0).toUpperCase() + projectType.slice(1)} />
                                <KV k="Length"               v={`${length || 0} ${lenUnit}`} />
                                <KV k="Width"                v={`${width || 0} ${widUnit}`} />
                                <KV k="Bar Size"             v={bar.label} />
                                <KV k="Spacing (L-dir)"      v={`${spLen} ${spLenUnit}`} />
                                <KV k="Spacing (W-dir)"      v={spWid !== "0" ? `${spWid} ${spWidUnit}` : "N/A"} />
                                <KV k="Layers"               v={layers === "2" ? "Double layer" : "Single layer"} />
                                <KV k="Cover"                v={`${cover} ${coverUnit}`} />
                                <KV k="Waste"                v={`${waste}%`} />
                            </div>
                        </div>

                        {/* Primary Results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Rebar Quantity Results</div>

                            {/* Hero number */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">Total Linear Footage</span>
                                <span className="text-4xl font-extrabold text-teal-400"><AnimatedNumber value={totalLf} decimals={1} /></span>
                                <span className="text-xs text-slate-400 mt-1">linear feet (includes {waste}% waste)</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Total Bars"           v={`${nf(totalBars, 0)} pcs`} />
                                <KV k="Total Linear Footage" v={`${nf(totalLf, 1)} lf`} />
                                <KV k="Total Weight"         v={`${nf(totalWtLbs, 0)} lbs`} />
                                <KV k="Weight in Tons"       v={`${nf(totalWtTon, 3)} US tons`} />
                                <KV k="Coverage Area"        v={`${nf(area, 1)} sq ft`} />
                                {advancedMode && (
                                    <KV k={`Stock Bars (${stockLenFt} ft each)`} v={`${nf(stockBarsNeeded, 0)} bars`} />
                                )}
                            </div>
                        </div>

                        {/* Directional Breakdown */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">Directional Breakdown</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {/* Length-direction */}
                                <div className="rounded-sm border border-slate-700 bg-slate-800/50 p-3 space-y-2">
                                    <p className="text-teal-400 font-semibold text-xs uppercase tracking-wide mb-2">
                                        Bars spanning width (spaced along length)
                                    </p>
                                    <KV k="Bar count"         v={`${barsAlongLen * layerCount} bars`} />
                                    <KV k="Each bar length"   v={`${nf(barLenForAlongLen, 1)} ft`} />
                                    <KV k="Linear footage"    v={`${nf(rawLfAlongLen * wasteFactor, 1)} lf`} />
                                </div>
                                {/* Width-direction */}
                                <div className="rounded-sm border border-slate-700 bg-slate-800/50 p-3 space-y-2">
                                    <p className="text-teal-400 font-semibold text-xs uppercase tracking-wide mb-2">
                                        Bars spanning length (spaced along width)
                                    </p>
                                    {barsAlongWid > 0 ? (
                                        <>
                                            <KV k="Bar count"       v={`${barsAlongWid * layerCount} bars`} />
                                            <KV k="Each bar length" v={`${nf(barLenForAlongWid, 1)} ft`} />
                                            <KV k="Linear footage"  v={`${nf(rawLfAlongWid * wasteFactor, 1)} lf`} />
                                        </>
                                    ) : (
                                        <p className="text-xs text-white/50 italic">
                                            Width-direction spacing set to 0 — skipped.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bar Size Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">Rebar Size Reference</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">Size</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">Diameter</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">Area (in²)</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">lb / ft</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium hidden sm:table-cell">Common use</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Object.keys(BAR_DATA) as BarSize[]).map((k) => (
                                            <tr
                                                key={k}
                                                className={cn(
                                                    "border-b border-slate-800",
                                                    k === barSize
                                                        ? "bg-teal-900/30 text-teal-300"
                                                        : "text-slate-300"
                                                )}
                                            >
                                                <td className="py-2 px-2 font-semibold">#{k}</td>
                                                <td className="py-2 px-2">{BAR_DATA[k].diameter}&quot;</td>
                                                <td className="py-2 px-2">{BAR_DATA[k].area}</td>
                                                <td className="py-2 px-2">{BAR_DATA[k].weightPerFt}</td>
                                                <td className="py-2 px-2 hidden sm:table-cell text-white/60">{BAR_DATA[k].commonUse}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Currently selected bar highlighted. Weights per ASTM A615/A706.
                            </p>
                        </div>

                        {/* Cost Estimate (Advanced only) */}
                        {advancedMode && hasCost && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    {pPerFt > 0   && <KV k="Material Cost"  v={`$${nf(materialCost)}`} />}
                                    {pLabor > 0   && <KV k="Labor Cost"     v={`$${nf(laborCostTotal)}`} />}
                                    {pDelivery > 0 && <KV k="Delivery"      v={`$${nf(pDelivery)}`} />}
                                    <KV k="Grand Total" v={`$${nf(grandTotal)}`} />
                                </div>
                                <p className="mt-2 text-xs text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                    Cost estimate based on entered prices per linear foot × total footage with waste.
                                </p>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This rebar calculator provides
                                    project estimates only. Actual bar count, footage, weight, and cost may vary based on
                                    lap-splice lengths, hook allowances, engineer specifications, site conditions, and
                                    local code requirements. Always verify with a licensed structural engineer for
                                    structural applications.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
