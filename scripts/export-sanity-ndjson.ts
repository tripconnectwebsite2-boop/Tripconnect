/**
 * Export Existing Website Content into Sanity NDJSON
 * Produces 'sanity-migration-dataset.ndjson' ready to import into Sanity Studio
 * using: `npx sanity dataset import sanity-migration-dataset.ndjson production`
 */

import fs from 'fs';
import path from 'path';
import {
  initialPackages,
  initialDestinations,
  initialTransportationVehicles,
  initialOffers,
  initialReviews,
  initialSettings,
  initialSiteContent,
} from '../src/lib/db/seed-data';

function generateNdjson() {
  const documents: any[] = [];

  // 1. Site Settings Singleton
  documents.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    businessName: initialSettings.business_name || 'Trip Connect',
    tagline: 'Premium Travel, Taxi & All-India Bus Booking Kochi',
    contactPhone: initialSettings.contact_phone || '+91 94951 86604',
    contactEmail: initialSettings.contact_email || 'tripconnectwebsite2@gmail.com',
    whatsappNumber: initialSettings.whatsapp_number || '919495186604',
    address: initialSettings.address || 'Kochi, Kerala, India - 682001',
    businessHours: initialSettings.business_hours || '24/7 Available (Chauffeur & Dispatch Service)',
    instagramHandle: initialSettings.instagram_handle || 'https://instagram.com/tripconnect',
    googleReviewsUrl: initialSettings.google_reviews_url || 'https://maps.app.goo.gl/tripconnect',
    announcement: {
      enabled: false,
      text: 'Special Monsoon Discounts Available on Backwater Houseboats',
    },
  });

  // 2. Global Theme Singleton
  documents.push({
    _id: 'themeSettings',
    _type: 'themeSettings',
    primaryColor: '#D4AF37',
    secondaryColor: '#059669',
    cardRadius: '24px',
    buttonRadius: 'full',
    maxContentWidth: '1360px',
  });

  // 3. Navigation Singleton
  documents.push({
    _id: 'navigation',
    _type: 'navigation',
    items: [
      { _key: 'nav-1', label: 'Home', link: '/' },
      { _key: 'nav-2', label: 'Packages', link: '/packages' },
      { _key: 'nav-3', label: 'Destinations', link: '/destinations' },
      { _key: 'nav-4', label: 'Transportation', link: '/transportation' },
      { _key: 'nav-5', label: 'Special Offers', link: '/offers' },
      { _key: 'nav-6', label: 'About', link: '/about' },
      { _key: 'nav-7', label: 'Contact', link: '/contact' },
    ],
    headerCta: {
      label: 'Book Cab / Bus',
      link: '/transportation#reserve-car',
      variant: 'primary',
      icon: 'directions_car',
      isExternal: false,
    },
    showPhoneInHeader: true,
  });

  // 4. Footer Settings Singleton
  documents.push({
    _id: 'footerSettings',
    _type: 'footerSettings',
    description:
      initialSiteContent.footer_description ||
      'Curated bespoke journeys across Kerala and India, crafted from Kochi. Experience backwater serenity, misty highland estates, and iconic cultural sanctuaries with our dedicated travel concierges.',
    columns: [
      {
        _key: 'col-1',
        title: 'Quick Links',
        links: [
          { _key: 'l-1', label: 'Home', link: '/' },
          { _key: 'l-2', label: 'All Packages', link: '/packages' },
          { _key: 'l-3', label: 'Destinations Atlas', link: '/destinations' },
          { _key: 'l-4', label: 'Transportation Fleet', link: '/transportation' },
          { _key: 'l-5', label: 'Special Offers', link: '/offers' },
        ],
      },
      {
        _key: 'col-2',
        title: 'Curated Experiences',
        links: [
          { _key: 'l-6', label: 'Munnar Tea Trails', link: '/packages/munnar-tea-trails' },
          { _key: 'l-7', label: 'Alleppey Houseboats', link: '/packages/classic-kerala' },
          { _key: 'l-8', label: 'Wayanad Highlands', link: '/packages/wayanad-coorg-highlands' },
          { _key: 'l-9', label: 'Golden Triangle', link: '/packages/golden-triangle-delhi-agra-jaipur' },
        ],
      },
      {
        _key: 'col-3',
        title: 'Company & Trust',
        links: [
          { _key: 'l-10', label: 'About Trip Connect', link: '/about' },
          { _key: 'l-11', label: 'Concierge Contact', link: '/contact' },
          { _key: 'l-12', label: 'Privacy Policy', link: '/privacy-policy' },
          { _key: 'l-13', label: 'Terms & Conditions', link: '/terms' },
          { _key: 'l-14', label: 'Report a Website Issue', link: '/report-bug' },
        ],
      },
    ],
    copyright: initialSiteContent.footer_copyright || `© ${new Date().getFullYear()} Trip Connect Kochi. All rights reserved.`,
    showTrustBadges: true,
  });

  // 5. Global SEO Singleton
  documents.push({
    _id: 'globalSeo',
    _type: 'globalSeo',
    siteTitle: 'Trip Connect | Kerala Tour Packages, Luxury Taxi & Bus Booking Kochi',
    titleTemplate: '%s | Trip Connect Kochi',
    metaDescription:
      'Award-winning tour operator in Kochi offering luxury Kerala holiday packages, Munnar tea trail tours, Alleppey houseboats, chauffeur car rentals, and All-India Volvo sleeper bus charters.',
    defaultKeywords: [
      'Kerala tour packages',
      'Kochi taxi service',
      'Munnar tour package',
      'Alleppey houseboat booking',
      'Mercedes car rental Kochi',
      'Volvo sleeper bus booking',
    ],
    twitterHandle: '@tripconnect',
    organizationSchema: {
      legalName: 'Trip Connect Holidays Kochi',
      foundingDate: '2020',
      priceRange: '₹₹ - ₹₹₹₹',
      areaServed: 'Kerala, South India, Pan-India',
    },
  });

  // 6. Destinations
  initialDestinations.forEach((dest, idx) => {
    documents.push({
      _id: `destination-${dest.id || dest.slug}`,
      _type: 'destination',
      name: dest.name,
      slug: { _type: 'slug', current: dest.slug },
      region: dest.region,
      tagline: dest.tagline,
      shortDescription: dest.short_description,
      description: dest.description,
      order: idx + 1,
      status: 'published',
      seo: {
        metaTitle: dest.seo_title || `${dest.name} Tour Packages | Trip Connect`,
        metaDescription: dest.seo_description || dest.short_description,
      },
    });
  });

  // 7. Tour Packages
  initialPackages.forEach((pkg, idx) => {
    documents.push({
      _id: `package-${pkg.id || pkg.slug}`,
      _type: 'travelPackage',
      title: pkg.title,
      slug: { _type: 'slug', current: pkg.slug },
      order: idx + 1,
      status: pkg.status === 'published' ? 'published' : 'draft',
      publishedAt: pkg.published_at || new Date().toISOString(),
      destinationName: pkg.destination_name,
      category: pkg.category,
      isFeatured: Boolean(pkg.is_featured),
      startingPrice: pkg.starting_price,
      currency: pkg.currency || 'INR',
      durationDays: pkg.duration_days,
      durationNights: pkg.duration_nights,
      shortDescription: pkg.short_description,
      description: pkg.description,
      highlights: pkg.highlights || [],
      itinerary: (pkg.itinerary || []).map((day) => ({
        _key: `day-${day.day}`,
        day: day.day,
        title: day.title,
        description: day.description,
        activity: day.activity,
      })),
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      accommodationDetails: pkg.accommodation_details,
      departureDates: pkg.departure_dates || 'Daily Private Departures',
      seo: {
        metaTitle: pkg.seo_title || `${pkg.title} | Trip Connect`,
        metaDescription: pkg.seo_description || pkg.short_description,
      },
    });
  });

  // 8. Transportation Fleet (Exact 13 models)
  initialTransportationVehicles.forEach((veh, idx) => {
    documents.push({
      _id: `vehicle-${veh.id}`,
      _type: 'transportationVehicle',
      name: veh.name,
      category: veh.category,
      order: veh.order || idx + 1,
      brand: veh.brand,
      subtitle: veh.subtitle,
      badge: veh.badge,
      startingPrice: veh.starting_price,
      capacityPax: String(veh.capacity_pax),
      capacityLuggage: String(veh.capacity_luggage),
      bestFor: veh.best_for,
      features: veh.features || [],
      description: veh.description,
      routes: veh.routes || [],
      isActive: veh.is_active ?? true,
    });
  });

  // 9. Special Offers
  initialOffers.forEach((offer, idx) => {
    documents.push({
      _id: `offer-${offer.id}`,
      _type: 'specialOffer',
      title: offer.title,
      description: offer.description,
      discountType: offer.discount_type,
      discountValue: offer.discount_value,
      validFrom: offer.valid_from || '2026-06-01',
      validUntil: offer.valid_until || '2026-12-31',
      status: offer.status === 'active' ? 'active' : 'draft',
      order: idx + 1,
    });
  });

  // 10. Customer Reviews
  initialReviews.forEach((rev, idx) => {
    documents.push({
      _id: `review-${rev.id}`,
      _type: 'customerReview',
      customerDisplayName: rev.customer_display_name,
      reviewText: rev.review_text,
      rating: rev.rating || 5,
      sourceOrVerificationNote: rev.source_or_verification_note,
      status: rev.status === 'approved' ? 'approved' : 'draft',
      order: idx + 1,
      createdAt: rev.created_at || new Date().toISOString(),
    });
  });

  // 11. Home Page with Modular Page Builder Sections!
  documents.push({
    _id: 'page-home',
    _type: 'page',
    title: 'Home',
    slug: { _type: 'slug', current: 'home' },
    status: 'published',
    pageBuilder: [
      {
        _key: 'sec-hero',
        _type: 'heroSection',
        badge: initialSiteContent.hero_badge || '',
        title: initialSiteContent.hero_title || 'Discover God’s Own Country with Kochi’s Most Trusted Travel Concierge',
        subtitle: initialSiteContent.hero_subtitle || 'Bespoke holiday packages, backwater houseboats, luxury chauffeur sedans, and All-India Volvo sleeper coaches.',
        primaryCta: {
          label: initialSiteContent.hero_primary_cta_text || 'Explore Travel Packages',
          link: initialSiteContent.hero_primary_cta_link || '#packages',
          variant: 'primary',
        },
        secondaryCta: {
          label: initialSiteContent.hero_secondary_cta_text || 'Book Cab / Bus',
          link: initialSiteContent.hero_secondary_cta_link || '/transportation',
          variant: 'secondary',
        },
        floatingBadge: initialSiteContent.hero_floating_badge || '4.9 ★ Rated by 500+ Travelers',
      },
      {
        _key: 'sec-kerala',
        _type: 'keralaToursSection',
        badge: initialSiteContent.kerala_badge || 'Signature Kerala Circuits',
        title: initialSiteContent.kerala_title || 'Immerse Yourself in Kerala’s Enchanting Landscapes',
        subtitle: initialSiteContent.kerala_subtitle || 'From mist-laden tea hills to tranquil palm-fringed backwaters.',
      },
      {
        _key: 'sec-transport',
        _type: 'transportationSection',
        title: initialSiteContent.home_transport_title || 'Transportation, Taxi & Luxury Chauffeur Services',
        subtitle: initialSiteContent.home_transport_subtitle || 'Trusted, transparent, and private mobility across Kerala and nationwide.',
        ctaText: initialSiteContent.home_transport_cta_text || 'View Full Fleet & Book Online',
      },
      {
        _key: 'sec-packages',
        _type: 'featuredPackagesSection',
        badge: 'Curated Experiences',
        title: 'Handpicked Kerala & South India Packages',
        subtitle: 'Every itinerary is privately managed with handpicked luxury resorts, verified drivers, and authentic cultural experiences.',
        maxItems: 6,
      },
      {
        _key: 'sec-destinations',
        _type: 'destinationsSection',
        badge: 'Trending Destinations',
        title: 'Iconic Kerala Destinations',
        subtitle: 'From misty Munnar tea hills to serene Alleppey backwaters and Fort Kochi heritage.',
      },
      {
        _key: 'sec-why',
        _type: 'whyChooseUsSection',
        badge: initialSiteContent.why_badge || 'The Trip Connect Difference',
        title: initialSiteContent.why_title || 'Why Discerning Travelers Choose Trip Connect',
        subtitle: initialSiteContent.why_subtitle || 'Decades of Kerala hospitality, transparent pricing, and 24/7 on-road concierge.',
      },
      {
        _key: 'sec-reviews',
        _type: 'reviewsSection',
        badge: 'Verified Guest Experiences',
        title: 'Loved by Hundreds of Travelers',
        subtitle: 'Real stories from verified guests who explored Kerala, Tamil Nadu, and Karnataka with our team.',
        showGoogleReviewButton: true,
      },
      {
        _key: 'sec-cta',
        _type: 'callToActionSection',
        title: 'Ready to Experience God’s Own Country?',
        subtitle: 'Speak directly with our local travel specialists in Kochi. We customize itineraries in under 30 minutes.',
        primaryCta: {
          label: 'WhatsApp Dispatch',
          link: 'https://wa.me/919495186604',
          variant: 'emerald',
          isExternal: true,
        },
      },
    ],
    seo: {
      metaTitle: 'Trip Connect | Kerala Tour Packages, Luxury Taxi & Bus Booking Kochi',
      metaDescription: 'Award-winning tour operator in Kochi offering luxury Kerala holiday packages, Munnar tea trail tours, Alleppey houseboats, chauffeur car rentals, and All-India Volvo sleeper bus charters.',
    },
  });

  const outputPath = path.join(process.cwd(), 'sanity-migration-dataset.ndjson');
  const ndjson = documents.map((doc) => JSON.stringify(doc)).join('\n');
  fs.writeFileSync(outputPath, ndjson, 'utf-8');

  console.log(`\n==================================================`);
  console.log(`✅ EXPORT COMPLETE: ${documents.length} Sanity documents generated!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`==================================================\n`);
}

generateNdjson();
