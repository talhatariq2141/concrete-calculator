"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Info, Printer } from "lucide-react"; // ⬅️ NEW: Printer icon

/* -------------------------------------------------------------
   ConcreteYardsCalc.tsx — now with Print/Save (backend-less)
   - Adds a Print/Save button (green) that opens a clean, white,
     branded print page in a new tab and auto-opens the browser
     Print dialog (Save as PDF works too).
   - All existing math, UI, and state remain unchanged.
-------------------------------------------------------------- */

type Shape = "rectangle" | "circle";
type LinearUnit =
  | "feet"
  | "inches"
  | "yards"
  | "meters"
  | "centimeters"
  | "millimeters";

/* --- Original state/logic (unchanged) --- */
export default function ConcreteYardsCalc() {
  // Shape & units (centralized)
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [unit, setUnit] = React.useState<LinearUnit>("feet");

  // Dimensions (all in chosen unit)
  const [length, setLength] = React.useState<string>(""); // rectangle only
  const [width, setWidth] = React.useState<string>(""); // rectangle only
  const [diameter, setDiameter] = React.useState<string>(""); // circle only
  const [thickness, setThickness] = React.useState<string>("");

  // Waste allowance
  const [wastePct, setWastePct] = React.useState<number>(0);

  // Results
  const [ft3, setFt3] = React.useState<number | null>(null);
  const [yd3, setYd3] = React.useState<number | null>(null);
  const [m3, setM3] = React.useState<number | null>(null);

  const [error, setError] = React.useState<string>("");

  // -------- Conversion helpers (unchanged math) --------
  function linToFeet(v: number, u: LinearUnit): number {
    switch (u) {
      case "feet":
        return v;
      case "inches":
        return v / 12;
      case "yards":
        return v * 3;
      case "meters":
        return v * 3.280839895;
      case "centimeters":
        return (v / 100) * 3.280839895;
      case "millimeters":
        return (v / 1000) * 3.280839895;
      default:
        return v;
    }
  }

  function feet3ToYards3(ft3: number): number {
    return ft3 / 27;
  }

  function feet3ToMeters3(ft3: number): number {
    // 1 ft³ = 0.028316846592 m³
    return ft3 * 0.028316846592;
  }

  // -------- Compute (unchanged formulas) --------
  function compute() {
    setError("");

    const T = Number(thickness);
    if (!Number.isFinite(T) || T <= 0) {
      setError("Enter a valid thickness.");
      clearResults();
      return;
    }

    // Convert thickness to feet
    const t_ft = linToFeet(T, unit);

    let volume_ft3 = 0;

    if (shape === "rectangle") {
      const L = Number(length);
      const W = Number(width);

      if (!Number.isFinite(L) || L <= 0) {
        setError("Enter a valid length.");
        clearResults();
        return;
      }
      if (!Number.isFinite(W) || W <= 0) {
        setError("Enter a valid width.");
        clearResults();
        return;
      }

      const L_ft = linToFeet(L, unit);
      const W_ft = linToFeet(W, unit);

      volume_ft3 = L_ft * W_ft * t_ft;
    } else {
      // circle
      const D = Number(diameter);
      if (!Number.isFinite(D) || D <= 0) {
        setError("Enter a valid diameter.");
        clearResults();
        return;
      }

      const D_ft = linToFeet(D, unit);
      const r_ft = D_ft / 2;
      volume_ft3 = Math.PI * r_ft * r_ft * t_ft;
    }

    // Apply waste allowance
    const vol_with_waste_ft3 = volume_ft3 * (1 + wastePct / 100);

    const yards3 = feet3ToYards3(vol_with_waste_ft3);
    const meters3 = feet3ToMeters3(vol_with_waste_ft3);

    setFt3(Number(vol_with_waste_ft3.toFixed(2)));
    setYd3(Number(yards3.toFixed(2)));
    setM3(Number(meters3.toFixed(3)));
  }

  function clearResults() {
    setFt3(null);
    setYd3(null);
    setM3(null);
  }

  function resetAll() {
    setShape("rectangle");
    setUnit("feet");
    setLength("");
    setWidth("");
    setDiameter("");
    setThickness("");
    setWastePct(0);
    setError("");
    clearResults();
  }

  /* ----------------------- UI helpers ----------------------- */
  const fieldInputClass =
    "h-11 mt-2 mb-2 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
  const selectTriggerClass =
    "h-11 mt-2 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
  const selectContentClass =
    "rounded-sm border border-slate-700 bg-slate-900 text-white";
  const stepClass = "pt-6 mt-4 border-t border-slate-800";

  const unitAbbrev: Record<LinearUnit, string> = {
    feet: "ft",
    inches: "in",
    yards: "yd",
    meters: "m",
    centimeters: "cm",
    millimeters: "mm",
  };

  const NumberInput = ({
    id,
    value,
    onChange,
    placeholder,
    badge,
    ariaLabel,
  }: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    badge?: string;
    ariaLabel?: string;
  }) => (
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

  /* ======================= PRINT / SAVE (NEW) =======================
   * Backend-less printable view:
   * - Appears only when results exist (after Calculate)
   * - Opens a new tab with white background and branded header
   * - Shows inputs summary + yd³/ft³/m³ results (+5%/+10% helpers)
   * - Auto-opens browser Print (user can Save as PDF)
   * ------------------------------------------------------------------ */

  // TODO: point to your actual logo asset if different
  const LOGO_URL = "/logo.svg";

  // Helper to format like the on-page tiles
  const nf = (n: number | null, max = 4) =>
    n === null || !Number.isFinite(n) ? "—" : n.toLocaleString(undefined, { maximumFractionDigits: max });

  const buildPrintHtml = () => {
    if (yd3 === null || ft3 === null || m3 === null) return "";

    const now = new Date().toLocaleString();

    const isRect = shape === "rectangle";
    const unitShort = unitAbbrev[unit];

    // Pre-compute helpers for ordering
    const yd3_base = yd3;
    const yd3_5 = Number((yd3_base * 1.05).toFixed(2));
    const yd3_10 = Number((yd3_base * 1.1).toFixed(2));

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Concrete Yards Calculator – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand img { height: 36px; width: auto; }
    .brand-name { font-weight: 800; font-size: 18px; color: #0f766e; }
    .meta { margin-left: auto; text-align: right; color: #475569; font-size: 12px; }
    h2 { font-size: 16px; margin: 18px 0 8px; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #fff; }
    .kv { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; }
    .kv .k { color: #475569; }
    .kv .v { color: #0f766e; font-weight: 700; }
    .muted { color: #475569; font-size: 12px; }
    .value-md { font-size: 18px; font-weight: 800; color: #0f766e; }
    .label { text-transform: uppercase; letter-spacing: .02em; font-size: 11px; color: #64748b; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 12px; }
    @media print {
      @page { margin: 12mm; }
      .footer { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header / Branding -->
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Concrete Calculator Max Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta">
        <div>Concrete Yards Calculator</div>
        <div>Printed: ${now}</div>
      </div>
    </div>

    <!-- Inputs Summary -->
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Shape</div><div class="v">${isRect ? "Rectangle / Slab" : "Circular"}</div></div>
      <div class="kv"><div class="k">Units</div><div class="v">${unitShort}</div></div>
      ${isRect ? `
        <div class="kv"><div class="k">Length</div><div class="v">${length || 0} ${unitShort}</div></div>
        <div class="kv"><div class="k">Width</div><div class="v">${width || 0} ${unitShort}</div></div>
      ` : `
        <div class="kv"><div class="k">Diameter</div><div class="v">${diameter || 0} ${unitShort}</div></div>
      `}
      <div class="kv"><div class="k">Thickness</div><div class="v">${thickness || 0} ${unitShort}</div></div>
      <div class="kv"><div class="k">Waste</div><div class="v">${wastePct}%</div></div>
    </div>

    <!-- Results -->
    <h2>Results</h2>
    <div class="grid-2">
      <div class="card">
        <div class="label">Concrete Volume</div>
        <div class="kv"><div class="k">Cubic Yards (yd³)</div><div class="v">${nf(yd3)}</div></div>
        <div class="kv"><div class="k">Cubic Feet (ft³)</div><div class="v">${nf(ft3)}</div></div>
        <div class="kv"><div class="k">Cubic Meters (m³)</div><div class="v">${nf(m3)}</div></div>
      </div>
      <div class="card">
        <div class="label">Ordering Helper</div>
        <div class="kv"><div class="k">yd³ (base)</div><div class="v">${nf(yd3)}</div></div>
        <div class="kv"><div class="k">yd³ (+5%)</div><div class="v">${nf(yd3_5)}</div></div>
        <div class="kv"><div class="k">yd³ (+10%)</div><div class="v">${nf(yd3_10)}</div></div>
      </div>
    </div>

    <div class="footer">
      Tip: In the browser’s Print dialog, choose “Save as PDF” to export this page as a PDF.
    </div>
  </div>

  <script>
    window.addEventListener('load', () => setTimeout(() => window.print(), 100));
  </script>
</body>
</html>`;
  };

  const handlePrint = () => {
    // Only allow printing when results are visible
    if (yd3 === null || ft3 === null || m3 === null) return;
    const html = buildPrintHtml();
    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups for this site to use Print/Save.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  /* ----------------------- Render ----------------------- */
  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center">
          Concrete Yards Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center sm:text-left">
          Choose a shape, set one unit for all dimensions, and get concrete volume in cubic yards.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Keep all inputs in the <span className="text-white font-medium">same unit</span>. Rectangle: <code className="text-slate-200">L × W × T</code>. Circular: <code className="text-slate-200">π × (D/2)² × T</code>.
          </p>
        </div>

        {/* STEP 1 — Shape & Units */}
        <section className={stepClass} aria-labelledby="step-units">
          <h3 id="step-units" className="text-sm font-semibold text-white/80">Step 1 — Choose Shape & Units</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-teal-500">Shape</Label>
              <Select value={shape} onValueChange={(v) => { setShape(v as Shape); clearResults(); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Choose shape">
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="rectangle" className="text-white">Rectangle / Slab</SelectItem>
                  <SelectItem value="circle" className="text-white">Circular</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-white/60">Pick the layout that matches your pour.</p>
            </div>

            <div>
              <Label className="text-teal-500">Input Units (applies to all fields)</Label>
              <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); clearResults(); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Choose input units">
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="feet" className="text-white">Feet (ft)</SelectItem>
                  <SelectItem value="inches" className="text-white">Inches (in)</SelectItem>
                  <SelectItem value="yards" className="text-white">Yards (yd)</SelectItem>
                  <SelectItem value="meters" className="text-white">Meters (m)</SelectItem>
                  <SelectItem value="centimeters" className="text-white">Centimeters (cm)</SelectItem>
                  <SelectItem value="millimeters" className="text-white">Millimeters (mm)</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-white/60">All dimensions below will be interpreted in <span className="text-white">{unitAbbrev[unit]}</span>.</p>
            </div>
          </div>
        </section>

        {/* STEP 2 — Core Dimensions */}
        <section className={stepClass} aria-labelledby="step-dimensions">
          <h3 id="step-dimensions" className="text-sm font-semibold text-white/80">Step 2 — Core Dimensions</h3>

          {shape === "rectangle" ? (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <Label className="text-teal-500">Length (L)</Label>
                <NumberInput
                  id="length"
                  value={length}
                  onChange={(v) => { setLength(v); clearResults(); }}
                  placeholder={unit === "inches" ? "e.g., 120" : unit === "centimeters" ? "e.g., 300" : "e.g., 10"}
                  badge={unitAbbrev[unit]}
                  ariaLabel="Length"
                />
                <p className="text-xs text-slate-300">Overall slab/rectangle length.</p>
                <p className="text-[11px] text-white/60">Common: 8–30 {unitAbbrev[unit]}</p>
              </div>

              <div>
                <Label className="text-teal-500">Width (W)</Label>
                <NumberInput
                  id="width"
                  value={width}
                  onChange={(v) => { setWidth(v); clearResults(); }}
                  placeholder={unit === "inches" ? "e.g., 144" : unit === "centimeters" ? "e.g., 400" : "e.g., 12"}
                  badge={unitAbbrev[unit]}
                  ariaLabel="Width"
                />
                <p className="text-xs text-slate-300">Overall width of the slab/rectangle.</p>
                <p className="text-[11px] text-white/60">Common: 6–40 {unitAbbrev[unit]}</p>
              </div>

              <div>
                <Label className="text-teal-500">Thickness (T)</Label>
                <NumberInput
                  id="thickness"
                  value={thickness}
                  onChange={(v) => { setThickness(v); clearResults(); }}
                  placeholder={unit === "inches" ? "e.g., 6" : unit === "centimeters" ? "e.g., 15" : "e.g., 0.5"}
                  badge={unitAbbrev[unit]}
                  ariaLabel="Thickness"
                />
                <p className="text-xs text-slate-300">Uniform thickness across the pour.</p>
                <p className="text-[11px] text-white/60">Common: 0.33–0.67 {unitAbbrev[unit]} (4–8 in)</p>
              </div>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <Label className="text-teal-500">Diameter (D)</Label>
                <NumberInput
                  id="diameter"
                  value={diameter}
                  onChange={(v) => { setDiameter(v); clearResults(); }}
                  placeholder={unit === "inches" ? "e.g., 144" : unit === "centimeters" ? "e.g., 300" : "e.g., 12"}
                  badge={unitAbbrev[unit]}
                  ariaLabel="Diameter"
                />
                <p className="text-xs text-slate-300">Full diameter of the circular area.</p>
                <p className="text-[11px] text-white/60">Common: 3–20 {unitAbbrev[unit]}</p>
              </div>

              <div>
                <Label className="text-teal-500">Thickness (T)</Label>
                <NumberInput
                  id="thickness2"
                  value={thickness}
                  onChange={(v) => { setThickness(v); clearResults(); }}
                  placeholder={unit === "inches" ? "e.g., 6" : unit === "centimeters" ? "e.g., 15" : "e.g., 0.5"}
                  badge={unitAbbrev[unit]}
                  ariaLabel="Thickness"
                />
                <p className="text-xs text-slate-300">Uniform thickness across the pour.</p>
                <p className="text-[11px] text-white/60">Common: 0.33–0.67 {unitAbbrev[unit]} (4–8 in)</p>
              </div>
            </div>
          )}
        </section>

        {/* STEP 3 — Waste */}
        <section className={stepClass} aria-labelledby="step-waste">
          <h3 id="step-waste" className="text-sm font-semibold text-white/80">Step 3 — Waste Allowance</h3>
          <div className="mt-2 max-w-sm">
            <Label className="text-teal-500">Waste Allowance (%)</Label>
            <Select value={String(wastePct)} onValueChange={(v) => { setWastePct(Number(v)); clearResults(); }}>
              <SelectTrigger className={selectTriggerClass} aria-label="Choose waste allowance">
                <SelectValue placeholder="Choose waste allowance" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="0" className="text-white">0% (no waste)</SelectItem>
                <SelectItem value="5" className="text-white">5% (recommended minimum)</SelectItem>
                <SelectItem value="10" className="text-white">10% (uneven subgrade)</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-white/60">Adds extra volume to cover spillage, uneven subgrade, etc.</p>
          </div>
        </section>

        {/* STEP 4 — Actions */}
        <section className={stepClass} aria-labelledby="step-actions">
          <h3 id="step-actions" className="text-sm font-semibold text-white/80">Step 4 — Actions</h3>
          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              onClick={compute}
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

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>
        )}

        {/* Inputs Summary & Results (shown after Calculate) */}
        {yd3 !== null && (
          <>
            {/* NEW: Print/Save button (green) */}
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={handlePrint}
                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                aria-label="Print or save results as PDF"
                title="Print / Save"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print / Save
              </Button>
            </div>

            {/* Inputs Summary */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Shape</span><span className="text-teal-400 font-semibold">{shape === "rectangle" ? "Rectangle / Slab" : "Circular"}</span></div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Units</span><span className="text-teal-400 font-semibold">{unitAbbrev[unit]}</span></div>
                {shape === "rectangle" ? (
                  <>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Length</span><span className="text-teal-400 font-semibold">{length || 0} {unitAbbrev[unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Width</span><span className="text-teal-400 font-semibold">{width || 0} {unitAbbrev[unit]}</span></div>
                  </>
                ) : (
                  <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Diameter</span><span className="text-teal-400 font-semibold">{diameter || 0} {unitAbbrev[unit]}</span></div>
                )}
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Thickness</span><span className="text-teal-400 font-semibold">{thickness || 0} {unitAbbrev[unit]}</span></div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Waste</span><span className="text-teal-400 font-semibold">{wastePct}%</span></div>
              </div>
            </div>

            {/* Result tiles */}
            <div className={`${stepClass} grid grid-cols-1 sm:grid-cols-3 gap-4 border-none`}>
              <div className="rounded-sm p-4 bg-slate-900 border border-slate-700">
                <p className="text-white/70 text-xs">Cubic Yards (yd³)</p>
                <p className="text-teal-400 text-2xl font-bold">{yd3}</p>
              </div>
              <div className="rounded-sm p-4 bg-slate-900 border border-slate-700">
                <p className="text-white/70 text-xs">Cubic Feet (ft³)</p>
                <p className="text-teal-400 text-2xl font-bold">{ft3}</p>
              </div>
              <div className="rounded-sm p-4 bg-slate-900 border border-slate-700">
                <p className="text-white/70 text-xs">Cubic Meters (m³)</p>
                <p className="text-teal-400 text-2xl font-bold">{m3}</p>
              </div>
            </div>

            {/* Yards helper (+5% / +10%) derived from current yd³ */}
            <div className={`${stepClass} grid grid-cols-1 sm:grid-cols-3 gap-4`}>
              <div className="rounded-sm p-4 border border-slate-700 bg-slate-900">
                <p className="text-white/70 text-xs">yd³ (base)</p>
                <p className="text-teal-400 text-xl font-semibold">{yd3}</p>
              </div>
              <div className="rounded-sm p-4 border border-slate-700 bg-slate-900">
                <p className="text-white/70 text-xs">yd³ (+5%)</p>
                <p className="text-teal-400 text-xl font-semibold">{(yd3 * 1.05).toFixed(2)}</p>
              </div>
              <div className="rounded-sm p-4 border border-slate-700 bg-slate-900">
                <p className="text-white/70 text-xs">yd³ (+10%)</p>
                <p className="text-teal-400 text-xl font-semibold">{(yd3 * 1.1).toFixed(2)}</p>
              </div>
            </div>
          </>
        )}

        {/* Footnotes */}
        <div className={`${stepClass} text-white/70 text-xs space-y-2 leading-relaxed`}>
          <p>
            Rectangle/Slab formula: <span className="text-white font-semibold">V = L × W × T</span>
          </p>
          <p>
            Circular formula: <span className="text-white font-semibold">V = π × (D/2)² × T</span>
          </p>
          <p>
            Conversions: <span className="text-white font-semibold">1 yd³ = 27 ft³</span>,&nbsp;
            <span className="text-white font-semibold">1 ft³ = 0.028316846592 m³</span>.
          </p>
          <p>
            All inputs use the <span className="text-white font-semibold">same unit</span> chosen in
            the “Input Units” selector for consistency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
