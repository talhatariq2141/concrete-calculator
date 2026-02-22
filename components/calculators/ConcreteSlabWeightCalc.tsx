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
import { Info, Printer, Weight } from "lucide-react";

/* -------------------- Types -------------------- */
type LinearUnit = "meters" | "yards" | "feet" | "inches" | "centimeter";

/* ----------------- Unit helpers ---------------- */
const toMetersFactor: Record<LinearUnit, number> = {
    meters: 1,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
    centimeter: 0.01,
};

const linearUnitOptions: { value: LinearUnit; label: string }[] = [
    { value: "feet", label: "feet" },
    { value: "inches", label: "inches" },
    { value: "yards", label: "yards" },
    { value: "meters", label: "meters" },
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

/* ---------------- Small UI helpers ---------------- */
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

function KV({ k, v, highlight = false }: { k: string; v: string; highlight?: boolean }) {
    return (
        <div className={`flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2 text-sm ${highlight ? "border-teal-500/50 bg-teal-500/5" : ""}`}>
            <span className="text-white/70">{k}</span>
            <span className={`${highlight ? "text-teal-400" : "text-slate-200"} font-semibold text-right`}>{v}</span>
        </div>
    );
}

const densities = [
    { label: "Standard Concrete", value: 150, desc: "~150 lb/ft³" },
    { label: "Reinforced Concrete", value: 156, desc: "~156 lb/ft³" },
    { label: "Lightweight Concrete", value: 110, desc: "~70–120 lb/ft³" },
];

/* ------------------ Component ------------------ */
export default function ConcreteSlabWeightCalc() {
    // Dimensions
    const [length, setLength] = useState<string>("");
    const [lengthUnit, setLengthUnit] = useState<LinearUnit>("feet");
    const [width, setWidth] = useState<string>("");
    const [widthUnit, setWidthUnit] = useState<LinearUnit>("feet");
    const [thickness, setThickness] = useState<string>("");
    const [thicknessUnit, setThicknessUnit] = useState<LinearUnit>("inches");

    // Options
    const [density, setDensity] = useState<string>("150");
    const [quantity, setQuantity] = useState<string>("1");

    // UI flow
    const [submitted, setSubmitted] = useState(false);

    // Calculations
    const calc = useMemo(() => {
        const L = parseFloat(length);
        const W = parseFloat(width);
        const T = parseFloat(thickness);
        const Q = parseFloat(quantity) || 1;
        const D = parseFloat(density) || 150;

        if ([L, W, T].some((v) => Number.isNaN(v) || v < 0)) return null;

        // 1. Core Dimensions in Meters (internal base)
        const Lm = L * toMetersFactor[lengthUnit];
        const Wm = W * toMetersFactor[widthUnit];
        const Tm = T * toMetersFactor[thicknessUnit];

        const area_m2 = Lm * Wm * Q;
        const volume_m3 = area_m2 * Tm;

        // 2. Converions to common US units for calculation
        const area_sqft = area_m2 / (0.3048 ** 2);
        const volume_cuft = volume_m3 / (0.3048 ** 3);
        const volume_cuyd = volume_cuft / 27;

        // 3. Weight Calculation
        const weight_lbs = volume_cuft * D;
        const weight_tons = weight_lbs / 2000;

        return {
            area_sqft,
            volume_cuft,
            volume_cuyd,
            weight_lbs,
            weight_tons,
            density_used: D,
        };
    }, [length, width, thickness, lengthUnit, widthUnit, thicknessUnit, density, quantity]);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const numberOrEmpty = (v: string) => (v === "" ? "" : v.replace(/[^0-9.]/g, ""));

    const resetAll = () => {
        setLength("");
        setWidth("");
        setThickness("");
        setLengthUnit("feet");
        setWidthUnit("feet");
        setThicknessUnit("inches");
        setDensity("150");
        setQuantity("1");
        setSubmitted(false);
    };

    /* ---------------- PRINT / SAVE ---------------- */

    const fmt = (n: number, decimals = 2) =>
        Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(n);

    const buildPrintHtml = () => {
        if (!calc) return "";

        const now = new Date().toLocaleString();
        const lengthStr = `${length || 0} ${unitAbbrev[lengthUnit]}`;
        const widthStr = `${width || 0} ${unitAbbrev[widthUnit]}`;
        const thicknessStr = `${thickness || 0} ${unitAbbrev[thicknessUnit]}`;
        const qtyStr = quantity || "1";

        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Concrete Slab Weight Estimate – Print View</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.5; padding: 40px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f766e; padding-bottom: 15px; margin-bottom: 30px; }
    .brand { font-weight: 800; font-size: 20px; color: #0f766e; }
    h1 { font-size: 24px; margin-bottom: 10px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: #f9fafb; }
    .label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
    .value { font-size: 18px; font-weight: 700; color: #0f172a; }
    .total-box { background: #f0fdfa; border: 2px solid #0f766e; border-radius: 12px; padding: 25px; text-align: center; margin-top: 40px; }
    .total-label { color: #0f766e; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; }
    .total-value { font-size: 40px; font-weight: 800; color: #0f766e; }
    .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e5e7eb; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Concrete Calculator Max</div>
    <div style="text-align: right; font-size: 12px;">Date: ${now}</div>
  </div>

  <h1>Slab Weight Estimate</h1>
  
  <div class="grid">
    <div class="card">
      <div class="label">Slab Dimensions</div>
      <div class="value">${lengthStr} × ${widthStr} × ${thicknessStr}</div>
      <div style="font-size: 12px; color: #64748b;">Quantity: ${qtyStr}</div>
    </div>
    <div class="card">
      <div class="label">Concrete Density</div>
      <div class="value">${calc.density_used} lb/ft³</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="label">Total Surface Area</div>
      <div class="value">${fmt(calc.area_sqft)} sq ft</div>
    </div>
    <div class="card">
      <div class="label">Total Volume</div>
      <div class="value">${fmt(calc.volume_cuyd, 3)} yd³</div>
      <div style="font-size: 12px; color: #64748b;">(${fmt(calc.volume_cuft)} ft³)</div>
    </div>
  </div>

  <div class="total-box">
    <div class="total-label">Estimated Total Weight</div>
    <div class="total-value">${fmt(calc.weight_lbs, 0)} lbs</div>
    <div style="font-size: 18px; color: #0f766e; font-weight: 600;">≈ ${fmt(calc.weight_tons, 2)} short tons</div>
  </div>

  <div class="footer">
    Estimate based on selected density. Physical weights may vary due to mix moisture and structural reinforcements.
  </div>
  <script>window.addEventListener('load', () => { setTimeout(() => { window.print(); }, 100); });</script>
</body>
</html>`;
    };

    const handlePrint = () => {
        if (!calc) return;
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

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6 pb-2 text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center flex items-center justify-center gap-2">
                    <Weight className="h-6 w-6" />
                    Concrete Slab Weight Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1">
                    Calculate the structural weight of concrete slabs based on dimensions and mix material.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2 mb-6">
                    <Info className="mt-0.5 h-4 w-4 text-teal-400" />
                    <p className="text-sm text-slate-300">
                        Weight = Volume × Density. Standard concrete is approx. 150 lbs per cubic foot.
                    </p>
                </div>

                <form onSubmit={handleCalculate} className="space-y-0">
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 1 — Dimensions & Quantity</h3>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <Label htmlFor="length" className="text-teal-500">Length</Label>
                                <div className="flex gap-1">
                                    <div className="flex-1">
                                        <NumberInput
                                            id="length"
                                            value={length}
                                            onChange={(v) => { setLength(numberOrEmpty(v)); setSubmitted(false); }}
                                            placeholder="L"
                                            badge={unitAbbrev[lengthUnit]}
                                        />
                                    </div>
                                    <Select value={lengthUnit} onValueChange={(v: LinearUnit) => { setLengthUnit(v); setSubmitted(false); }}>
                                        <SelectTrigger className="w-20 h-11 bg-slate-700 border-slate-700 text-[10px] px-2 uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {linearUnitOptions.map(u => <SelectItem key={u.value} value={u.value} className="text-xs uppercase">{u.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="width" className="text-teal-500">Width</Label>
                                <div className="flex gap-1">
                                    <div className="flex-1">
                                        <NumberInput
                                            id="width"
                                            value={width}
                                            onChange={(v) => { setWidth(numberOrEmpty(v)); setSubmitted(false); }}
                                            placeholder="W"
                                            badge={unitAbbrev[widthUnit]}
                                        />
                                    </div>
                                    <Select value={widthUnit} onValueChange={(v: LinearUnit) => { setWidthUnit(v); setSubmitted(false); }}>
                                        <SelectTrigger className="w-20 h-11 bg-slate-700 border-slate-700 text-[10px] px-2 uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {linearUnitOptions.map(u => <SelectItem key={u.value} value={u.value} className="text-xs uppercase">{u.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="thickness" className="text-teal-500">Thickness</Label>
                                <div className="flex gap-1">
                                    <div className="flex-1">
                                        <NumberInput
                                            id="thickness"
                                            value={thickness}
                                            onChange={(v) => { setThickness(numberOrEmpty(v)); setSubmitted(false); }}
                                            placeholder="T"
                                            badge={unitAbbrev[thicknessUnit]}
                                        />
                                    </div>
                                    <Select value={thicknessUnit} onValueChange={(v: LinearUnit) => { setThicknessUnit(v); setSubmitted(false); }}>
                                        <SelectTrigger className="w-20 h-11 bg-slate-700 border-slate-700 text-[10px] px-2 uppercase">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {linearUnitOptions.map(u => <SelectItem key={u.value} value={u.value} className="text-xs uppercase">{u.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="quantity" className="text-teal-500">Slab Quantity</Label>
                                <NumberInput
                                    id="quantity"
                                    value={quantity}
                                    onChange={(v) => { setQuantity(numberOrEmpty(v)); setSubmitted(false); }}
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </section>

                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 2 — Concrete Type (Density)</h3>
                        <div className="mt-4 flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <Label className="text-teal-500">Standard Presets</Label>
                                <Select value={density} onValueChange={(v) => { setDensity(v); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {densities.map(d => (
                                            <SelectItem key={d.value} value={d.value.toString()}>
                                                {d.label} ({d.desc})
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="custom">Custom Density...</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full sm:w-48">
                                <Label htmlFor="custom-density" className="text-teal-500">Density (lb/ft³)</Label>
                                <NumberInput
                                    id="custom-density"
                                    value={density}
                                    onChange={(v) => { setDensity(numberOrEmpty(v)); setSubmitted(false); }}
                                    badge="lb/ft³"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button type="submit" className="h-12 flex-1 rounded-sm bg-teal-400 text-slate-900 font-bold hover:bg-teal-300">
                            Calculate Weight
                        </Button>
                        <Button type="button" onClick={resetAll} className="h-12 rounded-sm bg-slate-600 text-white hover:bg-slate-500 px-8">
                            Reset
                        </Button>
                    </div>
                </form>

                {submitted && calc && (
                    <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800/40 p-5 rounded-sm border border-slate-700 mb-6 gap-4">
                            <div className="text-center sm:text-left">
                                <h4 className="text-white font-semibold">Results Generated</h4>
                                <p className="text-xs text-white/60">Comprehensive weight distribution for your slab project.</p>
                            </div>
                            <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-500 text-white gap-2 h-10">
                                <Printer className="h-4 w-4" />
                                Print / Save Results
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-4 lg:col-span-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-slate-900 border border-slate-700 p-5 rounded-sm">
                                        <div className="text-[10px] uppercase text-white/50 font-bold mb-1">Volume (Cubic Feet)</div>
                                        <div className="text-2xl font-bold text-white">{fmt(calc.volume_cuft)} ft³</div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-700 p-5 rounded-sm">
                                        <div className="text-[10px] uppercase text-white/50 font-bold mb-1">Volume (Cubic Yards)</div>
                                        <div className="text-2xl font-bold text-white">{fmt(calc.volume_cuyd, 3)} yd³</div>
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-700 p-5 rounded-sm">
                                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">Weight Metrics</h4>
                                    <div className="space-y-4">
                                        <KV k="Weight in Pounds (lbs)" v={`${fmt(calc.weight_lbs, 0)} lbs`} />
                                        <KV k="Weight in Short Tons" v={`${fmt(calc.weight_tons, 2)} tons`} highlight />
                                        <KV k="Total Surface Area" v={`${fmt(calc.area_sqft)} sq ft`} />
                                        <KV k="Units per Sq Ft" v={`${fmt(calc.weight_lbs / calc.area_sqft, 1)} lb/ft²`} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-teal-900/10 border border-teal-500/30 p-8 rounded-sm flex flex-col items-center justify-center text-center">
                                <Weight className="h-10 w-10 text-teal-400 mb-4" />
                                <div className="text-xs uppercase text-teal-400 font-bold tracking-widest mb-1">Estimated Total Weight</div>
                                <div className="text-5xl font-black text-white">{fmt(calc.weight_lbs, 0)}</div>
                                <div className="text-xl font-bold text-teal-400 mt-1">POUNDS (lb)</div>

                                <div className="mt-8 pt-6 border-t border-teal-500/20 w-full">
                                    <div className="text-2xl font-bold text-white">≈ {fmt(calc.weight_tons, 2)}</div>
                                    <div className="text-[10px] uppercase text-white/50 font-bold">Short Tons</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
