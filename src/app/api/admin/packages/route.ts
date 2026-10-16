import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getPackages, createPackage } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  // Admin gets all packages (drafts and published)
  const packages = await getPackages({ status, search, includeUnverified: true });
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Package title is required." }, { status: 400 });
    }

    if (body.starting_price !== undefined && Number(body.starting_price) < 0) {
      return NextResponse.json({ error: "Starting price cannot be negative." }, { status: 400 });
    }

    // New packages default to draft
    const newPkg = await createPackage({
      ...body,
      status: body.status === "published" ? "published" : "draft",
    });

    revalidatePath("/", "layout");
    revalidatePath("/packages");
    return NextResponse.json({ success: true, package: newPkg }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create package." }, { status: 500 });
  }
}
