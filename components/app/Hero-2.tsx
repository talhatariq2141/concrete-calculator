"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Box, Calculator, Link, Ruler, Volume2, Zap } from "lucide-react";
import { Button } from "../ui/button";

const flipWords = ["Builders", "Contractors", "Engineers", "Architects", "DIY Enthusiasts"];

export default function Hero2() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % flipWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className=" relative flex flex-col items-center justify-center text-center py-24 px-6 bg-background text-white overflow-hidden">
      {/* Badge */}
      <div className="mb-10">
        <span className="bg-green-800/40 text-green-300 text-sm font-poppins font-medium px-4 py-2 rounded-full">
          Best Concrete Calculators • 100% Free
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-poppins tracking-tight flex flex-col items-center mb-8">
        <span>Special Concrete Calculators for</span>
        <motion.span
          key={index}
          className="mt-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {flipWords[index]}
        </motion.span>
      </h1>

      {/* Subheading */}
      <p className="max-w-2xl text-lg text-slate-400 leading-relaxed mb-10 mt-6" style={{ fontFamily: "var(--font-poppin)" }}>
        Calculate concrete volume instantly for slabs, beams, columns, footings, and walls. Get precise measurements in cubic yards and cubic meters with our easy-to-use calculator.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        
        <Button
          variant="default"
          className="px-8 py-6 bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium rounded-lg flex items-center gap-2 transition"
          onClick={() => window.location.href = '/calculators'}
        >
          Explore All Calculators <ArrowRight className="ml-1 h-4 w-4" />
        </Button>

        <Button
          variant="default"
          className="px-8 py-6 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg flex items-center gap-2 transition"
          onClick={() => window.location.href = '/calculators/slab-concrete-calculator'}
        >
        <Box className=" text-yellow-400 ml-1 h-4 w-4" />  Try Slab Concrete Calc 
        </Button>


      </div>

      {/* Features Row */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
        <span className="flex items-center gap-2">
            <Calculator className=" h-4 w-4 text-slate-400 mx-auto" />
           Instant Results
        </span>
        <span className="flex items-center gap-2">
          <Ruler className=" h-4 w-4 text-yellow-400 mx-auto" />
           Multiple Units
        </span>
        <span className="flex items-center gap-2">
          <Ruler className=" h-4 w-4 text-purple-400 mx-auto" /> All Structures
        </span>
        <span className="flex items-center gap-2">
          <span className="text-orange-400">⏱</span> Save Hours Daily
        </span>
      </div>
    </section>
  );
}
