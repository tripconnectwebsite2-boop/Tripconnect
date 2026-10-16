"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type Variants } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { APPLE_EASE } from "@/lib/animation";
import { SiteContent } from "@/lib/types";

export default function Hero({ content }: { content?: Partial<SiteContent> }) {
  const heroRef = useRef<HTMLElement>(null);

  const heroBadge = content?.hero_badge || "Bespoke Concierge • Based in Kochi";
  const heroTitle = content?.hero_title || "Your Next Journey Starts Here.";
  const heroSubtitle = content?.hero_subtitle || "Discover Kerala and beyond with travel experiences planned around you. Quiet luxury, untamed nature, and native precision.";
  const heroBgImage = content?.hero_bg_image || "https://lh3.googleusercontent.com/aida-public/AB6AXuASJNgmdoiZS-L2EeJH6bC_BJnjEyc-ps714Hvrrs1hcrJEl2ZyJC4wWWDzjURJSuRBsPKY-RAjO0M6M_UiktOdHDcQ5vlA9kuFvyCtaZqCgPEG5rcst98ta1hhUz2TNekWn6_J1_1IxA436qF-rzy4WVUPxKdoDVWeDBRRqt-5BOVhknH02JbQfYWaAVE55EFBq0CYXA9RvcaQPY1ypKD72jvMgsh53TqVVFKOiI8nV_M6Dlxhmn6qGg";
  const primaryCtaText = content?.hero_primary_cta_text || "Explore Trips";
  const primaryCtaLink = content?.hero_primary_cta_link || "#kerala-tours";
  const secondaryCtaText = content?.hero_secondary_cta_text || "Plan Your Trip";
  const secondaryCtaLink = content?.hero_secondary_cta_link || "#plan-trip";

  // Scroll animations linked directly to Hero container scroll progress
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Parallax shifts & zooms
  const heroImageY = useTransform(smoothProgress, [0, 1], ["0%", "22%"]);
  const heroImageScale = useTransform(smoothProgress, [0, 1], [1, 1.09]);
  const heroTextOpacity = useTransform(smoothProgress, [0, 0.55], [1, 0]);
  const heroTextY = useTransform(smoothProgress, [0, 0.55], [0, -40]);
  const heroCardScale = useTransform(smoothProgress, [0, 1], [1, 0.97]);

  // Motion animation presets
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: APPLE_EASE,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full -mt-20 overflow-hidden bg-transparent"
      id="hero"
    >
      <div className="relative min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between pt-24 lg:pt-28 pb-8 lg:pb-12 px-4 sm:px-6 lg:px-12 max-w-7xl 2xl:max-w-[1360px] mx-auto">
        {/* Ambient light aura with continuous floating motion */}
        <motion.div
          animate={{
            y: [0, 18, 0],
            scale: [1, 1.06, 1],
            opacity: [0.75, 0.95, 0.75],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[500px] bg-primary/12 rounded-full blur-3xl pointer-events-none -z-10"
        />
        <motion.div
          animate={{
            y: [0, -14, 0],
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.75, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/4 right-0 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10"
        />

        {/* Hero copy and CTA with scroll-linked opacity & upward drift */}
        <motion.div
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl pt-6 lg:pt-10 relative z-10"
        >
          {/* Top Concierge Badge */}
          <motion.div variants={itemVariants} className="inline-block">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md text-primary mb-6 lg:mb-8 shadow-sm border border-outline-variant/30 hover:border-primary/40 transition-colors animate-float">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
              </span>
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-semibold">
                {heroBadge}
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display-hero text-headline-xl sm:text-display-hero text-on-surface tracking-tight leading-[1.08] mb-4 sm:mb-6"
          >
            {heroTitle}
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            variants={itemVariants}
            className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-8 sm:mb-10"
          >
            {heroSubtitle}
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-md transition-all hover:shadow-xl btn-shimmer active:scale-[0.98]"
              href={primaryCtaLink}
            >
              <span>{primaryCtaText}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="material-symbols-outlined ml-2 text-[18px]"
              >
                arrow_forward
              </motion.span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all hover:shadow-md border border-outline-variant/20"
              href={secondaryCtaLink}
            >
              <span className="material-symbols-outlined mr-2 text-[18px] text-primary transition-transform duration-300 group-hover:rotate-45">
                tune
              </span>
              <span>{secondaryCtaText}</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all hover:shadow-md border border-primary/30"
              href="/transportation"
            >
              <span className="material-symbols-outlined mr-2 text-[18px] text-primary">
                directions_car
              </span>
              <span>Taxi &amp; Bus Services</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Cinematic Backdrop Image Card with Scroll Parallax */}
        <motion.div
          style={{ scale: heroCardScale }}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: APPLE_EASE }}
          className="mt-8 lg:mt-12 relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_30px_70px_-15px_rgba(0,97,147,0.22)] bg-surface-container-high aspect-[16/9] lg:aspect-[21/9] transition-all duration-700 group border border-outline-variant/20 hover:border-primary/40"
        >
          {/* Inner Parallax Image */}
          <motion.div
            style={{
              y: heroImageY,
              scale: heroImageScale,
            }}
            className="w-full h-[125%] -top-[12%] absolute inset-0 origin-center transition-transform duration-700 ease-out"
          >
            <Image
              src={heroBgImage}
              alt="The Sacred Palm Lagoons of Vembanad Lake"
              fill
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1280px"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/75 via-on-background/20 to-transparent pointer-events-none" />

          {/* Hero Image Bottom Destination Tag */}
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 flex flex-wrap items-end justify-between gap-4 text-white z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="space-y-1"
            >
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
                Featured Sanctuary
              </span>
              <p className="font-headline-md text-headline-md font-semibold tracking-tight">
                The Sacred Palm Lagoons of Vembanad Lake
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex items-center gap-3 backdrop-blur-md bg-on-background/40 px-4 py-2 rounded-xl text-white border border-white/10"
            >
              <span className="material-symbols-outlined text-secondary-fixed text-[20px]">verified</span>
              <span className="font-label-sm text-label-sm tracking-wide">
                Handcrafted Route • Private Houseboat Escapes
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Apple-style Scroll Down Indicator */}
        <div className="mt-8 flex justify-center">
          <motion.a
            href="#kerala-tours"
            aria-label="Scroll to Kerala tours"
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center gap-2 text-on-surface-variant/70 hover:text-primary transition-colors cursor-pointer group"
          >
            <span className="font-label-sm text-[11px] tracking-widest uppercase font-semibold">
              Explore Below
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-outline-variant/50 group-hover:border-primary flex justify-center pt-1.5 transition-colors">
              <motion.div
                animate={{
                  y: [0, 14, 0],
                  opacity: [1, 0.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </motion.a>
        </div>

        {/* Quick Value Pillars with scroll-triggered entrance */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
          {[
            {
              icon: "design_services",
              title: "100% Tailored Itineraries",
              desc: "Paced purely to your unique schedule.",
              color: "text-primary",
            },
            {
              icon: "location_city",
              title: "Native Kerala Specialists",
              desc: "Headquartered directly in Kochi.",
              color: "text-primary",
            },
            {
              icon: "support_agent",
              title: "Direct WhatsApp Desk",
              desc: "Immediate human consultation.",
              color: "text-secondary",
            },
          ].map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: APPLE_EASE }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-lowest shadow-sm transition-all hover:shadow-md border border-outline-variant/20"
            >
              <div className={`w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center ${pillar.color} shrink-0`}>
                <span className="material-symbols-outlined text-[24px]">{pillar.icon}</span>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">{pillar.title}</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
