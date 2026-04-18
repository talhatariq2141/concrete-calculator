// components/calculators/CinderBlockCalc.tsx
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
import { Info, Printer, Plus, Trash2 } from "lucide-react";
import { BLOCK_SIZES } from "@/lib/material-data";

/* ===================== Types ===================== */
type UnitSystem = "imperial" | "metric";



interface Opening {
  id: number;
  label: string;
  width: string;
  height: string;
  qty: string;
}

interface Results {
  grossWallArea_ft2: number;
  openingsArea_ft2: number;
  netWallArea_ft2: number;
  blockFaceArea_ft2: number;
  blocksPerSqFt: number;
  blocksRaw: number;
  wasteBlocks: number;
  finalBlocks: number;
  blockCostTotal: number;
  mortarBags: number;
  mortarCostTotal: number;
  materialTotal: number;
  laborCost: number;
  deliveryCost: number;
  taxAmount: number;
  installedTotal: number;
  costPerSqFt: number;
  // Add-ons
  groutCost: number;
  rebarCost: number;
  footingCost: number;
  capBlockCost: number;
  waterproofingCost: number;
  finishCost: number;
}

/* ===================== Block Size Presets ===================== */
// Standard sizes sourced from BLOCK_SIZES in material-data.ts (same values)
// BLOCK_SIZES is imported: { label, nomH_in, nomL_in, nomW_in }[]

/* ===================== Constants ===================== */
const MORTAR_BLOCKS_80LB = 13; // 1 bag 80 lb covers ~13 standard blocks
const MORTAR_BLOCKS_60LB = 9.75; // derived ratio

/* ===================== Helpers ===================== */
const toFt = (v: number, unit: UnitSystem): number =>
  unit === "imperial" ? v : v * 3.28084; // m -> ft

const fmt = (n: number, d = 2): string =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d }) : "—";

const fmtCurrency = (n: number): string =>
  Number.isFinite(n) ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—";

let nextId = 1;
const newOpening = (): Opening => ({
  id: nextId++,
  label: "Opening",
  width: "",
  height: "",
  qty: "1",
});

/* ===================== UI tokens ===================== */
const fieldInputClass =
  "h-11 w-full rounded-sm border border-slate-700 bg-slate-700 text-white caret-white placeholder-slate-300 pr-12 focus-visible:ring-0 focus:border-teal-400";
const selectTriggerClass =
  "h-11 rounded-sm border border-slate-700 bg-slate-700 text-white data-[placeholder]:text-slate-300 focus-visible:ring-0 focus:border-teal-400";
const selectContentClass = "rounded-sm border border-slate-700 bg-slate-900 text-white";
const stepClass = "pt-6 mt-4 border-t border-slate-800";

/* ===================== UI Primitives ===================== */
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
  id, value, onChange, placeholder, badge, ariaLabel,
}: {
  id?: string; value: string; onChange: (v: string) => void; placeholder?: string;
  badge?: string; ariaLabel?: string;
}) => (
  <div className="relative">
    <Input
      id={id}
      inputMode="decimal"
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

function KV({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-slate-700 bg-slate-900 p-2">
      <span className="text-white/70">{k}</span>
      <span className={cn("font-semibold", highlight ? "text-yellow-400" : "text-teal-400")}>{v}</span>
    </div>
  );
}

/* ===================== Main Component ===================== */
export default function CinderBlockCalc() {
  /* --- Unit System --- */
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const unitLabel = unit === "imperial" ? "ft" : "m";

  /* --- Wall Inputs --- */
  const [wallLength, setWallLength] = useState("20");
  const [wallHeight, setWallHeight] = useState("8");

  /* --- Block Size --- */
  const [blockSizeIdx, setBlockSizeIdx] = useState("2"); // 8x8x16 default
  const [customBlockH, setCustomBlockH] = useState("8");
  const [customBlockL, setCustomBlockL] = useState("16");

  /* --- Mortar --- */
  const [mortarJoint, setMortarJoint] = useState("0.375"); // 3/8 in
  const [mortarBagSize, setMortarBagSize] = useState<"80" | "60" | "custom">("80");
  const [customBlocksPerBag, setCustomBlocksPerBag] = useState("13");

  /* --- Wastage --- */
  const [wastePct, setWastePct] = useState("5");

  /* --- Openings --- */
  const [openings, setOpenings] = useState<Opening[]>([]);

  /* --- Cost Inputs --- */
  const [costPerBlock, setCostPerBlock] = useState("");
  const [pricePerMortarBag, setPricePerMortarBag] = useState("");
  const [laborCostPerSqFt, setLaborCostPerSqFt] = useState("");
  const [deliveryCostInput, setDeliveryCostInput] = useState("");
  const [taxPct, setTaxPct] = useState("");

  /* --- Add-on toggles --- */
  const [showAddOns, setShowAddOns] = useState(false);
  const [includeGrout, setIncludeGrout] = useState(false);
  const [groutCostInput, setGroutCostInput] = useState("");
  const [includeRebar, setIncludeRebar] = useState(false);
  const [rebarCostInput, setRebarCostInput] = useState("");
  const [includeFooting, setIncludeFooting] = useState(false);
  const [footingCostInput, setFootingCostInput] = useState("");
  const [includeCapBlock, setIncludeCapBlock] = useState(false);
  const [capBlockCostInput, setCapBlockCostInput] = useState("");
  const [includeWaterproofing, setIncludeWaterproofing] = useState(false);
  const [waterproofingCostInput, setWaterproofingCostInput] = useState("");
  const [includeFinish, setIncludeFinish] = useState(false);
  const [finishCostInput, setFinishCostInput] = useState("");

  /* --- Results --- */
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  /* ---- Derived block size ---- */
  const idx = parseInt(blockSizeIdx);
  const selectedBlockSize = BLOCK_SIZES[idx];
  const isCustomBlock = selectedBlockSize?.nomH_in === 0;

  const nomH_in = isCustomBlock ? parseFloat(customBlockH) || 0 : selectedBlockSize.nomH_in;
  const nomL_in = isCustomBlock ? parseFloat(customBlockL) || 0 : selectedBlockSize.nomL_in;

  const canCalculate = useMemo(() => {
    const wl = parseFloat(wallLength);
    const wh = parseFloat(wallHeight);
    if (!(wl > 0 && wh > 0)) return false;
    if (nomH_in <= 0 || nomL_in <= 0) return false;
    return true;
  }, [wallLength, wallHeight, nomH_in, nomL_in]);

  /* ===================== Calculate ===================== */
  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;
    setValidationError("");

    const wl = toFt(parseFloat(wallLength), unit);
    const wh = toFt(parseFloat(wallHeight), unit);
    const waste = Math.max(0, parseFloat(wastePct || "0"));

    const grossArea = wl * wh;

    // Openings
    let openingsArea = 0;
    for (const op of openings) {
      const ow = toFt(parseFloat(op.width || "0"), unit);
      const oh = toFt(parseFloat(op.height || "0"), unit);
      const oq = Math.max(0, parseInt(op.qty || "1"));
      openingsArea += ow * oh * oq;
    }

    if (openingsArea >= grossArea && openingsArea > 0) {
      setValidationError("Openings area cannot be greater than or equal to wall area.");
      return;
    }

    const netArea = grossArea - openingsArea;

    // Block face area in sq ft (nominal dimensions in inches)
    const blockFaceArea_ft2 = (nomL_in / 12) * (nomH_in / 12);
    const blocksPerSqFt = blockFaceArea_ft2 > 0 ? 1 / blockFaceArea_ft2 : 0;

    const blocksRaw = netArea * blocksPerSqFt;
    const wasteBlocks = blocksRaw * (waste / 100);
    const finalBlocks = Math.ceil(blocksRaw + wasteBlocks);

    // Block cost
    const cpb = parseFloat(costPerBlock || "0");
    const blockCostTotal = finalBlocks * cpb;

    // Mortar bags
    let mortarBags = 0;
    if (mortarBagSize === "80") {
      mortarBags = Math.ceil(finalBlocks / MORTAR_BLOCKS_80LB);
    } else if (mortarBagSize === "60") {
      mortarBags = Math.ceil(finalBlocks / MORTAR_BLOCKS_60LB);
    } else {
      const cpbCustom = parseFloat(customBlocksPerBag || "13");
      mortarBags = cpbCustom > 0 ? Math.ceil(finalBlocks / cpbCustom) : 0;
    }

    const ppb = parseFloat(pricePerMortarBag || "0");
    const mortarCostTotal = mortarBags * ppb;

    // Labor
    const laborCostPerSqFtVal = parseFloat(laborCostPerSqFt || "0");
    const laborCost = netArea * laborCostPerSqFtVal;

    // Delivery
    const deliveryCost = parseFloat(deliveryCostInput || "0");

    // Add-ons
    const groutCost = includeGrout ? parseFloat(groutCostInput || "0") : 0;
    const rebarCost = includeRebar ? parseFloat(rebarCostInput || "0") : 0;
    const footingCost = includeFooting ? parseFloat(footingCostInput || "0") : 0;
    const capBlockCost = includeCapBlock ? parseFloat(capBlockCostInput || "0") : 0;
    const waterproofingCost = includeWaterproofing ? parseFloat(waterproofingCostInput || "0") : 0;
    const finishCost = includeFinish ? parseFloat(finishCostInput || "0") : 0;

    const addOnTotal = groutCost + rebarCost + footingCost + capBlockCost + waterproofingCost + finishCost;

    // Material total
    const materialTotal = blockCostTotal + mortarCostTotal + addOnTotal;

    // Tax (on materials)
    const taxPctVal = parseFloat(taxPct || "0");
    const taxAmount = materialTotal * (taxPctVal / 100);

    // Installed total
    const installedTotal = materialTotal + laborCost + deliveryCost + taxAmount;

    // Cost per sq ft
    const costPerSqFt = netArea > 0 ? installedTotal / netArea : 0;

    setResults({
      grossWallArea_ft2: grossArea,
      openingsArea_ft2: openingsArea,
      netWallArea_ft2: netArea,
      blockFaceArea_ft2,
      blocksPerSqFt,
      blocksRaw,
      wasteBlocks,
      finalBlocks,
      blockCostTotal,
      mortarBags,
      mortarCostTotal,
      materialTotal,
      laborCost,
      deliveryCost,
      taxAmount,
      installedTotal,
      costPerSqFt,
      groutCost,
      rebarCost,
      footingCost,
      capBlockCost,
      waterproofingCost,
      finishCost,
    });
    setSubmitted(true);
  };

  const reset = () => {
    setWallLength("20"); setWallHeight("8");
    setBlockSizeIdx("2"); setCustomBlockH("8"); setCustomBlockL("16");
    setMortarJoint("0.375"); setMortarBagSize("80"); setCustomBlocksPerBag("13");
    setWastePct("5"); setOpenings([]);
    setCostPerBlock(""); setPricePerMortarBag(""); setLaborCostPerSqFt("");
    setDeliveryCostInput(""); setTaxPct("");
    setGroutCostInput(""); setRebarCostInput(""); setFootingCostInput("");
    setCapBlockCostInput(""); setWaterproofingCostInput(""); setFinishCostInput("");
    setIncludeGrout(false); setIncludeRebar(false); setIncludeFooting(false);
    setIncludeCapBlock(false); setIncludeWaterproofing(false); setIncludeFinish(false);
    setResults(null); setSubmitted(false); setValidationError("");
  };

  /* ===================== Print ===================== */
  const LOGO_URL = "/logo.svg";

  const handlePrint = () => {
    if (!submitted || !results) return;
    const now = new Date().toLocaleString();
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Cinder Block Calculator – Print View</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #fff; color: #0f172a; font: 14px/1.5 system-ui, sans-serif; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .header { display: flex; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand img { height: 36px; }
    .brand-name { font-weight: 800; font-size: 18px; color: #0f766e; }
    .meta { margin-left: auto; text-align: right; color: #475569; font-size: 12px; }
    h2 { font-size: 16px; margin: 18px 0 8px; }
    .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .kv { display: flex; justify-content: space-between; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin-bottom: 4px; }
    .kv .k { color: #475569; }
    .kv .v { color: #0f766e; font-weight: 700; }
    .label { text-transform: uppercase; font-size: 11px; color: #64748b; }
    .value-lg { font-size: 22px; font-weight: 800; color: #0f766e; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="Logo" onerror="this.style.display='none'"/>
        <div class="brand-name">Concrete Calculator Max</div>
      </div>
      <div class="meta"><div>Cinder Block Calculator</div><div>Printed: ${now}</div></div>
    </div>

    <h2>Wall Dimensions</h2>
    <div class="grid-2">
      <div class="kv"><div class="k">Gross Wall Area</div><div class="v">${fmt(results.grossWallArea_ft2)} ft²</div></div>
      <div class="kv"><div class="k">Openings Area</div><div class="v">${fmt(results.openingsArea_ft2)} ft²</div></div>
      <div class="kv"><div class="k">Net Wall Area</div><div class="v">${fmt(results.netWallArea_ft2)} ft²</div></div>
      <div class="kv"><div class="k">Blocks / sq ft</div><div class="v">${fmt(results.blocksPerSqFt, 3)}</div></div>
    </div>

    <h2>Block Quantity</h2>
    <div class="grid">
      <div class="kv"><div class="k">Blocks Before Waste</div><div class="v">${fmt(results.blocksRaw, 0)}</div></div>
      <div class="kv"><div class="k">Waste Blocks</div><div class="v">${fmt(results.wasteBlocks, 0)}</div></div>
      <div class="kv"><div class="k">Total Blocks Needed</div><div class="v">${results.finalBlocks}</div></div>
    </div>

    <h2>Cost Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Block Material Cost</div><div class="v">${fmtCurrency(results.blockCostTotal)}</div></div>
      <div class="kv"><div class="k">Mortar Bags</div><div class="v">${results.mortarBags}</div></div>
      <div class="kv"><div class="k">Mortar Cost</div><div class="v">${fmtCurrency(results.mortarCostTotal)}</div></div>
      <div class="kv"><div class="k">Labor Cost</div><div class="v">${fmtCurrency(results.laborCost)}</div></div>
      <div class="kv"><div class="k">Delivery Cost</div><div class="v">${fmtCurrency(results.deliveryCost)}</div></div>
      <div class="kv"><div class="k">Tax</div><div class="v">${fmtCurrency(results.taxAmount)}</div></div>
    </div>
    <div style="margin-top:12px; padding:12px; border:2px solid #0f766e; border-radius:8px;">
      <div class="label">Estimated Total Installed Cost</div>
      <div class="value-lg">${fmtCurrency(results.installedTotal)}</div>
    </div>

    <div class="footer">Estimates are for planning purposes only. Actual costs may vary. Print as PDF using your browser print dialog.</div>
  </div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 100));</script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (!w) { alert("Allow pop-ups to use Print/Save."); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  /* ===================== Opening helpers ===================== */
  const addOpening = () => setOpenings((prev) => [...prev, newOpening()]);
  const removeOpening = (id: number) => setOpenings((prev) => prev.filter((o) => o.id !== id));
  const updateOpening = (id: number, field: keyof Opening, value: string) =>
    setOpenings((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: value } : o)));

  /* ===================== Quick Waste Presets ===================== */
  const WASTE_PRESETS = [
    { label: "5% (Simple)", value: "5" },
    { label: "7% (Moderate)", value: "7" },
    { label: "10% (Complex)", value: "10" },
  ];

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          Cinder Block Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate cinder block quantity, mortar, cost, and installed wall cost. Fill in the details below and press{" "}
          <span className="font-semibold">Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            This calculator uses <span className="text-white font-medium">nominal block dimensions</span> (including mortar joints) for coverage. Default mortar joint: 3/8 in. Default waste: 5%.
          </p>
        </div>

        <form onSubmit={onCalculate}>
          {/* STEP 1 — Unit System */}
          <section className={stepClass} aria-labelledby="step1">
            <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Unit System</h3>
            <div className="mt-2 flex gap-2">
              {(["imperial", "metric"] as UnitSystem[]).map((u) => (
                <Button
                  key={u}
                  type="button"
                  onClick={() => { setUnit(u); setSubmitted(false); }}
                  className={cn(
                    "h-9 rounded-sm text-sm capitalize",
                    unit === u
                      ? "bg-teal-400 text-slate-900 hover:bg-teal-300"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  )}
                >
                  {u === "imperial" ? "Imperial (ft)" : "Metric (m)"}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-white/60">All length inputs will be in <span className="text-white">{unitLabel}</span>.</p>
          </section>

          {/* STEP 2 — Wall Dimensions */}
          <section className={stepClass} aria-labelledby="step2">
            <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Wall Dimensions</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
              <Field id="wallLength" label="Wall Length" hint={`Gross length in ${unitLabel}`}>
                <NumberInput
                  id="wallLength"
                  value={wallLength}
                  onChange={(v) => { setWallLength(v); setSubmitted(false); }}
                  placeholder="20"
                  badge={unitLabel}
                  ariaLabel="Wall length"
                />
              </Field>
              <Field id="wallHeight" label="Wall Height" hint={`Gross height in ${unitLabel}`}>
                <NumberInput
                  id="wallHeight"
                  value={wallHeight}
                  onChange={(v) => { setWallHeight(v); setSubmitted(false); }}
                  placeholder="8"
                  badge={unitLabel}
                  ariaLabel="Wall height"
                />
              </Field>
            </div>
          </section>

          {/* STEP 3 — Block Size */}
          <section className={stepClass} aria-labelledby="step3">
            <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Block Size</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
              <Field label="Nominal Block Size" subHint="Nominal dimensions include mortar joint coverage.">
                <Select value={blockSizeIdx} onValueChange={(v) => { setBlockSizeIdx(v); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Block size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {BLOCK_SIZES.map((bs, i) => (
                      <SelectItem key={i} value={String(i)} className="text-white data-[highlighted]:bg-slate-800">
                        {bs.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {isCustomBlock && (
                <div className="flex gap-3">
                  <Field label="Block Nominal Height (in)">
                    <NumberInput
                      value={customBlockH}
                      onChange={(v) => { setCustomBlockH(v); setSubmitted(false); }}
                      placeholder="8"
                      badge="in"
                      ariaLabel="Custom block height"
                    />
                  </Field>
                  <Field label="Block Nominal Length (in)">
                    <NumberInput
                      value={customBlockL}
                      onChange={(v) => { setCustomBlockL(v); setSubmitted(false); }}
                      placeholder="16"
                      badge="in"
                      ariaLabel="Custom block length"
                    />
                  </Field>
                </div>
              )}
            </div>
            {!isCustomBlock && (
              <p className="mt-2 text-xs text-white/60">
                Actual size is approx. 3/8 in less than nominal on each face dimension (mortar joint not included in actual).
              </p>
            )}
          </section>

          {/* STEP 4 — Mortar & Waste */}
          <section className={stepClass} aria-labelledby="step4">
            <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Mortar Joint &amp; Waste</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field
                label="Mortar Joint Thickness (in)"
                hint="Default: 3/8 in (0.375)"
                subHint="Used for informational reference. Nominal face area already accounts for joint."
              >
                <NumberInput
                  value={mortarJoint}
                  onChange={(v) => { setMortarJoint(v); setSubmitted(false); }}
                  placeholder="0.375"
                  badge="in"
                  ariaLabel="Mortar joint thickness"
                />
              </Field>

              <Field label="Mortar Bag Size">
                <Select value={mortarBagSize} onValueChange={(v) => { setMortarBagSize(v as "80" | "60" | "custom"); setSubmitted(false); }}>
                  <SelectTrigger className={selectTriggerClass} aria-label="Mortar bag size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="80" className="text-white data-[highlighted]:bg-slate-800">80 lb (~13 blocks/bag)</SelectItem>
                    <SelectItem value="60" className="text-white data-[highlighted]:bg-slate-800">60 lb (~10 blocks/bag)</SelectItem>
                    <SelectItem value="custom" className="text-white data-[highlighted]:bg-slate-800">Custom coverage</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {mortarBagSize === "custom" && (
                <Field label="Blocks per Mortar Bag" hint="Enter how many standard blocks one bag covers">
                  <NumberInput
                    value={customBlocksPerBag}
                    onChange={(v) => { setCustomBlocksPerBag(v); setSubmitted(false); }}
                    placeholder="13"
                    badge="blk"
                    ariaLabel="Blocks per mortar bag"
                  />
                </Field>
              )}

              <Field label="Wastage %" subHint="Accounts for cuts, breakage, and jobsite losses">
                <div className="space-y-2">
                  <NumberInput
                    value={wastePct}
                    onChange={(v) => { setWastePct(v); setSubmitted(false); }}
                    placeholder="5"
                    badge="%"
                    ariaLabel="Waste percentage"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {WASTE_PRESETS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => { setWastePct(p.value); setSubmitted(false); }}
                        className={cn(
                          "text-[11px] px-2 py-0.5 rounded-full border",
                          wastePct === p.value
                            ? "border-teal-400 bg-teal-400/20 text-teal-300"
                            : "border-slate-600 text-slate-400 hover:border-slate-400"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
            </div>
          </section>

          {/* STEP 5 — Openings */}
          <section className={stepClass} aria-labelledby="step5">
            <div className="flex items-center justify-between">
              <h3 id="step5" className="text-sm font-semibold text-white/80">Step 5 — Openings (Doors, Windows, Vents)</h3>
              <Button
                type="button"
                onClick={addOpening}
                className="h-8 text-xs bg-slate-700 text-white hover:bg-slate-600 rounded-sm"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Opening
              </Button>
            </div>

            {openings.length === 0 ? (
              <p className="mt-2 text-xs text-slate-400">No openings added. Click &quot;Add Opening&quot; to deduct doors, windows, or vents from the wall area.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {openings.map((op, idx) => (
                  <div
                    key={op.id}
                    className="rounded-sm border border-slate-700 bg-slate-800/50 p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-end"
                  >
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Field label="Label">
                        <Input
                          value={op.label}
                          onChange={(e) => updateOpening(op.id, "label", e.target.value)}
                          placeholder="Door"
                          className={fieldInputClass}
                        />
                      </Field>
                      <Field label={`Width (${unitLabel})`}>
                        <NumberInput
                          value={op.width}
                          onChange={(v) => updateOpening(op.id, "width", v)}
                          placeholder="3"
                          badge={unitLabel}
                          ariaLabel={`Opening ${idx + 1} width`}
                        />
                      </Field>
                      <Field label={`Height (${unitLabel})`}>
                        <NumberInput
                          value={op.height}
                          onChange={(v) => updateOpening(op.id, "height", v)}
                          placeholder="7"
                          badge={unitLabel}
                          ariaLabel={`Opening ${idx + 1} height`}
                        />
                      </Field>
                      <Field label="Qty">
                        <NumberInput
                          value={op.qty}
                          onChange={(v) => updateOpening(op.id, "qty", v)}
                          placeholder="1"
                          ariaLabel={`Opening ${idx + 1} quantity`}
                        />
                      </Field>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeOpening(op.id)}
                      className="h-8 w-8 p-0 bg-rose-900/40 text-rose-400 hover:bg-rose-900 rounded-sm flex-shrink-0"
                      aria-label="Remove opening"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* STEP 6 — Cost Inputs */}
          <section className={stepClass} aria-labelledby="step6">
            <h3 id="step6" className="text-sm font-semibold text-white/80">Step 6 — Cost Inputs (Optional)</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="Cost per Block ($)" hint="Typical range: $1.50–$3.50 each">
                <NumberInput
                  value={costPerBlock}
                  onChange={(v) => { setCostPerBlock(v); setSubmitted(false); }}
                  placeholder="2.00"
                  badge="$"
                  ariaLabel="Cost per block"
                />
              </Field>
              <Field label="Price per Mortar Bag ($)">
                <NumberInput
                  value={pricePerMortarBag}
                  onChange={(v) => { setPricePerMortarBag(v); setSubmitted(false); }}
                  placeholder="8.00"
                  badge="$"
                  ariaLabel="Price per mortar bag"
                />
              </Field>
              <Field label={`Labor Cost per ft² ($)`} hint="Enter 0 to skip labor">
                <NumberInput
                  value={laborCostPerSqFt}
                  onChange={(v) => { setLaborCostPerSqFt(v); setSubmitted(false); }}
                  placeholder="15.00"
                  badge="$/ft²"
                  ariaLabel="Labor cost per square foot"
                />
              </Field>
              <Field label="Delivery Cost ($)">
                <NumberInput
                  value={deliveryCostInput}
                  onChange={(v) => { setDeliveryCostInput(v); setSubmitted(false); }}
                  placeholder="0"
                  badge="$"
                  ariaLabel="Delivery cost"
                />
              </Field>
              <Field label="Tax (%)" hint="Applied to material costs">
                <NumberInput
                  value={taxPct}
                  onChange={(v) => { setTaxPct(v); setSubmitted(false); }}
                  placeholder="0"
                  badge="%"
                  ariaLabel="Tax percentage"
                />
              </Field>
            </div>
          </section>

          {/* STEP 7 — Add-On Costs */}
          <section className={stepClass} aria-labelledby="step7">
            <div className="flex items-center justify-between">
              <h3 id="step7" className="text-sm font-semibold text-white/80">Step 7 — Add-On Costs (Optional)</h3>
              <Button
                type="button"
                onClick={() => setShowAddOns((v) => !v)}
                className="h-8 text-xs bg-slate-700 text-white hover:bg-slate-600 rounded-sm"
              >
                {showAddOns ? "Hide Add-Ons" : "Show Add-Ons"}
              </Button>
            </div>
            {showAddOns && (
              <div className="mt-3 space-y-3">
                {[
                  { label: "Grout / Fill Cost ($)", enabled: includeGrout, setEnabled: setIncludeGrout, value: groutCostInput, setValue: setGroutCostInput, id: "grout" },
                  { label: "Rebar Cost ($)", enabled: includeRebar, setEnabled: setIncludeRebar, value: rebarCostInput, setValue: setRebarCostInput, id: "rebar" },
                  { label: "Footing Cost ($)", enabled: includeFooting, setEnabled: setIncludeFooting, value: footingCostInput, setValue: setFootingCostInput, id: "footing" },
                  { label: "Cap Block Cost ($)", enabled: includeCapBlock, setEnabled: setIncludeCapBlock, value: capBlockCostInput, setValue: setCapBlockCostInput, id: "capblock" },
                  { label: "Waterproofing / Coating Cost ($)", enabled: includeWaterproofing, setEnabled: setIncludeWaterproofing, value: waterproofingCostInput, setValue: setWaterproofingCostInput, id: "waterproofing" },
                  { label: "Finish / Plaster / Paint Cost ($)", enabled: includeFinish, setEnabled: setIncludeFinish, value: finishCostInput, setValue: setFinishCostInput, id: "finish" },
                ].map(({ label, enabled, setEnabled, value, setValue, id }) => (
                  <div key={id} className="flex items-center gap-4 rounded-sm border border-slate-700 p-3">
                    <Switch
                      checked={enabled}
                      onCheckedChange={(v) => { setEnabled(v); setSubmitted(false); }}
                      aria-label={`Enable ${label}`}
                    />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <Field label={label}>
                        <NumberInput
                          value={value}
                          onChange={(v) => { setValue(v); setSubmitted(false); }}
                          placeholder="0.00"
                          badge="$"
                          ariaLabel={label}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Validation Error */}
          {validationError && (
            <div className="mt-4 rounded-sm border border-rose-500 bg-rose-900/20 p-3 text-sm text-rose-400">
              {validationError}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={!canCalculate}
              className="h-11 px-8 rounded-sm bg-teal-500 text-slate-900 font-semibold hover:bg-teal-400 disabled:opacity-50"
            >
              Calculate
            </Button>
            <Button
              type="button"
              onClick={reset}
              className="h-11 px-6 rounded-sm bg-slate-700 text-white hover:bg-slate-600"
            >
              Reset
            </Button>
            {submitted && results && (
              <Button
                type="button"
                onClick={handlePrint}
                className="h-11 px-6 rounded-sm bg-slate-700 text-white hover:bg-slate-600 flex items-center gap-2"
              >
                <Printer className="h-4 w-4" /> Print / Save
              </Button>
            )}
          </div>
        </form>

        {/* ===================== RESULTS ===================== */}
        {submitted && results && (
          <div className="mt-10 space-y-6">
            {/* Summary banner */}
            <div className="rounded-sm border border-teal-700/50 bg-teal-900/20 p-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                Based on your wall dimensions, you need approximately{" "}
                <span className="text-teal-400 font-bold">{results.finalBlocks.toLocaleString()} cinder blocks</span>{" "}
                including {wastePct}% waste. Your estimated{" "}
                <span className="text-teal-400 font-bold">block material cost is {fmtCurrency(results.blockCostTotal)}</span>
                {results.mortarCostTotal > 0 && (
                  <>, and estimated <span className="text-teal-400 font-bold">total material cost including mortar is {fmtCurrency(results.materialTotal)}</span></>
                )}.
                {results.installedTotal > 0 && (
                  <> Your estimated <span className="text-yellow-400 font-bold">installed cinder block wall cost is {fmtCurrency(results.installedTotal)}</span>.</>
                )}
              </p>
            </div>

            {/* Area Results */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Wall Area</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <KV k="Gross Wall Area" v={`${fmt(results.grossWallArea_ft2)} ft²`} />
                <KV k="Openings Area" v={`${fmt(results.openingsArea_ft2)} ft²`} />
                <KV k="Net Wall Area" v={`${fmt(results.netWallArea_ft2)} ft²`} />
                <KV k="Blocks per ft²" v={fmt(results.blocksPerSqFt, 3)} />
              </div>
            </div>

            {/* Block Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Block Quantity</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <KV k="Block Face Area" v={`${fmt(results.blockFaceArea_ft2, 4)} ft²`} />
                <KV k="Blocks Before Waste" v={fmt(Math.ceil(results.blocksRaw), 0)} />
                <KV k="Waste Blocks" v={fmt(Math.ceil(results.wasteBlocks), 0)} />
                <KV k="Total Blocks Needed" v={results.finalBlocks.toLocaleString()} highlight />
              </div>
            </div>

            {/* Mortar */}
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3">Mortar</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <KV k={`Mortar Bags (${mortarBagSize} lb)`} v={results.mortarBags.toLocaleString()} highlight />
                {results.mortarCostTotal > 0 && (
                  <KV k="Mortar Cost" v={fmtCurrency(results.mortarCostTotal)} />
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Note: Mortar coverage varies by joint thickness, block size, mason technique, and wall type. Use these as planning estimates.
              </p>
            </div>

            {/* Cost Summary */}
            {(results.blockCostTotal > 0 || results.installedTotal > 0) && (
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3">Cost Summary</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {results.blockCostTotal > 0 && <KV k="Block Material Cost" v={fmtCurrency(results.blockCostTotal)} />}
                  {results.mortarCostTotal > 0 && <KV k="Mortar Cost" v={fmtCurrency(results.mortarCostTotal)} />}
                  {results.groutCost > 0 && <KV k="Grout / Fill Cost" v={fmtCurrency(results.groutCost)} />}
                  {results.rebarCost > 0 && <KV k="Rebar Cost" v={fmtCurrency(results.rebarCost)} />}
                  {results.footingCost > 0 && <KV k="Footing Cost" v={fmtCurrency(results.footingCost)} />}
                  {results.capBlockCost > 0 && <KV k="Cap Block Cost" v={fmtCurrency(results.capBlockCost)} />}
                  {results.waterproofingCost > 0 && <KV k="Waterproofing Cost" v={fmtCurrency(results.waterproofingCost)} />}
                  {results.finishCost > 0 && <KV k="Finish / Plaster Cost" v={fmtCurrency(results.finishCost)} />}
                  {results.materialTotal > 0 && <KV k="Total Material Cost" v={fmtCurrency(results.materialTotal)} />}
                  {results.laborCost > 0 && <KV k="Labor Cost" v={fmtCurrency(results.laborCost)} />}
                  {results.deliveryCost > 0 && <KV k="Delivery Cost" v={fmtCurrency(results.deliveryCost)} />}
                  {results.taxAmount > 0 && <KV k="Tax" v={fmtCurrency(results.taxAmount)} />}
                  {results.installedTotal > 0 && <KV k="Estimated Installed Cost" v={fmtCurrency(results.installedTotal)} highlight />}
                  {results.costPerSqFt > 0 && <KV k="Cost per ft²" v={fmtCurrency(results.costPerSqFt)} />}
                </div>
              </div>
            )}

            {/* Calculation Steps */}
            <div className="rounded-sm border border-slate-700 bg-slate-800/40 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">How We Calculated This</h3>
              <ol className="space-y-1.5 text-sm text-slate-300 list-decimal list-inside">
                <li>Gross wall area: {fmt(parseFloat(wallLength))} × {fmt(parseFloat(wallHeight))} = <span className="text-white">{fmt(results.grossWallArea_ft2)} ft²</span></li>
                {results.openingsArea_ft2 > 0 && (
                  <li>Subtracted openings area: <span className="text-white">{fmt(results.openingsArea_ft2)} ft²</span></li>
                )}
                <li>Net wall area: <span className="text-white">{fmt(results.netWallArea_ft2)} ft²</span></li>
                <li>Block face area ({nomL_in} × {nomH_in} in nominal): <span className="text-white">{fmt(results.blockFaceArea_ft2, 4)} ft²</span> ({fmt(results.blocksPerSqFt, 3)} blocks/ft²)</li>
                <li>Blocks before waste: {fmt(results.netWallArea_ft2)} × {fmt(results.blocksPerSqFt, 3)} = <span className="text-white">{fmt(results.blocksRaw, 1)}</span></li>
                <li>Waste ({wastePct}%): <span className="text-white">+{fmt(results.wasteBlocks, 1)} blocks</span></li>
                <li>Final blocks (rounded up): <span className="text-teal-400 font-bold">{results.finalBlocks.toLocaleString()}</span></li>
                {results.mortarBags > 0 && (
                  <li>Mortar bags ({mortarBagSize} lb): <span className="text-white">{results.mortarBags}</span></li>
                )}
                {results.blockCostTotal > 0 && (
                  <li>Block cost: {results.finalBlocks} × ${costPerBlock} = <span className="text-white">{fmtCurrency(results.blockCostTotal)}</span></li>
                )}
              </ol>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-500 italic">
              This cinder block calculator provides planning-level estimates based on common U.S. nominal block sizes and standard masonry assumptions. Actual material needs, mortar usage, local prices, labor rates, and code requirements will vary by project and region.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
