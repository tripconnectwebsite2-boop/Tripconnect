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
import {
  initialDestinations,
  initialPackages,
  initialTransportationVehicles,
} from '@/lib/db/seed-data';

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

const DEFAULT_PACKAGE_GALLERY = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBsEueUPJrI0O1sHnvIQdp-xgXpkaYKfOkgLG6MC7pdryUyfy__v92icO0eIqpBYlE15-9goslKClobZY9z8oaCniCTHIB5G5ssC8EhDlcIrNcgMgjqyfniZ5typYoNow0w1ZzunISf4YBooojKwq3dxn1-LaKsVNNA4fxmrTJ0YAEgLoQIlWtwVBhWM2MfH9ffWIfAfJ89oaPVDmMPsvCUj4WWokPYvJ0KhoTul8CRrbBTqKSw15J8jw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDCzwJauBQYcLbtjGtABpJpcaUOhNXWkeONV1e_6XO5-ecYvYrgSypw1qr2W0oslFPX81kUzt-ZHQ9CZsyx-Pp03zo0bUkargRdMM7g5Um5MInTOH01gD8CTKxyZMyMwXmdmw9Eo3tBaOBQde3kPrMl-P7qcC359ZFyTMtMvMlmduh2YTAjNbTzORzljYpB21iRDw0CrblpxqWsvWuDbrA7pMo26-MRd3xAIM2GAcn7NH5p8gYx4gWPDw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDCXa4pkOq0ty9_41mIx9UTEheTGIuJxcg9o0D40EZJRkTZnoyL4hB1gCuk62Bvhd7lMOPIa26eBygCDhuweowtOxzg_CChGSVglWspZ0TZmJC7seoNVyu1DB_X_74wtIE5DbM2hvPryKN76goIUdONWjazCD4hkEN8ncjerEygEnCEFj6vYwl_fa-xKJwjOOE_eUwTDeFVCmWra8gE5fE72kVXD0LX-Nla2PYGEI6BnnTlwN9iwaGn0A',
];

export async function getCmsPackages(options: {
  category?: string;
  featuredOnly?: boolean;
} = {}): Promise<TravelPackage[]> {
  const [cmsPackages, localPackages] = await Promise.all([
    fetchSanitySafe<any[]>(allPackagesQuery),
    getLocalPackages(options).catch(() => []),
  ]);

  const seedMap = new Map<string, TravelPackage>();
  for (const sp of initialPackages) {
    if (sp.slug) seedMap.set(sp.slug.toLowerCase().trim(), sp);
    if (sp.id) seedMap.set(sp.id.toLowerCase().replace(/^pkg-/, '').trim(), sp);
  }

  const packageMap = new Map<string, TravelPackage>();

  const getPkgKey = (id?: string, slug?: string) => {
    if (slug) return slug.toLowerCase().trim();
    if (id) return id.toLowerCase().replace(/^package-/, '').replace(/^pkg-/, '').trim();
    return '';
  };

  // 1. Populate with local and seed packages so images are guaranteed
  for (const lp of localPackages) {
    const key = getPkgKey(lp.id, lp.slug);
    const seed = seedMap.get(key) || seedMap.get((lp.slug || '').toLowerCase().trim());
    const validGallery = (lp.gallery && lp.gallery.length > 0)
      ? lp.gallery
      : (seed?.gallery && seed.gallery.length > 0 ? seed.gallery : DEFAULT_PACKAGE_GALLERY);

    packageMap.set(key, {
      ...lp,
      gallery: validGallery,
    });
  }

  // 2. Overlay CMS documents
  if (cmsPackages && Array.isArray(cmsPackages)) {
    for (const p of cmsPackages) {
      const key = getPkgKey(p._id, p.slug);
      const existing = packageMap.get(key);
      const seed = seedMap.get(key) || seedMap.get((p.slug || '').toLowerCase().trim());

      const cmsGallery = (p.gallery || []).map((g: any) => g.url).filter(Boolean);
      const validGallery = cmsGallery.length > 0
        ? cmsGallery
        : (existing?.gallery?.length ? existing.gallery : (seed?.gallery?.length ? seed.gallery : DEFAULT_PACKAGE_GALLERY));

      if (!existing) {
        packageMap.set(key, {
          id: p._id,
          title: p.title,
          slug: p.slug,
          destination_id: p.destinationSlug || seed?.destination_id || null,
          destination_name: p.destinationName || seed?.destination_name || '',
          category: p.category || seed?.category || 'Kerala Tours',
          short_description: p.shortDescription || seed?.short_description || '',
          description: p.description || seed?.description || '',
          starting_price: p.startingPrice || seed?.starting_price || 0,
          currency: p.currency || seed?.currency || 'INR',
          duration_days: p.durationDays || seed?.duration_days || 5,
          duration_nights: p.durationNights || seed?.duration_nights || 4,
          highlights: p.highlights?.length ? p.highlights : (seed?.highlights || []),
          itinerary: (p.itinerary || []).map((it: any, i: number) => ({
            day: it.day,
            title: it.title,
            description: it.description,
            activity: it.activity,
            image: it.imageUrl || (seed?.itinerary?.[i]?.image) || validGallery[0],
          })),
          inclusions: p.inclusions?.length ? p.inclusions : (seed?.inclusions || []),
          exclusions: p.exclusions?.length ? p.exclusions : (seed?.exclusions || []),
          accommodation_details: p.accommodationDetails || seed?.accommodation_details || '',
          gallery: validGallery,
          departure_dates: p.departureDates || seed?.departure_dates || 'Daily Private Departures',
          status: p.status || 'published',
          content_verified: true,
          is_featured: p.isFeatured || false,
          seo_title: p.seo?.metaTitle || seed?.seo_title,
          seo_description: p.seo?.metaDescription || seed?.seo_description,
          published_at: p.publishedAt,
          created_at: p._createdAt || new Date().toISOString(),
          updated_at: p._updatedAt || new Date().toISOString(),
        });
      } else {
        const localTime = new Date(existing.updated_at || 0).getTime();
        const cmsTime = new Date(p._updatedAt || 0).getTime();

        if (cmsTime > localTime) {
          packageMap.set(key, {
            ...existing,
            title: p.title || existing.title,
            destination_name: p.destinationName || existing.destination_name,
            category: p.category || existing.category,
            short_description: p.shortDescription || existing.short_description,
            description: p.description || existing.description,
            starting_price: p.startingPrice || existing.starting_price,
            duration_days: p.durationDays || existing.duration_days,
            duration_nights: p.durationNights || existing.duration_nights,
            highlights: p.highlights?.length ? p.highlights : existing.highlights,
            inclusions: p.inclusions?.length ? p.inclusions : existing.inclusions,
            exclusions: p.exclusions?.length ? p.exclusions : existing.exclusions,
            accommodation_details: p.accommodationDetails || existing.accommodation_details,
            is_featured: p.isFeatured !== undefined ? p.isFeatured : existing.is_featured,
            status: p.status || existing.status,
            gallery: validGallery,
            updated_at: p._updatedAt,
          });
        } else {
          packageMap.set(key, {
            ...existing,
            gallery: existing.gallery?.length ? existing.gallery : validGallery,
          });
        }
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
  const all = await getCmsPackages();
  const clean = slug.toLowerCase().trim();
  const found = all.find(
    (p) => p.slug.toLowerCase().trim() === clean || p.id.toLowerCase().trim() === clean
  );
  if (found) return found;
  return getLocalPackageBySlug(slug);
}

// -----------------------------------------------------------------------------
// Destinations
// -----------------------------------------------------------------------------

export async function getCmsDestinations(): Promise<Destination[]> {
  const [cms, local] = await Promise.all([
    fetchSanitySafe<any[]>(allDestinationsQuery),
    getLocalDestinations().catch(() => []),
  ]);

  const seedMap = new Map<string, Destination>();
  for (const sd of initialDestinations) {
    seedMap.set(sd.slug.toLowerCase().trim(), sd);
    seedMap.set(sd.id.toLowerCase().replace(/^dest-/, '').trim(), sd);
  }

  const destMap = new Map<string, Destination>();

  const getDestKey = (id?: string, slug?: string) => {
    if (slug) return slug.toLowerCase().trim();
    if (id) return id.toLowerCase().replace(/^destination-/, '').replace(/^dest-/, '').trim();
    return '';
  };

  // 1. Populate with local and seed destinations
  for (const ld of local) {
    const key = getDestKey(ld.id, ld.slug);
    const seed = seedMap.get(key) || seedMap.get((ld.slug || '').toLowerCase().trim());
    const coverImage = ld.cover_image || seed?.cover_image || '';
    const heroImage = ld.hero_image || seed?.hero_image || coverImage;
    destMap.set(key, {
      ...ld,
      cover_image: coverImage,
      hero_image: heroImage,
    });
  }

  // 2. Overlay CMS documents
  if (cms && Array.isArray(cms)) {
    for (const d of cms) {
      const key = getDestKey(d._id, d.slug);
      const existing = destMap.get(key);
      const seed = seedMap.get(key) || seedMap.get((d.slug || '').toLowerCase().trim());

      const coverImage = d.coverImageUrl || existing?.cover_image || seed?.cover_image || '';
      const heroImage = d.heroImageUrl || existing?.hero_image || seed?.hero_image || coverImage;

      if (!existing) {
        destMap.set(key, {
          id: d._id,
          name: d.name,
          slug: d.slug,
          region: d.region || seed?.region || 'Kerala',
          tagline: d.tagline || seed?.tagline || '',
          short_description: d.shortDescription || seed?.short_description || '',
          description: d.description || seed?.description || '',
          cover_image: coverImage,
          hero_image: heroImage,
          status: d.status || 'published',
          seo_title: d.seo?.metaTitle || seed?.seo_title,
          seo_description: d.seo?.metaDescription || seed?.seo_description,
          created_at: d._createdAt || new Date().toISOString(),
          updated_at: d._updatedAt || new Date().toISOString(),
        });
      } else {
        const localTime = new Date(existing.updated_at || 0).getTime();
        const cmsTime = new Date(d._updatedAt || 0).getTime();

        if (cmsTime > localTime) {
          destMap.set(key, {
            ...existing,
            name: d.name || existing.name,
            region: d.region || existing.region,
            tagline: d.tagline || existing.tagline,
            short_description: d.shortDescription || existing.short_description,
            description: d.description || existing.description,
            status: d.status || existing.status,
            cover_image: coverImage,
            hero_image: heroImage,
            updated_at: d._updatedAt,
          });
        } else {
          destMap.set(key, {
            ...existing,
            cover_image: existing.cover_image || coverImage,
            hero_image: existing.hero_image || heroImage,
          });
        }
      }
    }
  }

  return Array.from(destMap.values());
}

export async function getCmsDestinationBySlug(slug: string): Promise<Destination | null> {
  const all = await getCmsDestinations();
  const clean = slug.toLowerCase().trim();
  const found = all.find(
    (d) => d.slug.toLowerCase().trim() === clean || d.id.toLowerCase().trim() === clean
  );
  if (found) return found;
  return getLocalDestinationBySlug(slug);
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

  const seedMap = new Map<string, TransportationVehicle>();
  for (const sv of initialTransportationVehicles) {
    const k1 = sv.id.toLowerCase().replace(/^vehicle-/, '');
    const k2 = sv.name.toLowerCase().trim();
    seedMap.set(k1, sv);
    seedMap.set(k2, sv);
  }

  const vehicleMap = new Map<string, TransportationVehicle>();

  const getVehKey = (id?: string, name?: string) => {
    if (id) {
      const clean = id.toLowerCase().replace(/^vehicle-/, '').trim();
      if (clean) return clean;
    }
    return (name || '').toLowerCase().trim();
  };

  // 1. Populate with local and seed vehicles so valid photos are guaranteed
  for (const lv of local) {
    const key = getVehKey(lv.id, lv.name);
    const seed = seedMap.get(key) || seedMap.get(lv.name.toLowerCase().trim());
    const validImage = lv.image || seed?.image || '/images/transportation/maruti-dzire.jpg';
    vehicleMap.set(key, {
      ...lv,
      image: validImage,
    });
  }

  // 2. Overlay CMS documents
  if (cms && Array.isArray(cms)) {
    for (const v of cms) {
      const key = getVehKey(v._id, v.name);
      const existing = vehicleMap.get(key);
      const seed = seedMap.get(key) || seedMap.get((v.name || '').toLowerCase().trim());

      const validImage = v.image || existing?.image || seed?.image || '/images/transportation/maruti-dzire.jpg';

      if (!existing) {
        vehicleMap.set(key, {
          id: v._id,
          name: v.name,
          category: v.category,
          brand: v.brand || seed?.brand || '',
          subtitle: v.subtitle || seed?.subtitle || '',
          badge: v.badge || seed?.badge || '',
          image: validImage,
          starting_price: v.startingPrice || seed?.starting_price || '',
          capacity_pax: v.capacityPax || seed?.capacity_pax || 4,
          capacity_luggage: v.capacityLuggage || seed?.capacity_luggage || 2,
          best_for: v.bestFor || seed?.best_for || '',
          features: v.features?.length ? v.features : (seed?.features || []),
          description: v.description || seed?.description || '',
          routes: v.routes || seed?.routes || [],
          is_active: v.isActive ?? true,
          order: v.order || seed?.order || 1,
          created_at: v._createdAt || new Date().toISOString(),
          updated_at: v._updatedAt || new Date().toISOString(),
        });
      } else {
        const localTime = new Date(existing.updated_at || 0).getTime();
        const cmsTime = new Date(v._updatedAt || 0).getTime();

        if (cmsTime > localTime) {
          vehicleMap.set(key, {
            ...existing,
            name: v.name || existing.name,
            category: v.category || existing.category,
            brand: v.brand || existing.brand,
            subtitle: v.subtitle || existing.subtitle,
            badge: v.badge !== undefined ? v.badge : existing.badge,
            starting_price: v.startingPrice || existing.starting_price,
            capacity_pax: v.capacityPax || existing.capacity_pax,
            capacity_luggage: v.capacityLuggage || existing.capacity_luggage,
            best_for: v.bestFor || existing.best_for,
            features: v.features?.length ? v.features : existing.features,
            description: v.description || existing.description,
            routes: v.routes || existing.routes,
            is_active: v.isActive !== undefined ? v.isActive : existing.is_active,
            order: v.order || existing.order,
            image: validImage,
            updated_at: v._updatedAt,
          });
        } else {
          vehicleMap.set(key, {
            ...existing,
            image: existing.image || validImage,
          });
        }
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
