import Link from "next/link";
import { AlertTriangle, Scale, ShieldAlert, Info, Mail, FileText, MessageCircleQuestion } from 'lucide-react';

export const metadata = {
    title: 'Disclaimer - Concrete Calculator Max',
    description:
        'Read our professional disclaimer regarding the use of our concrete calculators. Learn about estimate accuracy, professional advice, and limitation of liability.',
    alternates: {
        canonical: 'https://concretecalculatormax.com/disclaimer',
    },
};

export default function DisclaimerPage() {
    const lastUpdatedIso = "2024-07-15";
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date(`${lastUpdatedIso}T00:00:00Z`));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://concretecalculatormax.com/disclaimer#policy",
        url: "https://concretecalculatormax.com/disclaimer",
        name: "Disclaimer — Concrete Calculator Max",
        description:
            "Concrete Calculator Max professional disclaimer regarding calculation accuracy and professional advice.",
        inLanguage: "en",
        datePublished: "2023-11-01",
        dateModified: lastUpdatedIso,
        publisher: {
            "@id": "https://concretecalculatormax.com/#organization",
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
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Disclaimer</h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Please read this disclaimer carefully before using the Concrete Calculator Max website.
                        </p>
                        <p className="text-sm text-slate-400 mt-3">Last updated: {formattedDate}</p>
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <AlertTriangle className="h-12 w-12 text-teal-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-3">Estimates Only</h2>
                            <p className="text-slate-300">
                                All results provided by our calculators are estimates. They are intended for informational purposes and should not be considered final quotes.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <Scale className="h-12 w-12 text-teal-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-3">No Professional Advice</h2>
                            <p className="text-slate-300">
                                The content on this site is not professional engineering, architectural, or construction advice. Always consult with a qualified professional.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <ShieldAlert className="h-12 w-12 text-teal-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-3">Liability Limitation</h2>
                            <p className="text-slate-300">
                                We are not responsible for any financial loss, material waste, or structural issues resulting from the use of our calculators.
                            </p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                            <Info className="h-12 w-12 text-teal-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-3">"As Is" Basis</h2>
                            <p className="text-slate-300">
                                Our services are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied.
                            </p>
                        </div>
                    </div>

                    {/* Disclaimer Body */}
                    <article className="prose prose-invert prose-slate max-w-none">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                            <h2 className="text-3xl font-bold text-white mb-6">Terms of Use Disclaimer</h2>

                            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">1) Accuracy of Information</h3>
                            <p className="text-slate-300 mb-4">
                                While we strive for accuracy, concrete calculation involves many variabilities (waste factors, regional standards, mix densities).
                                <strong>Concrete Calculator Max</strong> does not warrant the completeness or accuracy of any results. Users are encouraged to cross-verify all calculations.
                            </p>

                            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">2) Professional Consultation</h3>
                            <p className="text-slate-300 mb-4">
                                Calculations for structural integrity, load-bearing capacities, and high-stakes infrastructure must be performed by a licensed engineer
                                or architect. Do not rely solely on online tools for critical project specifications.
                            </p>

                            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">3) External Links</h3>
                            <p className="text-slate-300 mb-4">
                                Our website may contain links to third-party websites. We are not responsible for the content, accuracy, or privacy practices
                                of these external sites. Use them at your own risk.
                            </p>

                            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">4) Errors and Omissions</h3>
                            <p className="text-slate-300 mb-4">
                                We assume no responsibility for errors or omissions in the content of the website, including calculation logic or technical data provided in our articles.
                            </p>

                            <h3 className="text-2xl font-semibold text-white mb-4 mt-6">5) Personal Responsibility</h3>
                            <p className="text-slate-300 mb-4">
                                By using our calculators, you acknowledge that you are using them voluntarily and that any choices or actions taken based
                                on the results are your sole responsibility.
                            </p>

                            <h3 className="text-2xl font-semibold text-white mb-4 mt-6 flex items-center gap-2">
                                <Mail className="h-6 w-6 text-teal-400" /> Questions?
                            </h3>
                            <p className="text-slate-300">
                                If you have any questions regarding this disclaimer, please contact us at{' '}
                                <a className="text-teal-400 underline" href="mailto:info@concretecalculatormax.com">
                                    info@concretecalculatormax.com
                                </a>
                            </p>

                            <div className="mt-8 flex items-center gap-2 text-slate-400">
                                <FileText className="h-5 w-5" />
                                <span>This disclaimer applies to all calculators, articles, and services provided by this website.</span>
                            </div>
                        </div>
                    </article>

                    {/* Related Legal Links */}
                    <section className="mt-16 bg-slate-900/60 border border-slate-800 rounded-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageCircleQuestion className="h-6 w-6 text-teal-400" />
                            <h2 className="text-2xl font-semibold text-white">Related Legal Information</h2>
                        </div>
                        <div className="space-y-6 text-slate-300">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Privacy Policy</h3>
                                <p>
                                    Learn more about how we handle your data and protect your privacy in our{' '}
                                    <Link href="/privacy-policy" className="text-teal-400 hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Terms of Service</h3>
                                <p>
                                    Review the rules and guidelines for using our website in our{' '}
                                    <Link href="/terms-of-service" className="text-teal-400 hover:underline">
                                        Terms of Service
                                    </Link>.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
