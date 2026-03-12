// components/calculators/PostHoleConcreteCalc.tsx
"use client";

import * as React from "react";
import { useMemo, useState } from "react";
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
import { Info, Printer } from "lucide-react";

/* ===================== Types ===================== */
type LinearUnit = "in" | "ft" | "cm" | "m";
type CalcMode = "quick" | "advanced" | "recommendation";
type HoleShape = "round" | "square";
type PostShape = "round" | "square";
type PostTypePreset = "fence-line" | "fence-corner" | "gate" | "mailbox" | "deck" | "pole" | "custom";
type ConcreteProduct = "fast-setting" | "standard" | "high-strength" | "custom";
type BagSize = "40" | "50" | "60" | "80" | "custom";

/* ===================== Constants ===================== */
/** Yield per bag in cubic feet */
const BAG_YIELDS: Record<string, number> = {
  "40": 0.30,
  "50": 0.375,
  "60": 0.45,
  "80": 0.60,
};

const POST_TYPE_LABELS: Record<PostTypePreset, string> = {
  "fence-line": "Fence Line Post",
  "fence-corner": "Fence Corner Post",
  "gate": "Gate Post",
  "mailbox": "Mailbox Post",
  "deck": "Deck Post",
  "pole": "Pole / Utility / Landscape",
  "custom": "Custom",
};

/* Preset: { postShape, postWidth (in), holeDiaMultiplier, embeddedDepthRule } */
const POST_PRESETS: Record<PostTypePreset, { shape: PostShape; width: string; length: string; wasteDefault: string; holeDiaMultiplier: number; deeperEmbed: boolean }> = {
  "fence-line": { shape: "square", width: "3.5", length: "3.5", wasteDefault: "10", holeDiaMultiplier: 3, deeperEmbed: false },
  "fence-corner": { shape: "square", width: "3.5", length: "3.5", wasteDefault: "10", holeDiaMultiplier: 3.5, deeperEmbed: false },
  "gate": { shape: "square", width: "5.5", length: "5.5", wasteDefault: "10", holeDiaMultiplier: 3.5, deeperEmbed: true },
  "mailbox": { shape: "square", width: "3.5", length: "3.5", wasteDefault: "10", holeDiaMultiplier: 3, deeperEmbed: false },
  "deck": { shape: "square", width: "5.5", length: "5.5", wasteDefault: "10", holeDiaMultiplier: 3, deeperEmbed: false },
  "pole": { shape: "round", width: "4", length: "4", wasteDefault: "10", holeDiaMultiplier: 3, deeperEmbed: false },
  "custom": { shape: "square", width: "", length: "", wasteDefault: "10", holeDiaMultiplier: 3, deeperEmbed: false },
};

/* ===================== Unit conversion ===================== */
/** Convert to feet (internal unit) */
const toFeet = (v: number, u: LinearUnit): number => {
  switch (u) {
    case "ft": return v;
    case "in": return v / 12;
    case "cm": return v / 30.48;
    case "m":  return v * 3.28084;
  }
};

const ft3ToYd3 = (v: number) => v / 27;
const ft3ToM3 = (v: number) => v * 0.0283168;
const ft3ToLiters = (v: number) => v * 28.3168;

const fmt = (n: number, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "—";

/* ===================== UI tokens ===================== */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

const unitAbbrev: Record<LinearUnit, string> = { in: "in", ft: "ft", cm: "cm", m: "m" };

/* ===================== Small UI primitives ===================== */
const Field = ({
  id, label, hint, subHint, children,
}: {
  id?: string; label: string; hint?: string; subHint?: string; children: React.ReactNode;
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
  id?: string; value: string; onChange: (v: string) => void; placeholder?: string;
  badge?: string; ariaLabel?: string; numeric?: boolean;
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
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-200 text-xs">
        {badge}
      </span>
    ) : null}
  </div>
);

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
      <span className="text-white/70">{k}</span>
      <span className="text-teal-400 font-semibold">{v}</span>
    </div>
  );
}

/* ===================== Results type ===================== */
type Results = {
  holeVolPerHole_ft3: number;
  postDisplacement_ft3: number;
  netConcretePerHole_ft3: number;
  totalConcrete_ft3: number;
  adjustedConcrete_ft3: number;
  gravelPerHole_ft3: number;
  totalGravel_ft3: number;
  bags: Record<string, number>;
  concreteCost: number;
  gravelCost: number;
  laborCost: number;
  deliveryCost: number;
  totalCost: number;
  concreteFillDepth_ft: number;
  recHoleDia: number | null;   // in user units; null if not recommendation mode
  recEmbedDepth: number | null;
};

/* ===================== Component ===================== */
export default function PostHoleConcreteCalc() {
  /* --- Mode --- */
  const [mode, setMode] = useState<CalcMode>("quick");

  /* --- Units --- */
  const [unit, setUnit] = useState<LinearUnit>("in");

  /* --- Hole inputs --- */
  const [numHoles, setNumHoles] = useState("4");
  const [holeShape, setHoleShape] = useState<HoleShape>("round");
  const [holeDia, setHoleDia] = useState("10");
  const [holeWidth, setHoleWidth] = useState("10");
  const [holeLength, setHoleLength] = useState("10");
  const [holeDepth, setHoleDepth] = useState("36");

  /* --- Gravel --- */
  const [includeGravel, setIncludeGravel] = useState(true);
  const [gravelDepth, setGravelDepth] = useState("4");

  /* --- Waste --- */
  const [wastePct, setWastePct] = useState("10");

  /* --- Post inputs (advanced + recommendation) --- */
  const [postType, setPostType] = useState<PostTypePreset>("fence-line");
  const [postShape, setPostShape] = useState<PostShape>("square");
  const [postDia, setPostDia] = useState("");
  const [postWidth, setPostWidth] = useState("3.5");
  const [postLength, setPostLength] = useState("3.5");
  const [embeddedPostDepth, setEmbeddedPostDepth] = useState("30");
  const [subtractPost, setSubtractPost] = useState(true);

  /* --- Recommendation inputs --- */
  const [aboveGroundHeight, setAboveGroundHeight] = useState("72");
  const [totalPostLen, setTotalPostLen] = useState("");
  const [frostDepth, setFrostDepth] = useState("");

  /* --- Material --- */
  const [bagSize, setBagSize] = useState<BagSize>("80");
  const [customYield, setCustomYield] = useState("0.6");

  /* --- Cost (advanced) --- */
  const [pricePerBag, setPricePerBag] = useState("");
  const [gravelUnitCost, setGravelUnitCost] = useState("");
  const [laborCostInput, setLaborCostInput] = useState("");
  const [deliveryCostInput, setDeliveryCostInput] = useState("");

  /* --- UI state --- */
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  const getYield = (): number => {
    if (bagSize === "custom") return parseFloat(customYield) || 0;
    return BAG_YIELDS[bagSize] || 0.6;
  };

  /* ===================== canCalculate ===================== */
  const canCalculate = useMemo(() => {
    const n = parseInt(numHoles);
    const d = parseFloat(holeDepth);
    if (!(n > 0 && d > 0)) return false;
    if (holeShape === "round") {
      const dia = parseFloat(holeDia);
      if (!(dia > 0)) return false;
    } else {
      const w = parseFloat(holeWidth);
      const l = parseFloat(holeLength);
      if (!(w > 0 && l > 0)) return false;
    }
    if (getYield() <= 0) return false;
    return true;
  }, [numHoles, holeDepth, holeShape, holeDia, holeWidth, holeLength, bagSize, customYield]);

  /* ===================== Calculate ===================== */
  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;

    const n = parseInt(numHoles);
    const waste = Math.max(0, parseFloat(wastePct || "0"));

    // Convert all dims to feet
    const hDepth_ft = toFeet(parseFloat(holeDepth), unit);
    const gDepth_ft = includeGravel ? toFeet(Math.max(0, parseFloat(gravelDepth || "0")), unit) : 0;

    // Concrete fill depth
    const concreteFillDepth = Math.max(0, hDepth_ft - gDepth_ft);

    // Hole volume per hole
    let holeVol_ft3 = 0;
    if (holeShape === "round") {
      const r = toFeet(parseFloat(holeDia), unit) / 2;
      holeVol_ft3 = Math.PI * r * r * concreteFillDepth;
    } else {
      const w = toFeet(parseFloat(holeWidth), unit);
      const l = toFeet(parseFloat(holeLength), unit);
      holeVol_ft3 = w * l * concreteFillDepth;
    }

    // Post displacement
    let postDisp_ft3 = 0;
    if ((mode === "advanced" || mode === "recommendation") && subtractPost) {
      const embedDepth = Math.min(
        toFeet(Math.max(0, parseFloat(embeddedPostDepth || "0")), unit),
        concreteFillDepth
      );
      if (postShape === "round") {
        const pr = toFeet(Math.max(0, parseFloat(postDia || "0")), unit) / 2;
        postDisp_ft3 = Math.PI * pr * pr * embedDepth;
      } else {
        const pw = toFeet(Math.max(0, parseFloat(postWidth || "0")), unit);
        const pl = toFeet(Math.max(0, parseFloat(postLength || "0")), unit);
        postDisp_ft3 = pw * pl * embedDepth;
      }
    }

    // Net concrete per hole
    const netPerHole = Math.max(0, holeVol_ft3 - postDisp_ft3);

    // Total + waste
    const totalConcrete = netPerHole * n;
    const adjustedConcrete = totalConcrete * (1 + waste / 100);

    // Bags for all sizes
    const yieldPerBag = getYield();
    const bags: Record<string, number> = {};
    [["40", 0.30], ["50", 0.375], ["60", 0.45], ["80", 0.60]].forEach(([sz, y]) => {
      bags[sz as string] = Math.ceil(adjustedConcrete / (y as number));
    });
    if (bagSize === "custom" && yieldPerBag > 0) {
      bags["custom"] = Math.ceil(adjustedConcrete / yieldPerBag);
    }

    // Gravel
    let gravelPerHole_ft3 = 0;
    if (includeGravel && gDepth_ft > 0) {
      if (holeShape === "round") {
        const r = toFeet(parseFloat(holeDia), unit) / 2;
        gravelPerHole_ft3 = Math.PI * r * r * gDepth_ft;
      } else {
        const w = toFeet(parseFloat(holeWidth), unit);
        const l = toFeet(parseFloat(holeLength), unit);
        gravelPerHole_ft3 = w * l * gDepth_ft;
      }
    }
    const totalGravel = gravelPerHole_ft3 * n;

    // Cost
    const ppb = parseFloat(pricePerBag || "0");
    const selectedBags = bagSize === "custom" ? bags["custom"] || 0 : bags[bagSize] || 0;
    const concreteCost = selectedBags * ppb;
    const gCost = totalGravel * (parseFloat(gravelUnitCost || "0"));
    const lCost = parseFloat(laborCostInput || "0");
    const dCost = parseFloat(deliveryCostInput || "0");
    const totalCost = concreteCost + gCost + lCost + dCost;

    // Recommendation mode extras
    let recHoleDia: number | null = null;
    let recEmbedDepth: number | null = null;
    if (mode === "recommendation") {
      const pw = parseFloat(postShape === "round" ? postDia : postWidth) || 0;
      const preset = POST_PRESETS[postType];
      recHoleDia = pw * preset.holeDiaMultiplier;
      // one-third rule
      const aGH = parseFloat(aboveGroundHeight) || 0;
      const tpl = parseFloat(totalPostLen) || 0;
      const effectiveTotal = tpl > 0 ? tpl : aGH * 1.5; // estimate
      const oneThirdDepth = effectiveTotal / 3;
      const fDepth = parseFloat(frostDepth) || 0;
      recEmbedDepth = Math.max(oneThirdDepth, fDepth);
      if (preset.deeperEmbed) recEmbedDepth *= 1.15;
    }

    setResults({
      holeVolPerHole_ft3: holeVol_ft3,
      postDisplacement_ft3: postDisp_ft3,
      netConcretePerHole_ft3: netPerHole,
      totalConcrete_ft3: totalConcrete,
      adjustedConcrete_ft3: adjustedConcrete,
      gravelPerHole_ft3,
      totalGravel_ft3: totalGravel,
      bags,
      concreteCost,
      gravelCost: gCost,
      laborCost: lCost,
      deliveryCost: dCost,
      totalCost,
      concreteFillDepth_ft: concreteFillDepth,
      recHoleDia,
      recEmbedDepth,
    });
    setSubmitted(true);
  };

  const reset = () => {
    setNumHoles("4"); setHoleDia("10"); setHoleWidth("10"); setHoleLength("10");
    setHoleDepth("36"); setGravelDepth("4"); setWastePct("10");
    setPostWidth("3.5"); setPostLength("3.5"); setPostDia(""); setEmbeddedPostDepth("30");
    setAboveGroundHeight("72"); setTotalPostLen(""); setFrostDepth("");
    setBagSize("80"); setCustomYield("0.6");
    setPricePerBag(""); setGravelUnitCost(""); setLaborCostInput(""); setDeliveryCostInput("");
    setResults(null); setSubmitted(false);
  };

  /* ===================== Quick preset buttons ===================== */
  const applyPreset = (type: PostTypePreset) => {
    const p = POST_PRESETS[type];
    setPostType(type);
    setPostShape(p.shape);
    if (p.shape === "round") {
      setPostDia(p.width);
    } else {
      setPostWidth(p.width);
      setPostLength(p.length);
    }
    setWastePct(p.wasteDefault);
    setSubmitted(false);
  };

  /* ===================== Print / Save ===================== */
  const LOGO_URL = "/logo.svg";

  const buildPrintHtml = () => {
    if (!results) return "";
    const now = new Date().toLocaleString();
    const selectedBags = bagSize === "custom" ? results.bags["custom"] || 0 : results.bags[bagSize] || 0;

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Post Hole Concrete Calculator – Print View</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #0f172a; font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif; }
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
    .kv { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin-bottom: 4px; }
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
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Concrete Calculator Max Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta">
        <div>Post Hole Concrete Calculator</div>
        <div>Printed: ${now}</div>
      </div>
    </div>

    <h2>Inputs Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Mode</div><div class="v">${mode}</div></div>
      <div class="kv"><div class="k">Units</div><div class="v">${unitAbbrev[unit]}</div></div>
      <div class="kv"><div class="k">Holes</div><div class="v">${numHoles}</div></div>
      <div class="kv"><div class="k">Hole Shape</div><div class="v">${holeShape}</div></div>
      <div class="kv"><div class="k">Hole Depth</div><div class="v">${holeDepth} ${unitAbbrev[unit]}</div></div>
      <div class="kv"><div class="k">Waste</div><div class="v">${wastePct}%</div></div>
    </div>

    <h2>Results</h2>
    <div class="grid">
      <div class="card"><div class="label">Concrete Per Hole</div><div class="value-md">${fmt(results.netConcretePerHole_ft3)} ft³</div></div>
      <div class="card"><div class="label">Total Concrete</div><div class="value-md">${fmt(results.adjustedConcrete_ft3)} ft³</div></div>
      <div class="card"><div class="label">Bags (${bagSize} lb)</div><div class="value-md">${selectedBags}</div></div>
    </div>

    <h2>Bag Comparison</h2>
    <div class="grid">
      <div class="kv"><div class="k">40 lb bags</div><div class="v">${results.bags["40"]}</div></div>
      <div class="kv"><div class="k">60 lb bags</div><div class="v">${results.bags["60"]}</div></div>
      <div class="kv"><div class="k">80 lb bags</div><div class="v">${results.bags["80"]}</div></div>
    </div>

    ${includeGravel ? `
    <h2>Gravel</h2>
    <div class="grid">
      <div class="kv"><div class="k">Per Hole</div><div class="v">${fmt(results.gravelPerHole_ft3)} ft³</div></div>
      <div class="kv"><div class="k">Total</div><div class="v">${fmt(results.totalGravel_ft3)} ft³</div></div>
    </div>` : ""}

    <div class="footer">
      Tip: In the browser's Print dialog, choose "Save as PDF" to export this page as a PDF.
    </div>
  </div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 100));</script>
</body>
</html>`;
  };

  const handlePrint = () => {
    if (!submitted || !results) return;
    const html = buildPrintHtml();
    const w = window.open("", "_blank");
    if (!w) { alert("Please allow pop-ups for this site to use Print/Save."); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  const isAdvOrRec = mode === "advanced" || mode === "recommendation";
  const selectedBags = results ? (bagSize === "custom" ? results.bags["custom"] || 0 : results.bags[bagSize] || 0) : 0;

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Post Hole Concrete Estimator Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate concrete, gravel, and bag counts for post holes. Results appear after you press
          <span className="font-semibold"> Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            Keep all inputs in the <span className="text-white font-medium">same unit</span>. The calculator handles cylindrical (
            <code className="mx-1 text-slate-200">π r² h</code>) and rectangular volume formulas internally.
          </p>
        </div>

        {/* MODE TOGGLE */}
        <section className={stepClass}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-white/80">Calculator Mode</h3>
            <div className="flex gap-2">
              {(["quick", "advanced", "recommendation"] as CalcMode[]).map((m) => (
                <Button
                  key={m}
                  type="button"
                  onClick={() => { setMode(m); setSubmitted(false); }}
                  className={cn(
                    "h-9 rounded-sm text-sm capitalize",
                    mode === m
                      ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  )}
                >
                  {m === "quick" ? "Quick Estimate" : m === "advanced" ? "Advanced" : "Recommendation"}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* STEP 1 — Units */}
        <section className={stepClass} aria-labelledby="step1">
          <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Units</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <Field label="Input Unit">
              <Select value={unit} onValueChange={(v) => { setUnit(v as LinearUnit); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Units">
                  <SelectValue placeholder="Units" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {(["in", "ft", "cm", "m"] as LinearUnit[]).map((u) => (
                    <SelectItem key={u} value={u} className="text-white data-[highlighted]:bg-slate-800 data-[state=checked]:bg-slate-800">
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <p className="text-xs text-white/60 self-end">
              All dimensions below will be interpreted in <span className="text-white">{unitAbbrev[unit]}</span>.
            </p>
          </div>
        </section>

        {/* STEP 2 — Project Details */}
        <section className={stepClass} aria-labelledby="step2">
          <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Project Details</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field id="numHoles" label="Number of Post Holes" hint="Must be at least 1">
              <NumberInput
                id="numHoles"
                value={numHoles}
                onChange={(v) => { setNumHoles(v.replace(/[^0-9]/g, "")); setSubmitted(false); }}
                placeholder="4"
                numeric
                ariaLabel="Number of post holes"
              />
            </Field>
            <Field label="Hole Shape">
              <Select value={holeShape} onValueChange={(v) => { setHoleShape(v as HoleShape); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Hole shape">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="round" className="text-white data-[highlighted]:bg-slate-800">Round</SelectItem>
                  <SelectItem value="square" className="text-white data-[highlighted]:bg-slate-800">Square / Rectangular</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Waste / Overage (%)" hint="Typical 5–15%" subHint="Accounts for spillage and uneven holes">
              <NumberInput
                value={wastePct}
                onChange={(v) => { setWastePct(v); setSubmitted(false); }}
                placeholder="10"
                badge="%"
                ariaLabel="Waste percentage"
              />
            </Field>
          </div>
        </section>

        {/* STEP 3 — Hole Dimensions */}
        <section className={stepClass} aria-labelledby="step3">
          <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Hole Dimensions</h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {holeShape === "round" ? (
              <Field id="holeDia" label="Hole Diameter" subHint={`Common: 8–12 ${unitAbbrev[unit]}`}>
                <NumberInput
                  id="holeDia"
                  value={holeDia}
                  onChange={(v) => { setHoleDia(v); setSubmitted(false); }}
                  placeholder="10"
                  badge={unitAbbrev[unit]}
                  ariaLabel="Hole diameter"
                />
              </Field>
            ) : (
              <>
                <Field id="holeW" label="Hole Width" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="holeW"
                    value={holeWidth}
                    onChange={(v) => { setHoleWidth(v); setSubmitted(false); }}
                    placeholder="10"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Hole width"
                  />
                </Field>
                <Field id="holeL" label="Hole Length" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput
                    id="holeL"
                    value={holeLength}
                    onChange={(v) => { setHoleLength(v); setSubmitted(false); }}
                    placeholder="10"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Hole length"
                  />
                </Field>
              </>
            )}
            <Field id="holeDepth" label="Hole Depth" subHint={`Common: 24–48 ${unitAbbrev[unit]}`}>
              <NumberInput
                id="holeDepth"
                value={holeDepth}
                onChange={(v) => { setHoleDepth(v); setSubmitted(false); }}
                placeholder="36"
                badge={unitAbbrev[unit]}
                ariaLabel="Hole depth"
              />
            </Field>
          </div>
        </section>

        {/* STEP 4 — Gravel Base */}
        <section className={stepClass} aria-labelledby="step4">
          <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Gravel Base</h3>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-sm border border-slate-700 bg-slate-900 p-4">
            <div>
              <h4 className="text-white font-semibold">Include Gravel Base</h4>
              <p className="text-xs md:text-sm text-slate-300">
                A gravel base improves drainage below the post. Default: 4–6 inches.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={includeGravel}
                onCheckedChange={(v) => { setIncludeGravel(v); setSubmitted(false); }}
              />
              <span className="text-sm text-white">{includeGravel ? "Yes" : "No"}</span>
            </div>
          </div>
          {includeGravel && (
            <div className="mt-3 max-w-xs">
              <Field id="gravelDepth" label="Gravel Depth" hint={`Recommended: 4–6 ${unitAbbrev[unit]}`}>
                <NumberInput
                  id="gravelDepth"
                  value={gravelDepth}
                  onChange={(v) => { setGravelDepth(v); setSubmitted(false); }}
                  placeholder="4"
                  badge={unitAbbrev[unit]}
                  ariaLabel="Gravel depth"
                />
              </Field>
            </div>
          )}
        </section>

        {/* STEP 5 — Post Details (Advanced / Recommendation) */}
        {isAdvOrRec && (
          <section className={stepClass} aria-labelledby="step5">
            <h3 id="step5" className="text-sm font-semibold text-white/80">Step 5 — Post Details</h3>

            {/* Quick preset buttons */}
            <div className="mt-2 mb-4">
              <p className="text-xs text-white/60 mb-2">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {(["fence-line", "fence-corner", "gate", "mailbox", "deck", "pole"] as PostTypePreset[]).map((pt) => (
                  <Button
                    key={pt}
                    type="button"
                    onClick={() => applyPreset(pt)}
                    className={cn(
                      "h-8 rounded-sm text-xs",
                      postType === pt
                        ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                        : "bg-slate-700 text-white hover:bg-slate-600"
                    )}
                  >
                    {POST_TYPE_LABELS[pt]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="Post Shape">
                <Select value={postShape} onValueChange={(v) => { setPostShape(v as PostShape); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Post shape">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="round" className="text-white data-[highlighted]:bg-slate-800">Round</SelectItem>
                    <SelectItem value="square" className="text-white data-[highlighted]:bg-slate-800">Square / Rectangular</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {postShape === "round" ? (
                <Field label="Post Diameter" subHint={`in ${unitAbbrev[unit]}`}>
                  <NumberInput
                    value={postDia}
                    onChange={(v) => { setPostDia(v); setSubmitted(false); }}
                    placeholder="4"
                    badge={unitAbbrev[unit]}
                    ariaLabel="Post diameter"
                  />
                </Field>
              ) : (
                <>
                  <Field label="Post Width" subHint={`e.g., 3.5 for a 4×4 post (${unitAbbrev[unit]})`}>
                    <NumberInput
                      value={postWidth}
                      onChange={(v) => { setPostWidth(v); setSubmitted(false); }}
                      placeholder="3.5"
                      badge={unitAbbrev[unit]}
                      ariaLabel="Post width"
                    />
                  </Field>
                  <Field label="Post Length" subHint={`in ${unitAbbrev[unit]}`}>
                    <NumberInput
                      value={postLength}
                      onChange={(v) => { setPostLength(v); setSubmitted(false); }}
                      placeholder="3.5"
                      badge={unitAbbrev[unit]}
                      ariaLabel="Post length"
                    />
                  </Field>
                </>
              )}

              <Field label="Embedded Post Depth" hint="Depth of post below grade inside concrete">
                <NumberInput
                  value={embeddedPostDepth}
                  onChange={(v) => { setEmbeddedPostDepth(v); setSubmitted(false); }}
                  placeholder="30"
                  badge={unitAbbrev[unit]}
                  ariaLabel="Embedded post depth"
                />
              </Field>
            </div>

            {/* Subtract post */}
            <div className="mt-3 flex items-center justify-between gap-3 rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div>
                <h4 className="text-white font-semibold">Subtract Post Displacement</h4>
                <p className="text-xs text-slate-300">Deducts the post volume from the concrete fill for a more accurate estimate.</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={subtractPost}
                  onCheckedChange={(v) => { setSubtractPost(v); setSubmitted(false); }}
                />
                <span className="text-sm text-white">{subtractPost ? "Yes" : "No"}</span>
              </div>
            </div>
          </section>
        )}

        {/* STEP 5b — Recommendation extras */}
        {mode === "recommendation" && (
          <section className={stepClass} aria-labelledby="step5b">
            <h3 id="step5b" className="text-sm font-semibold text-white/80">Recommendation Inputs</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="Above-Ground Post Height" hint="Height of post above ground level">
                <NumberInput
                  value={aboveGroundHeight}
                  onChange={(v) => { setAboveGroundHeight(v); setSubmitted(false); }}
                  placeholder="72"
                  badge={unitAbbrev[unit]}
                  ariaLabel="Above-ground post height"
                />
              </Field>
              <Field label="Total Post Length (optional)" hint="If known, overrides auto-estimate">
                <NumberInput
                  value={totalPostLen}
                  onChange={(v) => { setTotalPostLen(v); setSubmitted(false); }}
                  placeholder=""
                  badge={unitAbbrev[unit]}
                  ariaLabel="Total post length"
                />
              </Field>
              <Field label="Frost Depth (optional)" hint="Local frost line depth">
                <NumberInput
                  value={frostDepth}
                  onChange={(v) => { setFrostDepth(v); setSubmitted(false); }}
                  placeholder=""
                  badge={unitAbbrev[unit]}
                  ariaLabel="Frost depth"
                />
              </Field>
            </div>
          </section>
        )}

        {/* STEP 6 — Material / Bag Size */}
        <section className={stepClass} aria-labelledby="step6">
          <h3 id="step6" className="text-sm font-semibold text-white/80">
            {isAdvOrRec ? "Step 6" : "Step 5"} — Material / Bag Size
          </h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Bag Size" hint="Select product or choose custom yield">
              <Select value={bagSize} onValueChange={(v) => { setBagSize(v as BagSize); setSubmitted(false); }}>
                <SelectTrigger className={selectTriggerClass} aria-label="Bag size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="40" className="text-white data-[highlighted]:bg-slate-800">40 lb (0.30 ft³)</SelectItem>
                  <SelectItem value="50" className="text-white data-[highlighted]:bg-slate-800">50 lb (0.375 ft³)</SelectItem>
                  <SelectItem value="60" className="text-white data-[highlighted]:bg-slate-800">60 lb (0.45 ft³)</SelectItem>
                  <SelectItem value="80" className="text-white data-[highlighted]:bg-slate-800">80 lb (0.60 ft³)</SelectItem>
                  <SelectItem value="custom" className="text-white data-[highlighted]:bg-slate-800">Custom Yield</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {bagSize === "custom" && (
              <Field label="Custom Yield Per Bag" hint="Enter volume per bag in ft³">
                <NumberInput
                  value={customYield}
                  onChange={(v) => { setCustomYield(v); setSubmitted(false); }}
                  placeholder="0.6"
                  badge="ft³"
                  ariaLabel="Custom yield per bag"
                />
              </Field>
            )}
          </div>
        </section>

        {/* STEP 7 — Cost Inputs (Advanced only) */}
        {mode === "advanced" && (
          <section className={stepClass} aria-labelledby="step7">
            <h3 id="step7" className="text-sm font-semibold text-white/80">Step 7 — Cost Estimation (optional)</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Field label="Price Per Bag" hint="$ per bag">
                <NumberInput
                  value={pricePerBag}
                  onChange={(v) => { setPricePerBag(v); setSubmitted(false); }}
                  placeholder="6.50"
                  badge="$"
                  ariaLabel="Price per bag"
                />
              </Field>
              <Field label="Gravel Unit Cost" hint="$ per cubic foot">
                <NumberInput
                  value={gravelUnitCost}
                  onChange={(v) => { setGravelUnitCost(v); setSubmitted(false); }}
                  placeholder="1.50"
                  badge="$/ft³"
                  ariaLabel="Gravel unit cost"
                />
              </Field>
              <Field label="Labor Cost" hint="Total labor cost">
                <NumberInput
                  value={laborCostInput}
                  onChange={(v) => { setLaborCostInput(v); setSubmitted(false); }}
                  placeholder="0"
                  badge="$"
                  ariaLabel="Labor cost"
                />
              </Field>
              <Field label="Delivery / Misc. Cost" hint="Delivery fee or other costs">
                <NumberInput
                  value={deliveryCostInput}
                  onChange={(v) => { setDeliveryCostInput(v); setSubmitted(false); }}
                  placeholder="0"
                  badge="$"
                  ariaLabel="Delivery cost"
                />
              </Field>
            </div>
          </section>
        )}

        {/* ACTIONS */}
        <section className={stepClass}>
          <h3 className="text-sm font-semibold text-white/80">
            {mode === "advanced" ? "Step 8" : isAdvOrRec ? "Step 7" : "Step 6"} — Actions
          </h3>
          <form onSubmit={onCalculate} className="mt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              className="h-11 rounded-sm bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 focus-visible:ring-0"
              disabled={!canCalculate}
            >
              Calculate
            </Button>
            <Button
              type="button"
              onClick={reset}
              className="h-11 rounded-sm bg-slate-500 text-white hover:bg-slate-400"
            >
              Reset
            </Button>
          </form>
        </section>

        {/* ===================== RESULTS ===================== */}
        {!submitted ? (
          <p className="mt-4 text-sm text-white/70">
            Enter values above and press <span className="font-semibold">Calculate</span> to reveal results.
          </p>
        ) : !results ? (
          <p className="mt-4 text-sm text-red-300">
            Please enter valid positive numbers for all required fields.
          </p>
        ) : (
          <>
            {/* Print/Save */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <KV k="Mode" v={mode} />
                <KV k="Units" v={unitAbbrev[unit]} />
                <KV k="Holes" v={numHoles} />
                <KV k="Hole Shape" v={holeShape} />
                {holeShape === "round"
                  ? <KV k="Hole Diameter" v={`${holeDia} ${unitAbbrev[unit]}`} />
                  : <>
                      <KV k="Hole Width" v={`${holeWidth} ${unitAbbrev[unit]}`} />
                      <KV k="Hole Length" v={`${holeLength} ${unitAbbrev[unit]}`} />
                    </>
                }
                <KV k="Hole Depth" v={`${holeDepth} ${unitAbbrev[unit]}`} />
                <KV k="Waste" v={`${wastePct}%`} />
                {includeGravel && <KV k="Gravel Depth" v={`${gravelDepth} ${unitAbbrev[unit]}`} />}
                {isAdvOrRec && subtractPost && <KV k="Post Displacement" v="Subtracted" />}
              </div>
            </div>

            {/* Recommendation card */}
            {mode === "recommendation" && results.recHoleDia !== null && results.recEmbedDepth !== null && (
              <div className="mt-4 rounded-sm border border-teal-600 bg-teal-900/30 p-4">
                <div className="mb-2 text-sm font-semibold text-teal-400">Recommendations</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <KV k={`Recommended Hole Dia.`} v={`${fmt(results.recHoleDia)} ${unitAbbrev[unit]}`} />
                  <KV k={`Recommended Embed Depth`} v={`${fmt(results.recEmbedDepth)} ${unitAbbrev[unit]}`} />
                  <KV k="Suggested Gravel Depth" v={`4–6 ${unitAbbrev[unit]}`} />
                </div>
                {postType === "deck" && (
                  <p className="mt-2 text-xs text-teal-300">⚠ Deck posts may need to comply with local building codes — verify dimensions with your local inspector.</p>
                )}
                {(postType === "gate" || postType === "fence-corner") && (
                  <p className="mt-2 text-xs text-teal-300">⚠ Gate and corner posts carry more load — consider deeper and wider holes.</p>
                )}
              </div>
            )}

            {/* Primary results */}
            <section className={`${stepClass} grid grid-cols-1 lg:grid-cols-2 gap-4 border-none`}>
              {/* Per Hole */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <h5 className="text-white font-semibold">Per Hole</h5>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/70">Gross Hole Volume</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.holeVolPerHole_ft3, 4)} ft³</div>
                  {isAdvOrRec && subtractPost && (
                    <>
                      <div className="text-white/70">Post Displacement</div>
                      <div className="text-right text-teal-400 font-semibold">−{fmt(results.postDisplacement_ft3, 4)} ft³</div>
                    </>
                  )}
                  <div className="col-span-2 mt-1 border-t border-slate-700" />
                  <div className="text-white/70 font-medium">Net Concrete</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.netConcretePerHole_ft3, 4)} ft³</div>
                  {includeGravel && (
                    <>
                      <div className="text-white/70">Gravel</div>
                      <div className="text-right text-teal-400 font-semibold">{fmt(results.gravelPerHole_ft3, 4)} ft³</div>
                    </>
                  )}
                  <div className="text-white/70">Bags (approx.)</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.netConcretePerHole_ft3 / getYield(), 1)}</div>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-sm border border-slate-700 bg-slate-900 p-4">
                <h5 className="text-white font-semibold">
                  Total ({parseInt(numHoles) || 0} hole{parseInt(numHoles) === 1 ? "" : "s"})
                </h5>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/70">Net Concrete</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(results.totalConcrete_ft3, 4)} ft³</div>
                  <div className="text-white/70 font-medium">With {wastePct}% Waste</div>
                  <div className="text-right text-teal-400 font-bold">{fmt(results.adjustedConcrete_ft3, 4)} ft³</div>

                  <div className="col-span-2 mt-1 border-t border-slate-700" />
                  <div className="text-white/70">Cubic Yards</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(ft3ToYd3(results.adjustedConcrete_ft3), 3)} yd³</div>
                  <div className="text-white/70">Cubic Meters</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(ft3ToM3(results.adjustedConcrete_ft3), 4)} m³</div>
                  <div className="text-white/70">Liters</div>
                  <div className="text-right text-teal-400 font-semibold">{fmt(ft3ToLiters(results.adjustedConcrete_ft3), 1)} L</div>

                  {includeGravel && (
                    <>
                      <div className="col-span-2 mt-1 border-t border-slate-700" />
                      <div className="text-white/70">Total Gravel</div>
                      <div className="text-right text-teal-400 font-semibold">{fmt(results.totalGravel_ft3, 4)} ft³</div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Bag comparison */}
            <section className="rounded-sm border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 text-sm font-semibold text-white">Bag Count Comparison</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[["40", "40 lb"], ["60", "60 lb"], ["80", "80 lb"]].map(([sz, label]) => (
                  <div key={sz}>
                    <div className="text-xs uppercase text-white/70">{label} bags</div>
                    <div className={cn(
                      "mt-1 text-xl font-semibold",
                      sz === bagSize ? "text-teal-400" : "text-slate-300"
                    )}>
                      {results.bags[sz]} bags
                    </div>
                  </div>
                ))}
              </div>
              {bagSize === "custom" && results.bags["custom"] > 0 && (
                <div className="mt-3 border-t border-slate-700 pt-3">
                  <div className="text-xs uppercase text-white/70">Custom ({customYield} ft³/bag)</div>
                  <div className="mt-1 text-xl font-semibold text-teal-400">{results.bags["custom"]} bags</div>
                </div>
              )}
            </section>

            {/* Cost summary (advanced) */}
            {mode === "advanced" && results.totalCost > 0 && (
              <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
                <div className="mb-2 text-sm font-semibold text-white">Cost Estimate</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <KV k="Concrete (bags)" v={`$${fmt(results.concreteCost)}`} />
                  <KV k="Gravel" v={`$${fmt(results.gravelCost)}`} />
                  <KV k="Labor" v={`$${fmt(results.laborCost)}`} />
                  <KV k="Delivery / Misc." v={`$${fmt(results.deliveryCost)}`} />
                  <div className="sm:col-span-2">
                    <KV k="Total Estimated Cost" v={`$${fmt(results.totalCost)}`} />
                  </div>
                </div>
              </section>
            )}

            {/* Trust-building notes */}
            <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
              <h6 className="text-white font-semibold">Notes</h6>
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-300 space-y-1">
                <li>Results are rounded up to whole bags.</li>
                <li>Waste allowance is included when enabled.</li>
                <li>A gravel base improves drainage in many installations.</li>
                <li>Local frost depth and building code requirements may affect final hole depth.</li>
                <li>Gate posts, corner posts, and structural posts may need larger or deeper footings.</li>
              </ul>
            </section>
          </>
        )}

        {/* Formulas Used */}
        <section className="rounded-sm border border-slate-700 bg-slate-900 p-4 mt-4">
          <h6 className="text-white font-semibold">Formulas Used</h6>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-300">
            <li>Round hole (cylinder): <span className="text-white">V = π r² h</span></li>
            <li>Square hole (prism): <span className="text-white">V = W × L × h</span></li>
            <li>Net concrete: <span className="text-white">V<sub>net</sub> = V<sub>hole</sub> − V<sub>post</sub></span></li>
            <li>Bags: <span className="text-white">ceil(V<sub>adjusted</sub> / yield_per_bag)</span></li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
