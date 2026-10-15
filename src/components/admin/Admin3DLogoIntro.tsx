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
  const [isOpen, setIsOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  // Passcode verification state
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [progress, setProgress] = useState(25);
  const [isTerminating, setIsTerminating] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  // Check if session is already unlocked in this active tab
  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      setIsUnlocked(false);
      setProgress(25);
      setCheckedStorage(true);
      return;
    }

    try {
      const verified = sessionStorage.getItem("tc_admin_passcode_verified");
      if (verified === "true") {
        setIsUnlocked(true);
        // Quick smooth entrance for already verified active session
        setProgress(60);
        const t1 = setTimeout(() => setProgress(100), 400);
        const t2 = setTimeout(() => handleClose(), 1200);
        setCheckedStorage(true);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    } catch {
      // Fallback
    }

    setIsUnlocked(false);
    setCheckedStorage(true);
  }, [forceShow, handleClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isVerifying || isTerminating) return;

    setIsVerifying(true);
    setErrorNotice("");
    setSuccessNotice("");

    try {
      const res = await fetch("/api/admin/auth/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Wrong passcode: Terminate session and redirect back to public website
        setIsTerminating(true);
        setErrorNotice(
          "Invalid Secret Passcode! Access Denied. Disconnecting and redirecting to public site..."
        );

        try {
          sessionStorage.removeItem("tc_admin_passcode_verified");
          await fetch("/api/admin/auth/logout", { method: "POST" });
        } catch {
          // Silent
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 1400);
        return;
      }

      // Success: Correct passcode
      setSuccessNotice("Clearance Verified • Welcome Administrator");
      setProgress(100);
      try {
        sessionStorage.setItem("tc_admin_passcode_verified", "true");
      } catch {
        // Silent
      }

      setTimeout(() => {
        setIsUnlocked(true);
        handleClose();
      }, 1000);
    } catch {
      setIsTerminating(true);
      setErrorNotice("Verification error. Disconnecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1400);
    } finally {
      setIsVerifying(false);
    }
  };

  // Block all background interaction until closed
  if (!isOpen && checkedStorage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 text-white select-none overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Security Gate with 3D Logo"
        >
          {/* Ambient 3D Depth Illumination */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.35, 0.65, 0.35],
                x: [0, 25, 0],
                y: [0, -25, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-36 -left-36 w-[480px] h-[480px] rounded-full bg-emerald-500/25 blur-[130px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-36 -right-36 w-[480px] h-[480px] rounded-full bg-cyan-500/25 blur-[130px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-teal-500/10 blur-[160px]" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />
          </div>

          {/* Main 3D Stage Container */}
          <div
            className="relative z-10 flex flex-col items-center max-w-md w-full my-auto"
            style={{ perspective: 1200 }}
          >
            {/* 3D Dual Gyroscope Orbit Rings */}
            <motion.div
              animate={{
                rotateZ: 360,
                rotateX: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 11, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-8 w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-emerald-400/35 border-dashed pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 35px rgba(16, 185, 129, 0.25)",
              }}
            />

            <motion.div
              animate={{
                rotateZ: -360,
                rotateY: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 15, repeat: Infinity, ease: "linear" },
                rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-8 w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-400/30 pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 25px rgba(6, 182, 212, 0.2)",
              }}
            />

            {/* 3D Floating Glass Pedestal & Animated Logo */}
            <motion.div
              initial={{
                scale: 0.2,
                rotateY: -130,
                rotateX: 45,
                opacity: 0,
                z: -250,
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
                stiffness: 130,
                damping: 18,
                mass: 0.85,
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.14] to-white/[0.03] backdrop-blur-3xl border border-white/25 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center"
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

              {/* Glowing Corner Accents */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/90 rounded-tl-sm shadow-[0_0_8px_#34d399]" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400/90 rounded-tr-sm shadow-[0_0_8px_#34d399]" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400/90 rounded-bl-sm shadow-[0_0_8px_#34d399]" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400/90 rounded-br-sm shadow-[0_0_8px_#34d399]" />

              {/* Elevated Floating 3D Logo */}
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotateZ: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  transform: "translateZ(65px)",
                  transformStyle: "preserve-3d",
                }}
                className="relative w-48 sm:w-56 h-20 sm:h-24 flex items-center justify-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
              >
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={220}
                  height={80}
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
                className="w-40 h-3.5 mt-4 rounded-full bg-black/70 blur-md pointer-events-none"
                style={{ transform: "translateZ(-30px)" }}
              />
            </motion.div>

            {/* Security Passcode Gate Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-center space-y-4 w-full"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-widest shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Security Clearance Required</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                  <span>{brandName}</span>
                  <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40">
                    Admin Gate
                  </span>
                </h2>
                <p className="text-xs text-white/60 tracking-wide mt-1">
                  Enter master security key to decrypt operations portal
                </p>
              </div>

              {/* Error / Terminating Alert */}
              {errorNotice && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3.5 rounded-xl bg-error/20 border border-error/50 text-red-200 text-xs font-semibold flex items-center gap-2 text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-red-400 shrink-0">
                    gpp_bad
                  </span>
                  <span>{errorNotice}</span>
                </motion.div>
              )}

              {/* Success Alert */}
              {successNotice && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-emerald-400">
                    verified_user
                  </span>
                  <span>{successNotice}</span>
                </motion.div>
              )}

              {/* Passcode Input Form (Secret masked bullets) */}
              {!isUnlocked && !successNotice && (
                <form
                  onSubmit={handlePasscodeSubmit}
                  className="space-y-3 pt-1 w-full"
                >
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter secret security key..."
                      autoFocus
                      disabled={isVerifying || isTerminating}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] focus:bg-white/[0.15] text-white placeholder:text-white/40 text-sm tracking-wider font-mono border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all pr-12 text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isVerifying || isTerminating}
                      className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label="Toggle password visibility"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || !passcode.trim() || isTerminating}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        <span>Verifying Security Key...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">key</span>
                        <span>Unlock Admin Portal</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-white/40 pt-1">
                    * Secret Master Key required. Incorrect attempts terminate session immediately.
                  </p>
                </form>
              )}

              {/* Progress bar */}
              <div className="w-56 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto mt-2 p-0.5 border border-white/10 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  initial={{ width: "25%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
