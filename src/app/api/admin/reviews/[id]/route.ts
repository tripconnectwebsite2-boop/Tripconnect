import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { updateReview, deleteReview } from "@/lib/db";

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

  const updated = await updateReview(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, review: updated });
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
  const deleted = await deleteReview(id);
  if (!deleted) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, message: "Review removed." });
}
