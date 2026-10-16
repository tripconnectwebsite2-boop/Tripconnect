"use client";

import { useEffect, useState } from "react";
import TripConnectLogoLoader from "./TripConnectLogoLoader";

export default function SitePreloader() {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show once per session or on first visit to keep navigation snappy
    const hasSeen = sessionStorage.getItem("tc_initial_loader_seen");
    if (hasSeen) {
      setShow(false);
      return;
    }

    // Play the full stroke draw animation (approx 2.4s) then smoothly fade out
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2400);

    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("tc_initial_loader_seen", "true");
    }, 2900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-surface transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <TripConnectLogoLoader size="fullscreen" />
    </div>
  );
}
