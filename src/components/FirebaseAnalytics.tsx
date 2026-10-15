"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/firebase/config";

export default function FirebaseAnalytics() {
  useEffect(() => {
    // When the component mounts in the browser, analytics initializes via config.ts
    if (analytics) {
      // Analytics instance active
    }
  }, []);

  return null;
}
