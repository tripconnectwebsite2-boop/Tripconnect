import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Search Engine Optimization (SEO)',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Optimal length: 50-60 characters. Appears in browser tab and search results.',
      validation: (rule) => rule.max(70).warning('Titles longer than 70 characters may get truncated in Google.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Optimal length: 140-160 characters. Summary shown under your title in search snippets.',
      validation: (rule) => rule.max(165).warning('Descriptions longer than 165 characters may get truncated.'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Override canonical URL if this content is mirrored or syndicate.',
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Open Graph (Social Sharing) Image',
      type: 'image',
      description: 'Recommended size: 1200x630px. Preview image shown when shared on WhatsApp, Facebook, LinkedIn.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Descriptive text for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'openGraphTitle',
      title: 'Social Share Title (Optional)',
      type: 'string',
      description: 'Leave empty to inherit Meta Title.',
    }),
    defineField({
      name: 'openGraphDescription',
      title: 'Social Share Description (Optional)',
      type: 'text',
      rows: 2,
      description: 'Leave empty to inherit Meta Description.',
    }),
    defineField({
      name: 'keywords',
      title: 'Focus Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Keywords relevant to this page/package (e.g. "Kochi cab rental", "Munnar tour package").',
    }),
    defineField({
      name: 'noIndex',
      title: 'Prevent Search Engines From Indexing (noindex)',
      type: 'boolean',
      description: 'Enable to hide this page from Google/Bing.',
      initialValue: false,
    }),
    defineField({
      name: 'noFollow',
      title: 'Prevent Following Links (nofollow)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
