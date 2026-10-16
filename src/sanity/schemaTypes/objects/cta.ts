import { defineField, defineType } from 'sanity';

export const cta = defineType({
  name: 'cta',
  title: 'Call to Action Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Destination URL / Link',
      type: 'string',
      description: 'Internal route (e.g. "/packages" or "/transportation") or external URL (e.g. "https://wa.me/...")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Button Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Gold/Warm Highlight)', value: 'primary' },
          { title: 'Secondary / Outline', value: 'secondary' },
          { title: 'Emerald Green (WhatsApp / Booking)', value: 'emerald' },
          { title: 'Subtle Glass / Surface', value: 'subtle' },
        ],
      },
      initialValue: 'primary',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name (Material Symbol or Lucide)',
      type: 'string',
      description: 'E.g. "calendar_today", "chat", "arrow_forward", "flight_takeoff".',
    }),
    defineField({
      name: 'isExternal',
      title: 'Open in New Tab?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'link',
    },
  },
});
