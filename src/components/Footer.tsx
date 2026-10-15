import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 text-on-surface pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-outline-variant/20">
          {/* Brand info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                alt="Trip Connect Kochi"
                className="h-10 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ"
              />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
                Trip Connect
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Curated bespoke journeys across Kerala and India, crafted from Kochi. Experience backwater serenity, misty highland estates, and iconic cultural sanctuaries with our dedicated travel concierges.
            </p>
            <div className="flex items-center gap-2 pt-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Kerala Tourism Approved Partner
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="font-label-md text-label-md text-on-surface font-semibold tracking-tight uppercase">
              Quick Links
            </span>
            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <Link className="hover:text-primary transition-colors" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/packages">
                  All Packages
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/destinations">
                  Destinations Atlas
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/offers">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/contact">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/admin">
                  Staff Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Categories */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-label-md text-label-md text-on-surface font-semibold tracking-tight uppercase">
              Travel Categories
            </span>
            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li>
                <Link className="hover:text-primary transition-colors" href="/packages?category=Kerala+Tours">
                  Kerala Tours &amp; Houseboats
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/packages?category=India+Tours">
                  India Golden Circuit Tours
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/packages?category=Honeymoon+Packages">
                  Honeymoon Packages
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/packages?category=Family+Trips">
                  Family Retreats &amp; Stays
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/packages?category=Adventure+%26+Nature">
                  Adventure &amp; Nature Trails
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <span className="font-label-md text-label-md text-on-surface font-semibold tracking-tight uppercase">
              Contact &amp; Location
            </span>
            <div className="flex flex-col gap-3 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">
                  location_on
                </span>
                <span>Ayyappankavu, Kochi, Ernakulam, Kerala – 682018</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0">call</span>
                <a className="hover:text-primary transition-colors" href="tel:+919400886838">
                  +91 9400886838
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0">mail</span>
                <a className="hover:text-primary transition-colors" href="mailto:dmtripconnectin@gmail.com">
                  dmtripconnectin@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0">photo_camera</span>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://instagram.com/tripconnectin"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @tripconnectin
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-outline font-body-sm text-body-sm">
          <div className="flex flex-wrap items-center gap-6">
            <p>© 2026 Trip Connect. All rights reserved.</p>
            <Link className="hover:text-on-surface transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/terms">
              Terms &amp; Conditions
            </Link>
          </div>
          <p className="text-center md:text-right font-label-sm text-label-sm text-outline-variant">
            Package prices are starting estimates. Inquiries do not constitute confirmed reservations.
          </p>
        </div>
      </div>
    </footer>
  );
}
