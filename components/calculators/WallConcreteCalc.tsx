"use client";

import React from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus, Trash2, RotateCcw } from "lucide-react";

/* =====================================================================================
   Types & Constants
===================================================================================== */

type LinearUnit = "m" | "ft";
type ThickUnit = "m" | "cm" | "in";
type VolumeUnit = "m3" | "ft3" | "yd3";

type Opening = {
  id: string;
  width: number | "";
  height: number | "";
  count: number | "";
};

type Mix = "1:1.5:3" | "1:2:4" | "1:3:6";

const MIX_PARTS: Record<Mix, { c: number; s: number; a: number; total: number }> =
  {
    "1:1.5:3": { c: 1, s: 1.5, a: 3, total: 5.5 },
    "1:2:4": { c: 1, s: 2, a: 4, total: 7 },
    "1:3:6": { c: 1, s: 3, a: 6, total: 10 },
  };

// Physics / industry constants (adjustable in UI where needed)
const DENSITY_CONCRETE_KG_M3 = 2400; // typical fresh concrete density
const BULK_DENSITY_CEMENT_KG_M3 = 1440; // OPC bulk density
const CEMENT_BAG_KG = 50;
const DRY_LOSS_FACTOR = 1.54; // converts wet volume -> dry ingredient volume
const M3_TO_FT3 = 35.3146667;
const M3_TO_YD3 = 1.30795062;
const IN_TO_M = 0.0254;
const FT_TO_M = 0.3048;
const CM_TO_M = 0.01;

/* =====================================================================================
   Helpers
===================================================================================== */

function toMeters(value: number, unit: LinearUnit | ThickUnit): number {
  if (unit === "m") return value;
  if (unit === "ft") return value * FT_TO_M;
  if (unit === "cm") return value * CM_TO_M;
  if (unit === "in") return value * IN_TO_M;
  return value;
}

function format(num: number, digits = 3): string {
  if (!isFinite(num)) return "—";
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* =====================================================================================
   Component
===================================================================================== */

export default function WallConcreteCalc() {
  // ---------------- Units ----------------
  const [lenUnit, setLenUnit] = React.useState<LinearUnit>("m");
  const [thickUnit, setThickUnit] = React.useState<ThickUnit>("cm");
  const [outVolUnit, setOutVolUnit] = React.useState<VolumeUnit>("m3");

  // ---------------- Wall inputs ----------------
  const [length, setLength] = React.useState<number | "">("");
  const [height, setHeight] = React.useState<number | "">("");
  const [thickness, setThickness] = React.useState<number | "">("");

  // ---------------- Openings ----------------
  const [openings, setOpenings] = React.useState<Opening[]>([
    { id: uid(), width: "", height: "", count: "" },
  ]);

  // ---------------- Mix & water ----------------
  const [mix, setMix] = React.useState<Mix>("1:2:4");
  const [wcr, setWcr] = React.useState<number>(0.5); // water-cement ratio

  // ---------------- Costs (optional) ----------------
  const [costMode, setCostMode] = React.useState<"perM3" | "byMaterials">("perM3");
  const [ratePerM3, setRatePerM3] = React.useState<number | "">("");
  const [cementBagPrice, setCementBagPrice] = React.useState<number | "">("");
  const [sandPricePerM3, setSandPricePerM3] = React.useState<number | "">("");
  const [aggPricePerM3, setAggPricePerM3] = React.useState<number | "">("");

  // ---------------- Derived volumes ----------------
  const wallVolumeM3 = React.useMemo(() => {
    const L = typeof length === "number" ? toMeters(length, lenUnit) : 0;
    const H = typeof height === "number" ? toMeters(height, lenUnit) : 0;
    const T =
      typeof thickness === "number" ? toMeters(thickness, thickUnit) : 0;
    if (L <= 0 || H <= 0 || T <= 0) return 0;
    return L * H * T;
  }, [length, height, thickness, lenUnit, thickUnit]);

  const openingsVolumeM3 = React.useMemo(() => {
    return openings.reduce((sum, o) => {
      const w = typeof o.width === "number" ? toMeters(o.width, lenUnit) : 0;
      const h = typeof o.height === "number" ? toMeters(o.height, lenUnit) : 0;
      const c = typeof o.count === "number" ? o.count : 0;
      const T =
        typeof thickness === "number" ? toMeters(thickness, thickUnit) : 0;
      if (w > 0 && h > 0 && c > 0 && T > 0) {
        sum += w * h * T * c;
      }
      return sum;
    }, 0);
  }, [openings, lenUnit, thickness, thickUnit]);

  const netVolumeM3 = Math.max(0, wallVolumeM3 - openingsVolumeM3);

  const volumeOut = React.useMemo(() => {
    if (outVolUnit === "m3") return netVolumeM3;
    if (outVolUnit === "ft3") return netVolumeM3 * M3_TO_FT3;
    return netVolumeM3 * M3_TO_YD3; // yd3
  }, [netVolumeM3, outVolUnit]);

  // ---------------- Materials from mix ----------------
  const parts = MIX_PARTS[mix];
  const dryVol = netVolumeM3 * DRY_LOSS_FACTOR; // m3 of dry ingredients

  // Cement
  const cementVol = (parts.c / parts.total) * dryVol; // m3
  const cementKg = cementVol * BULK_DENSITY_CEMENT_KG_M3; // kg
  const cementBags = cementKg / CEMENT_BAG_KG; // bags

  // Sand & aggregate (volumes in m3)
  const sandVolM3 = (parts.s / parts.total) * dryVol;
  const aggVolM3 = (parts.a / parts.total) * dryVol;

  // Water
  const waterKg = cementKg * wcr; // approx 1 kg ~ 1 liter
  const waterLiters = waterKg;

  // ---------------- Costing ----------------
  const totalCost = React.useMemo(() => {
    if (costMode === "perM3") {
      const rate = typeof ratePerM3 === "number" ? ratePerM3 : 0;
      return netVolumeM3 * rate;
    } else {
      const bagPrice = typeof cementBagPrice === "number" ? cementBagPrice : 0;
      const sandP = typeof sandPricePerM3 === "number" ? sandPricePerM3 : 0;
      const aggP = typeof aggPricePerM3 === "number" ? aggPricePerM3 : 0;
      return cementBags * bagPrice + sandVolM3 * sandP + aggVolM3 * aggP;
    }
  }, [
    costMode,
    ratePerM3,
    netVolumeM3,
    cementBags,
    cementBagPrice,
    sandVolM3,
    sandPricePerM3,
    aggVolM3,
    aggPricePerM3,
  ]);

  // ---------------- Actions ----------------
  function addOpening() {
    setOpenings((prev) => [
      ...prev,
      { id: uid(), width: "", height: "", count: "" },
    ]);
  }
  function removeOpening(id: string) {
    setOpenings((prev) => prev.filter((o) => o.id !== id));
  }
  function resetAll() {
    setLenUnit("m");
    setThickUnit("cm");
    setOutVolUnit("m3");
    setLength("");
    setHeight("");
    setThickness("");
    setOpenings([{ id: uid(), width: "", height: "", count: "" }]);
    setMix("1:2:4");
    setWcr(0.5);
    setCostMode("perM3");
    setRatePerM3("");
    setCementBagPrice("");
    setSandPricePerM3("");
    setAggPricePerM3("");
  }

  /* ===================================================================================
     UI
  =================================================================================== */

  return (
    <Card
      className="bg-slate-800 shadow-sm"
      
    >
      <CardHeader className=" border-[var(--brand-border)]">
        <CardTitle
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--brand-primary)" }}
        >
        <span className="text-teal-400 text-3xl">Wall Concrete Calculator</span>
        </CardTitle>
        <p className="text-sm" style={{ color: "var(--brand-subtle)" }}>
          Estimate concrete for straight walls with optional door/window openings. Choose units,
          mix, and (optionally) costs. Results are rounded for clarity.
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-teal-700">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="openings">Openings</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* ---------------- Inputs Tab ---------------- */}
          <TabsContent value="inputs" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Length</Label>
                <div className="flex gap-2">
                  <Input
                    inputMode="decimal"
                    placeholder="e.g., 12"
                    value={length}
                    onChange={(e) =>
                      setLength(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="bg-slate-900 rounded-2xl"
                  />
                  <Select value={lenUnit} onValueChange={(v) => setLenUnit(v as LinearUnit)}>
                    <SelectTrigger className="bg-slate-700 w-28 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                  Total wall length
                </p>
              </div>

              <div className="space-y-2">
                <Label>Height</Label>
                <div className="flex gap-2">
                  <Input
                    inputMode="decimal"
                    placeholder="e.g., 3"
                    value={height}
                    onChange={(e) =>
                      setHeight(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="bg-slate-900 rounded-2xl"
                  />
                  <Select value={lenUnit} onValueChange={(v) => setLenUnit(v as LinearUnit)}>
                    <SelectTrigger className="bg-slate-700 w-28 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                  Wall height (use same unit as length)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Thickness</Label>
                <div className="flex gap-2">
                  <Input
                    inputMode="decimal"
                    placeholder="e.g., 20"
                    value={thickness}
                    onChange={(e) =>
                      setThickness(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="bg-slate-900 rounded-2xl"
                  />
                  <Select
                    value={thickUnit}
                    onValueChange={(v) => setThickUnit(v as ThickUnit)}
                  >
                    <SelectTrigger className="bg-slate-700 w-28 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="in">in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                  Wall width / thickness
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Nominal Mix</Label>
                <Select value={mix} onValueChange={(v) => setMix(v as Mix)}>
                  <SelectTrigger className="bg-slate-900 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1.5:3">1:1.5:3 (M20 approx)</SelectItem>
                    <SelectItem value="1:2:4">1:2:4 (M15 approx)</SelectItem>
                    <SelectItem value="1:3:6">1:3:6 (M10 approx)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                  Cement : Sand : Aggregate (by volume)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Water–Cement Ratio</Label>
                <div className="flex gap-2">
                  <Input
                    inputMode="decimal"
                    value={wcr}
                    onChange={(e) => setWcr(Number(e.target.value))}
                    className=" bg-slate-900 rounded-2xl"
                  />
                  <div className="text-sm grid place-items-center px-3 rounded-2xl border bg-slate-700">
                    w/c
                  </div>
                </div>
                <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                  Typical 0.45–0.6 (higher → more water)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Output Volume Unit</Label>
                <Select value={outVolUnit} onValueChange={(v) => setOutVolUnit(v as VolumeUnit)}>
                  <SelectTrigger className="bg-slate-900 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m3">m³</SelectItem>
                    <SelectItem value="ft3">ft³</SelectItem>
                    <SelectItem value="yd3">yd³</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                className="bg-slate-900 hover:bg-slate-700 rounded-2xl"
                onClick={resetAll}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </TabsContent>

          {/* ---------------- Openings Tab ---------------- */}
          <TabsContent value="openings" className="mt-6 space-y-4">
            <div
              className="rounded-2xl border p-4 bg-slate-900"
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Doors/Windows/Vents
                </h3>
                <Button
                  type="button"
                  onClick={addOpening}
                  className="bg-teal-400 rounded-2xl"
                  
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Opening
                </Button>
              </div>

              <div className="grid gap-3">
                {openings.map((o, idx) => (
                  <div
                    key={o.id}
                    className={cn(
                      "grid gap-2 items-end",
                      "sm:grid-cols-[1fr,1fr,1fr,auto]"
                    )}
                  >
                    <div className="space-y-1">
                      <Label>Width ({lenUnit})</Label>
                      <Input                        
                        inputMode="decimal"
                        placeholder="e.g., 1"
                        value={o.width}
                        onChange={(e) =>
                          setOpenings((prev) =>
                            prev.map((x) =>
                              x.id === o.id
                                ? {
                                    ...x,
                                    width:
                                      e.target.value === ""
                                        ? ""
                                        : Number(e.target.value),
                                  }
                                : x
                            )
                          )
                        }
                        className="bg-slate-700 mt-2 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Height ({lenUnit})</Label>
                      <Input
                        inputMode="decimal"
                        placeholder="e.g., 2.1"
                        value={o.height}
                        onChange={(e) =>
                          setOpenings((prev) =>
                            prev.map((x) =>
                              x.id === o.id
                                ? {
                                    ...x,
                                    height:
                                      e.target.value === ""
                                        ? ""
                                        : Number(e.target.value),
                                  }
                                : x
                            )
                          )
                        }
                        className="bg-slate-700 mt-2 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Count</Label>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g., 2"
                        value={o.count}
                        onChange={(e) =>
                          setOpenings((prev) =>
                            prev.map((x) =>
                              x.id === o.id
                                ? {
                                    ...x,
                                    count:
                                      e.target.value === ""
                                        ? ""
                                        : Number(e.target.value),
                                  }
                                : x
                            )
                          )
                        }
                        className="bg-slate-700 mt-2 rounded-2xl"
                      />
                    </div>
                    <div className="flex sm:justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeOpening(o.id)}
                        className="bg-slate-700 rounded-2xl text-red-600 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                    {idx < openings.length - 1 && (
                      <div className="sm:col-span-4 border-b my-1" style={{ borderColor: "var(--brand-border)" }} />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--brand-subtle)" }}>
                Each opening’s volume = width × height × wall thickness × count
              </p>
            </div>
          </TabsContent>

          {/* ---------------- Results Tab ---------------- */}
          <TabsContent value="results" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Stat
                label="Gross Wall Volume (m³)"
                value={format(wallVolumeM3)}
              />
              <Stat
                label="Openings Volume (m³)"
                value={format(openingsVolumeM3)}
              />
              <Stat
                label={`Net Concrete Volume (${outVolUnit})`}
                value={format(volumeOut)}
                highlight
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Stat
                label="Dry Volume for Mix (m³)"
                value={format(dryVol)}
              />
              <Stat
                label="Cement (bags)"
                value={format(cementBags, 2)}
              />
              <Stat
                label="Water (liters)"
                value={format(waterLiters, 0)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Stat
                label="Sand (m³)"
                value={format(sandVolM3, 3)}
              />
              <Stat
                label="Aggregate (m³)"
                value={format(aggVolM3, 3)}
              />
            </div>

            {/* Costing */}
            <div
              className="rounded-2xl border p-4 space-y-4 bg-slate-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Cost Estimation (Optional)
                </h3>
                <div className="flex gap-2">
                  <Label className="grid place-items-center pr-2">Mode:</Label>
                  <Select
                    value={costMode}
                    onValueChange={(v) => setCostMode(v as typeof costMode)}
                  >
                    <SelectTrigger className="bg-slate-700 w-44 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perM3">Rate per m³</SelectItem>
                      <SelectItem value="byMaterials">By Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {costMode === "perM3" ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label>Concrete Rate (per m³)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g., 120"
                      value={ratePerM3}
                      onChange={(e) =>
                        setRatePerM3(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="bg-slate-700 rounded-2xl"
                    />
                    <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                      Enter your local market rate
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label>Total Cost</Label>
                    <div className="bg-teal-400 rounded-2xl border px-3 py-2 font-semibold text-slate-900 ">
                      {format(totalCost, 2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="space-y-1">
                    <Label>Cement (per bag)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g., 8"
                      value={cementBagPrice}
                      onChange={(e) =>
                        setCementBagPrice(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="mt-2 bg-slate-700 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Sand (per m³)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g., 20"
                      value={sandPricePerM3}
                      onChange={(e) =>
                        setSandPricePerM3(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="mt-2 bg-slate-700 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Aggregate (per m³)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="e.g., 18"
                      value={aggPricePerM3}
                      onChange={(e) =>
                        setAggPricePerM3(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className=" mt-2 bg-slate-700 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Total Cost</Label>
                    <div className="rounded-2xl border px-3 py-2 bg-teal-400 mt-2 font-semibold text-slate-900">
                      {format(totalCost, 2)}
                    </div>
                  </div>
                </div>
              )}
              <p className="text-xs" style={{ color: "var(--brand-subtle)" }}>
                Note: Costs exclude labor/formwork/rebar unless you add them to the rate.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={resetAll}
                className="bg-slate-900 hover:bg-slate-700 rounded-2xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All
              </Button>
            </div>

            <div className="text-xs leading-relaxed" style={{ color: "var(--brand-subtle)" }}>
              <strong className="font-semibold" style={{ color: "var(--brand-primary)" }}>
                Assumptions:
              </strong>{" "}
              Density= {DENSITY_CONCRETE_KG_M3} kg/m³ (wet), cement bulk density=
              {` ${BULK_DENSITY_CEMENT_KG_M3} kg/m³`}, bag size={CEMENT_BAG_KG} kg,
              dry-volume factor={DRY_LOSS_FACTOR}. Adjust mix, w/c and prices to match your spec.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/* =====================================================================================
   Small presentation component
===================================================================================== */

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        highlight ? "bg-slate-900 text-white" : "bg-slate-900"
      )}
      style={{
        borderColor: "var(--brand-border)",
      }}
    >
      <div
        className={cn(
          "text-xs",
          highlight ? "text-white/90" : "text-[var(--brand-subtle)]"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-2xl font-semibold tracking-tight",
          highlight ? "text-white" : "text-[var(--brand-primary)]"
        )}
      >
        {value}
      </div>
    </div>
  );
}
