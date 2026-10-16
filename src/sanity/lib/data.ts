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
    if (cmsSettings.businessName && !local.brand_name) merged.brand_name = cmsSettings.businessName;
    if (cmsSettings.logoUrl && !local.logo_url) merged.logo_url = cmsSettings.logoUrl;
    if (cmsSettings.contactPhone && !local.contact_phone) merged.contact_phone = cmsSettings.contactPhone;
    if (cmsSettings.contactEmail && !local.contact_email) merged.contact_email = cmsSettings.contactEmail;
    if (cmsSettings.whatsappNumber && !local.whatsapp_number) merged.whatsapp_number = cmsSettings.whatsappNumber;
    if (cmsSettings.address && !local.contact_address) merged.contact_address = cmsSettings.address;
    if (cmsSettings.businessHours && !local.business_hours) merged.business_hours = cmsSettings.businessHours;
  }

  // If a Sanity Page Builder page exists for "home", map its sections
  // Local admin modifications take priority so updates in /admin/content are never lost
  if (cmsHome?.pageBuilder && Array.isArray(cmsHome.pageBuilder)) {
    const hero = cmsHome.pageBuilder.find((s: any) => s._type === 'heroSection');
    if (hero) {
      merged.hero_badge = local.hero_badge || hero.badge || merged.hero_badge;
      merged.hero_title = local.hero_title || hero.title || merged.hero_title;
      merged.hero_subtitle = local.hero_subtitle || hero.subtitle || merged.hero_subtitle;
      merged.hero_bg_image = local.hero_bg_image || hero.bgImageUrl || merged.hero_bg_image;
      merged.hero_primary_cta_text = local.hero_primary_cta_text || hero.primaryCta?.label || merged.hero_primary_cta_text;
      merged.hero_primary_cta_link = local.hero_primary_cta_link || hero.primaryCta?.link || merged.hero_primary_cta_link;
      merged.hero_secondary_cta_text = local.hero_secondary_cta_text || hero.secondaryCta?.label || merged.hero_secondary_cta_text;
      merged.hero_secondary_cta_link = local.hero_secondary_cta_link || hero.secondaryCta?.link || merged.hero_secondary_cta_link;
      merged.hero_floating_badge = local.hero_floating_badge || hero.floatingBadge || merged.hero_floating_badge;
    }

    const kerala = cmsHome.pageBuilder.find((s: any) => s._type === 'keralaToursSection');
    if (kerala) {
      merged.kerala_badge = local.kerala_badge || kerala.badge || merged.kerala_badge;
      merged.kerala_title = local.kerala_title || kerala.title || merged.kerala_title;
      merged.kerala_subtitle = local.kerala_subtitle || kerala.subtitle || merged.kerala_subtitle;
      merged.kerala_image = local.kerala_image || kerala.featureImageUrl || merged.kerala_image;
    }

    const transport = cmsHome.pageBuilder.find((s: any) => s._type === 'transportationSection');
    if (transport) {
      merged.home_transport_title = local.home_transport_title || transport.title || merged.home_transport_title;
      merged.home_transport_subtitle = local.home_transport_subtitle || transport.subtitle || merged.home_transport_subtitle;
      merged.home_transport_cta_text = local.home_transport_cta_text || transport.ctaText || merged.home_transport_cta_text;
    }

    const why = cmsHome.pageBuilder.find((s: any) => s._type === 'whyChooseUsSection');
    if (why) {
      merged.why_badge = local.why_badge || why.badge || merged.why_badge;
      merged.why_title = local.why_title || why.title || merged.why_title;
      merged.why_subtitle = local.why_subtitle || why.subtitle || merged.why_subtitle;
      merged.why_image = local.why_image || why.imageUrl || merged.why_image;
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
  const [cmsPackages, localPackages] = await Promise.all([
    fetchSanitySafe<any[]>(allPackagesQuery),
    getLocalPackages(options).catch(() => []),
  ]);

  const mappedCms: TravelPackage[] = (cmsPackages || []).map((p) => ({
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

  // Smart merge: Index by slug/id. Prefer the newest updated item.
  const packageMap = new Map<string, TravelPackage>();

  for (const p of mappedCms) {
    const key = p.slug || p.id;
    if (key) packageMap.set(key, p);
  }

  for (const lp of localPackages) {
    const key = lp.slug || lp.id;
    if (!key) continue;
    const existing = packageMap.get(key);
    if (!existing) {
      packageMap.set(key, lp);
    } else {
      const localTime = new Date(lp.updated_at || 0).getTime();
      const cmsTime = new Date(existing.updated_at || 0).getTime();
      if (localTime >= cmsTime) {
        packageMap.set(key, { ...existing, ...lp });
      }
    }
  }

  let list = Array.from(packageMap.values());

  if (options.category) {
    list = list.filter((p) => p.category === options.category);
  }
  if (options.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }
  return list;
}

export async function getCmsPackageBySlug(slug: string): Promise<TravelPackage | null> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any>(packageBySlugQuery, { slug }),
    getLocalPackageBySlug(slug).catch(() => null),
  ]);

  if (!cms) return local;
  if (!local) {
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

  const localTime = new Date(local.updated_at || 0).getTime();
  const cmsTime = new Date(cms._updatedAt || 0).getTime();
  if (localTime >= cmsTime) {
    return local;
  }

  return {
    ...local,
    id: cms._id,
    title: cms.title || local.title,
    category: cms.category || local.category,
    short_description: cms.shortDescription || local.short_description,
    description: cms.description || local.description,
    starting_price: cms.startingPrice || local.starting_price,
    duration_days: cms.durationDays || local.duration_days,
    duration_nights: cms.durationNights || local.duration_nights,
    highlights: cms.highlights || local.highlights,
    itinerary: (cms.itinerary || []).map((it: any) => ({
      day: it.day,
      title: it.title,
      description: it.description,
      activity: it.activity,
      image: it.imageUrl,
    })),
    gallery: (cms.gallery || []).map((g: any) => g.url).filter(Boolean),
    updated_at: cms._updatedAt || local.updated_at,
  };
}

// -----------------------------------------------------------------------------
// Destinations
// -----------------------------------------------------------------------------

export async function getCmsDestinations(): Promise<Destination[]> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any[]>(allDestinationsQuery),
    getLocalDestinations().catch(() => []),
  ]);

  const mappedCms: Destination[] = (cms || []).map((d) => ({
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
  }));

  const destMap = new Map<string, Destination>();
  for (const d of mappedCms) {
    const key = d.slug || d.id;
    if (key) destMap.set(key, d);
  }

  for (const ld of local) {
    const key = ld.slug || ld.id;
    if (!key) continue;
    const existing = destMap.get(key);
    if (!existing) {
      destMap.set(key, ld);
    } else {
      const localTime = new Date(ld.updated_at || 0).getTime();
      const cmsTime = new Date(existing.updated_at || 0).getTime();
      if (localTime >= cmsTime) {
        destMap.set(key, { ...existing, ...ld });
      }
    }
  }

  return Array.from(destMap.values());
}

export async function getCmsDestinationBySlug(slug: string): Promise<Destination | null> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any>(destinationBySlugQuery, { slug }),
    getLocalDestinationBySlug(slug).catch(() => null),
  ]);

  if (!cms) return local;
  if (!local) {
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

  const localTime = new Date(local.updated_at || 0).getTime();
  const cmsTime = new Date(cms._updatedAt || 0).getTime();
  if (localTime >= cmsTime) {
    return local;
  }

  return {
    ...local,
    id: cms._id,
    name: cms.name || local.name,
    region: cms.region || local.region,
    tagline: cms.tagline || local.tagline,
    short_description: cms.shortDescription || local.short_description,
    description: cms.description || local.description,
    cover_image: cms.coverImageUrl || local.cover_image,
    hero_image: cms.heroImageUrl || local.hero_image,
    updated_at: cms._updatedAt || local.updated_at,
  };
}

// -----------------------------------------------------------------------------
// Transportation Fleet
// -----------------------------------------------------------------------------

export async function getCmsTransportationVehicles(options: {
  category?: VehicleCategory;
  activeOnly?: boolean;
} = {}): Promise<TransportationVehicle[]> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any[]>(allVehiclesQuery),
    getLocalVehicles(options).catch(() => []),
  ]);

  const mappedCms: TransportationVehicle[] = (cms || []).map((v) => ({
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

  const vehicleMap = new Map<string, TransportationVehicle>();
  for (const v of mappedCms) {
    const key = (v.id || v.name).toLowerCase();
    vehicleMap.set(key, v);
  }

  for (const lv of local) {
    const key = (lv.id || lv.name).toLowerCase();
    const existing = vehicleMap.get(key);
    if (!existing) {
      vehicleMap.set(key, lv);
    } else {
      const localTime = new Date(lv.updated_at || 0).getTime();
      const cmsTime = new Date(existing.updated_at || 0).getTime();
      if (localTime >= cmsTime) {
        vehicleMap.set(key, { ...existing, ...lv });
      }
    }
  }

  let list = Array.from(vehicleMap.values());
  list.sort((a, b) => (a.order || 0) - (b.order || 0));

  if (options.category) {
    list = list.filter((v) => v.category === options.category);
  }
  if (options.activeOnly !== false) {
    list = list.filter((v) => v.is_active);
  }
  return list;
}

// -----------------------------------------------------------------------------
// Special Offers & Customer Reviews
// -----------------------------------------------------------------------------

export async function getCmsSpecialOffers(): Promise<SpecialOffer[]> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any[]>(allOffersQuery),
    getLocalOffers().catch(() => []),
  ]);

  const mappedCms: SpecialOffer[] = (cms || []).map((o) => ({
    id: o._id,
    title: o.title,
    description: o.description,
    package_title: o.packageTitle || null,
    discount_type: (o.discountType as any) || 'percentage',
    discount_value: o.discountValue || null,
    valid_from: o.validFrom || '',
    valid_until: o.validUntil || '',
    status: (o.status as any) || 'active',
    content_verified: true,
    created_at: o._createdAt || new Date().toISOString(),
    updated_at: o._updatedAt || new Date().toISOString(),
  }));

  const offerMap = new Map<string, SpecialOffer>();
  for (const o of mappedCms) {
    if (o.id) offerMap.set(o.id, o);
  }

  for (const lo of local) {
    if (!lo.id) continue;
    const existing = offerMap.get(lo.id);
    if (!existing) {
      offerMap.set(lo.id, lo);
    } else {
      const localTime = new Date(lo.updated_at || 0).getTime();
      const cmsTime = new Date(existing.updated_at || 0).getTime();
      if (localTime >= cmsTime) {
        offerMap.set(lo.id, { ...existing, ...lo });
      }
    }
  }

  return Array.from(offerMap.values());
}

export async function getCmsCustomerReviews(): Promise<Review[]> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any[]>(allReviewsQuery),
    getLocalReviews(true).catch(() => []),
  ]);

  const mappedCms: Review[] = (cms || []).map((r) => ({
    id: r._id,
    customer_display_name: r.customerDisplayName || r.authorName || 'Guest',
    review_text: r.reviewText || r.comment || '',
    rating: r.rating || 5,
    source_or_verification_note: r.sourceOrVerificationNote || 'Google Verified Guest',
    status: (r.status as any) === 'draft' ? 'draft' : 'approved',
    created_at: r.createdAt || r.reviewDate || new Date().toISOString(),
    updated_at: r._updatedAt || new Date().toISOString(),
  }));

  const reviewMap = new Map<string, Review>();
  for (const r of mappedCms) {
    if (r.id) reviewMap.set(r.id, r);
  }

  for (const lr of local) {
    if (!lr.id) continue;
    const existing = reviewMap.get(lr.id);
    if (!existing) {
      reviewMap.set(lr.id, lr);
    } else {
      const localTime = new Date(lr.updated_at || 0).getTime();
      const cmsTime = new Date(existing.updated_at || 0).getTime();
      if (localTime >= cmsTime) {
        reviewMap.set(lr.id, { ...existing, ...lr });
      }
    }
  }

  return Array.from(reviewMap.values());
}

// -----------------------------------------------------------------------------
// Custom Page with Page Builder
// -----------------------------------------------------------------------------

export async function getCmsPageBySlug(slug: string): Promise<any | null> {
  const cms = await fetchSanitySafe<any>(pageBySlugQuery, { slug });
  if (cms) return cms;
  return getLocalPageBySlug(slug);
}
