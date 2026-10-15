import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Link from "next/link";
import { getSiteContent } from "@/lib/db";

export const metadata = {
  title: "About Trip Connect | Native Kerala Concierge & Tour Specialist",
  description: "Learn about Trip Connect Kochi. Founded on native Kerala expertise, bespoke travel curation, transparent itineraries, and direct human hospitality.",
};

export default async function AboutPage() {
  const content = await getSiteContent();

  const aboutBadge = content.about_badge || "Based in Kochi, Kerala";
  const aboutTitle = content.about_title || "Quiet Luxury, Native Precision, and Heartfelt Hospitality.";
  const aboutSubtitle =
    content.about_subtitle ||
    "Trip Connect was born out of a desire to replace formulaic mass-tour packages with thoughtful, individual journeys. Headquartered in Kochi, we design travel experiences that honor your pace, privacy, and personal taste.";
  const storyTitle = content.about_story_title || "Why We Do What We Do";
  const storyP1 =
    content.about_story_p1 ||
    "Too many travelers experience Kerala through rushed group buses, commercial souvenir traps, and opaque tour markups. We believe that true luxury lies in stillness—watching morning mist peel away over tea hills in Munnar, floating down silent palm-canopied canals in Alleppey, and savoring meals prepared freshly on a private wooden Kettuvallam.";
  const storyP2 =
    content.about_story_p2 ||
    "Because our operations team lives and works directly in Kochi, our recommendations come from firsthand knowledge. We know which backwater channels remain free of motorized traffic, which heritage homestays serve authentic Malabar cuisine, and which private drivers maintain spotless safety records.";
  const aboutImage =
    content.about_image ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuASJNgmdoiZS-L2EeJH6bC_BJnjEyc-ps714Hvrrs1hcrJEl2ZyJC4wWWDzjURJSuRBsPKY-RAjO0M6M_UiktOdHDcQ5vlA9kuFvyCtaZqCgPEG5rcst98ta1hhUz2TNekWn6_J1_1IxA436qF-rzy4WVUPxKdoDVWeDBRRqt-5BOVhknH02JbQfYWaAVE55EFBq0CYXA9RvcaQPY1ypKD72jvMgsh53TqVVFKOiI8nV_M6Dlxhmn6qGg";

  return (
    <>
      <Header content={content} />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px]">location_city</span>
              {aboutBadge}
            </div>
            <h1 className="font-display-hero text-headline-xl md:text-display-hero text-on-surface tracking-tight mb-6">
              {aboutTitle}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {aboutSubtitle}
            </p>
          </div>

          {/* Core Story & Philosophy Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-on-surface-variant leading-relaxed font-body-md text-body-md">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {storyTitle}
              </h2>
              <p>
                {storyP1}
              </p>
              <p>
                {storyP2}
              </p>
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-outline">
                <strong className="text-on-surface">Kerala Tourism Approved Partner:</strong> Registered and operating under verified tourism quality and vehicle safety standards in Ernakulam, Kerala.
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-2xl bg-surface-container-high aspect-[4/5]">
              <img
                src={aboutImage}
                alt="Houseboat on Vembanad Lake"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 4 Pillars */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs text-primary uppercase font-bold tracking-wider">
                Our Operating Principles
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                The Trip Connect Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">edit_calendar</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  100% Tailored
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  No cookie-cutter buses. Every itinerary is structured around your family, dates, and rhythm.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">pin_drop</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Native Kochi Desk
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Planned and supervised directly from Kerala by specialists with authentic on-ground connections.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Clear Pricing
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Explicit room categories, AC private vehicle allowances, and zero hidden checkout markups.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">support_agent</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Direct WhatsApp Line
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Direct line with your personal planner before booking and 24/7 on-ground assistance throughout.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Banner */}
          <div className="p-10 rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Ready to plan your Kerala escape?
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Chat directly with our Kochi concierges or share your tentative dates.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-md hover:bg-primary-container btn-shimmer active:scale-[0.98]"
            >
              Start Planning Your Trip
            </Link>
          </div>
        </div>
      </main>
      <Footer content={content} />
      <FloatingWhatsApp />
    </>
  );
}
