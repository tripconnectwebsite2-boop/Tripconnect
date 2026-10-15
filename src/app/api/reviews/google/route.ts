import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/db";

export async function GET() {
  const settings = await getSiteSettings();

  return NextResponse.json({
    rating: settings.google_rating ?? 5.0,
    review_count: settings.google_review_count ?? 122,
    reviews_url:
      settings.google_reviews_url ||
      "https://www.google.com/search?sca_esv=3c37b919d1c0a20a&sxsrf=APpeQnsQBeFlGryg8C-3YNc9gCiwY-ybZg:1792077470654&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_ycx-DTCj1xuY2o22e4ADWu-gAQ93o0pN1Babfm2IQHvGzW4cDIuWmeHU5d7op1kp2QGhaaGzVrZjVwLOIv2v1EKhNkoXu8QNEF34ufqcaxAjPyE0A%3D%3D&q=Trip+Connect+Kochi+Reviews&sa=X&ved=2ahUKEwiN-bDoqLyXAxXbcGwGHe70K8wQ0bkNegQINhAH&biw=1920&bih=945&dpr=1",
    last_synced: settings.google_reviews_last_synced || new Date().toISOString(),
  });
}
