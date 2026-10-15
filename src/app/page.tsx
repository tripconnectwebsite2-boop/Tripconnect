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
import { getOffers, getReviews, getPackages } from "@/lib/db";

export default async function Home() {
  const [activeOffers, approvedReviews, publishedPackages] = await Promise.all([
    getOffers(true), // Only current active verified offers
    getReviews(true), // Only approved genuine reviews
    getPackages({ status: "published" }), // Only published packages
  ]);

  return (
    <>
      <Header />
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-280px)]">
        <div className="flex flex-col w-full">
          <Hero />
          <KeralaTours />
          <FeaturedPackages />
          <Destinations />
          <WhyTripConnect />
          {/* Conditionally rendered: Only displayed if genuine approved reviews exist */}
          {approvedReviews.length > 0 && <Reviews />}
          {/* Conditionally rendered: Only displayed if approved active current offers exist */}
          {activeOffers.length > 0 && <SpecialOffer />}
          <PlanTripForm />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
