import { defineField, defineType } from 'sanity';

export const customerReview = defineType({
  name: 'customerReview',
  title: 'Customer Reviews & Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'customerDisplayName',
      title: 'Customer Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text / Testimonial',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating Stars (1 to 5)',
      type: 'number',
      validation: (r) => r.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'sourceOrVerificationNote',
      title: 'Verification Note / Tour Taken',
      type: 'string',
      description: 'E.g. "Verified Google Review • Alleppey & Wayanad Tour"',
      initialValue: 'Verified Google Review',
    }),
    defineField({
      name: 'avatar',
      title: 'Customer Photo / Avatar (Optional)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'status',
      title: 'Display Status',
      type: 'string',
      options: {
        list: [
          { title: 'Approved & Visible', value: 'approved' },
          { title: 'Hidden', value: 'hidden' },
          { title: 'Pending Review', value: 'draft' },
        ],
      },
      initialValue: 'approved',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'createdAt',
      title: 'Review Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Order (Ascending)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'customerDisplayName',
      subtitle: 'sourceOrVerificationNote',
      rating: 'rating',
      media: 'avatar',
    },
    prepare({ title, subtitle, rating, media }) {
      const stars = '★'.repeat(rating || 5);
      return {
        title: `${title || 'Customer'} (${stars})`,
        subtitle: subtitle || 'Customer Review',
        media,
      };
    },
  },
});
