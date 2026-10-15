"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { BugReport, BugSeverity, BugStatus, BugCategory } from "@/lib/types";

export default function AdminBugsPage() {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    open: 0,
    investigating: 0,
    resolved: 0,
    critical: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (severityFilter !== "all") params.set("severity", severityFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/bugs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBugs(data.bugs || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error("Failed to fetch bugs:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, severityFilter, categoryFilter, search]);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const handleSelectBug = (bug: BugReport) => {
    setSelectedBug(bug);
    setAdminNotes(bug.admin_notes || "");
    setUpdateMessage("");
  };

  const handleUpdateStatus = async (newStatus: BugStatus) => {
    if (!selectedBug) return;
    setUpdating(true);
    setUpdateMessage("");
    try {
      const res = await fetch(`/api/admin/bugs/${selectedBug.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNotes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedBug(data.bug);
        setUpdateMessage(`Ticket status updated to "${newStatus}".`);
        fetchBugs();
      }
    } catch {
      setUpdateMessage("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBug) return;
    setUpdating(true);
    setUpdateMessage("");
    try {
      const res = await fetch(`/api/admin/bugs/${selectedBug.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedBug(data.bug);
        setUpdateMessage("Admin resolution notes saved.");
        fetchBugs();
      }
    } catch {
      setUpdateMessage("Failed to save notes.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBug = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this bug ticket?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/bugs/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedBug?.id === id) setSelectedBug(null);
        fetchBugs();
      }
    } catch (err) {
      console.error("Failed to delete bug:", err);
    }
  };

  const getSeverityBadge = (severity: BugSeverity) => {
    switch (severity) {
      case "critical":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
      case "high":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "medium":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30";
      case "low":
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getStatusBadge = (status: BugStatus) => {
    switch (status) {
      case "open":
        return "bg-rose-500 text-white";
      case "investigating":
        return "bg-amber-500 text-white";
      case "resolved":
        return "bg-emerald-600 text-white";
      case "closed":
      default:
        return "bg-neutral-600 text-white";
    }
  };

  const formatCategory = (cat: BugCategory) => {
    switch (cat) {
      case "booking_issue":
        return "📅 Booking Issue";
      case "visual_glitch":
        return "🎨 Visual Glitch";
      case "broken_link":
        return "🔗 Broken Link";
      case "mobile_issue":
        return "📱 Mobile Issue";
      case "performance":
        return "⚡ Performance";
      case "content_error":
        return "📝 Content / Typo";
      case "other":
      default:
        return "💬 General / Other";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 text-on-surface">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-outline-variant/30">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error font-semibold text-xs uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[16px]">bug_report</span>
              Issue &amp; Bug Tracking System
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl font-bold tracking-tight">
              Bug Reports &amp; Technical Issues
            </h1>
            <p className="font-body-sm text-sm text-on-surface-variant mt-1">
              Review, diagnose, and resolve technical glitches reported by visitors and QA testers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchBugs()}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold inline-flex items-center gap-1.5 transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Refresh</span>
            </button>
            <a
              href="/report-bug"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Submit New Ticket</span>
            </a>
          </div>
        </div>

        {/* Analytics & Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-outline block">Total Tickets</span>
            <span className="text-2xl font-bold text-on-surface mt-1 block">{counts.total}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-error block">Open Issues</span>
            <span className="text-2xl font-bold text-error mt-1 block">{counts.open}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-amber-600 block">In Investigation</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">{counts.investigating}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            <span className="text-[11px] uppercase font-bold text-emerald-600 block">Resolved / Fixed</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{counts.resolved}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm col-span-2 lg:col-span-1">
            <span className="text-[11px] uppercase font-bold text-rose-600 block">Critical Priority</span>
            <span className="text-2xl font-bold text-rose-600 mt-1 block">{counts.critical}</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined text-[18px] text-outline absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                placeholder="Search by ticket title, description, URL, or reporter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Severities</option>
              <option value="critical">🔴 Critical Priority</option>
              <option value="high">🟠 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="booking_issue">Booking / Enquiry Issue</option>
              <option value="visual_glitch">Visual / Layout Glitch</option>
              <option value="broken_link">Broken Link</option>
              <option value="mobile_issue">Mobile Device Issue</option>
              <option value="performance">Performance / Slow Load</option>
              <option value="content_error">Content / Typo Error</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-outline-variant/20">
            {["all", "open", "investigating", "resolved", "closed"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container-high text-outline hover:text-on-surface"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: List + Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bug List */}
          <div className={`${selectedBug ? "lg:col-span-7" : "lg:col-span-12"} space-y-3`}>
            {loading ? (
              <div className="p-12 text-center text-outline text-xs">
                <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block mb-2" />
                <p>Loading bug reports...</p>
              </div>
            ) : bugs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <span className="material-symbols-outlined text-4xl text-emerald-500">task_alt</span>
                <h3 className="font-bold text-sm text-on-surface">No Bug Reports Found</h3>
                <p className="text-xs text-outline">
                  {statusFilter !== "all" || search
                    ? "No issues match your current filters. Try resetting search filters."
                    : "Zero active bugs reported! All systems are functioning smoothly."}
                </p>
              </div>
            ) : (
              bugs.map((bug) => {
                const isSelected = selectedBug?.id === bug.id;
                return (
                  <div
                    key={bug.id}
                    onClick={() => handleSelectBug(bug)}
                    className={`p-4 rounded-2xl bg-surface-container-lowest border transition-all cursor-pointer space-y-2 shadow-sm hover:border-primary/50 ${
                      isSelected ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] text-outline font-semibold">
                            {bug.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getSeverityBadge(
                              bug.severity
                            )}`}
                          >
                            {bug.severity}
                          </span>
                          <span className="text-[11px] text-outline font-medium">
                            {formatCategory(bug.category)}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-on-surface leading-tight hover:text-primary transition-colors">
                          {bug.title}
                        </h3>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${getStatusBadge(
                          bug.status
                        )}`}
                      >
                        {bug.status}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {bug.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-outline border-t border-outline-variant/20">
                      <div className="flex items-center gap-3">
                        {bug.reporter_name && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">person</span>
                            {bug.reporter_name}
                          </span>
                        )}
                        {bug.device_info?.browser && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">devices</span>
                            {bug.device_info.browser}
                          </span>
                        )}
                      </div>
                      <span>{new Date(bug.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bug Details & Action Panel */}
          {selectedBug && (
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 self-start">
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-lg space-y-4">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-outline-variant/20">
                  <div>
                    <span className="text-[10px] font-mono text-outline font-semibold block">
                      {selectedBug.id}
                    </span>
                    <h3 className="font-bold text-base text-on-surface leading-tight">
                      {selectedBug.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBug(null)}
                    className="p-1 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {updateMessage && (
                  <div className="p-2.5 rounded-xl bg-secondary-container text-on-secondary-container text-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">info</span>
                    <span>{updateMessage}</span>
                  </div>
                )}

                {/* Status and Action Buttons */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                    Change Lifecycle Status
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      disabled={updating || selectedBug.status === "open"}
                      onClick={() => handleUpdateStatus("open")}
                      className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                        selectedBug.status === "open"
                          ? "bg-rose-500 text-white border-rose-600"
                          : "bg-surface-container-low hover:bg-rose-500/10 text-on-surface border-outline-variant/30"
                      }`}
                    >
                      Mark as Open
                    </button>
                    <button
                      type="button"
                      disabled={updating || selectedBug.status === "investigating"}
                      onClick={() => handleUpdateStatus("investigating")}
                      className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                        selectedBug.status === "investigating"
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-surface-container-low hover:bg-amber-500/10 text-on-surface border-outline-variant/30"
                      }`}
                    >
                      Investigating
                    </button>
                    <button
                      type="button"
                      disabled={updating || selectedBug.status === "resolved"}
                      onClick={() => handleUpdateStatus("resolved")}
                      className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                        selectedBug.status === "resolved"
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : "bg-surface-container-low hover:bg-emerald-600/10 text-on-surface border-outline-variant/30"
                      }`}
                    >
                      Mark Resolved
                    </button>
                    <button
                      type="button"
                      disabled={updating || selectedBug.status === "closed"}
                      onClick={() => handleUpdateStatus("closed")}
                      className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                        selectedBug.status === "closed"
                          ? "bg-neutral-700 text-white border-neutral-800"
                          : "bg-surface-container-low hover:bg-surface-container-high text-on-surface border-outline-variant/30"
                      }`}
                    >
                      Close Ticket
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                    Description
                  </label>
                  <p className="p-3 rounded-xl bg-surface-container-low text-xs leading-relaxed text-on-surface whitespace-pre-wrap">
                    {selectedBug.description}
                  </p>
                </div>

                {/* Steps to Reproduce */}
                {selectedBug.steps_to_reproduce && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                      Steps to Reproduce
                    </label>
                    <pre className="p-3 rounded-xl bg-surface-container-low text-xs font-mono leading-relaxed text-on-surface whitespace-pre-wrap">
                      {selectedBug.steps_to_reproduce}
                    </pre>
                  </div>
                )}

                {/* Screenshot */}
                {selectedBug.screenshot_url && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                        Attached Screenshot
                      </label>
                      <a
                        href={selectedBug.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Full Size</span>
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-outline-variant/30 bg-neutral-900 max-h-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedBug.screenshot_url}
                        alt="Bug Screenshot"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Technical Environment Details */}
                <div className="p-3 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 space-y-1.5 text-xs">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-outline block">
                    Diagnostic Environment
                  </span>
                  {selectedBug.page_url && (
                    <div className="truncate">
                      URL:{" "}
                      <a
                        href={selectedBug.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-mono"
                      >
                        {selectedBug.page_url}
                      </a>
                    </div>
                  )}
                  {selectedBug.device_info && (
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-outline">
                      <div>OS: <b className="text-on-surface">{selectedBug.device_info.os || "N/A"}</b></div>
                      <div>Browser: <b className="text-on-surface">{selectedBug.device_info.browser || "N/A"}</b></div>
                      <div className="col-span-2">
                        Screen: <b className="text-on-surface">{selectedBug.device_info.screen_resolution || "N/A"}</b>
                      </div>
                    </div>
                  )}
                  {selectedBug.reporter_email && (
                    <div className="pt-1 text-[11px]">
                      Reporter: <a href={`mailto:${selectedBug.reporter_email}`} className="text-primary hover:underline">{selectedBug.reporter_name || "Guest"} ({selectedBug.reporter_email})</a>
                    </div>
                  )}
                </div>

                {/* Admin Internal Resolution Notes */}
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-wider block">
                    Admin Resolution Notes
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Document root cause, code patch, or resolution details..."
                    className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteBug(selectedBug.id)}
                      className="text-error hover:text-error/80 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                      <span>Delete Ticket</span>
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={handleSaveNotes}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold shadow hover:opacity-90"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
