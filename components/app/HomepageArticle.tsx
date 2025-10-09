import { CheckCircle } from 'lucide-react'
import React from 'react'

export const HomepageArticle = () => {
  return (
    <article className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-4xl mx-auto prose prose-invert prose-slate">
        <h2 className="text-3xl font-bold text-white mb-6">How to Calculate Concrete for Your Construction Project</h2>

        <p className="text-slate-300 text-lg mb-6">
          Calculating the correct amount of concrete is essential for any construction project. Whether you&apos;re pouring a concrete slab for a patio, building foundation footings, or constructing structural beams and columns, accurate concrete volume calculations ensure you order the right quantity and avoid costly shortages or waste.
        </p>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Understanding Concrete Volume Measurements</h3>
        <p className="text-slate-300 mb-4">
          Concrete is typically measured and ordered in cubic yards in the United States, while many other countries use cubic meters. One cubic yard equals 27 cubic feet, and understanding this conversion is crucial for proper concrete estimation. Our concrete calculator handles these conversions automatically, making it simple to determine how much concrete you need regardless of which measurement system you prefer.
        </p>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Basic Concrete Calculation Formula</h3>
        <p className="text-slate-300 mb-4">
          The fundamental formula for calculating concrete volume is straightforward: multiply length × width × thickness (or height). However, the key is ensuring all measurements are in the same unit before calculating. For example, if you&apos;re calculating a concrete slab that&apos;s 10 feet long, 10 feet wide, and 4 inches thick, you must first convert the thickness to feet (4 inches = 0.333 feet) before multiplying: 10 × 10 × 0.333 = 33.3 cubic feet, which equals approximately 1.23 cubic yards.
        </p>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Different Types of Concrete Calculations</h3>
        <p className="text-slate-300 mb-4">
          Different construction elements require specific calculation approaches:
        </p>
        <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
          <li><strong className="text-white">Concrete Slabs:</strong> Perfect for driveways, patios, and floors. Calculate by multiplying length × width × thickness.</li>
          <li><strong className="text-white">Concrete Beams:</strong> Horizontal structural elements. Use length × width × depth for rectangular beams.</li>
          <li><strong className="text-white">Concrete Columns:</strong> Vertical support structures. For rectangular columns, use height × width × depth. For circular columns, use πr²h (pi × radius squared × height).</li>
          <li><strong className="text-white">Concrete Footings:</strong> Foundation elements. Calculate like slabs using length × width × depth.</li>
          <li><strong className="text-white">Concrete Walls:</strong> Vertical structures. Multiply length × height × thickness.</li>
        </ul>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Understanding Concrete Mix Ratios</h3>
        <p className="text-slate-300 mb-4">
          A standard concrete mix consists of cement, sand, and aggregate (gravel or crushed stone). The typical mix ratio is 1:2:3, meaning one part cement, two parts sand, and three parts aggregate. Our calculator uses industry-standard proportions: approximately 22% cement, 33% sand, and 45% aggregate. These ratios produce strong, durable concrete suitable for most residential and commercial applications.
        </p>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Accounting for Waste and Over-Excavation</h3>
        <p className="text-slate-300 mb-4">
          Always add a waste percentage to your concrete calculations. Construction sites rarely have perfectly level surfaces, and spillage during pouring is common. Industry best practice recommends adding 5-10% extra concrete to account for waste. For complex projects or uneven terrain, consider increasing this to 10-15%. Our calculator includes an adjustable waste percentage field to help you determine the total concrete needed.
        </p>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Tips for Accurate Concrete Estimation</h3>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>Measure twice, calculate once. Verify all dimensions before ordering concrete.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>Use consistent units throughout your calculations to avoid conversion errors.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>Account for irregular shapes by breaking them into simpler rectangular sections.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>Consult with your concrete supplier about their minimum order requirements.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
              <span>Consider the concrete strength grade required for your specific application.</span>
            </li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Using Our Free Concrete Calculator</h3>
        <p className="text-slate-300 mb-4">
          Our online concrete calculator simplifies the entire calculation process. Simply select your project type (slab, beam, column, footing, or wall), enter your measurements in feet, inches, or meters, and instantly receive accurate results in both cubic yards and cubic meters. The calculator also provides a detailed material breakdown showing how much cement, sand, and aggregate you&apos;ll need based on standard mix ratios. This comprehensive tool eliminates calculation errors and helps you plan your concrete order with confidence.
        </p>

        <p className="text-slate-300 text-lg mt-8">
          Whether you&apos;re a professional contractor, DIY enthusiast, or homeowner planning a construction project, accurate concrete calculations are the foundation of project success. Use our concrete calculator to determine exactly how much concrete you need, reduce waste, and ensure your project stays on budget and on schedule.
        </p>
      </div>
    </article>
  )
}
