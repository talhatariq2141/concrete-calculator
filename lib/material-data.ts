/**
 * lib/material-data.ts
 *
 * Centralized lookup tables and constants for ConcreteCalculatorMax.
 * Every table is exported as a typed const with a human-readable label field.
 * All values are verbatim from the existing calculator source code.
 *
 * @module material-data
 */

// ============================================================================
// Section 1 — Concrete Bag Coverage
// ============================================================================

/**
 * Pre-mixed concrete bag yields in cubic feet and cubic yards per bag.
 *
 * Source: PostHoleConcreteCalc.tsx lines 31-36 (BAG_YIELDS)
 *   40 lb → 0.30 ft³ / 0.011 yd³
 *   50 lb → 0.375 ft³ / 0.0139 yd³
 *   60 lb → 0.45 ft³ / 0.0167 yd³
 *   80 lb → 0.60 ft³ / 0.0222 yd³
 */
export const CONCRETE_BAG_COVERAGE = {
  40: { label: "40 lb bag",  cubicFeet: 0.30,  cubicYards: 0.011  },
  50: { label: "50 lb bag",  cubicFeet: 0.375, cubicYards: 0.0139 },
  60: { label: "60 lb bag",  cubicFeet: 0.45,  cubicYards: 0.0167 },
  80: { label: "80 lb bag",  cubicFeet: 0.60,  cubicYards: 0.0222 },
} as const;

/** Type alias for bag size keys */
export type BagSizeKey = keyof typeof CONCRETE_BAG_COVERAGE;

// ============================================================================
// Section 2 — Concrete Densities
// ============================================================================

/**
 * Concrete densities in lb/ft³ for weight calculations.
 *
 * Source: ConcreteSlabWeightCalc.tsx lines 101-105 (densities array)
 */
export const CONCRETE_DENSITIES = {
  standard: {
    label: "Standard Concrete",
    lbPerFt3: 150,
    desc: "~150 lb/ft³",
  },
  reinforced: {
    label: "Reinforced Concrete",
    lbPerFt3: 156,
    desc: "~156 lb/ft³",
  },
  lightweight: {
    label: "Lightweight Concrete",
    lbPerFt3: 110,
    desc: "~70–120 lb/ft³",
  },
} as const;

/** Type alias for concrete density keys */
export type ConcreteDensityKey = keyof typeof CONCRETE_DENSITIES;

// ============================================================================
// Section 3 — Gravel / Crushed Concrete Densities
// ============================================================================

/**
 * Crushed concrete and recycled aggregate densities in lb/ft³.
 *
 * Source: CrushedConcreteCalc.tsx lines 26-31 (DENSITIES),
 *         lines 33-38 (DENSITY_LABELS)
 */
export const GRAVEL_DENSITIES = {
  standard: {
    label: "Standard Crushed Concrete",
    lbPerFt3: 105,
    desc: "105 lb/ft³",
  },
  compact: {
    label: "Compact Recycled Concrete",
    lbPerFt3: 115,
    desc: "115 lb/ft³",
  },
  light: {
    label: "Light Recycled Aggregate",
    lbPerFt3: 95,
    desc: "95 lb/ft³",
  },
} as const;

/** Type alias for gravel density keys */
export type GravelDensityKey = keyof typeof GRAVEL_DENSITIES;

// ============================================================================
// Section 4 — Block Sizes (CMU / Cinder Block)
// ============================================================================

/**
 * Standard CMU block nominal dimensions in inches (height × length × width).
 * Nominal dimensions include the mortar joint (standard 3/8 in) per ASTM C90.
 *
 * Source: CinderBlockCalc.tsx lines 45-53 (BLOCK_SIZES array),
 *         CMUBlockCalc.tsx lines 63-70 (BLOCK_SIZES array — identical values)
 */
export const BLOCK_SIZES = [
  { label: "4 × 8 × 16 in (nominal)",           nomH_in: 8, nomL_in: 16, nomW_in: 4  },
  { label: "6 × 8 × 16 in (nominal)",           nomH_in: 8, nomL_in: 16, nomW_in: 6  },
  { label: "8 × 8 × 16 in (nominal) — Standard", nomH_in: 8, nomL_in: 16, nomW_in: 8  },
  { label: "10 × 8 × 16 in (nominal)",          nomH_in: 8, nomL_in: 16, nomW_in: 10 },
  { label: "12 × 8 × 16 in (nominal)",          nomH_in: 8, nomL_in: 16, nomW_in: 12 },
  { label: "Custom size",                        nomH_in: 0, nomL_in: 0,  nomW_in: 0  },
] as const;

/** Type for a single block size entry */
export type BlockSizeEntry = (typeof BLOCK_SIZES)[number];

// ============================================================================
// Section 5 — PSI Grades (Rebar / Slab structural data)
// ============================================================================

/**
 * Common concrete compressive strength grade presets and their minimum
 * application recommendations from ACI 318 / IRC.
 *
 * Note: PSI values used directly in ConcreteSlabLoadCapacityCalc.tsx
 * as selectable concrete strengths (f'c). The calc component uses
 * user-entered psi values; these presets inform the compliance checker.
 */
export const PSI_GRADES = {
  2500: { label: "2500 PSI — Residential slabs (minimum)",        psi: 2500, minApp: "Light residential flatwork, patios"           },
  3000: { label: "3000 PSI — General purpose",                    psi: 3000, minApp: "Driveways, sidewalks, standard slabs"          },
  3500: { label: "3500 PSI — Structural (recommended minimum)",   psi: 3500, minApp: "Structural slabs, beams, columns"              },
  4000: { label: "4000 PSI — Commercial / industrial",            psi: 4000, minApp: "Industrial floors, elevated slabs, bridges"    },
  5000: { label: "5000 PSI — High strength",                      psi: 5000, minApp: "High-rise columns, heavy structural members"   },
} as const;

/** Type alias for PSI grade keys */
export type PsiGradeKey = keyof typeof PSI_GRADES;

// ============================================================================
// Section 6 — Nominal Mix Ratios (Indian standard mix grades)
// ============================================================================

/**
 * Nominal mix grade keys (Indian Standards BIS 456:2000).
 */
export type NominalMixGrade = "M5" | "M7.5" | "M10" | "M15" | "M20" | "M25";

/**
 * Mix ratios and default water-cement ratios for each nominal grade.
 * Expressed as cement : sand : aggregate (by volume).
 *
 * Source: NominalMixConcreteCalc.tsx lines 28-35 (MIX_MAP)
 */
export const NOMINAL_MIX_RATIOS: Record<
  NominalMixGrade,
  { label: string; c: number; s: number; a: number; wc: number }
> = {
  M5:    { label: "M5 (1:5:10)",    c: 1, s: 5,   a: 10, wc: 0.65 },
  "M7.5":{ label: "M7.5 (1:4:8)",  c: 1, s: 4,   a: 8,  wc: 0.62 },
  M10:   { label: "M10 (1:3:6)",   c: 1, s: 3,   a: 6,  wc: 0.60 },
  M15:   { label: "M15 (1:2:4)",   c: 1, s: 2,   a: 4,  wc: 0.55 },
  M20:   { label: "M20 (1:1.5:3)", c: 1, s: 1.5, a: 3,  wc: 0.50 },
  M25:   { label: "M25 (1:1:2)",   c: 1, s: 1,   a: 2,  wc: 0.45 },
} as const;

// ============================================================================
// Section 7 — Wall Mix Parts (nominal ratio by expression)
// ============================================================================

/**
 * Volumetric mix ratios expressed as string denominators.
 * Used by WallConcreteCalc and compatible with mixRatioSplit().
 *
 * Source: WallConcreteCalc.tsx lines 36-41 (MIX_PARTS)
 */
export const MIX_PARTS = {
  "1:1.5:3": { label: "1:1.5:3 (≈ M20)",  c: 1, s: 1.5, a: 3,   total: 5.5  },
  "1:2:4":   { label: "1:2:4 (≈ M15)",    c: 1, s: 2,   a: 4,   total: 7    },
  "1:3:6":   { label: "1:3:6 (≈ M10)",    c: 1, s: 3,   a: 6,   total: 10   },
} as const;

/** Type alias for mix expression keys */
export type MixPartsKey = keyof typeof MIX_PARTS;

// ============================================================================
// Section 8 — Rebar Data (ASTM standard deformed bars)
// ============================================================================

/**
 * Standard ASTM deformed rebar bar sizes with physical properties.
 *
 * Fields:
 * - diameter: nominal bar diameter (inches)
 * - area: cross-sectional area (in²)
 * - weightPerFt: weight in pounds per linear foot
 * - kgPerM: weight in kilograms per linear meter
 * - minClear: ACI 318 minimum clear spacing (inches) = diameter + 1 in
 * - commonUse: typical applications
 *
 * Source: RebarCalc.tsx lines 39-46 (BAR_DATA)
 *         calculation-audit.md lines 82-91 (BAR_DATA — includes kgPerM from RebarWeightCalc)
 */
export const REBAR_DATA = {
  "3": { label: '#3 (3/8")',  diameter: 0.375, area: 0.11, weightPerFt: 0.376, kgPerM: 0.560, minClear: 1.375, commonUse: "Ties, temperature steel, light flatwork"       },
  "4": { label: '#4 (1/2")',  diameter: 0.500, area: 0.20, weightPerFt: 0.668, kgPerM: 0.994, minClear: 1.500, commonUse: "Driveways, patios, residential footings"        },
  "5": { label: '#5 (5/8")',  diameter: 0.625, area: 0.31, weightPerFt: 1.043, kgPerM: 1.552, minClear: 1.625, commonUse: "Structural slabs, beams, residential columns"   },
  "6": { label: '#6 (3/4")',  diameter: 0.750, area: 0.44, weightPerFt: 1.502, kgPerM: 2.235, minClear: 1.750, commonUse: "Heavy beams, retaining walls"                   },
  "7": { label: '#7 (7/8")',  diameter: 0.875, area: 0.60, weightPerFt: 2.044, kgPerM: 3.042, minClear: 1.875, commonUse: "Foundations, large retaining walls"             },
  "8": { label: '#8 (1")',    diameter: 1.000, area: 0.79, weightPerFt: 2.670, kgPerM: 3.973, minClear: 2.000, commonUse: "Heavy columns, mat foundations"                 },
  "9": { label: '#9 (1-1/8")',diameter: 1.128, area: 1.00, weightPerFt: 3.400, kgPerM: 5.060, minClear: 2.128, commonUse: "Bridge decks, transfer slabs"                   },
  "10":{ label: '#10 (1-1/4")',diameter:1.270, area: 1.27, weightPerFt: 4.303, kgPerM: 6.404, minClear: 2.270, commonUse: "High-rise columns, heavy structural members"    },
} as const;

/** Type alias for rebar bar size keys */
export type RebarBarSize = keyof typeof REBAR_DATA;

// ============================================================================
// Section 9 — Welded Wire Mesh Data (ASTM A1064)
// ============================================================================

/**
 * Standard welded wire mesh (WWF) designations with physical properties.
 *
 * Fields:
 * - lonSpacing / transSpacing: wire spacing in inches (longitudinal / transverse)
 * - wNumber: W-designation (cross-sectional area = wNumber × 0.001 in²)
 * - wireDia: wire diameter in inches
 * - wtPerSqFt: weight in pounds per sq ft
 * - lightForVehicle: true = insufficient for vehicle loads per ACI 360R-10
 *
 * Source: WireMeshCalc.tsx lines 54-97 (MESH_DATA — actual component values)
 *
 * Note: The audit file had slightly different values; the component source
 * is authoritative. wtPerSqFt values: W1.4@6×6=0.21, W2.0@6×6=0.29,
 * W2.9@6×6=0.42, W1.4@4×4=0.30, W2.0@4×4=0.58, W2.9@4×4=0.84
 */
export const MESH_DATA = {
  "4x4-W1.4xW1.4": {
    label: "4×4 – W1.4×W1.4",
    lonSpacing: 4, transSpacing: 4, wNumber: 1.4, wireDia: 0.135,
    wtPerSqFt: 0.30,
    commonUse: "Sidewalks, patios, light residential flatwork",
    lightForVehicle: true,
  },
  "6x6-W1.4xW1.4": {
    label: "6×6 – W1.4×W1.4",
    lonSpacing: 6, transSpacing: 6, wNumber: 1.4, wireDia: 0.135,
    wtPerSqFt: 0.21,
    commonUse: "Standard residential slabs, light patios",
    lightForVehicle: true,
  },
  "6x6-W2.0xW2.0": {
    label: "6×6 – W2.0×W2.0",
    lonSpacing: 6, transSpacing: 6, wNumber: 2.0, wireDia: 0.160,
    wtPerSqFt: 0.29,
    commonUse: "Residential driveways, garage floors",
    lightForVehicle: false,
  },
  "6x6-W2.9xW2.9": {
    label: "6×6 – W2.9×W2.9",
    lonSpacing: 6, transSpacing: 6, wNumber: 2.9, wireDia: 0.192,
    wtPerSqFt: 0.42,
    commonUse: "Heavy driveways, commercial parking lots",
    lightForVehicle: false,
  },
  "4x4-W2.0xW2.0": {
    label: "4×4 – W2.0×W2.0",
    lonSpacing: 4, transSpacing: 4, wNumber: 2.0, wireDia: 0.160,
    wtPerSqFt: 0.58,
    commonUse: "Structural slabs, elevated decks",
    lightForVehicle: false,
  },
  "4x4-W2.9xW2.9": {
    label: "4×4 – W2.9×W2.9",
    lonSpacing: 4, transSpacing: 4, wNumber: 2.9, wireDia: 0.192,
    wtPerSqFt: 0.84,
    commonUse: "Industrial floors, heavy-load applications",
    lightForVehicle: false,
  },
} as const;

/** Type alias for mesh designation keys */
export type MeshKey = keyof typeof MESH_DATA;

// ============================================================================
// Section 10 — Wire Mesh Form Factors
// ============================================================================

/**
 * Standard purchase form factors for welded wire mesh.
 *
 * Source: WireMeshCalc.tsx lines 99-103 (FORM_DATA — actual component values)
 *
 * Note: The audit file had roll=750 sqft and sheet=80 sqft. The component
 * source supersedes: roll=750, sheet=50 (5×10), sheet-large=120 (6×20).
 */
export const FORM_DATA = {
  roll:          { label: "Roll",        sqFt: 750, desc: "5 ft × 150 ft", isRoll: true  },
  sheet:         { label: "Sheet",       sqFt: 50,  desc: "5 ft × 10 ft",  isRoll: false },
  "sheet-large": { label: "Large sheet", sqFt: 120, desc: "6 ft × 20 ft",  isRoll: false },
} as const;

/** Type alias for form factor keys */
export type FormFactorKey = keyof typeof FORM_DATA;

// ============================================================================
// Section 11 — Unit Conversion: Linear → Meters
// ============================================================================

/**
 * Multiplicative factors to convert common linear units to meters.
 *
 * Source: TankTrenchConcreteCalc.tsx lines 19-22 (UNIT_TO_M)
 */
export const UNIT_TO_M = {
  m:  1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
  yd: 0.9144,
} as const;

/** Type alias for linear unit keys */
export type LinearUnitKey = keyof typeof UNIT_TO_M;

// ============================================================================
// Section 12 — Volume Unit → Cubic Meters
// ============================================================================

/**
 * Multiplicative factors to convert volume units to cubic meters.
 *
 * Source: NominalMixConcreteCalc.tsx lines 37-41 (VOL_TO_M3)
 */
export const VOL_TO_M3 = {
  m3:  1,
  ft3: 0.0283168,
  yd3: 0.764555,
} as const;

/** Type alias for volume unit keys */
export type VolumeUnitKey = keyof typeof VOL_TO_M3;

// ============================================================================
// Section 13 — Wall Physics Constants
// ============================================================================

/**
 * Physical constants used in wall/mix calculators.
 *
 * Source: WallConcreteCalc.tsx lines 44-51
 *   BULK_DENSITY_CEMENT_KG_M3 = 1440 (bulk density of Portland cement)
 *   CEMENT_BAG_KG = 50 kg per bag (Indian/international standard)
 *   DRY_LOSS_FACTOR = 1.54 (dry volume is typically 54% more than wet)
 */
export const WALL_PHYSICS = {
  BULK_DENSITY_CEMENT_KG_M3: 1440,
  CEMENT_BAG_KG: 50,
  DRY_LOSS_FACTOR: 1.54,
} as const;

// ============================================================================
// Section 14 — Default Costs
// ============================================================================

/**
 * Default placeholder costs for optional cost estimation fields.
 * These are soft defaults used when no user input is provided.
 * Actual market prices vary by region and must be confirmed with suppliers.
 *
 * Source: Derived from field placeholder values across calculator components:
 *   - ConcreteSlabCostCalc, ConcreteDrivewayCostCalc default field values
 *   - CrushedConcreteCalc default price = $40/ton, delivery = $100
 *   - RebarCalc example prices: $0.65/lf material, $0.30/lf labor, $150 delivery
 *   - WireMeshCalc example: $0.45/sf
 */
export const DEFAULT_COSTS = {
  concretePerYard:    { label: "Concrete (per cubic yard)", usd: 150  },
  concretePerM3:      { label: "Concrete (per cubic meter)", usd: 196 },
  crushedConcretePerTon: { label: "Crushed concrete (per ton)", usd: 40  },
  delivery:           { label: "Delivery flat fee", usd: 100  },
  rebarPerLinearFt:   { label: "Rebar (per linear foot)", usd: 0.65 },
  rebarLaborPerLf:    { label: "Rebar installation labor (per lf)", usd: 0.30 },
  wireMeshPerSqFt:    { label: "Wire mesh (per sq ft)", usd: 0.45  },
  cmuBlockEach:       { label: "CMU block (each)", usd: 2.00  },
  blockLaborPerSqFt:  { label: "Block wall labor (per sq ft)", usd: 15.00 },
} as const;

/** Type alias for default cost keys */
export type DefaultCostKey = keyof typeof DEFAULT_COSTS;

// ============================================================================
// Section 15 — Rebar Table for Slab Load Capacity (subset from LoadCapacityCalc)
// ============================================================================

/**
 * Simplified rebar table used specifically in ACI 318 slab load capacity analysis.
 * This is a subset of REBAR_DATA (only diameter and area needed for the calc).
 *
 * Source: ConcreteSlabLoadCapacityCalc.tsx lines 24-31 (REBAR_TABLE)
 */
export const REBAR_TABLE_SLAB = [
  { label: "#3",  diameter: 0.375, area: 0.11 },
  { label: "#4",  diameter: 0.500, area: 0.20 },
  { label: "#5",  diameter: 0.625, area: 0.31 },
  { label: "#6",  diameter: 0.750, area: 0.44 },
  { label: "#7",  diameter: 0.875, area: 0.60 },
  { label: "#8",  diameter: 1.000, area: 0.79 },
] as const;

/** Type for a single slab rebar table entry */
export type RebarTableSlabEntry = (typeof REBAR_TABLE_SLAB)[number];
