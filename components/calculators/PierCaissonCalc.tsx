// components/calculators/PierCaissonCalc.tsx
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
import { Info, Printer } from "lucide-react";

/* ---------------------------------------------
   Types / Units (logic unchanged)
--------------------------------------------- */
type LinearUnit = "m" | "cm" | "mm" | "ft" | "in";

type Inputs = {
  unit: LinearUnit;
  diameter: string; // shaft dia
  depth: string; // shaft depth
  qty: string; // quantity
  wastePct: string; // %
  hasBell: boolean;
  bellTopDia: string;
  bellBottomDia: string;
  bellHeight: string;
};

type Results = {
  perPier: { m3: number; yd3: number; ft3: number };
  perPierWaste: { m3: number; yd3: number; ft3: number };
  total: { m3: number; yd3: number; ft3: number };
  totalWaste: { m3: number; yd3: number; ft3: number };
} | null;

/* ---------------------------------------------
   Helpers (math unchanged)
--------------------------------------------- */
const toMeters = (v: number, u: LinearUnit) => {
  switch (u) {
    case "m":
      return v;
    case "cm":
      return v / 100;
    case "mm":
      return v / 1000;
    case "ft":
      return v * 0.3048;
    case "in":
      return v * 0.0254;
  }
};

const cylVolume = (diameter_m: number, height_m: number) => {
  const r = diameter_m / 2;
  return Math.PI * r * r * height_m;
};

const frustumVolume = (topDia_m: number, bottomDia_m: number, height_m: number) => {
  const R1 = topDia_m / 2;
  const R2 = bottomDia_m / 2;
  return (Math.PI * height_m * (R1 * R1 + R1 * R2 + R2 * R2)) / 3;
};

const toYd3 = (m3: number) => m3 * 1.30795062;
const toFt3 = (m3: number) => m3 * 35.3146667;

const fmt = (n: number, d = 4) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

/* ---------------------------------------------
   UI tokens (styles only)
--------------------------------------------- */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = {
  m: "m",
  cm: "cm",
  mm: "mm",
  ft: "ft",
  in: "in",
};

/* ---------------------------------------------
   Small UI primitives
--------------------------------------------- */
const Field = ({
  id,
  label,
  hint,
  subHint,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  subHint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-teal-500 text-sm font-medium">
      {label}
    </Label>
    {children}
    {hint ? <p className="text-xs text-slate-300">{hint}</p> : null}
    {subHint ? <p className="text-[11px] text-white/60">{subHint}</p> : null}
  </div>
);

const NumberInput = ({
  id,
  value,
  onChange,
  placeholder,
  badge,
  ariaLabel,
  numeric,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  badge?: string; // right-side unit badge
  ariaLabel?: string;
  numeric?: boolean;
}) => (
  <div className="relative">
    <Input
      id={id}
      inputMode={numeric ? "numeric" : "decimal"}
      type="text"
      value={value}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, "");
        // allow only numbers + dot
        if (/^\d*\.?\d*$/.test(raw) || raw === "") onChange(raw);
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

const UnitSelect = ({
  value,
  onValueChange,
}: {
  value: LinearUnit;
  onValueChange: (v: LinearUnit) => void;
}) => (
  <Select value={value} onValueChange={(v) => onValueChange(v as LinearUnit)}>
    <SelectTrigger className={selectTriggerClass} aria-label="Units">
      <SelectValue placeholder="Units" />
    </SelectTrigger>
    <SelectContent className={selectContentClass}>
      {(["m", "cm", "mm", "ft", "in"] as LinearUnit[]).map((u) => (
        <SelectItem
          key={u}
          value={u}
          className="text-white data-[highlighted]:bg-slate-800 data-[state=checked]:bg-slate-800"
        >
          {u}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ---------------------------------------------
   Component (logic intact; Reset fixed)
--------------------------------------------- */

// Default starting values (used on initial load)
const DEFAULT_INPUTS: Inputs = {
  unit: "m",
  diameter: "0.6",
  depth: "3",
  qty: "4",
  wastePct: "5",
  hasBell: false,
  bellTopDia: "0.6",
  bellBottomDia: "1.0",
  bellHeight: "0.4",
};

// All-zero state for Reset (per your request)
const ZERO_INPUTS: Inputs = {
  unit: "m",         // keep a sane default unit
  diameter: "0",
  depth: "0",
  qty: "0",
  wastePct: "0",
  hasBell: false,
  bellTopDia: "0",
  bellBottomDia: "0",
  bellHeight: "0",
};

export default function PierCaissonConcreteCalc() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<Results>(null);
  const [submitted, setSubmitted] = useState(false);

  const canCalculate = useMemo(() => {
    const d = parseFloat(inputs.diameter);
    const h = parseFloat(inputs.depth);
    const n = parseFloat(inputs.qty);
    if (!(d > 0 && h > 0 && n > 0)) return false;
    if (inputs.hasBell) {
      const bt = parseFloat(inputs.bellTopDia);
      const bb = parseFloat(inputs.bellBottomDia);
      const bh = parseFloat(inputs.bellHeight);
      if (!(bt > 0 && bb > 0 && bh > 0)) return false;
    }
    return true;
  }, [inputs]);

  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const d = parseFloat(inputs.diameter);
    const h = parseFloat(inputs.depth);
    const n = parseFloat(inputs.qty);
    const w = Math.max(0, parseFloat(inputs.wastePct || "0"));

    const d_m = toMeters(d, inputs.unit);
    const h_m = toMeters(h, inputs.unit);

    let perPier_m3 = cylVolume(d_m, h_m);

    if (inputs.hasBell) {
      const bt = parseFloat(inputs.bellTopDia);
      const bb = parseFloat(inputs.bellBottomDia);
      const bh = parseFloat(inputs.bellHeight);
      const bt_m = toMeters(bt, inputs.unit);
      const bb_m = toMeters(bb, inputs.unit);
      const bh_m = toMeters(bh, inputs.unit);
      perPier_m3 += frustumVolume(bt_m, bb_m, bh_m);
    }

    const total_m3 = perPier_m3 * n;

    const perPier_w = perPier_m3 * (1 + w / 100);
    const total_w = total_m3 * (1 + w / 100);

    const r: Results = {
      perPier: { m3: perPier_m3, yd3: toYd3(perPier_m3), ft3: toFt3(perPier_m3) },
      perPierWaste: { m3: perPier_w, yd3: toYd3(perPier_w), ft3: toFt3(perPier_w) },
      total: { m3: total_m3, yd3: toYd3(total_m3), ft3: toFt3(total_m3) },
      totalWaste: { m3: total_w, yd3: toYd3(total_w), ft3: toFt3(total_w) },
    };

    setResults(r);
    setSubmitted(true);
  };

  /** RESET FIX:
   *  Sets every numeric text field to "0", turns off bell, keeps unit to "m",
   *  clears results, and hides the results section.
   */
  const reset = () => {
    setInputs(ZERO_INPUTS);
    setResults(null);
    setSubmitted(false);
  };

  /* ======================= PRINT / SAVE (unchanged) ======================= */
  const LOGO_URL = "/logo.svg";

  const nf = (n: number, max = 4) =>
    Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: max }) : "—";

  const buildPrintHtml = () => {
    if (!results) return "";

    const now = new Date().toLocaleString();
    const unitShort = unitAbbrev[inputs.unit];

    const yd3_base = results.totalWaste.yd3;
    const yd3_5 = yd3_base * 1.05;
    const yd3_10 = yd3_base * 1.1;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Pier / Caisson Concrete Calculator – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand img { height: 36px; width: auto; }
    .brand-name { font-weight: 800; font-size: 18px; color: #0f766e; }
    .meta { margin-left: auto; text-align: right; color: #475569; font-size: 12px; }
    h2 { font-size: 16px; margin: 18px 0 8px; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #fff; }
    .kv { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; }
    .kv .k { color: #475569; }
    .kv .v { color: #0f766e; font-weight: 700; }
    .label { text-transform: uppercase; letter-spacing: .02em; font-size: 11px; color: #64748b; }
    .value-md { font-size: 18px; font-weight: 800; color: #0f766e; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 12px; }
    @media print { @page { margin: 12mm; } .footer { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header / Branding -->
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Concrete Calculator Max Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta">
        <div>Pier / Caisson Concrete Calculator</div>
        <div>Printed: ${now}</div>
      </div>
    </div>

    <!-- Inputs Summary -->
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Units</div><div class="v">${unitShort}</div></div>
      <div class="kv"><div class="k">Shaft Dia</div><div class="v">${inputs.diameter} ${unitShort}</div></div>
      <div class="kv"><div class="k">Shaft Depth</div><div class="v">${inputs.depth} ${unitShort}</div></div>
      <div class="kv"><div class="k">Quantity</div><div class="v">${inputs.qty}</div></div>
      <div class="kv"><div class="k">Waste</div><div class="v">${nf(Math.max(0, parseFloat(inputs.wastePct || "0")),2)}%</div></div>
      <div class="kv"><div class="k">Belled Base</div><div class="v">${inputs.hasBell ? "Yes" : "No"}</div></div>
      ${
        inputs.hasBell
          ? `
      <div class="kv"><div class="k">Bell Top Dia</div><div class="v">${inputs.bellTopDia} ${unitShort}</div></div>
      <div class="kv"><div class="k">Bell Bottom Dia</div><div class="v">${inputs.bellBottomDia} ${unitShort}</div></div>
      <div class="kv"><div class="k">Bell Height</div><div class="v">${inputs.bellHeight} ${unitShort}</div></div>
      `
          : ``
      }
    </div>

    <!-- Results -->
    <h2>Results</h2>
    <div class="grid-2">
      <div class="card">
        <div class="label">Per Pier</div>
        <div class="kv"><div class="k">Net (m³)</div><div class="v">${nf(results.perPier.m3)}</div></div>
        <div class="kv"><div class="k">Net (yd³)</div><div class="v">${nf(results.perPier.yd3)}</div></div>
        <div class="kv"><div class="k">Net (ft³)</div><div class="v">${nf(results.perPier.ft3)}</div></div>
        <div class="kv"><div class="k">With Waste (m³)</div><div class="v">${nf(results.perPierWaste.m3)}</div></div>
        <div class="kv"><div class="k">With Waste (yd³)</div><div class="v">${nf(results.perPierWaste.yd3)}</div></div>
        <div class="kv"><div class="k">With Waste (ft³)</div><div class="v">${nf(results.perPierWaste.ft3)}</div></div>
      </div>
      <div class="card">
        <div class="label">Total (${parseFloat(inputs.qty) || 0} pier${parseFloat(inputs.qty) === 1 ? "" : "s"})</div>
        <div class="kv"><div class="k">Net (m³)</div><div class="v">${nf(results.total.m3)}</div></div>
        <div class="kv"><div class="k">Net (yd³)</div><div class="v">${nf(results.total.yd3)}</div></div>
        <div class="kv"><div class="k">Net (ft³)</div><div class="v">${nf(results.total.ft3)}</div></div>
        <div class="kv"><div class="k">With Waste (m³)</div><div class="v">${nf(results.totalWaste.m3)}</div></div>
        <div class="kv"><div class="k">With Waste (yd³)</div><div class="v">${nf(results.totalWaste.yd3)}</div></div>
        <div class="kv"><div class="k">With Waste (ft³)</div><div class="v">${nf(results.totalWaste.ft3)}</div></div>
      </div>
    </div>

    <!-- Yards (for ordering) -->
    <h2 style="margin-top:16px;">Cubic Yards (for ordering)</h2>
    <div class="grid">
      <div class="card">
        <div class="label">yd³ (with waste)</div>
        <div class="value-md">${nf(yd3_base,3)}</div>
      </div>
      <div class="card">
        <div class="label">yd³ (+5%)</div>
        <div class="value-md">${nf(yd3_5,3)}</div>
      </div>
      <div class="card">
        <div class="label">yd³ (+10%)</div>
        <div class="value-md">${nf(yd3_10,3)}</div>
      </div>
    </div>

    <div class="footer">
      Tip: In the browser’s Print dialog, choose “Save as PDF” to export this page as a PDF.
    </div>
  </div>

  <script>
    window.addEventListener('load', () => setTimeout(() => window.print(), 100));
  </script>
</body>
</html>`;
  };

  const handlePrint = () => {
    if (!submitted || !results) return;
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
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Pier / Caisson Concrete Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Calculate concrete for straight shafts with optional belled bases. Results appear after you press
          <span className="font-semibold"> Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Keep all inputs in the <span className="text-white font-medium">same unit</span>. Shaft volume uses
            <code className="mx-1 text-slate-200">π r² h</code>; belled base uses frustum formula
            <code className="mx-1 text-slate-200">(π h / 3)(R₁² + R₁R₂ + R₂²)</code>.
          </p>
        </div>

        {/* STEP 1 — Units & Waste */}
        <section className={stepClass} aria-labelledby="step1">
          <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Choose Units</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <Field label="Input Unit">
                <UnitSelect
                  value={inputs.unit}
                  onValueChange={(unit) => {
                    setInputs((s) => ({ ...s, unit }));
                    setSubmitted(false);
                  }}
                />
              </Field>
              <p className="mt-1 text-xs text-white/60">
                All dimensions below will be interpreted in{" "}
                <span className="text-white">{unitAbbrev[inputs.unit]}</span>.
              </p>
            </div>
            <div>
              <Field
                label="Waste / Overage (%)"
                hint="Adds extra volume to cover spillage, uneven base, etc."
                subHint="Typical 5–10%"
              >
                <NumberInput
                  value={inputs.wastePct}
                  onChange={(v) => {
                    setInputs((s) => ({ ...s, wastePct: v }));
                    setSubmitted(false);
                  }}
                  placeholder="5"
                  badge="%"
                  ariaLabel="Waste allowance percent"
                />
              </Field>
            </div>
          </div>
        </section>

        {/* STEP 2 — Core Dimensions */}
        <section className={stepClass} aria-labelledby="step2">
          <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Core Dimensions</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field
              id="dia"
              label={`Shaft Diameter (D)`}
              hint="Full diameter of the cylindrical shaft."
              subHint={`Typical 0.45–1.2 ${unitAbbrev[inputs.unit]}`}
            >
              <NumberInput
                id="dia"
                value={inputs.diameter}
                onChange={(v) => {
                  setInputs((s) => ({ ...s, diameter: v }));
                  setSubmitted(false);
                }}
                placeholder={inputs.unit === "ft" ? "e.g., 2" : "e.g., 0.6"}
                badge={unitAbbrev[inputs.unit]}
                ariaLabel="Shaft diameter"
              />
            </Field>

            <Field
              id="depth"
              label={`Shaft Depth (H)`}
              hint="Vertical depth/length of the cylindrical shaft."
              subHint={`Typical 2–6 ${unitAbbrev[inputs.unit]}`}
            >
              <NumberInput
                id="depth"
                value={inputs.depth}
                onChange={(v) => {
                  setInputs((s) => ({ ...s, depth: v }));
                  setSubmitted(false);
                }}
                placeholder={inputs.unit === "ft" ? "e.g., 10" : "e.g., 3"}
                badge={unitAbbrev[inputs.unit]}
                ariaLabel="Shaft depth"
              />
            </Field>

            <Field id="qty" label="Quantity (No. of Piers)" hint="Enter identical piers with same dimensions.">
              <NumberInput
                id="qty"
                value={inputs.qty}
                onChange={(v) => {
                  const clean = v.replace(/[^0-9]/g, "");
                  setInputs((s) => ({ ...s, qty: clean }));
                  setSubmitted(false);
                }}
                placeholder="4"
                numeric
                ariaLabel="Quantity of piers"
              />
            </Field>
          </div>
        </section>

        {/* STEP 3 — Optional: Belled Base */}
        <section className={stepClass} aria-labelledby="step3">
          <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Optional Parameters</h3>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-sm border border-slate-700 bg-slate-900 p-4">
            <div>
              <h4 className="text-white font-semibold">Belled Base</h4>
              <p className="text-xs md:text-sm text-slate-300">
                Adds a frustum volume at the bottom (useful for belled caissons).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={inputs.hasBell}
                onCheckedChange={(v) => {
                  setInputs((s) => ({ ...s, hasBell: v }));
                  setSubmitted(false);
                }}
              />
              <span className="text-sm text-white">{inputs.hasBell ? "Enabled" : "Disabled"}</span>
            </div>
          </div>

          {inputs.hasBell && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field
                id="bellTop"
                label={`Bell Top Diameter`}
                hint="Often equals shaft diameter."
                subHint={`Typical 0.6–1.2 ${unitAbbrev[inputs.unit]}`}
              >
                <NumberInput
                  id="bellTop"
                  value={inputs.bellTopDia}
                  onChange={(v) => {
                    setInputs((s) => ({ ...s, bellTopDia: v }));
                    setSubmitted(false);
                  }}
                  placeholder={inputs.unit === "ft" ? "e.g., 2" : "e.g., 0.6"}
                  badge={unitAbbrev[inputs.unit]}
                  ariaLabel="Bell top diameter"
                />
              </Field>

              <Field id="bellBottom" label={`Bell Bottom Diameter`} subHint={`Typical 0.8–1.5 ${unitAbbrev[inputs.unit]}`}>
                <NumberInput
                  id="bellBottom"
                  value={inputs.bellBottomDia}
                  onChange={(v) => {
                    setInputs((s) => ({ ...s, bellBottomDia: v }));
                    setSubmitted(false);
                  }}
                  placeholder={inputs.unit === "ft" ? "e.g., 3.5" : "e.g., 1.0"}
                  badge={unitAbbrev[inputs.unit]}
                  ariaLabel="Bell bottom diameter"
                />
              </Field>

              <Field id="bellHeight" label={`Bell Height`} subHint={`Typical 0.3–0.6 ${unitAbbrev[inputs.unit]}`}>
                <NumberInput
                  id="bellHeight"
                  value={inputs.bellHeight}
                  onChange={(v) => {
                    setInputs((s) => ({ ...s, bellHeight: v }));
                    setSubmitted(false);
                  }}
                  placeholder={inputs.unit === "ft" ? "e.g., 1.5" : "e.g., 0.4"}
                  badge={unitAbbrev[inputs.unit]}
                  ariaLabel="Bell height"
                />
              </Field>
            </div>
          )}
        </section>

        {/* STEP 4 — Actions */}
        <section className={stepClass} aria-labelledby="step4">
          <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Actions</h3>
          <form onSubmit={onCalculate} className="mt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0"
              disabled={!canCalculate}
            >
              Calculate
            </Button>
            <Button
              type="button"
              onClick={reset}
              className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
            >
              Reset
            </Button>
          </form>
        </section>

        {/* Results (hidden until Calculate) */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">
            Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
          </p>
        ) : !results ? (
          <p className="mt-4 text-sm text-red-300">
            Please enter valid positive numbers for all required fields.
          </p>
        ) : (
          <>
            {/* Print/Save button (green) */}
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={handlePrint}
                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                aria-label="Print or save results as PDF"
                title="Print / Save"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print / Save
              </Button>
            </div>

            {/* Inputs Summary */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <KV k="Units" v={unitAbbrev[inputs.unit]} />
                <KV k="Shaft Dia" v={`${inputs.diameter} ${unitAbbrev[inputs.unit]}`} />
                <KV k="Shaft Depth" v={`${inputs.depth} ${unitAbbrev[inputs.unit]}`} />
                <KV k="Quantity" v={`${inputs.qty}`} />
                <KV k="Waste" v={`${inputs.wastePct}%`} />
                <KV k="Belled Base" v={inputs.hasBell ? "Yes" : "No"} />
                {inputs.hasBell && (
                  <>
                    <KV k="Bell Top Dia" v={`${inputs.bellTopDia} ${unitAbbrev[inputs.unit]}`} />
                    <KV k="Bell Bottom Dia" v={`${inputs.bellBottomDia} ${unitAbbrev[inputs.unit]}`} />
                    <KV k="Bell Height" v={`${inputs.bellHeight} ${unitAbbrev[inputs.unit]}`} />
                  </>
                )}
              </div>
            </div>

            {/* Result tiles */}
            <section className={`${stepClass} grid grid-cols-1 lg:grid-cols-2 gap-4 border-none`}>
              {/* Per Pier */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <h5 className="text-white font-semibold">Per Pier</h5>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/70">Net (m³)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.perPier.m3)}</div>
                  <div className="text-white/70">Net (yd³)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.perPier.yd3)}</div>
                  <div className="text-white/70">Net (ft³)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.perPier.ft3)}</div>

                  <div className="col-span-2 mt-2 border-t border-slate-700" />
                  <div className="text-white/70">With Waste (m³)</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.perPierWaste.m3)}</div>
                  <div className="text-white/70">With Waste (yd³)</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.perPierWaste.yd3)}</div>
                  <div className="text-white/70">With Waste (ft³)</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.perPierWaste.ft3)}</div>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <h5 className="text-white font-semibold">
                  Total ({parseFloat(inputs.qty) || 0} pier{parseFloat(inputs.qty) === 1 ? "" : "s"})
                </h5>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/70">Net (m³)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.total.m3)}</div>
                  <div className="text-white/70">Net (yd³)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.total.yd3)}</div>
                  <div className="text-white/70">Net (ft³)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.total.ft3)}</div>

                  <div className="col-span-2 mt-2 border-t border-slate-700" />
                  <div className="text-white/70">With Waste (m³)</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.totalWaste.m3)}</div>
                  <div className="text-white/70">With Waste (yd³)</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.totalWaste.yd3)}</div>
                  <div className="text-white/70">With Waste (ft³)</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.totalWaste.ft3)}</div>
                </div>
              </div>
            </section>

            {/* Cubic Yards helper */}
            <section className="rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (with waste)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(results.totalWaste.yd3, 3)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(results.totalWaste.yd3 * 1.05, 3)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(results.totalWaste.yd3 * 1.1, 3)} yd³</div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Formula helper */}
        <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
          <h6 className="text-white font-semibold">Formulas Used</h6>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-300">
            <li>
              Shaft (cylinder): <span className="text-white">V = π r² h</span>
            </li>
            {inputs.hasBell && (
              <li>
                Bell (frustum): <span className="text-white">V = (π h / 3) (R₁² + R₁R₂ + R₂²)</span>
              </li>
            )}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

/* ---------------------- small UI helpers ---------------------- */
function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}
