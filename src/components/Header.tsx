"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SiteContent } from "@/lib/types";

export default function Header({ content }: { content?: Partial<SiteContent> }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<Partial<SiteContent> | undefined>(content);
  const [headerPages, setHeaderPages] = useState<{ label: string; href: string }[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (!content) {
      fetch("/api/content")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setDynamicContent(data);
        })
        .catch(() => {});
    }

    // Load any custom pages enabled for header navigation
    fetch("/api/pages?in_header=true")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.pages && Array.isArray(data.pages)) {
          setHeaderPages(
            data.pages.slice(0, 3).map((p: any) => ({
              label: p.title,
              href: `/p/${p.slug}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, [content]);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeContent = content || dynamicContent;
  const brandName = activeContent?.brand_name || "Trip Connect";
  const logoUrl =
    activeContent?.logo_url ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Packages", href: "/packages" },
    { label: "Destinations", href: "/destinations" },
    { label: "Special Offers", href: "/offers" },
    ...headerPages,
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-2xl border-b border-outline-variant/40 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
          : "bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-none"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={logoUrl}
            alt={brandName}
            width={160}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight hidden sm:inline-block font-semibold">
            {brandName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-label-md text-label-md transition-colors relative py-1 ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
          <Link
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm btn-shimmer active:scale-[0.98] min-h-[44px]"
            href="/contact"
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5">explore</span>
            Plan Your Trip
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 touch-manipulation min-h-[44px] min-w-[44px]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center py-3 px-3 rounded-lg text-base font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
