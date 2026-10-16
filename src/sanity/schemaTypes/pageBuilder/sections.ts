import { defineField, defineType } from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Top Badge', type: 'string', initialValue: 'Kochi & Kerala Premier Tour Operator' }),
    defineField({ name: 'title', title: 'Main Heading', type: 'string', initialValue: 'Discover God’s Own Country with Kochi’s Most Trusted Travel Concierge', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle Description', type: 'text', rows: 3, initialValue: 'Bespoke holiday packages, backwater houseboats, luxury chauffeur sedans, and All-India Volvo sleeper coaches.' }),
    defineField({ name: 'bgImage', title: 'Background Image', type: 'imageWithAlt' }),
    defineField({ name: 'primaryCta', title: 'Primary Action Button', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'Secondary Action Button', type: 'cta' }),
    defineField({ name: 'floatingBadge', title: 'Floating Trust Badge Text', type: 'string', initialValue: '4.9 ★ Rated by 500+ Travelers' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'bgImage' },
    prepare({ title, media }) {
      return { title: '🌟 Hero: ' + (title || 'Hero Section'), media };
    },
  },
});

export const featuredPackagesSection = defineType({
  name: 'featuredPackagesSection',
  title: 'Featured Tour Packages Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Section Badge', type: 'string', initialValue: 'Curated Experiences' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Handpicked Kerala & South India Packages' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2, initialValue: 'Every itinerary is privately managed with handpicked luxury resorts, verified drivers, and authentic cultural experiences.' }),
    defineField({ name: 'filterCategory', title: 'Filter by Specific Category (Optional - Leave empty for All)', type: 'string' }),
    defineField({ name: 'manualPackages', title: 'Or Manually Pick Specific Packages (Drag & Drop)', type: 'array', of: [{ type: 'reference', to: [{ type: 'travelPackage' }] }] }),
    defineField({ name: 'maxItems', title: 'Maximum Packages to Display', type: 'number', initialValue: 6 }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '📦 Tour Packages: ' + (title || 'Featured Packages') };
    },
  },
});

export const destinationsSection = defineType({
  name: 'destinationsSection',
  title: 'Destinations Showcase Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string', initialValue: 'Trending Destinations' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Iconic Kerala Destinations' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2, initialValue: 'From misty Munnar tea hills to serene Alleppey backwaters and Fort Kochi heritage.' }),
    defineField({ name: 'manualDestinations', title: 'Pick Destinations (Optional - Defaults to all active)', type: 'array', of: [{ type: 'reference', to: [{ type: 'destination' }] }] }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '📍 Destinations: ' + (title || 'Destinations Section') };
    },
  },
});

export const keralaToursSection = defineType({
  name: 'keralaToursSection',
  title: 'Kerala Tours Signature Spotlight',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string', initialValue: 'Signature Kerala Circuits' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Immerse Yourself in Kerala’s Enchanting Landscapes' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'featureImage', title: 'Spotlight Feature Image', type: 'imageWithAlt' }),
    defineField({ name: 'features', title: 'Pillar Bullets (3 Features)', type: 'array', of: [{ type: 'sectionFeature' }] }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '🌴 Kerala Spotlight: ' + (title || 'Kerala Tours') };
    },
  },
});

export const transportationSection = defineType({
  name: 'transportationSection',
  title: 'Transportation & Mobility Services Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Transportation, Taxi & Luxury Chauffeur Services' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2, initialValue: 'Trusted, transparent, and private mobility across Kerala and nationwide — from budget cabs and airport transfers to luxury Mercedes-Benz fleets and All-India tourist coaches.' }),
    defineField({ name: 'ctaText', title: 'View Fleet CTA Label', type: 'string', initialValue: 'View Full Fleet & Book Online' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '🚗 Transportation Services: ' + (title || 'Transportation') };
    },
  },
});

export const whyChooseUsSection = defineType({
  name: 'whyChooseUsSection',
  title: 'Why Choose Us Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string', initialValue: 'The Trip Connect Difference' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Why Discerning Travelers Choose Trip Connect' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'image', title: 'Section Showcase Image', type: 'imageWithAlt' }),
    defineField({ name: 'pillars', title: 'Value Pillars (Cards)', type: 'array', of: [{ type: 'sectionFeature' }] }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '🛡️ Why Choose Us: ' + (title || 'Why Choose Us') };
    },
  },
});

export const specialOffersSection = defineType({
  name: 'specialOffersSection',
  title: 'Special Offers Banner Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string', initialValue: 'Limited Time Deal' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Exclusive Seasonal Deals' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'selectedOffer', title: 'Specific Offer to Highlight (Optional)', type: 'reference', to: [{ type: 'specialOffer' }] }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '🏷️ Special Offers: ' + (title || 'Special Offers') };
    },
  },
});

export const reviewsSection = defineType({
  name: 'reviewsSection',
  title: 'Customer Testimonials & Reviews Section',
  type: 'object',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'string', initialValue: 'Verified Guest Experiences' }),
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Loved by Hundreds of Travelers' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2, initialValue: 'Real stories from verified guests who explored Kerala, Tamil Nadu, and Karnataka with our team.' }),
    defineField({ name: 'showGoogleReviewButton', title: 'Show "Review us on Google" Button', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '⭐ Reviews: ' + (title || 'Customer Reviews') };
    },
  },
});

export const callToActionSection = defineType({
  name: 'callToActionSection',
  title: 'Call to Action Banner Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Heading', type: 'string', initialValue: 'Ready to Experience God’s Own Country?' }),
    defineField({ name: 'subtitle', title: 'Subtitle Description', type: 'text', rows: 2, initialValue: 'Speak directly with our local travel specialists in Kochi. We customize itineraries in under 30 minutes.' }),
    defineField({ name: 'primaryCta', title: 'Primary Button', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'Secondary Button', type: 'cta' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: '📢 CTA Banner: ' + (title || 'Call to Action') };
    },
  },
});

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich Text / Narrative Content Block',
  type: 'object',
  fields: [
    defineField({ name: 'sectionTitle', title: 'Section Title (Optional)', type: 'string' }),
    defineField({ name: 'content', title: 'Content Body', type: 'blockContent' }),
  ],
  preview: {
    select: { title: 'sectionTitle' },
    prepare({ title }) {
      return { title: '📝 Text Block: ' + (title || 'Rich Text Content') };
    },
  },
});
