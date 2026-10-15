"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface CropResult {
  file: File;
  previewUrl: string;
}

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  originalFileName?: string;
  targetRatio?: string; // e.g. "16:9", "4:3", "1:1", or "Free"
  onClose: () => void;
  onApplyCrop: (result: CropResult) => void;
}

type AspectRatioPreset = "16:9" | "4:3" | "1:1" | "3:2" | "Free";

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  originalFileName = "cropped-image.jpg",
  targetRatio = "16:9",
  onClose,
  onApplyCrop,
}: ImageCropperModalProps) {
  // Determine initial preset
  const getInitialPreset = useCallback((): AspectRatioPreset => {
    if (targetRatio.includes("1:1")) return "1:1";
    if (targetRatio.includes("4:3")) return "4:3";
    if (targetRatio.includes("3:2")) return "3:2";
    if (targetRatio.includes("16:9")) return "16:9";
    return "16:9";
  }, [targetRatio]);

  const [selectedRatio, setSelectedRatio] = useState<AspectRatioPreset>(getInitialPreset);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Pan offsets (in px within the crop frame)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const imageRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Sync initial preset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedRatio(getInitialPreset());
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setBrightness(100);
      setContrast(100);
      setPan({ x: 0, y: 0 });
      setErrorMessage("");
    }
  }, [isOpen, getInitialPreset]);

  // Load natural dimensions when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate crop frame aspect ratio value
  const getRatioValue = useCallback((): number | null => {
    switch (selectedRatio) {
      case "16:9":
        return 16 / 9;
      case "4:3":
        return 4 / 3;
      case "1:1":
        return 1;
      case "3:2":
        return 3 / 2;
      case "Free":
      default:
        return null;
    }
  }, [selectedRatio]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 3.5));
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Toggle Flip Horizontal
  const handleFlip = () => {
    setFlipH((prev) => !prev);
  };

  // Reset all adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setBrightness(100);
    setContrast(100);
    setPan({ x: 0, y: 0 });
  };

  // Generate cropped output canvas and export Blob
  const handleApply = async () => {
    if (!imageRef.current || !frameRef.current) return;
    setProcessing(true);
    setErrorMessage("");

    try {
      const img = imageRef.current;
      const frame = frameRef.current;
      const frameRect = frame.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Output resolution target (preserve high quality up to 2560px)
      const ratioVal = getRatioValue() || (imgRect.width / imgRect.height);
      let outputWidth = Math.min(2560, Math.round(naturalSize?.width || 1920));
      let outputHeight = Math.round(outputWidth / ratioVal);

      // Create high-res canvas
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not initialize 2D canvas context.");
      }

      // Configure high quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Apply CSS Filters (Brightness / Contrast)
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Fill background (neutral white/transparent)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Transform context to center
      ctx.save();
      ctx.translate(outputWidth / 2, outputHeight / 2);

      // Rotation & Flip
      ctx.rotate((rotation * Math.PI) / 180);
      if (flipH) {
        ctx.scale(-1, 1);
      }

      // Compute scale from DOM preview to Canvas
      const scaleToCanvas = outputWidth / frameRect.width;

      // Draw the image onto the canvas aligned with pan and zoom
      // How much the image center deviates from the frame center
      const offsetX = (pan.x + (imgRect.width / 2) - (frameRect.width / 2)) * scaleToCanvas;
      const offsetY = (pan.y + (imgRect.height / 2) - (frameRect.height / 2)) * scaleToCanvas;

      const drawWidth = (imgRect.width) * scaleToCanvas;
      const drawHeight = (imgRect.height) * scaleToCanvas;

      ctx.drawImage(
        img,
        -drawWidth / 2 + (pan.x * scaleToCanvas),
        -drawHeight / 2 + (pan.y * scaleToCanvas),
        drawWidth,
        drawHeight
      );

      ctx.restore();

      // Export as Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setErrorMessage("Failed to export cropped image data.");
            setProcessing(false);
            return;
          }

          const fileExt = originalFileName.endsWith(".png") ? "png" : "jpg";
          const mimeType = fileExt === "png" ? "image/png" : "image/jpeg";
          const croppedFileName = originalFileName.replace(/\.[^/.]+$/, "") + `-cropped.${fileExt}`;

          const croppedFile = new File([blob], croppedFileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(blob);
          onApplyCrop({ file: croppedFile, previewUrl });
          setProcessing(false);
          onClose();
        },
        originalFileName.endsWith(".png") ? "image/png" : "image/jpeg",
        0.92
      );
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to crop image. Please try again.");
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const ratioVal = getRatioValue();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && !processing) {
          onClose();
        }
      }}
    >
      <div className="bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/20 flex items-center justify-between sticky top-0 bg-surface-container-lowest/95 backdrop-blur z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">crop</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">Crop &amp; Adjust Photograph</h3>
              <p className="text-xs text-outline">
                Pan, zoom, rotate, and crop your photo for optimal layout display
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center gap-1 transition-all cursor-pointer"
              title="Reset all adjustments"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-error/15 hover:text-error text-on-surface-variant flex items-center justify-center transition-all cursor-pointer"
              title="Cancel & Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Ratio Preset Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">aspect_ratio</span>
              <span>Crop Ratio:</span>
            </span>

            <div className="flex flex-wrap gap-1.5">
              {(["16:9", "4:3", "1:1", "3:2", "Free"] as AspectRatioPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSelectedRatio(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedRatio === preset
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant/20"
                  }`}
                >
                  {preset === "16:9" && "16:9 (Hero / Wide)"}
                  {preset === "4:3" && "4:3 (Tour Card)"}
                  {preset === "1:1" && "1:1 (Square)"}
                  {preset === "3:2" && "3:2 (Classic)"}
                  {preset === "Free" && "Freeform"}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Workspace Area */}
          <div
            className="relative w-full h-[320px] sm:h-[420px] bg-neutral-950 rounded-2xl overflow-hidden flex items-center justify-center border border-outline-variant/30 select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {/* The Image being positioned */}
            <div
              className="absolute transition-transform duration-75 will-change-transform pointer-events-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scale(${zoom})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-w-none max-h-none select-none pointer-events-none"
                style={{
                  maxHeight: "380px",
                  objectFit: "contain",
                }}
                draggable={false}
              />
            </div>

            {/* Dark Scrim Vignette around Crop Frame */}
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            {/* Active Crop Boundary Frame with Clear Viewport */}
            <div
              ref={frameRef}
              className="relative pointer-events-none border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden flex items-center justify-center transition-all duration-200"
              style={{
                width: ratioVal
                  ? ratioVal >= 1
                    ? "min(90%, 540px)"
                    : `calc(min(80%, 360px) * ${ratioVal})`
                  : "85%",
                aspectRatio: ratioVal ? `${ratioVal}` : undefined,
                height: ratioVal ? undefined : "80%",
              }}
            >
              {/* Rule of Thirds Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-b border-white/25" />
                <div className="border-r border-white/25" />
                <div className="border-r border-white/25" />
                <div />
              </div>

              {/* Corner Accent Markers */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />
            </div>

            {/* Drag & Zoom Floating Guidance Pill */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white/90 text-[11px] font-medium pointer-events-none flex items-center gap-2 border border-white/10 shadow-lg">
              <span className="material-symbols-outlined text-[14px] text-primary">drag_pan</span>
              <span>Drag to reposition • Scroll or use slider to zoom</span>
            </div>
          </div>

          {/* Precision Controls Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
            {/* Left Controls: Zoom, Rotate, Flip */}
            <div className="space-y-3">
              {/* Zoom Control */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">zoom_in</span>
                    <span>Zoom Scale:</span>
                  </span>
                  <span className="font-mono text-primary">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                    className="w-7 h-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-xs font-bold text-on-surface cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-container-lowest rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(3.5, prev + 0.1))}
                    className="w-7 h-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-xs font-bold text-on-surface cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rotate & Flip Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">rotate_right</span>
                  <span>Rotate 90° ({rotation}°)</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlip}
                  className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all ${
                    flipH
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-container-lowest hover:bg-surface-container-high border-outline-variant/30 text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">flip</span>
                  <span>Flip Horizontal</span>
                </button>
              </div>
            </div>

            {/* Right Controls: Brightness & Contrast Adjustment */}
            <div className="space-y-3">
              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-amber-500">brightness_6</span>
                    <span>Brightness:</span>
                  </span>
                  <span className="font-mono text-outline">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 h-1.5 bg-surface-container-lowest rounded-lg cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">contrast</span>
                    <span>Contrast:</span>
                  </span>
                  <span className="font-mono text-outline">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full accent-secondary h-1.5 bg-surface-container-lowest rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-outline flex items-center gap-2">
              {naturalSize && (
                <span>Original File: <b>{naturalSize.width} × {naturalSize.height} px</b></span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={processing}
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-semibold text-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={handleApply}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95 disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Crop...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">done</span>
                    <span>Apply Crop &amp; Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
