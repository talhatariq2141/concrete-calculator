"use client";

import React from "react";

/* -------------------------------------------------------------
   ConcreteYardsCalc.tsx
   - Centralized units for ALL inputs (length, width/diameter, thickness)
   - Shapes: Rectangle/Slab or Circular
   - Outputs: Cubic Yards (primary), plus ft³ and m³
   - Optional waste allowance
   - UI Spec:
     * Container bg: slate-900
     * Inputs/dropdowns bg: slate-800
     * Headings/labels: white
     * Focus border: teal-400
     * Calculate button: teal-400
-------------------------------------------------------------- */

type Shape = "rectangle" | "circle";
type LinearUnit =
  | "feet"
  | "inches"
  | "yards"
  | "meters"
  | "centimeters"
  | "millimeters";

const inputBase = "bg-slate-700 text-white placeholder-slate-400 border border-transparent mt-1 focus:border-teal-400 focus:outline-none rounded-lg h-11 px-3 w-full";
const labelBase = "text-white text-sm";
const group = "grid grid-cols-1 sm:grid-cols-2 gap-4";
const card = "bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800";

export default function ConcreteYardsCalc() {
  // Shape & units (centralized)
  const [shape, setShape] = React.useState<Shape>("rectangle");
  const [unit, setUnit] = React.useState<LinearUnit>("feet");

  // Dimensions (all in chosen unit)
  const [length, setLength] = React.useState<string>(""); // rectangle only
  const [width, setWidth] = React.useState<string>(""); // rectangle only
  const [diameter, setDiameter] = React.useState<string>(""); // circle only
  const [thickness, setThickness] = React.useState<string>("");

  // Waste allowance
  const [wastePct, setWastePct] = React.useState<number>(0);

  // Results
  const [ft3, setFt3] = React.useState<number | null>(null);
  const [yd3, setYd3] = React.useState<number | null>(null);
  const [m3, setM3] = React.useState<number | null>(null);

  const [error, setError] = React.useState<string>("");

  // -------- Conversion helpers --------
  function linToFeet(v: number, u: LinearUnit): number {
    switch (u) {
      case "feet":
        return v;
      case "inches":
        return v / 12;
      case "yards":
        return v * 3;
      case "meters":
        return v * 3.280839895; // exact enough
      case "centimeters":
        return (v / 100) * 3.280839895;
      case "millimeters":
        return (v / 1000) * 3.280839895;
      default:
        return v;
    }
  }

  function feet3ToYards3(ft3: number): number {
    return ft3 / 27;
  }

  function feet3ToMeters3(ft3: number): number {
    // 1 ft = 0.3048 m => 1 ft³ = 0.028316846592 m³
    return ft3 * 0.028316846592;
  }

  // -------- Compute --------
  function compute() {
    setError("");

    const T = Number(thickness);
    if (!Number.isFinite(T) || T <= 0) {
      setError("Enter a valid thickness.");
      clearResults();
      return;
    }

    // Convert thickness to feet
    const t_ft = linToFeet(T, unit);

    let volume_ft3 = 0;

    if (shape === "rectangle") {
      const L = Number(length);
      const W = Number(width);

      if (!Number.isFinite(L) || L <= 0) {
        setError("Enter a valid length.");
        clearResults();
        return;
      }
      if (!Number.isFinite(W) || W <= 0) {
        setError("Enter a valid width.");
        clearResults();
        return;
      }

      const L_ft = linToFeet(L, unit);
      const W_ft = linToFeet(W, unit);

      volume_ft3 = L_ft * W_ft * t_ft;
    } else {
      // circle
      const D = Number(diameter);
      if (!Number.isFinite(D) || D <= 0) {
        setError("Enter a valid diameter.");
        clearResults();
        return;
      }

      const D_ft = linToFeet(D, unit);
      const r_ft = D_ft / 2;
      volume_ft3 = Math.PI * r_ft * r_ft * t_ft;
    }

    // Apply waste allowance
    const vol_with_waste_ft3 = volume_ft3 * (1 + wastePct / 100);

    const yards3 = feet3ToYards3(vol_with_waste_ft3);
    const meters3 = feet3ToMeters3(vol_with_waste_ft3);

    setFt3(Number(vol_with_waste_ft3.toFixed(2)));
    setYd3(Number(yards3.toFixed(2)));
    setM3(Number(meters3.toFixed(3))); // m³ with 3 decimals
  }

  function clearResults() {
    setFt3(null);
    setYd3(null);
    setM3(null);
  }

  function resetAll() {
    setShape("rectangle");
    setUnit("feet");
    setLength("");
    setWidth("");
    setDiameter("");
    setThickness("");
    setWastePct(0);
    setError("");
    clearResults();
  }

  // -------- UI --------
  return (
    <section className={card} aria-labelledby="concrete-yards-calc">
      <header className="mb-6 md:mb-8">
        <h2
          id="concrete-yards-calc"
          className="text-teal-400 text-2xl md:text-3xl font-bold"
        >
          Concrete Yards Calculator (Centralized Units)
        </h2>
        <p className="text-white/70 mt-2 text-sm md:text-base">
          Choose a shape, set one unit for all dimensions, and get concrete volume in{" "}
          <strong>cubic yards</strong>. Add a waste allowance to avoid shortages.
        </p>
      </header>

      {/* Shape & Units */}
      <div className={group}>
        <div className="space-y-2">
          <label className={labelBase} htmlFor="shape">
            Shape
          </label>
          <select
            id="shape"
            className={`${inputBase} pr-8`}
            value={shape}
            onChange={(e) => {
              setShape(e.target.value as Shape);
              clearResults();
            }}
          >
            <option value="rectangle">Rectangle / Slab</option>
            <option value="circle">Circular</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={labelBase} htmlFor="unit">
            Input Units (applies to all fields)
          </label>
          <select
            id="unit"
            className={`${inputBase} pr-8`}
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as LinearUnit);
              clearResults();
            }}
          >
            <option value="feet">Feet (ft)</option>
            <option value="inches">Inches (in)</option>
            <option value="yards">Yards (yd)</option>
            <option value="meters">Meters (m)</option>
            <option value="centimeters">Centimeters (cm)</option>
            <option value="millimeters">Millimeters (mm)</option>
          </select>
        </div>
      </div>

      {/* Dimensions */}
      {shape === "rectangle" ? (
        <div className={`${group} mt-4`}>
          <div className="space-y-2">
            <label className={labelBase} htmlFor="length">
              Length ({unit})
            </label>
            <input
              id="length"
              type="number"
              inputMode="decimal"
              placeholder={`e.g., ${unit === "inches" ? "120" : "10"}`}
              className={inputBase}
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className={labelBase} htmlFor="width">
              Width ({unit})
            </label>
            <input
              id="width"
              type="number"
              inputMode="decimal"
              placeholder={`e.g., ${unit === "inches" ? "144" : "12"}`}
              className={inputBase}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className={`${group} mt-4`}>
          <div className="space-y-2">
            <label className={labelBase} htmlFor="diameter">
              Diameter ({unit})
            </label>
            <input
              id="diameter"
              type="number"
              inputMode="decimal"
              placeholder={`e.g., ${unit === "inches" ? "144" : "12"}`}
              className={inputBase}
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
            />
          </div>
          <div />
        </div>
      )}

      <div className={`${group} mt-4`}>
        <div className="space-y-2">
          <label className={labelBase} htmlFor="thickness">
            Thickness ({unit})
          </label>
          <input
            id="thickness"
            type="number"
            inputMode="decimal"
            placeholder={
              unit === "inches" ? "e.g., 6" : unit === "centimeters" ? "e.g., 15" : "e.g., 0.5"
            }
            className={inputBase}
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className={labelBase} htmlFor="waste">
            Waste Allowance
          </label>
          <select
            id="waste"
            className={`${inputBase} pr-8`}
            value={wastePct}
            onChange={(e) => setWastePct(Number(e.target.value))}
          >
            <option value={0}>0% (no waste)</option>
            <option value={5}>5% (recommended minimum)</option>
            <option value={10}>10% (uneven subgrade)</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={compute}
          className="h-11 rounded-lg bg-teal-400 px-5 font-semibold text-slate-900 shadow-sm hover:opacity-90 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Calculate
        </button>

        <button
          type="button"
          onClick={resetAll}
          className="h-11 rounded-lg px-4 font-medium border border-transparent bg-slate-800 text-white hover:bg-slate-800/90 focus:outline-none focus:border-teal-400"
        >
          Reset
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-300 text-sm" role="alert">
          {error}
        </p>
      )}

      {/* Results */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-800 p-4">
        <h3 className="text-white font-semibold text-lg">Results</h3>
        {yd3 === null ? (
          <p className="text-white/70 mt-2 text-sm">
            Enter values and click <span className="font-semibold">Calculate</span>.
          </p>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg p-3 bg-slate-900/40 border border-slate-700">
                <p className="text-white/70 text-xs">Cubic Yards (yd³)</p>
                <p className="text-white text-2xl font-bold">{yd3}</p>
              </div>
              <div className="rounded-lg p-3 bg-slate-900/40 border border-slate-700">
                <p className="text-white/70 text-xs">Cubic Feet (ft³)</p>
                <p className="text-white text-2xl font-bold">{ft3}</p>
              </div>
              <div className="rounded-lg p-3 bg-slate-900/40 border border-slate-700">
                <p className="text-white/70 text-xs">Cubic Meters (m³)</p>
                <p className="text-white text-2xl font-bold">{m3}</p>
              </div>
            </div>
            <p className="text-white/70 mt-3 text-sm">
              Tip: Choosing a small <strong>waste allowance</strong> (5–10%) helps prevent
              shortages due to spillage, uneven subgrade, or pump line losses.
            </p>
          </>
        )}
      </div>

      {/* Footnotes */}
      <div className="mt-6 text-white/70 text-xs space-y-2 leading-relaxed">
        <p>
          Rectangle/Slab formula: <span className="text-white font-semibold">V = L × W × T</span>
        </p>
        <p>
          Circular formula: <span className="text-white font-semibold">V = π × (D/2)² × T</span>
        </p>
        <p>
          Conversions: <span className="text-white font-semibold">1 yd³ = 27 ft³</span>, &nbsp;
          <span className="text-white font-semibold">1 ft³ = 0.028316846592 m³</span>.
        </p>
        <p>
          All inputs use the <span className="text-white font-semibold">same unit</span> chosen in
          the “Input Units” selector for consistency.
        </p>
      </div>
    </section>
  );
}
