import type { StructureResolver } from 'sanity/structure';

// Clean list of singleton document IDs that should only ever have 1 instance
const singletons = [
  'siteSettings',
  'themeSettings',
  'navigation',
  'footerSettings',
  'globalSeo',
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Trip Connect CMS')
    .items([
      // -----------------------------------------------------------------------
      // CONTENT GROUP
      // -----------------------------------------------------------------------
      S.listItem()
        .title('Pages & Page Builder')
        .icon(() => '📄')
        .child(
          S.documentTypeList('page')
            .title('All Custom Pages')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
        ),

      S.divider(),

      S.listItem()
        .title('Tour Packages')
        .icon(() => '🌴')
        .child(
          S.list()
            .title('Tour Packages')
            .items([
              S.listItem()
                .title('All Packages (Ordered)')
                .child(
                  S.documentTypeList('travelPackage')
                    .title('All Packages')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Kerala Tours')
                .child(
                  S.documentList()
                    .title('Kerala Tours')
                    .filter('_type == "travelPackage" && category == "Kerala Tours"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Honeymoon & Family')
                .child(
                  S.documentList()
                    .title('Honeymoon & Family')
                    .filter('_type == "travelPackage" && (category == "Honeymoon Packages" || category == "Family Trips")')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Drafts & Scheduled')
                .child(
                  S.documentList()
                    .title('Drafts & Scheduled')
                    .filter('_type == "travelPackage" && (status == "draft" || status == "scheduled")')
                ),
            ])
        ),

      S.listItem()
        .title('Destinations')
        .icon(() => '📍')
        .child(
          S.documentTypeList('destination')
            .title('Destinations')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      S.listItem()
        .title('Transportation Fleet')
        .icon(() => '🚗')
        .child(
          S.list()
            .title('Transportation Fleet')
            .items([
              S.listItem()
                .title('All Fleet (Ordered)')
                .child(
                  S.documentTypeList('transportationVehicle')
                    .title('All Vehicles & Buses')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Standard Cabs')
                .child(
                  S.documentList()
                    .title('Standard Cabs (Dzire, Etios, Swift, Ertiga)')
                    .filter('_type == "transportationVehicle" && category == "normal"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Premium Luxury Segment')
                .child(
                  S.documentList()
                    .title('Premium Luxury (Mercedes, Audi, BMW, Vellfire)')
                    .filter('_type == "transportationVehicle" && category == "premium"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('All-India Buses & Charters')
                .child(
                  S.documentList()
                    .title('All-India Buses (Volvo 9600, BharatBenz, Urbania)')
                    .filter('_type == "transportationVehicle" && category == "bus"')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
            ])
        ),

      S.listItem()
        .title('Special Offers & Deals')
        .icon(() => '🏷️')
        .child(
          S.documentTypeList('specialOffer')
            .title('Offers & Promotions')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      S.listItem()
        .title('Customer Reviews')
        .icon(() => '⭐')
        .child(
          S.documentTypeList('customerReview')
            .title('Customer Testimonials')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      S.divider(),

      // -----------------------------------------------------------------------
      // DESIGN & THEME
      // -----------------------------------------------------------------------
      S.listItem()
        .title('Design Tokens & Theme')
        .icon(() => '🎨')
        .child(
          S.document()
            .schemaType('themeSettings')
            .documentId('themeSettings')
            .title('Global Theme & Styling')
        ),

      // -----------------------------------------------------------------------
      // NAVIGATION & FOOTER
      // -----------------------------------------------------------------------
      S.listItem()
        .title('Header Navigation')
        .icon(() => '🧭')
        .child(
          S.document()
            .schemaType('navigation')
            .documentId('navigation')
            .title('Header Menu & Action Button')
        ),

      S.listItem()
        .title('Footer Configuration')
        .icon(() => '🦶')
        .child(
          S.document()
            .schemaType('footerSettings')
            .documentId('footerSettings')
            .title('Footer Columns & Copyright')
        ),

      S.divider(),

      // -----------------------------------------------------------------------
      // SEO & SITE SETTINGS
      // -----------------------------------------------------------------------
      S.listItem()
        .title('Global SEO & Social Sharing')
        .icon(() => '🔍')
        .child(
          S.document()
            .schemaType('globalSeo')
            .documentId('globalSeo')
            .title('Global SEO Settings')
        ),

      S.listItem()
        .title('Site Identity & Contact')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Identity & Contact')
        ),
    ]);
