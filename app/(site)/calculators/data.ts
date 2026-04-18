// app/calculators/data.ts

import type { ElementType } from "react";
import {
  Container,
  Columns2,
  Ruler,
  RulerDimensionLine,
  Package2,
  BrickWall,
  Box,
  Boxes,
  Calculator,
  Briefcase,
  CircleDot,
  Layers,
  Grid2x2,
  Scale,
  AlignJustify,
  Footprints,
} from "lucide-react";

export type Category = "All" | "Beam" | "Column" | "Concrete Block" | "Concrete Yards" | "Cost" | "Footing" | "Concrete Mix" | "Misc. Concrete" | "Pier/Caisson" | "Slab" | "Staircase" | "Tank/Trench" | "Wall" | "Concrete Bags" | "Gravel" | "Reinforcement and Structural";

export type CalcCard = {
  id: string;
  title: string;
  desc: string;
  category: Exclude<Category, "All">;
  icon: ElementType;
};

export const CALCULATORS: CalcCard[] = [
  {
    id: "calculators/beam/beam-concrete-calculator",
    title: "Beam Concrete Calculator",
    desc: "Estimate concrete for beams and lintels.",
    category: "Beam",
    icon: Package2,
  },
  {
    id: "calculators/column/column-concrete-calculator",
    title: "Column Concrete Calculator",
    desc: "Volume for square, rectangular, and circular columns.",
    category: "Column",
    icon: Columns2,
  },
  {
    id: "calculators/concrete-yards/concrete-yards-calculator",
    title: "Concrete Yards Calculator",
    desc: "Convert and compute volume into cubic yards.",
    category: "Concrete Yards",
    icon: Ruler,
  },
  {
    id: "calculators/footing/footing-concrete-calculator",
    title: "Footing Concrete Calculator",
    desc: "Continuous, isolated, and combined footings.",
    category: "Footing",
    icon: RulerDimensionLine,
  },
  {
    id: "calculators/concrete-mix/nominal-mix-m5-m25-calculator",
    title: "Nominal Mix M5-M25 Calculator",
    desc: "Nominal Mix M5-M25 Calculator",
    category: "Concrete Mix",
    icon: Boxes,
  },
  {
    id: "calculators/concrete-mix/mortar-calculator",
    title: "Mortar Calculator",
    desc: "Estimate 80 lb, 60 lb, and 40 lb mortar bag counts for block walls, brick veneer, and stone veneer with ASTM C270 type selection and waste allowance.",
    category: "Concrete Mix",
    icon: BrickWall,
  },
  {
    id: "calculators/pier-caisson/pier-caisson-concrete-calculator",
    title: "Pier / Caisson Concrete Calculator",
    desc: "Cylindrical shafts and drilled piers by length.",
    category: "Pier/Caisson",
    icon: Box,
  },
  {
    id: "calculators/pier-caisson/sonotube-concrete-calculator",
    title: "Sonotube Concrete Calculator",
    desc: "Volume, cubic yards & bag counts for cylindrical tube forms.",
    category: "Pier/Caisson",
    icon: Box,
  },
  {
    id: "calculators/slab/slab-concrete-calculator",
    title: "Slab Concrete Calculator",
    desc: "Estimate concrete for slabs, patios, and floors.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/slab/concrete-slab-cost-calculator",
    title: "Concrete Slab Cost Calculator",
    desc: "Estimate cost of concrete for slabs, patios, and floors.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/slab/concrete-slab-weight-calculator",
    title: "Concrete Slab Weight Calculator",
    desc: "Estimate weight of concrete for slabs, patios, and floors.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/slab/concrete-slab-load-capacity-calculator",
    title: "Concrete Slab Load Capacity Calculator",
    desc: "Estimate load capacity of concrete slabs.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/slab/concrete-sidewalk-calculator",
    title: "Concrete Sidewalk Calculator",
    desc: "Estimate concrete volume, bags, and cost for slabs, patios, and floors.",
    category: "Slab",
    icon: Footprints,
  },
  {
    id: "calculators/slab/concrete-patio-calculator",
    title: "Concrete Patio Calculator",
    desc: "Estimate concrete volume, bags, and cost for slabs, patios, and floors.",
    category: "Slab",
    icon: Footprints,
  },
  {
    id: "calculators/staircase/staircase-concrete-calculator",
    title: "Staircase Concrete Calculator",
    desc: "Flights, landings, risers, and treads volume.",
    category: "Staircase",
    icon: Boxes,
  },
  {
    id: "calculators/tank-trench/tank-trench-concrete-calculator",
    title: "Tank or Trench Concrete Calc",
    desc: "Calculate concrete volume for tanks or trench structures easily.",
    category: "Tank/Trench",
    icon: Boxes,
  },
  {
    id: "calculators/wall/wall-concrete-calculator",
    title: "Wall Concrete Calculator",
    desc: "Vertical concrete wall volumes, single or multi-segment.",
    category: "Wall",
    icon: BrickWall,
  },
  {
    id: "calculators/wall/retaining-wall-calculator",
    title: "Retaining Wall Calculator",
    desc: "Estimate SRW blocks, drainage gravel, geogrid layers, and installed cost — with IBC 2021 §1807.2.3 compliance checks for walls over 4 ft.",
    category: "Wall",
    icon: BrickWall,
  },
  {
    id: "calculators/concrete-bags/concrete-bag-calculator",
    title: "Concrete Bag Calculator",
    desc: "Calculate how many concrete bags you need with unit conversions",
    category: "Concrete Bags",
    icon: Briefcase,
  },
  {
    id: "calculators/driveway/concrete-driveway-cost-calculator",
    title: "Concrete Driveway Cost Calculator",
    desc: "Estimate cost of concrete for driveways.",
    category: "Cost",
    icon: Container,
  },
  {
    id: "calculators/concrete-block/concrete-block-calculator",
    title: "Concrete Block Estimator Calculator",
    desc: "Estimate concrete blocks, mortar, grout, reinforcement, and cost for CMU block walls.",
    category: "Concrete Block",
    icon: BrickWall,
  },
  {
    id: "calculators/concrete-block/cinder-block-calculator",
    title: "Cinder Block Calculator",
    desc: "Calculate cinder block quantity, mortar bags, and total wall cost including openings deduction and waste allowance.",
    category: "Concrete Block",
    icon: BrickWall,
  },
  {
    id: "calculators/concrete-block/cmu-block-calculator",
    title: "CMU Block Calculator",
    desc: "Estimate CMU block quantity, deduct openings, add waste, and calculate full installed wall cost.",
    category: "Concrete Block",
    icon: BrickWall,
  },
  {
    id: "calculators/miscellaneous/post-hole-concrete-calculator",
    title: "Post Hole Concrete Calculator",
    desc: "Estimate concrete, gravel, and bag counts for fence posts, gate posts, deck posts, and more.",
    category: "Misc. Concrete",
    icon: CircleDot,
  },
  {
    id: "calculators/miscellaneous/crushed-concrete-calculator",
    title: "Crushed Concrete Estimator Calculator",
    desc: "Calculate crushed concrete volume, tons, coverage, and total cost with compaction adjustments.",
    category: "Misc. Concrete",
    icon: CircleDot,
  },
  {
    id: "calculators/miscellaneous/fence-post-calculator",
    title: "Fence Post Concrete Calculator",
    desc: "Calculate concrete bags and volume for fence posts by total fence length and post spacing, with post displacement subtraction and IRC depth check.",
    category: "Misc. Concrete",
    icon: CircleDot,
  },
  {
    id: "calculators/gravel/gravel-calculator",
    title: "Gravel Calculator",
    desc: "Calculate gravel volume, tons, cubic yards, and estimated cost.",
    category: "Gravel",
    icon: Layers,
  },
  {
    id: "calculators/gravel/gravel-driveway-calculator",
    title: "Gravel Driveway Calculator",
    desc: "Estimate driveway gravel in tons, yards, and total cost.",
    category: "Gravel",
    icon: Layers,
  },
  {
    id: "calculators/gravel/pea-gravel-calculator",
    title: "Pea Gravel Calculator",
    desc: "Estimate pea gravel needed for landscaping.",
    category: "Gravel",
    icon: Layers,
  },
  {
    id: "calculators/gravel/gravel-tons-to-yards-calculator",
    title: "Gravel Tons to Yards Calculator",
    desc: "Convert between gravel tons and cubic yards.",
    category: "Gravel",
    icon: Layers,
  },
  {
    id: "calculators/gravel/gravel-cost-calculator",
    title: "Gravel Cost Calculator",
    desc: "Estimate total project cost including delivery for gravel projects.",
    category: "Cost",
    icon: Layers,
  },
  {
    id: "calculators/gravel/aquarium-gravel-calculator",
    title: "Aquarium Gravel Calculator",
    desc: "Calculate pounds and bags of gravel for your aquarium.",
    category: "Gravel",
    icon: Layers,
  },
  {
    id: "calculators/reinforcement/rebar-calculator",
    title: "Rebar Calculator",
    desc: "Estimate rebar bars, linear footage, weight, and cost for slabs, footings, and walls.",
    category: "Reinforcement and Structural",
    icon: Layers,
  },
  {
    id: "calculators/reinforcement/wire-mesh-calculator",
    title: "Wire Mesh Calculator",
    desc: "Estimate welded wire fabric rolls, sheets, weight, and cost for concrete slabs, driveways, sidewalks, and industrial floors.",
    category: "Reinforcement and Structural",
    icon: Grid2x2,
  },
  {
    id: "calculators/reinforcement/rebar-weight-calculator",
    title: "Rebar Weight Calculator",
    desc: "Convert rebar linear footage to weight in lbs, tons, and kg, or reverse from a tonnage spec to footage — for procurement, logistics, and cost planning.",
    category: "Reinforcement and Structural",
    icon: Scale,
  },
  {
    id: "calculators/reinforcement/rebar-spacing-calculator",
    title: "Rebar Spacing Calculator",
    desc: "Calculate rebar bar count from a target c-t-c spacing or find spacing from a bar count, with ACI 318-19 compliance checks for slabs, footings, walls, and beams.",
    category: "Reinforcement and Structural",
    icon: AlignJustify,
  },


];

export const CATEGORIES: Category[] = ["All", "Beam", "Column", "Concrete Block", "Concrete Yards", "Cost", "Footing", "Concrete Mix", "Misc. Concrete", "Pier/Caisson", "Slab", "Staircase", "Tank/Trench", "Wall", "Concrete Bags", "Gravel", "Reinforcement and Structural"];

export const FALLBACK_ICON: ElementType = Calculator;
