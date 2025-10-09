// Reuse this in both the visible FAQ UI and JSON-LD
export type FaqItem = { question: string; answer: string };

export const homepageFaqs: FaqItem[] = [
  
  { question: "How do I calculate concrete for a slab?",
    answer: "To calculate concrete for a slab, multiply the length, width, and thickness measurements. Convert all dimensions to the same unit first. For example, a 10-foot by 10-foot slab that is 4 inches thick equals 3.33 cubic feet or 0.123 cubic yards. Our calculator handles these conversions automatically."
  },
  { question: "How many cubic yards do I need?",
    answer: "The amount of concrete you need depends on your project dimensions. Cubic yards are the standard measurement for ordering concrete. Use our calculator to input your measurements in feet, inches, or meters, and get instant results in cubic yards and cubic meters."
  },
  { question: "What is the standard concrete mix ratio?",
    answer: "A standard concrete mix ratio is approximately 1:2:3 (cement:sand:aggregate). Our calculator uses industry-standard proportions: 22% cement, 33% sand, and 45% aggregate. These ratios are suitable for most residential and commercial applications."
  },
  { question: "Why should I add waste percentage?",
    answer: "Adding a waste percentage accounts for spillage, uneven surfaces, and over-excavation. Industry standard is 5-10% waste for most projects. Our calculator defaults to 10% to ensure you have enough concrete to complete your project without running short."
  },
  { question: "Can I calculate concrete for columns and beams?",
    answer: "Yes! Our concrete calculator supports slabs, beams, columns, footings, and walls. Simply select the appropriate tab and enter your measurements. For circular columns, toggle the circular option and enter the diameter instead of width and depth."
  },
  { question: "How accurate is this concrete calculator?",
    answer: "Our calculator uses precise mathematical formulas and industry-standard conversion rates to provide accurate results. However, always consult with a professional contractor for large projects and verify measurements on-site before ordering concrete."
  },

  // ⬇️ Add the rest of your real FAQs here so JSON-LD matches your visible list exactly
  // { question: "...", answer: "..." },
];
