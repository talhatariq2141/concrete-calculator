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

/* =====================================================================================
   Types & Constants  (logic UNCHANGED)
===================================================================================== */

type LinearUnit = "m" | "ft";
type ThickUnit = "m" | "cm" | "in";
type VolumeUnit = "m3" | "ft3" | "yd3";

type Opening = {
  id: string;
  width: number | "";
  height: number | "";
  count: number | "";
};

type Mix = "1:1.5:3" | "1:2:4" | "1:3:6";

const MIX_PARTS: Record<Mix, { c: number; s: number; a: number; total: number }> =
  {
    "1:1.5:3": { c: 1, s: 1.5, a: 3, total: 5.5 },
    "1:2:4": { c: 1, s: 2, a: 4, total: 7 },
    "1:3:6": { c: 1, s: 3, a: 6, total: 10 },
  };

// Physics / industry constants (unchanged)
const DENSITY_CONCRETE_KG_M3 = 2400;
const BULK_DENSITY_CEMENT_KG_M3 = 1440;
const CEMENT_BAG_KG = 50;
const DRY_LOSS_FACTOR = 1.54;
const M3_TO_FT3 = 35.3146667;
const M3_TO_YD3 = 1.30795062;
const IN_TO_M = 0.0254;
const FT_TO_M = 0.3048;
const CM_TO_M = 0.01;

/* =====================================================================================
   Helpers (UNCHANGED MATH)
===================================================================================== */

function toMeters(value: number, unit: LinearUnit | ThickUnit): number {
  if (unit === "m") return value;
  if (unit === "ft") return value * FT_TO_M;
  if (unit === "cm") return value * CM_TO_M;
  if (unit === "in") return value * IN_TO_M;
  return value;
}

function format(num: number, digits = 3): string {
  if (!isFinite(num)) return "—";
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ============================== UI tokens (styles only) ============================== */

const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass =
  "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev = {
  m: "m",
  ft: "ft",
  cm: "cm",
  in: "in",
} as const;

/* =====================================================================================
   Component
===================================================================================== */

export default function WallConcreteCalc() {
  // ---------------- Units ----------------
  const [lenUnit, setLenUnit] = React.useState<LinearUnit>("m");
  const [thickUnit, setThickUnit] = React.useState<ThickUnit>("cm");
  const [outVolUnit, setOutVolUnit] = React.useState<VolumeUnit>("m3");

  // ---------------- Wall inputs ----------------
  const [length, setLength] = React.useState<number | "">("");
  const [height, setHeight] = React.useState<number | "">("");
  const [thickness, setThickness] = React.useState<number | "">("");

  // ---------------- Openings ----------------
  const [openings, setOpenings] = React.useState<Opening[]>([
    { id: uid(), width: "", height: "", count: "" },
  ]);

  // ---------------- Mix & water ----------------
  const [mix, setMix] = React.useState<Mix>("1:2:4");
  const [wcr, setWcr] = React.useState<number>(0.5);

  // ---------------- Costs (optional) ----------------
  const [costMode, setCostMode] = React.useState<"perM3" | "byMaterials">("perM3");
  const [ratePerM3, setRatePerM3] = React.useState<number | "">("");
  const [cementBagPrice, setCementBagPrice] = React.useState<number | "">("");
  const [sandPricePerM3, setSandPricePerM3] = React.useState<number | "">("");
  const [aggPricePerM3, setAggPricePerM3] = React.useState<number | "">("");

  // ---------------- Derived volumes (UNCHANGED) ----------------
  const wallVolumeM3 = React.useMemo(() => {
    const L = typeof length === "number" ? toMeters(length, lenUnit) : 0;
    const H = typeof height === "number" ? toMeters(height, lenUnit) : 0;
    const T =
      typeof thickness === "number" ? toMeters(thickness, thickUnit) : 0;
    if (L <= 0 || H <= 0 || T <= 0) return 0;
    return L * H * T;
  }, [length, height, thickness, lenUnit, thickUnit]);

  const openingsVolumeM3 = React.useMemo(() => {
    return openings.reduce((sum, o) => {
      const w = typeof o.width === "number" ? toMeters(o.width, lenUnit) : 0;
      const h = typeof o.height === "number" ? toMeters(o.height, lenUnit) : 0;
      const c = typeof o.count === "number" ? o.count : 0;
      const T =
        typeof thickness === "number" ? toMeters(thickness, thickUnit) : 0;
      if (w > 0 && h > 0 && c > 0 && T > 0) {
        sum += w * h * T * c;
      }
      return sum;
    }, 0);
  }, [openings, lenUnit, thickness, thickUnit]);

  const netVolumeM3 = Math.max(0, wallVolumeM3 - openingsVolumeM3);

  const volumeOut = React.useMemo(() => {
    if (outVolUnit === "m3") return netVolumeM3;
    if (outVolUnit === "ft3") return netVolumeM3 * M3_TO_FT3;
    return netVolumeM3 * M3_TO_YD3;
  }, [netVolumeM3, outVolUnit]);

  // ---------------- Materials from mix (UNCHANGED) ----------------
  const parts = MIX_PARTS[mix];
  const dryVol = netVolumeM3 * DRY_LOSS_FACTOR;

  const cementVol = (parts.c / parts.total) * dryVol; // m3
  const cementKg = cementVol * BULK_DENSITY_CEMENT_KG_M3;
  const cementBags = cementKg / CEMENT_BAG_KG;

  const sandVolM3 = (parts.s / parts.total) * dryVol;
  const aggVolM3 = (parts.a / parts.total) * dryVol;

  const waterKg = cementKg * wcr;
  const waterLiters = waterKg;

  // ---------------- Costing (UNCHANGED) ----------------
  const totalCost = React.useMemo(() => {
    if (costMode === "perM3") {
      const rate = typeof ratePerM3 === "number" ? ratePerM3 : 0;
      return netVolumeM3 * rate;
    } else {
      const bagPrice = typeof cementBagPrice === "number" ? cementBagPrice : 0;
      const sandP = typeof sandPricePerM3 === "number" ? sandPricePerM3 : 0;
      const aggP = typeof aggPricePerM3 === "number" ? aggPricePerM3 : 0;
      return cementBags * bagPrice + sandVolM3 * sandP + aggVolM3 * aggP;
    }
  }, [
    costMode,
    ratePerM3,
    netVolumeM3,
    cementBags,
    cementBagPrice,
    sandVolM3,
    sandPricePerM3,
    aggVolM3,
    aggPricePerM3,
  ]);

  // ---------------- UI/UX gating ----------------
  const [submitted, setSubmitted] = React.useState(false);

  // ---------------- Actions (UNCHANGED) ----------------
  function addOpening() {
    setOpenings((prev) => [
      ...prev,
      { id: uid(), width: "", height: "", count: "" },
    ]);
    setSubmitted(false);
  }
  function removeOpening(id: string) {
    setOpenings((prev) => prev.filter((o) => o.id !== id));
    setSubmitted(false);
  }
  function resetAll() {
    setLenUnit("m");
    setThickUnit("cm");
    setOutVolUnit("m3");
    setLength("");
    setHeight("");
    setThickness("");
    setOpenings([{ id: uid(), width: "", height: "", count: "" }]);
    setMix("1:2:4");
    setWcr(0.5);
    setCostMode("perM3");
    setRatePerM3("");
    setCementBagPrice("");
    setSandPricePerM3("");
    setAggPricePerM3("");
    setSubmitted(false);
  }
  function handleCalculate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitted(true);
  }

  // ======================= Small UI helpers (presentation only) =======================

  const NumberInput = ({
    id,
    value,
    onChange,
    placeholder,
    badge,
    ariaLabel,
  }: {
    id?: string;
    value: number | string;
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
        {subHint ? (
          <p className="text-[11px] text-white/60">{subHint}</p>
        ) : null}
      </div>
    );
  }

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-teal-400 text-center">
          Wall Concrete Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate concrete for straight walls with optional door/window openings.
          Results appear after you press <span className="font-semibold text-white">Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <form onSubmit={handleCalculate} className="space-y-0">
          {/* STEP 1 — Choose Units */}
          <section className={stepClass} aria-labelledby="step1">
            <h3 id="step1" className="text-sm font-semibold text-white/80">
              Step 1 — Choose Units
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field id="lenUnit" label="Length/Height Unit" hint="Used for length and height fields.">
                <Select
                  value={lenUnit}
                  onValueChange={(v) => {
                    setLenUnit(v as LinearUnit);
                    setSubmitted(false);
                  }}
                >
                  <SelectTrigger className={selectTriggerClass} aria-label="Length unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="m" className="text-white">meters (m)</SelectItem>
                    <SelectItem value="ft" className="text-white">feet (ft)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-white/60">Badges show {unitAbbrev[lenUnit]} inside inputs.</p>
              </Field>

              <Field id="thickUnit" label="Thickness Unit" hint="Used for wall thickness and opening depth.">
                <Select
                  value={thickUnit}
                  onValueChange={(v) => {
                    setThickUnit(v as ThickUnit);
                    setSubmitted(false);
                  }}
                >
                  <SelectTrigger className={selectTriggerClass} aria-label="Thickness unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="cm" className="text-white">centimeters (cm)</SelectItem>
                    <SelectItem value="m" className="text-white">meters (m)</SelectItem>
                    <SelectItem value="in" className="text-white">inches (in)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field id="outVolUnit" label="Output Volume Unit" hint="How results will be displayed.">
                <Select
                  value={outVolUnit}
                  onValueChange={(v) => {
                    setOutVolUnit(v as VolumeUnit);
                    setSubmitted(false);
                  }}
                >
                  <SelectTrigger className={selectTriggerClass} aria-label="Output unit">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="m3" className="text-white">m³</SelectItem>
                    <SelectItem value="ft3" className="text-white">ft³</SelectItem>
                    <SelectItem value="yd3" className="text-white">yd³</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          {/* STEP 2 — Core Dimensions */}
          <section className={stepClass} aria-labelledby="step2">
            <h3 id="step2" className="text-sm font-semibold text-white/80">
              Step 2 — Core Dimensions
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field id="length" label="Length (L)" hint="Total wall length." subHint={`Typical 2–60 ${unitAbbrev[lenUnit]}`}>
                <NumberInput
                  id="length"
                  value={length}
                  onChange={(v) => {
                    setLength(v === "" ? "" : Number(v));
                    setSubmitted(false);
                  }}
                  placeholder={lenUnit === "ft" ? "e.g., 40" : "e.g., 12"}
                  badge={unitAbbrev[lenUnit]}
                  ariaLabel="Wall length"
                />
              </Field>
              <Field id="height" label="Height (H)" hint="Clear wall height." subHint={`Typical 1–6 ${unitAbbrev[lenUnit]}`}>
                <NumberInput
                  id="height"
                  value={height}
                  onChange={(v) => {
                    setHeight(v === "" ? "" : Number(v));
                    setSubmitted(false);
                  }}
                  placeholder={lenUnit === "ft" ? "e.g., 10" : "e.g., 3"}
                  badge={unitAbbrev[lenUnit]}
                  ariaLabel="Wall height"
                />
              </Field>
              <Field id="thickness" label="Thickness (T)" hint="Wall width / thickness." subHint={thickUnit === "cm" ? "Typical 15–30 cm" : thickUnit === "in" ? "Typical 6–12 in" : "Typical 0.15–0.30 m"}>
                <NumberInput
                  id="thickness"
                  value={thickness}
                  onChange={(v) => {
                    setThickness(v === "" ? "" : Number(v));
                    setSubmitted(false);
                  }}
                  placeholder={thickUnit === "in" ? "e.g., 8" : thickUnit === "cm" ? "e.g., 20" : "e.g., 0.2"}
                  badge={unitAbbrev[thickUnit]}
                  ariaLabel="Wall thickness"
                />
              </Field>
            </div>
          </section>

          {/* STEP 3 — Openings */}
          <section className={stepClass} aria-labelledby="step3">
            <h3 id="step3" className="text-sm font-semibold text-white/80">
              Step 3 — Openings (optional)
            </h3>

            <div className="mt-2 rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">Doors, Windows, Vents</h4>
                <Button
                  type="button"
                  onClick={addOpening}
                  className="h-11 rounded-sm bg-teal-400 text-slate-900 hover:bg-teal-300"
                >
                  Add Opening
                </Button>
              </div>

              <div className="grid gap-3">
                {openings.map((o, idx) => (
                  <div
                    key={o.id}
                    className={cn("grid gap-2 items-end", "sm:grid-cols-[1fr,1fr,1fr,auto]")}
                  >
                    <Field label={`Width`} hint="Opening width.">
                      <NumberInput
                        value={o.width}
                        onChange={(v) =>
                          setOpenings((prev) =>
                            prev.map((x) =>
                              x.id === o.id ? { ...x, width: v === "" ? "" : Number(v) } : x
                            )
                          )
                        }
                        placeholder={lenUnit === "ft" ? "e.g., 3" : "e.g., 1"}
                        badge={unitAbbrev[lenUnit]}
                        ariaLabel="Opening width"
                      />
                    </Field>
                    <Field label={`Height`} hint="Opening height.">
                      <NumberInput
                        value={o.height}
                        onChange={(v) =>
                          setOpenings((prev) =>
                            prev.map((x) =>
                              x.id === o.id ? { ...x, height: v === "" ? "" : Number(v) } : x
                            )
                          )
                        }
                        placeholder={lenUnit === "ft" ? "e.g., 7" : "e.g., 2.1"}
                        badge={unitAbbrev[lenUnit]}
                        ariaLabel="Opening height"
                      />
                    </Field>
                    <Field label="Count" hint="How many identical openings." subHint="Typical 1–6">
                      <NumberInput
                        value={o.count}
                        onChange={(v) =>
                          setOpenings((prev) =>
                            prev.map((x) =>
                              x.id === o.id ? { ...x, count: v === "" ? "" : Number(v) } : x
                            )
                          )
                        }
                        placeholder="e.g., 2"
                        badge="×"
                        ariaLabel="Opening count"
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
                    {idx < openings.length - 1 && (
                      <div className="sm:col-span-4 border-b border-slate-700 my-1" />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-white/70">
                Each opening volume = width × height × wall thickness × count.
              </p>
            </div>
          </section>

          {/* STEP 4 — Mix & Water-Cement */}
          <section className={stepClass} aria-labelledby="step4">
            <h3 id="step4" className="text-sm font-semibold text-white/80">
              Step 4 — Mix & Water–Cement
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field id="mix" label="Nominal Mix" hint="Cement : Sand : Aggregate (by volume).">
                <Select
                  value={mix}
                  onValueChange={(v) => {
                    setMix(v as Mix);
                    setSubmitted(false);
                  }}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Mix" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="1:1.5:3" className="text-white">
                      1:1.5:3 (M20 approx)
                    </SelectItem>
                    <SelectItem value="1:2:4" className="text-white">
                      1:2:4 (M15 approx)
                    </SelectItem>
                    <SelectItem value="1:3:6" className="text-white">
                      1:3:6 (M10 approx)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field
                id="wcr"
                label="Water–Cement Ratio"
                hint="Ratio by weight (≈ liters per kg of cement)."
                subHint="Typical 0.45–0.60"
              >
                <NumberInput
                  id="wcr"
                  value={String(wcr)}
                  onChange={(v) => {
                    setWcr(v === "" ? 0 : Number(v));
                    setSubmitted(false);
                  }}
                  placeholder="0.5"
                  badge="w/c"
                  ariaLabel="Water to cement ratio"
                />
              </Field>

              <div />
            </div>
          </section>

          {/* STEP 5 — Cost Estimation (optional) */}
          <section className={stepClass} aria-labelledby="step5">
            <h3 id="step5" className="text-sm font-semibold text-white/80">
              Step 5 — Cost Estimation (optional)
            </h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="Mode" hint="Choose rate per m³ or itemized materials.">
                <Select
                  value={costMode}
                  onValueChange={(v) => {
                    setCostMode(v as typeof costMode);
                    setSubmitted(false);
                  }}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="perM3" className="text-white">Rate per m³</SelectItem>
                    <SelectItem value="byMaterials" className="text-white">By Materials</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {costMode === "perM3" ? (
                <>
                  <Field label="Concrete Rate (per m³)">
                    <NumberInput
                      value={ratePerM3}
                      onChange={(v) => setRatePerM3(v === "" ? "" : Number(v))}
                      placeholder="e.g., 120"
                      badge="/m³"
                      ariaLabel="Concrete rate per cubic meter"
                    />
                  </Field>
                  <div />
                </>
              ) : (
                <>
                  <Field label="Cement (per bag)">
                    <NumberInput
                      value={cementBagPrice}
                      onChange={(v) => setCementBagPrice(v === "" ? "" : Number(v))}
                      placeholder="e.g., 8"
                      ariaLabel="Cement bag price"
                    />
                  </Field>
                  <Field label="Sand (per m³)">
                    <NumberInput
                      value={sandPricePerM3}
                      onChange={(v) => setSandPricePerM3(v === "" ? "" : Number(v))}
                      placeholder="e.g., 20"
                      badge="/m³"
                      ariaLabel="Sand price per cubic meter"
                    />
                  </Field>
                  <Field label="Aggregate (per m³)">
                    <NumberInput
                      value={aggPricePerM3}
                      onChange={(v) => setAggPricePerM3(v === "" ? "" : Number(v))}
                      placeholder="e.g., 18"
                      badge="/m³"
                      ariaLabel="Aggregate price per cubic meter"
                    />
                  </Field>
                </>
              )}
            </div>
          </section>

          {/* Actions */}
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

        {/* Results */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">
            Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
          </p>
        ) : (
          <>
            {/* Inputs Summary (only after Calculate) */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <KV k="Length" v={`${length || 0} ${unitAbbrev[lenUnit]}`} />
                <KV k="Height" v={`${height || 0} ${unitAbbrev[lenUnit]}`} />
                <KV k="Thickness" v={`${thickness || 0} ${unitAbbrev[thickUnit]}`} />
                <KV k="Openings" v={`${openings.filter(o => o.width || o.height || o.count).length || 0}`} />
                <KV k="Mix" v={mix} />
                <KV k="w/c" v={`${wcr}`} />
                <KV k="Output Unit" v={outVolUnit} />
                <KV k="Cost Mode" v={costMode === "perM3" ? "Rate per m³" : "By Materials"} />
              </div>
            </div>

            {/* Result tiles */}
            <div className={`${stepClass} grid grid-cols-1 md:grid-cols-3 gap-4 border-none`}>
              <Stat label="Gross Wall Volume (m³)" value={format(wallVolumeM3)} />
              <Stat label="Openings Volume (m³)" value={format(openingsVolumeM3)} />
              <Stat label={`Net Concrete Volume (${outVolUnit})`} value={format(volumeOut)} highlight />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Stat label="Dry Volume for Mix (m³)" value={format(dryVol)} />
              <Stat label="Cement (bags)" value={format(cementBags, 2)} />
              <Stat label="Water (liters)" value={format(waterLiters, 0)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Stat label="Sand (m³)" value={format(sandVolM3, 3)} />
              <Stat label="Aggregate (m³)" value={format(aggVolM3, 3)} />
            </div>

            {/* Cubic Yards helper */}
            <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (net)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {format(netVolumeM3 * M3_TO_YD3, 3)} yd³
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {format(netVolumeM3 * M3_TO_YD3 * 1.05, 3)} yd³
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">
                    {format(netVolumeM3 * M3_TO_YD3 * 1.1, 3)} yd³
                  </div>
                </div>
              </div>
            </div>

            {/* Costing */}
            <div className="rounded-sm border border-slate-700 bg-slate-900 p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">Cost Estimation (Optional)</h3>
                <div className="flex gap-2 items-center">
                  <Label className="text-teal-500">Mode</Label>
                  <Select
                    value={costMode}
                    onValueChange={(v) => {
                      setCostMode(v as typeof costMode);
                      setSubmitted(false);
                    }}
                  >
                    <SelectTrigger className={cn(selectTriggerClass, "w-44")}>
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="perM3" className="text-white">Rate per m³</SelectItem>
                      <SelectItem value="byMaterials" className="text-white">By Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {costMode === "perM3" ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Concrete Rate (per m³)">
                    <NumberInput
                      value={ratePerM3}
                      onChange={(v) => setRatePerM3(v === "" ? "" : Number(v))}
                      placeholder="e.g., 120"
                      badge="/m³"
                      ariaLabel="Concrete rate per cubic meter"
                    />
                  </Field>
                  <Field label="Total Cost">
                    <div className="rounded-sm border border-slate-700 bg-teal-400 px-3 py-2 font-semibold text-slate-900">
                      {format(totalCost, 2)}
                    </div>
                  </Field>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-4">
                  <Field label="Cement (per bag)">
                    <NumberInput
                      value={cementBagPrice}
                      onChange={(v) => setCementBagPrice(v === "" ? "" : Number(v))}
                      placeholder="e.g., 8"
                      ariaLabel="Cement bag price"
                    />
                  </Field>
                  <Field label="Sand (per m³)">
                    <NumberInput
                      value={sandPricePerM3}
                      onChange={(v) => setSandPricePerM3(v === "" ? "" : Number(v))}
                      placeholder="e.g., 20"
                      badge="/m³"
                      ariaLabel="Sand price per cubic meter"
                    />
                  </Field>
                  <Field label="Aggregate (per m³)">
                    <NumberInput
                      value={aggPricePerM3}
                      onChange={(v) => setAggPricePerM3(v === "" ? "" : Number(v))}
                      placeholder="e.g., 18"
                      badge="/m³"
                      ariaLabel="Aggregate price per cubic meter"
                    />
                  </Field>
                  <Field label="Total Cost">
                    <div className="rounded-sm border border-slate-700 bg-teal-400 px-3 py-2 font-semibold text-slate-900">
                      {format(totalCost, 2)}
                    </div>
                  </Field>
                </div>
              )}
              <p className="text-xs text-white/70">
                Note: Costs exclude labor/formwork/rebar unless you add them to the rate.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* =====================================================================================
   Small presentation component (UI only)
===================================================================================== */

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-slate-700 p-4 bg-slate-900",
        highlight && "ring-0"
      )}
    >
      <div className={cn("text-xs", highlight ? "text-white/80" : "text-white/70")}>
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-2xl font-semibold tracking-tight",
          highlight ? "text-teal-400" : "text-teal-400"
        )}
      >
        {value}
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2 text-sm">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}
