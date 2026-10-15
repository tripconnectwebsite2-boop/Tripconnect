"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Image from "next/image";
import { Destination } from "@/lib/types";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Partial<Destination> | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/destinations");
      if (res.ok) {
        const data = await res.json();
        setDestinations(data.destinations || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openCreateModal = () => {
    setEditingDest({
      name: "",
      slug: "",
      region: "Kerala",
      short_description: "",
      description: "",
      cover_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCzwJauBQYcLbtjGtABpJpcaUOhNXWkeONV1e_6XO5-ecYvYrgSypw1qr2W0oslFPX81kUzt-ZHQ9CZsyx-Pp03zo0bUkargRdMM7g5Um5MInTOH01gD8CTKxyZMyMwXmdmw9Eo3tBaOBQde3kPrMl-P7qcC359ZFyTMtMvMlmduh2YTAjNbTzORzljYpB21iRDw0CrblpxqWsvWuDbrA7pMo26-MRd3xAIM2GAcn7NH5p8gYx4gWPDw",
      status: "published",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;

    const isNew = !editingDest.id;
    const url = isNew ? "/api/admin/destinations" : `/api/admin/destinations/${editingDest.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingDest),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingDest(null);
      fetchDestinations();
    } else {
      alert("Failed to save destination.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete destination "${name}"?`)) return;
    const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchDestinations();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Destination Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage regions and destination atlas profiles
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            <span>Add Destination</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-outline">
              Loading destinations...
            </div>
          ) : (
            destinations.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-surface-container-high">
                    <Image
                      src={d.cover_image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-semibold">
                      {d.region}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-1">
                      {d.name}
                    </h3>
                    <p className="text-xs text-outline line-clamp-2">{d.short_description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-outline-variant/10 mt-2">
                  <span className="text-[11px] font-semibold text-primary uppercase">{d.status}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDest(d);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-1.5 rounded-lg text-error hover:bg-error-container/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {isModalOpen && editingDest && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">
                {editingDest.id ? "Edit Destination" : "Add Destination"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Destination Name *</label>
                    <input
                      type="text"
                      required
                      value={editingDest.name || ""}
                      onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Region *</label>
                    <select
                      value={editingDest.region}
                      onChange={(e) =>
                        setEditingDest({ ...editingDest, region: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    >
                      <option value="Kerala">Kerala</option>
                      <option value="South India">South India</option>
                      <option value="North India">North India</option>
                      <option value="Pan India">Pan India</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={editingDest.short_description || ""}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, short_description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <ImageUploadField
                  label="Cover Photograph"
                  value={editingDest.cover_image || ""}
                  onChange={(url) => setEditingDest({ ...editingDest, cover_image: url })}
                  helperText="Upload image from your PC or enter an image URL."
                  previewHeight="h-36"
                  specs={{
                    ratio: "4:3 or 16:9",
                    measurement: "1200 × 800 px (Min 800px width)",
                    quality: "Maximum (High-Impact Destination Photo)",
                    maxSize: "Max 20MB (Recommended: 600KB – 2MB)",
                  }}
                />
                <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold"
                  >
                    Save
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
