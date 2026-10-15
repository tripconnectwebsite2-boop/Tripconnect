"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { TravelPackage, PackageCategory } from "@/lib/types";
import Link from "next/link";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingPkg, setEditingPkg] = useState<Partial<TravelPackage> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (search.trim()) query.set("search", search.trim());

      const res = await fetch(`/api/admin/packages?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [statusFilter]);

  const openCreateModal = () => {
    setEditingPkg({
      title: "",
      slug: "",
      category: "Kerala Tours",
      destination_name: "Munnar",
      starting_price: 15000,
      currency: "INR",
      duration_days: 4,
      duration_nights: 3,
      short_description: "",
      description: "",
      highlights: ["Luxury accommodation", "Private AC transfers", "Curated daily itinerary"],
      itinerary: [
        { day: 1, title: "Arrival & Transfer", description: "Arrive at Cochin and transfer to resort." },
        { day: 2, title: "Sightseeing & Nature Walk", description: "Full day exploration." },
      ],
      inclusions: ["Breakfast", "AC vehicle with driver", "Toll & parking fees"],
      exclusions: ["Airfare", "Personal expenses"],
      status: "draft", // Defaults to DRAFT
      content_verified: false,
    });
    setValidationErrors([]);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: TravelPackage) => {
    setEditingPkg({ ...pkg });
    setValidationErrors([]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    setIsSaving(true);
    setValidationErrors([]);

    try {
      const isNew = !editingPkg.id;
      const url = isNew ? "/api/admin/packages" : `/api/admin/packages/${editingPkg.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPkg),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.validationErrors) {
          setValidationErrors(data.validationErrors);
        } else {
          setValidationErrors([data.error || "Failed to save package."]);
        }
        setIsSaving(false);
        return;
      }

      setIsModalOpen(false);
      setEditingPkg(null);
      fetchPackages();
    } catch (err: any) {
      setValidationErrors([err?.message || "Failed to save package."]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (pkg: TravelPackage) => {
    const newStatus = pkg.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          content_verified: newStatus === "published" ? true : pkg.content_verified,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(
          data.validationErrors
            ? `Cannot publish package:\n• ${data.validationErrors.join("\n• ")}`
            : data.error || "Failed to update package status."
        );
        return;
      }
      fetchPackages();
    } catch {
      alert("Network error updating status.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove package "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPackages();
      }
    } catch {
      alert("Failed to delete package.");
    }
  };

  const categories: PackageCategory[] = [
    "Kerala Tours",
    "India Tours",
    "Family Trips",
    "Honeymoon Packages",
    "Adventure & Nature",
    "Weekend & Short Trips",
    "Custom / Tailor-Made Trips",
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Package Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Create, review, verify, and publish bespoke travel itineraries
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Package</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {["all", "published", "draft"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-xs text-outline">
            Showing {packages.length} travel packages (Draft packages are hidden from the public website)
          </div>
        </div>

        {/* Packages Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-outline">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Loading packages...
            </div>
          ) : packages.length === 0 ? (
            <div className="col-span-full py-16 text-center text-outline">
              No packages found for the selected filter.
            </div>
          ) : (
            packages.map((pkg) => {
              const isPublished = pkg.status === "published";

              return (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 bg-surface-container-high overflow-hidden">
                    <img
                      src={pkg.gallery[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isPublished
                            ? "bg-secondary-container text-on-secondary-container"
                            : "bg-amber-500/20 text-amber-800 border border-amber-500/30"
                        }`}
                      >
                        {pkg.status}
                      </span>
                      {pkg.content_verified ? (
                        <span className="px-2 py-0.5 rounded-md bg-secondary text-white text-[10px] font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-outline/20 text-outline text-[10px] font-medium">
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-white font-mono text-xs">
                      {pkg.duration_days}D / {pkg.duration_nights}N
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
                        {pkg.category}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-1 line-clamp-1">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-outline line-clamp-2 mb-3">
                        {pkg.short_description}
                      </p>
                      <div className="text-xs font-semibold text-on-surface mb-4">
                        Starting from ₹{pkg.starting_price.toLocaleString()} /person
                      </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(pkg)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isPublished
                              ? "bg-amber-500/10 text-amber-800 hover:bg-amber-500/20"
                              : "bg-secondary text-white hover:bg-on-secondary-container"
                          }`}
                        >
                          {isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(pkg)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface"
                          title="Preview Page"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(pkg.id, pkg.title)}
                          className="p-1.5 rounded-lg text-error hover:bg-error-container/20"
                          title="Delete Package"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && editingPkg && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/30 p-6 lg:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-6">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {editingPkg.id ? "Edit Travel Package" : "Create New Travel Package"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    Validation Errors:
                  </div>
                  {validationErrors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5 text-xs">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">Package Title *</label>
                    <input
                      type="text"
                      required
                      value={editingPkg.title || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, title: e.target.value })}
                      placeholder="e.g. Munnar Cloud Mist & Tea Trails"
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">URL Slug</label>
                    <input
                      type="text"
                      value={editingPkg.slug || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, slug: e.target.value })}
                      placeholder="e.g. munnar-tea-trails"
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                </div>

                {/* Category & Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">Trip Category *</label>
                    <select
                      value={editingPkg.category}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, category: e.target.value as PackageCategory })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">Destination / Route Summary</label>
                    <input
                      type="text"
                      value={editingPkg.destination_name || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, destination_name: e.target.value })}
                      placeholder="e.g. Cochin • Munnar • Thekkady"
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">Starting Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingPkg.starting_price ?? 0}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, starting_price: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">Duration Days</label>
                    <input
                      type="number"
                      min={1}
                      value={editingPkg.duration_days ?? 1}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, duration_days: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-on-surface">Duration Nights</label>
                    <input
                      type="number"
                      min={0}
                      value={editingPkg.duration_nights ?? 0}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, duration_nights: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Short Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingPkg.short_description || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, short_description: e.target.value })}
                    placeholder="Brief editorial summary shown on catalog cards..."
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>

                {/* Detailed Description */}
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Detailed Overview</label>
                  <textarea
                    rows={3}
                    value={editingPkg.description || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                    placeholder="Full journey narrative..."
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>

                {/* Publication Status & Verification Confirmation */}
                <div className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-on-surface block">Publication Lifecycle</span>
                      <span className="text-[11px] text-outline">
                        Only published packages with verified content are shown on the public site.
                      </span>
                    </div>
                    <select
                      value={editingPkg.status}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, status: e.target.value as any })
                      }
                      className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-semibold text-xs"
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="published">Publish to Public Site</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={Boolean(editingPkg.content_verified)}
                      onChange={(e) =>
                        setEditingPkg({ ...editingPkg, content_verified: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-on-surface">
                      <strong>Content Verification Checklist Passed:</strong> Pricing, itinerary details, hotel categories, and vehicle terms have been verified by Trip Connect staff.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Package"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
