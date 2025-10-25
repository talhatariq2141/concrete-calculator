import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LightCTA() {
  return (
    <section className="bg-gradient-to-r from-sky-100 via-white to-emerald-100 py-16 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "var(--font-poppins)" }}>
          Ready to plan your next pour?
        </h2>
        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Save, share, and export your calculations across themes. The light homepage keeps everything clean for teams who prefer a bright workspace.
        </p>
        <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
          <Link href="/calculators" className="flex items-center gap-2">
            Start calculating
            <ArrowRightCircle className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
