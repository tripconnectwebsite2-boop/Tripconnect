import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import ConsentBanner from "@/components/ConsentBanner";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trip Connect — Bespoke Kerala & India Journeys",
  description: "Curated bespoke journeys across Kerala and India, crafted from Kochi. Experience backwater serenity, misty highland estates, and iconic cultural sanctuaries with our dedicated travel concierges.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tripconnect.in"),
  openGraph: {
    title: "Trip Connect — Bespoke Kerala & India Journeys",
    description: "Curated bespoke journeys across Kerala and India, crafted from Kochi.",
    url: "https://tripconnect.in",
    siteName: "Trip Connect",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuASJNgmdoiZS-L2EeJH6bC_BJnjEyc-ps714Hvrrs1hcrJEl2ZyJC4wWWDzjURJSuRBsPKY-RAjO0M6M_UiktOdHDcQ5vlA9kuFvyCtaZqCgPEG5rcst98ta1hhUz2TNekWn6_J1_1IxA436qF-rzy4WVUPxKdoDVWeDBRRqt-5BOVhknH02JbQfYWaAVE55EFBq0CYXA9RvcaQPY1ypKD72jvMgsh53TqVVFKOiI8nV_M6Dlxhmn6qGg",
        width: 1200,
        height: 630,
        alt: "Kerala Houseboat on Vembanad Lake",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <StructuredData />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <ScrollProgressBar />
        {/* Top micro-loading bar with luxury brand ocean blue gradient */}
        <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
          <div className="h-full bg-gradient-to-r from-primary via-primary-fixed-dim to-secondary-fixed shadow-[0_0_8px_rgba(0,97,147,0.45)] animate-micro-bar" />
        </div>
        {children}
        <ConsentBanner />
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
