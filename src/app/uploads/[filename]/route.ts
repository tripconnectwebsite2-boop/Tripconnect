import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import os from "os";

export const dynamic = "force-dynamic";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC6STcc6a82EIrg7apay8QdsH24HobiTRw";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trip-connect-versel";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const safeFilename = path.basename(filename);
    const ext = path.extname(safeFilename).toLowerCase();
    const defaultMime = MIME_MAP[ext] || "application/octet-stream";

    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NODE_ENV === "production"
    );
    const tmpPath = path.join(os.tmpdir(), "uploads", safeFilename);
    const publicPath = path.join(process.cwd(), "public", "uploads", safeFilename);

    // 1. Check local disk first (instant warm serving)
    try {
      const targetPath = (isServerless && await fs.stat(tmpPath).then(() => true).catch(() => false))
        ? tmpPath
        : publicPath;
      const buffer = await fs.readFile(targetPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": defaultMime,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Local disk miss: proceed to Cloud Firestore fallback
    }

    // 2. Fetch from Cloud Firestore backup
    try {
      const cleanDocId = `img-${safeFilename.replace(/[^a-zA-Z0-9-_]/g, "_")}`;
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/tripconnect/${cleanDocId}?key=${FIREBASE_API_KEY}`;
      const res = await fetch(firestoreUrl, { method: "GET", cache: "no-store" });

      if (res.ok) {
        const json = await res.json();
        const base64Data = json.fields?.data?.stringValue;
        const contentType = json.fields?.contentType?.stringValue || defaultMime;

        if (base64Data) {
          const buffer = Buffer.from(base64Data, "base64");

          // Save to tmp for future fast requests in this container
          try {
            const uploadsDir = isServerless ? path.join(os.tmpdir(), "uploads") : path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(path.join(uploadsDir, safeFilename), buffer);
          } catch {}

          return new NextResponse(buffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      }
    } catch (cloudErr) {
      console.warn("[Upload Serve] Cloud fallback error:", cloudErr);
    }

    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
