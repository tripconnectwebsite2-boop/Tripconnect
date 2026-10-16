"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center text-on-surface">
      <div className="max-w-md w-full p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[36px]">block</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">
          Access Denied
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          The email account you signed in with does not have administrator privileges. Redirecting you back to the public website in <strong className="text-primary font-mono text-base">{countdown}s</strong>...
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all"
          >
            Back to Public Website Now
          </Link>
          <Link
            href="/admin/login"
            className="block w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-all"
          >
            Try Logging in with Admin Account
          </Link>
        </div>
      </div>
    </div>
  );
}
