import TripConnectLogoLoader from "@/components/TripConnectLogoLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/95 backdrop-blur-xl">
      <TripConnectLogoLoader size="fullscreen" />
    </div>
  );
}
