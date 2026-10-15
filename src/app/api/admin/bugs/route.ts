import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getBugs } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const severity = searchParams.get("severity") || "all";
  const category = searchParams.get("category") || "all";
  const search = (searchParams.get("search") || "").toLowerCase().trim();

  let bugs = await getBugs({ status, severity, category });

  if (search) {
    bugs = bugs.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.description.toLowerCase().includes(search) ||
        (b.reporter_name && b.reporter_name.toLowerCase().includes(search)) ||
        (b.reporter_email && b.reporter_email.toLowerCase().includes(search)) ||
        (b.page_url && b.page_url.toLowerCase().includes(search))
    );
  }

  // Summary counts across all bugs
  const allBugs = await getBugs();
  const counts = {
    total: allBugs.length,
    open: allBugs.filter((b) => b.status === "open").length,
    investigating: allBugs.filter((b) => b.status === "investigating").length,
    resolved: allBugs.filter((b) => b.status === "resolved" || b.status === "closed").length,
    critical: allBugs.filter((b) => b.severity === "critical" && b.status !== "closed" && b.status !== "resolved").length,
  };

  return NextResponse.json({ bugs, counts });
}
