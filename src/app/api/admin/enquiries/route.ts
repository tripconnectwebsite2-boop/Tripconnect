import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEnquiries } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";

  const enquiries = await getEnquiries({ status, search });
  return NextResponse.json({ enquiries });
}
