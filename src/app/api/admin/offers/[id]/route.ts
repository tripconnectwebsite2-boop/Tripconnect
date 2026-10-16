import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { updateOffer, deleteOffer } from "@/lib/db";
import { syncOfferToSanity } from "@/lib/sanity-sync";

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

  if (body.valid_from && body.valid_until && body.valid_until < body.valid_from) {
    return NextResponse.json(
      { error: "Valid-until date must be greater than or equal to valid-from date." },
      { status: 400 }
    );
  }

  const updated = await updateOffer(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  // Sync updated offer to Sanity Cloud
  syncOfferToSanity(updated).catch((err) =>
    console.warn("[Sanity Sync] Offer update sync:", err?.message || err)
  );

  revalidatePath("/");
  revalidatePath("/offers");
  return NextResponse.json({ success: true, offer: updated });
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
  const deleted = await deleteOffer(id);
  if (!deleted) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/offers");
  return NextResponse.json({ success: true, message: "Offer removed." });
}
