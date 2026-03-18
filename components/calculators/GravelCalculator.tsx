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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Info, Printer } from "lucide-react";

/* ===================== Types ===================== */
type LinearUnit = "in" | "ft" | "cm" | "m";
type ProjectShape = "rectangle" | "circle" | "triangle";
type GravelType = "general" | "pea" | "crushed" | "aquarium" | "custom";
type PriceMode = "ton" | "yard";

/* ===================== Constants ===================== */
const GRAVEL_DENSITIES: Record<GravelType, number> = {
  "general": 105,
  "pea": 100,
  "crushed": 105,
  "aquarium": 100,
  "custom": 105,
};

const GRAVEL_LABELS: Record<GravelType, string> = {
  "general": "General Gravel (105 lb/ft³)",
  "pea": "Pea Gravel (100 lb/ft³)",
  "crushed": "Crushed Stone (105 lb/ft³)",
  "aquarium": "Aquarium Gravel (100 lb/ft³)",
  "custom": "Custom Density",
};

/* ===================== Unit conversion ===================== */
const toFeet = (v: number, u: LinearUnit): number => {
  switch (u) {
    case "ft": return v;
    case "in": return v / 12;
    case "cm": return v / 30.48;
    case "m":  return v * 3.28084;
  }
};

const ft3ToYd3 = (v: number) => v / 27;
const ft3ToM3 = (v: number) => v * 0.0283168;

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

/* ===================== UI tokens ===================== */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = { in: "in", ft: "ft", cm: "cm", m: "m" };

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
  area_m2: number;
  volume_ft3: number;
  volume_yd3: number;
  volume_m3: number;
  weight_lb: number;
  weight_tons: number;
  weight_kg: number;
  densityUsed: number;
  estimatedCost: number;
};

export default function GravelCalculator() {
  /* --- Units --- */
  const [unit, setUnit] = useState<LinearUnit>("ft");

  /* --- Dimensions --- */
  const [shape, setShape] = useState<ProjectShape>("rectangle");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("12");
  const [radius, setRadius] = useState("6");
  const [base, setBase] = useState("10");
  const [height, setHeight] = useState("10");
  const [depth, setDepth] = useState("4"); // Usually inches... wait.
  // Actually, depth is usually in inches, but based on user unit. We'll add a separate unit for depth.
  const [depthUnit, setDepthUnit] = useState<LinearUnit>("in");

  /* --- Material --- */
  const [gravelType, setGravelType] = useState<GravelType>("general");
  const [customDensity, setCustomDensity] = useState("105");

  /* --- Waste & Cost --- */
  const [wastePct, setWastePct] = useState("10");
  const [priceMode, setPriceMode] = useState<PriceMode>("ton");
  const [price, setPrice] = useState("");

  /* --- UI state --- */
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  /* ===================== Calculate ===================== */
  const canCalculate = useMemo(() => {
    const d = parseFloat(depth);
    if (!(d > 0)) return false;

    if (shape === "rectangle") {
      if (!(parseFloat(length) > 0 && parseFloat(width) > 0)) return false;
    } else if (shape === "circle") {
      if (!(parseFloat(radius) > 0)) return false;
    } else if (shape === "triangle") {
      if (!(parseFloat(base) > 0 && parseFloat(height) > 0)) return false;
    }
    
    if (gravelType === "custom" && !(parseFloat(customDensity) > 0)) return false;

    return true;
  }, [shape, length, width, radius, base, height, depth, gravelType, customDensity]);

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    // Convert everything to feet
    let area_ft2 = 0;
    if (shape === "rectangle") {
      area_ft2 = toFeet(parseFloat(length), unit) * toFeet(parseFloat(width), unit);
    } else if (shape === "circle") {
      const r = toFeet(parseFloat(radius), unit);
      area_ft2 = Math.PI * r * r;
    } else if (shape === "triangle") {
      const b = toFeet(parseFloat(base), unit);
      const h = toFeet(parseFloat(height), unit);
      area_ft2 = (b * h) / 2;
    }

    const depth_ft = toFeet(parseFloat(depth), depthUnit);
    const volume_ft3_raw = area_ft2 * depth_ft;

    const waste = Math.max(0, parseFloat(wastePct || "0"));
    const volume_ft3 = volume_ft3_raw * (1 + waste / 100);

    const volume_yd3 = ft3ToYd3(volume_ft3);
    const volume_m3 = ft3ToM3(volume_ft3);
    const area_m2 = area_ft2 * 0.092903;

    const density = gravelType === "custom" ? Math.max(0, parseFloat(customDensity || "105")) : GRAVEL_DENSITIES[gravelType];
    const weight_lb = volume_ft3 * density;
    const weight_tons = weight_lb / 2000;
    const weight_kg = weight_lb * 0.453592;

    const p = parseFloat(price || "0");
    let estimatedCost = 0;
    if (p > 0) {
      if (priceMode === "ton") estimatedCost = weight_tons * p;
      if (priceMode === "yard") estimatedCost = volume_yd3 * p;
    }

    setResults({
      area_ft2,
      area_m2,
      volume_ft3,
      volume_yd3,
      volume_m3,
      weight_lb,
      weight_tons,
      weight_kg,
      densityUsed: density,
      estimatedCost,
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
  <title>Gravel Calculator – Print View</title>
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
      <div><strong>Concrete Calculator Max</strong><br/>Gravel Calculator</div>
      <div>Printed: ${now}</div>
    </div>
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="card"><div class="label">Shape</div><div class="value-md">${shape}</div></div>
      <div class="card"><div class="label">Depth</div><div class="value-md">${depth} ${depthUnit}</div></div>
      <div class="card"><div class="label">Waste</div><div class="value-md">${wastePct}%</div></div>
      <div class="card"><div class="label">Gravel Type</div><div class="value-md">${gravelType}</div></div>
    </div>
    <h2>Results</h2>
    <div class="grid">
      <div class="card"><div class="label">Volume (Cubic Yards)</div><div class="value-md">${fmt(results.volume_yd3)} yd³</div></div>
      <div class="card"><div class="label">Volume (Cubic Feet)</div><div class="value-md">${fmt(results.volume_ft3)} ft³</div></div>
      <div class="card"><div class="label">Weight (Tons)</div><div class="value-md">${fmt(results.weight_tons)} tons</div></div>
      <div class="card"><div class="label">Weight (Pounds)</div><div class="value-md">${fmt(results.weight_lb)} lbs</div></div>
      ${results.estimatedCost > 0 ? `<div class="card"><div class="label">Estimated Cost</div><div class="value-md">$${fmt(results.estimatedCost)}</div></div>` : ""}
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
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Gravel Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate how much gravel is needed based on your project dimensions and selected depth.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            Use this calculator to find the required gravel in tons or cubic yards. Just enter the dimensions of your project area.
          </p>
        </div>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 1 — Shape & Units</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Project Shape">
              <Select value={shape} onValueChange={(v) => { setShape(v as ProjectShape); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="circle">Circle</SelectItem>
                  <SelectItem value="triangle">Triangle</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Dimension Unit">
              <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="in">Inches (in)</SelectItem>
                  <SelectItem value="ft">Feet (ft)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="m">Meters (m)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 2 — Dimensions</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {shape === "rectangle" && (
              <>
                <Field label="Length" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={length} onChange={(v) => { setLength(v); setSubmitted(false); }} placeholder="12" badge={unitAbbrev[unit]} />
                </Field>
                <Field label="Width" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder="12" badge={unitAbbrev[unit]} />
                </Field>
              </>
            )}
            {shape === "circle" && (
              <Field label="Radius" subHint={`in ${unitAbbrev[unit]}`}>
                <NumberInput value={radius} onChange={(v) => { setRadius(v); setSubmitted(false); }} placeholder="6" badge={unitAbbrev[unit]} />
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
            <Field label="Depth" subHint="Project depth">
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
          </div>
        </section>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">Step 3 — Material & Cost</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Gravel Type / Density">
              <Select value={gravelType} onValueChange={(v) => { setGravelType(v as GravelType); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {(Object.keys(GRAVEL_LABELS) as GravelType[]).map((t) => (
                    <SelectItem key={t} value={t}>{GRAVEL_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {gravelType === "custom" && (
              <Field label="Custom Density" subHint="in lb/ft³">
                <NumberInput value={customDensity} onChange={(v) => { setCustomDensity(v); setSubmitted(false); }} placeholder="105" badge="lb/ft³" />
              </Field>
            )}
            <Field label="Waste Factor" subHint="Extra material for spillage">
              <NumberInput value={wastePct} onChange={(v) => { setWastePct(v); setSubmitted(false); }} placeholder="10" badge="%" />
            </Field>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Field label="Price" subHint="Optional">
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
              setShape("rectangle"); setLength("12"); setWidth("12"); setRadius("6"); setBase("10"); setHeight("10");
              setUnit("ft"); setDepth("4"); setDepthUnit("in"); setWastePct("10"); setGravelType("general");
              setPrice(""); setResults(null); setSubmitted(false);
            }}
            variant="outline"
            className="h-12 px-6 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-sm"
          >
            Reset
          </Button>
        </div>

        {submitted && results && (
          <div className="mt-8 bg-slate-800 rounded-md border border-teal-500/30 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-teal-400">Calculation Results</h3>
              <Button onClick={handlePrint} variant="ghost" size="sm" className="text-slate-300 hover:text-teal-400 h-8 gap-2">
                <Printer className="w-4 h-4" /> Print / Save
              </Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Volume (Cubic Yards)</div>
                  <div className="text-2xl font-bold text-teal-400">{fmt(results.volume_yd3)}</div>
                  <div className="text-xs text-slate-500 mt-1">yd³</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Volume (Cubic Feet)</div>
                  <div className="text-2xl font-bold text-teal-400">{fmt(results.volume_ft3)}</div>
                  <div className="text-xs text-slate-500 mt-1">ft³</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Estimated Weight (Tons)</div>
                  <div className="text-2xl font-bold text-teal-400">{fmt(results.weight_tons)}</div>
                  <div className="text-xs text-slate-500 mt-1">tons</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Estimated Weight (Lbs)</div>
                  <div className="text-2xl font-bold text-teal-400">{fmt(results.weight_lb)}</div>
                  <div className="text-xs text-slate-500 mt-1">lbs</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Material Specification</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Total Area</span>
                      <span className="text-slate-200 font-medium">{fmt(results.area_ft2)} ft²</span>
                    </li>
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Gravel Density</span>
                      <span className="text-slate-200 font-medium">{fmt(results.densityUsed)} lb/ft³</span>
                    </li>
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Volume (Metric)</span>
                      <span className="text-slate-200 font-medium">{fmt(results.volume_m3)} m³</span>
                    </li>
                    <li className="flex justify-between text-sm py-1 border-b border-slate-800/50">
                      <span className="text-slate-400">Weight (Metric)</span>
                      <span className="text-slate-200 font-medium">{fmt(results.weight_kg)} kg</span>
                    </li>
                  </ul>
                </div>

                {results.estimatedCost > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Estimated Cost</h4>
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                       <div className="flex justify-between items-center text-sm py-2">
                        <span className="text-slate-400">Price Rate</span>
                        <span className="text-slate-300">${fmt(parseFloat(price))} per {priceMode === "ton" ? "ton" : "yd³"}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t border-slate-700 mt-2">
                        <span className="text-slate-300 font-semibold">Total Cost</span>
                        <span className="text-2xl text-teal-400 font-bold">${fmt(results.estimatedCost)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
