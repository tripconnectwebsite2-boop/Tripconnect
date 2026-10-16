import { defineField, defineType } from 'sanity';

export const specialOffer = defineType({
  name: 'specialOffer',
  title: 'Special Offers & Deals',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Offer Title',
      type: 'string',
      description: 'E.g. "Early Monsoon Kerala Retreat - 10% Off"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Offer Description / Terms',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'linkedPackage',
      title: 'Applicable Tour Package (Optional)',
      type: 'reference',
      to: [{ type: 'travelPackage' }],
    }),
    defineField({
      name: 'discountType',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage Off (%)', value: 'percentage' },
          { title: 'Fixed Amount Off (₹)', value: 'fixed_amount' },
          { title: 'Special Complimentary Perk', value: 'special_perk' },
        ],
      },
      initialValue: 'percentage',
    }),
    defineField({
      name: 'discountValue',
      title: 'Discount Value (e.g. 10 for 10% or 2000 for ₹2000)',
      type: 'number',
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From Date',
      type: 'date',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until Date',
      type: 'date',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Expired', value: 'expired' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      validUntil: 'validUntil',
    },
    prepare({ title, status, validUntil }) {
      return {
        title: title || 'Offer',
        subtitle: `Status: ${status || 'active'} • Valid until: ${validUntil || 'Ongoing'}`,
      };
    },
  },
});
