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
import { ArrowRightLeft, Info, Printer } from "lucide-react";

/* ===================== Types ===================== */
type GravelType = "general" | "pea" | "crushed" | "custom";
type ConvertMode = "tons_to_yards" | "yards_to_tons";

/* ===================== Constants ===================== */
const GRAVEL_DENSITIES: Record<GravelType, number> = {
  "general": 105,
  "pea": 100,
  "crushed": 105,
  "custom": 105,
};

const GRAVEL_LABELS: Record<GravelType, string> = {
  "general": "General Gravel (105 lb/ft³)",
  "pea": "Pea Gravel (100 lb/ft³)",
  "crushed": "Crushed Stone (105 lb/ft³)",
  "custom": "Custom Density",
};

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

/* ===================== UI tokens ===================== */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

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
  mode: ConvertMode;
  inputBase: number;
  outputYards: number;
  outputTons: number;
  outputPounds: number;
  densityUsed: number;
};

export default function GravelTonsToYardsCalculator() {
  const [mode, setMode] = useState<ConvertMode>("tons_to_yards");
  const [quantity, setQuantity] = useState("5");

  const [gravelType, setGravelType] = useState<GravelType>("general");
  const [customDensity, setCustomDensity] = useState("105");

  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const canCalculate = useMemo(() => {
    const q = parseFloat(quantity);
    if (!(q > 0)) return false;
    if (gravelType === "custom" && !(parseFloat(customDensity) > 0)) return false;
    return true;
  }, [quantity, gravelType, customDensity]);

  const toggleMode = () => {
    setMode((m) => m === "tons_to_yards" ? "yards_to_tons" : "tons_to_yards");
    setSubmitted(false);
  };

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    const q = parseFloat(quantity);
    const density = gravelType === "custom" ? Math.max(0, parseFloat(customDensity || "105")) : GRAVEL_DENSITIES[gravelType];
    
    // Weight of 1 cubic yard in tons
    // 1 cy = 27 cf
    // 27 cf * density = lbs per cy
    // lbs per cy / 2000 = tons per cy
    const tonsPerYard = (27 * density) / 2000;

    let outY = 0;
    let outT = 0;
    let outPounds = 0;

    if (mode === "tons_to_yards") {
      outT = q;
      outY = q / tonsPerYard;
      outPounds = q * 2000;
    } else {
      outY = q;
      outT = q * tonsPerYard;
      outPounds = outT * 2000;
    }

    setResults({
      mode,
      inputBase: q,
      outputYards: outY,
      outputTons: outT,
      outputPounds: outPounds,
      densityUsed: density,
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
  <title>Gravel Tons to Yards Converter – Print View</title>
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
      <div><strong>Concrete Calculator Max</strong><br/>Gravel Tons to Yards Converter</div>
      <div>Printed: ${now}</div>
    </div>
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="card"><div class="label">Conversion Mode</div><div class="value-md">${mode === 'tons_to_yards' ? 'Tons to Yards' : 'Yards to Tons'}</div></div>
      <div class="card"><div class="label">Input Quantity</div><div class="value-md">${quantity} ${mode === 'tons_to_yards' ? 'Tons' : 'yd³'}</div></div>
      <div class="card"><div class="label">Density Used</div><div class="value-md">${results.densityUsed} lb/ft³</div></div>
    </div>
    <h2>Results</h2>
    <div class="grid">
      <div class="card"><div class="label">Converted Volume</div><div class="value-md">${fmt(results.outputYards)} yd³</div></div>
      <div class="card"><div class="label">Converted Weight (Tons)</div><div class="value-md">${fmt(results.outputTons)} tons</div></div>
      <div class="card"><div class="label">Converted Weight (Lbs)</div><div class="value-md">${fmt(results.outputPounds)} lbs</div></div>
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
    <Card className="font-poppins mx-auto w-full max-w-4xl rounded-sm border border-slate-700 bg-slate-900 shadow-md flex flex-col">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Gravel Tons to Yards Converter
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Easily switch between tons and cubic yards based on gravel density.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 mt-4 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            Conversion relies heavily on the type of gravel. A cubic yard of typical gravel is approx 1.4 tons.
          </p>
        </div>

        <section className={stepClass}>
          <div className="flex flex-col sm:flex-row items-end gap-4 max-w-xl mx-auto">
            <div className="flex-1 w-full">
              <Field label={mode === "tons_to_yards" ? "Input Tons" : "Input Cubic Yards"} subHint={mode === "tons_to_yards" ? "Weight" : "Volume"}>
                <NumberInput
                  value={quantity} onChange={(v) => { setQuantity(v); setSubmitted(false); }}
                  placeholder="5" badge={mode === "tons_to_yards" ? "tons" : "yd³"}
                />
              </Field>
            </div>
            
            <div className="pb-[22px] flex justify-center w-full sm:w-auto">
              <Button
                type="button"
                onClick={toggleMode}
                variant="outline"
                className="h-11 w-11 p-0 border-slate-700 text-teal-400 hover:text-teal-300 hover:bg-slate-800 rounded-sm shrink-0"
                title="Swap To/From"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start gap-4 max-w-xl mx-auto">
            <div className="flex-1 w-full">
              <Field label="Gravel Type / Density" subHint="Select for accurate weight conversion">
                <Select value={gravelType} onValueChange={(v) => { setGravelType(v as GravelType); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {(Object.keys(GRAVEL_LABELS) as GravelType[]).map((t) => (
                      <SelectItem key={t} value={t}>{GRAVEL_LABELS[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            {gravelType === "custom" && (
              <div className="flex-1 w-full">
                <Field label="Custom Density" subHint="in lb/ft³">
                  <NumberInput value={customDensity} onChange={(v) => { setCustomDensity(v); setSubmitted(false); }} placeholder="105" badge="lb/ft³" />
                </Field>
              </div>
            )}
          </div>
        </section>

        <div className="pt-6 mt-6 flex gap-4 max-w-xl mx-auto">
          <Button
            onClick={onCalculate}
            disabled={!canCalculate}
            className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold h-12 text-lg rounded-sm transition-colors disabled:opacity-50"
          >
            Convert
          </Button>
        </div>

        {submitted && results && (
          <div className="mt-8 bg-slate-800 rounded-md border border-teal-500/30 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-teal-400">Conversion Results</h3>
              <Button onClick={handlePrint} variant="ghost" size="sm" className="text-slate-300 hover:text-teal-400 h-8 gap-2">
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="bg-slate-900 rounded-md p-6 border border-slate-700 flex flex-col justify-center text-center">
                  <div className="text-sm uppercase tracking-wider text-slate-400 mb-2">
                    {results.mode === "tons_to_yards" ? "Weight (Input)" : "Converted Weight (Tons)"}
                  </div>
                  <div className="text-4xl font-bold text-slate-100">{fmt(results.outputTons)}</div>
                  <div className="text-sm text-slate-500 mt-2">tons (or {fmt(results.outputPounds)} lbs)</div>
                </div>

                <div className="flex items-center justify-center p-2 text-slate-500">
                  <ArrowRightLeft className="h-8 w-8 text-teal-500/50" />
                </div>

                <div className="bg-slate-900 rounded-md p-6 border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)] flex flex-col justify-center text-center">
                  <div className="text-sm uppercase tracking-wider text-teal-400 mb-2">
                    {results.mode === "tons_to_yards" ? "Converted Volume (Yards)" : "Volume (Input)"}
                  </div>
                  <div className="text-4xl font-bold text-teal-400">{fmt(results.outputYards)}</div>
                  <div className="text-sm text-teal-500/70 mt-2">Cubic Yards (yd³)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
