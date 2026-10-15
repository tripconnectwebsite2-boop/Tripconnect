"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const [email, setEmail] = useState("dmtripconnectin@gmail.com");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
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

        {/* Security Notice */}
        <div className="mb-6 p-3.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">verified_user</span>
          <p>
            Strict Access Control: Only designated Google accounts (<strong>dmtripconnectin@gmail.com</strong>) are authorized to access the management portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="admin-email">
              Authorized Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
              placeholder="dmtripconnectin@gmail.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 btn-shimmer active:scale-[0.98] disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
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
                <span>Sign in with Google Allowlist</span>
              </>
            )}
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
