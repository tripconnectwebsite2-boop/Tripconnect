"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";

const AUTHORIZED_ADMIN_EMAIL = "tripconnectwebsite2@gmail.com";

type AuthStatus = "idle" | "loading" | "success" | "rejected";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [rejectedEmail, setRejectedEmail] = useState("");
  const [firebaseActive, setFirebaseActive] = useState(false);

  useEffect(() => {
    setFirebaseActive(isFirebaseConfigured());

    try {
      sessionStorage.removeItem("tc_admin_passcode_verified");
    } catch {
      // Silent
    }
  }, []);

  const handleFirebaseGoogleSignIn = async () => {
    setStatus("loading");
    setErrorMsg("");
    setRejectedEmail("");

    if (!firebaseActive || !auth || !googleProvider) {
      setErrorMsg("Google Authentication service is initializing. Please try again.");
      setStatus("idle");
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = (user.email || "").trim().toLowerCase();

      // REJECTION STATE: Unauthorized email
      if (userEmail !== AUTHORIZED_ADMIN_EMAIL) {
        await signOut(auth);
        setRejectedEmail(user.email || "Unknown account");
        setErrorMsg(`"${user.email}" is not authorized.`);
        setStatus("rejected");

        // Auto-redirect to public website after 2.2 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 2200);
        return;
      }

      // SUCCESS STATE: Correct authorized email
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          idToken: idToken || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        await signOut(auth);
        setErrorMsg(data.error || "Authentication failed. Access denied.");
        setStatus("rejected");
        return;
      }

      try {
        sessionStorage.setItem("tc_admin_passcode_verified", "true");
      } catch {
        // Silent
      }

      setStatus("success");

      // Smooth transition to admin dashboard
      setTimeout(() => {
        router.push(from);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      console.error("[Firebase Google Auth Error]:", err);
      setStatus("idle");

      if (err.code === "auth/unauthorized-domain") {
        setErrorMsg("Domain not added to Firebase Authorized Domains in Google Cloud Console.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google Sign-In was cancelled. Please try again.");
      } else {
        setErrorMsg(err.message || "Failed to complete Google authentication.");
      }
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Dynamic Ambient Glow Behind Card */}
      <div
        className={`absolute -inset-1 rounded-[32px] blur-2xl transition-all duration-700 pointer-events-none opacity-70 ${
          status === "success"
            ? "bg-emerald-500/40"
            : status === "rejected"
            ? "bg-red-500/40"
            : "bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
        }`}
      />

      {/* Main Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={
          status === "rejected"
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                x: [-12, 12, -8, 8, -4, 4, 0],
                transition: { duration: 0.55 },
              }
            : { opacity: 1, scale: 1, y: 0 }
        }
        className={`relative rounded-3xl p-8 sm:p-10 backdrop-blur-2xl transition-all duration-500 overflow-hidden ${
          status === "success"
            ? "bg-slate-900/80 border-2 border-emerald-500/60 shadow-[0_20px_60px_rgba(16,185,129,0.25)]"
            : status === "rejected"
            ? "bg-slate-900/85 border-2 border-red-500/60 shadow-[0_20px_60px_rgba(239,68,68,0.25)]"
            : "bg-slate-900/70 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.55)]"
        }`}
      >
        {/* Subtle Top Glass Reflection Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* SUCCESS ANIMATION STATE (Authorized: tripconnectwebsite2@gmail.com)       */}
          {/* ========================================================================= */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center py-6"
            >
              {/* Animated Glowing Success Checkmark */}
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 relative z-10"
                >
                  <span className="material-symbols-outlined text-[34px] font-bold">check</span>
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white tracking-tight mb-2"
              >
                Access Granted
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-emerald-300 font-mono mb-4"
              >
                {AUTHORIZED_ADMIN_EMAIL}
              </motion.p>

              <p className="text-xs text-slate-300 flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>Redirecting to Operations Console...</span>
              </p>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* REJECTION ANIMATION STATE (Unauthorized: Cross Icon + Shake + Redirect)  */}
          {/* ========================================================================= */}
          {status === "rejected" && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="text-center py-6"
            >
              {/* Animated Rejection Cross Symbol (❌ / 🚫) */}
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-red-500/25 blur-md"
                />
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 relative z-10"
                >
                  <span className="material-symbols-outlined text-[36px] font-bold">close</span>
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-red-400 tracking-tight mb-2"
              >
                Access Denied
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-red-200/90 font-mono mb-4 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 inline-block"
              >
                {rejectedEmail}
              </motion.p>

              <p className="text-xs text-slate-400 mb-5">
                Unauthorized account. Redirecting you to public website...
              </p>

              {/* Countdown drain bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 2.2, ease: "linear" }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* DEFAULT / IDLE STATE (Clean Glassmorphic Login Button Only)               */}
          {/* ========================================================================= */}
          {(status === "idle" || status === "loading") && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Brand Logo & Header */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ"
                    alt="Trip Connect Kochi"
                    width={180}
                    height={48}
                    priority
                    className="h-12 w-auto mx-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
                  Administrator Portal
                </h1>
                <p className="text-xs text-slate-400">
                  Trip Connect Operations &amp; Management Console
                </p>
              </div>

              {/* Error notice if popup was closed */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">info</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Frosted Glass Google Sign-In Button */}
              <button
                type="button"
                onClick={handleFirebaseGoogleSignIn}
                disabled={status === "loading"}
                className="group relative w-full py-4 px-5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-sm transition-all duration-300 border border-white/20 hover:border-emerald-400/50 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3.5 active:scale-[0.98] disabled:opacity-60 overflow-hidden"
              >
                {/* Subtle Hover Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

                {status === "loading" ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-emerald-400 rounded-full animate-spin" />
                    <span className="tracking-wide">Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="tracking-wide">Sign in with Google</span>
                  </>
                )}
              </button>

              {/* Public Website Return Link */}
              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="text-xs text-slate-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                  <span>Return to public website</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex flex-col justify-center items-center p-6 text-on-surface">
      {/* Background Ambient Glow Circles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-600/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-600/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Matrix/Star Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-3xl p-8 bg-slate-900/60 backdrop-blur-2xl border border-white/10 text-center text-slate-400 text-sm">
            Initializing secure portal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
