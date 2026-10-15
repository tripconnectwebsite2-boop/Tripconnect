import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportBugClient from "./ReportBugClient";

export const metadata = {
  title: "Report an Issue | Trip Connect Kochi",
  description: "Encountered a bug, broken link, or technical glitch on our website? Submit a ticket directly to the Trip Connect engineering team.",
};

export default function ReportBugPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-container-lowest text-on-surface">
      <Header />
      <main className="flex-1 py-16 px-6 lg:px-12 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error font-semibold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">bug_report</span>
            Quality Assurance &amp; Issue Tracker
          </div>
          <h1 className="font-headline-xl text-3xl lg:text-4xl font-bold tracking-tight text-on-surface">
            Report a Technical Issue
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
            We are committed to delivering a seamless booking experience. If you encountered a glitch, display anomaly, or broken link, let us know and we will resolve it promptly.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <ReportBugClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}
