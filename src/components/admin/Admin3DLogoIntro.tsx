"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface Admin3DLogoIntroProps {
  forceShow?: boolean;
  onClose?: () => void;
  logoUrl?: string;
  brandName?: string;
}

export default function Admin3DLogoIntro({
  forceShow = false,
  onClose,
  logoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ",
  brandName = "Trip Connect",
}: Admin3DLogoIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      setPhase("loading");
      setProgress(15);
      return;
    }

    // Check if intro was already shown during this browser session
    try {
      const alreadyShown = sessionStorage.getItem("tc_admin_3d_intro_played");
      if (!alreadyShown) {
        setIsOpen(true);
        sessionStorage.setItem("tc_admin_3d_intro_played", "true");
      }
    } catch {
      // Fallback if sessionStorage is blocked
      setIsOpen(false);
    }
  }, [forceShow]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  // Timed progress bar and automated entrance completion
  useEffect(() => {
    if (!isOpen) return;

    const timer1 = setTimeout(() => setProgress(55), 400);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setPhase("ready");
    }, 1300);
    const timer3 = setTimeout(() => {
      handleClose();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, handleClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Keyboard dismiss (Escape or Space or Enter)
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
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/92 backdrop-blur-2xl text-white select-none overflow-hidden cursor-pointer"
          onClick={handleClose}
          role="dialog"
          aria-label="Admin 3D Logo Intro Animation"
        >
          {/* Ambient 3D Depth Glow Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.35, 0.6, 0.35],
                x: [0, 20, 0],
                y: [0, -30, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/25 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.55, 0.3],
                x: [0, -30, 0],
                y: [0, 25, 0],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/25 blur-[120px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-teal-600/10 blur-[140px]" />
            {/* Grid Pattern overlay for tech depth */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          </div>

          {/* Top Control Bar */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <span>Skip Intro</span>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Main 3D Stage Container */}
          <div
            className="relative z-10 flex flex-col items-center max-w-lg px-6 w-full"
            style={{ perspective: 1200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 3D Holographic Orbit Ring Behind Logo */}
            <motion.div
              animate={{
                rotateZ: 360,
                rotateX: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 12, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute top-20 w-72 h-72 rounded-full border-2 border-emerald-400/30 border-dashed pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 35px rgba(16, 185, 129, 0.2)",
              }}
            />

            {/* 3D Rotating & Floating Logo Card */}
            <motion.div
              initial={{
                scale: 0.15,
                rotateY: -135,
                rotateX: 45,
                opacity: 0,
                z: -300,
              }}
              animate={{
                scale: 1,
                rotateY: mousePos.x * 16,
                rotateX: -mousePos.y * 16,
                opacity: 1,
                z: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 18,
                mass: 0.9,
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative group p-8 rounded-3xl bg-gradient-to-b from-white/[0.14] to-white/[0.03] backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_rgba(16,185,129,0.25)] flex flex-col items-center justify-center"
            >
              {/* Dynamic 3D Glare Light Reflection */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 overflow-hidden"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${
                    50 + mousePos.y * 30
                  }%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
                }}
              />

              {/* Glowing 3D Corner Accent Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-sm" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-sm" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-sm" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400/80 rounded-br-sm" />

              {/* Elevated 3D Logo Layer */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotateZ: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  transform: "translateZ(60px)",
                  transformStyle: "preserve-3d",
                }}
                className="relative w-48 sm:w-56 h-20 sm:h-24 flex items-center justify-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              >
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={220}
                  height={80}
                  priority
                  className="max-h-full w-auto object-contain brightness-110 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                />

                {/* Light streak sweep animation */}
                <motion.div
                  initial={{ x: "-150%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 w-24 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
                />
              </motion.div>

              {/* 3D Depth Shadow on Floor */}
              <motion.div
                animate={{
                  scaleX: [1, 1.15, 1],
                  opacity: [0.5, 0.25, 0.5],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-40 h-4 mt-6 rounded-full bg-black/60 blur-md pointer-events-none"
                style={{ transform: "translateZ(-30px)" }}
              />
            </motion.div>

            {/* Typography & Status Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 text-center space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Admin Portal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>{brandName}</span>
                <span className="text-emerald-400 text-sm font-normal px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                  v2.0
                </span>
              </h2>

              <p className="text-xs text-white/70 tracking-wide font-medium">
                {phase === "loading"
                  ? "Authenticating Security Token & Initializing Workspace..."
                  : "Workspace Ready • Entering Concierge CRM"}
              </p>

              {/* Futuristic Progress Bar */}
              <div className="w-56 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto mt-3 p-0.5 border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  initial={{ width: "10%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>

              <p className="text-[11px] text-white/40 pt-1">
                Click anywhere or press Esc to enter immediately
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
