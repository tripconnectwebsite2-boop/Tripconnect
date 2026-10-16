"use client";

import { useState } from "react";
import { buildWhatsAppChatUrl } from "@/lib/notifications/whatsapp";

interface TransportationBookingFormProps {
  initialCar?: string;
}

const CAR_OPTIONS = [
  "Mercedes-Benz E-Class / S-Class",
  "Audi A6 / Q7 Luxury Matrix",
  "BMW 5-Series / 7-Series",
  "Toyota Vellfire VIP Lounge MPV",
  "Toyota Innova HyCross / Crysta (Captain Seats)",
  "Force Urbania VIP Mini Coach (12-17 Seats)",
];

const SERVICE_TYPES = [
  "Airport Transfer (Cochin COK / Trivandrum TRV)",
  "Multi-Day Kerala Tour (Munnar, Alleppey, Kumarakom)",
  "Full-Day City Chauffeur (8h / 80km)",
  "VIP Corporate Delegation / Summit",
  "Luxury Destination Wedding Fleet",
];

export default function TransportationBookingForm({ initialCar }: TransportationBookingFormProps) {
  const [selectedCar, setSelectedCar] = useState(initialCar || CAR_OPTIONS[0]);
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [pax, setPax] = useState("2");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg("Please provide your name and contact phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || `${phone.replace(/[^0-9]/g, "") || "guest"}@tripconnect.in`,
          package_title: `Chauffeur: ${selectedCar} (${serviceType})`,
          preferred_destination: `${pickupLocation || "Kochi"} -> ${destination || "Kerala Tour"}`,
          travel_date: travelDate || undefined,
          traveller_count: Number(pax) || 2,
          additional_requirements: `Vehicle: ${selectedCar}\nService: ${serviceType}\nPickup: ${pickupLocation}\nDrop: ${destination}\nNotes: ${notes}`,
          source_page: "/transportation",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit reservation.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while reserving. Please try via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const whatsAppUrl = buildWhatsAppChatUrl({
    customMessage: `Hello Trip Connect Concierge, I would like to reserve luxury transportation:\n• Vehicle: ${selectedCar}\n• Service: ${serviceType}\n• Pickup: ${pickupLocation || "Cochin Airport"}\n• Destination: ${destination || "Kerala Tour"}\n• Date: ${travelDate || "Upcoming"}\n• Guests: ${pax}\n• Name: ${customerName || "Guest"}`,
  });

  return (
    <div id="reserve-car" className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-10 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-outline-variant/20">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            VIP Chauffeur Reservation
          </span>
          <h2 className="font-headline-md md:font-headline-lg text-headline-md text-on-surface font-bold tracking-tight">
            Reserve Your Luxury Chauffeur
          </h2>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Uniformed native chauffeurs, all-inclusive transparent rates, and sanitized fleet.
          </p>
        </div>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-sm font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          Instant WhatsApp Dispatch
        </a>
      </div>

      {success ? (
        <div className="py-12 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            ✓
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Reservation Request Received
          </h3>
          <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
            Our transportation concierge has received your request for <strong>{selectedCar}</strong>. We will confirm availability and vehicle allocation on WhatsApp/call within 15 minutes.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-sm font-semibold shadow-md inline-flex items-center gap-2"
            >
              <span>Connect with Assigned Chauffeur on WhatsApp</span>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setNotes("");
              }}
              className="px-5 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm font-semibold"
            >
              Book Another Vehicle
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Preferred Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Select Luxury Vehicle *
              </label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-medium"
              >
                {CAR_OPTIONS.map((car) => (
                  <option key={car} value={car}>
                    {car}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Service Itinerary Type *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-medium"
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Pickup Point / Airport *
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Cochin Airport (COK), Grand Hyatt Kochi, or Residence"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Destination / Drop Point */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Drop Location / Tour Circuit *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Munnar, Kumarakom, Alleppey, or City Tour"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Pickup Date &amp; Time
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Passenger Count */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Number of Passengers
              </label>
              <select
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 17].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Pillai"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Mobile Number (with WhatsApp) *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98470 12345"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          {/* Email and Special Requirements */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Special Requests (Child Seat, Airport Nameboard, Flight Number)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Flight 6E-1402 landing at Cochin 11:30 AM. Need airport placard signage and bottled water."
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
              <span>100% Confidential • Professional Chauffeurs • Fixed Pricing Guarantee</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-sm font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Confirming Chauffeur Allocation...</span>
                </>
              ) : (
                <>
                  <span>Request Luxury Chauffeur</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
