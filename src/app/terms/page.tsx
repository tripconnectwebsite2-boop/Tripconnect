import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Trip Connect Kochi",
  description: "Read the Trip Connect terms of service regarding travel enquiries, pricing estimates, booking confirmations, and cancellation policies.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-8 text-on-surface">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-wider">
              Legal Agreement
            </span>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero font-bold text-on-surface tracking-tight mt-1 mb-2">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-outline">
              Effective: October 2026 • Trip Connect, Ayyappankavu, Kochi, Kerala – 682018
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-xs text-on-surface-variant leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                1. Nature of the Website
              </h2>
              <p>
                Trip Connect operates as an enquiry-led bespoke travel consultancy. All package descriptions, published starting rates, and sample itineraries on this website are illustrative guidelines intended to assist travelers in conceptualizing their journeys.
              </p>
              <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-[11px] text-on-surface font-semibold">
                IMPORTANT: Submitting an enquiry via website form, telephone, email, or WhatsApp does NOT constitute a confirmed booking, reservation, or binding contract.
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                2. Pricing &amp; Quotations
              </h2>
              <p>
                Starting prices displayed on the website are based on standard twin/double sharing occupancy during regular travel periods. Exact quotations are determined by:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Specific travel dates (peak seasonal periods such as Diwali, Christmas, New Year, and festival seasons carry surcharges).</li>
                <li>Exact party size, vehicle type (Sedan, Innova, Crysta, Tempo Traveller), and hotel room categories.</li>
                <li>Custom activity choices, houseboat dining selections, and safari permits.</li>
              </ul>
              <p>
                A quotation is considered firm only after written issuance by Trip Connect with a clearly specified validity date.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                3. Booking Confirmation &amp; Payment
              </h2>
              <p>
                Reservations for accommodations, private houseboats, and dedicated chauffeur transport are confirmed only upon receipt of the agreed booking advance and explicit written confirmation from our operations desk. Payment instructions are provided securely via official Trip Connect communication channels.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                4. Cancellations &amp; Modifications
              </h2>
              <p>
                If you need to reschedule or cancel a confirmed itinerary, notify your dedicated Trip Connect travel concierge as soon as possible in writing. Cancellation fees depend upon the policy of individual partnered resorts and houseboat operators:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cancellations 30 days prior to departure: Refund of deposit less administrative charges and non-refundable resort retention fees.</li>
                <li>Cancellations within 15–29 days: Subject to partner hotel retention policies (typically 50%).</li>
                <li>Cancellations within 14 days or no-shows: 100% retention by hotels, houseboats, and transport contractors.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                5. Weather, Force Majeure &amp; Route Alterations
              </h2>
              <p>
                While we make every effort to adhere to planned itineraries, safety is our primary consideration. Monsoon conditions, heavy rainfall, landslides in mountain ghat passes (e.g., Munnar or Wayanad), state administrative orders, or national park closures may necessitate route alterations. Trip Connect is not liable for incidental delays caused by weather, road closures, flight rescheduling, or force majeure events.
              </p>
              <p>
                We strongly advise all domestic and international guests to obtain comprehensive personal travel insurance covering trip interruption, medical emergencies, and baggage protection.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                6. Governing Law
              </h2>
              <p>
                Any legal disputes arising from travel arrangements with Trip Connect shall be subject to the exclusive jurisdiction of the competent courts in Ernakulam, Kerala, India.
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <Link href="/" className="text-primary hover:underline font-semibold">
              ← Return to Home
            </Link>
            <Link href="/privacy-policy" className="text-primary hover:underline font-semibold">
              Read Privacy Policy →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
