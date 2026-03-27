/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const calculators = [
  { id: "beam-concrete-calculator", title: "Beam Concrete Calculator", category: "Beam" },
  { id: "column-concrete-calculator", title: "Column Concrete Calculator", category: "Column" },
  { id: "concrete-yards-calculator", title: "Concrete Yards Calculator", category: "Concrete Yards" },
  { id: "footing-concrete-calculator", title: "Footing Concrete Calculator", category: "Footing" },
  { id: "nominal-mix-m5-m25-calculator", title: "Nominal Mix M5-M25 Calculator", category: "Concrete Mix" },
  { id: "pier-caisson-concrete-calculator", title: "Pier / Caisson Concrete Calculator", category: "Pier/Caisson" },
  { id: "slab-concrete-calculator", title: "Slab Concrete Calculator", category: "Slab" },
  { id: "staircase-concrete-calculator", title: "Staircase Concrete Calculator", category: "Staircase" },
  { id: "tank-trench-concrete-calculator", title: "Tank or Trench Concrete Calc", category: "Tank/Trench" },
  { id: "wall-concrete-calculator", title: "Wall Concrete Calculator", category: "Wall" },
  { id: "concrete-bag-calculator", title: "Concrete Bag Calculator", category: "Concrete Bags" },
  { id: "concrete-slab-cost-calculator", title: "Concrete Slab Cost Calculator", category: "Slab" },
  { id: "concrete-slab-weight-calculator", title: "Concrete Slab Weight Calculator", category: "Slab" },
  { id: "concrete-slab-load-capacity-calculator", title: "Concrete Slab Load Capacity Calculator", category: "Slab" },
  { id: "concrete-driveway-cost-calculator", title: "Concrete Driveway Cost Calculator", category: "Cost" },
  { id: "concrete-block-calculator", title: "Concrete Block Estimator Calculator", category: "Concrete Block" },
  { id: "cinder-block-calculator", title: "Cinder Block Calculator", category: "Concrete Block" },
  { id: "cmu-block-calculator", title: "CMU Block Calculator", category: "Concrete Block" },
  { id: "post-hole-concrete-calculator", title: "Post Hole Concrete Calculator", category: "Misc. Concrete" },
  { id: "crushed-concrete-calculator", title: "Crushed Concrete Estimator Calculator", category: "Misc. Concrete" },
  { id: "gravel-calculator", title: "Gravel Calculator", category: "Gravel" },
  { id: "gravel-driveway-calculator", title: "Gravel Driveway Calculator", category: "Gravel" },
  { id: "pea-gravel-calculator", title: "Pea Gravel Calculator", category: "Gravel" },
  { id: "gravel-tons-to-yards-calculator", title: "Gravel Tons to Yards Calculator", category: "Gravel" },
  { id: "gravel-cost-calculator", title: "Gravel Cost Calculator", category: "Cost" },
  { id: "aquarium-gravel-calculator", title: "Aquarium Gravel Calculator", category: "Gravel" }
];

const dir = path.join(__dirname, 'markdown', 'details');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

calculators.forEach(calc => {
  const content = `# ${calc.title} Logic Documentation

## 1. Overview
- **Calculator Name:** ${calc.title}
- **Category:** ${calc.category}
- **Slug/Route:** \`/calculators/${calc.category === 'Gravel' ? 'gravel-calculators/' : ''}${calc.id}\`
- **Component File:** \`components/calculators/${calc.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}.tsx\`

## 2. Calculation Logic & Formulas
- Relies on core geometry and volume functions based in \`lib/concrete-calculations.ts\`.
- **Primary Formula:** Volume = Area × Depth (normalized to cubic feet, then converted to cubic yards).
- Incorporates waste percentage calculation commonly defaults to 10% or user preference.

## 3. Inputs & Validation
- Standard dimensions required (Length, Width/Diameter, Depth/Thickness).
- Validated via uncontrolled UI components (shadcn/ui \`Input\`, \`Select\`).
- Only >0 numeric inputs yield results.

## 4. Outputs
- Volume in Cubic Yards, Cubic Meters, and Cubic Feet.
- Estimated number of pre-mixed bags (40lb, 60lb, 80lb) if applicable.
- Estimated total material cost based on user-provided price inputs.
`;

  fs.writeFileSync(path.join(dir, `${calc.id}-logic.md`), content);
});

console.log("Successfully generated all calculator logic files.");
