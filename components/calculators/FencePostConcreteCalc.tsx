"use client";

import { AnimatedNumber } from "./AnimatedNumber";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Info, Printer, AlertTriangle } from "lucide-react";
import {
    toFeet,
    cubicFtToYd,
    cubicFtToM3,
    postDisplacement,
    applyWaste,
    concreteBags,
    materialCost,
} from "@/lib/calc-engine";
import type { LengthUnit } from "@/lib/calc-engine";

/* ─── Types ─────────────────────────────────────────────────────────── */
type ProjectType = "privacy" | "picket" | "farm";
type PostShape = "square" | "round";
type FenceUnit = "ft" | "yd" | "m";
type DimUnit = "in" | "ft" | "cm";

/* ─── Design tokens (verbatim) ───────────────────────────────────────── */
const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

/* ─── Helpers ────────────────────────────────────────────────────────── */
function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}
const LOGO_URL = "/logo.svg";

/* ─── Reference data ─────────────────────────────────────────────────── */
const POST_REFERENCE = [
    { type: "4×4 Wood Post", actual: '3.5" × 3.5"', holeDia: '10"–12"', minEmbed: '24"' },
    { type: "6×6 Wood Post", actual: '5.5" × 5.5"', holeDia: '12"–16"', minEmbed: '24"' },
    { type: '4" Round Post', actual: '4" diameter', holeDia: '10"–12"', minEmbed: '24"' },
    { type: '6" Round Post', actual: '6" diameter', holeDia: '12"–16"', minEmbed: '30"' },
    { type: '4" Steel Pipe', actual: '4" O.D.', holeDia: '10"–12"', minEmbed: '24"' },
] as const;

/* ─── Presets ─────────────────────────────────────────────────────────── */
const PRESETS: Record<ProjectType, {
    fenceLength: string; postSpacing: string;
    holeDia: string; holeDepth: string;
    postShape: PostShape; postSize: string; embedDepth: string;
    wastePct: string;
}> = {
    privacy: {
        fenceLength: "100", postSpacing: "8", holeDia: "12", holeDepth: "24",
        postShape: "square", postSize: "3.5", embedDepth: "24", wastePct: "10",
    },
    picket: {
        fenceLength: "80", postSpacing: "8", holeDia: "10", holeDepth: "24",
        postShape: "square", postSize: "3.5", embedDepth: "24", wastePct: "10",
    },
    farm: {
        fenceLength: "200", postSpacing: "10", holeDia: "12", holeDepth: "36",
        postShape: "round", postSize: "6", embedDepth: "36", wastePct: "10",
    },
};

const PRESET_LABELS: Record<ProjectType, string> = {
    privacy: "Privacy Fence",
    picket: "Picket Fence",
    farm: "Farm Fence",
};

/* ─── Local sub-components ───────────────────────────────────────────── */
function Field({ id, label, children, hint, subHint }: {
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

function NumberInput({ id, value, onChange, placeholder, badge, ariaLabel }: {
    id?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; badge?: string; ariaLabel?: string;
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

function UnitSelect({ value, onChange, options, ariaLabel }: {
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
                    <SelectItem key={o.value} value={o.value} className="text-white">
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/* ─── Component ──────────────────────────────────────────────────────── */
export default function FencePostCalc() {
    /* Mode */
    const [advancedMode, setAdvancedMode] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [projectType, setProjectType] = useState<ProjectType>("privacy");

    /* Units */
    const [fenceUnit, setFenceUnit] = useState<FenceUnit>("ft");
    const [dimUnit, setDimUnit] = useState<DimUnit>("in");

    /* Fence layout */
    const [fenceLength, setFenceLength] = useState("100");
    const [postSpacing, setPostSpacing] = useState("8");

    /* Hole dimensions */
    const [holeDia, setHoleDia] = useState("12");
    const [holeDepth, setHoleDepth] = useState("24");

    /* Post details */
    const [postShape, setPostShape] = useState<PostShape>("square");
    const [postSize, setPostSize] = useState("3.5");
    const [embedDepth, setEmbedDepth] = useState("24");

    /* Waste */
    const [wastePct, setWastePct] = useState("10");

    /* Advanced */
    const [bagSize, setBagSize] = useState<"40" | "60" | "80">("80");
    const [pricePerBag, setPricePerBag] = useState("");
    const [laborCost, setLaborCost] = useState("");

    /* ── Preset loader ──────────────────────────────────────────────── */
    function applyPreset(pt: ProjectType) {
        const p = PRESETS[pt];
        setProjectType(pt);
        setFenceLength(p.fenceLength);
        setPostSpacing(p.postSpacing);
        setHoleDia(p.holeDia);
        setHoleDepth(p.holeDepth);
        setPostShape(p.postShape);
        setPostSize(p.postSize);
        setEmbedDepth(p.embedDepth);
        setWastePct(p.wastePct);
        setSubmitted(false);
    }

    /* ── Reset ──────────────────────────────────────────────────────── */
    function resetAll() {
        setAdvancedMode(false);
        setSubmitted(false);
        setProjectType("privacy");
        setFenceUnit("ft");
        setDimUnit("in");
        setFenceLength("100");
        setPostSpacing("8");
        setHoleDia("12");
        setHoleDepth("24");
        setPostShape("square");
        setPostSize("3.5");
        setEmbedDepth("24");
        setWastePct("10");
        setBagSize("80");
        setPricePerBag("");
        setLaborCost("");
    }

    /* ── Calculate ──────────────────────────────────────────────────── */
    function handleCalculate(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
    }

    /* ── Inline derived values ──────────────────────────────────────── */
    const fenceLen_ft = toFeet(parseFloat(fenceLength) || 0, fenceUnit as LengthUnit);
    const spacing_ft = toFeet(parseFloat(postSpacing) || 1, fenceUnit as LengthUnit);
    const numPosts = fenceLen_ft > 0 && spacing_ft > 0
        ? Math.max(2, Math.ceil(fenceLen_ft / spacing_ft) + 1)
        : 0;

    const holeDia_ft = toFeet(parseFloat(holeDia) || 0, dimUnit as LengthUnit);
    const holeDepth_ft = toFeet(parseFloat(holeDepth) || 0, dimUnit as LengthUnit);
    const holeVol_ft3 = Math.PI * Math.pow(holeDia_ft / 2, 2) * holeDepth_ft;

    const postDim_ft = toFeet(parseFloat(postSize) || 0, dimUnit as LengthUnit);
    const embedDepth_ft = Math.min(
        toFeet(parseFloat(embedDepth) || 0, dimUnit as LengthUnit),
        holeDepth_ft,
    );

    // postDisplacement returns net concrete after subtracting post volume
    const netPerHole_ft3 = postDisplacement(holeVol_ft3, postShape, postDim_ft, postDim_ft, embedDepth_ft);
    const postDisp_ft3 = Math.max(0, holeVol_ft3 - netPerHole_ft3);

    const totalNet_ft3 = netPerHole_ft3 * numPosts;
    const wasteResult = applyWaste(totalNet_ft3, parseFloat(wastePct) || 0);
    const totalAdj_ft3 = wasteResult.total;
    const totalYd3 = cubicFtToYd(totalAdj_ft3);
    const totalM3 = cubicFtToM3(totalAdj_ft3);
    const bagResult = concreteBags(totalAdj_ft3);

    // Compliance: embed depth < 24 in → IRC warning
    const embedIn = toFeet(parseFloat(embedDepth) || 0, dimUnit as LengthUnit) * 12;
    const complianceWarning = submitted && embedIn > 0 && embedIn < 24
        ? "IRC R403.1.4: Post embedment depth appears to be less than 24 inches. Most codes require posts to extend at least 24 inches — or below the local frost line — to prevent frost heave and post movement."
        : null;

    // Advanced cost
    const ppb = parseFloat(pricePerBag) || 0;
    const laborCostVal = parseFloat(laborCost) || 0;
    const heroBags = bagSize === "40" ? bagResult.bags40lb
        : bagSize === "60" ? bagResult.bags60lb
            : bagResult.bags80lb;
    const concreteCost = ppb > 0 ? materialCost(heroBags, ppb).subtotal : 0;
    const totalCost = concreteCost + laborCostVal;

    /* ── Print ──────────────────────────────────────────────────────── */
    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Fence Post Concrete Calculator – Print View</title>
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
    <div class="meta"><div>Fence Post Concrete Calculator</div><div>Printed: ${now}</div></div>
  </div>
  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Fence Length</div><div class="v">${fenceLength} ${fenceUnit}</div></div>
    <div class="kv"><div class="k">Post Spacing</div><div class="v">${postSpacing} ${fenceUnit}</div></div>
    <div class="kv"><div class="k">Posts Calculated</div><div class="v">${numPosts}</div></div>
    <div class="kv"><div class="k">Hole Diameter</div><div class="v">${holeDia} ${dimUnit}</div></div>
    <div class="kv"><div class="k">Hole Depth</div><div class="v">${holeDepth} ${dimUnit}</div></div>
    <div class="kv"><div class="k">Post Shape</div><div class="v">${postShape}</div></div>
    <div class="kv"><div class="k">Post Size</div><div class="v">${postSize} ${dimUnit}</div></div>
    <div class="kv"><div class="k">Embed Depth</div><div class="v">${embedDepth} ${dimUnit}</div></div>
    <div class="kv"><div class="k">Waste Factor</div><div class="v">${wastePct}%</div></div>
  </div>
  <h2>Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">Concrete Per Hole</div><div class="v">${nf(netPerHole_ft3, 4)} ft³</div></div>
    <div class="kv"><div class="k">Total Net Concrete</div><div class="v">${nf(totalNet_ft3, 2)} ft³</div></div>
    <div class="kv"><div class="k">Total With Waste</div><div class="v">${nf(totalAdj_ft3, 2)} ft³</div></div>
    <div class="kv"><div class="k">Cubic Yards</div><div class="v">${nf(totalYd3, 3)} yd³</div></div>
    <div class="kv"><div class="k">40 lb Bags</div><div class="v">${bagResult.bags40lb}</div></div>
    <div class="kv"><div class="k">60 lb Bags</div><div class="v">${bagResult.bags60lb}</div></div>
    <div class="kv"><div class="k">80 lb Bags</div><div class="v">${bagResult.bags80lb}</div></div>
  </div>
  <div class="footer">
    <p>Estimates only. Actual quantities may vary based on site conditions and pour technique.</p>
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

    /* ── JSX ─────────────────────────────────────────────────────────── */
    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Fence Post Concrete Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Calculate concrete bags and volume for fence posts by total fence length and post spacing.{" "}
                    Results appear after you press <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate}>

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
                        <div className="grid grid-cols-3 gap-2">
                            {(["privacy", "picket", "farm"] as ProjectType[]).map((pt) => (
                                <Button key={pt} type="button" onClick={() => applyPreset(pt)}
                                    className={cn("h-9 rounded-sm text-sm",
                                        projectType === pt ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    {PRESET_LABELS[pt]}
                                </Button>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">
                            Selecting a project type loads sensible defaults. You can override any value below.
                        </p>
                    </section>

                    {/* STEP 1 — FENCE LAYOUT */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">
                            Step 1 — Fence Layout
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field id="fenceLength" label="Total Fence Length"
                                hint="Total linear length of fence run to install"
                                subHint="Posts are placed at each end plus evenly spaced in between">
                                <div className="flex gap-2">
                                    <NumberInput
                                        id="fenceLength"
                                        value={fenceLength}
                                        onChange={(v) => { setFenceLength(v); setSubmitted(false); }}
                                        placeholder="100"
                                        ariaLabel="Total fence length"
                                    />
                                    <UnitSelect
                                        value={fenceUnit}
                                        onChange={(v) => { setFenceUnit(v as FenceUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "ft", label: "ft" },
                                            { value: "yd", label: "yd" },
                                            { value: "m", label: "m" },
                                        ]}
                                        ariaLabel="Fence length unit"
                                    />
                                </div>
                            </Field>
                            <Field id="postSpacing" label="Post Spacing (on-center)"
                                hint="Distance from the center of one post to the next"
                                subHint="Common: 8 ft for privacy/picket, 10–12 ft for farm fences">
                                <div className="flex gap-2">
                                    <NumberInput
                                        id="postSpacing"
                                        value={postSpacing}
                                        onChange={(v) => { setPostSpacing(v); setSubmitted(false); }}
                                        placeholder="8"
                                        ariaLabel="Post spacing"
                                    />
                                    <UnitSelect
                                        value={fenceUnit}
                                        onChange={(v) => { setFenceUnit(v as FenceUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "ft", label: "ft" },
                                            { value: "yd", label: "yd" },
                                            { value: "m", label: "m" },
                                        ]}
                                        ariaLabel="Post spacing unit"
                                    />
                                </div>
                            </Field>
                        </div>
                        {numPosts > 0 && (
                            <div className="mt-3 rounded-sm border border-teal-700/40 bg-teal-900/20 px-4 py-2">
                                <p className="text-sm text-teal-300">
                                    <span className="font-semibold text-teal-400">{numPosts} posts</span> calculated —{" "}
                                    ⌈{fenceLength} ÷ {postSpacing}⌉ + 1 end post
                                </p>
                            </div>
                        )}
                    </section>

                    {/* STEP 2 — HOLE DIMENSIONS */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">
                            Step 2 — Hole Dimensions
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field id="holeDia" label="Hole Diameter"
                                hint="Rule of thumb: hole diameter ≈ 3× the post width"
                                subHint='E.g., 12" hole for a 4×4 post (3.5" × 3 ≈ 10.5")'>
                                <div className="flex gap-2">
                                    <NumberInput
                                        id="holeDia"
                                        value={holeDia}
                                        onChange={(v) => { setHoleDia(v); setSubmitted(false); }}
                                        placeholder="12"
                                        ariaLabel="Hole diameter"
                                    />
                                    <UnitSelect
                                        value={dimUnit}
                                        onChange={(v) => { setDimUnit(v as DimUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "in", label: "in" },
                                            { value: "ft", label: "ft" },
                                            { value: "cm", label: "cm" },
                                        ]}
                                        ariaLabel="Dimension unit"
                                    />
                                </div>
                            </Field>
                            <Field id="holeDepth" label="Hole Depth"
                                hint="Must extend at or below the local frost line"
                                subHint="Typical: 24–36 in residential; 36–48 in for farm/structural">
                                <div className="flex gap-2">
                                    <NumberInput
                                        id="holeDepth"
                                        value={holeDepth}
                                        onChange={(v) => { setHoleDepth(v); setSubmitted(false); }}
                                        placeholder="24"
                                        ariaLabel="Hole depth"
                                    />
                                    <UnitSelect
                                        value={dimUnit}
                                        onChange={(v) => { setDimUnit(v as DimUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "in", label: "in" },
                                            { value: "ft", label: "ft" },
                                            { value: "cm", label: "cm" },
                                        ]}
                                        ariaLabel="Dimension unit"
                                    />
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* STEP 3 — POST DETAILS */}
                    <section className={stepClass} aria-labelledby="step3">
                        <h3 id="step3" className="text-sm font-semibold text-white/80">
                            Step 3 — Post Details
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <Field label="Post Shape">
                                <Select value={postShape} onValueChange={(v) => { setPostShape(v as PostShape); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass} aria-label="Post shape">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        <SelectItem value="square" className="text-white">Square / Rectangular</SelectItem>
                                        <SelectItem value="round" className="text-white">Round</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field id="postSize"
                                label={postShape === "square" ? "Post Width (actual)" : "Post Diameter (actual)"}
                                subHint={postShape === "square"
                                    ? 'E.g., 3.5 for 4×4; 5.5 for 6×6 (nominal vs. actual)'
                                    : 'E.g., 4 or 6 for round wood or steel post'}>
                                <div className="flex gap-2">
                                    <NumberInput
                                        id="postSize"
                                        value={postSize}
                                        onChange={(v) => { setPostSize(v); setSubmitted(false); }}
                                        placeholder={postShape === "square" ? "3.5" : "4"}
                                        ariaLabel="Post size"
                                    />
                                    <UnitSelect
                                        value={dimUnit}
                                        onChange={(v) => { setDimUnit(v as DimUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "in", label: "in" },
                                            { value: "ft", label: "ft" },
                                            { value: "cm", label: "cm" },
                                        ]}
                                        ariaLabel="Dimension unit"
                                    />
                                </div>
                            </Field>

                            <Field id="embedDepth" label="Post Embed Depth"
                                hint="How far down the post sits inside the concrete"
                                subHint="Typically equals hole depth; minimum 24 in">
                                <div className="flex gap-2">
                                    <NumberInput
                                        id="embedDepth"
                                        value={embedDepth}
                                        onChange={(v) => { setEmbedDepth(v); setSubmitted(false); }}
                                        placeholder="24"
                                        ariaLabel="Post embed depth"
                                    />
                                    <UnitSelect
                                        value={dimUnit}
                                        onChange={(v) => { setDimUnit(v as DimUnit); setSubmitted(false); }}
                                        options={[
                                            { value: "in", label: "in" },
                                            { value: "ft", label: "ft" },
                                            { value: "cm", label: "cm" },
                                        ]}
                                        ariaLabel="Dimension unit"
                                    />
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* STEP 4 — WASTE */}
                    <section className={stepClass} aria-labelledby="step4">
                        <h3 id="step4" className="text-sm font-semibold text-white/80">
                            Step 4 — Waste Factor
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                            <Field id="wastePct" label="Waste / Overage (%)"
                                hint="Accounts for spillage, uneven holes, and over-mixing"
                                subHint="Typical 5–15% for fence post work">
                                <NumberInput
                                    id="wastePct"
                                    value={wastePct}
                                    onChange={(v) => { setWastePct(v); setSubmitted(false); }}
                                    placeholder="10"
                                    badge="%"
                                    ariaLabel="Waste percentage"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* ADVANCED STEP — Material & Cost */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step5">
                            <h3 id="step5" className="text-sm font-semibold text-white/80">
                                Step 5 — Material &amp; Cost (Optional)
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field label="Preferred Bag Size">
                                    <Select value={bagSize} onValueChange={(v) => { setBagSize(v as "40" | "60" | "80"); setSubmitted(false); }}>
                                        <SelectTrigger className={selectTriggerClass} aria-label="Bag size">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            <SelectItem value="40" className="text-white">40 lb (0.30 ft³)</SelectItem>
                                            <SelectItem value="60" className="text-white">60 lb (0.45 ft³)</SelectItem>
                                            <SelectItem value="80" className="text-white">80 lb (0.60 ft³)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field id="pricePerBag" label="Price Per Bag (USD)"
                                    hint="Leave blank to skip cost estimate">
                                    <NumberInput
                                        id="pricePerBag"
                                        value={pricePerBag}
                                        onChange={(v) => { setPricePerBag(v); setSubmitted(false); }}
                                        placeholder="6.50"
                                        badge="$"
                                        ariaLabel="Price per bag"
                                    />
                                </Field>
                                <Field id="laborCost" label="Labor Cost (USD)"
                                    hint="Total estimated labor for installation">
                                    <NumberInput
                                        id="laborCost"
                                        value={laborCost}
                                        onChange={(v) => { setLaborCost(v); setSubmitted(false); }}
                                        placeholder="0"
                                        badge="$"
                                        ariaLabel="Labor cost"
                                    />
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

                {/* ── RESULTS ─────────────────────────────────────────────── */}
                {!submitted ? (
                    <p className="mt-4 text-sm text-white/70">
                        Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
                    </p>
                ) : (
                    <>
                        {/* Print button */}
                        <div className="mt-4 flex justify-end">
                            <Button type="button" onClick={handlePrint}
                                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400" title="Print / Save">
                                <Printer className="h-4 w-4 mr-2" /> Print / Save
                            </Button>
                        </div>

                        {/* Inputs Summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Fence Length" v={`${fenceLength} ${fenceUnit}`} />
                                <KV k="Post Spacing" v={`${postSpacing} ${fenceUnit}`} />
                                <KV k="Posts Counted" v={`${numPosts}`} />
                                <KV k="Hole Diameter" v={`${holeDia} ${dimUnit}`} />
                                <KV k="Hole Depth" v={`${holeDepth} ${dimUnit}`} />
                                <KV k="Post Shape" v={postShape === "square" ? "Square" : "Round"} />
                                <KV k="Post Size" v={`${postSize} ${dimUnit}`} />
                                <KV k="Embed Depth" v={`${embedDepth} ${dimUnit}`} />
                                <KV k="Waste Factor" v={`${wastePct}%`} />
                            </div>
                        </div>

                        {/* Hero */}
                        <div className="mt-4 flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                            <span className="text-xs uppercase tracking-wider text-slate-400">Total 80 lb Bags Needed</span>
                            <span className="text-4xl font-extrabold text-teal-400"><AnimatedNumber value={bagResult.bags80lb} decimals={0} /></span>
                            <span className="text-xs text-slate-400 mt-1">
                                for {numPosts} posts · includes {wastePct}% waste · {nf(totalYd3, 2)} yd³ total
                            </span>
                        </div>

                        {/* Compliance warning */}
                        {complianceWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">{complianceWarning}</p>
                            </div>
                        )}

                        {/* Fence Layout */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Fence Layout</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Total Posts" v={`${numPosts}`} />
                                <KV k="Gross Hole Volume" v={`${nf(holeVol_ft3, 4)} ft³`} />
                                <KV k="Post Displacement" v={`${nf(postDisp_ft3, 4)} ft³`} />
                                <KV k="Net Concrete Per Hole" v={`${nf(netPerHole_ft3, 4)} ft³`} />
                                <KV k="Total Net Concrete" v={`${nf(totalNet_ft3, 3)} ft³`} />
                                <KV k={`With ${wastePct}% Waste`} v={`${nf(totalAdj_ft3, 2)} ft³`} />
                            </div>
                        </div>

                        {/* Volume Summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Volume Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <KV k="Cubic Feet" v={`${nf(totalAdj_ft3, 2)} ft³`} />
                                <KV k="Cubic Yards" v={`${nf(totalYd3, 3)} yd³`} />
                                <KV k="Cubic Meters" v={`${nf(totalM3, 3)} m³`} />
                            </div>
                        </div>

                        {/* Bag Comparison */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Bag Count Comparison</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <KV k="40 lb bags (0.30 ft³)" v={`${bagResult.bags40lb} bags`} />
                                <KV k="60 lb bags (0.45 ft³)" v={`${bagResult.bags60lb} bags`} />
                                <KV k="80 lb bags (0.60 ft³)" v={`${bagResult.bags80lb} bags`} />
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                All bag counts rounded up to nearest whole bag. 80 lb bags typically offer the best value for fence post work.
                            </p>
                        </div>

                        {/* Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">Post Size &amp; Hole Diameter Reference</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-800">
                                        <tr>
                                            <th className="text-left py-2 px-3 text-teal-400 font-semibold">Post Type</th>
                                            <th className="text-left py-2 px-3 text-slate-300 font-medium">Actual Size</th>
                                            <th className="text-left py-2 px-3 text-slate-300 font-medium">Rec. Hole Dia.</th>
                                            <th className="text-left py-2 px-3 text-slate-300 font-medium">Min Embed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {POST_REFERENCE.map((row, i) => (
                                            <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                                                <td className="py-2 px-3 font-semibold text-teal-400">{row.type}</td>
                                                <td className="py-2 px-3 text-slate-300">{row.actual}</td>
                                                <td className="py-2 px-3 text-slate-300">{row.holeDia}</td>
                                                <td className="py-2 px-3 text-slate-300">{row.minEmbed}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Advanced Cost */}
                        {advancedMode && totalCost > 0 && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    {concreteCost > 0 && (
                                        <KV k={`Concrete (${heroBags} bags × $${pricePerBag})`} v={`$${nf(concreteCost)}`} />
                                    )}
                                    {laborCostVal > 0 && (
                                        <KV k="Labor Cost" v={`$${nf(laborCostVal)}`} />
                                    )}
                                    <KV k="Total Estimated Cost" v={`$${nf(totalCost)}`} />
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This fence post concrete calculator
                                    provides project estimates only. Actual concrete quantities may vary based on hole diameter
                                    tolerances, soil conditions, post dimensions, and pour technique. Always verify post depth
                                    requirements with local building codes. Consult a licensed contractor for structural or
                                    retaining fence applications.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
