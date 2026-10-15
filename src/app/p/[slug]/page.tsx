import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getCustomPageBySlug, getCustomPages, getSiteContent } from "@/lib/db";

export async function generateStaticParams() {
  const pages = await getCustomPages({ status: "published" });
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  if (!page || page.status !== "published") {
    return { title: "Page Not Found | Trip Connect" };
  }

  return {
    title: page.seo_title || `${page.title} | Trip Connect Kochi`,
    description:
      page.seo_description ||
      page.hero_subtitle ||
      `Discover ${page.title} curated by Trip Connect luxury travel concierge in Kochi, Kerala.`,
    openGraph: {
      title: page.title,
      description: page.hero_subtitle || page.seo_description,
      images: page.hero_image ? [{ url: page.hero_image }] : undefined,
    },
  };
}

export default async function CustomDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);

  if (!page || page.status !== "published") {
    notFound();
  }

  const content = await getSiteContent().catch(() => null);
  const rawPhone = content?.whatsapp_number || "919400886838";
  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello Trip Connect, I would like to inquire about: ${page.title}`
  )}`;

  // Simple Markdown paragraph renderer
  const formattedSections = page.content.split("\n\n").map((chunk, i) => {
    const trimmed = chunk.trim();
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-bold text-on-surface mt-6 mb-3 tracking-tight">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl sm:text-3xl font-bold text-on-surface mt-8 mb-4 tracking-tight border-b border-outline-variant/30 pb-2">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map((line) => line.replace(/^[*•-]\s*/, ""));
      return (
        <ul key={i} className="space-y-2 my-4 pl-2">
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-start gap-2.5 text-on-surface-variant text-base leading-relaxed">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                check_circle
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-4">
        {trimmed}
      </p>
    );
  });

  return (
    <>
      <Header />
      <main className="w-full pt-28 pb-20 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-outline">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface-variant">Experiences</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px]">
              {page.title}
            </span>
          </nav>

          {/* Hero Banner Card */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-end p-6 sm:p-12 shadow-md">
            {page.hero_image ? (
              <Image
                src={page.hero_image}
                alt={page.hero_title || page.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            <div className="relative z-10 max-w-3xl space-y-4 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-primary-fixed">verified</span>
                <span>Trip Connect Signature Experience</span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                {page.hero_title || page.title}
              </h1>
              {page.hero_subtitle && (
                <p className="font-body-lg text-base sm:text-xl text-white/90 leading-relaxed max-w-2xl">
                  {page.hero_subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Two-Column Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area */}
            <article className="lg:col-span-8 space-y-8 bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-sm">
              {/* Highlights Ribbon if present */}
              {page.highlights && page.highlights.length > 0 && (
                <div className="p-6 rounded-2xl bg-surface-container-low border border-primary/20 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[20px]">stars</span>
                    <span>Key Highlights of this Experience</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {page.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                          done_all
                        </span>
                        <span className="text-sm font-medium text-on-surface leading-snug">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formatted Content */}
              <div className="prose max-w-none text-on-surface">
                {formattedSections}
              </div>

              {/* Bottom WhatsApp CTA inside content */}
              {page.cta_whatsapp !== false && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-container-low to-secondary/10 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <div>
                    <h4 className="font-headline-sm text-base font-bold text-on-surface">
                      Interested in this bespoke experience?
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                      Chat directly with our native Kerala travel specialist in Kochi.
                    </p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-md transition-all shrink-0"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.493-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.802.376s-1.053 1.028-1.053 2.508 1.078 2.91 1.229 3.111c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.9.12.579-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.201-.577-.351z" />
                    </svg>
                    <span>{page.cta_title || "Inquire via WhatsApp"}</span>
                  </a>
                </div>
              )}
            </article>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm sticky top-28 space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary block">
                    Bespoke Concierge Booking
                  </span>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1">
                    Book &amp; Customize This Experience
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                    Have questions about dates, car sizes, or customized stops? Our Kochi planners assist you instantly.
                  </p>
                </div>

                {/* WhatsApp Action */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.927-2.232-.244-.587-.493-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.802.376s-1.053 1.028-1.053 2.508 1.078 2.91 1.229 3.111c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.9.12.579-.087 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.201-.577-.351z" />
                  </svg>
                  <span>{page.cta_title || "Inquire via WhatsApp"}</span>
                </a>

                {/* Plan Custom Trip link */}
                <Link
                  href="/contact"
                  className="w-full py-3 px-4 rounded-xl border border-outline-variant/40 hover:bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    mail
                  </span>
                  <span>Send Detailed Inquiry Form</span>
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-outline-variant/20 space-y-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      verified_user
                    </span>
                    <span>Kerala Tourism Approved Partner</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      support_agent
                    </span>
                    <span>24/7 Kochi Concierge On-Ground</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      price_check
                    </span>
                    <span>100% Transparent Zero Hidden Fees</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
