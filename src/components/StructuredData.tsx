import { getSiteSettings } from "@/lib/db";

export default async function StructuredData() {
  const settings = await getSiteSettings().catch(() => null);
  const ratingValue = (settings?.google_rating ?? 5.0).toFixed(1);
  const reviewCount = String(settings?.google_review_count ?? 122);
  const reviewsUrl =
    settings?.google_reviews_url ||
    "https://www.google.com/search?sca_esv=3c37b919d1c0a20a&sxsrf=APpeQnsQBeFlGryg8C-3YNc9gCiwY-ybZg:1792077470654&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_ycx-DTCj1xuY2o22e4ADWu-gAQ93o0pN1Babfm2IQHvGzW4cDIuWmeHU5d7op1kp2QGhaaGzVrZjVwLOIv2v1EKhNkoXu8QNEF34ufqcaxAjPyE0A%3D%3D&q=Trip+Connect+Kochi+Reviews&sa=X&ved=2ahUKEwiN-bDoqLyXAxXbcGwGHe70K8wQ0bkNegQINhAH&biw=1920&bih=945&dpr=1";

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: settings?.business_name || "Trip Connect",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ",
    "@id": "https://tripconnect.in",
    url: "https://tripconnect.in",
    telephone: settings?.contact_phone?.replace(/\s+/g, "") || "+919400886838",
    email: settings?.contact_email || "tripconnectwebsite2@gmail.com",
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ayyappankavu",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      postalCode: "682018",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.9984,
      longitude: 76.2866,
    },
    hasMap: "https://share.google/V0eWcp5SrScZDVig4",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: "5",
      worstRating: "1",
      url: reviewsUrl,
    },
    sameAs: [
      "https://instagram.com/tripconnectin",
      reviewsUrl,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
