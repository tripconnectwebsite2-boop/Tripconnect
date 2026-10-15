"use client";

import { motion } from "motion/react";
import { APPLE_EASE } from "@/lib/animation";
import { SiteContent } from "@/lib/types";

export default function WhyTripConnect({ content }: { content?: Partial<SiteContent> }) {
  const whyBadge = content?.why_badge || "The Trip Connect Standard";
  const whyTitle = content?.why_title || "Crafted with native precision, delivered with heartfelt warmth.";
  const whySubtitle = content?.why_subtitle || "We reject the template-driven mass package model. Every journey is treated as an individual piece of curation designed specifically around how you like to travel.";

  const pillars = [
    {
      title: content?.why_card_1_title || "Personalised Trip Planning",
      desc: content?.why_card_1_desc || "Every single itinerary is tailored to your exact pace, group dynamics, dietary needs, and luxury preferences. No rigid group buses.",
      icon: "edit_note",
      colorClass: "text-primary",
    },
    {
      title: content?.why_card_2_title || "Kerala Native Expertise",
      desc: content?.why_card_2_desc || "Planned directly by travel specialists living in Kochi who know the quietest backwater channels and most authentic mountain homestays.",
      icon: "pin_drop",
      colorClass: "text-secondary",
    },
    {
      title: content?.why_card_3_title || "Transparent Itineraries",
      desc: content?.why_card_3_desc || "Detailed day-by-day breakdowns with explicit hotel categories, transport inclusions, driver allowances, and strictly zero hidden charges.",
      icon: "receipt_long",
      colorClass: "text-primary",
    },
    {
      title: content?.why_card_4_title || "Direct WhatsApp & Call Support",
      desc: content?.why_card_4_desc || "A constant open line with your dedicated travel planner before departure and 24/7 on-ground assistance during your entire holiday.",
      icon: "chat",
      colorClass: "text-secondary",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-surface-container-low/85 backdrop-blur-md overflow-hidden" id="why-us">
      <div className="max-w-7xl 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column with Viewport Entrance */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: APPLE_EASE }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-highest text-primary shadow-sm border border-outline-variant/20">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                {whyBadge}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
              {whyTitle}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {whySubtitle}
            </p>
            {/* Grounded notice */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/15 flex items-start gap-3">
              <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">
                info
              </span>
              <p className="font-body-sm text-body-sm text-outline leading-normal">
                Proposed service descriptions reflect our bespoke concierge methodology. Pricing and inclusions are confirmed explicitly in writing before reservation deposits.
              </p>
            </div>
          </motion.div>

          {/* Right Column Grid with Staggered Card Reveals */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.12,
                  ease: APPLE_EASE,
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="laptop-card-hover group p-7 lg:p-8 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all border border-outline-variant/15 hover:border-primary/30 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-primary/10 flex items-center justify-center mb-6 shadow-sm transition-colors duration-300">
                    <span className={`material-symbols-outlined text-[26px] ${pillar.colorClass} transition-transform duration-300 group-hover:scale-110`}>
                      {pillar.icon}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
