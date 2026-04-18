"use client";

import { AnimatedNumber } from "./AnimatedNumber";
import React, { useState } from "react";
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

// ── Design tokens (verbatim — never change) ──────────────────────────────────

const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";

const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";

const selectContentClass =
    "rounded-sm border border-slate-700 bg-slate-900 text-white";

const stepClass = "pt-6 mt-4 border-t border-slate-800";

// ── Helpers ───────────────────────────────────────────────────────────────────

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

const LOGO_URL = "/logo.svg";

// ── Mortar-specific data ──────────────────────────────────────────────────────

const MORTAR_TYPES = {
    M: { label: "Type M — 2,500 PSI", strength: 2500, desc: "Below grade, retaining walls, heavy structural loads" },
    S: { label: "Type S — 1,800 PSI", strength: 1800, desc: "Exterior walls, at/below grade, wet or severe exposure" },
    N: { label: "Type N — 750 PSI", strength: 750, desc: "Above-grade exterior & interior masonry, general use" },
    O: { label: "Type O — 350 PSI", strength: 350, desc: "Interior non-load-bearing masonry only" },
} as const;
type MortarTypeKey = keyof typeof MORTAR_TYPES;

// Coverage: 80 lb premix mortar bag covers this many standard 8×8×16 blocks
// (ASTM C270 / masonry industry standard — includes bed and head joints)
const BLOCKS_PER_BAG = { 80: 13, 60: 10, 40: 7 } as const;

// Bags per 100 sq ft of wall area, for 80 lb bags, by material and joint thickness
const AREA_COVERAGE_PER_100SQFT: Record<string, Record<string, number>> = {
    brick: { "3/8": 7, "1/2": 9, "3/4": 12 },
    stone: { "3/8": 8, "1/2": 10, "3/4": 14 },
};

type ProjectType = "block" | "brick" | "stone";
type JointThickness = "3/8" | "1/2" | "3/4";

// ── Local sub-components ──────────────────────────────────────────────────────

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
            {hint && <p className="text-xs text-slate-300">{hint}</p>}
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

// ── Main Calculator ───────────────────────────────────────────────────────────

export default function MortarCalc() {
    const [advancedMode, setAdvancedMode] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Inputs
    const [projectType, setProjectType] = useState<ProjectType>("block");
    const [blockCountInput, setBlockCountInput] = useState("100");
    const [wallArea, setWallArea] = useState("");
    const [jointThickness, setJointThickness] = useState<JointThickness>("3/8");
    const [mortarType, setMortarType] = useState<MortarTypeKey>("N");
    const [wastePercent, setWastePercent] = useState("10");

    // Advanced
    const [bagPrice, setBagPrice] = useState("12");
    const [laborPerBag, setLaborPerBag] = useState("5");

    // ── Presets ──────────────────────────────────────────────────────────────

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "block") {
            setBlockCountInput("100");
            setJointThickness("3/8");
            setMortarType("N");
            setWastePercent("10");
        } else if (pt === "brick") {
            setWallArea("100");
            setJointThickness("3/8");
            setMortarType("N");
            setWastePercent("10");
        } else {
            setWallArea("100");
            setJointThickness("1/2");
            setMortarType("N");
            setWastePercent("15");
        }
    }

    // ── Inline calculations ───────────────────────────────────────────────────

    const count = parseFloat(blockCountInput.replace(/,/g, "")) || 0;
    const area = parseFloat(wallArea.replace(/,/g, "")) || 0;
    const waste = parseFloat(wastePercent) || 0;
    const wasteF = 1 + waste / 100;
    const price = parseFloat(bagPrice) || 0;
    const labor = parseFloat(laborPerBag) || 0;

    let bags80Base = 0;
    let bags60Base = 0;
    let bags40Base = 0;

    if (projectType === "block") {
        bags80Base = count / BLOCKS_PER_BAG[80];
        bags60Base = count / BLOCKS_PER_BAG[60];
        bags40Base = count / BLOCKS_PER_BAG[40];
    } else {
        const cov = AREA_COVERAGE_PER_100SQFT[projectType][jointThickness];
        bags80Base = (area / 100) * cov;
        bags60Base = bags80Base * (80 / 60);
        bags40Base = bags80Base * (80 / 40);
    }

    const bags80 = Math.ceil(bags80Base * wasteF);
    const bags60 = Math.ceil(bags60Base * wasteF);
    const bags40 = Math.ceil(bags40Base * wasteF);
    const bags80NoWaste = Math.ceil(bags80Base);
    const wasteExtra = Math.max(0, bags80 - bags80NoWaste);

    // Approximate wall face area for block mode (face area = 8×16 in = 0.889 ft²/block)
    const wallFaceArea = projectType === "block" ? count * ((8 * 16) / 144) : area;

    // Cost
    const materialCost = bags80 * price;
    const laborCostTotal = bags80 * labor;
    const totalCost = materialCost + laborCostTotal;

    // ASTM C270 compliance
    const complianceWarning: string | null =
        projectType === "block" && mortarType === "O"
            ? "ASTM C270: Type O mortar (350 PSI) is not recommended for structural block walls. Use Type N (750 PSI) minimum for above-grade block walls, or Type S (1,800 PSI) for below-grade or high-load applications."
            : projectType !== "block" && mortarType === "O" && jointThickness === "3/4"
                ? "ASTM C270: Type O mortar may be insufficient for thick-joint stone veneer in exterior or wet-exposure conditions. Consider Type N or S for added durability."
                : null;

    // ── Handlers ─────────────────────────────────────────────────────────────

    function handleCalculate(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
    }

    function resetAll() {
        setAdvancedMode(false);
        setSubmitted(false);
        setProjectType("block");
        setBlockCountInput("100");
        setWallArea("");
        setJointThickness("3/8");
        setMortarType("N");
        setWastePercent("10");
        setBagPrice("12");
        setLaborPerBag("5");
    }

    // ── Print ─────────────────────────────────────────────────────────────────

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        const typeLabel = projectType === "block" ? "Block Wall" : projectType === "brick" ? "Brick Veneer" : "Stone Veneer";

        const inputRows = projectType === "block"
            ? `<div class="kv"><div class="k">Block Count</div><div class="v">${nf(count, 0)}</div></div>`
            : `<div class="kv"><div class="k">Wall Area</div><div class="v">${nf(area, 1)} sq ft</div></div>
               <div class="kv"><div class="k">Joint Thickness</div><div class="v">${jointThickness}"</div></div>`;

        const costRows = advancedMode
            ? `<div class="kv"><div class="k">Material Cost</div><div class="v">$${nf(materialCost, 2)}</div></div>
               <div class="kv"><div class="k">Labor Cost</div><div class="v">$${nf(laborCostTotal, 2)}</div></div>
               <div class="kv"><div class="k">Total Estimated Cost</div><div class="v">$${nf(totalCost, 2)}</div></div>`
            : "";

        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Mortar Calculator – Print View</title>
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
    <div class="meta"><div>Mortar Calculator</div><div>Printed: ${now}</div></div>
  </div>
  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project Type</div><div class="v">${typeLabel}</div></div>
    ${inputRows}
    <div class="kv"><div class="k">Mortar Type</div><div class="v">${MORTAR_TYPES[mortarType].label}</div></div>
    <div class="kv"><div class="k">Waste Allowance</div><div class="v">${waste}%</div></div>
  </div>
  <h2>Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">80 lb Bags (with waste)</div><div class="v">${nf(bags80, 0)}</div></div>
    <div class="kv"><div class="k">60 lb Bags (with waste)</div><div class="v">${nf(bags60, 0)}</div></div>
    <div class="kv"><div class="k">40 lb Bags (with waste)</div><div class="v">${nf(bags40, 0)}</div></div>
    <div class="kv"><div class="k">Base Requirement (80 lb)</div><div class="v">${nf(bags80NoWaste, 0)} bags</div></div>
    <div class="kv"><div class="k">Waste Added</div><div class="v">${nf(wasteExtra, 0)} bags</div></div>
    ${costRows}
  </div>
  <div class="footer">
    <p>Estimates only. Actual mortar quantities may vary based on joint width consistency, mason technique, temperature, and mixing waste.</p>
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

    // ── JSX ───────────────────────────────────────────────────────────────────

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Mortar Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate mortar bags for block walls, brick veneer, and stone veneer projects.{" "}
                    Results appear after you press <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate}>

                    {/* ── Mode Toggle ─────────────────────────────────────── */}
                    <section className={stepClass} aria-labelledby="modeToggle">
                        <div className="flex items-center justify-between">
                            <h3 id="modeToggle" className="text-sm font-semibold text-white/80">Estimate Mode</h3>
                            <div className="flex gap-2">
                                <Button type="button"
                                    onClick={() => { setAdvancedMode(false); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        !advancedMode
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    Quick
                                </Button>
                                <Button type="button"
                                    onClick={() => { setAdvancedMode(true); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        advancedMode
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    Advanced
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* ── Project Type Presets ─────────────────────────────── */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">Project Type</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {(["block", "brick", "stone"] as ProjectType[]).map((pt) => (
                                <Button key={pt} type="button" onClick={() => applyPreset(pt)}
                                    className={cn("h-9 rounded-sm text-sm",
                                        projectType === pt
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    {pt === "block" ? "Block Wall" : pt === "brick" ? "Brick Veneer" : "Stone Veneer"}
                                </Button>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">
                            Selecting a project type loads sensible defaults. You can override any value below.
                        </p>
                    </section>

                    {/* ── Step 1 — Wall Details ────────────────────────────── */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">
                            Step 1 — {projectType === "block" ? "Block Count" : "Wall Area"}
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {projectType === "block" ? (
                                <Field id="blockCount" label="Number of Blocks"
                                    hint="Count total blocks in the wall, or calculate (length × height) ÷ block face area.">
                                    <NumberInput
                                        id="blockCount"
                                        value={blockCountInput}
                                        onChange={(v) => { setBlockCountInput(v); setSubmitted(false); }}
                                        placeholder="e.g. 100"
                                        badge="blocks"
                                    />
                                </Field>
                            ) : (
                                <>
                                    <Field id="wallArea" label="Wall Area"
                                        hint="Total face area to be mortared in sq ft. Deduct large door/window openings.">
                                        <NumberInput
                                            id="wallArea"
                                            value={wallArea}
                                            onChange={(v) => { setWallArea(v); setSubmitted(false); }}
                                            placeholder="e.g. 100"
                                            badge="sq ft"
                                        />
                                    </Field>
                                    <Field id="jointThickness" label="Mortar Joint Thickness">
                                        <Select
                                            value={jointThickness}
                                            onValueChange={(v) => { setJointThickness(v as JointThickness); setSubmitted(false); }}>
                                            <SelectTrigger className={selectTriggerClass} id="jointThickness">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className={selectContentClass}>
                                                <SelectItem value="3/8" className="text-white">3/8 inch — Standard</SelectItem>
                                                <SelectItem value="1/2" className="text-white">1/2 inch — Wide joint</SelectItem>
                                                <SelectItem value="3/4" className="text-white">3/4 inch — Rustic / Stone</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </>
                            )}
                        </div>
                    </section>

                    {/* ── Step 2 — Mortar Specification ───────────────────── */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">
                            Step 2 — Mortar Specification
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field id="mortarType" label="Mortar Type (ASTM C270)"
                                subHint="Type N is the most common choice for above-grade masonry work.">
                                <Select
                                    value={mortarType}
                                    onValueChange={(v) => { setMortarType(v as MortarTypeKey); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass} id="mortarType">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.entries(MORTAR_TYPES) as [MortarTypeKey, (typeof MORTAR_TYPES)[MortarTypeKey]][]).map(([key, val]) => (
                                            <SelectItem key={key} value={key} className="text-white">
                                                {val.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field id="wastePercent" label="Waste / Overage Allowance"
                                hint="10–15% is typical. Stone veneer may need up to 20% due to irregular joint sizes.">
                                <NumberInput
                                    id="wastePercent"
                                    value={wastePercent}
                                    onChange={(v) => { setWastePercent(v); setSubmitted(false); }}
                                    placeholder="10"
                                    badge="%"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* ── Advanced Step 3 — Cost Inputs ─────────────────────── */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step3">
                            <h3 id="step3" className="text-sm font-semibold text-white/80">
                                Step 3 — Cost Estimation
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field id="bagPrice" label="Price per 80 lb Bag"
                                    hint="Typical retail price is $10–$15 per 80 lb premix mortar bag.">
                                    <NumberInput
                                        id="bagPrice"
                                        value={bagPrice}
                                        onChange={(v) => { setBagPrice(v); setSubmitted(false); }}
                                        placeholder="12.00"
                                        badge="$/bag"
                                    />
                                </Field>
                                <Field id="laborPerBag" label="Labor Cost per 80 lb Bag"
                                    hint="Estimated mason labor to mix and apply each 80 lb bag.">
                                    <NumberInput
                                        id="laborPerBag"
                                        value={laborPerBag}
                                        onChange={(v) => { setLaborPerBag(v); setSubmitted(false); }}
                                        placeholder="5.00"
                                        badge="$/bag"
                                    />
                                </Field>
                            </div>
                        </section>
                    )}

                    {/* ── Actions ─────────────────────────────────────────── */}
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

                {/* ── Results ───────────────────────────────────────────── */}
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
                                <KV k="Project Type"
                                    v={projectType === "block" ? "Block Wall" : projectType === "brick" ? "Brick Veneer" : "Stone Veneer"} />
                                {projectType === "block"
                                    ? <KV k="Block Count" v={nf(count, 0)} />
                                    : <KV k="Wall Area" v={`${nf(area, 1)} sq ft`} />
                                }
                                {projectType !== "block" && (
                                    <KV k="Joint Thickness" v={`${jointThickness}"`} />
                                )}
                                <KV k="Mortar Type" v={MORTAR_TYPES[mortarType].label} />
                                <KV k="Waste Allowance" v={`${waste}%`} />
                            </div>
                        </div>

                        {/* Hero */}
                        <div className="mt-4 flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                            <span className="text-xs uppercase tracking-wider text-slate-400">80 lb Mortar Bags Needed</span>
                            <span className="text-4xl font-extrabold text-teal-400"><AnimatedNumber value={bags80} decimals={0} /></span>
                            <span className="text-xs text-slate-400 mt-1">includes {nf(waste, 0)}% waste allowance</span>
                        </div>

                        {/* Primary Results — Bag Counts */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Bag Counts by Size</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="80 lb Bags (with waste)" v={`${nf(bags80, 0)} bags`} />
                                <KV k="60 lb Bags (with waste)" v={`${nf(bags60, 0)} bags`} />
                                <KV k="40 lb Bags (with waste)" v={`${nf(bags40, 0)} bags`} />
                                <KV k="80 lb Base (no waste)" v={`${nf(bags80NoWaste, 0)} bags`} />
                                <KV k="Waste Extra (80 lb)" v={`${nf(wasteExtra, 0)} bags`} />
                                <KV k={projectType === "block" ? "Approx. Wall Area" : "Wall Area"}
                                    v={`${nf(wallFaceArea, 1)} sq ft`} />
                            </div>
                        </div>

                        {/* ASTM Compliance Warning */}
                        {complianceWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">{complianceWarning}</p>
                            </div>
                        )}

                        {/* Advanced — Cost Estimate */}
                        {advancedMode && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    <KV k="Price per 80 lb Bag" v={`$${nf(price, 2)}`} />
                                    <KV k="Material Cost" v={`$${nf(materialCost, 2)}`} />
                                    <KV k="Labor per Bag" v={`$${nf(labor, 2)}`} />
                                    <KV k="Total Labor" v={`$${nf(laborCostTotal, 2)}`} />
                                    <KV k="Total Estimated Cost" v={`$${nf(totalCost, 2)}`} />
                                    <KV k="Cost per Bag (total)" v={`$${nf(price + labor, 2)}`} />
                                </div>
                            </div>
                        )}

                        {/* Reference Table — Mortar Types (ASTM C270) */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                Mortar Type Reference (ASTM C270)
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-2 px-2 text-teal-400 font-semibold">Type</th>
                                            <th className="text-left py-2 px-2 text-slate-300 font-medium">Min. Strength</th>
                                            <th className="text-left py-2 px-2 text-slate-300 font-medium">Best Use</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Object.entries(MORTAR_TYPES) as [MortarTypeKey, (typeof MORTAR_TYPES)[MortarTypeKey]][]).map(([key, val]) => (
                                            <tr key={key}
                                                className={cn(
                                                    "border-t border-slate-800 hover:bg-slate-800/40 transition-colors",
                                                    mortarType === key && "bg-teal-900/20"
                                                )}>
                                                <td className="py-2 px-2 font-bold text-teal-400">Type {key}</td>
                                                <td className="py-2 px-2 text-slate-300">{nf(val.strength, 0)} PSI</td>
                                                <td className="py-2 px-2 text-slate-400">{val.desc}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This mortar calculator
                                    provides project estimates only. Actual mortar consumption may vary based on joint
                                    thickness consistency, mason technique, ambient temperature, unit absorption, and
                                    mixing waste. Always verify quantities with a licensed masonry contractor for
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