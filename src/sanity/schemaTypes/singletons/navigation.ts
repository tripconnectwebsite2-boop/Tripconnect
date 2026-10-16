import { defineField, defineType } from 'sanity';

export const navigation = defineType({
  name: 'navigation',
  title: 'Header Navigation Menu',
  type: 'document',
  description: 'Manage main header navigation links, dropdowns, order, and header CTA button.',
  fields: [
    defineField({
      name: 'items',
      title: 'Main Navigation Links (Drag & Drop to Reorder)',
      type: 'array',
      of: [{ type: 'navItem' }],
      description: 'Items appear in the top navigation bar in this exact order.',
    }),
    defineField({
      name: 'headerCta',
      title: 'Header Right CTA Button',
      type: 'cta',
      description: 'The highlighted call-to-action button in the header (e.g. "Plan My Trip" or "Book Cab").',
    }),
    defineField({
      name: 'showPhoneInHeader',
      title: 'Display Direct Phone Number in Header',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({ items }) {
      return {
        title: 'Header Navigation',
        subtitle: `${items?.length || 0} top-level menu items`,
      };
    },
  },
});
