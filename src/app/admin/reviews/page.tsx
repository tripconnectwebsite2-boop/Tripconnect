"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Google Reviews Live Sync State
  const [googleReviewCount, setGoogleReviewCount] = useState(122);
  const [googleRating, setGoogleRating] = useState(5.0);
  const [googleReviewsUrl, setGoogleReviewsUrl] = useState(
    "https://www.google.com/search?sca_esv=3c37b919d1c0a20a&sxsrf=APpeQnsQBeFlGryg8C-3YNc9gCiwY-ybZg:1792077470654&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_ycx-DTCj1xuY2o22e4ADWu-gAQ93o0pN1Babfm2IQHvGzW4cDIuWmeHU5d7op1kp2QGhaaGzVrZjVwLOIv2v1EKhNkoXu8QNEF34ufqcaxAjPyE0A%3D%3D&q=Trip+Connect+Kochi+Reviews&sa=X&ved=2ahUKEwiN-bDoqLyXAxXbcGwGHe70K8wQ0bkNegQINhAH&biw=1920&bih=945&dpr=1"
  );
  const [googleLastSynced, setGoogleLastSynced] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

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

  const fetchSyncMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reviews/sync");
      if (res.ok) {
        const data = await res.json();
        if (data.review_count !== undefined) setGoogleReviewCount(data.review_count);
        if (data.rating !== undefined) setGoogleRating(data.rating);
        if (data.url) setGoogleReviewsUrl(data.url);
        if (data.last_synced) setGoogleLastSynced(data.last_synced);
      }
    } catch (err) {
      console.error("Failed to fetch Google reviews sync metrics:", err);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
    fetchSyncMetrics();
  }, [fetchSyncMetrics]);

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/admin/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customUrl: googleReviewsUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoogleReviewCount(data.review_count);
        setGoogleRating(data.rating);
        setGoogleLastSynced(data.last_synced);
        setSyncMessage(data.message || `Successfully synced! Current count: ${data.review_count} reviews.`);
      } else {
        setSyncMessage(data.error || "Failed to sync reviews from Google.");
      }
    } catch (err: any) {
      setSyncMessage(err.message || "An error occurred during sync.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveManualMetrics = async () => {
    setSavingMetrics(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/admin/reviews/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manualCount: googleReviewCount,
          manualRating: googleRating,
          customUrl: googleReviewsUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoogleReviewCount(data.review_count);
        setGoogleRating(data.rating);
        setGoogleLastSynced(data.last_synced);
        setSyncMessage(data.message || "Google review count & URL updated across the entire website!");
      } else {
        setSyncMessage(data.error || "Failed to update review metrics.");
      }
    } catch (err: any) {
      setSyncMessage(err.message || "An error occurred while saving.");
    } finally {
      setSavingMetrics(false);
    }
  };

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
      <div className="space-y-6 text-on-surface">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Customer Reviews &amp; Ratings
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage live Google review synchronization, review counts, and verified client testimonials
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

        {/* ========================================================================= */}
        {/* GOOGLE REVIEWS LIVE SYNC & AUTO-UPDATE CARD */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-on-surface">Google Reviews Live Auto-Updater</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Automatically keeps the homepage review counter and Google rich-snippet schema synchronized
                </p>
              </div>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30 self-start md:self-auto">
              <div className="text-right">
                <span className="block text-base font-bold text-on-surface">
                  {googleRating.toFixed(1)} ★
                </span>
                <span className="text-[11px] text-outline font-semibold">
                  {googleReviewCount} Google Reviews
                </span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {syncMessage && (
            <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-container text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>{syncMessage}</span>
            </div>
          )}

          {/* Sync Form & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
            {/* Google Search URL */}
            <div className="lg:col-span-6 space-y-1">
              <label className="block font-semibold text-on-surface">
                Target Google Reviews / Business URL
              </label>
              <input
                type="text"
                value={googleReviewsUrl}
                onChange={(e) => setGoogleReviewsUrl(e.target.value)}
                placeholder="https://www.google.com/search?q=Trip+Connect+Kochi+Reviews..."
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-[10px] text-outline block">
                Destination link used when visitors click &quot;Write a review&quot; or &quot;Verified Google Reviews&quot;.
              </span>
            </div>

            {/* Review Count Input */}
            <div className="lg:col-span-2 space-y-1">
              <label className="block font-semibold text-on-surface">Review Count</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={googleReviewCount}
                  onChange={(e) => setGoogleReviewCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-bold text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[10px]">
                  reviews
                </span>
              </div>
            </div>

            {/* Rating Input */}
            <div className="lg:col-span-2 space-y-1">
              <label className="block font-semibold text-on-surface">Rating Score</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={googleRating}
                  onChange={(e) => setGoogleRating(parseFloat(e.target.value) || 5.0)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 font-bold text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500 text-[12px]">
                  ★
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2 flex flex-col justify-end gap-1.5">
              <button
                type="button"
                disabled={syncing}
                onClick={handleTriggerSync}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs inline-flex items-center justify-center gap-1.5 border border-outline-variant/30 transition-all disabled:opacity-60"
              >
                {syncing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
                    <span>Auto-Sync Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={savingMetrics}
                onClick={handleSaveManualMetrics}
                className="w-full px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
              >
                {savingMetrics ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Update Count</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-outline pt-2 border-t border-outline-variant/15">
            <div>
              {googleLastSynced && (
                <span>Last Synced: {new Date(googleLastSynced).toLocaleString()}</span>
              )}
            </div>
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-0.5"
            >
              <span>Verify Google Search Link</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Verification Guarantee Banner */}
        <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">verified</span>
          <p>
            <strong>Integrity Rule:</strong> Only authentic reviews from real Trip Connect travelers are permitted on the public website. Hidden or draft reviews will not be visible on the public frontend or included in structured review schemas.
          </p>
        </div>

        {/* Reviews Grid */}
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

                    <p className="font-body-md text-sm text-on-surface leading-relaxed">
                      {rev.review_text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20 mt-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-on-surface">
                        {rev.customer_display_name}
                      </h4>
                      <p className="text-[10px] text-outline">
                        {rev.source_or_verification_note || "Guest Review"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(rev)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container text-[11px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        {isApproved ? "Hide" : "Approve"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRev(rev);
                          setIsModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-outline hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rev.id)}
                        className="p-1 rounded-lg text-outline hover:text-error"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Edit Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg shadow-xl space-y-4">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                {editingRev.id ? "Edit Review" : "Add Verified Review"}
              </h3>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Customer Display Name</label>
                  <input
                    type="text"
                    required
                    value={editingRev.customer_display_name || ""}
                    onChange={(e) =>
                      setEditingRev({ ...editingRev, customer_display_name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={editingRev.rating || 5}
                    onChange={(e) =>
                      setEditingRev({ ...editingRev, rating: parseInt(e.target.value, 10) || 5 })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Review Content</label>
                  <textarea
                    rows={4}
                    required
                    value={editingRev.review_text || ""}
                    onChange={(e) =>
                      setEditingRev({ ...editingRev, review_text: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Source / Verification Note</label>
                  <input
                    type="text"
                    value={editingRev.source_or_verification_note || ""}
                    onChange={(e) =>
                      setEditingRev({
                        ...editingRev,
                        source_or_verification_note: e.target.value,
                      })
                    }
                    placeholder="e.g. Verified Google Review"
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select
                    value={editingRev.status || "approved"}
                    onChange={(e) =>
                      setEditingRev({
                        ...editingRev,
                        status: e.target.value as "draft" | "approved" | "hidden",
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30"
                  >
                    <option value="approved">Approved &amp; Live</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="hidden">Hidden</option>
                  </select>
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
