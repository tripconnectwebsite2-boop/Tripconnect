import React from "react";

interface LuxuryTravelLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function LuxuryTravelLoader({
  className = "",
  size = "md",
}: LuxuryTravelLoaderProps) {
  const scaleClass = {
    sm: "scale-85",
    md: "scale-100",
    lg: "scale-110",
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 select-none ${scaleClass} ${className}`}
      aria-label="Trip Connect Luxury Travel loading"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes tcOrbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tcOrbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes tcShimmerSlide {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(250%); }
        }
        @keyframes tcPulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .tc-orbit-clockwise {
          animation: tcOrbitSpin 14s linear infinite;
        }
        .tc-orbit-counter {
          animation: tcOrbitReverse 9s linear infinite;
        }
        .tc-shimmer-bar {
          animation: tcShimmerSlide 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .tc-center-beacon {
          animation: tcPulseGlow 2.4s ease-in-out infinite;
        }
      `}} />

      {/* Ambient background glow aura */}
      <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-primary/20 via-sky-500/10 to-amber-500/15 blur-3xl pointer-events-none" />

      {/* Luxury Celestial Astrolabe / Navigator Compass */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-6">
        {/* Outer Orbital Celestial Ring (Ocean Blue) */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/25 border-dashed tc-orbit-clockwise" />

        {/* Middle Golden Orbit Ring with satellite jewel */}
        <div className="absolute inset-2 rounded-full border border-amber-500/40 tc-orbit-counter">
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
        </div>

        {/* Inner Subtle Pulsing Halo */}
        <div className="absolute inset-4 rounded-full border border-sky-400/30 animate-ping opacity-20" />

        {/* Centerpiece: Precision 8-Point Luxury Voyager Star */}
        <div className="relative z-10 tc-center-beacon">
          <svg
            className="w-14 h-14 drop-shadow-[0_4px_16px_rgba(0,97,147,0.35)]"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Secondary 4 Diagonal Diamond Rays */}
            <path
              d="M32 18L35 29L46 32L35 35L32 46L29 35L18 32L29 29L32 18Z"
              fill="#d97706"
              fillOpacity="0.45"
            />
            {/* Primary 4-Point North Compass Star */}
            <path
              d="M32 4L36.5 27.5L60 32L36.5 36.5L32 60L27.5 36.5L4 32L27.5 27.5L32 4Z"
              fill="url(#voyagerGradient)"
            />
            {/* Sparkling Core Diamond */}
            <path
              d="M32 20L35 29.5L44 32L35 34.5L32 44L29 34.5L20 32L29 29.5L32 20Z"
              fill="#ffffff"
              fillOpacity="0.9"
            />
            {/* Central Golden Core Beacon */}
            <circle cx="32" cy="32" r="3" fill="#f59e0b" />
            <circle cx="32" cy="32" r="1.5" fill="#ffffff" />
            
            <defs>
              <linearGradient id="voyagerGradient" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#006193" />
                <stop offset="0.55" stopColor="#0284c7" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Identity Label */}
      <div className="flex flex-col items-center space-y-1.5 text-center z-10">
        <h2 className="font-sans text-sm sm:text-base font-bold uppercase tracking-[0.38em] text-slate-900 dark:text-white drop-shadow-sm">
          Trip Connect
        </h2>
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-primary dark:text-sky-400">
          Bespoke Journeys • Kochi
        </p>
      </div>

      {/* Shimmering Journey Rail Indicator */}
      <div className="w-36 h-[2px] mt-5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
        <div className="absolute inset-y-0 w-2/3 bg-gradient-to-r from-transparent via-primary to-amber-500 rounded-full tc-shimmer-bar" />
      </div>
    </div>
  );
}
