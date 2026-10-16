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
  const prevPathname = useRef(pathname);
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

  // 1. Initial Page Load / When Website Opens (Full logo animation for normal website, never for admin)
  useEffect(() => {
    if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/studio"))) {
      setLoading(false);
      setFading(false);
      return;
    }
    showLoader(3500);
    return () => clearTimers();
  }, [pathname, showLoader, clearTimers]);

  // 2. Route Changes (When switching pages):
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      // Never run loader on admin routes
      if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/studio"))) {
        clearTimers();
        setLoading(false);
        setFading(false);
        return;
      }

      // Show loader when changing pages
      showLoader(3500);
    }
  }, [pathname, showLoader, clearTimers]);

  // 3. Catch all internal link clicks across the site (Header, cards, buttons)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Do nothing if currently on admin
      if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/studio")) {
        return;
      }

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

        // If target is admin or studio, never show loader
        if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/studio")) {
          return;
        }

        const cleanCurrent = window.location.pathname.replace(/\/$/, "");
        const cleanTarget = url.pathname.replace(/\/$/, "");

        // When switching to a DIFFERENT page!
        if (url.origin === window.location.origin && cleanTarget !== cleanCurrent) {
          showLoader(3500);
        }
      } catch {
        // ignore
      }
    };

    const handlePopState = () => {
      if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/studio")) {
        return;
      }
      showLoader(3500);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
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
