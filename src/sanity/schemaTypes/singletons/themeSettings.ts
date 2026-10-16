import { defineField, defineType } from 'sanity';

export const themeSettings = defineType({
  name: 'themeSettings',
  title: 'Global Design & Theme Tokens',
  type: 'document',
  description: 'Control visual branding colors, button styles, and layout dimensions across the website.',
  fields: [
    defineField({
      name: 'primaryColor',
      title: 'Brand Primary Accent Color',
      type: 'string',
      description: 'Hex color code (e.g. #D4AF37 for Gold or #2563EB for Royal Blue). Defaults to luxury gold #D4AF37.',
      initialValue: '#D4AF37',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Brand Secondary Color',
      type: 'string',
      description: 'Hex color code for secondary accents (e.g. #059669 for Emerald or #1E293B for Slate).',
      initialValue: '#059669',
    }),
    defineField({
      name: 'cardRadius',
      title: 'Card & Surface Corner Radius',
      type: 'string',
      options: {
        list: [
          { title: 'Subtle Rounded (rounded-xl - 12px)', value: '12px' },
          { title: 'Modern Smooth (rounded-2xl - 16px)', value: '16px' },
          { title: 'Luxury Organic (rounded-3xl - 24px) [Default]', value: '24px' },
          { title: 'Fully Pill / Fluid', value: '32px' },
        ],
      },
      initialValue: '24px',
    }),
    defineField({
      name: 'buttonRadius',
      title: 'Button Corner Radius',
      type: 'string',
      options: {
        list: [
          { title: 'Full Pill (rounded-full) [Default]', value: 'full' },
          { title: 'Soft Rounded (rounded-xl)', value: 'xl' },
          { title: 'Slightly Rounded (rounded-lg)', value: 'lg' },
        ],
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'maxContentWidth',
      title: 'Maximum Container Width',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (1280px / 7xl)', value: '1280px' },
          { title: 'Wide Luxury (1360px) [Default]', value: '1360px' },
          { title: 'Ultra Wide (1440px)', value: '1440px' },
        ],
      },
      initialValue: '1360px',
    }),
  ],
  preview: {
    select: {
      primary: 'primaryColor',
      secondary: 'secondaryColor',
    },
    prepare({ primary, secondary }) {
      return {
        title: 'Theme & Design Tokens',
        subtitle: `Primary: ${primary || '#D4AF37'} • Secondary: ${secondary || '#059669'}`,
      };
    },
  },
});
