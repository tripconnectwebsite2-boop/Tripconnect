import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { syncGoogleReviews } from "@/lib/google-reviews";
import { updateSiteSettings, getSiteSettings } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({
    review_count: settings.google_review_count ?? 122,
    rating: settings.google_rating ?? 5.0,
    url: settings.google_reviews_url,
    last_synced: settings.google_reviews_last_synced,
    auto_sync: settings.google_reviews_auto_sync ?? true,
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { customUrl, manualCount, manualRating } = body;

    if (manualCount !== undefined) {
      // Admin directly updated the count
      const count = parseInt(manualCount, 10);
      const rating = manualRating !== undefined ? parseFloat(manualRating) : 5.0;

      if (isNaN(count) || count < 0) {
        return NextResponse.json({ error: "Invalid review count" }, { status: 400 });
      }

      const updated = await updateSiteSettings({
        google_review_count: count,
        google_rating: isNaN(rating) ? 5.0 : rating,
        google_reviews_url: customUrl || undefined,
        google_reviews_last_synced: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: `Review count updated to ${count} (${(updated.google_rating ?? 5.0).toFixed(1)} ★). Changes are immediately live!`,
        review_count: updated.google_review_count,
        rating: updated.google_rating,
        last_synced: updated.google_reviews_last_synced,
        url: updated.google_reviews_url,
      });
    }

    // Trigger auto-sync
    const result = await syncGoogleReviews(customUrl);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to sync Google reviews" },
      { status: 500 }
    );
  }
}
