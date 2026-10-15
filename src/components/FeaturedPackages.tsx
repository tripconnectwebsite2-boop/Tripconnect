"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { APPLE_EASE } from "@/lib/animation";

export default function FeaturedPackages() {
  const packages = [
    {
      title: "Classic Kerala Grand Tour",
      subtitle: "Cochin • Munnar • Thekkady • Alleppey",
      duration: "6N / 7D",
      price: "₹32,000",
      badge: "High Value",
      badgeClass: "bg-secondary-container text-on-secondary-container",
      slug: "classic-kerala-grand-tour",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsEueUPJrI0O1sHnvIQdp-xgXpkaYKfOkgLG6MC7pdryUyfy__v92icO0eIqpBYlE15-9goslKClobZY9z8oaCniCTHIB5G5ssC8EhDlcIrNcgMgjqyfniZ5typYoNow0w1ZzunISf4YBooojKwq3dxn1-LaKsVNNA4fxmrTJ0YAEgLoQIlWtwVBhWM2MfH9ffWIfAfJ89oaPVDmMPsvCUj4WWokPYvJ0KhoTul8CRrbBTqKSw15J8jw",
      inclusions: [
        { icon: "sailing", text: "Private Overnight Luxury Houseboat with Chef" },
        { icon: "spa", text: "Guided Spice Plantation Walk in Thekkady" },
        { icon: "theater_comedy", text: "Authentic Evening Kathakali Performance" },
        { icon: "airport_shuttle", text: "Dedicated Chauffeur & AC SUV Transfers" },
      ],
    },
    {
      title: "Golden Triangle & Rajasthan",
      subtitle: "Delhi • Agra • Jaipur",
      duration: "5N / 6D",
      price: "₹28,500",
      badge: "Heritage",
      badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      slug: "golden-triangle-heritage",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDvVABX4Y6jpzGgP2sYLLGWh5N-fDDHyeJg4EHWR23avMU0zO6OGgeAMUJv0833v7mEJvBUdyTsdGgK-a4p5sd8araMwsXVp_LN4fbT5IkXmPt0O85SJrGMy_7EYw-VkJFJdUCyc7Dnp3YshUDpj2FxTFGsyYXnD5GIVRbIfYqFgrBbDVy5_eFsOg9ZOsDoJwUjXm9xueRC1zCZurRuygbrmMTYYGNGOWgyjpK4dHMoJrhght8Rjo4gvQ",
      inclusions: [
        { icon: "wb_sunny", text: "Privileged Sunrise Tour at Taj Mahal Agra" },
        { icon: "castle", text: "Amber Fort Jeep Safari & City Palace Jaipur" },
        { icon: "hotel", text: "Heritage Restored Haveli Stays" },
        { icon: "local_taxi", text: "Private Intercity Transfers & Licensed Guides" },
      ],
    },
    {
      title: "Wayanad & Coorg Highlands",
      subtitle: "Wayanad • Coorg",
      duration: "4N / 5D",
      price: "₹22,400",
      badge: "Highland Trek",
      badgeClass: "bg-secondary-container text-on-secondary-container",
      slug: "wayanad-rainforest-wildlife-retreat-draft",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDHZFZCVDrJOtbPFmJ02LXvzZJwQCWNccpArTImJK-Owjd3RrzWKylxMdF3AUU6IK9Cd9GUw_liFfH6FWboas_5l5QIxJ_XrJJzFV54ibqAG49kyS8eGTznP5rBBenwpgXDvYI2Bbpw4nMKC-Sr_ykchVWEKVjYNkuwnWrKVT-PrWr1tWh341oQ6JTsR-vURqSSpHtQDZZdMRu3o3f8n6hVcYz8fZloUoMH5q-OWWXsRSLzH6ViJL_D0A",
      inclusions: [
        { icon: "coffee", text: "Artisan Coffee Estate Boutique Homestay" },
        { icon: "waterfall_chart", text: "Iruppu & Soochipara Waterfall Treks" },
        { icon: "kayaking", text: "River Bamboo Rafting & Spice Trails" },
        { icon: "restaurant", text: "Kodava & Malabar Culinary Experiences" },
      ],
    },
  ];

  return (
    <section className="w-full py-16 lg:py-24 bg-surface-container-low overflow-hidden" id="featured-packages">
      <div className="max-w-7xl 2xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header with Viewport Scroll Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: APPLE_EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-14 gap-6"
        >
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Signature Curations
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-2">
              Featured Packages
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Multi-destination balanced circuits crafted with luxury stays &amp; private transit.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shadow-sm border border-outline-variant/20 hover:border-primary/40 transition-colors">
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            Fully customizable on request
          </div>
        </motion.div>

        {/* 3-Card Grid with Staggered Viewport Entrance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: idx * 0.15,
                ease: APPLE_EASE,
              }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="laptop-card-hover flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-2xl transition-all overflow-hidden border border-outline-variant/20 group"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/85 via-on-background/25 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md shadow-sm border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    {pkg.duration}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider mb-1">
                    {pkg.subtitle}
                  </p>
                  <h3 className="font-headline-md text-headline-md font-semibold text-white group-hover:text-primary-fixed transition-colors">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="space-y-4 mb-6">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                    Curated Inclusions
                  </span>
                  <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc.text} className="flex items-center gap-2.5 group/item transition-transform duration-200 hover:translate-x-1">
                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 transition-transform duration-200 group-hover/item:scale-110">
                          {inc.icon}
                        </span>
                        <span>{inc.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-body-sm text-body-sm text-outline">Starting Price</span>
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {pkg.price}{" "}
                        <span className="text-sm font-normal text-outline">/person</span>
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm ${pkg.badgeClass} shadow-sm`}>
                      {pkg.badge}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      className="py-2.5 text-center rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all active:scale-[0.98] font-medium border border-outline-variant/15 hover:border-outline-variant/40"
                      href={`/packages/${pkg.slug}`}
                    >
                      View Details
                    </Link>
                    <Link
                      className="py-2.5 text-center rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all btn-shimmer active:scale-[0.98] font-medium shadow-sm"
                      href={`/packages/${pkg.slug}#enquire`}
                    >
                      Quick Enquiry
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
