import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";
import { verifyPasscode } from "@/lib/auth-token";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const passcode = body?.passcode;

    const isValid = verifyPasscode(passcode);

    if (!isValid) {
      // Immediately disconnect and clear admin session as requested by user
      await clearAdminSession();
      return NextResponse.json(
        {
          success: false,
          error: "Invalid master security key. Admin session has been terminated.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Security clearance granted. Welcome to Admin Portal.",
    });
  } catch (err: any) {
    await clearAdminSession();
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Authentication security check failed.",
      },
      { status: 500 }
    );
  }
}
