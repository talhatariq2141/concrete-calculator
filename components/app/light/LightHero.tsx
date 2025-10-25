"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LightHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-sky-50 pb-20 pt-16 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.2),transparent_55%)]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-sm font-medium text-sky-700 shadow-sm backdrop-blur dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
          <Sparkles className="h-4 w-4" /> Bright & fast construction planning
        </span>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-poppins)" }}>
          Project-ready concrete estimates in a light, focused layout
        </h1>
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-200">
          Explore our streamlined interface tailored for bright environments. Quickly calculate volumes, materials, and costs with the same trusted accuracy as our flagship experience.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="h-11 rounded-full px-6 text-base">
            <Link href="/calculators" className="flex items-center gap-2">
              Launch calculators
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full border-slate-300 px-6 text-base dark:border-slate-700">
            <Link href="/">
              Return to main homepage
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
