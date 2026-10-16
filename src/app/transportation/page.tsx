import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  // Fetch dynamic vehicles from Firestore database
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
            ചെറിയ കാറുകൾ (Normal Cabs), പ്രീമിയം ലക്ഷ്വറി കാറുകൾ (Mercedes, Audi, BMW), ഇന്ത്യയിലുടനീളം സർവീസ് നടത്തുന്ന ലക്ഷ്വറി ബസ്സുകൾ (Volvo Sleeper, BharatBenz) എന്നിവ ഏറ്റവും വിശ്വസ്തതയോടെ ഓൺലൈനായി ബുക്ക് ചെയ്യാം.
          </p>

          {/* Quick Category Anchors */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#normal-fleet"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>🚗 ചെറിയ കാറുകൾ (Normal Cabs)</span>
            </a>

            <a
              href="#premium-fleet"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>⭐ പ്രീമിയം ലക്ഷ്വറി (Benz, Audi)</span>
            </a>

            <a
              href="#bus-fleet"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <span>🚌 ഓൾ ഇന്ത്യ ബസ്സുകൾ (Bus Booking)</span>
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

      {/* Fleet Standards Banner */}
      <section className="border-y border-outline-variant/20 bg-surface-container-low/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">security</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Verified Drivers</h4>
              <p className="text-[11px] text-on-surface-variant">Police checked &amp; professional</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">flight_takeoff</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Airport Flight Tracking</h4>
              <p className="text-[11px] text-on-surface-variant">Zero wait charge on flight delays</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">sanitizer</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Spotless Sanitized Fleet</h4>
              <p className="text-[11px] text-on-surface-variant">Clean cabins with air conditioning</p>
            </div>
            <div className="space-y-1">
              <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">24/7 WhatsApp Hotline</h4>
              <p className="text-[11px] text-on-surface-variant">Instant on-road assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 1: Standard & Economy Cabs (നോർമൽ ട്രാൻസ്പോർട്ടേഷൻ - ചെറിയ കാറുകൾ)
          ===================================================================== */}
      <section id="normal-fleet" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-label-sm text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            Section 1: Standard &amp; Economy Cabs
          </span>
          <h2 className="font-display-hero text-2xl sm:text-4xl font-bold tracking-tight text-on-surface">
            നോർമൽ ട്രാൻസ്പോർട്ടേഷൻ (ചെറിയ കാറുകൾ)
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
            ദമ്പതികൾക്കും ചെറിയ കുടുംബങ്ങൾക്കും കേരളത്തിലെ കാഴ്ചകൾ കാണാനും എയർപോർട്ട് യാത്രകൾക്കും ഏറ്റവും അനുയോജ്യമായ ബഡ്ജറ്റ് ഫ്രണ്ട്‌ലി AC കാറുകൾ.
          </p>
        </div>

        {normalVehicles.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">No standard vehicles listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {normalVehicles.map((vehicle) => {
              const carWhatsApp = buildWhatsAppChatUrl({
                customMessage: `Hello Trip Connect, I would like to book the standard cab: ${vehicle.name} (${vehicle.starting_price}). Please share driver availability and quote.`,
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
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                        {vehicle.badge || "Budget Choice"}
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
                        WhatsApp ബുക്കിംഗ്
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
        )}
      </section>

      {/* =====================================================================
          SECTION 2: Premium & Luxury Fleet (പ്രീമിയം സെക്ഷൻ - ബെൻസ്, ഓഡി, ബിഎംഡബ്ല്യു)
          ===================================================================== */}
      <section id="premium-fleet" className="py-16 md:py-24 bg-surface-container-low/40 border-y border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-label-sm text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">hotel_class</span>
              Section 2: Premium Chauffeur Fleet
            </span>
            <h2 className="font-display-hero text-2xl sm:text-4xl font-bold tracking-tight text-on-surface">
              പ്രീമിയം ലക്ഷ്വറി കാറുകൾ (Mercedes, Audi, BMW, Vellfire)
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
              വി.ഐ.പി ഗസ്റ്റുകൾ, വെഡിങ് ഇവന്റുകൾ, ആഡംബര കേരള ടൂറുകൾ എന്നിവയ്ക്കായി ബെൻസ്, ഓഡി, ബിഎംഡബ്ല്യു, വെൽഫയർ തുടങ്ങിയ പ്രീമിയം കാറുകൾ യൂണിഫോം ധരിച്ച പ്രൊഫഷണൽ ഷ്വാഫർമാരോടൊപ്പം ലഭ്യമാണ്.
            </p>
          </div>

          {premiumVehicles.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">No premium luxury vehicles listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumVehicles.map((vehicle) => {
                const luxuryWhatsApp = buildWhatsAppChatUrl({
                  customMessage: `Hello Trip Connect VIP Concierge, I would like to reserve the luxury chauffeur vehicle: ${vehicle.name} (${vehicle.starting_price}). Please connect me with your VIP fleet manager.`,
                });

                return (
                  <div
                    key={vehicle.id}
                    className="bg-surface-container-lowest rounded-3xl border border-amber-500/30 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col group relative"
                  >
                    {/* Top Glow Accent */}
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
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-lg text-on-surface leading-tight">{vehicle.name}</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">
                              {vehicle.subtitle}
                            </p>
                          </div>
                        </div>

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
                          WhatsApp VIP റിസർവേഷൻ
                        </a>
                        <a
                          href="#reserve-car"
                          className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all"
                        >
                          Book Chauffeur
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: All-India Bus Booking & Tourist Coaches (ഇന്ത്യൻ ബസ് സർവീസ്)
          ===================================================================== */}
      <section id="bus-fleet" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 font-label-sm text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">directions_bus</span>
            Section 3: All-India Bus Booking &amp; Tourist Coaches
          </span>
          <h2 className="font-display-hero text-2xl sm:text-4xl font-bold tracking-tight text-on-surface">
            ഓൾ ഇന്ത്യ ബസ് സർവീസ് &amp; ടൂറിസ്റ്റ് ബസ് ബുക്കിംഗ്
          </h2>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
            ഇന്ത്യയിലുടനീളം സർവീസ് നടത്തുന്ന ലക്ഷ്വറി എയർ സസ്പെൻഷൻ സ്ലീപ്പർ ബസ്സുകൾ (Volvo Multi-Axle, BharatBenz), കോളേജ് / കമ്പനി / വെഡിങ് ടൂറുകൾക്കായുള്ള 49-സീറ്റർ ടൂറിസ്റ്റ് കോച്ചുകൾ, ഫോഴ്സ് അർബാനിയ മിനി ബസ്സുകൾ എന്നിവ ഓൺലൈനായി ബുക്ക് ചെയ്യാം.
          </p>
        </div>

        {/* Bus Showcase Cards */}
        {busVehicles.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">No buses listed yet.</p>
          </div>
        ) : (
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
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-lg text-on-surface leading-tight">{bus.name}</h3>
                          <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mt-1">
                            {bus.subtitle}
                          </p>
                        </div>
                      </div>

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
                            പ്രധാന സർവീസ് റൂട്ടുകൾ (Popular Routes):
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
                        ബസ് ബുക്കിംഗ് (WhatsApp)
                      </a>
                      <a
                        href="#reserve-car"
                        className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all"
                      >
                        Enquire
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Popular Pan-India Bus Destinations Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 md:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Interstate &amp; All-India Permits
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                ഇന്ത്യയിലെ പ്രധാന നഗരങ്ങളിലേക്കുള്ള ബസ് സർവീസ് &amp; ഗ്രൂപ്പ് ചാർട്ടറുകൾ
              </h3>
              <p className="text-white/80 text-xs sm:text-sm">
                ബെംഗളൂരു, ചെന്നൈ, ഹൈദരാബാദ്, മുംബൈ, ഗോവ, കോയമ്പത്തൂർ, മധുര, കൂടാതെ തിരുപ്പതി, വേളാങ്കണ്ണി, കാശി തീർത്ഥാടന യാത്രകൾക്കും കോളേജ് ടൂറുകൾക്കുമുള്ള സമ്പൂർണ്ണ ബസ് ബുക്കിംഗ് സൗകര്യം.
              </p>
            </div>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg transition-all shrink-0 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              ബസ് ചാർട്ടർ അന്വേഷണങ്ങൾക്ക്
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
              <span className="text-[10px] text-white/70">Express Seater</span>
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
          RESERVATION FORM SECTION: Online Booking for Cars, Chauffeurs & Buses
          ===================================================================== */}
      <section className="py-16 md:py-24 bg-surface-container-low/50 border-t border-outline-variant/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TransportationBookingForm vehicles={allVehicles} defaultCategory="normal" />
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
