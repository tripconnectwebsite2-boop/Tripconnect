export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 bg-surface/50">
      <div className="relative flex flex-col items-center justify-center space-y-4">
        {/* Animated Brand Pulse Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-60" />
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary border-r-secondary animate-spin" />
          <span className="material-symbols-outlined text-primary text-[22px] absolute">
            travel_explore
          </span>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Trip Connect Kochi
          </p>
          <p className="text-xs text-outline font-medium animate-pulse">
            Loading bespoke travel experience...
          </p>
        </div>
      </div>
    </div>
  );
}
