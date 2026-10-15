import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getPackages, getSiteContent } from "@/lib/db";
import ContactFormClient from "./ContactFormClient";

export const metadata = {
  title: "Contact Concierge Desk | Trip Connect Kochi",
  description: "Get in touch with our Kochi travel planners. Direct WhatsApp consultation, custom itinerary curation, and 24/7 Kerala travel assistance.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; destination?: string; offer?: string }>;
}) {
  const params = await searchParams;
  const [packages, content] = await Promise.all([
    getPackages({ status: "published" }),
    getSiteContent(),
  ]);

  const address = content.contact_address || "Ayyappankavu, Kochi, Ernakulam, Kerala – 682018";
  const phone = content.contact_phone || "+91 9400886838";
  const email = content.contact_email || "tripconnectwebsite2@gmail.com";
  const hours = content.business_hours || content.contact_hours || "Monday – Saturday: 9:00 AM – 8:00 PM IST";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const waPhone = cleanPhone.replace(/^\+/, "");

  return (
    <>
      <Header content={content} />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              Direct Kochi Concierge Desk
            </div>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight mb-4">
              Let’s Plan Your Next Journey
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Share your travel vision, tentative month, and preferences. Our native team will curate a transparent, itemized proposal within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details & Direct Outreach */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 shadow-sm space-y-6">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Contact Information
                </h2>

                <div className="space-y-5 text-xs text-on-surface-variant">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">location_on</span>
                    </div>
                    <div>
                      <strong className="text-on-surface block mb-0.5">Physical Office Address</strong>
                      <a
                        href="https://share.google/V0eWcp5SrScZDVig4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leading-relaxed block hover:text-primary transition-colors cursor-pointer"
                        title="Open Trip Connect in Google Maps"
                      >
                        {address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                    </div>
                    <div>
                      <strong className="text-on-surface block mb-0.5">WhatsApp Concierge Desk</strong>
                      <a
                        href={`https://wa.me/${waPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary font-semibold hover:underline block"
                      >
                        Chat on WhatsApp (Typical response: &lt; 15 mins)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </div>
                    <div>
                      <strong className="text-on-surface block mb-0.5">Direct Voice Line</strong>
                      <a href={`tel:${cleanPhone}`} className="text-primary font-semibold hover:underline block">
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </div>
                    <div>
                      <strong className="text-on-surface block mb-0.5">Email Inquiries</strong>
                      <a
                        href={`mailto:${email}`}
                        className="text-primary font-semibold hover:underline block"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-outline shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">schedule</span>
                    </div>
                    <div>
                      <strong className="text-on-surface block mb-0.5">Concierge Operating Hours</strong>
                      <span className="block">{hours}</span>
                      <span className="text-outline text-[11px] block mt-0.5">
                        24/7 on-ground emergency support for active travelers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-secondary hover:bg-on-secondary-container text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Start Instant WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Form Component */}
            <div className="lg:col-span-7">
              <ContactFormClient
                packages={packages}
                preselectedPackage={params.package}
                preselectedDestination={params.destination}
                preselectedOffer={params.offer}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer content={content} />
      <FloatingWhatsApp />
    </>
  );
}
