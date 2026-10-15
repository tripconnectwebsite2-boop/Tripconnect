import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ALLOWLIST = ["dmtripconnectin@gmail.com"];
const SESSION_COOKIE_NAME = "tc_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow login page, auth API endpoints, and unauthorized page
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/unauthorized" ||
      pathname.startsWith("/api/admin/auth")
    ) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const parsed = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
      const isExpired = !parsed.exp || parsed.exp < Date.now();
      const isAllowed = parsed.email && ADMIN_ALLOWLIST.includes(parsed.email.toLowerCase().trim());

      if (isExpired) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "session_expired");
        return NextResponse.redirect(loginUrl);
      }

      if (!isAllowed) {
        const unauthUrl = new URL("/admin/unauthorized", request.url);
        return NextResponse.redirect(unauthUrl);
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
