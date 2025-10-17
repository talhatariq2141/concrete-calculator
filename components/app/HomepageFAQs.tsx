"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FaqItem } from '@/lib/faqs';

export function HomepageFAQs({ items }: { items: FaqItem[] }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0e1013]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {items.map((it, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx + 1}`}
              className="bg-primary/20 border-slate-700 rounded-lg px-6"
            >
              <AccordionTrigger className="text-white hover:text-primary">
                {it.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">{it.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
