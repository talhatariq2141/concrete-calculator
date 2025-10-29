import { ShieldCheck, Lock, Cookie, Clock, Mail, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - Concrete Calculator Max',
  description:
    'Our concise privacy policy explains what we collect, how we use it, cookies, data retention, and your rights when using our free online concrete calculators.',
  alternates: {
    canonical: 'https://concretecalculatormax.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date('2025-10-07'); // set a fixed date or use new Date()
  const formattedDate = lastUpdated.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We respect your privacy. This policy explains what we collect—and what we don’t—when you use our free Concrete Calculator.
          </p>
          <p className="text-sm text-slate-400 mt-3">Last updated: {formattedDate}</p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <ShieldCheck className="h-12 w-12 text-teal-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">Data Minimalism</h2>
            <p className="text-slate-300">
              We collect only what is necessary to operate and improve the calculator. We do not sell personal information.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <Cookie className="h-12 w-12 text-teal-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">Cookies & Analytics</h2>
            <p className="text-slate-300">
              We may use strictly necessary cookies and privacy-friendly analytics to understand usage patterns and enhance features.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <Lock className="h-12 w-12 text-teal-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">Security First</h2>
            <p className="text-slate-300">
              Reasonable technical and organizational measures help protect data from unauthorized access, alteration, or misuse.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <Clock className="h-12 w-12 text-teal-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">Transparent Retention</h2>
            <p className="text-slate-300">
              We retain information only as long as necessary for the purposes described below, then securely delete or anonymize it.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <article className="prose prose-invert prose-slate max-w-none">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Our Privacy Commitments</h2>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">1) Information We Collect</h3>
            <p className="text-slate-300 mb-4">
              <strong>Usage data:</strong> anonymous or aggregated information such as pages visited, calculator features used, and basic device information.
              <br />
              <strong>Optional contact data:</strong> if you contact us (e.g., support email), we receive your message and any provided contact details.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">2) How We Use Information</h3>
            <p className="text-slate-300 mb-4">
              To operate the website, improve calculator accuracy and usability, monitor performance, prevent abuse, and respond to your inquiries.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">3) Cookies & Similar Technologies</h3>
            <p className="text-slate-300 mb-4">
              We may use essential cookies for site functionality and lightweight analytics cookies to understand aggregate usage. You can control cookies through your browser settings.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">4) Third-Party Services</h3>
            <p className="text-slate-300 mb-4">
              We may link to external sites or use third-party tools (e.g., analytics or advertising). Their practices are governed by their own policies. Review those policies before using their services.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">5) Data Retention</h3>
            <p className="text-slate-300 mb-4">
              We keep data only as long as needed to provide and improve the service or comply with legal obligations, then delete or anonymize it.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">6) Security</h3>
            <p className="text-slate-300 mb-4">
              No method is 100% secure, but we implement reasonable safeguards to protect information in transit and at rest.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">7) Children’s Privacy</h3>
            <p className="text-slate-300 mb-4">
              Our calculators are intended for general audiences and are not directed to children under 13. We do not knowingly collect data from children.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">8) Your Choices & Rights</h3>
            <p className="text-slate-300 mb-4">
              You can disable non-essential cookies in your browser. If you contact us about your information, we will reasonably assist with access, correction, or deletion requests where applicable.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">9) Changes to This Policy</h3>
            <p className="text-slate-300 mb-4">
              We may update this policy to reflect improvements or legal requirements. Material changes will be noted by updating the date above.
            </p>

            <h3 className="text-2xl font-semibold text-white mb-4 mt-6 flex items-center gap-2">
              <Mail className="h-6 w-6 text-teal-400" /> Contact Us
            </h3>
            <p className="text-slate-300">
              Questions? Email <a className="text-teal-400 underline" href="mailto:info@concretecalculatormax.com">info@concretecalculatormax.com</a>
            </p>

            <div className="mt-8 flex items-center gap-2 text-slate-400">
              <FileText className="h-5 w-5" />
              <span>This concise policy applies to all pages and calculators on our site.</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
