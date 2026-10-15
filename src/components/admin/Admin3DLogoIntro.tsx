"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface Admin3DLogoIntroProps {
  forceShow?: boolean;
  onClose?: () => void;
  logoUrl?: string;
  brandName?: string;
  autoClose?: boolean;
  durationMs?: number;
}

export default function Admin3DLogoIntro({
  forceShow = false,
  onClose,
  logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ",
  brandName = "Trip Connect",
  autoClose = true,
  durationMs = 2000,
}: Admin3DLogoIntroProps) {
  // Always active on mount so it acts as the primary loading screen when entering
  const [isOpen, setIsOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [statusText, setStatusText] = useState("Verifying Admin Clearance...");
  const [progress, setProgress] = useState(15);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      setProgress(15);
      setStatusText("Initializing Admin Workspace...");
    }
  }, [forceShow]);

  // Timed loading sequence
  useEffect(() => {
    if (!isOpen || !autoClose) return;

    const t1 = setTimeout(() => {
      setProgress(55);
      setStatusText("Synchronizing Enquiries, Itineraries & CMS...");
    }, durationMs * 0.28);

    const t2 = setTimeout(() => {
      setProgress(90);
      setStatusText("Finalizing Workspace Security...");
    }, durationMs * 0.65);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Workspace Ready • Entering Admin Portal");
    }, durationMs * 0.88);

    const t4 = setTimeout(() => {
      handleClose();
    }, durationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, autoClose, durationMs, handleClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Allow instant skip with Escape, Enter or Space
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-white select-none overflow-hidden cursor-pointer"
          onClick={handleClose}
          role="dialog"
          aria-label="Admin Loading Screen with 3D Logo Animation"
        >
          {/* Ambient 3D Volumetric Lighting */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.35, 0.65, 0.35],
                x: [0, 30, 0],
                y: [0, -25, 0],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-36 -left-36 w-[450px] h-[450px] rounded-full bg-emerald-500/25 blur-[130px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, -35, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-36 -right-36 w-[450px] h-[450px] rounded-full bg-cyan-500/25 blur-[130px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[150px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
          </div>

          {/* Quick Skip Button */}
          <div className="absolute top-6 right-6 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <span>Skip Loading</span>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* 3D Stage */}
          <div
            className="relative z-10 flex flex-col items-center max-w-md px-6 w-full"
            style={{ perspective: 1200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D Dual Gyroscope Orbit Rings */}
            <motion.div
              animate={{
                rotateZ: 360,
                rotateX: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 10, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-6 w-80 h-80 rounded-full border-2 border-emerald-400/35 border-dashed pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 40px rgba(16, 185, 129, 0.25)",
              }}
            />

            <motion.div
              animate={{
                rotateZ: -360,
                rotateY: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 14, repeat: Infinity, ease: "linear" },
                rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-6 w-72 h-72 rounded-full border border-cyan-400/30 pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.2)",
              }}
            />

            {/* 3D Floating Glass Pedestal & Logo */}
            <motion.div
              initial={{
                scale: 0.2,
                rotateY: -140,
                rotateX: 45,
                opacity: 0,
                z: -250,
              }}
              animate={{
                scale: 1,
                rotateY: mousePos.x * 18,
                rotateX: -mousePos.y * 18,
                opacity: 1,
                z: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 130,
                damping: 18,
                mass: 0.85,
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white/[0.15] to-white/[0.03] backdrop-blur-3xl border border-white/25 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center"
            >
              {/* Dynamic 3D Glare Light */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-45 overflow-hidden"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePos.x * 35}% ${
                    50 + mousePos.y * 35
                  }%, rgba(255,255,255,0.45) 0%, transparent 65%)`,
                }}
              />

              {/* Glowing 3D Corner Marks */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/90 rounded-tl-sm shadow-[0_0_8px_#34d399]" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400/90 rounded-tr-sm shadow-[0_0_8px_#34d399]" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400/90 rounded-bl-sm shadow-[0_0_8px_#34d399]" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400/90 rounded-br-sm shadow-[0_0_8px_#34d399]" />

              {/* Elevated Floating 3D Logo Layer */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotateZ: [0, 1.2, -1.2, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  transform: "translateZ(70px)",
                  transformStyle: "preserve-3d",
                }}
                className="relative w-52 sm:w-60 h-22 sm:h-28 flex items-center justify-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
              >
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={240}
                  height={90}
                  priority
                  className="max-h-full w-auto object-contain brightness-110 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.45)]"
                />

                {/* Laser Light Streak Sweep */}
                <motion.div
                  initial={{ x: "-180%" }}
                  animate={{ x: "220%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    repeatDelay: 0.8,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                />
              </motion.div>

              {/* 3D Floor Shadow */}
              <motion.div
                animate={{
                  scaleX: [1, 1.2, 1],
                  opacity: [0.55, 0.25, 0.55],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-44 h-4 mt-6 rounded-full bg-black/70 blur-md pointer-events-none"
                style={{ transform: "translateZ(-30px)" }}
              />
            </motion.div>

            {/* Typography & Loading Telemetry */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-8 text-center space-y-3 w-full"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Admin Portal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>{brandName}</span>
                <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40">
                  Secure CRM
                </span>
              </h2>

              <p className="text-xs text-emerald-200/80 tracking-wide font-medium min-h-[1.25rem]">
                {statusText}
              </p>

              {/* Precision Loading Progress Bar */}
              <div className="w-60 sm:w-72 h-2 bg-white/10 rounded-full overflow-hidden mx-auto mt-3 p-0.5 border border-white/15 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.9)]"
                  initial={{ width: "15%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>

              <p className="text-[11px] text-white/40 pt-1">
                Loading dashboard • Click anywhere to skip
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
