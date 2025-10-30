"use client";

import * as React from "react";

// ⬇️ Imports (keep your paths)
import ConcreteVolumeCalc from "@/components/calculators/homepage-calcs/ConcreteVolumeCalc";
import ConcreteVolumeCalc2 from "@/components/calculators/homepage-calcs/ConcreteVolumeCalc2";
import ConcreteVolumeCalc3 from "@/components/calculators/homepage-calcs/ConcreteVolumeCalc3";
import ConcreteVolumeCalc4 from "@/components/calculators/homepage-calcs/ConcreteVolumeCalc4";
import ConcreteVolumeCalc5 from "@/components/calculators/homepage-calcs/ConcreteVolumeCalc5";

type TabKey = "slab" | "round" | "circular" | "curb" | "stairs";

const TABS: { key: TabKey; label: string; render: () => React.ReactNode }[] = [
  { key: "slab",     label: "Slabs, Square Footings, or Walls", render: () => <ConcreteVolumeCalc />  },
  { key: "round",    label: "Hole, Column, or Round Footings",  render: () => <ConcreteVolumeCalc2 /> },
  { key: "circular", label: "Circular Slab or Tube",            render: () => <ConcreteVolumeCalc3 /> },
  { key: "curb",     label: "Curb and Gutter Barrier",          render: () => <ConcreteVolumeCalc4 /> },
  { key: "stairs",   label: "Staircase",                        render: () => <ConcreteVolumeCalc5 /> },
];

export default function HomepageCalcTab() {
  const [active, setActive] = React.useState<TabKey>("slab");
  const activeIndex = TABS.findIndex((t) => t.key === active);

  // Arrow key nav on the tablist
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + TABS.length) % TABS.length;
    setActive(TABS[next].key);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-3 sm:px-4">
      <h2 className="text-center text-xl sm:text-2xl font-semibold font-poppins text-slate-200 mb-10">
        Select below your desired tab to calculate concrete volume
      </h2>

      {/* Tablist */}
      <div
        role="tablist"
        aria-label="Concrete volume calculators"
        onKeyDown={onKeyDown}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.key}`}
              id={`tab-${t.key}`}
              onClick={() => setActive(t.key)}
              className={[
                "rounded-xl px-3.5 py-2 text-sm sm:text-sm font-poppins font-medium transition",
                "border border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60",
                isActive
                  ? "bg-teal-400 text-slate-950 border-teal-400"
                  : "bg-transparent text-slate-300 hover:bg-teal-400 hover:text-slate-950",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="mt-5"
      >
        {TABS.find((t) => t.key === active)?.render()}
      </div>
    </section>
  );
}
