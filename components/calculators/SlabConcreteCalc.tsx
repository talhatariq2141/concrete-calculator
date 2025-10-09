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

// ---------------------------------------------------
// Types
// ---------------------------------------------------

type LinearUnit = "meters" | "yards" | "feet" | "inches" | "centimeter";
type AreaUnit = "m2" | "yd2" | "ft2" | "in2" | "cm2";
type VolumeUnit = "m3" | "yd3" | "ft3" | "in3" | "cm3";

// ---------------------------------------------------
// Unit helpers
// ---------------------------------------------------

const toMetersFactor: Record<LinearUnit, number> = {
  meters: 1,
  yards: 0.9144,
  feet: 0.3048,
  inches: 0.0254,
  centimeter: 0.01,
};

const areaUnits: { key: AreaUnit; label: string; fromMeters2: (m2: number) => number }[] = [
  { key: "m2", label: "m² (square meters)", fromMeters2: (m2) => m2 },
  { key: "yd2", label: "yd² (square yards)", fromMeters2: (m2) => m2 / (0.9144 ** 2) },
  { key: "ft2", label: "ft² (square feet)", fromMeters2: (m2) => m2 / (0.3048 ** 2) },
  { key: "in2", label: "in² (square inches)", fromMeters2: (m2) => m2 / (0.0254 ** 2) },
  { key: "cm2", label: "cm² (square centimeters)", fromMeters2: (m2) => m2 / (0.01 ** 2) },
];

const volumeUnits: { key: VolumeUnit; label: string; fromMeters3: (m3: number) => number }[] = [
  { key: "m3", label: "m³ (cubic meters)", fromMeters3: (m3) => m3 },
  { key: "yd3", label: "yd³ (cubic yards)", fromMeters3: (m3) => m3 / (0.9144 ** 3) },
  { key: "ft3", label: "ft³ (cubic feet)", fromMeters3: (m3) => m3 / (0.3048 ** 3) },
  { key: "in3", label: "in³ (cubic inches)", fromMeters3: (m3) => m3 / (0.0254 ** 3) },
  { key: "cm3", label: "cm³ (cubic centimeters)", fromMeters3: (m3) => m3 / (0.01 ** 3) },
];

const linearUnitOptions: { value: LinearUnit; label: string }[] = [
  { value: "yards", label: "yards" },
  { value: "meters", label: "meters" },
  { value: "feet", label: "feet" },
  { value: "inches", label: "inches" },
  { value: "centimeter", label: "centimeter" },
];

// ---------------------------------------------------
// Component
// ---------------------------------------------------

export default function SlabConcreteCalc() {
  // inputs
  const [length, setLength] = useState<string>("");
  const [lengthUnit, setLengthUnit] = useState<LinearUnit>("meters");

  const [width, setWidth] = useState<string>("");
  const [widthUnit, setWidthUnit] = useState<LinearUnit>("meters");

  const [thickness, setThickness] = useState<string>("");
  const [thicknessUnit, setThicknessUnit] = useState<LinearUnit>("centimeter");

  // outputs
  const [areaOutUnit, setAreaOutUnit] = useState<AreaUnit>("m2");
  const [volumeOutUnit, setVolumeOutUnit] = useState<VolumeUnit>("m3");

  const [submitted, setSubmitted] = useState(false);

  // -------------------------------------------------
  // Calculations
  // -------------------------------------------------

  const result = useMemo(() => {
    const L = parseFloat(length);
    const W = parseFloat(width);
    const T = parseFloat(thickness);

    if ([L, W, T].some((v) => Number.isNaN(v) || v < 0)) return null;

    // normalize to meters
    const Lm = L * toMetersFactor[lengthUnit];
    const Wm = W * toMetersFactor[widthUnit];
    const Tm = T * toMetersFactor[thicknessUnit];

    const area_m2 = Lm * Wm; // m^2
    const vol_m3 = area_m2 * Tm; // m^3

    const areaConv = areaUnits.find((a) => a.key === areaOutUnit)!;
    const volConv = volumeUnits.find((v) => v.key === volumeOutUnit)!;

    const area = areaConv.fromMeters2(area_m2);
    const volume = volConv.fromMeters3(vol_m3);

    // suggested overage
    const volume5 = volume * 1.05;
    const volume10 = volume * 1.1;

    return {
      area,
      volume,
      volume5,
      volume10,
      areaUnitLabel: areaConv.label,
      volumeUnitLabel: volConv.label,
    };
  }, [length, width, thickness, lengthUnit, widthUnit, thicknessUnit, areaOutUnit, volumeOutUnit]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // -------------------------------------------------
  // UI helpers
  // -------------------------------------------------

  const numberOrEmpty = (v: string) => (v === "" ? "" : v.replace(/[^0-9.]/g, ""));

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-800 shadow-xl">
      <CardHeader className="pb-2">
        
          
              <CardTitle className="text-3xl font-bold tracking-tight text-teal-400">
                Slab Concrete Calculator
              </CardTitle>
              <p className="mt-1 text-sm text-white/70">
                Compute volume for one-way or two-way slabs with thickness options.
              </p>
            
        
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        <form onSubmit={handleCalculate} className="space-y-8">
          {/* Inputs */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Length */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="length" className="text-sm font-medium text-white">Length</Label>
              <p className="text-xs text-white/70">Long side of the slab</p>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id="length"
                  type="text"
                  inputMode="decimal"
                  value={length}
                  onChange={(e) => setLength(numberOrEmpty(e.target.value))}
                  placeholder="e.g. 5"
                  className="flex-1 min-w-0 h-11 rounded-xl border border-transparent bg-slate-900 text-white placeholder-slate-400 focus-visible:ring-0 focus:border-teal-400"
                />
                <Select value={lengthUnit} onValueChange={(v: LinearUnit) => setLengthUnit(v)}>
                  <SelectTrigger className="w-full h-11 rounded-xl border border-transparent bg-slate-900 text-white focus-visible:ring-0 focus:border-teal-400 sm:w-[150px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-slate-900 text-white border border-slate-700">
                    {linearUnitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value} className="focus:bg-slate-800">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Width */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="width" className="text-sm font-medium text-white">Width</Label>
              <p className="text-xs text-white/70">Short side of the slab</p>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id="width"
                  type="text"
                  inputMode="decimal"
                  value={width}
                  onChange={(e) => setWidth(numberOrEmpty(e.target.value))}
                  placeholder="e.g. 3"
                  className="flex-1 min-w-0 h-11 rounded-xl border border-transparent bg-slate-900 text-white placeholder-slate-400 focus-visible:ring-0 focus:border-teal-400"
                />
                <Select value={widthUnit} onValueChange={(v: LinearUnit) => setWidthUnit(v)}>
                  <SelectTrigger className="w-full h-11 rounded-xl border border-transparent bg-slate-900 text-white focus-visible:ring-0 focus:border-teal-400 sm:w-[150px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-slate-900 text-white border border-slate-700">
                    {linearUnitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value} className="focus:bg-slate-800">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Thickness */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="thickness" className="text-sm font-medium text-white">Thickness</Label>
              <p className="text-xs text-white/70">Depth of the slab</p>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id="thickness"
                  type="text"
                  inputMode="decimal"
                  value={thickness}
                  onChange={(e) => setThickness(numberOrEmpty(e.target.value))}
                  placeholder="e.g. 10"
                  className="flex-1 min-w-0 h-11 rounded-xl border border-transparent bg-slate-900 text-white placeholder-slate-400 focus-visible:ring-0 focus:border-teal-400"
                />
                <Select value={thicknessUnit} onValueChange={(v: LinearUnit) => setThicknessUnit(v)}>
                  <SelectTrigger className="w-full h-11 rounded-xl border border-transparent bg-slate-900 text-white focus-visible:ring-0 focus:border-teal-400 sm:w-[150px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-slate-900 text-white border border-slate-700">
                    {linearUnitOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value} className="focus:bg-slate-800">
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Output unit selectors */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-white">Area Unit</Label>
              <Select value={areaOutUnit} onValueChange={(v: AreaUnit) => setAreaOutUnit(v)}>
                <SelectTrigger className="h-11 rounded-xl border border-transparent bg-slate-900 text-white focus-visible:ring-0 focus:border-teal-400">
                  <SelectValue placeholder="Select area unit" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-slate-900 text-white border border-slate-700">
                  {areaUnits.map((u) => (
                    <SelectItem key={u.key} value={u.key} className="focus:bg-slate-800">
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-white">Volume Unit</Label>
              <Select value={volumeOutUnit} onValueChange={(v: VolumeUnit) => setVolumeOutUnit(v)}>
                <SelectTrigger className="h-11 rounded-xl border border-transparent bg-slate-900 text-white focus-visible:ring-0 focus:border-teal-400">
                  <SelectValue placeholder="Select volume unit" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-slate-900 text-white border border-slate-700">
                  {volumeUnits.map((u) => (
                    <SelectItem key={u.key} value={u.key} className="focus:bg-slate-800">
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              className="w-full sm:w-auto h-11 rounded-xl bg-teal-400 text-slate-900 font-semibold shadow-sm transition hover:opacity-90 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-11 rounded-xl border border-transparent bg-slate-800 text-white hover:bg-slate-800/90 focus-visible:ring-0 focus:border-teal-400"
              onClick={() => {
                setLength("");
                setWidth("");
                setThickness("");
                setLengthUnit("meters");
                setWidthUnit("meters");
                setThicknessUnit("centimeter");
                setAreaOutUnit("m2");
                setVolumeOutUnit("m3");
                setSubmitted(false);
              }}
            >
              Reset
            </Button>
          </div>
        </form>

        {/* Separator (subtle on dark) */}
        <div className="h-px w-full bg-slate-800" />

        {/* Results */}
        {!submitted ? (
          <p className="text-sm text-white/70">
            Enter dimensions above and press <span className="font-medium text-white">Calculate</span> to see results here.
          </p>
        ) : result === null ? (
          <p className="text-sm text-red-300">Please enter valid non-negative numbers for all fields.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
              <div className="text-xs uppercase text-white/70">Area</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-teal-400">
                {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(result.area)}
              </div>
              <div className="text-sm text-white/70">{result.areaUnitLabel}</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
              <div className="text-xs uppercase text-white/70">Volume</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-teal-400">
                {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(result.volume)}
              </div>
              <div className="text-sm text-white/70">{result.volumeUnitLabel}</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
              <div className="text-xs uppercase text-white/70">+5% Overage</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-teal-400">
                {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(result.volume5)}
              </div>
              <div className="text-sm text-white/70">{result.volumeUnitLabel}</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm transition hover:shadow-md">
              <div className="text-xs uppercase text-white/70">+10% Overage</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-teal-400">
                {Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(result.volume10)}
              </div>
              <div className="text-sm text-white/70">{result.volumeUnitLabel}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
