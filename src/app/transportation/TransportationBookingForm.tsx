"use client";

import { useState, useEffect, useMemo } from "react";
import { buildWhatsAppChatUrl } from "@/lib/notifications/whatsapp";
import { TransportationVehicle } from "@/lib/types";

interface TransportationBookingFormProps {
  vehicles?: TransportationVehicle[];
  initialVehicleName?: string;
  defaultCategory?: "normal" | "premium" | "bus";
}

const DEFAULT_CARS = [
  // Normal
  { name: "Maruti Suzuki Dzire (Compact AC Sedan)", category: "normal" },
  { name: "Toyota Etios / Glanza (Economy Sedan)", category: "normal" },
  { name: "Maruti Suzuki Swift / Hyundai Aura (Compact City Car)", category: "normal" },
  { name: "Maruti Suzuki Ertiga (Compact 6-Seater MPV)", category: "normal" },
  // Premium
  { name: "Mercedes-Benz E-Class / S-Class (VIP Luxury)", category: "premium" },
  { name: "Audi A6 / Q7 Luxury Matrix (German Quattro)", category: "premium" },
  { name: "BMW 5-Series / 7-Series (Executive Lounge)", category: "premium" },
  { name: "Toyota Vellfire VIP Lounge MPV (Private Jet Comfort)", category: "premium" },
  { name: "Toyota Innova HyCross VIP (Captain Seats Hybrid)", category: "premium" },
  // Bus
  { name: "Volvo 9600 Multi-Axle AC Sleeper (Interstate Flagship)", category: "bus" },
  { name: "BharatBenz AC Luxury Sleeper & Semi-Sleeper Coach", category: "bus" },
  { name: "Luxury 35 - 49 Seater Air Suspension Tourist Coach", category: "bus" },
  { name: "Force Urbania 12/17-Seater VIP Coach", category: "bus" },
];

const SERVICE_TYPES = [
  "Local City Sightseeing & Hourly Rental (8h / 80km)",
  "Airport Transfer (Cochin COK / Trivandrum TRV / Calicut)",
  "Multi-Day Kerala Tour (Munnar, Alleppey, Thekkady, Wayanad)",
  "Interstate Highway Journey (Bangalore, Chennai, Coimbatore)",
  "All-India Bus Tour Charter / Group Pilgrimage Yatra",
  "VIP Corporate Delegation / Wedding Luxury Fleet",
];

export default function TransportationBookingForm({
  vehicles,
  initialVehicleName,
  defaultCategory = "normal",
}: TransportationBookingFormProps) {
  // If vehicles prop is passed, use it, otherwise use DEFAULT_CARS
  const carOptions = useMemo(() => {
    return vehicles && vehicles.length > 0
      ? vehicles.map((v) => ({ name: `${v.name} (${v.subtitle || v.starting_price})`, rawName: v.name, category: v.category }))
      : DEFAULT_CARS.map((c) => ({ name: c.name, rawName: c.name, category: c.category }));
  }, [vehicles]);

  const defaultCar = initialVehicleName
    ? carOptions.find((c) => c.rawName.toLowerCase().includes(initialVehicleName.toLowerCase()))?.name || carOptions[0].name
    : carOptions.find((c) => c.category === defaultCategory)?.name || carOptions[0].name;

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<"all" | "normal" | "premium" | "bus">(
    defaultCategory
  );
  const [selectedCar, setSelectedCar] = useState(defaultCar);
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

  // Sync initial selection
  useEffect(() => {
    if (initialVehicleName) {
      const match = carOptions.find((c) =>
        c.rawName.toLowerCase().includes(initialVehicleName.toLowerCase())
      );
      if (match) {
        setSelectedCar(match.name);
        setSelectedCategoryTab(match.category as any);
      }
    }
  }, [initialVehicleName, carOptions]);

  const filteredOptions = selectedCategoryTab === "all"
    ? carOptions
    : carOptions.filter((c) => c.category === selectedCategoryTab);

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
          package_title: `Vehicle Booking: ${selectedCar}`,
          preferred_destination: `${pickupLocation || "Kochi"} -> ${destination || "Kerala/All-India Tour"}`,
          travel_date: travelDate || undefined,
          traveller_count: Number(pax) || 2,
          additional_requirements: `Vehicle: ${selectedCar}\nService: ${serviceType}\nCategory: ${selectedCategoryTab}\nPickup: ${pickupLocation}\nDrop: ${destination}\nPassengers: ${pax}\nNotes: ${notes}`,
          source_page: "/transportation",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit reservation.");
      }

      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while reserving. Please connect directly via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const whatsAppUrl = buildWhatsAppChatUrl({
    customMessage: `Hello Trip Connect, I would like to book transportation:\n• Category: ${selectedCategoryTab.toUpperCase()}\n• Vehicle / Bus: ${selectedCar}\n• Service: ${serviceType}\n• Pickup Location: ${pickupLocation || "Kochi"}\n• Destination / Route: ${destination || "Tour Circuit"}\n• Travel Date: ${travelDate || "Upcoming"}\n• Passengers: ${pax}\n• Name: ${customerName || "Guest"}\n• Contact: ${phone || "Mobile"}`,
  });

  return (
    <div id="reserve-car" className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-10 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-outline-variant/20">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            Online Transportation &amp; Bus Booking
          </span>
          <h2 className="font-headline-md md:font-headline-lg text-headline-md text-on-surface font-bold tracking-tight">
            Reserve Your Car, Luxury Chauffeur or All-India Bus
          </h2>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Uniformed verified drivers, all-inclusive transparent pricing, and 24/7 WhatsApp assistance.
          </p>
        </div>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-sm font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          Instant WhatsApp Booking
        </a>
      </div>

      {success ? (
        <div className="py-12 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner">
            ✓
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Booking Enquiry Received!
          </h3>
          <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
            Our transportation concierge has received your request for <strong>{selectedCar}</strong>. We will confirm vehicle availability and driver details on WhatsApp or phone call within 15 minutes.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-sm font-semibold shadow-md inline-flex items-center gap-2"
            >
              <span>Confirm on WhatsApp Immediately</span>
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

          {/* Category Filter Pills */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Select Fleet Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryTab("normal");
                  const match = carOptions.find((c) => c.category === "normal");
                  if (match) setSelectedCar(match.name);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategoryTab === "normal"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                Standard &amp; City Cabs
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryTab("premium");
                  const match = carOptions.find((c) => c.category === "premium");
                  if (match) setSelectedCar(match.name);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategoryTab === "premium"
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                Premium Segment (Benz, Audi, BMW)
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryTab("bus");
                  const match = carOptions.find((c) => c.category === "bus");
                  if (match) setSelectedCar(match.name);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategoryTab === "bus"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                Interstate &amp; All-India Buses
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategoryTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategoryTab === "all"
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                }`}
              >
                All Vehicles
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Preferred Vehicle */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Choose Vehicle or Bus Model *
              </label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-medium"
              >
                {filteredOptions.map((car) => (
                  <option key={car.name} value={car.name}>
                    {car.name}
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
                Pickup Point / Origin City *
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Cochin Airport, Ernakulam, Bangalore, Chennai, Trivandrum"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Destination / Drop Point */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Destination / Drop Location / Route *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Munnar, Bangalore, Chennai, Goa, Pan-India Tour Circuit"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Journey Date
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
                Number of Passengers / Berths
              </label>
              <input
                type="text"
                value={pax}
                onChange={(e) => setPax(e.target.value)}
                placeholder="e.g. 2, 4, 12, or 35"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Guest Name */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94008 86838"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Specific Requirements / Bus Route Details
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Flight number for airport pickup, AC sleeper berth preference, return trip required, child safety seat, etc."
              className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-on-surface-variant/50 resize-y"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
              <span>No advance booking fees required. Pay after vehicle allocation.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-full border border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-label-md text-sm font-semibold transition-all"
              >
                Enquire via WhatsApp
              </a>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-sm font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
