// components/calculators/ColumnConcreteCalc.tsx

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info } from "lucide-react";

/* ---------------------------------------------------
   Types (unchanged)
--------------------------------------------------- */

type ColumnType = "rectangular" | "circular";

type LinearUnit = "meters" | "centimeters" | "feet" | "inches";

type VolumeUnit = "m3" | "ft3" | "yd3";

type RectangularInputs = {
  length: string;
  width: string;
  height: string;
  unit: LinearUnit;
  count: string;
  wastePct: string;
};

type CircularInputs = {
  diameter: string;
  height: string;
  unit: LinearUnit;
  count: string;
  wastePct: string;
};

/* ---------------------------------------------------
   Helpers (unchanged math)
--------------------------------------------------- */

const toMeters = (value: number, unit: LinearUnit): number => {
  switch (unit) {
    case "meters":
      return value;
    case "centimeters":
      return value / 100;
    case "feet":
      return value * 0.3048;
    case "inches":
      return value * 0.0254;
  }
};

const m3To = (m3: number, unit: VolumeUnit): number => {
  switch (unit) {
    case "m3":
      return m3;
    case "ft3":
      return m3 * 35.3146667;
    case "yd3":
      return m3 * 1.30795062;
  }
};

const fmt = (n: number, max = 4) =>
  Number.isFinite(n)
    ? Intl.NumberFormat(undefined, { maximumFractionDigits: max }).format(n)
    : "—";

/* ---------------------------------------------------
   UI primitives (styles only)
--------------------------------------------------- */

const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";

const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";

const selectContentClass =
  "rounded-sm border border-slate-700 bg-slate-900 text-white";

const stepClass = "pt-6 mt-4 border-t border-slate-800"; // clear separation between steps

const unitAbbrev: Record<LinearUnit, string> = {
  meters: "m",
  centimeters: "cm",
  feet: "ft",
  inches: "in",
};

const Field = ({
  id,
  label,
  children,
  hint,
  subHint,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  hint?: string;
  subHint?: string;
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
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  badge?: string; // right-side unit badge
}) => (
  <div className="relative">
    <Input
      id={id}
      inputMode="decimal"
      type="text"
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/,/g, "");
        if (/^\d*\.?\d*$/.test(v) || v === "") onChange(v);
      }}
      placeholder={placeholder}
      className={fieldInputClass}
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
  options,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  "aria-label"?: string;
}) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger aria-label={ariaLabel} className={selectTriggerClass}>
      <SelectValue placeholder="Select" />
    </SelectTrigger>
    <SelectContent className={selectContentClass}>
      {options.map((o) => (
        <SelectItem
          key={o.value}
          value={o.value}
          className="text-white data-[highlighted]:bg-slate-800 data-[state=checked]:bg-slate-800"
        >
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ---------------------------------------------------
   Main Component (logic untouched; Beam-style UX)
--------------------------------------------------- */

export default function ColumnConcreteCalc() {
  const [tab, setTab] = useState<ColumnType>("rectangular");

  const [rect, setRect] = useState<RectangularInputs>({
    length: "",
    width: "",
    height: "",
    unit: "meters",
    count: "1",
    wastePct: "5",
  });

  const [circ, setCirc] = useState<CircularInputs>({
    diameter: "",
    height: "",
    unit: "meters",
    count: "1",
    wastePct: "5",
  });

  const [displayUnit, setDisplayUnit] = useState<VolumeUnit>("m3");

  // UX: show results only after Calculate
  const [submitted, setSubmitted] = useState(false);

  /* -------------------- Calculations (unchanged) -------------------- */
  const rectangular = useMemo(() => {
    const L = parseFloat(rect.length || "0");
    const W = parseFloat(rect.width || "0");
    const H = parseFloat(rect.height || "0");
    const N = Math.max(0, Math.floor(parseFloat(rect.count || "0")));
    const waste = Math.max(0, parseFloat(rect.wastePct || "0"));

    if (L <= 0 || W <= 0 || H <= 0 || N <= 0)
      return { perCol: 0, netTotal: 0, withWasteTotal: 0, ok: false as const };

    const Lm = toMeters(L, rect.unit);
    const Wm = toMeters(W, rect.unit);
    const Hm = toMeters(H, rect.unit);

    const perCol = Lm * Wm * Hm; // V = A × H
    const netTotal = perCol * N;
    const withWasteTotal = netTotal * (1 + waste / 100);

    return { perCol, netTotal, withWasteTotal, ok: true as const, count: N, waste };
  }, [rect]);

  const circular = useMemo(() => {
    const D = parseFloat(circ.diameter || "0");
    const H = parseFloat(circ.height || "0");
    const N = Math.max(0, Math.floor(parseFloat(circ.count || "0")));
    const waste = Math.max(0, parseFloat(circ.wastePct || "0"));

    if (D <= 0 || H <= 0 || N <= 0)
      return { perCol: 0, netTotal: 0, withWasteTotal: 0, ok: false as const };

    const r_m = toMeters(D, circ.unit) / 2;
    const h_m = toMeters(H, circ.unit);

    const perCol = Math.PI * r_m * r_m * h_m; // π r² H
    const netTotal = perCol * N;
    const withWasteTotal = netTotal * (1 + waste / 100);

    return { perCol, netTotal, withWasteTotal, ok: true as const, count: N, waste };
  }, [circ]);

  const active = tab === "rectangular" ? rectangular : circular;

  /* -------------------- Actions -------------------- */
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAll = () => {
    setRect({ length: "", width: "", height: "", unit: "meters", count: "1", wastePct: "5" });
    setCirc({ diameter: "", height: "", unit: "meters", count: "1", wastePct: "5" });
    setDisplayUnit("m3");
    setSubmitted(false);
  };

  /* -------------------- Render -------------------- */
  return (
    <Card className="mt-6 font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <CardHeader className="p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400 text-center">
          Column Concrete Calculator
        </CardTitle>
        <p className="text-sm text-slate-300 mt-1 text-center">
          Estimate volume for rectangular/square or circular columns. Includes quantity and waste allowance.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="flex items-start gap-2 rounded-sm border border-slate-700 bg-slate-900 p-3">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Keep all dimensions in the <span className="text-white font-medium">same unit</span>.
            Rectangular: <code className="text-slate-200">L × W × H</code>. Circular: <code className="text-slate-200">π × r² × H</code>.
          </p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-0">
          {/* STEP 1 — Choose Units (per shape) */}
          <section className={stepClass} aria-labelledby="step-units">
            <h3 id="step-units" className="text-sm font-semibold text-white/80">Step 1 — Choose Type of Column and Measuring Units</h3>
            <div className="mt-2 rounded-sm border border-slate-700 bg-slate-900 p-4">
              <Tabs value={tab} onValueChange={(v) => { setTab(v as ColumnType); setSubmitted(false); }} className="w-full ">
                <TabsList className="grid w-full grid-cols-2 rounded-sm bg-slate-950 p-1">
                  <TabsTrigger value="rectangular" className="rounded-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Rectangular / Square</TabsTrigger>
                  <TabsTrigger value="circular" className="rounded-sm data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">Circular</TabsTrigger>
                </TabsList>

                <TabsContent value="rectangular" className="mt-4">
                  <div className="flex max-w-xs items-center justify-between gap-2">
                    <div>
                    <Label className="text-teal-500">Units</Label>
                    </div>
                    <div>
                    <UnitSelect
                      aria-label="Units for rectangular column"
                      value={rect.unit}
                      onValueChange={(v) => { setRect((s) => ({ ...s, unit: v as LinearUnit })); setSubmitted(false); }}
                      options={[
                        { value: "meters", label: "Meters (m)" },
                        { value: "centimeters", label: "Centimeters (cm)" },
                        { value: "feet", label: "Feet (ft)" },
                        { value: "inches", label: "Inches (in)" },
                      ]}
                    />
                    <p className="mt-1 text-xs text-white/60">All dimensions below will be interpreted in <span className="text-white">{unitAbbrev[rect.unit]}</span>.</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="circular" className="mt-4">
                  <div className="max-w-xs">
                    <Label className="text-teal-500">Units</Label>
                    <UnitSelect
                      aria-label="Units for circular column"
                      value={circ.unit}
                      onValueChange={(v) => { setCirc((s) => ({ ...s, unit: v as LinearUnit })); setSubmitted(false); }}
                      options={[
                        { value: "meters", label: "Meters (m)" },
                        { value: "centimeters", label: "Centimeters (cm)" },
                        { value: "feet", label: "Feet (ft)" },
                        { value: "inches", label: "Inches (in)" },
                      ]}
                    />
                    <p className="mt-1 text-xs text-white/60">All dimensions below will be interpreted in <span className="text-white">{unitAbbrev[circ.unit]}</span>.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* STEP 2 — Core Dimensions */}
          <section className={stepClass} aria-labelledby="step-dimensions">
            <h3 id="step-dimensions" className="text-sm font-semibold text-white/80">Step 2 — Core Dimensions</h3>

            {/* Rectangular */}
            {tab === "rectangular" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="rect-length" label="Length (L)" hint={`Overall length of column section.`} subHint={`Typical 0.30–0.60 ${unitAbbrev[rect.unit]}`}>
                  <NumberInput
                    id="rect-length"
                    value={rect.length}
                    onChange={(v) => { setRect((s) => ({ ...s, length: v })); setSubmitted(false); }}
                    placeholder={rect.unit === "feet" ? "e.g., 1" : "e.g., 0.4"}
                    badge={unitAbbrev[rect.unit]}
                  />
                </Field>

                <Field id="rect-width" label="Width (W)" hint={`Overall width of column section.`} subHint={`Typical 0.23–0.30 ${unitAbbrev[rect.unit]}`}>
                  <NumberInput
                    id="rect-width"
                    value={rect.width}
                    onChange={(v) => { setRect((s) => ({ ...s, width: v })); setSubmitted(false); }}
                    placeholder={rect.unit === "feet" ? "e.g., 1" : "e.g., 0.3"}
                    badge={unitAbbrev[rect.unit]}
                  />
                </Field>

                <Field id="rect-height" label="Height (H)" hint={`Clear height of the column.`} subHint={`Typical 2.7–3.6 ${unitAbbrev[rect.unit]}`}>
                  <NumberInput
                    id="rect-height"
                    value={rect.height}
                    onChange={(v) => { setRect((s) => ({ ...s, height: v })); setSubmitted(false); }}
                    placeholder={rect.unit === "feet" ? "e.g., 9" : "e.g., 3"}
                    badge={unitAbbrev[rect.unit]}
                  />
                </Field>
              </div>
            )}

            {/* Circular */}
            {tab === "circular" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="circ-diam" label="Diameter (D)" hint={`Full diameter of the circular section.`} subHint={`Typical 0.30–0.60 ${unitAbbrev[circ.unit]}`}>
                  <NumberInput
                    id="circ-diam"
                    value={circ.diameter}
                    onChange={(v) => { setCirc((s) => ({ ...s, diameter: v })); setSubmitted(false); }}
                    placeholder={circ.unit === "feet" ? "e.g., 1" : "e.g., 0.5"}
                    badge={unitAbbrev[circ.unit]}
                  />
                </Field>

                <Field id="circ-height" label="Height (H)" hint={`Clear height of the column.`} subHint={`Typical 2.7–3.6 ${unitAbbrev[circ.unit]}`}>
                  <NumberInput
                    id="circ-height"
                    value={circ.height}
                    onChange={(v) => { setCirc((s) => ({ ...s, height: v })); setSubmitted(false); }}
                    placeholder={circ.unit === "feet" ? "e.g., 9" : "e.g., 3"}
                    badge={unitAbbrev[circ.unit]}
                  />
                </Field>
              </div>
            )}
          </section>

          {/* STEP 3 — Quantity & Waste */}
          <section className={stepClass} aria-labelledby="step-qty">
            <h3 id="step-qty" className="text-sm font-semibold text-white/80">Step 3 — Quantity & Waste Allowance</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {tab === "rectangular" ? (
                <Field id="rect-count" label="Quantity (No. of Columns)" hint="Enter identical columns with same dimensions.">
                  <NumberInput
                    id="rect-count"
                    value={rect.count}
                    onChange={(v) => {
                      const clean = v.replace(/[^0-9]/g, "");
                      setRect((s) => ({ ...s, count: clean }));
                      setSubmitted(false);
                    }}
                    placeholder="e.g., 4"
                  />
                </Field>
              ) : (
                <Field id="circ-count" label="Quantity (No. of Columns)" hint="Enter identical columns with same dimensions.">
                  <NumberInput
                    id="circ-count"
                    value={circ.count}
                    onChange={(v) => {
                      const clean = v.replace(/[^0-9]/g, "");
                      setCirc((s) => ({ ...s, count: clean }));
                      setSubmitted(false);
                    }}
                    placeholder="e.g., 6"
                  />
                </Field>
              )}

              {tab === "rectangular" ? (
                <Field id="rect-waste" label="Waste Allowance (%)" hint="Adds extra volume to cover spillage, uneven formwork, etc." subHint="Typical 5–10%">
                  <NumberInput
                    id="rect-waste"
                    value={rect.wastePct}
                    onChange={(v) => { setRect((s) => ({ ...s, wastePct: v })); setSubmitted(false); }}
                    placeholder="5"
                    badge="%"
                  />
                </Field>
              ) : (
                <Field id="circ-waste" label="Waste Allowance (%)" hint="Adds extra volume to cover spillage, uneven formwork, etc." subHint="Typical 5–10%">
                  <NumberInput
                    id="circ-waste"
                    value={circ.wastePct}
                    onChange={(v) => { setCirc((s) => ({ ...s, wastePct: v })); setSubmitted(false); }}
                    placeholder="5"
                    badge="%"
                  />
                </Field>
              )}
            </div>
          </section>

          {/* STEP 4 — Output Unit & Actions */}
          <section className={stepClass} aria-labelledby="step-output">
            <h3 id="step-output" className="text-sm font-semibold text-white/80">Step 4 — Output Units & Actions</h3>
            <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-white">Show in:</span>
                  <UnitSelect
                    aria-label="Output unit"
                    value={displayUnit}
                    onValueChange={(v) => { setDisplayUnit(v as VolumeUnit); }}
                    options={[
                      { value: "m3", label: "m³" },
                      { value: "yd3", label: "yd³" },
                      { value: "ft3", label: "ft³" },
                    ]}
                  />
                  {active.ok ? (
                    <span className="ml-auto rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200">
                      Qty: {tab === "rectangular" ? rectangular.count : circular.count}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0">Calculate</Button>
                <Button type="button" onClick={resetAll} className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400">Reset</Button>
              </div>
            </div>
          </section>
        </form>

        {/* Results (hidden until Calculate) */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.</p>
        ) : !active.ok ? (
          <p className="mt-4 text-sm text-red-300">Please enter valid positive numbers for all required fields.</p>
        ) : (
          <>
            {/* Inputs Summary */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {tab === "rectangular" ? (
                  <>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Type</span><span className="text-teal-400 font-semibold">Rectangular</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Units</span><span className="text-teal-400 font-semibold">{unitAbbrev[rect.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Length</span><span className="text-teal-400 font-semibold">{rect.length || 0} {unitAbbrev[rect.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Width</span><span className="text-teal-400 font-semibold">{rect.width || 0} {unitAbbrev[rect.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Height</span><span className="text-teal-400 font-semibold">{rect.height || 0} {unitAbbrev[rect.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Quantity</span><span className="text-teal-400 font-semibold">{rect.count || 0}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Waste</span><span className="text-teal-400 font-semibold">{rect.wastePct || 0}%</span></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Type</span><span className="text-teal-400 font-semibold">Circular</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Units</span><span className="text-teal-400 font-semibold">{unitAbbrev[circ.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Diameter</span><span className="text-teal-400 font-semibold">{circ.diameter || 0} {unitAbbrev[circ.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Height</span><span className="text-teal-400 font-semibold">{circ.height || 0} {unitAbbrev[circ.unit]}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Quantity</span><span className="text-teal-400 font-semibold">{circ.count || 0}</span></div>
                    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2"><span className="text-white/70">Waste</span><span className="text-teal-400 font-semibold">{circ.wastePct || 0}%</span></div>
                  </>
                )}
              </div>
            </div>

            {/* Result tiles */}
            <div className={`${stepClass} grid grid-cols-1 sm:grid-cols-3 gap-4 border-none`}>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Net Total</p>
                <p className="mt-1 text-2xl font-semibold text-teal-400">{fmt(m3To(active.netTotal, displayUnit))} {displayUnit}</p>
              </div>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">With Waste</p>
                <p className="mt-1 text-2xl font-semibold text-teal-400">{fmt(m3To(active.withWasteTotal, displayUnit))} {displayUnit}</p>
              </div>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Waste Added</p>
                <p className="mt-1 text-2xl font-semibold text-teal-400">{fmt(m3To(active.withWasteTotal - active.netTotal, displayUnit))} {displayUnit}</p>
              </div>
            </div>

            {/* Cubic Yards Helper */}
            <div className={`${stepClass} rounded-sm border border-slate-700 bg-slate-900 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (with waste)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(m3To(active.withWasteTotal, "yd3"))} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(m3To(active.withWasteTotal, "yd3") * 1.05)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(m3To(active.withWasteTotal, "yd3") * 1.1)} yd³</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Formula recap */}
        <div className={`${stepClass} rounded-sm border border-slate-700 bg-slate-900 p-4`}>
          <h3 className="text-base sm:text-lg font-semibold text-white">How the Calculator Works</h3>
          <div className="mt-2 grid gap-2 text-sm text-slate-300">
            <p><span className="font-medium text-white">Rectangular / Square:</span> Convert inputs to meters, compute <code className="text-slate-200">L × W × H</code>. Multiply by <code className="text-slate-200">Quantity</code>, then apply waste: <code className="text-slate-200">V × (1 + waste%)</code>.</p>
            <p><span className="font-medium text-white">Circular:</span> Convert diameter and height to meters, compute <code className="text-slate-200">π × r² × H</code> with <code className="text-slate-200">r = diameter / 2</code>. Multiply by <code className="text-slate-200">Quantity</code>, then add waste.</p>
            <p>Use the output unit toggle to view results as m³, ft³, or yd³.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
