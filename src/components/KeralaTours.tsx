"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { APPLE_EASE } from "@/lib/animation";
import { SiteContent } from "@/lib/types";

export default function KeralaTours({ content }: { content?: Partial<SiteContent> }) {
  const keralaBadge = content?.kerala_badge || "Flagship Journeys";
  const keralaTitle = content?.kerala_title || "Discover the Beauty of Kerala";
  const keralaSubtitle = content?.kerala_subtitle || "Handcrafted routes through God’s Own Country, from mist-kissed highlands to tranquil backwater lagoons.";
  const tours = [
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
      slug: "alleppey-houseboat-retreat",
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
      slug: "wayanad-rainforest-wildlife-retreat-draft",
    },
    {
      title: "Varkala Cliffside & Serenity",
      tag: "Coastal Bliss",
      icon: "beach_access",
      duration: "2N / 3D",
      desc: "Arabian Sea sunsets from red cliffs, morning coastal yoga sessions, and soothing mineral water springs.",
      price: "₹12,800",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDqhSF1rQ9FshAFS2pdPFJJkYF1bO1qPrjbRy6lVElxMJnextwpOP2W90i_2DPNINSQ63D756zhEGRRbvI8U4NIt6rwUVJ52KUxib39vCbj3HdvKYAf0Yua8lVYpb7ezdG9ohybcoqh2njLgOdU-vlBaIPeVYPekCGjjVZdSq1xo85WUX4IU6-_NnfKgd21rvgE9mpAWGdgzgrx8cI7NDmm6g3wYELlrdUBJ5ln4OPCNdGYTf5rKhRKVg",
      slug: "varkala-cliffside-coastal-escape",
    },
  ];

  return (
    <section className="w-full py-24 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden" id="kerala-tours">
      {/* Header with scroll reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
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
            className="group flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-outline-variant/15"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-high">
              <img
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                alt={tour.title}
                src={tour.image}
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md shadow-sm">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">
                  {tour.duration}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-surface/85 backdrop-blur-md">
                <span className="font-label-sm text-label-sm text-primary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">{tour.icon}</span>
                  {tour.tag}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">
                  {tour.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
                  {tour.desc}
                </p>
              </div>

              <div className="pt-4 mt-auto border-t-0 bg-surface-container-low/50 -mx-6 -mb-6 p-6">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Starting from</span>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{tour.price}</span>
                    <span className="font-body-sm text-body-sm text-outline">/person</span>
                  </div>
                </div>
                <p className="font-label-sm text-label-sm text-outline mb-4">Sample estimate • Verified upon enquiry</p>
                <div className="flex items-center gap-2">
                  <Link
                    className="w-full py-2.5 text-center rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary font-label-md text-label-md text-on-surface transition-all btn-shimmer active:scale-[0.98]"
                    href={`/packages/${tour.slug}`}
                  >
                    View Tour Details
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
