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
import { Info, Printer } from "lucide-react";

/* -----------------------------------------------------------------------------
   Types & helpers (calculation logic preserved; now parsing from string inputs)
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

// Parse any numeric text field -> non-negative number (empty -> 0)
const num = (s: string) => clamp(parseFloat(s || "0") || 0);

const unitAbbrev: Record<LinearUnit, string> = {
  meters: "m",
  centimeters: "cm",
  feet: "ft",
  inches: "in",
};

// (Optional) logo path used in the printable header (hide if not found)
const LOGO_URL = "/logo.svg";

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
  value: string;
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
  // ---------------- Global units & waste ----------------
  const [unit, setUnit] = React.useState<LinearUnit>("meters");

  // NOTE: per request, text fields start empty — so wastePct is also a string.
  const [wastePct, setWastePct] = React.useState<string>("");

  // Tabs
  const [tab, setTab] = React.useState<"trench" | "rectTank" | "circTank">(
    "trench"
  );

  // Submitted (hide results until Calculate)
  const [submitted, setSubmitted] = React.useState(false);

  // ---------------- Trench (all EMPTY on load) ----------------
  const [trenchMode, setTrenchMode] = React.useState<"rect" | "trap">("rect");
  const [trLen, setTrLen] = React.useState<string>("");          // ""
  const [trWidth, setTrWidth] = React.useState<string>("");      // ""
  const [trDepth, setTrDepth] = React.useState<string>("");      // ""
  const [trTopWidth, setTrTopWidth] = React.useState<string>("");// ""
  const [trBottomWidth, setTrBottomWidth] = React.useState<string>(""); // ""

  // ---------------- Rectangular Tank (all EMPTY) ----------------
  const [rtLen, setRtLen] = React.useState<string>("");     // inner
  const [rtWid, setRtWid] = React.useState<string>("");     // inner
  const [rtHt, setRtHt] = React.useState<string>("");       // inner
  const [rtWallT, setRtWallT] = React.useState<string>(""); // wall thickness
  const [rtBaseT, setRtBaseT] = React.useState<string>(""); // base thickness
  const [rtIncludeTop, setRtIncludeTop] = React.useState<boolean>(false);
  const [rtTopT, setRtTopT] = React.useState<string>("");   // cover thickness

  // ---------------- Circular Tank (all EMPTY) ----------------
  const [ctDia, setCtDia] = React.useState<string>("");     // inner
  const [ctHt, setCtHt] = React.useState<string>("");       // inner
  const [ctWallT, setCtWallT] = React.useState<string>(""); // wall thickness
  const [ctBaseT, setCtBaseT] = React.useState<string>(""); // base thickness
  const [ctIncludeTop, setCtIncludeTop] = React.useState<boolean>(false);
  const [ctTopT, setCtTopT] = React.useState<string>("");   // cover thickness

  /* ---------------------------------------------------------------------------
     Calculations (unchanged formulas; now reading from strings)
  --------------------------------------------------------------------------- */
  const trenchResult = React.useMemo<VolumeResult>(() => {
    const L = toMeters(num(trLen), unit);
    const D = toMeters(num(trDepth), unit);
    const wPct = clamp(num(wastePct), 0);

    let core = 0;
    if (trenchMode === "rect") {
      const W = toMeters(num(trWidth), unit);
      core = L * W * D;
    } else {
      // Trapezoidal: area = depth * (top + bottom)/2
      const TW = toMeters(num(trTopWidth), unit);
      const BW = toMeters(num(trBottomWidth), unit);
      const avg = (TW + BW) / 2;
      core = L * D * avg;
    }

    const withWaste = core * (1 + wPct / 100);
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
    const Li = toMeters(num(rtLen), unit);
    const Wi = toMeters(num(rtWid), unit);
    const Hi = toMeters(num(rtHt), unit);

    const tW = toMeters(num(rtWallT), unit);
    const tB = toMeters(num(rtBaseT), unit);
    const tT = rtIncludeTop ? toMeters(num(rtTopT), unit) : 0;

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

    const withWaste = core * (1 + clamp(num(wastePct), 0) / 100);
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
    const Di = toMeters(num(ctDia), unit);
    const Hi = toMeters(num(ctHt), unit);

    const tW = toMeters(num(ctWallT), unit);
    const tB = toMeters(num(ctBaseT), unit);
    const tT = ctIncludeTop ? toMeters(num(ctTopT), unit) : 0;

    const Do = Di + 2 * tW;
    const Ho = Hi + tB + tT;

    const outerVol = Math.PI * Math.pow(Do / 2, 2) * Ho;
    const innerVol = Math.PI * Math.pow(Di / 2, 2) * Hi;
    const core = Math.max(outerVol - innerVol, 0);

    const baseVol = Math.PI * Math.pow(Do / 2, 2) * tB;
    const topVol = tT > 0 ? Math.PI * Math.pow(Do / 2, 2) * tT : 0;
    const wallsVol = Math.max(core - baseVol - topVol, 0);

    const withWaste = core * (1 + clamp(num(wastePct), 0) / 100);
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

  /** Reset:
   *  - Clears ALL text inputs to ""
   *  - Disables optional cover slabs
   *  - Resets unit to "meters", tab to "trench", trenchMode to "rect"
   *  - Hides results
   */
  function resetAll() {
    setUnit("meters");
    setWastePct("");

    setTab("trench");
    setTrenchMode("rect");

    setTrLen("");
    setTrWidth("");
    setTrDepth("");
    setTrTopWidth("");
    setTrBottomWidth("");

    setRtLen("");
    setRtWid("");
    setRtHt("");
    setRtWallT("");
    setRtBaseT("");
    setRtIncludeTop(false);
    setRtTopT("");

    setCtDia("");
    setCtHt("");
    setCtWallT("");
    setCtBaseT("");
    setCtIncludeTop(false);
    setCtTopT("");

    setSubmitted(false);
  }

  /* ---------------------------------------------------------------------------
     Print / Save (backend-less)
     - Opens a new tab with a white, PDF-ready page mirroring current tab’s
       inputs and results, includes brand header + date/time, then triggers print.
  --------------------------------------------------------------------------- */
  const nf = (n: number, d = 3) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { maximumFractionDigits: d })
      : "—";

  function buildPrintHtml() {
    const now = new Date().toLocaleString();
    const u = unitAbbrev[unit];

    // Render section based on active tab
    const trenchHtml = (() => {
      const yd = m3ToYd3(trenchResult.withWaste);
      const rows = trenchMode === "rect"
        ? `
        <div class="kv"><div class="k">Width</div><div class="v">${trWidth || "—"} ${u}</div></div>`
        : `
        <div class="kv"><div class="k">Top Width</div><div class="v">${trTopWidth || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Bottom Width</div><div class="v">${trBottomWidth || "—"} ${u}</div></div>`;

      return `
      <h2>Inputs Summary — Trench</h2>
      <div class="grid">
        <div class="kv"><div class="k">Units</div><div class="v">${u}</div></div>
        <div class="kv"><div class="k">Mode</div><div class="v">${trenchMode === "rect" ? "Rectangular" : "Trapezoidal"}</div></div>
        <div class="kv"><div class="k">Length</div><div class="v">${trLen || "—"} ${u}</div></div>
        ${rows}
        <div class="kv"><div class="k">Depth</div><div class="v">${trDepth || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Waste</div><div class="v">${wastePct || "0"}%</div></div>
      </div>

      <h2>Results</h2>
      <div class="grid-2">
        <div class="card">
          <div class="label">Net (without waste)</div>
          <div class="kv"><div class="k">m³</div><div class="v">${nf(trenchResult.core)}</div></div>
          <div class="kv"><div class="k">yd³</div><div class="v">${nf(m3ToYd3(trenchResult.core),3)}</div></div>
          <div class="kv"><div class="k">ft³</div><div class="v">${nf(m3ToFt3(trenchResult.core),0)}</div></div>
        </div>
        <div class="card">
          <div class="label">With Waste (${wastePct || "0"}%)</div>
          <div class="kv"><div class="k">m³</div><div class="v">${nf(trenchResult.withWaste)}</div></div>
          <div class="kv"><div class="k">yd³</div><div class="v">${nf(yd,3)}</div></div>
          <div class="kv"><div class="k">ft³</div><div class="v">${nf(m3ToFt3(trenchResult.withWaste),0)}</div></div>
        </div>
      </div>

      <h2 style="margin-top:16px;">Cubic Yards (for ordering)</h2>
      <div class="grid">
        <div class="card"><div class="label">yd³ (base)</div><div class="value-md">${nf(yd,3)}</div></div>
        <div class="card"><div class="label">yd³ (+5%)</div><div class="value-md">${nf(yd*1.05,3)}</div></div>
        <div class="card"><div class="label">yd³ (+10%)</div><div class="value-md">${nf(yd*1.10,3)}</div></div>
      </div>`;
    })();

    const rectHtml = (() => {
      const yd = m3ToYd3(rectTankResult.withWaste);
      return `
      <h2>Inputs Summary — Rectangular Tank</h2>
      <div class="grid">
        <div class="kv"><div class="k">Units</div><div class="v">${u}</div></div>
        <div class="kv"><div class="k">Inner L×W×H</div><div class="v">${rtLen || "—"} × ${rtWid || "—"} × ${rtHt || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Wall Thickness</div><div class="v">${rtWallT || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Base Thickness</div><div class="v">${rtBaseT || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Cover Slab</div><div class="v">${rtIncludeTop ? (rtTopT || "—") + " " + u : "No"}</div></div>
        <div class="kv"><div class="k">Waste</div><div class="v">${wastePct || "0"}%</div></div>
      </div>

      <h2>Results</h2>
      <div class="grid-2">
        <div class="card">
          <div class="label">Net (without waste)</div>
          <div class="kv"><div class="k">m³</div><div class="v">${nf(rectTankResult.core)}</div></div>
          <div class="kv"><div class="k">yd³</div><div class="v">${nf(m3ToYd3(rectTankResult.core),3)}</div></div>
          <div class="kv"><div class="k">ft³</div><div class="v">${nf(m3ToFt3(rectTankResult.core),0)}</div></div>
        </div>
        <div class="card">
          <div class="label">With Waste (${wastePct || "0"}%)</div>
          <div class="kv"><div class="k">m³</div><div class="v">${nf(rectTankResult.withWaste)}</div></div>
          <div class="kv"><div class="k">yd³</div><div class="v">${nf(yd,3)}</div></div>
          <div class="kv"><div class="k">ft³</div><div class="v">${nf(m3ToFt3(rectTankResult.withWaste),0)}</div></div>
        </div>
      </div>

      <h2 style="margin-top:16px;">Breakdown (m³)</h2>
      <div class="grid">
        <div class="kv"><div class="k">Base Slab</div><div class="v">${nf(rectTankResult.breakdown!.baseSlab)}</div></div>
        <div class="kv"><div class="k">Walls</div><div class="v">${nf(rectTankResult.breakdown!.walls)}</div></div>
        <div class="kv"><div class="k">Cover Slab</div><div class="v">${nf(rectTankResult.breakdown!.coverSlab)}</div></div>
      </div>

      <h2 style="margin-top:16px;">Cubic Yards (for ordering)</h2>
      <div class="grid">
        <div class="card"><div class="label">yd³ (base)</div><div class="value-md">${nf(yd,3)}</div></div>
        <div class="card"><div class="label">yd³ (+5%)</div><div class="value-md">${nf(yd*1.05,3)}</div></div>
        <div class="card"><div class="label">yd³ (+10%)</div><div class="value-md">${nf(yd*1.10,3)}</div></div>
      </div>`;
    })();

    const circHtml = (() => {
      const yd = m3ToYd3(circTankResult.withWaste);
      return `
      <h2>Inputs Summary — Circular Tank</h2>
      <div class="grid">
        <div class="kv"><div class="k">Units</div><div class="v">${u}</div></div>
        <div class="kv"><div class="k">Inner Dia</div><div class="v">${ctDia || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Inner Height</div><div class="v">${ctHt || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Wall Thickness</div><div class="v">${ctWallT || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Base Thickness</div><div class="v">${ctBaseT || "—"} ${u}</div></div>
        <div class="kv"><div class="k">Cover Slab</div><div class="v">${ctIncludeTop ? (ctTopT || "—") + " " + u : "No"}</div></div>
        <div class="kv"><div class="k">Waste</div><div class="v">${wastePct || "0"}%</div></div>
      </div>

      <h2>Results</h2>
      <div class="grid-2">
        <div class="card">
          <div class="label">Net (without waste)</div>
          <div class="kv"><div class="k">m³</div><div class="v">${nf(circTankResult.core)}</div></div>
          <div class="kv"><div class="k">yd³</div><div class="v">${nf(m3ToYd3(circTankResult.core),3)}</div></div>
          <div class="kv"><div class="k">ft³</div><div class="v">${nf(m3ToFt3(circTankResult.core),0)}</div></div>
        </div>
        <div class="card">
          <div class="label">With Waste (${wastePct || "0"}%)</div>
          <div class="kv"><div class="k">m³</div><div class="v">${nf(circTankResult.withWaste)}</div></div>
          <div class="kv"><div class="k">yd³</div><div class="v">${nf(yd,3)}</div></div>
          <div class="kv"><div class="k">ft³</div><div class="v">${nf(m3ToFt3(circTankResult.withWaste),0)}</div></div>
        </div>
      </div>

      <h2 style="margin-top:16px;">Breakdown (m³)</h2>
      <div class="grid">
        <div class="kv"><div class="k">Base Slab</div><div class="v">${nf(circTankResult.breakdown!.baseSlab)}</div></div>
        <div class="kv"><div class="k">Walls</div><div class="v">${nf(circTankResult.breakdown!.walls)}</div></div>
        <div class="kv"><div class="k">Cover Slab</div><div class="v">${nf(circTankResult.breakdown!.coverSlab)}</div></div>
      </div>

      <h2 style="margin-top:16px;">Cubic Yards (for ordering)</h2>
      <div class="grid">
        <div class="card"><div class="label">yd³ (base)</div><div class="value-md">${nf(yd,3)}</div></div>
        <div class="card"><div class="label">yd³ (+5%)</div><div class="value-md">${nf(yd*1.05,3)}</div></div>
        <div class="card"><div class="label">yd³ (+10%)</div><div class="value-md">${nf(yd*1.10,3)}</div></div>
      </div>`;
    })();

    const bodyByTab =
      tab === "trench" ? trenchHtml : tab === "rectTank" ? rectHtml : circHtml;

    // Full printable HTML (white background)
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Tank / Trench Concrete Calculator – Print View</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  *{box-sizing:border-box} body{margin:0;background:#fff;color:#0f172a;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
  .container{max-width:960px;margin:0 auto;padding:24px}
  .header{display:flex;align-items:center;gap:16px;border-bottom:1px solid #e5e7eb;padding-bottom:16px;margin-bottom:20px}
  .brand{display:flex;align-items:center;gap:10px}
  .brand img{height:36px}
  .brand-name{font-weight:800;font-size:18px;color:#0f766e}
  .meta{margin-left:auto;text-align:right;color:#475569;font-size:12px}
  h2{font-size:16px;margin:18px 0 8px}
  .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .card{border:1px solid #e5e7eb;border-radius:6px;padding:12px;background:#fff}
  .kv{display:flex;align-items:center;justify-content:space-between;border:1px solid #e5e7eb;border-radius:6px;padding:8px}
  .kv .k{color:#475569}.kv .v{color:#0f766e;font-weight:700}
  .label{text-transform:uppercase;letter-spacing:.02em;font-size:11px;color:#64748b}
  .value-md{font-size:18px;font-weight:800;color:#0f766e}
  .footer{margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px}
  @media print{@page{margin:12mm}.footer{page-break-inside:avoid}}
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Concrete Calculator Max" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta">
        <div>Tank / Trench Concrete Calculator — ${tab}</div>
        <div>Printed: ${now}</div>
      </div>
    </div>
    ${bodyByTab}
    <div class="footer">Tip: In the browser’s Print dialog, choose “Save as PDF”.</div>
  </div>
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),100));</script>
</body>
</html>`;
  }

  function handlePrint() {
    if (!submitted) return; // only after results are visible
    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups for this site to use Print/Save.");
      return;
    }
    w.document.open();
    w.document.write(buildPrintHtml());
    w.document.close();
    w.focus();
  }

  /* ---------------------------------------------------------------------------
     Render (identical layout; only inputs are now strings; Print/Save button added)
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
                value={wastePct}
                onChange={(v) => {
                  setWastePct(v);
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
            if (v === "trench" || v === "rectTank" || v === "circTank") {
              setTab(v);
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
                    value={trLen}
                    onChange={(v) => { setTrLen(v); setSubmitted(false); }}
                    placeholder="10"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Trench length"
                  />
                </Field>

                {trenchMode === "rect" ? (
                  <Field id="trWidth" label={`Width (W)`} hint="Uniform trench width.">
                    <NumberInput
                      id="trWidth"
                      value={trWidth}
                      onChange={(v) => { setTrWidth(v); setSubmitted(false); }}
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
                        value={trTopWidth}
                        onChange={(v) => { setTrTopWidth(v); setSubmitted(false); }}
                        placeholder="0.8"
                        badge={unitAbbrev[unit]}
                        ariaLabel="Top width"
                      />
                    </Field>
                    <Field id="trBottomWidth" label={`Bottom Width`} hint="Bottom width for trapezoidal trench.">
                      <NumberInput
                        id="trBottomWidth"
                        value={trBottomWidth}
                        onChange={(v) => { setTrBottomWidth(v); setSubmitted(false); }}
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
                    value={trDepth}
                    onChange={(v) => { setTrDepth(v); setSubmitted(false); }}
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
                {/* NEW: Print/Save button (green-500 → hover green-400) */}
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={handlePrint}
                    className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                    title="Print / Save"
                  >
                    <Printer className="h-4 w-4 mr-2" /> Print / Save
                  </Button>
                </div>

                {/* Inputs Summary */}
                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                  <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <KV k="Units" v={unitAbbrev[unit]} />
                    <KV k="Mode" v={trenchMode === "rect" ? "Rectangular" : "Trapezoidal"} />
                    <KV k="Length" v={`${trLen || "—"} ${unitAbbrev[unit]}`} />
                    {trenchMode === "rect" ? (
                      <KV k="Width" v={`${trWidth || "—"} ${unitAbbrev[unit]}`} />
                    ) : (
                      <>
                        <KV k="Top Width" v={`${trTopWidth || "—"} ${unitAbbrev[unit]}`} />
                        <KV k="Bottom Width" v={`${trBottomWidth || "—"} ${unitAbbrev[unit]}`} />
                      </>
                    )}
                    <KV k="Depth" v={`${trDepth || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Waste" v={`${wastePct || "0"}%`} />
                  </div>
                </div>

                <div className={`${stepClass} grid grid-cols-1 gap-4 sm:grid-cols-2 border-none`}>
                  <Stat
                    heading="Net Concrete"
                    value={`${fmt(trenchResult.core)} m³`}
                    sub={`${fmt(m3ToYd3(trenchResult.core), 3)} yd³ · ${fmt(m3ToFt3(trenchResult.core), 0)} ft³`}
                  />
                  <Stat
                    heading={`With Waste (${wastePct || "0"}%)`}
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
                    value={rtLen}
                    onChange={(v) => { setRtLen(v); setSubmitted(false); }}
                    placeholder="3"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Rect tank inner length"
                  />
                </Field>
                <Field id="rtWid" label="Inner Width (W)" hint="Clear internal width.">
                  <NumberInput
                    id="rtWid"
                    value={rtWid}
                    onChange={(v) => { setRtWid(v); setSubmitted(false); }}
                    placeholder="2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Rect tank inner width"
                  />
                </Field>
                <Field id="rtHt" label="Inner Height (H)" hint="Clear internal height.">
                  <NumberInput
                    id="rtHt"
                    value={rtHt}
                    onChange={(v) => { setRtHt(v); setSubmitted(false); }}
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
                    value={rtWallT}
                    onChange={(v) => { setRtWallT(v); setSubmitted(false); }}
                    placeholder="0.2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Wall thickness"
                  />
                </Field>
                <Field id="rtBaseT" label="Base Slab Thickness" hint="Bottom slab thickness.">
                  <NumberInput
                    id="rtBaseT"
                    value={rtBaseT}
                    onChange={(v) => { setRtBaseT(v); setSubmitted(false); }}
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
                      value={rtTopT}
                      onChange={(v) => { setRtTopT(v); setSubmitted(false); }}
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
                {/* Print/Save button */}
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={handlePrint}
                    className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                    title="Print / Save"
                  >
                    <Printer className="h-4 w-4 mr-2" /> Print / Save
                  </Button>
                </div>

                {/* Inputs Summary */}
                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                  <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <KV k="Units" v={unitAbbrev[unit]} />
                    <KV k="Inner L×W×H" v={`${rtLen || "—"} × ${rtWid || "—"} × ${rtHt || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Wall Thickness" v={`${rtWallT || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Base Thickness" v={`${rtBaseT || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Cover Slab" v={rtIncludeTop ? `Yes (${rtTopT || "—"} ${unitAbbrev[unit]})` : "No"} />
                    <KV k="Waste" v={`${wastePct || "0"}%`} />
                  </div>
                </div>

                <div className={`${stepClass} grid grid-cols-1 gap-4 sm:grid-cols-2 border-none`}>
                  <Stat
                    heading="Net Concrete"
                    value={`${fmt(rectTankResult.core)} m³`}
                    sub={`${fmt(m3ToYd3(rectTankResult.core), 3)} yd³ · ${fmt(m3ToFt3(rectTankResult.core), 0)} ft³`}
                  />
                  <Stat
                    heading={`With Waste (${wastePct || "0"}%)`}
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
                    value={ctDia}
                    onChange={(v) => { setCtDia(v); setSubmitted(false); }}
                    placeholder="2.5"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Circular tank inner diameter"
                  />
                </Field>
                <Field id="ctHt" label="Inner Height (H)" hint="Clear internal height.">
                  <NumberInput
                    id="ctHt"
                    value={ctHt}
                    onChange={(v) => { setCtHt(v); setSubmitted(false); }}
                    placeholder="2"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Circular tank inner height"
                  />
                </Field>
                <Field id="ctWallT" label="Wall Thickness" hint="Uniform wall thickness.">
                  <NumberInput
                    id="ctWallT"
                    value={ctWallT}
                    onChange={(v) => { setCtWallT(v); setSubmitted(false); }}
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
                    value={ctBaseT}
                    onChange={(v) => { setCtBaseT(v); setSubmitted(false); }}
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
                      value={ctTopT}
                      onChange={(v) => { setCtTopT(v); setSubmitted(false); }}
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
                {/* Print/Save button */}
                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={handlePrint}
                    className="h-10 rounded-sm bg-green-500 text-slate-900 hover:bg-green-400"
                    title="Print / Save"
                  >
                    <Printer className="h-4 w-4 mr-2" /> Print / Save
                  </Button>
                </div>

                {/* Inputs Summary */}
                <div className={`${stepClass} rounded-sm bg-slate-900 border border-slate-700 p-4`}>
                  <div className="mb-2 text-sm font-semibold text-white">Inputs Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <KV k="Units" v={unitAbbrev[unit]} />
                    <KV k="Inner Dia" v={`${ctDia || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Inner Height" v={`${ctHt || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Wall Thickness" v={`${ctWallT || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Base Thickness" v={`${ctBaseT || "—"} ${unitAbbrev[unit]}`} />
                    <KV k="Cover Slab" v={ctIncludeTop ? `Yes (${ctTopT || "—"} ${unitAbbrev[unit]})` : "No"} />
                    <KV k="Waste" v={`${wastePct || "0"}%`} />
                  </div>
                </div>

                <div className={`${stepClass} grid grid-cols-1 gap-4 sm:grid-cols-2 border-none`}>
                  <Stat
                    heading="Net Concrete"
                    value={`${fmt(circTankResult.core)} m³`}
                    sub={`${fmt(m3ToYd3(circTankResult.core), 3)} yd³ · ${fmt(m3ToFt3(circTankResult.core), 0)} ft³`}
                  />
                  <Stat
                    heading={`With Waste (${wastePct || "0"}%)`}
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
