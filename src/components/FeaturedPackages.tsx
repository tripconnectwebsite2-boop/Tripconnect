export default function FeaturedPackages() {
  const packages = [
    {
      title: "Classic Kerala Grand Tour",
      subtitle: "Cochin • Munnar • Thekkady • Alleppey",
      duration: "6N / 7D",
      price: "₹32,000",
      badge: "High Value",
      badgeClass: "bg-secondary-container text-on-secondary-container",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsEueUPJrI0O1sHnvIQdp-xgXpkaYKfOkgLG6MC7pdryUyfy__v92icO0eIqpBYlE15-9goslKClobZY9z8oaCniCTHIB5G5ssC8EhDlcIrNcgMgjqyfniZ5typYoNow0w1ZzunISf4YBooojKwq3dxn1-LaKsVNNA4fxmrTJ0YAEgLoQIlWtwVBhWM2MfH9ffWIfAfJ89oaPVDmMPsvCUj4WWokPYvJ0KhoTul8CRrbBTqKSw15J8jw",
      inclusions: [
        { icon: "sailing", text: "Private Overnight Luxury Houseboat with Chef" },
        { icon: "spa", text: "Guided Spice Plantation Walk in Thekkady" },
        { icon: "theater_comedy", text: "Authentic Evening Kathakali Performance" },
        { icon: "airport_shuttle", text: "Dedicated Chauffeur & AC SUV Transfers" },
      ],
      delay: "delay-150",
    },
    {
      title: "Golden Triangle & Rajasthan",
      subtitle: "Delhi • Agra • Jaipur",
      duration: "5N / 6D",
      price: "₹28,500",
      badge: "Heritage",
      badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDvVABX4Y6jpzGgP2sYLLGWh5N-fDDHyeJg4EHWR23avMU0zO6OGgeAMUJv0833v7mEJvBUdyTsdGgK-a4p5sd8araMwsXVp_LN4fbT5IkXmPt0O85SJrGMy_7EYw-VkJFJdUCyc7Dnp3YshUDpj2FxTFGsyYXnD5GIVRbIfYqFgrBbDVy5_eFsOg9ZOsDoJwUjXm9xueRC1zCZurRuygbrmMTYYGNGOWgyjpK4dHMoJrhght8Rjo4gvQ",
      inclusions: [
        { icon: "wb_sunny", text: "Privileged Sunrise Tour at Taj Mahal Agra" },
        { icon: "castle", text: "Amber Fort Jeep Safari & City Palace Jaipur" },
        { icon: "hotel", text: "Heritage Restored Haveli Stays" },
        { icon: "local_taxi", text: "Private Intercity Transfers & Licensed Guides" },
      ],
      delay: "delay-300",
    },
    {
      title: "Wayanad & Coorg Highlands",
      subtitle: "Wayanad • Coorg",
      duration: "4N / 5D",
      price: "₹22,400",
      badge: "Highland Trek",
      badgeClass: "bg-secondary-container text-on-secondary-container",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDHZFZCVDrJOtbPFmJ02LXvzZJwQCWNccpArTImJK-Owjd3RrzWKylxMdF3AUU6IK9Cd9GUw_liFfH6FWboas_5l5QIxJ_XrJJzFV54ibqAG49kyS8eGTznP5rBBenwpgXDvYI2Bbpw4nMKC-Sr_ykchVWEKVjYNkuwnWrKVT-PrWr1tWh341oQ6JTsR-vURqSSpHtQDZZdMRu3o3f8n6hVcYz8fZloUoMH5q-OWWXsRSLzH6ViJL_D0A",
      inclusions: [
        { icon: "coffee", text: "Artisan Coffee Estate Boutique Homestay" },
        { icon: "waterfall_chart", text: "Iruppu & Soochipara Waterfall Treks" },
        { icon: "kayaking", text: "River Bamboo Rafting & Spice Trails" },
        { icon: "restaurant", text: "Kodava & Malabar Culinary Experiences" },
      ],
      delay: "delay-450",
    },
  ];

  return (
    <section className="w-full py-20 bg-surface-container-low" id="featured-packages">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 reveal-fade-up">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Signature Curations
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-2">
              Featured Packages
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Multi-destination balanced circuits crafted with luxury stays &amp; private transit.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            Fully customizable on request
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className={`flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden reveal-fade-up ${pkg.delay}`}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt={pkg.title}
                  src={pkg.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    {pkg.duration}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                    {pkg.subtitle}
                  </p>
                  <h3 className="font-headline-md text-headline-md font-semibold text-white">
                    {pkg.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="space-y-4 mb-6">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                    Curated Inclusions
                  </span>
                  <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc.text} className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          {inc.icon}
                        </span>
                        <span>{inc.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-outline-variant/20 flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-body-sm text-body-sm text-outline">Starting Price</span>
                      <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        {pkg.price}{" "}
                        <span className="text-sm font-normal text-outline">/person</span>
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md font-label-sm text-label-sm ${pkg.badgeClass}`}>
                      {pkg.badge}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      className="py-2.5 text-center rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-all active:scale-[0.98]"
                      href="#plan-trip"
                    >
                      View Trip
                    </a>
                    <a
                      className="py-2.5 text-center rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all btn-shimmer active:scale-[0.98]"
                      href="#plan-trip"
                    >
                      Quick Enquiry
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
