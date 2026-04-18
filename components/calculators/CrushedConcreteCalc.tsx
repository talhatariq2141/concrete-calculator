"use client";

import * as React from "react";
import { useMemo, useState } from "react";
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
import { toFeet, cubicFtToYd, cubicFtToM3 } from "@/lib/calc-engine";
import { GRAVEL_DENSITIES } from "@/lib/material-data";

/* ===================== Types ===================== */
type LinearUnit = "in" | "ft" | "yd" | "cm" | "m";
type ProjectShape = "rectangle" | "circle" | "triangle" | "trapezoid" | "custom_area" | "known_volume" | "coverage";
type DensityType = "standard" | "compact" | "light" | "custom";
type PriceMode = "ton" | "yard";

/* ===================== Constants ===================== */
// Density values sourced from GRAVEL_DENSITIES in material-data.ts
// "custom" key remains inline (not in shared data)
const DENSITIES: Record<DensityType, number> = {
  "standard": GRAVEL_DENSITIES.standard.lbPerFt3, // 105
  "compact":  GRAVEL_DENSITIES.compact.lbPerFt3,  // 115
  "light":    GRAVEL_DENSITIES.light.lbPerFt3,    // 95
  "custom":   105, // placeholder; actual density comes from user input
};

const DENSITY_LABELS: Record<DensityType, string> = {
  "standard": GRAVEL_DENSITIES.standard.label,
  "compact":  GRAVEL_DENSITIES.compact.label,
  "light":    GRAVEL_DENSITIES.light.label,
  "custom":   "Custom Density",
};

/* ===================== Unit conversion (delegated to calc-engine) ===================== */
// toFeet imported from calc-engine
const ft3ToYd3 = cubicFtToYd;
const ft3ToM3  = cubicFtToM3;

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

/* ===================== UI tokens ===================== */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = { in: "in", ft: "ft", yd: "yd", cm: "cm", m: "m" };

/* ===================== Small UI primitives ===================== */
const Field = ({
  id, label, hint, subHint, children,
}: {
  id?: string; label: string; hint?: string; subHint?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-teal-500 text-sm font-medium">{label}</Label>
    {children}
    {hint && <p className="text-xs text-slate-300">{hint}</p>}
    {subHint && <p className="text-[11px] text-white/60">{subHint}</p>}
  </div>
);

const NumberInput = ({
  id, value, onChange, placeholder, badge, ariaLabel, numeric,
}: {
  id?: string; value: string; onChange: (v: string) => void; placeholder?: string;
  badge?: string; ariaLabel?: string; numeric?: boolean;
}) => (
  <div className="relative">
    <Input
      id={id}
      inputMode={numeric ? "numeric" : "decimal"}
      type="text"
      value={value}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, "");
        if (/^\d*\.?\d*$/.test(raw) || raw === "") onChange(raw);
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

/* ===================== Results type ===================== */
type Results = {
  area_ft2: number;
  volume_ft3: number;
  volume_yd3: number;
  volume_m3: number;
  weight_lb: number;
  weight_tons: number;
  adjusted_yd3: number;
  adjusted_tons: number;
  densityUsed: number;
  materialCost: number;
  totalCost: number;
  costPerSqFt: number;
  truckloads: number;
  coverage_sqft: number;
};

export default function CrushedConcreteCalc() {
  /* --- Unit System --- */
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");

  /* --- Units --- */
  const [unit, setUnit] = useState<LinearUnit>("ft");

  /* --- Dimensions --- */
  const [shape, setShape] = useState<ProjectShape>("rectangle");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("10");
  const [radius, setRadius] = useState("5");
  const [base, setBase] = useState("10");
  const [height, setHeight] = useState("10");
  const [base1, setBase1] = useState("8");
  const [base2, setBase2] = useState("12");
  const [customArea, setCustomArea] = useState("100");
  const [knownVolume, setKnownVolume] = useState("5");
  const [coverageTons, setCoverageTons] = useState("10");
  
  const [depth, setDepth] = useState("4");
  const [depthUnit, setDepthUnit] = useState<LinearUnit>("in");

  /* --- Material --- */
  const [densityType, setDensityType] = useState<DensityType>("standard");
  const [customDensity, setCustomDensity] = useState("105");

  /* --- Waste, Compaction & Cost --- */
  const [wastePct, setWastePct] = useState("10");
  const [truckCapacityTons, setTruckCapacityTons] = useState("15");
  const [priceMode, setPriceMode] = useState<PriceMode>("ton");
  const [price, setPrice] = useState("40");
  const [deliveryFee, setDeliveryFee] = useState("100");

  /* --- UI state --- */
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  /* ===================== Calculate ===================== */
  const canCalculate = useMemo(() => {
    if (shape === "coverage") {
      if (!(parseFloat(coverageTons) > 0)) return false;
      if (!(parseFloat(depth) > 0)) return false;
    } else if (shape === "known_volume") {
      if (!(parseFloat(knownVolume) > 0)) return false;
    } else {
      const d = parseFloat(depth);
      if (!(d > 0)) return false;

      if (shape === "rectangle") {
        if (!(parseFloat(length) > 0 && parseFloat(width) > 0)) return false;
      } else if (shape === "circle") {
        if (!(parseFloat(radius) > 0)) return false;
      } else if (shape === "triangle") {
        if (!(parseFloat(base) > 0 && parseFloat(height) > 0)) return false;
      } else if (shape === "trapezoid") {
        if (!(parseFloat(base1) > 0 && parseFloat(base2) > 0 && parseFloat(height) > 0)) return false;
      } else if (shape === "custom_area") {
        if (!(parseFloat(customArea) > 0)) return false;
      }
    }
    
    if (densityType === "custom" && !(parseFloat(customDensity) > 0)) return false;

    return true;
  }, [shape, length, width, radius, base, height, base1, base2, customArea, knownVolume, coverageTons, depth, densityType, customDensity]);

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    let area_ft2 = 0;
    let volume_ft3_raw = 0;
    const depth_ft = toFeet(parseFloat(depth || "0"), depthUnit);
    const density = densityType === "custom" ? Math.max(0, parseFloat(customDensity || "105")) : DENSITIES[densityType];

    if (shape === "coverage") {
      const tons = parseFloat(coverageTons);
      const lbs = tons * 2000;
      volume_ft3_raw = lbs / density;
      area_ft2 = volume_ft3_raw / depth_ft;
    } else if (shape === "known_volume") {
      // Assuming known volume is put in cubic yards.
      const volYd = parseFloat(knownVolume);
      volume_ft3_raw = volYd * 27;
      area_ft2 = 0; // Unknown area
    } else {
      if (shape === "rectangle") {
        area_ft2 = toFeet(parseFloat(length), unit) * toFeet(parseFloat(width), unit);
      } else if (shape === "circle") {
        const r = toFeet(parseFloat(radius), unit);
        area_ft2 = Math.PI * r * r;
      } else if (shape === "triangle") {
        const b = toFeet(parseFloat(base), unit);
        const h = toFeet(parseFloat(height), unit);
        area_ft2 = (b * h) / 2;
      } else if (shape === "trapezoid") {
        const b1 = toFeet(parseFloat(base1), unit);
        const b2 = toFeet(parseFloat(base2), unit);
        const h = toFeet(parseFloat(height), unit);
        area_ft2 = ((b1 + b2) / 2) * h;
      } else if (shape === "custom_area") {
        // Assume entered in square ft or converted depending on unit
        const rawA = parseFloat(customArea);
        if (unit === "ft") area_ft2 = rawA;
        else if (unit === "yd") area_ft2 = rawA * 9;
        else if (unit === "in") area_ft2 = rawA / 144;
        else if (unit === "m") area_ft2 = rawA * 10.7639;
        else if (unit === "cm") area_ft2 = rawA / 929.0304;
      }
      volume_ft3_raw = area_ft2 * depth_ft;
    }

    const waste = Math.max(0, parseFloat(wastePct || "0"));
    const volume_ft3 = volume_ft3_raw;
    const volume_yd3 = ft3ToYd3(volume_ft3);
    const volume_m3 = ft3ToM3(volume_ft3);

    const adjusted_ft3 = volume_ft3 * (1 + waste / 100);
    const adjusted_yd3 = ft3ToYd3(adjusted_ft3);

    const weight_lb = volume_ft3 * density;
    const weight_tons = weight_lb / 2000;
    
    const adjusted_tons = weight_tons * (1 + waste / 100);

    const p = parseFloat(price || "0");
    const dFee = parseFloat(deliveryFee || "0");
    
    let materialCost = 0;
    if (p > 0) {
      if (priceMode === "ton") materialCost = adjusted_tons * p;
      if (priceMode === "yard") materialCost = adjusted_yd3 * p;
    }
    
    const totalCost = materialCost + dFee;
    const costPerSqFt = area_ft2 > 0 ? (totalCost / area_ft2) : 0;
    
    const truckCap = parseFloat(truckCapacityTons || "15");
    const truckloads = truckCap > 0 ? Math.ceil(adjusted_tons / truckCap) : 0;
    
    const coverage_sqft = area_ft2;

    setResults({
      area_ft2,
      volume_ft3,
      volume_yd3,
      volume_m3,
      weight_lb,
      weight_tons,
      adjusted_yd3,
      adjusted_tons,
      densityUsed: density,
      materialCost,
      totalCost,
      costPerSqFt,
      truckloads,
      coverage_sqft,
    });
    setSubmitted(true);
  };

  const handlePrint = () => {
    if (!submitted || !results) return;
    const now = new Date().toLocaleString();
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Crushed Concrete Estimator – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    h2 { font-size: 16px; margin: 18px 0 8px; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; }
    .label { text-transform: uppercase; letter-spacing: .02em; font-size: 11px; color: #64748b; }
    .value-md { font-size: 18px; font-weight: 800; color: #0f766e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div><strong>Concrete Calculator Max</strong><br/>Crushed Concrete Estimator</div>
      <div>Printed: ${now}</div>
    </div>
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="card"><div class="label">Input Mode</div><div class="value-md">${shape.replace("_", " ")}</div></div>
      ${shape !== "known_volume" ? `<div class="card"><div class="label">Depth</div><div class="value-md">${depth} ${depthUnit}</div></div>` : ""}
      <div class="card"><div class="label">Waste/Compaction</div><div class="value-md">${wastePct}%</div></div>
      <div class="card"><div class="label">Density Type</div><div class="value-md">${densityType}</div></div>
    </div>
    <h2>Results</h2>
    <div class="grid">
      <div class="card"><div class="label">Net Volume (yd³)</div><div class="value-md">${fmt(results.volume_yd3)} yd³</div></div>
      <div class="card"><div class="label">Adjusted Volume to Order (yd³)</div><div class="value-md">${fmt(results.adjusted_yd3)} yd³</div></div>
      <div class="card"><div class="label">Net Weight (Tons)</div><div class="value-md">${fmt(results.weight_tons)} tons</div></div>
      <div class="card"><div class="label">Adjusted Weight to Order (Tons)</div><div class="value-md">${fmt(results.adjusted_tons)} tons</div></div>
      <div class="card"><div class="label">Estimated Truckloads</div><div class="value-md">${results.truckloads} loads</div></div>
      ${results.totalCost > 0 ? `<div class="card"><div class="label">Estimated Total Cost</div><div class="value-md">$${fmt(results.totalCost)}</div></div>` : ""}
    </div>
  </div>
  <script>window.addEventListener('load', () => setTimeout(window.print, 100));</script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden animate-in fade-in duration-500">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Crushed Concrete Estimator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center max-w-2xl mx-auto">
          Calculate volume, tons, coverage area, truckloads, and cost for crushed concrete projects. Includes compaction and waste adjustments.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            Crushed concrete is excellent for driveways and road bases. Be sure to account for 5-15% compaction/waste for proper estimating.
          </p>
        </div>

        {/* Unit System Toggle */}
        <div className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Unit System</h3>
          <div className="mt-2">
            <Tabs
              value={unitSystem}
              onValueChange={(v) => {
                const sys = v as "imperial" | "metric";
                setUnitSystem(sys);
                setUnit(sys === "imperial" ? "ft" : "m");
                setDepthUnit(sys === "imperial" ? "in" : "cm");
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

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 1 — Calculation Mode</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Input Method">
              <Select value={shape} onValueChange={(v) => { setShape(v as ProjectShape); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="rectangle">Rectangle Area</SelectItem>
                  <SelectItem value="circle">Circular Area</SelectItem>
                  <SelectItem value="triangle">Triangular Area</SelectItem>
                  <SelectItem value="trapezoid">Trapezoid Area</SelectItem>
                  <SelectItem value="custom_area">Known Area</SelectItem>
                  <SelectItem value="known_volume">Known Volume</SelectItem>
                  <SelectItem value="coverage">Reverse Coverage (from Tons)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {shape !== "known_volume" && shape !== "coverage" && (
              <Field label="Dimension Unit">
                <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="in">Inches (in)</SelectItem>
                    <SelectItem value="ft">Feet (ft)</SelectItem>
                    <SelectItem value="yd">Yards (yd)</SelectItem>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>
        </section>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 2 — Dimensions</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {shape === "rectangle" && (
              <>
                <Field label="Length" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={length} onChange={(v) => { setLength(v); setSubmitted(false); }} placeholder="10" badge={unitAbbrev[unit]} />
                </Field>
                <Field label="Width" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder="10" badge={unitAbbrev[unit]} />
                </Field>
              </>
            )}
            {shape === "circle" && (
              <Field label="Radius" subHint={`in ${unitAbbrev[unit]}`}>
                <NumberInput value={radius} onChange={(v) => { setRadius(v); setSubmitted(false); }} placeholder="5" badge={unitAbbrev[unit]} />
              </Field>
            )}
            {shape === "triangle" && (
              <>
                <Field label="Base" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={base} onChange={(v) => { setBase(v); setSubmitted(false); }} placeholder="10" badge={unitAbbrev[unit]} />
                </Field>
                <Field label="Height" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={height} onChange={(v) => { setHeight(v); setSubmitted(false); }} placeholder="10" badge={unitAbbrev[unit]} />
                </Field>
              </>
            )}
            {shape === "trapezoid" && (
              <>
                <Field label="Top Base" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={base1} onChange={(v) => { setBase1(v); setSubmitted(false); }} placeholder="8" badge={unitAbbrev[unit]} />
                </Field>
                <Field label="Bottom Base" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={base2} onChange={(v) => { setBase2(v); setSubmitted(false); }} placeholder="12" badge={unitAbbrev[unit]} />
                </Field>
                <Field label="Height" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={height} onChange={(v) => { setHeight(v); setSubmitted(false); }} placeholder="10" badge={unitAbbrev[unit]} />
                </Field>
              </>
            )}
            {shape === "custom_area" && (
              <Field label="Total Area" subHint={`in sq ${unitAbbrev[unit]}`}>
                <NumberInput value={customArea} onChange={(v) => { setCustomArea(v); setSubmitted(false); }} placeholder="100" badge={`sq ${unitAbbrev[unit]}`} />
              </Field>
            )}
            {shape === "known_volume" && (
              <Field label="Known Volume" subHint="in cubic yards">
                <NumberInput value={knownVolume} onChange={(v) => { setKnownVolume(v); setSubmitted(false); }} placeholder="5" badge="yd³" />
              </Field>
            )}
            {shape === "coverage" && (
              <Field label="Material Weight" subHint="How many tons do you have?">
                <NumberInput value={coverageTons} onChange={(v) => { setCoverageTons(v); setSubmitted(false); }} placeholder="10" badge="tons" />
              </Field>
            )}
            
            {shape !== "known_volume" && (
              <Field label="Depth / Thickness" subHint="Base depth">
                <div className="flex gap-2">
                  <NumberInput value={depth} onChange={(v) => { setDepth(v); setSubmitted(false); }} placeholder="4" />
                  <Select value={depthUnit} onValueChange={(v) => { setDepthUnit(v as LinearUnit); setSubmitted(false); }}>
                    <SelectTrigger className={cn(selectTriggerClass, "w-24")}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            )}
          </div>
        </section>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 3 — Density & Adjustments</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Density Profile">
              <Select value={densityType} onValueChange={(v) => { setDensityType(v as DensityType); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {(Object.keys(DENSITY_LABELS) as DensityType[]).map((t) => (
                    <SelectItem key={t} value={t}>{DENSITY_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {densityType === "custom" && (
              <Field label="Custom Density" subHint="in lb/ft³">
                <NumberInput value={customDensity} onChange={(v) => { setCustomDensity(v); setSubmitted(false); }} placeholder="105" badge="lb/ft³" />
              </Field>
            )}
            <Field label="Compaction / Waste" subHint="Typical is 5-15%">
              <NumberInput value={wastePct} onChange={(v) => { setWastePct(v); setSubmitted(false); }} placeholder="10" badge="%" />
            </Field>
            <Field label="Truck Capacity" subHint="For delivery estimate">
              <NumberInput value={truckCapacityTons} onChange={(v) => { setTruckCapacityTons(v); setSubmitted(false); }} placeholder="15" badge="tons" />
            </Field>
          </div>
        </section>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 4 — Cost Estimation (Optional)</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Material Price" subHint="Cost per unit">
              <div className="flex gap-2">
                <NumberInput value={price} onChange={(v) => { setPrice(v); setSubmitted(false); }} placeholder="40" badge="$" />
                <Select value={priceMode} onValueChange={(v) => { setPriceMode(v as PriceMode); setSubmitted(false); }}>
                  <SelectTrigger className={cn(selectTriggerClass, "w-32")}><SelectValue /></SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="ton">Per Ton</SelectItem>
                    <SelectItem value="yard">Per Cy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Field>
            <Field label="Delivery Fee" subHint="Flat delivery cost">
              <NumberInput value={deliveryFee} onChange={(v) => { setDeliveryFee(v); setSubmitted(false); }} placeholder="100" badge="$" />
            </Field>
          </div>
        </section>

        <div className="pt-6 mt-6 flex gap-4">
          <Button
            onClick={onCalculate}
            disabled={!canCalculate}
            className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold h-12 text-lg rounded-sm transition-colors disabled:opacity-50"
          >
            Calculate
          </Button>
          <Button
            onClick={() => {
              setUnitSystem("imperial");
              setShape("rectangle"); setLength("10"); setWidth("10"); setRadius("5"); setBase("10"); setHeight("10"); setBase1("8"); setBase2("12"); setCustomArea("100"); setKnownVolume("5"); setCoverageTons("10");
              setUnit("ft"); setDepth("4"); setDepthUnit("in"); setWastePct("10"); setDensityType("standard"); setTruckCapacityTons("15");
              setPrice("40"); setDeliveryFee("100"); setResults(null); setSubmitted(false);
            }}
            variant="outline"
            className="h-12 px-6 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-sm"
          >
            Reset
          </Button>
        </div>

        {submitted && results && (
          <div className="mt-8 bg-slate-800 rounded-md border border-teal-500/30 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-xl font-bold text-teal-400">Calculation Results</h3>
              <Button onClick={handlePrint} variant="ghost" size="sm" className="text-slate-300 hover:text-teal-400 h-8 gap-2">
                <Printer className="w-4 h-4" /> Print Estimate
              </Button>
            </div>
            <div className="p-6">
              
              <div className="mb-6 p-4 rounded bg-teal-900/20 border border-teal-700/50 flex flex-col md:flex-row gap-6 md:justify-around items-center text-center">
                 <div>
                    <div className="text-xs uppercase tracking-wider text-teal-200/70 mb-1">Recommended Order</div>
                    <div className="text-3xl font-bold text-teal-400">{fmt(results.adjusted_tons)} <span className="text-lg font-medium text-teal-500">Tons</span></div>
                 </div>
                 <div className="hidden md:block w-px h-12 bg-teal-700/50"></div>
                 <div>
                    <div className="text-xs uppercase tracking-wider text-teal-200/70 mb-1">Volumetric Equivalent</div>
                    <div className="text-3xl font-bold text-teal-400">{fmt(results.adjusted_yd3)} <span className="text-lg font-medium text-teal-500">yd³</span></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Net Vol (No Waste)</div>
                  <div className="text-lg font-bold text-slate-200">{fmt(results.volume_yd3)} yd³</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Net Lbs</div>
                  <div className="text-lg font-bold text-slate-200">{fmt(results.weight_lb)} lbs</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Coverage Area</div>
                  <div className="text-lg font-bold text-slate-200">{fmt(results.coverage_sqft)} ft²</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Truckloads needed</div>
                  <div className="text-lg font-bold text-slate-200">{results.truckloads} loads</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Material Details</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Total Calculation Area</span>
                      <span className="text-slate-200 font-medium">{fmt(results.area_ft2)} ft²</span>
                    </li>
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Adopted Density</span>
                      <span className="text-slate-200 font-medium">{fmt(results.densityUsed)} lb/ft³</span>
                    </li>
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Compaction / Waste Factor</span>
                      <span className="text-slate-200 font-medium">{parseFloat(wastePct) || 0}%</span>
                    </li>
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Metric Volume</span>
                      <span className="text-slate-200 font-medium">{fmt(results.volume_m3)} m³</span>
                    </li>
                  </ul>
                </div>

                {results.totalCost > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Estimated Cost</h4>
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                       <div className="flex justify-between items-center text-sm py-1 border-b border-slate-700/50">
                        <span className="text-slate-400">Material Cost</span>
                        <span className="text-slate-300">${fmt(results.materialCost)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm py-1 pb-2">
                        <span className="text-slate-400">Delivery Fee</span>
                        <span className="text-slate-300">${fmt(parseFloat(deliveryFee || "0"))}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-t border-slate-700/80 mt-1">
                        <span className="text-slate-200 font-semibold">Total Cost</span>
                        <span className="text-2xl text-teal-400 font-bold">${fmt(results.totalCost)}</span>
                      </div>
                      {results.costPerSqFt > 0 && (
                        <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-800">
                          <span className="text-slate-500">Cost per Sq Ft</span>
                          <span className="text-slate-400">${fmt(results.costPerSqFt)} / sq ft</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
            </div>
            <div className="px-6 py-4 bg-slate-900/80 text-xs text-slate-400 border-t border-slate-800 text-center">
              *Estimates are for planning purposes. Actual crushed concrete density, compaction, and pricing vary. Always confirm final quantities with your local supplier.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
