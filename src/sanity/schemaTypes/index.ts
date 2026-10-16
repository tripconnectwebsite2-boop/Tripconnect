import { type SchemaTypeDefinition } from 'sanity';

// Objects
import { seo } from './objects/seo';
import { imageWithAlt } from './objects/imageWithAlt';
import { cta } from './objects/cta';
import { itineraryDay } from './objects/itineraryDay';
import { navItem } from './objects/navItem';
import { footerColumn } from './objects/footerColumn';
import { sectionFeature } from './objects/footerColumn';
import { blockContent } from './objects/blockContent';

// Singletons
import { siteSettings } from './singletons/siteSettings';
import { themeSettings } from './singletons/themeSettings';
import { navigation } from './singletons/navigation';
import { footerSettings } from './singletons/footerSettings';
import { globalSeo } from './singletons/globalSeo';

// Documents
import { travelPackage } from './documents/travelPackage';
import { destination } from './documents/destination';
import { transportationVehicle } from './documents/transportationVehicle';
import { specialOffer } from './documents/specialOffer';
import { customerReview } from './documents/customerReview';
import { page } from './documents/page';

// Page Builder Sections
import {
  heroSection,
  featuredPackagesSection,
  destinationsSection,
  keralaToursSection,
  transportationSection,
  whyChooseUsSection,
  specialOffersSection,
  reviewsSection,
  callToActionSection,
  richTextSection,
} from './pageBuilder/sections';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    seo,
    imageWithAlt,
    cta,
    itineraryDay,
    navItem,
    footerColumn,
    sectionFeature,
    blockContent,

    // Singletons
    siteSettings,
    themeSettings,
    navigation,
    footerSettings,
    globalSeo,

    // Documents
    travelPackage,
    destination,
    transportationVehicle,
    specialOffer,
    customerReview,
    page,

    // Page Builder Sections
    heroSection,
    featuredPackagesSection,
    destinationsSection,
    keralaToursSection,
    transportationSection,
    whyChooseUsSection,
    specialOffersSection,
    reviewsSection,
    callToActionSection,
    richTextSection,
  ],
};
