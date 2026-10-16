import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getSiteContent, updateSiteContent } from "@/lib/db";
import { syncContentToSanity } from "@/lib/sanity-sync";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await updateSiteContent(body);
    
    // Sync to Sanity CMS Cloud in background
    syncContentToSanity(updated).catch((err) =>
      console.warn("[Sanity Sync] Content background sync:", err?.message || err)
    );

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update content" }, { status: 500 });
  }
}
