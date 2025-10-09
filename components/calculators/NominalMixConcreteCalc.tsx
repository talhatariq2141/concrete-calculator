// components/calculators/NominalMixConcreteCalc.tsx
"use client";

import React from "react";
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
import { Switch } from "@/components/ui/switch";
// import { Slider } from "@/components/ui/slider"; // kept commented out to avoid "unused" warning
import { Info } from "lucide-react";

/*
  NominalMixConcreteCalc.tsx
  ---------------------------------------------------------------
  A comprehensive, branded Nominal Mix (M5–M25) concrete calculator
  built for Next.js + Tailwind + shadcn/ui. It computes cement, sand,
  aggregate, and water for nominal mixes per standard field practice.

  ✔ Grades: M5, M7.5, M10, M15, M20, M25
  ✔ Mix ratios (by volume) per IS 456 nominal guidance
  ✔ Volume input in m³ / ft³ / yd³
  ✔ Dry volume factor (default 1.54) + optional wastage %
  ✔ Bag size (default 50 kg)
  ✔ Material bulk densities (editable):
      - Cement 1440 kg/m³ (bulk density for volume method)
      - Sand 1600 kg/m³
      - Aggregate 1500 kg/m³
  ✔ Water–cement ratio presets by grade (editable per user):
      M5:0.65, M7.5:0.62, M10:0.60, M15:0.55, M20:0.50, M25:0.45
  ✔ Moisture corrections for fine/coarse aggregates (%); water adjusts.
  ✔ Results in multiple units (m³ / ft³ and kg / tons / bags)
  ✔ Clean, brand-aligned UI using CSS variables from globals.css

  Notes
  -----
  • This calculator uses the common “volume batching” method for nominal mixes.
  • Water is computed as: Water = w/c × mass of cement.
  • Moisture correction adds the free surface moisture content percentage of
    sand/aggregate to their masses and subtracts the equivalent water from
    mixing water (since aggregates bring their own water).
  • All values are estimates—always verify with site conditions.
*/

type UnitVol = "m3" | "ft3" | "yd3";
type GradeKey = "M5" | "M7.5" | "M10" | "M15" | "M20" | "M25";
type Mix = { c: number; s: number; a: number; wc: number };

const MIX_MAP: Record<GradeKey, Mix> = {
  M5: { c: 1, s: 5, a: 10, wc: 0.65 },
  "M7.5": { c: 1, s: 4, a: 8, wc: 0.62 },
  M10: { c: 1, s: 3, a: 6, wc: 0.6 },
  M15: { c: 1, s: 2, a: 4, wc: 0.55 },
  M20: { c: 1, s: 1.5, a: 3, wc: 0.5 },
  M25: { c: 1, s: 1, a: 2, wc: 0.45 },
};

const VOL_TO_M3: Record<UnitVol, number> = {
  m3: 1,
  ft3: 0.0283168, // 1 ft³ in m³
  yd3: 0.764555, // 1 yd³ in m³
};

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}
function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function NominalMixConcreteCalc() {
  // Inputs
  const [grade, setGrade] = React.useState<GradeKey>("M20");
  const [unitVol, setUnitVol] = React.useState<UnitVol>("m3");
  const [inputVol, setInputVol] = React.useState<string>("1");

  const [dryFactor, setDryFactor] = React.useState<number>(1.54);
  const [wastagePct, setWastagePct] = React.useState<number>(2); // %

  const [bagSizeKg, setBagSizeKg] = React.useState<number>(50);

  const [rhoCement, setRhoCement] = React.useState<number>(1440); // kg/m³
  const [rhoSand, setRhoSand] = React.useState<number>(1600); // kg/m³
  const [rhoAgg, setRhoAgg] = React.useState<number>(1500); // kg/m³

  const [wcOverride, setWcOverride] = React.useState<string>(""); // custom w/c

  const [moistSandPct, setMoistSandPct] = React.useState<number>(2); // %
  const [moistAggPct, setMoistAggPct] = React.useState<number>(1); // %

  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);
  const [showNotes, setShowNotes] = React.useState<boolean>(false);

  // Derived mix + w/c
  const mix = MIX_MAP[grade];
  const wc = wcOverride !== "" ? clamp(parseFloat(wcOverride) || mix.wc, 0.3, 0.75) : mix.wc;
  const partsSum = mix.c + mix.s + mix.a;

  // Core calculation
  const result = React.useMemo(() => {
    const volEntered = parseFloat(inputVol);
    const volM3 = (Number.isFinite(volEntered) ? Math.max(volEntered, 0) : 0) * VOL_TO_M3[unitVol];

    // Dry volume used for batching (includes voids) + optional wastage
    const dryVol = volM3 * dryFactor;
    const dryVolWithWastage = dryVol * (1 + wastagePct / 100);

    // Volume split by nominal mix parts
    const volCement = (mix.c / partsSum) * dryVolWithWastage; // m³ of cement (bulk)
    const volSand = (mix.s / partsSum) * dryVolWithWastage; // m³
    const volAgg = (mix.a / partsSum) * dryVolWithWastage; // m³

    // Convert volumes to masses using editable bulk densities
    const massCementKg = volCement * rhoCement; // kg
    const massSandKg = volSand * rhoSand; // kg
    const massAggKg = volAgg * rhoAgg; // kg

    // Bags
    const bags = bagSizeKg > 0 ? massCementKg / bagSizeKg : 0;

    // Water from w/c ratio
    const waterKg = wc * massCementKg; // kg ~ liters

    // Moisture corrections
    const addedWaterFromSand = (moistSandPct / 100) * massSandKg;
    const addedWaterFromAgg = (moistAggPct / 100) * massAggKg;

    const totalAddedWater = addedWaterFromSand + addedWaterFromAgg;
    const adjWaterKg = Math.max(waterKg - totalAddedWater, 0);

    const adjSandKg = massSandKg * (1 + moistSandPct / 100);
    const adjAggKg = massAggKg * (1 + moistAggPct / 100);

    return {
      volM3,
      dryVol,
      dryVolWithWastage,
      volCement,
      volSand,
      volAgg,
      massCementKg,
      massSandKg,
      massAggKg,
      adjSandKg,
      adjAggKg,
      bags,
      waterKg,
      totalAddedWater,
      adjWaterKg,
    };
  }, [
    inputVol,
    unitVol,
    dryFactor,
    wastagePct,
    mix,
    partsSum,
    rhoCement,
    rhoSand,
    rhoAgg,
    bagSizeKg,
    wc,
    moistSandPct,
    moistAggPct,
  ]);

  // Display helpers
  const volToFt3 = (m3: number) => m3 / VOL_TO_M3.ft3;
  const volToYd3 = (m3: number) => m3 / VOL_TO_M3.yd3;

  // UI
  return (
    <Card className="border shadow-sm rounded-2xl bg-slate-800 p-3">
      <CardHeader className="border-b bg-[var(--brand-muted)] rounded-t-2xl">
        <CardTitle className="text-2xl md:text-3xl font-bold text-teal-400">
          Nominal Mix Concrete Calculator (M5–M25)
        </CardTitle>
        <p className="text-sm md:text-base text-[var(--brand-subtle)]">
          Estimate cement, sand, aggregate, and water for standard nominal concrete mixes. Brand-styled, field-ready, and editable parameters.
        </p>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ---------------- Left: Inputs ---------------- */}
          <div className="lg:col-span-3 space-y-4">
            {/* Grade & Volume */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-[var(--brand-primary)]">Grade</Label>
                <Select value={grade} onValueChange={(v) => setGrade(v as GradeKey)}>
                  <SelectTrigger className="mt-2 bg-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(MIX_MAP).map((g) => (
                      <SelectItem key={g} value={g}>
                        {g} ( {MIX_MAP[g as GradeKey].c}:{MIX_MAP[g as GradeKey].s}:
                        {MIX_MAP[g as GradeKey].a} )
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[var(--brand-primary)]">Volume</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    inputMode="decimal"
                    value={inputVol}
                    onChange={(e) => setInputVol(e.target.value)}
                    className="mt-2 bg-slate-900 flex-1"
                    placeholder="e.g., 1.25"
                  />
                  <Select value={unitVol} onValueChange={(v) => setUnitVol(v as UnitVol)}>
                    <SelectTrigger className="mt-2 bg-slate-900 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m3">m³</SelectItem>
                      <SelectItem value="ft3">ft³</SelectItem>
                      <SelectItem value="yd3">yd³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-[var(--brand-primary)]">W/C Ratio</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    inputMode="decimal"
                    value={wcOverride}
                    onChange={(e) => setWcOverride(e.target.value)}
                    placeholder={mix.wc.toString()}
                    className="mt-2 bg-slate-900"
                  />
                </div>
                <p className="text-xs text-[var(--brand-subtle)] mt-1">
                  Leave blank to use grade default.
                </p>
              </div>
            </div>

            {/* Batch Factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-[var(--brand-primary)]">Dry Volume Factor</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    inputMode="decimal"
                    value={dryFactor}
                    onChange={(e) => setDryFactor(parseFloat(e.target.value) || 0)}
                    className="mt-2 bg-slate-900"
                  />
                </div>
                <p className="text-xs text-[var(--brand-subtle)] mt-1">
                  Typical 1.50–1.57; default 1.54.
                </p>
              </div>
              <div>
                <Label className="text-[var(--brand-primary)]">Wastage (%)</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    inputMode="decimal"
                    value={wastagePct}
                    onChange={(e) => setWastagePct(parseFloat(e.target.value) || 0)}
                    className="mt-2 bg-slate-900"
                  />
                </div>
                <p className="text-xs text-[var(--brand-subtle)] mt-1">
                  Extra allowance for spillage, etc.
                </p>
              </div>
              <div>
                <Label className="text-[var(--brand-primary)]">Bag Size (kg)</Label>
                <Input
                  inputMode="decimal"
                  value={bagSizeKg}
                  onChange={(e) => setBagSizeKg(parseFloat(e.target.value) || 0)}
                  className="bg-slate-900 mt-2"
                />
                <p className="text-xs text-[var(--brand-subtle)] mt-1">Default 50 kg per bag.</p>
              </div>
            </div>

            {/* Densities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-[var(--brand-primary)]">Cement Density (kg/m³)</Label>
                <Input
                  inputMode="decimal"
                  value={rhoCement}
                  onChange={(e) => setRhoCement(parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-slate-900"
                />
              </div>
              <div>
                <Label className="text-[var(--brand-primary)]">Sand Density (kg/m³)</Label>
                <Input
                  inputMode="decimal"
                  value={rhoSand}
                  onChange={(e) => setRhoSand(parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-slate-900"
                />
              </div>
              <div>
                <Label className="text-[var(--brand-primary)]">Aggregate Density (kg/m³)</Label>
                <Input
                  inputMode="decimal"
                  value={rhoAgg}
                  onChange={(e) => setRhoAgg(parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-slate-900"
                />
              </div>
            </div>

            {/* Moisture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-[var(--brand-primary)]">Sand Moisture (%)</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    inputMode="decimal"
                    value={moistSandPct}
                    onChange={(e) => setMoistSandPct(parseFloat(e.target.value) || 0)}
                    className="mt-2 bg-slate-900"
                  />
                </div>
                <p className="text-xs text-[var(--brand-subtle)] mt-1">
                  Free surface moisture in fine aggregate.
                </p>
              </div>
              <div>
                <Label className="text-[var(--brand-primary)]">Aggregate Moisture (%)</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    inputMode="decimal"
                    value={moistAggPct}
                    onChange={(e) => setMoistAggPct(parseFloat(e.target.value) || 0)}
                    className="mt-2 bg-slate-900"
                  />
                </div>
                <p className="text-xs text-[var(--brand-subtle)] mt-1">
                  Free surface moisture in coarse aggregate.
                </p>
              </div>
            </div>

            {/* Advanced toggle */}
            <div className="flex items-center gap-3 pt-2">
              <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} id="adv" />
              <Label htmlFor="adv" className="text-[var(--brand-primary)]">
                Show derived volumes & SSD corrections
              </Label>
            </div>

            {/* Notes toggle */}
            <div className="flex items-center gap-3">
              <Switch checked={showNotes} onCheckedChange={setShowNotes} id="notes" />
              <Label htmlFor="notes" className="text-[var(--brand-primary)]">
                Show notes & assumptions
              </Label>
            </div>
          </div>

          {/* ---------------- Right: Results ---------------- */}
          <div className="lg:col-span-1">
            <Card className="border rounded-xl shadow-sm bg-slate-900">
              <CardHeader className="bg-[var(--brand-muted)] rounded-t-xl">
                <CardTitle className="text-lg font-semibold text-teal-400">
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="text-sm text-[var(--brand-subtle)]">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>
                      Mix {grade}: {mix.c}:{mix.s}:{mix.a} (w/c {fmt(wc, 2)})
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="bags" className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="bags">Bags</TabsTrigger>
                    <TabsTrigger value="mass">Mass</TabsTrigger>
                    <TabsTrigger value="volume">Volume</TabsTrigger>
                  </TabsList>

                  <TabsContent value="bags" className="mt-3">
                    <ResultRow
                      label={`Cement (bags @ ${fmt(bagSizeKg, 0)} kg)`}
                      value={fmt(result.bags, 2)}
                    />
                    <ResultRow label="Water (L)" value={fmt(result.adjWaterKg, 0)} />
                  </TabsContent>

                  <TabsContent value="mass" className="mt-3">
                    <ResultRow label="Cement (kg)" value={fmt(result.massCementKg, 0)} />
                    <ResultRow label="Sand (kg)" value={fmt(result.adjSandKg, 0)} />
                    <ResultRow label="Aggregate (kg)" value={fmt(result.adjAggKg, 0)} />
                    <ResultRow label="Water (kg ≈ L)" value={fmt(result.adjWaterKg, 0)} />
                  </TabsContent>

                  <TabsContent value="volume" className="mt-3">
                    <ResultRow label="Cement (m³)" value={fmt(result.volCement, 3)} />
                    <ResultRow label="Sand (m³)" value={fmt(result.volSand, 3)} />
                    <ResultRow label="Aggregate (m³)" value={fmt(result.volAgg, 3)} />
                    <div className="h-px bg-[var(--brand-border)] my-2" />
                    <ResultRow label="Input Volume (m³)" value={fmt(result.volM3, 3)} />
                    <ResultRow label="Dry Volume (m³)" value={fmt(result.dryVol, 3)} />
                    <ResultRow
                      label={`Dry + Wastage ${fmt(wastagePct, 0)}% (m³)`}
                      value={fmt(result.dryVolWithWastage, 3)}
                    />
                    <div className="text-xs text-[var(--brand-subtle)] mt-2">
                      <p>
                        ≈ {fmt(volToFt3(result.dryVolWithWastage), 0)} ft³ •{" "}
                        {fmt(volToYd3(result.dryVolWithWastage), 2)} yd³
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {showAdvanced && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-[var(--brand-primary)]">
                      Moisture & Water Adjustments
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-[var(--brand-subtle)]">
                      <div className="flex justify-between">
                        <span>Water before adj. (L)</span>
                        <span>{fmt(result.waterKg, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water from aggregates (L)</span>
                        <span>{fmt(result.totalAddedWater, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water after adj. (L)</span>
                        <span>{fmt(result.adjWaterKg, 0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {showNotes && (
                  <div className="pt-3 border-t text-xs text-[var(--brand-subtle)] space-y-2">
                    <p>
                      This tool estimates quantities for nominal mixes using volume batching. For
                      design mixes or structural members with strict strength requirements, use mix
                      design as per IS 10262 / ACI.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Dry volume factor typically 1.50–1.57 to account for voids & bulking.
                      </li>
                      <li>
                        W/C ratios are starting points; adjust for required workability &
                        durability.
                      </li>
                      <li>Bulk densities vary by source; edit as per local materials.</li>
                      <li>
                        Moisture corrections assume free surface moisture; SSD conditions differ.
                      </li>
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    className="w-full bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-dark)]"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        JSON.stringify(
                          {
                            grade,
                            unitVol,
                            inputVol,
                            dryFactor,
                            wastagePct,
                            bagSizeKg,
                            rhoCement,
                            rhoSand,
                            rhoAgg,
                            wc,
                            moistSandPct,
                            moistAggPct,
                          },
                          null,
                          2
                        )
                      )
                    }
                  >
                    Copy Inputs JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--brand-primary)]">{label}</span>
      <span className="font-semibold text-[var(--brand-primary)]">{value}</span>
    </div>
  );
}
