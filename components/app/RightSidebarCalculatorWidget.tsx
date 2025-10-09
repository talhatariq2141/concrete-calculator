"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RightSidebarCalculatorsWidget() {
  const calculators = [
    { name: "Concrete Volume Calculator", href: "/concrete-volume-calculator" },
    { name: "Slab Concrete Calculator", href: "/concrete-volume-calculators/slab-concrete-calculator" },
    { name: "Footing Concrete Calculator", href: "/concrete-volume-calculators/footing-concrete-calculator" },
    { name: "Column Concrete Calculator", href: "/concrete-volume-calculators/column-concrete-calculator" },
    { name: "Beam Concrete Calculator", href: "/concrete-volume-calculators/beam-concrete-calculator" },
    { name: "Wall Concrete Calculator", href: "/concrete-volume-calculators/wall-concrete-calculator" },
    { name: "Pier / Caisson Calculator", href: "/concrete-volume-calculators/pier-caisson-concrete-calculator" },
    { name: "Tank / Trench Calculator", href: "/concrete-volume-calculators/tank-trench-concrete-calculator" },
    { name: "Nominal Mix (M5–M25) Calculator", href: "/concrete-volume-calculators/nominal-mix-concrete-calculator" },
    { name: "Concrete Yard Calculator", href: "/concrete-volume-calculators/concrete-yards-calculator" },
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
