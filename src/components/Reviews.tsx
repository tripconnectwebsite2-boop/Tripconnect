"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { APPLE_EASE } from "@/lib/animation";

interface ReviewsProps {
  rating?: number;
  reviewCount?: number;
  reviewsUrl?: string;
}

export default function Reviews({
  rating: initialRating = 5.0,
  reviewCount: initialCount = 122,
  reviewsUrl: initialUrl = "https://www.google.com/search?sca_esv=3c37b919d1c0a20a&sxsrf=APpeQnsQBeFlGryg8C-3YNc9gCiwY-ybZg:1792077470654&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_ycx-DTCj1xuY2o22e4ADWu-gAQ93o0pN1Babfm2IQHvGzW4cDIuWmeHU5d7op1kp2QGhaaGzVrZjVwLOIv2v1EKhNkoXu8QNEF34ufqcaxAjPyE0A%3D%3D&q=Trip+Connect+Kochi+Reviews&sa=X&ved=2ahUKEwiN-bDoqLyXAxXbcGwGHe70K8wQ0bkNegQINhAH&biw=1920&bih=945&dpr=1",
}: ReviewsProps) {
  const [rating, setRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialCount);
  const [reviewsUrl, setReviewsUrl] = useState(initialUrl);

  useEffect(() => {
    fetch("/api/reviews/google")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          if (data.rating !== undefined) setRating(data.rating);
          if (data.review_count !== undefined) setReviewCount(data.review_count);
          if (data.reviews_url) setReviewsUrl(data.reviews_url);
        }
      })
      .catch(() => {});
  }, []);
  const reviews = [
    {
      author: "Abilraj Kr",
      avatar: "A",
      avatarBg: "bg-primary/10 text-primary",
      meta: "Local Guide • 12 reviews",
      time: "8 months ago",
      text: "“Thanks TRIP CONNECT HOLIDAY (GOURISHANKAR) for the excellent service! We enjoyed a lot. Good selection of Tree House, Resorts and Houseboat at Alleppey. The houseboat staff was very helpful and the food was awesome.”",
      circuit: "Alleppey & Wayanad Tour",
      likes: 2,
    },
    {
      author: "Suresh Jayakumar",
      avatar: "S",
      avatarBg: "bg-secondary/15 text-secondary",
      meta: "4 reviews",
      time: "5 months ago",
      text: "“Good journey. Trip was very good. Well arrangement done by Gowrish Shankar and driver was very polite. Positive approach throughout the trip.”",
      circuit: "Verified Booking",
      likes: 1,
    },
    {
      author: "Radhika Prabhakaran",
      avatar: "R",
      avatarBg: "bg-primary-container/20 text-primary",
      meta: "2 reviews",
      time: "4 months ago",
      text: "“Top-notch service from Trip Connect Kochi! Booked a taxi for a family trip and the experience was seamless. Driver was punctual, friendly, and super helpful. Highly recommend for reliable and comfortable travel in Kochi.”",
      circuit: "Family Tour",
      likes: 3,
    },
    {
      author: "Rithish Tours And Travels",
      avatar: "R",
      avatarBg: "bg-secondary-container text-on-secondary-container",
      meta: "Agency Collaboration",
      time: "3 months ago",
      text: "“Incredible Experience with Trip Connect Kochi! We booked a 3-day Munnar + Kochi tour with Trip Connect Kochi and it exceeded our expectations. Seamless coordination, courteous driver, and great care.”",
      circuit: "Munnar + Kochi Circuit",
      likes: 2,
    },
    {
      author: "Aswanth Pk",
      avatar: "A",
      avatarBg: "bg-tertiary-fixed text-on-tertiary-fixed",
      meta: "4 reviews",
      time: "6 months ago",
      text: "“Had an excellent experience booking through this car rental website. The process was smooth, transparent, and very easy to use. The pricing was clear with no hidden charges, vehicle was clean and well maintained.”",
      circuit: "Clear & Transparent",
      likes: 4,
    },
    {
      author: "Gokul Raveendran",
      avatar: "G",
      avatarBg: "bg-primary/10 text-primary",
      meta: "Local Guide • 5 reviews",
      time: "3 months ago",
      text: "“Smooth & Reliable Rides. Used Trip Connect for my whole Kochi trip. Driver showed up 10 mins early at Cochin Airport, car was clean and AC was freezing cold.”",
      circuit: "Airport Transfer & Tours",
      likes: 5,
    },
  ];

  return (
    <section className="w-full py-24 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden" id="guest-reviews">
      {/* Header with Viewport Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: APPLE_EASE }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-secondary" />
            <span className="font-label-sm text-label-sm tracking-widest uppercase text-secondary font-semibold">
              Client Stories
            </span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-3">
            Guest Experiences &amp; Reviews
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Authentic reviews from travelers exploring Kerala and beyond with our bespoke concierge desk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-end">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-md text-label-md shadow-sm transition-all"
            href={reviewsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Write a review</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Aggregate Rating Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: APPLE_EASE }}
        className="p-6 md:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high/80 flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  {rating.toFixed(1)}
                </span>
                <div className="flex items-center text-amber-500">
                  <span className="material-symbols-outlined text-[20px]">star</span>
                  <span className="material-symbols-outlined text-[20px]">star</span>
                  <span className="material-symbols-outlined text-[20px]">star</span>
                  <span className="material-symbols-outlined text-[20px]">star</span>
                  <span className="material-symbols-outlined text-[20px]">star</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-outline font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface">{reviewCount} reviews</span>
                <span>•</span>
                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Verified Google Reviews
                </a>
              </div>
            </div>
          </div>
        </div>


      </motion.div>

      {/* Reviews Grid with Staggered Viewport Entrance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <motion.div
            key={rev.author}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.1,
              ease: APPLE_EASE,
            }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full font-bold flex items-center justify-center font-headline-sm text-headline-sm ${rev.avatarBg}`}
                  >
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold">{rev.author}</h4>
                    <span className="font-body-sm text-body-sm text-outline block">{rev.meta}</span>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500 mb-3">
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="material-symbols-outlined text-[18px]">star</span>
                <span className="font-body-sm text-body-sm text-outline ml-2">{rev.time}</span>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {rev.text}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-outline font-body-sm text-body-sm">
              <span className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-[16px]">verified</span> {rev.circuit}
              </span>
              <span className="text-outline-variant font-label-sm">❤️ {rev.likes}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
