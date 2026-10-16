"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname } from "next/navigation";
import TripConnectLogoLoader from "./TripConnectLogoLoader";

function PageTransitionLoaderInner() {
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const [fading, setFading] = useState(false);
  const [key, setKey] = useState(1);
  const lastPathnameRef = useRef(pathname);
  const transitionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial page load animation
  useEffect(() => {
    // Show full stroke draw for ~2.2s on first load
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2200);

    const doneTimer = setTimeout(() => {
      setActive(false);
      setFading(false);
    }, 2650);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  // 2. Intercept clicks on internal links to trigger transition loader
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
        // If navigating to a different page route on the same site
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          transitionStartRef.current = Date.now();
          if (timerRef.current) clearTimeout(timerRef.current);
          setKey((prev) => prev + 1); // Reset SVG stroke animation
          setFading(false);
          setActive(true);
        }
      } catch {
        // ignore invalid URL
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => document.removeEventListener("click", handleDocumentClick, { capture: true });
  }, []);

  // 3. When pathname changes (navigation finished), smoothly finish the animation
  useEffect(() => {
    if (pathname === lastPathnameRef.current) return;
    lastPathnameRef.current = pathname;

    const elapsed = Date.now() - transitionStartRef.current;
    // Ensure stroke animation plays for at least 1.4s so the user sees the drawing effect
    const minDisplayTime = 1400;
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setFading(true);
      timerRef.current = setTimeout(() => {
        setActive(false);
        setFading(false);
      }, 450);
    }, remainingTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!active) return null;

  return (
    <div
      key={key}
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-surface/95 dark:bg-[#0c1218]/95 backdrop-blur-md transition-opacity duration-400 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <TripConnectLogoLoader size="fullscreen" />
    </div>
  );
}

export default function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoaderInner />
    </Suspense>
  );
}
