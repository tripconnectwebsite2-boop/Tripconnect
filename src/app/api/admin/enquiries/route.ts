import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEnquiries, clearAllEnquiries, deleteEnquiriesBulk } from "@/lib/db";

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

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    if (body.ids && Array.isArray(body.ids) && body.ids.length > 0) {
      const result = await deleteEnquiriesBulk(body.ids);
      return NextResponse.json({
        success: true,
        count: result.count,
        message: `${result.count} enquiries deleted successfully`,
      });
    }

    // Default action: Clear all enquiries
    const result = await clearAllEnquiries();
    return NextResponse.json({
      success: true,
      count: result.count,
      message: `All ${result.count} enquiries have been cleared successfully`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to clear enquiries" },
      { status: 500 }
    );
  }
}
