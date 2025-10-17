// components/calculators/TankTrenchConcreteCalc.tsx
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";

/* -----------------------------------------------------------------------------
   Types & helpers (calculation logic preserved)
----------------------------------------------------------------------------- */
type LinearUnit = "meters" | "centimeters" | "feet" | "inches";

type VolumeResult = {
  core: number;       // m³ (net volume)
  withWaste: number;  // m³ (includes waste factor)
  breakdown?: Record<string, number>; // optional parts in m³
};

const UNIT_TO_M: Record<LinearUnit, number> = {
  meters: 1,
  centimeters: 0.01,
  feet: 0.3048,
  inches: 0.0254,
};

const clamp = (n: number, min = 0) => (isFinite(n) && n >= min ? n : min);
const toMeters = (v: number, u: LinearUnit) => clamp(v) * UNIT_TO_M[u];
const m3ToYd3 = (m3: number) => m3 * 1.30795062;
const m3ToFt3 = (m3: number) => m3 * 35.3146667;
const fmt = (n: number, d = 3) =>
  Number(n).toLocaleString(undefined, { maximumFractionDigits: d });

/* -----------------------------------------------------------------------------
   UI tokens (Dark Slate + Teal)
----------------------------------------------------------------------------- */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass =
  "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = {
  meters: "m",
  centimeters: "cm",
  feet: "ft",
  inches: "in",
};

/* -----------------------------------------------------------------------------
   Small UI: Field, NumberInput, Stat, KV
----------------------------------------------------------------------------- */
function Field({
  label,
  children,
  hint,
  subHint,
  id,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  subHint?: string;
  id?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-teal-500 text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-slate-300">{hint}</p> : null}
      {subHint ? <p className="text-[11px] text-white/60">{subHint}</p> : null}
    </div>
  );
}

function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  badge,
  ariaLabel,
}: {
  id?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  badge?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="relative">
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
        aria-label={ariaLabel}
        className={fieldInputClass}
      />
      {badge ? (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function Stat({
  heading,
  value,
  sub,
}: {
  heading: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
      <div className="text-xs text-white/70">{heading}</div>
      <div className="mt-1 text-2xl font-semibold text-teal-400">{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/70">{sub}</div> : null}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2 text-sm">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Component
----------------------------------------------------------------------------- */
export default function TankTrenchConcreteCalc() {
  // Global units & waste
  const [unit, setUnit] = React.useState<LinearUnit>("meters");
  const [wastePct, setWastePct] = React.useState<number>(5);

  // Tabs
  const [tab, setTab] = React.useState<"trench" | "rectTank" | "circTank">(
    "trench"
  );

  // Submitted (hide results until Calculate)
  const [submitted, setSubmitted] = React.useState(false);

  // ---------------- Trench ----------------
  const [trenchMode, setTrenchMode] = React.useState<"rect" | "trap">("rect");
  const [trLen, setTrLen] = React.useState<number>(10);
  const [trWidth, setTrWidth] = React.useState<number>(0.6);
  const [trDepth, setTrDepth] = React.useState<number>(0.9);
  const [trTopWidth, setTrTopWidth] = React.useState<number>(0.8);
  const [trBottomWidth, setTrBottomWidth] = React.useState<number>(0.5);

  // ---------------- Rectangular Tank ----------------
  const [rtLen, setRtLen] = React.useState<number>(3);     // inner
  const [rtWid, setRtWid] = React.useState<number>(2);     // inner
  const [rtHt, setRtHt] = React.useState<number>(2);       // inner
  const [rtWallT, setRtWallT] = React.useState<number>(0.2);
  const [rtBaseT, setRtBaseT] = React.useState<number>(0.25);
  const [rtIncludeTop, setRtIncludeTop] = React.useState<boolean>(false);
  const [rtTopT, setRtTopT] = React.useState<number>(0.15);

  // ---------------- Circular Tank ----------------
  const [ctDia, setCtDia] = React.useState<number>(2.5);   // inner
  const [ctHt, setCtHt] = React.useState<number>(2);       // inner
  const [ctWallT, setCtWallT] = React.useState<number>(0.2);
  const [ctBaseT, setCtBaseT] = React.useState<number>(0.25);
  const [ctIncludeTop, setCtIncludeTop] = React.useState<boolean>(false);
  const [ctTopT, setCtTopT] = React.useState<number>(0.15);

  /* ---------------------------------------------------------------------------
     Calculations (logic unchanged)
  --------------------------------------------------------------------------- */
  const trenchResult = React.useMemo<VolumeResult>(() => {
    const L = toMeters(trLen, unit);
    const D = toMeters(trDepth, unit);
    let core = 0;

    if (trenchMode === "rect") {
      const W = toMeters(trWidth, unit);
      core = L * W * D;
    } else {
      // Trapezoidal: area = depth * (top + bottom)/2
      const TW = toMeters(trTopWidth, unit);
      const BW = toMeters(trBottomWidth, unit);
      const avg = (TW + BW) / 2;
      core = L * D * avg;
    }

    const withWaste = core * (1 + clamp(wastePct) / 100);
    return { core, withWaste };
  }, [
    trenchMode,
    trLen,
    trWidth,
    trDepth,
    trTopWidth,
    trBottomWidth,
    unit,
    wastePct,
  ]);

  const rectTankResult = React.useMemo<VolumeResult>(() => {
    // Inner dims
    const Li = toMeters(rtLen, unit);
    const Wi = toMeters(rtWid, unit);
    const Hi = toMeters(rtHt, unit);

    const tW = toMeters(rtWallT, unit);
    const tB = toMeters(rtBaseT, unit);
    const tT = rtIncludeTop ? toMeters(rtTopT, unit) : 0;

    // Outer dims (box around inner void)
    const Lo = Li + 2 * tW;
    const Wo = Wi + 2 * tW;
    const Ho = Hi + tB + tT;

    const outerVol = Lo * Wo * Ho;
    const innerVol = Li * Wi * Hi;
    const core = Math.max(outerVol - innerVol, 0);

    const baseVol = Lo * Wo * tB;
    const topVol = tT > 0 ? Lo * Wo * tT : 0;
    const wallsVol = Math.max(core - baseVol - topVol, 0);

    const withWaste = core * (1 + clamp(wastePct) / 100);
    return {
      core,
      withWaste,
      breakdown: {
        baseSlab: baseVol,
        walls: wallsVol,
        coverSlab: topVol,
      },
    };
  }, [rtLen, rtWid, rtHt, rtWallT, rtBaseT, rtIncludeTop, rtTopT, unit, wastePct]);

  const circTankResult = React.useMemo<VolumeResult>(() => {
    const Di = toMeters(ctDia, unit);
    const Hi = toMeters(ctHt, unit);

    const tW = toMeters(ctWallT, unit);
    const tB = toMeters(ctBaseT, unit);
    const tT = ctIncludeTop ? toMeters(ctTopT, unit) : 0;

    const Do = Di + 2 * tW;
    const Ho = Hi + tB + tT;

    const outerVol = Math.PI * Math.pow(Do / 2, 2) * Ho;
    const innerVol = Math.PI * Math.pow(Di / 2, 2) * Hi;
    const core = Math.max(outerVol - innerVol, 0);

    const baseVol = Math.PI * Math.pow(Do / 2, 2) * tB;
    const topVol = tT > 0 ? Math.PI * Math.pow(Do / 2, 2) * tT : 0;
    const wallsVol = Math.max(core - baseVol - topVol, 0);

    const withWaste = core * (1 + clamp(wastePct) / 100);
    return {
      core,
      withWaste,
      breakdown: {
        baseSlab: baseVol,
        walls: wallsVol,
        coverSlab: topVol,
      },
    };
  }, [ctDia, ctHt, ctWallT, ctBaseT, ctIncludeTop, ctTopT, unit, wastePct]);

  /* ---------------------------------------------------------------------------
     Actions
  --------------------------------------------------------------------------- */
  function calculate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitted(true);
  }

  function resetAll() {
    setUnit("meters");
    setWastePct(5);
    setTab("trench");
    setTrenchMode("rect");
    setTrLen(10);
    setTrWidth(0.6);
    setTrDepth(0.9);
    setTrTopWidth(0.8);
    setTrBottomWidth(0.5);
    setRtLen(3);
    setRtWid(2);
    setRtHt(2);
    setRtWallT(0.2);
    setRtBaseT(0.25);
    setRtIncludeTop(false);
    setRtTopT(0.15);
    setCtDia(2.5);
    setCtHt(2);
    setCtWallT(0.2);
    setCtBaseT(0.25);
    setCtIncludeTop(false);
    setCtTopT(0.15);
    setSubmitted(false);
  }

  /* ---------------------------------------------------------------------------
     Render (step-based UX + unit badges + inputs summary)
  --------------------------------------------------------------------------- */
  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Tank / Trench Concrete Calculator
        </CardTitle>
        <CardDescription className="text-sm text-white/70 text-center">
          Estimate concrete for foundation trenches and rectangular/circular tanks.
          Results appear after you press <span className="font-semibold text-white">Calculate</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Trench volume uses rectangular or trapezoidal prism geometry.
            Tanks subtract inner void from outer envelope; cover slab is optional.
          </p>
        </div>

        {/* STEP 1 — Units & Waste */}
        <section className={stepClass} aria-labelledby="step1">
          <h3 id="step1" className="text-sm font-semibold text-white/80">
            Step 1 — Choose Units
          </h3>
          <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Units" hint={`All dimensions will be interpreted as ${unitAbbrev[unit]}.`}>
              <Select
                value={unit}
                onValueChange={(v) => {
                  setUnit(v as LinearUnit);
                  setSubmitted(false);
                }}
              >
                <SelectTrigger className={selectTriggerClass} aria-label="Units">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="meters" className="text-white">Meters (m)</SelectItem>
                  <SelectItem value="centimeters" className="text-white">Centimeters (cm)</SelectItem>
                  <SelectItem value="feet" className="text-white">Feet (ft)</SelectItem>
                  <SelectItem value="inches" className="text-white">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field
              id="waste"
              label="Waste / Overage (%)"
              hint="Adds extra volume to cover spillage, over-excavation, uneven base, etc."
              subHint="Typical 5–10%"
            >
              <NumberInput
                id="waste"
                value={String(wastePct)}
                onChange={(v) => {
                  setWastePct(v === "" ? 0 : Number(v));
                  setSubmitted(false);
                }}
                placeholder="5"
                badge="%"
                ariaLabel="Waste percent"
              />
            </Field>
          </div>
        </section>

        {/* Tabs for calculators */}
        <Tabs
          value={tab}
          onValueChange={(v: string) => {
            // Narrow the incoming string to the allowed tab values
            if (v === "trench" || v === "rectTank" || v === "circTank") {
              setTab(v);
            } else {
              // Ignore unexpected values to keep type-safety
              // (could also log for debugging)
            }
            setSubmitted(false);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-sm bg-slate-950 p-1">
            <TabsTrigger
              value="trench"
              className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              Trench
            </TabsTrigger>
            <TabsTrigger
              value="rectTank"
              className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              Rectangular Tank
            </TabsTrigger>
            <TabsTrigger
              value="circTank"
              className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white"
            >
              Circular Tank
            </TabsTrigger>
          </TabsList>

          {/* ---------------- TR E N C H ---------------- */}
          <TabsContent value="trench" className="mt-6">
            {/* STEP 2 — Core Dimensions */}
            <section aria-labelledby="tr-step2">
              <h3 id="tr-step2" className="text-sm font-semibold text-white/80">
                Step 2 — Core Dimensions
              </h3>
              <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field id="trLen" label={`Length (L)`} hint="Overall trench length." subHint={`Typical 3–60 ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="trLen"
                    value={String(trLen)}
                    onChange={(v) => { setTrLen(Number(v || 0)); setSubmitted(false); }}
                    placeholder="10"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Trench length"
                  />
                </Field>

                {trenchMode === "rect" ? (
                  <Field id="trWidth" label={`Width (W)`} hint="Uniform trench width.">
                    <NumberInput
                      id="trWidth"
                      value={String(trWidth)}
                      onChange={(v) => { setTrWidth(Number(v || 0)); setSubmitted(false); }}
                      placeholder="0.6"
                      badge={unitAbbrev[unit]}
                      ariaLabel="Trench width"
                    />
                  </Field>
                ) : (
                  <>
                    <Field id="trTopWidth" label={`Top Width`} hint="Top surface width for trapezoidal trench.">
                      <NumberInput
                        id="trTopWidth"
                        value={String(trTopWidth)}
                        onChange={(v) => { setTrTopWidth(Number(v || 0)); setSubmitted(false); }}
                        placeholder="0.8"
                        badge={unitAbbrev[unit]}
                        ariaLabel="Top width"
                      />
                    </Field>
                    <Field id="trBottomWidth" label={`Bottom Width`} hint="Bottom width for trapezoidal trench.">
                      <NumberInput
                        id="trBottomWidth"
                        value={String(trBottomWidth)}
                        onChange={(v) => { setTrBottomWidth(Number(v || 0)); setSubmitted(false); }}
                        placeholder="0.5"
                        badge={unitAbbrev[unit]}
                        ariaLabel="Bottom width"
                      />
                    </Field>
                  </>
                )}

                <Field id="trDepth" label={`Depth (D)`} hint="Vertical depth of trench." subHint={`Typical 0.5–2.0 ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="trDepth"
                    value={String(trDepth)}
                    onChange={(v) => { setTrDepth(Number(v || 0)); setSubmitted(false); }}
                    placeholder="0.9"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Trench depth"
                  />
                </Field>
              </div>
            </section>

            {/* STEP 3 — Optional Parameters */}
            <section className={stepClass} aria-labelledby="tr-step3">
              <h3 id="tr-step3" className="text-sm font-semibold text-white/80">
                Step 3 — Optional Parameters
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => { setTrenchMode("rect"); setSubmitted(false); }}
                  className={`h-11 rounded-sm ${trenchMode === "rect" ? "bg-teal-400 text-slate-900" : "bg-slate-700 text-white hover:bg-slate-600"}`}
                >
                  Rectangular
                </Button>
                <Button
                  type="button"
                  onClick={() => { setTrenchMode("trap"); setSubmitted(false); }}
                  className={`h-11 rounded-sm ${trenchMode === "trap" ? "bg-teal-400 text-slate-900" : "bg-slate-700 text-white hover:bg-slate-600"}`}
                >
                  Trapezoidal
                </Button>
              </div>
            </section>

            {/* STEP 4 — Actions */}
            <section className={stepClass} aria-labelledby="tr-step4">
              <h3 id="tr-step4" className="text-sm font-semibold text-white/80">
                Step 4 — Actions
              </h3>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={calculate}
                  className="h-11 rounded-sm bg-teal-400 text-slate-900 hover:bg-teal-300 focus-visible:ring-0"
                >
                  Calculate
                </Button>
                <Button
                  type="button"
                  onClick={resetAll}
                  className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
                >
                  Reset
                </Button>
              </div>
            </section>

            {/* Results */}
            {!submitted ? (
              <p className="mt-4 text-sm text-white/70">
                Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
              </p>
            ) : (
              <>
                {/* Inputs Summary */}
                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                  <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <KV k="Units" v={unitAbbrev[unit]} />
                    <KV k="Mode" v={trenchMode === "rect" ? "Rectangular" : "Trapezoidal"} />
                    <KV k="Length" v={`${trLen} ${unitAbbrev[unit]}`} />
                    {trenchMode === "rect" ? (
                      <KV k="Width" v={`${trWidth} ${unitAbbrev[unit]}`} />
                    ) : (
                      <>
                        <KV k="Top Width" v={`${trTopWidth} ${unitAbbrev[unit]}`} />
                        <KV k="Bottom Width" v={`${trBottomWidth} ${unitAbbrev[unit]}`} />
                      </>
                    )}
                    <KV k="Depth" v={`${trDepth} ${unitAbbrev[unit]}`} />
                    <KV k="Waste" v={`${wastePct}%`} />
                  </div>
                </div>

                <div className={`${stepClass} grid grid-cols-1 gap-4 sm:grid-cols-2 border-none`}>
                  <Stat
                    heading="Net Concrete"
                    value={`${fmt(trenchResult.core)} m³`}
                    sub={`${fmt(m3ToYd3(trenchResult.core), 3)} yd³ · ${fmt(m3ToFt3(trenchResult.core), 0)} ft³`}
                  />
                  <Stat
                    heading={`With Waste (${wastePct}%)`}
                    value={`${fmt(trenchResult.withWaste)} m³`}
                    sub={`${fmt(m3ToYd3(trenchResult.withWaste), 3)} yd³ · ${fmt(m3ToFt3(trenchResult.withWaste), 0)} ft³`}
                  />
                </div>

                {/* Cubic Yards helper */}
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                  <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (net)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(trenchResult.core), 3)} yd³
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(trenchResult.core) * 1.05, 3)} yd³
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(trenchResult.core) * 1.1, 3)} yd³
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ---------------- R E C T A N G U L A R  T A N K ---------------- */}
          <TabsContent value="rectTank" className="mt-6">
            {/* STEP 2 — Core Dimensions */}
            <section aria-labelledby="rt-step2">
              <h3 id="rt-step2" className="text-sm font-semibold text-white/80">
                Step 2 — Core Dimensions
              </h3>
              <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field id="rtLen" label="Inner Length (L)" hint="Clear internal length." subHint={`Typical 1–8 ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="rtLen"
                    value={String(rtLen)}
                    onChange={(v) => { setRtLen(Number(v || 0)); setSubmitted(false); }}
                    placeholder="3"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Rect tank inner length"
                  />
                </Field>
                <Field id="rtWid" label="Inner Width (W)" hint="Clear internal width.">
                  <NumberInput
                    id="rtWid"
                    value={String(rtWid)}
                    onChange={(v) => { setRtWid(Number(v || 0)); setSubmitted(false); }}
                    placeholder="2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Rect tank inner width"
                  />
                </Field>
                <Field id="rtHt" label="Inner Height (H)" hint="Clear internal height.">
                  <NumberInput
                    id="rtHt"
                    value={String(rtHt)}
                    onChange={(v) => { setRtHt(Number(v || 0)); setSubmitted(false); }}
                    placeholder="2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Rect tank inner height"
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field id="rtWallT" label="Wall Thickness" hint="Uniform thickness of all walls." subHint={`Typical 0.15–0.30 ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="rtWallT"
                    value={String(rtWallT)}
                    onChange={(v) => { setRtWallT(Number(v || 0)); setSubmitted(false); }}
                    placeholder="0.2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Wall thickness"
                  />
                </Field>
                <Field id="rtBaseT" label="Base Slab Thickness" hint="Bottom slab thickness.">
                  <NumberInput
                    id="rtBaseT"
                    value={String(rtBaseT)}
                    onChange={(v) => { setRtBaseT(Number(v || 0)); setSubmitted(false); }}
                    placeholder="0.25"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Base slab thickness"
                  />
                </Field>
                <div className="space-y-2">
                  <Label className="text-teal-500 text-sm font-medium">Include Cover Slab?</Label>
                  <div className="flex items-center gap-3 rounded-sm border border-slate-700 bg-slate-700 p-2">
                    <Switch
                      checked={rtIncludeTop}
                      onCheckedChange={(v) => { setRtIncludeTop(v); setSubmitted(false); }}
                    />
                    <span className="text-sm text-white">Adds top thickness to volume</span>
                  </div>
                </div>
                {rtIncludeTop && (
                  <Field id="rtTopT" label="Cover Slab Thickness">
                    <NumberInput
                      id="rtTopT"
                      value={String(rtTopT)}
                      onChange={(v) => { setRtTopT(Number(v || 0)); setSubmitted(false); }}
                      placeholder="0.15"
                      badge={unitAbbrev[unit]}
                      ariaLabel="Cover slab thickness"
                    />
                  </Field>
                )}
              </div>
            </section>

            {/* STEP 4 — Actions */}
            <section className={stepClass} aria-labelledby="rt-step4">
              <h3 id="rt-step4" className="text-sm font-semibold text-white/80">
                Step 3 — Actions
              </h3>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={calculate}
                  className="h-11 rounded-sm bg-teal-400 text-slate-900 hover:bg-teal-300 focus-visible:ring-0"
                >
                  Calculate
                </Button>
                <Button
                  type="button"
                  onClick={resetAll}
                  className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
                >
                  Reset
                </Button>
              </div>
            </section>

            {/* Results */}
            {!submitted ? (
              <p className="mt-4 text-sm text-white/70">
                Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
              </p>
            ) : (
              <>
                {/* Inputs Summary */}
                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                  <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <KV k="Units" v={unitAbbrev[unit]} />
                    <KV k="Inner L×W×H" v={`${rtLen} × ${rtWid} × ${rtHt} ${unitAbbrev[unit]}`} />
                    <KV k="Wall Thickness" v={`${rtWallT} ${unitAbbrev[unit]}`} />
                    <KV k="Base Thickness" v={`${rtBaseT} ${unitAbbrev[unit]}`} />
                    <KV k="Cover Slab" v={rtIncludeTop ? `Yes (${rtTopT} ${unitAbbrev[unit]})` : "No"} />
                    <KV k="Waste" v={`${wastePct}%`} />
                  </div>
                </div>

                <div className={`${stepClass} grid grid-cols-1 gap-4 sm:grid-cols-2 border-none`}>
                  <Stat
                    heading="Net Concrete"
                    value={`${fmt(rectTankResult.core)} m³`}
                    sub={`${fmt(m3ToYd3(rectTankResult.core), 3)} yd³ · ${fmt(m3ToFt3(rectTankResult.core), 0)} ft³`}
                  />
                  <Stat
                    heading={`With Waste (${wastePct}%)`}
                    value={`${fmt(rectTankResult.withWaste)} m³`}
                    sub={`${fmt(m3ToYd3(rectTankResult.withWaste), 3)} yd³ · ${fmt(m3ToFt3(rectTankResult.withWaste), 0)} ft³`}
                  />
                </div>

                {rectTankResult.breakdown && (
                  <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                    <div className="mb-2 text-sm font-semibold text-white">Breakdown (m³)</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
                      <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                        <div className="text-white/70">Base Slab</div>
                        <div className="text-teal-400 font-semibold">
                          {fmt(rectTankResult.breakdown.baseSlab)}
                        </div>
                      </div>
                      <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                        <div className="text-white/70">Walls</div>
                        <div className="text-teal-400 font-semibold">
                          {fmt(rectTankResult.breakdown.walls)}
                        </div>
                      </div>
                      <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                        <div className="text-white/70">Cover Slab</div>
                        <div className="text-teal-400 font-semibold">
                          {fmt(rectTankResult.breakdown.coverSlab)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cubic Yards helper */}
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                  <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (net)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(rectTankResult.core), 3)} yd³
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(rectTankResult.core) * 1.05, 3)} yd³
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(rectTankResult.core) * 1.1, 3)} yd³
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* ---------------- C I R C U L A R  T A N K ---------------- */}
          <TabsContent value="circTank" className="mt-6">
            {/* STEP 2 — Core Dimensions */}
            <section aria-labelledby="ct-step2">
              <h3 id="ct-step2" className="text-sm font-semibold text-white/80">
                Step 2 — Core Dimensions
              </h3>
              <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field id="ctDia" label="Inner Diameter (D)" hint="Clear internal diameter." subHint={`Typical 1–10 ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="ctDia"
                    value={String(ctDia)}
                    onChange={(v) => { setCtDia(Number(v || 0)); setSubmitted(false); }}
                    placeholder="2.5"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Circular tank inner diameter"
                  />
                </Field>
                <Field id="ctHt" label="Inner Height (H)" hint="Clear internal height.">
                  <NumberInput
                    id="ctHt"
                    value={String(ctHt)}
                    onChange={(v) => { setCtHt(Number(v || 0)); setSubmitted(false); }}
                    placeholder="2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Circular tank inner height"
                  />
                </Field>
                <Field id="ctWallT" label="Wall Thickness" hint="Uniform wall thickness.">
                  <NumberInput
                    id="ctWallT"
                    value={String(ctWallT)}
                    onChange={(v) => { setCtWallT(Number(v || 0)); setSubmitted(false); }}
                    placeholder="0.2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Circular wall thickness"
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Field id="ctBaseT" label="Base Slab Thickness" hint="Bottom slab thickness.">
                  <NumberInput
                    id="ctBaseT"
                    value={String(ctBaseT)}
                    onChange={(v) => { setCtBaseT(Number(v || 0)); setSubmitted(false); }}
                    placeholder="0.25"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Circular base thickness"
                  />
                </Field>

                <div className="space-y-2">
                  <Label className="text-teal-500 text-sm font-medium">Include Cover Slab?</Label>
                  <div className="flex items-center gap-3 rounded-sm border border-slate-700 bg-slate-700 p-2">
                    <Switch
                      checked={ctIncludeTop}
                      onCheckedChange={(v) => { setCtIncludeTop(v); setSubmitted(false); }}
                    />
                    <span className="text-sm text-white">Adds top thickness to volume</span>
                  </div>
                </div>

                {ctIncludeTop && (
                  <Field id="ctTopT" label="Cover Slab Thickness">
                    <NumberInput
                      id="ctTopT"
                      value={String(ctTopT)}
                      onChange={(v) => { setCtTopT(Number(v || 0)); setSubmitted(false); }}
                      placeholder="0.15"
                      badge={unitAbbrev[unit]}
                      ariaLabel="Cover slab thickness"
                    />
                  </Field>
                )}
              </div>
            </section>

            {/* STEP 4 — Actions */}
            <section className={stepClass} aria-labelledby="ct-step4">
              <h3 id="ct-step4" className="text-sm font-semibold text-white/80">
                Step 3 — Actions
              </h3>
              <div className="mt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={calculate}
                  className="h-11 rounded-sm bg-teal-400 text-slate-900 hover:bg-teal-300 focus-visible:ring-0"
                >
                  Calculate
                </Button>
                <Button
                  type="button"
                  onClick={resetAll}
                  className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
                >
                  Reset
                </Button>
              </div>
            </section>

            {/* Results */}
            {!submitted ? (
              <p className="mt-4 text-sm text-white/70">
                Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
              </p>
            ) : (
              <>
                {/* Inputs Summary */}
                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                  <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <KV k="Units" v={unitAbbrev[unit]} />
                    <KV k="Inner Dia" v={`${ctDia} ${unitAbbrev[unit]}`} />
                    <KV k="Inner Height" v={`${ctHt} ${unitAbbrev[unit]}`} />
                    <KV k="Wall Thickness" v={`${ctWallT} ${unitAbbrev[unit]}`} />
                    <KV k="Base Thickness" v={`${ctBaseT} ${unitAbbrev[unit]}`} />
                    <KV k="Cover Slab" v={ctIncludeTop ? `Yes (${ctTopT} ${unitAbbrev[unit]})` : "No"} />
                    <KV k="Waste" v={`${wastePct}%`} />
                  </div>
                </div>

                <div className={`${stepClass} grid grid-cols-1 gap-4 sm:grid-cols-2 border-none`}>
                  <Stat
                    heading="Net Concrete"
                    value={`${fmt(circTankResult.core)} m³`}
                    sub={`${fmt(m3ToYd3(circTankResult.core), 3)} yd³ · ${fmt(m3ToFt3(circTankResult.core), 0)} ft³`}
                  />
                  <Stat
                    heading={`With Waste (${wastePct}%)`}
                    value={`${fmt(circTankResult.withWaste)} m³`}
                    sub={`${fmt(m3ToYd3(circTankResult.withWaste), 3)} yd³ · ${fmt(m3ToFt3(circTankResult.withWaste), 0)} ft³`}
                  />
                </div>

                {circTankResult.breakdown && (
                  <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                    <div className="mb-2 text-sm font-semibold text-white">Breakdown (m³)</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
                      <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                        <div className="text-white/70">Base Slab</div>
                        <div className="text-teal-400 font-semibold">
                          {fmt(circTankResult.breakdown.baseSlab)}
                        </div>
                      </div>
                      <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                        <div className="text-white/70">Walls</div>
                        <div className="text-teal-400 font-semibold">
                          {fmt(circTankResult.breakdown.walls)}
                        </div>
                      </div>
                      <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                        <div className="text-white/70">Cover Slab</div>
                        <div className="text-teal-400 font-semibold">
                          {fmt(circTankResult.breakdown.coverSlab)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cubic Yards helper */}
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                  <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (net)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(circTankResult.core), 3)} yd³
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(circTankResult.core) * 1.05, 3)} yd³
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                      <div className="mt-1 text-xl font-semibold text-teal-400">
                        {fmt(m3ToYd3(circTankResult.core) * 1.1, 3)} yd³
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
