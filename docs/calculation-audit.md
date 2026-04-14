# Concrete Calculator Audit Report


## 1. Calculator Summary Table

| Calculator Name | Formulas Used (verbatim sample) | Lookup Tables | Compliance Warnings | Shape Modes |
|---|---|---|---|---|
| BeamConcreteCalc | `const gross = L_m * b_m * d_m;`<br>`const voidVol = hasVoid ? vL_m * vW_m * vD_m : 0;` | None | 4 warnings found | None |
| CinderBlockCalc | `const raw = e.target.value.replace(/,/g, "");`<br>`const grossArea = wl * wh;` | BLOCK_SIZES | 1 warnings found | None |
| CMUBlockCalc | `const raw = e.target.value.replace(/,/g, "");`<br>`const grossArea = wl * wh * wq;` | BLOCK_SIZES | None | None |
| ColumnConcreteCalc | `const stepClass = "pt-6 mt-4 border-t border-slate-800"; // clear separation between steps`<br>`const v = e.target.value.replace(/,/g, "");` | None | 1 warnings found | rectangular, circular, Circular |
| ConcreteBagsCalc | `const M3_TO_FT3 = 1 / FT3_TO_M3; // 35.3146667`<br>`const YD3_TO_M3 = 1 / M3_TO_YD3;` | None | 1 warnings found | None |
| ConcreteBlockCalc | `const BLOCK_FACE_SQ_FT = 128 / 144; // 0.8889`<br>`const LOGO_URL = "/logo.svg";` | None | 23 warnings found | None |
| ConcreteDrivewayCostCalc | `const v = e.target.value.replace(/,/g, "");`<br>`const AREA_FT2 = L * W + EA;` | None | 11 warnings found | None |
| ConcreteSidewalkCalc | `const LOGO_URL = "/logo.svg";`<br>`const v = e.target.value.replace(/,/g, "");` | None | 43 warnings found | None |
| ConcreteSlabCostCalc | `const v = e.target.value.replace(/,/g, "");`<br>`const orPercent = (parseFloat(overrun) || 0) / 100;` | None | 1 warnings found | None |
| ConcreteSlabLoadCapacityCalc | `const v = e.target.value.replace(/,/g, "");`<br>`const d = h - cov - bar.diameter / 2;` | None | 29 warnings found | None |
| ConcreteSlabWeightCalc | `const v = e.target.value.replace(/,/g, "");`<br>`const Lm = L * toMetersFactor[lengthUnit];` | None | None | None |
| ConcreteYardsCalc | `const r_ft = D_ft / 2;`<br>`const vol_with_waste_ft3 = volume_ft3 * (1 + wastePct / 100);` | None | 1 warnings found | Circular |
| CrushedConcreteCalc | `const ft3ToYd3 = (v: number) => v / 27;`<br>`const ft3ToM3 = (v: number) => v * 0.0283168;` | None | 7 warnings found | None |
| FootingConcreteCalc | `const stepClass = "pt-6 mt-4 border-t border-slate-800"; // clear separation between steps`<br>`const v = e.target.value.replace(/,/g, "");` | None | 1 warnings found | rectangular, circular, Circular |
| NominalMixConcreteCalc | `const v = e.target.value.replace(/,/g, "");`<br>`const volM3 = (Number.isFinite(volEntered) ? Math.max(volEntered, 0) : 0) * VOL_TO_M3[unitVol];` | None | 2 warnings found | None |
| PierCaissonCalc | `const r = diameter_m / 2;`<br>`const R1 = topDia_m / 2;` | None | 1 warnings found | None |
| PostHoleConcreteCalc | `const ft3ToYd3 = (v: number) => v / 27;`<br>`const ft3ToM3 = (v: number) => v * 0.0283168;` | None | 1 warnings found | None |
| RebarCalc | `const LOGO_URL = "/logo.svg";`<br>`const v = e.target.value.replace(/,/g, "");` | BAR_DATA | 28 warnings found | None |
| RebarSpacingCalc | `const LOGO_URL = "/logo.svg";`<br>`const v = e.target.value.replace(/,/g, "");` | BAR_DATA | 90 warnings found | None |
| RebarWeightCalc | `const LOGO_URL = "/logo.svg";`<br>`const v = e.target.value.replace(/,/g, "");` | BAR_DATA | 14 warnings found | None |
| SlabConcreteCalc | `const v = e.target.value.replace(/,/g, "");`<br>`const Lm = L * toMetersFactor[lengthUnit];` | None | 1 warnings found | None |
| StaircaseConcreteCalc | `const raw = e.target.value.replace(/,/g, "");`<br>`const totalRun_m = nSteps * tread_m;` | None | 3 warnings found | None |
| TankTrenchConcreteCalc | `const toMeters = (v: number, u: LinearUnit) => clamp(v) * UNIT_TO_M[u];`<br>`const m3ToYd3 = (m3: number) => m3 * 1.30795062;` | UNIT_TO_M | 1 warnings found | Rectangular, Trapezoidal |
| WallConcreteCalc | `const LOGO_URL = "/logo.svg";`<br>`const netVolumeM3 = Math.max(0, wallVolumeM3 - openingsVolumeM3);` | MIX_PARTS | 1 warnings found | None |
| WireMeshCalc | `const LOGO_URL = "/logo.svg";`<br>`const v = e.target.value.replace(/,/g, "");` | MESH_DATA | 32 warnings found | None |

## 2. Formula Duplication Matrix

| Formula | Used In | Count |
|---|---|---|
| `LOGO_URL = "/logo.svg";` | BeamConcrete, CinderBlock, CMUBlock, ConcreteBags, ConcreteBlock, ConcreteDrivewayCost, ConcreteSidewalk, ConcreteSlabCost, ConcreteYards, PierCaisson, PostHoleConcrete, Rebar, RebarSpacing, RebarWeight, StaircaseConcrete, TankTrenchConcrete, WallConcrete, WireMesh | 18 |
| `v = e.target.value.replace(/,/g, "");` | ColumnConcrete, ConcreteBlock, ConcreteDrivewayCost, ConcreteSidewalk, ConcreteSlabCost, ConcreteSlabLoadCapacity, ConcreteSlabWeight, ConcreteYards, FootingConcrete, NominalMixConcrete, Rebar, RebarSpacing, RebarWeight, SlabConcrete, TankTrenchConcrete, WallConcrete, WireMesh | 17 |
| `raw = e.target.value.replace(/,/g, "");` | CinderBlock, CMUBlock, ConcreteBags, CrushedConcrete, PierCaisson, PostHoleConcrete, StaircaseConcrete | 7 |
| `numberOrEmpty = (v: string) => (v === "" ? "" : v.replace(/[^0-9.]/g, ""));` | ConcreteDrivewayCost, ConcreteSlabCost, ConcreteSlabWeight, SlabConcrete | 4 |
| `yd3_5 = yd3 * 1.05;` | BeamConcrete, ColumnConcrete, FootingConcrete | 3 |
| `Lm = L * toMetersFactor[lengthUnit];` | ConcreteSlabCost, ConcreteSlabWeight, SlabConcrete | 3 |
| `Wm = W * toMetersFactor[widthUnit];` | ConcreteSlabCost, ConcreteSlabWeight, SlabConcrete | 3 |
| `Tm = T * toMetersFactor[thicknessUnit];` | ConcreteSlabCost, ConcreteSlabWeight, SlabConcrete | 3 |
| `blockFaceArea_ft2 = (nomL_in / 12) * (nomH_in / 12);` | CinderBlock, CMUBlock | 2 |
| `blocksPerSqFt = blockFaceArea_ft2 > 0 ? 1 / blockFaceArea_ft2 : 0;` | CinderBlock, CMUBlock | 2 |
| `blocksRaw = netArea * blocksPerSqFt;` | CinderBlock, CMUBlock | 2 |
| `wasteBlocks = blocksRaw * (waste / 100);` | CinderBlock, CMUBlock | 2 |
| `finalBlocks = Math.ceil(blocksRaw + wasteBlocks);` | CinderBlock, CMUBlock | 2 |
| `blockCostTotal = finalBlocks * cpb;` | CinderBlock, CMUBlock | 2 |
| `laborCost = netArea * laborCostPerSqFtVal;` | CinderBlock, CMUBlock | 2 |
| `taxAmount = materialTotal * (taxPctVal / 100);` | CinderBlock, CMUBlock | 2 |
| `costPerSqFt = netArea > 0 ? installedTotal / netArea : 0;` | CinderBlock, CMUBlock | 2 |
| `stepClass = "pt-6 mt-4 border-t border-slate-800"; // clear separation between steps` | ColumnConcrete, FootingConcrete | 2 |
| `yd3_10 = yd3 * 1.1;` | ColumnConcrete, FootingConcrete | 2 |
| `clean = v.replace(/[^0-9]/g, "");` | ColumnConcrete, PierCaisson | 2 |
| `area_m2 = Lm * Wm;` | ConcreteSlabCost, SlabConcrete | 2 |
| `volume_m3 = area_m2 * Tm;` | ConcreteSlabCost, ConcreteSlabWeight | 2 |
| `area_sqft = area_m2 / (0.3048 ** 2);` | ConcreteSlabCost, ConcreteSlabWeight | 2 |
| `volume_cuft = volume_m3 / (0.3048 ** 3);` | ConcreteSlabCost, ConcreteSlabWeight | 2 |
| `volume_cuyd = volume_cuft / 27;` | ConcreteSlabCost, ConcreteSlabWeight | 2 |
| `ft3ToYd3 = (v: number) => v / 27;` | CrushedConcrete, PostHoleConcrete | 2 |
| `ft3ToM3 = (v: number) => v * 0.0283168;` | CrushedConcrete, PostHoleConcrete | 2 |

## 3. Lookup Tables

### 1. BLOCK_SIZES
```typescript
const BLOCK_SIZES: BlockSize[] = [
  { label: '4 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 4 },
  { label: '6 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 6 },
  { label: '8 × 8 × 16 in (nominal) — Standard', nomH_in: 8, nomL_in: 16, nomW_in: 8 },
  { label: '10 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 10 },
  { label: '12 × 8 × 16 in (nominal)', nomH_in: 8, nomL_in: 16, nomW_in: 12 },
  { label: 'Custom size', nomH_in: 0, nomL_in: 0, nomW_in: 0 },
];

```
### 2. BAR_DATA
```typescript
const BAR_DATA: Record<BarSize, BarData> = {
    "3":  { diameter: 0.375, area: 0.11, lbPerFt: 0.376, kgPerM: 0.560, commonUse: "Temperature / shrinkage ties, light flatwork" },
    "4":  { diameter: 0.500, area: 0.20, lbPerFt: 0.668, kgPerM: 0.994, commonUse: "Driveways, patios, residential footings" },
    "5":  { diameter: 0.625, area: 0.31, lbPerFt: 1.043, kgPerM: 1.552, commonUse: "Structural slabs, beams, residential columns" },
    "6":  { diameter: 0.750, area: 0.44, lbPerFt: 1.502, kgPerM: 2.235, commonUse: "Heavy beams, retaining walls" },
    "7":  { diameter: 0.875, area: 0.60, lbPerFt: 2.044, kgPerM: 3.042, commonUse: "Foundations, large retaining walls" },
    "8":  { diameter: 1.000, area: 0.79, lbPerFt: 2.670, kgPerM: 3.973, commonUse: "Heavy columns, mat foundations" },
    "9":  { diameter: 1.128, area: 1.00, lbPerFt: 3.400, kgPerM: 5.060, commonUse: "Bridge decks, transfer slabs" },
    "10": { diameter: 1.270, area: 1.27, lbPerFt: 4.303, kgPerM: 6.404, commonUse: "High-rise columns, heavy structural members" },
};
```
### 3. MESH_DATA (WireMeshCalc.tsx)
```typescript
const MESH_DATA: Record<Exclude<MeshKey, "custom">, MeshData> = {
  "6x6-W1.4": { lonSpacing: 6, transSpacing: 6, wNumber: 1.4, wireDia: 0.135, wtPerSqFt: 0.21, commonUse: "Sidewalks, residential driveways (light passenger cars)." },
  "6x6-W2.0": { lonSpacing: 6, transSpacing: 6, wNumber: 2.0, wireDia: 0.160, wtPerSqFt: 0.29, commonUse: "Heavy residential driveways, light commercial slabs." },
  "6x6-W2.9": { lonSpacing: 6, transSpacing: 6, wNumber: 2.9, wireDia: 0.192, wtPerSqFt: 0.42, commonUse: "Industrial floors, continuous heavy vehicle traffic." },
  "4x4-W1.4": { lonSpacing: 4, transSpacing: 4, wNumber: 1.4, wireDia: 0.135, wtPerSqFt: 0.31, commonUse: "Thinner slabs requiring tighter crack control." },
  "4x4-W2.0": { lonSpacing: 4, transSpacing: 4, wNumber: 2.0, wireDia: 0.160, wtPerSqFt: 0.43, commonUse: "Commercial slabs with moderate fork truck traffic." },
  "4x4-W2.9": { lonSpacing: 4, transSpacing: 4, wNumber: 2.9, wireDia: 0.192, wtPerSqFt: 0.62, commonUse: "Heavy duty industrial paving." },
};
```
### 4. FORM_DATA (WireMeshCalc.tsx)
```typescript
const FORM_DATA: Record<FormFactor, FormData> = {
  roll:  { sqFt: 750, isRoll: true,  desc: "5' × 150' Roll" },
  sheet: { sqFt: 80,  isRoll: false, desc: "8' × 10' Sheet" },
};
```
### 5. MIX_PARTS (WallConcreteCalc.tsx)
```typescript
const MIX_PARTS: Record<Mix, { c: number; s: number; a: number; total: number }> = {
  "1:2:4":   { c: 1, s: 2,   a: 4,   total: 7 },
  "1:1.5:3": { c: 1, s: 1.5, a: 3,   total: 5.5 },
  "1:3:6":   { c: 1, s: 3,   a: 6,   total: 10 },
  "custom":  { c: 1, s: 2,   a: 4,   total: 7 },
};
```
### 6. UNIT_TO_M (TankTrenchConcreteCalc.tsx)
```typescript
const UNIT_TO_M: Record<LinearUnit, number> = {
  m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144
};
```


## 4. Complex / Specialized Formulas (Beyond Volume = L * W * D)

The following formulas handle scenario-specific calculations:

- `const wedgeVol = 0.5 * nSteps * tread_m * riser_m * width_m;` (Staircase)
- `const blocksRaw = netArea * blocksPerSqFt;` (Block calculators)
- `const perCol = Math.PI * r_m * r_m * h_m;` (Circular Columns)
- `const horizReinfLenFt = horizRuns * wallLenFtTotal;` (Concrete Block Rebar)
- `const acpaMaxCtrl = Math.min(widFt * ACPA_CTRL_MULTIPLIER, ACPA_CTRL_ABS_MAX_FT);` (Sidewalks)
- `const a = (As * fyp) / (0.85 * fcp * b);` (Slab Load Capacity Whitney Stress Block)
- `const Mn = As * fyp * (d - a / 2);` (Slab Flexural Moment)
- `const outerVol = Math.PI * Math.pow(Do / 2, 2) * Ho;` (Circular Tank Core)
- `const cementVol = (parts.c / parts.total) * dryVol;` (Nominal Mix/Wall)
- `const phiVc = phiV * 2 * lambda * Math.sqrt(fcp) * b * d;` (Slab Shear Capacity)
- `const Lmax = (wu_max - 1.2 * totalDead) / 1.6;` (Slab live load calculation)