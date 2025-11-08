"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Ruler } from "lucide-react";
import { Button } from "../ui/button";
import HomepageCalcTab from "./HomepageCalcsTab";


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
    <section className=" relative flex flex-col items-center justify-center text-center py-10 px-6 bg-background text-white overflow-hidden">

      {/* Badge */}
      {/* <div className="mb-10">
        <span className="bg-green-800/40 text-green-300 text-sm font-poppins font-medium px-4 py-2 rounded-full">
          Best Concrete Calculators • 100% Free
        </span>
      </div> */}

      <p
        className="text-sm uppercase tracking-[0.3em] text-teal-300/80"
        aria-live="polite"
      >
        BUILT FOR {flipWords[index]}
      </p>

      {/* Homepage Calculator Tabs */}

      <HomepageCalcTab />


      {/* Subheading */}

      <p className=" max-w-2xl text-lg text-slate-400 leading-relaxed mb-10 mt-10" style={{ fontFamily: "var(--font-poppins)" }}>
        Calculate concrete volume instantly for slabs, beams, columns, footings, and walls. Get precise measurements in cubic yards and cubic meters with our easy-to-use calculator.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        
        <Button
          asChild
          variant="default"
          className="px-8 py-6 bg-teal-500 hover:bg-teal-400 text-slate-900 font-medium rounded-lg flex items-center gap-2 transition"
        >
          <Link href="/calculators">
            Explore All Calculators <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
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

      <p className="mt-8 text-xs text-slate-500">
        By using our free tools you agree to our{' '}
        <Link href="/terms-of-service" className="text-teal-400 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="text-teal-400 hover:underline">
          Privacy Policy
        </Link>
        . We keep calculators fast, secure, and transparent about data use.
      </p>
    </section>
  );
}
