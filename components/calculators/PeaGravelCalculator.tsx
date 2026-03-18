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
import { cn } from "@/lib/utils";
import { Info, Printer } from "lucide-react";

/* ===================== Types ===================== */
type LinearUnit = "in" | "ft" | "cm" | "m";
type PriceMode = "ton" | "yard" | "bag";

/* ===================== Constants ===================== */
const PEA_GRAVEL_DENSITY = 100; // 100 lb / ft3

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
const Field = ({ id, label, hint, subHint, children }: { id?: string; label: string; hint?: string; subHint?: string; children: React.ReactNode; }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-teal-500 text-sm font-medium">{label}</Label>
    {children}
    {hint && <p className="text-xs text-slate-300">{hint}</p>}
    {subHint && <p className="text-[11px] text-white/60">{subHint}</p>}
  </div>
);

const NumberInput = ({ id, value, onChange, placeholder, badge, ariaLabel, numeric }: { id?: string; value: string; onChange: (v: string) => void; placeholder?: string; badge?: string; ariaLabel?: string; numeric?: boolean; }) => (
  <div className="relative">
    <Input
      id={id} inputMode={numeric ? "numeric" : "decimal"} type="text" value={value}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, "");
        if (/^\d*\.?\d*$/.test(raw) || raw === "") onChange(raw);
      }}
      placeholder={placeholder} className={fieldInputClass} aria-label={ariaLabel}
    />
    {badge && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{badge}</span>}
  </div>
);

/* ===================== Results type ===================== */
type Results = {
  area_ft2: number;
  volume_ft3: number;
  volume_yd3: number;
  weight_lb: number;
  weight_tons: number;
  bags_needed: number;
  bagSize_lb: number;
  totalCost: number;
};

export default function PeaGravelCalculator() {
  const [unit, setUnit] = useState<LinearUnit>("ft");

  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("5");
  const [depth, setDepth] = useState("2");
  const [depthUnit, setDepthUnit] = useState<LinearUnit>("in");

  const [wastePct, setWastePct] = useState("5");
  
  const [bagSize, setBagSize] = useState("50"); // generally 0.5 cf bags = ~50 lb
  const [priceMode, setPriceMode] = useState<PriceMode>("bag");
  const [price, setPrice] = useState("5.50");

  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const canCalculate = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    if (!(l > 0 && w > 0 && d > 0)) return false;
    if (!(parseFloat(bagSize) > 0)) return false;
    return true;
  }, [length, width, depth, bagSize]);

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    const area_ft2 = toFeet(parseFloat(length), unit) * toFeet(parseFloat(width), unit);
    const depth_ft = toFeet(parseFloat(depth), depthUnit);
    
    const volume_ft3_raw = area_ft2 * depth_ft;

    const waste = Math.max(0, parseFloat(wastePct || "0"));
    const volume_ft3 = volume_ft3_raw * (1 + waste / 100);
    const volume_yd3 = ft3ToYd3(volume_ft3);

    const weight_lb = volume_ft3 * PEA_GRAVEL_DENSITY;
    const weight_tons = weight_lb / 2000;

    const bs = parseFloat(bagSize);
    const bags_needed = Math.ceil(weight_lb / bs);

    const p = parseFloat(price || "0");
    let totalCost = 0;
    if (p > 0) {
      if (priceMode === "ton") totalCost = weight_tons * p;
      if (priceMode === "yard") totalCost = volume_yd3 * p;
      if (priceMode === "bag") totalCost = bags_needed * p;
    }

    setResults({
      area_ft2,
      volume_ft3,
      volume_yd3,
      weight_lb,
      weight_tons,
      bags_needed,
      bagSize_lb: bs,
      totalCost,
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
  <title>Pea Gravel Calculator – Print View</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    h2 { font-size: 16px; margin: 18px 0 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; }
    .label { text-transform: uppercase; letter-spacing: .02em; font-size: 11px; color: #64748b; }
    .value-md { font-size: 18px; font-weight: 800; color: #0f766e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div><strong>Concrete Calculator Max</strong><br/>Pea Gravel Calculator</div>
      <div>Printed: ${now}</div>
    </div>
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="card"><div class="label">Area</div><div class="value-md">${length} × ${width} ${unitAbbrev[unit]}</div></div>
      <div class="card"><div class="label">Depth</div><div class="value-md">${depth} ${depthUnit}</div></div>
      <div class="card"><div class="label">Waste Factor</div><div class="value-md">${wastePct}%</div></div>
    </div>
    <h2>Results</h2>
    <div class="grid">
      <div class="card"><div class="label">Estimated Volume</div><div class="value-md">${fmt(results.volume_yd3)} yd³</div></div>
      <div class="card"><div class="label">Estimated Bags (${results.bagSize_lb} lb)</div><div class="value-md">${results.bags_needed} bags</div></div>
      ${results.totalCost > 0 ? `<div class="card"><div class="label">Estimated Cost</div><div class="value-md">$${fmt(results.totalCost)}</div></div>` : ""}
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
          Pea Gravel Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate pea gravel for garden beds, walkways, or patios. Calculate in bags or bulk.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            Pea gravel is an excellent decorative stone for landscaping. A depth of 2 to 3 inches is typically recommended for solid coverage over soil or landscape fabric.
          </p>
        </div>

        <section className={stepClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/80">Step 1 — Dimensions</h3>
            <div className="w-32">
              <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Units">
                  <SelectValue placeholder="Units" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="in">Inches (in)</SelectItem>
                  <SelectItem value="ft">Feet (ft)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="m">Meters (m)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Length" subHint={`in ${unitAbbrev[unit]}`}>
              <NumberInput value={length} onChange={(v) => { setLength(v); setSubmitted(false); }} placeholder="20" badge={unitAbbrev[unit]} />
            </Field>
            <Field label="Width" subHint={`in ${unitAbbrev[unit]}`}>
              <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder="5" badge={unitAbbrev[unit]} />
            </Field>
            <Field label="Gravel Depth" subHint="Typically 2-3 inches">
              <div className="flex gap-2">
                <NumberInput value={depth} onChange={(v) => { setDepth(v); setSubmitted(false); }} placeholder="2" />
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
          <h3 className="text-sm font-semibold text-white/80">Step 2 — Purchase Options</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Bag Size" subHint="Average bag weight (lbs)">
              <NumberInput value={bagSize} onChange={(v) => { setBagSize(v); setSubmitted(false); }} placeholder="50" badge="lb" />
            </Field>
            <Field label="Waste Factor" subHint="Extra material for spreading">
              <NumberInput value={wastePct} onChange={(v) => { setWastePct(v); setSubmitted(false); }} placeholder="5" badge="%" />
            </Field>
            <Field label="Material Price" subHint="Optional">
              <div className="flex gap-2">
                <NumberInput value={price} onChange={(v) => { setPrice(v); setSubmitted(false); }} placeholder="5.50" badge="$" />
                <Select value={priceMode} onValueChange={(v) => { setPriceMode(v as PriceMode); setSubmitted(false); }}>
                  <SelectTrigger className={cn(selectTriggerClass, "w-32")}><SelectValue /></SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="bag">Per Bag</SelectItem>
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
              setLength("20"); setWidth("5"); setUnit("ft"); setDepth("2"); setDepthUnit("in"); 
              setWastePct("5"); setBagSize("50");
              setPrice("5.50"); setPriceMode("bag"); setResults(null); setSubmitted(false);
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Estimated Bags</div>
                  <div className="text-2xl font-bold text-teal-400">{results.bags_needed}</div>
                  <div className="text-xs text-slate-500 mt-1">{results.bagSize_lb} lb bags</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Bulk Volume (yd³)</div>
                  <div className="text-2xl font-bold text-teal-400">{fmt(results.volume_yd3)}</div>
                  <div className="text-xs text-slate-500 mt-1">yd³</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Bulk Weight (Tons)</div>
                  <div className="text-2xl font-bold text-teal-400">{fmt(results.weight_tons)}</div>
                  <div className="text-xs text-slate-500 mt-1">tons</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Total Cost</div>
                  <div className="text-2xl font-bold text-teal-400">${fmt(results.totalCost)}</div>
                  <div className="text-xs text-slate-500 mt-1">Estimated</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
