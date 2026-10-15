import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getPackageById, updatePackage, deletePackage } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const pkg = await getPackageById(id);
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ package: pkg });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // If publishing, perform the mandatory publication validation checklist!
  if (body.status === "published") {
    const current = await getPackageById(id);
    if (!current) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const merged = { ...current, ...body };

    const validationErrors: string[] = [];
    if (!merged.title || merged.title.trim().length === 0) {
      validationErrors.push("Package title is required.");
    }
    if (!merged.short_description || merged.short_description.trim().length === 0) {
      validationErrors.push("Short description is required.");
    }
    if (merged.starting_price <= 0) {
      validationErrors.push("Valid positive starting price is required.");
    }
    if (!merged.itinerary || merged.itinerary.length === 0) {
      validationErrors.push("Day-by-day itinerary with at least Day 1 is required.");
    }
    if (!merged.content_verified) {
      validationErrors.push("Package content must be confirmed as verified before publishing.");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Publication checklist failed. Please resolve the following before publishing:",
          validationErrors,
        },
        { status: 422 }
      );
    }
  }

  const updated = await updatePackage(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, package: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deletePackage(id);
  if (!deleted) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Package removed." });
}
