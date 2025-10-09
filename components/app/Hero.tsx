import { Building2, Calculator, Ruler } from 'lucide-react';
import React from 'react'
// import { Button } from '../ui/button';
import { HeroCTA } from './HeroCTA';
// import { AdSlot } from './AdSlot';

export default function Hero() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-center mb-8">
            <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Free Online Tool</span>
            </div>
            </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Concrete Calculator – Accurate Online Tool for All Your Construction Needs
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Calculate concrete volume instantly for slabs, beams, columns, footings, and walls. Get precise measurements in cubic yards and cubic meters with our easy-to-use calculator.
            </p>
            {/* <HeroCTA /> */}
          </div>

          {/* <div className="mt-12 flex justify-center">
            <AdSlot id="ad-hero" width={728} height={90} />
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
              <Calculator className="h-12 w-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-slate-400">Get immediate calculations in cubic yards and meters</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
              <Ruler className="h-12 w-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Multiple Units</h3>
              <p className="text-slate-400">Convert between feet, inches, and meters seamlessly</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
              <Building2 className="h-12 w-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">All Structures</h3>
              <p className="text-slate-400">Calculate for slabs, beams, columns, footings, and walls</p>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
};

