"use client";

import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/app/ThemeToggle";


export default function Navbar() {
    // Smooth scroll to calculator section
    const scrollToCalculator = () => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <span className="text-xl font-display font-bold">Concrete Calculator Max</span>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            onClick={scrollToCalculator}
            className="gradient-primary font-semibold"
          >
            Start Calculating
          </Button>
        </div>
      </div>
    </header>
    );
}
