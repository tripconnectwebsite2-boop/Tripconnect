"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Review } from "@/lib/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRev, setEditingRev] = useState<Partial<Review>>({
    customer_display_name: "",
    review_text: "",
    rating: 5,
    source_or_verification_note: "Verified Google Review",
    status: "approved",
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (rev: Review) => {
    const newStatus = rev.status === "approved" ? "hidden" : "approved";
    const res = await fetch(`/api/admin/reviews/${rev.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchReviews();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingRev.id;
    const url = isNew ? "/api/admin/reviews" : `/api/admin/reviews/${editingRev.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingRev),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchReviews();
    } else {
      alert("Failed to save review.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchReviews();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Customer Reviews Management
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage verified guest feedback and Google review credentials
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingRev({
                customer_display_name: "",
                review_text: "",
                rating: 5,
                source_or_verification_note: "Verified Google Review",
                status: "approved",
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
            <span>Add Verified Review</span>
          </button>
        </div>

        {/* Verification Guarantee Banner */}
        <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">verified</span>
          <p>
            <strong>Integrity Rule:</strong> Only authentic reviews from real Trip Connect travelers are permitted on the public website. Hidden or draft reviews will not be visible on the public frontend or included in structured review schemas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-outline">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="col-span-full py-16 text-center text-outline">No reviews recorded.</div>
          ) : (
            reviews.map((rev) => {
              const isApproved = rev.status === "approved";

              return (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[18px]">
                            star
                          </span>
                        ))}
                      </div>
                      <span
                        className={`text-xs font-bold uppercase ${
                          isApproved ? "text-secondary" : "text-outline"
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-on-surface">{rev.customer_display_name}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-4">
                      "{rev.review_text}"
                    </p>
                    {rev.source_or_verification_note && (
                      <span className="text-[11px] text-outline block">
                        Source: {rev.source_or_verification_note}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(rev)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        isApproved
                          ? "bg-amber-500/10 text-amber-800 hover:bg-amber-500/20"
                          : "bg-secondary text-white hover:bg-on-secondary-container"
                      }`}
                    >
                      {isApproved ? "Hide" : "Approve & Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rev.id)}
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
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/30 text-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">
                Add Genuine Customer Review
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="font-semibold block mb-1">Customer Display Name *</label>
                  <input
                    type="text"
                    required
                    value={editingRev.customer_display_name || ""}
                    onChange={(e) =>
                      setEditingRev({ ...editingRev, customer_display_name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Review Text *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingRev.review_text || ""}
                    onChange={(e) =>
                      setEditingRev({ ...editingRev, review_text: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1">Rating (1-5)</label>
                    <select
                      value={editingRev.rating}
                      onChange={(e) =>
                        setEditingRev({ ...editingRev, rating: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Status</label>
                    <select
                      value={editingRev.status}
                      onChange={(e) =>
                        setEditingRev({ ...editingRev, status: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                    >
                      <option value="approved">Approved (Public)</option>
                      <option value="hidden">Hidden</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Verification Note / Source</label>
                  <input
                    type="text"
                    value={editingRev.source_or_verification_note || ""}
                    onChange={(e) =>
                      setEditingRev({
                        ...editingRev,
                        source_or_verification_note: e.target.value,
                      })
                    }
                    placeholder="e.g. Verified Google Review • Alleppey & Munnar Tour"
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs"
                  />
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
                    Save Review
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
