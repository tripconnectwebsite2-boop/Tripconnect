"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { APPLE_EASE } from "@/lib/animation";
import { SiteContent, TravelPackage } from "@/lib/types";

export default function KeralaTours({
  content,
  packages: dbPackages,
}: {
  content?: Partial<SiteContent>;
  packages?: TravelPackage[];
}) {
  const keralaBadge = content?.kerala_badge || "Flagship Journeys";
  const keralaTitle = content?.kerala_title || "Discover the Beauty of Kerala";
  const keralaSubtitle = content?.kerala_subtitle || "Handcrafted routes through God’s Own Country, from mist-kissed highlands to tranquil backwater lagoons.";

  const defaultTours = [
    {
      title: content?.kerala_tour1_title || "Munnar Cloud Mist & Tea Trails",
      tag: "Highland Mist",
      icon: "landscape",
      duration: "3N / 4D",
      desc: content?.kerala_tour1_desc || "Ascend to colonial tea estates, private tea-tasting sessions, and dawn treks across Anamudi foothills.",
      price: content?.kerala_tour1_price || "₹14,500",
      image:
        content?.kerala_tour1_image ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDCzwJauBQYcLbtjGtABpJpcaUOhNXWkeONV1e_6XO5-ecYvYrgSypw1qr2W0oslFPX81kUzt-ZHQ9CZsyx-Pp03zo0bUkargRdMM7g5Um5MInTOH01gD8CTKxyZMyMwXmdmw9Eo3tBaOBQde3kPrMl-P7qcC359ZFyTMtMvMlmduh2YTAjNbTzORzljYpB21iRDw0CrblpxqWsvWuDbrA7pMo26-MRd3xAIM2GAcn7NH5p8gYx4gWPDw",
      slug: "munnar-tea-trails",
    },
    {
      title: content?.kerala_tour2_title || "Alleppey Luxury Backwater Cruise",
      tag: "Backwater Cruise",
      icon: "sailing",
      duration: "2N / 3D",
      desc: content?.kerala_tour2_desc || "Drift along palm-lined canals with dedicated private onboard chef, artisan village stops, and starry nights.",
      price: content?.kerala_tour2_price || "₹18,000",
      image:
        content?.kerala_tour2_image ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXa4pkOq0ty9_41mIx9UTEheTGIuJxcg9o0D40EZJRkTZnoyL4hB1gCuk62Bvhd7lMOPIa26eBygCDhuweowtOxzg_CChGSVglWspZ0TZmJC7seoNVyu1DB_X_74wtIE5DbM2hvPryKN76goIUdONWjazCD4hkEN8ncjerEygEnCEFj6vYwl_fa-xKJwjOOE_eUwTDeFVCmWra8gE5fE72kVXD0LX-Nla2PYGEI6BnnTlwN9iwaGn0A",
      slug: "alleppey-luxury-cruise",
    },
    {
      title: content?.kerala_tour3_title || "Wayanad Rainforest Sanctuary",
      tag: "Wild Rainforest",
      icon: "forest",
      duration: "3N / 4D",
      desc: content?.kerala_tour3_desc || "Treehouse stays, prehistoric Edakkal rock caves exploration, and guided bamboo rafting on quiet rivers.",
      price: content?.kerala_tour3_price || "₹16,200",
      image:
        content?.kerala_tour3_image ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMzmHxxHFOG9GNcnOQIC8jw9II3muiJ05oxhHDw5vpL6yhcWWo5M68-qw0zQNNaSKkLS0FMrFd5pww0TROn3gijfgZ1fAE76cdQyDMASwwJYxNnm92bC_i3rpx-ZrPg0b6AB4Eu8OYG9i8xmR7mG76HG-3p1dAlJ3IbZSEx_Nlvh1pmaEkmlJoN0jK6Bs99SnsU8gwgoXqyV-IZgDEAQGtFXVWlDhl8GXIpHQhTcHIRC_xbT43MiBbw",
      slug: "wayanad-rainforest-sanctuary",
    },
    {
      title: "Classic Kerala Grand Tour",
      tag: "Heritage Circuit",
      icon: "landscape",
      duration: "6N / 7D",
      desc: "Multi-destination balanced circuit across God’s Own Country with luxury tea resort, spice plantation walk, and overnight private backwater houseboat.",
      price: "₹32,000",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsEueUPJrI0O1sHnvIQdp-xgXpkaYKfOkgLG6MC7pdryUyfy__v92icO0eIqpBYlE15-9goslKClobZY9z8oaCniCTHIB5G5ssC8EhDlcIrNcgMgjqyfniZ5typYoNow0w1ZzunISf4YBooojKwq3dxn1-LaKsVNNA4fxmrTJ0YAEgLoQIlWtwVBhWM2MfH9ffWIfAfJ89oaPVDmMPsvCUj4WWokPYvJ0KhoTul8CRrbBTqKSw15J8jw",
      slug: "classic-kerala-grand-tour",
    },
  ];

  const tours = (() => {
    const validLivePackages = (dbPackages || []).filter(
      (p) => p.status === "published" && p.content_verified && !p.slug.endsWith("-draft")
    );
    if (validLivePackages.length === 0) return defaultTours;
    const keralaOnly = validLivePackages.filter(
      (p) => p.category === "Kerala Tours" || (p.category as string) === "kerala"
    );
    const list = (keralaOnly.length >= 2 ? keralaOnly : validLivePackages).slice(0, 4);
    const icons = ["landscape", "sailing", "forest", "beach_access"];
    const tags = ["Highland Mist", "Backwater Cruise", "Wild Rainforest", "Coastal Bliss"];

    return list.map((p, idx) => ({
      title: p.title,
      tag: p.destination_name || tags[idx % tags.length],
      icon: icons[idx % icons.length],
      duration: `${p.duration_nights}N / ${p.duration_days}D`,
      desc: p.short_description || defaultTours[idx % defaultTours.length].desc,
      price: `₹${p.starting_price.toLocaleString("en-IN")}`,
      image: p.gallery?.[0] || defaultTours[idx % defaultTours.length].image,
      slug: p.slug,
    }));
  })();

  return (
    <section className="w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl 2xl:max-w-[1360px] mx-auto overflow-hidden" id="kerala-tours">
      {/* Header with scroll reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-label-sm text-label-sm tracking-widest uppercase text-primary font-semibold">
              {keralaBadge}
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-4">
            {keralaTitle}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {keralaSubtitle}
          </p>
        </div>
        <motion.a
          whileHover={{ scale: 1.03, x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all self-start md:self-end btn-shimmer active:scale-[0.98]"
          href="/packages?category=kerala"
        >
          <span>Explore All Kerala Tours</span>
          <span className="material-symbols-outlined text-[18px]">east</span>
        </motion.a>
      </motion.div>

      {/* Editorial 4-Card Showcase Grid with Staggered Viewport Entrance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tours.map((tour, idx) => (
          <motion.div
            key={tour.title}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.75,
              delay: idx * 0.12,
              ease: APPLE_EASE,
            }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="laptop-card-hover group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-outline-variant/15"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md shadow-sm border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">
                  {tour.duration}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-surface/85 backdrop-blur-md border border-outline-variant/15">
                <span className="font-label-sm text-label-sm text-primary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">{tour.icon}</span>
                  {tour.tag}
                </span>
              </div>
            </div>

            <div className="p-5 lg:p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">
                  {tour.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-3">
                  {tour.desc}
                </p>
              </div>

              <div className="pt-4 mt-auto border-t-0 bg-surface-container-low/50 -mx-5 lg:-mx-6 -mb-5 lg:-mb-6 p-5 lg:p-6">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Starting from</span>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">{tour.price}</span>
                    <span className="font-body-sm text-body-sm text-outline">/person</span>
                  </div>
                </div>
                <p className="font-label-sm text-label-sm text-outline mb-4">Sample estimate • Verified upon enquiry</p>
                <div className="flex items-center gap-2">
                  <Link
                    className="group/btn w-full py-2.5 px-4 text-center rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-label-md text-label-md text-on-surface transition-all btn-shimmer active:scale-[0.98] flex items-center justify-center gap-1.5"
                    href={`/packages/${tour.slug}`}
                  >
                    <span>View Tour Details</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover/btn:translate-x-1">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
