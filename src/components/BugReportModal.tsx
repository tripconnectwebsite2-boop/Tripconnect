"use client";

import { useState, useEffect } from "react";
import { BugCategory, BugSeverity } from "@/lib/types";

interface BugReportModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  showFloatingButton?: boolean;
}

export default function BugReportModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  showFloatingButton = true,
}: BugReportModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState<BugCategory>("visual_glitch");
  const [severity, setSeverity] = useState<BugSeverity>("medium");
  const [pageUrl, setPageUrl] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [deviceInfo, setDeviceInfo] = useState<{
    browser?: string;
    os?: string;
    screen_resolution?: string;
    user_agent?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Auto-detect current page & device info on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);

      const ua = navigator.userAgent;
      let browser = "Unknown Browser";
      if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Google Chrome";
      else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Apple Safari";
      else if (ua.includes("Firefox")) browser = "Mozilla Firefox";
      else if (ua.includes("Edg")) browser = "Microsoft Edge";

      let os = "Unknown OS";
      if (ua.includes("Win")) os = "Windows";
      else if (ua.includes("Mac")) os = "macOS";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
      else if (ua.includes("Linux")) os = "Linux";

      setDeviceInfo({
        browser,
        os,
        screen_resolution: `${window.screen.width}x${window.screen.height} (window: ${window.innerWidth}x${window.innerHeight})`,
        user_agent: ua.slice(0, 250),
      });
    }
  }, [isModalOpen]);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      setSubmitError("Please select a valid image file.");
      return;
    }

    setUploadingImage(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setScreenshotUrl(data.url);
      } else {
        // Fallback to data URL for preview if upload route requires session
        const reader = new FileReader();
        reader.onload = () => {
          setScreenshotUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Local preview fallback
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setSubmitError("Please enter both a title and description of the issue.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          steps_to_reproduce: steps,
          category,
          severity,
          page_url: pageUrl,
          reporter_name: reporterName,
          reporter_email: reporterEmail,
          screenshot_url: screenshotUrl,
          device_info: deviceInfo,
          website_trap: honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit bug report.");
      }

      setSubmittedTicket({
        id: data.bug.id,
        title: data.bug.title,
      });
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setSteps("");
    setScreenshotUrl("");
    setSubmittedTicket(null);
    setSubmitError("");
    handleClose();
  };

  return (
    <>
      {/* Discreet floating trigger button */}
      {showFloatingButton && (
        <button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-surface-container-high/90 hover:bg-primary hover:text-white text-on-surface backdrop-blur-md px-3.5 py-2 rounded-full border border-outline-variant/30 shadow-lg text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 group"
          title="Found a glitch or issue? Click to report it."
        >
          <span className="material-symbols-outlined text-[18px] text-error group-hover:text-white transition-colors">
            bug_report
          </span>
          <span className="hidden sm:inline">Report a Bug</span>
        </button>
      )}

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-outline-variant/20 flex items-center justify-between sticky top-0 bg-surface-container-lowest/95 backdrop-blur z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">bug_report</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">Report an Issue or Bug</h3>
                  <p className="text-xs text-outline">Help us refine and perfect the Trip Connect experience</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submittedTicket ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-on-surface">Bug Report Submitted!</h4>
                    <p className="text-xs text-outline mt-1 max-w-sm mx-auto">
                      Thank you for reporting this issue. Our development desk has logged this ticket and will investigate.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 inline-block font-mono text-xs">
                    Ticket ID: <span className="font-bold text-primary">{submittedTicket.id}</span>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedTicket(null);
                        setTitle("");
                        setDescription("");
                        setSteps("");
                        setScreenshotUrl("");
                      }}
                      className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold"
                    >
                      Report Another Issue
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                    >
                      Done &amp; Close
                    </button>
                  </div>
                </div>
              ) : (
                /* Bug Report Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Honeypot Spam Field */}
                  <input
                    type="text"
                    name="website_trap"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {submitError && (
                    <div className="p-3 rounded-xl bg-error-container text-on-error-container flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label className="block font-semibold mb-1 text-on-surface">
                      Summary / Issue Title <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Booking modal doesn't open on iPhone Safari"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-xs"
                    />
                  </div>

                  {/* Category & Severity Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-on-surface">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as BugCategory)}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-xs"
                      >
                        <option value="visual_glitch">🎨 Visual / Layout Glitch</option>
                        <option value="booking_issue">📅 Booking / Enquiry Issue</option>
                        <option value="broken_link">🔗 Broken Link / 404</option>
                        <option value="mobile_issue">📱 Mobile Device Issue</option>
                        <option value="performance">⚡ Slow Loading / Lag</option>
                        <option value="content_error">📝 Content or Typo Error</option>
                        <option value="other">💬 Other Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-on-surface">Severity</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as BugSeverity)}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-xs"
                      >
                        <option value="low">🟢 Low (Minor annoyance)</option>
                        <option value="medium">🟡 Medium (Normal priority)</option>
                        <option value="high">🟠 High (Impairs functionality)</option>
                        <option value="critical">🔴 Critical (Site blocked / Crash)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold mb-1 text-on-surface">
                      Detailed Description <span className="text-error">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What happened? What were you expecting to see?"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-xs"
                    />
                  </div>

                  {/* Steps to Reproduce */}
                  <div>
                    <label className="block font-semibold mb-1 text-on-surface">
                      Steps to Reproduce <span className="text-outline font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      placeholder="1. Clicked on Munnar tour&#10;2. Clicked book now&#10;3. Page froze"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-xs font-mono"
                    />
                  </div>

                  {/* Screenshot / File attachment */}
                  <div>
                    <label className="block font-semibold mb-1 text-on-surface">
                      Attach Screenshot or Photo <span className="text-outline font-normal">(optional)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-container-high file:text-on-surface hover:file:bg-primary hover:file:text-white cursor-pointer"
                      />
                      {uploadingImage && <span className="text-outline text-xs">Uploading...</span>}
                    </div>
                    {screenshotUrl && (
                      <div className="mt-2 relative w-24 h-16 rounded-lg overflow-hidden border border-outline-variant/30">
                        <img src={screenshotUrl} alt="Uploaded screenshot" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setScreenshotUrl("")}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded p-0.5 text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reporter Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20">
                    <div>
                      <label className="block font-semibold mb-1 text-on-surface">
                        Your Name <span className="text-outline font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-on-surface">
                        Email Address <span className="text-outline font-normal">(optional, for updates)</span>
                      </label>
                      <input
                        type="email"
                        value={reporterEmail}
                        onChange={(e) => setReporterEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface"
                      />
                    </div>
                  </div>

                  {/* Auto-Captured Diagnostics Strip */}
                  <div className="p-3 rounded-xl bg-surface-container-high/40 border border-outline-variant/20 text-[11px] text-outline space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-on-surface">
                      <span className="material-symbols-outlined text-[14px] text-primary">sensors</span>
                      <span>Auto-Captured Environment:</span>
                    </div>
                    <div className="truncate">Page: <span className="text-on-surface font-mono">{pageUrl}</span></div>
                    <div className="flex flex-wrap gap-x-4">
                      <span>OS: <b className="text-on-surface">{deviceInfo.os}</b></span>
                      <span>Browser: <b className="text-on-surface">{deviceInfo.browser}</b></span>
                      <span>Screen: <b className="text-on-surface">{deviceInfo.screen_resolution}</b></span>
                    </div>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-primary text-white font-semibold inline-flex items-center gap-1.5 shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          <span>Submit Bug Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
