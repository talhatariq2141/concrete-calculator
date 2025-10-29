// app/calculators/_components/CalculatorsIndexClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import {
  CALCULATORS,
  CATEGORIES,
  type CalcCard,
  type Category,
  FALLBACK_ICON,
} from "../data";

const flipWords = ["Builders", "Contractors", "Engineers", "Architects", "DIY Enthusiasts"];

type CalculatorsIndexClientProps = {
  initialQuery?: string;
  initialCategory?: Category;
  onQueryChange?: (value: string) => void;
  showBreadcrumbs?: boolean;
};

// ---------- UI ----------
export default function CalculatorsIndexClient({
  initialQuery = "",
  initialCategory = "All",
  onQueryChange,
  showBreadcrumbs = true,
}: CalculatorsIndexClientProps) {
  // Flip word section
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % flipWords.length), 2500);
    return () => clearInterval(interval);
  }, []);

  // Search + filter
  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState<Category>(initialCategory);
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

  const handleQueryChange = (value: string) => {
    setQuery(value);
    onQueryChange?.(value);
  };

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  return (
    <div>
      {/* Breadcrumbs (visible UX + internal links) */}
      {showBreadcrumbs ? (
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-400">
          <ol className="flex gap-2">
            <li>
              <Link className="hover:underline" href="/">
                Home
              </Link>
            </li>
            <li>/</li>
            <li aria-current="page" className="text-slate-200">
              Calculators
            </li>
          </ol>
        </nav>
      ) : null}

      {/* Search + Filter Row */}
      <div className="mb-4 flex flex-col gap-4 justify-between md:flex-row md:items-start">
        <div className="w-full text-left md:w-1/2">
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
          <p className="text-sm text-muted-foreground">
            Professional grade concrete calculators for builders, contractors, engineers and architects. By continuing you
            acknowledge our{' '}
            <Link href="/terms-of-service" className="text-teal-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-teal-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Dynamic total by category/search */}
        <CountBadge count={filtered.length} />
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
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
          <Card className="col-span-full border-slate-800 bg-slate-900/60 p-6 text-base text-slate-300">
            No calculators match your search. Try a different keyword or switch category.
          </Card>
        ) : (
          filtered.map((c) => <CalculatorCard key={c.id} card={c} />)
        )}
      </div>
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <div className="flex flex-col text-right mb-4 justify-between">
      <span className="text-lg font-bold font-mono text-primary dark:text-teal-400">{count}</span>
      <p className="text-muted-foreground text-xs font-bold font-mono">Calculators Available</p>
    </div>
  );
}

export function CalculatorCard({ card }: { card: CalcCard }) {
  const Icon = card.icon ?? FALLBACK_ICON;

  return (
    <Link href={`/${card.id}`} aria-label={card.title} className="group block">
      <div
        className="
          relative flex h-full flex-col rounded-sm
          border border-slate-900
          bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-900/20
          transition-all duration-200
          hover:border-teal-400/60 hover:-translate-y-1 hover:shadow-lg
        "
      >
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
            <h3 className="text-base sm:text-base font-semibold text-white tracking-tight line-clamp-1">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-800 px-5 py-4 flex items-center justify-between">
          <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-3">{card.desc}</p>
        </div>
      </div>
    </Link>
  );
}
