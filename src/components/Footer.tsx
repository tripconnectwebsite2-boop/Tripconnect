import Link from "next/link";
import Image from "next/image";
import { SiteContent } from "@/lib/types";
import { getSiteContent } from "@/lib/db";

export default async function Footer({ content }: { content?: Partial<SiteContent> }) {
  const activeContent = content || (await getSiteContent().catch(() => null));
  const brandName = activeContent?.brand_name || "Trip Connect";
  const logoUrl =
    activeContent?.logo_url ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ";
  const footerDesc =
    activeContent?.footer_description ||
    "Curated bespoke journeys across Kerala and India, crafted from Kochi. Experience backwater serenity, misty highland estates, and iconic cultural sanctuaries with our dedicated travel concierges.";
  const address = activeContent?.contact_address || "Ayyappankavu, Kochi, Ernakulam, Kerala – 682018";
  const phone = activeContent?.contact_phone || "+91 9400886838";
  const email = activeContent?.contact_email || "tripconnectwebsite2@gmail.com";
  const copyright = activeContent?.footer_copyright || "© 2026 Trip Connect. All rights reserved.";

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 text-on-surface pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-outline-variant/20">
          {/* Brand info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={logoUrl}
                alt={brandName}
                width={160}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
                {brandName}
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              {footerDesc}
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
                <a
                  href="https://share.google/V0eWcp5SrScZDVig4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors cursor-pointer"
                  title="View Trip Connect on Google Maps"
                >
                  {address}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0">call</span>
                <a className="hover:text-primary transition-colors" href={`tel:${phone.replace(/\s+/g, '')}`}>
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-outline text-[18px] shrink-0">mail</span>
                <a className="hover:text-primary transition-colors" href={`mailto:${email}`}>
                  {email}
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
            <p>{copyright}</p>
            <Link className="hover:text-on-surface transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-on-surface transition-colors" href="/terms">
              Terms &amp; Conditions
            </Link>
            <Link className="hover:text-error transition-colors flex items-center gap-1" href="/report-bug">
              <span className="material-symbols-outlined text-[14px]">bug_report</span>
              <span>Report a Bug</span>
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
