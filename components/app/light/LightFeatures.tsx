import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, ClipboardCheck, Layers } from "lucide-react";

const FEATURES = [
  {
    title: "Light-first layout",
    description:
      "Crystal clear contrast, large touch targets, and a calm palette designed for bright job site tablets and office monitors.",
    icon: Layers,
  },
  {
    title: "Same precise formulas",
    description:
      "Keep using the calculators you know with automatic unit conversion, waste allowances, and reinforcement suggestions.",
    icon: ClipboardCheck,
  },
  {
    title: "Switch anytime",
    description:
      "Use the header toggle to jump between dark, light, or system themes so your tools match your environment.",
    icon: Boxes,
  },
];

export function LightFeatures() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-100 py-20 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-emerald-500/10 dark:text-emerald-200">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "var(--font-poppins)" }}>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
