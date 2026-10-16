"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete and reset progress bar when route changes
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Intercept click on internal links to give INSTANT visual feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Skip external links, hash-only, downloads, or target="_blank"
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || target === "_blank") {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          setIsNavigating(true);
          setProgress(30);

          setTimeout(() => setProgress((p) => (p < 80 ? 70 : p)), 100);
        }
      } catch {
        // invalid URL, ignore
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => document.removeEventListener("click", handleDocumentClick, { capture: true });
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-amber-500 shadow-[0_0_10px_rgba(0,97,147,0.5)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

export default function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
