import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center text-on-surface">
      <div className="max-w-md w-full p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[36px]">block</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-3">
          Access Restricted
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
          Your account is not on the authorized administrator allowlist. For security, only verified Trip Connect administrative staff (<code className="text-primary font-mono text-xs">tripconnectwebsite2@gmail.com</code>) have access to customer enquiries and portal operations.
        </p>
        <div className="space-y-3">
          <Link
            href="/admin/login"
            className="block w-full py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all"
          >
            Try Another Account
          </Link>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-all"
          >
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
