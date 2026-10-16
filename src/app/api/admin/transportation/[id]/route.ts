import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import {
  getTransportationVehicleById,
  updateTransportationVehicle,
  deleteTransportationVehicle,
} from "@/lib/db";
import { syncVehicleToSanity, deleteVehicleFromSanity } from "@/lib/sanity-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await params;
  const vehicle = await getTransportationVehicleById(id);
  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  return NextResponse.json({ vehicle });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateTransportationVehicle(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Sync updated vehicle to Sanity Cloud
    syncVehicleToSanity(updated).catch((err) =>
      console.warn("[Sanity Sync] Vehicle update sync:", err?.message || err)
    );

    revalidatePath("/", "layout");
    revalidatePath("/transportation");
    return NextResponse.json({ success: true, vehicle: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update vehicle." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteTransportationVehicle(id);
    if (!deleted) {
      return NextResponse.json({ error: "Vehicle not found or could not be deleted." }, { status: 404 });
    }

    // Delete vehicle from Sanity Cloud
    deleteVehicleFromSanity(id).catch((err) =>
      console.warn("[Sanity Sync] Vehicle delete sync:", err?.message || err)
    );

    revalidatePath("/", "layout");
    revalidatePath("/transportation");
    return NextResponse.json({ success: true, message: "Vehicle deleted successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete vehicle." },
      { status: 500 }
    );
  }
}
