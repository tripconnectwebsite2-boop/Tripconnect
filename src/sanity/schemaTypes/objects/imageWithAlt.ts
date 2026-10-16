import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative Text (Alt Text)',
      type: 'string',
      description: 'Important for SEO and screen readers. Briefly describe what is in the image.',
      validation: (rule) => rule.required().warning('Alt text is recommended for SEO and accessibility.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (Optional)',
      type: 'string',
      description: 'Optional display caption under image.',
    }),
  ],
});
