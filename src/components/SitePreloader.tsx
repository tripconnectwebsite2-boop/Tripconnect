"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { usePathname } from "next/navigation";
import TripConnectLogoLoader from "./TripConnectLogoLoader";

function GlobalLoaderInner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
  }, []);

  const showLoader = useCallback((durationMs: number = 1800) => {
    clearTimers();
    setLoading(true);
    setFading(false);

    timerRef.current = setTimeout(() => {
      setFading(true);
      fadeTimerRef.current = setTimeout(() => {
        setLoading(false);
        setFading(false);
      }, 350);
    }, durationMs);
  }, [clearTimers]);

  // 1. Initial Page Load / Full Refresh
  useEffect(() => {
    showLoader(2400);
    return () => clearTimers();
  }, [showLoader, clearTimers]);

  // 2. Next.js Route changes (pathname updates)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      showLoader(1800);
    }
  }, [pathname, showLoader]);

  // 3. Catch all internal link clicks across the site (Header, cards, buttons)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target === "_blank"
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const cleanCurrent = window.location.pathname.replace(/\/$/, "");
        const cleanTarget = url.pathname.replace(/\/$/, "");

        if (url.origin === window.location.origin && cleanTarget !== cleanCurrent) {
          // Immediately show loading animation when navigating to another page
          showLoader(1900);
        }
      } catch {
        // ignore
      }
    };

    const handlePopState = () => {
      showLoader(1600);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [showLoader, clearTimers]);

  if (!loading) return null;

  return (
    <div
      aria-label="Loading Trip Connect"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/98 dark:bg-white backdrop-blur-2xl transition-opacity duration-350 ease-out select-none ${
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
