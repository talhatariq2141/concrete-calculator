// components/PierCaissonCalc.tsx
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

/* -----------------------------
   UI TOKENS (use as provided)
----------------------------- */
const inputBase =
  "bg-slate-900 text-white placeholder-slate-400 border border-transparent focus:border-teal-400 focus:outline-none rounded-lg h-11 px-3 w-full";
const labelBase = "text-white text-sm font-medium";
const group = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const card =
  "bg-slate-800 rounded-2xl p-4 md:p-6 shadow-xl border border-slate-800"; // lowered padding

/* -----------------------------
   Types / Units
----------------------------- */
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

/* -----------------------------
   Helpers (math unchanged)
----------------------------- */
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
const fmt = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—";

/* -----------------------------
   Small UI primitives
----------------------------- */
const Field = ({
  id,
  label,
  hint,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label htmlFor={id} className={labelBase}>
      {label}
    </Label>
    {children}
    {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
  </div>
);

const NumberInput = ({
  id,
  value,
  onChange,
  placeholder,
  numeric = false,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
}) => (
  <Input
    id={id}
    inputMode={numeric ? "numeric" : "decimal"}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={inputBase}
  />
);

const UnitSelect = ({
  value,
  onValueChange,
}: {
  value: LinearUnit;
  onValueChange: (v: LinearUnit) => void;
}) => (
  <Select value={value} onValueChange={(v) => onValueChange(v as LinearUnit)}>
    <SelectTrigger className={inputBase}>
      <SelectValue placeholder="Units" />
    </SelectTrigger>
    <SelectContent className="bg-slate-900 text-white border border-slate-700">
      {["m", "cm", "mm", "ft", "in"].map((u) => (
        <SelectItem
          key={u}
          value={u}
          className="data-[highlighted]:bg-slate-800 data-[state=checked]:bg-slate-800"
        >
          {u}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* -----------------------------
   Component
----------------------------- */
export default function PierCaissonCalc() {
  const [inputs, setInputs] = useState<Inputs>({
    unit: "m",
    diameter: "0.6",
    depth: "3",
    qty: "4",
    wastePct: "5",
    hasBell: false,
    bellTopDia: "0.6",
    bellBottomDia: "1.0",
    bellHeight: "0.4",
  });

  const [results, setResults] = useState<Results>(null);

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

  const onCalculate = () => {
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
  };

  const reset = () => {
    setInputs({
      unit: "m",
      diameter: "0.6",
      depth: "3",
      qty: "4",
      wastePct: "5",
      hasBell: false,
      bellTopDia: "0.6",
      bellBottomDia: "1.0",
      bellHeight: "0.4",
    });
    setResults(null);
  };

  return (
    <Card className={`${card} overflow-hidden`}>
      <CardHeader className="p-3 md:p-4">
        <CardTitle className="text-xl md:text-2xl font-bold text-teal-400">
          Pier / Caisson Concrete Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-3 md:p-4">
        {/* Unit + Waste */}
        <section className={group}>
          <Field label="Input Unit">
            <UnitSelect
              value={inputs.unit}
              onValueChange={(unit) => setInputs((s) => ({ ...s, unit }))}
            />
          </Field>
          <Field label="Waste / Overage (%)" hint="Typical allowance: 5–10%">
            <NumberInput
              value={inputs.wastePct}
              onChange={(v) => setInputs((s) => ({ ...s, wastePct: v }))}
              placeholder="5"
            />
          </Field>
        </section>

        {/* Shaft */}
        <section className="rounded-xl border border-slate-700 bg-slate-700 p-3 md:p-4">
          <h3 className="text-white font-semibold">Shaft (Cylinder)</h3>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label={`Diameter (${inputs.unit})`}>
              <NumberInput
                value={inputs.diameter}
                onChange={(v) => setInputs((s) => ({ ...s, diameter: v }))}
                placeholder={inputs.unit === "m" ? "0.6" : ""}
              />
            </Field>
            <Field label={`Depth (${inputs.unit})`}>
              <NumberInput
                value={inputs.depth}
                onChange={(v) => setInputs((s) => ({ ...s, depth: v }))}
                placeholder={inputs.unit === "m" ? "3" : ""}
              />
            </Field>
            <Field label="Quantity (No. of Piers)">
              <NumberInput
                value={inputs.qty}
                onChange={(v) => setInputs((s) => ({ ...s, qty: v }))}
                placeholder="4"
                numeric
              />
            </Field>
          </div>
        </section>

        {/* Bell Toggle */}
        <section className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-white font-semibold">Belled Base (Optional)</h4>
            <p className="text-xs md:text-sm text-slate-300">
              Adds a frustum volume at the bottom (useful for belled caissons).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-lg">
            <Switch
              checked={inputs.hasBell}
              onCheckedChange={(v) => setInputs((s) => ({ ...s, hasBell: v }))}
            />
            <span className="text-sm text-white">{inputs.hasBell ? "Enabled" : "Disabled"}</span>
          </div>
        </section>

        {/* Bell inputs */}
        {inputs.hasBell && (
          <section className="rounded-xl border border-slate-700 bg-slate-700 p-3 md:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label={`Top Diameter (${inputs.unit})`} hint="Often equals shaft diameter">
                <NumberInput
                  value={inputs.bellTopDia}
                  onChange={(v) => setInputs((s) => ({ ...s, bellTopDia: v }))}
                  placeholder={inputs.unit === "m" ? "0.6" : ""}
                />
              </Field>
              <Field label={`Bottom Diameter (${inputs.unit})`}>
                <NumberInput
                  value={inputs.bellBottomDia}
                  onChange={(v) => setInputs((s) => ({ ...s, bellBottomDia: v }))}
                  placeholder={inputs.unit === "m" ? "1.0" : ""}
                />
              </Field>
              <Field label={`Bell Height (${inputs.unit})`}>
                <NumberInput
                  value={inputs.bellHeight}
                  onChange={(v) => setInputs((s) => ({ ...s, bellHeight: v }))}
                  placeholder={inputs.unit === "m" ? "0.4" : ""}
                />
              </Field>
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="flex flex-wrap gap-2">
          <Button
            className="h-11 px-5 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:opacity-90"
            type="button"
            onClick={onCalculate}
            disabled={!canCalculate}
          >
            Calculate
          </Button>
          <Button
            className="h-11 px-5 rounded-lg border border-slate-700 bg-slate-900 text-white hover:bg-slate-900/90"
            variant="outline"
            type="button"
            onClick={reset}
          >
            Reset
          </Button>
        </section>

        {/* Results */}
        {results && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Per Pier */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 md:p-4">
              <h5 className="text-teal-400 font-semibold">Per Pier</h5>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-300">Net (m³)</div>
                <div className="text-right text-white font-medium">{fmt(results.perPier.m3)}</div>
                <div className="text-slate-300">Net (yd³)</div>
                <div className="text-right text-white font-medium">{fmt(results.perPier.yd3)}</div>
                <div className="text-slate-300">Net (ft³)</div>
                <div className="text-right text-white font-medium">{fmt(results.perPier.ft3)}</div>

                <div className="col-span-2 mt-2 border-t border-slate-700" />
                <div className="text-slate-300">With Waste (m³)</div>
                <div className="text-right text-white font-semibold">
                  {fmt(results.perPierWaste.m3)}
                </div>
                <div className="text-slate-300">With Waste (yd³)</div>
                <div className="text-right text-white font-semibold">
                  {fmt(results.perPierWaste.yd3)}
                </div>
                <div className="text-slate-300">With Waste (ft³)</div>
                <div className="text-right text-white font-semibold">
                  {fmt(results.perPierWaste.ft3)}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 md:p-4">
              <h5 className="text-teal-400 font-semibold">
                Total ({parseFloat(inputs.qty) || 0} pier{parseFloat(inputs.qty) === 1 ? "" : "s"})
              </h5>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-300">Net (m³)</div>
                <div className="text-right text-white font-medium">{fmt(results.total.m3)}</div>
                <div className="text-slate-300">Net (yd³)</div>
                <div className="text-right text-white font-medium">{fmt(results.total.yd3)}</div>
                <div className="text-slate-300">Net (ft³)</div>
                <div className="text-right text-white font-medium">{fmt(results.total.ft3)}</div>

                <div className="col-span-2 mt-2 border-t border-slate-700" />
                <div className="text-slate-300">With Waste (m³)</div>
                <div className="text-right text-white font-semibold">
                  {fmt(results.totalWaste.m3)}
                </div>
                <div className="text-slate-300">With Waste (yd³)</div>
                <div className="text-right text-white font-semibold">
                  {fmt(results.totalWaste.yd3)}
                </div>
                <div className="text-slate-300">With Waste (ft³)</div>
                <div className="text-right text-white font-semibold">
                  {fmt(results.totalWaste.ft3)}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Formula helper (tiny, unobtrusive) */}
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-3 md:p-4">
          <h6 className="text-white font-semibold">Formulas Used</h6>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-300">
            <li>
              Shaft (cylinder): <span className="text-white">V = π r² h</span>
            </li>
            {inputs.hasBell && (
              <li>
                Bell (frustum):{" "}
                <span className="text-white">
                  V = (π h / 3) (R₁² + R₁R₂ + R₂²)
                </span>
              </li>
            )}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
