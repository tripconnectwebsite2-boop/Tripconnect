import { NextResponse } from "next/server";
import { getTransportationVehicles } from "@/lib/db";
import { VehicleCategory } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as VehicleCategory | null;

    const vehicles = await getTransportationVehicles({
      category: category || undefined,
      activeOnly: true,
    });

    return NextResponse.json({ vehicles });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch transportation vehicles." },
      { status: 500 }
    );
  }
}
