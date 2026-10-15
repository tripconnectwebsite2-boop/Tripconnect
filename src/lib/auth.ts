import { cookies } from "next/headers";
import { createServerSupabaseClient } from "./supabase/server";

export const ADMIN_ALLOWLIST = ["tripconnectwebsite2@gmail.com"];
export const SESSION_COOKIE_NAME = "tc_admin_session";

export function isEmailAuthorized(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_ALLOWLIST.includes(normalized);
}

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

  // 2. Check local secure session cookie
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));
      if (parsed.email && parsed.exp && parsed.exp > Date.now()) {
        const authorized = isEmailAuthorized(parsed.email);
        return {
          authenticated: true,
          authorized,
          email: parsed.email,
        };
      }
    } catch {
      // Invalid cookie
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
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  const encoded = Buffer.from(JSON.stringify(sessionData)).toString("base64");
  cookieStore.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
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
