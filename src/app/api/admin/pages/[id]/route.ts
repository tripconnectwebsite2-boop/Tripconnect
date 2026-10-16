import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getCustomPageById, updateCustomPage, deleteCustomPage } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const page = await getCustomPageById(id);
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ page });
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

  const updated = await updateCustomPage(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  if (updated.slug) {
    revalidatePath(`/p/${updated.slug}`);
  }
  return NextResponse.json({ success: true, page: updated });
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
  const deleted = await deleteCustomPage(id);
  if (!deleted) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, message: "Page removed successfully." });
}
