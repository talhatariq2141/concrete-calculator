"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
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
  Search as SearchIcon,
  ArrowRight,
} from "lucide-react";

type Category =
  | "All"
  | "Volume"
  | "Rebar"
  | "Masonry"
  | "Cost"
  | "Mix"
  | "Other";

type CalcCard = {
  id: string;
  title: string;
  desc: string;
  category: Exclude<Category, "All">;
  icon: React.ElementType;
};

const CALCULATORS: CalcCard[] = [
  { id: "calculators/slab-concrete-calculator", title: "Slab Concrete Calculator", desc: "Estimate concrete for slabs, patios, and floors.", category: "Volume", icon: Container },
  { id: "calculators/concrete-yards-calculator", title: "Concrete Yards Calculator", desc: "Convert and compute volume into cubic yards.", category: "Volume", icon: Ruler },
  { id: "calculators/column-concrete-calculator", title: "Column Concrete Calculator", desc: "Volume for square, rectangular, and circular columns.", category: "Volume", icon: Columns2 },
  { id: "calculators/footing-concrete-calculator", title: "Footing Concrete Calculator", desc: "Continuous, isolated, and combined footings.", category: "Volume", icon: RulerDimensionLine },
  { id: "calculators/beam-concrete-calculator", title: "Beam Concrete Calculator", desc: "Estimate concrete for beams and lintels.", category: "Volume", icon: Package2 },
  { id: "calculators/wall-concrete-calculator", title: "Wall Concrete Calculator", desc: "Vertical concrete wall volumes, single or multi-segment.", category: "Volume", icon: BrickWall },
  { id: "calculators/pier-caisson-concrete-calculator", title: "Pier / Caisson Concrete Calculator", desc: "Cylindrical shafts and drilled piers by length.", category: "Volume", icon: Box },
  { id: "calculators/staircase-concrete-calculator", title: "Staircase Concrete Calculator", desc: "Flights, landings, risers, and treads volume.", category: "Volume", icon: Boxes },
  { id: "calculators/tank-or-trench-concrete-calculator", title: "Staircase Concrete Calculator", desc: "", category: "Volume", icon: Boxes },
  { id: "calculators/nominal-mix-m5-m25-calculator", title: "Nominal Mix M5-M25 Calculator", desc: "Nominal Mix M5-M25 Calculator", category: "Mix", icon: Boxes },
];

const CATEGORIES: Category[] = ["All", "Volume", "Rebar", "Masonry", "Cost", "Mix", "Other"];
const flipWords = ["Builders", "Contractors", "Engineers", "Architects", "DIY Enthusiasts"];

export default function CalculatorsPage() {
// flip word section javascript
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
     const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % flipWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
// end flip word javascript

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<Category>("All");

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    return CALCULATORS.filter((c) => {
      const matchesCategory = category === "All" ? true : c.category === category;
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : c.title.toLowerCase().includes(normalizedQuery) ||
            c.desc.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, normalizedQuery]);

  return (
    <>
      {/* Search + Filter Row */}
      <div className="mb-4 flex justify-between items-stard">
            <div className="w-full/50 text-left">
                <h1 className="text-2xl font-bold">
                <span>Free Concrete Calculators for</span>
                    <motion.span
                    key={index}
                    className="mt-2 ml-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text"
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                    {flipWords[index]}
                    </motion.span>
                </h1>
                <p className="text-sm text-muted-foreground">Professional Grade Concrete Calculators for Builders, Contractors, Engineers and Architects </p>
            </div>
            <div className="flex flex-col text-right mb-4 flex justify-between">
                <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">55</span>
                <p className="text-muted-foreground text-sm font-bold font-mono">Available</p>            
            </div>
      </div>
      
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                
        <div className="sm:col-span-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Calculators..."
              className="pl-9 bg-slate-900 border-slate-800 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
        </div>
        <div>
          <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
            <SelectTrigger className="bg-slate-900 border-slate-800 text-foreground">
              <SelectValue placeholder="All Calculators" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "All" ? "All Calculators" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {filtered.length === 0 ? (
          <Card className="col-span-full border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
            No calculators match your search. Try a different keyword or switch category.
          </Card>
        ) : (
          filtered.map((c) => <CalculatorCard key={c.id} card={c} />)
        )}
      </div>
    </>
  );
}

function CalculatorCard({ card }: { card: CalcCard }) {
  const Icon = card.icon ?? Calculator;

  return (
    <Link
      href={`/${card.id}`}
      aria-label={card.title}
      className="group block"
    >
      <div className="relative flex h-full flex-col rounded-sm border border-slate-900 bg-background transition-all duration-200  hover:border-teal-400/60 hover:-translate-y-1 hover:shadow-lg">
        {/* Hover mini action (top-right) */}
        <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 text-xs text-slate-300 opacity-0 translate-x-1 group-hover:text-primary group-hover:opacity-100 group-hover:translate-x-0 transition-all">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>

        {/* Header + body */}
        <div className="p-5 pb-0 flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-400 transition-colors ">
              <Icon size={18} />
            </div>
          </div>

          <div className="mt-4">
            <h3
              className="text-base sm:text-base font-semibold text-white tracking-tight line-clamp-1"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {card.title}
            </h3>
            {/* <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-3">{card.desc}</p> */}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-800 px-5 py-4 flex items-center justify-between">
            <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-3">{card.desc}</p>
          {/* <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] sm:text-xs text-slate-300">
            {card.category}
          </span> */}
          
        </div>
      </div>
    </Link>
  );
}
