"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { TravelPackage, Destination, PackageCategory } from "@/lib/types";

export default function PackageCatalogClient({
  initialPackages,
  destinations,
}: {
  initialPackages: TravelPackage[];
  destinations: Destination[];
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDestination, setSelectedDestination] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(50000);

  const categories: (PackageCategory | "All")[] = [
    "All",
    "Kerala Tours",
    "India Tours",
    "Family Trips",
    "Honeymoon Packages",
    "Adventure & Nature",
    "Weekend & Short Trips",
  ];

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      // Must be published, verified, and not a draft slug
      if (pkg.status !== "published" || !pkg.content_verified || pkg.slug.endsWith("-draft")) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = pkg.title.toLowerCase().includes(q);
        const matchesDesc = pkg.short_description.toLowerCase().includes(q);
        const matchesDest = pkg.destination_name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDest) return false;
      }

      // Category filter
      if (selectedCategory !== "All" && pkg.category !== selectedCategory) {
        return false;
      }

      // Destination filter
      if (selectedDestination !== "All") {
        const destSlug = selectedDestination.toLowerCase();
        const matchesDest =
          pkg.destination_id?.toLowerCase().includes(destSlug) ||
          pkg.destination_name?.toLowerCase().includes(destSlug) ||
          pkg.title.toLowerCase().includes(destSlug);
        if (!matchesDest) return false;
      }

      // Budget filter
      if (pkg.starting_price > maxPrice) {
        return false;
      }

      return true;
    });
  }, [initialPackages, search, selectedCategory, selectedDestination, maxPrice]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedDestination("All");
    setMaxPrice(50000);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tour name, highlights, or spots..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-outline">
              search
            </span>
          </div>

          {/* Destination Dropdown */}
          <div className="md:col-span-4 relative">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest text-on-surface text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="All">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.region})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3.5 text-outline pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>

          {/* Budget Slider */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-outline">Max Starting Budget</span>
              <span className="text-primary font-bold">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={60000}
              step={2000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/20 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(search || selectedCategory !== "All" || selectedDestination !== "All" || maxPrice < 50000) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-outline px-1">
        <span>
          Showing <strong>{filteredPackages.length}</strong> verified itineraries
        </span>
        <span className="text-xs">Starting prices verified upon enquiry</span>
      </div>

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-surface-container-low border border-outline-variant/20 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-container-high text-primary flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">travel_explore</span>
          </div>
          <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
            No matching travel packages found
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            Try adjusting your budget or destination filters, or contact our Kochi concierge desk to curate a custom itinerary just for you.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-outline-variant/20"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-high">
                <Image
                  src={pkg.gallery[0]}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md shadow-sm">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    {pkg.duration_days}D / {pkg.duration_nights}N
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md">
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    {pkg.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-xs text-outline font-medium uppercase tracking-wider block mb-1">
                    {pkg.destination_name}
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                    {pkg.short_description}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="space-y-1.5 mb-6 text-xs text-on-surface-variant">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Price & Actions */}
                <div className="pt-4 mt-auto border-t border-outline-variant/20">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-outline">Starting Price</span>
                    <div className="text-right">
                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        ₹{pkg.starting_price.toLocaleString()}
                      </span>
                      <span className="text-xs text-outline"> /person</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="py-2.5 text-center rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-xs font-semibold transition-all"
                    >
                      View Itinerary
                    </Link>
                    <Link
                      href={`/contact?package=${pkg.slug}`}
                      className="py-2.5 text-center rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-semibold transition-all btn-shimmer active:scale-[0.98]"
                    >
                      Enquire
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
