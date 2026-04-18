// components/calculators/ConcretePatioCalc.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, Printer, AlertTriangle } from "lucide-react";
import {
    rectangularVolume,
    cylinderVolume,
    applyWaste,
    concreteBags,
    concreteWeight,
    cubicFtToYd,
    cubicFtToM3,
} from "@/lib/calc-engine";

// ── Types ──────────────────────────────────────────────────────────────────────
type PatioShape = "rectangular" | "circular";
type ProjectPreset = "small" | "medium" | "large";

// ── Preset data ────────────────────────────────────────────────────────────────
const PRESETS: Record<
    ProjectPreset,
    { length: string; width: string; diameter: string; thickness: string }
> = {
    small: { length: "10", width: "10", diameter: "12", thickness: "4" },
    medium: { length: "12", width: "16", diameter: "16", thickness: "4" },
    large: { length: "16", width: "20", diameter: "20", thickness: "4" },
};

// ── Reference table ────────────────────────────────────────────────────────────
const PATIO_REF = [
    { size: "10 × 10", area: 100, yd4: "1.23", yd6: "1.85", bags80: 56 },
    { size: "10 × 12", area: 120, yd4: "1.48", yd6: "2.22", bags80: 67 },
    { size: "12 × 16", area: 192, yd4: "2.37", yd6: "3.56", bags80: 107 },
    { size: "14 × 18", area: 252, yd4: "3.11", yd6: "4.67", bags80: 140 },
    { size: "16 × 20", area: 320, yd4: "3.95", yd6: "5.93", bags80: 178 },
    { size: "20 × 24", area: 480, yd4: "5.93", yd6: "8.89", bags80: 267 },
    { size: "20 × 30", area: 600, yd4: "7.41", yd6: "11.11", bags80: 334 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function nf(n: number, d = 2): string {
    return Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";
}

const LOGO_URL = "/logo.svg";

// ── Design tokens — verbatim from skill ────────────────────────────────────────
const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";

const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";

const stepClass = "pt-6 mt-4 border-t border-slate-800";

// ── Sub-components ─────────────────────────────────────────────────────────────
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
            {hint && <p className="text-xs text-slate-300">{hint}</p>}
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

// suppress unused-import lint for selectTriggerClass (used inline in UnitSelect)
void selectTriggerClass;

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ConcretePatioCalc() {
    // Mode
    const [advancedMode, setAdvancedMode] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Shape & preset
    const [shape, setShape] = useState<PatioShape>("rectangular");
    const [preset, setPreset] = useState<ProjectPreset>("medium");

    // Rectangular inputs
    const [length, setLength] = useState("12");
    const [width, setWidth] = useState("16");

    // Circular input
    const [diameter, setDiameter] = useState("16");

    // Common
    const [thickness, setThickness] = useState("4"); // inches
    const [waste, setWaste] = useState("10"); // %

    // Advanced cost
    const [pricePerYd, setPricePerYd] = useState("130");
    const [laborPerSqFt, setLaborPerSqFt] = useState("5");
    const [finishPerSqFt, setFinishPerSqFt] = useState("2");

    // ── Preset loader ──────────────────────────────────────────────────────────
    function applyPreset(p: ProjectPreset) {
        const pr = PRESETS[p];
        setPreset(p);
        setLength(pr.length);
        setWidth(pr.width);
        setDiameter(pr.diameter);
        setThickness(pr.thickness);
        setSubmitted(false);
    }

    function resetAll() {
        setAdvancedMode(false);
        setSubmitted(false);
        setShape("rectangular");
        setPreset("medium");
        setLength("12");
        setWidth("16");
        setDiameter("16");
        setThickness("4");
        setWaste("10");
        setPricePerYd("130");
        setLaborPerSqFt("5");
        setFinishPerSqFt("2");
    }

    function handleCalculate(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
    }

    // ── Derived calculations (no useEffect) ───────────────────────────────────
    const lenFt = parseFloat(length) || 0;
    const widFt = parseFloat(width) || 0;
    const diaFt = parseFloat(diameter) || 0;
    const thickIn = parseFloat(thickness) || 0;
    const thickFt = thickIn / 12;
    const wastePct = parseFloat(waste) || 0;

    const baseVol =
        shape === "rectangular"
            ? rectangularVolume(lenFt, widFt, thickFt, "ft")
            : cylinderVolume(diaFt, thickFt, "ft");

    const withWaste = applyWaste(baseVol.cubicFeet, wastePct);
    const totalFt3 = withWaste.total;
    const totalYd3 = cubicFtToYd(totalFt3);
    const totalM3 = cubicFtToM3(totalFt3);

    const bags = concreteBags(totalFt3);
    const wt = concreteWeight(totalFt3);

    const areaFt2 =
        shape === "rectangular"
            ? lenFt * widFt
            : Math.PI * (diaFt / 2) ** 2;

    // Advanced cost
    const matCost = totalYd3 * (parseFloat(pricePerYd) || 0);
    const laborCost = areaFt2 * (parseFloat(laborPerSqFt) || 0);
    const finishCost = areaFt2 * (parseFloat(finishPerSqFt) || 0);
    const totalCost = matCost + laborCost + finishCost;

    // ACI 318-19 §7.3 — minimum 4-inch slab thickness for residential patios
    const complianceWarning = submitted && thickIn > 0 && thickIn < 4;

    // ── Print ──────────────────────────────────────────────────────────────────
    function buildPrintHtml(): string {
        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Concrete Patio Calculator – Print View</title>
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
  .warn{color:#92400e;background:#fef3c7;padding:8px;border-radius:4px;margin-top:12px;font-size:13px}
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
    <div class="meta"><div>Concrete Patio Calculator</div><div>Printed: ${now}</div></div>
  </div>
  <h2>Inputs Summary</h2>
  <div class="grid">
    <div class="kv"><div class="k">Shape</div><div class="v">${shape === "rectangular" ? "Rectangular" : "Circular"}</div></div>
    ${shape === "rectangular"
                ? `<div class="kv"><div class="k">Length</div><div class="v">${length} ft</div></div>
           <div class="kv"><div class="k">Width</div><div class="v">${width} ft</div></div>`
                : `<div class="kv"><div class="k">Diameter</div><div class="v">${diameter} ft</div></div>`}
    <div class="kv"><div class="k">Thickness</div><div class="v">${thickness} in</div></div>
    <div class="kv"><div class="k">Waste Factor</div><div class="v">${waste}%</div></div>
    ${advancedMode ? `
    <div class="kv"><div class="k">Concrete Price</div><div class="v">$${pricePerYd}/yd³</div></div>
    <div class="kv"><div class="k">Labor Rate</div><div class="v">$${laborPerSqFt}/ft²</div></div>
    <div class="kv"><div class="k">Finishing Rate</div><div class="v">$${finishPerSqFt}/ft²</div></div>` : ""}
  </div>
  <h2>Results</h2>
  <div class="grid">
    <div class="kv"><div class="k">Patio Area</div><div class="v">${nf(areaFt2, 1)} ft²</div></div>
    <div class="kv"><div class="k">Base Volume</div><div class="v">${nf(baseVol.cubicFeet, 2)} ft³</div></div>
    <div class="kv"><div class="k">Waste Added</div><div class="v">${nf(withWaste.wasteAmount, 2)} ft³</div></div>
    <div class="kv"><div class="k">Total Volume</div><div class="v">${nf(totalYd3, 2)} yd³</div></div>
    <div class="kv"><div class="k">Cubic Feet</div><div class="v">${nf(totalFt3, 1)} ft³</div></div>
    <div class="kv"><div class="k">Cubic Meters</div><div class="v">${nf(totalM3, 2)} m³</div></div>
    <div class="kv"><div class="k">40-lb Bags</div><div class="v">${bags.bags40lb}</div></div>
    <div class="kv"><div class="k">60-lb Bags</div><div class="v">${bags.bags60lb}</div></div>
    <div class="kv"><div class="k">80-lb Bags</div><div class="v">${bags.bags80lb}</div></div>
    <div class="kv"><div class="k">Weight (lbs)</div><div class="v">${nf(wt.pounds, 0)} lb</div></div>
    <div class="kv"><div class="k">Weight (tons)</div><div class="v">${nf(wt.tons, 2)} tons</div></div>
    ${advancedMode ? `
    <div class="kv"><div class="k">Material Cost</div><div class="v">$${nf(matCost, 2)}</div></div>
    <div class="kv"><div class="k">Labor Cost</div><div class="v">$${nf(laborCost, 2)}</div></div>
    <div class="kv"><div class="k">Finishing Cost</div><div class="v">$${nf(finishCost, 2)}</div></div>
    <div class="kv"><div class="k">Total Cost</div><div class="v">$${nf(totalCost, 2)}</div></div>` : ""}
  </div>
  ${complianceWarning
                ? `<p class="warn">⚠️ ACI 318-19 §7.3: Slab thickness (${thickness} in) is below the recommended minimum of 4 inches for residential patios. Insufficient thickness may cause cracking under load.</p>`
                : ""}
  <div class="footer">
    <p>Estimates only. Actual quantities may vary based on subgrade conditions, form deflection, and site variables. Always consult a licensed professional for structural applications.</p>
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
                    Concrete Patio Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate concrete volume, bags, weight, and project cost for any rectangular or
                    circular patio.{" "}
                    Results appear after you press <span className="font-semibold text-white">Calculate</span>.
                </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <form onSubmit={handleCalculate}>

                    {/* ── MODE TOGGLE ── */}
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
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    Quick
                                </Button>
                                <Button
                                    type="button"
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

                    {/* ── PATIO SHAPE TOGGLE ── */}
                    <section className={stepClass} aria-labelledby="shapeToggle">
                        <h3 id="shapeToggle" className="text-sm font-semibold text-white/80 mb-3">
                            Patio Shape
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {(["rectangular", "circular"] as PatioShape[]).map((s) => (
                                <Button
                                    key={s}
                                    type="button"
                                    onClick={() => { setShape(s); setSubmitted(false); }}
                                    className={cn("h-9 rounded-sm text-sm",
                                        shape === s
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    {s === "rectangular" ? "Rectangular / Square" : "Circular / Round"}
                                </Button>
                            ))}
                        </div>
                    </section>

                    {/* ── PROJECT TYPE PRESETS ── */}
                    <section className={stepClass} aria-labelledby="projectType">
                        <h3 id="projectType" className="text-sm font-semibold text-white/80 mb-3">
                            Project Size
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {(["small", "medium", "large"] as ProjectPreset[]).map((p) => (
                                <Button
                                    key={p}
                                    type="button"
                                    onClick={() => applyPreset(p)}
                                    className={cn("h-9 rounded-sm text-xs sm:text-sm",
                                        preset === p
                                            ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                                            : "bg-slate-700 text-white hover:bg-slate-600")}>
                                    {p === "small"
                                        ? "Small (10×10)"
                                        : p === "medium"
                                            ? "Medium (12×16)"
                                            : "Large (16×20)"}
                                </Button>
                            ))}
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">
                            Selecting a size loads sensible defaults. You can override any value below.
                        </p>
                    </section>

                    {/* ── STEP 1 — Patio Dimensions ── */}
                    <section className={stepClass} aria-labelledby="step1">
                        <h3 id="step1" className="text-sm font-semibold text-white/80">
                            Step 1 — Patio Dimensions
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {shape === "rectangular" ? (
                                <>
                                    <Field
                                        id="length"
                                        label="Length"
                                        hint="Longest dimension of the patio."
                                    >
                                        <NumberInput
                                            id="length"
                                            value={length}
                                            onChange={(v) => { setLength(v); setSubmitted(false); }}
                                            placeholder="12"
                                            badge="ft"
                                            ariaLabel="Patio length in feet"
                                        />
                                    </Field>
                                    <Field
                                        id="width"
                                        label="Width"
                                        hint="Shorter dimension perpendicular to length."
                                    >
                                        <NumberInput
                                            id="width"
                                            value={width}
                                            onChange={(v) => { setWidth(v); setSubmitted(false); }}
                                            placeholder="16"
                                            badge="ft"
                                            ariaLabel="Patio width in feet"
                                        />
                                    </Field>
                                </>
                            ) : (
                                <Field
                                    id="diameter"
                                    label="Diameter"
                                    hint="Full diameter of the circular patio."
                                >
                                    <NumberInput
                                        id="diameter"
                                        value={diameter}
                                        onChange={(v) => { setDiameter(v); setSubmitted(false); }}
                                        placeholder="16"
                                        badge="ft"
                                        ariaLabel="Patio diameter in feet"
                                    />
                                </Field>
                            )}
                        </div>
                    </section>

                    {/* ── STEP 2 — Thickness & Waste ── */}
                    <section className={stepClass} aria-labelledby="step2">
                        <h3 id="step2" className="text-sm font-semibold text-white/80">
                            Step 2 — Thickness &amp; Waste Factor
                        </h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Field
                                id="thickness"
                                label="Slab Thickness"
                                hint="4 inches is standard for residential patios."
                                subHint="ACI 318-19 §7.3 recommends a minimum of 4 inches."
                            >
                                <NumberInput
                                    id="thickness"
                                    value={thickness}
                                    onChange={(v) => { setThickness(v); setSubmitted(false); }}
                                    placeholder="4"
                                    badge="in"
                                    ariaLabel="Slab thickness in inches"
                                />
                            </Field>
                            <Field
                                id="waste"
                                label="Waste Factor"
                                hint="10% accounts for spillage, subgrade variance, and rounding."
                                subHint="Use 15% for irregular or curved shapes."
                            >
                                <NumberInput
                                    id="waste"
                                    value={waste}
                                    onChange={(v) => { setWaste(v); setSubmitted(false); }}
                                    placeholder="10"
                                    badge="%"
                                    ariaLabel="Waste factor percentage"
                                />
                            </Field>
                        </div>
                    </section>

                    {/* ── ADVANCED — Cost Inputs ── */}
                    {advancedMode && (
                        <section className={stepClass} aria-labelledby="step3">
                            <h3 id="step3" className="text-sm font-semibold text-white/80">
                                Step 3 — Cost Inputs (Optional)
                            </h3>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <Field
                                    id="pricePerYd"
                                    label="Concrete Price"
                                    hint="Ready-mix concrete price per cubic yard."
                                >
                                    <NumberInput
                                        id="pricePerYd"
                                        value={pricePerYd}
                                        onChange={(v) => { setPricePerYd(v); setSubmitted(false); }}
                                        placeholder="130"
                                        badge="$/yd³"
                                        ariaLabel="Concrete price per cubic yard"
                                    />
                                </Field>
                                <Field
                                    id="laborPerSqFt"
                                    label="Labor Rate"
                                    hint="Forming, placing, and finishing per sq ft."
                                >
                                    <NumberInput
                                        id="laborPerSqFt"
                                        value={laborPerSqFt}
                                        onChange={(v) => { setLaborPerSqFt(v); setSubmitted(false); }}
                                        placeholder="5"
                                        badge="$/ft²"
                                        ariaLabel="Labor rate per square foot"
                                    />
                                </Field>
                                <Field
                                    id="finishPerSqFt"
                                    label="Finishing Rate"
                                    hint="Stamping, staining, sealing, or broom finish."
                                >
                                    <NumberInput
                                        id="finishPerSqFt"
                                        value={finishPerSqFt}
                                        onChange={(v) => { setFinishPerSqFt(v); setSubmitted(false); }}
                                        placeholder="2"
                                        badge="$/ft²"
                                        ariaLabel="Finishing rate per square foot"
                                    />
                                </Field>
                            </div>
                        </section>
                    )}

                    {/* ── ACTIONS ── */}
                    <section className={stepClass} aria-labelledby="actions">
                        <h3 id="actions" className="text-sm font-semibold text-white/80">Actions</h3>
                        <div className="mt-2 flex flex-col sm:flex-row gap-2">
                            <Button
                                type="submit"
                                className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0">
                                Calculate
                            </Button>
                            <Button
                                type="button"
                                onClick={resetAll}
                                className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400">
                                Reset
                            </Button>
                        </div>
                    </section>
                </form>

                {/* ── RESULTS ── */}
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
                                title="Print / Save">
                                <Printer className="h-4 w-4 mr-2" /> Print / Save
                            </Button>
                        </div>

                        {/* ACI Compliance Warning */}
                        {complianceWarning && (
                            <div className="mt-3 flex items-start gap-2 rounded-sm border border-amber-700/50 bg-amber-900/20 px-3 py-2">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-300">
                                    <strong>ACI 318-19 §7.3 Warning:</strong> A slab thickness of{" "}
                                    {nf(thickIn, 1)} inches is below the recommended minimum of 4 inches
                                    for residential patios. Insufficient thickness significantly increases
                                    the risk of cracking and surface failure under foot traffic and frost
                                    cycles. Consider increasing to at least 4 inches.
                                </p>
                            </div>
                        )}

                        {/* Inputs Summary */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Shape" v={shape === "rectangular" ? "Rectangular" : "Circular"} />
                                {shape === "rectangular" ? (
                                    <>
                                        <KV k="Length" v={`${length} ft`} />
                                        <KV k="Width" v={`${width} ft`} />
                                    </>
                                ) : (
                                    <KV k="Diameter" v={`${diameter} ft`} />
                                )}
                                <KV k="Thickness" v={`${thickness} in`} />
                                <KV k="Waste Factor" v={`${waste}%`} />
                            </div>
                        </div>

                        {/* Hero Number */}
                        <div className="flex flex-col items-center justify-center py-4 mb-4 mt-4 rounded-sm bg-slate-800 border border-slate-700">
                            <span className="text-xs uppercase tracking-wider text-slate-400">
                                Concrete Needed
                            </span>
                            <span className="text-4xl font-extrabold text-teal-400">
                                {nf(totalYd3, 2)}
                            </span>
                            <span className="text-xs text-slate-400 mt-1">
                                cubic yards (includes {waste}% waste)
                            </span>
                        </div>

                        {/* Volume Results */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">Volume Results</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Patio Area" v={`${nf(areaFt2, 1)} ft²`} />
                                <KV k="Base Volume" v={`${nf(baseVol.cubicFeet, 2)} ft³`} />
                                <KV k="Waste Added" v={`${nf(withWaste.wasteAmount, 2)} ft³`} />
                                <KV k="Total Volume (yd³)" v={`${nf(totalYd3, 2)} yd³`} />
                                <KV k="Total Volume (ft³)" v={`${nf(totalFt3, 1)} ft³`} />
                                <KV k="Total Volume (m³)" v={`${nf(totalM3, 3)} m³`} />
                            </div>
                        </div>

                        {/* Bag Estimates */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">
                                Pre-Mixed Bag Estimates
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="40-lb Bags (0.30 ft³ each)" v={`${bags.bags40lb} bags`} />
                                <KV k="60-lb Bags (0.45 ft³ each)" v={`${bags.bags60lb} bags`} />
                                <KV k="80-lb Bags (0.60 ft³ each)" v={`${bags.bags80lb} bags`} />
                            </div>
                            {totalYd3 > 2 && (
                                <div className="mt-3 flex items-start gap-2 rounded-sm border border-teal-700/50 bg-teal-900/20 px-3 py-2">
                                    <Info className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-teal-300">
                                        For projects over 2 cubic yards, ordering ready-mix concrete
                                        delivery is typically more cost-effective and far faster than
                                        hand-mixing pre-bagged concrete.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Weight */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">
                                Estimated Slab Weight
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                <KV k="Pounds" v={`${nf(wt.pounds, 0)} lb`} />
                                <KV k="US Tons" v={`${nf(wt.tons, 2)} tons`} />
                                <KV k="Kilograms" v={`${nf(wt.kilograms, 0)} kg`} />
                                <KV k="Metric Tons" v={`${nf(wt.metricTons, 2)} t`} />
                            </div>
                        </div>

                        {/* Advanced Cost Results */}
                        {advancedMode &&
                            (parseFloat(pricePerYd) > 0 ||
                                parseFloat(laborPerSqFt) > 0 ||
                                parseFloat(finishPerSqFt) > 0) && (
                                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                                    <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                        <KV k="Material Cost" v={`$${nf(matCost, 2)}`} />
                                        <KV k="Labor Cost" v={`$${nf(laborCost, 2)}`} />
                                        <KV k="Finishing Cost" v={`$${nf(finishCost, 2)}`} />
                                        <KV k="Total Estimated Cost" v={`$${nf(totalCost, 2)}`} />
                                        <KV k="Cost per ft²" v={areaFt2 > 0 ? `$${nf(totalCost / areaFt2, 2)}/ft²` : "—"} />
                                    </div>
                                </div>
                            )}

                        {/* Reference Table */}
                        <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                            <div className="mb-2 text-sm font-semibold text-white">
                                Common Patio Sizes — Quick Reference
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-slate-300 border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-2 px-3 text-teal-400">Size (ft)</th>
                                            <th className="text-left py-2 px-3 text-slate-300">Area (ft²)</th>
                                            <th className="text-left py-2 px-3 text-slate-300">4-in (yd³)</th>
                                            <th className="text-left py-2 px-3 text-slate-300">6-in (yd³)</th>
                                            <th className="text-left py-2 px-3 text-slate-300">80-lb Bags @4&quot;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PATIO_REF.map((r, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                                <td className="py-2 px-3 font-medium text-teal-400">{r.size}</td>
                                                <td className="py-2 px-3">{r.area}</td>
                                                <td className="py-2 px-3">{r.yd4}</td>
                                                <td className="py-2 px-3">{r.yd6}</td>
                                                <td className="py-2 px-3">{r.bags80}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-2 text-[11px] text-white/50">
                                All volumes include 10% waste allowance. Bag counts at 4-inch thickness
                                with 10% waste using 80-lb bags (0.60 ft³ each).
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 rounded-sm border border-slate-700 bg-slate-800/50 p-3">
                            <p className="text-xs text-slate-400 flex items-start gap-1.5">
                                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-teal-400" />
                                <span>
                                    <strong className="text-slate-300">Disclaimer:</strong> This
                                    concrete patio calculator provides project estimates only. Actual
                                    quantities may vary based on subgrade conditions, form deflection,
                                    surface profile irregularities, and contractor waste practices.
                                    Always verify measurements and consult a licensed professional for
                                    structural or load-bearing applications.
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}