import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getPackages, getDestinations } from "@/lib/db";
import Link from "next/link";
import PackageCatalogClient from "./PackageCatalogClient";

export const metadata = {
  title: "Curated Travel Packages | Trip Connect Kochi",
  description: "Browse handpicked Kerala tours, backwater cruises, and Pan-India circuits. Verified starting prices, day-by-day itineraries, and private chauffeur journeys.",
};

export default async function PackagesPage() {
  const packages = await getPackages({ status: "published" });
  const destinations = await getDestinations(true);

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Editorial Itineraries
            </div>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight mb-4">
              Explore Travel Packages
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Every itinerary is balanced with private air-conditioned transit, handpicked boutique stays, and authentic native experiences.
            </p>
          </div>

          {/* Interactive Client Filter & Grid */}
          <PackageCatalogClient initialPackages={packages} destinations={destinations} />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
