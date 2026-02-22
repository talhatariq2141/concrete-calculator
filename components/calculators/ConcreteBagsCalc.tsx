// components/calculators/ConcreteBagsCalculator.tsx
"use client";

import * as React from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Info, Printer } from "lucide-react";

/* =========================
   Types, constants, helpers
========================= */

type LinearUnit = "m" | "cm" | "mm" | "ft" | "in";
type SystemUnit = "imperial" | "metric";
type ProjectType = "slab" | "footing" | "post" | "sonotube" | "custom";
type BagSize =
  | "40lb"
  | "50lb"
  | "60lb"
  | "80lb"
  | "20kg";

const FT3_TO_M3 = 0.028316846592;
const M3_TO_FT3 = 1 / FT3_TO_M3; // 35.3146667
const M3_TO_YD3 = 1.30795062;
const YD3_TO_M3 = 1 / M3_TO_YD3;

// Typical yields (approx.) per bag
// (Source common industry approximations; normalized to m³ for internal calc)
const bagYieldM3: Record<BagSize, number> = {
  "40lb": 0.30 * FT3_TO_M3, // ≈ 0.0085 m³
  "50lb": 0.37 * FT3_TO_M3, // ≈ 0.0105 m³
  "60lb": 0.45 * FT3_TO_M3, // ≈ 0.0127 m³
  "80lb": 0.60 * FT3_TO_M3, // ≈ 0.0170 m³
  "20kg": 0.014,            // ≈ 0.014 m³ (manufacturer rounded)
};

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

function safeNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function clampMin(n: number, min = 0): number {
  return isFinite(n) ? Math.max(n, min) : 0;
}

function toFixedSmart(n: number, d = 3): string {
  if (!isFinite(n)) return "0";
  if (n === 0) return "0";
  const s = n.toFixed(d);
  return s.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
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

const unitAbbrev: Record<LinearUnit, string> = { m: "m", cm: "cm", mm: "mm", ft: "ft", in: "in" };

/* =========================
   Small UI utilities
========================= */
const Field = ({
  id, label, children, hint, subHint,
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
  id, value, onChange, placeholder, badge, ariaLabel, numeric,
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
   Component
========================= */

export default function ConcreteBagsCalculator() {
  // System & units
  const [system, setSystem] = React.useState<SystemUnit>("imperial");
  const [unit, setUnit] = React.useState<LinearUnit>("ft");

  // Project type
  const [proj, setProj] = React.useState<ProjectType>("slab");

  // Bag size
  const [bag, setBag] = React.useState<BagSize>("80lb");

  // Geometry inputs (empty by default)
  // Slab: L × W × T
  const [slabL, setSlabL] = React.useState<string>("");
  const [slabW, setSlabW] = React.useState<string>("");
  const [slabT, setSlabT] = React.useState<string>("");

  // Footing: L × W × H
  const [footL, setFootL] = React.useState<string>("");
  const [footW, setFootW] = React.useState<string>("");
  const [footH, setFootH] = React.useState<string>("");

  // Post Holes: dia × depth × count
  const [postD, setPostD] = React.useState<string>("");
  const [postDepth, setPostDepth] = React.useState<string>("");
  const [postCount, setPostCount] = React.useState<string>("");

  // Sonotube: dia × height × count
  const [tubeD, setTubeD] = React.useState<string>("");
  const [tubeH, setTubeH] = React.useState<string>("");
  const [tubeCount, setTubeCount] = React.useState<string>("");

  // Custom volume (direct)
  const [customVol, setCustomVol] = React.useState<string>(""); // user will enter in yd³ or m³ via unit pick

  // Conversions mini-tool
  const [convBags, setConvBags] = React.useState<string>("");
  const [convYards, setConvYards] = React.useState<string>("");
  const [convVol, setConvVol] = React.useState<string>("");

  // UX flags
  const [submitted, setSubmitted] = React.useState(false);

  /* =========================
     Derived compute
  ========================= */
  const { errors, totals } = React.useMemo(() => {
    const errs: string[] = [];

    // Compute volume in m³ based on project type & inputs
    let volumeM3 = 0;

    const u = unit; // for brevity
    const π = Math.PI;

    function rectVol(L: string, W: string, T: string): number {
      const Lm = clampMin(toMeters(safeNum(L), u));
      const Wm = clampMin(toMeters(safeNum(W), u));
      const Tm = clampMin(toMeters(safeNum(T), u));
      if (Lm <= 0 || Wm <= 0 || Tm <= 0) return 0;
      return Lm * Wm * Tm;
    }

    function cylinderVol(d: string, h: string, count: string): number {
      const dm = clampMin(toMeters(safeNum(d), u));
      const hm = clampMin(toMeters(safeNum(h), u));
      const n = Math.floor(clampMin(safeNum(count), 1));
      if (dm <= 0 || hm <= 0 || n <= 0) return 0;
      return (π * Math.pow(dm / 2, 2) * hm) * n;
    }

    switch (proj) {
      case "slab": {
        volumeM3 = rectVol(slabL, slabW, slabT);
        if (volumeM3 === 0) errs.push("Enter slab length, width, and thickness greater than 0.");
        break;
      }
      case "footing": {
        volumeM3 = rectVol(footL, footW, footH);
        if (volumeM3 === 0) errs.push("Enter footing length, width, and height greater than 0.");
        break;
      }
      case "post": {
        volumeM3 = cylinderVol(postD, postDepth, postCount);
        if (volumeM3 === 0) errs.push("Enter post hole diameter, depth, and count greater than 0.");
        break;
      }
      case "sonotube": {
        volumeM3 = cylinderVol(tubeD, tubeH, tubeCount);
        if (volumeM3 === 0) errs.push("Enter sonotube diameter, height, and count greater than 0.");
        break;
      }
      case "custom": {
        // Interpret customVol based on system: yd³ (imperial) or m³ (metric)
        const v = clampMin(safeNum(customVol));
        if (v <= 0) {
          errs.push(`Enter a custom volume greater than 0 (${system === "imperial" ? "cubic yards" : "m³"}).`);
        } else {
          volumeM3 = system === "imperial" ? v * YD3_TO_M3 : v;
        }
        break;
      }
    }

    const yd3 = volumeM3 * M3_TO_YD3;
    const ft3 = volumeM3 * M3_TO_FT3;

    // Bags needed
    const yieldPerBagM3 = bagYieldM3[bag];
    const bagsExact = yieldPerBagM3 > 0 ? volumeM3 / yieldPerBagM3 : 0;

    const totals = {
      valid: errs.length === 0,
      m3: volumeM3,
      yd3,
      ft3,
      bagsExact,
      bags5: bagsExact * 1.05,
      bags10: bagsExact * 1.10,
    };

    return { errors: errs, totals };
  }, [
    system, unit, proj, bag,
    slabL, slabW, slabT,
    footL, footW, footH,
    postD, postDepth, postCount,
    tubeD, tubeH, tubeCount,
    customVol,
  ]);

  function resetAll() {
    setSystem("imperial");
    setUnit("ft");
    setProj("slab");
    setBag("80lb");

    setSlabL(""); setSlabW(""); setSlabT("");
    setFootL(""); setFootW(""); setFootH("");
    setPostD(""); setPostDepth(""); setPostCount("");
    setTubeD(""); setTubeH(""); setTubeCount("");
    setCustomVol("");

    setConvBags(""); setConvYards(""); setConvVol("");

    setSubmitted(false);
  }

  function onCalculate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmitted(true);
  }

  function copySummary() {
    if (!submitted || !totals.valid) return;
    const lines: string[] = [
      "Concrete Bags Calculator — Result Summary",
      `Project: ${proj}`,
      `System: ${system} (${unit})`,
      `Bag size: ${bag}`,
      "",
      `Volume: ${toFixedSmart(totals.m3)} m³ = ${toFixedSmart(totals.yd3)} yd³ = ${toFixedSmart(totals.ft3)} ft³`,
      `Bags (exact): ${toFixedSmart(totals.bagsExact)}`,
      `Bags (+5%): ${toFixedSmart(totals.bags5)}`,
      `Bags (+10%): ${toFixedSmart(totals.bags10)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(
      () => alert("Summary copied to clipboard ✅"),
      () => alert("Copy failed. Please try again."),
    );
  }

  /* ===================== PRINT / SAVE ===================== */
  const LOGO_URL = "/logo.svg";
  const nf = (n: number, d = 3) =>
    Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

  const handlePrint = () => {
    if (!submitted || !totals.valid) return;
    const now = new Date().toLocaleString();

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Concrete Bags Calculator – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand img { height: 36px; width: auto; }
    .brand-name { font-weight: 800; font-size: 18px; color: #0f766e; }
    .meta { margin-left: auto; text-align: right; color: #475569; font-size: 12px; }
    h2 { font-size: 16px; margin: 18px 0 8px; color: #0f172a; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #fff; }
    .kv { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; }
    .kv .k { color: #475569; }
    .kv .v { color: #0f766e; font-weight: 700; }
    .label { text-transform: uppercase; letter-spacing: .02em; font-size: 11px; color: #64748b; }
    .value-md { font-size: 18px; font-weight: 800; color: #0f766e; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 12px; }
    @media print { @page { margin: 12mm; } .footer { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header / Branding -->
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Concrete Calculator Max Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta">
        <div>Concrete Bags Calculator</div>
        <div>Printed: ${now}</div>
      </div>
    </div>

    <!-- Inputs Summary -->
    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">System</div><div class="v">${system}</div></div>
      <div class="kv"><div class="k">Units</div><div class="v">${unit}</div></div>
      <div class="kv"><div class="k">Project</div><div class="v">${proj}</div></div>
      <div class="kv"><div class="k">Bag size</div><div class="v">${bag}</div></div>
    </div>

    <!-- Results -->
    <h2>Results</h2>
    <div class="grid-2">
      <div class="card">
        <div class="label">Volume</div>
        <div class="kv"><div class="k">m³</div><div class="v">${nf(totals.m3)}</div></div>
        <div class="kv"><div class="k">yd³</div><div class="v">${nf(totals.yd3, 3)}</div></div>
        <div class="kv"><div class="k">ft³</div><div class="v">${nf(totals.ft3, 3)}</div></div>
      </div>
      <div class="card">
        <div class="label">Bags Needed</div>
        <div class="kv"><div class="k">Exact</div><div class="v">${nf(totals.bagsExact, 3)}</div></div>
        <div class="kv"><div class="k">+5%</div><div class="v">${nf(totals.bags5, 3)}</div></div>
        <div class="kv"><div class="k">+10%</div><div class="v">${nf(totals.bags10, 3)}</div></div>
      </div>
    </div>

    <!-- Ordering Helper (Yards) -->
    <h2 style="margin-top:16px;">Cubic Yards (for ordering)</h2>
    <div class="grid">
      <div class="card"><div class="label">yd³ (net)</div><div class="value-md">${nf(totals.yd3, 3)}</div></div>
      <div class="card"><div class="label">yd³ (+5%)</div><div class="value-md">${nf(totals.yd3 * 1.05, 3)}</div></div>
      <div class="card"><div class="label">yd³ (+10%)</div><div class="value-md">${nf(totals.yd3 * 1.10, 3)}</div></div>
    </div>

    <div class="footer">
      Tip: In the browser’s Print dialog, choose “Save as PDF” to export this page as a PDF.
    </div>
  </div>

  <script> window.addEventListener('load', () => setTimeout(() => window.print(), 100)); </script>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups for this site to use Print/Save.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Concrete Bags Calculator
        </CardTitle>
        <p className="text-sm text-white/70 text-center">
          Find how many concrete bags you need for slabs, footings, posts, or sonotubes. Results appear after you press
          <span className="font-semibold text-white"> Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400" />
          <p className="text-sm text-slate-300">
            Choose your project type, enter dimensions, select a bag size (40/50/60/80 lb or 20&nbsp;kg), and calculate. Includes buffers (+5% and +10%) and a mini conversion tool (Bags ↔ Yards ↔ Volume).
          </p>
        </div>

        <form onSubmit={onCalculate} className="space-y-0">
          {/* STEP 1 — System & Units & Project */}
          <section className={stepClass} aria-labelledby="step1">
            <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Choose System, Units & Project Type</h3>
            <div className="mt-2 grid grid-cols-1  gap-6">
              <Field label="Unit System" hint="Switches custom volume interpretation and defaults.">
                <Tabs
                  value={system}
                  onValueChange={(v) => {
                    setSystem(v as SystemUnit);
                    // switch default linear unit for convenience
                    setUnit(v === "imperial" ? "ft" : "m");
                    setSubmitted(false);
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 rounded-sm bg-slate-950 p-1">
                    <TabsTrigger value="imperial" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Imperial</TabsTrigger>
                    <TabsTrigger value="metric" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Metric</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Field>

              <Field label="Linear Units" hint={`All dimensions use ${unitAbbrev[unit]}.`}>
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

              <Field label="Project Type" hint="Different inputs appear per project.">
                <Tabs value={proj} onValueChange={(v) => { setProj(v as ProjectType); setSubmitted(false); }} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 rounded-sm bg-slate-950 p-1">
                    <TabsTrigger value="slab" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Slab</TabsTrigger>
                    <TabsTrigger value="footing" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Footing</TabsTrigger>
                    <TabsTrigger value="post" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Post Holes</TabsTrigger>
                    <TabsTrigger value="sonotube" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Sonotube</TabsTrigger>
                    <TabsTrigger value="custom" className="rounded-sm text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">Custom</TabsTrigger>
                  </TabsList>
                </Tabs>
              </Field>
            </div>
          </section>

          {/* STEP 2 — Dimensions */}
          <section className={stepClass} aria-labelledby="step2">
            <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Enter Dimensions</h3>

            {proj === "slab" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="slabL" label="Length" hint="Overall length of slab.">
                  <NumberInput id="slabL" value={slabL} onChange={(v) => { setSlabL(v); setSubmitted(false); }} placeholder="e.g., 20" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="slabW" label="Width" hint="Overall width of slab.">
                  <NumberInput id="slabW" value={slabW} onChange={(v) => { setSlabW(v); setSubmitted(false); }} placeholder="e.g., 12" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="slabT" label="Thickness" hint="Slab thickness.">
                  <NumberInput id="slabT" value={slabT} onChange={(v) => { setSlabT(v); setSubmitted(false); }} placeholder="e.g., 0.33" badge={unitAbbrev[unit]} />
                </Field>
              </div>
            )}

            {proj === "footing" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="footL" label="Length">
                  <NumberInput id="footL" value={footL} onChange={(v) => { setFootL(v); setSubmitted(false); }} placeholder="e.g., 25" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="footW" label="Width">
                  <NumberInput id="footW" value={footW} onChange={(v) => { setFootW(v); setSubmitted(false); }} placeholder="e.g., 2" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="footH" label="Height">
                  <NumberInput id="footH" value={footH} onChange={(v) => { setFootH(v); setSubmitted(false); }} placeholder="e.g., 0.75" badge={unitAbbrev[unit]} />
                </Field>
              </div>
            )}

            {proj === "post" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="postD" label="Hole Diameter">
                  <NumberInput id="postD" value={postD} onChange={(v) => { setPostD(v); setSubmitted(false); }} placeholder="e.g., 12" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="postDepth" label="Hole Depth">
                  <NumberInput id="postDepth" value={postDepth} onChange={(v) => { setPostDepth(v); setSubmitted(false); }} placeholder="e.g., 30" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="postCount" label="Number of Holes">
                  <NumberInput id="postCount" value={postCount} onChange={(v) => { setPostCount(v); setSubmitted(false); }} placeholder="e.g., 8" numeric />
                </Field>
              </div>
            )}

            {proj === "sonotube" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Field id="tubeD" label="Tube Diameter">
                  <NumberInput id="tubeD" value={tubeD} onChange={(v) => { setTubeD(v); setSubmitted(false); }} placeholder="e.g., 12" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="tubeH" label="Tube Height">
                  <NumberInput id="tubeH" value={tubeH} onChange={(v) => { setTubeH(v); setSubmitted(false); }} placeholder="e.g., 36" badge={unitAbbrev[unit]} />
                </Field>
                <Field id="tubeCount" label="Number of Tubes">
                  <NumberInput id="tubeCount" value={tubeCount} onChange={(v) => { setTubeCount(v); setSubmitted(false); }} placeholder="e.g., 4" numeric />
                </Field>
              </div>
            )}

            {proj === "custom" && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field id="customVol" label={`Custom Volume (${system === "imperial" ? "cubic yards" : "m³"})`}>
                  <NumberInput id="customVol" value={customVol} onChange={(v) => { setCustomVol(v); setSubmitted(false); }} placeholder={system === "imperial" ? "e.g., 3.5" : "e.g., 2.2"} />
                </Field>
                <div className="hidden sm:block" />
              </div>
            )}
          </section>

          {/* STEP 3 — Bag size */}
          <section className={stepClass} aria-labelledby="step3">
            <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Select Bag Size</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Field label="Bag Size" hint="Common pre-mix bag sizes.">
                <Select value={bag} onValueChange={(v) => { setBag(v as BagSize); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Bag size">
                    <SelectValue placeholder="Select bag size" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="40lb" className="text-white">40 lb</SelectItem>
                    <SelectItem value="50lb" className="text-white">50 lb</SelectItem>
                    <SelectItem value="60lb" className="text-white">60 lb</SelectItem>
                    <SelectItem value="80lb" className="text-white">80 lb</SelectItem>
                    <SelectItem value="20kg" className="text-white">20 kg</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                <div className="text-xs uppercase text-white/70">Approx. Yield per Bag</div>
                <div className="mt-1 text-sm text-slate-200">
                  {bag === "20kg"
                    ? "≈ 0.014 m³ (≈ 0.49 ft³)"
                    : `≈ ${toFixedSmart(bagYieldM3[bag] * M3_TO_FT3)} ft³ (≈ ${toFixedSmart(bagYieldM3[bag], 4)} m³)`}
                </div>
                <p className="text-[11px] text-white/60 mt-1">Use manufacturer data if available.</p>
              </div>
            </div>
          </section>

          {/* STEP 4 — Actions */}
          <section className={stepClass} aria-labelledby="step4">
            <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Actions</h3>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0">Calculate</Button>
              <Button type="button" onClick={resetAll} className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400">Reset</Button>
              <Button type="button" onClick={copySummary} className="h-11 rounded-sm bg-slate-700 text-white hover:bg-slate-600">Copy Summary</Button>
            </div>
          </section>
        </form>

        {/* Results */}
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
            {/* Print/Save button */}
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={handlePrint}
                className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                aria-label="Print or save results as PDF"
                title="Print / Save"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print / Save
              </Button>
            </div>

            {/* Inputs Summary */}
            <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
              <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <KV k="System" v={system} />
                <KV k="Units" v={unitAbbrev[unit]} />
                <KV k="Project" v={proj} />
                <KV k="Bag" v={bag} />
              </div>
            </div>

            {/* Result tiles */}
            <div className={`${stepClass} grid grid-cols-1 lg:grid-cols-3 gap-4 border-none`}>
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Volume</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-white/70">m³</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.m3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">yd³</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.yd3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">ft³</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.ft3)}</span></div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Bags Needed</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-white/70">Exact</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.bagsExact)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">+5%</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.bags5)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">+10%</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.bags10)}</span></div>
                </div>
              </div>

              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <p className="text-xs uppercase text-white/70">Cubic Yards (for ordering)</p>
                <div className="mt-2 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-white/70">yd³ (net)</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.yd3, 3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">yd³ (+5%)</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.yd3 * 1.05, 3)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-white/70">yd³ (+10%)</span><span className="text-teal-400 font-semibold">{toFixedSmart(totals.yd3 * 1.1, 3)}</span></div>
                </div>
              </div>
            </div>

            {/* Mini Conversion Tool */}
            <div className="mt-4 rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 text-sm font-semibold text-white">Conversions (Utility)</div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                  <div className="text-xs uppercase text-white/70 mb-1">Bags → Yards</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Bags">
                      <NumberInput value={convBags} onChange={(v) => setConvBags(v)} placeholder="e.g., 50" />
                    </Field>
                    <Field label="yd³ (approx)">
                      <div className="relative">
                        <Input readOnly value={
                          convBags
                            ? toFixedSmart(clampMin(safeNum(convBags)) * bagYieldM3[bag] * M3_TO_YD3, 4)
                            : ""
                        } className={fieldInputClass} />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">yd³</span>
                      </div>
                    </Field>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1">Uses current bag size yield.</p>
                </div>

                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                  <div className="text-xs uppercase text-white/70 mb-1">Yards → Bags</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="yd³">
                      <NumberInput value={convYards} onChange={(v) => setConvYards(v)} placeholder="e.g., 2.3" />
                    </Field>
                    <Field label="Bags (approx)">
                      <div className="relative">
                        <Input readOnly value={
                          convYards
                            ? toFixedSmart(clampMin(safeNum(convYards)) * YD3_TO_M3 / bagYieldM3[bag], 3)
                            : ""
                        } className={fieldInputClass} />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">bags</span>
                      </div>
                    </Field>
                  </div>
                </div>

                <div className="rounded-sm border border-slate-700 bg-slate-900 p-3">
                  <div className="text-xs uppercase text-white/70 mb-1">Volume → Bags</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={system === "imperial" ? "yd³" : "m³"}>
                      <NumberInput value={convVol} onChange={(v) => setConvVol(v)} placeholder={system === "imperial" ? "e.g., 1.8" : "e.g., 1.2"} />
                    </Field>
                    <Field label="Bags (approx)">
                      <div className="relative">
                        <Input readOnly value={
                          convVol
                            ? toFixedSmart(
                              (system === "imperial"
                                ? clampMin(safeNum(convVol)) * YD3_TO_M3
                                : clampMin(safeNum(convVol))) / bagYieldM3[bag],
                              3)
                            : ""
                        } className={fieldInputClass} />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">bags</span>
                      </div>
                    </Field>
                  </div>
                  <p className="text-[11px] text-white/60 mt-1">Assumes uniform yield per bag.</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="text-xs text-white/70 mt-2">
              Results are approximate; add waste as needed and verify against project drawings/specifications. Keep all inputs in the same unit ({unitAbbrev[unit]}).
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
