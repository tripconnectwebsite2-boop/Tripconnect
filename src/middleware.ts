import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, isEmailAuthorized, verifySessionToken } from "./lib/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Guard API Admin routes
  if (pathname.startsWith("/api/admin")) {
    // Whitelist login and logout endpoints
    if (pathname.startsWith("/api/admin/auth/")) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(sessionCookie);

    if (!session || !isEmailAuthorized(session.email)) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required." },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 2. Guard Admin Page routes
  if (pathname.startsWith("/admin")) {
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/unauthorized"
    ) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(sessionCookie);

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isEmailAuthorized(session.email)) {
      const unauthUrl = new URL("/admin/unauthorized", request.url);
      return NextResponse.redirect(unauthUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
