import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { getTransportationVehicles, createTransportationVehicle } from "@/lib/db";
import { VehicleCategory } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as VehicleCategory | null;

    const vehicles = await getTransportationVehicles({
      category: category || undefined,
      activeOnly: false,
    });

    return NextResponse.json({ vehicles });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Vehicle name is required." }, { status: 400 });
    }

    if (!body.category || !["normal", "premium", "bus"].includes(body.category)) {
      return NextResponse.json(
        { error: "Vehicle category must be 'normal', 'premium', or 'bus'." },
        { status: 400 }
      );
    }

    const newVehicle = await createTransportationVehicle(body);

    revalidatePath("/", "layout");
    revalidatePath("/transportation");
    return NextResponse.json({ success: true, vehicle: newVehicle }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create vehicle." },
      { status: 500 }
    );
  }
}
