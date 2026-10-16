import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Custom Pages & Landing Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'E.g. "Home", "About Us", "Privacy Policy", "Monsoon Special Landing"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'E.g. "home", "about", "privacy-policy", or custom "/p/[slug]".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Publishing Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Sections (Drag & Drop to Reorder)',
      type: 'array',
      description: 'Build your page layout by adding, removing, and dragging sections into your desired order.',
      of: [
        { type: 'heroSection' },
        { type: 'featuredPackagesSection' },
        { type: 'destinationsSection' },
        { type: 'keralaToursSection' },
        { type: 'transportationSection' },
        { type: 'whyChooseUsSection' },
        { type: 'specialOffersSection' },
        { type: 'reviewsSection' },
        { type: 'callToActionSection' },
        { type: 'richTextSection' },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Media Overrides',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      sections: 'pageBuilder',
    },
    prepare({ title, slug, sections }) {
      return {
        title: title || 'Untitled Page',
        subtitle: `/${slug || ''} • ${sections?.length || 0} sections`,
      };
    },
  },
});
