import { defineField, defineType } from 'sanity';

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Menu Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link / URL',
      type: 'string',
      description: 'E.g. "/packages", "/transportation", "/about", "/contact"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isCta',
      title: 'Display as Highlighted CTA Button?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isExternal',
      title: 'Open in New Window?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badge',
      title: 'Subtle Badge (e.g. "Popular", "New")',
      type: 'string',
    }),
    defineField({
      name: 'children',
      title: 'Dropdown Sub-items (Optional)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'link', title: 'Link', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Short Sub-description', type: 'string' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'link',
    },
  },
});
