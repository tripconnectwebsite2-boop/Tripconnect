import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getReviews, createReview } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // Admin gets all reviews (approved, draft, hidden)
  const reviews = await getReviews(false);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.customer_display_name || !body.review_text) {
      return NextResponse.json(
        { error: "Customer name and review text are required." },
        { status: 400 }
      );
    }

    const created = await createReview(body);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, review: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create review." }, { status: 500 });
  }
}
