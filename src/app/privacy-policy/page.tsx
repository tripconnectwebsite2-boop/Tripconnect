import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Trip Connect",
  description: "Read the Trip Connect Privacy Policy detailing how customer inquiry data is securely handled, stored, and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-8 text-on-surface">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-wider">
              Legal &amp; Data Protection
            </span>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero font-bold text-on-surface tracking-tight mt-1 mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-outline">
              Last updated: October 2026 • Version 1.0 • Trip Connect, Kochi, Kerala
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-xs text-on-surface-variant leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">1. Introduction</h2>
              <p>
                Trip Connect ("we", "our", or "us"), located in Ayyappankavu, Kochi, Kerala, is committed to safeguarding the personal privacy of our travelers and website visitors. This policy outlines our standards regarding the collection, storage, and processing of customer information submitted through our website (<code className="text-primary font-mono text-xs">tripconnect.in</code>) and official communication channels.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">2. Data We Collect</h2>
              <p>We collect only the personal information strictly necessary to handle your travel enquiry and design custom travel itineraries:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Contact Information:</strong> Full name, telephone / WhatsApp number, and email address.</li>
                <li><strong>Travel Specifications:</strong> Preferred destination, tentative travel dates, traveller count, and special requirements (e.g., room preferences, dietary restrictions, senior citizen assistance).</li>
                <li><strong>Consent Records:</strong> Voluntary opt-in status for marketing communications and privacy notice acceptance timestamps.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-[11px] text-on-surface">
                <strong>No Online Payment Data:</strong> Trip Connect does NOT process online payments, store credit card details, or collect banking credentials on this website. Our website functions strictly as an enquiry-led consultation platform.
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">3. Purpose of Processing</h2>
              <p>Your information is used exclusively for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Preparing customized day-by-day travel quotations and confirming room/vehicle availability.</li>
                <li>Communicating with you via phone, WhatsApp, or email regarding your specific inquiry.</li>
                <li>Coordinating on-ground logistics with certified private drivers and verified resort partners upon confirmed booking.</li>
                <li>Sending seasonal offers or retreat announcements ONLY if you have explicitly opted into marketing updates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">4. Data Sharing &amp; Third Parties</h2>
              <p>
                We do not sell, rent, or trade customer contact details under any circumstances. Information is shared only on a strictly necessary operational basis with confirmed service providers (such as the private chauffeur assigned to your journey or the resort where reservations are placed) after you have approved the quotation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">5. Data Retention &amp; Security</h2>
              <p>
                Enquiry records and follow-up notes are maintained securely within an access-controlled database accessible only to authorized administrators (<code className="text-primary font-mono text-xs">tripconnectwebsite2@gmail.com</code>). Unverified public visitors and search engine crawlers have zero access to customer records.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">6. Your Rights</h2>
              <p>
                You have the right to request a copy of the information we hold about you, request corrections to your details, or request permanent deletion of your enquiry history from our records. To exercise any of these rights, contact our privacy desk at{" "}
                <a href="mailto:tripconnectwebsite2@gmail.com" className="text-primary underline">
                  tripconnectwebsite2@gmail.com
                </a>
                .
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <Link href="/" className="text-primary hover:underline font-semibold">
              ← Return to Home
            </Link>
            <Link href="/terms" className="text-primary hover:underline font-semibold">
              Read Terms &amp; Conditions →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
