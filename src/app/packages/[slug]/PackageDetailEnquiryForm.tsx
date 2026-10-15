"use client";

import { useState } from "react";
import { buildWhatsAppChatUrl } from "@/lib/notifications/whatsapp";

export default function PackageDetailEnquiryForm({
  packageId,
  packageTitle,
  destination,
}: {
  packageId: string;
  packageTitle: string;
  destination?: string;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travellerCount, setTravellerCount] = useState(2);
  const [requirements, setRequirements] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          email,
          package_id: packageId,
          package_title: packageTitle,
          preferred_destination: destination,
          travel_date: travelDate,
          traveller_count: travellerCount,
          additional_requirements: requirements,
          marketing_consent: marketingConsent,
          source_page: `/packages/${packageTitle}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit enquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setIsSubmitting(false);
    } catch {
      setErrorMessage("Network error. Please try again or chat with us on WhatsApp.");
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = buildWhatsAppChatUrl({ packageTitle });

  return (
    <div className="rounded-3xl bg-surface-container-low p-8 lg:p-12 border border-outline-variant/30">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-semibold uppercase tracking-wider">
            Direct Concierge Enquiry
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
            Request a Custom Quote for {packageTitle}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
            Our Kochi travel planners will verify seasonal resort rates, vehicle logistics, and tailor the schedule to your exact party size within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-secondary/30 text-center space-y-4 shadow-md">
            <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Enquiry Received Successfully!
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              Thank you, <strong>{customerName}</strong>! Our travel concierge will prepare a customized day-by-day plan and connect with you via WhatsApp or Email.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold text-xs shadow-sm hover:bg-on-secondary-container"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Need an immediate reply? Chat with us now</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-5 text-xs">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Hidden Bot Trap */}
            <input type="text" name="bot_trap" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-on-surface block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-on-surface block mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="font-semibold text-on-surface block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-semibold text-on-surface block mb-1">Travellers *</label>
                <select
                  value={travellerCount}
                  onChange={(e) => setTravellerCount(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>1 Person (Solo)</option>
                  <option value={2}>2 Adults (Couple)</option>
                  <option value={3}>3 Persons</option>
                  <option value={4}>4 Persons (Family)</option>
                  <option value={6}>5-8 Persons (Group)</option>
                  <option value={10}>9+ Persons</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">Tentative Travel Date / Month</label>
              <input
                type="text"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                placeholder="e.g. November 2026 or 15 Dec 2026"
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-semibold text-on-surface block mb-1">Specific Preferences / Questions</label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Mention meal preferences, senior citizen accommodation requests, extra activities, or custom pickup locations..."
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Privacy & Marketing Consent */}
            <div className="space-y-2 pt-2 border-t border-outline-variant/20 text-[11px] text-outline">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary shrink-0 mt-0.5"
                />
                <span>
                  (Optional) Keep me informed of seasonal Kerala backwater retreats and limited promotional offers via WhatsApp / Email.
                </span>
              </label>

              <p className="leading-relaxed">
                By submitting this form, you acknowledge that enquiries are handled in accordance with our{" "}
                <a href="/privacy-policy" target="_blank" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . Package estimates do not constitute confirmed reservations.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-shimmer active:scale-[0.98] disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Send Enquiry to Concierge</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
