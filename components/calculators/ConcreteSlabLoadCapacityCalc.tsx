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
import { Info, Printer, Calculator, ShieldCheck, AlertTriangle } from "lucide-react";

/* -------------------- Types -------------------- */
interface Rebar {
    label: string;
    diameter: number; // in
    area: number;     // in2
}

const REBAR_TABLE: Rebar[] = [
    { label: "#3", diameter: 0.375, area: 0.11 },
    { label: "#4", diameter: 0.500, area: 0.20 },
    { label: "#5", diameter: 0.625, area: 0.31 },
    { label: "#6", diameter: 0.750, area: 0.44 },
    { label: "#7", diameter: 0.875, area: 0.60 },
    { label: "#8", diameter: 1.000, area: 0.79 },
];

/* ---------------- UI shared classes ---------------- */
const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
    "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass =
    "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

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

function KV({ k, v, highlight = false, alert = false }: { k: string; v: string; highlight?: boolean; alert?: boolean }) {
    let borderColor = "border-slate-700";
    let textColor = "text-slate-200";
    let bgColor = "bg-slate-900";

    if (highlight) {
        borderColor = "border-teal-500/50";
        textColor = "text-teal-400";
        bgColor = "bg-teal-500/5";
    } else if (alert) {
        borderColor = "border-red-500/50";
        textColor = "text-red-400";
        bgColor = "bg-red-500/5";
    }

    return (
        <div className={`flex items-center justify-between rounded-sm border ${borderColor} ${bgColor} p-2 text-sm`}>
            <span className="text-white/70">{k}</span>
            <span className={`${textColor} font-semibold text-right`}>{v}</span>
        </div>
    );
}

/* ------------------ Component ------------------ */
export default function ConcreteSlabLoadCapacityCalc() {
    // Geometry
    const [thickness, setThickness] = useState<string>("6");
    const [span, setSpan] = useState<string>("12");

    // Materials
    const [fc, setFc] = useState<string>("4000");
    const [fy, setFy] = useState<string>("60000");
    const [gammaC, setGammaC] = useState<string>("150");

    // Reinforcement
    const [barSize, setBarSize] = useState<string>("#4");
    const [spacing, setSpacing] = useState<string>("12");
    const [cover, setCover] = useState<string>("0.75");

    // Loads
    const [superDead, setSuperDead] = useState<string>("10");
    const [reqLive, setReqLive] = useState<string>("");

    const [submitted, setSubmitted] = useState(false);

    // Constants
    const phiM = 0.9;
    const phiV = 0.75;
    const lambda = 1.0;
    const b = 12; // 12-inch strip

    // Calculations
    const calc = useMemo(() => {
        const h = parseFloat(thickness);
        const L = parseFloat(span);
        const fcp = parseFloat(fc);
        const fyp = parseFloat(fy);
        const gC = parseFloat(gammaC);
        const s = parseFloat(spacing);
        const cov = parseFloat(cover);
        const sd = parseFloat(superDead) || 0;
        const rl = parseFloat(reqLive) || 0;

        if ([h, L, fcp, fyp, gC, s, cov].some((v) => Number.isNaN(v) || v <= 0)) return null;

        const bar = REBAR_TABLE.find((b) => b.label === barSize);
        if (!bar) return null;

        // 1. Effective depth
        const d = h - cov - bar.diameter / 2;
        if (d <= 0) return { error: "Clear cover exceeds slab thickness. Increase thickness or reduce cover." };

        // 2. Steel Area per foot
        const As = bar.area * (12 / s);

        // 3. Flexural Capacity
        const a = (As * fyp) / (0.85 * fcp * b);
        if (a >= d) return { error: "Slab is over-reinforced or geometry is invalid (a ≥ d)." };

        const Mn = As * fyp * (d - a / 2); // lb-in
        const phiMn = phiM * Mn;

        const Lin = L * 12;
        // Moment limited factored load wu (lb/in)
        const wuM_lb_in = (8 * phiMn) / (Lin ** 2);
        const wuM_psf = wuM_lb_in * 12;

        // 4. Shear Capacity
        const phiVc = phiV * 2 * lambda * Math.sqrt(fcp) * b * d; // lb
        // Shear limited factored load wu (lb/in)
        const wuV_lb_in = (2 * phiVc) / Lin;
        const wuV_psf = wuV_lb_in * 12;

        // 5. Governing Factored Capacity
        const wu_max = Math.min(wuM_psf, wuV_psf);
        const mode = wuM_psf <= wuV_psf ? "Flexure" : "Shear";

        // 6. Dead Loads
        const selfWeight = gC * (h / 12);
        const totalDead = selfWeight + sd;

        // 7. Service Live Load Capacity
        // wu = 1.2D + 1.6L
        const Lmax = (wu_max - 1.2 * totalDead) / 1.6;

        // 8. Required comparison
        const comparison = rl > 0 ? (rl <= Lmax ? "Pass" : "Fail") : null;

        return {
            d,
            As,
            a,
            phiMn,
            phiVc,
            wuM_psf,
            wuV_psf,
            wu_max,
            mode,
            selfWeight,
            totalDead,
            Lmax: Math.max(0, Lmax),
            comparison,
            isLmaxPositive: Lmax >= 0,
        };
    }, [thickness, span, fc, fy, gammaC, barSize, spacing, cover, superDead, reqLive]);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };


    const resetAll = () => {
        setThickness("6");
        setSpan("12");
        setFc("4000");
        setFy("60000");
        setGammaC("150");
        setBarSize("#4");
        setSpacing("12");
        setCover("0.75");
        setSuperDead("10");
        setReqLive("");
        setSubmitted(false);
    };

    /* ---------------- PRINT / SAVE ---------------- */
    const fmt = (n: number, decimals = 2) =>
        Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(n);

    const buildPrintHtml = () => {
        if (!calc || "error" in calc) return "";

        const now = new Date().toLocaleString();
        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Slab Load Capacity Estimate – Print View</title>
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

  <h1>Structural Slab Load Capacity</h1>
  
  <div class="grid">
    <div class="card">
      <div class="label">Slab Geometry</div>
      <div class="value">${thickness}″ Thick • ${span}′ Span</div>
      <div style="font-size: 12px; color: #64748b;">Reinforced with ${barSize} @ ${spacing}″ OC</div>
    </div>
    <div class="card">
      <div class="label">Material Properties</div>
      <div class="value">f'c: ${fc} psi • fy: ${fy} psi</div>
    </div>
  </div>

  <div class="card">
    <div class="label">Analysis Results</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div>Design Moment (φMn): ${fmt(calc.phiMn / 12, 0)} lb-ft/ft</div>
      <div>Design Shear (φVc): ${fmt(calc.phiVc, 0)} lb/ft</div>
      <div>Total Dead Load: ${fmt(calc.totalDead, 1)} psf</div>
      <div>Governing Mode: ${calc.mode}</div>
    </div>
  </div>

  <div class="total-box">
    <div class="total-label">Max Service Live Load Capacity</div>
    <div class="total-value">${fmt(calc.Lmax, 1)} psf</div>
    <div style="font-size: 14px; color: #0f766e; font-weight: 600; margin-top: 10px;">
      Total Factored Capacity (wu): ${fmt(calc.wu_max, 1)} psf
    </div>
  </div>

  <div class="footer">
    Estimate based on ACI 318 Strength Design for one-way suspended slabs. Does not account for deflections, cracking, or punching shear. Always verify with a licensed structural engineer.
  </div>
  <script>window.addEventListener('load', () => { setTimeout(() => { window.print(); }, 100); });</script>
</body>
</html>`;
    };

    const handlePrint = () => {
        if (!calc || "error" in calc) return;
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
                    <Calculator className="h-6 w-6" />
                    Concrete Slab Load Capacity Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 italic">
                    Structural capacity estimation for reinforced one-way suspended slabs (ACI 318 basis).
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2 mb-6 shadow-sm">
                    <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                        This tool computes the <span className="text-white">allowable service live load</span> using LRFD strength combinations (1.2D + 1.6L).
                        It assumes a tension-controlled rectangular section. <span className="text-red-400 font-bold uppercase">Disclaimer:</span> Preliminary estimates only; not professional engineering design.
                    </p>
                </div>

                <form onSubmit={handleCalculate}>
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 1 — Geometry & Materials</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <Label htmlFor="thickness" className="text-slate-300">Slab Thickness</Label>
                                <NumberInput id="thickness" value={thickness} onChange={setThickness} badge="in" />
                            </div>
                            <div>
                                <Label htmlFor="span" className="text-slate-300">Clear Span (Center to Center)</Label>
                                <NumberInput id="span" value={span} onChange={setSpan} badge="ft" />
                            </div>
                            <div>
                                <Label htmlFor="fc" className="text-slate-300">Concrete Strength (f&apos;c)</Label>
                                <NumberInput id="fc" value={fc} onChange={setFc} badge="psi" />
                            </div>
                            <div>
                                <Label htmlFor="gamma" className="text-slate-300">Concrete Density</Label>
                                <NumberInput id="gamma" value={gammaC} onChange={setGammaC} badge="pcf" />
                            </div>
                        </div>
                    </section>

                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 2 — Reinforcement Detailing</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <Label className="text-slate-300">Bar Size</Label>
                                <Select value={barSize} onValueChange={setBarSize}>
                                    <SelectTrigger className={selectTriggerClass}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={selectContentClass}>
                                        {REBAR_TABLE.map(r => (
                                            <SelectItem key={r.label} value={r.label}>{r.label} (Area: {r.area} in²)</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="spacing" className="text-slate-300">Bar Spacing (OC)</Label>
                                <NumberInput id="spacing" value={spacing} onChange={setSpacing} badge="in" />
                            </div>
                            <div>
                                <Label htmlFor="cover" className="text-slate-300">Clear Cover</Label>
                                <NumberInput id="cover" value={cover} onChange={setCover} badge="in" />
                            </div>
                            <div>
                                <Label htmlFor="fy" className="text-slate-300">Steel Yield (fy)</Label>
                                <NumberInput id="fy" value={fy} onChange={setFy} badge="psi" />
                            </div>
                        </div>
                    </section>

                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 3 — Loading Environment</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="superDead" className="text-slate-300">Superimposed Dead Load</Label>
                                <NumberInput id="superDead" value={superDead} onChange={setSuperDead} badge="psf" placeholder="Finishes, partitions..." />
                            </div>
                            <div>
                                <Label htmlFor="reqLive" className="text-slate-300">Required Service Live Load (Optional)</Label>
                                <NumberInput id="reqLive" value={reqLive} onChange={setReqLive} badge="psf" placeholder="Compare with capacity..." />
                            </div>
                        </div>
                    </section>

                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        <Button type="submit" className="h-12 flex-1 rounded-sm bg-teal-400 text-slate-900 font-bold hover:bg-teal-300 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                            Analyze Capacity
                        </Button>
                        <Button type="button" onClick={resetAll} className="h-12 rounded-sm bg-slate-600 text-white hover:bg-slate-500 px-8 font-semibold">
                            Reset
                        </Button>
                    </div>
                </form>

                {submitted && calc && (
                    <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-700">
                        {"error" in calc ? (
                            <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-sm flex items-center gap-4">
                                <AlertTriangle className="h-8 w-8 text-red-500 flex-shrink-0" />
                                <p className="text-red-400 font-medium">{calc.error}</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800/40 p-5 rounded-sm border border-slate-700 mb-8 gap-4">
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-teal-400" />
                                            Structural Analysis Complete
                                        </h4>
                                        <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">ACI 318 Strength Design Checks Performed</p>
                                    </div>
                                    <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-500 text-white gap-2 h-10 px-6 font-bold rounded-sm transition-colors">
                                        <Printer className="h-4 w-4" />
                                        Print PDF Estimate
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Result Panel */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left">
                                            <div className={`bg-slate-900 border ${calc.comparison === "Pass" ? "border-green-500/50" : calc.comparison === "Fail" ? "border-red-500/50" : "border-slate-700"} p-5 rounded-sm shadow-inner`}>
                                                <div className="text-[10px] uppercase text-white/50 font-black tracking-tightest mb-1">Max Service Live Load</div>
                                                <div className="text-3xl font-black text-white">{fmt(calc.Lmax)} <span className="text-sm font-normal text-white/40">psf</span></div>
                                                {calc.comparison && (
                                                    <div className={`mt-2 text-xs font-bold uppercase ${calc.comparison === "Pass" ? "text-green-400" : "text-red-400"}`}>
                                                        Status: {calc.comparison}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-slate-900 border border-slate-700 p-5 rounded-sm shadow-inner">
                                                <div className="text-[10px] uppercase text-white/50 font-black tracking-widest mb-1">Factored Load capacity (wu)</div>
                                                <div className="text-3xl font-black text-white">{fmt(calc.wu_max)} <span className="text-sm font-normal text-white/40">psf</span></div>
                                                <div className="mt-2 text-[10px] text-teal-400 font-bold uppercase underline decoration-teal-500/30 underline-offset-4 tracking-tighter">
                                                    Governing: {calc.mode} Strength
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 border border-slate-700 p-6 rounded-sm shadow-inner overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-2 text-[8px] text-white/5 font-black uppercase tracking-widest select-none pointer-events-none transform rotate-90 origin-top-right">Design Parameters</div>
                                            <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-6 border-b border-teal-500/10 pb-2">Analysis Breakdown</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                                <KV k="Effective Depth (d)" v={`${fmt(calc.d)} in`} />
                                                <KV k="Steel Area (As)" v={`${fmt(calc.As, 3)} in²/ft`} />
                                                <KV k="Comp. Depth (a)" v={`${fmt(calc.a, 3)} in`} />
                                                <KV k="Self-Weight (D_slab)" v={`${fmt(calc.selfWeight, 1)} psf`} />
                                                <KV k="Design Moment (φMn)" v={`${fmt(calc.phiMn / 12, 0)} lb-ft/ft`} />
                                                <KV k="Design Shear (φVc)" v={`${fmt(calc.phiVc, 0)} lb/ft`} />
                                                <KV k="Flex capacity (wu_m)" v={`${fmt(calc.wuM_psf, 0)} psf`} />
                                                <KV k="Shear capacity (wu_v)" v={`${fmt(calc.wuV_psf, 0)} psf`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Visual */}
                                    <div className="bg-slate-900 border border-slate-700 rounded-sm p-1 shadow-2xl">
                                        <div className="h-full rounded-sm bg-gradient-to-br from-slate-800 to-slate-950 p-8 flex flex-col items-center justify-center text-center">
                                            <div className="p-4 bg-teal-500/10 rounded-full mb-6 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                                                <WeightIndicator val={calc.Lmax} />
                                            </div>
                                            <div className="text-[10px] uppercase text-teal-400 font-black tracking-[0.3em] mb-3">Live Load capacity</div>
                                            <div className="text-6xl font-black text-white tracking-tighter">{fmt(calc.Lmax, 0)}</div>
                                            <div className="text-xl font-bold text-teal-400 mt-2 lowercase italic opacity-80">pounds per sq ft</div>

                                            {!calc.isLmaxPositive && (
                                                <div className="mt-6 p-3 bg-red-900/30 border border-red-500/50 rounded-sm text-red-400 text-[10px] font-bold uppercase leading-tight">
                                                    Warning: Dead loads exceed factored strength. Increase slab thickness or rebar.
                                                </div>
                                            )}

                                            <div className="mt-10 pt-8 border-t border-white/5 w-full flex flex-col gap-2">
                                                <div className="text-[10px] uppercase text-white/30 font-bold tracking-widest">Structural Basis</div>
                                                <div className="text-white text-xs font-medium">U = 1.2D + 1.6L (ASCE 7)</div>
                                                <div className="text-white text-xs font-medium opacity-60 italic">φm=0.9, φv=0.75</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function WeightIndicator({ val }: { val: number }) {
    // Simple visual representation of "load"
    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div
                className="absolute inset-0 border-4 border-teal-400 rounded-full transition-all duration-1000"
                style={{ clipPath: `inset(${100 - Math.min(100, (val / 500) * 100)}% 0 0 0)` }}
            ></div>
            <ShieldCheck className="h-8 w-8 text-teal-400" />
        </div>
    );
}
