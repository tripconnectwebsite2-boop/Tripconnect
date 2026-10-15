"use client";

import { useState } from "react";
import { TravelPackage } from "@/lib/types";

export default function ContactFormClient({
  packages,
  preselectedPackage,
  preselectedDestination,
  preselectedOffer,
}: {
  packages: TravelPackage[];
  preselectedPackage?: string;
  preselectedDestination?: string;
  preselectedOffer?: string;
}) {
  const matchedPkg = packages.find((p) => p.slug === preselectedPackage);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(matchedPkg?.id || "");
  const [customDestination, setCustomDestination] = useState(preselectedDestination || "");
  const [travelDate, setTravelDate] = useState("");
  const [travellerCount, setTravellerCount] = useState(2);
  const [requirements, setRequirements] = useState(
    preselectedOffer ? `Inquiring about offer: ${preselectedOffer}` : ""
  );
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const selectedPkgObj = packages.find((p) => p.id === selectedPackageId);

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          email,
          package_id: selectedPackageId || null,
          package_title: selectedPkgObj?.title || null,
          preferred_destination: customDestination || selectedPkgObj?.destination_name || null,
          travel_date: travelDate,
          traveller_count: travellerCount,
          additional_requirements: requirements,
          marketing_consent: marketingConsent,
          source_page: "/contact",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Submission failed. Please check the fields and try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setIsSubmitting(false);
    } catch {
      setErrorMessage("Network error connecting to concierge desk. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl space-y-6">
      <div>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
          Submit Your Travel Enquiry
        </h2>
        <p className="text-xs text-outline mt-1">
          No automated robots. A native Kochi travel specialist will inspect your request and reply personally.
        </p>
      </div>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
          </div>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            Thank You, {customerName}!
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Your travel enquiry has been saved into our operations system. Our concierge team will review availability and connect with you on WhatsApp or phone within 24 hours.
          </p>
          <div className="pt-4">
            <a
              href="https://wa.me/919400886838"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-secondary text-white font-semibold text-xs inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Need immediate assistance? Chat with us on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-error-container text-on-error-container text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Hidden Bot Trap */}
          <input type="text" name="bot_trap" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anand Varma"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 94008 86838"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anand@example.com"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Travellers *</label>
              <select
                value={travellerCount}
                onChange={(e) => setTravellerCount(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={1}>1 Person</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Persons</option>
                <option value={4}>4 Persons</option>
                <option value={6}>5-8 Persons</option>
                <option value={10}>9+ Persons</option>
              </select>
            </div>
          </div>

          {/* Package or Destination Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Preferred Package (Optional)</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Custom Itinerary / Not Sure</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.duration_days}D/{p.duration_nights}N)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Preferred Destination / Month</label>
              <input
                type="text"
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="e.g. Munnar + Alleppey in December"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Additional Requirements / Travel Style</label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Tell us about special occasions (Honeymoon, Anniversary), room preferences (Treehouse, Private Pool, Houseboat Jacuzzi), dietary needs, or budget expectations..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Marketing & Privacy Consent */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/20 text-[11px] text-outline">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary shrink-0 mt-0.5"
              />
              <span>
                (Optional) Receive occasional updates regarding seasonal discounts and new curated Kerala routes via WhatsApp or email.
              </span>
            </label>
            <p>
              Trip Connect respects your privacy. Submitted information is used strictly to prepare your travel itinerary and will never be sold or used for spam. See our{" "}
              <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-shimmer active:scale-[0.98] disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Submitting Your Enquiry...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Submit Travel Enquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
