// components/calculators/ConcreteBlockCalc.tsx
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
import { Info, Printer } from "lucide-react";

/* =========================
   Types & Constants
========================= */

type BlockSize = "4x8x16" | "6x8x16" | "8x8x16" | "10x8x16" | "12x8x16";
type GroutOption = "none" | "everyOther" | "full" | "custom";
type ReinfOption = "none" | "horizontal" | "vertical" | "both";
type HorizSpacing = "1" | "2" | "3" | "custom";
type VertSpacing = "16" | "24" | "32" | "custom";
type MortarMode = "simple" | "advanced";

type Opening = {
    id: string;
    name: string;
    width: string;       // inches
    height: string;      // inches
    qty: string;
};

/** Block face coverage for standard 8 x 16 face = 128 sq in = 0.8889 sq ft */
const BLOCK_FACE_SQ_FT = 128 / 144; // 0.8889

/** Grout volume per fully-grouted block (cu ft) by block thickness */
const GROUT_PER_BLOCK: Record<BlockSize, number> = {
    "4x8x16": 0.15,
    "6x8x16": 0.30,
    "8x8x16": 0.40,
    "10x8x16": 0.50,
    "12x8x16": 0.60,
};

/** Mortar wet volume per block (cu ft) – advanced mode */
const MORTAR_WET_VOL_PER_BLOCK = 0.02;
const DRY_FACTOR = 1.33;

const BLOCK_LABELS: Record<BlockSize, string> = {
    "4x8x16": '4″ × 8″ × 16″',
    "6x8x16": '6″ × 8″ × 16″',
    "8x8x16": '8″ × 8″ × 16″  (default)',
    "10x8x16": '10″ × 8″ × 16″',
    "12x8x16": '12″ × 8″ × 16″',
};

const LOGO_URL = "/logo.svg";

/* ===================== Helpers ===================== */

function uid() {
    return Math.random().toString(36).slice(2, 9);
}

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

function parseFtIn(ft: string, inches: string): number {
    const f = parseFloat(ft) || 0;
    const i = parseFloat(inches) || 0;
    return Math.max(0, f * 12 + i);  // return total inches
}

/* ===================== UI tokens ===================== */

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
            {hint ? <p className="text-xs text-slate-300">{hint}</p> : null}
            {subHint ? <p className="text-[11px] text-white/60">{subHint}</p> : null}
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
            {badge ? (
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">
                    {badge}
                </span>
            ) : null}
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

/* =========================
   Main Component
========================= */

export default function ConcreteBlockCalc() {
    /* ---------- Unit system ---------- */
    const [unitSystem, setUnitSystem] = React.useState<"imperial" | "metric">("imperial");

    /* ---------- Mode ---------- */
    const [advancedMode, setAdvancedMode] = React.useState(false);

    /* ---------- Wall inputs ---------- */
    const [wallLenFt, setWallLenFt] = React.useState("");
    const [wallLenIn, setWallLenIn] = React.useState("");
    const [wallHtFt, setWallHtFt] = React.useState("");
    const [wallHtIn, setWallHtIn] = React.useState("");
    const [blockSize, setBlockSize] = React.useState<BlockSize>("8x8x16");
    const [wastePct, setWastePct] = React.useState("5");

    /* ---------- Openings ---------- */
    const [openings, setOpenings] = React.useState<Opening[]>([
        { id: uid(), name: "", width: "", height: "", qty: "1" },
    ]);

    /* ---------- Mortar ---------- */
    const [mortarMode, setMortarMode] = React.useState<MortarMode>("simple");
    const [mortarJoint, setMortarJoint] = React.useState("0.375"); // 3/8"

    /* ---------- Grout ---------- */
    const [groutOption, setGroutOption] = React.useState<GroutOption>("none");
    const [customGroutPct, setCustomGroutPct] = React.useState("50");

    /* ---------- Reinforcement ---------- */
    const [reinfOption, setReinfOption] = React.useState<ReinfOption>("none");
    const [horizSpacing, setHorizSpacing] = React.useState<HorizSpacing>("2");
    const [vertSpacing, setVertSpacing] = React.useState<VertSpacing>("24");
    const [customHorizN, setCustomHorizN] = React.useState("2");
    const [customVertIn, setCustomVertIn] = React.useState("24");

    /* ---------- Cost ---------- */
    const [costPerBlock, setCostPerBlock] = React.useState("");
    const [costPerMortarBag, setCostPerMortarBag] = React.useState("");
    const [costPerGroutYd, setCostPerGroutYd] = React.useState("");
    const [costPerReinfFt, setCostPerReinfFt] = React.useState("");
    const [laborCost, setLaborCost] = React.useState("");
    const [deliveryCost, setDeliveryCost] = React.useState("");

    /* ---------- UI state ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Calculations ===================== */

    /** Converts major/minor dimension inputs to total inches, handling both unit systems. */
    function parseDims(major: string, minor: string): number {
        if (unitSystem === "imperial") return parseFtIn(major, minor);
        // metric: major = meters, minor = centimeters → total inches
        const m = parseFloat(major) || 0;
        const cm = parseFloat(minor) || 0;
        return (m * 100 + cm) / 2.54;
    }

    const wallLenInches = parseDims(wallLenFt, wallLenIn);
    const wallHtInches = parseDims(wallHtFt, wallHtIn);
    const wallLenFtTotal = wallLenInches / 12;
    const wallHtFtTotal = wallHtInches / 12;

    // Gross wall area (sq ft)
    const grossWallArea = wallLenFtTotal * wallHtFtTotal;

    // Total opening area (sq ft)
    const totalOpeningArea = advancedMode
        ? openings.reduce((sum, o) => {
            const w = parseFloat(o.width) || 0;   // inches
            const h = parseFloat(o.height) || 0;  // inches
            const q = parseFloat(o.qty) || 0;
            return sum + (w * h * q) / 144; // sq in → sq ft
        }, 0)
        : 0;

    // Net wall area
    const netWallArea = Math.max(0, grossWallArea - totalOpeningArea);

    // Waste
    const waste = Math.max(0, Math.min(15, parseFloat(wastePct) || 0));

    // Base blocks
    const baseBlocks = netWallArea / BLOCK_FACE_SQ_FT;
    const baseBlocksRounded = Math.ceil(baseBlocks);

    // With waste
    const blocksWithWaste = baseBlocks * (1 + waste / 100);
    const finalBlocks = Math.ceil(blocksWithWaste);

    // Mortar – simple
    const mortarBagsSimple = Math.ceil(finalBlocks / 13);

    // Mortar – advanced
    const mortarWetVol = finalBlocks * MORTAR_WET_VOL_PER_BLOCK;
    const mortarDryVol = mortarWetVol * DRY_FACTOR;

    // Grout
    const groutFillPct =
        groutOption === "none"
            ? 0
            : groutOption === "everyOther"
                ? 0.5
                : groutOption === "full"
                    ? 1
                    : Math.max(0, Math.min(100, parseFloat(customGroutPct) || 0)) / 100;

    const fillableBlocks = finalBlocks * groutFillPct;
    const groutVolCuFt = fillableBlocks * GROUT_PER_BLOCK[blockSize];
    const groutVolWithWaste = groutVolCuFt * (1 + waste / 100);
    const groutVolCuYd = groutVolWithWaste / 27;

    // Reinforcement
    const courses = Math.ceil(wallHtInches / 8);

    const horizSpacingN =
        horizSpacing === "custom" ? Math.max(1, parseInt(customHorizN) || 1) : parseInt(horizSpacing);
    const vertSpacingIn =
        vertSpacing === "custom" ? Math.max(1, parseFloat(customVertIn) || 24) : parseInt(vertSpacing);

    const showHoriz = reinfOption === "horizontal" || reinfOption === "both";
    const showVert = reinfOption === "vertical" || reinfOption === "both";

    const horizRuns = showHoriz ? Math.ceil(courses / horizSpacingN) : 0;
    const horizReinfLenFt = horizRuns * wallLenFtTotal;
    const horizReinfWithWaste = horizReinfLenFt * (1 + waste / 100);

    const vertLines = showVert ? Math.ceil(wallLenInches / vertSpacingIn) + 1 : 0;
    const vertReinfLenFt = vertLines * wallHtFtTotal;
    const vertReinfWithWaste = vertReinfLenFt * (1 + waste / 100);

    const totalReinfFt = horizReinfWithWaste + vertReinfWithWaste;

    // Cost
    const pBlock = parseFloat(costPerBlock) || 0;
    const pMortar = parseFloat(costPerMortarBag) || 0;
    const pGrout = parseFloat(costPerGroutYd) || 0;
    const pReinf = parseFloat(costPerReinfFt) || 0;
    const pLabor = parseFloat(laborCost) || 0;
    const pDelivery = parseFloat(deliveryCost) || 0;

    const blockCostTotal = finalBlocks * pBlock;
    const mortarCostTotal = mortarBagsSimple * pMortar;
    const groutCostTotal = groutVolCuYd * pGrout;
    const reinfCostTotal = totalReinfFt * pReinf;
    const totalMaterialCost = blockCostTotal + mortarCostTotal + groutCostTotal + reinfCostTotal;
    const grandTotal = totalMaterialCost + pLabor + pDelivery;

    const hasCostInputs = pBlock > 0 || pMortar > 0 || pGrout > 0 || pReinf > 0 || pLabor > 0 || pDelivery > 0;

    const openingExceedsWall = totalOpeningArea >= grossWallArea && advancedMode && grossWallArea > 0;

    /* ===================== Actions ===================== */

    function addOpening() {
        setOpenings((prev) => [...prev, { id: uid(), name: "", width: "", height: "", qty: "1" }]);
        setSubmitted(false);
    }
    function removeOpening(id: string) {
        setOpenings((prev) => prev.filter((o) => o.id !== id));
        setSubmitted(false);
    }

    function resetAll() {
        setUnitSystem("imperial");
        setAdvancedMode(false);
        setWallLenFt("");
        setWallLenIn("");
        setWallHtFt("");
        setWallHtIn("");
        setBlockSize("8x8x16");
        setWastePct("5");
        setOpenings([{ id: uid(), name: "", width: "", height: "", qty: "1" }]);
        setMortarMode("simple");
        setMortarJoint("0.375");
        setGroutOption("none");
        setCustomGroutPct("50");
        setReinfOption("none");
        setHorizSpacing("2");
        setVertSpacing("24");
        setCustomHorizN("2");
        setCustomVertIn("24");
        setCostPerBlock("");
        setCostPerMortarBag("");
        setCostPerGroutYd("");
        setCostPerReinfFt("");
        setLaborCost("");
        setDeliveryCost("");
        setSubmitted(false);
    }

    function handleCalculate(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setSubmitted(true);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml() {
        const now = new Date().toLocaleString();

        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Concrete Block Calculator – Print View</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  *{box-sizing:border-box} body{margin:0;background:#fff;color:#0f172a;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
  .container{max-width:960px;margin:0 auto;padding:24px}
  .header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;margin-bottom:20px}
  .brand{display:flex;align-items:center;gap:10px}.brand img{height:36px}.brand-name{font-weight:800;font-size:18px;color:#0f766e}
  .meta{margin-left:auto;text-align:right;color:#475569;font-size:12px}
  h2{font-size:16px;margin:18px 0 8px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .card{border:1px solid #e5e7eb;border-radius:6px;padding:12px;background:#fff}
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
      <div class="meta">
        <div>Concrete Block Calculator</div>
        <div>Printed: ${now}</div>
      </div>
    </div>

    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Wall Length</div><div class="v">${wallLenFt || 0} ft ${wallLenIn || 0} in</div></div>
      <div class="kv"><div class="k">Wall Height</div><div class="v">${wallHtFt || 0} ft ${wallHtIn || 0} in</div></div>
      <div class="kv"><div class="k">Block Size</div><div class="v">${BLOCK_LABELS[blockSize].replace("  (default)", "")}</div></div>
      <div class="kv"><div class="k">Waste</div><div class="v">${waste}%</div></div>
      <div class="kv"><div class="k">Mode</div><div class="v">${advancedMode ? "Advanced" : "Quick"}</div></div>
      ${advancedMode ? `<div class="kv"><div class="k">Grout</div><div class="v">${groutOption} (${(groutFillPct * 100).toFixed(0)}%)</div></div>` : ""}
    </div>

    <h2>Results — Block Quantity</h2>
    <div class="grid">
      <div class="card"><div class="label">Gross Wall Area</div><div class="value-md">${nf(grossWallArea)} sq ft</div></div>
      <div class="card"><div class="label">Net Wall Area</div><div class="value-md">${nf(netWallArea)} sq ft</div></div>
      <div class="card"><div class="label">Final Block Qty</div><div class="value-md">${nf(finalBlocks, 0)}</div></div>
    </div>
    <div class="grid" style="margin-top:8px">
      <div class="kv"><div class="k">Base Blocks</div><div class="v">${nf(baseBlocksRounded, 0)}</div></div>
      <div class="kv"><div class="k">Waste Added</div><div class="v">${waste}%</div></div>
      <div class="kv"><div class="k">Mortar Bags</div><div class="v">${nf(mortarBagsSimple, 0)}</div></div>
    </div>

    ${advancedMode && groutFillPct > 0 ? `
    <h2>Grout</h2>
    <div class="grid">
      <div class="kv"><div class="k">Grout Vol (cu ft)</div><div class="v">${nf(groutVolWithWaste)}</div></div>
      <div class="kv"><div class="k">Grout Vol (cu yd)</div><div class="v">${nf(groutVolCuYd, 3)}</div></div>
    </div>` : ""}

    ${advancedMode && (showHoriz || showVert) ? `
    <h2>Reinforcement</h2>
    <div class="grid">
      ${showHoriz ? `<div class="kv"><div class="k">Horizontal (ft)</div><div class="v">${nf(horizReinfWithWaste)}</div></div>` : ""}
      ${showVert ? `<div class="kv"><div class="k">Vertical (ft)</div><div class="v">${nf(vertReinfWithWaste)}</div></div>` : ""}
      <div class="kv"><div class="k">Total Reinf. (ft)</div><div class="v">${nf(totalReinfFt)}</div></div>
    </div>` : ""}

    ${hasCostInputs ? `
    <h2>Cost Estimate</h2>
    <div class="grid">
      <div class="kv"><div class="k">Block Cost</div><div class="v">$${nf(blockCostTotal)}</div></div>
      <div class="kv"><div class="k">Mortar Cost</div><div class="v">$${nf(mortarCostTotal)}</div></div>
      <div class="kv"><div class="k">Grout Cost</div><div class="v">$${nf(groutCostTotal)}</div></div>
      <div class="kv"><div class="k">Reinf. Cost</div><div class="v">$${nf(reinfCostTotal)}</div></div>
      <div class="kv"><div class="k">Material Total</div><div class="v">$${nf(totalMaterialCost)}</div></div>
      <div class="kv"><div class="k">Grand Total</div><div class="v">$${nf(grandTotal)}</div></div>
    </div>` : ""}

    <div class="footer">
      <p>Estimates only. Actual quantities vary by manufacturer dimensions, bond pattern, waste, layout, and local code.</p>
      <p>Tip: In the browser's Print dialog, choose "Save as PDF".</p>
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
                    Concrete Block Estimator Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate blocks, mortar, grout, reinforcement, and cost for concrete block walls.
                    Results appear after you press{" "}
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
                                    setUnitSystem(v as "imperial" | "metric");
                                    setSubmitted(false);
                                }}
                                className="w-full max-w-xs"
                            >
                                <TabsList className="grid w-full grid-cols-2 rounded-sm bg-slate-950 p-1">
                                    <TabsTrigger value="imperial" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Imperial</TabsTrigger>
                                    <TabsTrigger value="metric" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Metric</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <p className="mt-1 text-xs text-white/60">Imperial uses ft/in. Metric uses m/cm (automatically converted).</p>
                        </div>
                    </div>

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

                    {/* STEP 1 — Wall Dimensions */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">
                            Step 1 — Wall Dimensions
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Wall Length" hint="Total wall length." subHint={unitSystem === "imperial" ? "Enter feet and inches" : "Enter meters and centimeters"}>
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={wallLenFt}
                                        onChange={(v) => { setWallLenFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 20"
                                        badge={unitSystem === "imperial" ? "ft" : "m"}
                                        ariaLabel="Wall length major unit"
                                    />
                                    <NumberInput
                                        value={wallLenIn}
                                        onChange={(v) => { setWallLenIn(v); setSubmitted(false); }}
                                        placeholder="0"
                                        badge={unitSystem === "imperial" ? "in" : "cm"}
                                        ariaLabel="Wall length minor unit"
                                    />
                                </div>
                            </Field>

                            <Field label="Wall Height" hint="Wall height." subHint={unitSystem === "imperial" ? "Enter feet and inches" : "Enter meters and centimeters"}>
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={wallHtFt}
                                        onChange={(v) => { setWallHtFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 8"
                                        badge={unitSystem === "imperial" ? "ft" : "m"}
                                        ariaLabel="Wall height major unit"
                                    />
                                    <NumberInput
                                        value={wallHtIn}
                                        onChange={(v) => { setWallHtIn(v); setSubmitted(false); }}
                                        placeholder="0"
                                        badge={unitSystem === "imperial" ? "in" : "cm"}
                                        ariaLabel="Wall height minor unit"
                                    />
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* STEP 2 — Block & Waste */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">
                            Step 2 — Block Size &amp; Waste
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Block Size" hint="Standard U.S. CMU nominal dimensions.">
                                <Select
                                    value={blockSize}
                                    onValueChange={(v) => { setBlockSize(v as BlockSize); setSubmitted(false); }}
                                >
                                    <SelectTrigger className={selectTriggerClass} aria-label="Block size">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.keys(BLOCK_LABELS) as BlockSize[]).map((k) => (
                                            <SelectItem key={k} value={k} className="text-white">
                                                {BLOCK_LABELS[k]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Waste Percentage"
                                hint="0% – 15%. Default 5%."
                                subHint="Accounts for cuts, breakage, and corners"
                            >
                                <NumberInput
                                    value={wastePct}
                                    onChange={(v) => { setWastePct(v); setSubmitted(false); }}
                                    placeholder="5"
                                    badge="%"
                                    ariaLabel="Waste percentage"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* STEP 3 — Openings (Advanced only) */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step3">
                            <h3 id="step3" className="text-sm font-semibold text-white/80">
                                Step 3 — Openings (optional)
                            </h3>
                            <div className="mt-2 rounded-sm border border-slate-700 bg-slate-900 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-white font-semibold">Doors, Windows &amp; Other Openings</h4>
                                    <Button
                                        type="button"
                                        onClick={addOpening}
                                        className="h-9 rounded-sm bg-teal-400 text-slate-900 hover:bg-teal-300 text-sm"
                                    >
                                        Add Opening
                                    </Button>
                                </div>

                                <div className="grid gap-3">
                                    {openings.map((o, idx) => (
                                        <div key={o.id}>
                                            <div className={cn("grid gap-2 items-end", "sm:grid-cols-[1fr,1fr,1fr,0.6fr,auto]")}>
                                                <Field label="Name (optional)">
                                                    <Input
                                                        type="text"
                                                        value={o.name}
                                                        onChange={(e) =>
                                                            setOpenings((prev) =>
                                                                prev.map((x) => (x.id === o.id ? { ...x, name: e.target.value } : x))
                                                            )
                                                        }
                                                        placeholder="e.g., Door"
                                                        className={fieldInputClass}
                                                    />
                                                </Field>
                                                <Field label="Width" hint="inches">
                                                    <NumberInput
                                                        value={o.width}
                                                        onChange={(v) =>
                                                            setOpenings((prev) =>
                                                                prev.map((x) => (x.id === o.id ? { ...x, width: v } : x))
                                                            )
                                                        }
                                                        placeholder="e.g., 36"
                                                        badge="in"
                                                        ariaLabel="Opening width"
                                                    />
                                                </Field>
                                                <Field label="Height" hint="inches">
                                                    <NumberInput
                                                        value={o.height}
                                                        onChange={(v) =>
                                                            setOpenings((prev) =>
                                                                prev.map((x) => (x.id === o.id ? { ...x, height: v } : x))
                                                            )
                                                        }
                                                        placeholder="e.g., 80"
                                                        badge="in"
                                                        ariaLabel="Opening height"
                                                    />
                                                </Field>
                                                <Field label="Qty">
                                                    <NumberInput
                                                        value={o.qty}
                                                        onChange={(v) =>
                                                            setOpenings((prev) =>
                                                                prev.map((x) => (x.id === o.id ? { ...x, qty: v } : x))
                                                            )
                                                        }
                                                        placeholder="1"
                                                        badge="×"
                                                        ariaLabel="Opening quantity"
                                                    />
                                                </Field>
                                                <div className="flex sm:justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => removeOpening(o.id)}
                                                        className="h-11 rounded-sm bg-slate-700 text-white hover:bg-slate-600"
                                                        title="Remove"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                            {idx < openings.length - 1 && (
                                                <div className="sm:col-span-5 border-b border-slate-700 my-2" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {openingExceedsWall && (
                                    <p className="mt-2 text-xs text-red-400 font-medium">
                                        ⚠ Total opening area exceeds gross wall area. Net wall area is 0.
                                    </p>
                                )}
                                <p className="mt-3 text-xs text-white/70">
                                    Opening dimensions in inches. Area = Width × Height × Qty.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* STEP 4 — Mortar Settings (Advanced only) */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step4">
                            <h3 id="step4" className="text-sm font-semibold text-white/80">
                                {advancedMode ? "Step 4" : "Step 3"} — Mortar Settings
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Mortar Estimation Method" hint="Simple = 1 bag per 13 blocks. Advanced = volume-based.">
                                    <Select
                                        value={mortarMode}
                                        onValueChange={(v) => { setMortarMode(v as MortarMode); setSubmitted(false); }}
                                    >
                                        <SelectTrigger className={selectTriggerClass} aria-label="Mortar mode">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            <SelectItem value="simple" className="text-white">Simple (bag estimate)</SelectItem>
                                            <SelectItem value="advanced" className="text-white">Advanced (volume estimate)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field label="Mortar Joint Thickness" hint="Standard is 3/8 inch." subHint="Informational – used for reference">
                                    <NumberInput
                                        value={mortarJoint}
                                        onChange={(v) => { setMortarJoint(v); setSubmitted(false); }}
                                        placeholder="0.375"
                                        badge="in"
                                        ariaLabel="Mortar joint thickness"
                                    />
                                </Field>
                            </div>
                        </section>
                    )}

                    {/* STEP 5 — Grout / Core Fill (Advanced only) */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step5">
                            <h3 id="step5" className="text-sm font-semibold text-white/80">
                                Step 5 — Grout / Core Fill
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Fill Option" hint="Choose how cores are grouted.">
                                    <Select
                                        value={groutOption}
                                        onValueChange={(v) => { setGroutOption(v as GroutOption); setSubmitted(false); }}
                                    >
                                        <SelectTrigger className={selectTriggerClass} aria-label="Grout option">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            <SelectItem value="none" className="text-white">No Grout (0%)</SelectItem>
                                            <SelectItem value="everyOther" className="text-white">Every Other Core (50%)</SelectItem>
                                            <SelectItem value="full" className="text-white">Fully Grouted (100%)</SelectItem>
                                            <SelectItem value="custom" className="text-white">Custom Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {groutOption === "custom" && (
                                    <Field label="Custom Grout Percentage" hint="0–100%">
                                        <NumberInput
                                            value={customGroutPct}
                                            onChange={(v) => { setCustomGroutPct(v); setSubmitted(false); }}
                                            placeholder="50"
                                            badge="%"
                                            ariaLabel="Custom grout percentage"
                                        />
                                    </Field>
                                )}
                            </div>
                        </section>
                    )}

                    {/* STEP 6 — Reinforcement (Advanced only) */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step6">
                            <h3 id="step6" className="text-sm font-semibold text-white/80">
                                Step 6 — Reinforcement
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Field label="Reinforcement Type" hint="None / Horizontal / Vertical / Both">
                                    <Select
                                        value={reinfOption}
                                        onValueChange={(v) => { setReinfOption(v as ReinfOption); setSubmitted(false); }}
                                    >
                                        <SelectTrigger className={selectTriggerClass} aria-label="Reinforcement">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            <SelectItem value="none" className="text-white">None</SelectItem>
                                            <SelectItem value="horizontal" className="text-white">Horizontal Only</SelectItem>
                                            <SelectItem value="vertical" className="text-white">Vertical Only</SelectItem>
                                            <SelectItem value="both" className="text-white">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {(reinfOption === "horizontal" || reinfOption === "both") && (
                                    <Field label="Horizontal Spacing" hint="Place rebar every N courses.">
                                        <Select
                                            value={horizSpacing}
                                            onValueChange={(v) => { setHorizSpacing(v as HorizSpacing); setSubmitted(false); }}
                                        >
                                            <SelectTrigger className={selectTriggerClass}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className={selectContentClass}>
                                                <SelectItem value="1" className="text-white">Every Course</SelectItem>
                                                <SelectItem value="2" className="text-white">Every 2nd Course</SelectItem>
                                                <SelectItem value="3" className="text-white">Every 3rd Course</SelectItem>
                                                <SelectItem value="custom" className="text-white">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {horizSpacing === "custom" && (
                                            <div className="mt-2">
                                                <NumberInput
                                                    value={customHorizN}
                                                    onChange={(v) => { setCustomHorizN(v); setSubmitted(false); }}
                                                    placeholder="e.g., 4"
                                                    badge="courses"
                                                    ariaLabel="Custom horizontal spacing"
                                                />
                                            </div>
                                        )}
                                    </Field>
                                )}

                                {(reinfOption === "vertical" || reinfOption === "both") && (
                                    <Field label="Vertical Bar Spacing" hint="Spacing between vertical bars.">
                                        <Select
                                            value={vertSpacing}
                                            onValueChange={(v) => { setVertSpacing(v as VertSpacing); setSubmitted(false); }}
                                        >
                                            <SelectTrigger className={selectTriggerClass}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className={selectContentClass}>
                                                <SelectItem value="16" className="text-white">Every 16 inches</SelectItem>
                                                <SelectItem value="24" className="text-white">Every 24 inches</SelectItem>
                                                <SelectItem value="32" className="text-white">Every 32 inches</SelectItem>
                                                <SelectItem value="custom" className="text-white">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {vertSpacing === "custom" && (
                                            <div className="mt-2">
                                                <NumberInput
                                                    value={customVertIn}
                                                    onChange={(v) => { setCustomVertIn(v); setSubmitted(false); }}
                                                    placeholder="e.g., 48"
                                                    badge="in"
                                                    ariaLabel="Custom vertical spacing"
                                                />
                                            </div>
                                        )}
                                    </Field>
                                )}
                            </div>
                            {(showHoriz || showVert) && (
                                <p className="mt-3 text-xs text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-teal-400" />
                                    Reinforcement output is an estimating aid only. Actual reinforcement must follow local code and project drawings.
                                </p>
                            )}
                        </section>
                    )}

                    {/* STEP 7 — Cost Estimation (Advanced only) */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step7">
                            <h3 id="step7" className="text-sm font-semibold text-white/80">
                                Step 7 — Cost Estimation (optional)
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field label="Cost per Block" hint="Price per single block (USD)">
                                    <NumberInput
                                        value={costPerBlock}
                                        onChange={(v) => { setCostPerBlock(v); setSubmitted(false); }}
                                        placeholder="e.g., 2.50"
                                        badge="$"
                                        ariaLabel="Cost per block"
                                    />
                                </Field>
                                <Field label="Cost per Mortar Bag" hint="Price per bag (USD)">
                                    <NumberInput
                                        value={costPerMortarBag}
                                        onChange={(v) => { setCostPerMortarBag(v); setSubmitted(false); }}
                                        placeholder="e.g., 8.00"
                                        badge="$"
                                        ariaLabel="Cost per mortar bag"
                                    />
                                </Field>
                                <Field label="Cost per Cu Yd Grout" hint="Price per cubic yard (USD)">
                                    <NumberInput
                                        value={costPerGroutYd}
                                        onChange={(v) => { setCostPerGroutYd(v); setSubmitted(false); }}
                                        placeholder="e.g., 125"
                                        badge="$/yd³"
                                        ariaLabel="Cost per cubic yard of grout"
                                    />
                                </Field>
                                <Field label="Cost per Lin Ft Rebar" hint="Price per linear foot (USD)">
                                    <NumberInput
                                        value={costPerReinfFt}
                                        onChange={(v) => { setCostPerReinfFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 0.75"
                                        badge="$/ft"
                                        ariaLabel="Cost per linear foot of reinforcement"
                                    />
                                </Field>
                                <Field label="Labor / Installation" hint="Optional lump sum (USD)">
                                    <NumberInput
                                        value={laborCost}
                                        onChange={(v) => { setLaborCost(v); setSubmitted(false); }}
                                        placeholder="e.g., 500"
                                        badge="$"
                                        ariaLabel="Labor cost"
                                    />
                                </Field>
                                <Field label="Delivery / Misc" hint="Optional lump sum (USD)">
                                    <NumberInput
                                        value={deliveryCost}
                                        onChange={(v) => { setDeliveryCost(v); setSubmitted(false); }}
                                        placeholder="e.g., 150"
                                        badge="$"
                                        ariaLabel="Delivery cost"
                                    />
                                </Field>
                            </div>
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
                        Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
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
                                <KV k="Wall Length" v={`${wallLenFt || 0} ft ${wallLenIn || 0} in`} />
                                <KV k="Wall Height" v={`${wallHtFt || 0} ft ${wallHtIn || 0} in`} />
                                <KV k="Block Size" v={BLOCK_LABELS[blockSize].replace("  (default)", "")} />
                                <KV k="Waste %" v={`${waste}%`} />
                                <KV k="Mode" v={advancedMode ? "Advanced" : "Quick"} />
                                {advancedMode && <KV k="Openings" v={`${openings.filter((o) => parseFloat(o.width) > 0).length}`} />}
                            </div>
                        </div>

                        {/* Primary Results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Block Quantity Results</div>

                            {/* Big number hero */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">Total Blocks Needed</span>
                                <span className="text-4xl font-extrabold text-teal-400">{nf(finalBlocks, 0)}</span>
                                <span className="text-xs text-slate-400 mt-1">
                                    (includes {waste}% waste)
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Gross Wall Area" v={`${nf(grossWallArea)} sq ft`} />
                                {advancedMode && <KV k="Total Opening Area" v={`${nf(totalOpeningArea)} sq ft`} />}
                                <KV k="Net Wall Area" v={`${nf(netWallArea)} sq ft`} />
                                <KV k="Base Block Qty" v={`${nf(baseBlocksRounded, 0)}`} />
                                <KV k="Waste %" v={`${waste}%`} />
                                <KV k="Final Block Qty" v={`${nf(finalBlocks, 0)}`} />
                            </div>
                        </div>

                        {/* Mortar */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Mortar Estimate</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Mortar Bags" v={`${nf(mortarBagsSimple, 0)} bags`} />
                                {advancedMode && mortarMode === "advanced" && (
                                    <>
                                        <KV k="Wet Mortar Vol" v={`${nf(mortarWetVol, 3)} cu ft`} />
                                        <KV k="Dry Mortar Vol" v={`${nf(mortarDryVol, 3)} cu ft`} />
                                    </>
                                )}
                            </div>
                            <p className="mt-2 text-xs text-white/60">
                                Simple estimate: 1 bag of mortar per 13 blocks.
                            </p>
                        </div>

                        {/* Grout (advanced) */}
                        {advancedMode && groutFillPct > 0 && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">
                                    Grout / Core Fill Estimate
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    <KV k="Fill %" v={`${(groutFillPct * 100).toFixed(0)}%`} />
                                    <KV k="Fillable Blocks" v={`${nf(fillableBlocks, 0)}`} />
                                    <KV k="Grout Volume" v={`${nf(groutVolWithWaste)} cu ft`} />
                                    <KV k="Grout Volume" v={`${nf(groutVolCuYd, 3)} cu yd`} />
                                </div>
                            </div>
                        )}

                        {/* Reinforcement (advanced) */}
                        {advancedMode && (showHoriz || showVert) && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">
                                    Reinforcement Estimate
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    <KV k="Courses" v={`${courses}`} />
                                    {showHoriz && (
                                        <>
                                            <KV k="Horiz Runs" v={`${horizRuns}`} />
                                            <KV k="Horiz Rebar" v={`${nf(horizReinfWithWaste)} lin ft`} />
                                        </>
                                    )}
                                    {showVert && (
                                        <>
                                            <KV k="Vert Lines" v={`${vertLines}`} />
                                            <KV k="Vert Rebar" v={`${nf(vertReinfWithWaste)} lin ft`} />
                                        </>
                                    )}
                                    <KV k="Total Reinforcement" v={`${nf(totalReinfFt)} lin ft`} />
                                </div>
                                <p className="mt-2 text-xs text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-teal-400" />
                                    Reinforcement output is an estimating aid only.
                                </p>
                            </div>
                        )}

                        {/* Cost (advanced) */}
                        {advancedMode && hasCostInputs && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">
                                    Cost Estimate
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    {pBlock > 0 && <KV k="Block Cost" v={`$${nf(blockCostTotal)}`} />}
                                    {pMortar > 0 && <KV k="Mortar Cost" v={`$${nf(mortarCostTotal)}`} />}
                                    {pGrout > 0 && <KV k="Grout Cost" v={`$${nf(groutCostTotal)}`} />}
                                    {pReinf > 0 && <KV k="Reinforcement Cost" v={`$${nf(reinfCostTotal)}`} />}
                                    <KV k="Total Material Cost" v={`$${nf(totalMaterialCost)}`} />
                                    {(pLabor > 0 || pDelivery > 0) && (
                                        <KV k="Grand Total" v={`$${nf(grandTotal)}`} />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This concrete block calculator provides project estimates only.
                                    Actual block count, mortar use, grout volume, reinforcement, and total cost may vary based on manufacturer dimensions,
                                    bond pattern, waste, layout complexity, local code, and site conditions.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
