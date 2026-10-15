"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Bulk and single deletion states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "single" | "bulk" | "all";
    id?: string;
    name?: string;
  } | null>(null);
  const [actionNotice, setActionNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotice = (type: "success" | "error", message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const fetchEnquiries = useCallback(async () => {
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
  }, [statusFilter, search]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

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
        showNotice("success", "Enquiry status updated.");
      }
    } catch {
      showNotice("error", "Failed to update status.");
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
        showNotice("success", "Note saved successfully.");
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

  // Checkbox Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === enquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(enquiries.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Perform Deletion (Single, Bulk, or All)
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);

    try {
      if (deleteConfirm.type === "single" && deleteConfirm.id) {
        const res = await fetch(`/api/admin/enquiries/${deleteConfirm.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setEnquiries((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
          setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirm.id));
          if (selectedEnquiry?.id === deleteConfirm.id) {
            setSelectedEnquiry(null);
          }
          showNotice("success", `Enquiry from ${deleteConfirm.name || "customer"} deleted.`);
        } else {
          showNotice("error", "Failed to delete enquiry.");
        }
      } else if (deleteConfirm.type === "bulk") {
        const res = await fetch("/api/admin/enquiries", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedIds }),
        });

        if (res.ok) {
          const idSet = new Set(selectedIds);
          setEnquiries((prev) => prev.filter((e) => !idSet.has(e.id)));
          if (selectedEnquiry && idSet.has(selectedEnquiry.id)) {
            setSelectedEnquiry(null);
          }
          showNotice("success", `${selectedIds.length} enquiries deleted.`);
          setSelectedIds([]);
        } else {
          showNotice("error", "Failed to delete selected enquiries.");
        }
      } else if (deleteConfirm.type === "all") {
        const res = await fetch("/api/admin/enquiries", {
          method: "DELETE",
        });

        if (res.ok) {
          const data = await res.json();
          setEnquiries([]);
          setSelectedIds([]);
          setSelectedEnquiry(null);
          showNotice("success", data.message || "All enquiries cleared successfully.");
        } else {
          showNotice("error", "Failed to clear enquiries.");
        }
      }
    } catch {
      showNotice("error", "An error occurred during deletion.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
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
        {/* Action Notice Toast */}
        {actionNotice && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between shadow-md transition-all animate-fadeIn ${
              actionNotice.type === "success"
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-error-container text-on-error-container"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                {actionNotice.type === "success" ? "check_circle" : "error"}
              </span>
              <span className="text-sm font-semibold">{actionNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="p-1 rounded hover:opacity-75"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

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
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={enquiries.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setDeleteConfirm({ type: "all" })}
              disabled={enquiries.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-error/10 hover:bg-error text-error hover:text-white font-label-md text-label-md font-semibold transition-all shadow-sm disabled:opacity-50"
              title="Delete and clear all enquiries from database"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
              <span>Clear All Enquiries</span>
            </button>
          </div>
        </div>

        {/* Bulk Selection Action Bar */}
        {selectedIds.length > 0 && (
          <div className="p-3.5 px-5 rounded-2xl bg-surface-container-highest border border-primary/30 flex items-center justify-between gap-4 animate-fadeIn shadow-md">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-sm font-semibold text-on-surface">
                {selectedIds.length} {selectedIds.length === 1 ? "enquiry" : "enquiries"} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-outline hover:text-on-surface hover:bg-surface-container"
              >
                Deselect
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm({ type: "bulk" })}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-error text-white text-xs font-semibold hover:bg-error/90 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}

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
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={enquiries.length > 0 && selectedIds.length === enquiries.length}
                      onChange={toggleSelectAll}
                      disabled={enquiries.length === 0}
                      aria-label="Select all enquiries"
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Package / Route</th>
                  <th className="py-3.5 px-4">Travel Date</th>
                  <th className="py-3.5 px-4">Pax</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 font-body-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-outline">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading enquiries...
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-outline">
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
                    const isSelected = selectedIds.includes(enq.id);

                    return (
                      <tr
                        key={enq.id}
                        className={`hover:bg-surface-container-low/40 transition-colors ${
                          isSelected ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(enq.id)}
                            aria-label={`Select enquiry from ${enq.customer_name}`}
                            className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-on-surface">{enq.customer_name}</div>
                          <div className="text-xs text-outline flex items-center gap-2 mt-0.5">
                            <span>{enq.phone}</span>
                            <span>•</span>
                            <span>{enq.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-on-surface block">
                            {enq.package_title || "Custom Bespoke Route"}
                          </span>
                          {enq.preferred_destination && (
                            <span className="text-xs text-outline block">
                              Dest: {enq.preferred_destination}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs text-on-surface-variant font-medium">
                          {enq.travel_date || "Flexible Dates"}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-on-surface">
                          {enq.traveller_count} Pax
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              handleStatusChange(enq.id, e.target.value as EnquiryStatus)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              statusBadgeColors[enq.status]
                            } bg-transparent cursor-pointer focus:outline-none`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-xs text-outline">
                          {new Date(enq.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
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
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: "single",
                                  id: enq.id,
                                  name: enq.customer_name,
                                })
                              }
                              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors"
                              title="Delete Enquiry"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl border border-outline-variant/30 space-y-4">
              <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">
                  {deleteConfirm.type === "all" ? "delete_sweep" : "warning"}
                </span>
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  {deleteConfirm.type === "all"
                    ? "Clear All Enquiries?"
                    : deleteConfirm.type === "bulk"
                    ? `Delete ${selectedIds.length} Enquiries?`
                    : `Delete Enquiry from ${deleteConfirm.name || "Customer"}?`}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {deleteConfirm.type === "all"
                    ? "Are you sure you want to delete and clear ALL enquiries? All lead records and associated follow-up notes will be permanently removed. This action cannot be undone."
                    : deleteConfirm.type === "bulk"
                    ? `Are you sure you want to permanently delete the ${selectedIds.length} selected enquiries and their notes? This action cannot be undone.`
                    : "Are you sure you want to permanently delete this enquiry and its follow-up notes? This action cannot be undone."}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={executeDelete}
                  className="flex-1 py-2.5 rounded-xl bg-error text-white text-xs font-semibold hover:bg-error/90 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span>
                        {deleteConfirm.type === "all" ? "Yes, Clear All" : "Yes, Delete"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-outline block mb-0.5">Phone / WhatsApp</span>
                    <span className="font-semibold text-on-surface block font-mono">
                      {selectedEnquiry.phone}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-outline block mb-0.5">Email</span>
                    <span className="font-semibold text-on-surface block truncate">
                      {selectedEnquiry.email}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-outline block mb-0.5">Travel Dates</span>
                    <span className="font-semibold text-on-surface block">
                      {selectedEnquiry.travel_date || "Flexible"}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <span className="text-outline block mb-0.5">Travelers</span>
                    <span className="font-semibold text-on-surface block">
                      {selectedEnquiry.traveller_count} Persons
                    </span>
                  </div>
                </div>

                {/* Package / Route */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-1">
                  <span className="text-outline block">Selected Package / Destination</span>
                  <span className="font-semibold text-on-surface text-sm block">
                    {selectedEnquiry.package_title || "Bespoke Custom Route"}
                  </span>
                  {selectedEnquiry.preferred_destination && (
                    <span className="text-outline block">
                      Target Area: {selectedEnquiry.preferred_destination}
                    </span>
                  )}
                </div>

                {/* Additional Requirements */}
                {selectedEnquiry.additional_requirements && (
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs space-y-1">
                    <span className="text-outline block">Guest Requirements &amp; Notes</span>
                    <p className="text-on-surface leading-relaxed whitespace-pre-wrap">
                      {selectedEnquiry.additional_requirements}
                    </p>
                  </div>
                )}

                {/* Fast Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={buildAdminFollowUpWhatsAppUrl(
                      selectedEnquiry.phone,
                      selectedEnquiry.customer_name,
                      selectedEnquiry.package_title || selectedEnquiry.preferred_destination
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>WhatsApp Client</span>
                  </a>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Trip Connect Itinerary Consultation`}
                    className="py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
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

              {/* Drawer Bottom Actions: Delete & Close */}
              <div className="pt-6 border-t border-outline-variant/20 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteConfirm({
                      type: "single",
                      id: selectedEnquiry.id,
                      name: selectedEnquiry.customer_name,
                    })
                  }
                  className="py-2.5 px-4 rounded-xl bg-error/10 hover:bg-error text-error hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  title="Delete this enquiry"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete Enquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high"
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
