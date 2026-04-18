// components/calculators/WireMeshCalc.tsx
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

type MeshKey =
    | "4x4-W1.4xW1.4"
    | "6x6-W1.4xW1.4"
    | "6x6-W2.0xW2.0"
    | "6x6-W2.9xW2.9"
    | "4x4-W2.0xW2.0"
    | "4x4-W2.9xW2.9"
    | "custom";

type FormFactor = "roll" | "sheet" | "sheet-large";
type ProjectType = "driveway" | "slab" | "sidewalk" | "floor";
type LengthUnit = "ft" | "in" | "m";
type Layers = "1" | "2";

type MeshData = {
    label: string;
    lonSpacing: number;   // inches
    transSpacing: number; // inches
    wNumber: number;
    wireDia: number;      // inches
    wtPerSqFt: number;    // lbs per sq ft
    commonUse: string;
    lightForVehicle: boolean; // triggers ASTM warning on vehicle-load presets
};

type FormData = {
    label: string;
    sqFt: number;
    desc: string;
};

const MESH_DATA: Record<Exclude<MeshKey, "custom">, MeshData> = {
    "4x4-W1.4xW1.4": {
        label: "4×4 – W1.4×W1.4",
        lonSpacing: 4, transSpacing: 4, wNumber: 1.4, wireDia: 0.135,
        wtPerSqFt: 0.30,
        commonUse: "Sidewalks, patios, light residential flatwork",
        lightForVehicle: true,
    },
    "6x6-W1.4xW1.4": {
        label: "6×6 – W1.4×W1.4",
        lonSpacing: 6, transSpacing: 6, wNumber: 1.4, wireDia: 0.135,
        wtPerSqFt: 0.21,
        commonUse: "Standard residential slabs, light patios",
        lightForVehicle: true,
    },
    "6x6-W2.0xW2.0": {
        label: "6×6 – W2.0×W2.0",
        lonSpacing: 6, transSpacing: 6, wNumber: 2.0, wireDia: 0.160,
        wtPerSqFt: 0.29,
        commonUse: "Residential driveways, garage floors",
        lightForVehicle: false,
    },
    "6x6-W2.9xW2.9": {
        label: "6×6 – W2.9×W2.9",
        lonSpacing: 6, transSpacing: 6, wNumber: 2.9, wireDia: 0.192,
        wtPerSqFt: 0.42,
        commonUse: "Heavy driveways, commercial parking lots",
        lightForVehicle: false,
    },
    "4x4-W2.0xW2.0": {
        label: "4×4 – W2.0×W2.0",
        lonSpacing: 4, transSpacing: 4, wNumber: 2.0, wireDia: 0.160,
        wtPerSqFt: 0.58,
        commonUse: "Structural slabs, elevated decks",
        lightForVehicle: false,
    },
    "4x4-W2.9xW2.9": {
        label: "4×4 – W2.9×W2.9",
        lonSpacing: 4, transSpacing: 4, wNumber: 2.9, wireDia: 0.192,
        wtPerSqFt: 0.84,
        commonUse: "Industrial floors, heavy-load applications",
        lightForVehicle: false,
    },
};

const FORM_DATA: Record<FormFactor, FormData> = {
    roll:         { label: "Roll",          sqFt: 750,  desc: "5 ft × 150 ft" },
    sheet:        { label: "Sheet",         sqFt: 50,   desc: "5 ft × 10 ft"  },
    "sheet-large":{ label: "Large sheet",   sqFt: 120,  desc: "6 ft × 20 ft"  },
};

/** Vehicle-load presets that trigger the ASTM A1064 / ACI 360R compliance warning */
const VEHICLE_PRESETS = new Set<ProjectType>(["driveway", "floor"]);

const LOGO_URL = "/logo.svg";

/* ===================== Helpers ===================== */

function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

function toFt(value: number, unit: LengthUnit | "in" | "ft"): number {
    if (unit === "in") return value / 12;
    if (unit === "m")  return value * 3.28084;
    return value;
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

/* =========================
   Main Component
========================= */

export default function WireMeshCalc() {

    /* ---------- Unit System ---------- */
    const [unitSystem, setUnitSystem] = React.useState<"imperial" | "metric">("imperial");

    /* ---------- Mode ---------- */
    const [advancedMode, setAdvancedMode] = React.useState(false);
    const [projectType, setProjectType]   = React.useState<ProjectType>("driveway");

    /* ---------- Dimensions ---------- */
    const [length, setLength]     = React.useState("20");
    const [lenUnit, setLenUnit]   = React.useState<LengthUnit>("ft");
    const [width, setWidth]       = React.useState("20");
    const [widUnit, setWidUnit]   = React.useState<LengthUnit>("ft");

    /* ---------- Mesh Spec ---------- */
    const [meshKey, setMeshKey]         = React.useState<MeshKey>("6x6-W2.0xW2.0");
    const [formFactor, setFormFactor]   = React.useState<FormFactor>("sheet");
    const [layers, setLayers]           = React.useState<Layers>("1");

    /* ---------- Lap / Waste ---------- */
    const [overlap, setOverlap]         = React.useState("6");
    const [overlapUnit, setOverlapUnit] = React.useState<"in" | "ft">("in");
    const [waste, setWaste]             = React.useState("10");

    /* ---------- Custom Mesh ---------- */
    const [customLon, setCustomLon]     = React.useState("6");
    const [customTrans, setCustomTrans] = React.useState("6");
    const [customW, setCustomW]         = React.useState("1.4");

    /* ---------- Advanced / Cost ---------- */
    const [priceSqFt, setPriceSqFt]   = React.useState("");
    const [priceUnit, setPriceUnit]   = React.useState("");
    const [deliveryCost, setDelivery] = React.useState("");

    /* ---------- UI ---------- */
    const [submitted, setSubmitted] = React.useState(false);

    /* ===================== Derived values ===================== */

    const lenFt      = toFt(parseFloat(length)  || 0, lenUnit);
    const widFt      = toFt(parseFloat(width)   || 0, widUnit);
    const overlapFt  = toFt(parseFloat(overlap) || 0, overlapUnit);
    const wastePct   = Math.max(0, Math.min(50, parseFloat(waste) || 0));
    const layerCount = parseInt(layers);

    // Resolve mesh weight and properties
    const isCustom = meshKey === "custom";
    const activeMesh = isCustom ? null : MESH_DATA[meshKey as Exclude<MeshKey, "custom">];
    const wtPerSqFt  = isCustom
        ? Math.max(0, parseFloat(customW) || 1.4) * 0.003 * 2
        : (activeMesh?.wtPerSqFt ?? 0);

    // Area & footage
    const slabArea    = lenFt * widFt;
    // Overlap adds ~one mesh spacing worth of area per sheet join.
    // Approximated as overlapFt / (mesh spacing in ft) × total area factor.
    const overlapFraction = lenFt > 0 && widFt > 0
        ? (overlapFt / Math.max(lenFt, widFt)) * 0.5
        : 0;
    const netAreaWithLap = slabArea * (1 + overlapFraction);
    const grossArea      = netAreaWithLap * (1 + wastePct / 100) * layerCount;

    const form       = FORM_DATA[formFactor];
    const unitsNeeded = form.sqFt > 0 ? Math.ceil(grossArea / form.sqFt) : 0;
    const totalWeight = grossArea * wtPerSqFt;
    const totalWtTons = totalWeight / 2000;

    // Cost
    const pSqFt  = parseFloat(priceSqFt)   || 0;
    const pUnit  = parseFloat(priceUnit)    || 0;
    const pDel   = parseFloat(deliveryCost) || 0;
    let materialCost = 0;
    if (pSqFt > 0)       materialCost = grossArea * pSqFt;
    else if (pUnit > 0)  materialCost = unitsNeeded * pUnit;
    const grandTotal = materialCost + pDel;
    const hasCost    = pSqFt > 0 || pUnit > 0 || pDel > 0;

    // ASTM A1064 / ACI 360R-10 compliance warning
    // Trigger: light mesh (W1.4 or lighter) selected for a vehicle-load project
    const astmWarning = !isCustom &&
        activeMesh?.lightForVehicle === true &&
        VEHICLE_PRESETS.has(projectType);

    /* ===================== Presets ===================== */

    function applyPreset(pt: ProjectType) {
        setProjectType(pt);
        setSubmitted(false);
        if (pt === "driveway") {
            setLength("20"); setLenUnit("ft");
            setWidth("20");  setWidUnit("ft");
            setMeshKey("6x6-W2.0xW2.0");
            setFormFactor("sheet");
            setLayers("1");
            setOverlap("6"); setOverlapUnit("in");
            setWaste("10");
        } else if (pt === "slab") {
            setLength("20"); setLenUnit("ft");
            setWidth("20");  setWidUnit("ft");
            setMeshKey("6x6-W1.4xW1.4");
            setFormFactor("sheet");
            setLayers("1");
            setOverlap("6"); setOverlapUnit("in");
            setWaste("10");
        } else if (pt === "sidewalk") {
            setLength("50"); setLenUnit("ft");
            setWidth("4");   setWidUnit("ft");
            setMeshKey("4x4-W1.4xW1.4");
            setFormFactor("roll");
            setLayers("1");
            setOverlap("6"); setOverlapUnit("in");
            setWaste("10");
        } else if (pt === "floor") {
            setLength("40"); setLenUnit("ft");
            setWidth("30");  setWidUnit("ft");
            setMeshKey("4x4-W2.9xW2.9");
            setFormFactor("roll");
            setLayers("1");
            setOverlap("6"); setOverlapUnit("in");
            setWaste("15");
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
        setProjectType("driveway");
        setLength("20"); setLenUnit("ft");
        setWidth("20");  setWidUnit("ft");
        setMeshKey("6x6-W2.0xW2.0");
        setFormFactor("sheet");
        setLayers("1");
        setOverlap("6"); setOverlapUnit("in");
        setWaste("10");
        setCustomLon("6"); setCustomTrans("6"); setCustomW("1.4");
        setPriceSqFt(""); setPriceUnit(""); setDelivery("");
        setSubmitted(false);
    }

    /* ===================== Print ===================== */

    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        const meshLabel = isCustom
            ? `Custom ${customLon}"×${customTrans}" – W${customW}`
            : MESH_DATA[meshKey as Exclude<MeshKey, "custom">]?.label ?? meshKey;

        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Wire Mesh / WWF Calculator – Print View</title>
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
    <div class="meta"><div>Wire Mesh / WWF Calculator</div><div>Printed: ${now}</div></div>
  </div>

  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Project Type</div><div class="v">${projectType.charAt(0).toUpperCase() + projectType.slice(1)}</div></div>
    <div class="kv"><div class="k">Length</div><div class="v">${length} ${lenUnit}</div></div>
    <div class="kv"><div class="k">Width</div><div class="v">${width} ${widUnit}</div></div>
    <div class="kv"><div class="k">Mesh Designation</div><div class="v">${meshLabel}</div></div>
    <div class="kv"><div class="k">Form Factor</div><div class="v">${form.label} (${form.desc})</div></div>
    <div class="kv"><div class="k">Layers</div><div class="v">${layers === "2" ? "Double layer" : "Single layer"}</div></div>
    <div class="kv"><div class="k">Lap / Overlap</div><div class="v">${overlap} ${overlapUnit}</div></div>
    <div class="kv"><div class="k">Waste Factor</div><div class="v">${waste}%</div></div>
    <div class="kv"><div class="k">Mode</div><div class="v">${advancedMode ? "Advanced" : "Quick"}</div></div>
  </div>

  <h2>Results — Mesh Quantity</h2>
  <div class="grid">
    <div class="kv"><div class="k">Slab Area</div><div class="v">${nf(slabArea, 1)} sq ft</div></div>
    <div class="kv"><div class="k">Gross Area (w/ lap + waste)</div><div class="v">${nf(grossArea, 1)} sq ft</div></div>
    <div class="kv"><div class="k">${form.label}s Needed</div><div class="v">${nf(unitsNeeded, 0)}</div></div>
    <div class="kv"><div class="k">Total Weight</div><div class="v">${nf(totalWeight, 0)} lbs</div></div>
    <div class="kv"><div class="k">Weight in Tons</div><div class="v">${nf(totalWtTons, 3)} US tons</div></div>
    <div class="kv"><div class="k">Weight per sq ft</div><div class="v">${nf(wtPerSqFt, 2)} lb/sf</div></div>
  </div>

  ${hasCost ? `
  <h2>Cost Estimate</h2>
  <div class="grid">
    ${materialCost > 0  ? `<div class="kv"><div class="k">Material Cost</div><div class="v">$${nf(materialCost)}</div></div>` : ""}
    ${pDel > 0          ? `<div class="kv"><div class="k">Delivery</div><div class="v">$${nf(pDel)}</div></div>` : ""}
    <div class="kv"><div class="k">Grand Total</div><div class="v">$${nf(grandTotal)}</div></div>
  </div>` : ""}

  <div class="footer">
    <p>Estimates only. Actual mesh quantities may vary based on supplier roll/sheet sizes, site layout, and cut patterns.</p>
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

    const meshLabel = isCustom
        ? `Custom ${customLon}"×${customTrans}" – W${customW}`
        : MESH_DATA[meshKey as Exclude<MeshKey, "custom">]?.label ?? meshKey;

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
                    Wire Mesh / WWF Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate welded wire fabric quantity, weight, rolls or sheets needed, and cost for
                    concrete slabs, driveways, sidewalks, and industrial floors. Results appear after
                    you press{" "}
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
                            setLenUnit(sys === "imperial" ? "ft" : "m");
                            setWidUnit(sys === "imperial" ? "ft" : "m");
                            setSubmitted(false);
                          }}
                          className="w-full max-w-xs"
                        >
                          <TabsList className="grid w-full grid-cols-2 rounded-sm bg-slate-950 p-1">
                            <TabsTrigger value="imperial" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Imperial</TabsTrigger>
                            <TabsTrigger value="metric" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Metric</TabsTrigger>
                          </TabsList>
                        </Tabs>
                        <p className="mt-1 text-xs text-white/60">Switches default units. Individual fields can still be adjusted.</p>
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

                    {/* PROJECT TYPE */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">
                            Project Type
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {([
                                { key: "driveway",  label: "Driveway"         },
                                { key: "slab",      label: "Patio / Slab"     },
                                { key: "sidewalk",  label: "Sidewalk"         },
                                { key: "floor",     label: "Industrial Floor" },
                            ] as { key: ProjectType; label: string }[]).map(({ key, label }) => (
                                <Button
                                    key={key}
                                    type="button"
                                    onClick={() => applyPreset(key)}
                                    className={cn("h-9 rounded-sm text-sm",
                                        projectType === key
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}
                                >
                                    {label}
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
                            Step 1 — Slab Dimensions
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field label="Length" hint="Total slab length." subHint="First span dimension">
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={length}
                                        onChange={(v) => { setLength(v); setSubmitted(false); }}
                                        placeholder="e.g., 20"
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

                            <Field label="Width" hint="Total slab width." subHint="Second span dimension">
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={width}
                                        onChange={(v) => { setWidth(v); setSubmitted(false); }}
                                        placeholder="e.g., 20"
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

                    {/* STEP 2 — Mesh Specification */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">
                            Step 2 — Mesh Specification
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field
                                label="Mesh Designation"
                                hint="ASTM A1064 standard welded wire designation."
                            >
                                <Select
                                    value={meshKey}
                                    onValueChange={(v) => { setMeshKey(v as MeshKey); setSubmitted(false); }}
                                >
                                    <SelectTrigger className={selectTriggerClass} aria-label="Mesh designation">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.keys(MESH_DATA) as Exclude<MeshKey, "custom">[]).map((k) => (
                                            <SelectItem key={k} value={k} className="text-white">
                                                {MESH_DATA[k].label}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="custom" className="text-white">
                                            Custom dimensions
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Form Factor"
                                hint="How the mesh is sold at your supplier."
                            >
                                <Select
                                    value={formFactor}
                                    onValueChange={(v) => { setFormFactor(v as FormFactor); setSubmitted(false); }}
                                >
                                    <SelectTrigger className={selectTriggerClass} aria-label="Form factor">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {(Object.keys(FORM_DATA) as FormFactor[]).map((k) => (
                                            <SelectItem key={k} value={k} className="text-white">
                                                {FORM_DATA[k].label} — {FORM_DATA[k].desc} ({FORM_DATA[k].sqFt} sq ft)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        {/* Custom mesh fields */}
                        {meshKey === "custom" && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field
                                    label="Longitudinal spacing"
                                    hint="Wire spacing in the long direction."
                                >
                                    <NumberInput
                                        value={customLon}
                                        onChange={(v) => { setCustomLon(v); setSubmitted(false); }}
                                        placeholder="6"
                                        badge="in"
                                        ariaLabel="Longitudinal spacing"
                                    />
                                </Field>
                                <Field
                                    label="Transverse spacing"
                                    hint="Wire spacing in the short direction."
                                >
                                    <NumberInput
                                        value={customTrans}
                                        onChange={(v) => { setCustomTrans(v); setSubmitted(false); }}
                                        placeholder="6"
                                        badge="in"
                                        ariaLabel="Transverse spacing"
                                    />
                                </Field>
                                <Field
                                    label="W-number (wire size)"
                                    hint="e.g. W1.4, W2.0, W2.9"
                                    subHint="Cross-sectional area = W-number × 0.001 in²"
                                >
                                    <NumberInput
                                        value={customW}
                                        onChange={(v) => { setCustomW(v); setSubmitted(false); }}
                                        placeholder="1.4"
                                        ariaLabel="W-number"
                                    />
                                </Field>
                            </div>
                        )}

                        {/* Mesh info panel */}
                        {!isCustom && activeMesh && (
                            <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-300 space-y-1">
                                <p className="text-teal-400 font-semibold mb-1">
                                    Selected mesh — {activeMesh.label}
                                </p>
                                <p>Wire spacing: <span className="text-white">{activeMesh.lonSpacing}&quot;×{activeMesh.transSpacing}&quot;</span></p>
                                <p>Wire diameter: <span className="text-white">{activeMesh.wireDia}&quot;</span></p>
                                <p>Weight: <span className="text-white">{activeMesh.wtPerSqFt} lb/sq ft</span></p>
                                <p className="text-white/60 italic">{activeMesh.commonUse}</p>
                            </div>
                        )}

                        {/* ASTM / ACI Compliance Warning */}
                        {astmWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">
                                    <strong>ACI 360R-10 Warning:</strong> W1.4 wire is generally insufficient for
                                    driveways and industrial floors subject to vehicle loads. ACI 360R-10 recommends a
                                    minimum of W2.0 wire (6×6 W2.0×W2.0 or heavier) for these applications.
                                    Consider upgrading your mesh designation or supplementing with rebar.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* STEP 3 — Overlap & Waste */}
                    <section className={stepClass} aria-labelledby="step3">
                        <h3 id="step3" className="text-sm font-semibold text-white/80">
                            Step 3 — Lap Splice &amp; Waste
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field
                                label="Lap / Overlap per Sheet Join"
                                hint="Amount mesh sheets overlap at each seam."
                                subHint="ACI 318 §25.8.1 requires ≥ 1 mesh spacing (typically 6 in)"
                            >
                                <div className="flex gap-2">
                                    <NumberInput
                                        value={overlap}
                                        onChange={(v) => { setOverlap(v); setSubmitted(false); }}
                                        placeholder="6"
                                        ariaLabel="Overlap"
                                    />
                                    <UnitSelect
                                        value={overlapUnit}
                                        onChange={(v) => { setOverlapUnit(v as "in" | "ft"); setSubmitted(false); }}
                                        options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]}
                                        ariaLabel="Overlap unit"
                                    />
                                </div>
                            </Field>

                            <Field
                                label="Waste Factor"
                                hint="Accounts for cut edges, irregular shapes, and on-site waste."
                                subHint="10% typical; 15% for L-shapes or complex layouts"
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

                    {/* STEP 4 — Layers & Advanced (Advanced mode) */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step4">
                            <h3 id="step4" className="text-sm font-semibold text-white/80">
                                Step 4 — Layers &amp; Cost Inputs
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field
                                    label="Mesh Layers"
                                    hint="Double-layer for 6″+ slabs or heavy-load applications."
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
                                            <SelectItem value="2" className="text-white">Double layer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field
                                    label="Price per Sq Ft"
                                    hint="Material cost per square foot of mesh."
                                >
                                    <NumberInput
                                        value={priceSqFt}
                                        onChange={(v) => { setPriceSqFt(v); setSubmitted(false); }}
                                        placeholder="e.g., 0.45"
                                        badge="$/sf"
                                        ariaLabel="Price per sq ft"
                                    />
                                </Field>

                                <Field
                                    label={`Price per ${form.label}`}
                                    hint="Unit price if sq ft price is not known."
                                >
                                    <NumberInput
                                        value={priceUnit}
                                        onChange={(v) => { setPriceUnit(v); setSubmitted(false); }}
                                        placeholder="e.g., 22.50"
                                        badge={`$/${form.label.toLowerCase().charAt(0)}`}
                                        ariaLabel="Price per unit"
                                    />
                                </Field>

                                <Field
                                    label="Delivery / Misc Cost"
                                    hint="Optional lump-sum delivery or handling fees."
                                >
                                    <NumberInput
                                        value={deliveryCost}
                                        onChange={(v) => { setDelivery(v); setSubmitted(false); }}
                                        placeholder="e.g., 75"
                                        badge="$"
                                        ariaLabel="Delivery cost"
                                    />
                                </Field>
                            </div>
                            <p className="mt-3 text-xs text-white/60 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                Cost fields are optional. If both sq ft and unit prices are entered, sq ft price takes precedence.
                            </p>
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
                                <KV k="Project Type"     v={projectType.charAt(0).toUpperCase() + projectType.slice(1)} />
                                <KV k="Length"           v={`${length} ${lenUnit}`} />
                                <KV k="Width"            v={`${width} ${widUnit}`} />
                                <KV k="Mesh"             v={meshLabel} />
                                <KV k="Form factor"      v={`${form.label} (${form.desc})`} />
                                <KV k="Layers"           v={layers === "2" ? "Double layer" : "Single layer"} />
                                <KV k="Lap / overlap"    v={`${overlap} ${overlapUnit}`} />
                                <KV k="Waste"            v={`${waste}%`} />
                                <KV k="Mode"             v={advancedMode ? "Advanced" : "Quick"} />
                            </div>
                        </div>

                        {/* Primary Results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Mesh Quantity Results</div>

                            {/* Hero number */}
                            <div className="flex flex-col items-center justify-center py-4 mb-4 rounded-sm bg-slate-800 border border-slate-700">
                                <span className="text-xs uppercase tracking-wider text-slate-400">
                                    {form.label}s Needed
                                </span>
                                <span className="text-4xl font-extrabold text-teal-400">
                                    {nf(unitsNeeded, 0)}
                                </span>
                                <span className="text-xs text-slate-400 mt-1">
                                    {form.label.toLowerCase()}s of {form.desc} mesh (includes {waste}% waste)
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Slab area"              v={`${nf(slabArea, 1)} sq ft`} />
                                <KV k="Gross area (w/ lap + waste)" v={`${nf(grossArea, 1)} sq ft`} />
                                <KV k={`${form.label}s needed`}    v={`${nf(unitsNeeded, 0)}`} />
                                <KV k="Total weight"           v={`${nf(totalWeight, 0)} lbs`} />
                                <KV k="Weight in tons"         v={`${nf(totalWtTons, 3)} US tons`} />
                                <KV k="Weight per sq ft"       v={`${nf(wtPerSqFt, 2)} lb/sf`} />
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">Calculation Breakdown</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="rounded-sm border border-slate-700 bg-slate-800/50 p-3 space-y-2">
                                    <p className="text-teal-400 font-semibold text-xs uppercase tracking-wide mb-2">
                                        Area calculation
                                    </p>
                                    <KV k="Net slab area"          v={`${nf(slabArea, 1)} sq ft`} />
                                    <KV k="Lap allowance added"    v={`${nf(netAreaWithLap - slabArea, 1)} sq ft`} />
                                    <KV k="After lap"              v={`${nf(netAreaWithLap, 1)} sq ft`} />
                                    <KV k={`After ${waste}% waste`} v={`${nf(grossArea / layerCount, 1)} sq ft`} />
                                    {layerCount === 2 && (
                                        <KV k="×2 (double layer)"  v={`${nf(grossArea, 1)} sq ft total`} />
                                    )}
                                </div>
                                <div className="rounded-sm border border-slate-700 bg-slate-800/50 p-3 space-y-2">
                                    <p className="text-teal-400 font-semibold text-xs uppercase tracking-wide mb-2">
                                        Unit calculation
                                    </p>
                                    <KV k="Gross area to cover"    v={`${nf(grossArea, 1)} sq ft`} />
                                    <KV k={`${form.label} size`}   v={`${form.sqFt} sq ft each`} />
                                    <KV k={`${form.label}s needed`} v={`⌈${nf(grossArea / form.sqFt, 2)}⌉ = ${nf(unitsNeeded, 0)}`} />
                                </div>
                            </div>
                        </div>

                        {/* ASTM A1064 Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-3 text-sm font-semibold text-white">
                                ASTM A1064 Mesh Designation Reference
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">Designation</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">Spacing</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">Wire dia.</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium">lb / sq ft</th>
                                            <th className="text-left py-2 px-2 text-slate-400 font-medium hidden sm:table-cell">Common use</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Object.keys(MESH_DATA) as Exclude<MeshKey, "custom">[]).map((k) => {
                                            const m = MESH_DATA[k];
                                            return (
                                                <tr
                                                    key={k}
                                                    className={cn(
                                                        "border-b border-slate-800",
                                                        k === meshKey
                                                            ? "bg-teal-900/30 text-teal-300"
                                                            : "text-slate-300"
                                                    )}
                                                >
                                                    <td className="py-2 px-2 font-semibold">{m.label}</td>
                                                    <td className="py-2 px-2">{m.lonSpacing}&quot;×{m.transSpacing}&quot;</td>
                                                    <td className="py-2 px-2">{m.wireDia}&quot;</td>
                                                    <td className="py-2 px-2">{m.wtPerSqFt}</td>
                                                    <td className="py-2 px-2 hidden sm:table-cell text-white/60">{m.commonUse}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                Selected designation highlighted. Weights per ASTM A1064. W-number × 0.001 = wire area in in².
                            </p>
                        </div>

                        {/* Cost (Advanced only) */}
                        {advancedMode && hasCost && (
                            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                    {materialCost > 0 && <KV k="Material Cost"  v={`$${nf(materialCost)}`} />}
                                    {pDel > 0         && <KV k="Delivery"       v={`$${nf(pDel)}`} />}
                                    <KV k="Grand Total" v={`$${nf(grandTotal)}`} />
                                </div>
                                <p className="mt-2 text-xs text-white/60 flex items-start gap-1.5">
                                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                    Cost based on gross area (with lap and waste applied). Sq ft price takes
                                    precedence over unit price when both are entered.
                                </p>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This wire mesh
                                    calculator provides project estimates only. Actual quantities may vary based
                                    on supplier roll or sheet sizes, site layout complexity, cut patterns, and
                                    lap-splice requirements. Always verify reinforcement specifications with a
                                    licensed structural engineer for load-bearing or structural applications.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
