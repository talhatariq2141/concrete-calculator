import { Calculator, Target, Award, Users } from 'lucide-react';

export const metadata = {
  title: 'About Us - Concrete Calculator Max',
  description: 'Learn about our mission to provide accurate and easy-to-use concrete calculation tools for construction professionals and DIY enthusiasts.',
};

export default function AboutPage() {
  return (
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">About Us</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Empowering construction professionals and DIY enthusiasts with accurate, easy-to-use concrete calculation tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <Target className="h-12 w-12 text-teal-400 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
              <p className="text-slate-300">
                To provide the most accurate and user-friendly concrete calculator available online, helping users save time, reduce waste, and complete projects successfully.
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <Award className="h-12 w-12 text-teal-400 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-3">Our Commitment</h2>
              <p className="text-slate-300">
                We're committed to maintaining the highest standards of accuracy in our calculations while keeping our tool completely free and accessible to everyone.
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <Calculator className="h-12 w-12 text-teal-400 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-3">What We Offer</h2>
              <p className="text-slate-300">
                Our comprehensive calculator handles slabs, beams, columns, footings, and walls with support for multiple units and detailed material breakdowns.
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <Users className="h-12 w-12 text-teal-400 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-3">Who We Serve</h2>
              <p className="text-slate-300">
                From professional contractors managing large projects to homeowners planning their first DIY concrete pour, our tool is designed for everyone.
              </p>
            </div>
          </div>

          <article className="prose prose-invert prose-slate max-w-none">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our Concrete Calculator?</h2>

              <p className="text-slate-300 mb-4">
                In the construction industry, accuracy is everything. Ordering too little concrete can halt your project and increase costs, while ordering too much leads to unnecessary waste and expense. Our concrete calculator was developed with this challenge in mind.
              </p>

              <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Industry-Standard Calculations</h3>
              <p className="text-slate-300 mb-4">
                We use proven mathematical formulas and industry-standard conversion rates to ensure every calculation is precise. Whether you're working in feet, inches, or meters, our tool handles conversions seamlessly and accurately.
              </p>

              <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Comprehensive Coverage</h3>
              <p className="text-slate-300 mb-4">
                Unlike basic calculators that only handle simple slabs, we provide dedicated calculators for all major concrete elements in construction projects: slabs, beams, columns (both rectangular and circular), footings, and walls. Each calculator is optimized for its specific use case.
              </p>

              <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Material Breakdown</h3>
              <p className="text-slate-300 mb-4">
                Understanding how much cement, sand, and aggregate you need is crucial for planning and budgeting. Our calculator provides detailed material breakdowns based on standard mix ratios, with adjustable waste percentages to match your project conditions.
              </p>

              <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Always Free, Always Accessible</h3>
              <p className="text-slate-300 mb-4">
                We believe that essential construction tools should be available to everyone. Our concrete calculator is completely free to use, with no registration required, no hidden fees, and no limitations on usage.
              </p>

              <h3 className="text-2xl font-semibold text-white mb-4 mt-8">Built by Professionals, for Everyone</h3>
              <p className="text-slate-300 mb-4">
                Our team combines construction industry experience with software development expertise to create a tool that meets real-world needs. We continuously refine our calculator based on user feedback and industry best practices.
              </p>

              <p className="text-slate-300 text-lg mt-8">
                Whether you're a seasoned contractor, a construction estimator, or a DIY enthusiast tackling your first concrete project, our calculator provides the accuracy and ease of use you need to get the job done right.
              </p>
            </div>
          </article>
        </div>
      </main>
    
    
  );
}
