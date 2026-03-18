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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Info, Printer } from "lucide-react";

/* ===================== Types ===================== */
type LinearUnit = "in" | "ft" | "cm" | "m";
type PriceMode = "ton" | "yard";
type GravelType = "general" | "pea" | "crushed" | "custom";

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
  materialQuantityYds: number;
  materialQuantityTons: number;
  densityUsed: number;
  pricePerUnit: number;
  priceMode: PriceMode;
  materialCost: number;
  deliveryCost: number;
  totalCost: number;
};

export default function GravelCostCalculator() {
  const [tab, setTab] = useState<"dimensions" | "known">("dimensions");

  // Dimensions Tab state
  const [unit, setUnit] = useState<LinearUnit>("ft");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("10");
  const [depth, setDepth] = useState("2");
  const [depthUnit, setDepthUnit] = useState<LinearUnit>("in");
  const [wastePct, setWastePct] = useState("5");
  
  // Density sharing
  const [gravelType, setGravelType] = useState<GravelType>("general");
  const [customDensity, setCustomDensity] = useState("105");

  // Known Quantity Tab State
  const [knownMode, setKnownMode] = useState<PriceMode>("yard");
  const [knownQty, setKnownQty] = useState("5");

  // Cost Data
  const [priceMode, setPriceMode] = useState<PriceMode>("ton");
  const [price, setPrice] = useState("45");
  const [deliveryFee, setDeliveryFee] = useState("120");

  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const canCalculate = useMemo(() => {
    if (tab === "dimensions") {
      const l = parseFloat(length);
      const w = parseFloat(width);
      const d = parseFloat(depth);
      if (!(l > 0 && w > 0 && d > 0)) return false;
    } else {
      const q = parseFloat(knownQty);
      if (!(q > 0)) return false;
    }
    const p = parseFloat(price);
    if (!(p > 0)) return false;
    if (gravelType === "custom" && !(parseFloat(customDensity) > 0)) return false;
    return true;
  }, [tab, length, width, depth, knownQty, price, gravelType, customDensity]);

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    let volume_yd3 = 0;
    let weight_tons = 0;
    
    const density = gravelType === "custom" ? Math.max(0, parseFloat(customDensity || "105")) : GRAVEL_DENSITIES[gravelType];
    const tonsPerYard = (27 * density) / 2000;

    if (tab === "dimensions") {
      const area_ft2 = toFeet(parseFloat(length), unit) * toFeet(parseFloat(width), unit);
      const depth_ft = toFeet(parseFloat(depth), depthUnit);
      const volume_ft3_raw = area_ft2 * depth_ft;
      
      const waste = Math.max(0, parseFloat(wastePct || "0"));
      const volume_ft3 = volume_ft3_raw * (1 + waste / 100);
      
      volume_yd3 = ft3ToYd3(volume_ft3);
      weight_tons = volume_yd3 * tonsPerYard;
    } else {
      const q = parseFloat(knownQty);
      if (knownMode === "yard") {
        volume_yd3 = q;
        weight_tons = q * tonsPerYard;
      } else {
        weight_tons = q;
        volume_yd3 = q / tonsPerYard;
      }
    }

    const p = parseFloat(price);
    let materialCost = 0;
    if (priceMode === "ton") {
      materialCost = weight_tons * p;
    } else {
      materialCost = volume_yd3 * p;
    }

    const dCost = parseFloat(deliveryFee || "0");
    const totalCost = materialCost + dCost;

    setResults({
      materialQuantityYds: volume_yd3,
      materialQuantityTons: weight_tons,
      densityUsed: density,
      pricePerUnit: p,
      priceMode,
      materialCost,
      deliveryCost: dCost,
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
  <title>Gravel Cost Calculator – Print View</title>
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
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
    th { font-size: 11px; text-transform: uppercase; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div><strong>Concrete Calculator Max</strong><br/>Gravel Cost Calculator</div>
      <div>Printed: ${now}</div>
    </div>
    
    <h2>Cost Estimate Statement</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Estimated Qty</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Material Cost (Quoted per ${results.priceMode})</td>
          <td>${fmt(results.priceMode === 'ton' ? results.materialQuantityTons : results.materialQuantityYds)} ${results.priceMode === 'ton' ? 'Tons' : 'yd³'}</td>
          <td>$${fmt(results.pricePerUnit)}</td>
          <td>$${fmt(results.materialCost)}</td>
        </tr>
        ${results.deliveryCost > 0 ? `
        <tr>
          <td>Delivery Fee</td>
          <td>1</td>
          <td>$${fmt(results.deliveryCost)}</td>
          <td>$${fmt(results.deliveryCost)}</td>
        </tr>
        ` : ""}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right; font-weight: bold; padding-top: 15px;">Total Estimated Cost:</td>
          <td style="font-weight: bold; font-size: 18px; color: #0f766e; padding-top: 15px;">$${fmt(results.totalCost)}</td>
        </tr>
      </tfoot>
    </table>

    <div style="margin-top: 40px; font-size: 12px; color: #94a3b8;">
      * Material estimated weight: ${fmt(results.materialQuantityTons)} tons.<br/>
      * Material estimated volume: ${fmt(results.materialQuantityYds)} yd³.<br/>
      * Density constraint: ${results.densityUsed} lb/ft³.<br/>
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
          Gravel Cost Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate total material and delivery costs for gravel projects.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setSubmitted(false); }} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="dimensions" className="data-[state=active]:bg-teal-500 data-[state=active]:text-slate-900">
              Calculate from Dimensions
            </TabsTrigger>
            <TabsTrigger value="known" className="data-[state=active]:bg-teal-500 data-[state=active]:text-slate-900">
              Enter Known Quantity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dimensions" className="mt-4 p-4 border border-slate-700 rounded-md bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">Project Dimensions</h3>
              <div className="w-32">
                <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                  <SelectTrigger className={cn(selectTriggerClass, "h-9")} aria-label="Units">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Length">
                <NumberInput value={length} onChange={(v) => { setLength(v); setSubmitted(false); }} placeholder="20" badge={unitAbbrev[unit]} />
              </Field>
              <Field label="Width">
                <NumberInput value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder="10" badge={unitAbbrev[unit]} />
              </Field>
              <Field label="Depth">
                <div className="flex gap-2">
                  <NumberInput value={depth} onChange={(v) => { setDepth(v); setSubmitted(false); }} placeholder="2" />
                  <Select value={depthUnit} onValueChange={(v) => { setDepthUnit(v as LinearUnit); setSubmitted(false); }}>
                    <SelectTrigger className={cn(selectTriggerClass, "w-20")}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="in">in</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Field>
              <Field label="Waste Factor">
                <NumberInput value={wastePct} onChange={(v) => { setWastePct(v); setSubmitted(false); }} placeholder="5" badge="%" />
              </Field>
            </div>
          </TabsContent>

          <TabsContent value="known" className="mt-4 p-4 border border-slate-700 rounded-md bg-slate-900/50">
            <h3 className="text-sm font-semibold text-white/80 mb-2">Known Quantity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
              <Field label="Quantity">
                <div className="flex gap-2">
                  <NumberInput value={knownQty} onChange={(v) => { setKnownQty(v); setSubmitted(false); }} placeholder="5" />
                  <Select value={knownMode} onValueChange={(v) => { setKnownMode(v as PriceMode); setSubmitted(false); }}>
                    <SelectTrigger className={cn(selectTriggerClass, "w-32")}><SelectValue /></SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="ton">Tons</SelectItem>
                      <SelectItem value="yard">Cubic Yards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Field>
            </div>
          </TabsContent>
        </Tabs>

        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80 mb-2">Pricing & Material Detail</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Price">
              <div className="flex gap-2">
                <NumberInput value={price} onChange={(v) => { setPrice(v); setSubmitted(false); }} placeholder="45" badge="$" />
                <Select value={priceMode} onValueChange={(v) => { setPriceMode(v as PriceMode); setSubmitted(false); }}>
                  <SelectTrigger className={cn(selectTriggerClass, "w-32")}><SelectValue /></SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="ton">Per Ton</SelectItem>
                    <SelectItem value="yard">Per Cy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Field>
            <Field label="Delivery Fee">
              <NumberInput value={deliveryFee} onChange={(v) => { setDeliveryFee(v); setSubmitted(false); }} placeholder="120" badge="$" />
            </Field>

            <Field label="Gravel Density / Type" subHint="Required for Ton/Yd conversions">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
              <div className="sm:col-start-3">
                <Field label="Custom Density" subHint="in lb/ft³">
                  <NumberInput value={customDensity} onChange={(v) => { setCustomDensity(v); setSubmitted(false); }} placeholder="105" badge="lb/ft³" />
                </Field>
              </div>
            </div>
          )}
        </section>

        <div className="pt-6 mt-6 flex gap-4">
          <Button
            onClick={onCalculate}
            disabled={!canCalculate}
            className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold h-12 text-lg rounded-sm transition-colors disabled:opacity-50"
          >
            Calculate Free Estimate
          </Button>
        </div>

        {submitted && results && (
          <div className="mt-8 bg-slate-800 rounded-md border border-teal-500/30 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 font-poppins">
            <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-teal-400">Project Cost Estimate</h3>
              <Button onClick={handlePrint} variant="ghost" size="sm" className="text-slate-300 hover:text-teal-400 h-8 gap-2">
                <Printer className="w-4 h-4" /> Print Options
              </Button>
            </div>
            <div className="p-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center text-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Total Volume</div>
                  <div className="text-2xl font-bold text-slate-100">{fmt(results.materialQuantityYds)}</div>
                  <div className="text-xs text-slate-500 mt-1">yd³</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-slate-700 flex flex-col justify-center text-center">
                  <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Total Weight</div>
                  <div className="text-2xl font-bold text-slate-100">{fmt(results.materialQuantityTons)}</div>
                  <div className="text-xs text-slate-500 mt-1">tons</div>
                </div>
                <div className="bg-slate-900 rounded-md p-4 border border-teal-500/50 flex flex-col justify-center text-center shadow-[0_0_15px_rgba(20,184,166,0.1)]">
                  <div className="text-xs uppercase tracking-wider text-teal-400 mb-1">Estimated Cost</div>
                  <div className="text-3xl font-bold text-teal-400">${fmt(results.totalCost)}</div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2 flex justify-between">
                  <span>Invoice Breakdown</span>
                  <span className="text-xs font-normal text-slate-400">Based on ${fmt(results.pricePerUnit)} / ${results.priceMode}</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm px-2">
                    <span className="text-slate-400">Material Cost ({fmt(results.priceMode === 'ton' ? results.materialQuantityTons : results.materialQuantityYds)} {results.priceMode === 'ton' ? 'tons' : 'yd³'})</span>
                    <span className="text-slate-200">${fmt(results.materialCost)}</span>
                  </div>
                  {results.deliveryCost > 0 && (
                    <div className="flex justify-between items-center text-sm px-2">
                      <span className="text-slate-400">Delivery / Freights</span>
                      <span className="text-slate-200">${fmt(results.deliveryCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 px-2 border-t border-slate-700 mt-2 font-semibold">
                    <span className="text-white tracking-wide">TOTAL</span>
                    <span className="text-lg text-teal-400">${fmt(results.totalCost)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
