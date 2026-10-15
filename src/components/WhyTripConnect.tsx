export default function WhyTripConnect() {
  const pillars = [
    {
      title: "Personalised Trip Planning",
      desc: "Every single itinerary is tailored to your exact pace, group dynamics, dietary needs, and luxury preferences. No rigid group buses.",
      icon: "edit_note",
      colorClass: "text-primary",
    },
    {
      title: "Kerala Native Expertise",
      desc: "Planned directly by travel specialists living in Kochi who know the quietest backwater channels and most authentic mountain homestays.",
      icon: "pin_drop",
      colorClass: "text-secondary",
    },
    {
      title: "Transparent Itineraries",
      desc: "Detailed day-by-day breakdowns with explicit hotel categories, transport inclusions, driver allowances, and strictly zero hidden charges.",
      icon: "receipt_long",
      colorClass: "text-primary",
    },
    {
      title: "Direct WhatsApp & Call Support",
      desc: "A constant open line with your dedicated travel planner before departure and 24/7 on-ground assistance during your entire holiday.",
      icon: "chat",
      colorClass: "text-secondary",
    },
  ];

  return (
    <section className="w-full py-24 bg-surface-container-low" id="why-us">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-primary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                The Trip Connect Standard
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
              Crafted with native precision, delivered with heartfelt warmth.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              We reject the template-driven mass package model. Every journey is treated as an individual piece of curation designed specifically around how you like to travel.
            </p>
            {/* Grounded notice */}
            <div className="p-4 rounded-xl bg-surface-container border-0 flex items-start gap-3">
              <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">
                info
              </span>
              <p className="font-body-sm text-body-sm text-outline leading-normal">
                Proposed service descriptions reflect our bespoke concierge methodology. Pricing and inclusions are confirmed explicitly in writing before reservation deposits.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-8 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center ${pillar.colorClass} mb-6`}
                >
                  <span className="material-symbols-outlined text-[26px]">{pillar.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">
                  {pillar.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
