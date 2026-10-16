import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Identity & Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business / Brand Name',
      type: 'string',
      initialValue: 'Trip Connect',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Brand Tagline',
      type: 'string',
      initialValue: 'Premium Travel, Taxi & All-India Bus Booking Kochi',
    }),
    defineField({
      name: 'logo',
      title: 'Primary Logo (Light Backgrounds)',
      type: 'image',
      description: 'Upload primary brand logo (PNG, SVG, WebP)',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string', initialValue: 'Trip Connect Logo' }],
    }),
    defineField({
      name: 'darkLogo',
      title: 'Dark Mode / Inverted Logo (Dark Backgrounds)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Browser Favicon / Icon',
      type: 'image',
      description: 'Square image (.png or .ico, e.g. 64x64 or 192x192)',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone Number',
      type: 'string',
      initialValue: '+91 94951 86604',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'tripconnectwebsite2@gmail.com',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Official WhatsApp Dispatch Number (with country code)',
      type: 'string',
      initialValue: '919495186604',
      description: 'Digits only with country code, e.g. 919495186604',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'address',
      title: 'Office Physical Address',
      type: 'text',
      rows: 2,
      initialValue: 'Kochi, Kerala, India - 682001',
    }),
    defineField({
      name: 'businessHours',
      title: 'Operating / Concierge Hours',
      type: 'string',
      initialValue: '24/7 Available (Chauffeur & Dispatch Service)',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Profile URL / Handle',
      type: 'string',
      initialValue: 'https://instagram.com/tripconnect',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook Page URL',
      type: 'url',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube Channel URL',
      type: 'url',
    }),
    defineField({
      name: 'googleReviewsUrl',
      title: 'Google My Business / Maps Review Link',
      type: 'url',
      description: 'Direct link for customers to leave reviews.',
    }),
    defineField({
      name: 'announcement',
      title: 'Global Announcement Bar (Optional)',
      type: 'object',
      fields: [
        defineField({ name: 'enabled', title: 'Enable Announcement Bar', type: 'boolean', initialValue: false }),
        defineField({ name: 'text', title: 'Announcement Message', type: 'string' }),
        defineField({ name: 'link', title: 'CTA Link (Optional)', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'businessName',
      subtitle: 'contactPhone',
      media: 'logo',
    },
  },
});
