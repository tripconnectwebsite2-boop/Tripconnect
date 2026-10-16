import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TransportationBookingForm from "./TransportationBookingForm";
import { buildWhatsAppChatUrl } from "@/lib/notifications/whatsapp";
import { getTransportationVehicles } from "@/lib/db";
import { TransportationVehicle } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Car Rental & All-India Bus Booking Kochi | Small Cars, Mercedes, Audi & Volvo | Trip Connect",
  description:
    "Book budget small cars (Dzire, Etios), luxury chauffeur Mercedes-Benz, Audi, BMW, Toyota Vellfire, and All-India interstate Volvo AC sleeper buses with Trip Connect Kochi. Transparent rates and 24/7 concierge.",
  openGraph: {
    title: "Car Rental, Luxury Chauffeur & All-India Bus Booking | Trip Connect",
    description:
      "From budget small cars and executive Mercedes/Audi fleets to All-India interstate luxury Volvo buses. Safe, sanitized, and chauffeur-driven across Kerala and India.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Trip Connect Transportation Fleet Kochi",
      },
    ],
  },
};

export default async function TransportationPage() {
  const allVehicles: TransportationVehicle[] = await getTransportationVehicles({ activeOnly: true });

  const normalVehicles = allVehicles.filter((v) => v.category === "normal");
  const premiumVehicles = allVehicles.filter((v) => v.category === "premium");
  const busVehicles = allVehicles.filter((v) => v.category === "bus");

  const generalWhatsAppUrl = buildWhatsAppChatUrl({
    customMessage:
      "Hello Trip Connect Concierge, I would like to inquire about car / bus transportation in Kerala & Pan-India. Please share fleet availability and best rates.",
  });

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-surface-container-low via-surface-container-lowest to-surface-container-lowest">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1920&auto=format&fit=crop"
            alt="Trip Connect Transportation Fleet"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/80 via-surface-container-lowest/95 to-surface-container-lowest" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-md text-xs sm:text-sm font-semibold tracking-wide animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Kerala &amp; Pan-India Verified Fleet • 24/7 Chauffeur Dispatch</span>
          </div>

          <h1 className="font-display-hero text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-on-surface max-w-4xl mx-auto leading-[1.15]">
            Transportation Fleet &amp; <span className="text-primary">All-India Bus</span> Booking
          </h1>

          <p className="font-body-lg text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            From dependable city cabs and airport transfers to elite chauffeur-driven luxury sedans and nationwide interstate sleeper coaches.
          </p>

          {/* Quick Category Anchors */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#standard-cabs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>Standard Cabs</span>
            </a>

            <a
              href="#premium-segment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>Premium Segment</span>
            </a>

            <a
              href="#interstate-buses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>Interstate Buses</span>
            </a>

            <a
              href="#reserve-car"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-bold transition-all shadow-md hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Reserve Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Standards Bar */}
      <section className="border-y border-outline-variant/20 bg-surface-container-low/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">security</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Verified Chauffeurs</h4>
              <p className="text-[11px] text-on-surface-variant">Background checked &amp; courteous</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">flight_takeoff</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Airport Flight Tracking</h4>
              <p className="text-[11px] text-on-surface-variant">Zero wait charges on delayed arrivals</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">sanitizer</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Sanitized Fleet</h4>
              <p className="text-[11px] text-on-surface-variant">Immaculate cabins with chilled AC</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">24/7 Concierge Hotline</h4>
              <p className="text-[11px] text-on-surface-variant">Instant on-road assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          STANDARD CARS (Presented cleanly without awkward segment labels)
          ===================================================================== */}
      <section id="standard-cabs" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {normalVehicles.map((vehicle) => {
            const carWhatsApp = buildWhatsAppChatUrl({
              customMessage: `Hello Trip Connect, I would like to book: ${vehicle.name} (${vehicle.starting_price}). Please share driver availability and quote.`,
            });

            return (
              <div
                key={vehicle.id}
                className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                      {vehicle.badge || "Standard Choice"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 text-white backdrop-blur-md text-xs font-bold shadow-md">
                    {vehicle.starting_price}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-on-surface leading-tight">{vehicle.name}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{vehicle.subtitle}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">group</span>
                        <span>{vehicle.capacity_pax} Passengers</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">luggage</span>
                        <span>{vehicle.capacity_luggage} Luggage</span>
                      </div>
                    </div>

                    {/* Features */}
                    {vehicle.features && vehicle.features.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-xs text-on-surface-variant">
                        {vehicle.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">check_circle</span>
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                    <a
                      href={carWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      WhatsApp Booking
                    </a>
                    <a
                      href="#reserve-car"
                      className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all"
                      title="Book via form"
                    >
                      Reserve
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          PREMIUM SEGMENT (Starts clearly with the heading: Premium Segment)
          ===================================================================== */}
      <section id="premium-segment" className="py-20 md:py-28 bg-surface-container-low/40 border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-label-sm text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">hotel_class</span>
              Executive Chauffeur Fleet
            </span>
            <h2 className="font-display-hero text-3xl sm:text-5xl font-bold tracking-tight text-on-surface">
              Premium Segment
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
              Mercedes-Benz, Audi, BMW, and Toyota Vellfire. Uniformed English-speaking chauffeurs, bottled spring water, and immaculate presentation for VIP arrivals, corporate delegates, and luxury holidaymakers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumVehicles.map((vehicle) => {
              const luxuryWhatsApp = buildWhatsAppChatUrl({
                customMessage: `Hello Trip Connect VIP Concierge, I would like to reserve the luxury chauffeur vehicle: ${vehicle.name} (${vehicle.starting_price}). Please share availability and dispatch options.`,
              });

              return (
                <div
                  key={vehicle.id}
                  className="bg-surface-container-lowest rounded-3xl border border-amber-500/30 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col group relative"
                >
                  {/* Top Gold Accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-primary to-amber-600" />

                  {/* Image */}
                  <div className="relative h-56 w-full bg-surface-container overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white shadow-md">
                        {vehicle.badge || "VIP Luxury"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-black/80 text-amber-300 backdrop-blur-md text-xs font-bold border border-amber-500/30 shadow-lg">
                      {vehicle.starting_price}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <h3 className="font-bold text-lg text-on-surface leading-tight">{vehicle.name}</h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">
                        {vehicle.subtitle}
                      </p>

                      <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                        {vehicle.description}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-2xl border border-outline-variant/20">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-amber-600">group</span>
                          <span>{vehicle.capacity_pax} VIP Seats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-amber-600">luggage</span>
                          <span>{vehicle.capacity_luggage} Luggage</span>
                        </div>
                      </div>

                      {/* Features */}
                      {vehicle.features && vehicle.features.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">
                            VIP Inclusions:
                          </span>
                          <ul className="grid grid-cols-1 gap-1.5 text-xs text-on-surface-variant">
                            {vehicle.features.slice(0, 5).map((f, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-600 text-[16px] shrink-0">star</span>
                                <span className="truncate">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-outline-variant/20 flex items-center gap-3">
                      <a
                        href={luxuryWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        WhatsApp VIP Booking
                      </a>
                      <a
                        href="#reserve-car"
                        className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all"
                      >
                        Reserve
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          INTERSTATE BUS BOOKING & CHARTERS
          ===================================================================== */}
      <section id="interstate-buses" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-label-sm text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">directions_bus</span>
            Pan-India Bus Fleet
          </span>
          <h2 className="font-display-hero text-3xl sm:text-5xl font-bold tracking-tight text-on-surface">
            Interstate Buses &amp; Tour Charters
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
            Luxury Volvo Multi-Axle AC sleepers, BharatBenz coaches, and 49-seater tourist buses with National Permits operating across South India and nationwide circuits.
          </p>
        </div>

        {/* Bus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {busVehicles.map((bus) => {
            const busWhatsApp = buildWhatsAppChatUrl({
              customMessage: `Hello Trip Connect, I would like to book the interstate luxury bus: ${bus.name} (${bus.starting_price}). Please share seat availability and route details.`,
            });

            return (
              <div
                key={bus.id}
                className="bg-surface-container-lowest rounded-3xl border border-blue-500/30 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row group"
              >
                {/* Image side */}
                <div className="relative md:w-5/12 h-64 md:h-auto bg-surface-container overflow-hidden shrink-0">
                  <Image
                    src={bus.image}
                    alt={bus.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                      {bus.badge || "All-India Bus"}
                    </span>
                  </div>
                </div>

                {/* Details side */}
                <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-on-surface leading-tight">{bus.name}</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-1">
                      {bus.subtitle}
                    </p>

                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-500/20">
                      {bus.starting_price}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-on-surface-variant bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-blue-600">group</span>
                        <span>{bus.capacity_pax}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-blue-600">luggage</span>
                        <span>{bus.capacity_luggage}</span>
                      </div>
                    </div>

                    {/* Routes */}
                    {bus.routes && bus.routes.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant block">
                          Popular Routes:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {bus.routes.map((r, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-800 dark:text-blue-300 font-medium"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {bus.features && bus.features.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-on-surface-variant">
                        {bus.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-blue-600 text-[15px] shrink-0">check</span>
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                    <a
                      href={busWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      WhatsApp Booking
                    </a>
                    <a
                      href="#reserve-car"
                      className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all"
                    >
                      Reserve
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Pan-India Routes Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 md:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Interstate &amp; All-India Permits
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Interstate Line Services &amp; Custom Tour Charters
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                Daily departures and bespoke charters to Bangalore, Chennai, Hyderabad, Mumbai, Goa, Coimbatore, and pilgrimage circuits to Tirupati, Velankanni, and North India.
              </p>
            </div>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg transition-all shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Inquire for Bus Charters
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-4 border-t border-white/10 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="block font-bold text-white">Kochi ⇄ Bangalore</span>
              <span className="text-[10px] text-white/70">Daily Sleeper</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="block font-bold text-white">Kochi ⇄ Chennai</span>
              <span className="text-[10px] text-white/70">AC Multi-Axle</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="block font-bold text-white">Kerala ⇄ Coimbatore</span>
              <span className="text-[10px] text-white/70">Express Line</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="block font-bold text-white">Kochi ⇄ Goa / Mumbai</span>
              <span className="text-[10px] text-white/70">Coastal Route</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="block font-bold text-white">Temple Circuits</span>
              <span className="text-[10px] text-white/70">Tirupati / Madurai</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
              <span className="block font-bold text-white">Pan-India Charters</span>
              <span className="text-[10px] text-white/70">National Permit</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          RESERVATION FORM SECTION
          ===================================================================== */}
      <section className="py-20 md:py-28 bg-surface-container-low/50 border-t border-outline-variant/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TransportationBookingForm vehicles={allVehicles} defaultCategory="normal" />
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
