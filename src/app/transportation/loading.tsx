import LuxuryTravelLoader from "@/components/LuxuryTravelLoader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl">
      <LuxuryTravelLoader size="md" />
    </div>
  );
}
