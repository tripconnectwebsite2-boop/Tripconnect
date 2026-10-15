import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEnquiryNotes, addEnquiryNote } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const notes = await getEnquiryNotes(id);
  return NextResponse.json({ notes });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const { note } = await request.json();

  if (!note || typeof note !== "string" || note.trim().length === 0) {
    return NextResponse.json({ error: "Note content cannot be empty." }, { status: 400 });
  }

  const createdNote = await addEnquiryNote(id, note.trim(), session.email || "tripconnectwebsite2@gmail.com");
  return NextResponse.json({ success: true, note: createdNote }, { status: 201 });
}
