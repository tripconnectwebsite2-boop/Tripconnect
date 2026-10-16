"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/config";
import { signInWithPopup } from "firebase/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [firebaseActive, setFirebaseActive] = useState(false);

  // Passcode login state
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [isPasscodeLoading, setIsPasscodeLoading] = useState(false);

  useEffect(() => {
    setFirebaseActive(isFirebaseConfigured());
  }, []);

  // Firebase Google OAuth Sign-In handler
  const handleFirebaseGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      sessionStorage.removeItem("tc_admin_passcode_verified");
    } catch {
      // Silent
    }

    if (!firebaseActive || !auth || !googleProvider) {
      setErrorMsg(
        "Google Authentication is initializing or unavailable. You can use your Master Security Passcode below."
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = (user.email || "").trim().toLowerCase();
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
        if (res.status === 403) {
          router.push(`/admin/unauthorized?email=${encodeURIComponent(userEmail)}`);
          return;
        }
        setErrorMsg(data.error || "Authentication failed. Unauthorized account.");
        setIsLoading(false);
        return;
      }

      try {
        sessionStorage.setItem("tc_admin_passcode_verified", "true");
      } catch {
        // Silent
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      console.error("[Firebase Google Auth Error]:", err);
      setIsLoading(false);

      if (err.code === "auth/unauthorized-domain") {
        setErrorMsg(
          "Domain not added to Firebase Authorized Domains. Please use the Master Passcode below."
        );
      } else if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google Sign-In was closed before completing. Please try again.");
      } else {
        setErrorMsg(err.message || "Failed to complete Google authentication. Try the Master Passcode below.");
      }
    }
  };

  // Master Security Passcode handler
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isPasscodeLoading) return;

    setIsPasscodeLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid Master Passcode. Access denied.");
        setIsPasscodeLoading(false);
        return;
      }

      // Mark passcode verified in sessionStorage so the 3D Intro screen doesn't ask again
      try {
        sessionStorage.setItem("tc_admin_passcode_verified", "true");
      } catch {
        // Silent
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Passcode verification failed. Please try again.");
      setIsPasscodeLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-8">
      <div className="text-center mb-6">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ"
          alt="Trip Connect Kochi"
          width={180}
          height={48}
          priority
          className="h-12 w-auto mx-auto object-contain mb-4"
        />
        <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
          Administrator Sign-In
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
          Trip Connect Operations &amp; Management Portal
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-error">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Primary Action 1: Google OAuth */}
      <button
        type="button"
        onClick={handleFirebaseGoogleSignIn}
        disabled={isLoading || isPasscodeLoading}
        className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-label-md text-label-md font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 border border-neutral-300 active:scale-[0.98] disabled:opacity-75 mb-5"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin"></span>
            <span>Connecting to Google...</span>
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
            <span>Sign in with Google</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative flex py-2 items-center mb-5">
        <div className="flex-grow border-t border-outline-variant/30"></div>
        <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-on-surface-variant font-medium">
          OR PASSCODE
        </span>
        <div className="flex-grow border-t border-outline-variant/30"></div>
      </div>

      {/* Primary Action 2: Master Passcode Form */}
      <form onSubmit={handlePasscodeLogin} className="space-y-3.5 mb-6">
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
            Master Security Key
          </label>
          <div className="relative">
            <input
              type={showPasscode ? "text" : "password"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter 14-digit passcode"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary pr-10 tracking-widest font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(!showPasscode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              aria-label="Toggle password visibility"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPasscode ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!passcode.trim() || isPasscodeLoading || isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-label-md text-sm font-semibold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPasscodeLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Unlock Admin Portal</span>
            </>
          )}
        </button>
      </form>

      <div className="pt-3 border-t border-outline-variant/20 text-center">
        <Link href="/" className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to public website</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col justify-center items-center p-6 text-on-surface">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant font-body-md">
            Loading authentication portal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
