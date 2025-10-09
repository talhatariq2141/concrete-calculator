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
   UI Tokens (as provided)
--------------------------------------------------- */
const inputBase =
  "bg-slate-900 text-white placeholder-slate-400 border border-transparent focus:border-teal-400 focus:outline-none rounded-lg h-11 px-3 w-full";
const labelBase = "text-white text-sm font-medium";
const group = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const card =
  "bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800";

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
   Helpers (unchanged)
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

const fmt = (n: number) =>
  Number.isFinite(n)
    ? Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(n)
    : "—";

/* ---------------------------------------------------
   UI Primitives (restyled only)
--------------------------------------------------- */
const Field = ({
  id,
  label,
  children,
  hint,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className={labelBase}>
      {label}
    </Label>
    {children}
    {hint ? (
      <p className="text-xs text-slate-400">{hint}</p>
    ) : null}
  </div>
);

const NumberInput = ({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
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
    className={inputBase}
  />
);

const UnitSelect = ({
  value,
  onValueChange,
  options,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (v: any) => void;
  options: { value: string; label: string }[];
  "aria-label"?: string;
}) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger aria-label={ariaLabel} className={inputBase}>
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="bg-slate-900 text-white border border-slate-700">
      {options.map((o) => (
        <SelectItem
          key={o.value}
          value={o.value}
          className="data-[highlighted]:bg-slate-800 data-[state=checked]:bg-slate-800"
        >
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ---------------------------------------------------
   Main Component (logic unchanged)
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

  /* -------------------- Calculations (unchanged) -------------------- */
  const rectangular = useMemo(() => {
    const L = parseFloat(rect.length || "0");
    const W = parseFloat(rect.width || "0");
    const H = parseFloat(rect.height || "0");
    const N = Math.max(0, Math.floor(parseFloat(rect.count || "0")));
    const waste = Math.max(0, parseFloat(rect.wastePct || "0"));

    if (L <= 0 || W <= 0 || H <= 0 || N <= 0)
      return { perCol: 0, netTotal: 0, withWasteTotal: 0, ok: false };

    const Lm = toMeters(L, rect.unit);
    const Wm = toMeters(W, rect.unit);
    const Hm = toMeters(H, rect.unit);

    const perCol = Lm * Wm * Hm; // V = A × H
    const netTotal = perCol * N;
    const withWasteTotal = netTotal * (1 + waste / 100);

    return { perCol, netTotal, withWasteTotal, ok: true, count: N, waste };
  }, [rect]);

  const circular = useMemo(() => {
    const D = parseFloat(circ.diameter || "0");
    const H = parseFloat(circ.height || "0");
    const N = Math.max(0, Math.floor(parseFloat(circ.count || "0")));
    const waste = Math.max(0, parseFloat(circ.wastePct || "0"));

    if (D <= 0 || H <= 0 || N <= 0)
      return { perCol: 0, netTotal: 0, withWasteTotal: 0, ok: false };

    const r_m = toMeters(D, circ.unit) / 2;
    const h_m = toMeters(H, circ.unit);

    const perCol = Math.PI * r_m * r_m * h_m; // π r² H
    const netTotal = perCol * N;
    const withWasteTotal = netTotal * (1 + waste / 100);

    return { perCol, netTotal, withWasteTotal, ok: true, count: N, waste };
  }, [circ]);

  const active = tab === "rectangular" ? rectangular : circular;

  const outputs = useMemo(() => {
    const net = active.netTotal || 0;
    const withWaste = active.withWasteTotal || 0;
    const added = withWaste - net;

    return {
      net_m3: net,
      withWaste_m3: withWaste,
      added_m3: Math.max(0, added),
      net: { m3: m3To(net, "m3"), ft3: m3To(net, "ft3"), yd3: m3To(net, "yd3") },
      withWaste: {
        m3: m3To(withWaste, "m3"),
        ft3: m3To(withWaste, "ft3"),
        yd3: m3To(withWaste, "yd3"),
      },
      added: {
        m3: m3To(Math.max(0, added), "m3"),
        ft3: m3To(Math.max(0, added), "ft3"),
        yd3: m3To(Math.max(0, added), "yd3"),
      },
    };
  }, [active]);

  const disabled = !(tab === "rectangular" ? rectangular.ok : circular.ok);

  const resetAll = () => {
    setRect({
      length: "",
      width: "",
      height: "",
      unit: "meters",
      count: "1",
      wastePct: "5",
    });
    setCirc({
      diameter: "",
      height: "",
      unit: "meters",
      count: "1",
      wastePct: "5",
    });
  };

  /* -------------------- Render (restyled only) -------------------- */
  return (
    <Card className={card + " overflow-hidden"}>
      <CardHeader className="p-0">
        <div className="mb-6 rounded-xl px-4 py-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-teal-400">
            Column Concrete Calculator
          </CardTitle>
          <p className="text-sm text-slate-300 mt-1">
            Estimate concrete volume for rectangular/square or circular columns. Includes quantity
            and waste allowance.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-0">
        {/* Info strip */}
        <div className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-800">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            <span className="font-medium text-white">Formulas:</span>{" "}
            Rectangular/Square: <code className="text-slate-200">L × W × H</code>. Circular:{" "}
            <code className="text-slate-200">π × r² × H</code>. Total equals Per-Column × Quantity,
            then waste is applied.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as ColumnType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-lg bg-slate-900 p-1">
            <TabsTrigger
              value="rectangular"
              className="rounded-md data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
            >
              Rectangular / Square
            </TabsTrigger>
            <TabsTrigger
              value="circular"
              className="rounded-md data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
            >
              Circular
            </TabsTrigger>
          </TabsList>

          {/* Rectangular */}
          <TabsContent value="rectangular" className="mt-4">
            <div className={group}>
              <Field id="rect-length" label="Length">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <NumberInput
                    id="rect-length"
                    value={rect.length}
                    onChange={(v) => setRect((s) => ({ ...s, length: v }))}
                    placeholder="e.g., 0.40"
                  />
                  <UnitSelect
                    aria-label="Length unit"
                    value={rect.unit}
                    onValueChange={(v: LinearUnit) => setRect((s) => ({ ...s, unit: v }))}
                    options={[
                      { value: "meters", label: "m" },
                      { value: "centimeters", label: "cm" },
                      { value: "feet", label: "ft" },
                      { value: "inches", label: "in" },
                    ]}
                  />
                </div>
              </Field>

              <Field id="rect-width" label="Width">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <NumberInput
                    id="rect-width"
                    value={rect.width}
                    onChange={(v) => setRect((s) => ({ ...s, width: v }))}
                    placeholder="e.g., 0.30"
                  />
                  <UnitSelect
                    aria-label="Width unit"
                    value={rect.unit}
                    onValueChange={(v: LinearUnit) => setRect((s) => ({ ...s, unit: v }))}
                    options={[
                      { value: "meters", label: "m" },
                      { value: "centimeters", label: "cm" },
                      { value: "feet", label: "ft" },
                      { value: "inches", label: "in" },
                    ]}
                  />
                </div>
              </Field>

              <Field id="rect-height" label="Height">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <NumberInput
                    id="rect-height"
                    value={rect.height}
                    onChange={(v) => setRect((s) => ({ ...s, height: v }))}
                    placeholder="e.g., 3"
                  />
                  <UnitSelect
                    aria-label="Height unit"
                    value={rect.unit}
                    onValueChange={(v: LinearUnit) => setRect((s) => ({ ...s, unit: v }))}
                    options={[
                      { value: "meters", label: "m" },
                      { value: "centimeters", label: "cm" },
                      { value: "feet", label: "ft" },
                      { value: "inches", label: "in" },
                    ]}
                  />
                </div>
              </Field>

              <Field id="rect-count" label="Quantity (No. of Columns)">
                <NumberInput
                  id="rect-count"
                  value={rect.count}
                  onChange={(v) => {
                    const clean = v.replace(/[^0-9]/g, "");
                    setRect((s) => ({ ...s, count: clean }));
                  }}
                  placeholder="e.g., 4"
                />
              </Field>

              <Field id="rect-waste" label="Waste Allowance (%)" hint="Typical: 5–10%.">
                <NumberInput
                  id="rect-waste"
                  value={rect.wastePct}
                  onChange={(v) => setRect((s) => ({ ...s, wastePct: v }))}
                  placeholder="5"
                />
              </Field>
            </div>
          </TabsContent>

          {/* Circular */}
          <TabsContent value="circular" className="mt-4">
            <div className={group}>
              <Field id="circ-diameter" label="Diameter">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <NumberInput
                    id="circ-diameter"
                    value={circ.diameter}
                    onChange={(v) => setCirc((s) => ({ ...s, diameter: v }))}
                    placeholder="e.g., 0.50"
                  />
                  <UnitSelect
                    aria-label="Diameter unit"
                    value={circ.unit}
                    onValueChange={(v: LinearUnit) => setCirc((s) => ({ ...s, unit: v }))}
                    options={[
                      { value: "meters", label: "m" },
                      { value: "centimeters", label: "cm" },
                      { value: "feet", label: "ft" },
                      { value: "inches", label: "in" },
                    ]}
                  />
                </div>
              </Field>

              <Field id="circ-height" label="Height">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <NumberInput
                    id="circ-height"
                    value={circ.height}
                    onChange={(v) => setCirc((s) => ({ ...s, height: v }))}
                    placeholder="e.g., 3"
                  />
                  <UnitSelect
                    aria-label="Height unit"
                    value={circ.unit}
                    onValueChange={(v: LinearUnit) => setCirc((s) => ({ ...s, unit: v }))}
                    options={[
                      { value: "meters", label: "m" },
                      { value: "centimeters", label: "cm" },
                      { value: "feet", label: "ft" },
                      { value: "inches", label: "in" },
                    ]}
                  />
                </div>
              </Field>

              <Field id="circ-count" label="Quantity (No. of Columns)">
                <NumberInput
                  id="circ-count"
                  value={circ.count}
                  onChange={(v) => {
                    const clean = v.replace(/[^0-9]/g, "");
                    setCirc((s) => ({ ...s, count: clean }));
                  }}
                  placeholder="e.g., 6"
                />
              </Field>

              <Field id="circ-waste" label="Waste Allowance (%)" hint="Typical: 5–10%.">
                <NumberInput
                  id="circ-waste"
                  value={circ.wastePct}
                  onChange={(v) => setCirc((s) => ({ ...s, wastePct: v }))}
                  placeholder="5"
                />
              </Field>
            </div>
          </TabsContent>
        </Tabs>

        {/* Output & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:items-end">
          <div className="rounded-xl border border-slate-800 bg-slate-700 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-white">Show in:</span>
              <UnitSelect
                aria-label="Output unit"
                value={displayUnit}
                onValueChange={(v: VolumeUnit) => setDisplayUnit(v)}
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

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <p className="text-xs text-slate-400">Net Total</p>
                <p className="text-lg font-semibold text-white">
                  {fmt(m3To(active.netTotal || 0, displayUnit))} {displayUnit}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <p className="text-xs text-slate-400">With Waste</p>
                <p className="text-lg font-semibold text-white">
                  {fmt(m3To(active.withWasteTotal || 0, displayUnit))} {displayUnit}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
                <p className="text-xs text-slate-400">Waste Added</p>
                <p className="text-lg font-semibold text-white">
                  {fmt(
                    m3To(
                      (active.withWasteTotal || 0) - (active.netTotal || 0),
                      displayUnit
                    )
                  )}{" "}
                  {displayUnit}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Tip: Quantity multiplies per-column volume. Waste is applied after multiplication.
            </p>
          </div>

          <div className="flex gap-2">
            {/* Behavior preserved: Calculate button remains omitted */}
            <Button
              type="button"
              variant="outline"
              onClick={resetAll}
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Formula Recap */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            How the Calculator Works
          </h3>
          <div className="mt-2 grid gap-2 text-sm text-slate-300">
            <p>
              <span className="font-medium text-white">Rectangular / Square:</span>{" "}
              Convert inputs to meters, compute <code className="text-slate-200">L × W × H</code>.
              Multiply by <code className="text-slate-200">Quantity</code>, then apply waste:{" "}
              <code className="text-slate-200">V × (1 + waste%)</code>.
            </p>
            <p>
              <span className="font-medium text-white">Circular:</span>{" "}
              Convert diameter and height to meters, compute{" "}
              <code className="text-slate-200">π × r² × H</code> with{" "}
              <code className="text-slate-200">r = diameter / 2</code>. Multiply by{" "}
              <code className="text-slate-200">Quantity</code>, then add waste.
            </p>
            <p>Display units toggle between m³, ft³, and yd³.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
