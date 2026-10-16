import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import path from "path";
import fs from "fs/promises";
import os from "os";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC6STcc6a82EIrg7apay8QdsH24HobiTRw";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trip-connect-versel";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

function isValidImageSignature(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 8) return false;

  if (mime === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mime === "image/gif") {
    const header = buffer.slice(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }
  if (mime === "image/webp") {
    return (
      buffer.slice(0, 4).toString("ascii") === "RIFF" &&
      buffer.slice(8, 12).toString("ascii") === "WEBP"
    );
  }
  if (mime === "image/avif") {
    const brand = buffer.slice(4, 12).toString("ascii");
    return brand.includes("ftyp");
  }
  if (mime === "image/svg+xml") {
    const text = buffer.toString("utf-8").toLowerCase();
    const hasSvgTag = text.includes("<svg");
    const hasMaliciousPayload =
      text.includes("<script") ||
      text.includes("javascript:") ||
      text.includes("onload=") ||
      text.includes("onerror=") ||
      text.includes("onclick=") ||
      text.includes("onmouseover=");
    return hasSvgTag && !hasMaliciousPayload;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.authenticated || !session.authorized) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WEBP, GIF, SVG, and AVIF images are supported." },
        { status: 400 }
      );
    }

    // Limit to 20MB
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image file is too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Deep binary signature validation
    if (!isValidImageSignature(rawBuffer, file.type)) {
      return NextResponse.json(
        { error: "File validation failed: Content does not match genuine image signature." },
        { status: 400 }
      );
    }

    // Process and optimize image
    let finalBuffer: Buffer = rawBuffer;
    let finalMime = file.type;
    let ext = ".webp";

    if (file.type === "image/svg+xml") {
      ext = ".svg";
      finalMime = "image/svg+xml";
    } else {
      try {
        // High-definition WebP compression up to 1920px max dimension
        finalBuffer = await sharp(rawBuffer)
          .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
        finalMime = "image/webp";
        ext = ".webp";
      } catch (sharpErr) {
        console.warn("[Upload] Sharp optimization fallback:", sharpErr);
        finalBuffer = rawBuffer;
        ext = file.name.endsWith(".png") ? ".png" : ".jpg";
      }
    }

    // Safe sanitized unique filename
    const safeBaseName = (file.name || "image")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const filename = `${safeBaseName || "upload"}-${uniqueSuffix}${ext}`;

    // 1. Cache to local disk for instant subsequent serving
    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NODE_ENV === "production"
    );
    const uploadsDir = isServerless
      ? path.join(os.tmpdir(), "uploads")
      : path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, finalBuffer);

    // 2. Persist to Cloud Firestore so it survives forever across all Vercel serverless containers
    try {
      const base64Data = finalBuffer.toString("base64");
      // Sanitize docId for Firestore (letters, numbers, hyphens, underscores)
      const cleanDocId = `img-${filename.replace(/[^a-zA-Z0-9-_]/g, "_")}`;
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/tripconnect/${cleanDocId}?key=${FIREBASE_API_KEY}`;

      await fetch(firestoreUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            data: { stringValue: base64Data },
            contentType: { stringValue: finalMime },
            filename: { stringValue: filename },
            size: { integerValue: String(finalBuffer.length) },
            created_at: { stringValue: new Date().toISOString() },
          },
        }),
      });
    } catch (cloudErr) {
      console.warn("[Upload] Cloud Firestore image backup warning:", cloudErr);
    }

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: finalBuffer.length,
      type: finalMime,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
