import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getDestinationBySlug, getDestinations, getPackages } from "@/lib/db";
import Link from "next/link";

export async function generateStaticParams() {
  const destinations = await getDestinations(true);
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) return { title: "Destination Not Found | Trip Connect" };

  return {
    title: `${dest.name} Tour Packages & Itineraries | Trip Connect`,
    description: dest.short_description,
    openGraph: {
      title: dest.name,
      description: dest.short_description,
      images: [{ url: dest.cover_image }],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const allPackages = await getPackages({ status: "published" });
  const linkedPackages = allPackages.filter((p) =>
    p.destination_name?.toLowerCase().includes(destination.name.toLowerCase()) ||
    p.destination_id?.toLowerCase().includes(destination.id.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-outline">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-primary transition-colors">
              Destinations
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">{destination.name}</span>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/7] bg-surface-container-high shadow-xl">
            <img
              src={destination.cover_image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 text-white space-y-2">
              <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold uppercase tracking-wider">
                {destination.region}
              </span>
              <h1 className="font-display-hero text-headline-xl md:text-display-hero font-bold text-white tracking-tight">
                {destination.name}
              </h1>
              <p className="font-body-lg text-body-lg text-white/90 max-w-2xl leading-relaxed">
                {destination.short_description}
              </p>
            </div>
          </div>

          {/* Destination Description & Linked Packages */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-10">
              <section className="space-y-4">
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  About {destination.name}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  {destination.description}
                </p>
              </section>

              {/* Linked Packages */}
              <section className="space-y-6">
                <div>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    Available Packages
                  </span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
                    Itineraries Visiting {destination.name}
                  </h2>
                </div>

                {linkedPackages.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center space-y-3">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      We curate custom private itineraries for {destination.name}. Contact our Kochi concierge desk to plan your dates.
                    </p>
                    <Link
                      href={`/contact?destination=${destination.name}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs"
                    >
                      Plan Custom {destination.name} Trip
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {linkedPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/10] bg-surface-container-high">
                          <img
                            src={pkg.gallery[0]}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 text-xs font-semibold">
                            {pkg.duration_days}D / {pkg.duration_nights}N
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-1">
                              {pkg.title}
                            </h3>
                            <p className="text-xs text-outline line-clamp-2 mb-3">
                              {pkg.short_description}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-outline-variant/10 flex items-center justify-between">
                            <span className="text-xs font-bold text-on-surface">
                              ₹{pkg.starting_price.toLocaleString()} <span className="text-outline font-normal">/pax</span>
                            </span>
                            <Link
                              href={`/packages/${pkg.slug}`}
                              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold"
                            >
                              View Trip
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Concierge Help Sidebar */}
            <div className="lg:col-span-4 p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 sticky top-28">
              <div>
                <span className="text-xs text-secondary font-bold uppercase tracking-wider block mb-1">
                  Kochi Concierge Desk
                </span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Plan a Journey to {destination.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Have specific dates or requirements? Chat directly with our travel specialists to receive an itemized proposal within 24 hours.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/919400886838?text=${encodeURIComponent(
                    `Hello Trip Connect! I am interested in visiting ${destination.name}. Could you please share recommended itineraries?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-secondary hover:bg-on-secondary-container text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>WhatsApp Inquiry</span>
                </a>
                <Link
                  href={`/contact?destination=${destination.name}`}
                  className="w-full py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  <span>Send Detailed Form</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
