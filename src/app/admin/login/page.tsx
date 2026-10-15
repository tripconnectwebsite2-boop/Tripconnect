"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase/config";
import { signInWithPopup } from "firebase/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const [email, setEmail] = useState("dmtripconnectin@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [infoNotice, setInfoNotice] = useState("");

  useEffect(() => {
    setFirebaseActive(isFirebaseConfigured());
  }, []);

  // Firebase Google OAuth Sign-In handler
  const handleFirebaseGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setInfoNotice("");

    // If Firebase configuration keys are not configured yet, notify user and provide direct login
    if (!firebaseActive || !auth || !googleProvider) {
      setInfoNotice(
        "Firebase credentials not yet detected in environment. Using Direct Allowlist Verification."
      );
      await submitBackendAuth("dmtripconnectin@gmail.com");
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = user.email || "";
      const idToken = await user.getIdToken();

      // Submit authenticated Google token & email to backend allowlist check
      await submitBackendAuth(userEmail, idToken);
    } catch (err: any) {
      console.error("[Firebase Auth Error]:", err);
      setIsLoading(false);

      if (err.code === "auth/unauthorized-domain") {
        setErrorMsg(
          "Domain not authorized in Firebase Console. Please add 'localhost' to Authorized Domains under Firebase Console > Authentication > Settings."
        );
      } else if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google Sign-In was closed before completing. Please try again.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setErrorMsg("Another authentication popup is already open.");
      } else {
        setErrorMsg(err.message || "Failed to complete Google authentication with Firebase.");
      }
    }
  };

  // Submit verified email/token to backend session creator
  const submitBackendAuth = async (authEmail: string, idToken?: string) => {
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail.trim(),
          idToken: idToken || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          router.push(`/admin/unauthorized?email=${encodeURIComponent(authEmail)}`);
          return;
        }
        setErrorMsg(data.error || "Authentication failed. Unauthorized account.");
        setIsLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to connect to authentication service.");
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    await submitBackendAuth(email);
  };

  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-8">
      <div className="text-center mb-8">
        <img
          alt="Trip Connect Kochi"
          className="h-12 w-auto mx-auto object-contain mb-4"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ"
        />
        <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
          Administrator Sign-In
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
          Trip Connect Operations &amp; Concierge CRM
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-error">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {infoNotice && (
        <div className="mb-6 p-4 rounded-xl bg-secondary-container text-on-secondary-container font-body-sm text-body-sm flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-secondary">info</span>
          <span>{infoNotice}</span>
        </div>
      )}

      {/* Security Notice */}
      <div className="mb-6 p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">verified_user</span>
        <p>
          Strict Access Control: Only designated Google accounts (<strong>dmtripconnectin@gmail.com</strong>) are authorized to access the management portal.
        </p>
      </div>

      {/* Primary: Sign in with Google (Firebase) */}
      <button
        type="button"
        onClick={handleFirebaseGoogleSignIn}
        disabled={isLoading}
        className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-label-md text-label-md font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 border border-neutral-200 active:scale-[0.98] disabled:opacity-75 mb-6"
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

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-outline-variant/30 w-full" />
        <span className="bg-surface-container-lowest px-3 text-xs text-outline uppercase tracking-wider font-medium">
          or direct allowlist verify
        </span>
        <div className="border-t border-outline-variant/30 w-full" />
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-on-surface" htmlFor="admin-email">
            Admin Allowlist Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30 font-medium"
            placeholder="dmtripconnectin@gmail.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75"
        >
          <span>Verify &amp; Enter Dashboard</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
        <Link href="/" className="text-sm text-primary hover:underline font-medium">
          ← Return to public website
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
