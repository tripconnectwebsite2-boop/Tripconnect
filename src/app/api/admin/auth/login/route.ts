import { NextResponse } from "next/server";
import { createLocalAdminSession, isEmailAuthorized } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !isEmailAuthorized(email)) {
      return NextResponse.json(
        {
          error: "Unauthorized account. Access is restricted exclusively to authorized administrators.",
        },
        { status: 403 }
      );
    }

    const success = await createLocalAdminSession(email);
    if (!success) {
      return NextResponse.json({ error: "Failed to establish administrator session." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Administrator session established.",
      user: { email: email.trim().toLowerCase(), role: "admin" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
