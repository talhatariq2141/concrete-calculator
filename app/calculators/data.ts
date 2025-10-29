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
} from "lucide-react";

export type Category = "All" | "Volume" | "Rebar" | "Masonry" | "Cost" | "Mix" | "Other";

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
    category: "Volume",
    icon: Package2,
  },
  {
    id: "calculators/column-concrete-calculator",
    title: "Column Concrete Calculator",
    desc: "Volume for square, rectangular, and circular columns.",
    category: "Volume",
    icon: Columns2,
  },  
  {
    id: "calculators/concrete-yards-calculator",
    title: "Concrete Yards Calculator",
    desc: "Convert and compute volume into cubic yards.",
    category: "Volume",
    icon: Ruler,
  },  
  {
    id: "calculators/footing-concrete-calculator",
    title: "Footing Concrete Calculator",
    desc: "Continuous, isolated, and combined footings.",
    category: "Volume",
    icon: RulerDimensionLine,
  },
  {
    id: "calculators/nominal-mix-m5-m25-calculator",
    title: "Nominal Mix M5-M25 Calculator",
    desc: "Nominal Mix M5-M25 Calculator",
    category: "Mix",
    icon: Boxes,
  },
  {
    id: "calculators/pier-caisson-concrete-calculator",
    title: "Pier / Caisson Concrete Calculator",
    desc: "Cylindrical shafts and drilled piers by length.",
    category: "Volume",
    icon: Box,
  },    
  {
    id: "calculators/slab-concrete-calculator",
    title: "Slab Concrete Calculator",
    desc: "Estimate concrete for slabs, patios, and floors.",
    category: "Volume",
    icon: Container,
  },
  {
    id: "calculators/staircase-concrete-calculator",
    title: "Staircase Concrete Calculator",
    desc: "Flights, landings, risers, and treads volume.",
    category: "Volume",
    icon: Boxes,
  },
  {
    id: "calculators/tank-or-trench-concrete-calculator",
    title: "Tank or Trench Concrete Calc",
    desc: "Calculate concrete volume for tanks or trench structures easily.",
    category: "Volume",
    icon: Boxes,
  },
  {
    id: "calculators/wall-concrete-calculator",
    title: "Wall Concrete Calculator",
    desc: "Vertical concrete wall volumes, single or multi-segment.",
    category: "Volume",
    icon: BrickWall,
  }
  
];

export const CATEGORIES: Category[] = ["All", "Volume", "Rebar", "Masonry", "Cost", "Mix", "Other"];

export const FALLBACK_ICON: ElementType = Calculator;
