"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";

/* =========================
   Types, constants, helpers
   (LOGIC UNCHANGED)
========================= */

type LinearUnit = "m" | "cm" | "mm" | "ft" | "in";
type Mode = "waist" | "solid";

const DENSITY_CONCRETE_KG_M3 = 2400; // normal-weight concrete

function toMeters(value: number, unit: LinearUnit): number {
  const map: Record<LinearUnit, number> = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    ft: 0.3048,
    in: 0.0254,
  };
  return value * map[unit];
}

function toFixedSmart(n: number, d = 3): string {
  if (!isFinite(n)) return "0";
  if (n === 0) return "0";
  const s = n.toFixed(d);
  return s.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
}

function safeNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function clampMin(n: number, min = 0): number {
  return isFinite(n) ? Math.max(n, min) : 0;
}

// Pythag length of stair flight (slope length)
function slopedLength(totalRun_m: number, totalRise_m: number): number {
  return Math.hypot(totalRun_m, totalRise_m);
}

/* =========================
   UI tokens (styles only)
========================= */
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

/* =========================
   Small UI utilities
========================= */
const Field = ({
  id,
  label,
  children,
  hint,
  subHint,
}: {
  id?: string;
  label: string;
  children: React.ReactNode;
  hint?: string;
  subHint?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-teal-500 text-sm font-medium">{label}</Label>
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
  badge?: string;
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
        if (/^\d*\.?\d*$/.test(raw) || raw === "") onChange(raw);
      }}
      placeholder={placeholder}
      className={fieldInputClass}
      aria-label={ariaLabel}
    />
    {badge ? (
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">{badge}</span>
    ) : null}
  </div>
);

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2 text-sm">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}

/* =========================
   Component (logic intact)
========================= */
export default function StaircaseConcreteCalc() {
  const [mode, setMode] = React.useState<Mode>("waist");
  const [unit, setUnit] = React.useState<LinearUnit>("m");

  // shared inputs
  const [steps, setSteps] = React.useState<string>("12");
  const [tread, setTread] = React.useState<string>("0.28");
  const [riser, setRiser] = React.useState<string>("0.17");
  const [width, setWidth] = React.useState<string>("1.2");

  // waist slab specifics
  const [waistThk, setWaistThk] = React.useState<string>("0.15");

  // landings
  const [hasBottomLanding, setHasBottomLanding] = React.useState<boolean>(true);
  const [blLen, setBlLen] = React.useState<string>("1.2");
  const [blWid, setBlWid] = React.useState<string>("1.2");
  const [blThk, setBlThk] = React.useState<string>("0.15");

  const [hasTopLanding, setHasTopLanding] = React.useState<boolean>(true);
  const [tlLen, setTlLen] = React.useState<string>("1.2");
  const [tlWid, setTlWid] = React.useState<string>("1.2");
  const [tlThk, setTlThk] = React.useState<string>("0.15");

  // UX: show results only after clicking Calculate
  const [submitted, setSubmitted] = React.useState(false);

  // ---------- PURE derived compute (NO setState here) ----------
  const { errors, breakdown, totals } = React.useMemo(() => {
    const errs: string[] = [];

    const nSteps = Math.floor(clampMin(safeNum(steps), 1));
    if (nSteps < 1) errs.push("Number of steps must be at least 1.");

    const tread_m = clampMin(toMeters(safeNum(tread), unit));
    const riser_m = clampMin(toMeters(safeNum(riser), unit));
    const width_m = clampMin(toMeters(safeNum(width), unit));

    if (tread_m <= 0) errs.push("Tread (depth) must be greater than 0.");
    if (riser_m <= 0) errs.push("Riser (height) must be greater than 0.");
    if (width_m <= 0) errs.push("Stair width must be greater than 0.");

    let waist_m = 0;
    if (mode === "waist") {
      waist_m = clampMin(toMeters(safeNum(waistThk), unit));
      if (waist_m <= 0) errs.push("Waist thickness must be greater than 0.");
    }

    // landings
    let bl_m3 = 0;
    if (hasBottomLanding) {
      const L = clampMin(toMeters(safeNum(blLen), unit));
      const W = clampMin(toMeters(safeNum(blWid), unit));
      const T = clampMin(toMeters(safeNum(blThk), unit));
      if (L <= 0 || W <= 0 || T <= 0) errs.push("Bottom landing dimensions must be > 0.");
      bl_m3 = L * W * T;
    }

    let tl_m3 = 0;
    if (hasTopLanding) {
      const L = clampMin(toMeters(safeNum(tlLen), unit));
      const W = clampMin(toMeters(safeNum(tlWid), unit));
      const T = clampMin(toMeters(safeNum(tlThk), unit));
      if (L <= 0 || W <= 0 || T <= 0) errs.push("Top landing dimensions must be > 0.");
      tl_m3 = L * W * T;
    }

    const breakdown: Record<string, number> = {};
    let totalM3 = 0;

    if (errs.length === 0) {
      const totalRun_m = nSteps * tread_m;
      const totalRise_m = nSteps * riser_m;

      if (mode === "solid") {
        const stepsVol = nSteps * tread_m * riser_m * width_m;
        totalM3 = stepsVol + bl_m3 + tl_m3;
        breakdown["Steps (solid)"] = stepsVol;
      } else {
        const Ls = slopedLength(totalRun_m, totalRise_m);
        const waistVol = waist_m * width_m * Ls;
        const wedgeVol = 0.5 * nSteps * tread_m * riser_m * width_m;
        totalM3 = waistVol + wedgeVol + bl_m3 + tl_m3;
        breakdown["Waist slab"] = waistVol;
        breakdown["Step wedges"] = wedgeVol;
      }

      if (bl_m3 > 0) breakdown["Bottom landing"] = bl_m3;
      if (tl_m3 > 0) breakdown["Top landing"] = tl_m3;
    }

    const totals = {
      valid: errs.length === 0,
      m3: totalM3,
      ft3: totalM3 * 35.3146667,
      yd3: totalM3 * 1.30795062,
      liters: totalM3 * 1000,
      kg: totalM3 * DENSITY_CONCRETE_KG_M3,
      tonnes: (totalM3 * DENSITY_CONCRETE_KG_M3) / 1000,
    };

    return { errors: errs, breakdown, totals };
  }, [
    mode,
    unit,
    steps,
    tread,
    riser,
    width,
    waistThk,
    hasBottomLanding,
    blLen,
    blWid,
    blThk,
    hasTopLanding,
    tlLen,
    tlWid,
    tlThk,
  ]);

  function copyBreakdown() {
    if (!totals.valid) return;
    const lines: string[] = [
      "Staircase Concrete Calculator",
      `Mode: ${mode === "waist" ? "Waist-slab" : "Solid (mass) stairs"}`,
      "",
      "Breakdown (m³):",
      ...Object.entries(breakdown).map(([k, v]) => `- ${k}: ${toFixedSmart(v)}`),
      "",
      `Total: ${toFixedSmart(totals.m3)} m³`,
      `= ${toFixedSmart(totals.ft3)} ft³`,
      `= ${toFixedSmart(totals.yd3)} yd³`,
      `= ${toFixedSmart(totals.liters)} liters`,
      "",
      `Weight (approx): ${toFixedSmart(totals.kg)} kg (${toFixedSmart(totals.tonnes)} t)`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(
      () => alert("Breakdown copied to clipboard ✅"),
      () => alert("Copy failed. Please try again."),
    );
  }

  function resetAll() {
    setMode("waist");
    setUnit("m");
    setSteps("12");
    setTread("0.28");
    setRiser("0.17");
    setWidth("1.2");
    setWaistThk("0.15");
    setHasBottomLanding(true);
    setBlLen("1.2");
    setBlWid("1.2");
    setBlThk("0.15");
    setHasTopLanding(true);
    setTlLen("1.2");
    setTlWid("1.2");
    setTlThk("0.15");
    setSubmitted(false);
  }

  function onCalculate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitted(true);
  }

  /* =========================
     RENDER (Step-based UX)
  ========================= */
  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Staircase Concrete Calculator
        </CardTitle>
        <p className="text-sm text-white/70 text-center">
          Estimate concrete for waist-slab or solid stairs with optional landings. Results appear after you press
          <span className="font-semibold text-white"> Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Waist-slab model uses <code className="text-slate-200">waist × width × sloped length</code> plus triangular step wedges
            <code className="text-slate-200"> 0.5 × tread × riser × width × steps</code>. Landings are rectangular prisms.
          </p>
        </div>

        <form onSubmit={onCalculate} className="space-y-0">
          {/* STEP 1 — Choose Units & Mode */}
          <section className={stepClass} aria-labelledby="step1">
            <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Choose Units & Mode</h3>
            <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Field label="Units" hint={`All dimensions below will use ${unitAbbrev[unit]}.`}>
                  <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                    <SelectTrigger className={selectTriggerClass} aria-label="Units">
                      <SelectValue placeholder="Units" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="m" className="text-white">meters (m)</SelectItem>
                      <SelectItem value="cm" className="text-white">centimeters (cm)</SelectItem>
                      <SelectItem value="mm" className="text-white">millimeters (mm)</SelectItem>
                      <SelectItem value="ft" className="text-white">feet (ft)</SelectItem>
                      <SelectItem value="in" className="text-white">inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div>
                <Field label="Stair Type" hint="Switch between waist-slab and solid (mass) stairs.">
                  <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); setSubmitted(false); }} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-sm bg-slate-900 p-1">
                      <TabsTrigger value="waist" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Waist-Slab</TabsTrigger>
                      <TabsTrigger value="solid" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Solid (Mass)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </Field>
              </div>
            </div>
          </section>

          {/* STEP 2 — Core Dimensions */}
          <section className={stepClass} aria-labelledby="step2">
            <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Core Dimensions</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Field id="steps" label="Number of Steps" hint="Count of risers." subHint="Typical residential: 10–16">
                <NumberInput id="steps" value={steps} onChange={(v) => { setSteps(v); setSubmitted(false); }} placeholder="e.g., 12" numeric ariaLabel="Number of steps" />
              </Field>

              <Field id="tread" label={`Tread / Step Depth`} hint="Horizontal depth per step." subHint={unit === 'in' ? 'Typical 10–12 in' : unit === 'ft' ? 'Typical 0.8–1.0 ft' : 'Typical 0.25–0.32 m'}>
                <NumberInput id="tread" value={tread} onChange={(v) => { setTread(v); setSubmitted(false); }} placeholder={unit === 'm' ? '0.28' : unit === 'ft' ? '0.92' : ''} badge={unitAbbrev[unit]} ariaLabel="Tread depth" />
              </Field>

              <Field id="riser" label={`Riser / Step Height`} hint="Vertical height per step." subHint={unit === 'in' ? 'Typical 6–7.5 in' : unit === 'ft' ? 'Typical 0.5–0.65 ft' : 'Typical 0.15–0.20 m'}>
                <NumberInput id="riser" value={riser} onChange={(v) => { setRiser(v); setSubmitted(false); }} placeholder={unit === 'm' ? '0.17' : unit === 'ft' ? '0.56' : ''} badge={unitAbbrev[unit]} ariaLabel="Riser height" />
              </Field>

              <Field id="width" label={`Stair Width`} hint="Clear width of the flight." subHint={unit === 'in' ? 'Typical 36–48 in' : unit === 'ft' ? 'Typical 3–4 ft' : 'Typical 0.9–1.2 m'}>
                <NumberInput id="width" value={width} onChange={(v) => { setWidth(v); setSubmitted(false); }} placeholder={unit === 'm' ? '1.2' : unit === 'ft' ? '4' : ''} badge={unitAbbrev[unit]} ariaLabel="Stair width" />
              </Field>
            </div>

            {mode === "waist" && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="waist" label={`Waist Thickness`} hint="Thickness of the inclined slab." subHint={unit === 'in' ? 'Typical ~6 in' : unit === 'ft' ? 'Typical ~0.5 ft' : 'Typical ~0.15 m'}>
                  <NumberInput id="waist" value={waistThk} onChange={(v) => { setWaistThk(v); setSubmitted(false); }} placeholder={unit === 'm' ? '0.15' : unit === 'in' ? '6' : ''} badge={unitAbbrev[unit]} ariaLabel="Waist thickness" />
                </Field>
              </div>
            )}
          </section>

          {/* STEP 3 — Optional Parameters (Landings) */}
          <section className={stepClass} aria-labelledby="step3">
            <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Optional Parameters</h3>

            {/* Bottom Landing */}
            <div className="mt-2 rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-white font-semibold">Bottom Landing</h4>
                  <p className="text-xs text-slate-300">Include a rectangular bottom landing slab.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={hasBottomLanding} onCheckedChange={(v) => { setHasBottomLanding(v); setSubmitted(false); }} />
                  <span className="text-sm text-white">{hasBottomLanding ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 ${hasBottomLanding ? '' : 'opacity-50 pointer-events-none'}`}>
                <Field label={`Length`}>
                  <NumberInput value={blLen} onChange={(v) => { setBlLen(v); setSubmitted(false); }} badge={unitAbbrev[unit]} ariaLabel="Bottom landing length" />
                </Field>
                <Field label={`Width`}>
                  <NumberInput value={blWid} onChange={(v) => { setBlWid(v); setSubmitted(false); }} badge={unitAbbrev[unit]} ariaLabel="Bottom landing width" />
                </Field>
                <Field label={`Thickness`}>
                  <NumberInput value={blThk} onChange={(v) => { setBlThk(v); setSubmitted(false); }} badge={unitAbbrev[unit]} ariaLabel="Bottom landing thickness" />
                </Field>
              </div>
            </div>

            {/* Top Landing */}
            <div className="mt-4 rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-white font-semibold">Top Landing</h4>
                  <p className="text-xs text-slate-300">Include a rectangular top landing slab.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={hasTopLanding} onCheckedChange={(v) => { setHasTopLanding(v); setSubmitted(false); }} />
                  <span className="text-sm text-white">{hasTopLanding ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className={`mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 ${hasTopLanding ? '' : 'opacity-50 pointer-events-none'}`}>
                <Field label={`Length`}>
                  <NumberInput value={tlLen} onChange={(v) => { setTlLen(v); setSubmitted(false); }} badge={unitAbbrev[unit]} ariaLabel="Top landing length" />
                </Field>
                <Field label={`Width`}>
                  <NumberInput value={tlWid} onChange={(v) => { setTlWid(v); setSubmitted(false); }} badge={unitAbbrev[unit]} ariaLabel="Top landing width" />
                </Field>
                <Field label={`Thickness`}>
                  <NumberInput value={tlThk} onChange={(v) => { setTlThk(v); setSubmitted(false); }} badge={unitAbbrev[unit]} ariaLabel="Top landing thickness" />
                </Field>
              </div>
            </div>
          </section>

          {/* STEP 4 — Actions */}
          <section className={stepClass} aria-labelledby="step4">
            <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Actions</h3>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0">Calculate</Button>
              <Button type="button" onClick={resetAll} className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400">Reset</Button>
              <Button type="button" onClick={copyBreakdown} className="h-11 rounded-sm bg-slate-700 text-white hover:bg-slate-600">Copy Breakdown</Button>
            </div>
          </section>
        </form>

        {/* Results (hidden until Calculate) */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.</p>
        ) : !totals.valid ? (
          <div className="mt-4 rounded-sm border border-red-300 bg-red-950/20 p-4 text-sm text-red-300">
            <p className="mb-1 font-semibold">Please fix the following:</p>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((e, i) => (<li key={i}>{e}</li>))}
            </ul>
          </div>
        ) : (
          <>
            {/* Inputs Summary */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <KV k="Type" v={mode === 'waist' ? 'Waist-slab' : 'Solid (mass)'} />
                <KV k="Units" v={unitAbbrev[unit]} />
                <KV k="Steps" v={`${steps}`} />
                <KV k="Tread" v={`${tread} ${unitAbbrev[unit]}`} />
                <KV k="Riser" v={`${riser} ${unitAbbrev[unit]}`} />
                <KV k="Width" v={`${width} ${unitAbbrev[unit]}`} />
                {mode === 'waist' && <KV k="Waist" v={`${waistThk} ${unitAbbrev[unit]}`} />}
                <KV k="Bottom Landing" v={hasBottomLanding ? `${blLen}×${blWid}×${blThk} ${unitAbbrev[unit]}` : 'No'} />
                <KV k="Top Landing" v={hasTopLanding ? `${tlLen}×${tlWid}×${tlThk} ${unitAbbrev[unit]}` : 'No'} />
              </div>
            </div>

            {/* Result tiles */}
            <div className={`${stepClass} grid grid-cols-1 lg:grid-cols-3 gap-4 border-none`}>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Total Volume</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-white/70">m³</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.m3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">ft³</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.ft3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">yd³</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.yd3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">liters</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.liters)}</span></div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Weight (approx.)</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-white/70">kg</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.kg)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">metric tons</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.tonnes)}</span></div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Breakdown (m³)</p>
                <ul className="mt-2 text-sm space-y-1">
                  {Object.entries(breakdown).length > 0 ? (
                    Object.entries(breakdown).map(([k, v]) => (
                      <li key={k} className="flex items-center justify-between">
                        <span className="text-white/80">{k}</span>
                        <span className="text-teal-400 font-medium">{toFixedSmart(v)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-white/60">—</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Cubic Yards helper */}
            <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 text-sm font-semibold text-white">Cubic Yards (for ordering)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (net)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{toFixedSmart(totals.yd3, 3)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+5%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{toFixedSmart(totals.yd3 * 1.05, 3)} yd³</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-white/70">yd³ (+10%)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{toFixedSmart(totals.yd3 * 1.1, 3)} yd³</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <p className="text-xs text-white/70 mt-2">
              Results are approximate; verify against project drawings. Keep all inputs in the same unit ({unitAbbrev[unit]}).
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
