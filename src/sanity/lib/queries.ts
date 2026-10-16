import { groq } from 'next-sanity';

// -----------------------------------------------------------------------------
// Singletons
// -----------------------------------------------------------------------------

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    businessName,
    tagline,
    "logoUrl": logo.asset->url,
    "darkLogoUrl": darkLogo.asset->url,
    "faviconUrl": favicon.asset->url,
    contactPhone,
    contactEmail,
    whatsappNumber,
    address,
    businessHours,
    instagramHandle,
    facebookUrl,
    youtubeUrl,
    googleReviewsUrl,
    announcement
  }
`;

export const themeSettingsQuery = groq`
  *[_type == "themeSettings"][0] {
    primaryColor,
    secondaryColor,
    cardRadius,
    buttonRadius,
    maxContentWidth
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    items[] {
      label,
      link,
      isCta,
      isExternal,
      badge,
      children[] {
        label,
        link,
        description
      }
    },
    headerCta {
      label,
      link,
      variant,
      icon,
      isExternal
    },
    showPhoneInHeader
  }
`;

export const footerSettingsQuery = groq`
  *[_type == "footerSettings"][0] {
    description,
    columns[] {
      title,
      links[] {
        label,
        link,
        isExternal
      }
    },
    copyright,
    legalLinks[] {
      label,
      link
    },
    showTrustBadges
  }
`;

export const globalSeoQuery = groq`
  *[_type == "globalSeo"][0] {
    siteTitle,
    titleTemplate,
    metaDescription,
    "defaultOgImageUrl": defaultOgImage.asset->url,
    defaultKeywords,
    twitterHandle,
    organizationSchema
  }
`;

// -----------------------------------------------------------------------------
// Travel Packages
// -----------------------------------------------------------------------------

export const allPackagesQuery = groq`
  *[_type == "travelPackage" && status == "published"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order,
    status,
    publishedAt,
    destinationName,
    "destinationSlug": destination->slug.current,
    category,
    isFeatured,
    startingPrice,
    currency,
    durationDays,
    durationNights,
    shortDescription,
    description,
    highlights,
    "gallery": gallery[] {
      "url": asset->url,
      alt,
      caption
    },
    itinerary[] {
      day,
      title,
      description,
      activity,
      "imageUrl": image.asset->url
    },
    inclusions,
    exclusions,
    accommodationDetails,
    departureDates,
    seo {
      metaTitle,
      metaDescription,
      canonicalUrl,
      "openGraphImageUrl": openGraphImage.asset->url,
      keywords,
      noIndex,
      noFollow
    }
  }
`;

export const packageBySlugQuery = groq`
  *[_type == "travelPackage" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    order,
    status,
    publishedAt,
    destinationName,
    "destinationSlug": destination->slug.current,
    category,
    isFeatured,
    startingPrice,
    currency,
    durationDays,
    durationNights,
    shortDescription,
    description,
    highlights,
    "gallery": gallery[] {
      "url": asset->url,
      alt,
      caption
    },
    itinerary[] {
      day,
      title,
      description,
      activity,
      "imageUrl": image.asset->url
    },
    inclusions,
    exclusions,
    accommodationDetails,
    departureDates,
    seo {
      metaTitle,
      metaDescription,
      canonicalUrl,
      "openGraphImageUrl": openGraphImage.asset->url,
      keywords,
      noIndex,
      noFollow
    }
  }
`;

// -----------------------------------------------------------------------------
// Destinations
// -----------------------------------------------------------------------------

export const allDestinationsQuery = groq`
  *[_type == "destination" && status == "published"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    region,
    tagline,
    shortDescription,
    description,
    "coverImageUrl": coverImage.asset->url,
    "heroImageUrl": heroImage.asset->url,
    order,
    seo {
      metaTitle,
      metaDescription,
      canonicalUrl,
      "openGraphImageUrl": openGraphImage.asset->url
    }
  }
`;

export const destinationBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug && status == "published"][0] {
    _id,
    name,
    "slug": slug.current,
    region,
    tagline,
    shortDescription,
    description,
    "coverImageUrl": coverImage.asset->url,
    "heroImageUrl": heroImage.asset->url,
    order,
    seo {
      metaTitle,
      metaDescription,
      canonicalUrl,
      "openGraphImageUrl": openGraphImage.asset->url
    }
  }
`;

// -----------------------------------------------------------------------------
// Transportation Fleet
// -----------------------------------------------------------------------------

export const allVehiclesQuery = groq`
  *[_type == "transportationVehicle" && isActive == true] | order(order asc) {
    _id,
    name,
    category,
    order,
    brand,
    subtitle,
    badge,
    "image": image.asset->url,
    startingPrice,
    capacityPax,
    capacityLuggage,
    bestFor,
    features,
    description,
    routes,
    isActive
  }
`;

// -----------------------------------------------------------------------------
// Special Offers & Customer Reviews
// -----------------------------------------------------------------------------

export const allOffersQuery = groq`
  *[_type == "specialOffer" && status == "active"] | order(order asc) {
    _id,
    title,
    description,
    discountType,
    discountValue,
    validFrom,
    validUntil,
    status,
    "packageTitle": linkedPackage->title,
    "packageSlug": linkedPackage->slug.current
  }
`;

export const allReviewsQuery = groq`
  *[_type == "customerReview" && status == "approved"] | order(order asc) {
    _id,
    customerDisplayName,
    reviewText,
    rating,
    sourceOrVerificationNote,
    "avatarUrl": avatar.asset->url,
    order,
    createdAt
  }
`;

// -----------------------------------------------------------------------------
// Custom Pages with Page Builder
// -----------------------------------------------------------------------------

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    status,
    pageBuilder[] {
      _type,
      _key,
      ...,
      "bgImageUrl": bgImage.asset->url,
      "featureImageUrl": featureImage.asset->url,
      "imageUrl": image.asset->url,
      manualPackages[]-> {
        _id,
        title,
        "slug": slug.current,
        category,
        startingPrice,
        currency,
        durationDays,
        durationNights,
        shortDescription,
        highlights,
        "gallery": gallery[] {
          "url": asset->url,
          alt
        }
      },
      manualDestinations[]-> {
        _id,
        name,
        "slug": slug.current,
        region,
        tagline,
        "coverImageUrl": coverImage.asset->url
      },
      selectedOffer-> {
        title,
        description,
        discountType,
        discountValue,
        "packageSlug": linkedPackage->slug.current
      }
    },
    seo {
      metaTitle,
      metaDescription,
      canonicalUrl,
      "openGraphImageUrl": openGraphImage.asset->url,
      keywords,
      noIndex,
      noFollow
    }
  }
`;
