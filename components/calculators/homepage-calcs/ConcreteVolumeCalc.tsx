"use client";

import * as React from "react";

type Unit = "feet" | "inches" | "yards" | "meters" | "centimeters";

const UNIT_LABELS: Record<Unit, string> = {
  feet: "feet",
  inches: "inches",
  yards: "yards",
  meters: "meters",
  centimeters: "centimeters",
};

// conversion factors
const TO_METERS: Record<Unit, number> = {
  meters: 1,
  centimeters: 0.01,
  feet: 0.3048,
  inches: 0.0254,
  yards: 0.9144,
};

const M3_TO_FT3 = 35.3147;
const M3_TO_YD3 = 1.30795;
const DENSITY_KG_PER_M3 = 2400;
const KG_TO_LB = 2.20462;

const nf = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(isFinite(n) ? n : 0);

/* ---------- Smooth collapse ---------- */
function Collapse({
  isOpen,
  children,
  durationMs = 300,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  durationMs?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setMaxH(el.scrollHeight);
    const ro = new ResizeObserver(() => setMaxH(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);
  return (
    <div
      style={{
        maxHeight: isOpen ? maxH : 0,
        opacity: isOpen ? 1 : 0,
        transition: `max-height ${durationMs}ms ease, opacity ${durationMs}ms ease`,
        overflow: "hidden",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* ---------- Component ---------- */
export default function ConcreteVolumeCalc() {
  const [length, setLength] = React.useState(5);
  const [width, setWidth] = React.useState(2.5);
  const [height, setHeight] = React.useState(0.15);
  const [qty, setQty] = React.useState(1);
  const [uL, setUL] = React.useState<Unit>("meters");
  const [uW, setUW] = React.useState<Unit>("meters");
  const [uH, setUH] = React.useState<Unit>("meters");
  const [m3, setM3] = React.useState(0);
  const [show, setShow] = React.useState(false);

  const calc = () => {
    const L = length * TO_METERS[uL];
    const W = width * TO_METERS[uW];
    const H = height * TO_METERS[uH];
    setM3(L * W * H * qty);
    setShow(true);
  };

  const reset = () => {
    setLength(5);
    setWidth(2.5);
    setHeight(0.15);
    setQty(1);
    setUL("meters");
    setUW("meters");
    setUH("meters");
    setM3(0);
    setShow(false);
  };

  // derived
  const ft3 = m3 * M3_TO_FT3;
  const yd3 = m3 * M3_TO_YD3;
  const kg = m3 * DENSITY_KG_PER_M3;
  const lb = kg * KG_TO_LB;
  const bags60 = lb / 60;
  const bags80 = lb / 80;

  /* ---------- Print / Save ---------- */
  const onPrintSave = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const when = new Date().toLocaleString();
    const year = new Date().getFullYear();

    // inline Lucide "Calculator" icon for print layout
    const calcIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/><line x1="9" y1="18" x2="9" y2="18"/><line x1="15" y1="18" x2="15" y2="18"/></svg>`;

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Concrete Volume Calculator — Concrete Calculator MAX</title>
<style>
  body{font-family:system-ui,Arial,sans-serif;background:#fff;color:#111;margin:0}
  .wrap{max-width:920px;margin:24px auto;padding:0 16px}
  .card{border:1px solid #ccc;border-radius:6px;box-shadow:0 2px 5px rgba(0,0,0,0.1)}
  .head,.foot{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#f8fafc;border-bottom:1px solid #ccc}
  .foot{border-top:1px solid #ccc}
  .brand{display:flex;align-items:center;gap:8px;font-weight:700}
  .max{margin-left:4px;padding:1px 5px;font-size:10px;font-weight:600;color:#22c55e;border:1px solid #22c55e80;border-radius:3px;background:#111}
  .meta{font-size:12px;opacity:.7}
  .section{padding:16px}
  .sub{font-size:15px;font-weight:600;margin-bottom:6px;color:#0369a1}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
  .box{padding:10px;border:1px solid #ccc;border-radius:4px}
  .label{font-size:12px;opacity:.7}
  .val{font-weight:600;font-size:15px}
  .tab{width:100%;border-collapse:collapse}
  .tab td,.tab th{border:1px solid #ccc;padding:6px 10px;text-align:left}
  .muted{opacity:.75}
  .link{color:#0369a1;text-decoration:none}
  .link:hover{text-decoration:underline}
  @media print{.noprint{display:none}}
</style>
</head>
<body>
<div class="wrap">
<div class="card">
<div class="head">
  <div>
    <div class="brand">${calcIcon}<span>Concrete Calculator</span><span class="max">MAX</span></div>
    <div class="meta">Generated ${when}</div>
  </div>
  <button class="noprint" onclick="window.print()" style="background:#22c55e;border:0;border-radius:4px;padding:6px 10px;font-weight:600;color:#0f172a;">Print / Save</button>
</div>

<div class="section">
  <div class="sub">Inputs Provided</div>
  <table class="tab">
    <tr><td>Length (L)</td><td>${length} ${UNIT_LABELS[uL]}</td></tr>
    <tr><td>Width (W)</td><td>${width} ${UNIT_LABELS[uW]}</td></tr>
    <tr><td>Height (H)</td><td>${height} ${UNIT_LABELS[uH]}</td></tr>
    <tr><td>Quantity</td><td>${qty}</td></tr>
  </table>
</div>

<div class="section">
  <div class="sub">Calculated Results</div>
  <div class="grid">
    <div class="box"><div class="label">Volume (ft³)</div><div class="val">${nf(ft3,2)}</div></div>
    <div class="box"><div class="label">Volume (yd³)</div><div class="val">${nf(yd3,2)}</div></div>
    <div class="box"><div class="label">Volume (m³)</div><div class="val">${nf(m3,2)}</div></div>
    <div class="box"><div class="label">Density used</div><div class="val">${DENSITY_KG_PER_M3} kg/m³</div></div>
  </div>
</div>

<div class="section">
  <div class="sub">Material & Bag Estimation</div>
  <table class="tab">
    <tr><td>Weight needed</td><td>${nf(lb,2)} lbs <span class="muted">or</span> ${nf(kg,2)} kg</td></tr>
    <tr><td>Using 60-lb bags</td><td>${nf(bags60,2)} bags</td></tr>
    <tr><td>Using 80-lb bags</td><td>${nf(bags80,2)} bags</td></tr>
  </table>
  <p class="muted" style="font-size:12px;margin-top:4px">* Always round up bag counts to the next whole number.</p>
</div>

<div class="foot">
  <div class="brand">${calcIcon}<span>Concrete Calculator</span><span class="max">MAX</span></div>
  <div style="font-size:12px;opacity:.8;">Generated via <a href="https://concretecalculatormax.com" target="_blank" class="link">concretecalculatormax.com</a> · © ${year}</div>
</div>
</div></div>
<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),150));</script>
</body>
</html>
    `.trim();

    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  /* ---------- JSX ---------- */
  return (
    <div className="mt-6 font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-teal-400">
          Concrete Volume Calculator — Slabs, Square Footings, or Walls
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-400">
          Enter dimensions, choose units for each field, and quantity if you’re pouring multiple identical sections.
        </p>
        {/* Helper block (tooltip) */}
        <div className="mt-3 text-xs sm:text-sm bg-slate-800/70 border border-slate-700 rounded-sm p-3 text-slate-400 leading-relaxed">
          <p className="text-teal-400 font-semibold mb-1 text-sm sm:text-base">How this calculator works</p>
          <p>
            Calculates volume for a rectangular section (slab, square footing, or wall).
            Formula:&nbsp;
            <code className="text-slate-200">Volume = Length × Width × Height × Quantity</code>.
            Each field can use its own units; all inputs are converted internally to meters
            before computing the result (then shown in ft³ / yd³ / m³).
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calc();
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <FieldRow label="Length (L)" value={length} onValue={setLength} unit={uL} onUnit={setUL} />
          <FieldRow label="Width (W)" value={width} onValue={setWidth} unit={uW} onUnit={setUW} />
          <FieldRow label="Thickness / Height (H)" value={height} onValue={setHeight} unit={uH} onUnit={setUH} />
          <div className="flex flex-col">
            <label className="block text-left text-xs sm:text-sm font-medium text-teal-400 mb-1">Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 text-sm md:text-base focus:ring-2 focus:ring-teal-500/50 outline-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm bg-teal-500 px-4 py-2 font-medium text-slate-950 text-sm md:text-base hover:bg-teal-400"
            >
              Calculate
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M13.172 12 8.586 7.414 10 6l6 6-6 6-1.414-1.414L13.172 12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-sm bg-slate-300 px-4 py-2 font-medium text-slate-950 text-sm md:text-base hover:opacity-90"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="px-6 pb-6">
        <Collapse isOpen={show}>
          <div className="rounded-sm border border-slate-700 bg-slate-800/50">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-base sm:text-lg font-semibold text-slate-100">Result</span>
              <button
                onClick={onPrintSave}
                className="rounded-sm bg-green-500 px-3 py-1.5 text-sm md:text-base font-semibold text-slate-950 hover:bg-green-400"
              >
                Print / Save
              </button>
            </div>

            <div className="grid gap-4 px-4 py-4 md:grid-cols-2">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-sm sm:text-base text-slate-200">
                  Volume: <span className="font-semibold text-teal-400">{nf(ft3, 2)}</span> ft³
                </div>
                <div className="text-sm sm:text-base text-slate-300">
                  or <span className="font-semibold text-teal-400">{nf(yd3, 2)}</span> yd³
                </div>
                <div className="text-sm sm:text-base text-slate-300">
                  or <span className="font-semibold text-teal-400">{nf(m3, 2)}</span> m³
                </div>
              </div>
              <div>
                <div className="text-sm sm:text-base text-slate-300">
                  If using pre-mixed density of{" "}
                  <span className="font-semibold text-slate-200">{DENSITY_KG_PER_M3}</span> kg/m³:
                </div>
                <div className="mt-2 border border-slate-700 rounded-sm">
                  <div className="grid grid-cols-[1fr,1fr] text-xs sm:text-sm">
                    <div className="bg-slate-800/70 px-3 py-2 text-teal-400">Weight needed</div>
                    <div className="px-3 py-2 text-slate-100">
                      {nf(lb, 2)} lbs or {nf(kg, 2)} kg
                    </div>
                    <div className="bg-slate-800/70 px-3 py-2 text-teal-400">60-lb bags</div>
                    <div className="px-3 py-2 text-slate-100">{nf(bags60, 2)} bags</div>
                    <div className="bg-slate-800/70 px-3 py-2 text-teal-400">80-lb bags</div>
                    <div className="px-3 py-2 text-slate-100">{nf(bags80, 2)} bags</div>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                  * Always round up to the next whole bag.
                </p>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

/* ---------- FieldRow ---------- */
function FieldRow({
  label,
  value,
  onValue,
  unit,
  onUnit,
}: {
  label: string;
  value: number;
  onValue: (n: number) => void;
  unit: Unit;
  onUnit: (u: Unit) => void;
}) {
  return (
    <div>
      <label className="text-left block text-xs sm:text-sm font-medium text-teal-400 mb-1">
        {label}
      </label>
      <div className="flex flex-col gap-3">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          value={value}
          onChange={(e) => onValue(Number(e.target.value))}
          className="flex-1 rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 text-sm md:text-base focus:ring-2 focus:ring-teal-500/50 outline-none"
        />
        <select
          value={unit}
          onChange={(e) => onUnit(e.target.value as Unit)}
          className="w-40 rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 text-sm md:text-base focus:ring-2 focus:ring-teal-500/50 outline-none"
        >
          {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
            <option key={u}>{UNIT_LABELS[u]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
