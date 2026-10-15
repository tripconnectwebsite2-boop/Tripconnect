import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getBugById, updateBug, deleteBug } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const bug = await getBugById(params.id);
  if (!bug) {
    return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
  }

  return NextResponse.json({ bug });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const body = await request.json();
  const updated = await updateBug(params.id, body);

  if (!updated) {
    return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, bug: updated });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const success = await deleteBug(params.id);
  if (!success) {
    return NextResponse.json({ error: "Bug report not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Bug report deleted" });
}
