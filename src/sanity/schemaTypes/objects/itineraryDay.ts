import { defineField, defineType } from 'sanity';

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Itinerary Day',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day Number',
      type: 'number',
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: 'title',
      title: 'Day Title',
      type: 'string',
      description: 'E.g. "Cochin Arrival & Heritage Walk"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Activity Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activity',
      title: 'Key Activity Tag / Highlight',
      type: 'string',
      description: 'E.g. "Sightseeing & Sunset Cruise"',
    }),
    defineField({
      name: 'image',
      title: 'Day Thumbnail Image (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      day: 'day',
      title: 'title',
      media: 'image',
    },
    prepare({ day, title, media }) {
      return {
        title: `Day ${day}: ${title || 'Untitled'}`,
        media,
      };
    },
  },
});
