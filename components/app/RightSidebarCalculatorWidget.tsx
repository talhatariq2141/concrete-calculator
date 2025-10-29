"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RightSidebarCalculatorsWidget() {
  const calculators = [
    { name: "Slab Concrete Calculator", href: "/calculators/slab-concrete-calculator" },
    { name: "Footing Concrete Calculator", href: "/calculators/footing-concrete-calculator" },
    { name: "Column Concrete Calculator", href: "/calculators/column-concrete-calculator" },
    { name: "Beam Concrete Calculator", href: "/calculators/beam-concrete-calculator" },
    { name: "Wall Concrete Calculator", href: "/calculators/wall-concrete-calculator" },
    { name: "Pier / Caisson Calculator", href: "/calculators/pier-caisson-concrete-calculator" },
    { name: "Tank / Trench Calculator", href: "/calculators/tank-or-trench-concrete-calculator" },
    { name: "Staircase Concrete Calculator", href: "/calculators/staircase-concrete-calculator" },
    { name: "Nominal Mix (M5–M25) Calculator", href: "/calculators/nominal-mix-m5-m25-calculator" },
    { name: "Concrete Yard Calculator", href: "/calculators/concrete-yards-calculator" },
  ];

  return (
    <Card className="bg-slate-700 border border-slate-700 p-5">
      <CardHeader className="p-0 mb-3">
        <CardTitle className="text-sm font-semibold text-teal-400">
          Concrete Calculators
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="space-y-2 text-sm">
          {calculators.map((calc) => (
            <li key={calc.name}>
              <Link
                href={calc.href}
                className="block rounded-md bg-slate-900 px-3 py-2 text-[var(--brand-accent)] hover:bg-slate-700 hover:text-teal-300 transition-colors"
              >
                {calc.name}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
