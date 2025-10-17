import { Activity, Box, Boxes, BrickWall, Columns2, Container, Package2, Ruler, RulerDimensionLine, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ToolCard = {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  category: string;
  cta: string;
  badge?: { label: string; tone: "green" | "blue" | "yellow" };
};

const CARDS: ToolCard[] = [
  {
    id: "calculators/slab-concrete-calculator",
    icon: Container,
    title: "Slab Concrete Calculator",
    desc: "Estimate concrete for slabs, patios, and floors",
    category: "Concrete Volume",
    cta: "Try Now",
    badge: { label: "Most Popular", tone: "green" },
  },
  {
    id: "calculators/concrete-yards-calculator",
    icon: Ruler,
    title: "Concrete Yards Calculator",
    desc: "Calculate concrete in cubic yards",
    category: "Concrete Volume",
    cta: "Try Now",
    badge: { label: "Trending", tone: "blue" },
  },
  {
    id: "calculators/column-concrete-calculator",
    icon: Columns2,
    title: "Column Concrete Calculator",
    desc: "Estimate concrete for columns and pillars",
    category: "Concrete Volume",
    cta: "Try Now",
    badge: { label: "Trending", tone: "blue" },
  },
  {
    id: "calculators/footing-concrete-calculator",
    icon: RulerDimensionLine,
    title: "Footing Concrete Calculator",
    desc: "Calculate concrete for footings and foundations",
    category: "Concrete Volume",
    cta: "Try Now",
    badge: { label: "Popular", tone: "yellow" },
  },
  {
    id: "calculators/beam-concrete-calculator",
    icon: Package2,
    title: "Beam Concrete Calculator",
    desc: "Estimate concrete for beams and lintels",
    category: "Concrete Volume",
    cta: "Try Now",
    badge: { label: "Popular", tone: "yellow" },
  },
  {
    id: "calculators/Wall-concrete-calculator",
    icon: BrickWall,
    title: "Wall Concrete Calculator",
    desc: "Calculate concrete for walls and barriers",
    category: "Concrete Volume",
    cta: "Try Now",
  },
  {
    id: "calculators/pier-caisson-concrete-calculator",
    icon: Box,
    title: "Pier / Caisson Concrete Calculator",
    desc: "Cylindrical Shafts and drilled piers by length",
    category: "Concrete Volume",
    cta: "Try Now",
  },
  {
    id: "calculators/staircase-concrete-calculator",
    icon: Boxes,
    title: "Staircase Concrete Calculator",
    desc: "Estimate concrete for staircases and steps",
    category: "Concrete Volume",
    cta: "Try Now",
  },
];

function Badge({ label, tone }: NonNullable<ToolCard["badge"]>) {
  const tones = {
    green: "bg-emerald-900/40 text-emerald-300",
    blue: "bg-sky-900/40 text-sky-300",
    yellow: "bg-yellow-900/40 text-yellow-300",
  } as const;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tones[tone]}`} style={{ fontFamily: "var(--font-sans)" }}>
      {label}
    </span>
  );
}

function ToolCardItem({ card }: { card: ToolCard }) {
  const Icon = card.icon;
  return (
    <div className="group relative flex h-full flex-col rounded-sm border border-slate-800 bg-transparent transition-colors hover:border-primary/60">
      {/* top + middle grouped so bottom can stick */}
      <div className="p-3 pb-0 flex-1 flex flex-col">
        {/* top row: icon + badge */}
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-400 group-hover:bg-primary group-hover:text-background transition-colors">
            <Icon size={20} />
          </div>
          {card.badge && <Badge {...card.badge} />}
        </div>

        {/* title + desc */}
        <div className="mt-4">
          <h3
            className="text-lg font-semibold text-white tracking-tight"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {card.title}
          </h3>
          {/* give the paragraph a small minimum to avoid tiny cards, but allow wrap */}
          <p className="mt-2 text-sm text-slate-400">
            {card.desc}
          </p>
        </div>
      </div>

      {/* bottom row pinned to bottom */}
      <div className="mt-4 border-t border-slate-800 px-6 py-4 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 font-poppins">
          {card.category}
        </span>

        <Button
          asChild
          className="h-8 px-3 text-xs bg-slate-800 text-slate-200 hover:bg-primary hover:text-background transition-colors"
        >
          <Link href={`/${card.id}`}>
            {card.cta} <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}


export default function FeaturedCalcSection() {
  return (
    <section className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* small badge */}
        <div className="flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-sky-900/40 px-4 py-1.5 text-sky-300 text-sm"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <Activity size={16} /> Featured Concrete Calculators
          </span>
        </div>

        {/* heading + sub */}
        <h2
          className="mt-6 text-center text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Most Used Special Concrete Calculators
        </h2>
        <p className="mt-3 text-center text-slate-400 font-poppins max-w-2xl mx-auto">
          Start with our most popular calculators trusted by thousands of professionals worldwide
        </p>

        {/* grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl-grid-cols-3 items-stretch">
          {CARDS.map((c) => (
            <ToolCardItem key={c.id} card={c} />
          ))}
        </div>

        {/* footer button as shadcn + Next Link */}
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-sm border-1 border-yellow-800 bg-slate-900/60 text-slate-200 hover:bg-slate-900"
          >
            <Link href="/calculators">
              ✨ Explore All Calculators <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
