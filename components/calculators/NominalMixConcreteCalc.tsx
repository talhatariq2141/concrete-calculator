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
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";

/* --------------------------------------------------------------------------------
   TYPES / CONSTANTS / HELPERS
   (All math & data structures preserved from your original component)
--------------------------------------------------------------------------------- */
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
  ft3: 0.0283168,
  yd3: 0.764555,
};

const fieldInputClass =
  "h-11 mt-2 mb-2 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 mt-2 w-full rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass =
  "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

function fmt(n: number, d = 2) {
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}
function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/* -------------------------------- Small UI bits ------------------------------- */
const NumberInput = ({
  id,
  value,
  onChange,
  placeholder,
  badge,
  ariaLabel,
}: {
  id: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  badge?: string; // right-side unit badge
  ariaLabel?: string;
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
      aria-label={ariaLabel}
    />
    {badge ? (
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">
        {badge}
      </span>
    ) : null}
  </div>
);

/* --------------------------------------------------------------------------------
   COMPONENT (logic untouched; UI/UX refactor to Dark Slate + Teal)
--------------------------------------------------------------------------------- */
export default function NominalMixConcreteCalc() {
  // Inputs
  const [grade, setGrade] = React.useState<GradeKey>("M20");
  const [unitVol, setUnitVol] = React.useState<UnitVol>("m3");
  const [inputVol, setInputVol] = React.useState<string>("1");

  const [dryFactor, setDryFactor] = React.useState<number>(1.54);
  const [wastagePct, setWastagePct] = React.useState<number>(2);

  const [bagSizeKg, setBagSizeKg] = React.useState<number>(50);

  const [rhoCement, setRhoCement] = React.useState<number>(1440);
  const [rhoSand, setRhoSand] = React.useState<number>(1600);
  const [rhoAgg, setRhoAgg] = React.useState<number>(1500);

  const [wcOverride, setWcOverride] = React.useState<string>("");

  const [moistSandPct, setMoistSandPct] = React.useState<number>(2);
  const [moistAggPct, setMoistAggPct] = React.useState<number>(1);

  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);
  const [showNotes, setShowNotes] = React.useState<boolean>(false);

  // Show results only after clicking Calculate
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  // Derived mix + w/c (unchanged)
  const mix = MIX_MAP[grade];
  const wc = wcOverride !== "" ? clamp(parseFloat(wcOverride) || mix.wc, 0.3, 0.75) : mix.wc;
  const partsSum = mix.c + mix.s + mix.a;

  // Core calculation (unchanged)
  const result = React.useMemo(() => {
    const volEntered = parseFloat(inputVol);
    const volM3 = (Number.isFinite(volEntered) ? Math.max(volEntered, 0) : 0) * VOL_TO_M3[unitVol];

    const dryVol = volM3 * dryFactor;
    const dryVolWithWastage = dryVol * (1 + wastagePct / 100);

    const volCement = (mix.c / partsSum) * dryVolWithWastage;
    const volSand = (mix.s / partsSum) * dryVolWithWastage;
    const volAgg = (mix.a / partsSum) * dryVolWithWastage;

    const massCementKg = volCement * rhoCement;
    const massSandKg = volSand * rhoSand;
    const massAggKg = volAgg * rhoAgg;

    const bags = bagSizeKg > 0 ? massCementKg / bagSizeKg : 0;

    const waterKg = wc * massCementKg;

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

  const volToYd3 = (m3: number) => m3 / VOL_TO_M3.yd3;

  const canCalculate = React.useMemo(() => {
    const v = parseFloat(inputVol);
    return Number.isFinite(v) && v > 0 && bagSizeKg > 0 && dryFactor > 0;
  }, [inputVol, bagSizeKg, dryFactor]);

  function onCalculate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitted(true);
  }

  function onReset() {
    setGrade("M20");
    setUnitVol("m3");
    setInputVol("1");
    setDryFactor(1.54);
    setWastagePct(2);
    setBagSizeKg(50);
    setRhoCement(1440);
    setRhoSand(1600);
    setRhoAgg(1500);
    setWcOverride("");
    setMoistSandPct(2);
    setMoistAggPct(1);
    setShowAdvanced(false);
    setShowNotes(false);
    setSubmitted(false);
  }

  /* -------------------------------- UI: Clean Dark Slate + Teal ------------------------------- */
  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Nominal Mix Concrete Calculator (M5–M25)
        </CardTitle>
        <p className="text-sm text-white/70 text-center">
          Estimate cement, sand, aggregate, and water for nominal mixes. Results appear after you press
          <span className="font-semibold text-white"> Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Mix ratio is selected by grade (e.g., M20 = 1:1.5:3). You can override W/C and material densities
            if needed for local materials.
          </p>
        </div>

        {/* STEP 1 — Grade, Volume & W/C */}
        <section className={stepClass} aria-labelledby="step1">
          <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Grade, Volume & W/C</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Grade */}
            <div>
              <Label className="text-teal-500">Grade</Label>
              <Select value={grade} onValueChange={(v) => { setGrade(v as GradeKey); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Select grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {Object.keys(MIX_MAP).map((g) => (
                    <SelectItem key={g} value={g} className="text-white">
                      {g} ({MIX_MAP[g as GradeKey].c}:{MIX_MAP[g as GradeKey].s}:{MIX_MAP[g as GradeKey].a})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-white/60">Pick nominal grade; ratios prefill automatically.</p>
            </div>

            {/* Volume + unit with badge */}
            <div>
              <Label className="text-teal-500">Total Volume</Label>
              <div className="flex gap-2">
                <div className="relative grow">
                  <Input
                    inputMode="decimal"
                    value={inputVol}
                    onChange={(e) => { setInputVol(e.target.value); setSubmitted(false); }}
                    placeholder="e.g., 1.25"
                    className={fieldInputClass}
                    aria-label="Total volume"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">
                    {unitVol === "m3" ? "m³" : unitVol === "ft3" ? "ft³" : "yd³"}
                  </span>
                </div>
                <Select value={unitVol} onValueChange={(v) => { setUnitVol(v as UnitVol); setSubmitted(false); }}>
                  <SelectTrigger className={`${selectTriggerClass} w-28`} aria-label="Volume unit">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="m3" className="text-white">m³</SelectItem>
                    <SelectItem value="ft3" className="text-white">ft³</SelectItem>
                    <SelectItem value="yd3" className="text-white">yd³</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="mt-1 text-xs text-slate-300">Enter final placed concrete volume.</p>
              <p className="text-[11px] text-white/60">Hint: 1 yd³ ≈ 0.7646 m³; 1 m³ ≈ 1.308 yd³</p>
            </div>

            {/* W/C */}
            <div>
              <Label className="text-teal-500">W/C Ratio (optional)</Label>
              <NumberInput
                id="wc"
                value={wcOverride}
                onChange={(v) => { setWcOverride(v); setSubmitted(false); }}
                placeholder={mix.wc.toString()}
                ariaLabel="Water-cement ratio override"
              />
              <p className="text-xs text-slate-300">Leave blank to use grade default ({fmt(mix.wc,2)}).</p>
              <p className="text-[11px] text-white/60">Typical 0.45–0.60</p>
            </div>
          </div>
        </section>

        {/* STEP 2 — Batch Factors */}
        <section className={stepClass} aria-labelledby="step2">
          <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Batch Factors</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <Label className="text-teal-500">Dry Volume Factor</Label>
              <NumberInput id="dryFactor" value={String(dryFactor)} onChange={(v) => { setDryFactor(parseFloat(v) || 0); setSubmitted(false); }} placeholder="1.54" ariaLabel="Dry volume factor" />
              <p className="text-xs text-slate-300">Accounts for voids and bulking.</p>
              <p className="text-[11px] text-white/60">Typical 1.50–1.57</p>
            </div>
            <div>
              <Label className="text-teal-500">Wastage (%)</Label>
              <NumberInput id="wastage" value={String(wastagePct)} onChange={(v) => { setWastagePct(parseFloat(v) || 0); setSubmitted(false); }} placeholder="2" ariaLabel="Wastage percentage" />
              <p className="text-xs text-slate-300">Extra to cover spillage/variations.</p>
              <p className="text-[11px] text-white/60">Typical 2–10%</p>
            </div>
            <div>
              <Label className="text-teal-500">Bag Size (kg)</Label>
              <NumberInput id="bagSize" value={String(bagSizeKg)} onChange={(v) => { setBagSizeKg(parseFloat(v) || 0); setSubmitted(false); }} placeholder="50" ariaLabel="Cement bag size" />
              <p className="text-xs text-slate-300">Used to compute number of bags.</p>
              <p className="text-[11px] text-white/60">Common: 25, 40, 50 kg</p>
            </div>
          </div>
        </section>

        {/* STEP 3 — Material Densities */}
        <section className={stepClass} aria-labelledby="step3">
          <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Material Densities</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <Label className="text-teal-500">Cement Density (kg/m³)</Label>
              <NumberInput id="rhoC" value={String(rhoCement)} onChange={(v) => { setRhoCement(parseFloat(v) || 0); setSubmitted(false); }} placeholder="1440" ariaLabel="Cement density" />
            </div>
            <div>
              <Label className="text-teal-500">Sand Density (kg/m³)</Label>
              <NumberInput id="rhoS" value={String(rhoSand)} onChange={(v) => { setRhoSand(parseFloat(v) || 0); setSubmitted(false); }} placeholder="1600" ariaLabel="Sand density" />
            </div>
            <div>
              <Label className="text-teal-500">Aggregate Density (kg/m³)</Label>
              <NumberInput id="rhoA" value={String(rhoAgg)} onChange={(v) => { setRhoAgg(parseFloat(v) || 0); setSubmitted(false); }} placeholder="1500" ariaLabel="Aggregate density" />
            </div>
          </div>
        </section>

        {/* STEP 4 — Moisture (optional) */}
        <section className={stepClass} aria-labelledby="step4">
          <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Moisture (optional)</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-teal-500">Sand Moisture (%)</Label>
              <NumberInput id="moistSand" value={String(moistSandPct)} onChange={(v) => { setMoistSandPct(parseFloat(v) || 0); setSubmitted(false); }} placeholder="2" ariaLabel="Sand moisture" />
              <p className="text-[11px] text-white/60 mt-1">Adjusts water and sand mass.</p>
            </div>
            <div>
              <Label className="text-teal-500">Aggregate Moisture (%)</Label>
              <NumberInput id="moistAgg" value={String(moistAggPct)} onChange={(v) => { setMoistAggPct(parseFloat(v) || 0); setSubmitted(false); }} placeholder="1" ariaLabel="Aggregate moisture" />
              <p className="text-[11px] text-white/60 mt-1">Adjusts water and aggregate mass.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Switch checked={showAdvanced} onCheckedChange={(v) => setShowAdvanced(v)} />
              <Label className="text-white">Show derived volumes & moisture corrections</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={showNotes} onCheckedChange={(v) => setShowNotes(v)} />
              <Label className="text-white">Show notes & assumptions</Label>
            </div>
          </div>
        </section>

        {/* STEP 5 — Actions */}
        <section className={stepClass} aria-labelledby="step5">
          <h3 id="step5" className="text-sm font-semibold text-white/80">Step 5 — Actions</h3>
          <form onSubmit={onCalculate} className="mt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={!canCalculate}
              className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0"
            >
              Calculate
            </Button>
            <Button
              type="button"
              onClick={onReset}
              className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
            >
              Reset
            </Button>
          </form>
        </section>

        {/* Results (hidden until Calculate) */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.</p>
        ) : (
          <>
            {/* Inputs Summary */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <KV k="Grade" v={`${grade} (${mix.c}:${mix.s}:${mix.a}, w/c ${fmt(wc,2)})`} />
                <KV k="Volume" v={`${inputVol} ${unitVol}`} />
                <KV k="Dry Factor" v={`${fmt(dryFactor,2)}`} />
                <KV k="Wastage" v={`${fmt(wastagePct,0)}%`} />
                <KV k="Bag Size" v={`${fmt(bagSizeKg,0)} kg`} />
                <KV k="Densities" v={`cem ${fmt(rhoCement,0)}, sand ${fmt(rhoSand,0)}, agg ${fmt(rhoAgg,0)} kg/m³`} />
                <KV k="Moisture" v={`sand ${fmt(moistSandPct,0)}% · agg ${fmt(moistAggPct,0)}%`} />
              </div>
            </div>

            {/* Header line w/ mix info */}
            <div className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Info className="h-4 w-4" />
                <span>
                  Mix <span className="font-semibold text-white">{grade}</span>: {mix.c}:{mix.s}:{mix.a} (w/c {fmt(wc, 2)})
                </span>
              </div>
            </div>

            {/* Result tiles */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              {/* Materials (bags & water) */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">Bags & Water</div>
                <div className="mt-2 space-y-2 text-sm">
                  <Row label={`Cement (bags @ ${fmt(bagSizeKg, 0)} kg)`} value={fmt(result.bags, 2)} />
                  <Row label="Water (L, after adj.)" value={fmt(result.adjWaterKg, 0)} />
                </div>
              </div>

              {/* Masses */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">Mass (adjusted)</div>
                <div className="mt-2 space-y-2 text-sm">
                  <Row label="Cement (kg)" value={fmt(result.massCementKg, 0)} />
                  <Row label="Sand (kg)" value={fmt(result.adjSandKg, 0)} />
                  <Row label="Aggregate (kg)" value={fmt(result.adjAggKg, 0)} />
                </div>
              </div>

              {/* Volumes */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <div className="text-xs uppercase text-white/70">Volumes</div>
                <div className="mt-2 space-y-2 text-sm">
                  <Row label="Input Volume (m³)" value={fmt(result.volM3, 3)} />
                  <Row label="Dry Volume (m³)" value={fmt(result.dryVol, 3)} />
                  <Row label={`Dry + Wastage ${fmt(wastagePct, 0)}% (m³)`} value={fmt(result.dryVolWithWastage, 3)} />
                </div>
              </div>
            </section>

            {/* Optional advanced */}
            {showAdvanced && (
              <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
                <div className="text-sm font-semibold text-white">Moisture & Water Adjustments</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <SmallTile heading="Water before adj. (L)" value={fmt(result.waterKg, 0)} />
                  <SmallTile heading="Water from aggregates (L)" value={fmt(result.totalAddedWater, 0)} />
                  <SmallTile heading="Water after adj. (L)" value={fmt(result.adjWaterKg, 0)} />
                </div>
              </section>
            )}

            {/* Notes */}
            {showNotes && (
              <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 text-xs text-white/70 space-y-2 mt-4">
                <p>
                  This tool estimates quantities for nominal mixes using volume batching. For design mixes or structural
                  members with strict strength requirements, use mix design (e.g., IS 10262 / ACI).
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dry volume factor typically 1.50–1.57 to account for voids & bulking.</li>
                  <li>W/C ratios are starting points; adjust for required workability & durability.</li>
                  <li>Bulk densities vary by source; edit as per local materials.</li>
                  <li>Moisture corrections assume free surface moisture; SSD conditions differ.</li>
                </ul>
              </section>
            )}

            {/* Cubic Yards helper (from input volume) */}
            <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (net)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(volToYd3(result.volM3), 3)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(volToYd3(result.volM3) * 1.05, 3)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{fmt(volToYd3(result.volM3) * 1.1, 3)} yd³</div>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/60">Net yd³ converts from your entered volume (before dry factor / wastage).</p>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------- SMALL UI PRIMITIVES -------------------------------- */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/70">{label}</span>
      <span className="text-teal-400 font-semibold">{value}</span>
    </div>
  );
}
function SmallTile({ heading, value }: { heading: string; value: string }) {
  return (
    <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
      <div className="text-xs text-white/70">{heading}</div>
      <div className="mt-1 text-lg font-semibold text-teal-400">{value}</div>
    </div>
  );
}
function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}
