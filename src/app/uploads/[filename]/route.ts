import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

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
    // Sanitize filename to avoid path traversal
    const safeFilename = path.basename(filename);
    const tmpPath = path.join("/tmp", "uploads", safeFilename);
    const publicPath = path.join(process.cwd(), "public", "uploads", safeFilename);

    let filePath = publicPath;
    if (process.env.VERCEL) {
      const existsInTmp = await fs.stat(tmpPath).then(() => true).catch(() => false);
      if (existsInTmp) {
        filePath = tmpPath;
      }
    }

    try {
      const buffer = await fs.readFile(filePath);
      const ext = path.extname(safeFilename).toLowerCase();
      const contentType = MIME_MAP[ext] || "application/octet-stream";

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
