// components/calculators/RebarWeightCalc.tsx
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
import { Info, Printer, AlertTriangle, Plus, Trash2 } from "lucide-react";

/* =========================
   Types & Constants
========================= */

type BarSize = "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
type CalcMode = "single" | "multi" | "target";
type LengthUnit = "ft" | "m";
type WeightUnit = "lbs" | "tons" | "kg";

type BarData = {
    diameter: number;    // inches
    area: number;        // in²
    lbPerFt: number;     // lbs per linear foot — ASTM A615/A706
    kgPerM: number;      // kg per metre
    commonUse: string;
};

/** ASTM A615 / A706 published unit weights */
const BAR_DATA: Record<BarSize, BarData> = {
    "3":  { diameter: 0.375, area: 0.11, lbPerFt: 0.376, kgPerM: 0.560, commonUse: "Temperature / shrinkage ties, light flatwork" },
    "4":  { diameter: 0.500, area: 0.20, lbPerFt: 0.668, kgPerM: 0.994, commonUse: "Driveways, patios, residential footings" },
    "5":  { diameter: 0.625, area: 0.31, lbPerFt: 1.043, kgPerM: 1.552, commonUse: "Structural slabs, beams, residential columns" },
    "6":  { diameter: 0.750, area: 0.44, lbPerFt: 1.502, kgPerM: 2.235, commonUse: "Heavy beams, retaining walls" },
    "7":  { diameter: 0.875, area: 0.60, lbPerFt: 2.044, kgPerM: 3.042, commonUse: "Foundations, large retaining walls" },
    "8":  { diameter: 1.000, area: 0.79, lbPerFt: 2.670, kgPerM: 3.973, commonUse: "Heavy columns, mat foundations" },
    "9":  { diameter: 1.128, area: 1.00, lbPerFt: 3.400, kgPerM: 5.060, commonUse: "Bridge decks, transfer slabs" },
    "10": { diameter: 1.270, area: 1.27, lbPerFt: 4.303, kgPerM: 6.404, commonUse: "High-rise columns, heavy structural members" },
};

/** Suspiciously high footage threshold per bar for ASTM plausibility warning */
const IMPLAUSIBLE_LF_THRESHOLD = 50_000; // linear feet

const LOGO_URL = "/logo.svg";

/** Unique id generator for multi-bar rows */
let _nextId = 1;
function uid() { return _nextId++; }

type MultiBarRow = {
    id: number;
    barSize: BarSize;
    footage: string;
    stockLen: string;
    waste: string;
};

/* ===================== Helpers ===================== */

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

function toFt(v: number, unit: LengthUnit): number {
    return unit === "m" ? v * 3.28084 : v;
}

function toLbs(v: number, unit: WeightUnit): number {
    if (unit === "tons") return v * 2000;
    if (unit === "kg")   return v * 2.20462;
    return v;
}

/* ===================== UI Tokens ===================== */

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
    id, value, onChange, placeholder, badge, ariaLabel,
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
    value, onChange, options, ariaLabel,
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

function BarSizeSelect({
    value, onChange, ariaLabel,
}: {
    value: BarSize;
    onChange: (v: BarSize) => void;
    ariaLabel?: string;
}) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as BarSize)}>
            <SelectTrigger className={selectTriggerClass} aria-label={ariaLabel}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
                {(Object.keys(BAR_DATA) as BarSize[]).map((k) => (
                    <SelectItem key={k} value={k} className="text-white">
                        #{k} ({BAR_DATA[k].diameter}&quot;)
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/* =========================
   Main Component
========================= */

export default function RebarWeightCalc() {

    /* ---------- Mode ---------- */
    const [calcMode, setCalcMode]       = React.useState<CalcMode>("single");
    const [advancedMode, setAdvancedMode] = React.useState(false);

    /* ---------- Single-bar state ---------- */
    const [sBarSize, setSBarSize]     = React.useState<BarSize>("4");
    const [sFootage, setSFootage]     = React.useState("500");
    const [sLenUnit, setSLenUnit]     = React.useState<LengthUnit>("ft");
    const [sWaste, setSWaste]         = React.useState("10");
    const [sStockLen, setSStockLen]   = React.useState("20");
    const [sPricePerTon, setSPrice]   = React.useState("");
    const [sDelivery, setSDelivery]   = React.useState("");

    /* ---------- Multi-bar state ---------- */
    const [multiRows, setMultiRows] = React.useState<MultiBarRow[]>([
        { id: uid(), barSize: "4", footage: "500", stockLen: "20", waste: "10" },
        { id: uid(), barSize: "5", footage: "300", stockLen: "20", waste: "10" },
    ]);
    const [mPricePerTon, setMPrice]   = React.useState("");
    const [mDelivery, setMDelivery]   = React.useState("");

    /* ---------- Target-weight state ---------- */
    const [tBarSize, setTBarSize]     = React.useState<BarSize>("5");
    const [tWeight, setTWeight]       = React.useState("2");
    const [tWeightUnit, setTWtUnit]   = React.useState<WeightUnit>("tons");
    const [tStockLen, setTStockLen]   = React.useState("20");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Presets ===================== */

    function applyPreset(preset: "residential" | "commercial" | "bridge" | "reverse") {
        setSubmitted(false);
        if (preset === "residential") {
            setCalcMode("single");
            setSBarSize("4"); setSFootage("500"); setSLenUnit("ft");
            setSWaste("10"); setSStockLen("20"); setSPrice(""); setSDelivery("");
        } else if (preset === "commercial") {
            setCalcMode("multi");
            setMultiRows([
                { id: uid(), barSize: "5", footage: "800",  stockLen: "20", waste: "10" },
                { id: uid(), barSize: "6", footage: "400",  stockLen: "20", waste: "10" },
                { id: uid(), barSize: "8", footage: "200",  stockLen: "20", waste: "10" },
            ]);
            setMPrice("850"); setMDelivery("200");
        } else if (preset === "bridge") {
            setCalcMode("single");
            setSBarSize("9"); setSFootage("2000"); setSLenUnit("ft");
            setSWaste("15"); setSStockLen("20"); setSPrice("950"); setSDelivery("");
        } else {
            setCalcMode("target");
            setTBarSize("5"); setTWeight("2"); setTWtUnit("tons"); setTStockLen("20");
        }
    }

    /* ===================== Derived — Single mode ===================== */

    const sBar        = BAR_DATA[sBarSize];
    const sNetLf      = toFt(parseFloat(sFootage) || 0, sLenUnit);
    const sWasteFrac  = Math.max(0, Math.min(50, parseFloat(sWaste) || 0)) / 100;
    const sGrossLf    = sNetLf * (1 + sWasteFrac);
    const sLbs        = sGrossLf * sBar.lbPerFt;
    const sTons       = sLbs / 2000;
    const sKg         = sLbs * 0.453592;
    const sStockFt    = parseFloat(sStockLen) || 20;
    const sBarsNeeded = sStockFt > 0 ? Math.ceil(sGrossLf / sStockFt) : 0;
    const sPriceTon   = parseFloat(sPricePerTon) || 0;
    const sDelCost    = parseFloat(sDelivery) || 0;
    const sMatCost    = sPriceTon > 0 ? sTons * sPriceTon : 0;
    const sGrandTotal = sMatCost + sDelCost;
    const sHasCost    = sPriceTon > 0 || sDelCost > 0;

    // ASTM A615 plausibility warning: footage implausibly high for a single procurement order
    const sAstmWarning = sGrossLf > IMPLAUSIBLE_LF_THRESHOLD;

    /* ===================== Derived — Multi mode ===================== */

    type RowResult = {
        row: MultiBarRow;
        bar: BarData;
        netLf: number;
        grossLf: number;
        lbs: number;
        tons: number;
        barsNeeded: number;
    };

    const multiResults: RowResult[] = multiRows.map((row) => {
        const bar       = BAR_DATA[row.barSize];
        const netLf     = parseFloat(row.footage) || 0;
        const wasteFrac = Math.max(0, Math.min(50, parseFloat(row.waste) || 0)) / 100;
        const grossLf   = netLf * (1 + wasteFrac);
        const lbs       = grossLf * bar.lbPerFt;
        const tons      = lbs / 2000;
        const stockFt   = parseFloat(row.stockLen) || 20;
        const barsNeeded = stockFt > 0 ? Math.ceil(grossLf / stockFt) : 0;
        return { row, bar, netLf, grossLf, lbs, tons, barsNeeded };
    });

    const mTotalLbs   = multiResults.reduce((s, r) => s + r.lbs, 0);
    const mTotalTons  = mTotalLbs / 2000;
    const mTotalKg    = mTotalLbs * 0.453592;
    const mTotalBars  = multiResults.reduce((s, r) => s + r.barsNeeded, 0);
    const mPriceTon   = parseFloat(mPricePerTon) || 0;
    const mDelCost    = parseFloat(mDelivery) || 0;
    const mMatCost    = mPriceTon > 0 ? mTotalTons * mPriceTon : 0;
    const mGrandTotal = mMatCost + mDelCost;
    const mHasCost    = mPriceTon > 0 || mDelCost > 0;

    /* ===================== Derived — Target mode ===================== */

    const tBar       = BAR_DATA[tBarSize];
    const tLbsTarget = toLbs(parseFloat(tWeight) || 0, tWeightUnit);
    const tTons      = tLbsTarget / 2000;
    const tKg        = tLbsTarget * 0.453592;
    const tLinFt     = tBar.lbPerFt > 0 ? tLbsTarget / tBar.lbPerFt : 0;
    const tStockFt   = parseFloat(tStockLen) || 20;
    const tBarsNeeded = tStockFt > 0 ? Math.ceil(tLinFt / tStockFt) : 0;

    /* ===================== Multi-row management ===================== */

    function addMultiRow() {
        if (multiRows.length >= 6) return;
        setMultiRows((prev) => [
            ...prev,
            { id: uid(), barSize: "4", footage: "", stockLen: "20", waste: "10" },
        ]);
        setSubmitted(false);
    }

    function removeMultiRow(id: number) {
        if (multiRows.length <= 1) return;
        setMultiRows((prev) => prev.filter((r) => r.id !== id));
        setSubmitted(false);
    }

    function updateMultiRow(id: number, field: keyof Omit<MultiBarRow, "id">, value: string) {
        setMultiRows((prev) =>
            prev.map((r) => r.id === id ? { ...r, [field]: value } : r)
        );
        setSubmitted(false);
    }

    /* ===================== Actions ===================== */

    function handleCalculate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setSubmitted(true);
    }

    function resetAll() {
        setCalcMode("single");
        setAdvancedMode(false);
        setSBarSize("4"); setSFootage("500"); setSLenUnit("ft");
        setSWaste("10"); setSStockLen("20"); setSPrice(""); setSDelivery("");
        setMultiRows([
            { id: uid(), barSize: "4", footage: "500", stockLen: "20", waste: "10" },
            { id: uid(), barSize: "5", footage: "300", stockLen: "20", waste: "10" },
        ]);
        setMPrice(""); setMDelivery("");
        setTBarSize("5"); setTWeight("2"); setTWtUnit("tons"); setTStockLen("20");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        const modeLabel =
            calcMode === "single" ? "Single Bar Size" :
            calcMode === "multi"  ? "Multi-Bar Mix" :
                                    "Target Weight (Reverse)";

        let resultSection = "";

        if (calcMode === "single") {
            resultSection = `
  <h2>Results — Single Bar (#${sBarSize})</h2>
  <div class="grid">
    <div class="kv"><div class="k">Net footage</div><div class="v">${nf(sNetLf, 1)} ft</div></div>
    <div class="kv"><div class="k">Gross w/ waste</div><div class="v">${nf(sGrossLf, 1)} ft</div></div>
    <div class="kv"><div class="k">Weight (lbs)</div><div class="v">${nf(sLbs, 0)} lbs</div></div>
    <div class="kv"><div class="k">Weight (tons)</div><div class="v">${nf(sTons, 3)} US tons</div></div>
    <div class="kv"><div class="k">Weight (kg)</div><div class="v">${nf(sKg, 1)} kg</div></div>
    <div class="kv"><div class="k">Bars to order</div><div class="v">${nf(sBarsNeeded, 0)} bars</div></div>
    ${sHasCost ? `<div class="kv"><div class="k">Grand total</div><div class="v">$${nf(sGrandTotal)}</div></div>` : ""}
  </div>`;
        } else if (calcMode === "multi") {
            const rowsHtml = multiResults.map((r) =>
                `<div class="kv"><div class="k">#${r.row.barSize} — ${nf(r.netLf, 0)} ft net</div>
                 <div class="v">${nf(r.grossLf, 1)} ft gross · ${nf(r.lbs, 0)} lbs · ${nf(r.tons, 3)} tons · ${r.barsNeeded} bars</div></div>`
            ).join("");
            resultSection = `
  <h2>Results — Multi-Bar Mix</h2>
  <div class="grid">
    <div class="kv"><div class="k">Total weight (lbs)</div><div class="v">${nf(mTotalLbs, 0)} lbs</div></div>
    <div class="kv"><div class="k">Total weight (tons)</div><div class="v">${nf(mTotalTons, 3)} US tons</div></div>
    <div class="kv"><div class="k">Total weight (kg)</div><div class="v">${nf(mTotalKg, 1)} kg</div></div>
    <div class="kv"><div class="k">Total bars</div><div class="v">${nf(mTotalBars, 0)} bars</div></div>
    ${mHasCost ? `<div class="kv"><div class="k">Grand total</div><div class="v">$${nf(mGrandTotal)}</div></div>` : ""}
  </div>
  <h2>Per-Bar Breakdown</h2>${rowsHtml}`;
        } else {
            resultSection = `
  <h2>Results — Reverse (Target Weight)</h2>
  <div class="grid">
    <div class="kv"><div class="k">Target weight</div><div class="v">${tWeight} ${tWeightUnit}</div></div>
    <div class="kv"><div class="k">Equivalent lbs</div><div class="v">${nf(tLbsTarget, 0)} lbs</div></div>
    <div class="kv"><div class="k">Linear footage</div><div class="v">${nf(tLinFt, 1)} ft</div></div>
    <div class="kv"><div class="k">Bars to order</div><div class="v">${nf(tBarsNeeded, 0)} bars (${tStockFt} ft each)</div></div>
    <div class="kv"><div class="k">Equivalent kg</div><div class="v">${nf(tKg, 1)} kg</div></div>
  </div>`;
        }

        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Rebar Weight Calculator – Print View</title>
<style>
  *{box-sizing:border-box}body{margin:0;background:#fff;color:#0f172a;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
  .container{max-width:960px;margin:0 auto;padding:24px}
  .header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;margin-bottom:20px}
  .brand{display:flex;align-items:center;gap:10px}.brand img{height:36px}.brand-name{font-weight:800;font-size:18px;color:#0f766e}
  .meta{margin-left:auto;text-align:right;color:#475569;font-size:12px}
  h2{font-size:16px;margin:18px 0 8px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .kv{display:flex;align-items:center;justify-content:space-between;border:1px solid #e5e7eb;border-radius:6px;padding:8px;margin-bottom:4px}
  .kv .k{color:#475569}.kv .v{color:#0f766e;font-weight:700}
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
    <div class="meta"><div>Rebar Weight Calculator</div><div>Printed: ${now}</div></div>
  </div>
  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Mode</div><div class="v">${modeLabel}</div></div>
    ${calcMode === "single" ? `
    <div class="kv"><div class="k">Bar size</div><div class="v">#${sBarSize}</div></div>
    <div class="kv"><div class="k">Net footage</div><div class="v">${sFootage} ${sLenUnit}</div></div>
    <div class="kv"><div class="k">Waste</div><div class="v">${sWaste}%</div></div>
    <div class="kv"><div class="k">Stock length</div><div class="v">${sStockLen} ft</div></div>` : ""}
    ${calcMode === "target" ? `
    <div class="kv"><div class="k">Bar size</div><div class="v">#${tBarSize}</div></div>
    <div class="kv"><div class="k">Target weight</div><div class="v">${tWeight} ${tWeightUnit}</div></div>` : ""}
  </div>
  ${resultSection}
  <div class="footer">
    <p>Estimates based on ASTM A615 / A706 unit weights. Actual weights may vary by mill and heat number.</p>
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
        if (!w) { alert("Please allow pop-ups for this site to use Print/Save."); return; }
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
                    Rebar Weight Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Convert rebar linear footage to weight, mix multiple bar sizes for combined tonnage,
                    or reverse-calculate footage from a target weight.
                    Results appear after you press{" "}
                    <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate} className="space-y-0">

                    {/* MODE TOGGLE — Quick / Advanced */}
                    <section className={stepClass} aria-labelledby="modeToggle">
                        <div className="flex items-center justify-between">
                            <h3 id="modeToggle" className="text-sm font-semibold text-white/80">
                                Estimate Mode
                            </h3>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => { setAdvancedMode(false); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        !advancedMode
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}
                                >
                                    Quick
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => { setAdvancedMode(true); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        advancedMode
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}
                                >
                                    Advanced
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* PROJECT TYPE PRESETS */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">
                            Project Type
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {([
                                { key: "residential", label: "Residential"   },
                                { key: "commercial",  label: "Commercial Mix" },
                                { key: "bridge",      label: "Bridge / Civil" },
                                { key: "reverse",     label: "Target Weight"  },
                            ] as { key: "residential" | "commercial" | "bridge" | "reverse"; label: string }[]).map(({ key, label }) => (
                                <Button
                                    key={key}
                                    type="button"
                                    onClick={() => applyPreset(key)}
                                    className={cn("h-9 rounded-sm text-sm",
                                        "bg-slate-700 text-white hover:bg-slate-600")}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">
                            Presets load sensible defaults. Override any value below.
                        </p>
                    </section>

                    {/* STEP 1 — Calculation Mode */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">
                            Step 1 — Calculation Mode
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {([
                                { mode: "single", label: "Single bar size",     desc: "One bar type → weight" },
                                { mode: "multi",  label: "Multi-bar mix",        desc: "Up to 6 sizes → combined weight" },
                                { mode: "target", label: "Target weight",        desc: "Weight → footage (reverse)" },
                            ] as { mode: CalcMode; label: string; desc: string }[]).map(({ mode, label, desc }) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => { setCalcMode(mode); setSubmitted(false); }}
                                    className={cn(
                                        "flex flex-col items-start gap-0.5 rounded-sm border px-4 py-3 text-left transition-colors",
                                        calcMode === mode
                                            ? "border-teal-400 bg-teal-900/20 text-teal-400"
                                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                                    )}
                                >
                                    <span className="text-sm font-semibold">{label}</span>
                                    <span className="text-[11px] text-white/50">{desc}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ====== SINGLE MODE ====== */}
                    {calcMode === "single" && (
                        <>
                            <section className={stepClass} aria-labelledby="step2-single">
                                <h3 id="step2-single" className="text-sm font-semibold text-white/80">
                                    Step 2 — Bar &amp; Footage
                                </h3>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <Field label="Bar Size" hint="ASTM A615 / A706 deformed bar.">
                                        <BarSizeSelect
                                            value={sBarSize}
                                            onChange={(v) => { setSBarSize(v); setSubmitted(false); }}
                                            ariaLabel="Single bar size"
                                        />
                                    </Field>
                                    <Field
                                        label="Total linear footage"
                                        hint="Net footage from your material takeoff."
                                    >
                                        <div className="flex gap-2">
                                            <NumberInput
                                                value={sFootage}
                                                onChange={(v) => { setSFootage(v); setSubmitted(false); }}
                                                placeholder="e.g., 500"
                                                ariaLabel="Linear footage"
                                            />
                                            <UnitSelect
                                                value={sLenUnit}
                                                onChange={(v) => { setSLenUnit(v as LengthUnit); setSubmitted(false); }}
                                                options={[{ value: "ft", label: "ft" }, { value: "m", label: "m" }]}
                                                ariaLabel="Length unit"
                                            />
                                        </div>
                                    </Field>
                                    <Field
                                        label="Waste factor"
                                        hint="Lap splices, off-cuts, hooks."
                                        subHint="10% typical; 15% for complex layouts"
                                    >
                                        <NumberInput
                                            value={sWaste}
                                            onChange={(v) => { setSWaste(v); setSubmitted(false); }}
                                            placeholder="10"
                                            badge="%"
                                            ariaLabel="Waste %"
                                        />
                                    </Field>
                                </div>

                                {/* Inline bar info panel */}
                                <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-300 space-y-1">
                                    <p className="text-teal-400 font-semibold mb-1">Selected — #{sBarSize} bar properties</p>
                                    <p>Diameter: <span className="text-white">{sBar.diameter}&quot;</span>
                                       &nbsp;·&nbsp; Area: <span className="text-white">{sBar.area} in²</span>
                                       &nbsp;·&nbsp; Weight: <span className="text-white">{sBar.lbPerFt} lb/ft</span>
                                       &nbsp;·&nbsp; <span className="text-white">{sBar.kgPerM} kg/m</span>
                                    </p>
                                    <p className="text-white/60 italic">{sBar.commonUse}</p>
                                </div>

                                {/* ASTM A615 plausibility warning */}
                                {sAstmWarning && (
                                    <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-amber-300">
                                            <strong>ASTM A615 note:</strong> The entered footage exceeds 50,000 linear feet.
                                            Verify this is intentional — a single procurement order of this size is uncommon
                                            for most projects. Check for unit entry errors (e.g., metres entered as feet).
                                        </p>
                                    </div>
                                )}
                            </section>

                            <section className={stepClass} aria-labelledby="step3-single">
                                <h3 id="step3-single" className="text-sm font-semibold text-white/80">
                                    Step 3 — Procurement &amp; Cost
                                </h3>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <Field
                                        label="Stock bar length"
                                        hint="Standard purchased bar length."
                                        subHint="Used to calculate bars to order"
                                    >
                                        <NumberInput
                                            value={sStockLen}
                                            onChange={(v) => { setSStockLen(v); setSubmitted(false); }}
                                            placeholder="20"
                                            badge="ft"
                                            ariaLabel="Stock length"
                                        />
                                    </Field>
                                    <Field
                                        label="Price per ton (optional)"
                                        hint="Commercial steel is priced per US ton."
                                    >
                                        <NumberInput
                                            value={sPricePerTon}
                                            onChange={(v) => { setSPrice(v); setSubmitted(false); }}
                                            placeholder="e.g., 850"
                                            badge="$/ton"
                                            ariaLabel="Price per ton"
                                        />
                                    </Field>
                                    {advancedMode && (
                                        <Field label="Delivery / misc (optional)" hint="Lump-sum delivery fee.">
                                            <NumberInput
                                                value={sDelivery}
                                                onChange={(v) => { setSDelivery(v); setSubmitted(false); }}
                                                placeholder="e.g., 200"
                                                badge="$"
                                                ariaLabel="Delivery cost"
                                            />
                                        </Field>
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {/* ====== MULTI MODE ====== */}
                    {calcMode === "multi" && (
                        <section className={stepClass} aria-labelledby="step2-multi">
                            <h3 id="step2-multi" className="text-sm font-semibold text-white/80">
                                Step 2 — Bar Mix (up to 6 sizes)
                            </h3>

                            {/* Column headers */}
                            <div className="mt-3 hidden sm:grid sm:grid-cols-[140px_1fr_100px_80px_44px] gap-3 mb-1">
                                {["Bar size", "Net footage (ft)", "Stock len (ft)", "Waste %", ""].map((h) => (
                                    <span key={h} className="text-[11px] text-white/50 font-medium">{h}</span>
                                ))}
                            </div>

                            <div className="space-y-3">
                                {multiRows.map((row, idx) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-1 sm:grid-cols-[140px_1fr_100px_80px_44px] gap-3 items-end"
                                    >
                                        <div>
                                            {idx === 0 && <p className="sm:hidden text-[11px] text-white/50 mb-1">Bar size</p>}
                                            <BarSizeSelect
                                                value={row.barSize}
                                                onChange={(v) => { updateMultiRow(row.id, "barSize", v); }}
                                                ariaLabel={`Row ${idx + 1} bar size`}
                                            />
                                        </div>
                                        <div>
                                            {idx === 0 && <p className="sm:hidden text-[11px] text-white/50 mb-1">Net footage</p>}
                                            <NumberInput
                                                value={row.footage}
                                                onChange={(v) => updateMultiRow(row.id, "footage", v)}
                                                placeholder="lin ft"
                                                ariaLabel={`Row ${idx + 1} footage`}
                                            />
                                        </div>
                                        <div>
                                            {idx === 0 && <p className="sm:hidden text-[11px] text-white/50 mb-1">Stock len</p>}
                                            <NumberInput
                                                value={row.stockLen}
                                                onChange={(v) => updateMultiRow(row.id, "stockLen", v)}
                                                placeholder="20"
                                                badge="ft"
                                                ariaLabel={`Row ${idx + 1} stock length`}
                                            />
                                        </div>
                                        <div>
                                            {idx === 0 && <p className="sm:hidden text-[11px] text-white/50 mb-1">Waste %</p>}
                                            <NumberInput
                                                value={row.waste}
                                                onChange={(v) => updateMultiRow(row.id, "waste", v)}
                                                placeholder="10"
                                                badge="%"
                                                ariaLabel={`Row ${idx + 1} waste`}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => removeMultiRow(row.id)}
                                            disabled={multiRows.length <= 1}
                                            className="h-11 w-11 rounded-sm bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400 p-0"
                                            title="Remove row"
                                        >
                                            <Trash2 className="h-4 w-4 mx-auto" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {multiRows.length < 6 && (
                                <Button
                                    type="button"
                                    onClick={addMultiRow}
                                    className="mt-3 h-9 rounded-sm bg-slate-700 text-white hover:bg-slate-600 text-sm"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add bar size
                                </Button>
                            )}

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Price per ton (optional)" hint="Applies to combined total weight.">
                                    <NumberInput
                                        value={mPricePerTon}
                                        onChange={(v) => { setMPrice(v); setSubmitted(false); }}
                                        placeholder="e.g., 850"
                                        badge="$/ton"
                                        ariaLabel="Multi price per ton"
                                    />
                                </Field>
                                <Field label="Delivery / misc (optional)" hint="Added to material cost for grand total.">
                                    <NumberInput
                                        value={mDelivery}
                                        onChange={(v) => { setMDelivery(v); setSubmitted(false); }}
                                        placeholder="e.g., 200"
                                        badge="$"
                                        ariaLabel="Multi delivery"
                                    />
                                </Field>
                            </div>
                        </section>
                    )}

                    {/* ====== TARGET / REVERSE MODE ====== */}
                    {calcMode === "target" && (
                        <section className={stepClass} aria-labelledby="step2-target">
                            <h3 id="step2-target" className="text-sm font-semibold text-white/80">
                                Step 2 — Target Weight &amp; Bar Size
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field
                                    label="Target weight"
                                    hint="From structural spec, delivery manifest, or budget."
                                >
                                    <div className="flex gap-2">
                                        <NumberInput
                                            value={tWeight}
                                            onChange={(v) => { setTWeight(v); setSubmitted(false); }}
                                            placeholder="e.g., 2"
                                            ariaLabel="Target weight"
                                        />
                                        <UnitSelect
                                            value={tWeightUnit}
                                            onChange={(v) => { setTWtUnit(v as WeightUnit); setSubmitted(false); }}
                                            options={[
                                                { value: "tons", label: "tons" },
                                                { value: "lbs",  label: "lbs"  },
                                                { value: "kg",   label: "kg"   },
                                            ]}
                                            ariaLabel="Weight unit"
                                        />
                                    </div>
                                </Field>
                                <Field label="Bar size" hint="The bar size that weight corresponds to.">
                                    <BarSizeSelect
                                        value={tBarSize}
                                        onChange={(v) => { setTBarSize(v); setSubmitted(false); }}
                                        ariaLabel="Target bar size"
                                    />
                                </Field>
                                <Field
                                    label="Stock bar length"
                                    hint="Used to calculate bars to order."
                                >
                                    <NumberInput
                                        value={tStockLen}
                                        onChange={(v) => { setTStockLen(v); setSubmitted(false); }}
                                        placeholder="20"
                                        badge="ft"
                                        ariaLabel="Target stock length"
                                    />
                                </Field>
                            </div>
                            <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-300">
                                <p className="text-teal-400 font-semibold mb-1">#{tBarSize} bar — {tBar.lbPerFt} lb/ft · {tBar.kgPerM} kg/m</p>
                                <p className="text-white/60 italic">{tBar.commonUse}</p>
                            </div>
                        </section>
                    )}

                    {/* ACTIONS */}
                    <section className={stepClass} aria-labelledby="actions">
                        <h3 id="actions" className="text-sm font-semibold text-white/80">Actions</h3>
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
                        {/* Print */}
                        <div className="mt-4 flex justify-end">
                            <Button
                                type="button"
                                onClick={handlePrint}
                                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                            >
                                <Printer className="h-4 w-4 mr-2" /> Print / Save
                            </Button>
                        </div>

                        {/* Inputs summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Mode" v={
                                    calcMode === "single" ? "Single bar size" :
                                    calcMode === "multi"  ? "Multi-bar mix"   : "Target weight (reverse)"
                                } />
                                {calcMode === "single" && <>
                                    <KV k="Bar size"     v={`#${sBarSize} (${sBar.diameter}&quot;)`} />
                                    <KV k="Net footage"  v={`${sFootage} ${sLenUnit}`} />
                                    <KV k="Waste"        v={`${sWaste}%`} />
                                    <KV k="Stock length" v={`${sStockLen} ft`} />
                                </>}
                                {calcMode === "multi" && <>
                                    <KV k="Bar types"   v={`${multiRows.length} sizes`} />
                                    <KV k="Price / ton" v={mPricePerTon ? `$${mPricePerTon}` : "—"} />
                                </>}
                                {calcMode === "target" && <>
                                    <KV k="Target weight" v={`${tWeight} ${tWeightUnit}`} />
                                    <KV k="Bar size"      v={`#${tBarSize} (${tBar.diameter}&quot;)`} />
                                    <KV k="Stock length"  v={`${tStockLen} ft`} />
                                </>}
                            </div>
                        </div>

                        {/* ===== SINGLE RESULTS ===== */}
                        {calcMode === "single" && (
                            <>
                                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                    <div className="mb-2 text-sm font-semibold text-white">Weight Results</div>

                                    <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                        <span className="text-xs uppercase tracking-wider text-slate-400">Total Weight</span>
                                        <span className="text-4xl font-extrabold text-teal-400"><AnimatedNumber value={sLbs} decimals={0} /></span>
                                        <span className="text-xs text-slate-400 mt-1">lbs &nbsp;·&nbsp; {nf(sTons, 3)} US tons &nbsp;·&nbsp; {nf(sKg, 1)} kg</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <KV k="Net footage"      v={`${nf(sNetLf, 1)} ft`} />
                                        <KV k="Gross w/ waste"   v={`${nf(sGrossLf, 1)} ft`} />
                                        <KV k="Weight (lbs)"     v={`${nf(sLbs, 0)} lbs`} />
                                        <KV k="Weight (US tons)" v={`${nf(sTons, 3)} tons`} />
                                        <KV k="Weight (kg)"      v={`${nf(sKg, 1)} kg`} />
                                        <KV k="Bars to order"    v={`${nf(sBarsNeeded, 0)} × ${sStockLen} ft`} />
                                        <KV k="lb / lin ft"      v={`${sBar.lbPerFt} lb/ft`} />
                                        <KV k="kg / metre"       v={`${sBar.kgPerM} kg/m`} />
                                        <KV k="Cross-sect. area" v={`${sBar.area} in²`} />
                                    </div>
                                </div>

                                {sHasCost && (
                                    <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                        <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                            {sMatCost > 0  && <KV k="Material cost"  v={`$${nf(sMatCost)}`} />}
                                            {sDelCost > 0  && <KV k="Delivery"       v={`$${nf(sDelCost)}`} />}
                                            <KV k="Grand total" v={`$${nf(sGrandTotal)}`} />
                                        </div>
                                        <p className="mt-2 text-xs text-white/60 flex items-start gap-1.5">
                                            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                            Cost = gross tonnage × price per ton. Commercial steel pricing varies by market, grade, and mill.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ===== MULTI RESULTS ===== */}
                        {calcMode === "multi" && (
                            <>
                                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                    <div className="mb-2 text-sm font-semibold text-white">Combined Weight Results</div>

                                    <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                        <span className="text-xs uppercase tracking-wider text-slate-400">Total Combined Weight</span>
                                        <span className="text-4xl font-extrabold text-teal-400">{nf(mTotalLbs, 0)}</span>
                                        <span className="text-xs text-slate-400 mt-1">lbs &nbsp;·&nbsp; {nf(mTotalTons, 3)} US tons &nbsp;·&nbsp; {nf(mTotalKg, 1)} kg</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <KV k="Total weight (lbs)" v={`${nf(mTotalLbs, 0)} lbs`} />
                                        <KV k="Total weight (tons)" v={`${nf(mTotalTons, 3)} tons`} />
                                        <KV k="Total weight (kg)"  v={`${nf(mTotalKg, 1)} kg`} />
                                        <KV k="Total bars"         v={`${nf(mTotalBars, 0)} bars`} />
                                        <KV k="Bar types"          v={`${multiRows.length} sizes`} />
                                    </div>
                                </div>

                                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                    <div className="mb-3 text-sm font-semibold text-white">Per-Bar Breakdown</div>
                                    <div className="space-y-2">
                                        {multiResults.map((r) => {
                                            const pct = mTotalLbs > 0 ? (r.lbs / mTotalLbs) * 100 : 0;
                                            return (
                                                <div key={r.row.id} className="rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-semibold text-teal-400">
                                                            #{r.row.barSize} — {BAR_DATA[r.row.barSize].lbPerFt} lb/ft
                                                        </span>
                                                        <span className="text-xs text-white/60">{pct.toFixed(1)}% of total steel</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                                        <KV k="Net footage"  v={`${nf(r.netLf, 0)} ft`} />
                                                        <KV k="Gross footage" v={`${nf(r.grossLf, 1)} ft`} />
                                                        <KV k="Weight"       v={`${nf(r.lbs, 0)} lbs`} />
                                                        <KV k="Bars needed"  v={`${r.barsNeeded} bars`} />
                                                    </div>
                                                    {/* Percentage bar */}
                                                    <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                                        <div
                                                            className="h-full bg-teal-400 rounded-full"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {mHasCost && (
                                    <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                        <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                            {mMatCost > 0  && <KV k="Material cost" v={`$${nf(mMatCost)}`} />}
                                            {mDelCost > 0  && <KV k="Delivery"      v={`$${nf(mDelCost)}`} />}
                                            <KV k="Grand total" v={`$${nf(mGrandTotal)}`} />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ===== TARGET / REVERSE RESULTS ===== */}
                        {calcMode === "target" && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">
                                    Reverse Calculation — #{tBarSize} bar at {tWeight} {tWeightUnit}
                                </div>

                                <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                    <span className="text-xs uppercase tracking-wider text-slate-400">Equivalent Linear Footage</span>
                                    <span className="text-4xl font-extrabold text-teal-400">{nf(tLinFt, 1)}</span>
                                    <span className="text-xs text-slate-400 mt-1">linear feet of #{tBarSize} bar</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    <KV k="Target (lbs)"     v={`${nf(tLbsTarget, 0)} lbs`} />
                                    <KV k="Target (US tons)" v={`${nf(tTons, 3)} tons`} />
                                    <KV k="Target (kg)"      v={`${nf(tKg, 1)} kg`} />
                                    <KV k="Linear footage"   v={`${nf(tLinFt, 1)} ft`} />
                                    <KV k="Bars to order"    v={`${nf(tBarsNeeded, 0)} × ${tStockLen} ft bars`} />
                                    <KV k="lb / lin ft"      v={`${tBar.lbPerFt} lb/ft`} />
                                </div>
                            </div>
                        )}

                        {/* ASTM A615 / A706 Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                ASTM A615 / A706 Bar Weight Reference
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            {["Size", "Diameter", "Area (in²)", "lb / ft", "kg / m", "Common use"].map((h) => (
                                                <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Object.keys(BAR_DATA) as BarSize[]).map((k) => {
                                            const b = BAR_DATA[k];
                                            const isActive =
                                                (calcMode === "single" && k === sBarSize) ||
                                                (calcMode === "target" && k === tBarSize) ||
                                                (calcMode === "multi"  && multiRows.some((r) => r.barSize === k));
                                            return (
                                                <tr
                                                    key={k}
                                                    className={cn(
                                                        "border-b border-slate-800",
                                                        isActive
                                                            ? "bg-teal-900/30 text-teal-300"
                                                            : "text-slate-300"
                                                    )}
                                                >
                                                    <td className="py-2 px-2 font-semibold">#{k}</td>
                                                    <td className="py-2 px-2">{b.diameter}&quot;</td>
                                                    <td className="py-2 px-2">{b.area}</td>
                                                    <td className="py-2 px-2">{b.lbPerFt}</td>
                                                    <td className="py-2 px-2">{b.kgPerM}</td>
                                                    <td className="py-2 px-2 hidden sm:table-cell text-white/60">{b.commonUse}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Active bar size(s) highlighted. Weights per ASTM A615 / A706 standard. #3–#10 deformed bars.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This rebar weight
                                    calculator provides estimates based on ASTM A615 / A706 published unit weights.
                                    Actual weights may vary by mill, heat number, and bar grade. Always verify
                                    tonnage with your supplier&apos;s certified mill test reports for structural and
                                    procurement applications.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
