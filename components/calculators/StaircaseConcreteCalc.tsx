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
  TabsContent,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type LinearUnit = "m" | "cm" | "mm" | "ft" | "in";
type Mode = "waist" | "solid";

const DENSITY_CONCRETE_KG_M3 = 2400; // normal-weight concrete

// ---------- helpers ----------
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

  const totalM3 = totals.m3;

  function copyBreakdown() {
    if (!totals.valid) return;
    const lines: string[] = [
      "Staircase Concrete Calculator",
      `Mode: ${mode === "waist" ? "Waist-slab" : "Solid (mass) stairs"}`,
      "",
      "Breakdown (m³):",
      ...Object.entries(breakdown).map(
        ([k, v]) => `- ${k}: ${toFixedSmart(v)}`
      ),
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
      () => alert("Copy failed. Please try again.")
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
  }

  return (
    <Card
      className="border-border shadow-sm bg-slate-800"
      
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-teal-400">
              Staircase Concrete Calculator
            </CardTitle>
            <p className="text-[var(--brand-subtle)] mt-1 text-sm">
              Estimate concrete volume for waist-slab or solid stairs with optional landings.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-700 p-2 rounded-md">
            <Label className="text-sm text-[var(--brand-subtle)]">Units</Label>
            <Select value={unit} onValueChange={(v: LinearUnit) => setUnit(v)}>
              <SelectTrigger className="w-[120px] bg-slate-800 ">
                <SelectValue placeholder="Units" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">meters (m)</SelectItem>
                <SelectItem value="cm">centimeters (cm)</SelectItem>
                <SelectItem value="mm">millimeters (mm)</SelectItem>
                <SelectItem value="ft">feet (ft)</SelectItem>
                <SelectItem value="in">inches (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Tabs
          value={mode}
          onValueChange={(v: string) => setMode(v as Mode)}
          className="w-full"
        >
          <TabsList className="bg-slate-900 w-full p-1">
            <TabsTrigger value="waist" className="data-[state=active]:bg-teal-400 data-[state=active]:text-white">
              Waist-Slab Stairs
            </TabsTrigger>
            <TabsTrigger value="solid" className="data-[state=active]:bg-teal-400 data-[state=active]:text-white">
              Solid (Mass) Stairs
            </TabsTrigger>
          </TabsList>

          {/* Shared fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="steps">Number of Steps</Label>
              <Input
                id="steps"
                inputMode="numeric"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g., 12"
                className="bg-slate-900"
              />
              <p className="text-xs text-[var(--brand-subtle)]">
                Count of risers (typical residential: 10–16)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tread">Tread / Step Depth ({unit})</Label>
              <Input
                id="tread"
                inputMode="decimal"
                value={tread}
                onChange={(e) => setTread(e.target.value)}
                placeholder={`e.g., ${unit === "m" ? "0.28" : unit === "ft" ? "0.92" : ""}`}
                className="bg-slate-900"
              />
              <p className="text-xs text-[var(--brand-subtle)]">Horizontal depth per step</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riser">Riser / Step Height ({unit})</Label>
              <Input
                id="riser"
                inputMode="decimal"
                value={riser}
                onChange={(e) => setRiser(e.target.value)}
                placeholder={`e.g., ${unit === "m" ? "0.17" : unit === "ft" ? "0.56" : ""}`}
                className="bg-slate-900"
              />
              <p className="text-xs text-[var(--brand-subtle)]">Vertical height per step</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Stair Width ({unit})</Label>
              <Input
                id="width"
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder={`e.g., ${unit === "m" ? "1.2" : unit === "ft" ? "4" : ""}`}
                className="bg-slate-900"
              />
              <p className="text-xs text-[var(--brand-subtle)]">Clear width of the flight</p>
            </div>
          </div>

          {/* Waist slab specific */}
          <TabsContent value="waist" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="waist">Waist Thickness ({unit})</Label>
                <Input
                  id="waist"
                  inputMode="decimal"
                  value={waistThk}
                  onChange={(e) => setWaistThk(e.target.value)}
                  placeholder={`e.g., ${unit === "m" ? "0.15" : unit === "in" ? "6" : ""}`}
                  className="bg-slate-900"
                />
                <p className="text-xs text-[var(--brand-subtle)]">
                  Thickness of the inclined slab
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Solid stairs info */}
          <TabsContent value="solid" className="mt-2">
            <p className="text-sm text-[var(--brand-subtle)]">
              Solid (mass) stairs approximate the flight as stacked rectangular steps.
              This is conservative and typically yields a larger volume than waist-slab stairs.
            </p>
          </TabsContent>

          {/* Landings */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--brand-primary)]">
                  Landings
                </h3>
                <p className="text-sm text-[var(--brand-subtle)]">
                  Include optional rectangular top and bottom landings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bottom Landing */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="flex-row items-center justify-between gap-2 py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={hasBottomLanding}
                      onCheckedChange={setHasBottomLanding}
                      id="bl-switch"
                    />
                    <Label htmlFor="bl-switch" className="text-base">
                      Bottom Landing
                    </Label>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
                      hasBottomLanding ? "" : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <div className="space-y-2">
                      <Label>Length ({unit})</Label>
                      <Input
                        inputMode="decimal"
                        value={blLen}
                        onChange={(e) => setBlLen(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Width ({unit})</Label>
                      <Input
                        inputMode="decimal"
                        value={blWid}
                        onChange={(e) => setBlWid(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Thickness ({unit})</Label>
                      <Input
                        inputMode="decimal"
                        value={blThk}
                        onChange={(e) => setBlThk(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Landing */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader className="flex-row items-center justify-between gap-2 py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={hasTopLanding}
                      onCheckedChange={setHasTopLanding}
                      id="tl-switch"
                    />
                    <Label htmlFor="tl-switch" className="text-base">
                      Top Landing
                    </Label>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
                      hasTopLanding ? "" : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <div className="space-y-2">
                      <Label>Length ({unit})</Label>
                      <Input
                        inputMode="decimal"
                        value={tlLen}
                        onChange={(e) => setTlLen(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Width ({unit})</Label>
                      <Input
                        inputMode="decimal"
                        value={tlWid}
                        onChange={(e) => setTlWid(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Thickness ({unit})</Label>
                      <Input
                        inputMode="decimal"
                        value={tlThk}
                        onChange={(e) => setTlThk(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold mb-1">Please fix the following:</p>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Results */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[var(--brand-primary)]">
            Results
          </h3>
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-slate-700 bg-teal-900">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-subtle)]">Total Volume</span>
                    <span className="font-semibold">{toFixedSmart(totals.m3)} m³</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-subtle)]">Cubic Feet</span>
                    <span className="font-semibold">{toFixedSmart(totals.ft3)} ft³</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-subtle)]">Cubic Yards</span>
                    <span className="font-semibold">{toFixedSmart(totals.yd3)} yd³</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-subtle)]">Liters</span>
                    <span className="font-semibold">{toFixedSmart(totals.liters)} L</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-teal-900">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-subtle)]">Weight (approx.)</span>
                    <span className="font-semibold">
                      {toFixedSmart(totals.kg)} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--brand-subtle)]">Metric Tons</span>
                    <span className="font-semibold">
                      {toFixedSmart(totals.tonnes)} t
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-teal-900">
              <CardContent className="pt-4">
                <div className="space-y-1">
                  <p className="text-sm text-[var(--brand-subtle)]">Breakdown (m³)</p>
                  <ul className="text-sm space-y-1">
                    {Object.entries(breakdown).length > 0 ? (
                      Object.entries(breakdown).map(([k, v]) => (
                        <li key={k} className="flex items-center justify-between">
                          <span>{k}</span>
                          <span className="font-medium">{toFixedSmart(v)}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[var(--brand-subtle)]">—</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onClick={copyBreakdown}
              className="bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-dark)]"
              disabled={!totals.valid}
            >
              Copy Breakdown
            </Button>
            <Button
              variant="outline"
              onClick={resetAll}
              className="border-[var(--brand-border)]"
            >
              Reset
            </Button>
          </div>

          <p className="mt-3 text-xs text-[var(--brand-subtle)]">
            Notes: Waist-slab model uses{" "}
            <span className="font-medium">waist thickness × width × sloped length</span> +
            triangular step wedges{" "}
            <span className="font-medium">0.5 × tread × riser × width × steps</span>. Landings are
            rectangular prisms. Results are approximate; verify against project drawings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
