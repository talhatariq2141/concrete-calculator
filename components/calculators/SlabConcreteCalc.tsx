"use client";

import React, { useMemo, useState } from "react";
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
import { Info, Printer } from "lucide-react";

/* -------------------- Types (unchanged) -------------------- */
type LinearUnit = "meters" | "yards" | "feet" | "inches" | "centimeter";
type AreaUnit = "m2" | "yd2" | "ft2" | "in2" | "cm2";
type VolumeUnit = "m3" | "yd3" | "ft3" | "in3" | "cm3";

/* ----------------- Unit helpers (unchanged) ---------------- */
const toMetersFactor: Record<LinearUnit, number> = {
  meters: 1,
  yards: 0.9144,
  feet: 0.3048,
  inches: 0.0254,
  centimeter: 0.01,
};

const areaUnits: { key: AreaUnit; label: string; fromMeters2: (m2: number) => number }[] = [
  { key: "m2", label: "m² (square meters)", fromMeters2: (m2) => m2 },
  { key: "yd2", label: "yd² (square yards)", fromMeters2: (m2) => m2 / (0.9144 ** 2) },
  { key: "ft2", label: "ft² (square feet)", fromMeters2: (m2) => m2 / (0.3048 ** 2) },
  { key: "in2", label: "in² (square inches)", fromMeters2: (m2) => m2 / (0.0254 ** 2) },
  { key: "cm2", label: "cm² (square centimeters)", fromMeters2: (m2) => m2 / (0.01 ** 2) },
];

const volumeUnits: { key: VolumeUnit; label: string; fromMeters3: (m3: number) => number }[] = [
  { key: "m3", label: "m³ (cubic meters)", fromMeters3: (m3) => m3 },
  { key: "yd3", label: "yd³ (cubic yards)", fromMeters3: (m3) => m3 / (0.9144 ** 3) },
  { key: "ft3", label: "ft³ (cubic feet)", fromMeters3: (m3) => m3 / (0.3048 ** 3) },
  { key: "in3", label: "in³ (cubic inches)", fromMeters3: (m3) => m3 / (0.0254 ** 3) },
];

const linearUnitOptions: { value: LinearUnit; label: string }[] = [
  { value: "yards", label: "yards" },
  { value: "meters", label: "meters" },
  { value: "feet", label: "feet" },
  { value: "inches", label: "inches" },
  { value: "centimeter", label: "centimeter" },
];

/* ---------------- UI tokens / shared classes ---------------- */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass =
  "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = {
  meters: "m",
  yards: "yd",
  feet: "ft",
  inches: "in",
  centimeter: "cm",
};

/* ---------------- Small UI helpers (presentation only) ---------------- */
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

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2 text-sm">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}

/* ------------------ Component (logic unchanged) ------------------ */
export default function SlabConcreteCalc() {
  // Inputs
  const [length, setLength] = useState<string>("");
  const [lengthUnit, setLengthUnit] = useState<LinearUnit>("meters");
  const [width, setWidth] = useState<string>("");
  const [widthUnit, setWidthUnit] = useState<LinearUnit>("meters");
  const [thickness, setThickness] = useState<string>("");
  const [thicknessUnit, setThicknessUnit] = useState<LinearUnit>("centimeter");

  // Output unit selectors
  const [areaOutUnit, setAreaOutUnit] = useState<AreaUnit>("m2");
  const [volumeOutUnit, setVolumeOutUnit] = useState<VolumeUnit>("m3");

  // UI flow
  const [submitted, setSubmitted] = useState(false);

  // Calculations (unchanged)
  const calc = useMemo(() => {
    const L = parseFloat(length);
    const W = parseFloat(width);
    const T = parseFloat(thickness);
    if ([L, W, T].some((v) => Number.isNaN(v) || v < 0)) return null;

    const Lm = L * toMetersFactor[lengthUnit];
    const Wm = W * toMetersFactor[widthUnit];
    const Tm = T * toMetersFactor[thicknessUnit];

    const area_m2 = Lm * Wm;
    const vol_m3 = area_m2 * Tm;

    const areaConv = areaUnits.find((a) => a.key === areaOutUnit)!;
    const volConv = volumeUnits.find((v) => v.key === volumeOutUnit)!;
    const ydConv = volumeUnits.find((v) => v.key === "yd3")!;

    const area = areaConv.fromMeters2(area_m2);
    const volume = volConv.fromMeters3(vol_m3);

    const volume5 = volume * 1.05;
    const volume10 = volume * 1.1;

    const yards = ydConv.fromMeters3(vol_m3);
    const yards5 = yards * 1.05;
    const yards10 = yards * 1.1;

    return {
      area,
      volume,
      volume5,
      volume10,
      yards,
      yards5,
      yards10,
      areaUnitLabel: areaConv.label,
      volumeUnitLabel: volConv.label,
    };
  }, [length, width, thickness, lengthUnit, widthUnit, thicknessUnit, areaOutUnit, volumeOutUnit]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const numberOrEmpty = (v: string) => (v === "" ? "" : v.replace(/[^0-9.]/g, ""));

  const resetAll = () => {
    setLength("");
    setWidth("");
    setThickness("");
    setLengthUnit("meters");
    setWidthUnit("meters");
    setThicknessUnit("centimeter");
    setAreaOutUnit("m2");
    setVolumeOutUnit("m3");
    setSubmitted(false);
  };

  /* ======================= PRINT / SAVE (NEW) =======================
   * This section adds a backend-less printable view.
   * It opens a new tab with a white background and injects a minimal,
   * branded HTML document containing the input summary and results.
   * The user can then use the browser's Print dialog to print or save as PDF.
   * ------------------------------------------------------------------ */

  // TODO: Replace this with your real logo asset path if different
  const LOGO_URL = "/logo.svg"; // e.g., "/logo.svg" or "/images/ccm-logo.png"

  // Helper to format numbers exactly like in the on-page tiles
  const fmt = (n: number) => Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(n);

  /**
   * Builds the printable HTML content as a full document string.
   * Keeping styles inline ensures portability and works without any backend.
   */
  const buildPrintHtml = () => {
    if (!calc) return "";

    const now = new Date().toLocaleString();
    const lengthStr = `${length || 0} ${unitAbbrev[lengthUnit]}`;
    const widthStr = `${width || 0} ${unitAbbrev[widthUnit]}`;
    const thicknessStr = `${thickness || 0} ${unitAbbrev[thicknessUnit]}`;

    // NOTE: Using simple, email-style CSS for consistent print output
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Slab Concrete Calculator – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    /* Reset / base */
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand img { height: 36px; width: auto; }
    .brand-name { font-weight: 800; font-size: 18px; color: #0f766e; }
    .meta { margin-left: auto; text-align: right; color: #475569; font-size: 12px; }
    h1 { margin: 0; font-size: 20px; color: #0f172a; }
    h2 { font-size: 16px; margin: 18px 0 8px; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #fff; }
    .kv { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; }
    .kv .k { color: #475569; }
    .kv .v { color: #0f766e; font-weight: 700; }
    .muted { color: #475569; font-size: 12px; }
    .value-lg { font-size: 22px; font-weight: 800; color: #0f766e; }
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
        <div>Slab Concrete Calculator</div>
        <div>Printed: ${now}</div>
      </div>
    </div>

    <!-- Inputs Summary -->
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Length</div><div class="v">${lengthStr}</div></div>
      <div class="kv"><div class="k">Width</div><div class="v">${widthStr}</div></div>
      <div class="kv"><div class="k">Thickness</div><div class="v">${thicknessStr}</div></div>
      <div class="kv"><div class="k">Area Unit</div><div class="v">${areaUnits.find(a=>a.key===areaOutUnit)!.label}</div></div>
      <div class="kv"><div class="k">Volume Unit</div><div class="v">${volumeUnits.find(v=>v.key===volumeOutUnit)!.label}</div></div>
    </div>

    <!-- Results -->
    <h2>Results</h2>
    <div class="grid-2">
      <div class="card">
        <div class="label">Area</div>
        <div class="value-lg">${fmt(calc.area)}</div>
        <div class="muted">${calc.areaUnitLabel}</div>
      </div>
      <div class="card">
        <div class="label">Volume</div>
        <div class="value-lg">${fmt(calc.volume)}</div>
        <div class="muted">${calc.volumeUnitLabel}</div>
      </div>
      <div class="card">
        <div class="label">+5% Overage</div>
        <div class="value-md">${fmt(calc.volume5)}</div>
        <div class="muted">${calc.volumeUnitLabel}</div>
      </div>
      <div class="card">
        <div class="label">+10% Overage</div>
        <div class="value-md">${fmt(calc.volume10)}</div>
        <div class="muted">${calc.volumeUnitLabel}</div>
      </div>
    </div>

    <!-- Yards for Ordering -->
    <h2 style="margin-top:16px;">Cubic Yards (for ordering)</h2>
    <div class="grid">
      <div class="card">
        <div class="label">Required</div>
        <div class="value-md">${fmt(calc.yards)} yd³</div>
      </div>
      <div class="card">
        <div class="label">+5%</div>
        <div class="value-md">${fmt(calc.yards5)} yd³</div>
      </div>
      <div class="card">
        <div class="label">+10%</div>
        <div class="value-md">${fmt(calc.yards10)} yd³</div>
      </div>
    </div>

    <div class="footer">
      Tip: In the browser’s Print dialog, choose “Save as PDF” to export this page as a PDF.
    </div>
  </div>

  <!-- Auto-open the print dialog to streamline the flow -->
  <script>
    window.addEventListener('load', () => {
      // Small timeout improves print reliability across browsers
      setTimeout(() => { window.print(); }, 100);
    });
  </script>
</body>
</html>`;
  };

  /**
   * Opens a new tab with the printable HTML and focuses it.
   * Uses window.open + document.write so no backend is required.
   */
  const handlePrint = () => {
    if (!calc) return;
    const html = buildPrintHtml();

    // Attempt to open a new tab (may be blocked if not triggered by a user gesture)
    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups for this site to use Print/Save.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    // print is triggered by the injected script after load
  };

  /* =================== END PRINT / SAVE (NEW) =================== */

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center">
          Slab Concrete Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center sm:text-left">
          Compute slab area and concrete volume. Keep all inputs in the same unit per field.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Area uses <code className="text-slate-200">L × W</code>. Volume uses <code className="text-slate-200">Area × Thickness</code>.
          </p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-0">
          {/* STEP 1 — Choose Units */}
          <section className={stepClass} aria-labelledby="step-units">
            <h3 id="step-units" className="text-sm font-semibold text-white/80">Step 1 — Choose Units</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Length unit */}
              <div>
                <Label className="text-teal-500">Length Unit</Label>
                <Select value={lengthUnit} onValueChange={(v: LinearUnit) => { setLengthUnit(v); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Length unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {linearUnitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value} className="text-white">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-white/60">Displayed inside the input as a badge ({unitAbbrev[lengthUnit]}).</p>
              </div>

              {/* Width unit */}
              <div>
                <Label className="text-teal-500">Width Unit</Label>
                <Select value={widthUnit} onValueChange={(v: LinearUnit) => { setWidthUnit(v); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Width unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {linearUnitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value} className="text-white">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-white/60">Use the same measurement system as length for consistency.</p>
              </div>

              {/* Thickness unit */}
              <div>
                <Label className="text-teal-500">Thickness Unit</Label>
                <Select value={thicknessUnit} onValueChange={(v: LinearUnit) => { setThicknessUnit(v); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Thickness unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {linearUnitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value} className="text-white">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-white/60">Common thickness ranges: 4–8 in (100–200 mm).</p>
              </div>
            </div>
          </section>

          {/* STEP 2 — Core Dimensions */}
          <section className={stepClass} aria-labelledby="step-dimensions">
            <h3 id="step-dimensions" className="text-sm font-semibold text-white/80">Step 2 — Core Dimensions</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Length */}
              <div>
                <Label htmlFor="length" className="text-teal-500">Length (L)</Label>
                <NumberInput
                  id="length"
                  value={length}
                  onChange={(v) => { setLength(numberOrEmpty(v)); setSubmitted(false); }}
                  placeholder={lengthUnit === "feet" ? "e.g., 12" : lengthUnit === "inches" ? "e.g., 144" : "e.g., 4"}
                  badge={unitAbbrev[lengthUnit]}
                  ariaLabel="Length"
                />
                <p className="text-xs text-slate-300">Overall slab length.</p>
                <p className="text-[11px] text-white/60">Typical: 3–30 {unitAbbrev[lengthUnit]}</p>
              </div>

              {/* Width */}
              <div>
                <Label htmlFor="width" className="text-teal-500">Width (W)</Label>
                <NumberInput
                  id="width"
                  value={width}
                  onChange={(v) => { setWidth(numberOrEmpty(v)); setSubmitted(false); }}
                  placeholder={widthUnit === "feet" ? "e.g., 10" : widthUnit === "inches" ? "e.g., 120" : "e.g., 3"}
                  badge={unitAbbrev[widthUnit]}
                  ariaLabel="Width"
                />
                <p className="text-xs text-slate-300">Overall slab width.</p>
                <p className="text-[11px] text-white/60">Typical: 2–20 {unitAbbrev[widthUnit]}</p>
              </div>

              {/* Thickness */}
              <div>
                <Label htmlFor="thickness" className="text-teal-500">Thickness (T)</Label>
                <NumberInput
                  id="thickness"
                  value={thickness}
                  onChange={(v) => { setThickness(numberOrEmpty(v)); setSubmitted(false); }}
                  placeholder={thicknessUnit === "inches" ? "e.g., 6" : thicknessUnit === "centimeter" ? "e.g., 15" : "e.g., 0.15"}
                  badge={unitAbbrev[thicknessUnit]}
                  ariaLabel="Thickness"
                />
                <p className="text-xs text-slate-300">Uniform slab thickness.</p>
                <p className="text-[11px] text-white/60">Typical: 0.10–0.20 m (4–8 in)</p>
              </div>
            </div>
          </section>

          {/* STEP 3 — Output Units */}
          <section className={stepClass} aria-labelledby="step-output">
            <h3 id="step-output" className="text-sm font-semibold text-white/80">Step 3 — Output Units</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-teal-500">Area Unit</Label>
                <Select value={areaOutUnit} onValueChange={(v: AreaUnit) => { setAreaOutUnit(v); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Area unit">
                    <SelectValue placeholder="Select area unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {areaUnits.map((u) => (
                      <SelectItem key={u.key} value={u.key} className="text-white">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-[11px] text-white/60">Choose how to display the computed area.</p>
              </div>

              <div>
                <Label className="text-teal-500">Volume Unit</Label>
                <Select value={volumeOutUnit} onValueChange={(v: VolumeUnit) => { setVolumeOutUnit(v); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Volume unit">
                    <SelectValue placeholder="Select volume unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {volumeUnits.map((u) => (
                      <SelectItem key={u.key} value={u.key} className="text-white">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text[11px] text-white/60">Yards (yd³) are common for ordering.</p>
              </div>
            </div>
          </section>

          {/* STEP 4 — Actions */}
          <section className={stepClass} aria-labelledby="step-actions">
            <h3 id="step-actions" className="text-sm font-semibold text-white/80">Step 4 — Actions</h3>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0">
                Calculate
              </Button>
              <Button type="button" onClick={resetAll} className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400">
                Reset
              </Button>
            </div>
          </section>
        </form>

        {/* Results */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.</p>
        ) : calc === null ? (
          <p className="mt-4 text-sm text-red-300">Please enter valid non-negative numbers for all fields.</p>
        ) : (
          <>
            {/* NEW: Print/Save button (only shows when results are visible) */}
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
                <KV k="Length" v={`${length || 0} ${unitAbbrev[lengthUnit]}`} />
                <KV k="Width" v={`${width || 0} ${unitAbbrev[widthUnit]}`} />
                <KV k="Thickness" v={`${thickness || 0} ${unitAbbrev[thicknessUnit]}`} />
                <KV k="Area Unit" v={`${areaUnits.find(a=>a.key===areaOutUnit)!.label}`} />
                <KV k="Volume Unit" v={`${volumeUnits.find(v=>v.key===volumeOutUnit)!.label}`} />
              </div>
            </div>

            {/* Result tiles */}
            <div className={`${stepClass} grid grid-cols-1 sm:grid-cols-2 gap-4 border-none`}>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">Area</div>
                <div className="mt-1 text-2xl font-semibold text-teal-400">
                  {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.area)}
                </div>
                <div className="text-sm text-white/70">{calc.areaUnitLabel}</div>
              </div>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">Volume</div>
                <div className="mt-1 text-2xl font-semibold text-teal-400">
                  {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.volume)}
                </div>
                <div className="text-sm text-white/70">{calc.volumeUnitLabel}</div>
              </div>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">+5% Overage</div>
                <div className="mt-1 text-xl font-semibold text-teal-400">
                  {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.volume5)}
                </div>
                <div className="text-sm text-white/70">{calc.volumeUnitLabel}</div>
              </div>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">+10% Overage</div>
                <div className="mt-1 text-xl font-semibold text-teal-400">
                  {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.volume10)}
                </div>
                <div className="text-sm text-white/70">{calc.volumeUnitLabel}</div>
              </div>
            </div>

            {/* Cubic yards */}
            <div className={`${stepClass} rounded-sm border border-slate-700 bg-slate-900 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <div className="text-xs uppercase text-white/70">Required</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.yards)} yd³
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">+5%</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.yards5)} yd³
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">+10%</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(calc.yards10)} yd³
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
