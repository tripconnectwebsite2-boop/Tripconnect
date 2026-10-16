import { defineField, defineType } from 'sanity';

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer Link Column',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Column Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'link', title: 'Link / URL', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'isExternal', title: 'External Link?', type: 'boolean', initialValue: false }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      links: 'links',
    },
    prepare({ title, links }) {
      return {
        title: title || 'Column',
        subtitle: `${links?.length || 0} links`,
      };
    },
  },
});

export const sectionFeature = defineType({
  name: 'sectionFeature',
  title: 'Feature Pillar / Card',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Feature Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Feature Description',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name (Material Symbol)',
      type: 'string',
      description: 'E.g. "verified", "headset_mic", "currency_rupee", "directions_car"',
    }),
    defineField({
      name: 'image',
      title: 'Feature Image (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
  },
});
