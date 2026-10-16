import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}

export async function GET() {
  await clearAdminSession();
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}
