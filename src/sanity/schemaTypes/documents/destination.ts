import { defineField, defineType } from 'sanity';

export const destination = defineType({
  name: 'destination',
  title: 'Destinations',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Destination Name',
      type: 'string',
      description: 'E.g. "Munnar", "Alleppey", "Wayanad", "Kochi"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'Kerala', value: 'Kerala' },
          { title: 'South India', value: 'South India' },
          { title: 'North India', value: 'North India' },
          { title: 'Pan India', value: 'Pan India' },
        ],
      },
      initialValue: 'Kerala',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline / Badge',
      type: 'string',
      description: 'E.g. "Tea Valleys & Cloud Mist", "Venice of the East"',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'imageWithAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Banner Image (Optional)',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'published',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'region',
      media: 'coverImage',
    },
  },
});
