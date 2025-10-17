"use client";

import React from "react";
import Link from "next/link";
import {
  Square,
  SquareStack,
  Ruler,
  Layers,
  Package,
  Waves,
  Calculator,
  Triangle,
  Container,
  Package2,
  Columns2,
} from "lucide-react";

type CatalogItem = {
  slug: string;            // stable key
  href: string;            // route
  title: string;           // card heading
  description: string;     // short blurb
  icon?: React.ReactNode;  // optional icon override
};

type Props = {
  /** Heading above the cards */
  heading?: string;
  /** Show only these slugs, in this order (e.g., ['slab','beam','column']) */
  include?: string[];
  /** Hide these slugs (ignored if `include` is provided) */
  exclude?: string[];
  /** Limit number of cards rendered (applied after filtering) */
  limit?: number;
  /** Provide a custom catalog (defaults to the built-in list below) */
  items?: CatalogItem[];
  /** Extra className for the outer section */
  className?: string;
};

/** ---- Built-in catalog of your currently available calculators ---- */
const DEFAULT_ITEMS: CatalogItem[] = [
  {
    slug: "slab",
    href: "/calculators/slab-concrete-calculator",
    title: "Slab Concrete Calculator",
    description: "Estimate concrete for floors, patios & driveways.",
    icon: <Container className="h-5 w-5" />,
  },
  {
    slug: "beam",
    href: "/calculators/beam-concrete-calculator",
    title: "Beam Concrete Calculator",
    description: "Volume for rectangular or multi-span beams.",
    icon: <Package2 className="h-5 w-5" />,
  },
  {
    slug: "column",
    href: "/calculators/column-concrete-calculator",
    title: "Column Concrete Calculator",
    description: "Round or rectangular column volumes in seconds.",
    icon: <Columns2 className="h-5 w-5" />,
  },
  {
    slug: "footing",
    href: "/calculators/footing-concrete-calculator",
    title: "Footing Concrete Calculator",
    description: "Strip & isolated footing volume estimates.",
    icon: <SquareStack className="h-5 w-5" />,
  },
  {
    slug: "wall",
    href: "/calculators/wall-concrete-calculator",
    title: "Wall Concrete Calculator",
    description: "Compute concrete for straight or segmented walls.",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    slug: "pier-caisson",
    href: "/calculators/pier-caisson-concrete-calculator",
    title: "Pier / Caisson Calculator",
    description: "Drilled shaft & caisson concrete volumes.",
    icon: <Package className="h-5 w-5" />,
  },
  {
    slug: "tank-trench",
    href: "/calculators/tank-trench-concrete-calculator",
    title: "Tank / Trench Calculator",
    description: "Rectangular & circular tank/trench volumes.",
    icon: <Waves className="h-5 w-5" />,
  },
  {
    slug: "staircase",
    href: "/calculators/staircase-concrete-calculator",
    title: "Staircase Concrete Calculator",
    description: "Total volume for flights, landings & risers.",
    icon: <Triangle className="h-5 w-5" />,
  },
  {
    slug: "nominal-mix",
    href: "/calculators/nominal-mix-m5-m25-calculator",
    title: "Nominal Mix (M5–M25)",
    description: "Material splits for standard nominal mixes.",
    icon: <Calculator className="h-5 w-5" />,
  },
  {
    slug: "yards",
    href: "/calculators/concrete-yards-calculator",
    title: "Concrete Yards Calculator",
    description: "Convert area/thickness into cubic yards & m³.",
    icon: <Ruler className="h-5 w-5" />,
  },
];

export default function RelatedCalculators({
  heading = "Related Calculators",
  include,
  exclude,
  limit,
  items,
  className,
}: Props) {
  // Choose catalog
  let catalog = (items ?? DEFAULT_ITEMS).slice();

  // Filter by include (preserves order provided by caller)
  if (include && include.length) {
    const set = new Set(include);
    catalog = include
      .map((slug) => catalog.find((c) => c.slug === slug))
      .filter(Boolean) as CatalogItem[];
    // If some slugs weren’t found in custom `items`, they are ignored.
  } else if (exclude && exclude.length) {
    const set = new Set(exclude);
    catalog = catalog.filter((c) => !set.has(c.slug));
  }

  if (typeof limit === "number") {
    catalog = catalog.slice(0, Math.max(0, limit));
  }

  if (!catalog.length) return null;

  return (
    <section className={["w-full font-poppins mx-auto max-w-8xl", className].filter(Boolean).join(" ")}>
      <h3 className="text-xl font-semibold text-white mb-4">{heading}</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((item) => (
          <CardLink key={item.slug} href={item.href} title={item.title} description={item.description}>
            {item.icon ?? <Square className="h-5 w-5" />}
          </CardLink>
        ))}
      </div>
    </section>
  );
}

/* ---------------- UI atoms ---------------- */

function CardLink({
  href,
  title,
  description,
  children,
}: {
  href: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative block rounded-lg bg-slate-900/60 border border-slate-800 p-4 hover:border-teal-500/60 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-md bg-slate-900/80 p-2 text-teal-300 ring-1 ring-slate-800">
          {children}
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-white truncate">{title}</h4>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="mt-4 text-xs font-medium text-emerald-400 inline-flex items-center gap-1">
        <span>Try it now</span>
        <span aria-hidden>→</span>
      </div>

      {/* hover lift effect (subtle, screenshot-style) */}
      <div className="absolute inset-0 rounded-lg pointer-events-none transition-transform group-hover:-translate-y-0.5" />
    </Link>
  );
}

/* ---------------- Usage Examples ----------------
<RelatedCalculators />                                             // shows default set
<RelatedCalculators include={['slab','beam','column']} />          // show only these, in this order
<RelatedCalculators exclude={['nominal-mix','yards']} limit={3} /> // hide some, cap to 3
<RelatedCalculators
  items={[
    { slug: 'custom-1', href: '/x', title: 'Custom Calc', description: 'Your custom card.' },
  ]}
/>
--------------------------------------------------- */
