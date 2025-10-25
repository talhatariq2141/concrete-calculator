const STATS = [
  { label: "Pros who trust us", value: "48k+" },
  { label: "Concrete projects planned", value: "320k" },
  { label: "Average time saved", value: "12 min" },
];

export function LightStats() {
  return (
    <section className="bg-white py-12 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 px-4 text-center sm:flex-row sm:px-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <p className="text-3xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-poppins)" }}>
              {stat.value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
