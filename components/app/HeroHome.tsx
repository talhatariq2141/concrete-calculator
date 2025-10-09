
import React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Layers,
  Columns,
  Square,
  Circle,
  Beaker,
  Calculator,
  SquareStack as BeamIcon,
  WavesLadder,
  Barrel,
  BrickWall,
  RulerDimensionLine,
} from "lucide-react";
// import { title } from "process";

/* ----------------------------- */
/* Data */
/* ----------------------------- */
type Tool = {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: "volume" | "mix" | "weight" | "rebar" | "cost";
};

const categories = [
  { key: "all", label: "All", icon: Layers },
  { key: "volume", label: "Concrete Volume", icon: Layers },
  { key: "mix", label: "Mix Design", icon: Beaker },
  // { key: "organize-weight", label: "Weight & Density", icon: Weight, mapTo: "weight" },
  // { key: "rebar", label: "Reinforcement", icon: Ruler },
  // { key: "cost", label: "Cost & Estimation", icon: BadgeDollarSign },
  
] as const;

const raw = {
  volume: [
    {
      title: "Slab Concrete Calculator",
      href: "/calculators/slab-concrete-calculator",
      desc: "Compute volume for one-way or two-way slabs with thickness options.",
      icon: Square,
    },
    {
      title: "Footing Concrete Calculator",
      href: "/calculators/footing-concrete-calculator",
      desc: "Rectangular, square or circular footings with depth variations.",
      icon: Square,
    },
    {
      title: "Column Concrete Calculator",
      href: "/calculators/column-concrete-calculator",
      desc: "Rectangular or circular columns, single or grouped.",
      icon: Columns,
    },
    {
      title: "Beam Concrete Calculator",
      href: "/calculators/beam-concrete-calculator",
      desc: "Prismatic/tapered beams with optional haunches.",
      icon: BeamIcon,
    },
    {
      title: "Pier / Caisson Concrete Calculator",
      href: "/calculators/pier-caisson-concrete-calculator",
      desc: "Cylindrical shafts and drilled piers by length.",
      icon: Circle,
    },
    {
      title: "Staircase Concrete Calculator",
      href: "/calculators/staircase-concrete-calculator",
      desc: "Waist-slab and solid stairs with landings & wedges.",
      icon: WavesLadder,
    },
    {
      title: "Tank/Trench Concrete Calculator",
      href: "/calculators/tank-or-trench-concrete-calculator",
      desc: "Rectangular or circular tanks & trenches with walls & slabs.",
      icon: Barrel,
    },
    {
      title: "Wall Concrete Calculator",
      href: "/calculators/wall-concrete-calculator",
      desc: "Retaining or free-standing walls with various shapes.",
      icon: BrickWall,
    },
    {
      title: "Concrete Yards Calculator",
      href: "/calculators/concrete-yards-calculator",
      desc: "Convert volume between cubic yards, feet, meters & inches.",
      icon: RulerDimensionLine,
    },
    
  ],
  mix: [
    {
      title: "Nominal Mix (M5–M25)",
      href: "/calculators/nominal-mix-m5-m25-calculator",
      desc: "Quick mix by grade with yield & bags.",
      icon: Calculator,
    },
    // {
    //   title: "Design Mix (IS/ACI)",
    //   href: "/design-mix-is-aci-calculator",
    //   desc: "Strength-based mix using codes & material tests.",
    //   icon: Beaker,
    // },
  ],
  // weight: [
  //   {
  //     title: "Concrete Weight",
  //     href: "/concrete-weight-calculator",
  //     desc: "Normal/Lightweight with moisture factors.",
  //     icon: Weight,
  //   },
  // ],
  // rebar: [
  //   {
  //     title: "Rebar Quantity",
  //     href: "/rebar-quantity-calculator",
  //     desc: "Total length & weight by bar sizes.",
  //     icon: Ruler,
  //   },
  // ],
  // cost: [
  //   {
  //     title: "Concrete Cost",
  //     href: "/concrete-cost-calculator",
  //     desc: "Rate-based cost for materials & placement.",
  //     icon: BadgeDollarSign,
  //   },
  // ],
 
} as const;

const tools: Tool[] = (Object.keys(raw) as Array<keyof typeof raw>)
  .flatMap((k) =>
    raw[k].map((t, idx) => ({
      id: `${k}-${idx}`,
      title: t.title,
      desc: t.desc,
      href: t.href,
      icon: t.icon,
      category: k as Tool["category"],
    }))
  );

/* Map the “organize-weight” pill to actual category key */
const pillToCat = (pill: string): Tool["category"] | "all" => {
  const cat = categories.find((c) => c.key === pill);
  if (cat && "mapTo" in cat && cat.mapTo) {
    return cat.mapTo as Tool["category"];
  }
  return pill as Tool["category"] | "all";
};

/* ----------------------------- */
/* UI */
/* ----------------------------- */
export default function HeroHome() {
  const [active, setActive] = React.useState<string>("all");

  const filtered =
    active === "all"
      ? tools
      : tools.filter((t) => t.category === pillToCat(active));

  return (
    <main className="min-h-screen">
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 mx-auto my-12 mx-5 px-5">
        {/* Very subtle corner blobs (assist the mesh) */}
        

        <div className="relative mx-auto max-w-7xl  mt-12 mb-10 sm:px-6 lg:px-8 py-6 lg:py-6 ">
          {/* Heading */}
          {/* <header className="mx-auto max-w-4xl text-center"> */}
          <div className="text-center text-4xl lg:text-5xl tracking-tight">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Estimate concrete requirements with our free dedicated online Concrete Calculators.
            </h2>
            
          </div>
          {/* </header> */}

          {/* Filter Pills (Tabs-like, but single-row like the screenshot) */}
          <Tabs value={active} onValueChange={setActive} className="mt-12 ">
            <TabsList
              className="
                mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-3  bg-transparent p-0
              "
            >
              {categories.map(({ key, label, icon: Icon }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="
                    inline-flex items-center gap-2 rounded-full border px-4 py-2
                    text-sm font-medium bg-transparent text-foreground border-teal-400
                    hover:border-accent hover:shadow-sm transition
                    data-[state=active]:bg-teal-400 data-[state=active]:text-slate-800
                    data-[state=active]:border-accent focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-accent
                  "
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span>{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* GRID */}
          <div
            className="
              mt-15 grid gap-4
              sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
            "
          >
            {filtered.map(({ id, title, desc, href, icon: Icon, category }) => (
              <Link key={id} href={href} className="group focus:outline-none">
                <Card
                  className="
                    h-[160px] rounded-xl border  bg-slate-700 p-5
                    transition hover:shadow-md hover:bg-slate-700 focus:outline-none
                    focus-within:ring-2 focus-within:ring-accent
                  "
                >
                  <div className="flex h-full items-start gap-4">
                    {/* Icon tile with pastel tint based on category */}
                    <div
                      className={`
                        relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border
                        ${category === "volume" ? "bg-violet-100/70 border-violet-200 text-violet-700" : ""}
                        ${category === "mix" ? "bg-amber-100/70 border-amber-200 text-amber-700" : ""}
                        ${category === "weight" ? "bg-sky-100/70 border-sky-200 text-sky-700" : ""}
                        ${category === "rebar" ? "bg-emerald-100/70 border-emerald-200 text-emerald-700" : ""}
                        ${category === "cost" ? "bg-rose-100/70 border-rose-200 text-rose-700" : ""}
                        
                        group-hover:border-accent
                      `}
                      aria-hidden
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold leading-snug">
                        {title}
                      </h3>
                      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
