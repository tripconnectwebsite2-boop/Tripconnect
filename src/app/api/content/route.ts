import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Failed to fetch public site content:", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
