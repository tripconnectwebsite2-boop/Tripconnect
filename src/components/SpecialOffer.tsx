"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { APPLE_EASE } from "@/lib/animation";

export default function SpecialOffer() {
  return (
    <section className="w-full py-8 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden" id="special-offers">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: APPLE_EASE }}
        className="rounded-2xl bg-gradient-to-r from-primary to-primary-container p-8 lg:p-10 text-on-primary shadow-xl relative overflow-hidden"
      >
        {/* Decorative background rings with subtle animation */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-white blur-2xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold tracking-wider uppercase">
                Limited Offer
              </span>
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                Early Monsoon Kerala Retreat
              </span>
            </div>
            <h3 className="font-headline-lg text-headline-lg font-semibold text-white">
              10% off pre-bookings for July – August Escapes
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-white/80 font-body-sm text-body-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span> Valid till 30 April
              </span>
              <span>•</span>
              <span className="text-primary-fixed-dim">Sample offer for demo preview</span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Link
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-bright font-label-md text-label-md font-semibold shadow-md transition-all shrink-0 self-start lg:self-center btn-shimmer active:scale-[0.98]"
              href="/offers"
            >
              <span>Explore All Offers</span>
              <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
