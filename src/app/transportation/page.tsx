import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TransportationBookingForm from "./TransportationBookingForm";
import { buildWhatsAppChatUrl } from "@/lib/notifications/whatsapp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Luxury Car Rental & Chauffeur Fleet Kochi | Mercedes-Benz, Audi, BMW | Trip Connect",
  description:
    "Experience Kerala in elite comfort with Trip Connect's luxury chauffeur fleet. Mercedes-Benz, Audi A6/Q7, BMW, Toyota Vellfire VIP MPVs, and executive touring cars. Punctual airport transfers, wedding luxury cars, and bespoke hill-station journeys.",
  openGraph: {
    title: "Luxury Transportation & Chauffeur Services Kochi | Trip Connect",
    description:
      "Chauffeur-driven Mercedes-Benz, Audi, BMW, and Toyota Vellfire fleets for Kerala tours, Cochin Airport transfers, and VIP corporate travel.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Trip Connect Luxury Chauffeur Fleet Kochi",
      },
    ],
  },
};

interface FleetVehicle {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  image: string;
  startingPrice: string;
  capacityPax: number;
  capacityLuggage: number;
  bestFor: string;
  features: string[];
  description: string;
}

const FLEET: FleetVehicle[] = [
  {
    id: "mercedes-benz",
    name: "Mercedes-Benz E-Class & S-Class",
    brand: "Mercedes-Benz",
    tagline: "The Benchmark of Executive Opulence",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "₹6,500 / 8h transfer",
    capacityPax: 3,
    capacityLuggage: 3,
    bestFor: "VIP Arrivals, Wedding Entourages, Executive Corporate Stays & 5-Star Kerala Tours",
    features: [
      "Plush Nappa Leather Seating with Recline",
      "Panoramic Glass Sunroof",
      "Burmester 3D High-End Surround Sound",
      "Dual-Zone Independent Rear Climate Control",
      "Complimentary Chilled Water, Mints & Wi-Fi",
      "Impeccably Uniformed English-Speaking Chauffeur",
    ],
    description:
      "Glide smoothly between Cochin International Airport (COK), Kumarakom lakeside resorts, and luxury heritage hotels in Kochi. The Mercedes-Benz delivers whisper-quiet cabin acoustics and dignified road presence for esteemed guests.",
  },
  {
    id: "audi",
    name: "Audi A6 & Audi Q7 Luxury Matrix",
    brand: "Audi",
    tagline: "Dynamic German Engineering with Quattro Stability",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "₹6,000 / 8h transfer",
    capacityPax: 4,
    capacityLuggage: 4,
    bestFor: "Scenic Mountain Drives to Munnar & Wayanad, Luxury Couples, VIP Summits",
    features: [
      "Quattro Permanent All-Wheel Drive Poise",
      "Adaptive Air Suspension for Blemish-Free Rides",
      "Bang & Olufsen 3D Audiophile Acoustics",
      "Matrix LED Headlamps for Safe Highland Transit",
      "Expansive Legroom & Ambient Contour Lighting",
      "Onboard Mobile Fast-Charging Docks",
    ],
    description:
      "Combining understated German sophistication with high ground stance, the Audi fleet conquers winding Western Ghats hairpins to Munnar with effortless grace while cocooning passengers in bespoke leather luxury.",
  },
  {
    id: "bmw",
    name: "BMW 5-Series & 7-Series",
    brand: "BMW",
    tagline: "Unrivalled Refinement & Executive Lounger Comfort",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "₹6,500 / 8h transfer",
    capacityPax: 3,
    capacityLuggage: 3,
    bestFor: "Corporate Dignitaries, Luxury Airport Transfers, Honeymoon Couples",
    features: [
      "Executive Rear Reclining Lounge Seats",
      "Harman Kardon Multi-Channel Premium Audio",
      "Dynamic Damper Control for Carpet-Smooth Rides",
      "Ambient Air Scenting & Electric Sunblinds",
      "Generous Boot Space for International Baggage",
      "Professional Chauffeur with Flight Tracking",
    ],
    description:
      "Crafted for dignitaries and luxury travelers who demand supreme road poise. Every journey in our BMW fleet is synchronized with live flight schedules, ensuring zero waiting time at the airport terminal.",
  },
  {
    id: "toyota-vellfire",
    name: "Toyota Vellfire / Alphard VIP Lounge",
    brand: "Toyota Luxury MPV",
    tagline: "First-Class Private Jet Luxury on Four Wheels",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "₹14,000 / Day circuit",
    capacityPax: 6,
    capacityLuggage: 5,
    bestFor: "Ultra-HNI Families, VIP Dignitaries, State Delegations, Luxury Family Vacations",
    features: [
      "Heated & Ventilated Ottoman Captain Recliners",
      "Dual Panoramic Moonroofs",
      "16-Color Ambient Roof Illumination",
      "Private Fold-Out Work & Refreshment Desks",
      "Whisper-Quiet Hybrid Powertrain Acoustics",
      "Dedicated Chauffeur & Luggage Concierge",
    ],
    description:
      "The undisputed gold standard for luxury family transit. With motorized Ottoman captain seats that recline fully into lounge beds, the Vellfire turns long scenic stretches between Cochin, Alleppey, and Thekkady into a royal retreat.",
  },
  {
    id: "innova-hycross",
    name: "Toyota Innova HyCross & Crysta (Captain Seats)",
    brand: "Toyota Executive",
    tagline: "The Quintessential Kerala Touring Companion",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "₹3,800 / Day circuit",
    capacityPax: 6,
    capacityLuggage: 4,
    bestFor: "Family Tours, Multi-Day Kerala Circuits, Backwater & Wildlife Expeditions",
    features: [
      "Middle-Row Ergonomic Captain Armchairs",
      "High Ground Clearance for All Road Conditions",
      "Powerful Dual-Blower Climate Control AC",
      "Substantial Boot Space for Multiple Luggage Pieces",
      "Dependable, Smooth Hybrid / Diesel Suspension",
      "Courteous Native Chauffeur Guide",
    ],
    description:
      "The preferred choice for comprehensive Kerala itineraries. Offering reliable hill climbing power, commanding panoramic window views, and unmatched dependability across Munnar tea slopes, Periyar forests, and Marari beaches.",
  },
  {
    id: "force-urbania",
    name: "Force Urbania & Mercedes Sprinter VIP Coach",
    brand: "Executive Group Coach",
    tagline: "Next-Gen European Luxury Group Travel",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "₹7,500 / Day circuit",
    capacityPax: 17,
    capacityLuggage: 15,
    bestFor: "Destination Wedding Guests, Corporate Retreats, Extended Family Reunions",
    features: [
      "Wide Panoramic Touring Windows with Curtains",
      "Reclining High-Back Bucket Seats with Armrests",
      "Individual AC Vents & USB Chargers for Every Seat",
      "Generous Standing Room & Wide Central Walkway",
      "High-Deck Large Dedicated Luggage Bay",
      "Microphone & PA Audio System for Guided Tours",
    ],
    description:
      "No more cramped tourist vans. The Urbania delivers modern European ride quality, supreme suspension cushioning, and ample space for wedding parties and corporate delegations journeying between luxury venues across Kerala.",
  },
];

export default function TransportationPage() {
  const generalWhatsAppUrl = buildWhatsAppChatUrl({
    customMessage:
      "Hello Trip Connect Concierge, I would like to enquire about your Luxury Chauffeur & Transportation fleet in Kerala.",
  });

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[16px]">local_taxi</span>
              Bespoke Chauffeur Fleet • Kochi &amp; Kerala
            </div>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight mb-5">
              Luxury Transportation &amp; Private Chauffeur Fleet
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
              Journey across God&apos;s Own Country in peerless refinement. From Mercedes-Benz and Audi luxury sedans to Toyota Vellfire VIP lounges and executive touring coaches, every vehicle is piloted by vetted, courteous native chauffeurs.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#reserve-car"
                className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-sm font-semibold shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>Reserve a Luxury Car</span>
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </a>
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-sm font-semibold transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-600">chat</span>
                <span>Chat with Chauffeur Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Fleet Showcase Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/30">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Curated Executive &amp; Luxury Fleet
              </h2>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Sanitized before every dispatch, insured, and verified with Kerala Tourism standards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {FLEET.map((car) => {
              const carWhatsApp = buildWhatsAppChatUrl({
                customMessage: `Hello Trip Connect, I would like to book the ${car.name} for my Kerala itinerary.`,
              });

              return (
                <div
                  key={car.id}
                  className="group bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Vehicle Image Banner */}
                    <div className="relative h-64 md:h-72 w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-label-sm text-xs font-semibold uppercase tracking-wider border border-white/20">
                          {car.brand}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <p className="text-white/80 text-xs font-medium tracking-wide uppercase">
                            {car.tagline}
                          </p>
                          <h3 className="text-white font-headline-md text-xl md:text-2xl font-bold tracking-tight">
                            {car.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="p-6 md:p-8 space-y-6">
                      {/* Specs Row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant pb-4 border-b border-outline-variant/20">
                        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg">
                          <span className="material-symbols-outlined text-[16px] text-primary">group</span>
                          <span>{car.capacityPax} Guests</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg">
                          <span className="material-symbols-outlined text-[16px] text-primary">luggage</span>
                          <span>{car.capacityLuggage} Bags</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg">
                          <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
                          <span>{car.startingPrice}</span>
                        </div>
                      </div>

                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {car.description}
                      </p>

                      {/* Best For Tag */}
                      <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/20 text-xs">
                        <span className="font-semibold text-primary block mb-0.5">Recommended For:</span>
                        <span className="text-on-surface-variant">{car.bestFor}</span>
                      </div>

                      {/* Features List */}
                      <div>
                        <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wider mb-3">
                          Signature Onboard Amenities:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
                          {car.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 md:p-8 pt-0 flex flex-wrap items-center gap-3">
                    <a
                      href="#reserve-car"
                      className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-label-md text-sm font-semibold text-center shadow-md transition-all active:scale-95"
                    >
                      Book This Vehicle
                    </a>
                    <a
                      href={carWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-sm font-semibold shadow-md transition-all inline-flex items-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Trip Connect Chauffeurs Standard */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
          <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/30">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase font-semibold text-primary tracking-widest block mb-2">
                Executive Reliability
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                The Trip Connect Chauffeur Standard
              </h2>
              <p className="font-body-md text-on-surface-variant mt-2">
                We believe your journey between Kerala&apos;s destinations should be as memorable and peaceful as the destinations themselves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">shield_person</span>
                </div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Vetted Native Chauffeurs
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Police background-verified, discreet, professionally attired, and fluent in English, Malayalam, and Hindi.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">flight_land</span>
                </div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Flight Tracking &amp; Placard
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Real-time arrival tracking with 60-minute complimentary waiting time and personalized terminal placard reception.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  All-Inclusive Transparent Pricing
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Fuel, state road permits, highway tolls, parking charges, and driver allowances are fully accounted for without surprise extras.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">sanitizer</span>
                </div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Sanitized &amp; Equipped
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Complete cabin sanitation before every journey, fresh bottled water, tissue packs, hand sanitizers, and high-speed Wi-Fi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Anchor */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <TransportationBookingForm />
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
