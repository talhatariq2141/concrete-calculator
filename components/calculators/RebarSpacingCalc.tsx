// components/calculators/RebarSpacingCalc.tsx
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
import { Info, Printer, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* =========================
   Types & Constants
========================= */

type BarSize = "3" | "4" | "5" | "6" | "7" | "8";
type CalcDirection = "from-spacing" | "from-bars";
type ProjectType = "slab" | "footing" | "wall" | "beam";
type LengthUnit = "ft" | "in" | "m";
type SpacingUnit = "in" | "ft";
type CoverUnit = "in" | "ft";

/** ASTM A615 bar geometry — diameter in inches, area in in² */
const BAR_DATA: Record<BarSize, { diameter: number; area: number; commonUse: string }> = {
    "3": { diameter: 0.375, area: 0.11, commonUse: "Temperature / shrinkage, ties, light flatwork" },
    "4": { diameter: 0.500, area: 0.20, commonUse: "Driveways, patios, residential slabs, footings" },
    "5": { diameter: 0.625, area: 0.31, commonUse: "Structural slabs, beams, residential columns" },
    "6": { diameter: 0.750, area: 0.44, commonUse: "Heavy beams, retaining walls, commercial" },
    "7": { diameter: 0.875, area: 0.60, commonUse: "Foundations, large retaining walls" },
    "8": { diameter: 1.000, area: 0.79, commonUse: "Heavy columns, mat foundations" },
};

/**
 * ACI 318-19 §25.8.1 — Minimum clear spacing between parallel bars:
 *   ≥ 1 in
 *   ≥ bar diameter (db)
 *   ≥ 4/3 × max aggregate size (default 3/4" → 4/3 × 0.75 = 1.0")
 * For simplicity and typical residential/commercial concrete:
 *   ACI min clear = max(1.0", db)
 *
 * ACI 318-19 §7.7.2.3 — Max c-t-c spacing for non-prestressed slabs:
 *   ≤ min(3 × slab thickness, 18")
 *   We use 18" as the upper bound when slab thickness is not entered.
 *
 * ACI 318-19 Table 20.6.1.3 — Min concrete cover:
 *   Not exposed: 3/4" (cast in forms, #5 & smaller) / 1.5" (#6+)
 *   Exposed to weather: 1.5" (#5 & smaller) / 2.0" (#6+)
 *   Cast against earth: 3"
 */
const ACI_MAX_SPACING_IN = 18; // §7.7.2.3 absolute upper bound for slabs

const LOGO_URL = "/logo.svg";

/* ===================== Helpers ===================== */

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

function toIn(value: number, unit: LengthUnit | SpacingUnit | CoverUnit): number {
    if (unit === "ft") return value * 12;
    if (unit === "m")  return value * 39.3701;
    return value; // already inches
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
            {hint    && <p className="text-xs text-slate-300">{hint}</p>}
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
   Slab Diagram (SVG)
========================= */

type DiagramProps = {
    spanIn: number;
    coverIn: number;
    barCount: number;
    barDiameter: number;
    barSizeLabel: string;
};

function SlabDiagram({ spanIn, coverIn, barCount, barDiameter, barSizeLabel }: DiagramProps) {
    const W = 600;
    const H = 120;
    const PAD = 20;
    const SLAB_H = 70;
    const SLAB_Y = 20;
    const slabW = W - 2 * PAD;

    const scale = spanIn > 0 ? slabW / spanIn : 1;
    const coverPx = Math.min(coverIn * scale, slabW * 0.25);
    const netSpanPx = slabW - 2 * coverPx;

    // Bar radius capped so bars never overlap visually
    const maxBarsToShow = Math.min(barCount, Math.floor(netSpanPx / 6));
    const barR = Math.max(3, Math.min(10, (barDiameter / (spanIn > 0 ? spanIn : 1)) * slabW * 3));
    const barPositions: number[] = [];
    for (let i = 0; i < maxBarsToShow; i++) {
        const frac = maxBarsToShow > 1 ? i / (maxBarsToShow - 1) : 0.5;
        barPositions.push(PAD + coverPx + frac * netSpanPx);
    }
    const barY = SLAB_Y + SLAB_H / 2;

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ display: "block" }}
            aria-label="Slab reinforcement diagram"
        >
            {/* Concrete body */}
            <rect x={PAD} y={SLAB_Y} width={slabW} height={SLAB_H} rx="4" className="fill-slate-700" />

            {/* Cover zones */}
            <rect x={PAD} y={SLAB_Y} width={coverPx} height={SLAB_H} rx="4" className="fill-slate-800" opacity="0.8" />
            <rect x={PAD + slabW - coverPx} y={SLAB_Y} width={coverPx} height={SLAB_H} rx="4" className="fill-slate-800" opacity="0.8" />

            {/* Cover boundary dashes */}
            <line x1={PAD + coverPx} y1={SLAB_Y} x2={PAD + coverPx} y2={SLAB_Y + SLAB_H}
                stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1={PAD + slabW - coverPx} y1={SLAB_Y} x2={PAD + slabW - coverPx} y2={SLAB_Y + SLAB_H}
                stroke="#64748b" strokeWidth="0.75" strokeDasharray="3 3" />

            {/* Rebar bars */}
            {barPositions.map((x, i) => (
                <circle key={i} cx={x} cy={barY} r={barR} className="fill-teal-400" />
            ))}

            {/* Overflow label */}
            {barCount > maxBarsToShow && (
                <text x={W / 2} y={SLAB_Y + SLAB_H + 18} textAnchor="middle"
                    fontSize="11" className="fill-slate-400">
                    +{barCount - maxBarsToShow} more bars (diagram scaled)
                </text>
            )}

            {/* Labels */}
            <text x={PAD + coverPx / 2} y={SLAB_Y + 13} textAnchor="middle" fontSize="10" className="fill-slate-400">cover</text>
            <text x={PAD + slabW - coverPx / 2} y={SLAB_Y + 13} textAnchor="middle" fontSize="10" className="fill-slate-400">cover</text>
            <text x={W / 2} y={SLAB_Y - 6} textAnchor="middle" fontSize="11" className="fill-slate-400">
                {barCount} × {barSizeLabel} bars · span {nf(spanIn / 12, 2)} ft
            </text>
        </svg>
    );
}

/* =========================
   Main Component
========================= */

import { AnimatedNumber } from "@/components/calculators/AnimatedNumber";

export default function RebarSpacingCalc() {

    /* ---------- Unit System ---------- */
    const [unitSystem, setUnitSystem] = React.useState<"imperial" | "metric">("imperial");

    /* ---------- Mode ---------- */
    const [advancedMode, setAdvancedMode]   = React.useState(false);
    const [projectType, setProjectType]     = React.useState<ProjectType>("slab");
    const [calcDir, setCalcDir]             = React.useState<CalcDirection>("from-spacing");

    /* ---------- Inputs ---------- */
    const [span, setSpan]               = React.useState("20");
    const [spanUnit, setSpanUnit]       = React.useState<LengthUnit>("ft");
    const [barSize, setBarSize]         = React.useState<BarSize>("4");
    const [cover, setCover]             = React.useState("2");
    const [coverUnit, setCoverUnit]     = React.useState<CoverUnit>("in");

    // From-spacing direction
    const [spacing, setSpacing]         = React.useState("12");
    const [spacingUnit, setSpacingUnit] = React.useState<SpacingUnit>("in");

    // From-bars direction
    const [numBars, setNumBars]         = React.useState("20");

    // Advanced
    const [slabThickness, setSlabThick] = React.useState("");
    const [aggSize, setAggSize]         = React.useState("0.75");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Derived values ===================== */

    const bar         = BAR_DATA[barSize];
    const spanIn      = toIn(parseFloat(span) || 0, spanUnit);
    const coverIn     = toIn(parseFloat(cover) || 0, coverUnit);
    const netSpanIn   = Math.max(0, spanIn - 2 * coverIn);

    // ACI 318-19 §25.8.1 min clear
    const aggSizeIn   = parseFloat(aggSize) || 0.75;
    const aciMinClear = Math.max(1.0, bar.diameter, (4 / 3) * aggSizeIn);

    // ACI 318-19 §7.7.2.3 max c-t-c for slabs
    const slabThickIn = slabThickness ? toIn(parseFloat(slabThickness) || 0, "in") : 0;
    const aciMaxSpacing = slabThickIn > 0
        ? Math.min(3 * slabThickIn, ACI_MAX_SPACING_IN)
        : ACI_MAX_SPACING_IN;

    // Derived spacing or bar count
    let ctcIn: number, barCount: number, clearIn: number;

    if (calcDir === "from-spacing") {
        ctcIn    = toIn(parseFloat(spacing) || 0, spacingUnit);
        barCount = ctcIn > 0 ? Math.floor(netSpanIn / ctcIn) + 1 : 0;
        clearIn  = ctcIn - bar.diameter;
    } else {
        barCount = Math.max(2, parseInt(numBars) || 2);
        ctcIn    = barCount > 1 ? netSpanIn / (barCount - 1) : 0;
        clearIn  = ctcIn - bar.diameter;
    }

    const totalSteelArea = barCount * bar.area;

    // Three ACI compliance checks
    const clearViolation   = clearIn < aciMinClear && barCount > 0;
    const maxSpaceViolation = ctcIn > aciMaxSpacing && barCount > 0;
    const anyViolation     = clearViolation || maxSpaceViolation;
    const allPassing       = !anyViolation && barCount > 0;

    /* ===================== Presets ===================== */

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "slab") {
            setSpan("20"); setSpanUnit("ft"); setBarSize("4");
            setCover("2"); setCoverUnit("in");
            setSpacing("12"); setSpacingUnit("in");
            setCalcDir("from-spacing"); setSlabThick("4");
        } else if (pt === "footing") {
            setSpan("30"); setSpanUnit("ft"); setBarSize("5");
            setCover("3"); setCoverUnit("in");
            setSpacing("18"); setSpacingUnit("in");
            setCalcDir("from-spacing"); setSlabThick("");
        } else if (pt === "wall") {
            setSpan("10"); setSpanUnit("ft"); setBarSize("5");
            setCover("2"); setCoverUnit("in");
            setSpacing("12"); setSpacingUnit("in");
            setCalcDir("from-spacing"); setSlabThick("");
        } else {
            setSpan("24"); setSpanUnit("in"); setBarSize("6");
            setCover("1.5"); setCoverUnit("in");
            setSpacing("6"); setSpacingUnit("in");
            setCalcDir("from-spacing"); setSlabThick("");
        }
    }

    /* ===================== Actions ===================== */

    function handleCalculate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setSubmitted(true);
    }

    function resetAll() {
        setUnitSystem("imperial");
        setAdvancedMode(false);
        setProjectType("slab");
        setCalcDir("from-spacing");
        setSpan("20"); setSpanUnit("ft");
        setBarSize("4");
        setCover("2"); setCoverUnit("in");
        setSpacing("12"); setSpacingUnit("in");
        setNumBars("20");
        setSlabThick(""); setAggSize("0.75");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        const complianceNote = anyViolation
            ? "WARNING: One or more ACI 318 violations detected — review results."
            : "All ACI 318 checks passed.";

        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Rebar Spacing Calculator – Print View</title>
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
  .ok{color:#15803d;background:#dcfce7;border:1px solid #86efac;border-radius:6px;padding:8px;margin:8px 0}
  .warn{color:#b45309;background:#fef3c7;border:1px solid #fcd34d;border-radius:6px;padding:8px;margin:8px 0}
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
    <div class="meta"><div>Rebar Spacing Calculator</div><div>Printed: ${now}</div></div>
  </div>

  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project type</div><div class="v">${projectType}</div></div>
    <div class="kv"><div class="k">Span</div><div class="v">${span} ${spanUnit}</div></div>
    <div class="kv"><div class="k">Bar size</div><div class="v">#${barSize} (${bar.diameter}")</div></div>
    <div class="kv"><div class="k">Cover</div><div class="v">${cover} ${coverUnit}</div></div>
    <div class="kv"><div class="k">Mode</div><div class="v">${calcDir === "from-spacing" ? "Spacing → bar count" : "Bar count → spacing"}</div></div>
    ${calcDir === "from-spacing"
        ? `<div class="kv"><div class="k">Target spacing</div><div class="v">${spacing} ${spacingUnit}</div></div>`
        : `<div class="kv"><div class="k">Bar count</div><div class="v">${numBars}</div></div>`}
  </div>

  <h2>Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">Bar count</div><div class="v">${nf(barCount, 0)} bars</div></div>
    <div class="kv"><div class="k">C-t-c spacing</div><div class="v">${nf(ctcIn, 3)}"</div></div>
    <div class="kv"><div class="k">Clear spacing</div><div class="v">${nf(clearIn, 3)}"</div></div>
    <div class="kv"><div class="k">Net span</div><div class="v">${nf(netSpanIn, 2)}"</div></div>
    <div class="kv"><div class="k">Total steel area</div><div class="v">${nf(totalSteelArea, 3)} in²</div></div>
    <div class="kv"><div class="k">ACI min clear</div><div class="v">${nf(aciMinClear, 3)}"</div></div>
  </div>

  <h2>ACI 318 Compliance</h2>
  <div class="${anyViolation ? "warn" : "ok"}">${complianceNote}</div>
  ${clearViolation ? `<div class="warn">Min clear spacing violation: ${nf(clearIn, 3)}" < ${nf(aciMinClear, 3)}" (ACI 318-19 §25.8.1)</div>` : ""}
  ${maxSpaceViolation ? `<div class="warn">Max c-t-c spacing violation: ${nf(ctcIn, 2)}" > ${nf(aciMaxSpacing, 1)}" (ACI 318-19 §7.7.2.3)</div>` : ""}

  <div class="footer">
    <p>Estimates only. Final reinforcement layout must be verified by a licensed structural engineer and comply with local building codes.</p>
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
                    Rebar Spacing Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Calculate rebar bar count from a target spacing, or find the spacing for a given bar count.
                    Includes ACI 318 compliance checks and a live slab diagram. Results appear after you press{" "}
                    <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate} className="space-y-0">

                    {/* Unit System Toggle */}
                    <div className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Unit System</h3>
                        <div className="mt-2">
                            <Tabs
                                value={unitSystem}
                                onValueChange={(v) => {
                                    const sys = v as "imperial" | "metric";
                                    setUnitSystem(sys);
                                    if (sys === "imperial") {
                                        setSpanUnit("ft");
                                        setSpacingUnit("in");
                                        setCoverUnit("in");
                                    } else {
                                        setSpanUnit("m");
                                        setSpacingUnit("in");
                                        setCoverUnit("in");
                                    }
                                    setSubmitted(false);
                                }}
                                className="w-full max-w-xs"
                            >
                                <TabsList className="grid w-full grid-cols-2 rounded-sm bg-slate-950 p-1">
                                    <TabsTrigger value="imperial" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Imperial</TabsTrigger>
                                    <TabsTrigger value="metric" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Metric</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <p className="mt-1 text-xs text-white/60">Switches default units. Individual dropdowns can still be adjusted.</p>
                        </div>
                    </div>

                    {/* MODE TOGGLE */}
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

                    {/* PROJECT TYPE PRESETS */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">Project Type</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {([
                                { key: "slab",    label: "Slab / Patio"   },
                                { key: "footing", label: "Strip Footing"  },
                                { key: "wall",    label: "Concrete Wall"  },
                                { key: "beam",    label: "Beam"           },
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
                            Presets load sensible defaults. Override any value below.
                        </p>
                    </section>

                    {/* STEP 1 — Dimensions */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Dimensions</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <Field label="Span length" hint="Total concrete dimension being spanned." subHint="Cover will be deducted from both ends">
                                <div className="flex gap-2">
                                    <NumberInput value={span} onChange={(v) => { setSpan(v); setSubmitted(false); }}
                                        placeholder="e.g., 20" ariaLabel="Span" />
                                    <UnitSelect value={spanUnit} onChange={(v) => { setSpanUnit(v as LengthUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }, { value: "m", label: "m" }]}
                                        ariaLabel="Span unit" />
                                </div>
                            </Field>

                            <Field label="Concrete cover" hint="Edge setback to centre of first bar."
                                subHint="2&quot; slabs, 3&quot; footings & ground exposure">
                                <div className="flex gap-2">
                                    <NumberInput value={cover} onChange={(v) => { setCover(v); setSubmitted(false); }}
                                        placeholder="2" ariaLabel="Cover" />
                                    <UnitSelect value={coverUnit} onChange={(v) => { setCoverUnit(v as CoverUnit); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Cover unit" />
                                </div>
                            </Field>

                            <Field label="Bar size" hint="ASTM A615 / A706 deformed bar.">
                                <Select value={barSize} onValueChange={(v) => { setBarSize(v as BarSize); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass} aria-label="Bar size">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.keys(BAR_DATA) as BarSize[]).map((k) => (
                                            <SelectItem key={k} value={k} className="text-white">
                                                #{k} — {BAR_DATA[k].diameter}&quot; dia
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        {/* Bar info panel */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-300 space-y-1">
                            <p className="text-teal-400 font-semibold mb-1">#{barSize} — {bar.diameter}&quot; diameter · {bar.area} in² area</p>
                            <p className="text-white/60 italic">{bar.commonUse}</p>
                        </div>
                    </section>

                    {/* STEP 2 — Calculation Direction */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80 mb-3">
                            Step 2 — Calculation Direction
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {([
                                { dir: "from-spacing", label: "Enter spacing → get bar count",
                                  desc: "You know the target c-t-c spacing; find how many bars fit" },
                                { dir: "from-bars",    label: "Enter bar count → get spacing",
                                  desc: "You know the bar budget; find the resulting c-t-c spacing" },
                            ] as { dir: CalcDirection; label: string; desc: string }[]).map(({ dir, label, desc }) => (
                                <button key={dir} type="button"
                                    onClick={() => { setCalcDir(dir); setSubmitted(false); }}
                                    className={cn(
                                        "flex flex-col items-start gap-0.5 rounded-sm border px-4 py-3 text-left transition-colors",
                                        calcDir === dir
                                            ? "border-teal-400 bg-teal-900/20 text-teal-400"
                                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500"
                                    )}>
                                    <span className="text-sm font-semibold">{label}</span>
                                    <span className="text-[11px] text-white/50">{desc}</span>
                                </button>
                            ))}
                        </div>

                        {calcDir === "from-spacing" ? (
                            <Field label="Target c-t-c spacing"
                                hint="Centre-to-centre distance between adjacent bars."
                                subHint="ACI 318 §7.7.2.3 max: 18&quot; for non-prestressed slabs">
                                <div className="flex gap-2">
                                    <NumberInput value={spacing} onChange={(v) => { setSpacing(v); setSubmitted(false); }}
                                        placeholder="12" ariaLabel="Spacing" />
                                    <UnitSelect value={spacingUnit}
                                        onChange={(v) => { setSpacingUnit(v as SpacingUnit); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Spacing unit" />
                                </div>
                            </Field>
                        ) : (
                            <Field label="Number of bars"
                                hint="Total bars across the span (including first and last)."
                                subHint="Minimum 2 bars required">
                                <NumberInput value={numBars} onChange={(v) => { setNumBars(v); setSubmitted(false); }}
                                    placeholder="20" badge="bars" ariaLabel="Number of bars" />
                            </Field>
                        )}
                    </section>

                    {/* STEP 3 — Advanced Options */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step3">
                            <h3 id="step3" className="text-sm font-semibold text-white/80">
                                Step 3 — Advanced (ACI Checks)
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Slab / member thickness (optional)"
                                    hint="Used for ACI §7.7.2.3 max spacing check."
                                    subHint="Max c-t-c = min(3×thickness, 18&quot;)">
                                    <NumberInput value={slabThickness}
                                        onChange={(v) => { setSlabThick(v); setSubmitted(false); }}
                                        placeholder="e.g., 4" badge="in" ariaLabel="Slab thickness" />
                                </Field>
                                <Field label="Max aggregate size"
                                    hint="Used for ACI §25.8.1 min clear check."
                                    subHint="Min clear ≥ 4/3 × agg size (default 3/4&quot;)">
                                    <NumberInput value={aggSize}
                                        onChange={(v) => { setAggSize(v); setSubmitted(false); }}
                                        placeholder="0.75" badge="in" ariaLabel="Aggregate size" />
                                </Field>
                            </div>
                        </section>
                    )}

                    {/* ACTIONS */}
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
                        Enter values above and press{" "}
                        <span className="font-semibold">Calculate</span> to reveal results.
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Project type" v={projectType.charAt(0).toUpperCase() + projectType.slice(1)} />
                                <KV k="Span"         v={`${span} ${spanUnit}`} />
                                <KV k="Bar size"     v={`#${barSize} (${bar.diameter}&quot;)`} />
                                <KV k="Cover"        v={`${cover} ${coverUnit}`} />
                                <KV k="Net span"     v={`${nf(netSpanIn, 2)}&quot;`} />
                                <KV k="Mode"         v={calcDir === "from-spacing" ? "Spacing → bars" : "Bars → spacing"} />
                            </div>
                        </div>

                        {/* Primary Results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Spacing Results</div>

                            {/* Hero */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">
                                    {calcDir === "from-spacing" ? "Bar Count" : "C-t-c Spacing"}
                                </span>
                                <span className="text-4xl font-extrabold text-teal-400">
                                    {calcDir === "from-spacing"
                                        ? <AnimatedNumber value={barCount} decimals={0} />
                                        : <><AnimatedNumber value={ctcIn} decimals={2} />&quot;</>}
                                </span>
                                <span className="text-xs text-slate-400 mt-1">
                                    {calcDir === "from-spacing"
                                        ? `bars at ${nf(ctcIn, 2)}&quot; c-t-c · ${nf(clearIn, 2)}&quot; clear`
                                        : `${barCount} bars · ${nf(clearIn, 2)}&quot; clear spacing`}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Bar count"         v={`${nf(barCount, 0)} bars`} />
                                <KV k="C-t-c spacing"     v={`${nf(ctcIn, 3)}&quot;`} />
                                <KV k="Clear spacing"     v={`${nf(clearIn, 3)}&quot;`} />
                                <KV k="Net span"          v={`${nf(netSpanIn, 2)}&quot;`} />
                                <KV k="Total steel area"  v={`${nf(totalSteelArea, 3)} in²`} />
                                <KV k="ACI min clear req" v={`${nf(aciMinClear, 3)}&quot;`} />
                            </div>
                        </div>

                        {/* ACI Compliance Panel */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">ACI 318 Compliance Checks</div>
                            <div className="space-y-2">

                                {/* Check 1 — Min clear */}
                                <div className={cn(
                                    "flex items-start gap-2 rounded-sm px-3 py-2",
                                    clearViolation
                                        ? "border border-amber-700/50 bg-amber-900/20"
                                        : "border border-green-700/40 bg-green-900/10"
                                )}>
                                    {clearViolation
                                        ? <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                        : <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />}
                                    <p className={cn("text-xs", clearViolation ? "text-amber-300" : "text-green-300")}>
                                        <strong>ACI 318-19 §25.8.1 — Minimum clear spacing:</strong>{" "}
                                        {clearViolation
                                            ? `FAIL — clear spacing ${nf(clearIn, 3)}&quot; is less than the required minimum ${nf(aciMinClear, 3)}&quot; (max of 1&quot;, bar dia ${bar.diameter}&quot;, and 4/3 × aggregate ${aggSizeIn}&quot;). Increase c-t-c spacing or use a smaller bar size.`
                                            : `PASS — clear spacing ${nf(clearIn, 3)}&quot; ≥ required minimum ${nf(aciMinClear, 3)}&quot;.`}
                                    </p>
                                </div>

                                {/* Check 2 — Max c-t-c */}
                                <div className={cn(
                                    "flex items-start gap-2 rounded-sm px-3 py-2",
                                    maxSpaceViolation
                                        ? "border border-amber-700/50 bg-amber-900/20"
                                        : "border border-green-700/40 bg-green-900/10"
                                )}>
                                    {maxSpaceViolation
                                        ? <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                        : <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />}
                                    <p className={cn("text-xs", maxSpaceViolation ? "text-amber-300" : "text-green-300")}>
                                        <strong>ACI 318-19 §7.7.2.3 — Maximum c-t-c spacing (slabs):</strong>{" "}
                                        {maxSpaceViolation
                                            ? `FAIL — c-t-c spacing ${nf(ctcIn, 2)}&quot; exceeds the maximum ${nf(aciMaxSpacing, 1)}&quot;${slabThickIn > 0 ? ` (min of 3×${slabThickIn}&quot; and 18&quot;)` : " (18&quot; absolute limit)"}. Add more bars or reduce spacing.`
                                            : `PASS — c-t-c spacing ${nf(ctcIn, 2)}&quot; ≥ maximum ${nf(aciMaxSpacing, 1)}&quot;.`}
                                    </p>
                                </div>

                                {allPassing && (
                                    <div className="flex items-center gap-2 rounded-sm border border-teal-700/40 bg-teal-900/10 px-3 py-2">
                                        <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                                        <p className="text-xs text-teal-300 font-medium">
                                            All ACI 318-19 checks passed. This spacing layout meets code requirements.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Live Slab Diagram */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">Live Slab Diagram</div>
                            <SlabDiagram
                                spanIn={spanIn}
                                coverIn={coverIn}
                                barCount={barCount}
                                barDiameter={bar.diameter}
                                barSizeLabel={`#${barSize}`}
                            />
                            <p className="mt-2 text-[11px] text-white/50">
                                Bars shown proportionally within net span. Gray zones = concrete cover. Teal circles = rebar cross-sections.
                            </p>
                        </div>

                        {/* ACI 318 Bar Spacing Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                ACI 318 Bar Spacing Reference
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            {["Bar", "Diameter", "Area (in²)", "Min clear (ACI §25.8.1)", "Max c-t-c slab", "Common use"].map((h) => (
                                                <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Object.keys(BAR_DATA) as BarSize[]).map((k) => {
                                            const b2 = BAR_DATA[k];
                                            const minClr = Math.max(1.0, b2.diameter).toFixed(3);
                                            return (
                                                <tr key={k} className={cn(
                                                    "border-b border-slate-800",
                                                    k === barSize ? "bg-teal-900/30 text-teal-300" : "text-slate-300"
                                                )}>
                                                    <td className="py-2 px-2 font-semibold">#{k}</td>
                                                    <td className="py-2 px-2">{b2.diameter}&quot;</td>
                                                    <td className="py-2 px-2">{b2.area}</td>
                                                    <td className="py-2 px-2">≥ {minClr}&quot;</td>
                                                    <td className="py-2 px-2">≤ 18&quot;</td>
                                                    <td className="py-2 px-2 hidden sm:table-cell text-white/60">{b2.commonUse}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Active bar highlighted. Min clear per ACI 318-19 §25.8.1 (assuming 3/4&quot; max aggregate). Max c-t-c per §7.7.2.3.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This rebar spacing
                                    calculator provides estimates and code compliance checks based on ACI 318-19.
                                    Actual reinforcement layout must be designed and verified by a licensed structural
                                    engineer and must comply with local building codes, project-specific structural
                                    drawings, and applicable standards.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
