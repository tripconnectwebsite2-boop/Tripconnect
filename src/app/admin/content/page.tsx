"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { SiteContent } from "@/lib/types";

const PHOTO_PRESETS = [
  {
    label: "Munnar Tea Hills",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCzwJauBQYcLbtjGtABpJpcaUOhNXWkeONV1e_6XO5-ecYvYrgSypw1qr2W0oslFPX81kUzt-ZHQ9CZsyx-Pp03zo0bUkargRdMM7g5Um5MInTOH01gD8CTKxyZMyMwXmdmw9Eo3tBaOBQde3kPrMl-P7qcC359ZFyTMtMvMlmduh2YTAjNbTzORzljYpB21iRDw0CrblpxqWsvWuDbrA7pMo26-MRd3xAIM2GAcn7NH5p8gYx4gWPDw",
  },
  {
    label: "Alleppey Houseboat",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXa4pkOq0ty9_41mIx9UTEheTGIuJxcg9o0D40EZJRkTZnoyL4hB1gCuk62Bvhd7lMOPIa26eBygCDhuweowtOxzg_CChGSVglWspZ0TZmJC7seoNVyu1DB_X_74wtIE5DbM2hvPryKN76goIUdONWjazCD4hkEN8ncjerEygEnCEFj6vYwl_fa-xKJwjOOE_eUwTDeFVCmWra8gE5fE72kVXD0LX-Nla2PYGEI6BnnTlwN9iwaGn0A",
  },
  {
    label: "Wayanad Rainforest",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIMzmHxxHFOG9GNcnOQIC8jw9II3muiJ05oxhHDw5vpL6yhcWWo5M68-qw0zQNNaSKkLS0FMrFd5pww0TROn3gijfgZ1fAE76cdQyDMASwwJYxNnm92bC_i3rpx-ZrPg0b6AB4Eu8OYG9i8xmR7mG76HG-3p1dAlJ3IbZSEx_Nlvh1pmaEkmlJoN0jK6Bs99SnsU8gwgoXqyV-IZgDEAQGtFXVWlDhl8GXIpHQhTcHIRC_xbT43MiBbw",
  },
  {
    label: "Varkala Sea Cliff",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqhSF1rQ9FshAFS2pdPFJJkYF1bO1qPrjbRy6lVElxMJnextwpOP2W90i_2DPNINSQ63D756zhEGRRbvI8U4NIt6rwUVJ52KUxib39vCbj3HdvKYAf0Yua8lVYpb7ezdG9ohybcoqh2njLgOdU-vlBaIPeVYPekCGjjVZdSq1xo85WUX4IU6-_NnfKgd21rvgE9mpAWGdgzgrx8cI7NDmm6g3wYELlrdUBJ5ln4OPCNdGYTf5rKhRKVg",
  },
  {
    label: "Kochi Port Heritage",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlVyFqTk4aNYtEkC_r_Yda04E4nChyzI7VeNSSO-HHZQylo0VUKk5NePn3VeMJvjJhYF6fpc7w4SmT8lAJxRRJ4U4G6fZyRB0HQLCAWqgonYlW7WgSWnvPOUQSGY2wJ7kJ5Q8yNwCa-GXPFVjRhzYexf1k70s4xKuBjiXRV1DWxnH7tg4VfiNMnYyGicrA6jfSZs2FXEbaz9Idtg8FS6boR7YbYQzRk8JsGBJap_FOevzJrZgNfCIYWA",
  },
  {
    label: "Western Ghats Panoramic",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuASJNgmdoiZS-L2EeJH6bC_BJnjEyc-ps714Hvrrs1hcrJEl2ZyJC4wWWDzjURJSuRBsPKY-RAjO0M6M_UiktOdHDcQ5vlA9kuFvyCtaZqCgPEG5rcst98ta1hhUz2TNekWn6_J1_1IxA436qF-rzy4WVUPxKdoDVWeDBRRqt-5BOVhknH02JbQfYWaAVE55EFBq0CYXA9RvcaQPY1ypKD72jvMgsh53TqVVFKOiI8nV_M6Dlxhmn6qGg",
  },
  {
    label: "Trip Connect Logo",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYJZOkBqsaeTOLbOEwhz53LmuCxqlx4FZCyvrnDINoyxkUn91Tsh4RgfoyI-eQ171uAkntsNBkuKDOx8dcghNLRyQ3Mbl7L2WNHMaE-6X3i91C5UykVqixmD9wV_FK7U416tlER4E8uXR_UkBo90roeRFK7pKMHlTdKTv8Iuxo8AfT9QcmL7jvcnluVXo0BsJb6EIZc7VTEAf-StYMbsp5A8FU2KewNVHerKfVC_W2_Ux4Rzjzy9e-LLOa2DRvH-59oaQ",
  },
];

type ActiveTab = "hero" | "kerala" | "why" | "about" | "contact";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed to load site content");
      const data = await res.json();
      setContent(data.content);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key: keyof SiteContent, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      [key]: value,
    });
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save changes");
      }

      const data = await res.json();
      setContent(data.content);
      setSaveMessage("All text and images saved successfully! Changes are immediately live on the website.");
      setTimeout(() => setSaveMessage(""), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-3">
            <span className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin inline-block" />
            <p className="font-body-md text-on-surface-variant">Loading site content &amp; media editor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-outline-variant/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[16px]">edit_document</span>
              Live Content &amp; Media CMS
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
              Website Text &amp; Image Editor
            </h1>
            <p className="font-body-sm text-sm text-on-surface-variant mt-1">
              Customize headlines, descriptions, call-to-actions, and photography across all website pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold inline-flex items-center gap-1.5 transition-all border border-outline-variant/30"
            >
              <span>Preview Live Site</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:opacity-75"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {saveMessage && (
          <div className="p-4 rounded-xl bg-secondary-container text-on-secondary-container text-sm font-medium flex items-center gap-3 border border-secondary/20 shadow-sm animate-in fade-in">
            <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
            <span>{saveMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium flex items-center gap-3 border border-error/20 shadow-sm">
            <span className="material-symbols-outlined text-error text-[22px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20 scrollbar-none">
          {[
            { id: "hero", label: "Hero & Branding", icon: "stars" },
            { id: "kerala", label: "Kerala Showcase", icon: "landscape" },
            { id: "why", label: "Why Choose Us", icon: "verified_user" },
            { id: "about", label: "About Page", icon: "info" },
            { id: "contact", label: "Contact & Footer", icon: "contact_support" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: HERO & BRANDING */}
        {/* ========================================================================= */}
        {activeTab === "hero" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Brand Logo & Name */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <span>Brand Identity &amp; Logo</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Agency Brand Name
                  </label>
                  <input
                    type="text"
                    value={content.brand_name}
                    onChange={(e) => handleFieldChange("brand_name", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Website Logo URL
                  </label>
                  <input
                    type="url"
                    value={content.logo_url}
                    onChange={(e) => handleFieldChange("logo_url", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {content.logo_url && (
                <div className="p-4 rounded-xl bg-surface-container-low flex items-center gap-4">
                  <span className="text-xs text-outline font-medium">Logo Preview:</span>
                  <div className="h-12 px-4 py-2 rounded-lg bg-white border border-outline-variant/30 flex items-center">
                    <img
                      src={content.logo_url}
                      alt="Brand Logo Preview"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hero Copywriting */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">title</span>
                <span>Hero Headline &amp; Text Copy</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Hero Top Pill Badge
                  </label>
                  <input
                    type="text"
                    value={content.hero_badge}
                    onChange={(e) => handleFieldChange("hero_badge", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Main Hero Headline (H1)
                  </label>
                  <input
                    type="text"
                    value={content.hero_title}
                    onChange={(e) => handleFieldChange("hero_title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Hero Subtitle / Supporting Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero_subtitle}
                    onChange={(e) => handleFieldChange("hero_subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Floating Image Tagline
                  </label>
                  <input
                    type="text"
                    value={content.hero_floating_badge}
                    onChange={(e) => handleFieldChange("hero_floating_badge", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="pt-4 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Primary Button</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Label</label>
                    <input
                      type="text"
                      value={content.hero_primary_cta_text}
                      onChange={(e) => handleFieldChange("hero_primary_cta_text", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Link Target</label>
                    <input
                      type="text"
                      value={content.hero_primary_cta_link}
                      onChange={(e) => handleFieldChange("hero_primary_cta_link", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Secondary Button</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Label</label>
                    <input
                      type="text"
                      value={content.hero_secondary_cta_text}
                      onChange={(e) => handleFieldChange("hero_secondary_cta_text", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Link Target</label>
                    <input
                      type="text"
                      value={content.hero_secondary_cta_link}
                      onChange={(e) => handleFieldChange("hero_secondary_cta_link", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Main Photography */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">photo_camera</span>
                <span>Hero Background Travel Photography</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={content.hero_bg_image}
                  onChange={(e) => handleFieldChange("hero_bg_image", e.target.value)}
                  placeholder="https://images.unsplash.com/... or Google hosted image"
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono text-xs"
                />
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <span className="text-xs text-outline font-semibold">1-Click Photography Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleFieldChange("hero_bg_image", preset.url)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-surface-container hover:bg-primary hover:text-white transition-colors border border-outline-variant/20"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              {content.hero_bg_image && (
                <div className="space-y-2">
                  <span className="text-xs text-outline font-semibold">Live Visual Preview:</span>
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md border border-outline-variant/30 bg-neutral-900">
                    <img
                      src={content.hero_bg_image}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-xs font-bold uppercase tracking-wider text-secondary-fixed">
                        {content.hero_badge}
                      </span>
                      <h4 className="text-lg font-bold">{content.hero_title}</h4>
                      <p className="text-xs text-neutral-300 line-clamp-1">{content.hero_subtitle}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: KERALA TOURS SHOWCASE */}
        {/* ========================================================================= */}
        {activeTab === "kerala" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">landscape</span>
                <span>Kerala Tours Section Copy</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Top Badge
                  </label>
                  <input
                    type="text"
                    value={content.kerala_badge}
                    onChange={(e) => handleFieldChange("kerala_badge", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={content.kerala_title}
                    onChange={(e) => handleFieldChange("kerala_title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary font-bold text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Description
                  </label>
                  <textarea
                    rows={2}
                    value={content.kerala_subtitle}
                    onChange={(e) => handleFieldChange("kerala_subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Kerala Feature Photo */}
              <div className="pt-4 border-t border-outline-variant/20 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Feature Image URL
                  </label>
                  <input
                    type="url"
                    value={content.kerala_image}
                    onChange={(e) => handleFieldChange("kerala_image", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono focus:ring-2 focus:ring-primary"
                  />
                </div>

                {content.kerala_image && (
                  <div className="w-full h-48 rounded-xl overflow-hidden border border-outline-variant/30">
                    <img
                      src={content.kerala_image}
                      alt="Kerala feature preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* 3 Pillar Features */}
              <div className="pt-4 border-t border-outline-variant/20 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Three Experience Highlights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                    <span className="text-xs font-bold text-on-surface block">Feature 1</span>
                    <input
                      type="text"
                      placeholder="Title"
                      value={content.kerala_feature_1_title}
                      onChange={(e) => handleFieldChange("kerala_feature_1_title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={content.kerala_feature_1_desc}
                      onChange={(e) => handleFieldChange("kerala_feature_1_desc", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                    <span className="text-xs font-bold text-on-surface block">Feature 2</span>
                    <input
                      type="text"
                      placeholder="Title"
                      value={content.kerala_feature_2_title}
                      onChange={(e) => handleFieldChange("kerala_feature_2_title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={content.kerala_feature_2_desc}
                      onChange={(e) => handleFieldChange("kerala_feature_2_desc", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                    <span className="text-xs font-bold text-on-surface block">Feature 3</span>
                    <input
                      type="text"
                      placeholder="Title"
                      value={content.kerala_feature_3_title}
                      onChange={(e) => handleFieldChange("kerala_feature_3_title", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={content.kerala_feature_3_desc}
                      onChange={(e) => handleFieldChange("kerala_feature_3_desc", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3 Kerala Tour Cards (Images & Text) */}
              <div className="pt-6 border-t border-outline-variant/20 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    3 Kerala Showcase Tour Cards (Images &amp; Copy)
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Customize the photography, titles, descriptions, and pricing displayed on the 3 flagship tour cards.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      num: 1,
                      titleKey: "kerala_tour1_title",
                      descKey: "kerala_tour1_desc",
                      priceKey: "kerala_tour1_price",
                      imageKey: "kerala_tour1_image",
                      defaultLabel: "Card 1: Munnar Cloud Mist & Tea Trails",
                    },
                    {
                      num: 2,
                      titleKey: "kerala_tour2_title",
                      descKey: "kerala_tour2_desc",
                      priceKey: "kerala_tour2_price",
                      imageKey: "kerala_tour2_image",
                      defaultLabel: "Card 2: Alleppey Luxury Backwater Cruise",
                    },
                    {
                      num: 3,
                      titleKey: "kerala_tour3_title",
                      descKey: "kerala_tour3_desc",
                      priceKey: "kerala_tour3_price",
                      imageKey: "kerala_tour3_image",
                      defaultLabel: "Card 3: Wayanad Rainforest Sanctuary",
                    },
                  ].map((tour) => {
                    const currentImg = (content as any)[tour.imageKey];
                    return (
                      <div
                        key={tour.num}
                        className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-on-surface flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                              {tour.num}
                            </span>
                            <span>{tour.defaultLabel}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2 space-y-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-outline mb-1">
                                Tour Title
                              </label>
                              <input
                                type="text"
                                value={(content as any)[tour.titleKey] || ""}
                                onChange={(e) =>
                                  handleFieldChange(tour.titleKey as keyof SiteContent, e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-semibold"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-outline mb-1">
                                  Starting Price
                                </label>
                                <input
                                  type="text"
                                  value={(content as any)[tour.priceKey] || ""}
                                  onChange={(e) =>
                                    handleFieldChange(tour.priceKey as keyof SiteContent, e.target.value)
                                  }
                                  placeholder="e.g. ₹14,500"
                                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-bold text-primary"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-outline mb-1">
                                  Card Photo URL
                                </label>
                                <input
                                  type="url"
                                  value={currentImg || ""}
                                  onChange={(e) =>
                                    handleFieldChange(tour.imageKey as keyof SiteContent, e.target.value)
                                  }
                                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-outline mb-1">
                                Description
                              </label>
                              <textarea
                                rows={2}
                                value={(content as any)[tour.descKey] || ""}
                                onChange={(e) =>
                                  handleFieldChange(tour.descKey as keyof SiteContent, e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs"
                              />
                            </div>

                            {/* 1-Click Presets */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] text-outline font-semibold">Presets:</span>
                              {PHOTO_PRESETS.map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    handleFieldChange(tour.imageKey as keyof SiteContent, preset.url)
                                  }
                                  className="px-2 py-0.5 rounded text-[10px] bg-surface-container-lowest hover:bg-primary hover:text-white transition-colors border border-outline-variant/20"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Image Thumbnail Preview */}
                          <div className="space-y-1">
                            <span className="block text-[11px] font-semibold text-outline">
                              Live Card Preview
                            </span>
                            <div className="w-full h-36 rounded-xl overflow-hidden border border-outline-variant/30 bg-neutral-900 relative">
                              {currentImg ? (
                                <img
                                  src={currentImg}
                                  alt="Tour preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-outline text-xs">
                                  No photo
                                </div>
                              )}
                              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white truncate">
                                {(content as any)[tour.priceKey] || "₹0"} • {(content as any)[tour.titleKey] || "Tour"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WHY CHOOSE US */}
        {/* ========================================================================= */}
        {activeTab === "why" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                <span>Why Trip Connect Trust Section</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Top Badge
                  </label>
                  <input
                    type="text"
                    value={content.why_badge}
                    onChange={(e) => handleFieldChange("why_badge", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Main Heading
                  </label>
                  <input
                    type="text"
                    value={content.why_title}
                    onChange={(e) => handleFieldChange("why_title", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary font-bold text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Section Narrative / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={content.why_subtitle}
                    onChange={(e) => handleFieldChange("why_subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Side Showcase Image URL
                  </label>
                  <input
                    type="url"
                    value={content.why_image}
                    onChange={(e) => handleFieldChange("why_image", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono focus:ring-2 focus:ring-primary"
                  />
                </div>

                {content.why_image && (
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-outline-variant/30">
                    <img
                      src={content.why_image}
                      alt="Why preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* 4 Value Cards */}
              <div className="pt-6 border-t border-outline-variant/20 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Four Core Value Cards
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { titleKey: "why_card_1_title", descKey: "why_card_1_desc", label: "Card 1: Personalized Planning" },
                    { titleKey: "why_card_2_title", descKey: "why_card_2_desc", label: "Card 2: Native Expertise" },
                    { titleKey: "why_card_3_title", descKey: "why_card_3_desc", label: "Card 3: Transparent Pricing" },
                    { titleKey: "why_card_4_title", descKey: "why_card_4_desc", label: "Card 4: Direct WhatsApp Support" },
                  ].map((card) => (
                    <div key={card.label} className="p-4 rounded-xl bg-surface-container-low space-y-2">
                      <span className="text-xs font-bold text-on-surface block">{card.label}</span>
                      <input
                        type="text"
                        value={(content as any)[card.titleKey]}
                        onChange={(e) => handleFieldChange(card.titleKey as keyof SiteContent, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        value={(content as any)[card.descKey]}
                        onChange={(e) => handleFieldChange(card.descKey as keyof SiteContent, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ABOUT PAGE */}
        {/* ========================================================================= */}
        {activeTab === "about" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                <span>About Trip Connect Page</span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Top Badge
                    </label>
                    <input
                      type="text"
                      value={content.about_badge}
                      onChange={(e) => handleFieldChange("about_badge", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={content.about_title}
                      onChange={(e) => handleFieldChange("about_title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Subtitle Summary
                  </label>
                  <textarea
                    rows={2}
                    value={content.about_subtitle}
                    onChange={(e) => handleFieldChange("about_subtitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    About Hero Image URL
                  </label>
                  <input
                    type="url"
                    value={content.about_image}
                    onChange={(e) => handleFieldChange("about_image", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono focus:ring-2 focus:ring-primary"
                  />
                </div>

                {content.about_image && (
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-outline-variant/30">
                    <img
                      src={content.about_image}
                      alt="About preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Our Story Narrative
                  </h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={content.about_story_p1}
                      onChange={(e) => handleFieldChange("about_story_p1", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={content.about_story_p2}
                      onChange={(e) => handleFieldChange("about_story_p2", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Mission Statement Title
                    </label>
                    <input
                      type="text"
                      value={content.about_mission_title}
                      onChange={(e) => handleFieldChange("about_mission_title", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      Mission Statement Description
                    </label>
                    <textarea
                      rows={2}
                      value={content.about_mission_desc}
                      onChange={(e) => handleFieldChange("about_mission_desc", e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT & FOOTER */}
        {/* ========================================================================= */}
        {activeTab === "contact" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">contact_support</span>
                <span>Concierge Contact &amp; Footer Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Official Phone Number
                  </label>
                  <input
                    type="text"
                    value={content.contact_phone}
                    onChange={(e) => handleFieldChange("contact_phone", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={content.contact_email}
                    onChange={(e) => handleFieldChange("contact_email", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    WhatsApp Desk Number (without &apos;+&apos;)
                  </label>
                  <input
                    type="text"
                    value={content.whatsapp_number}
                    onChange={(e) => handleFieldChange("whatsapp_number", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Concierge Operating Hours
                  </label>
                  <input
                    type="text"
                    value={content.business_hours}
                    onChange={(e) => handleFieldChange("business_hours", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Physical Office Address (Kochi, Kerala)
                </label>
                <input
                  type="text"
                  value={content.contact_address}
                  onChange={(e) => handleFieldChange("contact_address", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Footer Narrative</h4>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Footer Bio Description
                  </label>
                  <textarea
                    rows={3}
                    value={content.footer_description}
                    onChange={(e) => handleFieldChange("footer_description", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1.5">
                    Footer Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={content.footer_copyright}
                    onChange={(e) => handleFieldChange("footer_copyright", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-sm focus:ring-2 focus:ring-primary text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-on-surface-variant font-medium">
            Changes to text and images are saved to your database and immediately update live visitors.
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all shadow active:scale-[0.98] disabled:opacity-75"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
