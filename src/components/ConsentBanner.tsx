"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("tc_privacy_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("tc_privacy_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("tc_privacy_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and cookies"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 md:left-6 md:max-w-md z-50 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl space-y-3 animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">
          cookie
        </span>
        <div className="space-y-1">
          <h2 className="font-semibold text-xs text-on-surface">Your Privacy &amp; Consent</h2>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Trip Connect uses essential session controls to power your enquiry experience. We never sell personal information. Read our{" "}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={handleDecline}
          className="px-3.5 py-2 rounded-lg text-xs font-medium text-outline hover:text-on-surface min-h-[44px] touch-manipulation"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-sm min-h-[44px] touch-manipulation active:scale-95"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
}
