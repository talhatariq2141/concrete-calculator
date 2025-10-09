// components/FootingConcreteCalc.tsx
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

/* ----------------------------- */
/* Design tokens (USE THESE)     */
/* ----------------------------- */
const inputBase =
  "bg-slate-900 text-white placeholder-slate-400 border border-transparent focus:border-teal-400 focus:outline-none rounded-lg h-11 px-3 w-full";
const labelBase = "text-white text-sm font-medium";
const group = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const card =  "bg-slate-800 rounded-2xl p-2 md:p-8 shadow-xl border border-slate-800";

/* ----------------------------- */
/* Types                         */
/* ----------------------------- */
type FootingType = "rectangular" | "circular";
type LinearUnit = "meters" | "centimeters" | "feet" | "inches";
type VolumeUnit = "m3" | "ft3" | "yd3";

type RectangularInputs = {
  length: string;
  width: string;
  depth: string;
  unit: LinearUnit;
  wastePct: string;
};

type CircularInputs = {
  diameter: string;
  depth: string;
  unit: LinearUnit;
  wastePct: string;
};

/* ----------------------------- */
/* Unit helpers                  */
/* ----------------------------- */
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

/* ----------------------------- */
/* UI primitives (restyled only) */
/* ----------------------------- */
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
    {hint ? <p className="text-xs text-white/60">{hint}</p> : null}
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
      // allow empty, digits, and one dot
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
    <SelectContent className="rounded-xl bg-slate-900 text-white border border-slate-700">
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

/* ----------------------------- */
/* Main Component (logic intact) */
/* ----------------------------- */
export default function FootingConcreteCalc() {
  const [tab, setTab] = useState<FootingType>("rectangular");

  const [rect, setRect] = useState<RectangularInputs>({
    length: "",
    width: "",
    depth: "",
    unit: "meters",
    wastePct: "5",
  });

  const [circ, setCirc] = useState<CircularInputs>({
    diameter: "",
    depth: "",
    unit: "meters",
    wastePct: "5",
  });

  const [displayUnit, setDisplayUnit] = useState<VolumeUnit>("m3");

  /* -------------------- Calculations (unchanged) -------------------- */
  const rectangular = useMemo(() => {
    const L = parseFloat(rect.length || "0");
    const W = parseFloat(rect.width || "0");
    const D = parseFloat(rect.depth || "0");
    const waste = Math.max(0, parseFloat(rect.wastePct || "0"));

    if (L <= 0 || W <= 0 || D <= 0) return { m3: 0, withWaste: 0, ok: false };

    const Lm = toMeters(L, rect.unit);
    const Wm = toMeters(W, rect.unit);
    const Dm = toMeters(D, rect.unit);

    const m3 = Lm * Wm * Dm;
    const withWaste = m3 * (1 + waste / 100);
    return { m3, withWaste, ok: true };
  }, [rect]);

  const circular = useMemo(() => {
    const dia = parseFloat(circ.diameter || "0");
    const D = parseFloat(circ.depth || "0");
    const waste = Math.max(0, parseFloat(circ.wastePct || "0"));

    if (dia <= 0 || D <= 0) return { m3: 0, withWaste: 0, ok: false };

    const r_m = toMeters(dia, circ.unit) / 2;
    const d_m = toMeters(D, circ.unit);

    const m3 = Math.PI * r_m * r_m * d_m;
    const withWaste = m3 * (1 + waste / 100);
    return { m3, withWaste, ok: true };
  }, [circ]);

  const active = tab === "rectangular" ? rectangular : circular;

  const outputs = useMemo(() => {
    const base = active.withWaste || 0;
    return {
      m3: m3To(base, "m3"),
      ft3: m3To(base, "ft3"),
      yd3: m3To(base, "yd3"),
    };
  }, [active]);

  const disabled = !(tab === "rectangular" ? rectangular.ok : circular.ok);

  const resetAll = () => {
    setRect({ length: "", width: "", depth: "", unit: "meters", wastePct: "5" });
    setCirc({ diameter: "", depth: "", unit: "meters", wastePct: "5" });
  };

  /* ----------------------------- */
  /* Render (UI only changes)      */
  /* ----------------------------- */
  return (
    <Card className={`${card} overflow-hidden`}>
      {/* Header */}
      <CardHeader className="p-0">
        <div className="rounded-2xl bg-slate-900 p-6 md:p-8">
          <CardTitle className="text-2xl md:text-3xl font-bold text-teal-400">
            Footing Concrete Calculator
          </CardTitle>
          <p className="mt-2 text-sm text-white/70">
            Estimate concrete volume for rectangular/square or circular footings. Includes an
            optional waste allowance.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-0 pt-4">
        {/* Info strip */}
        <div className="mx-6 md:mx-8 rounded-xl border border-slate-800 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-white/80">
            <span className="font-medium text-white">Formulas:</span> Rectangular:{" "}
            <code>L × W × D</code>. Circular: <code>π × r² × D</code>.
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8">
          <Tabs value={tab} onValueChange={(v) => setTab(v as FootingType)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-900 p-1">
              <TabsTrigger
                value="rectangular"
                className="rounded-lg data-[state=active]:bg-teal-400 data-[state=active]:text-slate-900 text-white"
              >
                Rectangular / Square
              </TabsTrigger>
              <TabsTrigger
                value="circular"
                className="rounded-lg data-[state=active]:bg-teal-400 data-[state=active]:text-slate-900 text-white"
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
                      placeholder="e.g., 2.4"
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
                      placeholder="e.g., 0.9"
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

                <Field id="rect-depth" label="Depth (Thickness)">
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <NumberInput
                      id="rect-depth"
                      value={rect.depth}
                      onChange={(v) => setRect((s) => ({ ...s, depth: v }))}
                      placeholder="e.g., 0.45"
                    />
                    <UnitSelect
                      aria-label="Depth unit"
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

                <Field
                  id="rect-waste"
                  label="Waste Allowance (%)"
                  hint="Include extra for spillage/over-excavation."
                >
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
                      placeholder="e.g., 0.8"
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

                <Field id="circ-depth" label="Depth (Thickness)">
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <NumberInput
                      id="circ-depth"
                      value={circ.depth}
                      onChange={(v) => setCirc((s) => ({ ...s, depth: v }))}
                      placeholder="e.g., 0.5"
                    />
                    <UnitSelect
                      aria-label="Depth unit"
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
        </div>

        {/* Output & Actions */}
        <div className="px-6 md:px-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:items-end">
          <div className="rounded-2xl border border-slate-800 bg-teal-900 p-4">
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
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-800 p-3 border border-slate-700">
                <p className="text-xs text-white/60">Net Volume</p>
                <p className="text-lg font-semibold text-white">
                  {fmt(m3To(active.m3 || 0, displayUnit))} {displayUnit}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-3 border border-slate-700">
                <p className="text-xs text-white/60">With Waste</p>
                <p className="text-lg font-semibold text-white">
                  {fmt(m3To(active.withWaste || 0, displayUnit))} {displayUnit}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800 p-3 border border-slate-700">
                <p className="text-xs text-white/60">Waste Added</p>
                <p className="text-lg font-semibold text-white">
                  {fmt(m3To((active.withWaste || 0) - (active.m3 || 0), displayUnit))} {displayUnit}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-white/60">
              Tip: Confirm soil bearing capacity and local code requirements. This tool estimates
              volume only.
            </p>
          </div>

          <div className="flex gap-2">
            {/* Keep existing behavior: Calculate button present/disabled logic intact */}
            <Button
              type="button"
              disabled={disabled}
              onClick={() => window?.scrollTo?.({ top: 0, behavior: "smooth" })}
              className="rounded-xl bg-teal-400 text-slate-900 font-semibold hover:opacity-90 h-11 px-5"
            >
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRect({ length: "", width: "", depth: "", unit: "meters", wastePct: "5" });
                setCirc({ diameter: "", depth: "", unit: "meters", wastePct: "5" });
              }}
              className="rounded-xl h-11 px-5 border border-slate-700 bg-slate-900 text-white hover:bg-slate-900/90"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Formula Recap */}
        <div className="px-6 md:px-8 pb-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              How the Calculator Works
            </h3>
            <div className="mt-2 grid gap-2 text-sm text-white/70">
              <p>
                <span className="font-medium text-white">Rectangular / Square:</span> Convert inputs
                to meters, then compute <code>L × W × D</code>. Waste is applied as{" "}
                <code>V × (1 + waste%)</code>.
              </p>
              <p>
                <span className="font-medium text-white">Circular:</span> Convert diameter and depth
                to meters, compute <code>π × r² × D</code> with <code>r = diameter / 2</code>. Waste
                is then added.
              </p>
              <p>
                Results default to m³ and can be toggled to ft³ or yd³ using the unit selector.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
