import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getOffers } from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "Special Travel Offers & Retreats | Trip Connect Kochi",
  description: "Limited seasonal discounts and advance retreat offers for Kerala backwaters, tea highlands, and Pan-India circuits.",
};

export default async function OffersPage() {
  const offers = await getOffers(true); // Only active, verified, non-expired offers

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px]">local_offer</span>
              Approved Seasonal Offers
            </div>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight mb-4">
              Special Offers &amp; Retreats
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Verified seasonal promotions curated directly with boutique plantation estates, heritage homestays, and luxury backwater houseboats.
            </p>
          </div>

          {offers.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-surface-container-low border border-outline-variant/20 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px]">event_available</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                No active promotional campaigns at this time
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                We believe in transparent pricing without artificial markups or fake ongoing discounts. Contact our desk for tailored group rates and seasonal estimates.
              </p>
              <Link
                href="/contact"
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs inline-flex items-center gap-2 shadow-sm"
              >
                Inquire for Custom Quote
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-3xl bg-gradient-to-br from-primary via-primary-container to-secondary p-8 lg:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-white text-primary font-bold text-xs uppercase tracking-wider shadow-sm">
                        {offer.discount_value}% OFF
                      </span>
                      <span className="text-xs text-white/80 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        Valid till {new Date(offer.valid_until).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="font-headline-lg text-headline-lg font-bold text-white">
                      {offer.title}
                    </h2>

                    <p className="font-body-md text-body-md text-white/90 leading-relaxed">
                      {offer.description}
                    </p>

                    {offer.package_title && (
                      <div className="inline-block p-3 rounded-xl bg-white/10 backdrop-blur-md text-xs text-white border border-white/20">
                        Applicable on: <strong>{offer.package_title}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 mt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <span className="text-xs text-white/70">
                      Subject to vehicle &amp; resort availability on requested dates
                    </span>
                    <Link
                      href={`/contact?offer=${encodeURIComponent(offer.title)}`}
                      className="px-6 py-3 rounded-xl bg-white text-primary hover:bg-surface-bright font-semibold text-xs transition-transform hover:-translate-y-0.5 shadow-md btn-shimmer active:scale-[0.98]"
                    >
                      Enquire for this Offer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
