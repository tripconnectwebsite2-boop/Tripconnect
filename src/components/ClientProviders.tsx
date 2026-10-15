"use client";

import dynamic from "next/dynamic";

const ConsentBanner = dynamic(() => import("@/components/ConsentBanner"), { ssr: false });
const BugReportModal = dynamic(() => import("@/components/BugReportModal"), { ssr: false });

export default function ClientProviders({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children}
      <ConsentBanner />
      <BugReportModal />
    </>
  );
}
