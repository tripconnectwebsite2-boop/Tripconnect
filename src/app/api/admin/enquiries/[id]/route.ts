import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getEnquiryById, updateEnquiryStatus } from "@/lib/db";
import { EnquiryStatus } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const enquiry = await getEnquiryById(id);
  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ enquiry });
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
  const { status } = await request.json();

  const validStatuses: EnquiryStatus[] = ["new", "contacted", "confirmed", "closed"];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status value. Must be new, contacted, confirmed, or closed." },
      { status: 400 }
    );
  }

  const updated = await updateEnquiryStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, enquiry: updated });
}
