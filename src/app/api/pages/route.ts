import { NextResponse } from "next/server";
import { getCustomPages } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const inHeader = searchParams.get("in_header");
    const inFooter = searchParams.get("in_footer");

    const pages = await getCustomPages({
      status: "published",
      show_in_header: inHeader === "true" ? true : undefined,
      show_in_footer: inFooter === "true" ? true : undefined,
    });

    return NextResponse.json({ pages });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load pages" }, { status: 500 });
  }
}
