"use client";

import {
  ShieldCheck,
  BrainCircuit,
  Ruler,
  Truck,
  HardHat,
  DraftingCompass,
  CheckCircle2,
  BadgeDollarSign,
} from "lucide-react";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-sm border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-colors font-poppins ${className}`}
    >
      {children}
    </div>
  );
}

function Pill({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-emerald-900/40 text-emerald-400">
        {icon}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-slate-300">
      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
      <span className="text-sm leading-relaxed">{children}</span>
    </li>
  );
}

export default function WhyChooseSection() {
  return (
    <section className="w-full bg-[#0e1013]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Top heading */}
        <h2
          className="text-center text-3xl sm:text-5xl font-extrabold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Why Choose Concrete Calculator Max?
        </h2>
        <p className="mt-3 text-center text-slate-400 max-w-2xl mx-auto">
          Professional-grade concrete calculators without the heavy price tag.
          Built for speed, quality, and accuracy.
        </p>

        {/* Top feature row */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
          <Card className="p-6">
            <Pill icon={<BrainCircuit size={30} />}>
              <div>
                <h3
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Professional Accuracy
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                    Trusted by industry experts. Our calculators use proven formulas and
                    account for real-world variables to ensure precise results.
                </p>
              </div>
            </Pill>
          </Card>

          <Card className="p-6">
            <Pill icon={<BadgeDollarSign size={30} />}>
              <div>
                <h3
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  100% Free to Use
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Access pro-level calculators without subscriptions or hidden
                  fees. No credit card required.
                </p>
              </div>
            </Pill>
          </Card>

          <Card className="p-6">
            <Pill icon={<ShieldCheck size={30} />}>
              <div>
                <h3
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Privacy-First Approach
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Your project data stays on your device. We don’t sell data or
                  track quantities you enter.
                </p>
              </div>
            </Pill>
          </Card>
        </div>

        {/* Middle heading */}
        <h3
          className="mt-20 text-center text-3xl sm:text-4xl font-extrabold text-white"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Built for Construction Industry Professionals
        </h3>
        <p className="mt-3 text-center text-slate-400 max-w-2xl mx-auto">
          Tailored solutions for field workflows across roles and disciplines.
        </p>

        {/* Audience cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-900/40 text-sky-300">
                <HardHat size={18} />
              </div>
              <h4
                className="text-white font-semibold"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                For Builders
              </h4>
            </div>
            <ul className="mt-4 space-y-2">
              <Bullet>Slab, footing, pier/caisson, wall & beam volumes</Bullet>
              <Bullet>Waste allowance & truckload planning</Bullet>
              <Bullet>Batch, yard, and m³ conversions</Bullet>
              <Bullet>Printable results for site records</Bullet>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-900/40 text-rose-300">
                <Truck size={18} />
              </div>
              <h4
                className="text-white font-semibold"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                For Contractors
              </h4>
            </div>
            <ul className="mt-4 space-y-2">
              <Bullet>Fast take-offs with unit presets</Bullet>
              <Bullet>Mix ratios & strength classes (M5–M40)</Bullet>
              <Bullet>Pumpable mix & reinforcement helpers</Bullet>
              <Bullet>Live cost estimates with your rates</Bullet>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-900/40 text-emerald-300">
                <Ruler size={18} />
              </div>
              <h4
                className="text-white font-semibold"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                For Engineers
              </h4>
            </div>
            <ul className="mt-4 space-y-2">
              <Bullet>Dimensional checks & unit validation</Bullet>
              <Bullet>Results in SI & Imperial simultaneously</Bullet>
              <Bullet>Rebar density & cover estimations</Bullet>
              <Bullet>Deterministic formulas with clear steps</Bullet>
            </ul>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-900/40 text-yellow-300">
                <DraftingCompass size={18} />
              </div>
              <h4
                className="text-white font-semibold"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                For Architects
              </h4>
            </div>
            <ul className="mt-4 space-y-2">
              <Bullet>Early-stage massing & volume studies</Bullet>
              <Bullet>Material schedules for concept sets</Bullet>
              <Bullet>Scenario compare: thickness, grade, finish</Bullet>
              <Bullet>Shareable links for client reviews</Bullet>
            </ul>
          </Card>
        </div>

        {/* Bottom KPIs */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-emerald-400">Web Tool</div>
            <div className="mt-1 text-sm text-slate-400">Designated Calculators</div>
          </div>
            <div>
            <div className="text-4xl font-extrabold text-emerald-400">100%</div>
            <div className="mt-1 text-sm text-slate-400">Free Forever</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-400">
              &lt; 1s
            </div>
            <div className="mt-1 text-sm text-slate-400">Average Load Time</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-400">24/7</div>
            <div className="mt-1 text-sm text-slate-400">Always Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
