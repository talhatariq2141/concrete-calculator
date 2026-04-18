"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function AnimatedNumber({ value, decimals = 1 }: { value: number; decimals?: number }) {
  const spring = useSpring(0, { stiffness: 50, damping: 15 });
  
  useEffect(() => { 
    spring.set(value); 
  }, [value, spring]);
  
  const display = useTransform(spring, (v) => v.toLocaleString(undefined, { maximumFractionDigits: decimals }));
  
  return <motion.span>{display}</motion.span>;
}
