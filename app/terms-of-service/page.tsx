import Link from "next/link";
import { Scale, ShieldAlert, FileWarning, Ban, ExternalLink, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - Concrete Calculator Max',
  description:
    'Read the Terms of Service for using our free online concrete calculators, including license, acceptable use, disclaimers, and limitations of liability.',
};

export default function TermsOfServicePage() {
  const lastUpdatedIso = "2024-07-15";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${lastUpdatedIso}T00:00:00Z`));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://concretecalculatormax.com/terms-of-service#terms",
    url: "https://concretecalculatormax.com/terms-of-service",
    name: "Terms of Service — Concrete Calculator Max",
    description:
      "Terms outlining acceptable use, disclaimers, and licensing for Concrete Calculator Max tools.",
    inLanguage: "en",
    datePublished: "2023-11-01",
    dateModified: lastUpdatedIso,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://concretecalculatormax.com/#website",
    },
    primaryImageOfPage: "https://concretecalculatormax.com/og/default.png",
    publisher: {
      "@id": "https://concretecalculatormax.com/#organization",
    },
    about: {
      "@type": "Thing",
      name: "Concrete calculator usage terms",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Terms of Service</h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                By accessing or using our website and calculators, you agree to the terms below.
              </p>
              <p className="text-sm text-slate-400 mt-3">Last updated: {formattedDate}</p>
              <p className="text-xs text-slate-500 mt-2">
                This July 2024 revision clarifies commercial usage rights and references our latest privacy review.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <Scale className="h-12 w-12 text-teal-400 mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-3">Fair Use</h2>
                <p className="text-slate-300">
                  You may use our free calculators for personal or commercial projects, provided you comply with these Terms.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <ShieldAlert className="h-12 w-12 text-teal-400 mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-3">No Engineering Advice</h2>
                <p className="text-slate-300">
                  Results are estimates only and do not replace advice from a licensed engineer or local building codes.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <FileWarning className="h-12 w-12 text-teal-400 mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-3">Limited Liability</h2>
                <p className="text-slate-300">
                  We are not liable for losses arising from use of the site or reliance on calculator outputs.
                </p>
              </div>
            </div>

            {/* Terms Body */}
            <article className="prose prose-invert prose-slate max-w-none">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Terms & Conditions</h2>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">1) Acceptance of Terms</h3>
                <p className="text-slate-300 mb-4">
                  By using the website, you accept and agree to be bound by these Terms. If you do not agree, do not use the site.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">2) License to Use</h3>
                <p className="text-slate-300 mb-4">
                  We grant you a limited, non-exclusive, non-transferable license to access and use the calculators for lawful purposes. Content may not be reproduced, modified, or distributed without permission.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">3) Acceptable Use</h3>
                <ul className="text-slate-300 mb-4 list-disc pl-6">
                  <li>No scraping, reverse engineering, automated excessive requests, or security probing.</li>
                  <li>No uploading or linking malicious code, attempting to disrupt or overload the service.</li>
                  <li>No use that violates applicable laws, regulations, or third-party rights.</li>
                </ul>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">4) Calculator Outputs & Disclaimer</h3>
                <p className="text-slate-300 mb-4">
                  Results are calculated based on inputs and standard formulas/conversions. Outputs are for guidance only and may not reflect site-specific conditions. Always verify with project specifications, local codes, and professional judgment.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">5) No Professional Advice</h3>
                <p className="text-slate-300 mb-4">
                  Information on the site does not constitute engineering or professional advice. Consult a qualified professional for design, safety, and compliance decisions.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">6) Third-Party Links & Ads</h3>
                <p className="text-slate-300 mb-4">
                  Our site may contain links to third-party websites and may display advertising. We are not responsible for their content, policies, or practices. Review their terms and privacy policies before use.
                </p>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  External links open to third-party sites.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">7) Intellectual Property</h3>
                <p className="text-slate-300 mb-4">
                  All trademarks, logos, text, UI, and code on the site are owned by us or our licensors and protected by applicable laws.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">8) Limitation of Liability</h3>
                <p className="text-slate-300 mb-4">
                  To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenues, data, or use, arising from your use of the site.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">9) Termination</h3>
                <p className="text-slate-300 mb-4">
                  We may suspend or terminate access to the site at any time if we believe you violated these Terms or to protect the service.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6">10) Changes to the Service or Terms</h3>
                <p className="text-slate-300 mb-4">
                  We may modify or discontinue features at any time. We may update these Terms; material updates will be indicated by changing the date above. Continued use constitutes acceptance of changes.
                </p>

                <h3 className="text-2xl font-semibold text-white mb-4 mt-6 flex items-center gap-2">
                  <Ban className="h-6 w-6 text-teal-400" /> Contact
                </h3>
                <p className="text-slate-300">
                  For any questions about these Terms, email{' '}
                  <a className="text-teal-400 underline" href="mailto:info@concretecalculatormax.com">
                    info@concretecalculatormax.com
                  </a>.
                </p>
                <p className="text-slate-400 text-sm mt-4">
                  Looking for data-handling details? Review our{' '}
                  <Link href="/privacy-policy" className="text-teal-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </article>

            {/* Terms FAQ */}
            <section className="mt-16 bg-slate-900/60 border border-slate-800 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="h-6 w-6 text-teal-400" />
                <h2 className="text-2xl font-semibold text-white">Terms FAQs (2024 Update)</h2>
              </div>
              <div className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-white">Can I use the calculators on client projects?</h3>
                  <p>
                    Yes. Commercial use is permitted as long as you follow these Terms, retain attribution where required, and
                    avoid automated scraping or resale of the tools.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">How often do you review these terms?</h3>
                  <p>
                    We log a legal review every quarter. The July 2024 update aligns wording with the refreshed privacy
                    documentation and clarifies acceptable automation limits.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Who should I contact for partnership or licensing questions?</h3>
                  <p>
                    Reach out to{' '}
                    <a className="text-teal-400 underline" href="mailto:info@concretecalculatormax.com">
                      info@concretecalculatormax.com
                    </a>{' '}
                    with project details. We respond within two business days.
                  </p>
                </div>
              </div>
            </section>
        </div>
      </main>
    </>
  );
}
