"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BugReportModal from "@/components/BugReportModal";

export default function ReportBugClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <BugReportModal
        isOpen={isOpen}
        onClose={handleClose}
        showFloatingButton={false}
      />
      {!isOpen && (
        <div className="text-center py-12 space-y-4">
          <p className="text-on-surface-variant text-sm">The report modal has been closed.</p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            Reopen Report Form
          </button>
        </div>
      )}
    </>
  );
}
