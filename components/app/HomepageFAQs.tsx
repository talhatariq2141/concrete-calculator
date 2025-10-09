'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function HomepageFAQs() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-slate-800 border-slate-700 rounded-lg px-6">
            <AccordionTrigger className="text-white hover:text-teal-400">
              How do I calculate concrete for a slab?
            </AccordionTrigger>
            <AccordionContent className="text-slate-300">
              To calculate concrete for a slab, multiply the length, width, and thickness measurements. Convert all dimensions to the same unit first. For example, a 10-foot by 10-foot slab that is 4 inches thick equals 3.33 cubic feet or 0.123 cubic yards. Our calculator handles these conversions automatically.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="bg-slate-800 border-slate-700 rounded-lg px-6">
            <AccordionTrigger className="text-white hover:text-teal-400">
              How many cubic yards do I need?
            </AccordionTrigger>
            <AccordionContent className="text-slate-300">
              The amount of concrete you need depends on your project dimensions. Cubic yards are the standard measurement for ordering concrete. Use our calculator to input your measurements in feet, inches, or meters, and get instant results in cubic yards and cubic meters.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="bg-slate-800 border-slate-700 rounded-lg px-6">
            <AccordionTrigger className="text-white hover:text-teal-400">
              What is the standard concrete mix ratio?
            </AccordionTrigger>
            <AccordionContent className="text-slate-300">
              A standard concrete mix ratio is approximately 1:2:3 (cement:sand:aggregate). Our calculator uses industry-standard proportions: 22% cement, 33% sand, and 45% aggregate. These ratios are suitable for most residential and commercial applications.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="bg-slate-800 border-slate-700 rounded-lg px-6">
            <AccordionTrigger className="text-white hover:text-teal-400">
              Why should I add waste percentage?
            </AccordionTrigger>
            <AccordionContent className="text-slate-300">
              Adding a waste percentage accounts for spillage, uneven surfaces, and over-excavation. Industry standard is 5-10% waste for most projects. Our calculator defaults to 10% to ensure you have enough concrete to complete your project without running short.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="bg-slate-800 border-slate-700 rounded-lg px-6">
            <AccordionTrigger className="text-white hover:text-teal-400">
              Can I calculate concrete for columns and beams?
            </AccordionTrigger>
            <AccordionContent className="text-slate-300">
              Yes! Our concrete calculator supports slabs, beams, columns, footings, and walls. Simply select the appropriate tab and enter your measurements. For circular columns, toggle the circular option and enter the diameter instead of width and depth.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6" className="bg-slate-800 border-slate-700 rounded-lg px-6">
            <AccordionTrigger className="text-white hover:text-teal-400">
              How accurate is this concrete calculator?
            </AccordionTrigger>
            <AccordionContent className="text-slate-300">
              Our calculator uses precise mathematical formulas and industry-standard conversion rates to provide accurate results. However, always consult with a professional contractor for large projects and verify measurements on-site before ordering concrete.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
