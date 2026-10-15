import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent, updateSiteContent } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await updateSiteContent(body);
    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update content" }, { status: 500 });
  }
}
