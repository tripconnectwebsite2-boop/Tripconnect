import { createClient } from '@sanity/client';
import {
  TravelPackage,
  Destination,
  TransportationVehicle,
  SpecialOffer,
  Review,
  SiteSettings,
  SiteContent,
} from '@/lib/types';

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'hxi4dnkc';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || projectId === 'your-project-id' || !token) {
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-03-01',
    token,
    useCdn: false,
  });
}

/**
 * Sync Site Content (Hero, Kerala Tours, Why Choose Us, etc.) to Sanity
 */
export async function syncContentToSanity(content: SiteContent): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    // 1. Update siteSettings
    await client.createOrReplace({
      _id: 'siteSettings-global',
      _type: 'siteSettings',
      businessName: content.brand_name || 'Trip Connect',
      contactPhone: content.contact_phone || '+91 94008 86838',
      contactEmail: content.contact_email || 'tripconnectwebsite2@gmail.com',
      whatsappNumber: content.whatsapp_number || '919400886838',
      address: content.contact_address || 'Fort Kochi, Kochi, Kerala 682001',
      businessHours: content.business_hours || '24/7 Concierge Support',
    });

    // 2. Fetch existing home page to preserve pageBuilder structure
    const existingHome = await client.fetch<any>(`*[_id == "page-home"][0]`);
    if (existingHome?.pageBuilder && Array.isArray(existingHome.pageBuilder)) {
      const updatedBuilder = existingHome.pageBuilder.map((section: any) => {
        if (section._type === 'heroSection') {
          return {
            ...section,
            badge: content.hero_badge || '',
            title: content.hero_title || section.title,
            subtitle: content.hero_subtitle || section.subtitle,
            primaryCta: {
              ...(section.primaryCta || {}),
              label: content.hero_primary_cta_text || section.primaryCta?.label || 'Explore Trips',
              link: content.hero_primary_cta_link || section.primaryCta?.link || '#kerala-tours',
            },
            secondaryCta: {
              ...(section.secondaryCta || {}),
              label: content.hero_secondary_cta_text || section.secondaryCta?.label || 'Plan My Custom Trip',
              link: content.hero_secondary_cta_link || section.secondaryCta?.link || '#plan-trip',
            },
            floatingBadge: content.hero_floating_badge || section.floatingBadge,
          };
        }
        if (section._type === 'keralaToursSection') {
          return {
            ...section,
            badge: content.kerala_badge || section.badge,
            title: content.kerala_title || section.title,
            subtitle: content.kerala_subtitle || section.subtitle,
          };
        }
        if (section._type === 'transportationSection') {
          return {
            ...section,
            title: content.home_transport_title || section.title,
            subtitle: content.home_transport_subtitle || section.subtitle,
            ctaText: content.home_transport_cta_text || section.ctaText,
          };
        }
        if (section._type === 'whyChooseUsSection') {
          return {
            ...section,
            badge: content.why_badge || section.badge,
            title: content.why_title || section.title,
            subtitle: content.why_subtitle || section.subtitle,
          };
        }
        return section;
      });

      await client.patch('page-home').set({ pageBuilder: updatedBuilder }).commit();
    }
  } catch (err: any) {
    console.warn('[Sanity Sync] Content sync notice:', err?.message || err);
  }
}

/**
 * Sync Travel Package to Sanity
 */
export async function syncPackageToSanity(pkg: TravelPackage): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    const docId = `package-${pkg.id || pkg.slug}`;
    await client.createOrReplace({
      _id: docId,
      _type: 'travelPackage',
      title: pkg.title,
      slug: { _type: 'slug', current: pkg.slug },
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
      itinerary: (pkg.itinerary || []).map((it) => ({
        _key: `day-${it.day}`,
        day: it.day,
        title: it.title,
        description: it.description,
        activity: it.activity || '',
      })),
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      accommodationDetails: pkg.accommodation_details || '',
      status: pkg.status === 'published' ? 'published' : 'draft',
      seo: {
        metaTitle: pkg.seo_title || `${pkg.title} | Trip Connect`,
        metaDescription: pkg.seo_description || pkg.short_description,
      },
    });
  } catch (err: any) {
    console.warn('[Sanity Sync] Package sync notice:', err?.message || err);
  }
}

/**
 * Delete Travel Package from Sanity
 */
export async function deletePackageFromSanity(idOrSlug: string): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    await client.delete(`package-${idOrSlug}`);
  } catch (err: any) {
    console.warn('[Sanity Sync] Package delete notice:', err?.message || err);
  }
}

/**
 * Sync Vehicle to Sanity
 */
export async function syncVehicleToSanity(vehicle: TransportationVehicle): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    const docId = `vehicle-${vehicle.id || vehicle.name.toLowerCase().replace(/\s+/g, '-')}`;
    await client.createOrReplace({
      _id: docId,
      _type: 'transportationVehicle',
      name: vehicle.name,
      brand: vehicle.brand || '',
      category: vehicle.category,
      subtitle: vehicle.subtitle || '',
      badge: vehicle.badge || '',
      image: vehicle.image,
      startingPrice: vehicle.starting_price,
      capacityPax: vehicle.capacity_pax,
      capacityLuggage: vehicle.capacity_luggage,
      bestFor: vehicle.best_for || '',
      features: vehicle.features || [],
      order: vehicle.order || 1,
      isActive: vehicle.is_active !== false,
      whatsappNumber: '919400886838',
    });
  } catch (err: any) {
    console.warn('[Sanity Sync] Vehicle sync notice:', err?.message || err);
  }
}

/**
 * Delete Vehicle from Sanity
 */
export async function deleteVehicleFromSanity(idOrSlug: string): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    await client.delete(`vehicle-${idOrSlug}`);
  } catch (err: any) {
    console.warn('[Sanity Sync] Vehicle delete notice:', err?.message || err);
  }
}

/**
 * Sync Destination to Sanity
 */
export async function syncDestinationToSanity(dest: Destination): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    const docId = `destination-${dest.id || dest.slug}`;
    await client.createOrReplace({
      _id: docId,
      _type: 'destination',
      name: dest.name,
      slug: { _type: 'slug', current: dest.slug },
      region: dest.region,
      tagline: dest.tagline,
      shortDescription: dest.short_description,
      description: dest.description,
      status: dest.status || 'published',
      seo: {
        metaTitle: dest.seo_title || `${dest.name} Tour Packages | Trip Connect`,
        metaDescription: dest.seo_description || dest.short_description,
      },
    });
  } catch (err: any) {
    console.warn('[Sanity Sync] Destination sync notice:', err?.message || err);
  }
}

/**
 * Sync Special Offer to Sanity
 */
export async function syncOfferToSanity(offer: SpecialOffer): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    const docId = `offer-${offer.id}`;
    await client.createOrReplace({
      _id: docId,
      _type: 'specialOffer',
      title: offer.title,
      description: offer.description,
      packageTitle: offer.package_title || '',
      discountType: offer.discount_type || 'percentage',
      discountValue: offer.discount_value || 0,
      validFrom: offer.valid_from,
      validUntil: offer.valid_until,
      status: offer.status === 'active' ? 'active' : 'inactive',
    });
  } catch (err: any) {
    console.warn('[Sanity Sync] Offer sync notice:', err?.message || err);
  }
}

/**
 * Sync Review to Sanity
 */
export async function syncReviewToSanity(review: Review): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    const docId = `review-${review.id}`;
    await client.createOrReplace({
      _id: docId,
      _type: 'customerReview',
      customerDisplayName: review.customer_display_name,
      reviewText: review.review_text,
      rating: review.rating,
      sourceOrVerificationNote: review.source_or_verification_note || 'Google Verified Guest',
      status: review.status === 'approved' ? 'approved' : 'draft',
      createdAt: review.created_at,
    });
  } catch (err: any) {
    console.warn('[Sanity Sync] Review sync notice:', err?.message || err);
  }
}

/**
 * Sync Settings to Sanity
 */
export async function syncSettingsToSanity(settings: SiteSettings): Promise<void> {
  const client = getSanityWriteClient();
  if (!client) return;

  try {
    await client.createOrReplace({
      _id: 'siteSettings-global',
      _type: 'siteSettings',
      businessName: settings.business_name,
      contactPhone: settings.contact_phone,
      contactEmail: settings.contact_email,
      whatsappNumber: settings.whatsapp_number,
      address: settings.address,
      businessHours: settings.business_hours,
      instagramHandle: settings.instagram_handle,
      googleReviewsUrl: settings.google_reviews_url,
    });
  } catch (err: any) {
    console.warn('[Sanity Sync] Settings sync notice:', err?.message || err);
  }
}
