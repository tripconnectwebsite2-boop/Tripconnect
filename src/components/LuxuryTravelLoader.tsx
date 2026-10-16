"use client";

import TripConnectLogoLoader from "./TripConnectLogoLoader";

export default function LuxuryTravelLoader({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
}) {
  return <TripConnectLogoLoader className={className} size={size} />;
}
