"use client";

import { useState, useRef } from "react";

interface Preset {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  presets?: Preset[];
  aspectRatio?: string;
  previewHeight?: string;
  placeholder?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  helperText,
  presets,
  aspectRatio = "aspect-video",
  previewHeight = "h-44",
  placeholder = "https://images.unsplash.com/... or upload from your computer",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP, SVG, AVIF, GIF).");
      return;
    }

    // 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Image is too large. Maximum size is 20MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-on-surface">
          {label}
        </label>
        {value && (
          <span className="text-[11px] text-outline truncate max-w-[220px]">
            {value.startsWith("/uploads/") ? "📁 Stored on PC" : "🌐 Web Hosted"}
          </span>
        )}
      </div>

      {/* Main input controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-error text-xs"
              title="Clear image"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Upload from PC Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 whitespace-nowrap"
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                <span>Upload from PC</span>
              </>
            )}
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-outline leading-tight">{helperText}</p>
      )}

      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 text-center ${
          dragActive
            ? "border-primary bg-primary/5 text-primary scale-[1.01]"
            : "border-outline-variant/40 hover:border-primary/50 bg-surface-container-lowest/50 text-outline hover:text-on-surface"
        }`}
      >
        <span className="material-symbols-outlined text-[24px] text-primary">cloud_upload</span>
        <div className="text-xs">
          <span className="font-semibold text-primary">Click to choose image</span> or drag &amp; drop from your PC
          <span className="block text-[10px] text-outline mt-0.5">JPG, PNG, WebP, SVG, AVIF up to 20MB (stored directly on your computer)</span>
        </div>
      </div>

      {/* Error alert */}
      {uploadError && (
        <div className="p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* 1-Click Presets */}
      {presets && presets.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-outline font-semibold uppercase tracking-wider block">
            Or choose a 1-click photo preset:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.url)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-container-low hover:bg-primary hover:text-white transition-colors border border-outline-variant/30 text-on-surface"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview Box */}
      {value && (
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[11px] text-outline">
            <span className="font-semibold">Live Visual Preview:</span>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View full size</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>
          </div>
          <div className={`relative w-full ${previewHeight} rounded-xl overflow-hidden border border-outline-variant/30 bg-neutral-900 group shadow-sm`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-neutral-900 text-xs font-semibold shadow hover:bg-white"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 rounded-lg bg-error text-white text-xs font-semibold shadow hover:bg-error/90"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
