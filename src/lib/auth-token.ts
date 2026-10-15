export const ADMIN_ALLOWLIST = ["tripconnectwebsite2@gmail.com"];
export const SESSION_COOKIE_NAME = "tc_admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "tc_kerala_secure_admin_jwt_salt_secret_key_2026";

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function isEmailAuthorized(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_ALLOWLIST.includes(normalized);
}

export async function signSessionData(data: Record<string, unknown>): Promise<string> {
  const enc = new TextEncoder();
  const jsonStr = JSON.stringify(data);
  const payload = base64UrlEncode(enc.encode(jsonStr));

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const signature = base64UrlEncode(new Uint8Array(sig));
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token?: string | null): Promise<{ email: string; role?: string; exp: number } | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length === 2) {
    const [payload, signature] = parts;
    const enc = new TextEncoder();

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(SESSION_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const sigBytes = base64UrlDecode(signature);
      const isValid = await crypto.subtle.verify(
        "HMAC",
        key,
        sigBytes as unknown as BufferSource,
        enc.encode(payload)
      );

      if (isValid) {
        const decodedJson = new TextDecoder().decode(base64UrlDecode(payload));
        const decoded = JSON.parse(decodedJson);
        if (decoded.email && decoded.exp && decoded.exp > Date.now()) {
          return decoded;
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  // Fallback for non-production development sessions
  if (process.env.NODE_ENV !== "production" && !token.includes(".")) {
    try {
      const decodedJson = atob(token);
      const decoded = JSON.parse(decodedJson);
      if (decoded.email && decoded.exp && decoded.exp > Date.now()) {
        return decoded;
      }
    } catch {
      return null;
    }
  }

  return null;
}
