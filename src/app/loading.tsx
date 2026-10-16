import TripConnectLogoLoader from "@/components/TripConnectLogoLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur-md">
      <TripConnectLogoLoader size="fullscreen" />
    </div>
  );
}
