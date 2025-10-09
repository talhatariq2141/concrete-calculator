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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Info, RefreshCcw, Calculator, Ruler } from "lucide-react";

/* ----------------------------- */
/* Design tokens (UI only)       */
/* ----------------------------- */
const inputBase =
  "bg-slate-900 text-white placeholder-slate-400 border border-transparent mt-1 focus:border-teal-400 focus:outline-none rounded-lg h-11 px-3 w-full";
const labelBase = "text-white text-sm";
const group = "grid grid-cols-1 sm:grid-cols-3 gap-3";
const card = "bg-slate-800 rounded-2xl p-4 md:p-4 shadow-xl border border-slate-700";

/* ---------------------------------------------
   Types & Units (unchanged)
--------------------------------------------- */

type LinearUnit = "meters" | "centimeter" | "millimeter" | "yards" | "feet" | "inches";

const linearUnitToMeters: Record<LinearUnit, number> = {
  meters: 1,
  centimeter: 0.01,
  millimeter: 0.001,
  yards: 0.9144,
  feet: 0.3048,
  inches: 0.0254,
};

function toMeters(value: number, unit: LinearUnit) {
  return value * linearUnitToMeters[unit];
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/* ---------------------------------------------
   Component
--------------------------------------------- */

export default function BeamConcreteCalc() {
  // Form state
  const [length, setLength] = useState<string>("6");
  const [width, setWidth] = useState<string>("0.3");
  const [depth, setDepth] = useState<string>("0.5");
  const [qty, setQty] = useState<string>("1");

  const [unit, setUnit] = useState<LinearUnit>("meters");
  const [wastePct, setWastePct] = useState<string>("5");
  const [useDryFactor, setUseDryFactor] = useState<boolean>(true);
  const [dryFactor, setDryFactor] = useState<string>("1.5");

  // Optional void (duct)
  const [hasVoid, setHasVoid] = useState<boolean>(false);
  const [voidWidth, setVoidWidth] = useState<string>("0");
  const [voidDepth, setVoidDepth] = useState<string>("0");
  const [voidLength, setVoidLength] = useState<string>("0");

  // Example & Reset (unchanged values)
  const handleExample = () => {
    setLength("6");
    setWidth("0.3");
    setDepth("0.5");
    setQty("2");
    setWastePct("7");
    setUseDryFactor(true);
    setDryFactor("1.54");
    setHasVoid(true);
    setVoidWidth("0.05");
    setVoidDepth("0.05");
    setVoidLength("6");
  };

  const handleReset = () => {
    setLength("6");
    setWidth("0.3");
    setDepth("0.5");
    setQty("1");
    setUnit("meters");
    setWastePct("5");
    setUseDryFactor(true);
    setDryFactor("1.5");
    setHasVoid(false);
    setVoidWidth("0");
    setVoidDepth("0");
    setVoidLength("0");
  };

  // Parse & sanitize numeric inputs
  const L_num = useMemo(() => Math.max(0, parseFloat(length) || 0), [length]);
  const b_num = useMemo(() => Math.max(0, parseFloat(width) || 0), [width]);
  const d_num = useMemo(() => Math.max(0, parseFloat(depth) || 0), [depth]);
  const qty_num = useMemo(() => Math.max(0, Math.floor(Number(qty) || 0)), [qty]);

  const waste_num = useMemo(() => clamp(parseFloat(wastePct) || 0, 0, 50), [wastePct]);
  const dry_num = useMemo(() => clamp(parseFloat(dryFactor) || 1, 1, 2.5), [dryFactor]);

  const vW_num = useMemo(() => Math.max(0, parseFloat(voidWidth) || 0), [voidWidth]);
  const vD_num = useMemo(() => Math.max(0, parseFloat(voidDepth) || 0), [voidDepth]);
  const vL_num = useMemo(() => Math.max(0, parseFloat(voidLength) || 0), [voidLength]);

  // Convert to meters
  const L_m = toMeters(L_num, unit);
  const b_m = toMeters(b_num, unit);
  const d_m = toMeters(d_num, unit);
  const vW_m = toMeters(vW_num, unit);
  const vD_m = toMeters(vD_num, unit);
  const vL_m = toMeters(vL_num, unit);

  // Volumes
  const wetVolumePerBeam_m3 = useMemo(() => {
    const gross = L_m * b_m * d_m;
    const voidVol = hasVoid ? vL_m * vW_m * vD_m : 0;
    return Math.max(0, gross - voidVol);
  }, [L_m, b_m, d_m, hasVoid, vL_m, vW_m, vD_m]);

  const wetWithWaste_m3 = useMemo(
    () => wetVolumePerBeam_m3 * (1 + waste_num / 100),
    [wetVolumePerBeam_m3, waste_num]
  );

  const dryPerBeam_m3 = useMemo(
    () => (useDryFactor ? wetWithWaste_m3 * dry_num : wetWithWaste_m3),
    [useDryFactor, wetWithWaste_m3, dry_num]
  );

  // Totals
  const totalWet_m3 = wetVolumePerBeam_m3 * Math.max(1, qty_num);
  const totalWetWaste_m3 = wetWithWaste_m3 * Math.max(1, qty_num);
  const totalDry_m3 = dryPerBeam_m3 * Math.max(1, qty_num);

  // Conversions (display only)
  const m3_to_ft3 = 35.3146667;
  const m3_to_yd3 = 1.30795062;

  function fmt(n: number, decimals = 3) {
    if (!isFinite(n)) return "0";
    return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  }

  // Invalid state
  const invalidDims =
    L_num === 0 ||
    b_num === 0 ||
    d_num === 0 ||
    qty_num === 0 ||
    (hasVoid && (vW_num === 0 || vD_num === 0 || vL_num === 0));

  /* ---------------------------------------------
    UI (restyled only)
  --------------------------------------------- */

  return (
    <div className="w-full mx-auto max-w-4xl">
      <Card className={card}>
        {/* Header */}
        <CardHeader className="pb-2 p-0">
          <div className="rounded-2xl bg-slate-900 p-6 md:p-8 text-white flex items-center justify-between gap-3">
            <CardTitle className="text-3xl text-teal-400 font-bold tracking-tight flex items-center gap-2">
              
              Beam Concrete Calculator
            </CardTitle>
            <div className="hidden sm:flex gap-2">
              <Button
                variant="ghost"
                onClick={handleExample}
                className="h-10 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-800/90"
              >
                Example
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="h-10 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-800/90"
              >
                <RefreshCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          <p className="text-sm text-white/70 mt-3 px-6 md:px-8">
            Computes concrete volume for prismatic beams using{" "}
            <span className="font-medium text-white">V = L × b × d</span>, with optional void
            subtraction, waste allowance, and dry-volume factor.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Units & Quantity */}
          <div className={group}>
            <div className="space-y-1.5">
              <Label className={`${labelBase} flex items-center gap-2`}>
                <Ruler className="h-4 w-4 text-teal-400" />
                Units
              </Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as LinearUnit)}>
                <SelectTrigger className="h-11 rounded-lg bg-slate-900 text-white border border-transparent focus:border-teal-400">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-slate-900 text-white border border-slate-700">
                  <SelectItem value="meters" className="focus:bg-slate-800">Meters (m)</SelectItem>
                  <SelectItem value="centimeter" className="focus:bg-slate-800">Centimeters (cm)</SelectItem>
                  <SelectItem value="millimeter" className="focus:bg-slate-800">Millimeters (mm)</SelectItem>
                  <SelectItem value="yards" className="focus:bg-slate-800">Yards (yd)</SelectItem>
                  <SelectItem value="feet" className="focus:bg-slate-800">Feet (ft)</SelectItem>
                  <SelectItem value="inches" className="focus:bg-slate-800">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className={labelBase}>Number of Beams</Label>
              <Input
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="e.g., 1"
                className={inputBase}
              />
            </div>

            {/* Mobile actions */}
            <div className="space-y-1.5 sm:hidden">
              <Label className="opacity-0 select-none">Actions</Label>
              <div className="flex gap-2">
                <Button
                  onClick={handleExample}
                  className="flex-1 h-11 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-800/90"
                >
                  Example
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 h-11 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-800/90"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className={group}>
            <div className="space-y-1.5">
              <Label className={labelBase}>Length (L)</Label>
              <Input
                inputMode="decimal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder={`e.g., ${unit === "feet" ? "20" : "6"}`}
                className={inputBase}
              />
              <p className="text-xs text-white/60">In {unit}</p>
            </div>

            <div className="space-y-1.5">
              <Label className={labelBase}>Width / Breadth (b)</Label>
              <Input
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder={`e.g., ${unit === "feet" ? "1" : "0.3"}`}
                className={inputBase}
              />
              <p className="text-xs text-white/60">In {unit}</p>
            </div>

            <div className="space-y-1.5">
              <Label className={labelBase}>Depth / Height (d)</Label>
              <Input
                inputMode="decimal"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder={`e.g., ${unit === "feet" ? "1.5" : "0.5"}`}
                className={inputBase}
              />
              <p className="text-xs text-white/60">In {unit}</p>
            </div>
          </div>

          {/* Void / Duct */}
          <Card className="bg-slate-900 border border-slate-800 rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <Label className={`${labelBase} font-medium`}>Subtract a void (optional)</Label>
                  <p className="text-xs text-white/60">
                    Provide dimensions for a uniform void/duct to subtract from each beam.
                  </p>
                </div>
                <Switch checked={hasVoid} onCheckedChange={setHasVoid} />
              </div>

              <div
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity",
                  hasVoid ? "opacity-100" : "opacity-50 pointer-events-none"
                )}
              >
                <div className="space-y-1.5">
                  <Label className={labelBase}>Void Width</Label>
                  <Input
                    inputMode="decimal"
                    value={voidWidth}
                    onChange={(e) => setVoidWidth(e.target.value)}
                    placeholder="0"
                    className={inputBase}
                  />
                  <p className="text-xs text-white/60">In {unit}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelBase}>Void Depth</Label>
                  <Input
                    inputMode="decimal"
                    value={voidDepth}
                    onChange={(e) => setVoidDepth(e.target.value)}
                    placeholder="0"
                    className={inputBase}
                  />
                  <p className="text-xs text-white/60">In {unit}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className={labelBase}>Void Length</Label>
                  <Input
                    inputMode="decimal"
                    value={voidLength}
                    onChange={(e) => setVoidLength(e.target.value)}
                    placeholder="0"
                    className={inputBase}
                  />
                  <p className="text-xs text-white/60">In {unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allowances */}
          <div className={group}>
            <div className="space-y-1.5">
              <Label className={labelBase}>Waste Allowance (%)</Label>
              <Input
                inputMode="decimal"
                value={wastePct}
                onChange={(e) => setWastePct(e.target.value)}
                placeholder="0–50"
                className={inputBase}
              />
              <p className="text-xs text-white/60">Typical: 5–10%</p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className={`${labelBase} flex items-center gap-2`}>
                <span>Dry Volume Factor</span>
                <Info className="h-3.5 w-3.5 text-white/60" />
              </Label>
              <div className="flex items-center gap-2">
                <Switch checked={useDryFactor} onCheckedChange={setUseDryFactor} />
                <Input
                  inputMode="decimal"
                  value={dryFactor}
                  onChange={(e) => setDryFactor(e.target.value)}
                  disabled={!useDryFactor}
                  className={cn(inputBase, !useDryFactor && "opacity-60")}
                />
              </div>
              <p className="text-xs text-white/60">
                Commonly ~1.50–1.54 for estimating materials.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Tile title="Per-Beam Volume">
              <Row label="Wet (net)">{fmt(wetVolumePerBeam_m3)} m³</Row>
              <Row label="Wet + Waste">{fmt(wetWithWaste_m3)} m³</Row>
              <Row label={useDryFactor ? "Dry (est.)" : "Dry (off)"}>{fmt(dryPerBeam_m3)} m³</Row>

              <hr className="my-2 border-slate-800" />

              <SmallLine label="Wet (ft³)">{fmt(wetVolumePerBeam_m3 * m3_to_ft3)}</SmallLine>
              <SmallLine label="Wet (yd³)">{fmt(wetVolumePerBeam_m3 * m3_to_yd3)}</SmallLine>
            </Tile>

            <Tile title={`Totals (× ${Math.max(1, qty_num)})`}>
              <Row label="Total Wet (net)">{fmt(totalWet_m3)} m³</Row>
              <Row label="Total Wet + Waste">{fmt(totalWetWaste_m3)} m³</Row>
              <Row label={useDryFactor ? "Total Dry (est.)" : "Total Dry (off)"}>
                {fmt(totalDry_m3)} m³
              </Row>

              <hr className="my-2 border-slate-800" />

              <SmallLine label="Wet (ft³)">{fmt(totalWet_m3 * m3_to_ft3)}</SmallLine>
              <SmallLine label="Wet (yd³)">{fmt(totalWet_m3 * m3_to_yd3)}</SmallLine>
            </Tile>

            <Tile title="Notes">
              <ul className="list-disc pl-5 space-y-1 text-sm text-white/70">
                <li>Keep all inputs in the selected unit system.</li>
                <li>Void subtraction applies per beam.</li>
                <li>Waste adds after net volume.</li>
                <li>
                  Dry factor (if enabled) multiplies the waste-adjusted wet volume for material
                  estimating.
                </li>
              </ul>
              {invalidDims && (
                <p className="text-xs text-red-300 mt-2">
                  Enter non-zero dimensions and quantity. If void is enabled, its dimensions must also be non-zero.
                </p>
              )}
            </Tile>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            {/* Primary action spec calls for teal; this app has no 'Calculate' action,
                so we leave Example/Reset as dark buttons to match other calculators. */}
            <Button
              onClick={handleExample}
              className="h-11 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-800/90"
            >
              Example
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-11 rounded-xl border border-slate-700 bg-slate-800 text-white hover:bg-slate-800/90"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------------------------------
   Small UI helpers (restyled only)
--------------------------------------------- */

function Tile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-slate-900 border border-slate-800 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold text-white">{children}</span>
    </div>
  );
}

function SmallLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-white/60">{label}</span>
      <span className="font-medium text-white">{children}</span>
    </div>
  );
}
