"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";
import TripConnectLogoLoader from "./TripConnectLogoLoader";

function GlobalLoaderInner() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const isFirstMount = useRef(true);
  const prevPathname = useRef(pathname);

  // 1. Initial Page Load Animation (on refresh or direct open of any page)
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setLoading(false);
        setFading(false);
        isFirstMount.current = false;
      }, 350);
    }, 1100);

    return () => clearTimeout(fadeTimer);
  }, []);

  // 2. Subsequent Route Navigation (When pathname changes)
  useEffect(() => {
    if (isFirstMount.current) return;

    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // When new route arrives, hold for brief smooth view of logo then fade out
      const fadeTimer = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setLoading(false);
          setFading(false);
        }, 350);
      }, 700);

      return () => clearTimeout(fadeTimer);
    }
  }, [pathname]);

  // 3. Catch user clicks on internal page navigation links (Transportation, Destinations, Packages, etc.)
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
          // Navigating to another page (Transportation, Destinations, etc.)
          // Immediately display the Trip Connect logo loader!
          setLoading(true);
          setFading(false);
        }
      } catch {
        // ignore
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
  }, []);

  if (!loading) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-surface/95 backdrop-blur-xl transition-opacity duration-350 select-none ${
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
