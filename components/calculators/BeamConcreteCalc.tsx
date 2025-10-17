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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

/* ---------------------------------------------
   Types & Units (unchanged logic)
--------------------------------------------- */

type LinearUnit =
  | "meters"
  | "centimeter"
  | "millimeter"
  | "yards"
  | "feet"
  | "inches";

const linearUnitToMeters: Record<LinearUnit, number> = {
  meters: 1,
  centimeter: 0.01,
  millimeter: 0.001,
  yards: 0.9144,
  feet: 0.3048,
  inches: 0.0254,
};

function toMeters(value: number, unit: LinearUnit) {
  return value * linearUnitToMeters[unit];
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

const unitAbbrev: Record<LinearUnit, string> = {
  meters: "m",
  centimeter: "cm",
  millimeter: "mm",
  yards: "yd",
  feet: "ft",
  inches: "in",
};

/* ---------------------------------------------
   Component (logic preserved; UX + mobile polish)
--------------------------------------------- */

export default function BeamConcreteCalc() {
  // Form state (same fields)
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [qty, setQty] = useState<string>("");

  const [unit, setUnit] = useState<LinearUnit>("meters");
  const [wastePct, setWastePct] = useState<string>("5");
  const [useDryFactor, setUseDryFactor] = useState<boolean>(true);
  const [dryFactor, setDryFactor] = useState<string>("1.5");

  // Optional void (duct)
  const [hasVoid, setHasVoid] = useState<boolean>(false);
  const [voidWidth, setVoidWidth] = useState<string>("");
  const [voidDepth, setVoidDepth] = useState<string>("");
  const [voidLength, setVoidLength] = useState<string>("");

  // UX: gate results until Calculate
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Parse & sanitize numeric inputs (unchanged approach)
  const L_num = useMemo(() => Math.max(0, parseFloat(length) || 0), [length]);
  const b_num = useMemo(() => Math.max(0, parseFloat(width) || 0), [width]);
  const d_num = useMemo(() => Math.max(0, parseFloat(depth) || 0), [depth]);
  const qty_num = useMemo(
    () => Math.max(0, Math.floor(Number(qty) || 0)),
    [qty]
  );

  const waste_num = useMemo(
    () => clamp(parseFloat(wastePct) || 0, 0, 50),
    [wastePct]
  );
  const dry_num = useMemo(
    () => clamp(parseFloat(dryFactor) || 1, 1, 2.5),
    [dryFactor]
  );

  const vW_num = useMemo(
    () => Math.max(0, parseFloat(voidWidth) || 0),
    [voidWidth]
  );
  const vD_num = useMemo(
    () => Math.max(0, parseFloat(voidDepth) || 0),
    [voidDepth]
  );
  const vL_num = useMemo(
    () => Math.max(0, parseFloat(voidLength) || 0),
    [voidLength]
  );

  // Convert to meters
  const L_m = toMeters(L_num, unit);
  const b_m = toMeters(b_num, unit);
  const d_m = toMeters(d_num, unit);
  const vW_m = toMeters(vW_num, unit);
  const vD_m = toMeters(vD_num, unit);
  const vL_m = toMeters(vL_num, unit);

  // Volumes (unchanged math)
  const wetVolumePerBeam_m3 = useMemo(() => {
    const gross = L_m * b_m * d_m;
    const voidVol = hasVoid ? vL_m * vW_m * vD_m : 0;
    return Math.max(0, gross - voidVol);
  }, [L_m, b_m, d_m, hasVoid, vL_m, vW_m, vD_m]);

  const wetWithWaste_m3 = useMemo(
    () => wetVolumePerBeam_m3 * (1 + waste_num / 100),
    [wetVolumePerBeam_m3, waste_num]
  );

  const dryPerBeam_m3 = useMemo(
    () => (useDryFactor ? wetWithWaste_m3 * dry_num : wetWithWaste_m3),
    [useDryFactor, wetWithWaste_m3, dry_num]
  );

  // Totals
  const multiplier = Math.max(1, qty_num || 0);
  const totalWet_m3 = wetVolumePerBeam_m3 * multiplier;
  const totalWetWaste_m3 = wetWithWaste_m3 * multiplier;
  const totalDry_m3 = dryPerBeam_m3 * multiplier;

  // Conversions (display only)
  const m3_to_ft3 = 35.3146667;
  const m3_to_yd3 = 1.30795062;

  function fmt(n: number, decimals = 3) {
    if (!isFinite(n)) return "0";
    return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }

  // Invalid state
  const invalidDims =
    L_num === 0 ||
    b_num === 0 ||
    d_num === 0 ||
    qty_num === 0 ||
    (hasVoid && (vW_num === 0 || vD_num === 0 || vL_num === 0));

  /* ----------------------- Actions ----------------------- */
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setLength("");
    setWidth("");
    setDepth("");
    setQty("");
    setUnit("meters");
    setWastePct("5");
    setUseDryFactor(true);
    setDryFactor("1.5");
    setHasVoid(false);
    setVoidWidth("");
    setVoidDepth("");
    setVoidLength("");
    setSubmitted(false);
  };

  /* ----------------------- Styles ----------------------- */
  const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
  const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
  const selectContentClass =
    "rounded-sm border border-slate-700 bg-slate-900 text-white";
  const stepClass = "pt-6 mt-4 border-t border-slate-800"; // clear separation between steps

  /* ----------------------- UI ----------------------- */
  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center">
          Beam Concrete Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center sm:text-left">
          Enter dimensions in your chosen unit. The calculator multiplies <span className="font-medium text-white">V = L × b × d</span> and can subtract a uniform void/duct, apply waste, and (optionally) a dry-volume factor.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Keep all inputs in the <span className="text-white font-medium">same unit</span>. Toggle the void only if the beam has a continuous duct/void.
          </p>
        </div>

        {/* STEP 1: Units */}
        <section aria-labelledby="step-units" className={stepClass}>
          <h3 id="step-units" className="text-sm font-semibold text-white/80">Step 1 — Choose Units</h3>
          <div className="mt-2 max-w-md">
            <Label className="text-teal-500">Units</Label>
            <Select
              value={unit}
              onValueChange={(v) => {
                setUnit(v as LinearUnit);
                setSubmitted(false);
              }}
            >
              <SelectTrigger className={selectTriggerClass} aria-label="Select length units">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="meters" className="text-white">Meters (m)</SelectItem>
                <SelectItem value="centimeter" className="text-white">Centimeters (cm)</SelectItem>
                <SelectItem value="millimeter" className="text-white">Millimeters (mm)</SelectItem>
                <SelectItem value="yards" className="text-white">Yards (yd)</SelectItem>
                <SelectItem value="feet" className="text-white">Feet (ft)</SelectItem>
                <SelectItem value="inches" className="text-white">Inches (in)</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-white/60">All dimensions below will be interpreted in <span className="text-white">{unit}</span>.</p>
          </div>
        </section>

        {/* STEP 2: Beam Dimensions */}
        <section aria-labelledby="step-dimensions" className={stepClass}>
          <h3 id="step-dimensions" className="text-sm font-semibold text-white/80">Step 2 — Beam Dimensions</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-teal-500">Length (L)</Label>
              <div className="relative">
                <Input
                  inputMode="decimal"
                  value={length}
                  onChange={(e) => { setLength(e.target.value); setSubmitted(false); }}
                  placeholder={unit === "feet" ? "e.g., 20" : "e.g., 6"}
                  className={fieldInputClass}
                  aria-label="Beam length"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{unitAbbrev[unit]}</span>
              </div>
              <p className="text-xs text-slate-300">Hint: overall beam span. Example: 6 {unitAbbrev[unit]} (≈ 20 ft).</p>
              <p className="text-[11px] text-white/60">Typical small residential beams range 3–8 {unitAbbrev[unit]} long.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-teal-500">Width / Breadth (b)</Label>
              <div className="relative">
                <Input
                  inputMode="decimal"
                  value={width}
                  onChange={(e) => { setWidth(e.target.value); setSubmitted(false); }}
                  placeholder={unit === "feet" ? "e.g., 1" : "e.g., 0.3"}
                  className={fieldInputClass}
                  aria-label="Beam width"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{unitAbbrev[unit]}</span>
              </div>
              <p className="text-xs text-slate-300">Hint: beam thickness in the horizontal direction.</p>
              <p className="text-[11px] text-white/60">Typical width ≈ 0.23–0.30 {unitAbbrev[unit]} (9–12 in).</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-teal-500">Depth / Height (d)</Label>
              <div className="relative">
                <Input
                  inputMode="decimal"
                  value={depth}
                  onChange={(e) => { setDepth(e.target.value); setSubmitted(false); }}
                  placeholder={unit === "feet" ? "e.g., 1.5" : "e.g., 0.5"}
                  className={fieldInputClass}
                  aria-label="Beam depth"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{unitAbbrev[unit]}</span>
              </div>
              <p className="text-xs text-slate-300">Hint: vertical overall depth of the beam section.</p>
              <p className="text-[11px] text-white/60">Typical depth ≈ 0.38–0.60 {unitAbbrev[unit]} (15–24 in).</p>
            </div>
          </div>
        </section>

        {/* STEP 3: Quantity & Waste */}
        <section aria-labelledby="step-qty" className={stepClass}>
          <h3 id="step-qty" className="text-sm font-semibold text-white/80">Step 3 — Quantity & Allowance</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-teal-500">Number of Beams</Label>
              <div className="relative">
                <Input
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => { setQty(e.target.value); setSubmitted(false); }}
                  placeholder="e.g., 2"
                  className={cn(fieldInputClass, "pr-4")}
                  aria-label="Number of beams"
                />
              </div>
              <p className="text-xs text-slate-300">Hint: identical beams with the same dimensions.</p>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label className="text-teal-500">Waste Allowance (%)</Label>
              <div className="relative max-w-xs">
                <Input
                  inputMode="decimal"
                  value={wastePct}
                  onChange={(e) => { setWastePct(e.target.value); setSubmitted(false); }}
                  placeholder="Typical 5"
                  className={cn(fieldInputClass, "pr-10")}
                  aria-label="Waste percentage"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">%</span>
              </div>
              <p className="text-xs text-slate-300">Hint: extra concrete to cover spillage, uneven formwork, over-excavation, etc.</p>
            </div>
          </div>
        </section>

        {/* STEP 4: Optional Void / Duct */}
        <section aria-labelledby="step-void" className={stepClass}>
          <h3 id="step-void" className="text-sm font-semibold text-white/80">Step 4 — Optional Void / Duct</h3>
          <div className="mt-2 rounded-sm border border-slate-700 bg-slate-900 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <Label className="text-teal-500 font-medium">Subtract a void (optional)</Label>
                <p className="text-xs text-white/70">If enabled, enter all three void dimensions in {unit}.</p>
              </div>
              <Switch checked={hasVoid} onCheckedChange={(v) => { setHasVoid(v); setSubmitted(false); }} aria-label="Toggle void subtraction" />
            </div>

            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity",
                hasVoid ? "opacity-100" : "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex flex-col gap-2">
                <Label className="text-teal-500">Void Width</Label>
                <div className="relative">
                  <Input
                    inputMode="decimal"
                    value={voidWidth}
                    onChange={(e) => { setVoidWidth(e.target.value); setSubmitted(false); }}
                    placeholder="0"
                    className={fieldInputClass}
                    aria-label="Void width"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{unitAbbrev[unit]}</span>
                </div>
                <p className="text-[11px] text-white/60">Leave off if there is no continuous void.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-teal-500">Void Depth</Label>
                <div className="relative">
                  <Input
                    inputMode="decimal"
                    value={voidDepth}
                    onChange={(e) => { setVoidDepth(e.target.value); setSubmitted(false); }}
                    placeholder="0"
                    className={fieldInputClass}
                    aria-label="Void depth"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{unitAbbrev[unit]}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-teal-500">Void Length</Label>
                <div className="relative">
                  <Input
                    inputMode="decimal"
                    value={voidLength}
                    onChange={(e) => { setVoidLength(e.target.value); setSubmitted(false); }}
                    placeholder="0"
                    className={fieldInputClass}
                    aria-label="Void length"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{unitAbbrev[unit]}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 5: Dry volume factor */}
        <section aria-labelledby="step-dry" className={stepClass}>
          <h3 id="step-dry" className="text-sm font-semibold text-white/80">Step 5 — Dry Volume Factor (optional)</h3>
          <div className="mt-2 rounded-sm border border-slate-700 bg-slate-900 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 items-center">
              <div className="flex items-center gap-2">
                <Switch
                  checked={useDryFactor}
                  onCheckedChange={(v) => { setUseDryFactor(v); setSubmitted(false); }}
                  aria-label="Toggle dry volume factor"
                />
                <Label className="text-teal-500">Use Dry Volume Factor</Label>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative max-w-xs">
                  <Input
                    inputMode="decimal"
                    value={dryFactor}
                    onChange={(e) => { setDryFactor(e.target.value); setSubmitted(false); }}
                    disabled={!useDryFactor}
                    className={cn(fieldInputClass, !useDryFactor && "opacity-60")}
                    aria-label="Dry volume factor value"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">×</span>
                </div>
                <span className="text-xs text-white/70">Typical ~1.50–1.54</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className={cn(stepClass, "flex flex-col sm:flex-row gap-2 border-none pt-4 mt-4")}
        >
          <Button
            type="submit"
            onClick={handleCalculate}
            className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0"
          >
            Calculate
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
          >
            Reset
          </Button>
        </div>

        {/* Results (hidden until Calculate) */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">
            Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
          </p>
        ) : invalidDims ? (
          <p className="mt-4 text-sm text-red-300">
            Please enter valid non-zero dimensions and quantity. If void is enabled, provide all three void dimensions.
          </p>
        ) : (
          <>
            {/* Inputs Summary */}
            <div className={cn(stepClass, "rounded-sm bg-slate-900 border border-slate-700 p-4")}
            >
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                  <span className="text-white/70">Units</span>
                  <span className="text-teal-400 font-semibold">{unit} ({unitAbbrev[unit]})</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                  <span className="text-white/70">Length (L)</span>
                  <span className="text-teal-400 font-semibold">{L_num || 0} {unitAbbrev[unit]}</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                  <span className="text-white/70">Width (b)</span>
                  <span className="text-teal-400 font-semibold">{b_num || 0} {unitAbbrev[unit as LinearUnit] ?? unitAbbrev[unit]}</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                  <span className="text-white/70">Depth (d)</span>
                  <span className="text-teal-400 font-semibold">{d_num || 0} {unitAbbrev[unit]}</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                  <span className="text-white/70">Beams</span>
                  <span className="text-teal-400 font-semibold">{qty_num || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                  <span className="text-white/70">Waste</span>
                  <span className="text-teal-400 font-semibold">{waste_num}%</span>
                </div>
                {hasVoid && (
                  <>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                      <span className="text-white/70">Void W × D × L</span>
                      <span className="text-teal-400 font-semibold">{vW_num} × {vD_num} × {vL_num} {unitAbbrev[unit]}</span>
                    </div>
                  </>
                )}
                {useDryFactor && (
                  <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
                    <span className="text-white/70">Dry factor</span>
                    <span className="text-teal-400 font-semibold">× {dry_num}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Result tiles */}
            <div className={cn(stepClass, "grid grid-cols-1 lg:grid-cols-3 gap-4 border-none")}
            >
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Per-Beam Volume</p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Wet (net)</span>
                    <span className="text-teal-400 font-semibold">{fmt(wetVolumePerBeam_m3)} m³</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Wet + waste</span>
                    <span className="text-teal-400 font-semibold">{fmt(wetWithWaste_m3)} m³</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{useDryFactor ? "Dry (est.)" : "Dry (off)"}</span>
                    <span className="text-teal-400 font-semibold">{fmt(dryPerBeam_m3)} m³</span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Totals (× {multiplier})</p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Total wet (net)</span>
                    <span className="text-teal-400 font-semibold">{fmt(totalWet_m3)} m³</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Total wet + waste</span>
                    <span className="text-teal-400 font-semibold">{fmt(totalWetWaste_m3)} m³</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{useDryFactor ? "Total dry (est.)" : "Total dry (off)"}</span>
                    <span className="text-teal-400 font-semibold">{fmt(totalDry_m3)} m³</span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Quick Conversions</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Wet (ft³)</span>
                    <span className="text-teal-400 font-semibold">{fmt(totalWet_m3 * m3_to_ft3)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Wet (yd³)</span>
                    <span className="text-teal-400 font-semibold">{fmt(totalWet_m3 * m3_to_yd3)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cubic Yards helper */}
            <div className={cn(stepClass, "rounded-sm border border-slate-700 bg-slate-900 p-4")}
            >
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (with waste)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {fmt(totalWetWaste_m3 * m3_to_yd3, 3)} yd³
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {fmt(totalWetWaste_m3 * m3_to_yd3 * 1.05, 3)} yd³
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {fmt(totalWetWaste_m3 * m3_to_yd3 * 1.1, 3)} yd³
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