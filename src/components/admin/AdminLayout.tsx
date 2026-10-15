"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Admin3DLogoIntro from "./Admin3DLogoIntro";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Enquiries CRM", href: "/admin/enquiries", icon: "inbox" },
    { label: "Packages", href: "/admin/packages", icon: "luggage" },
    { label: "Destinations", href: "/admin/destinations", icon: "map" },
    { label: "Special Offers", href: "/admin/offers", icon: "local_offer" },
    { label: "Reviews", href: "/admin/reviews", icon: "star" },
    { label: "Content & Media", href: "/admin/content", icon: "edit_document" },
    { label: "Bug Reports", href: "/admin/bugs", icon: "bug_report" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  const handleLogout = async () => {
    try {
      try {
        sessionStorage.removeItem("tc_admin_passcode_verified");
      } catch {
        // Silent
      }
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col lg:flex-row text-on-surface">
      {/* 3D Logo Entrance Loading Screen */}
      <Admin3DLogoIntro />

      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-surface-container-lowest border-b border-outline-variant/30 px-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-headline-sm text-headline-sm font-semibold text-primary">Trip Connect</span>
          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-wider">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-lg bg-surface-container text-on-surface"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileNavOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileNavOpen ? "block" : "hidden"
        } lg:block w-full lg:w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col shrink-0 lg:min-h-screen lg:sticky lg:top-0 z-30`}
      >
        <div className="h-20 hidden lg:flex items-center gap-3 px-6 border-b border-outline-variant/20">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ"
              alt="Trip Connect Kochi"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface block leading-tight">
                Trip Connect
              </span>
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
              TC
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-semibold block truncate">tripconnectwebsite2@gmail.com</span>
              <span className="text-[10px] text-secondary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Authorized Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md transition-all ${
                  isActive
                    ? "bg-primary text-on-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with view live site and logout */}
        <div className="p-4 border-t border-outline-variant/20 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-primary text-xs font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>View Public Website</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-error hover:bg-error-container/20 text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}
