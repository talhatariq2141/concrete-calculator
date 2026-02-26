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
import {
    Info,
    Printer,
    Calculator,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    Truck,
} from "lucide-react";

/* -------------------- Constants -------------------- */
const INCHES_PER_FOOT = 12;
const FT3_PER_YD3 = 27;

const BAG_YIELDS: Record<number, number> = {
    40: 0.3,
    50: 0.375,
    60: 0.45,
    80: 0.6,
    90: 0.675,
};

type PricingMode = "READY_MIX" | "BAGGED";

/* ---------------- UI tokens / shared classes ---------------- */
const fieldInputClass =
    "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400 mt-2";
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
    tooltip,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    badge?: string;
    ariaLabel?: string;
    tooltip?: string;
}) => (
    <div className="relative group">
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
            title={tooltip}
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
export default function ConcreteDrivewayCostCalc() {
    /* — Geometry — */
    const [lengthFt, setLengthFt] = useState<string>("");
    const [widthFt, setWidthFt] = useState<string>("");
    const [extraArea, setExtraArea] = useState<string>("0");
    const [thicknessIn, setThicknessIn] = useState<string>("4");
    const [wastePct, setWastePct] = useState<string>("7");

    /* — Pricing mode — */
    const [pricingMode, setPricingMode] = useState<PricingMode>("READY_MIX");

    /* — Ready-Mix fields — */
    const [pricePerYd3, setPricePerYd3] = useState<string>("");
    const [deliveryFee, setDeliveryFee] = useState<string>("0");
    const [truckCapacity, setTruckCapacity] = useState<string>("10");
    const [minDeliveryYd3, setMinDeliveryYd3] = useState<string>("0");
    const [shortLoadThreshold, setShortLoadThreshold] = useState<string>("0");
    const [shortLoadFee, setShortLoadFee] = useState<string>("0");
    const [minChargeTotal, setMinChargeTotal] = useState<string>("0");
    const [afterHoursFee, setAfterHoursFee] = useState<string>("0");
    const [returnedConcreteFee, setReturnedConcreteFee] = useState<string>("0");

    /* — Bagged fields — */
    const [bagSizeLb, setBagSizeLb] = useState<string>("80");
    const [pricePerBag, setPricePerBag] = useState<string>("");
    const [bagYieldOverride, setBagYieldOverride] = useState<string>("");

    /* — Add-ons — */
    const [addonsOpen, setAddonsOpen] = useState(false);
    const [costBase, setCostBase] = useState<string>("0");
    const [costRebarMesh, setCostRebarMesh] = useState<string>("0");
    const [costForms, setCostForms] = useState<string>("0");
    const [costFinish, setCostFinish] = useState<string>("0");
    const [costSawcutJoints, setCostSawcutJoints] = useState<string>("0");
    const [costSealer, setCostSealer] = useState<string>("0");
    const [costDemoRemoval, setCostDemoRemoval] = useState<string>("0");
    const [costOther, setCostOther] = useState<string>("0");

    /* — UI flow — */
    const [submitted, setSubmitted] = useState(false);

    /* — Helpers — */
    const p = (s: string) => parseFloat(s) || 0;
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

    const fmt = (n: number, decimals = 2) =>
        Intl.NumberFormat(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(n);

    const fmtCurrency = (n: number) =>
        Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(n);

    /* — Bag yield (auto or override) — */
    const effectiveBagYield = useMemo(() => {
        if (bagYieldOverride && parseFloat(bagYieldOverride) > 0) return parseFloat(bagYieldOverride);
        return BAG_YIELDS[parseInt(bagSizeLb)] || 0.6;
    }, [bagSizeLb, bagYieldOverride]);

    /* — Core calculation — */
    const calc = useMemo(() => {
        const L = p(lengthFt);
        const W = p(widthFt);
        const EA = p(extraArea);
        const TI = p(thicknessIn);
        const WP = clamp(p(wastePct), 0, 20);

        if (L <= 0 || W <= 0) return null;
        if (TI <= 0) return null;

        // §5.1 Area
        const AREA_FT2 = L * W + EA;
        // §5.2 Thickness
        const THICKNESS_FT = TI / INCHES_PER_FOOT;
        // §5.3 Volume
        const VOLUME_FT3 = AREA_FT2 * THICKNESS_FT;
        // §5.4
        const VOLUME_YD3 = VOLUME_FT3 / FT3_PER_YD3;
        // §5.5
        const WASTE_FACTOR = 1 + WP / 100;
        // §5.6
        const VOLUME_FT3_ADJ = VOLUME_FT3 * WASTE_FACTOR;
        const VOLUME_YD3_ADJ = VOLUME_YD3 * WASTE_FACTOR;

        // Add-ons total
        const ADDONS_TOTAL =
            p(costBase) + p(costRebarMesh) + p(costForms) + p(costFinish) +
            p(costSawcutJoints) + p(costSealer) + p(costDemoRemoval) + p(costOther);

        // Warnings
        const warnLargeArea = AREA_FT2 > 5000;

        if (pricingMode === "READY_MIX") {
            const PPY = p(pricePerYd3);
            const DF = p(deliveryFee);
            const SLT = p(shortLoadThreshold);
            const SLF = p(shortLoadFee);
            const MDY = p(minDeliveryYd3);
            const MCT = p(minChargeTotal);
            const AHF = p(afterHoursFee);
            const RCF = p(returnedConcreteFee);
            const TC = p(truckCapacity) || 10;

            // §7.3 Minimum deliverable
            const BILLABLE_YD3 = MDY > 0 ? Math.max(VOLUME_YD3_ADJ, MDY) : VOLUME_YD3_ADJ;

            // §6.1 Concrete cost
            const CONCRETE_COST = BILLABLE_YD3 * PPY;

            // §7.2 Short-load detection
            const shortLoadApplied = SLT > 0 && VOLUME_YD3_ADJ < SLT;
            const SHORT_LOAD_APPLIED = shortLoadApplied ? SLF : 0;

            // Fees total
            const FEES_TOTAL = DF + SHORT_LOAD_APPLIED + AHF + RCF;

            // Total before minimum charge
            const TOTAL_BEFORE_MIN = CONCRETE_COST + FEES_TOTAL + ADDONS_TOTAL;

            // §7.3 Minimum charge
            const minChargeApplied = MCT > 0 && TOTAL_BEFORE_MIN < MCT;
            const TOTAL_COST = minChargeApplied ? MCT : TOTAL_BEFORE_MIN;

            // §7.1 Order quantity (round up to 0.25 yd³)
            const ORDER_QTY_YD3 = Math.ceil(VOLUME_YD3_ADJ / 0.25) * 0.25;

            // §7.4 Multi-truck
            const TRUCKS_EST = ORDER_QTY_YD3 > TC ? Math.ceil(ORDER_QTY_YD3 / TC) : 1;

            return {
                mode: "READY_MIX" as const,
                AREA_FT2,
                THICKNESS_IN: TI,
                VOLUME_FT3,
                VOLUME_YD3,
                VOLUME_FT3_ADJ,
                VOLUME_YD3_ADJ,
                WASTE_PCT: WP,
                BILLABLE_YD3,
                minDeliveryApplied: MDY > 0 && VOLUME_YD3_ADJ < MDY,
                CONCRETE_COST,
                shortLoadApplied,
                SHORT_LOAD_APPLIED,
                DELIVERY_FEE: DF,
                AFTER_HOURS_FEE: AHF,
                RETURNED_FEE: RCF,
                FEES_TOTAL,
                ADDONS_TOTAL,
                TOTAL_BEFORE_MIN,
                minChargeApplied,
                MIN_CHARGE: MCT,
                TOTAL_COST,
                ORDER_QTY_YD3,
                TRUCKS_EST,
                warnLargeArea,
            };
        } else {
            // BAGGED
            const PPB = p(pricePerBag);
            const yield_ft3 = effectiveBagYield;

            if (yield_ft3 <= 0) return null;

            // §6.2
            const BAG_COUNT = Math.ceil(VOLUME_FT3_ADJ / yield_ft3);
            const CONCRETE_COST = BAG_COUNT * PPB;
            const TOTAL_COST = CONCRETE_COST + ADDONS_TOTAL;
            const warnManyBags = BAG_COUNT >= 80;

            return {
                mode: "BAGGED" as const,
                AREA_FT2,
                THICKNESS_IN: TI,
                VOLUME_FT3,
                VOLUME_YD3,
                VOLUME_FT3_ADJ,
                VOLUME_YD3_ADJ,
                WASTE_PCT: WP,
                BAG_SIZE_LB: parseInt(bagSizeLb),
                BAG_YIELD_FT3: yield_ft3,
                BAG_COUNT,
                CONCRETE_COST,
                ADDONS_TOTAL,
                TOTAL_COST,
                warnLargeArea,
                warnManyBags,
            };
        }
    }, [
        lengthFt, widthFt, extraArea, thicknessIn, wastePct, pricingMode,
        pricePerYd3, deliveryFee, truckCapacity, minDeliveryYd3, shortLoadThreshold,
        shortLoadFee, minChargeTotal, afterHoursFee, returnedConcreteFee,
        bagSizeLb, pricePerBag, effectiveBagYield,
        costBase, costRebarMesh, costForms, costFinish, costSawcutJoints,
        costSealer, costDemoRemoval, costOther,
    ]);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const numberOrEmpty = (v: string) => (v === "" ? "" : v.replace(/[^0-9.]/g, ""));

    const resetAll = () => {
        setLengthFt(""); setWidthFt(""); setExtraArea("0");
        setThicknessIn("4"); setWastePct("7");
        setPricingMode("READY_MIX");
        setPricePerYd3(""); setDeliveryFee("0");
        setTruckCapacity("10"); setMinDeliveryYd3("0");
        setShortLoadThreshold("0"); setShortLoadFee("0");
        setMinChargeTotal("0"); setAfterHoursFee("0"); setReturnedConcreteFee("0");
        setBagSizeLb("80"); setPricePerBag(""); setBagYieldOverride("");
        setCostBase("0"); setCostRebarMesh("0"); setCostForms("0"); setCostFinish("0");
        setCostSawcutJoints("0"); setCostSealer("0"); setCostDemoRemoval("0"); setCostOther("0");
        setAddonsOpen(false);
        setSubmitted(false);
    };

    /* ---------------- PRINT / SAVE ---------------- */
    const LOGO_URL = "/logo.svg";

    const buildPrintHtml = () => {
        if (!calc) return "";
        const now = new Date().toLocaleString();

        const isReadyMix = calc.mode === "READY_MIX";
        const concreteLabel = isReadyMix ? "Ready-Mix (Delivered)" : `Bagged (${bagSizeLb} lb)`;

        const concreteCostStr = fmtCurrency(calc.CONCRETE_COST);
        const totalStr = fmtCurrency(calc.TOTAL_COST);

        let feesHtml = "";
        if (isReadyMix) {
            const rm = calc as Extract<typeof calc, { mode: "READY_MIX" }>;
            feesHtml = `
      <div class="kv"><div class="k">Delivery Fee</div><div class="v">${fmtCurrency(rm.DELIVERY_FEE)}</div></div>
      ${rm.shortLoadApplied ? `<div class="kv"><div class="k">Short-Load Fee</div><div class="v">${fmtCurrency(rm.SHORT_LOAD_APPLIED)}</div></div>` : ""}
      ${rm.AFTER_HOURS_FEE > 0 ? `<div class="kv"><div class="k">After-Hours Fee</div><div class="v">${fmtCurrency(rm.AFTER_HOURS_FEE)}</div></div>` : ""}
      ${rm.RETURNED_FEE > 0 ? `<div class="kv"><div class="k">Returned Concrete Fee</div><div class="v">${fmtCurrency(rm.RETURNED_FEE)}</div></div>` : ""}
      <div class="kv"><div class="k">Order Quantity</div><div class="v">${fmt(rm.ORDER_QTY_YD3)} yd³</div></div>
      ${rm.TRUCKS_EST > 1 ? `<div class="kv"><div class="k">Estimated Trucks</div><div class="v">${rm.TRUCKS_EST}</div></div>` : ""}
      ${rm.minChargeApplied ? `<div class="kv"><div class="k">Minimum Charge Applied</div><div class="v">${fmtCurrency(rm.MIN_CHARGE)}</div></div>` : ""}`;
        } else {
            const bg = calc as Extract<typeof calc, { mode: "BAGGED" }>;
            feesHtml = `<div class="kv"><div class="k">Bags Required (${bg.BAG_SIZE_LB} lb)</div><div class="v">${bg.BAG_COUNT} bags</div></div>`;
        }

        return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Concrete Driveway Cost Estimate – Print View</title>
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
        <div>Concrete Driveway Cost Estimate</div>
        <div>Date: ${now}</div>
      </div>
    </div>

    <h1>Driveway Project Dimensions</h1>
    <div class="grid">
      <div class="kv"><div class="k">Length</div><div class="v">${lengthFt} ft</div></div>
      <div class="kv"><div class="k">Width</div><div class="v">${widthFt} ft</div></div>
      <div class="kv"><div class="k">Extra Area</div><div class="v">${extraArea} sq ft</div></div>
      <div class="kv"><div class="k">Thickness</div><div class="v">${thicknessIn} in</div></div>
      <div class="kv"><div class="k">Area</div><div class="v">${fmt(calc.AREA_FT2)} sq ft</div></div>
      <div class="kv"><div class="k">Volume</div><div class="v">${fmt(calc.VOLUME_YD3, 3)} yd³</div></div>
      <div class="kv"><div class="k">Incl. Waste (${calc.WASTE_PCT}%)</div><div class="v">${fmt(calc.VOLUME_YD3_ADJ, 3)} yd³</div></div>
    </div>

    <h2>Cost Breakdown (${concreteLabel})</h2>
    <div class="grid-2">
      <div class="kv"><div class="k">Concrete Material</div><div class="v">${concreteCostStr}</div></div>
      ${feesHtml}
      ${calc.ADDONS_TOTAL > 0 ? `<div class="kv"><div class="k">Add-ons Total</div><div class="v">${fmtCurrency(calc.ADDONS_TOTAL)}</div></div>` : ""}
    </div>

    <div class="total-card">
      <div class="label" style="color: #0f766e; font-size: 14px; font-weight: 700;">Total Estimated Cost</div>
      <div class="total-val">${totalStr}</div>
      <div class="muted" style="margin-top: 8px;">Estimate includes materials, fees, add-ons, and ${calc.WASTE_PCT}% waste allowance.</div>
    </div>

    <div class="footer">
      Note: This is an estimate. Actual costs vary by region, access, finishing, and supplier policies. Confirm fees and minimums with your supplier.
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

    /* — Thickness preset buttons — */
    const ThicknessPreset = ({ val, label }: { val: string; label: string }) => (
        <button
            type="button"
            onClick={() => { setThicknessIn(val); setSubmitted(false); }}
            className={`px-3 py-1 rounded-sm text-xs font-medium border transition-colors ${thicknessIn === val
                ? "bg-teal-500/20 border-teal-500 text-teal-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                }`}
        >
            {label}
        </button>
    );

    return (
        <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
            <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center flex items-center justify-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Concrete Driveway Cost Calculator
                </CardTitle>
                <p className="text-sm text-white/70 mt-1 text-center">
                    Estimate concrete volume and total cost for your driveway project (US imperial).
                </p>
            </CardHeader>

            <CardContent className="p-6 pt-0">
                {/* Formula Info */}
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2 mb-4">
                    <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                        Total = Concrete Cost + Delivery/Fees + Add-ons. Typical driveway: $6–$12/sq ft installed, $120–$210/yd³ for ready-mix.
                    </p>
                </div>

                <form onSubmit={handleCalculate} className="space-y-0">
                    {/* STEP 1 — Geometry */}
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 1 — Driveway Dimensions</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="dw-length" className="text-teal-500">Length (ft)</Label>
                                <NumberInput
                                    id="dw-length"
                                    value={lengthFt}
                                    onChange={(v) => { setLengthFt(numberOrEmpty(v)); setSubmitted(false); }}
                                    placeholder="e.g., 40"
                                    badge="ft"
                                    tooltip="Measure the driveway from the garage (or start point) to the street in feet."
                                />
                            </div>
                            <div>
                                <Label htmlFor="dw-width" className="text-teal-500">Width (ft)</Label>
                                <NumberInput
                                    id="dw-width"
                                    value={widthFt}
                                    onChange={(v) => { setWidthFt(numberOrEmpty(v)); setSubmitted(false); }}
                                    placeholder="e.g., 12"
                                    badge="ft"
                                    tooltip="Measure the driveway side-to-side in feet."
                                />
                            </div>
                            <div>
                                <Label htmlFor="dw-extra" className="text-teal-500">Extra Area (sq ft)</Label>
                                <NumberInput
                                    id="dw-extra"
                                    value={extraArea}
                                    onChange={(v) => { setExtraArea(numberOrEmpty(v)); setSubmitted(false); }}
                                    placeholder="0"
                                    badge="sq ft"
                                    tooltip="Add turnarounds, aprons, or widened sections (optional)."
                                />
                            </div>
                        </div>
                    </section>

                    {/* STEP 2 — Thickness & Waste */}
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 2 — Thickness &amp; Waste</h3>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="dw-thick" className="text-teal-500">Thickness (inches)</Label>
                                <NumberInput
                                    id="dw-thick"
                                    value={thicknessIn}
                                    onChange={(v) => { setThicknessIn(numberOrEmpty(v)); setSubmitted(false); }}
                                    placeholder="4"
                                    badge="in"
                                    tooltip="Common residential driveways are 4–5 inches. Choose thicker if heavier vehicles use the driveway."
                                />
                                <div className="flex gap-2 mt-2">
                                    <ThicknessPreset val="4" label='4" Standard' />
                                    <ThicknessPreset val="5" label='5" Heavy' />
                                    <ThicknessPreset val="6" label='6" Extra' />
                                </div>
                                <p className="text-[10px] text-white/50 mt-1">4″ minimum; 5″ if delivery/heavier loads expected.</p>
                            </div>
                            <div>
                                <Label htmlFor="dw-waste" className="text-teal-500">Waste / Overage (%)</Label>
                                <NumberInput
                                    id="dw-waste"
                                    value={wastePct}
                                    onChange={(v) => { setWastePct(numberOrEmpty(v)); setSubmitted(false); }}
                                    placeholder="7"
                                    badge="%"
                                    tooltip="Adds extra concrete for uneven subgrade and small losses. 5–10% is common."
                                />
                                <p className="text-[10px] text-white/50 mt-1">Recommended: 5–10%. Max: 20%.</p>
                            </div>
                        </div>
                    </section>

                    {/* STEP 3 — Pricing Mode */}
                    <section className={stepClass}>
                        <h3 className="text-sm font-semibold text-white/80">Step 3 — Pricing Method</h3>
                        <div className="mt-2">
                            <Label className="text-teal-500">Supply Method</Label>
                            <Select value={pricingMode} onValueChange={(v: string) => { setPricingMode(v as PricingMode); setSubmitted(false); }}>
                                <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={selectContentClass}>
                                    <SelectItem value="READY_MIX">Ready-Mix (Delivered by Truck)</SelectItem>
                                    <SelectItem value="BAGGED">Bagged Concrete (DIY)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {pricingMode === "READY_MIX" ? (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="dw-ppy" className="text-teal-500">Concrete Price ($/yd³)</Label>
                                        <NumberInput
                                            id="dw-ppy"
                                            value={pricePerYd3}
                                            onChange={(v) => { setPricePerYd3(numberOrEmpty(v)); setSubmitted(false); }}
                                            placeholder="e.g., 160"
                                            badge="$"
                                            tooltip="Enter your local ready-mix price per cubic yard (yd³)."
                                        />
                                        <p className="text-[10px] text-white/50 mt-1">Typical: $120–$210/yd³</p>
                                    </div>
                                    <div>
                                        <Label htmlFor="dw-df" className="text-teal-500">Delivery Fee ($)</Label>
                                        <NumberInput
                                            id="dw-df"
                                            value={deliveryFee}
                                            onChange={(v) => { setDeliveryFee(numberOrEmpty(v)); setSubmitted(false); }}
                                            badge="$"
                                            tooltip="Some suppliers charge a flat delivery fee per truck."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dw-tc" className="text-teal-500">Truck Capacity (yd³)</Label>
                                        <NumberInput
                                            id="dw-tc"
                                            value={truckCapacity}
                                            onChange={(v) => { setTruckCapacity(numberOrEmpty(v)); setSubmitted(false); }}
                                            badge="yd³"
                                            tooltip="Typical full-size ready-mix truck capacity is around 8–10 yd³."
                                        />
                                    </div>
                                </div>

                                {/* Supplier Constraints — collapsible */}
                                <details className="rounded-sm border border-slate-700 bg-slate-800/50">
                                    <summary className="cursor-pointer p-3 text-sm text-slate-300 font-medium hover:text-white select-none">
                                        Supplier Constraints (short-load, minimums, extra fees)
                                    </summary>
                                    <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="dw-mdy" className="text-teal-500 text-xs">Min. Delivery (yd³)</Label>
                                            <NumberInput
                                                id="dw-mdy"
                                                value={minDeliveryYd3}
                                                onChange={(v) => { setMinDeliveryYd3(numberOrEmpty(v)); setSubmitted(false); }}
                                                badge="yd³"
                                                tooltip="Some suppliers set a minimum order quantity."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dw-slt" className="text-teal-500 text-xs">Short-Load Threshold (yd³)</Label>
                                            <NumberInput
                                                id="dw-slt"
                                                value={shortLoadThreshold}
                                                onChange={(v) => { setShortLoadThreshold(numberOrEmpty(v)); setSubmitted(false); }}
                                                badge="yd³"
                                                tooltip="If your order is below a certain yardage, suppliers may add a short-load charge."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dw-slf" className="text-teal-500 text-xs">Short-Load Fee ($)</Label>
                                            <NumberInput
                                                id="dw-slf"
                                                value={shortLoadFee}
                                                onChange={(v) => { setShortLoadFee(numberOrEmpty(v)); setSubmitted(false); }}
                                                badge="$"
                                                tooltip="Enter the short-load fee your supplier quoted."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dw-mct" className="text-teal-500 text-xs">Minimum Charge ($)</Label>
                                            <NumberInput
                                                id="dw-mct"
                                                value={minChargeTotal}
                                                onChange={(v) => { setMinChargeTotal(numberOrEmpty(v)); setSubmitted(false); }}
                                                badge="$"
                                                tooltip="If your supplier charges a minimum total price regardless of yardage."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dw-ahf" className="text-teal-500 text-xs">After-Hours Fee ($)</Label>
                                            <NumberInput
                                                id="dw-ahf"
                                                value={afterHoursFee}
                                                onChange={(v) => { setAfterHoursFee(numberOrEmpty(v)); setSubmitted(false); }}
                                                badge="$"
                                                tooltip="Optional extra fee for off-schedule delivery."
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dw-rcf" className="text-teal-500 text-xs">Returned Concrete Fee ($)</Label>
                                            <NumberInput
                                                id="dw-rcf"
                                                value={returnedConcreteFee}
                                                onChange={(v) => { setReturnedConcreteFee(numberOrEmpty(v)); setSubmitted(false); }}
                                                badge="$"
                                                tooltip="Some suppliers charge if extra concrete is returned."
                                            />
                                        </div>
                                    </div>
                                </details>
                            </div>
                        ) : (
                            /* BAGGED MODE */
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-teal-500">Bag Size (lb)</Label>
                                    <Select value={bagSizeLb} onValueChange={(v) => { setBagSizeLb(v); setBagYieldOverride(""); setSubmitted(false); }}>
                                        <SelectTrigger className={selectTriggerClass}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={selectContentClass}>
                                            {[40, 50, 60, 80, 90].map((s) => (
                                                <SelectItem key={s} value={String(s)}>{s} lb</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="dw-ppb" className="text-teal-500">Price per Bag ($)</Label>
                                    <NumberInput
                                        id="dw-ppb"
                                        value={pricePerBag}
                                        onChange={(v) => { setPricePerBag(numberOrEmpty(v)); setSubmitted(false); }}
                                        placeholder="e.g., 6.50"
                                        badge="$"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dw-yield" className="text-teal-500">Yield per Bag (ft³)</Label>
                                    <NumberInput
                                        id="dw-yield"
                                        value={bagYieldOverride || String(BAG_YIELDS[parseInt(bagSizeLb)] || 0.6)}
                                        onChange={(v) => { setBagYieldOverride(numberOrEmpty(v)); setSubmitted(false); }}
                                        badge="ft³"
                                        tooltip="How much mixed concrete one bag produces. You can override if your bag label states a different yield."
                                    />
                                    <p className="text-[10px] text-white/50 mt-1">Auto-filled from QUIKRETE 1101 data. Override if needed.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* STEP 4 — Add-ons */}
                    <section className={stepClass}>
                        <button
                            type="button"
                            onClick={() => setAddonsOpen(!addonsOpen)}
                            className="w-full flex items-center justify-between text-sm font-semibold text-white/80 hover:text-white"
                        >
                            <span>Step 4 — Optional Add-ons</span>
                            {addonsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {addonsOpen && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { id: "dw-base", label: "Gravel / Base ($)", value: costBase, set: setCostBase },
                                    { id: "dw-rebar", label: "Rebar / Mesh ($)", value: costRebarMesh, set: setCostRebarMesh },
                                    { id: "dw-forms", label: "Forms & Stakes ($)", value: costForms, set: setCostForms },
                                    { id: "dw-finish", label: "Finish Upgrade ($)", value: costFinish, set: setCostFinish },
                                    { id: "dw-sawcut", label: "Saw Cuts / Joints ($)", value: costSawcutJoints, set: setCostSawcutJoints },
                                    { id: "dw-sealer", label: "Sealer ($)", value: costSealer, set: setCostSealer },
                                    { id: "dw-demo", label: "Demo / Removal ($)", value: costDemoRemoval, set: setCostDemoRemoval },
                                    { id: "dw-other", label: "Other ($)", value: costOther, set: setCostOther },
                                ].map(({ id, label, value, set }) => (
                                    <div key={id}>
                                        <Label htmlFor={id} className="text-teal-500 text-xs">{label}</Label>
                                        <NumberInput
                                            id={id}
                                            value={value}
                                            onChange={(v) => { set(numberOrEmpty(v)); setSubmitted(false); }}
                                            badge="$"
                                            tooltip="Optional. Enter your estimated cost or contractor quote."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ACTIONS */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="h-11 flex-1 rounded-sm bg-teal-400 text-slate-900 font-bold hover:bg-teal-300">
                            Calculate Driveway Cost
                        </Button>
                        <Button type="button" onClick={resetAll} className="h-11 rounded-sm bg-slate-600 text-white hover:bg-slate-500">
                            Reset
                        </Button>
                    </div>
                </form>

                {/* RESULTS */}
                {!submitted ? (
                    <div className="mt-8 text-center py-10 border-2 border-dashed border-slate-700 rounded-lg">
                        <p className="text-slate-400">Enter your driveway dimensions and pricing above to see your project estimate.</p>
                    </div>
                ) : calc === null ? (
                    <p className="mt-4 text-sm text-red-300">Please enter valid dimensions (length &gt; 0, width &gt; 0, thickness &gt; 0).</p>
                ) : (
                    <div className="mt-8 space-y-6">
                        {/* Warnings */}
                        {calc.warnLargeArea && (
                            <div className="flex items-start gap-2 rounded-sm border border-amber-600/40 bg-amber-900/10 p-3">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-amber-300">Large pour — consider a professional quote and phased staging.</p>
                            </div>
                        )}
                        {calc.mode === "BAGGED" && calc.warnManyBags && (
                            <div className="flex items-start gap-2 rounded-sm border border-amber-600/40 bg-amber-900/10 p-3">
                                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-amber-300">That&apos;s a lot of bags. For large pours like driveways, ready-mix delivery is usually more practical and consistent.</p>
                            </div>
                        )}

                        {/* Print bar */}
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

                        {/* Summary + Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-4">
                                {/* Summary cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <KV k="Driveway Area" v={`${fmt(calc.AREA_FT2)} sq ft`} />
                                    <KV k="Thickness" v={`${fmt(calc.THICKNESS_IN, 1)} in`} />
                                    <KV k="Volume (raw)" v={`${fmt(calc.VOLUME_YD3, 3)} yd³ (${fmt(calc.VOLUME_FT3, 1)} ft³)`} />
                                    <KV k={`With ${calc.WASTE_PCT}% Waste`} v={`${fmt(calc.VOLUME_YD3_ADJ, 3)} yd³`} highlight />
                                    {calc.mode === "READY_MIX" && (
                                        <>
                                            <KV k="Order Quantity (rounded)" v={`${fmt(calc.ORDER_QTY_YD3)} yd³`} highlight />
                                            {calc.minDeliveryApplied && (
                                                <KV k="Billable Minimum" v={`${fmt(calc.BILLABLE_YD3, 3)} yd³`} highlight />
                                            )}
                                            {calc.TRUCKS_EST > 1 && (
                                                <div className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900 p-2 text-sm">
                                                    <Truck className="h-4 w-4 text-teal-400" />
                                                    <span className="text-white/70">Estimated Trucks:</span>
                                                    <span className="text-teal-400 font-semibold">{calc.TRUCKS_EST}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {calc.mode === "BAGGED" && (
                                        <KV k={`${calc.BAG_SIZE_LB}lb Bags Required`} v={`${calc.BAG_COUNT} bags`} highlight />
                                    )}
                                </div>

                                {/* Itemized cost breakdown */}
                                <div className="bg-slate-900 border border-slate-700 p-4 rounded-sm">
                                    <h4 className="text-xs font-bold text-white/70 uppercase mb-3">Cost Breakdown</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/60">
                                                Concrete ({calc.mode === "READY_MIX" ? "Ready-Mix" : `${(calc as Extract<typeof calc, { mode: "BAGGED" }>).BAG_COUNT} bags`})
                                            </span>
                                            <span className="text-white">{fmtCurrency(calc.CONCRETE_COST)}</span>
                                        </div>

                                        {calc.mode === "READY_MIX" && (
                                            <>
                                                {calc.DELIVERY_FEE > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-white/60">Delivery Fee</span>
                                                        <span className="text-white">{fmtCurrency(calc.DELIVERY_FEE)}</span>
                                                    </div>
                                                )}
                                                {calc.shortLoadApplied && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-white/60">Short-Load Fee</span>
                                                        <span className="text-white">{fmtCurrency(calc.SHORT_LOAD_APPLIED)}</span>
                                                    </div>
                                                )}
                                                {calc.AFTER_HOURS_FEE > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-white/60">After-Hours Fee</span>
                                                        <span className="text-white">{fmtCurrency(calc.AFTER_HOURS_FEE)}</span>
                                                    </div>
                                                )}
                                                {calc.RETURNED_FEE > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-white/60">Returned Concrete Fee</span>
                                                        <span className="text-white">{fmtCurrency(calc.RETURNED_FEE)}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {calc.ADDONS_TOTAL > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/60">Add-ons Total</span>
                                                <span className="text-white">{fmtCurrency(calc.ADDONS_TOTAL)}</span>
                                            </div>
                                        )}

                                        {calc.mode === "READY_MIX" && calc.minChargeApplied && (
                                            <div className="flex justify-between text-sm text-amber-300">
                                                <span>Minimum Charge Applied</span>
                                                <span>{fmtCurrency(calc.MIN_CHARGE)}</span>
                                            </div>
                                        )}

                                        <div className="pt-2 mt-2 border-t border-slate-800 flex justify-between font-bold text-lg">
                                            <span className="text-teal-400">Total Estimated Cost</span>
                                            <span className="text-teal-400">{fmtCurrency(calc.TOTAL_COST)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grand total highlight card */}
                            <div className="bg-teal-900/10 border border-teal-500/30 p-5 rounded-sm flex flex-col items-center justify-center text-center">
                                <div className="text-xs uppercase text-teal-400 font-bold tracking-widest mb-1">Total Estimated Cost</div>
                                <div className="text-4xl font-black text-white">{fmtCurrency(calc.TOTAL_COST)}</div>
                                <div className="mt-3 text-[11px] text-white/50 leading-tight">
                                    Includes {fmtCurrency(calc.CONCRETE_COST)} for concrete
                                    {calc.mode === "READY_MIX" && calc.FEES_TOTAL > 0 ? ` and ${fmtCurrency(calc.FEES_TOTAL)} in fees` : ""}
                                    {calc.ADDONS_TOTAL > 0 ? ` plus ${fmtCurrency(calc.ADDONS_TOTAL)} in add-ons` : ""}.
                                </div>
                            </div>
                        </div>

                        {/* Disclaimers */}
                        <div className="text-[11px] text-white/40 mt-2 space-y-1">
                            <p>Estimates only. Local labor, access, finishing, and supplier minimums can change costs.</p>
                            <p>Confirm delivery fees, short-load charges, and minimum charges with your supplier.</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
