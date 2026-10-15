import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getPackageBySlug, getPackages } from "@/lib/db";
import { buildWhatsAppChatUrl } from "@/lib/notifications/whatsapp";
import Link from "next/link";
import PackageDetailEnquiryForm from "./PackageDetailEnquiryForm";

export async function generateStaticParams() {
  const packages = await getPackages({ status: "published" });
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug, false);
  if (!pkg) return { title: "Package Not Found | Trip Connect" };

  return {
    title: `${pkg.title} | Trip Connect Kerala`,
    description: pkg.short_description,
    openGraph: {
      title: pkg.title,
      description: pkg.short_description,
      images: pkg.gallery[0] ? [{ url: pkg.gallery[0] }] : [],
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug, false); // Only display published & verified packages to public

  if (!pkg) {
    notFound();
  }

  const isDraft = pkg.status !== "published";
  const whatsappUrl = buildWhatsAppChatUrl({
    packageTitle: pkg.title,
  });

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-outline mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-primary transition-colors">
              Packages
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold truncate max-w-xs">{pkg.title}</span>
          </nav>

          {/* Draft Preview Alert Banner */}
          {isDraft && (
            <div className="mb-8 p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>
                  <strong>Administrator Draft Preview:</strong> This package is not published and is not visible to public search or visitors.
                </span>
              </div>
              <Link
                href="/admin/packages"
                className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700"
              >
                Open Admin Manager
              </Link>
            </div>
          )}

          {/* Header Info Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold text-xs uppercase tracking-wider">
                  {pkg.category}
                </span>
                <span className="text-xs text-outline font-medium">
                  {pkg.destination_name}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-semibold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {pkg.duration_days} Days / {pkg.duration_nights} Nights
                </span>
              </div>

              <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight leading-tight">
                {pkg.title}
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
                {pkg.short_description}
              </p>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="md:col-span-2 rounded-2xl overflow-hidden aspect-[16/10] bg-surface-container-high shadow-md">
                  <img
                    src={pkg.gallery[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-surface-container-high shadow-sm">
                    <img
                      src={pkg.gallery[1] || pkg.gallery[0]}
                      alt="Gallery image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-surface-container-high shadow-sm relative">
                    <img
                      src={pkg.gallery[2] || pkg.gallery[0]}
                      alt="Gallery image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Pricing & Direct Contact Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-5">
              <div className="p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl space-y-6">
                <div>
                  <span className="text-xs text-outline font-medium uppercase tracking-wider block mb-1">
                    Verified Starting Estimate
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-hero text-4xl font-bold text-on-surface">
                      ₹{pkg.starting_price.toLocaleString()}
                    </span>
                    <span className="text-sm text-outline">/ person</span>
                  </div>
                  <p className="text-[11px] text-outline mt-2 leading-relaxed">
                    * Sample estimate for 2 adults sharing double occupancy. Final price is confirmed explicitly based on your travel dates, room category, and vehicle preferences.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                  <a
                    href="#enquiry-section"
                    className="w-full py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all btn-shimmer active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    <span>Enquire for this Package</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-secondary hover:bg-on-secondary-container text-white font-label-md text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Chat on WhatsApp (+91 9400886838)</span>
                  </a>
                </div>

                {/* Key Inclusions Snapshot */}
                <div className="space-y-2.5 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                    <span>Private AC Chauffeur Driven Vehicle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                    <span>Daily Breakfast at Handpicked Stays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                    <span>24/7 Kochi Concierge On-Ground Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tabs / Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Narrative */}
              {pkg.description && (
                <section className="space-y-4">
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    Journey Overview
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    {pkg.description}
                  </p>
                </section>
              )}

              {/* Highlights */}
              <section className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-4">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">grade</span>
                  Curated Highlights
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-body-sm text-body-sm text-on-surface">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Structured Day-by-Day Itinerary */}
              <section className="space-y-6">
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    Paced Day by Day
                  </span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
                    Structured Itinerary
                  </h2>
                </div>

                <div className="space-y-4 border-l-2 border-outline-variant/30 pl-6 ml-3 relative">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="relative group space-y-2 pb-6 last:pb-0">
                      {/* Node Ring */}
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-surface flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      </div>

                      <div className="flex items-baseline gap-3">
                        <span className="font-label-md text-xs font-bold text-primary uppercase tracking-wider">
                          Day {day.day}
                        </span>
                        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                          {day.title}
                        </h3>
                      </div>

                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {day.description}
                      </p>

                      {day.activity && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-container text-xs text-primary font-medium">
                          <span className="material-symbols-outlined text-[14px]">explore</span>
                          <span>{day.activity}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Inclusions & Exclusions */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                    What’s Included
                  </h3>
                  <ul className="space-y-2 text-xs text-on-surface-variant">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-secondary font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-4">
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-[20px]">cancel</span>
                    What’s Not Included
                  </h3>
                  <ul className="space-y-2 text-xs text-on-surface-variant">
                    {pkg.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-outline font-bold">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Accommodation & Stays */}
              {pkg.accommodation_details && (
                <section className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2">
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">hotel</span>
                    Accommodation Details
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {pkg.accommodation_details}
                  </p>
                </section>
              )}

              {/* Departure & Availability Note */}
              <div className="p-5 rounded-xl bg-surface-container-high/40 border border-outline-variant/30 text-xs text-outline space-y-1">
                <span className="font-bold text-on-surface block">Availability &amp; Reservation Policy:</span>
                <p>
                  {pkg.availability_notes || "All departures are private and managed individually by Trip Connect. Submitting an enquiry does not constitute a confirmed reservation or deposit transaction."}
                </p>
              </div>
            </div>

            {/* Enquiry Form on Page */}
            <div className="lg:col-span-12 mt-8" id="enquiry-section">
              <PackageDetailEnquiryForm
                packageId={pkg.id}
                packageTitle={pkg.title}
                destination={pkg.destination_name}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
