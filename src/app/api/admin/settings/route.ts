import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";
import { syncSettingsToSanity } from "@/lib/sanity-sync";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await updateSiteSettings(body);

    // Sync settings to Sanity Cloud
    syncSettingsToSanity(updated).catch((err) =>
      console.warn("[Sanity Sync] Settings update sync:", err?.message || err)
    );

    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update settings." }, { status: 500 });
  }
}
