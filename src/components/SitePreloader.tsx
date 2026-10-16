"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";
import TripConnectLogoLoader from "./TripConnectLogoLoader";

function GlobalLoaderInner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const prevPathname = useRef(pathname);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerLoader = (visibleDurationMs: number = 1300) => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

    setLoading(true);
    setFading(false);

    fadeTimeoutRef.current = setTimeout(() => {
      setFading(true);
      fadeTimeoutRef.current = setTimeout(() => {
        setLoading(false);
        setFading(false);
      }, 350);
    }, visibleDurationMs);
  };

  // 1. Initial Page Load (Refresh or direct open)
  useEffect(() => {
    triggerLoader(1400);
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  // 2. Route Changes (Whenever user lands on /transportation, /destinations, etc.)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      triggerLoader(1300);
    }
  }, [pathname]);

  // 3. Catch clicks on any internal links (Navigation links, buttons, cards)
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
        if (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname
        ) {
          // Immediately activate loader on click
          triggerLoader(1500);
        }
      } catch {
        // ignore
      }
    };

    // Also listen to back/forward browser button
    const handlePopState = () => {
      triggerLoader(1300);
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white/98 backdrop-blur-2xl transition-opacity duration-300 select-none ${
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
