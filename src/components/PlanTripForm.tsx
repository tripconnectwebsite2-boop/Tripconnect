"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { APPLE_EASE } from "@/lib/animation";

export default function PlanTripForm() {
  const [destination, setDestination] = useState("Kerala Grand Highlights (Munnar, Alleppey, Kochi)");
  const [travelers, setTravelers] = useState("2");
  const [dates, setDates] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim() || "Guest Explorer",
          phone: phone.trim(),
          email: email.trim() || `${phone.replace(/[^0-9]/g, "") || "guest"}@tripconnect.in`,
          preferred_destination: destination,
          traveller_count: parseInt(travelers, 10) || 2,
          travel_date: dates.trim() || null,
          additional_requirements: `Quick enquiry from homepage: ${destination}`,
          source_page: "/",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit enquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit. Please chat with us on WhatsApp.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-24 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden" id="plan-trip">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className="rounded-3xl bg-surface-container-low p-8 lg:p-16 shadow-sm border border-outline-variant/15"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & WhatsApp Anchor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold shadow-sm">
              Direct Concierge Desk
            </div>

            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
              Let’s Plan Your Next Journey.
            </h2>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Share your dream destination, tentative dates, and travel style. Our Kochi team will curate a personalized itinerary within 24 hours.
            </p>

            <div className="pt-4 space-y-3">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md font-semibold shadow-md transition-all active:scale-[0.98]"
                href="https://wa.me/919400886838"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[24px]">chat</span>
                <span>Chat on WhatsApp (+91 9400886838)</span>
              </motion.a>
              <p className="font-body-sm text-body-sm text-outline">
                Typical response time: Under 15 minutes during daylight hours.
              </p>
            </div>
          </div>

          {/* Right Column: Mini Interactive Enquiry Kickstarter */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-2xl shadow-xl border border-outline-variant/20">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-error-container text-on-error-container text-sm">
                    {errorMsg}
                  </div>
                )}

                {/* Destination Selector */}
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="dest-select">
                    Preferred Destination / Circuit
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer transition-colors border border-outline-variant/30"
                      id="dest-select"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option value="Kerala Grand Highlights (Munnar, Alleppey, Kochi)">Kerala Grand Highlights (Munnar, Alleppey, Kochi)</option>
                      <option value="Alleppey Backwater & Houseboat Private Cruise">Alleppey Backwater &amp; Houseboat Private Cruise</option>
                      <option value="Highland Hills (Munnar & Wayanad)">Highland Hills (Munnar &amp; Wayanad)</option>
                      <option value="Golden Triangle (Delhi, Agra, Jaipur)">Golden Triangle (Delhi, Agra, Jaipur)</option>
                      <option value="Kashmir & Dal Lake Retreat">Kashmir &amp; Dal Lake Retreat</option>
                      <option value="Custom Pan-India Circuit">Other / Custom Pan-India Circuit</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3.5 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Two-Column Fields: Travelers & Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="traveler-count">
                      Travelers
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors border border-outline-variant/30"
                      id="traveler-count"
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                    >
                      <option value="2">2 Adults (Couple / Honeymoon)</option>
                      <option value="3">Small Family (3 Pax)</option>
                      <option value="4">Family (4 Pax)</option>
                      <option value="6">Group (5 - 8 Pax)</option>
                      <option value="1">Solo Traveler (1 Pax)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="travel-dates">
                      Tentative Travel Date
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors border border-outline-variant/30"
                      id="travel-dates"
                      placeholder="e.g. 15 November 2026"
                      type="text"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                    />
                  </div>
                </div>

                {/* Name & Contact Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="name-input">
                      Your Name
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors border border-outline-variant/30"
                      id="name-input"
                      placeholder="e.g. Arun Menon"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="contact-input">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors border border-outline-variant/30"
                      id="contact-input"
                      placeholder="+91 94008 86838"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-shimmer active:scale-[0.98] disabled:opacity-75"
                  id="submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span>Submitting to Kochi Concierge...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>Start Your Enquiry</span>
                    </>
                  )}
                </motion.button>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-secondary-container text-on-secondary-container font-body-sm text-body-sm text-center font-medium shadow-sm"
                  >
                    ✓ Thank you! Your enquiry has been received. Our Kochi travel concierge will connect with you via WhatsApp within 24 hours.
                  </motion.div>
                )}

                <p className="font-body-sm text-body-sm text-outline text-center">
                  Strict privacy guarantee. No spam or unsolicited calls.
                </p>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
