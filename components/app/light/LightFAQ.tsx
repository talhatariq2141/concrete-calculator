"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/lib/faqs";

export function LightFAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100" style={{ fontFamily: "var(--font-poppins)" }}>
            Frequently asked questions
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Answers stay consistent across experiences so your team has one source of truth.
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item, idx) => (
            <AccordionItem
              key={item.question}
              value={`light-faq-${idx}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900"
            >
              <AccordionTrigger className="px-6 py-4 text-left text-base font-medium text-slate-900 transition hover:text-primary dark:text-slate-100">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
