"use client";

import { useState } from "react";

export default function PlanTripForm() {
  const [destination, setDestination] = useState("kerala-grand");
  const [travelers, setTravelers] = useState("2");
  const [dates, setDates] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section className="w-full py-24 px-6 lg:px-12 max-w-7xl mx-auto" id="plan-trip">
      <div className="rounded-3xl bg-surface-container-low p-8 lg:p-16 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & WhatsApp Anchor */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              Direct Concierge Desk
            </div>

            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
              Let’s Plan Your Next Journey.
            </h2>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Share your dream destination, tentative dates, and travel style. Our Kochi team will curate a personalized itinerary within 24 hours.
            </p>

            <div className="pt-4 space-y-3">
              <a
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md font-semibold shadow-md transition-all active:scale-[0.98]"
                href="https://wa.me/919400886838"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[24px]">chat</span>
                <span>Chat on WhatsApp (+91 9400886838)</span>
              </a>
              <p className="font-body-sm text-body-sm text-outline">
                Typical response time: Under 15 minutes during daylight hours.
              </p>
            </div>
          </div>

          {/* Right Column: Mini Interactive Enquiry Kickstarter */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-2xl shadow-md border border-outline-variant/20">
              <form className="space-y-5" onSubmit={handleSubmit}>
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
                      <option value="kerala-grand">Kerala Grand Highlights (Munnar, Alleppey, Kochi)</option>
                      <option value="alleppey-houseboat">Alleppey Backwater &amp; Houseboat Private Cruise</option>
                      <option value="munnar-wayanad">Highland Hills (Munnar &amp; Wayanad)</option>
                      <option value="golden-triangle">Golden Triangle (Delhi, Agra, Jaipur)</option>
                      <option value="kashmir-valleys">Kashmir &amp; Dal Lake Retreat</option>
                      <option value="custom">Other / Custom Pan-India Circuit</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3.5 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Two-Column Fields: Travelers & Month */}
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
                      <option value="3-4">Small Family (3 - 4 Pax)</option>
                      <option value="5-8">Family &amp; Friends Group (5 - 8 Pax)</option>
                      <option value="solo">Solo Traveler</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface" htmlFor="travel-dates">
                      Tentative Travel Month
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors border border-outline-variant/30"
                      id="travel-dates"
                      placeholder="e.g. November 2026"
                      type="text"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contact Input */}
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="contact-input">
                    Your Phone / WhatsApp Number
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors border border-outline-variant/30"
                    id="contact-input"
                    placeholder="+91 98765 43210"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="w-full py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-shimmer active:scale-[0.98] disabled:opacity-75"
                  id="submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      <span>Start Your Enquiry</span>
                    </>
                  )}
                </button>

                {submitted && (
                  <div className="p-3 rounded-lg bg-secondary-container text-on-secondary-container font-body-sm text-body-sm text-center reveal-fade-in font-medium">
                    ✓ Thank you! Our Kochi travel concierge will connect with you via WhatsApp within 24 hours.
                  </div>
                )}

                <p className="font-body-sm text-body-sm text-outline text-center">
                  Strict privacy guarantee. No spam or unsolicited calls.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
