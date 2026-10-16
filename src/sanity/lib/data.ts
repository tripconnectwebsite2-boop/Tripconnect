import { isSanityConfigured } from '../env';
import { sanityClient } from './client';
import {
  siteSettingsQuery,
  themeSettingsQuery,
  navigationQuery,
  footerSettingsQuery,
  globalSeoQuery,
  allPackagesQuery,
  packageBySlugQuery,
  allDestinationsQuery,
  destinationBySlugQuery,
  allVehiclesQuery,
  allOffersQuery,
  allReviewsQuery,
  pageBySlugQuery,
} from './queries';
import {
  getSiteSettings as getLocalSiteSettings,
  getSiteContent as getLocalSiteContent,
  getPackages as getLocalPackages,
  getPackageBySlug as getLocalPackageBySlug,
  getDestinations as getLocalDestinations,
  getDestinationBySlug as getLocalDestinationBySlug,
  getTransportationVehicles as getLocalVehicles,
  getOffers as getLocalOffers,
  getReviews as getLocalReviews,
  getCustomPageBySlug as getLocalPageBySlug,
} from '@/lib/db';
import {
  TravelPackage,
  Destination,
  TransportationVehicle,
  VehicleCategory,
  SpecialOffer,
  Review,
  SiteSettings,
  SiteContent,
} from '@/lib/types';

// Cache revalidation time for Next.js ISR (e.g. 60 seconds)
export const REVALIDATE_TIME = 60;

/**
 * Fetch with safe Sanity-first query and automatic fallback to local db
 */
async function fetchSanitySafe<T>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  if (!isSanityConfigured()) {
    return null;
  }
  try {
    const data = await sanityClient.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_TIME },
    });
    return data;
  } catch (err: any) {
    console.warn(`[Sanity CMS] Query failed, falling back to local store:`, err?.message || err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Site Settings & Identity
// -----------------------------------------------------------------------------

export async function getCmsSiteSettings(): Promise<SiteSettings> {
  const cms = await fetchSanitySafe<any>(siteSettingsQuery);
  const local = await getLocalSiteSettings();

  if (!cms) return local;

  return {
    ...local,
    business_name: cms.businessName || local.business_name,
    contact_phone: cms.contactPhone || local.contact_phone,
    contact_email: cms.contactEmail || local.contact_email,
    whatsapp_number: cms.whatsappNumber || local.whatsapp_number,
    address: cms.address || local.address,
    business_hours: cms.businessHours || local.business_hours,
    instagram_handle: cms.instagramHandle || local.instagram_handle,
    google_reviews_url: cms.googleReviewsUrl || local.google_reviews_url,
    updated_at: new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// Site Content & Copy
// -----------------------------------------------------------------------------

export async function getCmsSiteContent(): Promise<SiteContent> {
  const local = await getLocalSiteContent();
  const cmsSettings = await fetchSanitySafe<any>(siteSettingsQuery);
  const cmsHome = await fetchSanitySafe<any>(pageBySlugQuery, { slug: 'home' });

  let merged: SiteContent = { ...local };

  if (cmsSettings) {
    if (cmsSettings.businessName) merged.brand_name = cmsSettings.businessName;
    if (cmsSettings.logoUrl) merged.logo_url = cmsSettings.logoUrl;
    if (cmsSettings.contactPhone) merged.contact_phone = cmsSettings.contactPhone;
    if (cmsSettings.contactEmail) merged.contact_email = cmsSettings.contactEmail;
    if (cmsSettings.whatsappNumber) merged.whatsapp_number = cmsSettings.whatsappNumber;
    if (cmsSettings.address) merged.contact_address = cmsSettings.address;
    if (cmsSettings.businessHours) merged.business_hours = cmsSettings.businessHours;
  }

  // If a Sanity Page Builder page exists for "home", map its sections to siteContent
  if (cmsHome?.pageBuilder && Array.isArray(cmsHome.pageBuilder)) {
    const hero = cmsHome.pageBuilder.find((s: any) => s._type === 'heroSection');
    if (hero) {
      if (hero.badge) merged.hero_badge = hero.badge;
      if (hero.title) merged.hero_title = hero.title;
      if (hero.subtitle) merged.hero_subtitle = hero.subtitle;
      if (hero.bgImageUrl) merged.hero_bg_image = hero.bgImageUrl;
      if (hero.primaryCta?.label) merged.hero_primary_cta_text = hero.primaryCta.label;
      if (hero.primaryCta?.link) merged.hero_primary_cta_link = hero.primaryCta.link;
      if (hero.secondaryCta?.label) merged.hero_secondary_cta_text = hero.secondaryCta.label;
      if (hero.secondaryCta?.link) merged.hero_secondary_cta_link = hero.secondaryCta.link;
      if (hero.floatingBadge) merged.hero_floating_badge = hero.floatingBadge;
    }

    const kerala = cmsHome.pageBuilder.find((s: any) => s._type === 'keralaToursSection');
    if (kerala) {
      if (kerala.badge) merged.kerala_badge = kerala.badge;
      if (kerala.title) merged.kerala_title = kerala.title;
      if (kerala.subtitle) merged.kerala_subtitle = kerala.subtitle;
      if (kerala.featureImageUrl) merged.kerala_image = kerala.featureImageUrl;
    }

    const transport = cmsHome.pageBuilder.find((s: any) => s._type === 'transportationSection');
    if (transport) {
      if (transport.title) merged.home_transport_title = transport.title;
      if (transport.subtitle) merged.home_transport_subtitle = transport.subtitle;
      if (transport.ctaText) merged.home_transport_cta_text = transport.ctaText;
    }

    const why = cmsHome.pageBuilder.find((s: any) => s._type === 'whyChooseUsSection');
    if (why) {
      if (why.badge) merged.why_badge = why.badge;
      if (why.title) merged.why_title = why.title;
      if (why.subtitle) merged.why_subtitle = why.subtitle;
      if (why.imageUrl) merged.why_image = why.imageUrl;
    }
  }

  return merged;
}

// -----------------------------------------------------------------------------
// Global Theme & Design Tokens
// -----------------------------------------------------------------------------

export interface CmsThemeTokens {
  primaryColor: string;
  secondaryColor: string;
  cardRadius: string;
  buttonRadius: string;
  maxContentWidth: string;
}

export async function getCmsThemeSettings(): Promise<CmsThemeTokens> {
  const cms = await fetchSanitySafe<any>(themeSettingsQuery);
  return {
    primaryColor: cms?.primaryColor || '#D4AF37',
    secondaryColor: cms?.secondaryColor || '#059669',
    cardRadius: cms?.cardRadius || '24px',
    buttonRadius: cms?.buttonRadius || 'full',
    maxContentWidth: cms?.maxContentWidth || '1360px',
  };
}

// -----------------------------------------------------------------------------
// Navigation & Footer
// -----------------------------------------------------------------------------

export interface CmsNavigationData {
  items: Array<{
    label: string;
    link: string;
    isCta?: boolean;
    isExternal?: boolean;
    badge?: string;
    children?: Array<{ label: string; link: string; description?: string }>;
  }>;
  headerCta?: {
    label: string;
    link: string;
    variant?: string;
    icon?: string;
  };
  showPhoneInHeader?: boolean;
}

export async function getCmsNavigation(): Promise<CmsNavigationData | null> {
  const cms = await fetchSanitySafe<any>(navigationQuery);
  return cms || null;
}

export interface CmsFooterData {
  description?: string;
  columns?: Array<{
    title: string;
    links: Array<{ label: string; link: string; isExternal?: boolean }>;
  }>;
  copyright?: string;
  legalLinks?: Array<{ label: string; link: string }>;
  showTrustBadges?: boolean;
}

export async function getCmsFooter(): Promise<CmsFooterData | null> {
  const cms = await fetchSanitySafe<any>(footerSettingsQuery);
  return cms || null;
}

// -----------------------------------------------------------------------------
// Global SEO
// -----------------------------------------------------------------------------

export interface CmsGlobalSeo {
  siteTitle?: string;
  titleTemplate?: string;
  metaDescription?: string;
  defaultOgImageUrl?: string;
  defaultKeywords?: string[];
  twitterHandle?: string;
  organizationSchema?: {
    legalName?: string;
    foundingDate?: string;
    priceRange?: string;
    areaServed?: string;
  };
}

export async function getCmsGlobalSeo(): Promise<CmsGlobalSeo | null> {
  const cms = await fetchSanitySafe<any>(globalSeoQuery);
  return cms || null;
}

// -----------------------------------------------------------------------------
// Travel Packages
// -----------------------------------------------------------------------------

export async function getCmsPackages(options: {
  category?: string;
  featuredOnly?: boolean;
} = {}): Promise<TravelPackage[]> {
  const cmsPackages = await fetchSanitySafe<any[]>(allPackagesQuery);

  if (cmsPackages && Array.isArray(cmsPackages) && cmsPackages.length > 0) {
    let filtered = cmsPackages.map((p) => ({
      id: p._id,
      title: p.title,
      slug: p.slug,
      destination_id: p.destinationSlug || null,
      destination_name: p.destinationName || '',
      category: p.category,
      short_description: p.shortDescription,
      description: p.description,
      starting_price: p.startingPrice,
      currency: p.currency || 'INR',
      duration_days: p.durationDays,
      duration_nights: p.durationNights,
      highlights: p.highlights || [],
      itinerary: (p.itinerary || []).map((it: any) => ({
        day: it.day,
        title: it.title,
        description: it.description,
        activity: it.activity,
        image: it.imageUrl,
      })),
      inclusions: p.inclusions || [],
      exclusions: p.exclusions || [],
      accommodation_details: p.accommodationDetails,
      gallery: (p.gallery || []).map((g: any) => g.url).filter(Boolean),
      departure_dates: p.departureDates,
      status: p.status || 'published',
      content_verified: true,
      is_featured: p.isFeatured || false,
      seo_title: p.seo?.metaTitle,
      seo_description: p.seo?.metaDescription,
      published_at: p.publishedAt,
      created_at: p._createdAt || new Date().toISOString(),
      updated_at: p._updatedAt || new Date().toISOString(),
    }));

    if (options.category) {
      filtered = filtered.filter((p) => p.category === options.category);
    }
    if (options.featuredOnly) {
      filtered = filtered.filter((p) => p.is_featured);
    }
    return filtered as TravelPackage[];
  }

  // Local fallback
  return getLocalPackages(options);
}

export async function getCmsPackageBySlug(slug: string): Promise<TravelPackage | null> {
  const cms = await fetchSanitySafe<any>(packageBySlugQuery, { slug });

  if (cms) {
    return {
      id: cms._id,
      title: cms.title,
      slug: cms.slug,
      destination_id: cms.destinationSlug || null,
      destination_name: cms.destinationName || '',
      category: cms.category,
      short_description: cms.shortDescription,
      description: cms.description,
      starting_price: cms.startingPrice,
      currency: cms.currency || 'INR',
      duration_days: cms.durationDays,
      duration_nights: cms.durationNights,
      highlights: cms.highlights || [],
      itinerary: (cms.itinerary || []).map((it: any) => ({
        day: it.day,
        title: it.title,
        description: it.description,
        activity: it.activity,
        image: it.imageUrl,
      })),
      inclusions: cms.inclusions || [],
      exclusions: cms.exclusions || [],
      accommodation_details: cms.accommodationDetails,
      gallery: (cms.gallery || []).map((g: any) => g.url).filter(Boolean),
      departure_dates: cms.departureDates,
      status: cms.status || 'published',
      content_verified: true,
      is_featured: cms.isFeatured || false,
      seo_title: cms.seo?.metaTitle,
      seo_description: cms.seo?.metaDescription,
      published_at: cms.publishedAt,
      created_at: cms._createdAt || new Date().toISOString(),
      updated_at: cms._updatedAt || new Date().toISOString(),
    } as TravelPackage;
  }

  return getLocalPackageBySlug(slug);
}

// -----------------------------------------------------------------------------
// Destinations
// -----------------------------------------------------------------------------

export async function getCmsDestinations(): Promise<Destination[]> {
  const cms = await fetchSanitySafe<any[]>(allDestinationsQuery);

  if (cms && Array.isArray(cms) && cms.length > 0) {
    return cms.map((d) => ({
      id: d._id,
      name: d.name,
      slug: d.slug,
      region: d.region,
      tagline: d.tagline,
      short_description: d.shortDescription,
      description: d.description,
      cover_image: d.coverImageUrl,
      hero_image: d.heroImageUrl,
      status: d.status || 'published',
      seo_title: d.seo?.metaTitle,
      seo_description: d.seo?.metaDescription,
      created_at: d._createdAt || new Date().toISOString(),
      updated_at: d._updatedAt || new Date().toISOString(),
    })) as Destination[];
  }

  return getLocalDestinations();
}

export async function getCmsDestinationBySlug(slug: string): Promise<Destination | null> {
  const cms = await fetchSanitySafe<any>(destinationBySlugQuery, { slug });

  if (cms) {
    return {
      id: cms._id,
      name: cms.name,
      slug: cms.slug,
      region: cms.region,
      tagline: cms.tagline,
      short_description: cms.shortDescription,
      description: cms.description,
      cover_image: cms.coverImageUrl,
      hero_image: cms.heroImageUrl,
      status: cms.status || 'published',
      seo_title: cms.seo?.metaTitle,
      seo_description: cms.seo?.metaDescription,
      created_at: cms._createdAt || new Date().toISOString(),
      updated_at: cms._updatedAt || new Date().toISOString(),
    } as Destination;
  }

  return getLocalDestinationBySlug(slug);
}

// -----------------------------------------------------------------------------
// Transportation Fleet
// -----------------------------------------------------------------------------

export async function getCmsTransportationVehicles(options: {
  category?: VehicleCategory;
  activeOnly?: boolean;
} = {}): Promise<TransportationVehicle[]> {
  const cms = await fetchSanitySafe<any[]>(allVehiclesQuery);

  if (cms && Array.isArray(cms) && cms.length > 0) {
    let list = cms.map((v) => ({
      id: v._id,
      name: v.name,
      category: v.category,
      brand: v.brand,
      subtitle: v.subtitle,
      badge: v.badge,
      image: v.image,
      starting_price: v.startingPrice,
      capacity_pax: v.capacityPax,
      capacity_luggage: v.capacityLuggage,
      best_for: v.bestFor,
      features: v.features || [],
      description: v.description,
      routes: v.routes || [],
      is_active: v.isActive ?? true,
      order: v.order || 1,
      created_at: v._createdAt || new Date().toISOString(),
      updated_at: v._updatedAt || new Date().toISOString(),
    }));

    if (options.category) {
      list = list.filter((v) => v.category === options.category);
    }
    if (options.activeOnly !== false) {
      list = list.filter((v) => v.is_active);
    }
    return list as TransportationVehicle[];
  }

  return getLocalVehicles(options);
}

// -----------------------------------------------------------------------------
// Special Offers & Customer Reviews
// -----------------------------------------------------------------------------

export async function getCmsSpecialOffers(): Promise<SpecialOffer[]> {
  const cms = await fetchSanitySafe<any[]>(allOffersQuery);

  if (cms && Array.isArray(cms) && cms.length > 0) {
    return cms.map((o) => ({
      id: o._id,
      title: o.title,
      description: o.description,
      package_title: o.packageTitle,
      discount_type: o.discountType || 'percentage',
      discount_value: o.discountValue,
      valid_from: o.validFrom,
      valid_until: o.validUntil,
      status: o.status || 'active',
      content_verified: true,
      created_at: o._createdAt || new Date().toISOString(),
      updated_at: o._updatedAt || new Date().toISOString(),
    })) as SpecialOffer[];
  }

  return getLocalOffers();
}

export async function getCmsCustomerReviews(): Promise<Review[]> {
  const cms = await fetchSanitySafe<any[]>(allReviewsQuery);

  if (cms && Array.isArray(cms) && cms.length > 0) {
    return cms.map((r) => ({
      id: r._id,
      customer_display_name: r.customerDisplayName,
      review_text: r.reviewText,
      rating: r.rating || 5,
      source_or_verification_note: r.sourceOrVerificationNote,
      status: 'approved',
      created_at: r.createdAt || new Date().toISOString(),
      updated_at: r._updatedAt || new Date().toISOString(),
    })) as Review[];
  }

  return getLocalReviews(true);
}

// -----------------------------------------------------------------------------
// Custom Page with Page Builder
// -----------------------------------------------------------------------------

export async function getCmsPageBySlug(slug: string): Promise<any | null> {
  const cms = await fetchSanitySafe<any>(pageBySlugQuery, { slug });
  if (cms) return cms;
  return getLocalPageBySlug(slug);
}
