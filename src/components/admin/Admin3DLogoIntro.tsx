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
        // ALREADY UNLOCKED: Do NOT show loading screen when switching between admin options!
        setIsUnlocked(true);
        setIsOpen(false);
        setCheckedStorage(true);
        return;
      }
    } catch {
      // Fallback
    }

    // Passcode requirement disabled - Google Sign-In is the sole authentication method
    setIsUnlocked(true);
    setIsOpen(false);
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
      }, 950);
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

  // Block all background interaction until opened and verified
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onMouseMove={handleMouseMove}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-2xl text-on-surface select-none overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Security Gate with 3D Logo"
        >
          {/* Ambient Soft Light Background Orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.45, 0.7, 0.45],
                x: [0, 25, 0],
                y: [0, -25, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-36 -left-36 w-[480px] h-[480px] rounded-full bg-sky-100/70 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.65, 0.4],
                x: [0, -30, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-36 -right-36 w-[480px] h-[480px] rounded-full bg-teal-100/60 blur-[120px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-emerald-50/40 blur-[150px]" />
            {/* Subtle clean grid pattern on pure white */}
            <div className="absolute inset-0 bg-[radial-gradient(#00619312_1px,transparent_1px)] [background-size:22px_22px] opacity-60" />
          </div>

          {/* Main 3D Stage Container */}
          <div
            className="relative z-10 flex flex-col items-center max-w-md w-full my-auto"
            style={{ perspective: 1200 }}
          >
            {/* 3D Dual Gyroscope Orbit Rings in Brand Colors */}
            <motion.div
              animate={{
                rotateZ: 360,
                rotateX: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 12, repeat: Infinity, ease: "linear" },
                rotateX: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-8 w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-primary/25 border-dashed pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 30px rgba(0, 97, 147, 0.08)",
              }}
            />

            <motion.div
              animate={{
                rotateZ: -360,
                rotateY: [65, 75, 65],
              }}
              transition={{
                rotateZ: { duration: 16, repeat: Infinity, ease: "linear" },
                rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -top-8 w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-secondary/25 pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                boxShadow: "0 0 25px rgba(0, 106, 106, 0.06)",
              }}
            />

            {/* 3D Floating White Glass Pedestal & Animated Logo */}
            <motion.div
              initial={{
                scale: 0.25,
                rotateY: -120,
                rotateX: 40,
                opacity: 0,
                z: -200,
              }}
              animate={{
                scale: 1,
                rotateY: mousePos.x * 14,
                rotateX: -mousePos.y * 14,
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
              className="relative p-7 sm:p-9 rounded-3xl bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(0,97,147,0.12),0_10px_25px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center"
            >
              {/* Dynamic 3D Glare Light Reflection */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-50 overflow-hidden"
                style={{
                  background: `radial-gradient(circle at ${50 + mousePos.x * 35}% ${
                    50 + mousePos.y * 35
                  }%, rgba(255,255,255,0.9) 0%, transparent 65%)`,
                }}
              />

              {/* Glowing Corner Accents */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-primary/70 rounded-tl-sm" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-primary/70 rounded-tr-sm" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-primary/70 rounded-bl-sm" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-primary/70 rounded-br-sm" />

              {/* Elevated Floating 3D Logo Layer */}
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
                className="relative w-48 sm:w-56 h-20 sm:h-24 flex items-center justify-center"
              >
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={220}
                  height={80}
                  priority
                  className="max-h-full w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
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
                  className="absolute inset-0 w-28 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 pointer-events-none"
                />
              </motion.div>

              {/* 3D Floor Shadow */}
              <motion.div
                animate={{
                  scaleX: [1, 1.2, 1],
                  opacity: [0.45, 0.2, 0.45],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-40 h-3.5 mt-4 rounded-full bg-slate-300/60 blur-md pointer-events-none"
                style={{ transform: "translateZ(-30px)" }}
              />
            </motion.div>

            {/* Clean White Security Passcode Gate Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-center space-y-3.5 w-full"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Security Clearance Required</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface flex items-center justify-center gap-2">
                  <span>{brandName}</span>
                  <span className="text-primary text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    Admin Gate
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant tracking-wide mt-1">
                  Enter master security key to decrypt operations portal
                </p>
              </div>

              {/* Error / Terminating Alert */}
              {errorNotice && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3.5 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-semibold flex items-center gap-2 text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-error shrink-0">
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
                  className="p-3 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    verified_user
                  </span>
                  <span>{successNotice}</span>
                </motion.div>
              )}

              {/* Passcode Input Form (Clean White Theme with Secret masked bullets) */}
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
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-on-surface placeholder:text-outline text-sm tracking-wider font-mono border border-slate-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-12 text-center shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isVerifying || isTerminating}
                      className="absolute right-3 top-3 text-outline hover:text-on-surface transition-colors p-1"
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
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] btn-shimmer"
                  >
                    {isVerifying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Security Key...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">key</span>
                        <span>Unlock Admin Portal</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-outline pt-0.5">
                    * Secret Master Key required. Incorrect attempts terminate session immediately.
                  </p>
                </form>
              )}

              {/* Progress Bar in Clean Theme */}
              <div className="w-56 sm:w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto mt-2 p-0.5 border border-slate-200 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-secondary via-primary to-sky-500 rounded-full shadow-[0_0_8px_rgba(0,97,147,0.3)]"
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
