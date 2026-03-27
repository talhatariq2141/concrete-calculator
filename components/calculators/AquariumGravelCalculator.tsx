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
type TankShape = "rectangle" | "cylinder" | "bow_front";
type LinearUnit = "in" | "cm";

/* ===================== Unit conversion & constants ===================== */
// Aquarium gravel is roughly 100-105 lb/ft³
// In pounds per cubic inch: 100 / 1728 ≈ 0.05787 lb/in³
const AQUARIUM_GRAVEL_DENSITY_LB_PER_IN3 = 100 / 1728; 
// const AQUARIUM_GRAVEL_DENSITY_KG_PER_CM3 = 1600 / 1000000; // ~1.6 g/cm3 -> 0.0016 kg/cm3

const toInches = (v: number, u: LinearUnit): number => (u === "in" ? v : v / 2.54);
// const toCm = (v: number, u: LinearUnit): number => (u === "cm" ? v : v * 2.54);

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

/* ===================== UI tokens ===================== */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = { in: "in", cm: "cm" };

const Field = ({ id, label, hint, subHint, children }: { id?: string; label: string; hint?: string; subHint?: string; children: React.ReactNode; }) => (
  <div className="space-y-1.5 flex flex-col justify-start">
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
  weightLbs: number;
  weightKg: number;
  volumeIn3: number;
  bagSizeUsed: number;
  bagsNeeded: number;
};

export default function AquariumGravelCalculator() {
  const [shape, setShape] = useState<TankShape>("rectangle");
  const [unit, setUnit] = useState<LinearUnit>("in");

  const [length, setLength] = useState("24");
  const [width, setWidth] = useState("12"); // depth/width
  const [bowWidth, setBowWidth] = useState("15"); // center width for bow front
  const [diameter, setDiameter] = useState("18"); // for cylinder
  const [gravelDepth, setGravelDepth] = useState("2");

  const [bagSize, setBagSize] = useState("5"); // lb

  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const canCalculate = useMemo(() => {
    const d = parseFloat(gravelDepth);
    if (!(d > 0)) return false;

    if (shape === "rectangle") {
      if (!(parseFloat(length) > 0 && parseFloat(width) > 0)) return false;
    } else if (shape === "bow_front") {
      if (!(parseFloat(length) > 0 && parseFloat(width) > 0 && parseFloat(bowWidth) > 0)) return false;
    } else if (shape === "cylinder") {
      if (!(parseFloat(diameter) > 0)) return false;
    }

    if (!(parseFloat(bagSize) > 0)) return false;
    return true;
  }, [shape, length, width, bowWidth, diameter, gravelDepth, bagSize]);

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    let area_in2 = 0;
    const l_in = toInches(parseFloat(length), unit);
    const w_in = toInches(parseFloat(width), unit);
    const d_in = toInches(parseFloat(gravelDepth), unit);

    if (shape === "rectangle") {
      area_in2 = l_in * w_in;
    } else if (shape === "bow_front") {
      const bow_in = toInches(parseFloat(bowWidth), unit);
      // Approx area for bow front: rectangular part + elliptical segment
      // Just average the side width and center width as a rough estimate
      const avg_w = (w_in + bow_in) / 2;
      area_in2 = l_in * avg_w;
    } else if (shape === "cylinder") {
      const diam_in = toInches(parseFloat(diameter), unit);
      const r = diam_in / 2;
      area_in2 = Math.PI * r * r;
    }

    const volumeIn3 = area_in2 * d_in;
    const weightLbs = volumeIn3 * AQUARIUM_GRAVEL_DENSITY_LB_PER_IN3;
    const weightKg = weightLbs * 0.453592;

    const bs = parseFloat(bagSize);
    const bagsNeeded = Math.ceil(weightLbs / bs);

    setResults({
      weightLbs,
      weightKg,
      volumeIn3,
      bagSizeUsed: bs,
      bagsNeeded,
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
  <title>Aquarium Gravel Calculator – Print View</title>
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
      <div><strong>Concrete Calculator Max</strong><br/>Aquarium Gravel Calculator</div>
      <div>Printed: ${now}</div>
    </div>
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="card"><div class="label">Tank Shape</div><div class="value-md" style="text-transform:capitalize;">${shape.replace('_',' ')}</div></div>
      <div class="card"><div class="label">Desired Depth</div><div class="value-md">${gravelDepth} ${unitAbbrev[unit]}</div></div>
    </div>
    <h2>Results Estimate</h2>
    <div class="grid">
      <div class="card"><div class="label">Estimated Weight (lbs)</div><div class="value-md">${fmt(results.weightLbs)} lbs</div></div>
      <div class="card"><div class="label">Estimated Weight (kg)</div><div class="value-md">${fmt(results.weightKg)} kg</div></div>
      <div class="card"><div class="label">Bags Required (${results.bagSizeUsed} lb bag)</div><div class="value-md">${results.bagsNeeded}</div></div>
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
    <Card className="font-poppins mx-auto w-full max-w-5xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Aquarium Gravel Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Determine how many pounds of gravel to buy for your fish tank bottom.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 mt-4 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            A general rule of thumb is 1.5 to 2 inches of gravel depth for a standard freshwater aquarium. This supports plants and beneficial bacteria.
          </p>
        </div>

        <section className={stepClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/80">Tank Dimensions</h3>
            <div className="w-32">
              <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                <SelectTrigger className={cn(selectTriggerClass, "h-9")} aria-label="Units">
                  <SelectValue placeholder="Units" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="in">Inches (in)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Field label="Tank Shape">
              <Select value={shape} onValueChange={(v) => { setShape(v as TankShape); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="rectangle">Rectangular</SelectItem>
                  <SelectItem value="bow_front">Bow Front</SelectItem>
                  <SelectItem value="cylinder">Cylinder / Tube</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {shape !== "cylinder" && (
              <Field label="Tank Length" subHint="Side to side">
                <NumberInput value={length} onChange={(v) => { setLength(v); setSubmitted(false); }} placeholder="24" badge={unitAbbrev[unit]} />
              </Field>
            )}

            {shape === "rectangle" && (
              <Field label="Tank Width / Depth" subHint="Front to back">
                <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder="12" badge={unitAbbrev[unit]} />
              </Field>
            )}

            {shape === "bow_front" && (
              <>
                <Field label="Side Width" subHint="Front corner to back">
                  <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder="12" badge={unitAbbrev[unit]} />
                </Field>
                <Field label="Center Width" subHint="Front bow apex to back">
                  <NumberInput value={bowWidth} onChange={(v) => { setBowWidth(v); setSubmitted(false); }} placeholder="15" badge={unitAbbrev[unit]} />
                </Field>
              </>
            )}

            {shape === "cylinder" && (
              <Field label="Tank Diameter" subHint="Across the circle">
                <NumberInput value={diameter} onChange={(v) => { setDiameter(v); setSubmitted(false); }} placeholder="18" badge={unitAbbrev[unit]} />
              </Field>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Desired Gravel Depth" subHint="Typically 1.5 - 2 inches">
              <NumberInput value={gravelDepth} onChange={(v) => { setGravelDepth(v); setSubmitted(false); }} placeholder="2" badge={unitAbbrev[unit]} />
            </Field>

            <Field label="Typical Bag Size" subHint="For shopping calculations">
              <div className="flex gap-2">
                <NumberInput value={bagSize} onChange={(v) => { setBagSize(v); setSubmitted(false); }} placeholder="5" />
                <span className="flex items-center justify-center w-12 bg-slate-800 border border-slate-700 rounded-sm text-slate-300 text-sm">
                  lb
                </span>
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
            Calculate Amount
          </Button>
        </div>

        {submitted && results && (
          <div className="mt-8 bg-slate-800 rounded-md border border-teal-500/30 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-teal-400">Gravel Estimate</h3>
              <Button onClick={handlePrint} variant="ghost" size="sm" className="text-slate-300 hover:text-teal-400 h-8 gap-2">
                <Printer className="w-4 h-4" /> Print Results
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-slate-900 rounded-md p-6 border border-slate-700 flex flex-col justify-center text-center">
                  <div className="text-sm uppercase tracking-wider text-slate-400 mb-2">Weight in Pounds</div>
                  <div className="text-4xl font-bold text-slate-100">{fmt(results.weightLbs)} <span className="text-2xl text-slate-500">lbs</span></div>
                </div>
                
                <div className="bg-slate-900 rounded-md p-6 border border-slate-700 flex flex-col justify-center text-center">
                  <div className="text-sm uppercase tracking-wider text-slate-400 mb-2">Weight in Kilograms</div>
                  <div className="text-4xl font-bold text-slate-100">{fmt(results.weightKg)} <span className="text-2xl text-slate-500">kg</span></div>
                </div>

                <div className="bg-slate-900 rounded-md p-6 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)] flex flex-col justify-center text-center">
                  <div className="text-sm uppercase tracking-wider text-teal-400 mb-2">Shopping Cart</div>
                  <div className="text-4xl font-bold text-teal-400">{results.bagsNeeded} <span className="text-2xl text-teal-500/70">bags</span></div>
                  <div className="text-sm text-slate-400 mt-2">(based on {results.bagSizeUsed} lb bags)</div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-400 px-4">
                * Note: This assumes standard aquarium gravel or sand. If using very lightweight substrates (like fluval stratum) or very heavy solid stones, your weight requirements may vary slightly.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
