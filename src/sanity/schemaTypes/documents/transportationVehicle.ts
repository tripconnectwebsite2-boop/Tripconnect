import { defineField, defineType } from 'sanity';

export const transportationVehicle = defineType({
  name: 'transportationVehicle',
  title: 'Transportation Fleet',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Vehicle / Coach Name',
      type: 'string',
      description: 'E.g. "Mercedes-Benz S-Class", "Force Urbania 12/17-Seater VIP Coach", "Maruti Suzuki Dzire"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Mobility Segment / Category',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Cabs & City Transfers', value: 'normal' },
          { title: 'Premium Segment (Luxury Chauffeur)', value: 'premium' },
          { title: 'All-India Bus & Tour Charters', value: 'bus' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order / Priority',
      type: 'number',
      description: 'Drag & drop order priority (1, 2, 3...)',
      initialValue: 1,
    }),
    defineField({
      name: 'brand',
      title: 'Brand / Manufacturer',
      type: 'string',
      description: 'E.g. "Mercedes-Benz", "Toyota", "Force", "Volvo", "Maruti Suzuki"',
    }),
    defineField({
      name: 'subtitle',
      title: 'Vehicle Subtitle / Class Tagline',
      type: 'string',
      description: 'E.g. "The Benchmark of Executive Luxury", "Compact AC Sedan", "European Design Executive Touring Van"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'badge',
      title: 'Card Badge (e.g. "VIP Luxury", "Most Popular Budget")',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Vehicle Authentic Photo',
      type: 'imageWithAlt',
      description: 'Upload high-resolution, centered photo matching the exact model.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting Price / Fare Note',
      type: 'string',
      description: 'E.g. "₹8,500 / 8h transfer", "₹14 / km (or ₹2,200 / day)", "From ₹1,200 / Berth"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'capacityPax',
      title: 'Passenger Capacity',
      type: 'string',
      description: 'E.g. "3 Passengers", "6 Passengers", "12 - 17 Luxury Seats", "30 - 36 Sleepers"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'capacityLuggage',
      title: 'Luggage Capacity',
      type: 'string',
      description: 'E.g. "3 Luggage", "5 Luggage", "Massive Lower Cargo Boot"',
    }),
    defineField({
      name: 'bestFor',
      title: 'Best Suited For',
      type: 'string',
      description: 'E.g. "VIP Arrivals, Luxury Weddings, Dignitary Transfers & 5-Star Kerala Tours"',
    }),
    defineField({
      name: 'features',
      title: 'Key Inclusions & Features (Bulleted)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'description',
      title: 'Detailed Overview & Comfort Note',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'routes',
      title: 'Key Operating Routes (For Buses / Charters)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'E.g. "Kochi ⇄ Bangalore", "Kochi ⇄ Chennai", "All-Kerala Grand Sightseeing Circuit"',
    }),
    defineField({
      name: 'isActive',
      title: 'Available / Visible on Website',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Order (Ascending)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'startingPrice',
      category: 'category',
      media: 'image',
    },
    prepare({ title, subtitle, category, media }) {
      const catLabel =
        category === 'premium'
          ? '👑 Premium'
          : category === 'bus'
          ? '🚌 Bus / Coach'
          : '🚗 Standard Cab';
      return {
        title: title || 'Vehicle',
        subtitle: `${catLabel} • ${subtitle || ''}`,
        media,
      };
    },
  },
});
