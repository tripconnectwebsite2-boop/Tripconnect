"use client";

import { motion, useScroll, useTransform, useSpring } from "motion/react";

export default function AmbientBackgroundMotion() {
  const { scrollYProgress } = useScroll();

  // Smooth out scroll progress with high-grade spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax transformations for ambient glowing light orbs
  const orb1Y = useTransform(smoothProgress, [0, 1], ["0%", "120%"]);
  const orb1X = useTransform(smoothProgress, [0, 0.5, 1], ["0%", "-15%", "5%"]);
  const orb1Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.25, 0.9]);

  const orb2Y = useTransform(smoothProgress, [0, 1], ["20%", "-60%"]);
  const orb2X = useTransform(smoothProgress, [0, 0.5, 1], ["0%", "18%", "-10%"]);
  const orb2Scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1.2, 1.05]);

  const orb3Y = useTransform(smoothProgress, [0, 1], ["-10%", "90%"]);
  const orb3X = useTransform(smoothProgress, [0, 0.5, 1], ["5%", "-12%", "8%"]);

  // Streamline contours parallax shift
  const waveShift = useTransform(smoothProgress, [0, 1], [0, 180]);
  const waveScale = useTransform(smoothProgress, [0, 1], [1, 1.08]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Primary Cyan/Blue Oceanic Light Orb (Munnar Dawn Mist) */}
      <motion.div
        style={{ y: orb1Y, x: orb1X, scale: orb1Scale }}
        animate={{
          opacity: [0.14, 0.24, 0.14],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full bg-gradient-to-tr from-[#006193]/20 via-[#4ba6df]/15 to-transparent blur-[100px] will-change-transform"
      />

      {/* Warm Golden/Amber Orb (Alleppey Sunset Twilight) */}
      <motion.div
        style={{ y: orb2Y, x: orb2X, scale: orb2Scale }}
        animate={{
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[40%] -right-40 w-[500px] sm:w-[680px] h-[500px] sm:h-[680px] rounded-full bg-gradient-to-br from-[#8f4e00]/15 via-[#f59e0b]/10 to-transparent blur-[110px] will-change-transform"
      />

      {/* Emerald / Backwater Lagoon Ambient Glow */}
      <motion.div
        style={{ y: orb3Y, x: orb3X }}
        animate={{
          opacity: [0.06, 0.14, 0.06],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[75%] left-[20%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-t from-[#0d9488]/12 via-[#06b6d4]/8 to-transparent blur-[100px] will-change-transform"
      />

      {/* Elegant Parallax Water Current & Mist Streamlines (SVG) */}
      <motion.svg
        style={{ y: waveShift, scale: waveScale }}
        className="absolute top-[18%] -left-10 w-[120%] h-[700px] opacity-[0.06] dark:opacity-[0.10] will-change-transform"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M -100,120 C 300,30 600,240 1000,90 C 1200,10 1400,180 1600,100"
          stroke="url(#streamline-gradient-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <motion.path
          d="M -100,240 C 250,150 550,380 950,210 C 1150,120 1350,310 1600,220"
          stroke="url(#streamline-gradient-2)"
          strokeWidth="1.8"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
        <motion.path
          d="M -100,360 C 200,280 500,480 900,320 C 1100,240 1300,420 1600,340"
          stroke="url(#streamline-gradient-1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="streamline-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#006193" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8f4e00" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="streamline-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8f4e00" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#006193" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Delicate floating ambient dust / light glimmers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[12%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-float" style={{ animationDuration: "6s" }} />
        <div className="absolute top-[28%] right-[16%] w-2 h-2 rounded-full bg-secondary/35 animate-float delay-200" style={{ animationDuration: "7.5s" }} />
        <div className="absolute top-[45%] left-[8%] w-1.5 h-1.5 rounded-full bg-amber-400/30 animate-float delay-500" style={{ animationDuration: "9s" }} />
        <div className="absolute top-[62%] right-[10%] w-2 h-2 rounded-full bg-primary/35 animate-float delay-300" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[80%] left-[22%] w-1.5 h-1.5 rounded-full bg-emerald-400/25 animate-float delay-700" style={{ animationDuration: "10s" }} />
      </div>
    </div>
  );
}
