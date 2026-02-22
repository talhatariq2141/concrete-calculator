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
import { Info, Printer, Calculator } from "lucide-react";

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
            <span className={`${highlight ? "text-teal-400" : "text-slate-200"} font-semibold`}>{v}</span>
        </div>
    );
}

/* ------------------ Component ------------------ */
export default function ConcreteSlabCostCalc() {
    // Dimensions
    const [length, setLength] = useState<string>("");
    const [lengthUnit, setLengthUnit] = useState<LinearUnit>("feet");
    const [width, setWidth] = useState<string>("");
    const [widthUnit, setWidthUnit] = useState<LinearUnit>("feet");
    const [thickness, setThickness] = useState<string>("");
    const [thicknessUnit, setThicknessUnit] = useState<LinearUnit>("inches");

    // Costs & Params
    const [concretePrice, setConcretePrice] = useState<string>("160");
    const [laborRate, setLaborRate] = useState<string>("8");
    const [extraRate, setExtraRate] = useState<string>("0");
    const [overrun, setOverrun] = useState<string>("10");
    const [bagPrice, setBagPrice] = useState<string>("6");

    // Options
    const [method, setMethod] = useState<"ready-mix" | "bagged">("ready-mix");

    // UI flow
    const [submitted, setSubmitted] = useState(false);

    // Calculations
    const calc = useMemo(() => {
        const L = parseFloat(length);
        const W = parseFloat(width);
        const T = parseFloat(thickness);
        const cPrice = parseFloat(concretePrice) || 0;
        const lRate = parseFloat(laborRate) || 0;
        const eRate = parseFloat(extraRate) || 0;
        const orPercent = (parseFloat(overrun) || 0) / 100;
        const bPrice = parseFloat(bagPrice) || 0;

        if ([L, W, T].some((v) => Number.isNaN(v) || v < 0)) return null;

        // 1. Core Dimensions in Meters (internal base)
        const Lm = L * toMetersFactor[lengthUnit];
        const Wm = W * toMetersFactor[widthUnit];
        const Tm = T * toMetersFactor[thicknessUnit];

        const area_m2 = Lm * Wm;
        const volume_m3 = area_m2 * Tm;

        // 2. Converions to common US units for calculation
        const area_sqft = area_m2 / (0.3048 ** 2);
        const volume_cuft = volume_m3 / (0.3048 ** 3);
        const volume_cuyd = volume_cuft / 27;

        // 3. Adjusted Volume (with waste)
        const adjusted_cuyd = volume_cuyd * (1 + orPercent);

        // 4. Labor & Extras (based on physical area)
        const labor_total = area_sqft * lRate;
        const extra_total = area_sqft * eRate;

        // 5. Material Costs
        // Ready mix uses price per cubic yard
        const material_ready_mix = adjusted_cuyd * cPrice;

        // Bagged mix: 1 cubic yard ≈ 45 bags (80 lb)
        const bags_required = Math.ceil(adjusted_cuyd * 45);
        const material_bagged = bags_required * bPrice;

        const material_total = method === "ready-mix" ? material_ready_mix : material_bagged;
        const total_cost = material_total + labor_total + extra_total;

        return {
            area_sqft,
            volume_cuyd,
            adjusted_cuyd,
            bags_required,
            material_total,
            labor_total,
            extra_total,
            total_cost,
        };
    }, [length, width, thickness, lengthUnit, widthUnit, thicknessUnit, concretePrice, laborRate, extraRate, overrun, bagPrice, method]);

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
        setConcretePrice("160");
        setLaborRate("8");
        setExtraRate("0");
        setOverrun("10");
        setBagPrice("6");
        setMethod("ready-mix");
        setSubmitted(false);
    };

    /* ---------------- PRINT / SAVE ---------------- */
    const LOGO_URL = "/logo.svg";

    const fmt = (n: number, decimals = 2) =>
        Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(n);

    const fmtCurrency = (n: number) =>
        Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(n);

    const buildPrintHtml = () => {
        if (!calc) return "";

        const now = new Date().toLocaleString();
        const lengthStr = `${length || 0} ${unitAbbrev[lengthUnit]}`;
        const widthStr = `${width || 0} ${unitAbbrev[widthUnit]}`;
        const thicknessStr = `${thickness || 0} ${unitAbbrev[thicknessUnit]}`;

        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Concrete Slab Cost Estimate – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, -apple-system, sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand img { height: 36px; width: auto; }
    .brand-name { font-weight: 800; font-size: 18px; color: #0f766e; }
    .meta { margin-left: auto; text-align: right; color: #475569; font-size: 12px; }
    h1 { margin: 0; font-size: 22px; color: #0f172a; }
    h2 { font-size: 16px; margin: 24px 0 12px; color: #0f766e; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #fff; }
    .kv { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin-bottom: 4px; }
    .kv .k { color: #475569; }
    .kv .v { color: #0f172a; font-weight: 700; }
    .total-card { background: #f0fdfa; border: 2px solid #0f766e; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
    .total-val { font-size: 32px; font-weight: 800; color: #0f766e; }
    .muted { color: #475569; font-size: 11px; }
    .label { text-transform: uppercase; letter-spacing: .02em; font-size: 11px; color: #64748b; margin-bottom: 4px; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 12px; }
    @media print { @page { margin: 12mm; } .footer { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta">
        <div>Concrete Slab Cost Estimate</div>
        <div>Date: ${now}</div>
      </div>
    </div>

    <h1>Slab Project Dimensions</h1>
    <div class="grid">
      <div class="kv"><div class="k">Length</div><div class="v">${lengthStr}</div></div>
      <div class="kv"><div class="k">Width</div><div class="v">${widthStr}</div></div>
      <div class="kv"><div class="k">Thickness</div><div class="v">${thicknessStr}</div></div>
      <div class="kv"><div class="k">Area</div><div class="v">${fmt(calc.area_sqft)} sq ft</div></div>
      <div class="kv"><div class="k">Volume</div><div class="v">${fmt(calc.volume_cuyd, 3)} yd³</div></div>
      <div class="kv"><div class="k">Incl. Waste (${overrun}%)</div><div class="v">${fmt(calc.adjusted_cuyd, 3)} yd³</div></div>
    </div>

    <h2>Cost Components</h2>
    <div class="grid-2">
      <div class="card">
        <div class="label">Material Cost (${method === 'ready-mix' ? 'Ready Mix' : 'Bagged'})</div>
        <div style="font-size: 18px; font-weight: 700;">${fmtCurrency(calc.material_total)}</div>
        <div class="muted">${method === 'ready-mix' ? `$${concretePrice}/yd³` : `${calc.bags_required} bags @ $${bagPrice}/ea`}</div>
      </div>
      <div class="card">
        <div class="label">Labor Cost</div>
        <div style="font-size: 18px; font-weight: 700;">${fmtCurrency(calc.labor_total)}</div>
        <div class="muted">$${laborRate}/sq ft</div>
      </div>
      <div class="card">
        <div class="label">Extras (Reinforcements, etc.)</div>
        <div style="font-size: 18px; font-weight: 700;">${fmtCurrency(calc.extra_total)}</div>
        <div class="muted">$${extraRate}/sq ft</div>
      </div>
    </div>

    <div class="total-card">
      <div class="label" style="color: #0f766e; font-size: 14px; font-weight: 700;">Total Estimated Cost</div>
      <div class="total-val">${fmtCurrency(calc.total_cost)}</div>
      <div class="muted" style="margin-top: 8px;">Estimate includes materials, labor, and ${overrun}% overrun allowance.</div>
    </div>

    <div class="footer">
      Note: This is an estimate based on current market averages. Actual costs may vary by region and site conditions.
    </div>
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
            <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center flex items-center justify-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Concrete Slab Cost Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate material and labor costs for your concrete slab project.
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2 mb-4">
                    <Info className="mt-0.5 h-4 w-4 text-teal-400" />
                    <p className="text-sm text-slate-300">
                        Total cost = (Volume × Concrete Price) + (Area × Labor Rate) + (Area × Extra Rate).
                    </p>
                </div>

                <form onSubmit={handleCalculate} className="space-y-0">
                    {/* STEP 1 — Dimensions */}
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 1 — Project Dimensions</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="length" className="text-teal-500">Length</Label>
                                <div className="flex gap-1">
                                    <div className="flex-1">
                                        <NumberInput
                                            id="length"
                                            value={length}
                                            onChange={(v) => { setLength(numberOrEmpty(v)); setSubmitted(false); }}
                                            placeholder="e.g., 20"
                                            badge={unitAbbrev[lengthUnit]}
                                        />
                                    </div>
                                    <Select value={lengthUnit} onValueChange={(v: LinearUnit) => { setLengthUnit(v); setSubmitted(false); }}>
                                        <SelectTrigger className="w-24 h-11 bg-slate-700 border-slate-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {linearUnitOptions.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
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
                                            placeholder="e.g., 10"
                                            badge={unitAbbrev[widthUnit]}
                                        />
                                    </div>
                                    <Select value={widthUnit} onValueChange={(v: LinearUnit) => { setWidthUnit(v); setSubmitted(false); }}>
                                        <SelectTrigger className="w-24 h-11 bg-slate-700 border-slate-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {linearUnitOptions.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
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
                                            placeholder="e.g., 4"
                                            badge={unitAbbrev[thicknessUnit]}
                                        />
                                    </div>
                                    <Select value={thicknessUnit} onValueChange={(v: LinearUnit) => { setThicknessUnit(v); setSubmitted(false); }}>
                                        <SelectTrigger className="w-24 h-11 bg-slate-700 border-slate-700 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {linearUnitOptions.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* STEP 2 — Cost Factors */}
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 2 — Cost Factors & Preferences</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <Label className="text-teal-500">Supply Method</Label>
                                <Select value={method} onValueChange={(v: string) => { setMethod(v as "ready-mix" | "bagged"); setSubmitted(false); }}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        <SelectItem value="ready-mix">Ready Mix (Truck)</SelectItem>
                                        <SelectItem value="bagged">Bagged (DIY)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {method === "ready-mix" ? (
                                <div>
                                    <Label htmlFor="cPrice" className="text-teal-500">Price per Cubic Yard</Label>
                                    <NumberInput
                                        id="cPrice"
                                        value={concretePrice}
                                        onChange={(v) => { setConcretePrice(numberOrEmpty(v)); setSubmitted(false); }}
                                        badge="$"
                                    />
                                    <p className="text-[10px] text-white/50 mt-1">Avg: $150 – $180/yd³</p>
                                </div>
                            ) : (
                                <div>
                                    <Label htmlFor="bPrice" className="text-teal-500">Price per Bag (80lb)</Label>
                                    <NumberInput
                                        id="bPrice"
                                        value={bagPrice}
                                        onChange={(v) => { setBagPrice(numberOrEmpty(v)); setSubmitted(false); }}
                                        badge="$"
                                    />
                                    <p className="text-[10px] text-white/50 mt-1">Avg: $5 – $8 per bag</p>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="lRate" className="text-teal-500">Labor Rate ($/sq ft)</Label>
                                <NumberInput
                                    id="lRate"
                                    value={laborRate}
                                    onChange={(v) => { setLaborRate(numberOrEmpty(v)); setSubmitted(false); }}
                                    badge="$"
                                />
                                <p className="text-[10px] text-white/50 mt-1">Avg: $3 – $10/sq ft</p>
                            </div>

                            <div>
                                <Label htmlFor="overrun" className="text-teal-500">Waste allowance (%)</Label>
                                <NumberInput
                                    id="overrun"
                                    value={overrun}
                                    onChange={(v) => { setOverrun(numberOrEmpty(v)); setSubmitted(false); }}
                                    badge="%"
                                />
                                <p className="text-[10px] text-white/50 mt-1">Recommended: 10 – 15%</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="eRate" className="text-teal-500">Extras & Reinforcements ($/sq ft)</Label>
                            <NumberInput
                                id="eRate"
                                value={extraRate}
                                onChange={(v) => { setExtraRate(numberOrEmpty(v)); setSubmitted(false); }}
                                placeholder="Rebar, gravel base, etc."
                                badge="$"
                            />
                            <p className="text-[10px] text-white/50 mt-1">Leave 0 if everything is included in your labor rate.</p>
                        </div>
                    </section>

                    {/* ACTIONS */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="h-11 flex-1 rounded-sm bg-teal-400 text-slate-900 font-bold hover:bg-teal-300">
                            Calculate Total Estimate
                        </Button>
                        <Button type="button" onClick={resetAll} className="h-11 rounded-sm bg-slate-600 text-white hover:bg-slate-500">
                            Reset
                        </Button>
                    </div>
                </form>

                {/* RESULTS */}
                {!submitted ? (
                    <div className="mt-8 text-center py-10 border-2 border-dashed border-slate-700 rounded-lg">
                        <p className="text-slate-400">Enter your dimensions and costs above to see your project estimate.</p>
                    </div>
                ) : calc === null ? (
                    <p className="mt-4 text-sm text-red-300">Please enter valid dimensions.</p>
                ) : (
                    <div className="mt-8 space-y-6">
                        <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-sm border border-slate-700">
                            <div>
                                <h4 className="text-white font-semibold">Ready to Order?</h4>
                                <p className="text-xs text-white/60">Save this estimate as a PDF for your records.</p>
                            </div>
                            <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-500 text-white gap-2">
                                <Printer className="h-4 w-4" />
                                Print / Save PDF
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <KV k="Total Slab Area" v={`${fmt(calc.area_sqft)} sq ft`} />
                                    <KV k="Base Concrete Vol." v={`${fmt(calc.volume_cuyd, 3)} yd³`} />
                                    <KV k="Total Volume (+Waste)" v={`${fmt(calc.adjusted_cuyd, 3)} yd³`} highlight />
                                    {method === 'bagged' && (
                                        <KV k="80lb Bags Required" v={`${calc.bags_required} bags`} highlight />
                                    )}
                                </div>

                                <div className="bg-slate-900 border border-slate-700 p-4 rounded-sm">
                                    <h4 className="text-xs font-bold text-white/70 uppercase mb-3">Cost Breakdown</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Materials ({method === 'ready-mix' ? 'Ready Mix' : 'Bagged'})</span>
                                            <span className="text-white">{fmtCurrency(calc.material_total)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Labor Quote</span>
                                            <span className="text-white">{fmtCurrency(calc.labor_total)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">Reinforcements & Add-ons</span>
                                            <span className="text-white">{fmtCurrency(calc.extra_total)}</span>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between font-bold text-lg">
                                            <span className="text-teal-400">Total Project Estimate</span>
                                            <span className="text-teal-400">{fmtCurrency(calc.total_cost)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-teal-900/10 border border-teal-500/30 p-5 rounded-sm flex flex-col items-center justify-center text-center">
                                <div className="text-xs uppercase text-teal-400 font-bold tracking-widest mb-1">Total Estimated Cost</div>
                                <div className="text-4xl font-black text-white">{fmtCurrency(calc.total_cost)}</div>
                                <div className="mt-3 text-[11px] text-white/50 leading-tight">
                                    This includes ${fmtCurrency(calc.material_total)} for concrete and ${fmtCurrency(calc.labor_total + calc.extra_total)} for installation and prep.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
