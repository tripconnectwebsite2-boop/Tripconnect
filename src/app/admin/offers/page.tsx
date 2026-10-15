"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { SpecialOffer } from "@/lib/types";

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<SpecialOffer>>({
    title: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    valid_from: new Date().toISOString().split("T")[0],
    valid_until: "2026-12-31",
    status: "active",
    content_verified: true,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/offers");
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingOffer.id;
    const url = isNew ? "/api/admin/offers" : `/api/admin/offers/${editingOffer.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingOffer),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchOffers();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save offer.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this offer?")) return;
    const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchOffers();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Special Offers Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage approved seasonal discounts and promotional banners
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingOffer({
                title: "",
                description: "",
                discount_type: "percentage",
                discount_value: 10,
                valid_from: new Date().toISOString().split("T")[0],
                valid_until: "2026-12-31",
                status: "active",
                content_verified: true,
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New Offer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-outline">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-outline">No offers configured.</div>
          ) : (
            offers.map((offer) => {
              const today = new Date().toISOString().split("T")[0];
              const isExpired = offer.valid_until < today;

              return (
                <div
                  key={offer.id}
                  className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-white">
                        {offer.discount_value}% OFF
                      </span>
                      <span
                        className={`text-xs font-semibold uppercase ${
                          isExpired
                            ? "text-error"
                            : offer.status === "active"
                            ? "text-secondary"
                            : "text-outline"
                        }`}
                      >
                        {isExpired ? "EXPIRED" : offer.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {offer.description}
                    </p>
                    <div className="text-xs text-outline pt-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">date_range</span>
                      <span>
                        Valid: {offer.valid_from} to {offer.valid_until}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOffer(offer);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(offer.id)}
                      className="p-1.5 rounded-lg text-error hover:bg-error-container/20"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant/30 text-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">
                {editingOffer.id ? "Edit Special Offer" : "Create Special Offer"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="font-semibold block mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    value={editingOffer.title || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingOffer.description || ""}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Discount %</label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={editingOffer.discount_value ?? 10}
                      onChange={(e) =>
                        setEditingOffer({ ...editingOffer, discount_value: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Status</label>
                    <select
                      value={editingOffer.status}
                      onChange={(e) =>
                        setEditingOffer({ ...editingOffer, status: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Valid From *</label>
                    <input
                      type="date"
                      required
                      value={editingOffer.valid_from || ""}
                      onChange={(e) =>
                        setEditingOffer({ ...editingOffer, valid_from: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Valid Until *</label>
                    <input
                      type="date"
                      required
                      value={editingOffer.valid_until || ""}
                      onChange={(e) =>
                        setEditingOffer({ ...editingOffer, valid_until: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    />
                  </div>
                </div>

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
                    Save Offer
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
