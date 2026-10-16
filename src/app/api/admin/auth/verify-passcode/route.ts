import { NextResponse } from "next/server";
import { clearAdminSession, createLocalAdminSession } from "@/lib/auth";
import { verifyPasscode, isEmailAuthorized } from "@/lib/auth-token";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const passcode = body?.passcode;
    const email = (body?.email || "tripconnectwebsite2@gmail.com").trim().toLowerCase();

    if (!isEmailAuthorized(email)) {
      await clearAdminSession();
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized email account. Access is restricted exclusively to authorized administrators.",
        },
        { status: 403 }
      );
    }

    const isValid = verifyPasscode(passcode);

    if (!isValid) {
      await clearAdminSession();
      return NextResponse.json(
        {
          success: false,
          error: "Invalid master security passcode. Access denied.",
        },
        { status: 401 }
      );
    }

    await createLocalAdminSession(email);

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
