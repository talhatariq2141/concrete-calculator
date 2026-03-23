// components/calculators/CMUBlockCalc.tsx
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

/* ===================== Types ===================== */
type UnitSystem = "imperial" | "metric";

interface BlockSize {
  label: string;
  nomH_in: number; // nominal height in inches
  nomL_in: number; // nominal length in inches
  nomW_in: number; // nominal width (thickness) in inches
}

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
}

/* ===================== Block Size Presets ===================== */
// Standard sizes: 4, 6, 8, 10, 12 thick by 8 high by 16 long nominal
const BLOCK_SIZES: BlockSize[] = [
  { label: '4 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 4 },
  { label: '6 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 6 },
  { label: '8 × 8 × 16 in (nominal) — Standard', nomH_in: 8, nomL_in: 16, nomW_in: 8 },
  { label: '10 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 10 },
  { label: '12 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 12 },
  { label: 'Custom size', nomH_in: 0, nomL_in: 0, nomW_in: 0 },
];

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
export default function CMUBlockCalc() {
  /* --- Unit System --- */
  const [unit, setUnit] = useState<UnitSystem>("imperial");
  const unitLabel = unit === "imperial" ? "ft" : "m";

  /* --- Wall Inputs --- */
  const [wallLength, setWallLength] = useState("20");
  const [wallHeight, setWallHeight] = useState("8");
  const [wallQty, setWallQty] = useState("1");

  /* --- Block Size --- */
  const [blockSizeIdx, setBlockSizeIdx] = useState("2"); // 8x8x16 default
  const [customBlockH, setCustomBlockH] = useState("8");
  const [customBlockL, setCustomBlockL] = useState("16");

  /* --- Mortar --- */
  const [mortarJoint, setMortarJoint] = useState("0.375"); // 3/8 in

  /* --- Wastage --- */
  const [wastePct, setWastePct] = useState("10"); // Default 10% per instructions

  /* --- Openings --- */
  const [openings, setOpenings] = useState<Opening[]>([]);

  /* --- Cost Inputs --- */
  const [costPerBlock, setCostPerBlock] = useState("");
  const [laborCostPerSqFt, setLaborCostPerSqFt] = useState("");
  const [deliveryCostInput, setDeliveryCostInput] = useState("");
  const [taxPct, setTaxPct] = useState("");

  /* --- Add-on toggles --- */
  const [showAddOns, setShowAddOns] = useState(false);
  const [includeMortar, setIncludeMortar] = useState(false);
  const [mortarCostInput, setMortarCostInput] = useState("");
  const [includeGrout, setIncludeGrout] = useState(false);
  const [groutCostInput, setGroutCostInput] = useState("");
  const [includeRebar, setIncludeRebar] = useState(false);
  const [rebarCostInput, setRebarCostInput] = useState("");

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
    const wq = parseFloat(wallQty);
    if (!(wl > 0 && wh > 0 && wq > 0)) return false;
    if (nomH_in <= 0 || nomL_in <= 0) return false;
    return true;
  }, [wallLength, wallHeight, wallQty, nomH_in, nomL_in]);

  /* ===================== Calculate ===================== */
  const onCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canCalculate) return;
    setValidationError("");

    const wl = toFt(parseFloat(wallLength), unit);
    const wh = toFt(parseFloat(wallHeight), unit);
    const wq = Math.max(1, parseInt(wallQty || "1"));
    const waste = Math.max(0, parseFloat(wastePct || "0"));

    const grossArea = wl * wh * wq;

    // Openings
    let openingsArea = 0;
    for (const op of openings) {
      const ow = toFt(parseFloat(op.width || "0"), unit);
      const oh = toFt(parseFloat(op.height || "0"), unit);
      const oq = Math.max(0, parseInt(op.qty || "1"));
      openingsArea += ow * oh * oq;
    }

    if (openingsArea > grossArea && openingsArea > 0) {
      setValidationError("Openings area cannot exceed wall area.");
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

    // Labor
    const laborCostPerSqFtVal = parseFloat(laborCostPerSqFt || "0");
    const laborCost = netArea * laborCostPerSqFtVal;

    // Delivery
    const deliveryCost = parseFloat(deliveryCostInput || "0");

    // Add-ons
    const mortarCostTotal = includeMortar ? parseFloat(mortarCostInput || "0") : 0;
    const groutCost = includeGrout ? parseFloat(groutCostInput || "0") : 0;
    const rebarCost = includeRebar ? parseFloat(rebarCostInput || "0") : 0;

    const addOnTotal = groutCost + rebarCost;

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
      mortarCostTotal,
      materialTotal,
      laborCost,
      deliveryCost,
      taxAmount,
      installedTotal,
      costPerSqFt,
      groutCost,
      rebarCost,
    });
    setSubmitted(true);
  };

  const reset = () => {
    setWallLength("20"); setWallHeight("8"); setWallQty("1");
    setBlockSizeIdx("2"); setCustomBlockH("8"); setCustomBlockL("16");
    setMortarJoint("0.375");
    setWastePct("10"); setOpenings([]);
    setCostPerBlock(""); setLaborCostPerSqFt("");
    setDeliveryCostInput(""); setTaxPct("");
    setMortarCostInput(""); setGroutCostInput(""); setRebarCostInput("");
    setIncludeMortar(false); setIncludeGrout(false); setIncludeRebar(false);
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
  <title>CMU Block Calculator – Print View</title>
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
      <div class="meta"><div>CMU Block Calculator</div><div>Printed: ${now}</div></div>
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
      <div class="kv"><div class="k">Final CMU Blocks to Buy</div><div class="v">${results.finalBlocks}</div></div>
    </div>

    <h2>Cost Summary</h2>
    <div class="grid">
      <div class="kv"><div class="k">Estimated CMU Block Cost</div><div class="v">${fmtCurrency(results.blockCostTotal)}</div></div>
      <div class="kv"><div class="k">Mortar Cost</div><div class="v">${fmtCurrency(results.mortarCostTotal)}</div></div>
      <div class="kv"><div class="k">Labor Cost</div><div class="v">${fmtCurrency(results.laborCost)}</div></div>
      <div class="kv"><div class="k">Delivery Cost</div><div class="v">${fmtCurrency(results.deliveryCost)}</div></div>
      <div class="kv"><div class="k">Tax</div><div class="v">${fmtCurrency(results.taxAmount)}</div></div>
    </div>
    <div style="margin-top:12px; padding:12px; border:2px solid #0f766e; border-radius:8px;">
      <div class="label">Estimated Total Project Cost</div>
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
    { label: "0% (None)", value: "0" },
    { label: "5% (Simple)", value: "5" },
    { label: "10% (Default)", value: "10" },
    { label: "15% (Complex)", value: "15" },
  ];

  return (
    <Card className="font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-2xl font-bold text-teal-400 text-center">
          CMU Block Calculator
        </CardTitle>
        <p className="text-sm text-white/70 mt-1 text-center">
          Estimate the number of CMU blocks required for your wall/project and the total estimated block cost. Fill in the details below and press{" "}
          <span className="font-semibold">Calculate</span>.
        </p>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {/* Info strip */}
        <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 text-teal-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            This calculator uses <span className="text-white font-medium">nominal block dimensions</span> (including standard 3/8 in mortar joints) for coverage calculation. 
            For standard 8x16 face, calculating 1.125 blocks per sq ft.
          </p>
        </div>

        <form onSubmit={onCalculate}>
          {/* STEP 1 — Unit System */}
          <section className={stepClass} aria-labelledby="step1">
            <h3 id="step1" className="text-sm font-semibold text-white/80">Step 1 — Measurement System</h3>
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
            <p className="mt-2 text-xs text-white/60">All length inputs will be evaluated in <span className="text-white">{unitLabel}</span>.</p>
          </section>

          {/* STEP 2 — Wall Dimensions */}
          <section className={stepClass} aria-labelledby="step2">
            <h3 id="step2" className="text-sm font-semibold text-white/80">Step 2 — Wall Dimensions</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
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
              <Field id="wallQty" label="Number of Identical Walls">
                <NumberInput
                  id="wallQty"
                  value={wallQty}
                  onChange={(v) => { setWallQty(v); setSubmitted(false); }}
                  placeholder="1"
                  ariaLabel="Number of identical walls"
                />
              </Field>
            </div>
          </section>

          {/* STEP 3 — Block Size */}
          <section className={stepClass} aria-labelledby="step3">
            <h3 id="step3" className="text-sm font-semibold text-white/80">Step 3 — Block Size Selector</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
              <Field label="Nominal Block Size" subHint="Thickness × Height × Length">
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
                  <Field label="Nominal Height (in)">
                    <NumberInput
                      value={customBlockH}
                      onChange={(v) => { setCustomBlockH(v); setSubmitted(false); }}
                      placeholder="8"
                      badge="in"
                      ariaLabel="Custom block height"
                    />
                  </Field>
                  <Field label="Nominal Length (in)">
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
                Note: Standard 4&quot;, 6&quot;, 8&quot;, 10&quot;, and 12&quot; width CMU blocks have the same 8x16 nominal face size, so the coverage logic remains the same.
              </p>
            )}
          </section>

          {/* STEP 4 — Mortar & Waste */}
          <section className={stepClass} aria-labelledby="step4">
            <h3 id="step4" className="text-sm font-semibold text-white/80">Step 4 — Mortar Joint &amp; Waste</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
              <Field
                label="Mortar Joint Thickness (in)"
                hint="Default: 3/8 in (0.375)"
                subHint="Used for informational reference."
              >
                <NumberInput
                  value={mortarJoint}
                  onChange={(v) => { setMortarJoint(v); setSubmitted(false); }}
                  placeholder="0.375"
                  badge="in"
                  ariaLabel="Mortar joint thickness"
                />
              </Field>

              <Field label="Waste Percentage" subHint="Extra blocks for breakage and cuts">
                <div className="space-y-2">
                  <NumberInput
                    value={wastePct}
                    onChange={(v) => { setWastePct(v); setSubmitted(false); }}
                    placeholder="10"
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
              <h3 id="step5" className="text-sm font-semibold text-white/80">Step 5 — Openings Deduction (Doors, Windows)</h3>
              <Button
                type="button"
                onClick={addOpening}
                className="h-8 text-xs bg-slate-700 text-white hover:bg-slate-600 rounded-sm"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Opening
              </Button>
            </div>

            {openings.length === 0 ? (
              <p className="mt-2 text-xs text-slate-400">No openings added. Click &quot;Add Opening&quot; to deduct doors or windows from the net wall area.</p>
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
            <h3 id="step6" className="text-sm font-semibold text-white/80">Step 6 — CMU Block Cost & Additional Estimates (Optional)</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="Cost per CMU Block ($)" hint="Typical range: $1.50–$3.50 each">
                <NumberInput
                  value={costPerBlock}
                  onChange={(v) => { setCostPerBlock(v); setSubmitted(false); }}
                  placeholder="2.00"
                  badge="$"
                  ariaLabel="Cost per block"
                />
              </Field>
              <Field label={`Labor Cost per ft² ($)`} hint="Cost per net area">
                <NumberInput
                  value={laborCostPerSqFt}
                  onChange={(v) => { setLaborCostPerSqFt(v); setSubmitted(false); }}
                  placeholder="15.00"
                  badge="$/ft²"
                  ariaLabel="Labor cost per square foot"
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

          {/* STEP 7 — Advanced Cost Add-ons */}
          <section className={stepClass} aria-labelledby="step7">
            <div className="flex items-center justify-between">
              <h3 id="step7" className="text-sm font-semibold text-white/80">Step 7 — Optional Advanced Costs</h3>
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
                  { label: "Mortar Cost ($)", enabled: includeMortar, setEnabled: setIncludeMortar, value: mortarCostInput, setValue: setMortarCostInput, id: "mortar" },
                  { label: "Reinforcement / Rebar Cost ($)", enabled: includeRebar, setEnabled: setIncludeRebar, value: rebarCostInput, setValue: setRebarCostInput, id: "rebar" },
                  { label: "Grout Cost ($)", enabled: includeGrout, setEnabled: setIncludeGrout, value: groutCostInput, setValue: setGroutCostInput, id: "grout" },
                  { label: "Delivery Cost ($)", enabled: true, setEnabled: () => {}, value: deliveryCostInput, setValue: setDeliveryCostInput, id: "delivery", isStatic: true },
                ].map(({ label, enabled, setEnabled, value, setValue, id, isStatic }) => (
                  <div key={id} className="flex items-center gap-4 rounded-sm border border-slate-700 p-3">
                    {!isStatic && (
                      <Switch
                        checked={enabled}
                        onCheckedChange={(v) => { setEnabled(v); setSubmitted(false); }}
                        aria-label={`Enable ${label}`}
                      />
                    )}
                    {isStatic && <div className="w-9" />} {/* Spacer for alignment */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                      <Field label={label}>
                        <NumberInput
                          value={value}
                          onChange={(v) => { setValue(v); setSubmitted(false); }}
                          placeholder="0"
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

          {/* Error Message */}
          {validationError && (
            <div className="mt-4 p-3 bg-rose-900/40 border border-rose-500/50 rounded-sm text-sm text-rose-400">
              {validationError}
            </div>
          )}

          {/* Action Area */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              type="submit"
              className="flex-1 min-w-[200px] bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-lg h-12 rounded-sm"
            >
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="px-6 h-12 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-sm"
            >
              Reset
            </Button>
            {submitted && results && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="px-6 h-12 border-teal-500/50 text-teal-400 hover:bg-slate-800 rounded-sm"
              >
                <Printer className="mr-2 h-4 w-4" /> Print / Save
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      {/* RESULT PANEL */}
      {submitted && results && (
        <div id="results-panel" className="bg-slate-950 p-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="text-xl font-bold text-white mb-4">Calculation Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Wall Breakdown */}
            <div className="space-y-3">
              <h3 className="text-teal-400 font-semibold border-b border-slate-800 pb-1">Wall Area Summary</h3>
              <div className="space-y-1">
                <KV k="Total Wall Area" v={`${fmt(results.grossWallArea_ft2)} ft²`} />
                <KV k="Total Openings Area" v={`${fmt(results.openingsArea_ft2)} ft²`} />
                <KV k="Net Wall Area" v={`${fmt(results.netWallArea_ft2)} ft²`} highlight />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                One standard modular CMU block covers approx 0.8889 sq ft. That means approx 112.5 blocks per 100 sq ft.
              </p>
            </div>

            {/* 2. Block Summary */}
            <div className="space-y-3">
              <h3 className="text-teal-400 font-semibold border-b border-slate-800 pb-1">Block Requirements</h3>
              <div className="space-y-1">
                <KV k="Base CMU Blocks Needed" v={fmt(results.blocksRaw, 0)} />
                <KV k={`Waste Allowance (${wastePct}%)`} v={`+${fmt(results.wasteBlocks, 0)} blocks`} />
                <KV k="Final CMU Blocks to Buy" v={fmt(results.finalBlocks, 0)} highlight />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Always ordered rounding up to the next whole block. Includes wastage for cuts and breakage.
              </p>
            </div>

            {/* 3. Cost Summary */}
            <div className="space-y-3">
              <h3 className="text-teal-400 font-semibold border-b border-slate-800 pb-1">Cost Summary</h3>
              <div className="space-y-1">
                <KV k="Estimated CMU Block Cost" v={fmtCurrency(results.blockCostTotal)} highlight />
                {costPerBlock && <KV k="Cost per Block" v={`$${parseFloat(costPerBlock).toFixed(2)}`} />}
                {(results.mortarCostTotal > 0 || results.groutCost > 0 || results.rebarCost > 0) && (
                  <KV k="Other Material Cost" v={fmtCurrency(results.mortarCostTotal + results.groutCost + results.rebarCost)} />
                )}
                {results.laborCost > 0 && <KV k="Optional Labor Cost" v={fmtCurrency(results.laborCost)} />}
                {results.taxAmount > 0 && <KV k="Optional Tax Amount" v={fmtCurrency(results.taxAmount)} />}
                
                <div className="mt-4 p-3 bg-teal-900/20 border border-teal-800/50 rounded-sm">
                  <div className="text-xs text-teal-500 font-medium uppercase mb-1">Estimated Total Project Cost</div>
                  <div className="text-2xl font-bold text-teal-400">{fmtCurrency(results.installedTotal)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
