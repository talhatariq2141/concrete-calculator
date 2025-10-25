import { CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    title: "Pick a calculator",
    description: "Choose slabs, columns, stairs, beams, and more from the streamlined menu.",
  },
  {
    title: "Enter your measurements",
    description: "Input dimensions in feet, inches, or metric and adjust waste percentage instantly.",
  },
  {
    title: "Review material breakdowns",
    description: "Get ready-to-order totals for concrete volume, mix components, and reinforcement.",
  },
];

export function LightWorkflow() {
  return (
    <section className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "var(--font-poppins)" }}>
            How the light experience works
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Same calculators, refreshed presentation. Move through the workflow in minutes.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <CheckCircle2 className="mb-4 h-6 w-6 text-sky-500 dark:text-emerald-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "var(--font-poppins)" }}>
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
