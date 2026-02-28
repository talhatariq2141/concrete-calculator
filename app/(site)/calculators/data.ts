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
} from "lucide-react";

export type Category = "All" | "Beam" | "Column" | "Concrete Yards" | "Cost" | "Footing" | "Concrete Mix" | "Pier/Caisson" | "Slab" | "Staircase" | "Tank/Trench" | "Wall" | "Concrete Bags";

export type CalcCard = {
  id: string;
  title: string;
  desc: string;
  category: Exclude<Category, "All">;
  icon: ElementType;
};

export const CALCULATORS: CalcCard[] = [
  {
    id: "calculators/beam-concrete-calculator",
    title: "Beam Concrete Calculator",
    desc: "Estimate concrete for beams and lintels.",
    category: "Beam",
    icon: Package2,
  },
  {
    id: "calculators/column-concrete-calculator",
    title: "Column Concrete Calculator",
    desc: "Volume for square, rectangular, and circular columns.",
    category: "Column",
    icon: Columns2,
  },
  {
    id: "calculators/concrete-yards-calculator",
    title: "Concrete Yards Calculator",
    desc: "Convert and compute volume into cubic yards.",
    category: "Concrete Yards",
    icon: Ruler,
  },
  {
    id: "calculators/footing-concrete-calculator",
    title: "Footing Concrete Calculator",
    desc: "Continuous, isolated, and combined footings.",
    category: "Footing",
    icon: RulerDimensionLine,
  },
  {
    id: "calculators/nominal-mix-m5-m25-calculator",
    title: "Nominal Mix M5-M25 Calculator",
    desc: "Nominal Mix M5-M25 Calculator",
    category: "Concrete Mix",
    icon: Boxes,
  },
  {
    id: "calculators/pier-caisson-concrete-calculator",
    title: "Pier / Caisson Concrete Calculator",
    desc: "Cylindrical shafts and drilled piers by length.",
    category: "Pier/Caisson",
    icon: Box,
  },
  {
    id: "calculators/slab-concrete-calculator",
    title: "Slab Concrete Calculator",
    desc: "Estimate concrete for slabs, patios, and floors.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/staircase-concrete-calculator",
    title: "Staircase Concrete Calculator",
    desc: "Flights, landings, risers, and treads volume.",
    category: "Staircase",
    icon: Boxes,
  },
  {
    id: "calculators/tank-trench-concrete-calculator",
    title: "Tank or Trench Concrete Calc",
    desc: "Calculate concrete volume for tanks or trench structures easily.",
    category: "Tank/Trench",
    icon: Boxes,
  },
  {
    id: "calculators/wall-concrete-calculator",
    title: "Wall Concrete Calculator",
    desc: "Vertical concrete wall volumes, single or multi-segment.",
    category: "Wall",
    icon: BrickWall,
  },
  {
    id: "calculators/concrete-bag-calculator",
    title: "Concrete Bag Calculator",
    desc: "Calculate how many concrete bags you need with unit conversions",
    category: "Concrete Bags",
    icon: Briefcase,
  },
  {
    id: "calculators/concrete-slab-cost-calculator",
    title: "Concrete Slab Cost Calculator",
    desc: "Estimate cost of concrete for slabs, patios, and floors.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/concrete-slab-weight-calculator",
    title: "Concrete Slab Weight Calculator",
    desc: "Estimate weight of concrete for slabs, patios, and floors.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/concrete-slab-load-capacity-calculator",
    title: "Concrete Slab Load Capacity Calculator",
    desc: "Estimate load capacity of concrete slabs.",
    category: "Slab",
    icon: Container,
  },
  {
    id: "calculators/concrete-driveway-cost-calculator",
    title: "Concrete Driveway Cost Calculator",
    desc: "Estimate cost of concrete for driveways.",
    category: "Cost",
    icon: Container,
  }

];

export const CATEGORIES: Category[] = ["All", "Beam", "Column", "Concrete Yards", "Cost", "Footing", "Concrete Mix", "Pier/Caisson", "Slab", "Staircase", "Tank/Trench", "Wall", "Concrete Bags"];

export const FALLBACK_ICON: ElementType = Calculator;
