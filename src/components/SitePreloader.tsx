"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { usePathname } from "next/navigation";
import TripConnectLogoLoader from "./TripConnectLogoLoader";

function GlobalLoaderInner() {
  const pathname = usePathname();
  const isAdmin = pathname ? (pathname.startsWith("/admin") || pathname.startsWith("/studio")) : false;

  // When website opens: if normal website, start in loading state; if admin, NO loader
  const [loading, setLoading] = useState(() => !isAdmin);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
  }, []);

  // 3500ms ensures the entire 23-path line draw AND solid color reveal completes fully before closing
  const showLoader = useCallback((durationMs: number = 3500) => {
    if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/studio"))) {
      setLoading(false);
      setFading(false);
      return;
    }

    clearTimers();
    setLoading(true);
    setFading(false);

    timerRef.current = setTimeout(() => {
      setFading(true);
      fadeTimerRef.current = setTimeout(() => {
        setLoading(false);
        setFading(false);
      }, 400);
    }, durationMs);
  }, [clearTimers, pathname]);

  // 1. When Website Opens: Show full logo animation (Never on admin)
  useEffect(() => {
    if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/studio"))) {
      setLoading(false);
      setFading(false);
      return;
    }
    showLoader(3500);
    return () => clearTimers();
  }, [pathname, showLoader, clearTimers]);

  // 2. Main Page Switching ONLY:
  // Catch clicks exclusively on the Header Navigation links (Destinations, Packages, Transportation, etc.)
  // Absolutely ALL in-page content clicks (Explore Trips, cards, buttons, etc.) are ignored.
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Never run on admin
      if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/studio")) {
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      // STRICT RULE: Only links inside <header> (main page navigation / logo).
      // All page content links, cards, buttons (e.g. "Explore Trips", hero buttons, packages) are NOT in header, so they are completely ignored!
      const headerElement = anchor.closest("header");
      if (!headerElement) {
        return;
      }

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Skip hash links, mailto, tel, external, or target="_blank"
      if (
        !href ||
        href.startsWith("#") ||
        href.includes("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target === "_blank"
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);

        // Never trigger on admin or studio links
        if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/studio")) {
          return;
        }

        const cleanCurrent = window.location.pathname.replace(/\/$/, "");
        const cleanTarget = url.pathname.replace(/\/$/, "");

        // Trigger ONLY when navigating to a different page route from the header menu!
        if (url.origin === window.location.origin && cleanTarget !== cleanCurrent) {
          showLoader(3500);
        }
      } catch {
        // ignore
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      clearTimers();
    };
  }, [showLoader, clearTimers]);

  // If admin or not loading, render nothing
  if (isAdmin || !loading) return null;

  return (
    <div
      aria-label="Loading Trip Connect"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/98 dark:bg-white backdrop-blur-2xl transition-opacity duration-400 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <TripConnectLogoLoader size="fullscreen" />
    </div>
  );
}

export default function SitePreloader() {
  return (
    <Suspense fallback={null}>
      <GlobalLoaderInner />
    </Suspense>
  );
}
