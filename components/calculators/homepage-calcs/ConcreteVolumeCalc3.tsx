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

// linear → meters
const TO_METERS: Record<Unit, number> = {
  meters: 1,
  centimeters: 0.01,
  feet: 0.3048,
  inches: 0.0254,
  yards: 0.9144,
};

// cubic conversions
const M3_TO_FT3 = 35.3146667;
const M3_TO_YD3 = 1.3079506;

// density & bags
const DENSITY_KG_PER_M3 = 2400; // your required density
const KG_TO_LB = 2.2046226;

const nf = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(isFinite(n) ? n : 0);

/** Simple smooth Collapse (no external deps) */
function Collapse({
  isOpen,
  children,
  durationMs = 280,
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
      aria-hidden={!isOpen}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

export default function ConcreteVolumeCalc3() {
  // Inputs (match screenshot vibe)
  const [outerD, setOuterD] = React.useState(5);
  const [innerD, setInnerD] = React.useState(4);
  const [height, setHeight] = React.useState(6);
  const [qty, setQty] = React.useState(1);

  const [uO, setUO] = React.useState<Unit>("meters");
  const [uI, setUI] = React.useState<Unit>("meters");
  const [uH, setUH] = React.useState<Unit>("centimeters");

  // Results
  const [m3, setM3] = React.useState(0);
  const [show, setShow] = React.useState(false);

  const calculate = () => {
    const d1 = (Number(outerD) || 0) * TO_METERS[uO];
    const d2 = (Number(innerD) || 0) * TO_METERS[uI];
    const h = (Number(height) || 0) * TO_METERS[uH];
    const q = Math.max(0, Number(qty) || 0);

    // Volume of a cylindrical ring: π * ((d1^2 - d2^2) / 4) * h
    const volEach = Math.PI * ((d1 * d1 - d2 * d2) / 4) * h;
    setM3(volEach * q);
    setShow(true);
  };

  const reset = () => {
    setOuterD(5);
    setInnerD(4);
    setHeight(6);
    setQty(1);
    setUO("meters");
    setUI("meters");
    setUH("centimeters");
    setM3(0);
    setShow(false);
  };

  // Derived
  const ft3 = m3 * M3_TO_FT3;
  const yd3 = m3 * M3_TO_YD3;
  const kg = m3 * DENSITY_KG_PER_M3;
  const lb = kg * KG_TO_LB;
  const bags60 = lb / 60;
  const bags80 = lb / 80;

  /** Print/Save — all values preformatted to avoid nested ${} */
  const onPrintSave = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const when = new Date().toLocaleString();
    const year = new Date().getFullYear();
    const densityText = DENSITY_KG_PER_M3.toLocaleString();

    // Pre-format numbers so the HTML string stays simple
    const sFt3 = nf(ft3, 2);
    const sYd3 = nf(yd3, 2);
    const sM3 = nf(m3, 2);
    const sKg = nf(kg, 2);
    const sLb = nf(lb, 2);
    const sB60 = nf(bags60, 2);
    const sB80 = nf(bags80, 2);

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Circular Slab or Tube — Concrete Calculator MAX</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body{font-family:system-ui,Arial,sans-serif;background:#fff;color:#111;margin:0}
  .wrap{max-width:920px;margin:24px auto;padding:0 16px}
  .card{border:1px solid #ccc;border-radius:6px;box-shadow:0 2px 5px rgba(0,0,0,0.1)}
  .head,.foot{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#f8fafc;border-bottom:1px solid #ccc}
  .foot{border-top:1px solid #ccc}
  .brand{font-weight:700;font-size:16px;display:flex;align-items:center;gap:8px}
  .max{margin-left:4px;padding:1px 5px;font-size:10px;font-weight:600;color:#22c55e;border:1px solid #22c55e80;border-radius:4px;background:#111}
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
        <div class="brand">Concrete Calculator <span class="max">MAX</span></div>
        <div class="meta">Generated ${when}</div>
      </div>
      <button class="noprint" onclick="window.print()" style="background:#22c55e;border:0;border-radius:4px;padding:6px 10px;font-weight:600;color:#0f172a;">Print / Save</button>
    </div>

    <div class="section">
      <div class="sub">Inputs Provided</div>
      <table class="tab">
        <tr><td>Outer Diameter (d₁)</td><td>${outerD} ${UNIT_LABELS[uO]}</td></tr>
        <tr><td>Inner Diameter (d₂)</td><td>${innerD} ${UNIT_LABELS[uI]}</td></tr>
        <tr><td>Length / Height (h)</td><td>${height} ${UNIT_LABELS[uH]}</td></tr>
        <tr><td>Quantity</td><td>${qty}</td></tr>
      </table>
    </div>

    <div class="section">
      <div class="sub">Calculated Results</div>
      <div class="grid">
        <div class="box"><div class="label">Volume (ft³)</div><div class="val">${sFt3}</div></div>
        <div class="box"><div class="label">Volume (yd³)</div><div class="val">${sYd3}</div></div>
        <div class="box"><div class="label">Volume (m³)</div><div class="val">${sM3}</div></div>
        <div class="box"><div class="label">Density used</div><div class="val">${densityText} kg/m³</div></div>
      </div>
    </div>

    <div class="section">
      <div class="sub">Material & Bag Estimation</div>
      <table class="tab">
        <tr><td>Weight needed</td><td>${sLb} lbs <span class="muted">or</span> ${sKg} kg</td></tr>
        <tr><td>Using 60-lb bags</td><td>${sB60} bags</td></tr>
        <tr><td>Using 80-lb bags</td><td>${sB80} bags</td></tr>
      </table>
      <p class="muted" style="font-size:12px;margin-top:4px">* Always round up bag counts to the next whole number.</p>
    </div>

    <div class="foot">
      <div class="brand">Concrete Calculator <span class="max">MAX</span></div>
      <div style="font-size:12px;opacity:.8;">
        Generated via <a href="https://concretecalculatormax.com" target="_blank" class="link">concretecalculatormax.com</a> · © ${year}
      </div>
    </div>
  </div>
</div>
<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),150));</script>
</body>
</html>
    `.trim();

    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div className="mt-6 font-poppins mx-auto w-full max-w-6xl rounded-sm border border-slate-700 bg-slate-900 shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-teal-400">
          Concrete Volume Calculator — Circular Slab or Tube
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-400">
          Enter outer and inner diameters, height, per-field units, and quantity.
        </p>
        {/* Helper block (tooltip) */}
        <div className="mt-3 text-xs sm:text-sm bg-slate-800/70 border border-slate-700 rounded-sm p-3 text-slate-400 leading-relaxed">
          <p className="text-teal-400 font-semibold mb-1">How this calculator works</p>
          <p>
            Calculates volume for a <strong>circular slab or tube</strong> (hollow cylinder). 
            Formula:&nbsp;
            <code className="text-slate-200">Volume = π × ((OuterDiameter² − InnerDiameter²) / 4) × Height × Quantity</code>.
            <br />
            Inputs may use different units — they’re converted to meters automatically before computing the result.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculate();
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <FieldRow
            label="Outer Diameter (d₁)"
            value={outerD}
            onValue={setOuterD}
            unit={uO}
            onUnit={setUO}
          />
          <FieldRow
            label="Inner Diameter (d₂)"
            value={innerD}
            onValue={setInnerD}
            unit={uI}
            onUnit={setUI}
          />
          <FieldRow
            label="Length / Height (h)"
            value={height}
            onValue={setHeight}
            unit={uH}
            onUnit={setUH}
          />
          <div className="flex flex-col">
            <label className="text-left block text-sm text-teal-400 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={0}
              step="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className=" rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm bg-teal-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-teal-400"
            >
              Calculate
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M13.172 12 8.586 7.414 10 6l6 6-6 6-1.414-1.414L13.172 12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-sm bg-slate-300 px-4 py-2 font-medium text-slate-950 transition hover:opacity-90"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Results below form */}
      <div className="px-6 pb-6">
        <Collapse isOpen={show}>
          <div className="rounded-sm border border-slate-700 bg-slate-800/50">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-100">Result</span>
              <button
                type="button"
                onClick={onPrintSave}
                className="rounded-sm bg-green-500 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-green-400"
              >
                Print / Save
              </button>
            </div>

            <div className="grid gap-4 px-4 py-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="text-slate-200">
                  Volume: <span className="font-semibold text-teal-400">{nf(ft3, 2)}</span> ft³
                </div>
                <div className="text-slate-300">
                  or <span className="font-semibold text-teal-400">{nf(yd3, 2)}</span> yd³
                </div>
                <div className="text-slate-300">
                  or <span className="font-semibold text-teal-400">{nf(m3, 2)}</span> m³
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-300">
                  Using pre-mixed concrete with density of{" "}
                  <span className="font-semibold text-slate-200">
                    {DENSITY_KG_PER_M3.toLocaleString()} kg/m³
                  </span>
                  :
                </div>

                <div className="overflow-hidden rounded-sm border border-slate-700">
                  <div className="grid grid-cols-[1fr,1fr] text-sm">
                    <div className="bg-slate-800/70 px-3 py-2 text-teal-400">Weight needed</div>
                    <div className="px-3 py-2 text-slate-100">
                      {nf(lb, 2)} lbs <span className="text-slate-400">or</span> {nf(kg, 2)} kg
                    </div>
                    <div className="bg-slate-800/70 px-3 py-2 text-teal-400">Using 60-lb bags</div>
                    <div className="px-3 py-2 text-slate-100">{nf(bags60, 2)} bags</div>
                    <div className="bg-slate-800/70 px-3 py-2 text-teal-400">Using 80-lb bags</div>
                    <div className="px-3 py-2 text-slate-100">{nf(bags80, 2)} bags</div>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  * Bag counts are fractional to show raw output. Round up to the next whole bag when ordering.
                </p>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

/** Shared field row (unit selector on the RIGHT) */
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
      <label className="text-left block text-sm text-teal-400 mb-1">{label}</label>
      <div className="flex flex-col items-stretch gap-3">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          value={value}
          onChange={(e) => onValue(Number(e.target.value))}
          className="flex-1 rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-teal-500/50 outline-none"
        />
        <select
          value={unit}
          onChange={(e) => onUnit(e.target.value as Unit)}
          className="w-40 rounded-sm border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-teal-500/50 outline-none"
        >
          {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
            <option key={u} value={u}>
              {UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
