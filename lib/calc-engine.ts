/**
 * lib/calc-engine.ts
 *
 * Shared, pure TypeScript calculation engine for ConcreteCalculatorMax.
 * Every function is a named export with JSDoc documentation.
 * Every function is PURE — numbers in, numbers out.
 * Zero React, zero DOM, zero state, zero side effects.
 *
 * Formulas match the math extracted in the Phase 0 audit (docs/calculation-audit.md)
 * verbatim from existing calculator source code.
 *
 * @module calc-engine
 */

import {
  CONCRETE_BAG_COVERAGE,
  NOMINAL_MIX_RATIOS,
  type NominalMixGrade,
} from "./material-data";

// ============================================================================
// Section 1 — Types
// ============================================================================

/** Volume expressed in all three common unit systems */
export interface VolumeResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
}

/** Base value with waste added */
export interface WasteResult {
  base: number;
  wasteAmount: number;
  total: number;
}

/** Pre-mixed concrete bag counts for standard sizes */
export interface BagResult {
  bags40lb: number;
  bags60lb: number;
  bags80lb: number;
}

/** Weight in all common weight units */
export interface WeightResult {
  pounds: number;
  kilograms: number;
  tons: number;
  metricTons: number;
}

/** Cost with and without waste factor */
export interface CostResult {
  subtotal: number;
  withWaste: number;
}

/** Block count results for masonry calculators */
export interface BlockResult {
  blocksNeeded: number;
  courses: number;
  blocksPerCourse: number;
  mortarBags: number;
}

/** Supported length/input units */
export type LengthUnit = "in" | "ft" | "yd" | "m" | "cm" | "mm";

/** Staircase volume breakdown */
export interface StaircaseVolumeResult {
  /** Total volume in cubic meters */
  totalM3: number;
  /** Breakdown of individual components in cubic meters */
  breakdown: Record<string, number>;
  /** Total converted to cubic feet */
  totalFt3: number;
  /** Total converted to cubic yards */
  totalYd3: number;
}

/** Pier/Caisson result with optional bell-bottom frustum */
export interface PierVolumeResult {
  /** Volume of one pier in cubic meters */
  perPierM3: number;
  /** Total volume for all piers in cubic meters */
  totalM3: number;
  /** Converted results */
  totalFt3: number;
  totalYd3: number;
}

/** Tank/trench shell volume result with breakdown */
export interface ShellVolumeResult {
  /** Net shell/concrete volume in cubic meters */
  coreM3: number;
  /** Volume with waste applied in cubic meters */
  withWasteM3: number;
  /** Component breakdown in cubic meters */
  breakdown?: {
    baseSlab: number;
    walls: number;
    coverSlab: number;
  };
}

/** Nominal mix design result */
export interface NominalMixResult {
  /** Input volume converted to cubic meters */
  volM3: number;
  /** Dry volume (volM3 × dryFactor) */
  dryVol: number;
  /** Dry volume with wastage applied */
  dryVolWithWastage: number;
  /** Volume of each component in cubic meters */
  volCement: number;
  volSand: number;
  volAggregate: number;
  /** Mass of each component in kilograms */
  massCementKg: number;
  massSandKg: number;
  massAggregateKg: number;
  /** Moisture-adjusted masses */
  adjSandKg: number;
  adjAggregateKg: number;
  /** Number of cement bags */
  bags: number;
  /** Water required (liters = kg for water) before moisture adjustment */
  waterKg: number;
  /** Total water absorbed from aggregates (liters) */
  totalAddedWater: number;
  /** Water required after moisture adjustment */
  adjWaterKg: number;
}

/** Slab load capacity analysis result (ACI 318 basis) */
export interface SlabLoadCapacityResult {
  /** Effective depth in inches */
  d: number;
  /** Steel area per foot width (in²/ft) */
  As: number;
  /** Whitney stress block depth in inches */
  a: number;
  /** Design moment capacity φMn (lb-in per ft width) */
  phiMn: number;
  /** Design shear capacity φVc (lb per ft width) */
  phiVc: number;
  /** Flexure-limited factored load (psf) */
  wuM_psf: number;
  /** Shear-limited factored load (psf) */
  wuV_psf: number;
  /** Governing factored load capacity (psf) */
  wu_max: number;
  /** Governing failure mode */
  mode: "Flexure" | "Shear";
  /** Slab self-weight (psf) */
  selfWeight: number;
  /** Total dead load (psf) */
  totalDead: number;
  /** Maximum allowable service live load (psf) */
  Lmax: number;
}

/** Post hole concrete result */
export interface PostHoleResult {
  /** Hole volume per hole in ft³ (concrete fill zone) */
  holeVolPerHole_ft3: number;
  /** Post displacement per hole in ft³ */
  postDisplacement_ft3: number;
  /** Net concrete per hole in ft³ */
  netConcretePerHole_ft3: number;
  /** Total concrete for all holes in ft³ */
  totalConcrete_ft3: number;
  /** Total concrete with waste in ft³ */
  adjustedConcrete_ft3: number;
  /** Gravel per hole in ft³ */
  gravelPerHole_ft3: number;
  /** Total gravel for all holes in ft³ */
  totalGravel_ft3: number;
  /** Bag counts for standard sizes */
  bags: Record<string, number>;
}

// ============================================================================
// Section 2 — Unit Converters
// ============================================================================

/**
 * Convert a length value from any supported unit to feet.
 *
 * Conversion factors match those used across all 26 calculators:
 * - in → ft: value / 12
 * - ft → ft: value (identity)
 * - yd → ft: value × 3
 * - m  → ft: value × 3.28084  (from concrete-calculations.ts)
 * - cm → ft: value / 30.48    (from PostHoleConcreteCalc.tsx)
 * - mm → ft: value / 304.8
 *
 * @param value - The numeric measurement
 * @param from  - The unit the value is currently in
 * @returns The value expressed in feet
 *
 * @usedBy SlabConcreteCalc, ConcreteYardsCalc, BeamConcreteCalc, ColumnConcreteCalc,
 *         FootingConcreteCalc, WallConcreteCalc, PostHoleConcreteCalc, ConcreteBagCalc,
 *         CrushedConcreteCalc, GravelCalc, and all gravel calculators
 */
export function toFeet(value: number, from: LengthUnit): number {
  switch (from) {
    case "in":
      return value / 12;
    case "ft":
      return value;
    case "yd":
      return value * 3;
    case "m":
      return value * 3.28084;
    case "cm":
      return value / 30.48;
    case "mm":
      return value / 304.8;
  }
}

/**
 * Convert a length value from any supported unit to meters.
 *
 * Conversion factors verbatim from StaircaseConcreteCalc.tsx,
 * PierCaissonCalc.tsx, and TankTrenchConcreteCalc.tsx:
 * - m:  1
 * - cm: 0.01
 * - mm: 0.001
 * - ft: 0.3048
 * - in: 0.0254
 * - yd: 0.9144
 *
 * @param value - The numeric measurement
 * @param from  - The unit the value is currently in
 * @returns The value expressed in meters
 *
 * @usedBy StaircaseConcreteCalc, PierCaissonCalc, TankTrenchConcreteCalc
 */
export function toMeters(value: number, from: LengthUnit): number {
  switch (from) {
    case "m":
      return value;
    case "cm":
      return value * 0.01;
    case "mm":
      return value * 0.001;
    case "ft":
      return value * 0.3048;
    case "in":
      return value * 0.0254;
    case "yd":
      return value * 0.9144;
  }
}

/**
 * Convert cubic feet to cubic yards.
 * Formula: cubicFeet / 27
 * Source: lib/concrete-calculations.ts line 16, CrushedConcreteCalc, PostHoleConcreteCalc
 *
 * @param cubicFeet - Volume in cubic feet
 * @returns Volume in cubic yards
 *
 * @usedBy All volume calculators
 */
export function cubicFtToYd(cubicFeet: number): number {
  return cubicFeet / 27;
}

/**
 * Convert cubic feet to cubic meters.
 * Formula: cubicFeet × 0.0283168
 * Source: lib/concrete-calculations.ts line 20, CrushedConcreteCalc, PostHoleConcreteCalc
 *
 * @param cubicFeet - Volume in cubic feet
 * @returns Volume in cubic meters
 *
 * @usedBy All volume calculators
 */
export function cubicFtToM3(cubicFeet: number): number {
  return cubicFeet * 0.0283168;
}

/**
 * Convert cubic meters to cubic yards.
 * Formula: m3 × 1.30795062
 * Source: StaircaseConcreteCalc.tsx line 255, PierCaissonCalc.tsx line 73
 *
 * @param cubicMeters - Volume in cubic meters
 * @returns Volume in cubic yards
 *
 * @usedBy StaircaseConcreteCalc, PierCaissonCalc, TankTrenchConcreteCalc
 */
export function cubicM3ToYd(cubicMeters: number): number {
  return cubicMeters * 1.30795062;
}

/**
 * Convert cubic meters to cubic feet.
 * Formula: m3 × 35.3146667
 * Source: StaircaseConcreteCalc.tsx line 254, PierCaissonCalc.tsx line 74
 *
 * @param cubicMeters - Volume in cubic meters
 * @returns Volume in cubic feet
 *
 * @usedBy StaircaseConcreteCalc, PierCaissonCalc, TankTrenchConcreteCalc
 */
export function cubicM3ToFt3(cubicMeters: number): number {
  return cubicMeters * 35.3146667;
}

/**
 * Convert cubic feet to liters.
 * Formula: cubicFeet × 28.3168
 * Source: PostHoleConcreteCalc.tsx line 72
 *
 * @param cubicFeet - Volume in cubic feet
 * @returns Volume in liters
 *
 * @usedBy PostHoleConcreteCalc
 */
export function cubicFtToLiters(cubicFeet: number): number {
  return cubicFeet * 28.3168;
}

// ============================================================================
// Section 3 — Volume Functions (Core Geometry)
// ============================================================================

/**
 * Helper to build a VolumeResult from cubic feet.
 * @internal
 */
function volumeFromFt3(cubicFeet: number): VolumeResult {
  return {
    cubicFeet,
    cubicYards: cubicFtToYd(cubicFeet),
    cubicMeters: cubicFtToM3(cubicFeet),
  };
}

/**
 * Calculate volume of a rectangular prism (slab, beam, wall, footing).
 *
 * Formula: length(ft) × width(ft) × depth(ft)
 * Source: lib/concrete-calculations.ts lines 23-40 (calculateSlabVolume),
 *         also lines 42-59, 92-109, 111-128 for beam/footing/wall.
 *
 * @param length - Length dimension
 * @param width  - Width dimension
 * @param depth  - Depth/thickness dimension
 * @param unit   - Unit of all three dimensions
 * @returns Volume in cubic feet, yards, and meters
 *
 * @usedBy SlabConcreteCalc, ConcreteYardsCalc, BeamConcreteCalc, FootingConcreteCalc,
 *         WallConcreteCalc, ConcreteBagCalc, ConcreteSlabCostCalc, ConcreteDrivewayCostCalc,
 *         ConcreteSlabWeightCalc, CrushedConcreteCalc, GravelCalc, GravelCostCalc,
 *         GravelDrivewayCalc, PeaGravelCalc, AquariumGravelCalc
 */
export function rectangularVolume(
  length: number,
  width: number,
  depth: number,
  unit: LengthUnit
): VolumeResult {
  const l = toFeet(length, unit);
  const w = toFeet(width, unit);
  const d = toFeet(depth, unit);
  return volumeFromFt3(l * w * d);
}

/**
 * Calculate volume of a cylinder.
 *
 * Formula: π × (diameter/2)² × depth
 * Source: lib/concrete-calculations.ts lines 74-78 (circular column),
 *         PierCaissonCalc.tsx lines 62-65 (cylVolume),
 *         PostHoleConcreteCalc.tsx lines 249-250 (round hole),
 *         ConcreteYardsCalc.tsx line 19 (cylindrical mode)
 *
 * @param diameter - Full diameter of the cylinder
 * @param depth    - Height/depth of the cylinder
 * @param unit     - Unit of diameter and depth
 * @returns Volume in cubic feet, yards, and meters
 *
 * @usedBy ColumnConcreteCalc, FootingConcreteCalc (circular mode),
 *         PierCaissonCalc, PostHoleConcreteCalc, ConcreteYardsCalc (circular)
 */
export function cylinderVolume(
  diameter: number,
  depth: number,
  unit: LengthUnit
): VolumeResult {
  const d_ft = toFeet(diameter, unit);
  const h_ft = toFeet(depth, unit);
  const r = d_ft / 2;
  return volumeFromFt3(Math.PI * r * r * h_ft);
}

/**
 * Calculate volume of a trapezoidal prism.
 *
 * Formula: length × depth × (topWidth + bottomWidth) / 2
 * Source: TankTrenchConcreteCalc.tsx lines 230-234 (trapezoidal trench)
 *
 * @param topWidth    - Width at the top of the trapezoid
 * @param bottomWidth - Width at the bottom of the trapezoid
 * @param depth       - Depth of the trapezoid
 * @param length      - Length along the trapezoid
 * @param unit        - Unit for all dimensions
 * @returns Volume in cubic feet, yards, and meters
 *
 * @usedBy TankTrenchConcreteCalc (trapezoidal trench mode)
 */
export function trapezoidalVolume(
  topWidth: number,
  bottomWidth: number,
  depth: number,
  length: number,
  unit: LengthUnit
): VolumeResult {
  const tw = toFeet(topWidth, unit);
  const bw = toFeet(bottomWidth, unit);
  const d = toFeet(depth, unit);
  const l = toFeet(length, unit);
  const avg = (tw + bw) / 2;
  return volumeFromFt3(l * d * avg);
}

/**
 * Calculate staircase volume (waist-slab or solid mode).
 *
 * Waist-slab mode:
 *   waistVol = waistThickness × width × slopedLength(totalRun, totalRise)
 *   wedgeVol = 0.5 × numSteps × tread × riser × width
 *   total = waistVol + wedgeVol + landings
 *
 * Solid mode:
 *   stepsVol = numSteps × tread × riser × width
 *   total = stepsVol + landings
 *
 * Source: StaircaseConcreteCalc.tsx lines 230-245
 * Sloped length: Math.hypot(totalRun, totalRise) (line 66)
 *
 * @param numSteps      - Number of step risers
 * @param treadDepth    - Horizontal tread depth per step
 * @param riserHeight   - Vertical riser height per step
 * @param width         - Clear width of the stair flight
 * @param waistThickness - Thickness of inclined waist slab (0 for solid mode)
 * @param unit          - Unit for all dimensions
 * @param mode          - "waist" for waist-slab, "solid" for mass stairs
 * @returns StaircaseVolumeResult with breakdown in cubic meters and conversions
 *
 * @usedBy StaircaseConcreteCalc
 */
export function staircaseVolume(
  numSteps: number,
  treadDepth: number,
  riserHeight: number,
  width: number,
  waistThickness: number,
  unit: LengthUnit,
  mode: "waist" | "solid" = "waist"
): StaircaseVolumeResult {
  const tread_m = toMeters(treadDepth, unit);
  const riser_m = toMeters(riserHeight, unit);
  const width_m = toMeters(width, unit);
  const waist_m = toMeters(waistThickness, unit);

  const totalRun_m = numSteps * tread_m;
  const totalRise_m = numSteps * riser_m;

  const breakdown: Record<string, number> = {};
  let totalM3 = 0;

  if (mode === "solid") {
    const stepsVol = numSteps * tread_m * riser_m * width_m;
    totalM3 = stepsVol;
    breakdown["Steps (solid)"] = stepsVol;
  } else {
    const slopedLen = Math.hypot(totalRun_m, totalRise_m);
    const waistVol = waist_m * width_m * slopedLen;
    const wedgeVol = 0.5 * numSteps * tread_m * riser_m * width_m;
    totalM3 = waistVol + wedgeVol;
    breakdown["Waist slab"] = waistVol;
    breakdown["Step wedges"] = wedgeVol;
  }

  return {
    totalM3,
    breakdown,
    totalFt3: cubicM3ToFt3(totalM3),
    totalYd3: cubicM3ToYd(totalM3),
  };
}

/**
 * Calculate volume for multiple identical cylindrical holes.
 *
 * Formula: π × (diameter/2)² × depth × count
 * Source: PostHoleConcreteCalc.tsx lines 248-255 (per-hole × n),
 *         PierCaissonCalc.tsx line 259 (perPier × n)
 *
 * @param diameter - Diameter of each hole
 * @param depth    - Depth of each hole
 * @param count    - Number of identical holes
 * @param unit     - Unit for diameter and depth
 * @returns Volume in cubic feet, yards, and meters
 *
 * @usedBy PostHoleConcreteCalc, PierCaissonCalc
 */
export function multiHoleVolume(
  diameter: number,
  depth: number,
  count: number,
  unit: LengthUnit
): VolumeResult {
  const single = cylinderVolume(diameter, depth, unit);
  return {
    cubicFeet: single.cubicFeet * count,
    cubicYards: single.cubicYards * count,
    cubicMeters: single.cubicMeters * count,
  };
}

/**
 * Calculate volume of a frustum (truncated cone), used for bell-bottom piers.
 *
 * Formula: (π × h / 3) × (R₁² + R₁×R₂ + R₂²)
 * Source: PierCaissonCalc.tsx lines 67-71
 *
 * @param topDiameter    - Diameter at the top of the frustum
 * @param bottomDiameter - Diameter at the bottom of the frustum
 * @param height         - Height of the frustum
 * @param unit           - Unit for all dimensions
 * @returns Volume in cubic feet, yards, and meters
 *
 * @usedBy PierCaissonCalc (belled base mode)
 */
export function frustumVolume(
  topDiameter: number,
  bottomDiameter: number,
  height: number,
  unit: LengthUnit
): VolumeResult {
  const R1 = toMeters(topDiameter, unit) / 2;
  const R2 = toMeters(bottomDiameter, unit) / 2;
  const h = toMeters(height, unit);
  const vol_m3 = (Math.PI * h * (R1 * R1 + R1 * R2 + R2 * R2)) / 3;
  return {
    cubicMeters: vol_m3,
    cubicFeet: cubicM3ToFt3(vol_m3),
    cubicYards: cubicM3ToYd(vol_m3),
  };
}

/**
 * Calculate pier/caisson volume with optional bell-bottom.
 *
 * Shaft: cylinder volume (π r² h)
 * Bell (if enabled): frustum volume added to shaft
 * Total: per-pier × quantity, then waste applied separately
 *
 * Source: PierCaissonCalc.tsx lines 237-269
 *
 * @param shaftDiameter - Diameter of the cylindrical shaft
 * @param shaftDepth    - Depth of the shaft
 * @param quantity      - Number of identical piers
 * @param unit          - Unit for all dimensions
 * @param bell          - Optional bell-bottom parameters
 * @returns PierVolumeResult
 *
 * @usedBy PierCaissonCalc
 */
export function pierVolume(
  shaftDiameter: number,
  shaftDepth: number,
  quantity: number,
  unit: LengthUnit,
  bell?: {
    topDiameter: number;
    bottomDiameter: number;
    height: number;
  }
): PierVolumeResult {
  const d_m = toMeters(shaftDiameter, unit);
  const h_m = toMeters(shaftDepth, unit);
  const r = d_m / 2;
  let perPierM3 = Math.PI * r * r * h_m;

  if (bell) {
    const bt_m = toMeters(bell.topDiameter, unit);
    const bb_m = toMeters(bell.bottomDiameter, unit);
    const bh_m = toMeters(bell.height, unit);
    const R1 = bt_m / 2;
    const R2 = bb_m / 2;
    perPierM3 += (Math.PI * bh_m * (R1 * R1 + R1 * R2 + R2 * R2)) / 3;
  }

  const totalM3 = perPierM3 * quantity;
  return {
    perPierM3,
    totalM3,
    totalFt3: cubicM3ToFt3(totalM3),
    totalYd3: cubicM3ToYd(totalM3),
  };
}

/**
 * Calculate rectangular tank shell volume (outer box minus inner void).
 *
 * Source: TankTrenchConcreteCalc.tsx lines 250-283
 *
 * Outer dims: Lo = Li + 2×wallThickness, Wo = Wi + 2×wallThickness, Ho = Hi + baseThickness + topThickness
 * Shell: outerVol - innerVol
 *
 * @param innerLength    - Interior length
 * @param innerWidth     - Interior width
 * @param innerHeight    - Interior height
 * @param wallThickness  - Wall thickness
 * @param baseThickness  - Base slab thickness
 * @param topThickness   - Cover slab thickness (0 if no top)
 * @param unit           - Unit for all dimensions
 * @returns ShellVolumeResult with breakdown
 *
 * @usedBy TankTrenchConcreteCalc (rectangular tank mode)
 */
export function rectTankShellVolume(
  innerLength: number,
  innerWidth: number,
  innerHeight: number,
  wallThickness: number,
  baseThickness: number,
  topThickness: number,
  unit: LengthUnit
): ShellVolumeResult {
  const Li = toMeters(innerLength, unit);
  const Wi = toMeters(innerWidth, unit);
  const Hi = toMeters(innerHeight, unit);
  const tW = toMeters(wallThickness, unit);
  const tB = toMeters(baseThickness, unit);
  const tT = toMeters(topThickness, unit);

  const Lo = Li + 2 * tW;
  const Wo = Wi + 2 * tW;
  const Ho = Hi + tB + tT;

  const outerVol = Lo * Wo * Ho;
  const innerVol = Li * Wi * Hi;
  const core = Math.max(outerVol - innerVol, 0);

  const baseSlab = Lo * Wo * tB;
  const coverSlab = tT > 0 ? Lo * Wo * tT : 0;
  const walls = Math.max(core - baseSlab - coverSlab, 0);

  return {
    coreM3: core,
    withWasteM3: core, // Waste applied externally via applyWaste()
    breakdown: { baseSlab, walls, coverSlab },
  };
}

/**
 * Calculate circular tank shell volume (outer cylinder minus inner cylinder).
 *
 * Source: TankTrenchConcreteCalc.tsx lines 285-314
 *
 * @param innerDiameter  - Interior diameter
 * @param innerHeight    - Interior height
 * @param wallThickness  - Wall thickness
 * @param baseThickness  - Base slab thickness
 * @param topThickness   - Cover slab thickness (0 if no top)
 * @param unit           - Unit for all dimensions
 * @returns ShellVolumeResult with breakdown
 *
 * @usedBy TankTrenchConcreteCalc (circular tank mode)
 */
export function circTankShellVolume(
  innerDiameter: number,
  innerHeight: number,
  wallThickness: number,
  baseThickness: number,
  topThickness: number,
  unit: LengthUnit
): ShellVolumeResult {
  const Di = toMeters(innerDiameter, unit);
  const Hi = toMeters(innerHeight, unit);
  const tW = toMeters(wallThickness, unit);
  const tB = toMeters(baseThickness, unit);
  const tT = toMeters(topThickness, unit);

  const Do = Di + 2 * tW;
  const Ho = Hi + tB + tT;

  const outerVol = Math.PI * Math.pow(Do / 2, 2) * Ho;
  const innerVol = Math.PI * Math.pow(Di / 2, 2) * Hi;
  const core = Math.max(outerVol - innerVol, 0);

  const baseSlab = Math.PI * Math.pow(Do / 2, 2) * tB;
  const coverSlab = tT > 0 ? Math.PI * Math.pow(Do / 2, 2) * tT : 0;
  const walls = Math.max(core - baseSlab - coverSlab, 0);

  return {
    coreM3: core,
    withWasteM3: core,
    breakdown: { baseSlab, walls, coverSlab },
  };
}

/**
 * Calculate wall volume with opening deductions.
 *
 * Formula: netVolume = wallVolume - openingsVolume
 * Source: WallConcreteCalc.tsx (netVolumeM3 = Math.max(0, wallVolumeM3 - openingsVolumeM3))
 *
 * @param wallLength    - Total wall length
 * @param wallHeight    - Total wall height
 * @param wallThickness - Wall thickness
 * @param openingsArea  - Total area of all openings (in square units matching wallLength/wallHeight)
 * @param unit          - Unit for all dimensions
 * @returns VolumeResult for the net wall volume
 *
 * @usedBy WallConcreteCalc
 */
export function wallVolumeWithOpenings(
  wallLength: number,
  wallHeight: number,
  wallThickness: number,
  openingsArea: number,
  unit: LengthUnit
): VolumeResult {
  const l = toFeet(wallLength, unit);
  const h = toFeet(wallHeight, unit);
  const t = toFeet(wallThickness, unit);
  const grossArea = l * h;
  const netArea = Math.max(0, grossArea - openingsArea);
  return volumeFromFt3(netArea * t);
}

// ============================================================================
// Section 4 — Waste Calculator
// ============================================================================

/**
 * Apply a waste/overage percentage to a base value.
 *
 * Formula: total = base × (1 + wastePercent / 100)
 * Source: Used across nearly all calculators:
 *   - PierCaissonCalc.tsx line 261: perPier_w = perPier_m3 * (1 + w / 100)
 *   - ConcreteYardsCalc.tsx: vol_with_waste_ft3 = volume_ft3 * (1 + wastePct / 100)
 *   - TankTrenchConcreteCalc.tsx line 237: core * (1 + wPct / 100)
 *
 * @param baseValue    - The base quantity (volume, weight, count, etc.)
 * @param wastePercent - Waste percentage (e.g., 5 for 5%)
 * @returns WasteResult with base, waste amount, and total
 *
 * @usedBy All calculators with waste/overage inputs
 */
export function applyWaste(
  baseValue: number,
  wastePercent: number
): WasteResult {
  const wasteAmount = baseValue * (wastePercent / 100);
  return {
    base: baseValue,
    wasteAmount,
    total: baseValue + wasteAmount,
  };
}

// ============================================================================
// Section 5 — Material Estimators
// ============================================================================

/**
 * Calculate number of pre-mixed concrete bags needed.
 *
 * Bag yields in cubic feet (from PostHoleConcreteCalc.tsx lines 31-36):
 * - 40 lb bag: 0.30 ft³
 * - 50 lb bag: 0.375 ft³  (also used in PostHole)
 * - 60 lb bag: 0.45 ft³
 * - 80 lb bag: 0.60 ft³
 *
 * Also from CONCRETE_BAG_COVERAGE in material-data.ts.
 *
 * @param cubicFeet - Total volume in cubic feet
 * @returns BagResult with counts for 40, 60, and 80 lb bags (all rounded up)
 *
 * @usedBy ConcreteBagCalc, SlabConcreteCalc, PostHoleConcreteCalc,
 *         and any calculator with bag count outputs
 */
export function concreteBags(cubicFeet: number): BagResult {
  return {
    bags40lb: Math.ceil(cubicFeet / CONCRETE_BAG_COVERAGE[40].cubicFeet),
    bags60lb: Math.ceil(cubicFeet / CONCRETE_BAG_COVERAGE[60].cubicFeet),
    bags80lb: Math.ceil(cubicFeet / CONCRETE_BAG_COVERAGE[80].cubicFeet),
  };
}

/**
 * Calculate bag counts for all standard sizes plus an optional custom yield.
 *
 * Source: PostHoleConcreteCalc.tsx lines 284-289
 *
 * @param cubicFeet      - Total volume in cubic feet
 * @param customYieldFt3 - Optional custom bag yield in ft³ (0 to skip)
 * @returns Record of bag size → count
 *
 * @usedBy PostHoleConcreteCalc
 */
export function concreteBagsAllSizes(
  cubicFeet: number,
  customYieldFt3: number = 0
): Record<string, number> {
  const bags: Record<string, number> = {
    "40": Math.ceil(cubicFeet / 0.3),
    "50": Math.ceil(cubicFeet / 0.375),
    "60": Math.ceil(cubicFeet / 0.45),
    "80": Math.ceil(cubicFeet / 0.6),
  };
  if (customYieldFt3 > 0) {
    bags["custom"] = Math.ceil(cubicFeet / customYieldFt3);
  }
  return bags;
}

/**
 * Calculate weight of concrete from volume and density.
 *
 * Standard concrete density: 150 lb/ft³ (normal weight)
 * Source: ConcreteSlabWeightCalc.tsx, also ConcreteSlabLoadCapacityCalc.tsx line 178
 * Metric: 2400 kg/m³ (StaircaseConcreteCalc.tsx line 36)
 *
 * @param cubicFeet       - Volume in cubic feet
 * @param densityLbPerFt3 - Density in pounds per cubic foot (default: 150)
 * @returns WeightResult in pounds, kilograms, tons, and metric tons
 *
 * @usedBy ConcreteSlabWeightCalc, StaircaseConcreteCalc
 */
export function concreteWeight(
  cubicFeet: number,
  densityLbPerFt3: number = 150
): WeightResult {
  const pounds = cubicFeet * densityLbPerFt3;
  const kilograms = pounds * 0.453592;
  return {
    pounds,
    kilograms,
    tons: pounds / 2000,
    metricTons: kilograms / 1000,
  };
}

/**
 * Calculate weight of gravel/aggregate from volume and density.
 *
 * Uses same formula as concreteWeight but semantically separate for gravel densities.
 * Source: CrushedConcreteCalc.tsx, GravelCalc, PeaGravelCalc, AquariumGravelCalc
 *
 * @param cubicFeet       - Volume in cubic feet
 * @param densityLbPerFt3 - Density in pounds per cubic foot
 * @returns WeightResult in pounds, kilograms, tons, and metric tons
 *
 * @usedBy CrushedConcreteCalc, GravelCalc, GravelCostCalc, GravelDrivewayCalc,
 *         PeaGravelCalc, AquariumGravelCalc
 */
export function gravelWeight(
  cubicFeet: number,
  densityLbPerFt3: number
): WeightResult {
  const pounds = cubicFeet * densityLbPerFt3;
  const kilograms = pounds * 0.453592;
  return {
    pounds,
    kilograms,
    tons: pounds / 2000,
    metricTons: kilograms / 1000,
  };
}

/**
 * Convert tons of material to volume (reverse of weight calculation).
 *
 * Formula: cubicFeet = (tons × 2000) / densityLbPerFt3
 * Source: GravelTonsToYardsCalc.tsx
 *
 * @param tons            - Weight in US short tons
 * @param densityLbPerFt3 - Density in pounds per cubic foot
 * @returns VolumeResult in cubic feet, yards, and meters
 *
 * @usedBy GravelTonsToYardsCalc
 */
export function tonsToYards(
  tons: number,
  densityLbPerFt3: number
): VolumeResult {
  const cubicFeet = (tons * 2000) / densityLbPerFt3;
  return volumeFromFt3(cubicFeet);
}

/**
 * Calculate block count for a masonry wall from dimensions.
 *
 * Formulas from CinderBlockCalc.tsx and CMUBlockCalc.tsx:
 *   blockFaceArea_ft2 = (nomL_in / 12) × (nomH_in / 12)
 *   blocksPerSqFt = 1 / blockFaceArea_ft2
 *   blocksRaw = netArea × blocksPerSqFt
 *   wasteBlocks = blocksRaw × (waste / 100)
 *   finalBlocks = Math.ceil(blocksRaw + wasteBlocks)
 *   mortarBags = Math.ceil(finalBlocks / blocksPerBag)
 *
 * Mortar coverage (CinderBlockCalc.tsx lines 77-78):
 *   80 lb bag: ~13 standard blocks
 *   60 lb bag: ~9.75 standard blocks
 *
 * @param wallLengthFt   - Wall length in feet
 * @param wallHeightFt   - Wall height in feet
 * @param blockLengthIn  - Nominal block length in inches (e.g., 16)
 * @param blockHeightIn  - Nominal block height in inches (e.g., 8)
 * @param wastePercent   - Waste percentage (e.g., 5)
 * @param openingsAreaFt2 - Total area of openings in square feet (deducted from gross area)
 * @param blocksPerMortarBag - Blocks covered per mortar bag (default: 13 for 80lb bag)
 * @returns BlockResult with block count, courses, blocks per course, and mortar bags
 *
 * @usedBy CinderBlockCalc, CMUBlockCalc, ConcreteBlockCalc
 */
export function blockCount(
  wallLengthFt: number,
  wallHeightFt: number,
  blockLengthIn: number,
  blockHeightIn: number,
  wastePercent: number = 5,
  openingsAreaFt2: number = 0,
  blocksPerMortarBag: number = 13
): BlockResult {
  const grossArea = wallLengthFt * wallHeightFt;
  const netArea = Math.max(0, grossArea - openingsAreaFt2);

  const blockFaceArea_ft2 = (blockLengthIn / 12) * (blockHeightIn / 12);
  const blocksPerSqFt = blockFaceArea_ft2 > 0 ? 1 / blockFaceArea_ft2 : 0;

  const blocksRaw = netArea * blocksPerSqFt;
  const wasteBlocks = blocksRaw * (wastePercent / 100);
  const blocksNeeded = Math.ceil(blocksRaw + wasteBlocks);

  // Courses and blocks per course
  const blockHeightFt = blockHeightIn / 12;
  const blockLengthFt = blockLengthIn / 12;
  const courses =
    blockHeightFt > 0 ? Math.ceil(wallHeightFt / blockHeightFt) : 0;
  const blocksPerCourse =
    blockLengthFt > 0 ? Math.ceil(wallLengthFt / blockLengthFt) : 0;

  // Mortar bags
  const mortarBags =
    blocksPerMortarBag > 0
      ? Math.ceil(blocksNeeded / blocksPerMortarBag)
      : 0;

  return {
    blocksNeeded,
    courses,
    blocksPerCourse,
    mortarBags,
  };
}

/**
 * Subtract post displacement from hole volume for post hole calculations.
 *
 * Round post: π × (postDia/2)² × embedDepth
 * Square post: postWidth × postLength × embedDepth
 *
 * Source: PostHoleConcreteCalc.tsx lines 258-272
 *
 * @param holeVolFt3       - Volume of the hole (concrete fill zone) in ft³
 * @param postShape        - "round" or "square"
 * @param postDimFt        - Post diameter (round) or width (square) in feet
 * @param postLengthFt     - Post length in feet (only used for square; same as width for round)
 * @param embedDepthFt     - Depth of post embedded in concrete, in feet
 * @returns Net concrete volume per hole in ft³
 *
 * @usedBy PostHoleConcreteCalc
 */
export function postDisplacement(
  holeVolFt3: number,
  postShape: "round" | "square",
  postDimFt: number,
  postLengthFt: number,
  embedDepthFt: number
): number {
  let displacement = 0;
  if (postShape === "round") {
    const pr = postDimFt / 2;
    displacement = Math.PI * pr * pr * embedDepthFt;
  } else {
    displacement = postDimFt * postLengthFt * embedDepthFt;
  }
  return Math.max(0, holeVolFt3 - displacement);
}

/**
 * Calculate nominal mix material quantities (cement, sand, aggregate, water).
 *
 * Source: NominalMixConcreteCalc.tsx lines 132-176
 *
 * Mix ratio splitting:
 *   volCement = (parts.c / partsSum) × dryVolWithWastage
 *   volSand = (parts.s / partsSum) × dryVolWithWastage
 *   volAggregate = (parts.a / partsSum) × dryVolWithWastage
 *
 * Masses:
 *   massCementKg = volCement × rhoCement
 *   massSandKg = volSand × rhoSand
 *   massAggregateKg = volAggregate × rhoAggregate
 *
 * Water:
 *   waterKg = wc × massCementKg
 *   Moisture corrections subtract aggregate moisture from required water
 *
 * @param volumeM3          - Wet volume of concrete in cubic meters
 * @param grade             - Nominal mix grade (M5, M7.5, M10, M15, M20, M25)
 * @param dryFactor         - Dry volume multiplier (typical 1.54)
 * @param wastagePct        - Wastage percentage (typical 2%)
 * @param bagSizeKg         - Cement bag size in kg (typical 50)
 * @param rhoCement         - Cement bulk density kg/m³ (default: 1440)
 * @param rhoSand           - Sand bulk density kg/m³ (default: 1600)
 * @param rhoAggregate      - Aggregate bulk density kg/m³ (default: 1500)
 * @param wcRatio           - Water-cement ratio (undefined = use grade default)
 * @param moistSandPct      - Sand moisture % (default: 2)
 * @param moistAggregatePct - Aggregate moisture % (default: 1)
 * @returns NominalMixResult
 *
 * @usedBy NominalMixConcreteCalc
 */
export function nominalMixSplit(
  volumeM3: number,
  grade: NominalMixGrade,
  dryFactor: number = 1.54,
  wastagePct: number = 2,
  bagSizeKg: number = 50,
  rhoCement: number = 1440,
  rhoSand: number = 1600,
  rhoAggregate: number = 1500,
  wcRatio?: number,
  moistSandPct: number = 2,
  moistAggregatePct: number = 1
): NominalMixResult {
  const mix = NOMINAL_MIX_RATIOS[grade];
  const wc = wcRatio ?? mix.wc;
  const partsSum = mix.c + mix.s + mix.a;

  const dryVol = volumeM3 * dryFactor;
  const dryVolWithWastage = dryVol * (1 + wastagePct / 100);

  const volCement = (mix.c / partsSum) * dryVolWithWastage;
  const volSand = (mix.s / partsSum) * dryVolWithWastage;
  const volAggregate = (mix.a / partsSum) * dryVolWithWastage;

  const massCementKg = volCement * rhoCement;
  const massSandKg = volSand * rhoSand;
  const massAggregateKg = volAggregate * rhoAggregate;

  const bags = bagSizeKg > 0 ? massCementKg / bagSizeKg : 0;

  const waterKg = wc * massCementKg;

  const addedWaterFromSand = (moistSandPct / 100) * massSandKg;
  const addedWaterFromAgg = (moistAggregatePct / 100) * massAggregateKg;
  const totalAddedWater = addedWaterFromSand + addedWaterFromAgg;
  const adjWaterKg = Math.max(waterKg - totalAddedWater, 0);

  const adjSandKg = massSandKg * (1 + moistSandPct / 100);
  const adjAggregateKg = massAggregateKg * (1 + moistAggregatePct / 100);

  return {
    volM3: volumeM3,
    dryVol,
    dryVolWithWastage,
    volCement,
    volSand,
    volAggregate,
    massCementKg,
    massSandKg,
    massAggregateKg,
    adjSandKg,
    adjAggregateKg,
    bags,
    waterKg,
    totalAddedWater,
    adjWaterKg,
  };
}

/**
 * Wall concrete mix splitting (cement, sand, aggregate volumes from ratio).
 *
 * Source: WallConcreteCalc.tsx MIX_PARTS table (lines 112-118 of audit):
 *   cementVol = (parts.c / parts.total) × dryVol
 *
 * @param volumeM3 - Net volume in cubic meters
 * @param cPart    - Cement ratio part (e.g., 1)
 * @param sPart    - Sand ratio part (e.g., 2)
 * @param aPart    - Aggregate ratio part (e.g., 4)
 * @param dryFactor - Dry volume factor (default: 1.54)
 * @returns Object containing cement, sand, aggregate volumes in m³
 *
 * @usedBy WallConcreteCalc
 */
export function mixRatioSplit(
  volumeM3: number,
  cPart: number,
  sPart: number,
  aPart: number,
  dryFactor: number = 1.54
): { cementVol: number; sandVol: number; aggregateVol: number; dryVol: number } {
  const total = cPart + sPart + aPart;
  const dryVol = volumeM3 * dryFactor;
  return {
    cementVol: (cPart / total) * dryVol,
    sandVol: (sPart / total) * dryVol,
    aggregateVol: (aPart / total) * dryVol,
    dryVol,
  };
}

/**
 * Calculate slab load capacity per ACI 318 strength design.
 *
 * Formulas from ConcreteSlabLoadCapacityCalc.tsx lines 132-203:
 *   d = h - cover - bar.diameter / 2
 *   As = bar.area × (12 / spacing)
 *   a = (As × fy) / (0.85 × f'c × b)         [Whitney stress block]
 *   Mn = As × fy × (d - a / 2)                 [Flexural moment]
 *   φMn = 0.9 × Mn
 *   φVc = 0.75 × 2 × λ × √f'c × b × d        [Shear capacity]
 *   wu_M = (8 × φMn) / (L_in²) × 12           [Flexure-limited load]
 *   wu_V = (2 × φVc) / L_in × 12              [Shear-limited load]
 *   wu_max = min(wu_M, wu_V)
 *   Lmax = (wu_max - 1.2 × totalDead) / 1.6   [Service live load]
 *
 * @param thicknessIn   - Slab thickness in inches
 * @param spanFt        - Clear span in feet
 * @param fcPsi         - Concrete compressive strength f'c in psi
 * @param fyPsi         - Steel yield strength fy in psi
 * @param gammaPcf      - Concrete unit weight in pcf (default: 150)
 * @param barDiameterIn - Rebar diameter in inches
 * @param barAreaIn2    - Rebar cross-sectional area in in²
 * @param spacingIn     - Bar spacing on center in inches
 * @param coverIn       - Clear cover in inches
 * @param superDeadPsf  - Superimposed dead load in psf (default: 0)
 * @returns SlabLoadCapacityResult or null if inputs are invalid
 *
 * @usedBy ConcreteSlabLoadCapacityCalc
 */
export function slabLoadCapacity(
  thicknessIn: number,
  spanFt: number,
  fcPsi: number,
  fyPsi: number,
  gammaPcf: number = 150,
  barDiameterIn: number,
  barAreaIn2: number,
  spacingIn: number,
  coverIn: number,
  superDeadPsf: number = 0
): SlabLoadCapacityResult | null {
  const phiM = 0.9;
  const phiV = 0.75;
  const lambda = 1.0;
  const b = 12; // 12-inch strip analysis

  // 1. Effective depth
  const d = thicknessIn - coverIn - barDiameterIn / 2;
  if (d <= 0) return null;

  // 2. Steel area per foot width
  const As = barAreaIn2 * (12 / spacingIn);

  // 3. Flexural capacity — Whitney stress block
  const a = (As * fyPsi) / (0.85 * fcPsi * b);
  if (a >= d) return null;

  const Mn = As * fyPsi * (d - a / 2); // lb-in per ft width
  const phiMn = phiM * Mn;

  const Lin = spanFt * 12;
  const wuM_lb_in = (8 * phiMn) / (Lin ** 2);
  const wuM_psf = wuM_lb_in * 12;

  // 4. Shear capacity
  const phiVc = phiV * 2 * lambda * Math.sqrt(fcPsi) * b * d;
  const wuV_lb_in = (2 * phiVc) / Lin;
  const wuV_psf = wuV_lb_in * 12;

  // 5. Governing
  const wu_max = Math.min(wuM_psf, wuV_psf);
  const mode: "Flexure" | "Shear" = wuM_psf <= wuV_psf ? "Flexure" : "Shear";

  // 6. Dead loads
  const selfWeight = gammaPcf * (thicknessIn / 12);
  const totalDead = selfWeight + superDeadPsf;

  // 7. Service live load capacity: wu = 1.2D + 1.6L → L = (wu - 1.2D) / 1.6
  const Lmax = Math.max(0, (wu_max - 1.2 * totalDead) / 1.6);

  return {
    d,
    As,
    a,
    phiMn,
    phiVc,
    wuM_psf,
    wuV_psf,
    wu_max,
    mode,
    selfWeight,
    totalDead,
    Lmax,
  };
}

/**
 * Estimate rebar count and total length/weight for a slab.
 *
 * Source: ConcreteBlockCalc.tsx (horizontal rebar):
 *   horizReinfLenFt = horizRuns × wallLenFtTotal
 *
 * Generic rebar grid for slabs:
 *   numBarsLength = floor((width × 12) / spacing) + 1
 *   numBarsWidth  = floor((length × 12) / spacing) + 1
 *   totalLengthFt = numBarsLength × length + numBarsWidth × width
 *
 * @param lengthFt     - Slab length in feet
 * @param widthFt      - Slab width in feet
 * @param spacingIn    - Bar spacing on center in inches
 * @param lbPerFt      - Weight per liner foot for the bar size
 * @returns Object with bar counts and total weight
 *
 * @usedBy ConcreteBlockCalc (rebar estimation), RebarCalc, RebarSpacingCalc
 */
export function rebarEstimate(
  lengthFt: number,
  widthFt: number,
  spacingIn: number,
  lbPerFt: number
): {
  barsAlongLength: number;
  barsAlongWidth: number;
  totalLengthFt: number;
  totalWeightLbs: number;
} {
  const barsAlongLength = Math.floor((widthFt * 12) / spacingIn) + 1;
  const barsAlongWidth = Math.floor((lengthFt * 12) / spacingIn) + 1;
  const totalLengthFt =
    barsAlongLength * lengthFt + barsAlongWidth * widthFt;
  return {
    barsAlongLength,
    barsAlongWidth,
    totalLengthFt,
    totalWeightLbs: totalLengthFt * lbPerFt,
  };
}

/**
 * Calculate grout fill volume for CMU/block wall cores.
 *
 * For standard 8×8×16 blocks, core volume ≈ 0.0116 ft³ per block
 * (two 2.5″×5.5″ cores, 7.625″ tall)
 *
 * @param blockCount     - Total number of blocks
 * @param coreVolFt3     - Volume of grout fill per block in ft³ (default: 0.0116 for standard 8″ block)
 * @returns Total grout volume in ft³
 *
 * @usedBy ConcreteBlockCalc (grout fill estimation)
 */
export function groutVolume(
  blockCount: number,
  coreVolFt3: number = 0.0116
): number {
  return blockCount * coreVolFt3;
}

// ============================================================================
// Section 6 — Cost Estimators
// ============================================================================

/**
 * Calculate material cost with optional waste factor.
 *
 * Formula: subtotal = quantity × pricePerUnit
 *          withWaste = subtotal × (1 + wastePercent / 100)
 *
 * Source: Used in ConcreteDrivewayCostCalc, ConcreteSlabCostCalc, GravelCostCalc,
 *         CinderBlockCalc, CMUBlockCalc
 *
 * @param quantity     - Number of units (bags, blocks, cubic yards, tons, etc.)
 * @param pricePerUnit - Price per unit in dollars
 * @param wastePercent - Waste percentage (default: 0 for no additional waste)
 * @returns CostResult with subtotal and waste-adjusted total
 *
 * @usedBy ConcreteSlabCostCalc, ConcreteDrivewayCostCalc, GravelCostCalc, CinderBlockCalc
 */
export function materialCost(
  quantity: number,
  pricePerUnit: number,
  wastePercent: number = 0
): CostResult {
  const subtotal = quantity * pricePerUnit;
  return {
    subtotal,
    withWaste: subtotal * (1 + wastePercent / 100),
  };
}

/**
 * Calculate concrete delivery cost with short-load fee logic.
 *
 * Many ready-mix companies charge a base delivery rate per yard,
 * plus a short-load fee if the order is below a minimum.
 *
 * Source: ConcreteDrivewayCostCalc.tsx delivery logic
 *
 * @param cubicYards   - Total cubic yards ordered
 * @param deliveryRate - Delivery cost per cubic yard (default: 0)
 * @param minYards     - Minimum yards before short-load fee applies (default: 10)
 * @param shortLoadFee - Flat fee if order is below minYards (default: 0)
 * @returns Total delivery cost in dollars
 *
 * @usedBy ConcreteDrivewayCostCalc, ConcreteSlabCostCalc
 */
export function deliveryCost(
  cubicYards: number,
  deliveryRate: number = 0,
  minYards: number = 10,
  shortLoadFee: number = 0
): number {
  const baseCost = cubicYards * deliveryRate;
  const shortLoad = cubicYards < minYards ? shortLoadFee : 0;
  return baseCost + shortLoad;
}

// ============================================================================
// Section 7 — Compliance Checks
// ============================================================================

/**
 * Check slab thickness against minimum requirements.
 *
 * ACI 318 / IRC reference: Minimum 4″ for residential slabs.
 * Source: ConcreteSidewalkCalc.tsx ACPA warnings,
 *         various compliance checks in calculators
 *
 * @param thicknessInches - Slab thickness in inches
 * @returns Warning message string, or null if compliant
 *
 * @usedBy SlabConcreteCalc, ConcreteSlabCostCalc, ConcreteSidewalkCalc
 */
export function checkSlabThickness(thicknessInches: number): string | null {
  if (thicknessInches < 4) {
    return "ACI/IRC: Most residential slabs require a minimum thickness of 4 inches. Consider increasing for structural adequacy.";
  }
  return null;
}

/**
 * Check footing depth against frost line requirements.
 *
 * IRC R403.1.4: Footings must extend below frost line.
 *
 * @param depthInches     - Footing depth below grade in inches
 * @param frostLineInches - Local frost line depth in inches
 * @returns Warning message string, or null if compliant
 *
 * @usedBy FootingConcreteCalc
 */
export function checkFootingDepth(
  depthInches: number,
  frostLineInches: number
): string | null {
  if (depthInches < frostLineInches) {
    return `IRC R403.1.4: Footing depth (${depthInches}″) is above the local frost line (${frostLineInches}″). Footings should extend at minimum to the frost line depth to prevent frost heave.`;
  }
  return null;
}

/**
 * Check concrete mix strength (PSI) against application requirements.
 *
 * Source: ConcreteSlabLoadCapacityCalc.tsx, NominalMixConcreteCalc.tsx warnings
 *
 * Common minimums:
 * - Residential slab: 2500 PSI
 * - Driveway: 3000 PSI
 * - Structural: 3500 PSI
 * - Commercial: 4000 PSI
 *
 * @param psi         - Concrete compressive strength in PSI
 * @param application - The intended use category
 * @returns Warning message string, or null if compliant
 *
 * @usedBy ConcreteSlabLoadCapacityCalc, NominalMixConcreteCalc, ConcreteDrivewayCostCalc
 */
export function checkMixStrength(
  psi: number,
  application: "residential" | "driveway" | "structural" | "commercial"
): string | null {
  const minimums: Record<string, number> = {
    residential: 2500,
    driveway: 3000,
    structural: 3500,
    commercial: 4000,
  };
  const min = minimums[application];
  if (psi < min) {
    return `The specified concrete strength (${psi} PSI) is below the recommended minimum of ${min} PSI for ${application} applications.`;
  }
  return null;
}

/**
 * Check block wall height for rebar reinforcement requirement.
 *
 * Source: ConcreteBlockCalc.tsx compliance warnings
 *
 * @param courses - Number of block courses
 * @returns Warning message string, or null if no reinforcement warning
 *
 * @usedBy ConcreteBlockCalc, CinderBlockCalc, CMUBlockCalc
 */
export function checkBlockWallReinforcement(
  courses: number
): string | null {
  if (courses > 8) {
    return "Walls over 8 courses typically require vertical rebar reinforcement per local building code. Consult a structural engineer.";
  }
  return null;
}

/**
 * Check that the dead load does not exceed the slab's factored capacity.
 *
 * Source: ConcreteSlabLoadCapacityCalc.tsx line 487-490
 *
 * @param Lmax - Maximum computed service live load (psf)
 * @returns Warning message string, or null if OK
 *
 * @usedBy ConcreteSlabLoadCapacityCalc
 */
export function checkSlabDeadLoadExceedsCapacity(
  Lmax: number
): string | null {
  if (Lmax <= 0) {
    return "Warning: Dead loads exceed factored strength. Increase slab thickness or rebar.";
  }
  return null;
}

// ============================================================================
// Section 8 — Volume conversion helpers (unit‐system agnostic)
// ============================================================================

/**
 * Volume conversion table (m³-based).
 * Source: NominalMixConcreteCalc.tsx lines 37-41 (VOL_TO_M3)
 */
export const VOL_TO_M3: Record<string, number> = {
  m3: 1,
  ft3: 0.0283168,
  yd3: 0.764555,
} as const;

/**
 * Convert any volume unit to cubic meters.
 *
 * @param value    - Volume value
 * @param fromUnit - Volume unit key ("m3", "ft3", "yd3")
 * @returns Volume in cubic meters
 *
 * @usedBy NominalMixConcreteCalc
 */
export function volumeToM3(
  value: number,
  fromUnit: "m3" | "ft3" | "yd3"
): number {
  return value * VOL_TO_M3[fromUnit];
}

// ============================================================================
// Backward compat — Re-exports mapping old concrete-calculations.ts names
// ============================================================================

/**
 * Re-export for backward compatibility with lib/concrete-calculations.ts.
 * These will be used during Phase 2 migration.
 */
export const convertToFeet = toFeet;
export const cubicFeetToCubicYards = cubicFtToYd;
export const cubicFeetToCubicMeters = cubicFtToM3;
