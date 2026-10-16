import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getCustomPages, createCustomPage } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const pages = await getCustomPages();
  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Page title is required." }, { status: 400 });
    }

    const created = await createCustomPage({
      title: body.title.trim(),
      slug: (body.slug || body.title).trim(),
      hero_title: body.hero_title?.trim() || body.title.trim(),
      hero_subtitle: body.hero_subtitle?.trim() || "",
      hero_image: body.hero_image || "",
      content: body.content || "",
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : [],
      show_in_header: Boolean(body.show_in_header),
      show_in_footer: Boolean(body.show_in_footer),
      cta_title: body.cta_title?.trim() || "Inquire via WhatsApp",
      cta_whatsapp: body.cta_whatsapp !== false,
      status: body.status === "draft" ? "draft" : "published",
      seo_title: body.seo_title?.trim() || `${body.title.trim()} | Trip Connect`,
      seo_description: body.seo_description?.trim() || body.hero_subtitle?.trim() || "",
    });

    revalidatePath("/", "layout");
    revalidatePath(`/p/${created.slug}`);
    return NextResponse.json({ success: true, page: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create page." }, { status: 500 });
  }
}
