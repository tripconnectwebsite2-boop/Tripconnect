"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface TripConnectLogoLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
}

export default function TripConnectLogoLoader({
  className = "",
  size = "md",
}: TripConnectLogoLoaderProps) {
  const [progress, setProgress] = useState(24);
  const [imgSrc, setImgSrc] = useState("/images/tripconnect-logo.png");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 10 + 6));
      });
    }, 110);

    return () => clearInterval(timer);
  }, []);

  const dimensions = {
    sm: { container: "w-64", logoBox: "w-28 h-28", logoSize: 96, ring: "w-36 h-36" },
    md: { container: "w-80", logoBox: "w-36 h-36", logoSize: 120, ring: "w-48 h-48" },
    lg: { container: "w-96", logoBox: "w-44 h-44", logoSize: 150, ring: "w-56 h-56" },
    fullscreen: { container: "w-80 sm:w-96", logoBox: "w-36 h-36 sm:w-44 sm:h-44", logoSize: 140, ring: "w-48 h-48 sm:w-56 sm:h-56" },
  }[size];

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 select-none ${className}`}
      aria-label="Trip Connect Kochi is loading"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tcSpinClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes tcSpinCounter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes tcLogoPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 16px rgba(0, 97, 147, 0.25)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 8px 24px rgba(217, 119, 6, 0.35)); }
        }
        @keyframes tcShimmerFlow {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(240%); }
        }
        .tc-ring-clockwise {
          animation: tcSpinClockwise 12s linear infinite;
        }
        .tc-ring-counter {
          animation: tcSpinCounter 8s linear infinite;
        }
        .tc-logo-glow {
          animation: tcLogoPulse 2.4s ease-in-out infinite;
        }
        .tc-shimmer {
          animation: tcShimmerFlow 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />

      {/* Ambient background aura glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-sky-400/25 via-primary/20 to-amber-400/25 blur-3xl pointer-events-none" />

      {/* Orbital Ring & Logo Centerpiece */}
      <div className={`relative ${dimensions.ring} flex items-center justify-center mb-6`}>
        {/* Outer Celestial Orbital Ring (Ocean Blue) */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/35 border-dashed tc-ring-clockwise" />

        {/* Middle Royal Gold Orbital Ring with Golden Satellite Jewel */}
        <div className="absolute inset-2.5 rounded-full border border-amber-500/50 tc-ring-counter">
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.95)]" />
        </div>

        {/* Inner Pulsing Radar Halo */}
        <div className="absolute inset-5 rounded-full border border-sky-400/30 animate-ping opacity-25" />

        {/* Crisp Brand Logo Container with High-Contrast Background Badge */}
        <div className={`relative z-10 ${dimensions.logoBox} rounded-full bg-white/95 dark:bg-white/95 p-3.5 shadow-[0_8px_30px_rgba(0,97,147,0.22)] border border-slate-100 flex items-center justify-center tc-logo-glow`}>
          <Image
            src={imgSrc}
            alt="Trip Connect Kochi"
            width={dimensions.logoSize}
            height={dimensions.logoSize}
            priority
            unoptimized
            className="w-full h-full object-contain"
            onError={() => {
              // Remote fallback if local fails
              setImgSrc("https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ");
            }}
          />
        </div>
      </div>

      {/* Brand Identity Label */}
      <div className="flex flex-col items-center space-y-1.5 text-center z-10">
        <h2 className="font-sans text-base sm:text-lg font-extrabold uppercase tracking-[0.34em] text-slate-900 dark:text-white drop-shadow-sm">
          Trip Connect
        </h2>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary dark:text-sky-400">
          Bespoke Journeys • Kochi
        </p>
      </div>

      {/* Shimmering Journey Rail Indicator */}
      <div className="w-48 sm:w-56 h-[4px] mt-5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary via-sky-500 to-amber-500 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-y-0 w-2/3 bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full tc-shimmer" />
      </div>

      {/* Live percentage & status */}
      <div className="mt-3 flex flex-col items-center space-y-1 z-10">
        <span className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wider">
          {progress}%
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-slate-500 dark:text-slate-400 animate-pulse">
          Crafting your journey...
        </span>
      </div>
    </div>
  );
}
