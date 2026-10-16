import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to fetch public site content:", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
