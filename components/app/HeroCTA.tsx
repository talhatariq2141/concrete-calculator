'use client';

import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export function HeroCTA() {
  const scrollToCalculator = () => {
    const calculatorSection = document.getElementById('calculator-section');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={scrollToCalculator}
      className="bg-teal-400 text-slate-900 hover:bg-teal-500 text-lg px-8 py-6 h-auto"
    >
      <Calculator className="mr-2 h-5 w-5" />
      Calculate Now
    </Button>
  );
}
