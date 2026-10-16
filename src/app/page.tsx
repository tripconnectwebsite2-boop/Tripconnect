import Header from "@/components/Header";
import Hero from "@/components/Hero";
import KeralaTours from "@/components/KeralaTours";
import FeaturedPackages from "@/components/FeaturedPackages";
import Destinations from "@/components/Destinations";
import WhyTripConnect from "@/components/WhyTripConnect";
import Reviews from "@/components/Reviews";
import SpecialOffer from "@/components/SpecialOffer";
import PlanTripForm from "@/components/PlanTripForm";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AmbientBackgroundMotion from "@/components/AmbientBackgroundMotion";
import { getOffers, getReviews, getPackages, getDestinations, getSiteContent, getSiteSettings } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [activeOffers, approvedReviews, rawPackages, destinations, siteContent, siteSettings] = await Promise.all([
    getOffers(true), // Only current active verified offers
    getReviews(true), // Only approved genuine reviews
    getPackages({ status: "published" }), // Only published packages
    getDestinations(true), // Only active destinations
    getSiteContent(),
    getSiteSettings(),
  ]);

  const publishedPackages = rawPackages.filter(
    (p) => p.status === "published" && p.content_verified && !p.slug.endsWith("-draft")
  );

  return (
    <>
      <Header content={siteContent} />
      <AmbientBackgroundMotion />
      <main className="relative z-10 w-full pt-20 bg-transparent min-h-[calc(100vh-280px)]">
        <div className="flex flex-col w-full">
          <Hero content={siteContent} />
          <KeralaTours content={siteContent} packages={publishedPackages} />
          <FeaturedPackages packages={publishedPackages} />
          <Destinations destinations={destinations} />
          <WhyTripConnect content={siteContent} />
          {/* Conditionally rendered: Only displayed if genuine approved reviews exist */}
          {approvedReviews.length > 0 && (
            <Reviews
              rating={siteSettings.google_rating}
              reviewCount={siteSettings.google_review_count}
              reviewsUrl={siteSettings.google_reviews_url}
            />
          )}
          {/* Conditionally rendered: Only displayed if approved active current offers exist */}
          {activeOffers.length > 0 && <SpecialOffer offer={activeOffers[0]} offers={activeOffers} />}
          <PlanTripForm />
        </div>
      </main>
      <Footer content={siteContent} />
      <FloatingWhatsApp />
    </>
  );
}
