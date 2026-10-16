import { NextResponse } from "next/server";
import { clearAdminSession, createLocalAdminSession } from "@/lib/auth";
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

    // Establish official admin session for all subsequent API calls
    await createLocalAdminSession("tripconnectwebsite2@gmail.com");

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
