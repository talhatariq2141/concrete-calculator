// components/calculators/ConcreteSidewalkCalc.tsx
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Info, Printer, AlertTriangle } from "lucide-react";

/* =========================
   Types & Constants
========================= */

type ProjectType = "residential" | "municipal" | "walkway";
type LengthUnit = "ft" | "in" | "m";
type ThickUnit = "in" | "ft";
type JointUnit = "ft" | "in";

/** Normal-weight concrete: 150 lb/ft³ */

/** 60-lb bag yield ≈ 0.45 ft³; 80-lb bag yield ≈ 0.60 ft³ (ACI 211 typical) */
const BAG_60_FT3 = 0.45;
const BAG_80_FT3 = 0.60;

/**
 * ACPA (American Concrete Pavement Association) control joint guidance:
 *   max spacing = min(1.5 × slab width, 15 ft)
 * Expansion joints: every 20–30 ft; always at abutting structures.
 */
const ACPA_CTRL_MULTIPLIER = 1.5;
const ACPA_CTRL_ABS_MAX_FT = 15;

const LOGO_URL = "/logo.svg";

/* ===================== Helpers ===================== */

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

function toFt(value: number, unit: LengthUnit | JointUnit | ThickUnit): number {
    if (unit === "in") return value / 12;
    if (unit === "m") return value * 3.28084;
    return value; // already ft
}

/* ===================== UI Tokens — verbatim from skill ===================== */

const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";

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
   Plan-View Joint Diagram (pure SVG React component)
   — No external libraries required.
   — Renders a top-down view of the sidewalk with:
       • Teal dashed lines = control joints
       • Orange solid lines  = expansion joints
       • Dimension labels on both axes
       • Legend below the slab
========================= */

type JointDiagramProps = {
    lenFt: number;
    widFt: number;
    ctrlJointCount: number;
    expJointCount: number;
    ctrlSpacingFt: number;
    expSpacingFt: number;
};

function JointDiagram({
    lenFt, widFt, ctrlJointCount, expJointCount,
    ctrlSpacingFt, expSpacingFt,
}: JointDiagramProps) {
    if (lenFt <= 0 || widFt <= 0) return null;

    const SVG_W = 600;
    const PAD_L = 40;  // left — room for width label
    const PAD_R = 16;
    const PAD_T = 28;  // top — room for length label
    const PAD_B = 48;  // bottom — legend
    const DRAW_W = SVG_W - PAD_L - PAD_R;

    // Scale slab height proportionally, clamped so diagram stays readable
    const aspectRatio = widFt / lenFt;
    const DRAW_H = Math.min(Math.max(aspectRatio * DRAW_W, 36), 120);
    const SVG_H = PAD_T + DRAW_H + PAD_B;

    const scaleX = DRAW_W / lenFt; // px per foot (X = length direction)

    // X positions for control joints (interior only)
    const ctrlXs: number[] = [];
    for (let i = 1; i <= ctrlJointCount; i++) {
        const xFt = i * ctrlSpacingFt;
        if (xFt < lenFt) ctrlXs.push(PAD_L + xFt * scaleX);
    }

    // X positions for expansion joints (interior only)
    const expXs: number[] = [];
    for (let i = 1; i <= expJointCount; i++) {
        const xFt = i * expSpacingFt;
        if (xFt < lenFt) expXs.push(PAD_L + xFt * scaleX);
    }

    const slabLeft = PAD_L;
    const slabTop = PAD_T;
    const slabRight = PAD_L + DRAW_W;
    const slabBot = PAD_T + DRAW_H;

    // Legend Y
    const legendY = slabBot + 20;

    return (
        <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            aria-label="Sidewalk plan-view joint layout diagram"
            role="img"
            style={{ display: "block" }}
        >
            {/* ── Slab body ── */}
            <rect
                x={slabLeft} y={slabTop}
                width={DRAW_W} height={DRAW_H}
                rx="3"
                className="fill-slate-700 stroke-slate-500"
                strokeWidth="1"
            />

            {/* ── Control joints — teal dashed vertical lines ── */}
            {ctrlXs.map((x, i) => (
                <line
                    key={`ctrl-${i}`}
                    x1={x} y1={slabTop}
                    x2={x} y2={slabBot}
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                />
            ))}

            {/* ── Expansion joints — orange solid vertical lines ── */}
            {expXs.map((x, i) => (
                <line
                    key={`exp-${i}`}
                    x1={x} y1={slabTop}
                    x2={x} y2={slabBot}
                    stroke="#f97316"
                    strokeWidth="2.5"
                />
            ))}

            {/* ── Dimension: length (top) ── */}
            <line
                x1={slabLeft} y1={slabTop - 6}
                x2={slabRight} y2={slabTop - 6}
                stroke="#64748b" strokeWidth="0.75"
            />
            <line x1={slabLeft} y1={slabTop - 10} x2={slabLeft} y2={slabTop - 2} stroke="#64748b" strokeWidth="0.75" />
            <line x1={slabRight} y1={slabTop - 10} x2={slabRight} y2={slabTop - 2} stroke="#64748b" strokeWidth="0.75" />
            <text
                x={PAD_L + DRAW_W / 2} y={slabTop - 10}
                textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="inherit"
            >
                {nf(lenFt, 1)} ft
            </text>

            {/* ── Dimension: width (left, rotated) ── */}
            <text
                x={PAD_L - 8}
                y={slabTop + DRAW_H / 2}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
                fontFamily="inherit"
                transform={`rotate(-90, ${PAD_L - 8}, ${slabTop + DRAW_H / 2})`}
            >
                {nf(widFt, 1)} ft
            </text>

            {/* ── Legend ── */}
            {/* Control joint swatch */}
            <line x1={slabLeft} y1={legendY} x2={slabLeft + 24} y2={legendY}
                stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x={slabLeft + 30} y={legendY + 4} fontSize="11" fill="#94a3b8" fontFamily="inherit">
                Control joints ({ctrlJointCount})
            </text>
            {/* Expansion joint swatch */}
            <line x1={slabLeft + 160} y1={legendY} x2={slabLeft + 184} y2={legendY}
                stroke="#f97316" strokeWidth="2.5" />
            <text x={slabLeft + 190} y={legendY + 4} fontSize="11" fill="#94a3b8" fontFamily="inherit">
                Expansion joints ({expJointCount})
            </text>

            {/* ── "Diagram not to scale" note if many joints ── */}
            {(ctrlJointCount + expJointCount) > 20 && (
                <text
                    x={SVG_W - PAD_R} y={legendY + 4}
                    textAnchor="end" fontSize="10" fill="#64748b" fontFamily="inherit"
                >
                    (diagram simplified — joints to scale)
                </text>
            )}
        </svg>
    );
}

/* =========================
   Main Component
========================= */

export default function ConcreteSidewalkCalc() {

    /* ---------- Unit System ---------- */
    const [unitSystem, setUnitSystem] = React.useState<"imperial" | "metric">("imperial");

    /* ---------- Mode ---------- */
    const [advancedMode, setAdvancedMode] = React.useState(false);
    const [projectType, setProjectType] = React.useState<ProjectType>("residential");

    /* ---------- Dimensions ---------- */
    const [length, setLength] = React.useState("50");
    const [lenUnit, setLenUnit] = React.useState<LengthUnit>("ft");
    const [width, setWidth] = React.useState("4");
    const [widUnit, setWidUnit] = React.useState<LengthUnit>("ft");
    const [thickness, setThickness] = React.useState("4");
    const [thickUnit, setThickUnit] = React.useState<ThickUnit>("in");
    const [waste, setWaste] = React.useState("10");

    /* ---------- Joints ---------- */
    const [ctrlSpacing, setCtrlSpacing] = React.useState("5");
    const [ctrlUnit, setCtrlUnit] = React.useState<JointUnit>("ft");
    const [expSpacing, setExpSpacing] = React.useState("20");
    const [expUnit, setExpUnit] = React.useState<JointUnit>("ft");

    /* ---------- Advanced / Cost ---------- */
    const [pricePerYd3, setPricePerYd3] = React.useState("");
    const [finishCost, setFinishCost] = React.useState("");
    const [deliveryCost, setDeliveryCost] = React.useState("");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Derived values ===================== */

    const lenFt = toFt(parseFloat(length) || 0, lenUnit);
    const widFt = toFt(parseFloat(width) || 0, widUnit);
    const thickFt = toFt(parseFloat(thickness) || 0, thickUnit);
    const wastePct = Math.max(0, Math.min(50, parseFloat(waste) || 0));

    const slabAreaSqFt = lenFt * widFt;
    const netVolFt3 = slabAreaSqFt * thickFt;
    const grossVolFt3 = netVolFt3 * (1 + wastePct / 100);
    const volYd3 = grossVolFt3 / 27;
    const volM3 = grossVolFt3 * 0.0283168;
    const weightLbs = grossVolFt3 * 150;   // 150 lb/ft³
    const bags60 = Math.ceil(grossVolFt3 / BAG_60_FT3);
    const bags80 = Math.ceil(grossVolFt3 / BAG_80_FT3);

    // Joint counts — interior joints only (not including slab ends)
    const ctrlSpacFt = toFt(parseFloat(ctrlSpacing) || 0, ctrlUnit);
    const expSpacFt = toFt(parseFloat(expSpacing) || 0, expUnit);
    const ctrlJoints = ctrlSpacFt > 0 ? Math.max(0, Math.ceil(lenFt / ctrlSpacFt) - 1) : 0;
    const expJoints = expSpacFt > 0 ? Math.max(0, Math.ceil(lenFt / expSpacFt) - 1) : 0;

    // ACPA compliance warning:
    // Control joint spacing > min(1.5 × slab width, 15 ft)
    const acpaMaxCtrl = Math.min(widFt * ACPA_CTRL_MULTIPLIER, ACPA_CTRL_ABS_MAX_FT);
    const acpaWarning = ctrlSpacFt > acpaMaxCtrl && ctrlSpacFt > 0 && widFt > 0;

    // Cost (Advanced)
    const priceYd3 = parseFloat(pricePerYd3) || 0;
    const finCost = parseFloat(finishCost) || 0;
    const delCost = parseFloat(deliveryCost) || 0;
    const matCost = priceYd3 > 0 ? volYd3 * priceYd3 : 0;
    const grandTotal = matCost + finCost + delCost;
    const hasCost = priceYd3 > 0 || finCost > 0 || delCost > 0;

    /* ===================== Presets ===================== */

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "residential") {
            setLength("50"); setLenUnit("ft");
            setWidth("4"); setWidUnit("ft");
            setThickness("4"); setThickUnit("in");
            setWaste("10");
            setCtrlSpacing("5"); setCtrlUnit("ft");
            setExpSpacing("20"); setExpUnit("ft");
        } else if (pt === "municipal") {
            setLength("100"); setLenUnit("ft");
            setWidth("5"); setWidUnit("ft");
            setThickness("6"); setThickUnit("in");
            setWaste("10");
            setCtrlSpacing("5"); setCtrlUnit("ft");
            setExpSpacing("20"); setExpUnit("ft");
        } else {
            setLength("30"); setLenUnit("ft");
            setWidth("3"); setWidUnit("ft");
            setThickness("4"); setThickUnit("in");
            setWaste("10");
            setCtrlSpacing("4"); setCtrlUnit("ft");
            setExpSpacing("25"); setExpUnit("ft");
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
        setProjectType("residential");
        setLength("50"); setLenUnit("ft");
        setWidth("4"); setWidUnit("ft");
        setThickness("4"); setThickUnit("in");
        setWaste("10");
        setCtrlSpacing("5"); setCtrlUnit("ft");
        setExpSpacing("20"); setExpUnit("ft");
        setPricePerYd3(""); setFinishCost(""); setDeliveryCost("");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Concrete Sidewalk Calculator – Print View</title>
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
    <div class="meta"><div>Concrete Sidewalk Calculator</div><div>Printed: ${now}</div></div>
  </div>

  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project type</div><div class="v">${projectType.charAt(0).toUpperCase() + projectType.slice(1)}</div></div>
    <div class="kv"><div class="k">Length</div><div class="v">${length} ${lenUnit}</div></div>
    <div class="kv"><div class="k">Width</div><div class="v">${width} ${widUnit}</div></div>
    <div class="kv"><div class="k">Thickness</div><div class="v">${thickness} ${thickUnit}</div></div>
    <div class="kv"><div class="k">Waste factor</div><div class="v">${waste}%</div></div>
    <div class="kv"><div class="k">Control joint spacing</div><div class="v">${ctrlSpacing} ${ctrlUnit}</div></div>
    <div class="kv"><div class="k">Expansion joint spacing</div><div class="v">${expSpacing} ${expUnit}</div></div>
  </div>

  <h2>Volume &amp; Material Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">Cubic yards</div><div class="v">${nf(volYd3, 2)} yd³</div></div>
    <div class="kv"><div class="k">Cubic feet</div><div class="v">${nf(grossVolFt3, 2)} ft³</div></div>
    <div class="kv"><div class="k">Cubic metres</div><div class="v">${nf(volM3, 3)} m³</div></div>
    <div class="kv"><div class="k">Slab area</div><div class="v">${nf(slabAreaSqFt, 1)} sq ft</div></div>
    <div class="kv"><div class="k">Slab weight</div><div class="v">${nf(weightLbs, 0)} lbs</div></div>
    <div class="kv"><div class="k">60-lb bags</div><div class="v">${nf(bags60, 0)} bags</div></div>
    <div class="kv"><div class="k">80-lb bags</div><div class="v">${nf(bags80, 0)} bags</div></div>
    <div class="kv"><div class="k">Control joints</div><div class="v">${ctrlJoints}</div></div>
    <div class="kv"><div class="k">Expansion joints</div><div class="v">${expJoints}</div></div>
  </div>

  ${hasCost ? `
  <h2>Cost Estimate</h2>
  <div class="grid">
    ${matCost > 0 ? `<div class="kv"><div class="k">Concrete material</div><div class="v">$${nf(matCost)}</div></div>` : ""}
    ${finCost > 0 ? `<div class="kv"><div class="k">Finishing / labour</div><div class="v">$${nf(finCost)}</div></div>` : ""}
    ${delCost > 0 ? `<div class="kv"><div class="k">Delivery</div><div class="v">$${nf(delCost)}</div></div>` : ""}
    <div class="kv"><div class="k">Grand total</div><div class="v">$${nf(grandTotal)}</div></div>
  </div>` : ""}

  ${acpaWarning ? `<div class="warn">ACPA warning: control joint spacing ${nf(ctrlSpacFt, 1)} ft exceeds the recommended maximum of ${nf(acpaMaxCtrl, 1)} ft (1.5× slab width or 15 ft). Wider spacing increases cracking risk.</div>` : ""}

  <div class="footer">
    <p>Estimates only. Actual quantities may vary based on site conditions, subbase preparation, and mix design.</p>
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

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Concrete Sidewalk Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate concrete volume, pre-mixed bags, slab weight, control joints, expansion joints,
                    and project cost for a new concrete sidewalk. Results appear after you press{" "}
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
                                        setLenUnit("ft");
                                        setWidUnit("ft");
                                        setThickUnit("in");
                                        setCtrlUnit("ft");
                                        setExpUnit("ft");
                                    } else {
                                        setLenUnit("m");
                                        setWidUnit("m");
                                        setThickUnit("ft");
                                        setCtrlUnit("ft");
                                        setExpUnit("ft");
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
                                { key: "residential", label: "Residential (4\" × 4 ft)" },
                                { key: "municipal", label: "Municipal / ADA (6\" × 5 ft)" },
                                { key: "walkway", label: "Garden Walkway (4\" × 3 ft)" },
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
                            Presets load typical dimensions and joint spacings. Override any value below.
                        </p>
                    </section>

                    {/* ── STEP 1 — Dimensions ── */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Sidewalk Dimensions</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <Field label="Length" hint="Total sidewalk run." subHint="Longest dimension along the path">
                                <div className="flex gap-2">
                                    <NumberInput value={length} onChange={(v) => { setLength(v); setSubmitted(false); }}
                                        placeholder="50" ariaLabel="Length" />
                                    <UnitSelect value={lenUnit}
                                        onChange={(v) => { setLenUnit(v as LengthUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }, { value: "m", label: "m" }]}
                                        ariaLabel="Length unit" />
                                </div>
                            </Field>

                            <Field label="Width" hint="Sidewalk width (perpendicular to travel)."
                                subHint="ADA min: 36&quot; clear; typical: 4–5 ft">
                                <div className="flex gap-2">
                                    <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }}
                                        placeholder="4" ariaLabel="Width" />
                                    <UnitSelect value={widUnit}
                                        onChange={(v) => { setWidUnit(v as LengthUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }, { value: "m", label: "m" }]}
                                        ariaLabel="Width unit" />
                                </div>
                            </Field>

                            <Field label="Thickness" hint="Slab depth."
                                subHint="4&quot; pedestrian · 6&quot; heavy / ADA">
                                <div className="flex gap-2">
                                    <NumberInput value={thickness} onChange={(v) => { setThickness(v); setSubmitted(false); }}
                                        placeholder="4" ariaLabel="Thickness" />
                                    <UnitSelect value={thickUnit}
                                        onChange={(v) => { setThickUnit(v as ThickUnit); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Thickness unit" />
                                </div>
                            </Field>
                        </div>

                        <div className="mt-4">
                            <Field label="Waste / overpour factor"
                                hint="Accounts for subbase irregularities and spills."
                                subHint="10% typical; 15% for curved or uneven subbase">
                                <NumberInput value={waste} onChange={(v) => { setWaste(v); setSubmitted(false); }}
                                    placeholder="10" badge="%" ariaLabel="Waste %" />
                            </Field>
                        </div>
                    </section>

                    {/* ── STEP 2 — Joint Planning ── */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Joint Planning</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Control joint spacing"
                                hint="Tooled or saw-cut joints to control cracking."
                                subHint="ACPA: 1–1.5× slab width; max 15 ft">
                                <div className="flex gap-2">
                                    <NumberInput value={ctrlSpacing}
                                        onChange={(v) => { setCtrlSpacing(v); setSubmitted(false); }}
                                        placeholder="5" ariaLabel="Control joint spacing" />
                                    <UnitSelect value={ctrlUnit}
                                        onChange={(v) => { setCtrlUnit(v as JointUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }]}
                                        ariaLabel="Control joint unit" />
                                </div>
                            </Field>

                            <Field label="Expansion joint spacing"
                                hint="Compressible joint filler; required at all abutting structures."
                                subHint="Typically every 20–30 ft along run">
                                <div className="flex gap-2">
                                    <NumberInput value={expSpacing}
                                        onChange={(v) => { setExpSpacing(v); setSubmitted(false); }}
                                        placeholder="20" ariaLabel="Expansion joint spacing" />
                                    <UnitSelect value={expUnit}
                                        onChange={(v) => { setExpUnit(v as JointUnit); setSubmitted(false); }}
                                        options={[{ value: "ft", label: "ft" }, { value: "in", label: "in" }]}
                                        ariaLabel="Expansion joint unit" />
                                </div>
                            </Field>
                        </div>

                        {/* ACPA compliance warning */}
                        {acpaWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">
                                    <strong>ACPA guidance:</strong> Control joint spacing {nf(ctrlSpacFt, 1)} ft exceeds
                                    the recommended maximum of {nf(acpaMaxCtrl, 1)} ft (1.5× slab width{" "}
                                    {widFt > 0 ? `[${nf(widFt, 1)} ft]` : ""} or 15 ft, whichever is less).
                                    Wider spacing significantly increases the risk of uncontrolled cracking. Reduce spacing
                                    or consult your local concrete pavement guidelines.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* ── STEP 3 — Cost (Advanced) ── */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step3">
                            <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Cost Inputs</h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field label="Concrete price" hint="Ready-mix delivered cost.">
                                    <NumberInput value={pricePerYd3}
                                        onChange={(v) => { setPricePerYd3(v); setSubmitted(false); }}
                                        placeholder="e.g., 140" badge="$/yd³" ariaLabel="Price per cubic yard" />
                                </Field>
                                <Field label="Finishing / labour" hint="Screeding, floating, edging, curing.">
                                    <NumberInput value={finishCost}
                                        onChange={(v) => { setFinishCost(v); setSubmitted(false); }}
                                        placeholder="e.g., 300" badge="$" ariaLabel="Finishing cost" />
                                </Field>
                                <Field label="Delivery / misc" hint="Pump hire, formwork, disposal.">
                                    <NumberInput value={deliveryCost}
                                        onChange={(v) => { setDeliveryCost(v); setSubmitted(false); }}
                                        placeholder="e.g., 150" badge="$" ariaLabel="Delivery cost" />
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
                                <KV k="Length" v={`${length} ${lenUnit}`} />
                                <KV k="Width" v={`${width} ${widUnit}`} />
                                <KV k="Thickness" v={`${thickness} ${thickUnit}`} />
                                <KV k="Waste" v={`${waste}%`} />
                                <KV k="Ctrl spacing" v={`${ctrlSpacing} ${ctrlUnit}`} />
                                <KV k="Exp spacing" v={`${expSpacing} ${expUnit}`} />
                                <KV k="Mode" v={advancedMode ? "Advanced" : "Quick"} />
                            </div>
                        </div>

                        {/* Primary results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Volume &amp; Material Results</div>

                            {/* Hero number */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">Concrete Volume</span>
                                <span className="text-4xl font-extrabold text-teal-400">{nf(volYd3, 2)}</span>
                                <span className="text-xs text-slate-400 mt-1">
                                    cubic yards&nbsp;·&nbsp;{nf(grossVolFt3, 1)} ft³&nbsp;·&nbsp;{nf(volM3, 3)} m³
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Cubic yards" v={`${nf(volYd3, 2)} yd³`} />
                                <KV k="Cubic feet" v={`${nf(grossVolFt3, 2)} ft³`} />
                                <KV k="Cubic metres" v={`${nf(volM3, 3)} m³`} />
                                <KV k="Slab area" v={`${nf(slabAreaSqFt, 1)} sq ft`} />
                                <KV k="Slab weight" v={`${nf(weightLbs, 0)} lbs`} />
                                <KV k="Waste included" v={`${waste}% (${nf(grossVolFt3 - netVolFt3, 2)} ft³)`} />
                            </div>
                        </div>

                        {/* Bags */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Pre-Mixed Bag Estimates</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <KV k="60-lb bags (0.45 ft³ each)" v={`${nf(bags60, 0)} bags`} />
                                <KV k="80-lb bags (0.60 ft³ each)" v={`${nf(bags80, 0)} bags`} />
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Bag counts include waste factor. For volumes &gt; 1 yd³ a ready-mix truck is more economical than bags.
                            </p>
                        </div>

                        {/* Joint results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Joint Planning Results</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <KV k="Control joints" v={`${ctrlJoints} joints`} />
                                <KV k="Control spacing" v={`${nf(ctrlSpacFt, 2)} ft`} />
                                <KV k="Expansion joints" v={`${expJoints} joints`} />
                                <KV k="Expansion spacing" v={`${nf(expSpacFt, 2)} ft`} />
                                <KV k="ACPA max ctrl spacing" v={`${nf(acpaMaxCtrl, 1)} ft`} />
                                <KV k="Control joint status" v={acpaWarning ? "⚠ Exceeds ACPA max" : "✓ Within ACPA limit"} />
                            </div>
                        </div>

                        {/* ── PLAN-VIEW JOINT DIAGRAM ── */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-1 text-sm font-semibold text-white">Plan-View Joint Diagram</div>
                            <p className="text-[11px] text-white/50 mb-3">
                                Top-down proportional view of the sidewalk. Teal dashed lines = control joints.
                                Orange solid lines = expansion joints. Diagram width scaled to your length input.
                            </p>
                            <div className="rounded-sm bg-slate-800 border border-slate-700 p-3">
                                <JointDiagram
                                    lenFt={lenFt}
                                    widFt={widFt}
                                    ctrlJointCount={ctrlJoints}
                                    expJointCount={expJoints}
                                    ctrlSpacingFt={ctrlSpacFt}
                                    expSpacingFt={expSpacFt}
                                />
                            </div>
                        </div>

                        {/* Cost (Advanced) */}
                        {advancedMode && hasCost && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {matCost > 0 && <KV k="Concrete material" v={`$${nf(matCost)}`} />}
                                    {finCost > 0 && <KV k="Finishing / labour" v={`$${nf(finCost)}`} />}
                                    {delCost > 0 && <KV k="Delivery / misc" v={`$${nf(delCost)}`} />}
                                    <KV k="Grand total" v={`$${nf(grandTotal)}`} />
                                </div>
                                <p className="mt-2 text-xs text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                    Concrete cost = {nf(volYd3, 2)} yd³ × ${pricePerYd3}/yd³. Prices vary by region and supplier.
                                </p>
                            </div>
                        )}

                        {/* Thickness & strength reference table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                Sidewalk Thickness &amp; Concrete Strength Reference
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            {["Application", "Thickness", "Min PSI", "Control joint max", "Notes"].map((h) => (
                                                <th key={h} className="text-left py-2 px-2 text-slate-400 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { app: "Residential / garden walk", thick: "4\"", psi: "2,500–3,000", ctrl: "1.5× width or 6 ft", notes: "Foot traffic only" },
                                            { app: "Shared / light access", thick: "5\"", psi: "3,000", ctrl: "1.5× width or 7.5 ft", notes: "Occasional bike/cart" },
                                            { app: "Municipal / ADA compliant", thick: "6\"", psi: "3,500–4,000", ctrl: "1.5× width or 9 ft", notes: "Heavy use; requires 36\" clear width" },
                                            { app: "Service / utility access", thick: "6–8\"", psi: "4,000+", ctrl: "8–10 ft max", notes: "Light vehicle crossings" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-slate-800 text-slate-300">
                                                <td className="py-2 px-2 font-medium">{row.app}</td>
                                                <td className="py-2 px-2 text-teal-400 font-semibold">{row.thick}</td>
                                                <td className="py-2 px-2">{row.psi}</td>
                                                <td className="py-2 px-2">{row.ctrl}</td>
                                                <td className="py-2 px-2 text-white/60">{row.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Control joint depth = 1/4 of slab thickness (min). ACPA recommendations. Verify with local code.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This concrete sidewalk
                                    calculator provides material estimates only. Actual quantities may vary based on
                                    subbase conditions, mix design, placement methods, and site geometry. Joint spacing
                                    recommendations follow ACPA guidance and should be verified against local codes
                                    and project specifications by a licensed engineer or contractor.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
