export default function Hero() {
  return (
    <section className="relative w-full -mt-20 overflow-hidden bg-surface" id="hero">
      <div className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Ambient light aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero copy and CTA */}
        <div className="max-w-4xl pt-8 lg:pt-14 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md text-primary mb-8 shadow-sm reveal-fade-up border border-outline-variant/30 hover:border-primary/30 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
            </span>
            <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-semibold">
              Bespoke Concierge • Based in Kochi
            </span>
          </div>

          <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-[1.08] mb-6 reveal-fade-up delay-150">
            Your Next Journey Starts Here.
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-10 reveal-fade-up delay-300">
            Discover Kerala and beyond with travel experiences planned around you. Quiet luxury, untamed nature, and native precision.
          </p>

          <div className="flex flex-wrap items-center gap-4 reveal-fade-up delay-400">
            <a
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 btn-shimmer active:scale-[0.98]"
              href="#kerala-tours"
            >
              <span>Explore Trips</span>
              <span className="material-symbols-outlined ml-2 text-[18px] transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
            <a
              className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] border border-outline-variant/20"
              href="#plan-trip"
            >
              <span className="material-symbols-outlined mr-2 text-[18px] text-primary transition-transform duration-300 group-hover:rotate-45">
                tune
              </span>
              <span>Plan Your Trip</span>
            </a>
          </div>
        </div>

        {/* Cinematic Backdrop Image Card */}
        <div className="mt-12 lg:mt-16 relative rounded-2xl overflow-hidden shadow-2xl bg-surface-container-high aspect-[16/9] lg:aspect-[21/9] reveal-fade-up delay-500 group">
          <div
            className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASJNgmdoiZS-L2EeJH6bC_BJnjEyc-ps714Hvrrs1hcrJEl2ZyJC4wWWDzjURJSuRBsPKY-RAjO0M6M_UiktOdHDcQ5vlA9kuFvyCtaZqCgPEG5rcst98ta1hhUz2TNekWn6_J1_1IxA436qF-rzy4WVUPxKdoDVWeDBRRqt-5BOVhknH02JbQfYWaAVE55EFBq0CYXA9RvcaQPY1ypKD72jvMgsh53TqVVFKOiI8nV_M6Dlxhmn6qGg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-on-background/20 to-transparent" />

            {/* Badges on top of Hero Image */}
            <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface font-label-sm text-label-sm pointer-events-auto hover:bg-surface-container-lowest transition-all">
                <span className="text-amber-500 font-bold">★ 5.0</span>
                <span className="text-on-surface-variant font-medium">Google Rated</span>
                <span className="text-outline text-xs">(122 Reviews)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-on-background/60 backdrop-blur-md text-white font-label-sm text-label-sm pointer-events-auto border border-white/10">
                  <span className="material-symbols-outlined text-secondary-fixed text-[16px]">verified</span>
                  <span>100% Curated Kerala Journeys</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/85 backdrop-blur-md text-white font-label-sm text-label-sm pointer-events-auto shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  <span>Kochi Desk</span>
                </div>
              </div>
            </div>

            {/* Hero Image Bottom Details */}
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 flex flex-wrap items-end justify-between gap-4 text-white">
              <div className="space-y-1">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
                  Featured Sanctuary
                </span>
                <p className="font-headline-md text-headline-md font-semibold tracking-tight">
                  The Sacred Palm Lagoons of Vembanad Lake
                </p>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-md bg-on-background/40 px-4 py-2 rounded-xl text-white border border-white/10">
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">verified</span>
                <span className="font-label-sm text-label-sm tracking-wide">
                  Handcrafted Route • Private Houseboat Escapes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Value Pillars */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 reveal-fade-up delay-600">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border border-outline-variant/20">
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">design_services</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface">100% Tailored Itineraries</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Paced purely to your unique schedule.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border border-outline-variant/20">
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">location_city</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface">Native Kerala Specialists</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Headquartered directly in Kochi.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border border-outline-variant/20">
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface">Direct WhatsApp Desk</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Immediate human consultation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
