import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getCmsDestinations, getCmsPackages } from "@/sanity/lib/data";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Destinations Geographic Atlas | Trip Connect Kerala",
  description: "Explore curated travel destinations across God’s Own Country and Pan-India. Discover Munnar, Alleppey, Wayanad, Varkala, Rajasthan, Kashmir and more.",
};

export default async function DestinationsPage() {
  const destinations = await getCmsDestinations();
  const packages = await getCmsPackages();

  const keralaDestinations = destinations.filter((d) => d.region === "Kerala");
  const indiaDestinations = destinations.filter((d) => d.region !== "Kerala");

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase font-semibold mb-3">
              <span className="material-symbols-outlined text-[16px]">public</span>
              Geographic Atlas
            </div>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight mb-4">
              Explore Our Destinations
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              From the tranquil palm canals of Kerala to imperial desert forts and alpine Himalayan valleys. Each destination is planned with local expertise and private chauffeured transit.
            </p>
          </div>

          {/* Kerala Highlights Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                  Kerala Sanctuaries
                </h2>
                <p className="text-xs text-outline mt-1">
                  Our flagship home state — curated natively from our headquarters in Kochi
                </p>
              </div>
              <span className="text-xs text-outline">{keralaDestinations.length} Escapes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keralaDestinations.map((dest) => {
                const count = packages.filter((p) =>
                  p.destination_name?.toLowerCase().includes(dest.name.toLowerCase())
                ).length;

                return (
                  <Link
                    key={dest.id}
                    href={`/destinations/${dest.slug}`}
                    className="group flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-high">
                      <Image
                        src={dest.cover_image || "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-fixed">
                          {dest.region}
                        </span>
                        <h3 className="font-headline-md text-headline-md font-bold text-white">
                          {dest.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                        {dest.short_description}
                      </p>

                      <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                        <span className="text-outline font-medium">
                          {count > 0 ? `${count} Active Itinerary` : "Tailor-made Itinerary"}
                        </span>
                        <span className="text-primary font-semibold group-hover:underline flex items-center gap-1">
                          <span>Explore</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Pan-India Highlights Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">map</span>
                  Pan-India Journeys
                </h2>
                <p className="text-xs text-outline mt-1">
                  Handcrafted Golden Triangle circuits, desert retreats, and mountain valleys
                </p>
              </div>
              <span className="text-xs text-outline">{indiaDestinations.length} Curations</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {indiaDestinations.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="group flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-high">
                    <Image
                      src={dest.cover_image || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary-fixed">
                        {dest.region}
                      </span>
                      <h3 className="font-headline-md text-headline-md font-bold text-white">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                      {dest.short_description}
                    </p>

                    <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                      <span className="text-outline font-medium">Verified Circuit</span>
                      <span className="text-primary font-semibold group-hover:underline flex items-center gap-1">
                        <span>View Details</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
