"use client";

import Link from "next/link";
import { SiteContent } from "@/lib/types";

interface HomeTransportationServicesProps {
  content?: Partial<SiteContent>;
}

export default function HomeTransportationServices({ content }: HomeTransportationServicesProps) {
  const badge = content?.home_transport_badge || "Kerala & Pan-India Mobility";
  const title = content?.home_transport_title || "Transportation, Taxi & Luxury Chauffeur Services";
  const subtitle =
    content?.home_transport_subtitle ||
    "Trusted, transparent, and private mobility across Kerala and nationwide — from budget cabs and airport transfers to luxury Mercedes-Benz fleets and All-India tourist coaches.";

  const services = [
    {
      title: content?.home_transport_service_1_title || "Airport Transfers & Meet & Greet",
      desc:
        content?.home_transport_service_1_desc ||
        "Punctual airport arrivals and departures at Cochin (COK), Trivandrum (TRV), and Calicut (CCJ) with real-time flight tracking and name-board reception.",
      icon: content?.home_transport_service_1_icon || "flight_takeoff",
      tag: "24/7 Available",
      href: "/transportation#reserve-car",
      color: "from-blue-500/20 to-sky-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: content?.home_transport_service_2_title || "Standard Taxi & City Cabs",
      desc:
        content?.home_transport_service_2_desc ||
        "Budget-friendly, sanitized, air-conditioned compact cars and sedans (Dzire, Etios, Swift) with verified polite chauffeurs for city commutes and family travel.",
      icon: content?.home_transport_service_2_icon || "local_taxi",
      tag: "Budget Friendly",
      href: "/transportation#standard-cabs",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: content?.home_transport_service_3_title || "Premium Luxury Chauffeur Fleet",
      desc:
        content?.home_transport_service_3_desc ||
        "Executive chauffeur-driven Mercedes-Benz, Audi, BMW, and Toyota Vellfire with uniformed English-speaking drivers, bottled spring water, and high-speed Wi-Fi.",
      icon: content?.home_transport_service_3_icon || "hotel_class",
      tag: "VIP Luxury",
      href: "/transportation#premium-segment",
      color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: content?.home_transport_service_4_title || "All-India Bus Booking & Charters",
      desc:
        content?.home_transport_service_4_desc ||
        "Interstate Volvo 9600 Multi-Axle AC sleepers, BharatBenz coaches, and 49-seater tourist buses operating to Bangalore, Chennai, Hyderabad, and Pan-India charters.",
      icon: content?.home_transport_service_4_icon || "directions_bus",
      tag: "Pan-India Routes",
      href: "/transportation#interstate-buses",
      color: "from-indigo-500/20 to-purple-500/10 text-indigo-600 dark:text-indigo-400",
    },
    {
      title: content?.home_transport_service_5_title || "Outstation Hill-Station Tours",
      desc:
        content?.home_transport_service_5_desc ||
        "Experienced mountain navigators for Munnar, Wayanad, Vagamon, Thekkady, and Ooty, ensuring smooth climbing with zero motion fatigue.",
      icon: content?.home_transport_service_5_icon || "terrain",
      tag: "Hill Certified Drivers",
      href: "/transportation#standard-cabs",
      color: "from-emerald-500/20 to-green-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: content?.home_transport_service_6_title || "Wedding & VIP Delegation Fleet",
      desc:
        content?.home_transport_service_6_desc ||
        "End-to-end luxury convoy management featuring executive sedans and Force Urbania VIP minibuses for destination weddings and corporate conferences.",
      icon: content?.home_transport_service_6_icon || "groups",
      tag: "Event Convoys",
      href: "/transportation#premium-segment",
      color: "from-rose-500/20 to-pink-500/10 text-rose-600 dark:text-rose-400",
    },
  ];

  const ctaText = content?.home_transport_cta_text || "View Full Fleet & Book Online";

  return (
    <section id="transportation-services" className="py-20 lg:py-28 bg-surface-container-low/40 border-y border-outline-variant/20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-display-hero text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">
            {title}
          </h2>

          <p className="font-body-lg text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 6 Services Grid (Pure Service Showcase - No Car Photos, Clean Architectural Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest rounded-3xl p-7 border border-outline-variant/30 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle hover gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant uppercase tracking-wider">
                    {service.tag}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  24/7 Verified Chauffeurs
                </span>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                >
                  <span>Book Service</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with Link to Full Transportation Page */}
        <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base sm:text-lg text-on-surface">
              Explore Our Complete Vehicle Fleet (Economy Cabs, Luxury Benz &amp; Interstate Buses)
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Detailed seating capacity, luggage limits, amenities, and starting rates for each car and bus.
            </p>
          </div>

          <Link
            href="/transportation"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>{ctaText}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
