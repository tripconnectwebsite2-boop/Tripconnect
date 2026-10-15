"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { CustomPage } from "@/lib/types";

export default function AdminCustomPagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "hero" | "navigation" | "seo">("content");
  const [highlightInput, setHighlightInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openCreateModal = () => {
    setEditingPage({
      title: "",
      slug: "",
      hero_title: "",
      hero_subtitle: "",
      hero_image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXa4pkOq0ty9_41mIx9UTEheTGIuJxcg9o0D40EZJRkTZnoyL4hB1gCuk62Bvhd7lMOPIa26eBygCDhuweowtOxzg_CChGSVglWspZ0TZmJC7seoNVyu1DB_X_74wtIE5DbM2hvPryKN76goIUdONWjazCD4hkEN8ncjerEygEnCEFj6vYwl_fa-xKJwjOOE_eUwTDeFVCmWra8gE5fE72kVXD0LX-Nla2PYGEI6BnnTlwN9iwaGn0A",
      content: `## Welcome to this Experience\n\nWrite your rich content here. You can use markdown headings, bullet points, and paragraphs to describe this service or custom journey in full detail.\n\n### What Makes This Special\n* Tailored exclusively for your group\n* Expert local guides and premium vehicles\n* Direct on-call concierge assistance`,
      highlights: [
        "Dedicated private vehicle & native Kerala driver",
        "Handpicked luxury accommodations & verified stays",
        "Transparent, all-inclusive pricing with zero surprises",
      ],
      show_in_header: true,
      show_in_footer: true,
      cta_title: "Inquire via WhatsApp",
      cta_whatsapp: true,
      status: "published",
      seo_title: "",
      seo_description: "",
    });
    setActiveTab("content");
    setHighlightInput("");
    setPreviewMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (page: CustomPage) => {
    setEditingPage({
      ...page,
      highlights: Array.isArray(page.highlights) ? [...page.highlights] : [],
    });
    setActiveTab("content");
    setHighlightInput("");
    setPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingPage) return;
    const isNew = !editingPage.id;
    // Auto generate slug only if new page or slug matches previous auto title
    if (isNew) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setEditingPage({
        ...editingPage,
        title: val,
        slug: generatedSlug,
        hero_title: editingPage.hero_title || val,
      });
    } else {
      setEditingPage({
        ...editingPage,
        title: val,
      });
    }
  };

  const addHighlight = () => {
    if (!highlightInput.trim() || !editingPage) return;
    const current = editingPage.highlights || [];
    setEditingPage({
      ...editingPage,
      highlights: [...current, highlightInput.trim()],
    });
    setHighlightInput("");
  };

  const removeHighlight = (index: number) => {
    if (!editingPage || !editingPage.highlights) return;
    const next = editingPage.highlights.filter((_, i) => i !== index);
    setEditingPage({
      ...editingPage,
      highlights: next,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage || !editingPage.title) {
      alert("Please provide a page title.");
      return;
    }

    try {
      setSaving(true);
      const isNew = !editingPage.id;
      const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${editingPage.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPage),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingPage(null);
        await fetchPages();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Failed to save page.");
      }
    } catch {
      alert("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/pages/${deleteConfirmId}`, { method: "DELETE" });
      if (res.ok) {
        setPages((prev) => prev.filter((p) => p.id !== deleteConfirmId));
        setDeleteConfirmId(null);
      } else {
        alert("Failed to delete page.");
      }
    } catch {
      alert("Network error deleting page.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const copyUrl = (slug: string) => {
    const fullUrl = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const publishedCount = pages.filter((p) => p.status === "published").length;
  const draftCount = pages.filter((p) => p.status === "draft").length;
  const inHeaderCount = pages.filter((p) => p.show_in_header).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">
                auto_stories
              </span>
              <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
                Custom Pages Builder
              </h1>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Add new custom pages, landing sections, or bespoke concierge experiences. Added pages automatically get their own live URL.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-all shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Create New Page</span>
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider block">
                Total Pages
              </span>
              <span className="text-xl font-bold text-on-surface">{pages.length}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider block">
                Published Live
              </span>
              <span className="text-xl font-bold text-emerald-600">{publishedCount}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider block">
                Drafts
              </span>
              <span className="text-xl font-bold text-amber-600">{draftCount}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">link</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider block">
                In Navigation
              </span>
              <span className="text-xl font-bold text-secondary">{inHeaderCount}</span>
            </div>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-outline flex flex-col items-center gap-3">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary">
                progress_activity
              </span>
              <span className="font-body-md text-body-md">Loading custom pages...</span>
            </div>
          ) : pages.length === 0 ? (
            <div className="py-16 px-6 text-center text-on-surface-variant flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[36px]">auto_stories</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  No Custom Pages Created Yet
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto mt-1">
                  Create your first dynamic page for custom itineraries, special fleet services, or corporate retreat packages.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Create Your First Page</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
                      {page.hero_image ? (
                        <Image
                          src={page.hero_image}
                          alt={page.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-[24px]">image</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">
                          {page.title}
                        </h2>
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            page.status === "published"
                              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-700 border border-amber-500/30"
                          }`}
                        >
                          {page.status}
                        </span>
                        {page.show_in_header && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                            Header Menu
                          </span>
                        )}
                        {page.show_in_footer && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary/10 text-secondary">
                            Footer Link
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-mono pt-1">
                        <span className="inline-flex items-center gap-1 text-primary hover:underline">
                          <span>/p/{page.slug}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => copyUrl(page.slug)}
                          className="hover:text-primary inline-flex items-center gap-1 font-sans text-outline"
                          title="Copy Public URL"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedSlug === page.slug ? "done" : "content_copy"}
                          </span>
                          <span>{copiedSlug === page.slug ? "Copied" : "Copy Link"}</span>
                        </button>
                        <span className="text-outline font-sans">
                          Updated: {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/p/${page.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
                      title="Open Live Website View"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        open_in_new
                      </span>
                      <span>Live View</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(page)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(page.id)}
                      className="p-1.5 rounded-lg hover:bg-error-container/20 text-outline hover:text-error transition-colors"
                      title="Delete Page"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-error-container/20 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">delete_forever</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Delete Custom Page?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Are you sure you want to delete this custom page? This action cannot be undone and its public URL will return a 404.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 rounded-xl bg-error hover:bg-error/90 text-on-error text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  {deleteLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[16px]">
                      progress_activity
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  )}
                  <span>Delete Page</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit Drawer Modal */}
        {isModalOpen && editingPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
            <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-2xl overflow-hidden my-6">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">
                      {editingPage.id ? "edit_note" : "add_to_photos"}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {editingPage.id ? `Edit: ${editingPage.title}` : "Create New Custom Page"}
                    </h2>
                    <p className="text-xs text-on-surface-variant">
                      Live URL: <code className="text-primary font-mono font-semibold">/p/{editingPage.slug || "your-slug"}</code>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPage(null);
                  }}
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-outline-variant/30 px-6 bg-surface-container-lowest gap-4 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "content"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">article</span>
                  <span>Title &amp; Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("hero")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "hero"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">panorama</span>
                  <span>Hero Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("navigation")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "navigation"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Navigation &amp; CTA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === "seo"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>SEO &amp; Meta</span>
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
                {/* TAB 1: Title, Slug & Content */}
                {activeTab === "content" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          Page Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPage.title || ""}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. Ayurvedic Wellness Retreats"
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          URL Slug * (creates /p/{editingPage.slug || "..."})
                        </label>
                        <input
                          type="text"
                          required
                          value={editingPage.slug || ""}
                          onChange={(e) =>
                            setEditingPage({
                              ...editingPage,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-|-$/g, ""),
                            })
                          }
                          placeholder="ayurvedic-wellness-retreats"
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-mono focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface block">
                          Publication Status
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          Published pages are instantly accessible to guests on the website.
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPage({ ...editingPage, status: "draft" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            editingPage.status === "draft"
                              ? "bg-amber-500 text-white shadow-sm"
                              : "bg-surface text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPage({ ...editingPage, status: "published" })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            editingPage.status === "published"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-surface text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          Published
                        </button>
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                          Body Content (Markdown Supported)
                        </label>
                        <button
                          type="button"
                          onClick={() => setPreviewMode(!previewMode)}
                          className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {previewMode ? "edit" : "visibility"}
                          </span>
                          <span>{previewMode ? "Back to Editor" : "Preview Render"}</span>
                        </button>
                      </div>

                      {previewMode ? (
                        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 min-h-[220px] prose prose-sm max-w-none text-on-surface">
                          <div className="whitespace-pre-line leading-relaxed text-sm">
                            {editingPage.content || "No content yet. Switch back to editor to add text."}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Formatting Helper Buttons */}
                          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingPage({
                                  ...editingPage,
                                  content: (editingPage.content || "") + "\n\n## Section Title\n",
                                })
                              }
                              className="px-2 py-1 rounded bg-surface hover:bg-surface-container text-on-surface font-semibold"
                            >
                              + Heading 2
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingPage({
                                  ...editingPage,
                                  content: (editingPage.content || "") + "\n\n### Subheading\n",
                                })
                              }
                              className="px-2 py-1 rounded bg-surface hover:bg-surface-container text-on-surface font-semibold"
                            >
                              + Heading 3
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingPage({
                                  ...editingPage,
                                  content:
                                    (editingPage.content || "") +
                                    "\n* Bullet Point 1\n* Bullet Point 2\n",
                                })
                              }
                              className="px-2 py-1 rounded bg-surface hover:bg-surface-container text-on-surface font-semibold"
                            >
                              + Bullet List
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingPage({
                                  ...editingPage,
                                  content: (editingPage.content || "") + " **Bold Text** ",
                                })
                              }
                              className="px-2 py-1 rounded bg-surface hover:bg-surface-container text-on-surface font-semibold"
                            >
                              Bold
                            </button>
                          </div>
                          <textarea
                            rows={10}
                            value={editingPage.content || ""}
                            onChange={(e) =>
                              setEditingPage({ ...editingPage, content: e.target.value })
                            }
                            placeholder="Write comprehensive article, details, itineraries, or highlights..."
                            className="w-full px-4 py-3 rounded-2xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-sans focus:border-primary focus:outline-none leading-relaxed"
                          />
                        </div>
                      )}
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-3 pt-2 border-t border-outline-variant/20">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                          Key Highlights &amp; Features (Bullet Points)
                        </label>
                        <p className="text-xs text-on-surface-variant">
                          Displayed in a prominent luxury badge card beside the main content.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addHighlight();
                            }
                          }}
                          placeholder="e.g. Verified English-speaking mountain chauffeurs"
                          className="flex-1 px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={addHighlight}
                          className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          <span>Add</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {(editingPage.highlights || []).map((hl, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-xs text-on-surface"
                          >
                            <span className="material-symbols-outlined text-primary text-[14px]">
                              check_circle
                            </span>
                            <span>{hl}</span>
                            <button
                              type="button"
                              onClick={() => removeHighlight(idx)}
                              className="hover:text-error ml-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Hero Banner */}
                {activeTab === "hero" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                        Hero Display Title (Defaults to Page Title)
                      </label>
                      <input
                        type="text"
                        value={editingPage.hero_title || ""}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, hero_title: e.target.value })
                        }
                        placeholder={editingPage.title || "e.g. Private Backwater Houseboat Journeys"}
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                        Hero Subtitle / Tagline
                      </label>
                      <textarea
                        rows={2}
                        value={editingPage.hero_subtitle || ""}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, hero_subtitle: e.target.value })
                        }
                        placeholder="Brief 1-2 sentence hook describing this experience..."
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <ImageUploadField
                        label="Hero Banner Image"
                        value={editingPage.hero_image || ""}
                        onChange={(url) => setEditingPage({ ...editingPage, hero_image: url })}
                        helperText="Used as the top scenic header banner. High-resolution landscape photo recommended."
                        aspectRatio="aspect-[21/9]"
                        specs={{
                          ratio: "21:9 or 16:9",
                          measurement: "1920 × 800 px (min 1200px width)",
                          quality: "High-Res Scenic Photo",
                          maxSize: "Max 10MB",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: Navigation & CTA */}
                {activeTab === "navigation" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                        Menu &amp; Navigation Placements
                      </h4>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingPage.show_in_header)}
                          onChange={(e) =>
                            setEditingPage({ ...editingPage, show_in_header: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-primary border-outline focus:ring-primary"
                        />
                        <div>
                          <span className="text-sm font-semibold text-on-surface block">
                            Show in Header Navigation Menu
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            Add a direct link to this page in the top website header bar.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(editingPage.show_in_footer)}
                          onChange={(e) =>
                            setEditingPage({ ...editingPage, show_in_footer: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-primary border-outline focus:ring-primary"
                        />
                        <div>
                          <span className="text-sm font-semibold text-on-surface block">
                            Show in Footer Quick Links
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            Include this page in the website footer under Quick Links.
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
                      <h4 className="font-headline-sm text-sm font-bold text-on-surface">
                        Call-To-Action (CTA) Settings
                      </h4>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPage.cta_whatsapp !== false}
                          onChange={(e) =>
                            setEditingPage({ ...editingPage, cta_whatsapp: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-primary border-outline focus:ring-primary"
                        />
                        <div>
                          <span className="text-sm font-semibold text-on-surface block">
                            Enable WhatsApp Concierge Inquiry Button
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            Presents guests with a direct 1-click WhatsApp button pre-filled with this page title.
                          </span>
                        </div>
                      </label>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={editingPage.cta_title || ""}
                          onChange={(e) =>
                            setEditingPage({ ...editingPage, cta_title: e.target.value })
                          }
                          placeholder="Inquire via WhatsApp"
                          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: SEO & Meta */}
                {activeTab === "seo" && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={editingPage.seo_title || ""}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, seo_title: e.target.value })
                        }
                        placeholder={`${editingPage.title || "Custom Page"} | Trip Connect Kochi`}
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                      />
                      <span className="text-[11px] text-on-surface-variant block mt-1">
                        Recommended length: 50 – 60 characters for Google Search results.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingPage.seo_description || ""}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, seo_description: e.target.value })
                        }
                        placeholder="Concise overview summarizing this page for search engines and social shares."
                        className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm focus:border-primary focus:outline-none"
                      />
                      <span className="text-[11px] text-on-surface-variant block mt-1">
                        Recommended length: 120 – 160 characters.
                      </span>
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">
                    {editingPage.status === "published" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Will be live immediately
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">edit_note</span>
                        Saved as internal draft
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingPage(null);
                      }}
                      className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                    >
                      {saving && (
                        <span className="material-symbols-outlined animate-spin text-[16px]">
                          progress_activity
                        </span>
                      )}
                      <span>{editingPage.id ? "Update Page" : "Publish New Page"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
