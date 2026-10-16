import { defineField, defineType } from 'sanity';

export const globalSeo = defineType({
  name: 'globalSeo',
  title: 'Global SEO Defaults & Social Sharing',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Default Site Title',
      type: 'string',
      initialValue: 'Trip Connect | Kerala Tour Packages, Luxury Taxi & Bus Booking Kochi',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleTemplate',
      title: 'Page Title Format / Template',
      type: 'string',
      description: 'Use %s where the specific page title should be inserted. E.g. "%s | Trip Connect"',
      initialValue: '%s | Trip Connect Kochi',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Award-winning tour operator in Kochi offering luxury Kerala holiday packages, Munnar tea trail tours, Alleppey houseboats, chauffeur car rentals, and All-India Volvo sleeper bus charters.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default Social Share Image (1200x630px)',
      type: 'image',
      description: 'Used whenever a page or package does not specify its own social image.',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string', initialValue: 'Trip Connect Kochi' }],
    }),
    defineField({
      name: 'defaultKeywords',
      title: 'Default Global Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'twitterHandle',
      title: 'Twitter / X Handle (e.g. @tripconnect)',
      type: 'string',
    }),
    defineField({
      name: 'organizationSchema',
      title: 'Structured Data (Organization Schema)',
      type: 'object',
      fields: [
        defineField({ name: 'legalName', title: 'Legal Name', type: 'string', initialValue: 'Trip Connect Holidays Kochi' }),
        defineField({ name: 'foundingDate', title: 'Founding Year', type: 'string', initialValue: '2020' }),
        defineField({ name: 'priceRange', title: 'Price Range', type: 'string', initialValue: '₹₹ - ₹₹₹₹' }),
        defineField({ name: 'areaServed', title: 'Area Served', type: 'string', initialValue: 'Kerala, South India, Pan-India' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      subtitle: 'metaDescription',
    },
  },
});
