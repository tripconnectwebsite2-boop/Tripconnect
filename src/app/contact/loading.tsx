import TripConnectLogoLoader from "@/components/TripConnectLogoLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl">
      <TripConnectLogoLoader size="fullscreen" />
    </div>
  );
}
