"use client";

import { useState, useRef } from "react";
import ImageCropperModal, { CropResult } from "./ImageCropperModal";

interface Preset {
  label: string;
  url: string;
}

export interface ImageSpecs {
  ratio?: string;          // e.g. "16:9 (Landscape)", "4:3 (Card)", "1:1 (Square)"
  measurement?: string;    // e.g. "1920 × 1080 px", "1200 × 800 px", "512 × 512 px"
  quality?: string;        // e.g. "Maximum (Lossless / 90%+ WebP/PNG)", "Crisp High-Res"
  maxSize?: string;        // e.g. "Max 20MB (Recommended: 500KB – 2MB)"
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
  specs?: ImageSpecs;
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
  specs,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [detectedSpecs, setDetectedSpecs] = useState<{
    width: number;
    height: number;
    ratio: string;
  } | null>(null);

  // Image Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string>("");
  const [cropperFileName, setCropperFileName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default specifications if not explicitly overridden
  const activeSpecs: Required<ImageSpecs> = {
    ratio: specs?.ratio || "16:9 (Landscape)",
    measurement: specs?.measurement || "1920 × 1080 px (or min 1200px width)",
    quality: specs?.quality || "Maximum (High-Definition WebP, PNG, or JPG 90%+)",
    maxSize: specs?.maxSize || "Max 20MB (Recommended: 500KB – 2MB)",
  };

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

  // Intercept file selection to open Cropper & Adjuster Modal
  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP, SVG, AVIF, GIF).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Image is too large. Maximum size is 20MB.");
      return;
    }

    // SVGs are vector files, upload directly without raster cropping
    if (file.type === "image/svg+xml") {
      handleFileUpload(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropperSrc(objectUrl);
    setCropperFileName(file.name);
    setCropperOpen(true);
  };

  const handleCropComplete = (result: CropResult) => {
    handleFileUpload(result.file);
  };

  const handleOpenCropperForCurrent = () => {
    if (!value) return;
    setCropperSrc(value);
    setCropperFileName("image.jpg");
    setCropperOpen(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const aspect = naturalWidth / naturalHeight;
      let ratioStr = `${naturalWidth}:${naturalHeight}`;
      if (Math.abs(aspect - 16 / 9) < 0.08) ratioStr = "16:9";
      else if (Math.abs(aspect - 4 / 3) < 0.08) ratioStr = "4:3";
      else if (Math.abs(aspect - 3 / 2) < 0.08) ratioStr = "3:2";
      else if (Math.abs(aspect - 1) < 0.05) ratioStr = "1:1";
      else if (Math.abs(aspect - 9 / 16) < 0.08) ratioStr = "9:16 (Portrait)";

      setDetectedSpecs({
        width: naturalWidth,
        height: naturalHeight,
        ratio: ratioStr,
      });
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
            {value.startsWith("/uploads/") ? "📁 Stored on PC Disk" : "🌐 Web Hosted"}
          </span>
        )}
      </div>

      {/* Specifications Guide Banner: Size, Quality, Measurement, Ratio */}
      <div className="p-3 rounded-xl bg-surface-container-high/40 border border-outline-variant/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-bold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[15px]">photo_size_select_actual</span>
            <span>Recommended Image Specifications</span>
          </div>
          <span className="text-[10px] font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
            Best Display
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Aspect Ratio */}
          <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] uppercase font-bold text-outline block">Ratio</span>
            <span className="font-semibold text-on-surface text-[11px] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-primary shrink-0">aspect_ratio</span>
              <span className="truncate">{activeSpecs.ratio}</span>
            </span>
          </div>

          {/* Measurement / Resolution */}
          <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] uppercase font-bold text-outline block">Measurement</span>
            <span className="font-semibold text-on-surface text-[11px] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-primary shrink-0">straighten</span>
              <span className="truncate">{activeSpecs.measurement}</span>
            </span>
          </div>

          {/* Quality */}
          <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] uppercase font-bold text-outline block">Quality</span>
            <span className="font-semibold text-on-surface text-[11px] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-secondary shrink-0">high_quality</span>
              <span className="truncate">{activeSpecs.quality}</span>
            </span>
          </div>

          {/* Upload File Size */}
          <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] uppercase font-bold text-outline block">Max Size</span>
            <span className="font-semibold text-on-surface text-[11px] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[13px] text-amber-600 shrink-0">data_usage</span>
              <span className="truncate">{activeSpecs.maxSize}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main input controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setDetectedSpecs(null);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setDetectedSpecs(null);
                onChange("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-error text-xs"
              title="Clear image"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Upload & Crop Buttons */}
        <div className="flex flex-wrap items-center gap-2">
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
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 whitespace-nowrap shadow-sm cursor-pointer"
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

          {value && (
            <button
              type="button"
              onClick={handleOpenCropperForCurrent}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/30 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm cursor-pointer whitespace-nowrap"
              title="Crop, rotate, and adjust current photo"
            >
              <span className="material-symbols-outlined text-[17px] text-primary">crop</span>
              <span>Crop &amp; Adjust</span>
            </button>
          )}
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
          <span className="font-semibold text-primary">Click to select image from PC</span> or drag &amp; drop file here
          <span className="block text-[10px] text-outline mt-0.5">
            JPG, PNG, WebP, SVG, AVIF • Max 20MB • Automatically stored on local computer
          </span>
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
                onClick={() => {
                  setDetectedSpecs(null);
                  onChange(preset.url);
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-container-low hover:bg-primary hover:text-white transition-colors border border-outline-variant/30 text-on-surface"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview Box with Detected Image Readout */}
      {value && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-outline">
            <span className="font-semibold text-on-surface">Live Visual Preview:</span>
            <div className="flex items-center gap-3">
              {detectedSpecs && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>
                    Detected: {detectedSpecs.width} × {detectedSpecs.height} px ({detectedSpecs.ratio})
                  </span>
                </span>
              )}
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Full resolution</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </a>
            </div>
          </div>
          <div
            className={`relative w-full ${previewHeight} rounded-xl overflow-hidden border border-outline-variant/30 bg-neutral-900 group shadow-sm`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              onLoad={handleImageLoad}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={handleOpenCropperForCurrent}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold shadow hover:bg-primary-container flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Crop, rotate, and adjust this photo"
              >
                <span className="material-symbols-outlined text-[15px]">crop</span>
                <span>Crop &amp; Adjust</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-neutral-900 text-xs font-semibold shadow hover:bg-white flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">add_photo_alternate</span>
                <span>Change Image</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDetectedSpecs(null);
                  onChange("");
                }}
                className="px-3 py-1.5 rounded-lg bg-error text-white text-xs font-semibold shadow hover:bg-error/90 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Image Cropper & Adjuster Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperSrc}
        originalFileName={cropperFileName}
        targetRatio={activeSpecs.ratio}
        onClose={() => setCropperOpen(false)}
        onApplyCrop={handleCropComplete}
      />
    </div>
  );
}
