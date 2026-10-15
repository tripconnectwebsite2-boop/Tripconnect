import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getBugById, updateBug, deleteBug } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const bug = await getBugById(id);
  if (!bug) {
    return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
  }

  return NextResponse.json({ bug });
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
  const updated = await updateBug(id, body);

  if (!updated) {
    return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, bug: updated });
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
  const success = await deleteBug(id);
  if (!success) {
    return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Bug report deleted" });
}
