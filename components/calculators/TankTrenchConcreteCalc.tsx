// components/calculators/TankTrenchConcreteCalc.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Copy, RotateCcw, Info } from "lucide-react";

// -----------------------------
// Types & Helpers
// -----------------------------
type LinearUnit = "meters" | "centimeters" | "feet" | "inches";
type VolumeResult = {
  core: number;   // m3
  withWaste: number; // m3
  breakdown?: Record<string, number>; // optional sections m3
};

const UNIT_FACTORS_TO_M = {
  meters: 1,
  centimeters: 0.01,
  feet: 0.3048,
  inches: 0.0254,
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, min = 0) => (isNaN(n) || n < min ? min : n);

// Convert any linear value to meters
function toMeters(value: number, unit: LinearUnit) {
  return clamp(value) * UNIT_FACTORS_TO_M[unit];
}

// Common small info chip
function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs text-[var(--brand-subtle)]">{children}</span>
  );
}

// Field wrapper
function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor} className="text-[var(--brand-primary)]">
          {label}
        </Label>
      </div>
      {children}
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </div>
  );
}

// Stat pill
function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-700 p-4 shadow-sm">
      <div className="text-sm text-[var(--brand-subtle)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[var(--brand-primary)]">
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-[var(--brand-subtle)]">{sub}</div> : null}
    </div>
  );
}

// -----------------------------
// Main Component
// -----------------------------
export default function TrenchTankConcreteCalc() {
  const [unit, setUnit] = React.useState<LinearUnit>("meters");
  const [wastePct, setWastePct] = React.useState<number>(5);

  // ---------- Trench ----------
  const [trenchMode, setTrenchMode] = React.useState<"rect" | "trap">("rect");
  const [trLen, setTrLen] = React.useState<number>(10);
  const [trWidth, setTrWidth] = React.useState<number>(0.6);
  const [trDepth, setTrDepth] = React.useState<number>(0.9);
  const [trTopWidth, setTrTopWidth] = React.useState<number>(0.8);
  const [trBottomWidth, setTrBottomWidth] = React.useState<number>(0.5);

  // ---------- Rectangular Tank ----------
  const [rtLen, setRtLen] = React.useState<number>(3);
  const [rtWid, setRtWid] = React.useState<number>(2);
  const [rtHt, setRtHt] = React.useState<number>(2);
  const [rtWallT, setRtWallT] = React.useState<number>(0.2);
  const [rtBaseT, setRtBaseT] = React.useState<number>(0.25);
  const [rtIncludeTop, setRtIncludeTop] = React.useState<boolean>(false);
  const [rtTopT, setRtTopT] = React.useState<number>(0.15);

  // ---------- Circular Tank ----------
  const [ctDia, setCtDia] = React.useState<number>(2.5);
  const [ctHt, setCtHt] = React.useState<number>(2);
  const [ctWallT, setCtWallT] = React.useState<number>(0.2);
  const [ctBaseT, setCtBaseT] = React.useState<number>(0.25);
  const [ctIncludeTop, setCtIncludeTop] = React.useState<boolean>(false);
  const [ctTopT, setCtTopT] = React.useState<number>(0.15);

  // -----------------------------
  // Calculations
  // -----------------------------
  const trenchResult = React.useMemo<VolumeResult>(() => {
    const L = toMeters(trLen, unit);
    const D = toMeters(trDepth, unit);

    let core = 0;
    if (trenchMode === "rect") {
      const W = toMeters(trWidth, unit);
      core = L * W * D;
    } else {
      // trapezoidal prism: area = depth * (top + bottom)/2
      const TW = toMeters(trTopWidth, unit);
      const BW = toMeters(trBottomWidth, unit);
      const avg = (TW + BW) / 2;
      core = L * D * avg;
    }
    const withWaste = core * (1 + clamp(wastePct) / 100);
    return { core, withWaste };
  }, [trLen, trWidth, trDepth, trTopWidth, trBottomWidth, trenchMode, unit, wastePct]);

  const rectTankResult = React.useMemo<VolumeResult>(() => {
    // Inner dimensions
    const Li = toMeters(rtLen, unit);
    const Wi = toMeters(rtWid, unit);
    const Hi = toMeters(rtHt, unit);
    const tW = toMeters(rtWallT, unit);
    const tB = toMeters(rtBaseT, unit);
    const tT = rtIncludeTop ? toMeters(rtTopT, unit) : 0;

    const Lo = Li + 2 * tW;
    const Wo = Wi + 2 * tW;
    const Ho = Hi + tB + tT;

    const outerVol = Lo * Wo * Ho;
    const innerVol = Li * Wi * Hi;
    const core = Math.max(outerVol - innerVol, 0);

    // Rough breakdowns (optional, useful in UI)
    const baseVol = Lo * Wo * tB;
    const topVol = tT > 0 ? Lo * Wo * tT : 0;
    const wallsVol = core - baseVol - topVol;

    const withWaste = core * (1 + clamp(wastePct) / 100);
    return {
      core,
      withWaste,
      breakdown: {
        baseSlab: baseVol,
        walls: Math.max(wallsVol, 0),
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
    const wallsVol = core - baseVol - topVol;

    const withWaste = core * (1 + clamp(wastePct) / 100);
    return {
      core,
      withWaste,
      breakdown: {
        baseSlab: baseVol,
        walls: Math.max(wallsVol, 0),
        coverSlab: topVol,
      },
    };
  }, [ctDia, ctHt, ctWallT, ctBaseT, ctIncludeTop, ctTopT, unit, wastePct]);

  // -----------------------------
  // UI Helpers
  // -----------------------------
  const resetAll = () => {
    setUnit("meters");
    setWastePct(5);
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
  };

  const copySummary = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied summary!");
    } catch {
      alert("Copy failed. Your browser may block clipboard access.");
    }
  };

  const formatM3 = (m3: number) => `${round2(m3)} m³`;
  const m3ToYd3 = (m3: number) => m3 * 1.30795062;
  const m3ToFt3 = (m3: number) => m3 * 35.3146667;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <TooltipProvider>
      <Card className="bg-slate-800 border-border shadow-md">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl font-bold text-teal-400">
                Trench &amp; Tank Concrete Calculator
              </CardTitle>
              <p className="mt-1 text-sm text-[var(--brand-subtle)]">
                Estimate concrete for foundation trenches and water tanks (rectangular or circular).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={resetAll} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {/* Global Controls */}
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Units">
              <Select value={unit} onValueChange={(v) => setUnit(v as LinearUnit)}>
                <SelectTrigger className="bg-slate-900 w-full">
                  <SelectValue placeholder="Choose unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">Meters (m)</SelectItem>
                  <SelectItem value="centimeters">Centimeters (cm)</SelectItem>
                  <SelectItem value="feet">Feet (ft)</SelectItem>
                  <SelectItem value="inches">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Waste Factor (%)" hint="Adds extra concrete to account for spillage, over-excavation, and losses.">
              <Input
                type="number"
                min={0}
                step="1"
                value={wastePct}
                onChange={(e) => setWastePct(Number(e.target.value))}
                className="bg-slate-900 w-full"
              />
            </Field>

            <div className="flex items-end">
              <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-muted)]/60 px-4 py-3 text-sm text-[var(--brand-subtle)]">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Tip: Use inner (clear) dimensions for tanks.</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <Tabs defaultValue="trench" className="w-full">
            <TabsList className="flex w-full flex-wrap gap-2 bg-slate-700">
              <TabsTrigger value="trench" className="data-[state=active]:bg-teal-400 data-[state=active]:text-slate-900 rounded-full">
                Trench
              </TabsTrigger>
              <TabsTrigger value="rectTank" className="data-[state=active]:bg-teal-400 data-[state=active]:text-slate-900 rounded-full">
                Rectangular Tank
              </TabsTrigger>
              <TabsTrigger value="circTank" className="data-[state=active]:bg-teal-400 data-[state=active]:text-slate-900 rounded-full">
                Circular Tank
              </TabsTrigger>
            </TabsList>

            {/* -------------------- TRENCH -------------------- */}
            <TabsContent value="trench" className=" mt-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className=" bg-slate-900 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-[var(--brand-primary)]">Trench Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-teal-400 bg-[var(--brand-muted)]/60 p-3 ">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-[var(--brand-primary)]">Trench Shape</div>
                        <div className="text-xs text-[var(--brand-subtle)]">
                          Choose rectangular or trapezoidal section.
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={trenchMode === "rect" ? "default" : "outline"}
                          onClick={() => setTrenchMode("rect")}
                          className="rounded-full"
                        >
                          Rectangular
                        </Button>
                        <Button
                          variant={trenchMode === "trap" ? "default" : "outline"}
                          onClick={() => setTrenchMode("trap")}
                          className="rounded-full"
                        >
                          Trapezoidal
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label={`Length (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={trLen}
                          onChange={(e) => setTrLen(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>

                      {trenchMode === "rect" ? (
                        <Field label={`Width (${unit})`}>
                          <Input
                            type="number"
                            min={0}
                            value={trWidth}
                            onChange={(e) => setTrWidth(Number(e.target.value))}
                            className="bg-slate-700"
                          />
                        </Field>
                      ) : (
                        <>
                          <Field label={`Top Width (${unit})`}>
                            <Input
                              type="number"
                              min={0}
                              value={trTopWidth}
                              onChange={(e) => setTrTopWidth(Number(e.target.value))}
                              className="bg-slate-700"
                            />
                          </Field>
                          <Field label={`Bottom Width (${unit})`}>
                            <Input
                              type="number"
                              min={0}
                              value={trBottomWidth}
                              onChange={(e) => setTrBottomWidth(Number(e.target.value))}
                              className="bg-slate-700"
                            />
                          </Field>
                        </>
                      )}

                      <Field label={`Depth (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={trDepth}
                          onChange={(e) => setTrDepth(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-[var(--brand-primary)]">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Stat label="Concrete (net)" value={formatM3(trenchResult.core)} sub={`${round2(m3ToYd3(trenchResult.core))} yd³ · ${round2(m3ToFt3(trenchResult.core))} ft³`} />
                      <Stat label={`Concrete (+${wastePct}% waste)`} value={formatM3(trenchResult.withWaste)} sub={`${round2(m3ToYd3(trenchResult.withWaste))} yd³ · ${round2(m3ToFt3(trenchResult.withWaste))} ft³`} />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                          copySummary(
                            `TRENCH SUMMARY:
- Shape: ${trenchMode === "rect" ? "Rectangular" : "Trapezoidal"}
- Units: ${unit}
- Net concrete: ${round2(trenchResult.core)} m3
- With waste (${wastePct}%): ${round2(trenchResult.withWaste)} m3
(yd3: ${round2(m3ToYd3(trenchResult.withWaste))}, ft3: ${round2(m3ToFt3(trenchResult.withWaste))})`
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>

                    <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-muted)]/60 p-3 text-xs text-[var(--brand-subtle)]">
                      <strong className="text-[var(--brand-primary)]">Mix Tip:</strong> Common foundation mixes: 1:2:4 (C20/25) or per structural design.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ----------------- RECTANGULAR TANK ----------------- */}
            <TabsContent value="rectTank" className="mt-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="bg-slate-900 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-[var(--brand-primary)]">Rectangular Tank Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label={`Inner Length (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={rtLen}
                          onChange={(e) => setRtLen(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                      <Field label={`Inner Width (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={rtWid}
                          onChange={(e) => setRtWid(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                      <Field label={`Inner Height (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={rtHt}
                          onChange={(e) => setRtHt(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label={`Wall Thickness (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={rtWallT}
                          onChange={(e) => setRtWallT(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                      <Field label={`Base Slab Thickness (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={rtBaseT}
                          onChange={(e) => setRtBaseT(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>

                      <div className="space-y-2">
                        <Label className="text-[var(--brand-primary)]">Include Cover Slab?</Label>
                        <div className="flex items-center gap-3 rounded-xl border border-[var(--brand-border)] bg-slate-700 p-2">
                          <Switch checked={rtIncludeTop} onCheckedChange={setRtIncludeTop} />
                          <span className="text-sm text-[var(--brand-subtle)]">Adds top thickness to volume</span>
                        </div>
                      </div>

                      {rtIncludeTop && (
                        <Field label={`Cover Slab Thickness (${unit})`}>
                          <Input
                            type="number"
                            min={0}
                            value={rtTopT}
                            onChange={(e) => setRtTopT(Number(e.target.value))}
                            className="bg-slate-700"
                          />
                        </Field>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-[var(--brand-primary)]">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Stat
                        label="Concrete (net)"
                        value={formatM3(rectTankResult.core)}
                        sub={`${round2(m3ToYd3(rectTankResult.core))} yd³ · ${round2(m3ToFt3(rectTankResult.core))} ft³`}
                      />
                      <Stat
                        label={`Concrete (+${wastePct}% waste)`}
                        value={formatM3(rectTankResult.withWaste)}
                        sub={`${round2(m3ToYd3(rectTankResult.withWaste))} yd³ · ${round2(m3ToFt3(rectTankResult.withWaste))} ft³`}
                      />
                    </div>

                    {rectTankResult.breakdown && (
                      <div className="rounded-2xl bg-slate-700 p-3 text-sm">
                        <div className="font-medium text-[var(--brand-primary)]">Breakdown (m³)</div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[var(--brand-subtle)]">
                          <div className="rounded-lg bg-[var(--brand-muted)]/60 p-2">
                            Base Slab: <span className="font-semibold text-[var(--brand-primary)]">{round2(rectTankResult.breakdown.baseSlab)}</span>
                          </div>
                          <div className="rounded-lg bg-[var(--brand-muted)]/60 p-2">
                            Walls: <span className="font-semibold text-[var(--brand-primary)]">{round2(rectTankResult.breakdown.walls)}</span>
                          </div>
                          <div className="rounded-lg bg-[var(--brand-muted)]/60 p-2">
                            Cover Slab: <span className="font-semibold text-[var(--brand-primary)]">{round2(rectTankResult.breakdown.coverSlab)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                          copySummary(
                            `RECTANGULAR TANK SUMMARY:
- Units: ${unit}
- Net concrete: ${round2(rectTankResult.core)} m3
- With waste (${wastePct}%): ${round2(rectTankResult.withWaste)} m3
- Breakdown (m3): base=${round2(rectTankResult.breakdown?.baseSlab ?? 0)}, walls=${round2(rectTankResult.breakdown?.walls ?? 0)}, cover=${round2(rectTankResult.breakdown?.coverSlab ?? 0)}
(yd3: ${round2(m3ToYd3(rectTankResult.withWaste))}, ft3: ${round2(m3ToFt3(rectTankResult.withWaste))})`
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>

                    <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-muted)]/60 p-3 text-xs text-[var(--brand-subtle)]">
                      <strong className="text-[var(--brand-primary)]">Water-Retention Note:</strong> Use appropriate waterproofing, cover slab design, and joint treatment as per structural drawings.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ----------------- CIRCULAR TANK ----------------- */}
            <TabsContent value="circTank" className="mt-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="bg-slate-900 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-[var(--brand-primary)]">Circular Tank Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label={`Inner Diameter (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={ctDia}
                          onChange={(e) => setCtDia(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                      <Field label={`Inner Height (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={ctHt}
                          onChange={(e) => setCtHt(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                      <Field label={`Wall Thickness (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={ctWallT}
                          onChange={(e) => setCtWallT(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label={`Base Slab Thickness (${unit})`}>
                        <Input
                          type="number"
                          min={0}
                          value={ctBaseT}
                          onChange={(e) => setCtBaseT(Number(e.target.value))}
                          className="bg-slate-700"
                        />
                      </Field>

                      <div className="space-y-2">
                        <Label className="text-[var(--brand-primary)]">Include Cover Slab?</Label>
                        <div className="flex items-center gap-3 rounded-xl border border-[var(--brand-border)] bg-slate-700 p-2">
                          <Switch checked={ctIncludeTop} onCheckedChange={setCtIncludeTop} />
                          <span className="text-sm text-[var(--brand-subtle)]">Adds top thickness to volume</span>
                        </div>
                      </div>

                      {ctIncludeTop && (
                        <Field label={`Cover Slab Thickness (${unit})`}>
                          <Input
                            type="number"
                            min={0}
                            value={ctTopT}
                            onChange={(e) => setCtTopT(Number(e.target.value))}
                            className="bg-slate-700"
                          />
                        </Field>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-[var(--brand-primary)]">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Stat
                        label="Concrete (net)"
                        value={formatM3(circTankResult.core)}
                        sub={`${round2(m3ToYd3(circTankResult.core))} yd³ · ${round2(m3ToFt3(circTankResult.core))} ft³`}
                      />
                      <Stat
                        label={`Concrete (+${wastePct}% waste)`}
                        value={formatM3(circTankResult.withWaste)}
                        sub={`${round2(m3ToYd3(circTankResult.withWaste))} yd³ · ${round2(m3ToFt3(circTankResult.withWaste))} ft³`}
                      />
                    </div>

                    {circTankResult.breakdown && (
                      <div className="rounded-2xl bg-slate-700 p-3 text-sm">
                        <div className="font-medium text-[var(--brand-primary)]">Breakdown (m³)</div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[var(--brand-subtle)]">
                          <div className="rounded-lg bg-[var(--brand-muted)]/60 p-2">
                            Base Slab: <span className="font-semibold text-[var(--brand-primary)]">{round2(circTankResult.breakdown.baseSlab)}</span>
                          </div>
                          <div className="rounded-lg bg-[var(--brand-muted)]/60 p-2">
                            Walls: <span className="font-semibold text-[var(--brand-primary)]">{round2(circTankResult.breakdown.walls)}</span>
                          </div>
                          <div className="rounded-lg bg-[var(--brand-muted)]/60 p-2">
                            Cover Slab: <span className="font-semibold text-[var(--brand-primary)]">{round2(circTankResult.breakdown.coverSlab)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                          copySummary(
                            `CIRCULAR TANK SUMMARY:
- Units: ${unit}
- Net concrete: ${round2(circTankResult.core)} m3
- With waste (${wastePct}%): ${round2(circTankResult.withWaste)} m3
- Breakdown (m3): base=${round2(circTankResult.breakdown?.baseSlab ?? 0)}, walls=${round2(circTankResult.breakdown?.walls ?? 0)}, cover=${round2(circTankResult.breakdown?.coverSlab ?? 0)}
(yd3: ${round2(m3ToYd3(circTankResult.withWaste))}, ft3: ${round2(m3ToFt3(circTankResult.withWaste))})`
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>

                    <div className="rounded-xl border border-teal-400 bg-[var(--brand-muted)]/60 p-3 text-xs text-[var(--brand-subtle)]">
                      <strong className="text-teal-400">Design Tip:</strong> Confirm wall thickness, joints, and reinforcement with a structural engineer for hydrostatic pressure.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer notes */}
          <div className="mt-6 rounded-2xl border border-teal-400 bg-slate-700 p-4 text-xs text-[var(--brand-subtle)]">
            <p>
              <strong className="text-[var(--brand-primary)]">Assumptions:</strong> Tank volumes use the shell method (outer volume minus inner volume), which accounts for base slab, walls, and optional cover slab. Trench volume is a prismatic approximation (rectangular or trapezoidal section).
            </p>
            <p className="mt-2">
              Always verify dimensions on drawings. For ordering, add waste according to site conditions and supplier guidance.
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
