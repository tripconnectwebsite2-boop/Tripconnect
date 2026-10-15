"use client";

import { useState, useEffect, useTransition } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Enquiry, EnquiryStatus, EnquiryNote } from "@/lib/types";
import { buildAdminFollowUpWhatsAppUrl } from "@/lib/notifications/whatsapp";

export default function AdminEnquiriesCRMPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (search.trim()) query.set("search", search.trim());

      const res = await fetch(`/api/admin/enquiries?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openEnquiryDetails = async (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch {
      setNotes([]);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNote.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes((prev) => [...prev, data.note]);
        setNewNote("");
      }
    } finally {
      setAddingNote(false);
    }
  };

  const handleExportCsv = () => {
    const query = new URLSearchParams();
    if (statusFilter !== "all") query.set("status", statusFilter);
    if (search.trim()) query.set("search", search.trim());
    window.location.href = `/api/admin/enquiries/export?${query.toString()}`;
  };

  const statusBadgeColors = {
    new: "bg-primary/10 text-primary border-primary/20",
    contacted: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    confirmed: "bg-secondary-container text-on-secondary-container border-secondary/20",
    closed: "bg-surface-container-high text-outline border-outline-variant/20",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">
              Enquiries CRM
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage lead lifecycle, follow-up notes, and direct guest communication
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["all", "new", "contacted", "confirmed", "closed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, email..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-outline">
                search
              </span>
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Enquiries Table */}
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-md text-xs uppercase tracking-wider border-b border-outline-variant/20">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Package / Route</th>
                  <th className="py-3.5 px-6">Travel Date</th>
                  <th className="py-3.5 px-6">Pax</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Submitted</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-outline">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading enquiries...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-outline">
                      No matching enquiries found.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => {
                    const waUrl = buildAdminFollowUpWhatsAppUrl(
                      enq.phone,
                      enq.customer_name,
                      enq.package_title || enq.preferred_destination
                    );

                    return (
                      <tr key={enq.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => openEnquiryDetails(enq)}
                            className="font-semibold text-primary hover:underline text-left block"
                          >
                            {enq.customer_name}
                          </button>
                          <div className="text-xs text-outline">{enq.phone}</div>
                          <div className="text-xs text-outline truncate max-w-[180px]">{enq.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-on-surface block">
                            {enq.package_title || enq.preferred_destination || "Custom Itinerary"}
                          </span>
                          {enq.marketing_consent && (
                            <span className="text-[10px] text-secondary font-semibold bg-secondary/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              ✓ Opted in for updates
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {enq.travel_date || "Flexible"}
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">
                          {enq.traveller_count} Pax
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                            className={`text-xs font-semibold uppercase tracking-wider rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                              statusBadgeColors[enq.status]
                            }`}
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="closed">CLOSED</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-xs text-outline">
                          {new Date(enq.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <span className="material-symbols-outlined text-[18px]">chat</span>
                            </a>
                            <a
                              href={`mailto:${enq.email}?subject=Trip Connect Itinerary Consultation: ${encodeURIComponent(
                                enq.package_title || "Bespoke Journey"
                              )}`}
                              className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                              title="Send Email"
                            >
                              <span className="material-symbols-outlined text-[18px]">mail</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => openEnquiryDetails(enq)}
                              className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors"
                            >
                              Notes
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enquiry Detail & Follow-up Notes Drawer Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xl bg-surface-container-lowest h-full shadow-2xl p-6 lg:p-8 overflow-y-auto flex flex-col justify-between border-l border-outline-variant/30 animate-fadeIn">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                  <div>
                    <span className="text-xs text-primary uppercase font-bold tracking-wider">
                      Enquiry Detail
                    </span>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                      {selectedEnquiry.customer_name}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs">
                  <div>
                    <span className="text-outline block mb-0.5">Phone / WhatsApp</span>
                    <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-primary">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-outline block mb-0.5">Email</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-primary truncate block">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-outline block mb-0.5">Preferred Route</span>
                    <span className="font-semibold text-on-surface">
                      {selectedEnquiry.package_title || selectedEnquiry.preferred_destination || "Bespoke"}
                    </span>
                  </div>
                  <div>
                    <span className="text-outline block mb-0.5">Travel Date &amp; Pax</span>
                    <span className="font-semibold text-on-surface">
                      {selectedEnquiry.travel_date || "Flexible"} • {selectedEnquiry.traveller_count} Pax
                    </span>
                  </div>
                </div>

                {/* Customer Requirements */}
                {selectedEnquiry.additional_requirements && (
                  <div className="p-4 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 text-xs">
                    <span className="font-semibold text-on-surface block mb-1">Guest Requirements:</span>
                    <p className="text-on-surface-variant leading-relaxed">
                      {selectedEnquiry.additional_requirements}
                    </p>
                  </div>
                )}

                {/* Status Switcher */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs font-semibold text-on-surface">Lifecycle Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)
                    }
                    className="text-xs font-semibold uppercase tracking-wider rounded-lg px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 focus:outline-none"
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={buildAdminFollowUpWhatsAppUrl(
                      selectedEnquiry.phone,
                      selectedEnquiry.customer_name,
                      selectedEnquiry.package_title || selectedEnquiry.preferred_destination
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-secondary text-white font-label-md text-xs font-semibold flex items-center justify-center gap-2 hover:bg-on-secondary-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>WhatsApp Client</span>
                  </a>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Trip Connect Itinerary Consultation`}
                    className="py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                    <span>Send Email</span>
                  </a>
                </div>

                {/* Notes History Thread */}
                <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">notes</span>
                    Internal Follow-up Notes
                  </h3>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto">
                    {notes.length === 0 ? (
                      <p className="text-xs text-outline py-2">No follow-up notes recorded yet.</p>
                    ) : (
                      notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs"
                        >
                          <div className="flex items-center justify-between text-[10px] text-outline mb-1">
                            <span className="font-semibold text-primary">{n.created_by}</span>
                            <span>{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <p className="text-on-surface">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal follow-up note (e.g. Sent quote via WhatsApp, customer travelling with 2 kids)..."
                      className="w-full p-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={addingNote || !newNote.trim()}
                      className="w-full py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      {addingNote ? "Saving Note..." : "Add Follow-up Note"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
