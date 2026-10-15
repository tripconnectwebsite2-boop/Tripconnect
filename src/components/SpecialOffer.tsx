"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { APPLE_EASE } from "@/lib/animation";
import { SpecialOffer as SpecialOfferType } from "@/lib/types";

interface SpecialOfferProps {
  offer?: SpecialOfferType | null;
  offers?: SpecialOfferType[];
}

export default function SpecialOffer({ offer, offers }: SpecialOfferProps) {
  const activeOffer = offer || (offers && offers.length > 0 ? offers[0] : null);

  if (!activeOffer) return null;

  const discountBadge =
    activeOffer.discount_type === "percentage" && activeOffer.discount_value
      ? `${activeOffer.discount_value}% OFF`
      : activeOffer.discount_type === "fixed_amount" && activeOffer.discount_value
      ? `₹${activeOffer.discount_value.toLocaleString("en-IN")} OFF`
      : "Special Perk";

  const formattedValidUntil = (() => {
    if (!activeOffer.valid_until) return null;
    try {
      const d = new Date(activeOffer.valid_until);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return activeOffer.valid_until;
    }
  })();

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-12 max-w-7xl 2xl:max-w-[1360px] mx-auto overflow-hidden" id="special-offers">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: APPLE_EASE }}
        className="rounded-2xl lg:rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary p-8 lg:p-10 text-on-primary shadow-xl relative overflow-hidden laptop-card-hover border border-white/20"
      >
        {/* Decorative background aura with subtle animation */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white text-primary font-label-sm text-label-sm font-bold tracking-wider uppercase shadow-sm">
                {discountBadge}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-label-sm text-label-sm uppercase tracking-wider border border-white/20">
                {activeOffer.package_title || "Limited Seasonal Offer"}
              </span>
            </div>

            <h3 className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
              {activeOffer.title}
            </h3>

            {activeOffer.description && (
              <p className="font-body-md text-body-md text-white/90 leading-relaxed max-w-2xl">
                {activeOffer.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-white/80 font-body-sm text-body-sm pt-1">
              {formattedValidUntil && (
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Valid till {formattedValidUntil}
                </span>
              )}
              {formattedValidUntil && <span>•</span>}
              <span className="text-white/70">Subject to vehicle &amp; resort availability</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-primary hover:bg-surface-bright font-label-md text-label-md font-bold shadow-md transition-all btn-shimmer active:scale-[0.98]"
                href={`/contact?offer=${encodeURIComponent(activeOffer.title)}`}
              >
                <span>Claim this Offer</span>
                <span className="material-symbols-outlined ml-1.5 text-[18px]">arrow_forward</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-label-md text-label-md font-semibold backdrop-blur-md transition-all border border-white/20"
                href="/offers"
              >
                <span>All Offers</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
