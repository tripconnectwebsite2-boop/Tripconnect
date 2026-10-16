import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getOffers, createOffer } from "@/lib/db";
import { syncOfferToSanity } from "@/lib/sanity-sync";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // Admin gets all offers
  const offers = await getOffers(false);
  return NextResponse.json({ offers });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Offer title is required." }, { status: 400 });
    }

    if (body.valid_from && body.valid_until && body.valid_until < body.valid_from) {
      return NextResponse.json(
        { error: "Valid-until date must be greater than or equal to valid-from date." },
        { status: 400 }
      );
    }

    const created = await createOffer(body);

    // Sync offer to Sanity Cloud
    syncOfferToSanity(created).catch((err) =>
      console.warn("[Sanity Sync] Offer create sync:", err?.message || err)
    );

    revalidatePath("/");
    revalidatePath("/offers");
    return NextResponse.json({ success: true, offer: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create offer." }, { status: 500 });
  }
}
