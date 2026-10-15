"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteContent } from "@/lib/types";

export default function Header({ content }: { content?: Partial<SiteContent> }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<Partial<SiteContent> | undefined>(content);
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
  }, [content]);

  const activeContent = content || dynamicContent;
  const brandName = activeContent?.brand_name || "Trip Connect";
  const logoUrl =
    activeContent?.logo_url ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Kerala Tours", href: "/packages?category=Kerala+Tours" },
    { label: "India Tours", href: "/packages?category=India+Tours" },
    { label: "Destinations", href: "/destinations" },
    { label: "Special Offers", href: "/offers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            alt={brandName}
            className="h-10 w-auto object-contain"
            src={logoUrl}
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
                : pathname.startsWith(link.href.split("?")[0]);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-primary font-semibold relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-primary"
                    : "font-label-md text-label-md text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          <a
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest text-secondary hover:text-on-surface transition-all font-label-md text-label-md"
            href="https://wa.me/919400886838"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">chat</span>
            <span className="font-medium tracking-tight">+91 9400886838</span>
          </a>

          <Link
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm btn-shimmer active:scale-[0.98]"
            href="/contact"
          >
            <span className="material-symbols-outlined text-[18px] mr-1.5">explore</span>
            Plan Your Trip
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-6 py-4 shadow-lg animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-on-surface hover:text-primary transition-colors font-label-md text-label-md border-b border-outline-variant/10"
              >
                {link.label}
              </Link>
            ))}
            <a
              className="mt-2 flex items-center gap-2 py-2.5 px-4 rounded-xl bg-secondary/10 text-secondary font-label-md text-label-md"
              href="https://wa.me/919400886838"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              WhatsApp Concierge (+91 9400886838)
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
