import { defineField, defineType } from 'sanity';

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'description',
      title: 'Footer Brand Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Trip Connect Kochi is a premier tour operator and mobility provider in Kerala. We craft bespoke luxury holiday packages, airport transfers, chauffeur-driven executive cars, and All-India tourist coaches.',
    }),
    defineField({
      name: 'columns',
      title: 'Footer Navigation Columns (Drag & Drop to Reorder)',
      type: 'array',
      of: [{ type: 'footerColumn' }],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Notice',
      type: 'string',
      initialValue: `© ${new Date().getFullYear()} Trip Connect Kochi. All rights reserved.`,
    }),
    defineField({
      name: 'legalLinks',
      title: 'Bottom Legal Links (Privacy, Terms, Bug Report)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'link', title: 'Link', type: 'string', validation: (r) => r.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: 'showTrustBadges',
      title: 'Display Trust & Security Badges',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      copyright: 'copyright',
    },
    prepare({ copyright }) {
      return {
        title: 'Footer Configuration',
        subtitle: copyright || 'Footer settings',
      };
    },
  },
});
