import { cookies } from "next/headers";
import { createServerSupabaseClient } from "./supabase/server";
import {
  ADMIN_ALLOWLIST,
  SESSION_COOKIE_NAME,
  isEmailAuthorized,
  signSessionData,
  verifySessionToken,
} from "./auth-token";

export { ADMIN_ALLOWLIST, SESSION_COOKIE_NAME, isEmailAuthorized, signSessionData, verifySessionToken };

export async function getAdminSession(): Promise<{
  authenticated: boolean;
  authorized: boolean;
  email: string | null;
}> {
  const cookieStore = await cookies();

  // 1. Check if Supabase Auth is active
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        const authorized = isEmailAuthorized(user.email);
        return {
          authenticated: true,
          authorized,
          email: user.email,
        };
      }
    }
  } catch {
    // Continue to fallback session
  }

  // 2. Check local HMAC-signed session cookie
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    const session = await verifySessionToken(sessionCookie);
    if (session && session.email) {
      const authorized = isEmailAuthorized(session.email);
      return {
        authenticated: true,
        authorized,
        email: session.email,
      };
    }
  }

  return {
    authenticated: false,
    authorized: false,
    email: null,
  };
}

export async function createLocalAdminSession(email: string): Promise<boolean> {
  if (!isEmailAuthorized(email)) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionData = {
    email: email.trim().toLowerCase(),
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 * 2, // 2 hour max session limit
    iat: Date.now(),
  };

  const signedToken = await signSessionData(sessionData);
  cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return true;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // Silent
  }
}
