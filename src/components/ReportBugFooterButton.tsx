"use client";

export default function ReportBugFooterButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-bug-report"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hover:text-error transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 text-inherit font-inherit"
      title="Report an issue or bug"
    >
      <span className="material-symbols-outlined text-[14px]">bug_report</span>
      <span>Report a Bug</span>
    </button>
  );
}
